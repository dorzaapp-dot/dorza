# Dorza — Copywriting Review & Optimization Plan

> Prepared 2026-05-30. Inputs: full on-site copy audit, competitor web scan (9 rivals), and SERP/keyword consultation (en-AU). This is a **plan you can implement** — concrete before→after copy, file references, priorities, and the handful of decisions only you can make. Nothing in here has been applied to the code yet.

---

## TL;DR — the strategic verdict

**Your long-form copy is genuinely good.** The Services, Industries, About, and FAQ writing is customer-voiced, specific, and conversion-literate ("Your Instagram hasn't posted since March", "my nephew built this", "PDF from 2019"). That's a real asset — most of this plan *protects* it.

The problems cluster in three places:

1. **Credibility & integrity** — a few claims will cost trust (or invite legal exposure) faster than the good copy can earn it: forward-looking "outcome" stats stated as promises, an unsourced "85% cheaper", and a tangled timeline (24h vs 2 days vs 72h). **Fix these before spending a dollar on traffic.**
2. **You're competing on the wrong claims.** The competitor scan is unambiguous: **"no lock-in" and "cheap" are table-stakes**, and you're not even the cheapest (AB Digital $99/mo, Free Tradie Crew $79/mo, Rent-A-Website $49.95/mo all undercut your $199). Your **one ownable, undisputed claim is "live in 24 hours"** — nobody else is close (the field is 7–14 days). The hero currently leads with the vague, self-awarded word **"easiest"** instead.
3. **The CTA/offer layer promises things the funnel never delivers.** "Get your free consultation" leads to a *waitlist* (homepage) or an *enquiry modal* (nav) — and neither is a consultation. One label, three mental models (consultation / waitlist / enquiry), zero consultations.

**The single highest-leverage move:** re-anchor the brand on **customer outcome + "live in 24 hours" + real Western Sydney humans**, demote "no lock-in/cheap" to supporting trust signals, and make every CTA tell one honest story.

---

## Priority legend

| Tag | Meaning |
|-----|---------|
| **P0 — Integrity** | Trust/legal risk. Fix before driving traffic. |
| **P1 — Conversion** | High-impact copy that changes whether visitors act. |
| **P2 — SEO alignment** | Copy changes that win/keep rankings. |
| **P3 — Consistency** | Lower-risk polish that tightens the system. |
| **DECISION** | Needs your input; the plan presents options. |

---

# Pricing positioning (PRIORITY — being implemented)

> Added 2026-05-30 after a pricing-strategy pass. **This supersedes the earlier "from $199/mo" anchor guidance** in §1.2 and Phase 4 — we are moving *away* from a public monthly/subscription price.

### The decision
Drop the recurring **"/month"** framing from the public site. The initial target customers (local tradies, cafes, salons) think of a website as a **one-off cost** and are averse to "another monthly bill" — leading with "$199/month" repels them, and the SERP/competitor data shows we'd lose a monthly-price fight anyway (Rent-A-Website $49.95, Free Tradie Crew $79, AB Digital $99 all undercut it). Instead: **a single one-off "from $499" anchor + a tailored quote as the call to action**, with ongoing management introduced *in the conversation*, not the headline.

### Why this is the right call (evidence)
- **You're not the cheapest on a monthly number** — but you *are* the lowest-priced **full done-for-you bundle** (vs Smart Local $259, DigitalOn $249 + lock-in, agencies $2–5k). Anchor the "cheaper" claim against **agencies**, where you win. Never claim "cheapest website."
- **Quote-driven is on-convention for local service businesses** — Parramatta Web Design (a 2025 award winner) shows no prices and converts on "free consultation." The SERP "hiding price = expensive" risk applies to faceless SaaS, not local done-for-you trades.
- **A "from $499" anchor still captures the "how much does a website cost" search cluster** and qualifies price-shoppers, so we keep a signal without a rigid menu.
- **Honesty guardrail:** the model *does* include recurring management — don't hide it. One soft line ("optional ongoing management, priced in your quote") keeps us clear of bait-and-switch (ACL) while dropping "/month" from the hook.

### The positioning model
- **Ambiguity as a feature:** "No two businesses are the same. Neither are our prices." Bespoke = made-for-you, not evasive.
- **One anchor, one action:** "Most builds start from $499" → **"Get your free quote →"** (real price sent back within 72h).
- **Value anchor vs agencies (no monthly):** "A traditional agency charges $5,000+ to build a site — and thousands a month to run it. We start at a few hundred."
- **Cheaper claim framing:** *cheaper than agencies + best-value full bundle*, using "affordable" not "cheap."

