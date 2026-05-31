"use client";

import { Check, ChevronRight, Clock } from "lucide-react";
import { Eyebrow } from "./_primitives";

interface Props {
  onStart: () => void;
  onResume?: () => void;
  hasInProgress?: boolean;
}

const WHAT_YOU_NEED = [
  "A few sentences about your business",
  "Your logo (or we'll design one)",
  "5–10 photos of your space or work",
  "An email for billing & confirmations",
];

export default function WelcomeScreen({
  onStart,
  onResume,
  hasInProgress = false,
}: Props) {
  return (
    <div className="min-h-screen bg-warm flex flex-col">
      {/* Header */}
      <header className="bg-warm border-b border-border h-14 md:h-16 px-5 md:px-7 flex items-center justify-between flex-shrink-0">
        <a
          href="/"
          className="font-display text-[20px] md:text-[22px] tracking-[-0.02em] text-dark"
        >
          d<span className="text-primary">o</span>rza
        </a>
        <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.14em] text-text-muted">
          Customer onboarding
        </span>
      </header>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-[1.1fr_1fr] min-h-0">
        {/* Left — copy */}
        <div className="px-6 py-12 md:px-20 md:py-16 flex flex-col justify-between">
          <div>
            <Eyebrow>Welcome to Dorza</Eyebrow>
            <h1 className="font-display text-[44px] md:text-[72px] leading-[0.98] tracking-[-0.03em] text-dark mt-4 mb-5">
              Let&apos;s get
              <br />
              your business
              <br />
              <em className="text-primary-dark not-italic font-display">online</em>.
            </h1>
            <p className="text-[16px] md:text-[19px] text-text-secondary leading-[1.55] max-w-[480px]">
              Eight short steps. We use your answers to build your site, set up
              your Google profile, and plan your first month of content.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-9">
              <button
                type="button"
                onClick={onStart}
                className="inline-flex items-center justify-center gap-2 h-14 px-7 bg-primary hover:bg-primary-dark text-white font-semibold text-sm rounded-full transition-all duration-200 ease-dorza shadow-[0_6px_18px_rgba(184,103,63,0.25)] hover:-translate-y-px"
              >
                Start onboarding <ChevronRight size={18} />
              </button>
              {hasInProgress && onResume && (
                <button
                  type="button"
                  onClick={onResume}
                  className="inline-flex items-center justify-center h-14 px-6 bg-white border border-border hover:border-border-strong text-dark font-semibold text-sm rounded-full transition-colors"
                >
                  Pick up where I left off
                </button>
              )}
            </div>
          </div>

          <div className="hidden md:flex gap-8 mt-12">
            {[
              { label: "Steps", value: "8" },
              { label: "Save & resume", value: "Anytime" },
              { label: "Founding offer", value: "50% off setup" },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-text-muted">
                  {s.label}
                </div>
                <div className="font-display text-[22px] text-dark mt-1">
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — visual cards */}
        <div className="bg-primary-tint border-t md:border-t-0 md:border-l border-border px-6 py-10 md:px-12 md:py-12 flex flex-col gap-4 justify-center">
          {/* Contact promise */}
          <div className="bg-white border border-border rounded-[20px] p-4 md:p-5 flex items-center gap-3.5">
            <span className="w-10 h-10 rounded-full bg-accent text-white inline-flex items-center justify-center flex-shrink-0">
              <Clock size={18} />
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-dark">
                We&apos;ll be in touch
              </div>
              <div className="text-[12px] text-text-muted leading-snug">
                Dorza will contact you within 72 hours of submitting your brief.
              </div>
            </div>
          </div>

          {/* What you'll need */}
          <div className="bg-white border border-border rounded-[20px] p-4 md:p-5">
            <Eyebrow>What you&apos;ll need</Eyebrow>
            <ul className="flex flex-col gap-2.5 mt-3">
              {WHAT_YOU_NEED.map((t) => (
                <li
                  key={t}
                  className="flex items-center gap-2.5 text-[14px] text-text-secondary"
                >
                  <span className="w-[18px] h-[18px] rounded-full bg-accent-tint text-accent-dark inline-flex items-center justify-center flex-shrink-0">
                    <Check size={11} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Founding client */}
          <div className="bg-dark text-white rounded-[20px] p-4 md:p-5">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-primary-light font-medium">
              Founding client offer
            </span>
            <div className="font-display text-[24px] md:text-[28px] leading-[1.1] mt-1.5">
              50% off your build.
            </div>
            <div className="text-[13px] text-white/65 mt-2">
              For the first 20 Western Sydney businesses — applied to your quote.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
