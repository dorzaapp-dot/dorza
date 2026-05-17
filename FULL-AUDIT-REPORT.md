# Dorza — Full SEO Audit Report

> **Target:** https://dorza.app
> **Generated:** 2026-05-17
> **Scope:** Live production site (homepage, /onboard, /waitlist, /admin, /upload)
> **Method:** 9 parallel specialist subagents (technical, content, schema, sitemap, performance, GEO, SXO, local, backlinks)
> **Re-run with:** `/claude-seo:seo-audit`

---

## Executive Summary

### Overall SEO Health Score: **36/100** — Poor

Dorza has a clean, well-coded marketing site with a respectable design system, but **almost every layer of SEO infrastructure is missing**. The site has:

- **No `robots.txt`, no `sitemap.xml`, no `llms.txt`** — search engines and AI engines have no map of the site.
- **`/admin` and `/upload` are fully crawlable** — authenticated portals leak into Google's index unless fixed.
- **Schema is `Organization`, not `ProfessionalService` / `LocalBusiness`** — disqualifies the site from the Local Pack.
- **No phone number anywhere** — a hard NAP failure and a GBP verification blocker.
- **Zero social proof** — no named testimonials, no real case studies, all social links go to `#`.
- **LCP fails** — the hero image is lazy-loaded with `images.unoptimized: true`.
- **The primary CTA ("Join the waitlist") is wrong-shaped** for commercial-intent search traffic.

### Business type detected

**Service Area Business (SAB)** in Sydney, NSW. AI-native digital agency targeting small businesses (cafes, salons, tradies, retail, fitness). Pre-launch (waitlist phase). One verified client mentioned (cremornecoffee.com.au), no case studies live yet.

### Top 5 Critical Issues

| # | Issue | Impact |
|---|-------|--------|
| 1 | `/admin` and `/upload` are indexable (no `noindex`, no `robots.txt`) | Authenticated portals can appear in Google. Direct security + brand-trust risk |
| 2 | No `sitemap.xml`, no `robots.txt`, no `llms.txt` | Google, Bing, ChatGPT, Perplexity have no canonical URL list or crawler directives |
| 3 | Schema type is `Organization` not `ProfessionalService`/`LocalBusiness` | Ineligible for Local Pack rich results — the highest-leverage Sydney ranking lever |
| 4 | No phone number on site or in schema | NAP incomplete → GBP verification blocked → local pack ineligible |
| 5 | LCP fails (hero image `loading="lazy"` + `images.unoptimized: true`) | Core Web Vitals fail on mobile; Lighthouse Perf ~52/100 |

### Top 5 Quick Wins (≤1 hour each)

| # | Win | Files |
|---|-----|-------|
| 1 | Add `public/robots.txt` + `public/sitemap.xml` + `public/llms.txt` | `public/` (3 new files) |
| 2 | Add `app/admin/layout.tsx` + `app/upload/layout.tsx` exporting `metadata.robots.index: false` | 2 new files |
| 3 | Change `loading="lazy"` → `loading="eager"` + add `fetchpriority="high"` on the hero `<img>` | `components/sections/HeroBrowserMockup.tsx:173` |
| 4 | Swap `Organization` schema → `ProfessionalService` + add `telephone`, `geo`, `sameAs`, `priceRange` | `app/layout.tsx` |
| 5 | Add `FAQPage` JSON-LD wrapping the existing `faqs` array | `components/sections/FAQ.tsx` |

---

## Sub-scores by Category

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Technical SEO | 38/100 | 22% | 8.4 |
| Content Quality | 38/100 | 23% | 8.7 |
| On-Page / SXO | 34/100 | 20% | 6.8 |
| Schema / Structured Data | 28/100 | 10% | 2.8 |
| Performance (CWV) | 52/100 | 10% | 5.2 |
| AI Search Readiness (GEO) | 31/100 | 10% | 3.1 |
| Images | ~30/100 | 5% | 1.5 |
| **Total** | | **100%** | **~36/100** |

| Sub-area | Score | Notes |
|----------|-------|-------|
| Local SEO | 31/100 | No phone, no GBP, wrong schema type — pre-launch as expected |
| Backlinks | N/A | Pre-launch, no backlink toolchain available locally; recommendations qualitative only |

