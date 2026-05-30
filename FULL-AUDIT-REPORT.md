# Dorza — Full SEO Audit Report

**Date:** 2026-05-30
**Audited against:** local source (`app/`, `components/`, `public/`) — the source of truth that deploys to Vercel — cross-checked against the `out/` build artifact.
**Stated goal:** rank as a top page in **Western Sydney** for **"digital marketing"** and **"web design / consulting services"**
**Method:** static source analysis (full repo access; no live crawl required). No git operations performed.

---

## Executive Summary

### Overall SEO Health Score (current source): **60 / 100** (C — solid foundation, badly misaligned with the goal)

| Category | Weight | Score | Weighted |
|---|---|---|---|
| Technical SEO | 22% | 68 | 14.96 |
| Content Quality | 23% | 45 | 10.35 |
| On-Page SEO | 20% | 50 | 10.00 |
| Schema / Structured Data | 10% | 60 | 6.00 |
| Performance (CWV, lab est.) | 10% | 80 | 8.00 |
| AI Search Readiness | 10% | 75 | 7.50 |
| Images | 5% | 60 | 3.00 |
| **Total** | **100%** | | **≈ 60** |

**Business type detected:** Local service / digital agency (SAB — service-area business). This is a **Local SEO** play, which changes everything: "digital marketing Western Sydney" / "web design Parramatta" are won in the **local pack + local organic**, where geo-targeting, dedicated location/service pages, NAP, Google Business Profile, and reviews dominate.

### 🚨 The single most important finding — read this first

**A complete, Western-Sydney-optimized, 16-page version of this site already exists** — but only as a **compiled build artifact in `out/`** (built 2026-05-26, gitignored). **Its source code is entirely absent from your working tree.** Your current `app/` directory contains only: `page.tsx` (home), `admin`, `onboard`, `upload`, `layout.tsx`, `not-found.tsx`. The committed/deployable source is the **old generic-Sydney single-page version**.

The `out/` build contains all of this that your source does NOT have:

| Type | Pages present in `out/` but missing from source |
|---|---|
| **Service pages** | `/services/web-design`, `/services/social-media-management`, `/services/google-business-profile`, `/services/local-seo` |
| **Area (location) pages** | `/areas/western-sydney`, `/areas/parramatta`, `/areas/blacktown`, `/areas/penrith`, `/areas/liverpool`, `/areas/campbelltown` |
| **Industry pages** | `/industries/cafes-restaurants`, `/industries/tradies`, `/industries/salons-beauty` |
| **Trust pages** | `/about`, `/contact` |
| **Schema** | `ProfessionalService` (Parramatta NSW 2150, geo coords, areaServed all 5 suburbs, `hasOfferCatalog`, `knowsAbout: digital marketing, local SEO`), `BreadcrumbList` |
| **Other** | `og-default.png` (1200×630), 16-URL sitemap on `dorza.com.au`, footer with Services/Areas/Industries/Company nav |

**This is exactly the architecture needed to rank in Western Sydney.** It was built, then the deployable source reverted to the single-page generic version. **Recovering this source is by far your fastest path to the goal** — the content, page structure, schema, and internal-link graph already exist. The source must be recovered from version control (the branch/commit it was built from) or, failing that, reconstructed from the `out/` HTML/`.txt` payloads.

> ⚠️ Tooling note: during this audit the shell intermittently injected spurious text ("…wait", "duplicated", etc.) into command output. All such text was verified false via integrity checks (file sizes/line counts). It does not reflect the repo. The findings here are confirmed against actual file content.

### Top 5 Critical Issues

1. **The optimized multi-page site isn't in source.** What deploys is the old single-page generic-Sydney brochure. Goal-critical pages (services, areas, industries, about, contact) exist only as compiled `out/` HTML. Recover the source. (Caveat: the `out/` version still mixed domains — `sitemap.xml`/`robots.txt` on `dorza.app` while canonical/schema used `dorza.com.au` — fix on recovery.)
2. **Current source: geo + keyword mismatch with the goal.** Title, H1, meta, schema, llms.txt, footer all say "Sydney" with a CBD address (NSW 2000). Zero Western Sydney / Parramatta / Blacktown / Penrith / Liverpool / Campbelltown mentions. H1/title don't contain "digital marketing" or "web design consulting." You cannot rank for the target terms as-is.
3. **Broken `/waitlist` URL — in the sitemap *and* the footer.** `public/sitemap.xml` lists `https://dorza.app/waitlist` and `Footer.tsx` links `/waitlist`, but no `app/waitlist` route exists → 404.
4. **Brand/domain entity is fractured.** `dorza.app` (canonical+sitemap), `dorza.com.au` (email + the `out/` build), `dorza.ai` (Instagram), `dorzaai` (LinkedIn). One entity is needed everywhere for authority + NAP consistency.
5. **No LocalBusiness/ProfessionalService schema, no real NAP, no phone number** in current source. `Organization` only, generic Sydney CBD address, no street address, no `telephone`, no geo, no reviews. No `tel:` link anywhere (local-trust + conversion loss).