### Before → after (the copy being shipped)
- **Pricing section** (`Pricing.tsx`): replace the agency-vs-Dorza *monthly* comparison toggle + the rigid 3-tier `/mo` grid with → headline "No two businesses are the same. Neither are our prices." + a **static** agency-vs-Dorza value anchor (no monthly count-up) + a "what every build includes" scope list + "Most builds start from $499 … tailored plan and price within 72 hours, no obligation" + CTA "Get your free quote →" + founding-offer pill ("50% off your build · first 20 Western Sydney businesses") + soft line "Optional ongoing management available — we'll cover it in your quote."
- **Hero subhead** (`Hero.tsx`): "…all from $199/month, no contracts." → "…all done for you. Custom websites from $499, no lock-in." ($499 tied to *websites*, not the whole bundle — honest.)
- **Thesis stat** (`Thesis.tsx`): "$199 / Starting from, per month" → "$499 / Starting price for a custom build."
- **About differentiator + meta** (`app/about/page.tsx`): "From $199/mo — 85% less…" → "Custom websites from $499 — a fraction of agency prices"; meta "From $199/mo." → "Custom websites from $499."
- **FAQ cost answer** (`FAQ.tsx` + duplicate in `app/layout.tsx`): replace the rigid $199/$349/$549 tier breakdown with the bespoke-quote answer (start from $499, exact price in 72h, founding 50% off build, optional ongoing management in quote, no lock-in).
- **Metadata** (`app/layout.tsx`): three descriptions "From $199/mo" → "Custom websites from $499, no lock-in."
- **JSON-LD** (`app/layout.tsx`): the OfferCatalog currently asserts monthly subscription prices (`unitCode: MON`, $199/$349/$549) — update so structured data stops contradicting the page (list the services / a "from $499" starting price, drop the recurring monthly price specs).

### Open item
The **$499** anchor = the current Starter setup fee, used as the one-off build floor. If real bespoke builds start elsewhere, swap that single number everywhere.

---

# The free audit — the top-of-funnel hook (PRIORITY)

> Added 2026-05-31. A value-first lead magnet to get people *in*. **This also resolves decision D-E** (the "free consultation → waitlist / enquiry" mismatch): the audit becomes the single, honest, value-first hook, and the tailored quote (§Pricing positioning) becomes the conversion that follows it.

### Why an audit beats a "consultation" or "quote" as the hook
- **Value-first, not ask-first.** "Get a quote" asks the visitor to start buying. "Book a consultation" asks for their time. A **free audit** *gives them something* — a plain-English read on where they're losing customers — before asking for anything. Lower friction, higher trust.
- **It's differentiated.** Competitors lean on "free consultation" (AB Digital "Book a free consultation", Parramatta Web Design "free strategy consultation", Rent-A-Website "free strategy chat"). A concrete *audit of how you show up online* is sharper and more tangible for a tradie/cafe owner than a vague "chat."
- **It manufactures the urgency you already sell.** Your strongest pain line is "stop being invisible online." An audit *proves* the invisibility ("you're on page 3 for 'electrician [suburb]', your competitor's on the map pack") — which makes the quote that follows feel necessary, not pushy.
- **It feeds the quote.** The audit naturally ends with "here's what we'd fix and what it'd cost" = the tailored plan & price. Funnel: **Free audit → breakdown reveals problems → tailored plan & price → start.**

### The offer (keep it deliverable)
A genuine, focused audit of how a local business shows up online — and the easy wins they're leaving on the table (lead with what they'll gain, never how the audit is produced):
- **Where you rank** on Google & Google Maps vs nearby competitors.
- **Your Google Business Profile** — what's missing or hurting you.
- **Your current website** (if any) — mobile, speed, and whether it's actually converting.
- **A prioritised fix-list** — what's costing you customers, and what we'd do first.

Delivered as a short written breakdown (or a quick Loom/voice note) **within 72 hours** — matching your existing reply promise.

**Honesty / scalability guardrail:** a "free audit" must actually be delivered or it's bait (ACL again). Keep it lightweight and **cap it to the founding cohort** ("free for the first 20 Western Sydney businesses") — that keeps it deliverable *and* adds real scarcity. Add the trust-closer: **"Keep the report whether you work with us or not."**

