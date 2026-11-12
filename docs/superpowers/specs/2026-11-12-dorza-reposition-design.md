# Dorza reposition design (reconstructed)

> **Read this first.** The original spec for this work wasn't committed. On 12 November 2026, Mahir chose to treat the implementation plan (`2026-11-12-dorza-reposition.md`) as the spec and approved the decisions below. This file keeps the section numbers the plan cites, so every `spec §N` reference resolves to something. Where this file and the plan disagree, the plan wins. If the original spec turns up, replace this file with it.

## §2 Decisions (approved by Mahir, 12 November 2026)

| # | Decision |
|---|---|
| D1 | Dorza becomes an Australia-wide brand, organised as three pillars: Start, Grow, Support. |
| D2 | Brand pages carry no eyebrow label above a heading. |
| D3 | Tagline: "You run the business. We'll mind the tech." Primary action: "Get a quote". |
| D4 | v7 "tightened sage" palette (forest, pine, claret, ochre on chalk and paper) with Newsreader, Geist and Geist Mono. It replaces terracotta and sage with Plus Jakarta Sans and Instrument Serif. |
| D5 | Remove the founding-client 50% offer, the free audit, the three testimonials, the "live in 24 hours" claim and every unsourced statistic. |
| D6 | No suburb names on brand pages. The six `/areas/*` pages, plus the service and industry pages, stay live as a local layer and are linked from the footer and `/areas` only. |
| D7 | Drivable and Active Rise Health case studies are built but stay unpublished until each owner gives written OK. |
| D8 | The contact page drops the suburb list and the Google Map. |
| D9 | The About page names the founders, Mahir Mahbub and Adi Widodo. |
| D10 | No existing URL is removed. Internal tools (`/onboard`, `/admin`, `/upload`, `/demo`) change only through Tailwind aliases. |

## §4 Voice

Plain Australian English. Headlines are short declaratives ending in a full stop, eight words at most. No exclamation marks, emoji or em dashes. No hype vocabulary: easiest, solutions, leverage, synergy, cutting-edge, game-changing, revolutionary, unlock, empower, seamless, elevate. No digs at competitors ("slapped on", "BS"). The only numbers allowed are $499, 72 hours and verifiable facts about a session or a client. `tests/voice.test.ts` and `tests/helpers/voice.ts` enforce this.

## §6 Direction contract

Recorded in the Impeccable surface brief for `app/page.tsx` (`.impeccable/surfaces/app-page-tsx.md`), and shared by `/start`, `/grow`, `/support` and `/work`. Read it with `impeccable surface-brief read app/page.tsx`. Don't copy it into source.

## §8 Motion

Ease `cubic-bezier(0.23, 1, 0.32, 1)`. Durations of 160, 280, 480 and 600ms, with a 45ms stagger. No spring, bounce, float, pulse or marquee. There are three primitives: `Reveal` (scroll-in), `LineReveal` (headline set-down, h1 only) and `Spine` (the homepage timeline). Every animation has a reduced-motion path, and content stays visible with JavaScript off.

## §10 Honesty

A service is `live` or `ask`, nothing else. No statistic, testimonial or client name appears without a row in `docs/proof-sources.md`. Case studies stay `published: false` until the owner signs off.

## §11 Product record

See `PRODUCT.md`, confirmed with Mahir on 12 November 2026.

## §12 Client confirm list (before publishing a case study)

- Drivable: the owner's written OK; vehicle measurements and the "Ask us" fallbacks match the live site; the test listing is removed from drivablehire.com.au; screenshots are recaptured.
- Active Rise Health: the owner's written OK; clinic days and hours, and the funding list, match the live site; screenshots are recaptured.

## §13 Before launch

- A lawyer checks `/privacy`.
- Adi confirms the Supabase region and the email provider named on `/privacy`.
