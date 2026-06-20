# Dorza — Project Conventions

## Stack
- Next.js 14 (App Router) — static export configured in `next.config.mjs` (`output: 'export'`, `images.unoptimized: true`)
- Tailwind CSS v3 + custom theme in `tailwind.config.ts` (tokens mirrored in `app/globals.css` `:root`)
- TypeScript strict mode
- framer-motion for all motion (no CSS keyframes for elements already wrapped in framer-motion)
- Lucide React for icons
- Google Fonts via `next/font`: Plus Jakarta Sans (body 400/500/600/700) + Instrument Serif (display 400)

## Design tokens (current — terracotta + sage editorial palette)
- Primary (terracotta): `#D4845A` · light `#E8A87C` · dark `#B8673F` · tint `#FBEDE3` — buttons, CTAs, accents
- Accent (sage): `#6B8F71` · light `#A4C2A8` · dark `#4A6B4E` · tint `#E8EFE9` — eyebrow labels, secondary highlights
- Dark: `#1A1A2E` — headings, dark sections (WaitlistCTA), footer
- Surface: `#F9F7F5` · Warm: `#FDFAF7` · Border: `#F0EBE4`
- Text: primary `#1A1A2E` · secondary `#555` · muted `#888`
- Status: `#24CB71`
- Radius: `rounded-card` 20px · `rounded-btn` / `rounded-full` 999px · `rounded-sm` 8px
- Shadows: `shadow-soft` (1px hairline), `shadow-medium` / `shadow-card` (`0 12px 32px rgba(26,26,46,0.08)`)
- Easing: `ease-dorza` = `cubic-bezier(0.23, 1, 0.32, 1)` (also exported as `DORZA_EASE` from `components/motion/Reveal`)

## Component patterns
- All CTAs: pill-shaped (`rounded-full`), `h-12`, `bg-primary hover:bg-primary-dark text-white font-semibold text-sm`, hover `-translate-y-px hover:shadow-medium`
- Secondary buttons: `bg-white border border-border text-dark hover:bg-surface hover:border-[#E5DFD6]`
- Section spacing: `py-20 md:py-[7.5rem]` (use `md:py-[10rem]` for the dark waitlist section)
- Container: `<Container>` from `components/ui/Container` (max width 1200px, px-5)
- Cards: `bg-white border border-border rounded-card p-6` with `hover:shadow-medium hover:-translate-y-1 transition-all duration-500 ease-dorza`
- Headings: `font-display` (Instrument Serif), `text-dark`, tight tracking (`tracking-[-0.02em]` to `-0.03em`)
- Body: `font-body` (Plus Jakarta Sans), `text-text-secondary`, `leading-relaxed`
- Eyebrow label (recurring): `font-mono text-[11px] uppercase tracking-[0.18em] text-accent` — used above section headings
- Section heading (recurring): `font-display text-[44px] md:text-[60px] leading-[1.02] tracking-[-0.025em] text-dark`
- Always pair token changes in `tailwind.config.ts` with the matching CSS variable in `app/globals.css` `:root`

## Motion
- Wrap scroll-in content in `<Reveal>` (or `<Reveal stagger>`) from `components/motion/Reveal.tsx`. Default `y=24`, `duration=0.6`, `ease-dorza`, `viewport={{ once: true, margin: "-100px" }}`
- Use `<SlideReveal>` for horizontal slide-ins, `useCountUp(value, inView)` for animated number reveals
- Always honour `useReducedMotion()` — Hero and Reveal both do this
- Don't introduce CSS keyframe animations for elements already wrapped in framer-motion
- Available named keyframes (for non-framer cases): `float`, `marquee`, `pulse-ring`, `breathe`, `bounce-gentle`, `pulse-subtle`

## File conventions
- Section components in `components/sections/`, primitives in `components/ui/`, motion wrappers in `components/motion/`
- Wizard lives in `components/onboard/`: `WizardShell.tsx` (chrome), `WelcomeScreen.tsx`/`SubmittedScreen.tsx` (bookends), `StepXxx.tsx` (one per step), `_primitives.tsx` (shared step UI library)
- One component per file, PascalCase
- Pages in `app/`, use `page.tsx`
- Shared types in `lib/types.ts`
- All images in `public/images`
- No barrel exports, direct imports only

