---
name: Dorza
description: Tightened sage. An editorial green world on warm paper for a small-business tech partner.
colors:
  forest: "#1E3328"
  pine: "#3F6B47"
  moss: "#5C8264"
  sage: "#8FA890"
  haze: "#D0DCCF"
  paper: "#FBFAF5"
  chalk: "#F3F0E8"
  stone: "#E5E0D2"
  linen: "#CFC8B6"
  claret: "#7C2E3B"
  ochre: "#C9A24A"
  ink: "#1B1A14"
  ink-soft: "#43403A"
  ink-mute: "#807A6D"
  rule: "#BFB7A4"
  rule-soft: "#DCD5C2"
typography:
  display:
    fontFamily: "Newsreader, Times New Roman, serif"
    fontSize: "clamp(44px, 6.5vw, 92px)"
    fontWeight: 500
    lineHeight: 0.96
    letterSpacing: "-0.022em"
    fontVariation: "\"opsz\" 72"
  display-md:
    fontFamily: "Newsreader, Times New Roman, serif"
    fontSize: "clamp(34px, 4.5vw, 60px)"
    fontWeight: 500
    lineHeight: 0.96
    letterSpacing: "-0.022em"
    fontVariation: "\"opsz\" 72"
  display-italic:
    fontFamily: "Newsreader, Times New Roman, serif"
    fontWeight: 400
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "Newsreader, Times New Roman, serif"
    fontSize: "clamp(28px, 3.2vw, 42px)"
    fontWeight: 500
    lineHeight: 1.06
    letterSpacing: "-0.014em"
    fontVariation: "\"opsz\" 36"
  lede:
    fontFamily: "Geist, system-ui, -apple-system, Helvetica Neue, sans-serif"
    fontSize: "clamp(17px, 1.4vw, 22px)"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "-0.005em"
  body:
    fontFamily: "Geist, system-ui, -apple-system, Helvetica Neue, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
  mono:
    fontFamily: "Geist Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "13px"
    fontWeight: 400
  label:
    fontFamily: "Geist Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "11px"
    fontWeight: 500
    letterSpacing: "0.18em"
rounded:
  card: "2px"
  chip: "3px"
  pill: "999px"
spacing:
  section-tight: "56px"
  section: "96px"
  section-large: "128px"
  layout-max: "1200px"
  text-max: "640px"
components:
  button-primary:
    backgroundColor: "{colors.pine}"
    textColor: "{colors.chalk}"
    rounded: "{rounded.pill}"
    height: "48px"
    padding: "0 24px"
  button-primary-hover:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.chalk}"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "48px"
    padding: "0 24px"
  button-secondary-hover:
    backgroundColor: "{colors.stone}"
  button-ghost:
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "48px"
    padding: "0 24px"
  button-ghost-hover:
    backgroundColor: "{colors.stone}"
  button-inverse:
    backgroundColor: "{colors.chalk}"
    textColor: "{colors.forest}"
    rounded: "{rounded.pill}"
    height: "48px"
    padding: "0 24px"
  button-inverse-hover:
    backgroundColor: "{colors.haze}"
  button-size-sm:
    height: "36px"
    padding: "0 16px"
  button-size-lg:
    height: "56px"
    padding: "0 32px"
  status-tag-live:
    backgroundColor: "{colors.haze}"
    textColor: "{colors.forest}"
    typography: "{typography.label}"
    rounded: "{rounded.chip}"
    height: "22px"
    padding: "0 8px"
  status-tag-ask:
    textColor: "{colors.ink-soft}"
    typography: "{typography.label}"
    rounded: "{rounded.chip}"
    height: "22px"
    padding: "0 8px"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    height: "48px"
    padding: "0 16px"
  chip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.chip}"
    height: "44px"
    padding: "0 16px"
  chip-selected:
    backgroundColor: "{colors.pine}"
    textColor: "{colors.chalk}"
  card-frame:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.card}"
---

# Design System: Dorza

Scope: the brand layer (home, Start, Grow, Support, Work, About, Privacy, and the local and service pages under them). `/onboard`, `/admin`, `/upload` and `/demo/*` are internal tools that pick up the palette through legacy Tailwind aliases. They are not specimens of this system.

