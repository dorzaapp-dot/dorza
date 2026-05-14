"use client";

import type { OnboardState, OnboardAction } from "@/lib/types";
import { ChipRow, Field, Input, StepLayout, Textarea } from "./_primitives";

interface Props {
  state: OnboardState;
  dispatch: React.Dispatch<OnboardAction>;
}

const channels = [
  "Word of mouth",
  "Google Search",
  "Instagram",
  "Facebook",
  "Walk-ins",
  "Referrals",
  "Other",
] as const;

export default function StepTargetCustomers({ state, dispatch }: Props) {
  const update = (field: keyof OnboardState, value: unknown) =>
    dispatch({ type: "UPDATE_FIELD", field, value });

  return (
    <StepLayout
      eyebrow="04 — Who you serve"
      title="Picture your ideal customer"
      lead="The clearer this is, the sharper your copy will land."
    >
      <Field label="Typical customer">
        <Textarea
          rows={3}
          placeholder="e.g. Homeowners in the Inner West aged 30–50"
          value={state.typicalCustomer}
          onChange={(e) => update("typicalCustomer", e.target.value)}
        />
      </Field>

      <Field label="Service area">
        <Input
          placeholder="e.g. Eastern Suburbs Sydney, all of Sydney"
          value={state.serviceArea}
          onChange={(e) => update("serviceArea", e.target.value)}
        />
      </Field>

      <Field
        label="How do most customers find you now?"
        helper="Tap any that apply."
      >
        <ChipRow
          options={channels}
          isSelected={(v) => state.discoveryChannels.includes(v)}
          onToggle={(v) =>
            dispatch({ type: "TOGGLE_DISCOVERY_CHANNEL", channel: v })
          }
          size="sm"
        />
      </Field>
    </StepLayout>
  );
}
