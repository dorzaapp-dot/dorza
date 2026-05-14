"use client";

import type { OnboardState, OnboardAction } from "@/lib/types";
import { Field, Input, StepLayout, Textarea, Toggle } from "./_primitives";

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

export default function StepWebsiteSections({ state, dispatch }: Props) {
  const update = (field: keyof OnboardState, value: unknown) =>
    dispatch({ type: "UPDATE_FIELD", field, value });

  return (
    <StepLayout
      eyebrow="07 — Site essentials"
      title="What sections do you need?"
      lead="Pre-selected based on your business type. Add or remove anything."
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
                  <div className="text-[15px] font-semibold text-dark">
                    {section.id}
                  </div>
                  <div className="text-[12px] text-text-muted mt-0.5">
                    {section.hint}
                  </div>
                </div>
                <Toggle
                  on={on}
                  onChange={() =>
                    dispatch({
                      type: "TOGGLE_WEBSITE_SECTION",
                      section: section.id,
                    })
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
                    onChange={(e) =>
                      update("ecommercePlatform", e.target.value)
                    }
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

      <Field
        label="How should the site look and feel?"
        helper="A few sentences. Layout, mood, what you want visitors to feel. Reference sites or apps you love are great."
      >
        <Textarea
          rows={5}
          value={state.siteVisionDescription}
          onChange={(e) => update("siteVisionDescription", e.target.value)}
          placeholder="e.g. Calm and editorial, big photos of the space, lots of whitespace, warm earthy colours, feels handmade not corporate."
        />
      </Field>
    </StepLayout>
  );
}