## Overview

**Creative North Star: "Tightened Sage"**

Paper being set down on a desk. Forest, pine and moss greens on warm chalk and paper grounds, with hairline rules doing the work that boxes and shadows do elsewhere. The type is editorial. A Newsreader display at weight 500 carries every headline, Geist sets the reading text, and Geist Mono marks things: timeline stages, status, prices, navigation, small print. The page reads like a well-made printed brief, not a product dashboard.

Density is low and vertical. Sections are long, single-column or split 3:9 on a 12-column grid, and separated by changes of ground (chalk, haze, forest) rather than by borders or cards. Color is almost entirely green and neutral. Each screen gets one accent beat: claret on light grounds, ochre on forest. Depth is nearly flat: real screenshots sit in a 2px frame with a hairline and a soft shadow, and nothing else floats.

Motion is quiet and one-directional. Things rise a few pixels into place once and stay put. The homepage's signature is the "I need…" picker: choose a need and its answer sets down like the headline did, while a pine run and tick mark the chosen line on its hairline.

**Key Characteristics:**
- Warm off-white grounds only (chalk page, paper cards). Never pure white.
- Green carries headings, buttons, links and rules. One accent beat per screen.
- Newsreader 500 display with at most one italic word per composition.
- Geist Mono for markers, status, prices and nav. Lists use a mono plus sign.
- 2px corners, 3px chips, pills only on buttons. Hairline rules over boxes.
- No gradients, no glows. Shadows at 12% opacity or less.
- Every service carries a "Live" or "Ask us" tag, nothing else.

## Colors

A tight green family on warm neutrals, with two accents that never share a frame.

### Primary
- **Forest** (forest): the deepest green. Inverse grounds (PageCTA, the quote section, footer), the hover state of primary buttons, links on the haze band, the wordmark.
- **Pine** (pine): the working green. Headings (`--text-heading`), primary buttons, links (`--text-link`), the picker's pine run and tick, PlusList plus signs, selected chips, input focus border.
- **Moss** (moss) and **Sage** (sage): supporting greens in the tonal family. Rarely used directly on the brand layer; keep them for illustration-scale fills and secondary marks, never for text on chalk.
- **Haze** (haze): the pale green ground. The pricing band, the "Live" status tag fill, text selection on light grounds, inverse-button hover.

### Secondary
- **Claret** (claret): the accent on light grounds. The italic word in a display headline, link hover (`--text-link-hover`), the focus ring (`--focus-ring`), the open state of the FAQ plus, error copy in the light enquiry modal.

### Tertiary
- **Ochre** (ochre): the accent on forest grounds. Replaces claret inside `.on-inverse`: italic display word, link hover, focus ring, selected chips in the dark form, the footer wordmark's "o", error copy on forest.

### Neutral
- **Paper** (paper): card and field surface (`--surface-card`), image frames, the enquiry modal, secondary buttons.
- **Chalk** (chalk): the page ground (`--surface-page`), the sticky nav (at 94% over an 8px blur), text and button fill on forest.
- **Stone** (stone): sunken surface (`--surface-sunken`) and the hover fill of secondary, ghost and chip controls.
- **Linen** (linen): the warm hairline tone named in the world; the stronger rule family (rule, rule-soft) is what ships on most edges.
- **Ink** (ink): body text color (`--text-body`), service names, field text.
- **Ink Soft** (ink-soft): secondary text (`--text-secondary`) and muted text (`--text-muted`). Ledes, body copy, mono labels, nav links, the "Ask us" tag.
- **Ink Mute** (ink-mute): icons and decorative marks only (the modal close icon, select chevrons). It is 3.7:1 on chalk, too faint for text.
- **Rule** (rule): strong borders (`--border-strong`), link underlines, the "Ask us" tag outline, field hover border.
- **Rule Soft** (rule-soft): default hairlines (`--border-default`). Nav bottom edge, list rules, card frames, FAQ dividers, the picker's hairline.

