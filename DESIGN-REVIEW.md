# Dorza Homepage — Design Review & Implementation Plan

> Reviewer pass: 2026-05-30 · Scope: `app/page.tsx` and all `components/sections/*` it composes, plus tokens (`tailwind.config.ts`, `app/globals.css`), `app/layout.tsx`, and the new UI primitives (`SectionDivider`, `ScrollProgress`, `GrainOverlay`).

## Verdict (read this first)

The homepage is **already strong**. It avoids the generic-SaaS traps the brief worries about: the terracotta (`#D4845A`) + sage (`#6B8F71`) editorial palette is distinctive, Instrument Serif as a display face gives it real character, the motion is disciplined and consistently honours `useReducedMotion()`, and the rotating browser-mockup hero is a memorable, on-message device for a "we build websites" agency.

So this is a **sharpening pass**, not a rebuild. Nothing here is "the page is broken." It's: tighten the copy repetition, finish the palette you started (sage is underused), fix a handful of real readability/contrast issues, resolve background-rhythm gaps, and make **two genuine product decisions** (desktop nav, and the auto-advancing testimonial). Implement as much or as little as you like — items are independent unless noted.

### Severity legend

| Tag | Meaning |
|-----|---------|
| **P0** | Real UX/readability/accessibility issue — fix these first |
| **P1** | Noticeable polish / consistency gap — high value, low risk |
| **P2** | Taste-level refinement — do if you have time |
| **DECISION** | A product call only you can make; plan presents the options |

---

## P0 — Fix first (readability, accessibility, structure)

### P0-1 · Low-contrast muted text fails WCAG AA
**Where:** `--color-text-muted: #888888` (globals.css / tailwind `text-muted`), used heavily for 10–11px mono labels across `Hero`, `Services`, `HowItWorks`, `Pricing`, `WaitlistCTA`; plus `text-white/30` and `text-white/40` on the dark sections (`Footer`, `WaitlistCTA`, `SegmentMarquee`-adjacent microcopy).

**Problem:** `#888` on white is ~3.5:1 — below the 4.5:1 AA threshold for normal text. At 10–11px these labels are *small* text, where contrast matters most. `white/30` (≈3:1 on `#1A1A2E`) fails too. This is the single most common real defect on the page.

**Fix:**
- Darken muted to ~`#717171` (≈4.6:1 on white) — change in **both** `tailwind.config.ts` and `globals.css` `:root` (tokens are duplicated; the project convention is to change both together).
- On dark sections, lift the faintest labels from `white/30` → `white/45` and `white/40` → `white/55`.
- The decorative `// section` eyebrows are arguably "large-ish bold" but they carry meaning (section labels) — include them.

**Effort:** S. Two token edits + a find/replace on `white/30`–`white/40`. Re-check the 50%-off founding-client pill (`text-primary-dark` on `bg-primary-tint`) — that one already passes.

---

### P0-2 · Hero sub-headline is clamped too narrow on mobile
**Where:** `components/sections/Hero.tsx:75` — `max-w-xs sm:max-w-md`.

**Problem:** `max-w-xs` = 20rem (320px). On a 375px phone the primary value-prop sentence ("We build your website, run your social media, and get you found on Google…") wraps into a cramped, ragged column well before the screen edge, while the headline above it runs full-width. It reads like a layout bug.

**Fix:** Drop the `xs` clamp. Use `max-w-md` (or `max-w-[34ch]` for an optimal measure) at all breakpoints, or `max-w-sm sm:max-w-md`. Let the line breathe on mobile.

**Effort:** XS — one class.

---

### P0-3 · Auto-advancing testimonial is too fast to read — and it's the only social proof
**Where:** `components/sections/SocialProof.tsx` — `CYCLE_MS = 5000`, auto-rotates one ~40-word quote every 5s.

**Problem:** 40 words at a comfortable reading pace is ~10–12s. A 5s auto-advance means most visitors never finish a testimonial before it swaps — a well-known carousel anti-pattern. Compounding it, this is the *entire* social-proof section: one quote at a time, initials-only avatars, no logos or aggregate proof.