### Top 5 Quick Wins

1. **Recover/restore the `out/` site source** (the whole Western Sydney architecture is already designed and written).
2. **Fix the `/waitlist` 404** — create the route or repoint footer + sitemap to `/#waitlist`. ~15 min.
3. **Pick ONE domain** (recommend `dorza.com.au` — `.com.au` is an AU local-trust/ranking signal) and align canonical, sitemap, robots `Sitemap:`, schema `url`/`@id`, email, social handles.
4. **Add a phone number with `tel:` links** (Nav, Footer, schema `telephone`, llms.txt).
5. **Add the OG image** — copy `out/images/og-default.png` → `public/images/` and wire `openGraph.images`/`twitter.images`.

---

## Detailed scope: source vs `out/` build

| Element | Current source (`app/`) | `out/` build (2026-05-26) |
|---|---|---|
| Pages | Home + admin/onboard/upload only | Home + 4 services + 6 areas + 3 industries + about + contact |
| `<title>` | "Web Design & Social Media **Sydney** — Done For You \| Dorza" | "Web Design & **Digital Marketing Western Sydney** \| Dorza" |
| H1 | "**Sydney's** easiest web and growth agency…" | "…**Western Sydney** Small Business" (homepage) |
| Western Sydney / suburb mentions | **0** | **74 on the homepage** |
| Schema | `Organization`, `WebSite`, `ItemList`, `FAQPage` | + `ProfessionalService` (geo, areaServed 5 suburbs, hasOfferCatalog), `BreadcrumbList` |
| OG image | ❌ missing | ✅ `og-default.png` 1200×630 |
| Sitemap | 2 URLs (one 404s), `dorza.app` | 16 URLs, `dorza.com.au` |
| Canonical domain | `dorza.app` | `dorza.com.au` (but its sitemap/robots still `dorza.app` — inconsistent) |
| Footer | Services anchor-links only | Services + Areas + Industries + Company nav |

Note: the `out/` About page title/H1 read "Built in Sydney, for Sydney" (body content does target Western Sydney) — tighten that to "Western Sydney" on recovery for consistency.

---

## Technical SEO — 68/100

**Strengths**
- HTTPS via Vercel; static export (`output: 'export'`) → fast TTFB, crawlable HTML.
- `robots.txt` is well-considered: blocks `/admin`, `/upload`, `/onboard`; blocks AI *training* scrapers (CCBot, anthropic-ai, cohere-ai) while explicitly allowing AI *search* crawlers (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended).
- `app/onboard/layout.tsx` sets `robots: { index:false, follow:false }`.
- Canonical present, `metadataBase` set, `lang="en-AU"`, viewport configured.

