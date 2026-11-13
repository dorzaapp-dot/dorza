# Dorza reposition and rebrand: design spec

**Date:** 12 November 2026
**Status:** Draft for Mahir's approval. Nothing here is built yet.
**Plan that implements it:** `docs/superpowers/plans/2026-11-12-dorza-reposition.md`
**Written from:** the live site, a read of `dorzaapp-dot/dorza` at `master` (commit `617598b`), the Dorza Design System v7, and the two client sites (drivablehire.com.au, activerisehealth.com.au) as they stood on 11 and 12 November 2026.

---

## 1. Goal

Turn dorza.com.au from "Western Sydney's easiest web design and digital marketing agency" into the site of an Australia-wide team that helps a small business **start**, **grow** and stay **supported**, with two real client builds as the proof, in the v7 visual system and a calmer voice.

## 2. Decisions

### Made by Mahir (binding)

| # | Decision |
|---|---|
| M1 | Australia-wide brand. Local pages stay live "in the back end" and keep working for local search. |
| M2 | Identity is three roles: helps you get started, helps you grow, supports your business. |
| M3 | The current site's voice goes. |
| M4 | Drivable and Active Rise Health are the two case studies. |
| M5 | The Dorza Design System v7 ("tightened sage") is the visual system. |
| M6 | Honest about services that aren't live. No advertising what can't be delivered. |

### Made for you in this spec (flip any of them before execution)

| # | Decision | Why | How to flip |
|---|---|---|---|
| D1 | Impeccable works **inside** v7. It does not invent a new look. | v7 is your pinned brand, and Impeccable's own rule is "the brief wins". | Run `/impeccable` new-work with a replacement world. That is a different, bigger project. |
| D2 | **No eyebrow label above headings** on brand pages. Geist Mono stays for real metadata: status tags, prices, dates, URLs, timeline markers, nav. | v7 uses `// EYEBROW` everywhere. Impeccable treats an eyebrow over a heading as a hard ban, and its detector will flag every one. Headings carry themselves. | Add `Eyebrow` back above section headings and run `/impeccable hooks ignore-rule` for that rule. |
| D3 | Primary action is **"Get a quote"**, which leads to the existing enquiry form. | There is no calendar tool in the repo, and "exact plan and price within 72 hours" is a promise the site already makes. | Change `CTA_LABEL` in `lib/site.ts` and point it at a booking link. |
| D4 | Pricing stays as one honest line: websites from $499, exact quote in 72 hours, no lock-in. No tier table. | The site, `llms.txt` and the knowledge base disagree on tiers ($199/$349/$549 a month in `llms.txt`, nothing on the site). I don't have your current tiers. | Follow-up plan "Pricing tiers" once you confirm them. |
| D5 | Case studies ship **unpublished**. They render in dev and preview, and go public when you flip `published: true` after each owner says yes. | Neither owner has approved yet, and each case study has facts to confirm (section 12). | Set `published: true` in `lib/data/work.ts`. |
| D6 | The testimonial (Sam T., Westmead Electrical), the "0h / 0% / $0" stats, the unlabelled mock businesses and the industry "up to 3-5x" numbers are **removed**. | None has a source I could find. A site that sells proof can't carry them. | Restore any one by adding its source to `docs/proof-sources.md` and re-adding it. |
| D7 | Founders are named on About: Mahir Mahbub and Adi Widodo, with a line each. No photos. | A named person is the cheapest trust signal available. | Remove an entry from `FOUNDERS` in `app/about/page.tsx`. Check with Adi first. |
| D8 | Old colour class names (`primary`, `accent`, `dark`...) are kept as **aliases** pointing at v7 colours. | Onboarding, admin, upload and the client demos use them 300+ times and are out of scope. Aliasing recolours them safely with no edits. | Follow-up plan "Retire legacy class names". |
| D9 | The site stays a static export. Tests are added with Vitest. | `output: 'export'` is load-bearing (forms post to Supabase edge functions). The repo has no tests today. | n/a |
| D10 | Social media management keeps its page and URL but is shown as "Ask us" under Grow, not as a headline service. | Your brief lists it without a status, and it's not in your "active" list. | Change its `status` to `live` in `lib/data/pillars.ts`. |

## 3. Positioning

