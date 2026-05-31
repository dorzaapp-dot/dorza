# Onboard Experience Improvements — Design Spec

_Date: 2026-06-01 · Status: approved for planning · Route: `/onboard`_

## 1. Goal

Reduce friction / drop-off in the `/onboard` wizard **while still extracting everything the
downstream build needs on the first pass.** The generated `intake.md` is the source of truth that
Claude skills use to build each client site, so data completeness is a hard constraint, not a
nice-to-have. The tension we are solving: friction ↓ without completeness ↓.

Secondary: stop the form making promises it doesn't keep (fake save, fake upload, broken terms),
and lift the desktop + mobile experience with a focused design-review polish pass — without losing
the existing editorial identity.

## 2. Non-goals / out of scope

- **No backend / edge-function changes.** Submission still goes through `submitForm(NEXT_PUBLIC_ONBOARD_SUBMIT_URL, { state, markdown })`.
- **No real file upload in the wizard.** Asset uploads are handled later via the Supabase `/upload`
  portal link. The wizard only captures asset *status*.
- **No field-level gating / required-field blocking.** Per decision, completeness is encouraged via
  smart defaults, type-aware suggestions, and good prompts — not enforced. The *only* thing that
  gates submission is the terms agreement (legal, separate concern).
- **The look/feel discovery question set is deferred** (owner will revisit). The merged "Look & feel"
  step keeps the existing fields, de-collided.
- No change to `submitForm`'s signature.

## 3. Constraints (from CLAUDE.md)

- Next.js 14 App Router, **static export** (`output: 'export'`) — all persistence is client-side
  (`localStorage`), every `window`/`localStorage` access must be SSR-guarded.
- **pnpm** is the source of truth. Tailwind v3 + design tokens duplicated in `tailwind.config.ts`
  and `app/globals.css` (change together). framer-motion for motion; honour `useReducedMotion()`.
  lucide-react icons. **No shadcn / phosphor / sonner** in this project (bencium skill defaults do
  not apply) — extend `components/onboard/_primitives.tsx`, don't introduce a new UI kit.
- Adding a field to `OnboardState` requires updates in **four** places: `lib/types.ts`,
  `initialState` in `app/onboard/page.tsx`, the relevant `StepXxx.tsx`, and `lib/generateMarkdown.ts`.
- Error/toast UX should mirror the existing pattern in `app/admin` and `app/upload`.

## 4. New step structure (9 → 8)

| # | Step | Change |
|---|------|--------|
| 1 | **The basics** | Lead with business name / your name / type / niche / suburb / email / phone. **ABN + street address + opening hours collapse into an "A few more details (optional)" disclosure** at the bottom. ABN reframed as billing-stage, not build-critical. |
| 2 | **Online presence** | Unchanged. |
| 3 | **What you offer** | Services become **type-aware suggested chips** (tap to add, edit freely) replacing the 4 blank inputs. Differentiator + price unchanged. |
| 4 | **Who you serve** | Unchanged. |
| 5 | **Look & feel** *(merged)* | Logo question (single source — see §5), brand colours, tone, **colour mood (its own field)**, three words, inspiration sites, **+ the site-vision description moved up from the old Sections step.** |
| 6 | **Your site & assets** *(merged)* | Website section toggles (+ booking / e-comm conditionals) + "anything else on the site" + photos / menu / testimonials statuses (+ specific testimonials, photo notes). **Fake upload dropzone removed.** Logo is NOT here (now in step 5). |
| 7 | **What success looks like** | Unchanged. |
| 8 | **Review** | Friendly summary only (**markdown / JSON / copy / download removed**), **working terms agreement** (real checkbox + real terms, gates submit), submit-error UX, optional non-blocking completeness hint. |

The merge that delivers 8 steps: old **Brand** absorbs the site-vision description → "Look & feel";
old **Assets** + old **Sections** combine → "Your site & assets" (both are build logistics).
Renumbering touches the `STEPS` array, the `switch` in `page.tsx`, and every step's `eyebrow`
("01 — …" through "08 — …").

