# Onboard Experience Improvements — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce friction/drop-off in the `/onboard` wizard while preserving the data completeness the downstream build needs — and make its promises real (save/resume, terms, no fake upload), with a desktop+mobile polish pass.

**Architecture:** Client-only changes to the static-export Next.js wizard. A single reducer in `app/onboard/page.tsx` owns state; step components stay dumb and compose `_primitives.tsx`. Add two small client libs (`lib/onboardPersistence.ts`, `lib/onboardAnalytics.ts`). Collapse 9 steps → 8. No backend/edge-function changes; submission still flows through `submitForm`.

**Tech Stack:** Next.js 14 (App Router, `output: 'export'`), TypeScript strict, Tailwind v3, framer-motion, lucide-react, `@vercel/analytics`, pnpm. Verification: `npx tsc --noEmit`, `pnpm lint`, `pnpm build`, Playwright harness `scripts/onboard-shots.mjs`.

**Reference spec:** `docs/superpowers/specs/2026-06-01-onboard-experience-improvements-design.md`

---

## Conventions for every task

- **Package manager:** `pnpm`. Run commands from the repo root.
- **Verify gate (run after code edits unless task says otherwise):**
  `npx tsc --noEmit` → expect no errors; `pnpm lint` → expect no new warnings/errors.
- **Visual gate:** dev server runs at `http://localhost:3000`. If not running: `pnpm dev`.
  Re-screenshot with `node scripts/onboard-shots.mjs` (writes to `scripts/_shots/`).
- **Commit** after each task with the message shown. We are on `master`; if the executor prefers a
  branch, create `feat/onboard-improvements` first (`git checkout -b feat/onboard-improvements`).

---

## File Structure (decomposition)

**New files**
- `lib/onboardPersistence.ts` — load/save/clear the localStorage draft. One responsibility: persistence.
- `lib/onboardAnalytics.ts` — thin `@vercel/analytics` wrapper with typed event names.
- `components/onboard/StepLookFeel.tsx` — merged "Look & feel" step (was `StepBrandStyle` + site-vision).
- `components/onboard/StepSiteAssets.tsx` — merged "Your site & assets" step (was `StepWebsiteSections` + `StepPhotosAssets`, fake upload removed).
- `components/onboard/TermsModal.tsx` — in-flow terms dialog.

**Modified**
- `lib/types.ts`, `app/onboard/page.tsx`, `lib/generateMarkdown.ts`,
  `components/onboard/_primitives.tsx`, `WizardShell.tsx`, `WelcomeScreen.tsx`,
  `StepBusinessBasics.tsx`, `StepServices.tsx`, `StepReview.tsx`, `SubmittedScreen.tsx`, `CLAUDE.md`.

**Deleted**
- `components/onboard/StepBrandStyle.tsx`, `StepWebsiteSections.tsx`, `StepPhotosAssets.tsx`.

---

## Phase A — Data model + markdown foundation

### Task A1: Update `OnboardState` (add colourMood, agreedToTerms; consolidate logo)

**Files:**
- Modify: `lib/types.ts`

- [ ] **Step 1: Edit the `OnboardState` brand + assets + review fields**

In `lib/types.ts`, change the `// Step 5 - Brand & style` block, the `logoStatus` line, and the
`// Step 9 - Review` block to:

```ts
  // Step 5 - Look & feel (brand + site vision)
  colourMood: string;        // own field — no longer overloaded into brandKeywords
  brandColours: string;
  tone: string;
  inspirationSites: string;
  brandKeywords: string;     // now ONLY the three descriptive words
  logoStatus:
    | "Received"
    | "Client will send"
    | "No logo"
    | "Please design one"
    | "";

  // Step 6 - Photos & assets (logo lives in Look & feel now)
  photosStatus: "Received" | "Client will send" | "Use stock" | "Pull from Instagram" | "";
  menuDocStatus: "Received" | "Client will send" | "N/A" | "";
  testimonialsStatus: "Have specific ones" | "Pull from Google" | "None yet" | "";
  specificTestimonials: string;
  photoNotes: string;
```

Remove the old `hasLogo` line entirely (it was `hasLogo: "Yes" | "No" | "";`).

In the `// Step 9 - Review` block, add `agreedToTerms`:

```ts
  // Step 8 - Review
  notes: string;
  agreedToTerms: boolean;
```

(Leave `siteVisionDescription`, `bookingLink`, `ecommercePlatform`, `otherSections`,
`websiteSections`, `successVision` where they are — only their UI moves, not their types.)

- [ ] **Step 2: Add the `HYDRATE` action**

In the `OnboardAction` union, add a first member:

```ts
export type OnboardAction =
  | { type: "HYDRATE"; state: OnboardState }
  | { type: "UPDATE_FIELD"; field: keyof OnboardState; value: unknown }
  | { type: "ADD_SERVICE" }
  | { type: "REMOVE_SERVICE"; index: number }
  | { type: "UPDATE_SERVICE"; index: number; value: string }
  | { type: "TOGGLE_DISCOVERY_CHANNEL"; channel: string }
  | { type: "TOGGLE_WEBSITE_SECTION"; section: string };
```

- [ ] **Step 3: Typecheck (expected to FAIL until A2/A3 land)**

Run: `npx tsc --noEmit`
Expected: errors in `app/onboard/page.tsx` and `lib/generateMarkdown.ts` referencing `hasLogo` /
missing `colourMood` / `agreedToTerms`. That's expected — fixed in A2/A3. Do **not** commit yet.

---

### Task A2: Update `initialState`, reducer hydrate, and the step `switch` scaffolding

**Files:**
- Modify: `app/onboard/page.tsx`

- [ ] **Step 1: Fix `initialState`**

Remove `hasLogo: "",`. Add `colourMood: "",` near the other Step-5 fields, and add
`agreedToTerms: false,` next to `notes: ""`. Concretely, replace the brand block + tail of
`initialState`:

```ts
  hasLogo: "",   // <-- DELETE this line
```
Add (group with brandColours/tone/etc.):
```ts
  colourMood: "",
```
And change the end:
```ts
  successVision: "",
  notes: "",
  agreedToTerms: false,
};
```