**Dorza is the one team an Australian small business calls for its tech: to get started, to grow, and to keep things running.**

- **For:** owner-run Australian small businesses with nobody looking after their tech.
- **Against:** doing it yourself at night, or an agency that builds a site and leaves.
- **Promise by stage:** Start (get online and set up properly), Grow (get found, get booked), Support (someone picks up).
- **Proof:** Active Rise Health is the Start example. Drivable is the Grow example. Support is shown by Dorza still looking after both.
- **Descriptor kept:** "The tech team you don't have." It is the About page headline.
- **AI and measurement:** AI is how Dorza works and gets one short section. Measurement is **not claimed** on this build, because neither client site tracks enquiries by source yet. It arrives with the attribution plan (section 13).

## 4. Voice rules

Every rule below is enforced by `tests/voice.test.ts` or checked at the copy review in Task 14.

1. Calm, plain, certain. No digs at agencies, Wix or anyone else.
2. Headlines are short declaratives in sentence case that end in a full stop. Proof and numbers go underneath.
3. Second person. The reader is "you", Dorza is "we". Never "clients" or "users" in customer copy.
4. Australian spelling. No exclamation marks, no emoji, no em dashes.
5. No suburb or region names in the brand layer (home, pillars, about, FAQ, nav, footer). Places live on local pages and in case studies, where they are facts about the client.
6. A number appears only when a client or a Dorza promise is behind it. The allowed promises today: from $499, quote within 72 hours, no lock-in.
7. Banned words: easiest, BS, slapped, invisible online, solutions, leverage, synergy, cutting-edge, game-changing, revolutionary, unlock, empower, seamless, elevate.
8. Words to lean on: start, grow, support, set up, look after, sorted, stay.

## 5. Site map

| Route | State | Layer | In nav | Purpose |
|---|---|---|---|---|
| `/` | Rebuilt | Brand | logo | The three stages on one timeline, each proven by a client. One action: get a quote. |
| `/start` | New | Brand | yes | Getting a business online. Live and "ask us" services, three steps, Active Rise as proof. |
| `/grow` | New | Brand | yes | Getting found and handling demand. Drivable as proof. |
| `/support` | New | Brand | yes | What happens after go-live. The shortest page, on purpose. |
| `/work` | New | Brand | yes, once one study is published | Case study index. |
| `/work/[slug]` | New | Brand | via index | One case study. Two exist: `drivable`, `active-rise-health`. |
| `/about` | Rewritten | Brand | yes | "The tech team you don't have." Two founders, three principles. |
| `/contact` | Restyled | Brand | footer | Phone, email, enquiry form. Suburb list removed. |
| `/privacy` | New | Brand | footer | Plain-English privacy summary. Needs a legal check before launch. |
| `/areas` | New | Local | footer only | Quiet index of the local pages, so they stay linked. |
| `/areas/[slug]` | Kept, restyled | Local | via `/areas` | Six existing local pages. URLs unchanged. Keep their local wording. |
| `/industries/[slug]` | Kept, restyled | Industry | footer | Three existing pages. Unsourced outcome stats removed. |
| `/services/[slug]` | Kept, re-voiced | Brand detail | from pillar pages | Four existing pages. URLs unchanged. |
| `/website-cost` | Kept, restyled | Brand detail | footer and `/start` | Existing guide, now linked. |
| `/onboard`, `/admin`, `/upload`, `/demo/*` | Untouched | Internal | no | Recoloured through aliases only. |

No URL is removed. No redirects are needed.

## 6. Homepage direction contract

This is the text for the Impeccable surface brief on `app/page.tsx` (Task 2 writes it there). Mode: **Persuade**.