---

## Technical SEO

**Score: 38/100**

### Critical
- **`/admin` and `/upload` have no `noindex`.** Both are `'use client'` pages with no `metadata` export. They are public URLs. Google will discover and attempt to index the admin sign-in form and the asset upload portal.
- **No security headers.** `next.config.mjs` has no `headers()` function and no `vercel.json` exists. Vercel injects baseline HSTS on its edge, but **CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, and Permissions-Policy are all unset**.
- **Soft-404 risk on static export.** `output: 'export'` + no `app/not-found.tsx` means missing routes may return `200` with empty content on some CDN configurations.

### High
- **No canonical tags.** The root `metadata` in `app/layout.tsx` does not set `alternates.canonical`. `/waitlist` and `/onboard` export no metadata at all.
- **No `viewport` meta tag in code.** Next.js 14 App Router does not auto-inject `<meta name="viewport">`; you must export the `viewport` object. There is no such export.

### Medium
- **Heavy client-component pattern.** All pages are `'use client'` with no SSR wrapper. They render as a blank shell without JavaScript — a real risk for crawlers and pre-hydration AI indexers.
- **No `robots.txt`** in `public/`. Googlebot has no `Disallow` for `/admin` or `/upload` and no `Sitemap:` pointer.

### Fixes
- Add `app/admin/layout.tsx` and `app/upload/layout.tsx` each exporting `export const metadata = { robots: { index: false, follow: false } }`.
- Add `export const viewport: Viewport = { width: 'device-width', initialScale: 1 }` to `app/layout.tsx`.
- Add `alternates: { canonical: 'https://dorza.app' }` to the root `metadata`.
- Add `vercel.json` headers config (or `next.config.mjs` `headers()` if not on static export) for CSP/XFO/Referrer-Policy/Permissions-Policy.
- Create `app/not-found.tsx` so Next emits `404.html` into `out/`.

---

## Content Quality

**Score: 38/100**

Total meaningful body copy on the homepage: ~820 words (homepage baseline minimum: 800–1,000 for a hybrid marketing/service page — acceptable floor but thin).

### Critical
- **Zero social proof.** No testimonials, no client names (real or composite), no named suburbs, no photos, no star ratings. The "cremornecoffee.com.au" reference does not appear on the live site.
- **No About page, no team page, no named founders.** Every trust claim is first-person plural "we" with nothing behind it.
- **No privacy policy, no terms of service, no ABN.** Basic Australian compliance signals are absent. A form collecting email + business data (waitlist) with zero privacy disclosure is an ACCC/Privacy Act gap.
- **All social media links go to `#`** (Instagram, LinkedIn, X). Hitting any social icon is a dead end.
- **No contact phone number.** Email only (`hello@dorza.com.au`).

### High
- **E-E-A-T floor.** Experience 0/10 (no case studies). Expertise 0/10 (no named staff). Authoritativeness 0/10 (no press). Trust ~1/10.
- **The "85% cheaper" stat is unattributed.** Reads as fabricated. Reframe using the on-page $3,000 vs $349 comparison (which is grounded).
- **The "$0 hidden fees" counter animates `0 → 0`.** Visually broken and wastes a trust-signal slot.
- **FAQ schema (FAQPage JSON-LD) is absent** — the existing 5-question FAQ is invisible to structured-data parsers.

### Medium
- Homepage has zero suburb-specific copy beyond "Sydney, NSW 2000" in the footer and "Built for Sydney" in the hero label.
- The interactive comparison widget ($3,000 vs $349) renders via JavaScript; AI crawlers and pre-hydration indexers won't see both sides.
- Pricing feature bullets exist but no explainer prose (e.g. what "Social media (3 posts/week)" actually entails).

### Quick wins
- Add `FAQPage` JSON-LD wrapping the existing `faqs` array in `components/sections/FAQ.tsx`.
- Replace all `href="#"` social links with real URLs or remove icons until profiles exist.
- Add a one-line privacy policy page (`app/privacy/page.tsx`) + link in footer.
- Add ABN to footer.
- Replace the broken `$0` counter with a static `$0 lock-in fees ✓` or a real stat ("48hr turnaround", "20 founding clients").

