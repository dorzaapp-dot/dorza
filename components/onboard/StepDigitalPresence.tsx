"use client";

import type { OnboardState, OnboardAction } from "@/lib/types";
import { Chip, Field, Input, StepLayout, Textarea } from "./_primitives";

interface Props {
  state: OnboardState;
  dispatch: React.Dispatch<OnboardAction>;
}

const googleOptions = ["Yes", "No", "Not sure"] as const;

export default function StepDigitalPresence({ state, dispatch }: Props) {
  const update = (field: keyof OnboardState, value: unknown) =>
    dispatch({ type: "UPDATE_FIELD", field, value });

  return (
    <StepLayout
      eyebrow="02 — Where you're at online"
      title="What's already out there?"
      lead="So we know what to keep, fix, or build from scratch. Skip anything you don't have."
    >
      <Field label="Existing website" optional>
        <Input
          type="url"
          placeholder="https:// or 'none'"
          value={state.existingWebsite}
          onChange={(e) => update("existingWebsite", e.target.value)}
        />
      </Field>

      <Field label="Google Business listing?">
        <div className="flex gap-2">
          {googleOptions.map((opt) => (
            <Chip
              key={opt}
              selected={state.googleBusiness === opt}
              onClick={() => update("googleBusiness", opt)}
              size="md"
              className="flex-1"
            >
              {opt}
            </Chip>
          ))}
        </div>
      </Field>

      <Field label="Instagram" optional>
        <div className="flex items-center border border-border bg-white rounded-[12px] overflow-hidden focus-within:border-primary focus-within:shadow-[0_0_0_4px_rgba(212,132,90,0.12)] transition-all duration-200 ease-dorza">
          <span className="px-3.5 h-12 inline-flex items-center text-text-muted text-[15px] border-r border-border">
            @
          </span>
          <input
            type="text"
            value={state.instagramHandle}
            onChange={(e) => update("instagramHandle", e.target.value)}
            placeholder="yourhandle"
            className="flex-1 h-12 px-3.5 bg-transparent text-[15px] text-dark outline-none placeholder:text-text-muted"
          />
        </div>
      </Field>

      <Field label="Facebook page" optional>
        <Input
          placeholder="facebook.com/yourpage or 'none'"
          value={state.facebookPage}
          onChange={(e) => update("facebookPage", e.target.value)}
        />
      </Field>

      <Field label="Other platforms" optional>
        <Input
          placeholder="TikTok, YouTube, LinkedIn"
          value={state.otherPlatforms}
          onChange={(e) => update("otherPlatforms", e.target.value)}
        />
      </Field>

      <Field
        label="Biggest frustration with your current setup"
        helper="Be honest — what's not working?"
        optional
      >
        <Textarea
          rows={3}
          value={state.biggestFrustration}
          onChange={(e) => update("biggestFrustration", e.target.value)}
        />
      </Field>
    </StepLayout>
  );
}