- [ ] **Step 2: Add the `HYDRATE` case to the reducer**

At the top of the `switch (action.type)` in `reducer`, add:

```ts
    case "HYDRATE":
      return action.state;
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: remaining errors only in `lib/generateMarkdown.ts` (handled in A3). page.tsx errors gone.

---

### Task A3: Update `generateMarkdown` (colour_mood, derived has_logo, schema v2)

**Files:**
- Modify: `lib/generateMarkdown.ts`

- [ ] **Step 1: Bump schema + add a logo-derivation helper**

Change the constant:
```ts
const SCHEMA_VERSION = "dorza-intake.v2";
```
Add this helper above `frontmatter`:
```ts
function deriveHasLogo(s: OnboardState): string {
  if (s.logoStatus === "Received" || s.logoStatus === "Client will send") return "Yes";
  if (s.logoStatus === "No logo" || s.logoStatus === "Please design one") return "No";
  return "";
}
```

- [ ] **Step 2: Update frontmatter keys**

In `frontmatter()`, replace the `has_logo` line and add `colour_mood` + `terms_accepted`:

```ts
    `tone: ${yq(s.tone)}`,
    `colour_mood: ${yq(s.colourMood)}`,
    `brand_keywords: ${yq(s.brandKeywords)}`,
    `brand_colours: ${yq(s.brandColours)}`,
    `logo_status: ${yq(s.logoStatus)}`,
    `has_logo: ${yq(deriveHasLogo(s))}`,
```
And just before the closing `"---"`, add:
```ts
    `terms_accepted: ${s.agreedToTerms === true}`,