## Forms and data flow
- All form submissions go through `submitForm(endpoint, data)` in `lib/api.ts` (real `fetch`, returns `{ success }`)
- Submission endpoints are **Supabase Edge Functions** (Deno), exposed as `NEXT_PUBLIC_*_URL` env vars. Next.js API route handlers won't work — the app is a static export. Don't change `submitForm`'s signature; many components call it.
- Controlled inputs only. Manual field-by-field validation (no validation library).

## SEO
- Every page needs metadata export with title, description, openGraph
- Use semantic HTML (main, section, article, nav, footer)
- All images need alt text
- Structured data (JSON-LD) for Organization in `app/layout.tsx`; LocalBusiness on homepage when added

## Build, run, deploy
- Dev: `npm run dev`
- Build: `npm run build` (produces static `out/` because of `output: 'export'`)
- Lint: `npm run lint`
- No tests configured
- Deploy: push to Vercel (no CI configured yet)

## Known gaps to be aware of
- `components/Footer.tsx` and `components/Nav.tsx` at the top level are dead code (zero imports) — homepage uses the `components/sections/` versions. Safe to delete.
- Design tokens are duplicated in `tailwind.config.ts` and `app/globals.css` — change both together
- See `CODEBASE_INDEX.md` "Gaps and notable findings" for the full current list (validation disabled, no error UX on /onboard submission failure, etc.)

## Added by codebase-onboarding 2026-05-09

### Onboarding wizard architecture
- `app/onboard/page.tsx` is the single owner of `useReducer(reducer, initialState)`, the phase state (`"welcome" | "wizard" | "submitted"`), the step index, and `validate(currentStep)`. All wizard behaviour flows through here.
- Step components are **dumb** — they receive `{ state, dispatch, errors }` and compose UI from `_primitives.tsx`. They don't own state, they don't validate, they don't render their own chrome.
- **Shared step UI lives in `components/onboard/_primitives.tsx`** — `StepLayout`, `Field`, `FieldGrid`, `Input`, `Textarea`, `Chip`, `ChipRow`, `OptionCard`, `OptionGrid`, `Toggle`, `Eyebrow`, `MonoBadge`, `SectionRule`, `stepEyebrow()`. When adding wizard UI, **extend these primitives** rather than introducing ad-hoc inputs inside a `StepXxx.tsx`.
- Wizard chrome (top bar, sidebar stepper, mobile dot progress, bottom nav with progress bar) is in `WizardShell.tsx`. Don't duplicate any of it inside step components.
- Adding a new field to `OnboardState` requires updates in **four** places: `lib/types.ts`, `initialState` in `app/onboard/page.tsx`, the relevant `StepXxx.tsx`, and `lib/generateMarkdown.ts`.

### Validation
- `validate()` in `app/onboard/page.tsx` is **currently a no-op** (returns `true`, clears errors) — per-step gating was disabled in commit `d06b0ba`. If re-enabling, do it in `validate()`; don't move validation into step components.

### Removed
- The old `/app/onboarding` route and `components/DorzaOnboarding.tsx` (inline-styled monolith) are gone. `/onboard` is canonical — do not recreate the alternate.

## Added by codebase-onboarding 2026-05-17

### Backend: Supabase
- Postgres + Auth + Storage + Edge Functions (Deno). Frontend stays static-export; all dynamic behaviour lives in Supabase.
- Shared browser client in `lib/supabase.ts` (anon key). Has a placeholder fallback so `next build` doesn't fail without env vars — real values required at runtime.
- DB migrations live in `supabase/migrations/`, ordered by filename timestamp. **Additive only** — never edit a migration that's been run in prod.
- Two edge functions in `supabase/functions/`:
  - `onboard-submit` (public) — receives `{ state, markdown }` from `/onboard`, inserts into `onboard_submissions`, emails admin (intake.md attached) + client via Gmail SMTP (denomailer)
  - `create-client-user` (admin-JWT-gated) — invoked from `/admin`; verifies caller email is in `ADMIN_EMAILS`, calls `auth.admin.generateLink` (invite, falls back to magiclink), emails branded portal link, marks submission `provisioned`
- Edge function conventions: `Deno.serve`, ESM imports from `esm.sh` / `deno.land/x`, CORS headers inline, bracketed `console.log` tags (`[onboard-submit] ...`) for filtering in Supabase logs.