**Fix (two parts):**
1. **Slow or stop the auto-advance.** Raise `CYCLE_MS` to ~9000, or — better — remove the interval and keep only the dot controls (the dots already exist). If you keep auto-play, pause it on hover/focus (the marquee already models this pattern in CSS).
2. **Make the section earn its space** (see also P1-5). Consider showing all three quotes as a static 3-up on desktop instead of rotating, so the proof is *all visible at once* rather than rationed.

**Effort:** S for (1); M for the 3-up relayout in (2).

---

### P0-4 · Right-aligned body paragraphs in "How it works" hurt readability
**Where:** `components/sections/HowItWorks.tsx` — `StepContent` applies `md:text-right` (and `md:ml-auto` on the paragraph) for odd steps in the desktop zig-zag.

**Problem:** Right-aligning a *multi-line body paragraph* gives it a ragged left edge, which the eye has to re-find on every line — measurably slower to read. Right-alignment is fine for a short heading or a number, not for 2–3 sentences of explanation.

**Fix:** Keep the **heading + eyebrow** right-aligned for the zig-zag rhythm, but force the **paragraph back to `text-left`** even in the right column. Visually the block still sits on the right side of the grid; only the internal text ragging changes.

**Effort:** XS — split the alignment: heading keeps `align`, paragraph hardcodes left.

---

### P0-5 · Background rhythm collapses between SocialProof → Pricing
**Where:** `app/page.tsx:27-28`. `SocialProof` (`bg-white`) is immediately followed by `Pricing` (`bg-white`) with **no `SectionDivider` between them**. Everywhere else you alternate white/warm and drop a divider; here two white sections butt together and read as one long undifferentiated stretch.

**Problem:** The page's section rhythm — which is otherwise a real strength — visibly breaks at this seam. The eye loses the "new section" signal right before the most important conversion section (pricing).

**Fix (pick one):**
- Give `SocialProof` `bg-warm` so it alternates against the white `Pricing`, **and/or**
- Insert `<SectionDivider fill="#FFFFFF" />` between them (matching the divider grammar used elsewhere).
- While here, audit the whole divider sequence in `page.tsx` for consistency: dividers currently appear after Services, HowItWorks, Thesis, Pricing, FAQ — but not after Hero/SegmentMarquee or around SocialProof. Decide on one rule ("a divider at every background change") and apply it uniformly.

**Effort:** S — one background swap + one divider; M if you do the full audit.

---

## P1 — High-value consistency & polish

### P1-1 · "No lock-in / cancel any time" is repeated ~6 times
**Where:** Hero eyebrow (`Hero.tsx:55`), Hero trailing microcopy (`Hero.tsx:103`), Pricing founding-client pill, FAQ (two answers), WaitlistCTA microcopy (`WaitlistCTA.tsx:93`), Footer-adjacent. "No lock-in" alone appears 3× in the hero.

**Problem:** Repetition past 2–3 instances stops reinforcing and starts reading as filler — it dilutes the very message it's trying to land.

**Fix:** Pick **two** high-leverage placements (Hero eyebrow + Pricing/Waitlist) and cut the rest. In the hero specifically, collapse the two trailing microcopy lines (`Hero.tsx:99-104`) into one — right now "Tell us about your business… plan and a price before you hang up" + "No lock-in contracts · Built for Western Sydney" stack two muted lines under the buttons, which is visually heavy and redundant with the eyebrow.

**Effort:** S — copy edits only.

---

### P1-2 · Sage (the second half of your "two-colour palette") is barely used
**Where:** Palette intent is terracotta + sage. In practice `accent` (sage) only appears on tiny eyebrow labels and `Check` icons. Terracotta carries ~95% of the colour weight.

**Problem:** The brief's own principle — "dominant colour with sharp accents" — is half-delivered. Sage is present but never *felt*. The palette reads as "terracotta with green ticks."

**Fix (low-risk options):**
- Let **one** section own sage as its accent — the natural fit is the **GrowthVisual** in HowItWorks (enquiries trending *up* → sage is already your success/positive hue via `accent-tint`/`status`), or the SocialProof section.
- Give the sage role to the **"// Why dorza" Thesis stats** underline/keyline, or one of the three Thesis stat numbers, so sage anchors a moment rather than only garnishing.
- Keep CTAs terracotta — don't split the action colour. This is about giving sage *one substantial home*, not balancing 50/50.