- **THESIS:** The page is one timeline. A single hairline spine runs from "Day one" to "Every day after", and Start, Grow and Support hang off it in the order a business meets them, each with a real client at that stage. It refuses the category default: a centred hero over three equal pillar cards.
- **OWN-WORLD:** The v7 paper system. Grounds change by section: chalk for the hero and the timeline, then paper, haze, and forest for the close. Newsreader for display, Geist for reading, Geist Mono only for timeline markers, status, prices and URLs. Pine actions, one claret beat per frame (ochre on forest), 2px corners, hairline rules, grain. No gradients, no cards with shadows at rest.
- **STORY:** The visitor learns who does what ("You run the business. We'll mind the tech."), finds their own stage on the line, sees a business like theirs already there, learns the price logic and that there's no lock-in, and asks for a quote.
- **FIRST VIEWPORT:** Chalk ground. Two-line headline at display size, left-aligned, "mind" in claret italic. Lede under it. One large pine button "Get a quote" and a text link "See the work". A mono line: "QUOTE WITHIN 72 HOURS · NO LOCK-IN". The spine starts directly beneath, and at 1280 by 800 its first tick and the marker "DAY ONE" are above the fold, so the page reads as a timeline before any scroll.
- **FORM:** Timeline spine. `seed: none (pinned)` "Three pillars, in the order a client moves through them."
- **FINISH:** unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

**Signature interaction:** the spine draws itself in pine as you scroll, and each stage marker's tick is reached by the line as its content settles. With reduced motion the spine is fully drawn and nothing moves.

## 7. Where case studies sit

1. **On the homepage timeline.** Each stage carries its client as proof, in a real screenshot frame with the case study headline. This is the main position: proof arrives exactly where the claim is made.
2. **On each pillar page**, as the closing proof block.
3. **In `/work`**, as a two-item index that will grow.
4. **In the nav** as "Work", shown only when at least one study is published.

Case study page shape: headline, one-line summary, live-site screenshot, a facts table set in mono, "The problem", "What we built" as titled paragraphs, an optional result and quote (rendered only when supplied), and a closing action.

## 8. Motion

House rules from v7 hold: ease `cubic-bezier(0.23, 1, 0.32, 1)`, durations 160 / 280 / 480 / 600ms, stagger 45ms, never spring, bounce, float or pulse. Content is visible without JavaScript.

| # | Motion | Where | Job |
|---|---|---|---|
| 1 | **Spine draw** (focal). A pine rule scales from the top as the timeline scrolls through view. | Homepage timeline | Shows progress through a business's life. The one authored moment. |
| 2 | **Line set-down.** Each headline line rises into place behind a mask, 600ms, 90ms apart. | Homepage and pillar H1 only | Page arrival. |
| 3 | **Paper settle.** Blocks fade up 20px over 480ms as they enter view. Lists stagger 45ms, capped at six items. | Stage content, case study sections | Reading order. |
| 4 | **Lift.** Clickable cards and buttons rise 1px over 160ms. Press scales to 0.98. | Buttons, work cards, nav links | Feedback. |
| 5 | **Menu.** Mobile panel opens over 280ms, links stagger 45ms. | Nav below 860px | State change. |
| 6 | **FAQ.** Height and opacity over 280ms. | FAQ | State change. |

Removed: float, bounce, breathe and pulse keyframes, the tilt effect, the marquee, count-up numbers, slide-in mock panels, section wave dividers.

## 9. Assets

v7 allows real photography and typed glyphs, and bans illustration, gradients and drawn imagery. So the asset list is short and real.

| Asset | Source | Path |
|---|---|---|
| Client site captures, desktop and mobile | `scripts/capture-work.mjs` screenshots the live sites | `public/images/work/<slug>/{desktop,mobile}.jpg` |
| Share images: one default, one per case study | `scripts/og-images.mjs` renders an HTML template in v7 | `public/images/og/{default,<slug>}.png` |
| Favicon | Authored SVG: the wordmark's "o" as an ochre ring on forest | `app/icon.svg` |
| Grain | Already in the repo, matches v7 | `components/ui/GrainOverlay.tsx` |
| Founder or client photography | **Not available.** Striped placeholders are not used on brand pages; the layout works without photos. | n/a |

Retired: `public/images/mockups/*` (stock cafe, salon and tradie shots, old orange favicon) leave the brand pages. Keep the files until the industry pages are reworked.

## 10. Honesty rules

1. A service is `live` only if Dorza could deliver it to a paying client next week. Everything else is `ask` ("Ask us") or absent.
2. IT helpdesk, managed security and ERP are **absent** until a partner is signed.
3. No statistic, testimonial or client name ships without a source recorded in `docs/proof-sources.md`.
4. Sample or mock businesses never appear on brand pages.
5. A case study is public only with the owner's written OK.

## 11. PRODUCT.md

Task 2 writes this file through `/impeccable init`, confirming each section with Mahir.

