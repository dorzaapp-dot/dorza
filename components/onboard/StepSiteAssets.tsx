"use client";

import type { OnboardState, OnboardAction } from "@/lib/types";
import { Chip, Field, Input, StepLayout, Textarea, Toggle } from "./_primitives";

interface Props {
  state: OnboardState;
  dispatch: React.Dispatch<OnboardAction>;
}

const allSections: { id: string; hint: string }[] = [
  { id: "Hero", hint: "Your headline + photo" },
  { id: "Services/menu", hint: "What you sell" },
  { id: "About us", hint: "Why people choose you" },
  { id: "Photo gallery", hint: "Show your space or work" },
  { id: "Contact form", hint: "Enquiries straight to your inbox" },
  { id: "Google Map", hint: "Help locals find you" },
  { id: "Testimonials", hint: "Pulled from Google or your own" },
  { id: "Online booking", hint: "Connect to your tool" },
  { id: "Social feed embed", hint: "Live Instagram on your site" },
  { id: "FAQ", hint: "Cuts down enquiry questions" },
  { id: "Blog future", hint: "Reserve a spot for posts" },
  { id: "E-commerce", hint: "Online ordering or shop" },
];

const photoOptions = ["Received", "Client will send", "Use stock", "Pull from Instagram"] as const;
const menuOptions = ["Received", "Client will send", "N/A"] as const;
const testimonialOptions = ["Have specific ones", "Pull from Google", "None yet"] as const;

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
        <Chip key={opt} selected={value === opt} onClick={() => onChange(opt)} size="sm">
          {opt}
        </Chip>
      ))}
    </div>
  );
}

export default function StepSiteAssets({ state, dispatch }: Props) {
  const update = (field: keyof OnboardState, value: unknown) =>
    dispatch({ type: "UPDATE_FIELD", field, value });

  return (
    <StepLayout
      eyebrow="06 — Your site & assets"
      title="Sections & what you've got"
      lead="Pre-selected based on your business type. Toggle anything, then tell us which assets are ready."
    >
      <div className="flex flex-col gap-1.5 -mt-1">
        {allSections.map((section) => {
          const on = !!state.websiteSections[section.id];
          return (
            <div
              key={section.id}
              className="border border-border bg-white rounded-[14px] px-4 py-3.5"
            >
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-semibold text-dark">{section.id}</div>
                  <div className="text-[12px] text-text-muted mt-0.5">{section.hint}</div>
                </div>
                <Toggle
                  on={on}
                  onChange={() =>
                    dispatch({ type: "TOGGLE_WEBSITE_SECTION", section: section.id })
                  }
                  label={`Toggle ${section.id}`}
                />
              </div>
              {section.id === "Online booking" && on && (
                <div className="mt-3">
                  <Input
                    placeholder="Booking link URL (e.g. Mindbody, Square, Calendly)"
                    value={state.bookingLink}
                    onChange={(e) => update("bookingLink", e.target.value)}
                  />
                </div>
              )}
              {section.id === "E-commerce" && on && (
                <div className="mt-3">
                  <Input
                    placeholder="E-commerce platform (e.g. Shopify)"
                    value={state.ecommercePlatform}
                    onChange={(e) => update("ecommercePlatform", e.target.value)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Field
        label="Anything else you'd like on the site?"
        helper="A members area, a calculator, a gallery filter — whatever's on your mind."
        optional
      >
        <Textarea
          rows={3}
          value={state.otherSections}
          onChange={(e) => update("otherSections", e.target.value)}
          placeholder="Free-text — list anything not covered above"
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

      <Field label="Photo notes" optional>
        <Textarea
          rows={3}
          placeholder="Anything we should know"
          value={state.photoNotes}
          onChange={(e) => update("photoNotes", e.target.value)}
        />
      </Field>

      <p className="text-[13px] text-text-muted leading-relaxed">
        No need to upload anything here — once your brief is in, we&apos;ll email you a private link
        to drop your logo and photos.
      </p>
    </StepLayout>
  );
}
