# Dorza SEO Action Plan

> **Generated:** 2026-05-17 · **Companion to:** `FULL-AUDIT-REPORT.md`
> **Site:** https://dorza.app · **Health Score:** 36/100

---

## How to use this plan

Each item has: **effort** (XS = ≤30min, S = ≤2h, M = ≤1d, L = ≤1w), **impact** (1–5), and **file paths**. Work top-down. Don't skip Critical to do nice-to-haves.

---

## CRITICAL — fix this week

These either leak the brand, block ranking entirely, or fail a core ranker.

### C1. Block `/admin` and `/upload` from search engines
**Effort: XS · Impact: 5**

Currently both authenticated portals are fully crawlable. Create two new files:

- `app/admin/layout.tsx`
- `app/upload/layout.tsx`

Each containing:
```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
```

### C2. Add `public/robots.txt`
**Effort: XS · Impact: 5**

See `FULL-AUDIT-REPORT.md` § Sitemap for the exact content. Includes disallows for `/admin`, `/upload`, `/onboard`, blocks for CCBot/anthropic-ai/cohere-ai (training-only scrapers), explicit allows for GPTBot/ClaudeBot/PerplexityBot/Google-Extended/OAI-SearchBot, and a `Sitemap:` pointer.

### C3. Add `public/sitemap.xml`
**Effort: XS · Impact: 5**

Two URLs (`/` and `/waitlist`). Exact XML in the audit report.

### C4. Add a phone number
**Effort: XS · Impact: 5**

Without one: NAP fails, GBP verification blocked, local pack ineligible. Add to:
- `components/sections/Footer.tsx` (with a `tel:` link)
- The schema `telephone` field in `app/layout.tsx`

### C5. Replace `Organization` schema with `ProfessionalService`
**Effort: S · Impact: 5**

Single largest schema gap. Unlocks Local Pack eligibility, Knowledge Panel, and pairs with GBP. Exact JSON-LD in the audit report — needs `telephone`, `geo`, `priceRange`, `sameAs`, `openingHoursSpecification`, real `logo` URL.

**File:** `app/layout.tsx`

### C6. Fix the LCP image
**Effort: XS · Impact: 5**

`components/sections/HeroBrowserMockup.tsx:173` — change `loading="lazy"` → `loading="eager"` and add `fetchpriority="high"`. Single change, LCP improvement of 1–2s.

### C7. Create a Google Business Profile
**Effort: S · Impact: 5** *(off-site; no code)*

Free. Single highest-leverage zero-cost local ranking lever. Use the same NAP that's on the schema. Requires the phone number from C4.

---

## HIGH — fix this month

### H1. Add `public/llms.txt`
**Effort: XS · Impact: 4**

Highest-ROI single asset for AI search citation. Exact content in the audit report. Also consider adding `public/llms-full.txt` with the full homepage transcript.

### H2. Replace dead `href="#"` social links
**Effort: S · Impact: 4**

`components/sections/Footer.tsx` — all three social icons (Instagram, LinkedIn, X) link to `#`. Either:
- Create the accounts and use real URLs, then populate `sameAs` in the schema, OR
- Remove the icons entirely until accounts exist.

A rater clicking a dead social icon = instant pre-launch hollowness signal.

### H3. Add `FAQPage` JSON-LD
**Effort: XS · Impact: 4**

`components/sections/FAQ.tsx` — wrap the existing `faqs` data array in a JSON-LD script tag. Note: Google restricts FAQ rich results for commercial sites (Aug 2023 policy), but the markup still materially benefits AI engine citation.

### H4. Add pricing `Offer` / `ItemList` schema
**Effort: S · Impact: 4**

Three pricing tiers are currently invisible to structured-data parsers and AI engines. Add the `ItemList` block (exact JSON in the audit report) to `app/page.tsx`.

### H5. Rewrite the hero
**Effort: S · Impact: 4**

Above-fold has no location, no urgency hook, no industry signal. Three changes in `components/sections/Hero.tsx`:
- H1 → "Sydney's fastest website and social media service for small business"
- Sub-eyebrow → "Website live in 24 hours. No lock-in. Built for cafes, tradies, salons."
- Founder attribution line → "Built by Mahir, a Sydneysider with 10 years in digital — not an offshore agency."