**Effort:** S–M depending on how far you take it. **DECISION-adjacent:** which section sage should own is a taste call — see Decision D3.

---

### P1-3 · Eyebrow style is inconsistent (`// comment` motif applied unevenly)
**Where:** Most sections use the code-comment eyebrow (`// What we do`, `// How it works`, `// Why dorza`, `// Questions`, `// Pricing`, `// Waitlist…`). But the **Hero** eyebrow is plain text ("Live in 24 hours · No lock-in · …") and the **Pricing comparison** eyebrow is plain ("See the difference").

**Problem:** The `//` motif is a nice, deliberate "built by people who code" signal — but applying it to 6 sections and not the 2 most prominent ones (hero, comparison) makes it read as accidental rather than systematic.

**Fix:** Commit or cut.
- **Commit:** bring the hero + comparison eyebrows into the `//` system (or a consistent `·`-delimited system) so every eyebrow shares one grammar.
- **Cut:** if `//` feels too dev-y for cafe/tradie/salon owners (your actual audience), drop it everywhere in favour of the plain uppercase-mono label the hero already uses. Either is fine; the current mix is the problem.

**Effort:** S — copy/format edits across ~7 files.

---

### P1-4 · "Serif treatment" is applied inconsistently to item titles
**Where:** Section H2s use `font-display` (serif) — good and consistent. But within sections: **Pricing plan names** ("Starter/Growth/Pro") use `font-display` serif at 34px (`Pricing.tsx:91,133`), while **Service titles** and **Step titles** use `font-body` semibold sans (`Services.tsx:325`, `HowItWorks.tsx:250`).

**Problem:** The rule "serif = section headers + pull-quotes, sans = everything else" is *almost* coherent — Thesis/SocialProof pull-quotes correctly use serif italic. The one wrinkle is pricing plan names jumping to serif while sibling item-titles (services, steps) stay sans. A reader can't infer why "Growth" is serif but "Social media on autopilot" isn't.

