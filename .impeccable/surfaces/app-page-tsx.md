---
version: 1
slug: "app-page-tsx"
primary_target: "app/page.tsx"
related_targets: ["app/start/page.tsx","app/grow/page.tsx","app/support/page.tsx","app/work/page.tsx"]
---

## Direction contract

Revised 2026-11-14: the case-study timeline is replaced by a need picker. Case studies now live in /work, with one proof line on the homepage. This supersedes spec §6 and the homepage half of §7.

THESIS: An owner arrives with one problem, not a category. The homepage asks what they need in their own words and answers it on the spot: what we'd set up, whether it's live or "ask us", and a quote that already knows the question. It refuses the agency default of a hero mock-up, a feature grid, a logo strip, testimonials and a pricing table, and it refuses a scroll of case studies.

OWN-WORLD: "Tightened sage" (v7). Forest, pine and moss greens on chalk and paper grounds, with hairline rules. One accent beat per screen: claret on light grounds, ochre on forest. Newsreader display at weight 500 (one italic word per composition), Geist body, Geist Mono for status, prices and nav. 2px corners, pills only on buttons, no gradients or glows, shadows at 12% or less. Lists use a mono plus sign. Services carry a "Live" or "Ask us" tag.

STORY: The visitor reads "Whatever the tech, we'll sort it.", picks the sentence that matches their problem ("I need to sell online"), and sees a plain answer with an honest status. They believe it because nothing not yet live is dressed up as live, and the proof line names businesses Dorza still looks after. They act with the answer's own button, which carries their choice into the quote form.

FIRST VIEWPORT: On chalk, the two-line Newsreader headline sets down line by line: "Whatever the tech, / we'll sort it.", with "sort" in claret italic, the only claret on screen. One lede. Then, at 1280 by 800, "I need…" with the first needs on its hairline and the top of the answer panel, both above the fold. On a phone, the chip row and the answer panel's title are above the fold.

FORM: Need picker. Real radios plus CSS :has(), so it works on first paint and without JavaScript. Data in lib/data/needs.ts; status read from lib/data/pillars.ts. seed: none (pinned)

Signature interaction: choosing a need sets its answer down the way the headline arrived (the title rises out of a mask, the rest follows a beat later), and a pine run and tick mark the chosen line on the hairline. With reduced motion nothing moves.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