### Semantic aliases
Components reference the aliases, not the raw names, so a section re-themes by class. `--text-muted` deliberately points at ink-soft, not ink-mute. Dropping `.on-inverse` on a forest section re-points every alias: page ground to forest, headings to chalk, body to chalk at 72%, muted text to chalk at 64%, links to haze, accent and focus to ochre, borders to chalk at 18% and 30%. `.bg-haze` re-points links to forest because pine on haze is only 4.35:1.

### Named Rules
**The One Beat Rule.** Each screen gets a single accent beat: claret on light grounds, ochre on forest. If claret already appears in the frame (the hero's italic "mind"), nothing else on that screen is claret at rest. Hover, focus and error states are the only exceptions.

**The Never White Rule.** Grounds are chalk, paper, stone, haze or forest. Pure #FFFFFF never ships on the brand layer.

**The Ink Mute Rule.** Ink mute is for icons and rules. Any text that needs to be read uses ink-soft or darker.

## Typography

**Display Font:** Newsreader (with Times New Roman, serif), loaded through next/font with the optical-size axis and italics.
**Body Font:** Geist (with system-ui, -apple-system, Helvetica Neue, sans-serif), from the geist package.
**Label/Mono Font:** Geist Mono (with ui-monospace, SF Mono, Menlo, monospace), from the geist package.

**Character:** A literary serif set at a firm 500 weight and tight tracking against a neutral, slightly technical grotesk. The mono is the voice of the system itself: markers, status and fine print, never prose.

### Hierarchy
- **Display** (500, clamp(44px, 6.5vw, 92px), 0.96, opsz 72): the page h1 only. Pine, balanced wrap.
- **Display MD** (500, clamp(34px, 4.5vw, 60px), 0.96): section h2s and inner-page h1s. Same face and tracking as Display, one step down.
- **Display Italic** (400 italic, -0.015em): one word per composition, colored with the ground's accent (claret on light, ochre on forest).
- **Headline** (500, clamp(28px, 3.2vw, 42px), 1.06, opsz 36): card and sub-section titles, such as case-study teasers.
- **Lede** (400, clamp(17px, 1.4vw, 22px), 1.45): the one paragraph under a headline. Ink-soft, max 640px.
- **Body** (400, 15px, 1.6): running copy and list items. Ink-soft, max 640px, pretty wrap.
- **Mono** (400, 13px): phone numbers, inline technical values.
- **Label** (500, 11px, 0.18em, uppercase): timeline markers ("DAY ONE"), meta lines under CTAs ("Quote within 72 hours · No lock-in"), captions, breadcrumbs, footer group titles, the copyright line. Nav links, field labels and status tags use the same mono uppercase at 0.14em tracking.

### Named Rules
**The One Italic Rule.** At most one italic word per composition, and it carries the accent. Italics are never used for emphasis in body copy.

**The Mono Marks Rule.** Mono text marks a thing (a stage, a status, a price, a link destination). It never introduces a heading from above. A small uppercase label sitting directly over an h1 or h2 is an eyebrow, and eyebrows are banned. Status tags, meta lines after content, captions and footer group titles are the mono's native uses and stay.

**The Full Stop Rule.** Headlines are short declaratives that end in a full stop, set with balanced wrapping.

## Layout

A 1200px container with 24px gutters (32px from 1024px). Reading measures cap at 640px for ledes and body. Sections stack vertically and are separated by a change of ground, not a border. Vertical rhythm comes from three section sizes: tight (56px), default (96px) and large (128px), typically tight on phones and one step up from 768px. The sticky nav is 68px tall; anchors and focus scroll with 84px of top padding so they clear it.

The homepage picker sits on a 12-column grid: the "I need…" list takes 5 columns and the answer panel 7, from 768px. On phones the needs become one row of 44px chips that scrolls sideways, with the answer directly under it.

The nav collapses to a full-height chalk sheet below 860px. Inverse CTA sections center their content in a narrow column (max 576px to 672px).

### Named Rules
**The Ground Change Rule.** Sections are divided by switching ground (chalk to haze to forest), not by boxing content in cards. A forest section directly above the forest footer gets a hairline (chalk at 10%) between them.

## Elevation & Depth

Nearly flat, with tonal layering doing most of the work. Hairline rules and ground changes separate content. Shadows exist only on real objects that sit on the page: framed screenshots, the enquiry modal and the nav's 1px edge. Every shadow is warm ink (#1B1A14) at 12% opacity or less.

### Shadow Vocabulary
- **Hair** (`0 1px 0 rgba(27, 26, 20, 0.04)`): a single hairline lift.
- **Card** (`0 1px 0 rgba(27, 26, 20, 0.03), 0 8px 24px rgba(27, 26, 20, 0.06)`): image frames for real screenshots.
- **Modal** (`0 32px 80px rgba(27, 26, 20, 0.12)`): the enquiry dialog.

### Named Rules
**The Twelve Percent Rule.** No shadow exceeds 12% opacity, and none is colored. No gradients, no glows, no hard offset shadows.

## Shapes

Square-shouldered. Cards, image frames, fields, the modal and the skip link use a 2px corner. Chips and status tags use 3px. The pill (999px) belongs to buttons and nothing else. Edges are 1px hairlines in rule-soft, rule on hover or for emphasis. The FAQ toggle is a drawn plus built from two 1px strokes that rotates 45 degrees to close.

### Named Rules
**The Pill Is A Button Rule.** If it is pill-shaped, it is pressable and it is a button. Tags, chips, cards and images never round past 3px.

## Components

### Buttons
Calm and solid, with a one-pixel lift.
- **Shape:** full pill (999px), Geist semibold.
- **Sizes:** sm 36px tall, 16px sides, 13px text (nav only, padded to a 44px hit area); default 48px, 24px sides, 14px; lg 56px, 32px sides, 15px (hero, inverse CTAs, mobile menu).
- **Primary:** pine fill, chalk text; hovers to forest. The one "Get a quote" action on light grounds.
- **Secondary:** paper fill, rule-soft hairline, ink text; hovers to stone.
- **Ghost:** transparent, ink text; hovers to stone.
- **Inverse:** chalk fill, forest text; hovers to haze. The primary action on forest grounds.
- **Hover / Focus:** lifts 1px, presses to 98% scale, transitions at 160ms on the house ease. Focus is a 2px outline at 2px offset in the ground's focus color (claret on light, ochre on inverse). Disabled drops to 50% opacity.
- **Pairing:** a primary button is accompanied by a quiet text link ("See the work", "See pricing"), never a second filled button.

### Text links
Pine with a rule-colored underline at 3px offset; hover turns the text to the ground's accent. A link on its own line takes `inline-block` and gains an invisible 44px hit area (11px above and below via a pseudo-element) without moving the layout. Links inside running text do not, since the area would overlap the line above.

### Status tags
Only two states exist. **Live:** haze fill, forest text. **Ask us:** transparent with a rule outline, ink-soft text. Both are 22px tall, 3px corners, mono 11px uppercase at 0.14em. A service with any other status is not shown.

### PlusList
The house list. Each item has a pine mono "+" and body text, separated by rule-soft hairlines top and bottom. Service lists on the timeline use the same hairline rows with a status tag on the right.

### Cards / Containers
- **Corner Style:** 2px.
- **Background:** paper on chalk.
- **Shadow Strategy:** Card shadow, only around real screenshots (see Elevation & Depth).
- **Border:** 1px rule-soft.
- **Work card:** the whole teaser is one link. A framed screenshot, a Headline-size title, a body teaser, a mono client and industry line, then "Read the case study". The card lifts 1px on hover.

### Inputs / Fields
- **Style:** 48px tall, 2px corners, 16px sides, 16px text. Light: paper fill, rule-soft border, ink text, ink-soft placeholder at 75%. Dark: chalk at 6% fill, chalk at 15% border, chalk text.
- **Labels:** mono 11px uppercase at 0.14em, above the field.
- **Hover / Focus:** border to rule on hover. Focus sets the border to pine with a 2px claret ring at 25% (light), or ochre border and ochre ring at 40% (dark).
- **Chips (service multi-select):** 44px tall, 3px corners, 13px medium text. Idle: paper, rule-soft border, ink-soft text, stone on hover. Selected: pine fill with chalk text (light), ochre fill with forest text (dark).
- **Error:** a short line of 13px body text in the ground's accent color.

### Navigation
A 68px sticky bar on chalk at 94% opacity over an 8px blur, with a rule-soft bottom hairline. The wordmark is Newsreader "dorza" with a pine "o" (ochre in the footer). Links are mono 11px uppercase at 0.14em in ink-soft, each with a 44px minimum height; the current page is forest with a 1.5px pine underline at 6px offset. A small primary "Get a quote" button opens the enquiry modal. Below 860px a 44px menu button opens a full-height chalk sheet with Newsreader 32px links on hairline rows and a full-width large primary button.

### Footer
Forest ground via `.on-inverse`. Link rows have a 44px minimum height, chalk at 80%, hovering to ochre. Phone and email are mono links with 44px rows.

### Need picker (signature)
`components/sections/home/NeedPicker.tsx`, fed by `lib/data/needs.ts`. Real radio buttons switched by CSS `:has()`, so it works on first paint and with JavaScript off; every answer is in the HTML. From 768px the needs are Newsreader lines hung off a 1px rule-soft hairline, and the chosen line turns pine with a pine run over the hairline and a 9px tick across it. On phones they are 44px chips (paper, rule-soft; chosen is pine with chalk text) in one sideways-scrolling row. The answer is a paper panel with a 2px corner and hairline, no shadow: a Headline-size title that rises out of its mask, a status tag, body, PlusList, a primary button and a text link, then a mono meta line. Status comes from the pillar data, never from the picker. With reduced motion nothing moves.

### Motion
Two primitives, all on the house ease `cubic-bezier(0.23, 1, 0.32, 1)` (exported as `DORZA_EASE`):
- **Reveal** for scroll-in content: rises 20px and fades in over 480ms, once, when 100px inside the viewport. Its stagger mode spaces children 45ms apart.
- **LineReveal** for the h1 set-down only: each line rises from 105% behind a mask over 600ms, starting at 100ms with 90ms between lines.

Durations: fast 160ms (hover, color), base 280ms (menus, accordions, form swaps), slow 480ms (Reveal), reveal 600ms (LineReveal). Every primitive checks reduced motion: Reveal, LineReveal and the picker's set-down render in place, the FAQ accordion fades without height animation, and the global reduced-motion rule cuts CSS transitions to near zero. Every animated element carries `data-reveal`, and a `<noscript>` rule forces `[data-reveal]` to full opacity with no transform so nothing stays hidden without JavaScript.

## Do's and Don'ts

### Do:
- **Do** use the v7 color names (forest, pine, chalk, ink-soft and the rest) or the semantic CSS aliases in all new brand-layer code.
- **Do** keep one accent beat per screen: claret on light grounds, ochre on forest.
- **Do** put forest sections in `.on-inverse` so headings, links, focus and accent re-point together.
- **Do** keep a 44px minimum touch target on every link and control. Links on their own line use `.d-link` with `inline-block`; nav, footer and breadcrumb links use a 44px minimum height or negative-margin padding.
- **Do** use PlusList (mono "+", hairline rows) for every list of points.
- **Do** tag every service "Live" or "Ask us" with StatusTag, and leave out anything that is neither.
- **Do** wrap scroll-in content in Reveal, h1 lines in LineReveal, and add `data-reveal` to any new animated element so the no-JS rule covers it.
- **Do** frame real screenshots in ImageFrame: 2px corner, rule-soft hairline, Card shadow.

### Don't:
- **Don't** use the legacy Tailwind aliases (primary, accent, dark, surface, warm, border, border-strong, text-primary, text-secondary, text-muted, status, shadow-soft, shadow-medium) in new code. They exist only so /onboard, /admin, /upload and /demo stay on-palette untouched.
- **Don't** use ink-mute for text.
- **Don't** put a mono eyebrow label above a heading. InnerHero's `eyebrow` prop is accepted and never rendered.
- **Don't** use gradients, glows, colored shadows, or any shadow above 12% opacity.
- **Don't** round anything except buttons past 3px.
- **Don't** use tick or check icons in lists; use the mono plus sign.
- **Don't** set more than one italic word in a composition, or use claret and ochre on the same screen.
- **Don't** use pure white grounds.
- **Don't** add CSS keyframe animation to elements already driven by framer-motion.