### Specific copy fixes
- **Hero sub:** "We build your website, run your social media, and get you found on Google — **all from $199/month, no contracts.**"
- **Thesis claim:** Replace "85% cheaper than a traditional agency" with "88% cheaper than the average Sydney agency retainer" + footnote `($349/mo vs $3,000/mo industry average)`.
- **WaitlistCTA headline:** Replace "Ready to stop being invisible online?" with "Sydney's invisible businesses get their digital presence in 48 hours."
- **FAQ Q4 (cancellation):** Add "We'll send you the domain, hosting login, and all content files within 24 hours of cancellation."
- **Footer:** Replace "Made with AI and good taste" with `ABN: [number] · Privacy Policy · Terms`.

---

## Schema / Structured Data

**Score: 28/100**

### Detected
- `Organization` block in `app/layout.tsx` — partial completeness. Has `@context`, `@type`, `name`, `description`, `url`, `areaServed`, `address` (PostalAddress), `contactPoint` (email). **Missing:** `logo`, `sameAs`, `telephone`, `priceRange`, `foundingDate`, `knowsAbout`, `postalCode`.
- No page-level schema on `/onboard` or `/waitlist`.

### Validation issues
- `Organization` does not qualify for LocalBusiness rich results. For a Sydney service business, use **`ProfessionalService`** (LocalBusiness subtype).
- `contactPoint` has email but no `telephone`.
- Three pricing tiers ($199 / $349 / $549) have **zero `Offer` markup**.
- 5 FAQ items have **no `FAQPage` schema**.
- No `WebSite` + `SearchAction` (sitelinks searchbox signal).
- `sameAs` is absent (Footer social links all `href="#"`, so no real URLs exist yet anyway).

### High-value schemas to add (priority order)
1. **`ProfessionalService`** (replaces or extends `Organization`) — unlocks Local Pack.
2. **`Offer` / `ItemList`** for pricing tiers — drives pricing rich snippets and AI citations.
3. **`WebSite` + `SearchAction`** — sitelinks searchbox.
4. **`FAQPage`** — Google restricts rich results for commercial sites (Aug 2023), but still valuable for AI citation.
5. **`Service`** nodes for each of the 4 named services (websites, social, research, AI agents).

### Ready-to-paste: `ProfessionalService` schema for `app/layout.tsx`

```json
{
  "@context": "https://schema.org",
  "@type": ["ProfessionalService", "Organization"],
  "name": "Dorza",
  "description": "AI-native digital agency for Sydney local businesses. Websites, social media, Google Business, and AI agents — done for you.",
  "url": "https://dorza.app",
  "logo": {
    "@type": "ImageObject",
    "url": "https://dorza.app/images/dorza-logo.png",
    "width": 400,
    "height": 120
  },
  "telephone": "+61-XXX-XXX-XXX",
  "email": "hello@dorza.com.au",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Sydney",
    "addressRegion": "NSW",
    "postalCode": "2000",
    "addressCountry": "AU"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": -33.86785, "longitude": 151.20732 },
  "areaServed": { "@type": "City", "name": "Sydney", "sameAs": "https://www.wikidata.org/wiki/Q3130" },
  "openingHoursSpecification": [{
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
    "opens": "09:00", "closes": "17:00"
  }],
  "sameAs": [],
  "knowsAbout": ["digital marketing", "web design", "social media management", "SEO", "AI agents"]
}
```

### Ready-to-paste: pricing `ItemList` for `app/page.tsx`

```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Dorza Pricing Plans",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "item": { "@type": "Offer", "name": "Starter", "description": "Website + Google Business setup.", "url": "https://dorza.app/#pricing", "price": "199", "priceCurrency": "AUD", "priceSpecification": { "@type": "UnitPriceSpecification", "price": "199", "priceCurrency": "AUD", "unitCode": "MON" }, "eligibleRegion": { "@type": "Country", "name": "AU" } } },
    { "@type": "ListItem", "position": 2, "item": { "@type": "Offer", "name": "Growth", "description": "Website + Social + AI chatbot + review management.", "url": "https://dorza.app/#pricing", "price": "349", "priceCurrency": "AUD", "priceSpecification": { "@type": "UnitPriceSpecification", "price": "349", "priceCurrency": "AUD", "unitCode": "MON" } } },
    { "@type": "ListItem", "position": 3, "item": { "@type": "Offer", "name": "Pro", "description": "Full service: 5 posts/week + paid ads + strategy call.", "url": "https://dorza.app/#pricing", "price": "549", "priceCurrency": "AUD", "priceSpecification": { "@type": "UnitPriceSpecification", "price": "549", "priceCurrency": "AUD", "unitCode": "MON" } } }
  ]
}
```