```

- [ ] **Step 3: Move logo + add colour_mood to `bodyBrand`; drop logo from `bodyAssets`**

Replace `bodyBrand`:
```ts
function bodyBrand(s: OnboardState): string {
  return kvTable([
    ["logo_status", s.logoStatus],
    ["colour_mood", s.colourMood],
    ["brand_colours", s.brandColours],
    ["tone", s.tone],
    ["brand_keywords", s.brandKeywords],
    ["inspiration_sites", s.inspirationSites],
  ]);
}
```
Replace `bodyAssets` first `kvTable` (remove the `logo_status` row):
```ts
function bodyAssets(s: OnboardState): string {
  return [
    kvTable([
      ["photos_status", s.photosStatus],
      ["menu_doc_status", s.menuDocStatus],
      ["testimonials_status", s.testimonialsStatus],
      ["photo_notes", s.photoNotes],
    ]),
    "",
    s.specificTestimonials
      ? `**Testimonials provided:**\n\n> ${s.specificTestimonials.replace(/\n/g, "\n> ")}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");
}
```

- [ ] **Step 4: Typecheck + build**

Run: `npx tsc --noEmit` → expect no errors.
Run: `pnpm build` → expect a successful static export (the markdown change is pure-function).

- [ ] **Step 5: Commit**

```bash
git add lib/types.ts app/onboard/page.tsx lib/generateMarkdown.ts
git commit -m "feat(onboard): add colourMood + agreedToTerms, consolidate logo, schema v2"
```

---

## Phase B — Look & feel step (fix collision, single logo, absorb site-vision)

### Task B1: Create `StepLookFeel.tsx`

**Files:**
- Create: `components/onboard/StepLookFeel.tsx`
- Delete: `components/onboard/StepBrandStyle.tsx` (after wiring in C-phase task E1)

- [ ] **Step 1: Write the merged component**

Create `components/onboard/StepLookFeel.tsx`:

```tsx
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
```

Note: the colour-mood `OptionGrid` uses `className="grid-cols-2"` to force 2-up on mobile while
`cols={3}` provides `md:grid-cols-3` — this is the WS6 mobile fix folded in. Confirm `OptionGrid`
accepts and merges `className` (it does — see `_primitives.tsx`).

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit` → expect no errors (component compiles; not yet wired — that's E1).

- [ ] **Step 3: Commit**

```bash
git add components/onboard/StepLookFeel.tsx
git commit -m "feat(onboard): add merged Look & feel step (colourMood field, single logo, site vision)"
```

---

## Phase C — Site & assets merge (remove fake upload)

### Task C1: Create `StepSiteAssets.tsx`

**Files:**
- Create: `components/onboard/StepSiteAssets.tsx`
- Delete (in E1): `StepWebsiteSections.tsx`, `StepPhotosAssets.tsx`

- [ ] **Step 1: Write the merged component (no fake upload dropzone)**

Create `components/onboard/StepSiteAssets.tsx`:

```tsx
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
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit` → expect no errors.

- [ ] **Step 3: Commit**

```bash
git add components/onboard/StepSiteAssets.tsx
git commit -m "feat(onboard): merge sections + assets into one step, remove fake upload dropzone"
```

---

## Phase D — Terms that work

### Task D1: Create `TermsModal.tsx`

**Files:**
- Create: `components/onboard/TermsModal.tsx`

- [ ] **Step 1: Write the modal (focus-trap + scroll-lock + ESC, mirroring EnquiryModal)**

Create `components/onboard/TermsModal.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const TERMS: { heading: string; body: string }[] = [
  {
    heading: "1. What we do",
    body: "Dorza designs and builds a website and sets up related online profiles for your business, based on the brief you submit through this form.",
  },
  {
    heading: "2. Your brief",
    body: "We rely on the information you provide being accurate and yours to use, including any logos, photos, and testimonials. You confirm you have the right to share them.",
  },
  {
    heading: "3. Quotes & payment",
    body: "Submitting this brief is not a payment or a binding order. We'll contact you with a quote within 72 hours. Work begins once you accept that quote.",
  },
  {
    heading: "4. Your details",
    body: "We use the details in your brief only to prepare your quote and build your site. We don't sell your data. You can ask us to delete it at any time.",
  },
  {
    heading: "5. Changes",
    body: "These are draft service terms for the onboarding brief. Final terms are confirmed with your quote before any work starts.",
  },
];

export default function TermsModal({ open, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Service terms"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-dark/40" onClick={onClose} />
      <div className="relative bg-white border border-border rounded-card max-w-[560px] w-full max-h-[80vh] overflow-y-auto p-6 md:p-8 shadow-medium">
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-display text-[28px] leading-[1.1] tracking-[-0.02em] text-dark">
            Service terms
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-full inline-flex items-center justify-center text-text-secondary hover:text-dark hover:bg-surface transition-colors flex-shrink-0"
          >
            <X size={18} />
          </button>
        </div>
        <div className="mt-5 flex flex-col gap-4">
          {TERMS.map((t) => (
            <div key={t.heading}>
              <div className="text-[14px] font-semibold text-dark">{t.heading}</div>
              <p className="text-[14px] text-text-secondary leading-relaxed mt-1">{t.body}</p>
            </div>
          ))}
        </div>
        <p className="text-[12px] text-text-muted mt-6">
          Draft terms — final wording confirmed with your quote.
        </p>
      </div>
    </div>
  );
}
```

> NOTE: the copy is a placeholder draft pending the owner's real legal wording (flagged in the spec).

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit` → expect no errors.

- [ ] **Step 3: Commit**

```bash
git add components/onboard/TermsModal.tsx
git commit -m "feat(onboard): add in-flow TermsModal"
```

---

## Phase E — Wire the 8-step flow + lighten Step 1 + suggested services

### Task E1: Renumber to 8 steps and wire new components in `page.tsx`

**Files:**
- Modify: `app/onboard/page.tsx`
- Delete: `components/onboard/StepBrandStyle.tsx`, `StepWebsiteSections.tsx`, `StepPhotosAssets.tsx`

- [ ] **Step 1: Swap imports**

Replace the three step imports:
```ts
import StepBrandStyle from "@/components/onboard/StepBrandStyle";
import StepPhotosAssets from "@/components/onboard/StepPhotosAssets";
import StepWebsiteSections from "@/components/onboard/StepWebsiteSections";
```
with:
```ts
import StepLookFeel from "@/components/onboard/StepLookFeel";
import StepSiteAssets from "@/components/onboard/StepSiteAssets";
```

- [ ] **Step 2: Set `TOTAL_STEPS = 8` and rewrite `STEPS` with rail copy**

```ts
const TOTAL_STEPS = 8;

const STEPS: StepMeta[] = [
  { num: "01", label: "Tell us about your business", short: "About you", why: "The essentials that go on your site, Google listing, and invoices." },
  { num: "02", label: "Where you're at online", short: "Online presence", why: "So we know what to keep, fix, or build from scratch." },
  { num: "03", label: "What you offer", short: "Services", why: "These become your services page and shape your SEO." },
  { num: "04", label: "Who you serve", short: "Customers", why: "The clearer this is, the sharper your copy lands." },
  { num: "05", label: "Look & feel", short: "Look & feel", why: "Tone, colour, and vibe — how your site should feel." },
  { num: "06", label: "Your site & assets", short: "Site & assets", why: "Which sections you need and what you've already got." },
  { num: "07", label: "What success looks like", short: "Success", why: "So we build toward the outcome you actually want." },
  { num: "08", label: "Last look", short: "Review", why: "A quick check, then your brief is on its way." },
];
```

- [ ] **Step 3: Rewrite the step `switch`**

Replace the JSX step switch inside `<WizardShell>` with:
```tsx
      {step === 0 && (
        <StepBusinessBasics state={state} dispatch={dispatch} errors={errors} />
      )}
      {step === 1 && <StepDigitalPresence state={state} dispatch={dispatch} />}
      {step === 2 && (
        <StepServices state={state} dispatch={dispatch} errors={errors} />
      )}
      {step === 3 && <StepTargetCustomers state={state} dispatch={dispatch} />}
      {step === 4 && <StepLookFeel state={state} dispatch={dispatch} />}
      {step === 5 && <StepSiteAssets state={state} dispatch={dispatch} />}
      {step === 6 && <StepSuccess state={state} dispatch={dispatch} />}
      {step === 7 && <StepReview state={state} dispatch={dispatch} />}
```

- [ ] **Step 4: Add `why` to `StepMeta`**

In `components/onboard/WizardShell.tsx`, extend the interface:
```ts
export interface StepMeta {
  num: string;
  label: string;
  short: string;
  why?: string;
}
```

- [ ] **Step 5: Delete the three superseded step files**

```bash
git rm components/onboard/StepBrandStyle.tsx components/onboard/StepWebsiteSections.tsx components/onboard/StepPhotosAssets.tsx
```

- [ ] **Step 6: Typecheck + build + visual**

Run: `npx tsc --noEmit` → no errors.
Run: `pnpm build` → successful static export.
Run: `node scripts/onboard-shots.mjs` then open `scripts/_shots/desktop-05-brand.png` (now Look & feel)
and `desktop-06-assets.png` (now Site & assets). NOTE: the harness's per-step fillers/labels are
stale after renumber — that's fine for a smoke check; it will be refreshed in Task G5. Confirm: 8
dots in mobile progress, Look & feel shows clean "Three words" (no `mood:` leak), no upload dropzone.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(onboard): collapse to 8 steps, wire Look & feel + Site & assets, add rail copy"
```

---

### Task E2: Lighten Step 1 (optional-details disclosure)

**Files:**
- Modify: `components/onboard/StepBusinessBasics.tsx`

- [ ] **Step 1: Wrap ABN + street address + opening hours in a `<details>` disclosure**

Replace the three trailing `<Field>` blocks (Street address, Opening hours, ABN) with a single
collapsible group:

```tsx
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
```

- [ ] **Step 2: Typecheck + visual**

Run: `npx tsc --noEmit` → no errors.
Re-screenshot; confirm Step 1 (`desktop-01-basics.png`, `mobile-01-basics.png`) now ends with a
collapsed "A few more details (optional)" row instead of three stacked fields.

- [ ] **Step 3: Commit**

```bash
git add components/onboard/StepBusinessBasics.tsx
git commit -m "feat(onboard): collapse admin fields into optional disclosure on step 1"
```

---

### Task E3: Type-aware suggested-service chips

**Files:**
- Modify: `components/onboard/StepServices.tsx`

- [ ] **Step 1: Add a suggestions map + an "add suggestion" helper**

At the top of `StepServices.tsx` (after imports), add:

```tsx
const SERVICE_SUGGESTIONS: Record<string, string[]> = {
  Tradie: ["Emergency callouts", "Installations", "Repairs & maintenance", "Inspections & reports", "Quotes & estimates"],
  "Cafe/Restaurant": ["Dine-in", "Takeaway", "Catering", "Functions & events", "Coffee & beans retail"],
  "Salon/Beauty": ["Cuts & styling", "Colour", "Treatments", "Bridal & events", "Memberships"],
  "Fitness/Wellness": ["Group classes", "Personal training", "Memberships", "Casual passes", "Online coaching"],
  Retail: ["In-store shopping", "Online orders", "Click & collect", "Gift cards", "Custom orders"],
  "Professional Services": ["Consultations", "Ongoing advisory", "Compliance & lodgement", "Project work", "Fixed-fee packages"],
  Other: [],
};
```

- [ ] **Step 2: Render suggestion chips above the services list**

Inside the first `<Field label="Your services" ...>`, immediately before the
`<div className="flex flex-col gap-2">`, insert:

```tsx
        {(SERVICE_SUGGESTIONS[state.businessType] ?? []).filter(
          (s) => !state.services.map((x) => x.trim().toLowerCase()).includes(s.toLowerCase()),
        ).length > 0 && (
          <div className="mb-3">
            <div className="text-[12px] text-text-muted mb-2">
              Tap to add common {state.businessType.toLowerCase()} offerings:
            </div>
            <div className="flex flex-wrap gap-2">
              {(SERVICE_SUGGESTIONS[state.businessType] ?? [])
                .filter(
                  (s) =>
                    !state.services
                      .map((x) => x.trim().toLowerCase())
                      .includes(s.toLowerCase()),
                )
                .map((s) => (
                  <Chip
                    key={s}
                    size="sm"
                    onClick={() => {
                      const firstEmpty = state.services.findIndex((x) => !x.trim());
                      if (firstEmpty >= 0) {
                        dispatch({ type: "UPDATE_SERVICE", index: firstEmpty, value: s });
                      } else {
                        dispatch({ type: "ADD_SERVICE" });
                        dispatch({
                          type: "UPDATE_SERVICE",
                          index: state.services.length,
                          value: s,
                        });
                      }
                    }}
                  >
                    + {s}
                  </Chip>
                ))}
            </div>
          </div>
        )}
```

- [ ] **Step 3: Import `Chip`**

Update the import line to include `Chip`:
```tsx
import { Chip, Field, Input, StepLayout, Textarea } from "./_primitives";
```

- [ ] **Step 4: Typecheck + visual**

Run: `npx tsc --noEmit` → no errors.
Manual: in the running dev app, pick "Cafe/Restaurant" on step 1 → step 3 shows tappable suggestion
chips that fill empty service rows; tapping again won't duplicate.

> Note on the `ADD_SERVICE`-then-`UPDATE_SERVICE` sequence: both dispatches are applied to the same
> reducer queue; `state.services.length` is the pre-add length, which becomes the new last index
> after `ADD_SERVICE`. Verified against the reducer in `page.tsx`.

- [ ] **Step 5: Commit**

```bash
git add components/onboard/StepServices.tsx
git commit -m "feat(onboard): type-aware suggested-service chips"
```

---

## Phase F — Persistence, terms wiring, review, submitted, errors, analytics

### Task F1: Persistence library

**Files:**
- Create: `lib/onboardPersistence.ts`

- [ ] **Step 1: Write the module**

Create `lib/onboardPersistence.ts`:

```ts
import type { OnboardState } from "./types";

const KEY = "dorza:onboard:draft:v1";

export type OnboardPhase = "welcome" | "wizard" | "submitted";

export interface OnboardDraft {
  state: OnboardState;
  step: number;
  phase: OnboardPhase;
  savedAt: string; // ISO timestamp
}

export function loadDraft(): OnboardDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as OnboardDraft;
    if (!parsed || typeof parsed !== "object" || !parsed.state) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveDraft(draft: OnboardDraft): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(draft));
  } catch {
    /* storage full or disabled — fail silently */
  }
}

