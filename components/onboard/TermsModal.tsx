"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const TERMS: { heading: string; body: string }[] = [
  {
    heading: "1. What we do",
    body: "Dorza designs and builds a website and sets up related online profiles for your business, based on the brief you submit through this form.",
  },
  {
    heading: "2. Your brief",
    body: "We rely on the information you provide being accurate and yours to use, including any logos, photos, and testimonials. You confirm you have the right to share them.",
  },
  {
    heading: "3. Quotes & payment",
    body: "Submitting this brief is not a payment or a binding order. We'll contact you with a quote within 72 hours. Work begins once you accept that quote.",
  },
  {
    heading: "4. Your details",
    body: "We use the details in your brief only to prepare your quote and build your site. We don't sell your data. You can ask us to delete it at any time.",
  },
  {
    heading: "5. Changes",
    body: "These are draft service terms for the onboarding brief. Final terms are confirmed with your quote before any work starts.",
  },
];

export default function TermsModal({ open, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Service terms"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-dark/40" onClick={onClose} />
      <div className="relative bg-white border border-border rounded-card max-w-[560px] w-full max-h-[80vh] overflow-y-auto p-6 md:p-8 shadow-medium">
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-display text-[28px] leading-[1.1] tracking-[-0.02em] text-dark">
            Service terms
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-full inline-flex items-center justify-center text-text-secondary hover:text-dark hover:bg-surface transition-colors flex-shrink-0"
          >
            <X size={18} />
          </button>
        </div>
        <div className="mt-5 flex flex-col gap-4">
          {TERMS.map((t) => (
            <div key={t.heading}>
              <div className="text-[14px] font-semibold text-dark">{t.heading}</div>
              <p className="text-[14px] text-text-secondary leading-relaxed mt-1">{t.body}</p>
            </div>
          ))}
        </div>
        <p className="text-[12px] text-text-muted mt-6">
          Draft terms — final wording confirmed with your quote.
        </p>
      </div>
    </div>
  );
}