### H6. Change the primary CTA
**Effort: S · Impact: 4**

"Join the waitlist" actively repels commercial-intent traffic. Change to **"Get your free mockup"** or **"Book a free call"**. If you want to keep the waitlist for harvesting emails, make it a secondary CTA.

### H7. Add three real testimonials (with names + suburbs)
**Effort: M · Impact: 4**

Zero social proof = E-E-A-T floor. Reach out to your most receptive waitlist signups + cremornecoffee.com.au for a written quote + headshot + business name + suburb. Add a 3-card row directly below the hero.

### H8. Add ABN + Privacy + Terms to footer
**Effort: S · Impact: 4**

Australian compliance + waitlist data collection requires a privacy notice. Create `app/privacy/page.tsx` and `app/terms/page.tsx`. Replace "Made with AI and good taste" with `ABN: [number] · Privacy Policy · Terms`.

### H9. Fix the `$0` animated counter
**Effort: XS · Impact: 3**

Thesis section animates `0 → 0` and looks broken. Replace with `$0 lock-in fees ✓` (static) or repurpose for a real number ("48hr turnaround", "20 founding clients").

### H10. Server-render pricing & FAQ content
**Effort: S · Impact: 4**

`useCountUp` makes pricing render `$0` on first paint. `AnimatePresence` collapses FAQ answers out of static HTML. Both kill AI citation. Render the final values as static fallback or use SSR-safe initial state.

### H11. Add page-level metadata to `/onboard` and `/waitlist`
**Effort: XS · Impact: 3**

Both pages export no `metadata` → no `<title>`, no description, no canonical. Add per-route `metadata` exports following the pattern in `app/layout.tsx`.

### H12. Add `viewport` export + `canonical`
**Effort: XS · Impact: 3**

`app/layout.tsx`:
```ts
import type { Viewport } from "next";
export const viewport: Viewport = { width: "device-width", initialScale: 1 };
```
Add `alternates: { canonical: "https://dorza.app" }` to the root `metadata`.

### H13. Update the `<title>` tag for keyword targeting
**Effort: XS · Impact: 4**

Current: "Dorza — The AI agency for Sydney small business" (targets the thin-volume "AI agency" SERP).
Recommended: **"Web Design & Social Media Sydney — Done For You | Dorza"** (targets the high-volume commercial terms).

`app/layout.tsx` — update the `title` field.

---

## MEDIUM — fix this quarter

### M1. Switch off `images.unoptimized: true`
**Effort: M · Impact: 4**

`next.config.mjs` — remove the flag. Vercel's Image Optimization works for statically-exported pages **when deployed on Vercel**. Then convert raw `<img>` tags in `HeroBrowserMockup.tsx` and `Services.tsx` to `next/image` with explicit width/height/sizes. Cuts image bytes by 60–80% (WebP/AVIF + srcset).

### M2. Code-split below-fold sections
**Effort: M · Impact: 3**

`app/page.tsx` — wrap `SegmentMarquee`, `Services`, `HowItWorks`, `Thesis`, `Pricing`, `FAQ` in `dynamic(() => import(...))`. Splits the framer-motion bundle off the critical path.

### M3. Defer `react-parallax-tilt`
**Effort: S · Impact: 3**

`HeroBrowserMockup.tsx` — load Tilt with `dynamic()` and disable until after first paint. Removes a 30+KB library + `mousemove` handlers from hydration.

### M4. Replace `BrowserChrome` 35ms `setInterval`
**Effort: S · Impact: 2**

`HeroBrowserMockup.tsx:87–97` — swap the typing effect for a CSS `steps()` animation or `requestAnimationFrame` loop. Removes recurring main-thread tax.

### M5. Add font fallback adjustment for CLS
**Effort: XS · Impact: 3**

`app/layout.tsx` — add `adjustFontFallback: true` to both `Plus_Jakarta_Sans` and `Instrument_Serif` `next/font` configs.

### M6. Add a `404` page
**Effort: S · Impact: 2**

Create `app/not-found.tsx` so Next emits `404.html` into `out/`. Prevents soft-404s on Vercel static hosting.

