"use client";

import type { OnboardState, OnboardAction } from "@/lib/types";
import { Chip, Field, StepLayout, Textarea } from "./_primitives";

interface Props {
  state: OnboardState;
  dispatch: React.Dispatch<OnboardAction>;
}

const logoOptions = ["Received", "Client will send", "No logo"] as const;
const photoOptions = [
  "Received",
  "Client will send",
  "Use stock",
  "Pull from Instagram",
] as const;
const menuOptions = ["Received", "Client will send", "N/A"] as const;
const testimonialOptions = [
  "Have specific ones",
  "Pull from Google",
  "None yet",
] as const;

function ChipChoice<T extends string>({
  value,
  options,
  onChange,
}: {
  value: string;
  options: readonly T[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <Chip
          key={opt}
          selected={value === opt}
          onClick={() => onChange(opt)}
          size="sm"
        >
          {opt}
        </Chip>
      ))}
    </div>
  );
}

export default function StepPhotosAssets({ state, dispatch }: Props) {
  const update = (field: keyof OnboardState, value: unknown) =>
    dispatch({ type: "UPDATE_FIELD", field, value });

  return (
    <StepLayout
      eyebrow="06 — What you've got"
      title="Logo, photos, the lot"
      lead="Tell us what's ready, what's coming, and what we should source ourselves."
    >
      <Field label="Logo file">
        <ChipChoice
          value={state.logoStatus}
          options={logoOptions}
          onChange={(v) => update("logoStatus", v)}
        />
      </Field>

      <Field label="Business photos (space, team, work)">
        <ChipChoice
          value={state.photosStatus}
          options={photoOptions}
          onChange={(v) => update("photosStatus", v)}
        />
      </Field>

      <Field label="Menu / service list document">
        <ChipChoice
          value={state.menuDocStatus}
          options={menuOptions}
          onChange={(v) => update("menuDocStatus", v)}
        />
      </Field>

      <Field label="Testimonials to feature">
        <ChipChoice
          value={state.testimonialsStatus}
          options={testimonialOptions}
          onChange={(v) => update("testimonialsStatus", v)}
        />
      </Field>

      {state.testimonialsStatus === "Have specific ones" && (
        <Field label="Paste the testimonials you'd like to feature">
          <Textarea
            rows={4}
            value={state.specificTestimonials}
            onChange={(e) => update("specificTestimonials", e.target.value)}
          />
        </Field>
      )}

      <Field label="Upload area" helper="JPG, PNG, PDF, SVG · up to 25MB each">
        <div className="rounded-[14px] border-[1.5px] border-dashed border-border-strong bg-warm px-5 py-7 text-center">
          <div className="font-display text-[22px] text-dark">
            Drop files here
          </div>
          <div className="text-[13px] text-text-muted mt-1">
            Or pick from your device
          </div>
          <button
            type="button"
            className="mt-3 h-10 px-5 bg-white border border-border hover:border-border-strong text-dark text-[13px] font-semibold rounded-full transition-colors"
          >
            Choose files
          </button>
        </div>
      </Field>

      <Field label="Photo notes" optional>
        <Textarea
          rows={3}
          placeholder="Anything we should know"
          value={state.photoNotes}
          onChange={(e) => update("photoNotes", e.target.value)}
        />
      </Field>
    </StepLayout>
  );
}
