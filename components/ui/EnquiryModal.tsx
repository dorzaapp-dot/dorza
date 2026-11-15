"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { DORZA_EASE } from "@/components/motion/Reveal";
import EnquiryFormFields from "@/components/forms/EnquiryFormFields";
import { buttonClasses } from "@/components/ui/buttonClasses";
import SubmitButton from "@/components/forms/SubmitButton";
import { useEnquirySubmit } from "@/lib/useEnquirySubmit";
import { CTA_LABEL } from "@/lib/site";
import type { EnquiryFormData } from "@/lib/types";

const initialForm: EnquiryFormData = {
  name: "",
  email: "",
  businessType: "",
  suburb: "",
  servicesInterested: [],
  source: "modal",
  website: "",
};

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function EnquiryModal({ open, onClose }: Props) {
  const [form, setForm] = useState<EnquiryFormData>(initialForm);
  const { submitting, submitted, error, submit, reset } = useEnquirySubmit();
  const shouldReduce = useReducedMotion();

  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Reset form state shortly after close so reopening is fresh.
  useEffect(() => {
    if (open) return;
    const id = window.setTimeout(() => {
      setForm(initialForm);
      reset();
    }, 250);
    return () => window.clearTimeout(id);
  }, [open, reset]);

  // Body scroll lock + return focus to the previously focused element.
  useEffect(() => {
    if (!open) return;
    previouslyFocusedRef.current = (document.activeElement as HTMLElement) ?? null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus the first focusable element inside the dialog.
    const id = window.setTimeout(() => {
      const first = dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      first?.focus();
    }, 50);

    return () => {
      window.clearTimeout(id);
      document.body.style.overflow = previousOverflow;
      previouslyFocusedRef.current?.focus?.();
    };
  }, [open]);

  // ESC to close + focus trap.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation();
        handleClose();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, handleClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await submit(form);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="enquiry-modal"
          className="fixed inset-0 z-[60] flex items-end justify-center px-0 py-0 sm:items-center sm:px-5 sm:py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: DORZA_EASE }}
        >
          {/* Scrim */}
          <button
            type="button"
            aria-label="Close enquiry form"
            tabIndex={-1}
            onClick={handleClose}
            className="absolute inset-0 bg-forest/55"
          />

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="enquiry-modal-title"
            className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-card border border-rule-soft bg-paper shadow-modal sm:max-w-lg sm:rounded-card"
            initial={shouldReduce ? { opacity: 0 } : { y: 20, opacity: 0 }}
            animate={shouldReduce ? { opacity: 1 } : { y: 0, opacity: 1 }}
            exit={shouldReduce ? { opacity: 0 } : { y: 12, opacity: 0 }}
            transition={{ duration: 0.28, ease: DORZA_EASE }}
          >
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close"
              className="absolute right-3 top-3 inline-flex h-11 w-11 items-center justify-center text-ink-mute transition-colors duration-fast ease-dorza hover:text-forest"
            >
              <X size={18} strokeWidth={1.75} />
            </button>

            <div className="px-6 pb-6 pt-10 sm:px-10">
              <h2
                id="enquiry-modal-title"
                className="pr-10 font-display text-[30px] font-medium leading-[1.06] tracking-[-0.014em] text-pine"
              >
                Tell us about your business.
              </h2>
              <p className="d-body mt-3">
                You&rsquo;ll hear back with a plan and a price within 72 hours. No spam, no lock-in.
              </p>
            </div>

            <div className="px-6 pb-8 sm:px-10 sm:pb-10">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="confirmation"
                    initial={shouldReduce ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: DORZA_EASE }}
                    role="status"
                    className="border-t border-rule-soft pt-6"
                  >
                    <h3 className="d-heading">Thanks. We&rsquo;ve got your details.</h3>
                    <p className="d-body mt-2">You&rsquo;ll hear from us within 72 hours.</p>
                    <div className="mt-6 flex justify-end">
                      <button type="button" onClick={handleClose} className={buttonClasses("secondary", "default")}>
                        Close
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.16, ease: DORZA_EASE }}
                    onSubmit={handleSubmit}
                    className="relative space-y-3"
                  >
                    <EnquiryFormFields theme="light" value={form} onChange={setForm} showMessage />
                    {error && (
                      <p role="alert" className="pt-1 font-body text-[13px] text-claret">
                        {error}
                      </p>
                    )}
                    <div className="mt-6 flex flex-col-reverse gap-3 border-t border-rule-soft pt-6 sm:flex-row sm:justify-end">
                      <button type="button" onClick={handleClose} className={buttonClasses("ghost", "default")}>
                        Cancel
                      </button>
                      <SubmitButton submitting={submitting} variant="primary" idleLabel={CTA_LABEL} />
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
