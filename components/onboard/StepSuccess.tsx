"use client";

import type { OnboardState, OnboardAction } from "@/lib/types";
import { Field, StepLayout, Textarea } from "./_primitives";

interface Props {
  state: OnboardState;
  dispatch: React.Dispatch<OnboardAction>;
}

const examples = [
  "20 booking enquiries a month",
  "Top 3 on Google for my suburb",
  "Doubled Instagram followers",
  "Less time spent answering DMs",
  "More walk-ins on weekends",
];

export default function StepSuccess({ state, dispatch }: Props) {
  const update = (field: keyof OnboardState, value: unknown) =>
    dispatch({ type: "UPDATE_FIELD", field, value });

  return (
    <StepLayout
      eyebrow="08 — What success looks like"
      title="What would success look like for you?"
      lead="Tell us in your own words. A specific number, a feeling, a milestone — anything that lets us know we got it right."
    >
      <Field
        label="Your version of success"
        helper="One paragraph is plenty."
      >
        <Textarea
          rows={6}
          value={state.successVision}
          onChange={(e) => update("successVision", e.target.value)}
          placeholder="e.g. By August, I want 20 enquiries a month from the website, my Google profile ranking in the top 3 for my suburb, and to spend less than an hour a week on socials."
        />
      </Field>

      <div className="rounded-[14px] bg-warm border border-border px-4 py-4">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent font-medium">
          Examples
        </span>
        <ul className="mt-2.5 flex flex-col gap-1.5">
          {examples.map((e) => (
            <li
              key={e}
              className="text-[13px] text-text-secondary leading-relaxed"
            >
              — {e}
            </li>
          ))}
        </ul>
      </div>
    </StepLayout>
  );
}