### Where it lives
- **Primary CTA, site-wide:** replace "Get your free consultation" / "Get a free quote" with **"Get my free audit"** (Hero, Nav ×2, PageCTA, Pricing). One honest hook everywhere — fixes the label/destination mismatch.
- **A dedicated homepage section** — best placed between **FAQ and the final CTA** (or directly after HowItWorks), so the value offer lands before the ask. Reuse the existing section system (`Container`, `Reveal`, eyebrow + `font-display` H2, cards, `Check` icons, the primary CTA pill).
- The audit CTA points at the same enquiry pipe (`#waitlist` / `EnquiryModal`); add an optional "What do you want audited?" or "your website / Google / socials" hint so the enquiry captures intent. (Mechanically reuses `useEnquirySubmit` + `EnquiryFormFields`; consider a `source: 'audit'` value.)

### Copy (per `/copywriting`)

**Section copy**
> **Eyebrow:** `// Free audit`
>
> **Headline (recommended):** **"See exactly where you're losing customers online — free."**
>
> **Subhead:** "We'll check how your business shows up on Google, Maps, and social against your local competitors — then send you a plain-English breakdown of what's costing you customers and what to fix first."
>
> **What you get (4 bullets w/ Check icons):**
> - Where you rank on Google & Maps vs nearby competitors
> - Your Google Business Profile — what's missing
> - Your website — mobile, speed, and whether it's converting
> - A prioritised list: what's losing you customers, and what we'd fix first
>
> **How it works (3 steps):** Tell us your business → We audit your online presence → You get your breakdown within 72 hours.
>
> **Primary CTA:** **"Get my free audit →"**
>
> **Scarcity + trust microcopy:** "Free for the first 20 Western Sydney businesses. No pitch, no pressure — keep the report whether you work with us or not."

**Headline alternatives**
- A — *"See exactly where you're losing customers online — free."* (recommended — pain + value + zero-cost)
- B — *"Find out how your business really shows up online."* (curiosity-led, softer)
- C — *"A free audit of your online presence. No pitch, no catch."* (plain, trust-forward)

**CTA alternatives:** "Get my free audit →" (recommended) · "Show me my audit →" · "See where I stand →"

**Meta angle (if a standalone `/free-audit` page is wanted later):** Title `Free Online Presence Audit — Western Sydney Small Business | Dorza`; targets "free website audit" / "free google business audit" search intent (informational→commercial bridge noted in the SERP work).

### Decision for you
- **D-H — Audit vs consultation as the primary hook?** Recommended: **audit** as the top-of-funnel hook (value-first, differentiated), with the human consultation/quote as the *follow-up*, not the entry point. Confirm and I'll build the section + swap the site-wide CTAs.
- **Scope of the audit** — is the 4-point scope above what you can realistically deliver in 72h (AI-assisted)? Trim/expand before we publish the bullets.

---

# AI messaging audit — "have the secret sauce, don't sell it"

> Added 2026-05-31. **Principle:** we build with AI, but the customer should see a *standard agency that's simply faster and cheaper than the competition*. Lead with the **wins** (speed, price, quality), never the **method**. "Built by AI" lowers confidence for a small-business owner — it reads as cheap, automated, templated — the opposite of the trust they need before handing over their website. They don't need to know the secret sauce, just that we've got an edge.

### Category A — "built BY AI" process claims → being removed (in scope, low-risk)
These describe *how* the work is made and undercut the agency framing. Reworded to speed/quality outcomes:

| File | Before | After |
|---|---|---|
| `components/sections/Services.tsx` (card 01 desc) | "Hand-coded by a real team, accelerated by AI." | "Hand-coded by a real team that gets it done fast." |
| `components/sections/Services.tsx` (card 01 feature) | "Hand-coded, AI-accelerated" | "Hand-coded by a real team" |
| `components/sections/HowItWorks.tsx` (step 02) | "Our team — backed by AI — builds your website…" | "Our team builds your website…" |
| `app/about/page.tsx` (differentiator list) | "AI-powered efficiency, human-quality output" | "Senior agency quality, delivered in days not weeks" |
| `app/about/page.tsx` (story para) | "We use AI for the heavy lifting — content, research, competitor analysis — to deliver agency-quality work…" | "We've built a faster, leaner way of working — so we deliver agency-quality work at a fraction of the price and the wait…" |
| `components/sections/Footer.tsx` (bottom line) | "Made with AI and good taste" | "Built with care and good taste" |
| `components/Footer.tsx` (DEAD CODE — unused) | "The AI-powered agency for local business." | "Web design and digital marketing for local business." *(file is dead per CLAUDE.md — reworded so a grep is clean; safe to delete entirely)* |

