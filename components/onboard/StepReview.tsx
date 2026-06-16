"use client";

import { useState } from "react";
import type { OnboardState, OnboardAction } from "@/lib/types";
import { Field, StepLayout, Textarea } from "./_primitives";
import TermsModal from "./TermsModal";

interface Props {
  state: OnboardState;
  dispatch: React.Dispatch<OnboardAction>;
}

export default function StepReview({ state, dispatch }: Props) {
  const [termsOpen, setTermsOpen] = useState(false);

  const update = (field: keyof OnboardState, value: unknown) =>
    dispatch({ type: "UPDATE_FIELD", field, value });

  const picks = state.brandPalette.filter((c) => c.hex.trim() && c.hex !== "#");

  const summary: [string, React.ReactNode][] = [
    ["Business", state.businessName || "—"],
    ["Type", [state.businessType, state.niche].filter(Boolean).join(" · ") || "—"],
    ["Suburb", state.suburb || "—"],
    ["Tone", state.tone || "—"],
    ["Mood", state.colourMood || "—"],
    ...(picks.length
      ? ([
          [
            "Colours",
            <span key="palette" className="flex flex-wrap items-center gap-2.5">
              {picks.map((c) => (
                <span key={c.role} className="inline-flex items-center gap-1.5">
                  <span
                    className="w-4 h-4 rounded-full border border-black/[0.08]"
                    style={{ background: c.hex }}
                  />
                  <span className="font-mono text-[11px] uppercase tracking-[0.04em] text-text-muted">
                    {c.hex}
                  </span>
                </span>
              ))}
            </span>,
          ],
        ] as [string, React.ReactNode][])
      : []),
    [
      "Success",
      state.successVision
        ? state.successVision.length > 80
          ? state.successVision.slice(0, 80).trim() + "…"
          : state.successVision
        : "—",
    ],
  ];

  // Non-blocking nudge: build-critical fields that are still empty.
  const missing: string[] = [];
  if (!state.businessName.trim()) missing.push("business name");
  if (!state.businessType) missing.push("business type");
  if (!state.suburb.trim()) missing.push("suburb");
  if (!state.services.some((s) => s.trim())) missing.push("at least one service");
  if (!state.tone) missing.push("tone");

  return (
    <StepLayout
      eyebrow="08 — Last look"
      title="Anything else we should know?"
      lead="Personality, specific requests, follow-ups — all welcome. Then we're off."
    >
      <Field label="Anything else we should know?">
        <Textarea
          rows={4}
          value={state.notes}
          onChange={(e) => update("notes", e.target.value)}
          placeholder="Anything that didn't fit above"
        />
      </Field>

      <div className="bg-white border border-border rounded-[16px] p-5">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent font-medium">
          Your brief at a glance
        </span>
        <div className="mt-3 flex flex-col">
          {summary.map(([k, v]) => (
            <div
              key={k}
              className="grid grid-cols-[110px_1fr] py-2.5 border-b border-border last:border-b-0 items-center"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-text-muted">
                {k}
              </span>
              <span className="text-[14px] text-dark">{v}</span>
            </div>
          ))}
        </div>
      </div>

      {missing.length > 0 && (
        <div className="rounded-[12px] border border-border bg-warm px-4 py-3 text-[13px] text-text-secondary leading-relaxed">
          These help us build faster (optional): {missing.join(", ")}. You can go back and add them,
          or send as-is and we&apos;ll ask later.
        </div>
      )}

      <label className="flex items-start gap-3 pt-2 text-[13px] text-text-secondary leading-relaxed">
        <input
          type="checkbox"
          checked={state.agreedToTerms}
          onChange={(e) => update("agreedToTerms", e.target.checked)}
          className="w-5 h-5 mt-0.5 accent-primary rounded flex-shrink-0"
        />
        <span>
          I agree to the{" "}
          <button
            type="button"
            onClick={() => setTermsOpen(true)}
            className="text-primary-dark underline underline-offset-2 hover:text-primary"
          >
            service terms
          </button>
          .
        </span>
      </label>

      <TermsModal open={termsOpen} onClose={() => setTermsOpen(false)} />
    </StepLayout>
  );
}
