"use client";

import type { OnboardState, OnboardAction, BusinessType } from "@/lib/types";
import {
  Field,
  FieldGrid,
  Input,
  OptionCard,
  OptionGrid,
  StepLayout,
  Textarea,
} from "./_primitives";

const businessTypes: { id: BusinessType; example: string }[] = [
  { id: "Tradie", example: "Plumber, electrician, builder" },
  { id: "Cafe/Restaurant", example: "Cafe, bakery, bar" },
  { id: "Salon/Beauty", example: "Hair, nails, skin" },
  { id: "Fitness/Wellness", example: "Gym, yoga, physio" },
  { id: "Retail", example: "Boutique, florist, gifts" },
  { id: "Professional Services", example: "Accounting, legal, consulting" },
  { id: "Other", example: "Tell us in your own words" },
];

const nichePlaceholders: Record<string, string> = {
  Tradie: "e.g. Electrician, Plumber, Landscaper",
  "Cafe/Restaurant": "e.g. Brunch cafe, Thai restaurant",
  "Salon/Beauty": "e.g. Hair salon, Nail bar, Skin clinic",
  "Fitness/Wellness": "e.g. Pilates studio, Personal training",
  Retail: "e.g. Boutique clothing, Gift shop",
  "Professional Services": "e.g. Accountant, Lawyer, Consultant",
  Other: "Describe your business type",
};

interface Props {
  state: OnboardState;
  dispatch: React.Dispatch<OnboardAction>;
  errors: Record<string, string>;
}

export default function StepBusinessBasics({ state, dispatch, errors }: Props) {
  const update = (field: keyof OnboardState, value: unknown) =>
    dispatch({ type: "UPDATE_FIELD", field, value });

  return (
    <StepLayout
      eyebrow="01 — The basics"
      title="Tell us about your business"
      lead="The essentials. We'll use these everywhere — your site, your Google listing, your invoices."
    >
      <Field label="Business name" error={errors.businessName}>
        <Input
          value={state.businessName}
          onChange={(e) => update("businessName", e.target.value)}
        />
      </Field>

      <FieldGrid>
        <Field label="Your name" error={errors.ownerName}>
          <Input
            value={state.ownerName}
            onChange={(e) => update("ownerName", e.target.value)}
          />
        </Field>
        <Field label="Phone" error={errors.phone}>
          <Input
            type="tel"
            value={state.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="0413 902 184"
          />
        </Field>
      </FieldGrid>

      <Field label="What kind of business is it?">
        <OptionGrid cols={2}>
          {businessTypes.map((t) => (
            <OptionCard
              key={t.id}
              selected={state.businessType === t.id}
              onClick={() => update("businessType", t.id)}
              title={t.id}
              desc={t.example}
            />
          ))}
        </OptionGrid>
        {state.businessType === "Other" && (
          <Input
            className="mt-3"
            placeholder="Specify your business type"
            value={state.customBusinessType}
            onChange={(e) => update("customBusinessType", e.target.value)}
          />
        )}
      </Field>

      <Field label="Specific niche" optional>
        <Input
          placeholder={
            nichePlaceholders[state.businessType || "Other"] ||
            "Describe your niche"
          }
          value={state.niche}
          onChange={(e) => update("niche", e.target.value)}
        />
      </Field>

      <FieldGrid>
        <Field label="Suburb">
          <Input
            value={state.suburb}
            onChange={(e) => update("suburb", e.target.value)}
          />
        </Field>
        <Field label="Email">
          <Input
            type="email"
            value={state.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </Field>
      </FieldGrid>

      <details className="rounded-[14px] border border-border bg-warm overflow-hidden group">
        <summary className="cursor-pointer list-none px-4 py-3 text-[13px] font-semibold text-dark hover:bg-surface transition-colors flex items-center justify-between">
          <span>A few more details (optional)</span>
          <span className="text-text-muted text-[11px] font-mono group-open:hidden">add</span>
        </summary>
        <div className="px-4 pb-4 pt-1 flex flex-col gap-5">
          <Field label="Street address" optional>
            <Input
              value={state.streetAddress}
              onChange={(e) => update("streetAddress", e.target.value)}
            />
          </Field>
          <Field label="Opening hours" optional>
            <Textarea
              rows={2}
              placeholder="e.g. Mon–Fri 8am–5pm, Sat 9am–1pm"
              value={state.openingHours}
              onChange={(e) => update("openingHours", e.target.value)}
            />
          </Field>
          <Field label="ABN" optional helper="Only needed at billing — skip for now if you like.">
            <Input
              placeholder="11 222 333 444"
              value={state.abn}
              onChange={(e) => update("abn", e.target.value)}
            />
          </Field>
        </div>
      </details>
    </StepLayout>
  );
}