**Fix:** Decide the rule and enforce it. Cleanest: **serif for section headers + pull-quotes only**; demote pricing plan names to `font-body` semibold to match service/step titles. (Or, if you love the serif plan names, that's a defensible "this is a featured object" exception — just make it deliberate, not incidental.)

**Effort:** S — a couple of class swaps.

---

### P1-5 · Testimonials may read as fabricated (same fictional brands as the hero mockups)
**Where:** `SocialProof.tsx` testimonials are attributed to "Sydney Trade Co.", "Cremorne Coffee Co.", "Bondi Hair Studio" — **the exact same fictional brands** shown in the hero browser mockups (`HeroBrowserMockup.tsx`).

**Problem:** A savvy visitor who notices the hero mockups are illustrative, then sees the *same* business names quoting glowing testimonials, will read the proof as invented — which can undercut trust more than having no testimonials at all. (You're pre-launch / founding-client stage, so real testimonials may not exist yet — understandable.)

**Fix (DECISION — see D2):**
- If real clients don't exist yet: **reframe honestly.** Replace "what our clients say" with a "what you'll get / our promise" framing, or a founder note, or representative-outcome cards clearly labelled as illustrative. Don't borrow the mockup brand names for quotes.
- If/when real testimonials exist: use real names + (ideally) real logos, and **decouple them from the mockup brand set.**

**Effort:** S (copy reframe) to M (section redesign).

---

### P1-6 · Infinitely animating footer logo
**Where:** `components/sections/Footer.tsx:65` — the footer wordmark has `animate-breathe` (perpetual scale + opacity pulse).

**Problem:** A logo that breathes forever in the footer is a low-key distraction with no functional purpose, and it's the kind of motion that reads as "effect for effect's sake." It also runs continuously (minor battery/CPU cost) for no payoff.

**Fix:** Remove `animate-breathe` from the footer logo. If you want a moment of life, make it a one-shot reveal on scroll-into-view via `Reveal`, not an infinite loop.

**Effort:** XS.

---

### P1-7 · GrainOverlay sits above *everything*, including nav and modals
**Where:** `components/ui/GrainOverlay.tsx` — `fixed inset-0 z-[9999]` with `mixBlendMode: "multiply"`, rendered in `app/layout.tsx` after `{children}`.

**Problem:** `pointer-events-none` correctly prevents click-blocking, but at `z-9999` + `multiply` the grain composites over the fixed nav, the `ScrollProgress` bar, and the `EnquiryModal`. On light modals/surfaces multiply-grain is fine; the risk is subtle muddying of the modal and the terracotta scroll bar. It also tints the dark sections where grain adds little.

**Fix:** Verify visually that the modal and scroll bar look clean (open `EnquiryModal`, scroll). If they don't, either drop the grain `z-index` below the nav/modal layer (e.g. `z-[5]`) so it only textures content, or exclude it from dark sections. Likely a no-op after verification — but worth a deliberate check rather than leaving it at 9999 by default.

**Effort:** XS to verify; S if you re-layer.

---

## P2 — Taste-level refinements

### P2-1 · Hero headline is long and leans on a soft superlative
**Where:** `Hero.tsx:9` — "Western Sydney's easiest web design and digital marketing agency" (11 words, wraps to 4–5 lines at the 88px display size).

**Thought:** "easiest" is a vague, unprovable claim and the line is long for an editorial serif hero. The strongest landing headlines are short + concrete (your own copy rules say "max 8 words, benefit-driven"). Consider something like *"Your business, found online in 24 hours"* or *"We build it. We run it. You get back to work."* — and let the 24h / $199 / no-lock-in specifics live in the sub-headline (where they already are). Keep the per-word stagger animation; it'll hit harder on a tighter line.

**Effort:** S — copy + re-check wrap at each breakpoint. **DECISION D1.**

---

### P2-2 · A lot of competing auto-motion above the fold and down the page
**Where:** Hero mockup cycles every 3.6s + typing-URL animation; testimonials every 5s; pricing comparison auto-flips after 1.4s; segment marquee scrolls continuously; scroll-progress bar; per-step pipeline fill.

**Thought:** Individually each is tasteful. Collectively, there's always *something* moving, which can feel busy and slightly lower the "premium/calm" register the editorial palette is going for. None of this is wrong — but consider whether the page would feel more *confident* with one or two of the auto-loops slowed or made interaction-triggered (the testimonial in P0-3 is the first candidate; the pricing auto-flip is the second — a one-time reveal is charming, but make sure it doesn't replay distractingly).

**Effort:** S per item; mostly a judgement call about restraint.

---

### P2-3 · SectionDivider is a single generic wave shape
**Where:** `components/ui/SectionDivider.tsx` — one gentle `C480,0 960,0 1440,60` curve reused at every seam.

**Thought:** It's soft and on-palette, but the identical "smile wave" at every boundary is the most conventional divider choice available and slightly undersells the otherwise-distinctive design. Options: vary the curve subtly between seams, switch to a finer hairline + offset-dot motif that echoes the marquee's accent dots, or use an asymmetric/torn edge for a more editorial feel. Lowest priority — only if you want the seams to carry more identity.

**Effort:** M if you design a new divider language.

---

### P2-4 · Pricing presents two full pricing models back-to-back
**Where:** `Pricing.tsx` — the `ComparisonToggle` (agency $3000 vs Dorza $349) sits directly above the 3-card plan grid (Starter/Growth/Pro).

**Thought:** Both are good components, but stacked they're a lot of pricing UI, and the comparison uses the **Growth** numbers ($349/$799) under a generic "With Dorza" label — a visitor may not realise that maps to the middle card below. Consider: (a) label the comparison's Dorza figure as "from $199" (Starter, your entry price) to set the floor, or explicitly "(Growth plan)" so it ties to a card; and (b) add a touch more vertical separation / a mini eyebrow so the two pricing moments read as "here's the value story" → "here's what to pick."

**Effort:** S.

---

### P2-5 · Minor token / micro-detail notes
- **`max-w-prose` on FAQ answers** (`FAQ.tsx:72`) is fine, but FAQ questions at 16–17px sit a little quiet next to the 60px serif H2; consider 18px for the questions to strengthen the in-section hierarchy. (XS)
- **Hero secondary button** "See how it works" → `#how-it-works` is good; ensure the smooth-scroll lands with the fixed nav offset accounted for (the nav is `fixed h-16` — anchored targets can hide under it). Add `scroll-mt-20` (or similar) to the section `id` targets (`#services`, `#how-it-works`, `#pricing`, `#waitlist`). **This is a real bug-class issue worth promoting to P1 if anchor jumps currently tuck content under the nav.** (S)
- **Pricing card CTA copy** is "Get started" on all three; consider differentiating the highlighted card ("Get started" → "Start with Growth") for a small clarity lift. (XS)

---

## Decisions only you can make

> These change the plan meaningfully depending on your answer. Captured here rather than guessed.

**D1 — Hero headline.** Keep the current descriptive 11-word line (good for SEO keyword density: "Western Sydney web design digital marketing agency"), or tighten to a short benefit line and push specifics to the sub-headline (stronger as pure landing-page craft)? *Trade-off: SEO literalness vs. punch.* (See P2-1.)

**D2 — Testimonials.** Are the three quotes real, illustrative, or placeholder? This determines whether P1-5 is a copy reframe (honest "our promise" framing pre-launch) or a future swap-in of real names + logos decoupled from the mockup brands.

**D3 — Where sage lives.** Which single section should sage own to balance the palette (P1-2)? Candidates: HowItWorks GrowthVisual (success/up-and-to-the-right), SocialProof, or the Thesis stats. CTAs stay terracotta regardless.

**D4 — Desktop navigation.** *(The biggest structural call.)* The nav is currently **hamburger-only at every breakpoint** — on desktop there are no visible links; everything (Services, Areas, Industries, Company) lives behind a full-screen overlay. That's a clean, minimal, fashion-forward choice, **but** it hides the very pages that matter most for local SEO and for a small-business visitor orienting themselves, and it's unconventional enough on desktop that some users won't realise the burger holds a full sitemap. Options:
- **Keep burger-only** (commit to the minimal aesthetic; ensure the burger is obviously interactive and the overlay is fast — it already is).
- **Add a slim desktop inline nav** (e.g. Services / Areas / Pricing + CTA) and keep the burger for the full menu on mobile. *Recommended if discoverability or SEO link-equity to the inner pages matters.*
- **Hybrid:** show 2–3 primary links on desktop only (`hidden md:flex`), burger everywhere else.

---

## Suggested implementation order

Independent items can be done in any order; this sequence front-loads value and risk-reduces:

1. **Pass 1 — P0 quick wins (≈1–2h):** P0-1 contrast tokens, P0-2 hero clamp, P0-4 right-align fix, P0-5 background seam, P2-5 `scroll-mt` anchors. All low-risk, high-felt.
2. **Pass 2 — copy & consistency (≈1–2h):** P1-1 de-duplicate "no lock-in", P1-3 eyebrow grammar, P1-4 serif rule, P1-6 footer logo, P1-7 grain verification.
3. **Pass 3 — testimonial section (≈half day):** P0-3 + P1-5 together — slow/stop rotation and reframe/redesign the proof (depends on D2).
4. **Pass 4 — palette & decisions (scoped by your answers):** P1-2 sage home (D3), P2-1 headline (D1), D4 nav.
5. **Pass 5 — optional taste (P2-2, P2-3, P2-4):** only if you want the extra refinement.

After each pass: `pnpm build` (static export must stay clean) and eyeball at 375px / 768px / 1280px. No tests are configured, so visual QA is the gate.

---

## What's working — keep it (don't "fix" these)

- Terracotta + sage editorial palette and the Instrument Serif / Plus Jakarta pairing — distinctive and coherent.
- Motion discipline: `useReducedMotion()` honoured everywhere, global `prefers-reduced-motion` reset in `globals.css`, sensible `ease-dorza` easing.
- The rotating browser-mockup hero with typing URL — memorable and exactly on-message.
- Per-step pipeline fill in HowItWorks — genuinely nice scroll choreography.
- Focus-visible rings on all interactive elements; semantic landmarks; JSON-LD (ProfessionalService + FAQ + WebSite) in `layout.tsx`.
- Pricing comparison toggle with the agency→Dorza auto-reveal — a strong, persuasive moment (just tie its number to a card, P2-4).
```
