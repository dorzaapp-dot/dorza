"use client";

import { useState } from "react";
import { Copy, Download } from "lucide-react";
import type { OnboardState, OnboardAction } from "@/lib/types";
import { generateMarkdown } from "@/lib/generateMarkdown";
import { Field, Input, StepLayout, Textarea } from "./_primitives";

interface Props {
  state: OnboardState;
  dispatch: React.Dispatch<OnboardAction>;
}

export default function StepReview({ state, dispatch }: Props) {
  const [copied, setCopied] = useState(false);
  const markdown = generateMarkdown(state);

  const update = (field: keyof OnboardState, value: unknown) =>
    dispatch({ type: "UPDATE_FIELD", field, value });

  function copyToClipboard() {
    navigator.clipboard.writeText(markdown).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function downloadMarkdown() {
    const safeName = (state.businessName || "Client").replace(
      /[^a-zA-Z0-9]/g,
      "_",
    );
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Dorza_${safeName}_Intake.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const summary: [string, string][] = [
    ["Business", state.businessName || "—"],
    [
      "Type",
      [state.businessType, state.niche].filter(Boolean).join(" · ") || "—",
    ],
    ["Suburb", state.suburb || "—"],
    ["Tone", state.tone || "—"],
    ["Mood", state.brandKeywords || "—"],
    [
      "Cadence",
      state.postingFrequency
        ? state.postingFrequency.replace("standard", "").replace("pro", "").trim()
        : "—",
    ],
    [
      "Package",
      state.selectedPackage
        ? `${state.selectedPackage} · $${state.agreedMonthlyFee}/mo + $${state.agreedSetupFee} setup`
        : "—",
    ],
  ];

  return (
    <StepLayout
      eyebrow="10 — Last look"
      title="Anything else we should know?"
      lead="Personality, specific requests, follow-ups — all welcome. Then we're off."
    >
      <Field label="Notes for the team">
        <Textarea
          rows={4}
          value={state.notes}
          onChange={(e) => update("notes", e.target.value)}
          placeholder="Anything that didn't fit above"
        />
      </Field>

      <Field label="Completed by" optional>
        <Input
          value={state.completedBy}
          onChange={(e) => update("completedBy", e.target.value)}
          placeholder={state.ownerName || "Your name"}
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

      <details className="rounded-[14px] border border-border bg-surface overflow-hidden">
        <summary className="cursor-pointer list-none px-4 py-3 text-[13px] font-semibold text-dark hover:bg-warm transition-colors flex items-center justify-between">
          <span>View full brief (markdown)</span>
          <span className="text-text-muted text-[11px] font-mono">expand</span>
        </summary>
        <div className="px-4 pb-4 max-h-96 overflow-auto">
          <pre className="text-[12px] text-dark font-mono whitespace-pre-wrap leading-relaxed">
            {markdown}
          </pre>
        </div>
      </details>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="button"
          onClick={copyToClipboard}
          className="inline-flex items-center justify-center gap-2 h-11 px-5 bg-white border border-border hover:border-border-strong text-dark text-[13px] font-semibold rounded-full transition-colors"
        >
          <Copy size={14} />
          {copied ? "Copied!" : "Copy markdown"}
        </button>
        <button
          type="button"
          onClick={downloadMarkdown}
          className="inline-flex items-center justify-center gap-2 h-11 px-5 bg-white border border-border hover:border-border-strong text-dark text-[13px] font-semibold rounded-full transition-colors"
        >
          <Download size={14} />
          Download .md
        </button>
      </div>

      <label className="flex items-start gap-3 pt-2 text-[13px] text-text-secondary leading-relaxed">
        <input
          type="checkbox"
          checked={!!state.notes}
          readOnly
          className="w-5 h-5 mt-0.5 accent-primary rounded flex-shrink-0"
        />
        <span>
          I agree to the{" "}
          <a
            className="text-primary-dark underline underline-offset-2 hover:text-primary"
            href="#"
          >
            service terms
          </a>{" "}
          and to a 50% setup deposit on confirmation.
        </span>
      </label>
    </StepLayout>
  );
}
