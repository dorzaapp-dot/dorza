"use client";

import { ReactNode } from "react";
import { Check, ChevronLeft, ChevronRight, Save } from "lucide-react";

export interface StepMeta {
  num: string;
  label: string;
  short: string;
  why?: string;
}

interface Props {
  step: number;
  total: number;
  steps: StepMeta[];
  onBack: () => void;
  onNext: () => void;
  onJumpTo: (i: number) => void;
  onExit: () => void;
  savedAt?: string | null;
  submitError?: boolean;
  forwardLabel?: string;
  forwardDisabled?: boolean;
  children: ReactNode;
}

function savedLabel(iso?: string | null): string | null {
  if (!iso) return null;
  const then = new Date(iso).getTime();
  const secs = Math.max(0, Math.floor((Date.now() - then) / 1000));
  if (secs < 5) return "Saved · just now";
  if (secs < 60) return `Saved · ${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `Saved · ${mins}m ago`;
  return "Saved";
}

export default function WizardShell({
  step,
  total,
  steps,
  onBack,
  onNext,
  onJumpTo,
  onExit,
  savedAt = null,
  submitError = false,
  forwardLabel = "Continue",
  forwardDisabled = false,
  children,
}: Props) {
  const pct = ((step + 1) / total) * 100;

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Top bar */}
      <header className="bg-white border-b border-border h-14 md:h-16 px-5 md:px-7 flex items-center justify-between flex-shrink-0">
        <a
          href="/"
          className="font-display text-[20px] md:text-[22px] tracking-[-0.02em] text-dark"
        >
          d<span className="text-primary">o</span>rza
        </a>

        <div className="flex items-center gap-3 md:gap-5">
          {savedLabel(savedAt) && (
            <span className="inline-flex items-center gap-1.5 text-[12px] text-text-muted">
              <Save size={13} /> {savedLabel(savedAt)}
            </span>
          )}
          <button
            type="button"
            onClick={onExit}
            className="text-[13px] text-text-secondary hover:text-dark transition-colors h-9 px-3 rounded-full hover:bg-surface"
          >
            Save &amp; exit
          </button>
        </div>
      </header>

      {/* Mobile-only progress dots */}
      <div className="md:hidden flex justify-center gap-1.5 py-3 bg-white border-b border-border flex-shrink-0">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => i < step && onJumpTo(i)}
            aria-label={`Step ${i + 1}: ${steps[i]?.short ?? ""}`}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === step
                ? "bg-primary w-5"
                : i < step
                  ? "bg-primary/40"
                  : "bg-border-strong"
            }`}
          />
        ))}
      </div>

      <div className="flex-1 flex min-h-0">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex flex-col w-[280px] flex-shrink-0 bg-warm border-r border-border px-7 py-9 overflow-y-auto">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent font-medium">
            Onboarding
          </span>
          <h1 className="font-display text-[28px] leading-[1.05] tracking-[-0.02em] text-dark mt-3">
            {steps[step]?.label ?? "Let's get your business online."}
          </h1>
          {steps[step]?.why && (
            <p className="text-[13px] text-text-secondary leading-relaxed mt-3.5">
              {steps[step].why}
            </p>
          )}

          <ol className="flex flex-col gap-1 mt-7">
            {steps.map((s, i) => {
              const state =
                i < step ? "done" : i === step ? "current" : "todo";
              const interactive = i < step;
              return (
                <li key={s.num}>
                  <button
                    type="button"
                    onClick={() => interactive && onJumpTo(i)}
                    disabled={!interactive}
                    className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-[10px] transition-colors ${
                      state === "current"
                        ? "bg-white border border-border shadow-soft"
                        : "border border-transparent hover:bg-white/60"
                    } ${interactive ? "cursor-pointer" : "cursor-default"}`}
                  >
                    <span
                      className={`w-[22px] h-[22px] rounded-full inline-flex items-center justify-center text-[10px] font-mono font-semibold flex-shrink-0 ${
                        state === "done"
                          ? "bg-accent text-white"
                          : state === "current"
                            ? "bg-primary text-white"
                            : "border border-border-strong text-text-muted"
                      }`}
                    >
                      {state === "done" ? (
                        <Check size={12} />
                      ) : (
                        s.num
                      )}
                    </span>
                    <span
                      className={`text-[14px] ${
                        state === "current"
                          ? "font-semibold text-dark"
                          : state === "todo"
                            ? "text-text-muted"
                            : "text-dark font-medium"
                      }`}
                    >
                      {s.short}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="mt-auto pt-7 text-[12px] text-text-muted leading-relaxed">
            Save anytime — Dorza will contact you within 72 hours of
            submitting.
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          {submitError && (
            <div className="px-5 md:px-20 pt-6">
              <div className="rounded-[12px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700 leading-relaxed">
                Something went wrong sending your brief. Your answers are saved — please try
                &ldquo;Submit my brief&rdquo; again.
              </div>
            </div>
          )}
          <div className="px-5 py-8 md:px-20 md:py-12">{children}</div>
        </main>
      </div>

      {/* Bottom nav */}
      <div className="bg-white border-t border-border h-16 md:h-20 px-5 md:px-7 flex items-center justify-between flex-shrink-0 gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={step === 0}
          className="inline-flex items-center gap-1.5 h-11 px-4 md:px-5 border border-border bg-white text-dark text-[13px] md:text-sm font-semibold rounded-full hover:bg-surface hover:border-border-strong transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} /> Back
        </button>

        <div className="hidden md:flex items-center gap-4 flex-1 justify-center max-w-[400px]">
          <span className="text-[13px] text-text-muted whitespace-nowrap">
            Step {step + 1} of {total}
          </span>
          <div className="w-44 h-1 rounded-full bg-border overflow-hidden">
            <div
              className="h-full bg-primary transition-[width] duration-500 ease-dorza"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onNext}
          disabled={forwardDisabled}
          className="inline-flex items-center gap-1.5 h-11 px-5 md:px-6 bg-primary hover:bg-primary-dark text-white text-[13px] md:text-sm font-semibold rounded-full transition-all duration-200 ease-dorza shadow-[0_4px_14px_rgba(184,103,63,0.25)] hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
        >
          {forwardLabel} <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