### Category B — AI-as-a-PRODUCT (a feature the customer buys) → your call (D-I)
Separate from your instruction — these market AI as something the customer *gets*, not how we work. **Left untouched** pending your decision:
- **"AI-generated / AI-powered content calendar"** (`Services.tsx`, `lib/data/services.ts`) — telling customers their posts are AI-made *contradicts* the "content that actually sounds like you" promise and risks an "AI slop" read. **Recommend reframing → "a done-for-you content calendar."**
- **"AI agents at your disposal"** (`Services.tsx` card 04) + bundle subhead "Website, social, search, and AI — all running" + `SERVICE_OPTIONS` "AI agents" (`lib/constants.ts`) + JSON-LD "AI marketing agents" (`app/layout.tsx`) — your one deliberate AI *product*. Options:
  - **(a) Keep the capability, lead with the benefit** (recommended; ties to Phase 2.3): "AI agents at your disposal" → "An assistant that answers missed calls and enquiries." You keep the edge ("we've got it") without making AI the identity.
  - **(b) Drop AI framing entirely** and present these as standard managed services.

**D-I:** keep AI as a (benefit-framed) product, or strip it to look fully like a standard agency? Recommended: **(a)**. The Category A process-claim removals happen regardless.

---

# Phase 1 — Credibility & integrity (P0, do first)

These don't make the copy *better* — they make it *safe*. Driving paid or organic traffic onto unsubstantiated claims wastes the spend and, under Australian Consumer Law (ACL §18 misleading conduct / §29 false representations), creates real exposure.

### 1.1 · Reconcile the timeline — the #1 cross-site confusion
**Problem:** The site promises, variously: "Live in 24 hours" (Hero, Thesis, About, web-design FAQ), "built it in two days" (testimonial), "before you hang up" (Hero microcopy), and "real human follow-up in 72 hours" (Waitlist, Modal, Contact, About, onboard). A visitor can't tell if they get something in a day, two days, or three. The *reality* is: human contact in 72h → then build → live in ~24h of kickoff.

**Fix — define ONE coherent sequence and use it everywhere:**
> "We reply within 72 hours. Once you approve the plan, your site's live within 24."

- Stop positioning "24 hours" and "72 hours" as competing headline numbers. Sequence them: 72h = *when you hear from us*; 24h = *how fast we build once you say go*.
- Delete "before you hang up" from the Hero microcopy (`Hero.tsx`) — it implies an instant phone call that doesn't exist.
- Change the testimonial "built it in two days" → "two days"/"24 hours" consistent with your real claim (`SocialProof.tsx`).

**Files:** `Hero.tsx`, `Thesis.tsx`, `SocialProof.tsx`, `WaitlistCTA.tsx`, `EnquiryModal.tsx`, `app/contact/page.tsx`, `lib/data/services.ts`, About.

---

### 1.2 · The "85% cheaper" claim needs a basis or a softer frame  ·  **DECISION D-A**
**Problem:** "85% cheaper" (Thesis), "85% less" (About), and "88% off / You save $2,651" (Pricing) are three numbers from **one unsourced $3,000/mo agency strawman** the visitor can't verify. It compares your *mid* plan ($349) to an invented baseline.

**Options (pick one):**
- **(a) Anchor it** — state the basis inline: *"Up to 85% less than a typical $3,000/mo agency retainer."* One figure, one basis, used everywhere.
- **(b) Soften it** — drop the hard percentage: *"A fraction of a traditional agency retainer — from $199/mo."* (Safest; "a fraction" needs no proof.)
- **(c) Keep the number, add a footnote** explaining the comparison basis near the Pricing comparison.

**Recommended:** (b) for the Hero/Thesis (punchy, unimpeachable), (a) once near the Pricing comparison where the math is shown. Either way: **stop using three different percentages** for the same claim.

---

### 1.3 · Industry "outcome" stats are stated as promises  ·  **DECISION D-B**
**Problem:** `lib/data/industries.ts` lists, under "What you can expect": *"2x bookings", "5x more reviews in 90 days", "3-5x more Google profile views", "Top 3 Google Maps ranking in your suburb", "3-4 new enquiries per week."* Presented as expected results, these are forward promises — and "Top 3 Maps ranking" **directly contradicts your own Local SEO page**, which admirably says *"No one can guarantee specific rankings — and anyone who does is either lying."*

**Fix — reframe from promise → illustration. Options:**
- **(a) "What good looks like"** framing: relabel the block and add qualifiers (*"Results clients aim for"* / *"up to"*), so they read as targets, not guarantees.
- **(b) Tie to a named case study** ("How we got Westmead Electrical 3 enquiries a week") — converts a claim into evidence.
- **(c) Replace with process promises** you *can* guarantee ("We post 3×/week, respond to every review, and report monthly").