### M7. Add security headers
**Effort: S · Impact: 3**

Create `vercel.json` with `headers` for paths `/(.*)`: `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, and a starter CSP.

### M8. Make `/waitlist` a real linked page
**Effort: S · Impact: 3**

Currently the homepage waitlist CTA scrolls to `#waitlist` (in-page anchor). `/waitlist` exists as an orphan with zero internal links. Either:
- Wire the footer "Join waitlist" link to `/waitlist` (so the orphan page gets PageRank), OR
- Delete `app/waitlist/page.tsx` and stop sitemapping it.

### M9. Make the comparison widget static-HTML readable
**Effort: S · Impact: 3**

The `ComparisonToggle` $349 vs $3,000 comparison only renders one side in static HTML (the rest depends on hydration). Pre-render both sides server-side, or use `visibility: hidden` instead of conditional render.

### M10. Add `WebSite` + `SearchAction` schema
**Effort: XS · Impact: 2**

Sitelinks searchbox signal. One JSON-LD block in `app/page.tsx`.

---

## LOW / Backlog

### L1. Add a static "Dorza is..." sentence for AI citability
**Effort: XS · Impact: 2**

Hero or a new "About" section. Single citable passage: "Dorza is Sydney's AI-native digital agency: websites, social media, and Google Business, done for you from $199/month."

### L2. Add an H2: "Who Dorza is for"
**Effort: XS · Impact: 2**

Above the `SegmentMarquee`. Static paragraph listing the verticals so a single passage answers "Who is Dorza for?"

### L3. Replace fake URL in HowItWorks
**Effort: XS · Impact: 2**

`preview.dorza.au/bondi-beans` is fictional. Reference `cremornecoffee.com.au` (real client) or a real preview URL.

### L4. Make `SegmentMarquee` visible to crawlers
**Effort: XS · Impact: 1**

Currently `aria-hidden="true"` → invisible to AI engines parsing ICP signals. Add the vertical list as visible text elsewhere.

### L5. Service pages (post-launch)
**Effort: L · Impact: 5** *(deferred until first 5 clients live)*

`/services/web-design-sydney`, `/services/social-media-management-sydney`. Each: 500+ words, portfolio grid, pricing, LocalBusiness schema. Single highest organic ranking lever — but only build after you have real case studies to populate them.

### L6. Industry pages (post-launch)
**Effort: L · Impact: 4** *(deferred until industry clients exist)*

`/industries/cafes`, `/industries/tradies`, etc. Lower competition, higher conversion. Need real client examples to be non-thin.

### L7. Suburb pages (post-15-clients)
**Effort: L · Impact: 4** *(deferred; would currently be flagged as doorway pages)*

3–5 hand-written suburb pages with real case studies. Only viable once you have client density.

### L8. Submit to AU directories
**Effort: M · Impact: 3** *(off-site)*

Clutch.co, Yellow Pages AU, TrueLocal, Hotfrog. Foundational citations.

### L9. Pitch Mumbrella / Dynamic Business
**Effort: M · Impact: 3** *(off-site)*

Founder-led editorial pitch. One quality mention > 50 low-DA directories.

### L10. ProductHunt / StartupAus listing
**Effort: M · Impact: 2** *(off-site)*

Australian startup ecosystem coverage.

---

## Sequencing recommendation

**Week 1 (do all of these):** C1–C7 + H1, H3, H9, H12 → blocks indexing risk, fixes LCP, lays the infrastructure floor. Total effort: ~1 day.

**Week 2–3:** H2, H4, H5, H6, H8, H10, H11, H13 → trust signals, schema completeness, page-type alignment. Total effort: ~3 days.

**Week 4:** H7 (testimonials — depends on outreach) + M1, M5, M6, M7 → image optimisation + headers + 404 + font CLS.

**Month 2:** M2, M3, M4, M8, M9, M10 → JS bundle optimisation + orphan-page resolution.

**Post-launch (after first 5 clients live):** L5, L6, L8, L9, L10. Skip L7 until 15+ clients.

---

## Re-run

After implementing Critical + High: run `/claude-seo:seo-audit` again to re-score. Target score after C+H block: **70+/100**. After M block: **85+/100**.
