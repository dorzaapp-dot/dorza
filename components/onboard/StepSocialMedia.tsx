"use client";

import { Check } from "lucide-react";
import type { OnboardState, OnboardAction } from "@/lib/types";
import { Chip, ChipRow, Field, Input, StepLayout } from "./_primitives";

interface Props {
  state: OnboardState;
  dispatch: React.Dispatch<OnboardAction>;
}

const platforms = ["Instagram", "Facebook", "TikTok", "LinkedIn"] as const;
const frequencies = [
  {
    value: "3x/week standard" as const,
    label: "3× per week",
    desc: "Standard cadence",
  },
  {
    value: "5x/week pro" as const,
    label: "5× per week",
    desc: "Pro cadence — more reach",
  },
];
const contentTypes = [
  "Promos",
  "Tips & education",
  "Behind the scenes",
  "Seasonal",
  "Customer reviews",
  "Local area",
] as const;
const approvalOptions = [
  "Auto-post",
  "WhatsApp approval",
  "Dashboard review",
] as const;

export default function StepSocialMedia({ state, dispatch }: Props) {
  const update = (field: keyof OnboardState, value: unknown) =>
    dispatch({ type: "UPDATE_FIELD", field, value });

  return (
    <StepLayout
      eyebrow="08 — Social rhythm"
      title="How should your social run?"
      lead="We post on your behalf. You choose the cadence and what gets posted."
    >
      <Field label="Platforms to manage">
        <ChipRow
          options={platforms}
          isSelected={(v) => state.socialPlatforms.includes(v)}
          onToggle={(v) =>
            dispatch({ type: "TOGGLE_SOCIAL_PLATFORM", platform: v })
          }
          size="sm"
        />
      </Field>

      <Field label="Posting frequency">
        <div className="flex flex-col gap-2">
          {frequencies.map((f) => {
            const on = state.postingFrequency === f.value;
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => update("postingFrequency", f.value)}
                className={`text-left rounded-[14px] border-[1.5px] px-4 py-3.5 flex justify-between items-center transition-colors duration-200 ease-dorza ${
                  on
                    ? "bg-primary-tint border-primary"
                    : "bg-white border-border hover:border-primary-light"
                }`}
              >
                <div>
                  <div className="text-[14px] font-semibold text-dark">
                    {f.label}
                  </div>
                  <div className="text-[12px] text-text-muted mt-0.5">
                    {f.desc}
                  </div>
                </div>
                {on && (
                  <span className="w-[22px] h-[22px] rounded-full bg-primary text-white inline-flex items-center justify-center flex-shrink-0">
                    <Check size={12} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="What kind of content?">
        <ChipRow
          options={contentTypes}
          isSelected={(v) => state.contentTypes.includes(v)}
          onToggle={(v) =>
            dispatch({ type: "TOGGLE_CONTENT_TYPE", contentType: v })
          }
          size="sm"
        />
      </Field>

      <Field label="Approval process">
        <div className="flex flex-wrap gap-2">
          {approvalOptions.map((a) => (
            <Chip
              key={a}
              selected={state.approvalProcess === a}
              onClick={() => update("approvalProcess", a)}
              size="md"
            >
              {a}
            </Chip>
          ))}
        </div>
      </Field>

      <Field label="Topics to avoid" optional>
        <Input
          placeholder="No politics, no diet talk, etc."
          value={state.avoidTopics}
          onChange={(e) => update("avoidTopics", e.target.value)}
        />
      </Field>
    </StepLayout>
  );
}