**Recommended:** (a) now (fast), (b) once you have a real case study. Remove "Top 3 Maps ranking" as a stated outcome regardless — it's the one that conflicts with your own honesty standard.

---

### 1.4 · Make the testimonials *read* as real  ·  **DECISION D-C**
**Context:** You confirmed these are **real clients** (we renamed them to Western Sydney businesses last session). The risk flagged by the audit is that they currently *read* as fabricated — initials-only names, no photos, no links, generic businesses, and multi-month results ("followers doubled") on a brand positioned as pre-launch "first 20 founding clients."

**Fix — add credibility markers so real proof reads as real:**
- Use first name + last initial **and** suburb (e.g. "Sam T., Westmead — Electrician").
- Add, where you have permission: a photo or business logo, and ideally a link to the **Google review** (the single strongest trust signal per the SERP work — AI Overviews and the local pack both lean on Google reviews).
- Verify each quoted result matches that client's actual timeline (don't claim "doubled over months" for a client you onboarded weeks ago).
- Resolve the "waitlist / front of the queue" posture vs. "established results" tension (see 2.4 — the waitlist framing is part of why the testimonials read as premature).

---

# Phase 2 — Hero & homepage conversion rewrite (P1)

This is where the competitor and SERP work pays off. **Re-anchor the hero on outcome + 24-hour speed + local humans.** Demote "easiest", "no lock-in", and "cheap" — they're either vague or table-stakes.

### 2.1 · Hero headline  ·  **DECISION D-D**
Current: *"Western Sydney's easiest web design and digital marketing agency"* — agency-centric, leans on the weakest word on the site, and chases a keyword the `/areas/western-sydney` page should own (see 4.2).

**Recommended copy (per the copywriting skill's output format):**

- **Option A (outcome + ownable speed) — recommended**
  > **"Get your Western Sydney business online — and getting customers — in 24 hours."**
  *Rationale: leads with the customer's outcome (customers, not "a website"), plants the one claim no competitor can match (24h), keeps the local keyword. Pairs with the per-word stagger animation already in the Hero.*

- **Option B (contrast/villain framing)**
  > **"Most agencies take six weeks. We take 24 hours."**
  *Rationale: sharp, memorable, weaponises your one differentiator against the incumbent's slowness. Slightly narrower (speed-only), so lean on the subhead for breadth.*

- **Option C (bundle + done-for-you, SEO-leaning)**
  > **"Done-for-you websites and marketing for Western Sydney small business."**
  *Rationale: closest to the SEO H1 and broadest, but the least punchy — it describes the deliverable, not the payoff. Best if SEO literalness on the homepage matters more to you than punch.*

**Subheadline (works under A or B):**
> "We build your website, run your socials, and get you found on Google — done for you, from $199/month. We reply within 72 hours; your site's live within 24 of kickoff."
*Folds in: services (SEO), price, the honest 72h→24h timeline, and "done for you."*

**Eyebrow:** drop "No lock-in" (table-stakes), keep the differentiators:
> "Western Sydney · Live in 24 hours · Done for you"

---

### 2.2 · The CTA/offer mismatch — unify the journey  ·  **DECISION D-E**
**Problem:** "Get your free consultation" (Hero, Nav) → a *waitlist* (Hero anchor) or an *enquiry modal* (Nav). Neither is a consultation. Three mental models, zero consultations.

**Fix — pick ONE offer and make every surface tell that story.** Your funnel is an enquiry form with a 72h human reply that "sends back a plan and a price." The honest, SEO-aligned name for that is a **free quote / plan & price** (your `/contact` page already targets "free website quote").

- **Primary CTA (recommended):** **"Get my free plan & price"** or **"Get a free quote"**
  *Rationale: matches what actually happens (you send back a plan + price), aligns with the `/contact` SEO target, and beats the generic "Get started"/"Submit".*
- Retire "Get your free consultation" everywhere (Hero, Nav desktop + mobile, PageCTA) unless you intend to actually offer a consultation call — if you do, then *deliver* one and keep the label.
- Resolve the **"waitlist" framing** (2.4): either it's a waitlist (then the CTA is "Join the waitlist" and the hero shouldn't say "consultation") or it's an open enquiry (then drop "waitlist/front of the queue" language from `WaitlistCTA.tsx` and `EnquiryModal.tsx`).