export function clearDraft(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
```

- [ ] **Step 2: Typecheck + commit**

Run: `npx tsc --noEmit` → no errors.
```bash
git add lib/onboardPersistence.ts
git commit -m "feat(onboard): localStorage draft persistence helpers"
```

---

### Task F2: Analytics library

**Files:**
- Create: `lib/onboardAnalytics.ts`

- [ ] **Step 1: Write the wrapper**

Create `lib/onboardAnalytics.ts`:

```ts
import { track } from "@vercel/analytics";

export type OnboardEvent =
  | "onboard_start"
  | "onboard_resume"
  | "onboard_step_view"
  | "onboard_step_next"
  | "onboard_step_back"
  | "onboard_submit_attempt"
  | "onboard_submit_success"
  | "onboard_submit_error"
  | "onboard_abandon";

export function trackOnboard(
  event: OnboardEvent,
  props?: Record<string, string | number | boolean>,
): void {
  try {
    track(event, props);
  } catch {
    /* analytics not active (e.g. dev) — no-op */
  }
}
```

- [ ] **Step 2: Typecheck + commit**

Run: `npx tsc --noEmit` → no errors.
```bash
git add lib/onboardAnalytics.ts
git commit -m "feat(onboard): typed analytics event wrapper"
```

---

### Task F3: Wire persistence + analytics + resume + submit-error into `page.tsx`

**Files:**
- Modify: `app/onboard/page.tsx`

- [ ] **Step 1: Add imports + new hooks**

Add imports:
```ts
import { useEffect, useRef } from "react";
import { loadDraft, saveDraft, clearDraft, type OnboardPhase } from "@/lib/onboardPersistence";
import { trackOnboard } from "@/lib/onboardAnalytics";
```
(Keep the existing `useReducer, useState, useCallback` import; merge `useEffect, useRef` in.)

Change the `Phase` type usage to reuse `OnboardPhase` (delete the local `type Phase = ...` line and
use `OnboardPhase`).

- [ ] **Step 2: Add hydration + draft + analytics state**

Replace the state declarations at the top of `OnboardPage` with:

```ts
  const [state, dispatch] = useReducer(reducer, initialState);
  const [phase, setPhase] = useState<OnboardPhase>("welcome");
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
```

- [ ] **Step 3: Hydrate on mount**

Add after the state declarations:

```ts
  // Restore any in-progress draft once, on the client, after hydration.
  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      dispatch({ type: "HYDRATE", state: draft.state });
      setStep(draft.step);
      setPhase(draft.phase === "submitted" ? "welcome" : draft.phase);
      setSavedAt(draft.savedAt);
      setHasDraft(true);
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
```

- [ ] **Step 4: Debounced save whenever the wizard state changes**

```ts
  useEffect(() => {
    if (!hydrated || phase !== "wizard") return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const now = new Date().toISOString();
      saveDraft({ state, step, phase, savedAt: now });
      setSavedAt(now);
    }, 500);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [state, step, phase, hydrated]);
