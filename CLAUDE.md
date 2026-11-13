# Dorza — Project Conventions

## Stack
- Next.js 14 (App Router) — static export configured in `next.config.mjs` (`output: 'export'`, `images.unoptimized: true`)
- Tailwind CSS v3 + custom theme in `tailwind.config.ts` (tokens mirrored in `app/globals.css` `:root`)
- TypeScript strict mode
- framer-motion for all motion (no CSS keyframes for elements already wrapped in framer-motion)
- Lucide React for icons
- Google Fonts via `next/font`: Plus Jakarta Sans (body 400/500/600/700) + Instrument Serif (display 400)

## Design tokens (v7, "tightened sage")
- Source of truth: `app/globals.css` (CSS variables) and `tailwind.config.ts`. Spec: `docs/superpowers/specs/2026-11-12-dorza-reposition-design.md`.
- Use the v7 names in new code: `forest`, `pine`, `moss`, `sage`, `haze`, `paper`, `chalk`, `stone`, `linen`, `claret`, `ochre`, `ink`, `ink-soft`, `ink-mute`, `rule`, `rule-soft`.
- `primary`, `accent`, `dark`, `surface`, `warm`, `border`, `text-*` and `status` still work as aliases for onboarding, admin and upload. Do not use them in new code.
- 2px corners, hairline rules, no gradients, no glows, shadows at 12% or less. One accent per screen: claret on light, ochre on forest.
- Fonts: Newsreader (display), Geist (body), Geist Mono (markers, status, prices, URLs, nav).

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
- See `CODEBASE_INDEX.md` "Gaps and notable findings" for the full current list (validation disabled, no error UX on /onboard submission failure, etc.). **`CODEBASE_INDEX.md` itself is stale as of 2026-09-21** — it predates the contact, booking, chatbot and admin-workspace features. Trust this file over it where they disagree.

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

**Superseded — see "Environment variables (current)" at the end of this file.** More `NEXT_PUBLIC_*` endpoint vars and edge secrets have been added since.

### Package manager
- pnpm (`pnpm-lock.yaml` is the source of truth). `npm` scripts still work but prefer `pnpm dev` / `pnpm build` / `pnpm lint`.

### Onboard submission flow (current)
- Step 9 "Submit my brief" → `submitForm(NEXT_PUBLIC_ONBOARD_SUBMIT_URL, { state, markdown })` → edge function persists + emails → frontend flips to `submitted` phase → `SubmittedScreen` ("Brief received, contact in 72h" + timeline). The markdown is no longer offered as a customer download — it's the server-side artifact emailed to admin.
- **No client-side error UX on submit failure** — if the edge function returns `{ success: false }`, the wizard just clears `submitting` and stays on Review. If editing, consider mirroring the toast pattern from `/admin` and `/upload`.

