# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Owner-run Australian small businesses (tradies, cafes, salons, clinics, hire firms) with nobody looking after their tech. Today the owner does it at night with a search engine. They want to get online, get found and booked, and keep it all running without having to learn the tech themselves.

## Product Purpose

Dorza looks after that tech in three stages:

- **Start:** website, hosting, Google Business Profile.
- **Grow:** SEO and content, custom booking systems and dashboards.
- **Support:** hosting, updates and changes after launch.

Success is an enquiry that gets a plan and a price within 72 hours and turns into a yes.

## Positioning

Two founders, Mahir (customers, product, strategy) and Adi (build, infrastructure). Clients deal with them directly, from the first call to the tenth change. AI-assisted building keeps custom work within a small-business budget (websites from $499). Dorza only promises what's live: each service is either "live" or "ask us". No lock-in, and the client owns what's built. Proof is real shipped systems, such as the Drivable booking system, not stock mock-ups.

## Operating Context

- dorza.com.au is a Next.js 14 static export on Vercel. Enquiries go through Supabase Edge Functions (`enquiry-submit`), from the inline form on the homepage (`#quote`) or from the enquiry modal.
- The brand layer (home, Start, Grow, Support, Work, About, Privacy) is national and names no suburbs. A local layer underneath (`/areas/*`, plus the service and industry pages) keeps its URLs for search and is linked from the footer only.
- `/onboard`, `/admin`, `/upload` and `/demo/*` are internal tools. They are out of scope for brand work and pick up the palette through legacy Tailwind aliases.

## Capabilities and Constraints

- Every service is `live` or `ask`, nothing else. No helpdesk, managed security or ERP is offered.
- A case study is public only when its flag is `true` in `lib/data/workStatus.ts`, after the owner gives written OK. `NEXT_PUBLIC_SHOW_DRAFTS=1` shows unpublished ones in preview.
- Static export only: no route handlers, server actions, middleware or `next/image` optimisation.
- No URL that existed before the November 2026 reposition is removed.

## Brand Commitments

- Name: Dorza. Tagline: "You run the business. We'll mind the tech." Primary action: "Get a quote".
- Voice: plain Australian English. Headlines are short declaratives ending in a full stop. No exclamation marks, emoji or em dashes. No hype words (seamless, elevate, unlock, leverage, solutions and the like). No digs at competitors.
- Based in Sydney, ABN 76 634 304 017, serving all of Australia remotely.

## Evidence on Hand

- Confirmed: websites from $499, a plan and a price within 72 hours, no lock-in. Sources in `docs/proof-sources.md`.
- Case studies (published 13 November 2026):
  - Drivable, drivablehire.com.au: website and booking system.
  - Active Rise Health, activerisehealth.com.au: practice website.
- **There are no testimonials, client counts, ratings or outcome statistics.** None may be shown. Every number, quote and client name needs a row in `docs/proof-sources.md` first.

## Product Principles

1. Only promise what's live. Anything not ready says "ask us", or isn't mentioned.
2. Proof over claims. Real shipped work, real URLs, no invented businesses or numbers.
3. One team, start to finish. The people who build it are the people who answer.
4. The client owns it and can leave. Keep their business by being useful, not by lock-in.
5. National brand, local roots. The brand speaks to Australia; local pages stay underneath and stay true.

## Accessibility & Inclusion

- WCAG 2.2 AA: body text at least 4.5:1 on every ground, visible focus everywhere, touch targets at least 44px.
- Every animation has a reduced-motion path, and all content is visible with JavaScript off.
- Some clients serve people with disability (NDIS, aged care, wheelchair-accessible hire), so case-study content must describe access features accurately.
