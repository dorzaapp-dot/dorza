"use client";

import type { OnboardState, OnboardAction } from "@/lib/types";
import {
  Chip,
  Field,
  Input,
  OptionCard,
  OptionGrid,
  StepLayout,
  Textarea,
} from "./_primitives";

interface Props {
  state: OnboardState;
  dispatch: React.Dispatch<OnboardAction>;
}

const tones = [
  { value: "Casual & friendly", desc: "Like chatting to a mate" },
  { value: "Professional & clean", desc: "Polished, trustworthy, on-point" },
  { value: "Bold & energetic", desc: "Confident, stands out" },
  { value: "Warm & welcoming", desc: "Inviting and personal" },
];

const colourMoods = [
  { value: "Coastal", swatches: ["#1B3A52", "#7FB3C4", "#F2EAD9"] },
  { value: "Earthy", swatches: ["#5C3D2E", "#A8845A", "#EFE3D0"] },
  { value: "Mono", swatches: ["#111111", "#6B6B6B", "#F4F4F4"] },
  { value: "Botanical", swatches: ["#2E4F35", "#7FA384", "#F0EBDC"] },
  { value: "Sunset", swatches: ["#B8673F", "#E8A87C", "#FBEDE3"] },
  { value: "Editorial", swatches: ["#1A1A2E", "#D4845A", "#F9F7F5"] },
];

const logoOptions = [
  { value: "Received", label: "I have one — ready to share" },
  { value: "Client will send", label: "I have one — I'll send it later" },
  { value: "Please design one", label: "No — please design one" },
  { value: "No logo", label: "No logo, and I don't need one" },
] as const;

export default function StepLookFeel({ state, dispatch }: Props) {
  const update = (field: keyof OnboardState, value: unknown) =>
    dispatch({ type: "UPDATE_FIELD", field, value });

  return (
    <StepLayout
      eyebrow="05 — Look & feel"
      title="How should it feel?"
      lead="Pick a tone, a colour mood, and describe the vibe. Don't overthink it — we'll refine together."
    >
      <Field label="Do you have a logo?">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {logoOptions.map((opt) => (
            <Chip
              key={opt.value}
              selected={state.logoStatus === opt.value}
              onClick={() => update("logoStatus", opt.value)}
              size="md"
              className="justify-start text-left"
            >
              {opt.label}
            </Chip>
          ))}
        </div>
      </Field>

      <Field label="Brand colours" optional helper="Hex codes or descriptions both work.">
        <Input
          placeholder="e.g. Navy blue and white, or #1B2A4A"
          value={state.brandColours}
          onChange={(e) => update("brandColours", e.target.value)}
        />
      </Field>

      <Field label="Tone of voice">
        <OptionGrid cols={2}>
          {tones.map((t) => (
            <OptionCard
              key={t.value}
              selected={state.tone === t.value}
              onClick={() => update("tone", t.value)}
              title={t.value}
              desc={t.desc}
            />
          ))}
        </OptionGrid>
      </Field>

      <Field label="Colour mood">
        <OptionGrid cols={3} className="grid-cols-2">
          {colourMoods.map((m) => (
            <OptionCard
              key={m.value}
              selected={state.colourMood === m.value}
              onClick={() => update("colourMood", m.value)}
              title={m.value}
              swatches={m.swatches}
            />
          ))}
        </OptionGrid>
      </Field>

      <Field
        label="Three words to describe your brand"
        helper="e.g. grounded, considered, strong"
        optional
      >
        <Input
          value={state.brandKeywords}
          onChange={(e) => update("brandKeywords", e.target.value)}
        />
      </Field>

      <Field label="Inspiration websites" optional>
        <Textarea
          rows={2}
          placeholder="Paste any URLs you love"
          value={state.inspirationSites}
          onChange={(e) => update("inspirationSites", e.target.value)}
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