## Client website builds (future)
- Each client site is a separate repo. **There is no `/templates` directory in this repo** — that was aspirational and was never created. Start client sites from scratch or from an existing client repo.
- Client intake markdown is **not** hand-placed. `onboard-submit` pushes it to a GitHub repo at `outputs/user-profile-<submission-id>-<timestamp>.md` (see "Intake markdown → GitHub" below). Copy it into the client repo as `intake.md` when starting a build.
- Claude Code reads `intake.md` + this file to build the site
- To bolt Dorza's shared backend features onto a client site, follow the drop-in guides in `claude-for-clients/` (contact form, booking form, chat widget) — see "Client site drop-ins" below.
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
- `generate-brand-guidelines` reads a **`ADMIN_EMAIL`** secret (singular, `dorza.app@gmail.com` fallback) for its own JWT gate. That's a **fifth** location — keep it in sync too.
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
- The chat widget is a self-contained client component (no Dorza internal deps). Bootstrapping instructions in `claude-for-clients/CHATBOT-BOOTSTRAP.md`.
- Widget props: `clientId` (required), `businessName`, `accentColor`. Reads `NEXT_PUBLIC_DORZA_CHAT_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Requires `ANTHROPIC_API_KEY` as a Supabase secret (server-side only, never exposed to client).
- Conversations are stateless — full message history sent each request. Rate limited to 40 messages (20 exchanges) per session.
- System prompt is built dynamically from the client's onboard intake data (business name, type, services, location, hours, differentiator).

## Added by doc catch-up 2026-09-21

Everything below landed on `master` between 2026-06-02 and 2026-08-17 but was never written down. Dates are when the work merged.

### The two audiences — read this first
The repo now serves **two different products** and it's easy to confuse them:

1. **Dorza's own marketing site** — homepage, `/about`, `/contact`, `/services/*`, `/industries/*`, `/areas/*`, `/website-cost`, `/onboard`, `/admin`, `/upload`. Uses the terracotta/sage design system, `Reveal`, `Container`, all the conventions above.
2. **Client websites** — separate repos, built per client. They talk to Dorza's Supabase as a **shared central hub**: every client's contact messages, bookings and chat traffic land in the *same* tables, partitioned by `client_id`.

`client_id` is **always the `onboard_submissions.id` UUID, as text.** Every client-facing edge function resolves the recipient's email by looking that row up. There is no separate clients table.

### Client site drop-ins (`claude-for-clients/`)
Three self-contained instruction docs, each telling Claude Code how to add one feature to a client repo. The components live here as the reference implementation and are copied out — they have **zero Dorza internal imports** by design (no `Container`, no `Reveal`, no `cn`). Keep it that way when editing them.

| Doc | Component | Edge function(s) |
|---|---|---|
| `CLIENT-CONTACT-FORM.md` | `components/forms/ContactForm.tsx` | `contact-submit` |
| `BOOKING-FORM.md` | `components/forms/BookingForm.tsx` | `booking-submit`, `booking-availability` |
| `CHATBOT-BOOTSTRAP.md` | `components/ChatWidget.tsx` | `chat-respond` |

Each is exercised in-repo by a demo page under `app/demo/` (`/demo/contactus`, `/demo/booking`, `/demo/chatbot`), all driven by a **`?clientId=<uuid>` query param** — they render a "missing clientId" notice without one. These pages are dev harnesses, not marketing pages.

### Contact form for client sites (2026-06-12)
- Table `contact_messages` — migration `20260602000000_contact_messages.sql`. Columns: id, created_at, `client_id text`, source (default `contact-form`), name, email, phone, message, metadata jsonb, raw_payload jsonb. Indexed on `(client_id, created_at desc)`.
- RLS: admin SELECT + UPDATE via `is_admin()`. No insert policy — the edge function writes with the service role.
- `contact-submit` requires `clientId`, `name`, `email`; resolves the business owner's email from `onboard_submissions.email` and emails **the client, not Dorza**. Same off-screen `website` honeypot as the enquiry form. All interpolated values go through a local `escapeHtml()` — **keep that up** when editing the email template.
- `ContactForm` props: `{ clientId, endpoint, source = 'contact-form' }`.

### Booking system for client sites (2026-06-19)
- Table `bookings` — migration `20260612000000_bookings.sql`. Columns: id, created_at, `client_id text`, booking_date date, booking_time time, name, email, phone, message, status (`pending|confirmed|cancelled`, default `pending`), metadata, raw_payload.
- **Double-booking is prevented in the database**, not the UI: a partial unique index `bookings_slot_unique on (client_id, booking_date, booking_time) where status != 'cancelled'`. `booking-submit` catches Postgres error `23505` and returns **HTTP 409** so the form can tell the user the slot just went. Don't re-solve this race in application code — the constraint is the mechanism.
- `booking-availability` is a **GET** with `?client_id=&date=YYYY-MM-DD`, returning `{ bookedSlots: ["09:00", ...] }` — it normalises Postgres `HH:MM:SS` down to `HH:MM`. Every other edge function is a POST; this one isn't.
- `booking-submit` emails both sides: the business owner ("New booking…") and the customer ("Booking confirmed…").
- `TIME_SLOTS` is a **hardcoded array at the top of `BookingForm.tsx`** — not per-client configurable yet. Changing a client's hours means editing their copy of the component.
- `BookingForm` props: `{ clientId, submitEndpoint, availabilityEndpoint }`.

### Admin workspace (2026-06-02)
- `app/admin/workspace/page.tsx`, reached from a submission row in `/admin` via `/admin/workspace?id=<submission-id>`. Not a tab — a separate route. Gated client-side on `session.user.email === ADMIN_EMAIL`, redirects to `/admin` otherwise.
- A per-client "getting started" checklist with two tasks:
  - **Domain Search** — `generateCandidates()` builds variants from the business name, then checks each against **`https://rdap.org/domain/<domain>` directly from the browser** (no API key, no backend). A 404 from RDAP means available. Runs sequentially with per-domain status badges.
  - **Google Business Profile** — opens a Google Maps search in a new tab and asks the admin to self-report found/not-found. Deliberately manual; there is no GBP API call.
- **Brand guidelines** — the `generate-brand-guidelines` edge function calls the Claude API with the submission's `state_json` and returns a markdown brand guide (currently `model: "claude-sonnet-4-6"`, `max_tokens: 1500`). Gated on the caller's JWT email matching its own `ADMIN_EMAIL` secret. Frontend reads `NEXT_PUBLIC_GENERATE_BRAND_GUIDELINES_URL`.

### Intake markdown → GitHub (in `onboard-submit`)
- After inserting the submission and sending emails, `onboard-submit` PUTs the intake markdown to the GitHub Contents API at `outputs/user-profile-<submission-id>-<timestamp>.md`.
- Controlled by secrets `GITHUB_TOKEN`, `GITHUB_OWNER`, `GITHUB_REPO` (all three required) plus optional `GITHUB_BRANCH` (default `main`) and `GITHUB_EXPORT_DIR` (default `outputs`). **If any of the three required secrets is missing the push silently skips** and logs a `skippedReason` — the submission still succeeds. So "no file appeared in GitHub" usually means a missing secret, not a crash.
- On the `feature/dashboard-client-my-bookings` branch this call is wrapped in try/catch; **on `master` it is not**, so a GitHub API throw currently fails the whole request *after* the DB insert and both emails have already succeeded.

### Environment variables (current)
Frontend (Vercel + `.env.local`) — all present in `env.local.example` **except the last, which is missing and should be added**:

`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_ENQUIRY_SUBMIT_URL`, `NEXT_PUBLIC_ONBOARD_SUBMIT_URL`, `NEXT_PUBLIC_CREATE_CLIENT_USER_URL`, `NEXT_PUBLIC_CONTACT_SUBMIT_URL`, `NEXT_PUBLIC_BOOKING_SUBMIT_URL`, `NEXT_PUBLIC_BOOKING_AVAILABILITY_URL`, `NEXT_PUBLIC_DORZA_CHAT_URL`, and **`NEXT_PUBLIC_GENERATE_BRAND_GUIDELINES_URL`** — used by `app/admin/workspace/page.tsx`, absent from `env.local.example`.

Edge function secrets (Supabase dashboard): `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `SITE_URL`, `ADMIN_NOTIFICATION_EMAIL`, `ANTHROPIC_API_KEY`, `ADMIN_EMAIL` (brand-guidelines gate), `GITHUB_TOKEN`, `GITHUB_OWNER`, `GITHUB_REPO`, `GITHUB_BRANCH`, `GITHUB_EXPORT_DIR`. `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` are auto-injected. The GitHub and brand-guidelines secrets are **not** documented in `env.local.example`.

### Edge function inventory (all 8)
`onboard-submit`, `enquiry-submit`, `create-client-user`, `contact-submit`, `booking-submit`, `booking-availability`, `chat-respond`, `generate-brand-guidelines`. Shared conventions: `Deno.serve`, inline CORS const, `OPTIONS` short-circuit, service-role client (bypasses RLS), denomailer over Gmail SMTP port 465, bracketed `console.log` tags for log filtering, and `{ success: boolean }` JSON responses.

### Migration inventory
`20260514000000_onboard_submissions` · `20260516000000_admin_and_storage` · `20260518000000_enquiries` · `20260602000000_contact_messages` · `20260612000000_bookings`. Additive only — never edit one that has run in prod.

### Unmerged work: `feature/dashboard-client-my-bookings`
**Not on `master`.** 7 commits, ~1000 lines, adding a client-facing `/dashboard` (bookings list with confirm/cancel, `/dashboard/messages`, `/dashboard/reset-password`, a shared `layout.tsx`), two RLS migrations, and a **rewrite of `create-client-user` from magic-link invites to email + generated password**. Setup notes live on the branch at `supabase/setup-docs/20260620_dashboard-client-my-bookings.md`.

Don't treat it as current, and expect conflicts if you touch `create-client-user` on `master`. Known issues to resolve before merging: `auth.admin.listUsers()` is unpaginated (silently breaks past 50 users), temp passwords are emailed in plaintext with no forced rotation, and the branch is behind `master` by the mobile-scroll fix.

## Added by reposition 2026-11
- Positioning copy and service status live in `lib/site.ts`, `lib/data/pillars.ts` and `lib/data/work.ts`. Change copy there, not in components.
- A service is `live` or `ask`. Nothing else is shown. See spec §10.
- Every number, quote and client name needs a row in `docs/proof-sources.md`.
- Case studies are hidden in production until their flag is `true` in `lib/data/workStatus.ts` (content-free, safe for client components; never import `lib/data/work.ts` from a `"use client"` file or draft text ships in public JS). Set `NEXT_PUBLIC_SHOW_DRAFTS=1` to see drafts locally. `pnpm test:export` must run against a build made without that variable.
- Tests: `pnpm test` (Vitest). `pnpm test:export` checks the built `out/` folder.
- `PRODUCT.md` and the Impeccable surface briefs carry the design direction. `DESIGN.md` is written by Impeccable's documenter from the finished build.
- Canonical host is `https://www.dorza.com.au` (`SITE_URL` in `lib/seo.ts`). Vercel 308-redirects the bare domain to it. Canonicals, sitemap, schema, `llms.txt` and `robots.txt` all use `www`; `pnpm test:export` fails if a bare-domain URL appears in the build.
- Case studies list the `/services/*` pages they prove (`services`) and the `/areas/*` pages where the client trades (`areas`). Those pages show the study through `RelatedWork`, and the study links back.
- `/demo/*` is noindexed by `app/demo/layout.tsx`. Don't also block it in `robots.txt`, or Google can't see the noindex.