```

- [ ] **Step 5: Abandon tracking**

```ts
  useEffect(() => {
    if (phase !== "wizard") return;
    const onHide = () => {
      if (document.visibilityState === "hidden") {
        trackOnboard("onboard_abandon", { step: step + 1 });
      }
    };
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, [phase, step]);
```

- [ ] **Step 6: Track step views**

```ts
  useEffect(() => {
    if (phase === "wizard") trackOnboard("onboard_step_view", { step: step + 1 });
  }, [step, phase]);
```

- [ ] **Step 7: Update navigation + submit handlers**

Replace `goNext`, `goBack`, and the welcome/submitted blocks:

```ts
  async function goNext() {
    if (!validate()) return;
    if (step >= TOTAL_STEPS - 1) {
      setSubmitError(false);
      setSubmitting(true);
      trackOnboard("onboard_submit_attempt");
      const result = await submitForm(process.env.NEXT_PUBLIC_ONBOARD_SUBMIT_URL!, {
        state,
        markdown: generateMarkdown(state),
      });
      setSubmitting(false);
      if (result.success) {
        trackOnboard("onboard_submit_success");
        clearDraft();
        setPhase("submitted");
      } else {
        trackOnboard("onboard_submit_error");
        setSubmitError(true);
      }
      return;
    }
    trackOnboard("onboard_step_next", { from: step + 1, to: step + 2 });
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }

  function goBack() {
    trackOnboard("onboard_step_back", { from: step + 1, to: step });
    setStep((s) => Math.max(s - 1, 0));
  }

  function startFresh() {
    clearDraft();
    dispatch({ type: "HYDRATE", state: initialState });
    setStep(0);
    setHasDraft(false);
    setSavedAt(null);
    setPhase("wizard");
    trackOnboard("onboard_start");
  }

  function resumeDraft() {
    setPhase("wizard");
    trackOnboard("onboard_resume", { step: step + 1 });
  }
```

(Remove the old inline `setPhase("wizard"); setStep(0);` body of the welcome `onStart`.)

- [ ] **Step 8: Update the render blocks**

Avoid a hydration flash — render nothing until hydrated:

```tsx
  if (!hydrated) return null;

  if (phase === "welcome") {
    return (
      <WelcomeScreen
        onStart={startFresh}
        onResume={resumeDraft}
        hasInProgress={hasDraft}
      />
    );
  }
```

Pass the save state + error to `WizardShell` (props added in F4):
```tsx
    <WizardShell
      step={step}
      total={TOTAL_STEPS}
      steps={STEPS}
      onBack={goBack}
      onNext={goNext}
      onJumpTo={jumpTo}
      onExit={exitToHome}
      savedAt={savedAt}
      submitError={submitError}
      forwardLabel={step === TOTAL_STEPS - 1 ? (submitting ? "Submitting…" : "Submit my brief") : "Continue"}
      forwardDisabled={submitting || (step === TOTAL_STEPS - 1 && !state.agreedToTerms)}
    >
```

- [ ] **Step 9: Typecheck (expect WizardShell prop errors until F4)**

Run: `npx tsc --noEmit`
Expected: errors only about unknown `savedAt`/`submitError` props on `WizardShell` — fixed in F4.

---

### Task F4: WizardShell — real saved state, contextual rail, submit-error banner

**Files:**
- Modify: `components/onboard/WizardShell.tsx`

- [ ] **Step 1: Extend props**

```ts
interface Props {
  step: number;
  total: number;
  steps: StepMeta[];
  onBack: () => void;
  onNext: () => void;
  onJumpTo: (i: number) => void;
  onExit: () => void;
  savedAt?: string | null;
  submitError?: boolean;
  forwardLabel?: string;
  forwardDisabled?: boolean;
  children: ReactNode;
}
```
Add to the destructure: `savedAt = null, submitError = false,`.

- [ ] **Step 2: Real "Saved" indicator**

Add a small relative-time formatter above the component:
```ts
function savedLabel(iso?: string | null): string | null {
  if (!iso) return null;
  const then = new Date(iso).getTime();
  const secs = Math.max(0, Math.floor((Date.now() - then) / 1000));
  if (secs < 5) return "Saved · just now";
  if (secs < 60) return `Saved · ${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `Saved · ${mins}m ago`;
  return "Saved";
}
```
Replace the hardcoded saved `<span>` in the header with:
```tsx
          {savedLabel(savedAt) && (
            <span className="inline-flex items-center gap-1.5 text-[12px] text-text-muted">
              <Save size={13} /> {savedLabel(savedAt)}
            </span>
          )}
```
(Drop the `hidden md:inline-flex` so it shows on mobile too.)

- [ ] **Step 3: Contextual rail copy**

In the desktop `<aside>`, replace the static `<h1>…online.</h1>` + `<p>…come back.</p>` with
step-aware copy:
```tsx
          <h1 className="font-display text-[28px] leading-[1.05] tracking-[-0.02em] text-dark mt-3">
            {steps[step]?.label ?? "Let's get your business online."}
          </h1>
          {steps[step]?.why && (
            <p className="text-[13px] text-text-secondary leading-relaxed mt-3.5">
              {steps[step].why}
            </p>
          )}
```

- [ ] **Step 4: Submit-error banner**

Just inside `<main>`, above `{children}`, add:
```tsx
          {submitError && (
            <div className="px-5 md:px-20 pt-6">
              <div className="rounded-[12px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700 leading-relaxed">
                Something went wrong sending your brief. Your answers are saved — please try
                &ldquo;Submit my brief&rdquo; again.
              </div>
            </div>
          )}
```
(Keep the existing `<div className="px-5 py-8 md:px-20 md:py-12">{children}</div>` below it.)

- [ ] **Step 5: Typecheck + build + visual**

Run: `npx tsc --noEmit` → no errors.
Run: `pnpm build` → success.
Manual click-path in dev: start → fill a field → header shows "Saved · just now"; refresh → draft
restores and welcome offers "Pick up where I left off"; on the final step the submit button is
disabled until terms are checked (after F5).

- [ ] **Step 6: Commit**

```bash
git add app/onboard/page.tsx components/onboard/WizardShell.tsx
git commit -m "feat(onboard): persistence + resume + analytics + real saved state + submit error UX"
```

---

### Task F5: Review step — strip markdown, real terms, completeness hint

**Files:**
- Modify: `components/onboard/StepReview.tsx`

- [ ] **Step 1: Replace the whole component**

```tsx
"use client";

import { useState } from "react";
import type { OnboardState, OnboardAction } from "@/lib/types";
import { Field, StepLayout, Textarea } from "./_primitives";
import TermsModal from "./TermsModal";

interface Props {
  state: OnboardState;
  dispatch: React.Dispatch<OnboardAction>;
}

export default function StepReview({ state, dispatch }: Props) {
  const [termsOpen, setTermsOpen] = useState(false);

  const update = (field: keyof OnboardState, value: unknown) =>
    dispatch({ type: "UPDATE_FIELD", field, value });

  const summary: [string, string][] = [
    ["Business", state.businessName || "—"],
    ["Type", [state.businessType, state.niche].filter(Boolean).join(" · ") || "—"],
    ["Suburb", state.suburb || "—"],
    ["Tone", state.tone || "—"],
    ["Mood", state.colourMood || "—"],
    [
      "Success",
      state.successVision
        ? state.successVision.length > 80
          ? state.successVision.slice(0, 80).trim() + "…"
          : state.successVision
        : "—",
    ],
  ];

  // Non-blocking nudge: build-critical fields that are still empty.
  const missing: string[] = [];
  if (!state.businessName.trim()) missing.push("business name");
  if (!state.businessType) missing.push("business type");
  if (!state.suburb.trim()) missing.push("suburb");
  if (!state.services.some((s) => s.trim())) missing.push("at least one service");
  if (!state.tone) missing.push("tone");

  return (
    <StepLayout
      eyebrow="08 — Last look"
      title="Anything else we should know?"
      lead="Personality, specific requests, follow-ups — all welcome. Then we're off."
    >
      <Field label="Anything else we should know?">
        <Textarea
          rows={4}
          value={state.notes}
          onChange={(e) => update("notes", e.target.value)}
          placeholder="Anything that didn't fit above"
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

      {missing.length > 0 && (
        <div className="rounded-[12px] border border-border bg-warm px-4 py-3 text-[13px] text-text-secondary leading-relaxed">
          These help us build faster (optional): {missing.join(", ")}. You can go back and add them,
          or send as-is and we&apos;ll ask later.
        </div>
      )}

      <label className="flex items-start gap-3 pt-2 text-[13px] text-text-secondary leading-relaxed">
        <input
          type="checkbox"
          checked={state.agreedToTerms}
          onChange={(e) => update("agreedToTerms", e.target.checked)}
          className="w-5 h-5 mt-0.5 accent-primary rounded flex-shrink-0"
        />
        <span>
          I agree to the{" "}
          <button
            type="button"
            onClick={() => setTermsOpen(true)}
            className="text-primary-dark underline underline-offset-2 hover:text-primary"
          >
            service terms
          </button>
          .
        </span>
      </label>

      <TermsModal open={termsOpen} onClose={() => setTermsOpen(false)} />
    </StepLayout>
  );
}
```

- [ ] **Step 2: Typecheck + visual**

Run: `npx tsc --noEmit` → no errors.
Re-screenshot; `desktop-09-review`/`mobile-09-review` (whatever the harness names the final step):
no Copy/Download/markdown block; checkbox toggles; "service terms" opens the modal; Mood row reads
a clean value (e.g. "Earthy"), not `mood:Earthy`.

- [ ] **Step 3: Commit**

```bash
git add components/onboard/StepReview.tsx
git commit -m "feat(onboard): real terms agreement, drop markdown export, add completeness hint"
```

---

### Task F6: SubmittedScreen — real buttons, drop fake briefId

**Files:**
- Modify: `components/onboard/SubmittedScreen.tsx`

- [ ] **Step 1: Remove the fake brief id from the header**

Change the `Props` to drop `briefId` and the header line. Replace:
```tsx
        <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.14em] text-white/50">
          Brief #{briefId} · Submitted {submittedAt.toUpperCase()}
        </span>
```
with:
```tsx
        <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.14em] text-white/50">
          Submitted {submittedAt.toUpperCase()}
        </span>
```
And remove `briefId = "DZ-1042",` from the destructured props + the `briefId?: string` type.

- [ ] **Step 2: Make the buttons real**

Replace the two buttons. Drop "View your brief" (there's no customer-facing brief artefact) and make
the homepage button navigate:
```tsx
          <div className="flex flex-wrap gap-3 mt-9">
            <a
              href="/"
              className="inline-flex items-center justify-center h-12 px-6 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-full transition-colors shadow-[0_6px_18px_rgba(184,103,63,0.25)]"
            >
              Back to homepage
            </a>
          </div>
```

- [ ] **Step 3: Typecheck + visual + commit**

Run: `npx tsc --noEmit` → no errors.
```bash
git add components/onboard/SubmittedScreen.tsx
git commit -m "fix(onboard): real submitted-screen CTA, drop fake brief id"
```

---

## Phase G — Design-review polish (motion + mobile + harness refresh)

### Task G1: Step-transition reveal (reduced-motion safe)

**Files:**
- Modify: `app/onboard/page.tsx`

- [ ] **Step 1: Wrap the step switch in a keyed motion container**

Add imports:
```ts
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
```
Wrap the existing step `switch` JSX (inside `<WizardShell>`), replacing it with:
```tsx
      <StepTransition step={step}>
        {step === 0 && (
          <StepBusinessBasics state={state} dispatch={dispatch} errors={errors} />
        )}
        {step === 1 && <StepDigitalPresence state={state} dispatch={dispatch} />}
        {step === 2 && (
          <StepServices state={state} dispatch={dispatch} errors={errors} />
        )}
        {step === 3 && <StepTargetCustomers state={state} dispatch={dispatch} />}
        {step === 4 && <StepLookFeel state={state} dispatch={dispatch} />}
        {step === 5 && <StepSiteAssets state={state} dispatch={dispatch} />}
        {step === 6 && <StepSuccess state={state} dispatch={dispatch} />}
        {step === 7 && <StepReview state={state} dispatch={dispatch} />}
      </StepTransition>
```
Add this component at the bottom of the file (after `OnboardPage`):
```tsx
function StepTransition({ step, children }: { step: number; children: React.ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.32, ease: [0.23, 1, 0.32, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Typecheck + manual**

Run: `npx tsc --noEmit` → no errors.
Manual: stepping forward/back fades + slides content; with OS "reduce motion" on, it's instant.

- [ ] **Step 3: Commit**

```bash
git add app/onboard/page.tsx
git commit -m "feat(onboard): reduced-motion-safe step transition reveal"
```

---

### Task G2: Mobile "why" line under step titles

**Files:**
- Modify: `components/onboard/_primitives.tsx`, `app/onboard/page.tsx`

- [ ] **Step 1: Add an optional `why` prop to `StepLayout`**

In `_primitives.tsx`, extend `StepLayout`'s signature and render:
```tsx
export function StepLayout({
  eyebrow,
  title,
  lead,
  why,
  maxWidth = 720,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  why?: ReactNode;
  maxWidth?: number;
  children: ReactNode;
}) {
```
After the `<h1>…</h1>` and before `{lead && …}`, add:
```tsx
      {why && (
        <p className="md:hidden font-mono text-[11px] text-text-muted leading-relaxed mb-3">
          {why}
        </p>
      )}
```

> The `md:hidden` keeps this mobile-only; on desktop the same copy already lives in the rail (F4).

- [ ] **Step 2: (Optional, low-value) pass `why` per step**

Each `StepXxx` already hardcodes its `eyebrow`/`title`/`lead`. Passing `why` is optional; the rail
covers desktop. Skip wiring per-step `why` unless quick — the prop existing is enough for now.

- [ ] **Step 3: Typecheck + commit**

Run: `npx tsc --noEmit` → no errors.
```bash
git add components/onboard/_primitives.tsx
git commit -m "feat(onboard): optional mobile why-line on StepLayout"
```

---

### Task G3: Tactile tone + colour-mood selection (subtle lift)

**Files:**
- Modify: `components/onboard/_primitives.tsx`

- [ ] **Step 1: Strengthen `OptionCard` selected/hover feedback**

In `OptionCard`, update the class string so selected cards read as deliberately chosen and hover
lifts a touch more (keeps existing tokens; no new colours):
```tsx
      className={`relative text-left p-5 rounded-[16px] border transition-all duration-200 ease-dorza w-full ${
        selected
          ? "bg-primary-tint border-primary shadow-[0_8px_24px_rgba(184,103,63,0.12)] -translate-y-px"
          : "bg-white border-border hover:border-primary-light hover:-translate-y-0.5 hover:shadow-soft"
      } ${className}`}
```

- [ ] **Step 2: Typecheck + visual + commit**

Run: `npx tsc --noEmit` → no errors.
Re-screenshot Look & feel; confirm tone + colour-mood cards have clearer selected emphasis.
```bash
git add components/onboard/_primitives.tsx
git commit -m "feat(onboard): more tactile OptionCard selected/hover states"
```

---

### Task G4: WelcomeScreen — honest step count + working resume copy

**Files:**
- Modify: `components/onboard/WelcomeScreen.tsx`

- [ ] **Step 1: Update "Nine"→"Eight" and the steps stat**

Change the lead paragraph "Nine short steps." → "Eight short steps." and the stats block
`{ label: "Steps", value: "9" }` → `value: "8"`. Confirm the `onResume`/`hasInProgress` wiring
already renders the "Pick up where I left off" button (it does — no change needed beyond F3 passing
the props).

- [ ] **Step 2: Typecheck + commit**

Run: `npx tsc --noEmit` → no errors.
```bash
git add components/onboard/WelcomeScreen.tsx
git commit -m "fix(onboard): honest 8-step count on welcome screen"
```

---

### Task G5: Refresh the Playwright harness for 8 steps and re-baseline

**Files:**
- Modify: `scripts/onboard-shots.mjs`

- [ ] **Step 1: Update `stepNames` + fillers for the new flow**

Set:
```js
const stepNames = [
  "01-basics",
  "02-digital",
  "03-services",
  "04-customers",
  "05-lookfeel",
  "06-site-assets",
  "07-success",
  "08-review",
];
```
Update the `fillers` array to 8 entries (drop the old separate brand/assets/sections fillers; merge):
```js
const fillers = [
  // 0 basics
  async (p) => {
    await p.getByText("Cafe/Restaurant", { exact: true }).click();
    await p.locator("input").first().fill("Lumen Coffee House");
    await p.getByPlaceholder("0413 902 184").fill("0413 902 184");
    await p.locator("input[type='email']").fill("sam@lumencoffee.com.au");
  },
  // 1 digital
  async (p) => {
    await p.getByRole("button", { name: "Yes", exact: true }).first().click();
  },
  // 2 services
  async (p) => {
    const svc = p.locator("input[placeholder^='Service']");
    await svc.nth(0).fill("Specialty espresso & filter");
    await svc.nth(1).fill("All-day brunch");
  },
  // 3 customers
  async (p) => {
    await p.getByText("Word of mouth", { exact: true }).click();
  },
  // 4 look & feel
  async (p) => {
    await p.getByText("Casual & friendly", { exact: true }).click();
    await p.getByText("Earthy", { exact: true }).click();
  },
  // 5 site & assets
  async () => {},
  // 6 success
  async (p) => {
    await p.locator("textarea").first().fill("25 booking enquiries a month by spring.");
  },
  // 7 review
  async () => {},
];
```

- [ ] **Step 2: Run + inspect**

Run: `node scripts/onboard-shots.mjs` → "ALL DONE".
Open `scripts/_shots/mobile-05-lookfeel.png` (colour mood now 2-up), `desktop-08-review.png`
(no markdown buttons, terms toggles), `mobile-01-basics.png` (collapsed optional details), and the
welcome shots (8 steps). Confirm the desktop rail shows step-specific "why" copy across screens.

- [ ] **Step 3: Commit**

```bash
git add scripts/onboard-shots.mjs
git commit -m "chore(onboard): refresh visual harness for 8-step flow"
```

---

## Phase H — Docs + final verification

### Task H1: Update CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Add a dated note**

Append under a new heading:
```md
## Added by onboard improvements 2026-06-01

### Onboard wizard is now 8 steps
- Order: basics → online presence → services → customers → **Look & feel** → **Your site & assets** → success → review. `StepBrandStyle`, `StepWebsiteSections`, `StepPhotosAssets` were merged into `StepLookFeel.tsx` + `StepSiteAssets.tsx` (old files deleted).
- `TOTAL_STEPS`/`STEPS` live in `app/onboard/page.tsx`; `StepMeta` gained a `why` field used for the desktop rail + optional mobile line.

### Persistence + analytics (client-only, static-export safe)
- `lib/onboardPersistence.ts` — localStorage draft (`dorza:onboard:draft:v1`), SSR-guarded; restored on mount, debounced save, cleared on successful submit. "Pick up where I left off" + the real "Saved" indicator are wired through this.
- `lib/onboardAnalytics.ts` — `trackOnboard()` over `@vercel/analytics`; events only flow in production.

### Data model changes (schema v2)
- `OnboardState`: added `colourMood` (split out of the overloaded `brandKeywords`) and `agreedToTerms`; removed `hasLogo` (logo is now the single `logoStatus`, which gained "Please design one"). `generateMarkdown` `SCHEMA_VERSION` is now `dorza-intake.v2`: `colour_mood` is its own key, `has_logo` is derived from `logoStatus`, `terms_accepted` added.
- Remember the four-place rule when adding fields.

### Removed fakes / fixed
- The non-functional upload dropzone is gone (uploads happen via the `/upload` portal). Review no longer exposes markdown/JSON; the terms checkbox is real and gates submit via `TermsModal.tsx`. Submit failures now surface an error banner and preserve data.
```

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: record 8-step onboard, persistence, schema v2"
```

---

### Task H2: Full verification sweep

- [ ] **Step 1: Typecheck**
Run: `npx tsc --noEmit` → expect no errors.

- [ ] **Step 2: Lint**
Run: `pnpm lint` → expect no new errors/warnings.

- [ ] **Step 3: Production build (static export)**
Run: `pnpm build` → expect a successful `out/` export with `/onboard` and `/` present.

- [ ] **Step 4: Manual click-path (dev)**
With `pnpm dev`:
1. `/onboard` → Start → fill step 1 → header shows "Saved · just now".
2. Refresh mid-wizard → returns to welcome with "Pick up where I left off" → resume restores the step + data.
3. Reach Review → submit is disabled until "I agree to the service terms" is checked; the link opens the modal (ESC + backdrop + X all close it).
4. Force a submit failure (temporarily set `NEXT_PUBLIC_ONBOARD_SUBMIT_URL` to an invalid URL) → error banner shows, data preserved; restore the env var afterward.
5. Successful submit → Submitted screen; "Back to homepage" navigates to `/`; localStorage draft is cleared (DevTools → Application → Local Storage).

- [ ] **Step 5: Final visual baseline**
Run: `node scripts/onboard-shots.mjs` → review all 16 shots for layout regressions at desktop + mobile.

- [ ] **Step 6: Decide on the playwright devDependency**
If the visual harness should not ship: `pnpm remove playwright` and delete `scripts/onboard-shots.mjs` + `scripts/_shots/`. Otherwise leave it for future QA. (Ask the owner.)

---

## Self-review notes (author)

- **Spec coverage:** WS1 persistence → F1/F3/F4; WS2 fakes → C1/F5/F6; WS3 terms → A1–A3/D1/F5; WS4 friction → B1/C1/E1/E2/E3; WS5 robustness+analytics → F2/F3/F4/F5; WS6 polish → F4/G1–G4. Data model + schema → A1–A3. Docs → H1.
- **Gating decision honoured:** no required-field blocking anywhere; only `agreedToTerms` disables submit (F3 `forwardDisabled`).
- **Type consistency:** `colourMood`, `agreedToTerms`, `logoStatus` (+"Please design one"), `HYDRATE` action, `OnboardPhase`, `savedAt`/`submitError` props, `trackOnboard`/`OnboardEvent`, `saveDraft/loadDraft/clearDraft/OnboardDraft` are used consistently across tasks.
- **No unit-test framework** is introduced by design (YAGNI; none exists). Verification is typecheck + lint + build + Playwright visual + scripted manual paths.
```