---

## Sitemap / Crawlability

**Score: 18/100**

- **`https://dorza.app/sitemap.xml`** → 404 (missing).
- **`https://dorza.app/robots.txt`** → 404 (missing).
- **Orphan pages:** `/onboard` and `/waitlist` have no inbound links (nav and CTAs use `#anchor` href, not absolute routes).

### Ready-to-paste: `public/sitemap.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://dorza.app/</loc><lastmod>2026-05-17</lastmod></url>
  <url><loc>https://dorza.app/waitlist</loc><lastmod>2026-05-17</lastmod></url>
</urlset>
```

### Ready-to-paste: `public/robots.txt`

```
User-agent: *
Disallow: /admin
Disallow: /upload
Disallow: /onboard

# Block AI training scrapers (allow AI search bots — see llms.txt)
User-agent: CCBot
Disallow: /
User-agent: anthropic-ai
Disallow: /
User-agent: cohere-ai
Disallow: /

# Explicitly allow AI search crawlers
User-agent: GPTBot
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /

Sitemap: https://dorza.app/sitemap.xml
```

> Decision required: do you want `/onboard` indexable? It's a wizard, not a target page. Default recommendation: disallow.

---

## Performance (Core Web Vitals)

**Lighthouse: ~52/100 mobile · ~78/100 desktop (estimated, no CrUX field data yet)**

| Metric | Estimate | Status |
|--------|----------|--------|
| LCP | ~3.8–4.5s | FAIL |
| INP | ~180–280ms | NEEDS IMPROVEMENT |
| CLS | ~0.12–0.18 | NEEDS IMPROVEMENT |
| FCP / TTFB | ~1.2s / ~180–250ms | Acceptable |

### Top 5 perf issues
1. **`cafe-hero.jpg` (LCP element) is `loading="lazy"`** with `images.unoptimized: true` — single highest-impact fix.
2. **framer-motion bundle** (~140–160 KB gzipped) loaded on critical path (every section is `'use client'`).
3. **All mockup JPEGs served unoptimised** — estimated 1.5–4 MB wasted bytes across the grid.
4. **`react-parallax-tilt` wraps the LCP element**, attaching `mousemove` listeners and blocking hydration.
5. **`BrowserChrome` typing effect uses `setInterval(35ms)`** — fires ~100 times per URL transition on the main thread.

### Specific fixes
- `components/sections/HeroBrowserMockup.tsx:173` — change `loading="lazy"` → `loading="eager"` + add `fetchpriority="high"`. (Single biggest LCP fix.)
- `next.config.mjs` — remove `images.unoptimized: true`. Vercel's Image Optimization works for statically-exported pages **when deployed on Vercel**. Convert `<img>` → `next/image` with explicit width/height/sizes.
- `app/page.tsx` — wrap below-fold sections (SegmentMarquee, Services, HowItWorks, Thesis, Pricing, FAQ) in `dynamic(() => import(...), { ssr: false })` to split the JS bundle.
- `app/layout.tsx` — add `adjustFontFallback: true` to both `Plus_Jakarta_Sans` and `Instrument_Serif` to reduce CLS on font swap.
- `HeroBrowserMockup.tsx` — defer `react-parallax-tilt` with `dynamic()` and disable until after first paint. Replace the `setInterval(35ms)` typing effect with a CSS `steps()` animation or `requestAnimationFrame` loop.

---

## AI Search Readiness (GEO)

**Score: 31/100**

### Crawler access
- `robots.txt` does not exist → all AI crawlers default-allowed but no explicit signal. CCBot (training-only) should be explicitly blocked; OAI-SearchBot, ClaudeBot, PerplexityBot, GPTBot, Google-Extended should be explicitly allowed.

### Passage citability (per likely prompt)
| Prompt | Score | Notes |
|--------|-------|-------|
| "What is Dorza?" | 4/10 | Identity spread across 3 fragments, no single "Dorza is..." sentence |
| "How much does Dorza cost?" | 7/10 | FAQ answer is well-structured; pricing card numbers render `$0` pre-hydration |
| "Who is Dorza for?" | 3/10 | No contiguous passage explicitly naming the audience |
| "Alternatives to traditional agencies" | 5/10 | ComparisonToggle is JS-rendered; only one side in static HTML |
| "Dorza review" / "Is Dorza legit?" | 1/10 | Zero testimonials, zero case studies |

### Critical gaps
- No `llms.txt` — highest-leverage missing asset.
- No `Service` / `Offer` JSON-LD → pricing invisible to structured-data parsers.
- FAQ answers hidden behind `AnimatePresence` collapse — may be missed by pre-hydration crawlers.
- `useCountUp` stats render `$0` / `0%` on first paint.
- No "Dorza is..." definitional sentence in static body copy.

### Ready-to-paste: `public/llms.txt`

```
# Dorza