## 5. Data model changes

In `lib/types.ts` (`OnboardState`) + the other three update sites:

- **Add `colourMood: string`** — colour mood is now its own field. Fixes the collision where the
  colour-mood cards and the "three words" box both wrote `brandKeywords` (mangling each other and
  leaking `mood:Earthy` into the field *and* the customer Review summary).
- **`brandKeywords`** reverts to **only** the three descriptive words.
- **Add `agreedToTerms: boolean`** — real terms agreement state.
- **Remove `hasLogo`**; make **`logoStatus`** the single logo source. Extend its enum to include a
  "Please design one" option (covers the old `hasLogo: "No — please design one"`). Collected in the
  Look & feel step.

## 6. `lib/generateMarkdown.ts` changes

- Frontmatter: add `colour_mood`, derive `has_logo` from `logoStatus`, add `terms_accepted`.
- `bodyBrand`: add a `colour_mood` row; move `logo_status` here (it's collected in Look & feel now);
  `brand_keywords` is clean three-words only.
- `bodyAssets`: photos / menu / testimonials only (logo removed).
- **Bump `SCHEMA_VERSION` to `dorza-intake.v2`** and add a migration note in CLAUDE.md. This is a
  rename-level change: `brand_keywords` no longer carries `mood:*` tags; `colour_mood` is the new
  home. Downstream agent briefs that read brand keywords get *cleaner* input.

## 7. Workstreams

### WS1 — Persistence (stop the data loss)
- New `lib/onboardPersistence.ts`: load/save/clear helpers, SSR-guarded, key
  `dorza:onboard:draft:v1`, payload `{ state, step, phase, savedAt }`.
- `page.tsx`: hydrate from draft on mount; debounced save (~500ms) on `state`/`step`/`phase` change;
  clear draft on successful submit and on an explicit "start fresh".
- Wire the **existing** `hasInProgress` / `onResume` props on `WelcomeScreen` (draft present →
  show "Pick up where I left off"; "Start onboarding" begins fresh and clears any draft).
- Pass a **real `savedAt`** to `WizardShell` so "Saved · just now" reflects reality (and shows on
  mobile too).

### WS2 — Remove the fakes
- Delete the upload dropzone in `StepPhotosAssets.tsx` (lines ~102–117).
- Remove "Copy markdown", "Download .md", and the raw "View full brief (markdown)" block from
  `StepReview.tsx`.
- Fix `SubmittedScreen.tsx`: "Back to homepage" → `/`; remove or repoint "View your brief"; remove
  the hardcoded `briefId` ("DZ-1042") or generate a real, non-misleading reference.

### WS3 — Terms that work
- Add `agreedToTerms` (4-place update).
- Add a real terms surface: **`components/onboard/TermsModal.tsx`** mirroring the focus-trap /
  scroll-lock pattern of `components/ui/EnquiryModal.tsx` (keeps the user in-flow). Content is a
  baseline service-terms draft, clearly flagged in-page as pending the owner's final legal wording.
- Replace the broken checkbox (`checked={!!state.notes}` `readOnly`, `href="#"`) with a real
  controlled checkbox bound to `agreedToTerms` and a link that opens `TermsModal`.
- **Disable "Submit my brief" until `agreedToTerms` is true.** (This is the one allowed gate.)

### WS4 — Friction restructure
- Lighten Step 1 (optional-details disclosure; demote ABN/address/hours).
- Merge to the 8-step structure in §4 (renumber, move site-vision, combine assets + sections).
- **Type-aware suggested-service chips**: extend the existing business-type-default pattern (the one
  `getDefaultSections` uses) with a per-type suggested-services map; render selectable chips that add
  to the `services` array, still freely editable. Keep "Add another" for custom entries.
- Split `colourMood` out of `brandKeywords`; consolidate logo to `logoStatus`.

### WS5 — Robustness + measurement
- **Submit error UX**: add an error state in `page.tsx`; on `{ success: false }` or a thrown error,
  surface an inline alert (mirror admin/upload toast pattern), preserve all entered data, allow
  retry. Today it silently sits on Review.
- **Analytics**: new `lib/onboardAnalytics.ts` wrapping `track` from `@vercel/analytics` (already a
  dependency). Fire `onboard_start`, `onboard_step_view`, `onboard_step_next/back`, `onboard_resume`,
  `onboard_submit_attempt/success/error`, and best-effort `onboard_abandon`
  (`visibilitychange`/`beforeunload`). No-ops safely in dev. Gives real drop-off data for the next
  iteration.
- **Optional, non-blocking completeness hint** on Review: a gentle "these help us build faster:
  <blank build-critical fields>" note. Easy to cut if it reads naggy.

### WS6 — Design-review polish (desktop + mobile)
From the rendered walkthrough (Playwright, 1280px + 390px):
- **Contextual left rail**: replace the static "Let's get your business online." (repeated on all
  screens) with per-step "why this matters" copy, driven from the `STEPS` meta. On mobile (rail
  hidden), surface a compact per-step "why" line under the `StepLayout` title (new optional prop).
- **Real "Saved" state** (from WS1) — and make it visible on mobile, where today there's no save
  reassurance at all.
- **Tactile tone + colour-mood selectors** — these are the most brand-expressive moment in the form;
  give them a subtle lift/scale on hover + a crafted selected state (framer-motion, reduced-motion
  safe).
- **Mobile colour-mood grid**: 2-up on mobile instead of 6 full-width stacked cards (long scroll).
- **Step-transition reveal**: keyed framer-motion fade/slide-up on step change; honour
  `useReducedMotion()`.
- **Review + Submitted character**: remove the developer-facing markdown artefacts (WS2), keep the
  warm "brief at a glance" summary, and give the Submitted screen a finished, on-brand payoff.

## 8. File touch list (indicative)

- `lib/types.ts` — `OnboardState` (+`colourMood`, +`agreedToTerms`, −`hasLogo`, extend `logoStatus`).
- `app/onboard/page.tsx` — `initialState`, `STEPS` (8 + rail copy), step `switch`, persistence,
  analytics, submit error state, resume/start-fresh.
- `lib/generateMarkdown.ts` — frontmatter + brand/assets bodies, `SCHEMA_VERSION` → v2.
- `lib/onboardPersistence.ts` — **new**.
- `lib/onboardAnalytics.ts` — **new**.
- `components/onboard/WizardShell.tsx` — real saved state, contextual rail copy.
- `components/onboard/WelcomeScreen.tsx` — wire resume.
- `components/onboard/_primitives.tsx` — `StepLayout` "why" prop; suggested-chip + tactile-card tweaks.
- `components/onboard/StepBusinessBasics.tsx` — optional-details disclosure.
- `components/onboard/StepServices.tsx` — suggested-service chips.
- `components/onboard/StepBrandStyle.tsx` → **becomes the "Look & feel" step** (logo + colourMood +
  site-vision moved in).
- `components/onboard/StepPhotosAssets.tsx` + `StepWebsiteSections.tsx` → **merge into "Your site &
  assets"**; remove fake upload.
- `components/onboard/StepReview.tsx` — strip markdown export, real terms, completeness hint.
- `components/onboard/SubmittedScreen.tsx` — real buttons, drop fake briefId.
- `components/onboard/TermsModal.tsx` — **new**.
- `app/terms/` (optional, if a standalone page is preferred over the modal) — noindex like onboard.
- `CLAUDE.md` — schema v2 migration note + 8-step structure update.
- `scripts/onboard-shots.mjs` — visual-test harness (already added); keep for before/after QA.

## 9. Risks / open items

- **Terms copy is a placeholder** pending the owner's real legal wording — flagged in-page.
- **Schema v2** assumes downstream agents tolerate the `brand_keywords` → `colour_mood` split (they
  should; it's cleaner). Note in CLAUDE.md.
- Vercel Analytics custom events only flow in production with the Analytics component mounted
  (it is) — dev shows nothing, which is expected.
- `playwright` was added as a devDependency for the review harness; remove if undesired.