### Auth and access control
- Admin: password sign-in via `supabase.auth.signInWithPassword`. Gate is `session.user.email === 'dorza.app@gmail.com'` (client-side) **plus** the same check inside `create-client-user` (server-side). RLS allows admin read via the `is_admin()` SECURITY DEFINER function joining `admin_users` to `auth.users`.
- Clients: magic-link via `supabase.auth.signInWithOtp({ shouldCreateUser: false })`. Accounts are created server-side by the admin clicking "Create User"; clients never self-register.
- **Admin email is duplicated in 3 places** — `ADMIN_EMAIL` in `app/admin/page.tsx`, `ADMIN_EMAILS` in `supabase/functions/create-client-user/index.ts`, and the seed row in `20260516000000_admin_and_storage.sql`. Keep them in sync if changing.

### Pages added
- `/admin` — submissions dashboard. Expandable rows show markdown + signed URLs for `assets/{user_id}/logo` and `assets/{user_id}/photos` (1h expiry). "Create User" button on `pending` rows.
- `/upload` — client asset portal. Uploads to `assets/{user_id}/logo/logo.{ext}` (upsert) and `assets/{user_id}/photos/{timestamp}.{ext}`. RLS scopes clients to their own folder.

### Environment variables
Frontend (Vercel + `.env.local`): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_ONBOARD_SUBMIT_URL`, `NEXT_PUBLIC_CREATE_CLIENT_USER_URL`. Edge function secrets (Supabase dashboard): `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `SITE_URL`. See `env.local.example` and `supabase/README.md`.

### Package manager
- pnpm (`pnpm-lock.yaml` is the source of truth). `npm` scripts still work but prefer `pnpm dev` / `pnpm build` / `pnpm lint`.

### Onboard submission flow (current)
- Step 9 "Submit my brief" → `submitForm(NEXT_PUBLIC_ONBOARD_SUBMIT_URL, { state, markdown })` → edge function persists + emails → frontend flips to `submitted` phase → `SubmittedScreen` ("Brief received, contact in 72h" + timeline). The markdown is no longer offered as a customer download — it's the server-side artifact emailed to admin.
- **No client-side error UX on submit failure** — if the edge function returns `{ success: false }`, the wizard just clears `submitting` and stays on Review. If editing, consider mirroring the toast pattern from `/admin` and `/upload`.

## Client website builds (future)
- Each client site is a separate repo generated from templates in `/templates`
- Client intake markdown goes in the repo root as `intake.md`
- Claude Code reads `intake.md` + this file to build the site
- Always generate: sitemap.xml, robots.txt, JSON-LD LocalBusiness schema
- Default font pairings by business type:
  - Tradie: Inter + Cabinet Grotesk (clean/tough)
  - Cafe: DM Sans + Fraunces (warm)
  - Salon: Outfit + Playfair Display (elegant)
  - Fitness: Space Grotesk + Syne (bold)
  - Retail: DM Sans + Fraunces (friendly)
  - Professional: Inter + Newsreader (trustworthy)
- Default colour palettes by business type:
  - Tradie: navy `#1B2A4A` + orange `#E8742A`
  - Cafe: warm brown `#5C3D2E` + sage `#7A9E7E`
  - Salon: blush `#E8B4B8` + gold `#C4A35A`
  - Fitness: black `#1A1A1A` + lime `#A8D83A`
  - Retail: charcoal `#2D2D2D` + coral `#E8745A`
  - Professional: navy `#1A2744` + teal `#2A9D8F`
- Mobile-first, test at 375px width
- Lighthouse targets: Performance 90+, Accessibility 95+, SEO 95+
- Phone numbers must be clickable `tel:` links
- Google Maps embed on every contact section

## Prompt patterns for content generation
- When generating website copy, use the intake.md fields directly — don't invent details
- Headlines: short, benefit-driven, max 8 words
- Subheadlines: one sentence, conversational, mentions location
- Service descriptions: 2 sentences max, focus on outcome not process
- CTAs: action-oriented verbs ("Get a free quote", "Book now", "See our menu")

## Added by feature work 2026-05-18 — Enquiry pathway

### One enquiry pathway, two surfaces
- The homepage waitlist is now the **primary entry point**. Two visual surfaces, one backend pipe:
  - **Inline:** `components/sections/WaitlistCTA.tsx` (anchor `#waitlist`, dark editorial section). Source = `'inline'`.
  - **Modal:** `components/ui/EnquiryModal.tsx` (light dialog, focus trap, ESC close, body scroll lock). Source = `'modal'`. Triggered from Nav CTA (desktop + mobile) and FAQ "Talk to us".