**Issues**
- **[Critical] `/waitlist` 404** — in `sitemap.xml` and `Footer.tsx`; no route exists.
- **[High] Domain inconsistency** — `dorza.app` vs `dorza.com.au` vs `dorza.ai`/`dorzaai`.
- **[Medium] Sitemap thin & stale** — 2 URLs (one 404s), `lastmod` frozen 2026-05-17. Must grow with real pages.
- **[Low] `images.unoptimized: true`** — required by static export; no Next `srcset`/WebP. Mitigate by shipping pre-sized WebP/AVIF.
- **[Low]** Confirm `app/upload` + `app/admin` set page-level `robots: noindex` (robots.txt disallow alone doesn't guarantee de-indexing of externally linked pages).

---

## Content Quality — 45/100

**E-E-A-T: weak (current source).** No About page (exists in `out/`), no named team/founder, no author entity, no case studies/testimonials/client logos/reviews, no real NAP. Mockups are illustrative placeholders ("Bondi Beans", invented "218 enquiries") — not proof. For a marketing/consulting buyer, proof of results is the #1 trust and conversion factor. Footer "Made with AI and good taste" + illustrative-only content reads as low-substance to Google's helpful-content systems.

**Depth: far too thin for the goal (current source).** One page of copy, no service pages, no location pages, no blog. Ranking for competitive local terms needs topical + geographic depth. **The `out/` build already solves most of this** (services/areas/industries) — recovery instantly upgrades this category.

**Copy craft is good** — clear, benefit-led, on-brand. The deficit is quantity, proof, and geo/keyword targeting.

---

## On-Page SEO — 50/100

- **[Critical] Title** (`app/layout.tsx`): targets "Sydney" + "Web Design & Social Media" — not "Western Sydney", "digital marketing", or "consulting".
- **[Critical] H1** (`components/sections/Hero.tsx`): "Sydney's easiest web and growth agency for small business" — no target keyword.
- **[Good] Heading hierarchy** clean: one H1, section H2s, item H3s.
- **[High] Meta description** well-written but geo-wrong ("Sydney small businesses").
- **[High] Internal linking is anchor-only** (`#services`, `#pricing`). The `out/` footer/nav already define a real link graph (home → services → areas → industries) — recover it.
- **[Medium] No keyword presence** for "digital marketing", "consulting", or "strategy" in headings/early body.

---

## Schema / Structured Data — 60/100

**Present (`app/layout.tsx`):** `Organization`, `WebSite` (+`SearchAction`), `ItemList` of pricing `Offer`s (AUD, well-formed), `FAQPage`. Valid, good breadth.

**Gaps for the goal:**
- **[Critical] No `LocalBusiness`/`ProfessionalService`.** The `out/` build has a complete one (Parramatta address, `geo` coords, `areaServed` 5 suburbs, `hasOfferCatalog`, `knowsAbout` incl. "digital marketing", "local SEO") — restore it.
- **[High] `areaServed` generic "Sydney"** in current Organization — enumerate WS suburbs.
- **[High] No `aggregateRating`/`Review`** — add once real reviews exist (drives local CTR).
- **[Medium] No `telephone`** in `contactPoint` — add a phone.
- **[Medium] No `BreadcrumbList`** in source (exists in `out/`) — restore with multi-page.
- **[Low] `postalCode: 2000`** (CBD) contradicts a Western Sydney business — align to Parramatta 2150.

---

## Performance (Core Web Vitals) — 80/100 (lab estimate — no field data)

> No CrUX/field data available (no Google API creds detected). Estimate from code.

**Likely strong:** static HTML, `next/font` with `display: swap` + `adjustFontFallback: true` (good CLS), images `loading="lazy"` + `decoding="async"`, light DOM.

**Watch:**
- **framer-motion** used heavily (Hero word-stagger, HowItWorks scroll pipeline, marquee) → JS/hydration cost can hurt **INP** on low-end mobile. `useReducedMotion()` respected (good).
- **`images.unoptimized: true`** ships full-size JPEGs → potential LCP weight; keep the LCP element small/sized.
- **Action:** verify in Search Console + PSI/CrUX after launch to replace this estimate.

---

## Images — 60/100

- **[High] No social/OG image in source** — `public/images/` has only `mockups/`. `og-default.png` exists in `out/images/` (1200×630). Add it + wire `openGraph.images`/`twitter.images`.
- **[Medium] JPEG, not WebP/AVIF** — convert mockups (~25–50% smaller; manual under static export).
- **[Low] Alt text** — decorative mockups `alt=""` (correct), functional previews have descriptive alt (correct). Favicon is SVG-only (reused as apple-touch, which iOS may not render) — add PNG fallback + proper `apple-touch-icon`. (Note: `out/` includes a `favicon.ico`.)

---

## AI Search Readiness (GEO) — 75/100

**Strengths:** `llms.txt` present, well-structured, useful (offer summary, pricing, who-it's-for, contact, licensing). AI search crawlers explicitly allowed. `FAQPage` schema aids passage-level citation.

**Gaps:**
- **`llms.txt` says "Sydney"**, not Western Sydney — re-target to the goal.
- Contact in `llms.txt` mixes `dorza.app` (site) + `dorza.com.au` (email) — entity split.
- No phone in `llms.txt`.
- Thin proof/authority limits AI citation confidence.

---

## Search Experience / Page-type fit (SXO)

For "digital marketing Western Sydney" / "web design Parramatta", Google ranks **local pack + dedicated local landing pages**, not a single national-style homepage. The current one-page brochure is a **page-type mismatch** for these queries. The `out/` architecture (per-service + per-suburb pages) is the correct page-type — recover it.

---

## What's already good (keep)

- Clean, fast static-export architecture; strong visual design + motion discipline (reduced-motion honored).
- Sensible `robots.txt` AI-bot policy and private-route blocking.
- Valid, broad schema foundation (Organization/WebSite/Offers/FAQ).
- A genuinely useful `llms.txt`.
- Good, conversion-oriented copywriting voice.
- **A complete Western Sydney multi-page architecture already designed (in `out/`) — recover, don't rebuild.**

See **ACTION-PLAN.md** for the prioritized, sequenced fix list.