**CTA copy alternatives:** "Get a free quote" (clearest, SEO-aligned) · "Get my plan & price" (most specific to your promise) · "See what we'd build" (curiosity, softer commitment).

---

### 2.3 · Services section — make "AI agents" concrete
**Problem:** Card 04 "AI agents at your disposal" is the weakest card — "at your disposal" is agency-speak and "AI agents" is a product label, not a benefit. Competitors (Social Space "Starter AI Package", Smart Local "AI visibility") also wave vaguely at AI. **Nobody explains it in trade/cafe terms — that white space is yours.**

**Fix:** lead with what it *does*:
> **"An AI that answers missed calls and enquiries"** — "On-tap marketing help that learns your business: drafts your posts, replies to enquiries, and never lets a lead go cold."

Also: name "search" in the section subhead ("Website, social, **search**, and AI") → "**Google**" to match how the rest of the site talks.

---

### 2.4 · "Stop being invisible online" is your best pain line — use it earlier
The WaitlistCTA heading *"Ready to stop being invisible online?"* and the About story ("Walk down Church Street…") are the sharpest pain framings on the site, buried at the bottom / on a secondary page. Consider surfacing a version of the "invisible online" pain higher up (e.g. as the Services or Thesis lead-in).

---

# Phase 3 — Site-wide consistency (P3, fast wins)

