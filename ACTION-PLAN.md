# Dorza — SEO Action Plan

**Date:** 2026-05-30 · **Companion to:** `FULL-AUDIT-REPORT.md` · **Health Score (current source):** 60/100
**Goal:** rank top in **Western Sydney** for **"digital marketing"** and **"web design / consulting services"**.

> ⚠️ This file replaces an earlier auto-generated plan dated 2026-05-17 (which scored the site 36/100 and flagged missing robots.txt/canonical/viewport/noindex — most of those are now fixed). If you want the old version back and it was tracked in git, you can restore it from history. The current plan reflects the 2026-05-30 state.

Priority key: **Critical** = do now · **High** = within 1 week · **Medium** = within 1 month · **Low** = backlog.

> Reality check: top local rankings are won by **(a) Google Business Profile + reviews**, **(b) dedicated location/service pages**, and **(c) NAP/citation consistency** — more than on-page tags. The good news: a complete Western Sydney page architecture already exists in your `out/` build; recovering it is the single highest-leverage move.

---

## CRITICAL — do now

### C1. Recover the Western Sydney multi-page source (highest leverage)
A complete, optimized site (4 service pages, 6 area pages, 3 industry pages, about, contact, `ProfessionalService`+`BreadcrumbList` schema, OG image, 16-URL sitemap on `dorza.com.au`) exists **only** as compiled HTML in `out/` (built 2026-05-26). The **source for these pages is absent** from `app/` (which currently holds only home/admin/onboard/upload). Recover that source from version control (the branch/commit the `out/` build came from). If it can't be found, reconstruct the routes from the `out/*.html` + `out/*.txt` payloads. Don't rebuild from scratch — the content and structure are done.

### C2. Decide the canonical domain, then make everything consistent
Pick **one** (recommend **`dorza.com.au`** — `.com.au` is a positive AU local trust/ranking signal). Align: canonical (`SITE_URL` in `app/layout.tsx`), `sitemap.xml`, `robots.txt` `Sitemap:`, schema `url`/`@id`, email, and social handles (Instagram `dorza.ai`, LinkedIn `dorzaai`). Note even the `out/` build was inconsistent (sitemap/robots on `dorza.app`, canonical/schema on `dorza.com.au`) — fix on recovery.

### C3. Fix the `/waitlist` 404 (sitemap + footer)
No `app/waitlist` source route exists. Either create it or repoint `Footer.tsx` `/waitlist` → `/#waitlist` and remove the `/waitlist` entry from `sitemap.xml`. A 404 in both sitemap and footer is actively harmful.

### C4. Re-target title, H1, meta to the goal (if not recovered via C1)
- **Title** (`app/layout.tsx`): e.g. `Digital Marketing & Web Design — Western Sydney | Dorza`.
- **Meta**: lead with Western Sydney + Parramatta/Blacktown/Penrith/Liverpool + the two priority services.
- **H1** (`components/sections/Hero.tsx`): include "Western Sydney" + "digital marketing"/"web design".
The `out/` build already has Western-Sydney title/H1/meta — lift from there.

### C5. Add `ProfessionalService` (LocalBusiness) schema + phone
Restore from `out/about.txt`: `@type: ProfessionalService`, address Parramatta NSW 2150, `geo` coords, `areaServed` = [Parramatta, Blacktown, Penrith, Liverpool, Campbelltown], **`telephone`**, `hasOfferCatalog`, `knowsAbout` incl. "digital marketing". Add a real AU phone with `tel:` links in Nav + Footer + `llms.txt` (none exists today — a critical local-trust + conversion gap).

---

## HIGH — within 1 week

- **H1. Set up & optimize Google Business Profile** ← biggest single lever for "digital marketing/web design Western Sydney". Primary category "Marketing agency" + secondary "Website designer"; service area = WS suburbs; same NAP as the site; hours, services, photos.
- **H2. Recover/restore `/about` + `/contact`** (E-E-A-T). The `out/` About page has the story (Church St Parramatta, values) — add named team/founder. Tighten its title/H1 from "Built in Sydney" → "Western Sydney".
- **H3. Add the OG image** — copy `out/images/og-default.png` → `public/images/` and wire `openGraph.images`/`twitter.images` in `app/layout.tsx`.
- **H4. Start a review pipeline** — ask founding clients for Google reviews; add `aggregateRating`/`Review` schema + on-site testimonials once real.
- **H5. Re-target `llms.txt`** to Western Sydney; fix the domain split; add phone.

---

## MEDIUM — within 1 month

- **M1. Service pages** (`/services/web-design`, `/digital-marketing` or `/local-seo`, `/social-media-management`, `/google-business-profile`): 600–1,200 words each, FAQs, `Service` schema. Recover from `out/` (4 already exist) and ensure "digital marketing"/"consulting" head terms are targeted.
- **M2. Location pages** (`/areas/western-sydney` hub + Parramatta/Blacktown/Penrith/Liverpool/Campbelltown): genuinely localized (local context, suburb proof, embedded map) — not thin templated copy. All 6 exist in `out/`.
- **M3. Sitemap** — generate from the real route list with accurate `lastmod`; include every recovered page; drop dead URLs.
- **M4. Internal linking + breadcrumbs** — home → services → areas → industries with cross-links; `BreadcrumbList` on inner pages (already in `out/`).
- **M5. NAP citations** — True Local, Yellow Pages AU, Yelp AU, Hotfrog, Bing Places, WS directories, all with identical NAP.
- **M6. Replace illustrative mockups with real proof** — case studies / `/work` page as clients land. Critical for ranking (helpful content) + conversion.

---

## LOW — backlog

- **L1.** Convert mockup JPEGs → WebP/AVIF; add `apple-touch-icon` PNG (favicon is SVG-only; `out/` has a `favicon.ico`).
- **L2.** Confirm `app/upload` + `app/admin` set page-level `robots: { index:false }` (not just robots.txt disallow).
- **L3.** Blog/resources hub ("How much does a website cost in Western Sydney?", "Digital marketing for tradies") for informational intent + internal-link authority.
- **L4.** After launch, verify in Search Console + run PSI/CrUX for real Core Web Vitals (watch INP given framer-motion).
- **L5.** Add `Service` schema per service page on recovery.

---

## Suggested sequence (fastest path to the goal)

1. **Today:** C1 (recover the `out/` source) + C2 (domain) + C3 (waitlist 404) + H3 (OG image). This alone restores the entire Western Sydney architecture.
2. **Week 1:** C4/C5 cleanup + H1 (GBP) + H2 (about/contact) + H4 (reviews) + H5 (llms.txt).
3. **Weeks 2–4:** M1–M4 (service/location pages live + sitemap + internal links).
4. **Month 2+:** M5 (citations), M6 (real case studies), L3 (blog), L4 (CWV verification).

**Why this order:** C-items unblock indexing, stop active harm, and recover the (already-built) ranking architecture; GBP + location/service pages + reviews are the actual levers for competitive Western Sydney local terms. On-page tags alone won't reach the top — the multi-page local structure + GBP/reviews will.
