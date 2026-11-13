# Image provenance

| File | What it shows | Source | Made with | Date |
|---|---|---|---|---|
| work/drivable/desktop.jpg, mobile.jpg | drivablehire.com.au homepage | Live site, built by Dorza | scripts/capture-work.mjs | 2026-11-13 |
| work/active-rise-health/desktop.jpg, mobile.jpg | activerisehealth.com.au homepage | Live site, built by Dorza | scripts/capture-work.mjs | 2026-11-13 |
| work/*/desktop-{640,1080,1440}.{jpg,webp}, desktop.webp, mobile-640.{jpg,webp}, mobile.webp | Smaller copies of the screenshots above | The screenshots above | scripts/resize-work.mjs | 2026-11-13 |
| logo.png, ../../app/favicon.ico, ../../app/apple-icon.png | The Dorza mark, square | app/icon.svg | scripts/make-icons.mjs | 2026-11-13 |
| og/default.png, og/drivable.png, og/active-rise-health.png | Share cards | Authored in v7 | scripts/og-images.mjs | 2026-11-13 |
| mockups/*.jpg | Stock cafe, salon and tradie photos | Stock, pre-v7 | n/a | Retained for industry pages only |

Recapture the client screenshots after the loose ends in spec §12 are fixed on each live site, and before a case study is set to `published: true`. Run `node scripts/resize-work.mjs` after every capture so the smaller copies match.