```markdown
# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Owner-run Australian small businesses with nobody looking after their tech. They arrive from a referral, a search or a link to a case study, usually on a phone, usually between jobs. They want to know three things fast: do you work with businesses like mine, what will it cost, and will you still be around afterwards.

## Product Purpose
Dorza is a two-founder team that builds and looks after the tech a small business needs: the website, getting found, booking and admin systems, and support after launch. The site's job is to turn a visitor into an enquiry. Success is a steady flow of quote requests from the right kind of business.

## Positioning
One team across three stages of a small business: start, grow, support. The same people who build it look after it, with no lock-in.

## Operating Context
Enquiries arrive through one form that posts to a Supabase edge function. Dorza replies with a plan and a price within 72 hours. Work is delivered remotely. The founders run Dorza alongside other work.

## Capabilities and Constraints
- Live today: websites and hosting, Google Business Profile, SEO and content, custom builds such as booking systems, site care after launch.
- Offered on request, not advertised as live: domain and email setup, brand basics, social media, paid ads, online stores, CRM setup, Google Workspace and Microsoft 365 setup.
- Not offered yet: IT helpdesk, managed security, ERP.
- Next.js 14 static export. No server routes. Forms go to Supabase edge functions.
- Undecided: pricing tiers, a calendar booking tool, enquiry source tracking.

## Brand Commitments
- Name: Dorza. Wordmark is typed: d, a claret o, rza.
- Visual system: Dorza Design System v7 (forest and pine greens, warm whites, claret accent, Newsreader, Geist, Geist Mono, 2px corners, hairlines, grain, no gradients).
- Voice: calm, plain, certain. Short declarative headlines. Australian English.
- Promises: websites from $499, exact quote within 72 hours, no lock-in, you own what we build.

## Evidence on Hand
- Drivable (drivablehire.com.au): website and booking system. Owner approval to feature: pending.
- Active Rise Health (activerisehealth.com.au): practice website. Owner approval to feature: pending.
- No testimonials, no review counts, no result numbers. None may be invented.

## Product Principles
1. Only promise what's live.
2. Proof sits beside the claim it supports.
3. The customer's stage decides the page, not Dorza's service list.
4. One action per page.

## Accessibility & Inclusion
WCAG 2.2 AA. Content readable without JavaScript. Reduced-motion path for every animation.
```

## 12. Confirm before publishing each case study

**Drivable**
- Owner's written OK to be named and linked.
- "Usually starts with a phone call" is fair to say about wheelchair accessible vehicle hire.
- What the booking system does behind the site, in your words. The copy says only that it holds the fleet and the bookings.
- Fix on drivablehire.com.au before linking: the live test listing (`/fleet/test`), "-35" chair positions, page addresses that don't match their vehicles, two vehicles with one name in the form, empty tradie and formal categories.
- The live line "Long-term hire funded through an NDIS plan is one of the things we set up." Your earlier research said to get that wording confirmed in writing first.
- Optional: go-live date, a result, a quote.

**Active Rise Health**
- Yoon's written OK to be named and linked.
- That the "no front door of their own" problem is how Yoon would put it.
- Optional: go-live date, a result, a quote about working with Dorza (about the website, not about treatment).
- Worth fixing on that site: the stock share image named "hero-massage-therapy.jpg", and "Book" buttons that open an enquiry form.

## 13. Out of scope, in order of what comes next

1. **Attribution plan:** enquiry source capture, tracked links per partner, a leads view. Until this ships, the site does not claim "we can prove what's making you money".
2. **Pricing tiers:** Starter, Growth and Pro mapped to Start, Grow and Support.
3. **Channel pages:** referral partner page, private mockup landing pages, a hire-business industry page, the fixed Start bundle.
4. **Retire legacy class names** in onboarding, admin and upload.
5. **Legal:** a lawyer's review of the privacy page, and terms.

## 14. Open questions that don't block the build

1. Is apex (`dorza.com.au`) or `www` the primary domain in Vercel? The code canonicalises to apex; the live site serves `www`.
2. Is the LinkedIn handle still `dorzaai`? Instagram is set to `dorza.digital` per the design system.
3. Can a Start build really go live inside a week? "Open by Friday." depends on it.
4. Does "Not happy with the build? You don't pay." still stand for larger custom builds? The FAQ keeps it for the build fee only.