> Dorza is a Sydney-based AI-native digital agency that provides done-for-you websites, social media management, Google Business setup, and AI marketing agents for small businesses. Pricing starts from $199/month with no lock-in contracts.

## What Dorza offers
- **Custom websites** — hand-coded, mobile-first, SEO-ready
- **Social media management** — 3–5 AI-generated posts/week
- **Google Business setup** — profile creation + ongoing management
- **AI agents** — marketing assistants for content + customer enquiries
- **Research and strategy** — competitor analysis for Sydney small businesses

## Pricing
| Plan | Monthly | Setup |
|------|---------|-------|
| Starter | $199 | $499 |
| Growth | $349 | $799 |
| Pro | $549 | $1,299 |

No lock-in contracts. Founding offer: 50% off setup for the first 20 Sydney clients.

## Who Dorza is for
Sydney small businesses: cafes, restaurants, tradies, salons, gyms, retail, and professional services.

## Why Dorza vs a traditional agency
Traditional Sydney agencies charge ~$3,000/mo on 12-month lock-in retainers. Dorza delivers websites, social, and search visibility for ~85% less, month-to-month.

## Contact
- Website: https://dorza.app
- Email: hello@dorza.com.au
- Location: Sydney, NSW, Australia
```

---

## Search Experience Optimization (SXO)

**Score: 34/100**

### Page-type mismatches (HIGH)
Dorza's brand homepage is competing for keywords where Google rewards **dedicated service pages** + **directory listings**.

| Keyword | What ranks | What Dorza has |
|---------|-----------|----------------|
| small business website Sydney | Service page + GBP local pack | Brand homepage, no GBP |
| web design Sydney cafe | Niche service page targeting hospitality | Generic homepage |
| social media management Sydney | Category service pages + directories | Mixed into a multi-service homepage |
| done for you marketing Sydney | Explainer / blog post | Generic agency homepage |

### Persona scoring (out of 10 per dimension)

| Persona | Clarity | Trust | Friction | Next-step |
|---------|---------|-------|----------|-----------|
| Sydney cafe owner | 6 | 5 | 4 | 3 |
| Sydney tradie (first website) | 4 | 3 | 3 | 2 |
| Sydney retail on Squarespace | 5 | 6 | 5 | 4 |

The **"Join the waitlist" CTA actively blocks commercial-intent traffic.** A cafe owner ready to act today doesn't want a waitlist — they want a quote or a booking.

### Above-fold gaps
- No location signal in H1 or subline ("Sydney" is missing above the fold).
- No urgency/speed hook ("Live in 24 hours" — your sharpest differentiator — is invisible).
- No industry signal (a tradie sees agency-speak and bounces).
- No social proof unit.
- No pricing signal.

### Specific fixes
- **Change H1** to: "Sydney's fastest website and social media service for small business"
- **Sub-eyebrow above H1:** "Website live in 24 hours. No lock-in. Built for cafes, tradies, salons."
- **Change primary CTA** from "Join the waitlist" to **"Get your free mockup"** or **"Book a free call"**.
- **Add founder attribution** below the hero CTA: "Built by Mahir, a Sydneysider with 10 years in digital — not an offshore agency."
- **Update `<title>`** to: "Web Design & Social Media Sydney — Done For You | Dorza"
- **Update meta description:** "Dorza builds websites and runs social media for Sydney small businesses. Cafes, tradies, salons. Live in 24 hours. From $199/mo. No lock-in contracts."

### New pages worth creating (when post-launch)
- `/services/web-design-sydney`
- `/services/social-media-management-sydney`
- `/industries/cafes`, `/industries/tradies`

---

## Local SEO

**Score: 31/100** · Business model: **SAB (Service Area Business)**

| Field | Status |
|-------|--------|
| Name | "Dorza" — consistent |
| Address | "Sydney, NSW 2000" (locality only, no street) |
| Phone | **MISSING** — hard NAP failure |
| Email | `hello@dorza.com.au` |
| GBP | None detected |
| Reviews | None visible, no `aggregateRating` |
| Local schema | Wrong type (`Organization`, not `ProfessionalService`) |
| Sydney-targeting density | ~4–5 mentions sitewide; no suburb mentions |
| ABN | Not displayed |

### Quick wins
- Add a phone number (AU mobile or 1300) in footer, schema, and a `tel:` link.
- Swap `Organization` → `ProfessionalService` in `app/layout.tsx`.
- Wire real social profile URLs into `Footer.tsx` + the schema `sameAs`.
- Add ABN to footer.
- **Create a Google Business Profile** immediately — the single highest-leverage zero-cost local ranking lever.

### Suburb-page strategy (don't build these yet)
Pre-launch with zero authority, 20 thin suburb pages = doorway pages. Instead:
1. Establish GBP first.
2. Collect client suburbs via the waitlist form (already done).
3. After first 5 clients, build 3–5 suburb pages with **real case studies** (e.g. "Website Design for Cafes in Surry Hills").
4. Once 15+ rich pages exist, programmatic templating becomes viable.

---

## Backlinks

**Score: N/A** (pre-launch, no backlink toolchain configured locally; numeric score withheld per Tier 0 rule).

### Sydney-specific pre-launch recommendations
- Pitch Mumbrella / Dynamic Business / SmartCompany — Australian marketing trade publications, contributor-friendly.
- StartupAus / ProductHunt — Australian startup ecosystem coverage.
- Clutch.co agency profile — free, DA 70+, dominant B2B agency directory.
- Yellow Pages AU + TrueLocal — foundational NAP citations.

### 90-day target
8–15 referring domains from DA 40+ sources. Quality > volume — one Mumbrella mention > 50 low-DA directory entries.

---

## Cross-Cutting Themes (issues flagged by 3+ agents)

| Theme | Agents that flagged it |
|-------|------------------------|
| Missing `robots.txt` + `sitemap.xml` | Sitemap, Technical, GEO |
| Wrong schema type (`Organization` instead of `ProfessionalService`/`LocalBusiness`) | Schema, Local, Sitemap |
| `/admin` and `/upload` indexable | Technical, Sitemap |
| `href="#"` social links | Content, Local, GEO, Schema |
| No social proof / testimonials | Content, SXO, GEO |
| No phone number | Local, Content |
| Animated counters render `$0` on first paint | Content, GEO |
| FAQ content hidden behind `AnimatePresence` (invisible to pre-hydration crawlers) | GEO, Schema |
| No `FAQPage` schema | Schema, Content, GEO |
| Pricing as `Offer`/`ItemList` schema missing | Schema, GEO |

---

## Limitations of This Audit

- No Lighthouse field run (no Bash/Playwright in this session). Performance numbers are estimates from static analysis of `next.config.mjs`, font setup, and component patterns.
- No DataForSEO MCP, no Moz/Bing API keys, no Google API credentials → no live SERP positions, no CrUX field data, no real backlink count, no GSC indexation status.
- Live SERP analysis used trained knowledge (cutoff 2025-08), not real-time queries.
- Schema validation done by source inspection, not Google Rich Results Test against the live page.
- No screenshots / above-fold visual analysis (no Playwright).

To upgrade this audit: install DataForSEO MCP and re-run `/claude-seo:seo-audit` to get live SERP and CrUX data.

---

## See Also

- **`ACTION-PLAN.md`** — prioritised punch list with effort estimates
- Re-run this audit with `/claude-seo:seo-audit`
