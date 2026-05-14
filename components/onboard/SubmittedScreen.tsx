"use client";

import { Check } from "lucide-react";

interface Props {
  ownerName?: string;
  briefId?: string;
  submittedAt?: string;
}

const TIMELINE: { what: string; done?: boolean; current?: boolean }[] = [
  { what: "We've received your brief", done: true },
  { what: "Dorza will contact you within 72 hours", current: true },
  { what: "We build the first draft of your site" },
  { what: "You review and request any changes" },
  { what: "Site goes live + Google profile published" },
];

export default function SubmittedScreen({
  ownerName = "there",
  briefId = "DZ-1042",
  submittedAt = new Date().toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }),
}: Props) {
  return (
    <div className="min-h-screen bg-dark text-white flex flex-col">
      {/* Top bar */}
      <header className="border-b border-white/10 h-14 md:h-16 px-5 md:px-7 flex items-center justify-between flex-shrink-0">
        <a
          href="/"
          className="font-display text-[20px] md:text-[22px] tracking-[-0.02em] text-white"
        >
          d<span className="text-primary-light">o</span>rza
        </a>
        <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.14em] text-white/50">
          Brief #{briefId} · Submitted {submittedAt.toUpperCase()}
        </span>
      </header>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-[1.1fr_1fr] min-h-0">
        {/* Left */}
        <div className="px-6 py-12 md:px-20 md:py-20 flex flex-col justify-center">
          <span className="w-16 h-16 rounded-full bg-primary inline-flex items-center justify-center">
            <Check size={28} className="text-white" />
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary-light font-medium mt-6">
            Brief received
          </span>
          <h1 className="font-display text-[44px] md:text-[68px] leading-[1] tracking-[-0.03em] text-white mt-3 mb-5">
            Thanks{ownerName !== "there" ? `, ${ownerName.split(" ")[0]}` : ""}.
            <br />
            We&apos;re on it from here.
          </h1>
          <p className="text-[16px] md:text-[18px] text-white/70 leading-[1.55] max-w-[520px]">
            <strong className="text-white font-semibold">
              Dorza will contact you within 72 hours.
            </strong>{" "}
            You&apos;ll get a confirmation email in the next few minutes — keep
            an eye on your inbox.
          </p>
          <div className="flex flex-wrap gap-3 mt-9">
            <button
              type="button"
              className="inline-flex items-center justify-center h-12 px-6 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-full transition-colors shadow-[0_6px_18px_rgba(184,103,63,0.25)]"
            >
              View your brief
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center h-12 px-6 bg-transparent border border-white/20 hover:border-white/40 text-white text-sm font-semibold rounded-full transition-colors"
            >
              Back to homepage
            </button>
          </div>
        </div>

        {/* Right — timeline */}
        <div className="border-t md:border-t-0 md:border-l border-white/10 px-6 py-10 md:px-14 md:py-14">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/50 font-medium">
            What happens next
          </span>
          <ol className="flex flex-col mt-5">
            {TIMELINE.map((row, i) => (
              <li
                key={i}
                className="flex gap-4 pb-5 last:pb-0"
              >
                <div className="flex flex-col items-center flex-shrink-0">
                  <span
                    className={`w-[22px] h-[22px] rounded-full inline-flex items-center justify-center text-white ${
                      row.done
                        ? "bg-primary"
                        : row.current
                          ? "border-2 border-primary-light"
                          : "border-[1.5px] border-white/20"
                    }`}
                  >
                    {row.done && <Check size={11} />}
                  </span>
                  {i < TIMELINE.length - 1 && (
                    <span className="flex-1 w-px bg-white/10 mt-1.5 min-h-[44px]" />
                  )}
                </div>
                <div className="pt-0.5">
                  <div className="font-display text-[20px] md:text-[22px] text-white tracking-[-0.015em]">
                    {row.what}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
