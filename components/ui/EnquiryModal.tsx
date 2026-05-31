"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { DORZA_EASE } from "@/components/motion/Reveal";
import EnquiryFormFields from "@/components/forms/EnquiryFormFields";
import { useEnquirySubmit } from "@/lib/useEnquirySubmit";
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
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center px-0 sm:px-5 py-0 sm:py-8"
          initial={shouldReduce ? { opacity: 0 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: DORZA_EASE }}
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close enquiry form"
            onClick={handleClose}
            className="absolute inset-0 bg-dark/50 backdrop-blur-sm"
          />

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="enquiry-modal-title"
            className="relative w-full sm:max-w-lg max-h-[92vh] overflow-y-auto bg-white rounded-t-card sm:rounded-card border border-border shadow-medium"
            initial={shouldReduce ? { opacity: 0 } : { y: 24, opacity: 0, scale: 0.98 }}
            animate={shouldReduce ? { opacity: 1 } : { y: 0, opacity: 1, scale: 1 }}
            exit={shouldReduce ? { opacity: 0 } : { y: 16, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: DORZA_EASE }}
          >
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close"
              className="absolute top-4 right-4 h-9 w-9 inline-flex items-center justify-center rounded-full text-text-muted hover:text-dark hover:bg-surface transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary"
            >
              <X size={18} />
            </button>

            <div className="px-6 sm:px-8 pt-8 pb-6 border-b border-border">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-3">
                {"// Get in touch"}
              </p>
              <h2 id="enquiry-modal-title" className="font-display text-[28px] sm:text-[34px] leading-[1.05] tracking-[-0.02em] text-dark">
                Tell us about your business
              </h2>
              <p className="mt-2 text-[14px] text-text-secondary leading-relaxed">
                A real Sydney human will reach out within 72 hours. No spam,
                no lock-in.
              </p>
            </div>

            <div className="px-6 sm:px-8 py-6">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="confirmation"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, ease: DORZA_EASE }}
                    className="text-center py-6"
                  >
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-3">
                      Enquiry received
                    </p>
                    <h3 className="font-body font-semibold text-[22px] tracking-[-0.02em] text-dark mb-2">
                      Thanks &mdash; we&rsquo;ve got it
                    </h3>
                    <p className="text-text-secondary text-[14px] leading-relaxed">
                      We&rsquo;ll be in touch within 72 hours.
                    </p>
                    <button
                      type="button"
                      onClick={handleClose}
                      className="mt-6 inline-flex items-center justify-center h-11 px-6 bg-white border border-border text-dark font-semibold text-sm rounded-full hover:bg-surface hover:border-[#E5DFD6] transition-all duration-300"
                    >
                      Close
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: DORZA_EASE }}
                    onSubmit={handleSubmit}
                    className="space-y-3 relative"
                  >
                    <EnquiryFormFields
                      theme="light"
                      value={form}
                      onChange={setForm}
                      showMessage
                    />
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full h-12 bg-primary hover:bg-primary-dark text-white font-semibold text-sm rounded-full transition-all duration-300 ease-dorza hover:-translate-y-px hover:shadow-medium disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                      >
                        {submitting ? "Sending…" : "Send enquiry →"}
                      </button>
                    </div>
                    {error && (
                      <p role="alert" className="text-center text-[13px] text-primary-dark font-body pt-1">
                        {error}
                      </p>
                    )}
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