- Both render the same fields via `components/forms/EnquiryFormFields.tsx` with a `theme: 'dark' | 'light'` prop. **When adding/changing fields, edit `EnquiryFormFields` once** — both surfaces update.
- Submission flow: `useEnquirySubmit()` → `submitForm(NEXT_PUBLIC_ENQUIRY_SUBMIT_URL, EnquiryFormData)` → `enquiry-submit` Edge Function → inserts into `enquiries` + sends admin email + confirmation email.

### Services multi-select
- `lib/constants.ts` exports `SERVICE_OPTIONS` (5 options including "Not sure yet" as the safety valve). Stored in `enquiries.services_interested text[]`. To add/rename a service: edit `SERVICE_OPTIONS` only — chips + admin view + edge function payload all flow from it.

### `/onboard` is unlinked from the public funnel
- All public CTAs go to the waitlist (inline anchor) or open `EnquiryModal`. `/onboard` is **kept live** for admins to share with qualified leads only. Its layout has `robots: { index: false, follow: false }`.
- Do **not** add public links back to `/onboard`. If a new CTA appears, point it at the modal or `#waitlist`.

### Admin email source of truth (revised)
- Frontend gate uses `ADMIN_EMAIL` from `lib/constants.ts`.
- Both `enquiry-submit` and `onboard-submit` read `ADMIN_NOTIFICATION_EMAIL` from Supabase secrets (with `dorza.app@gmail.com` fallback). **Set this secret in Supabase.**
- `create-client-user` still has a hardcoded `ADMIN_EMAILS` array — that's the JWT auth gate, separate concern.
- Migration seed in `20260516000000_admin_and_storage.sql` is canonical for the `admin_users` row. Changing the admin = update `lib/constants.ts` + the Supabase env secret + the `ADMIN_EMAILS` array in `create-client-user` + a new migration to update the seed row.

### New: `enquiries` table
- Migration `20260518000000_enquiries.sql`. Columns: id, created_at, name, email, business_type, suburb, services_interested (text[]), message, source (`inline|modal`), status (`new|contacted|converted|archived`), state_json.
- RLS: admin SELECT + UPDATE via existing `is_admin()`. Edge function inserts via service role (bypasses RLS).

### Admin dashboard tabs
- `app/admin/page.tsx` now has tabs: **Enquiries** (default) and **Submissions**. Enquiries table expands to show services chips + message; row actions: Mark Contacted → Mark Converted → Archive (status pipeline).

### Honeypot spam protection
- `EnquiryFormFields` renders an off-screen, aria-hidden `website` field. The edge function silently discards any submission where it's non-empty. If we get spammed past this, add Cloudflare Turnstile next.

## Git
- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`
- Commit after each major component, not one giant commit

## When in doubt
- See `CODEBASE_INDEX.md` for the directory map and "task → location" guide
- For multi-file or cross-cutting changes, propose first, then implement

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

## Added by chatbot feature 2026-06-19

### AI chatbot for client websites
- `supabase/functions/chat-respond/index.ts` — Edge function that orchestrates Claude API (Haiku 4.5) with tool use. Receives `{ clientId, messages }`, loads business context from `onboard_submissions.state_json`, calls Claude with two tools (`check_availability`, `create_booking`), runs the tool use loop server-side (max 5 rounds), returns `{ reply }`.
- `check_availability` queries the `bookings` table directly (same logic as `booking-availability`). `create_booking` calls `booking-submit` via internal HTTP to reuse validation + email logic.
- The chat widget is a self-contained client component (no Dorza internal deps). Bootstrapping instructions in `claude-for-clients/CHATBOT.md`.
- Widget props: `clientId` (required), `businessName`, `accentColor`. Reads `NEXT_PUBLIC_DORZA_CHAT_URL` and `NEXT_PUBLIC_DORZA_ANON_KEY`.
- Requires `ANTHROPIC_API_KEY` as a Supabase secret (server-side only, never exposed to client).
- Conversations are stateless — full message history sent each request. Rate limited to 40 messages (20 exchanges) per session.
- System prompt is built dynamically from the client's onboard intake data (business name, type, services, location, hours, differentiator).