### 3.1 · Kill the weak, repeated CTAs
| Current | Where | Replace with |
|---|---|---|
| "Learn more" | every related/relevant-service card (`services` + `industries` renderers) | "See web design →" / "Explore [service] →" (name the destination) |
| "Get started" | Starter & Pro pricing cards; PageCTA eyebrow | "Choose Starter" / "Choose Pro" (mirror the highlighted card's "Start with Growth") |
| "Get your free consultation" | Hero, Nav ×2, PageCTA | "Get a free quote" (per 2.2) |

Strong CTAs already on-site to standardise around: "Send enquiry →", "Talk to us →", "Start with Growth".

### 3.2 · Fix product-naming drift — pick ONE name
"AI agents" (Services, form chips) = "Chatbot / AI customer service chatbot" (Pricing) = "marketing help" (Services body) — one thing, three names. **Choose one** (recommend a plain-English one like "AI assistant" or the concrete "missed-call AI") and use it on every surface: `Services.tsx`, `Pricing.tsx`, `lib/constants.ts` (`SERVICE_OPTIONS`), `lib/data/services.ts`.

### 3.3 · Fix the Eastern-Sydney geography slips
On a *Western* Sydney brand, these are small strings with outsized credibility cost:
- `HowItWorks.tsx` intake visual: "Bondi Beans / Bondi, NSW" and preview URL `preview.dorza.au/bondi-beans` → use Parramatta/Penrith/Blacktown (e.g. "Parramatta Beans").
- `EnquiryFormFields.tsx` placeholder "e.g. Surry Hills" → "e.g. Parramatta".

### 3.4 · De-duplicate the FAQ source
The FAQ array is copied verbatim in `components/sections/FAQ.tsx` **and** `app/layout.tsx` (FAQ JSON-LD). They match today; they'll drift the next time pricing changes. Export once (e.g. `lib/data/faq.ts`) and import into both so the visible copy and structured data can't desync.

### 3.5 · Smaller honesty/voice fixes
- "Your Google ranking improves" (HowItWorks step 4) stated as a guarantee → "starts climbing" / "we work to improve it" (match the SEO page's honesty).
- "Same outcome. A fraction of the cost." (Pricing) → "Agency-quality work. A fraction of the cost." ("same outcome" overreaches).
- "locked-in pricing for 12 months" (onboard WelcomeScreen) collides with "no lock-in" everywhere → "your price, locked for 12 months" or "12-month price guarantee".
- Areas pages drift into formal prose ("the difference between being found and being forgotten") — pull back toward the blunt-local register the rest of the site uses.
- Source or qualify embedded stats: "70% of your traffic [is mobile]" (web-design), "42% more direction requests" (GBP). The 42% is a real Google figure — cite it; soften the unsourced 70%.

---

# Phase 4 — SEO copy alignment (P2)

From the SERP consultation. The copy rewrites above should *carry these targets* so conversion and ranking pull in the same direction.

### 4.1 · Keyword map (primary per page)
| Page | Primary keyword | Key secondary/long-tail |
|---|---|---|
| Homepage | web design **and digital marketing** western sydney | done-for-you websites for small business sydney · affordable web design western sydney |
| /services/web-design | web design western sydney | small business website design sydney · website design from $199 a month |
| /services/social-media-management | social media management western sydney | social media management for small business sydney · done-for-you social media |
| /services/google-business-profile | google business profile setup western sydney | get found on google maps sydney · gbp setup service australia |
| /services/local-seo | local seo western sydney | local seo for small business sydney · rank on google maps western sydney |
| /areas/western-sydney | **web design western sydney** (canonical) | digital marketing agency western sydney · western sydney website designers |
| /areas/parramatta | web design parramatta | website design parramatta nsw · digital marketing parramatta |
| /areas/blacktown | web design blacktown | affordable web design blacktown · small business websites blacktown |
| /areas/penrith | web design penrith | web designer penrith · local seo penrith |
| /areas/liverpool | web design liverpool (sydney) | website design liverpool nsw · digital marketing liverpool |
| /areas/campbelltown | web design campbelltown | digital marketing agency campbelltown |
| /industries/cafes-restaurants | cafe website design sydney | menu & bookings website for cafes · restaurant website design western sydney |
| /industries/tradies | websites for tradies western sydney | tradie website design sydney · affordable tradie websites |
| /industries/salons-beauty | salon website design sydney | websites for salons with online booking *(least-contested niche — easiest organic win)* |
| /about | brand: dorza western sydney web design | local web design team western sydney |
| /contact | web design western sydney contact | get a free website quote western sydney |

### 4.2 · Cannibalisation fix (do before writing) — homepage vs /areas/western-sydney
Both currently want "web design western sydney." **Canonical that bare term to `/areas/western-sydney`** (it has the service-area schema + suburb list). The **homepage competes for the combined brand promise** ("web design *and digital marketing* western sydney" / "done-for-you small business"). This is *why* the Hero rewrite (2.1) drops the bare "web design western sydney" phrasing — internally link the homepage → area page with that anchor text instead.

Other splits: GBP page owns the *setup/asset* term; Local SEO page owns the *ranking/near-me* term. Service pages stay vertical-agnostic; industry pages must lead with the vertical noun (cafe/tradie/salon); one suburb term lives on exactly one area page.

### 4.3 · Title / H1 / meta patterns (copywriter-ready, en-AU)
- **Homepage** — Title: `Web Design & Digital Marketing Western Sydney | Dorza` · H1: `Done-for-you websites & marketing for Western Sydney small business` · Meta: `Affordable web design, social media, Google Business Profile & local SEO for Western Sydney cafes, tradies & salons. From $199/mo, no lock-in. Get a free quote.`
- **Service page** — Title: `{Service} Western Sydney | Small Business | Dorza` · H1: `{Service} for Western Sydney small businesses` · Meta: `Done-for-you {service} for Western Sydney small business — {outcome}. From $199/mo, no lock-in. Free quote.`
- **Area page** — Title: `Web Design {Suburb} | Websites & Local Marketing | Dorza` · H1: `Web design & digital marketing in {Suburb}` · Meta: `Local web design, Google Business Profile & SEO for {Suburb} small businesses. Done-for-you, from $199/mo. Free quote.`
- **Industry page** — Title: `{Industry} Website Design Western Sydney | Dorza` · H1: `Websites & marketing built for {Industry}` · Meta: `Websites, social media & local SEO for Western Sydney {industry} — {industry-need} that bring in customers. From $199/mo. Free quote.`

Cross-check these against the existing `lib/seo.ts` per-page meta and reconcile.

### 4.4 · Modifier intelligence (what to put in copy)
Lead with the stack searchers actually type **and** where you're differentiated: **affordable · done-for-you · no lock-in · small business · local** (+ "24h" as a speed signal, not a primary keyword). Use **"affordable", not "cheap"** (cheap undercuts the brand and you're mid-priced, not cheapest). Treat **"near me"** as a Google Business Profile/local-pack play, not a title-tag play.

### 4.5 · Local-pack reality + E-E-A-T (sets realistic expectations)
- Suburb queries (Parramatta/Blacktown/Penrith/Liverpool/Campbelltown) are **dominated by the Google Maps 3-pack** — so the **highest-ROI investment is your own Google Business Profile + review velocity**, not just suburb landing pages. The region term ("western sydney") has a weaker pack and is the best pure-organic opportunity.
- For AI Overviews / citability the copy needs: **clickable `tel:` phone** (currently absent everywhere — JSON-LD has a TODO), **LocalBusiness JSON-LD with `areaServed` + `priceRange`** (per `CLAUDE.md`), **real Google review count + `aggregateRating`**, **FAQ schema on service/area/industry pages**, and **concise 1–2 sentence answer-first openers** per section (the format AI engines lift).

---

# Phase 5 — New copy assets worth adding

Drawn from what the best competitors do that Dorza doesn't:

1. **A "Too good to be true?" skeptic section** (Free Tradie Website Crew does this well). A $199 / 24-hour claim *creates* doubt — disarm it explicitly: "How can it be this fast and this cheap? Here's exactly how." This converts your boldest claim from a liability into proof of confidence.
2. **A stated guarantee.** AB Digital ("100% satisfaction guaranteed") and Free Tradie Crew (redo-it guarantee) both carry one; you carry none. You already have the ingredients ("you don't pay for the next month if you're not happy" lives in the FAQ) — promote it to a named guarantee with a badge.
3. **A real phone number with `tel:` links** (Nav, Footer, Contact, JSON-LD). A tradie/cafe audience expects to call; its absence undercuts "talk to a real human" and costs you the local-pack/E-E-A-T signal.
4. **A "How much does a small business website cost?" content page** — big informational search cluster in AU; capture the research intent and internally link to your service pages (per the SERP work).
5. **Hard proof numbers, even pre-launch.** "First 20 Western Sydney businesses" framing beats an empty proof bar; add Google rating + review count the moment you have them.

---

## Decisions only you can make

| ID | Decision | Why it matters | Recommendation |
|---|---|---|---|
| **D-A** | "85% cheaper" — anchor, soften, or footnote? (§1.2) | Unsourced comparative claim = ACL exposure | Soften in Hero/Thesis; anchor (with basis) at Pricing |
| **D-B** | Industry "outcome" stats — reframe how? (§1.3) | Forward promises contradict your own "no guarantees" line | "What good looks like" now; case studies later; drop "Top 3 Maps" |
| **D-C** | Testimonials — what proof markers can you add? (§1.4) | They're real (per you) but read as fabricated | Full-name-initial + suburb + Google review link/photo |
| **D-D** | Hero headline — Option A, B, or C? (§2.1) | Sets the whole brand frame | A (outcome + 24h) |
| **D-E** | The offer — quote, consultation, or waitlist? (§2.2) | One label currently means three things | "Free quote / plan & price"; retire "consultation" + "waitlist" |
| **D-F** | Phone number — do you have one to publish? (§Phase 5) | Blocks tel: links + a local-SEO signal | Publish one if it exists |
| **D-G** | "without the BS" (About) + "Made with AI and good taste" (Footer) | Tone calls — fine or off-brand for cafe/tradie owners? | Keep "without the BS" if intentional; consider a human-led footer line |

---

## Suggested implementation order

1. **Phase 1 (P0 integrity)** — timeline, "85%" basis, industry outcome stats, testimonial proof markers. *Do before any traffic spend.* (Depends on D-A, D-B, D-C.)
2. **Phase 2 (hero + CTA)** — headline, subhead, eyebrow, unified CTA/offer, AI-agents reframe. *Biggest conversion lift.* (Depends on D-D, D-E.)
3. **Phase 4.2 cannibalisation split** — decide homepage vs area-page targeting *before* finalising Phase 2 wording, so the hero copy carries the right keyword.
4. **Phase 3 consistency** — CTA cleanup, naming, geography, FAQ de-dup, honesty fixes. Fast, low-risk.
5. **Phase 4 SEO meta** — apply title/H1/meta patterns; reconcile with `lib/seo.ts`.
6. **Phase 5 new assets** — skeptic section, guarantee, phone, cost page, proof bar. As capacity allows.

**Implementation note:** all homepage copy lives in `components/sections/*`; templated copy in `lib/data/{services,areas,industries}.ts`; meta in `app/layout.tsx` + `lib/seo.ts`; form/CTA labels in `lib/constants.ts`, `EnquiryFormFields.tsx`, `EnquiryModal.tsx`, `Nav.tsx`. When you're ready to apply any phase, I can do it surface-by-surface.

---

## What's working — protect it
- The Services/Industries/About/FAQ long-form voice — blunt, local, customer-named. Don't sand this down chasing keywords.
- The anti-agency "no pitch decks, no discovery phase" line — your most consistent, cleanest differentiator.
- The Local SEO page's honesty ("anyone who guarantees rankings is lying") — make this the integrity standard the rest of the site lives up to (it currently doesn't).
- The researched, specific Area pages (Parramatta light rail, Blacktown 400k+ residents) — strong for local E-E-A-T; just warm the register.
```
