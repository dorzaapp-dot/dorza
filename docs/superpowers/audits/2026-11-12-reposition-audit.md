# Reposition audit, 12 November 2026

Read of `master` at `617598b`, branch `feat/reposition-v7`. The plan describes three audit passes (A: marketing surface, B: tokens and motion, C: SEO and enquiry plumbing). They were run inline with grep and scripts rather than as separate agents, and the tables below are their output.

The spec the plan cites (`docs/superpowers/specs/2026-11-12-dorza-reposition-design.md`) is **not in the repo or its git history**. The claims-register calls below follow the plan's Global Constraints (voice, honesty, no suburb names on brand pages), which restate spec §4, §10 and D6.

## Baseline

- `npx tsc --noEmit`: clean.
- `pnpm lint`: 0 errors, 7 warnings, all pre-existing:
  - `app/admin/page.tsx` 388, 400: `no-img-element`
  - `app/upload/page.tsx` 239, 269: `no-img-element`
  - `components/forms/BookingForm.tsx` 71: `react-hooks/exhaustive-deps` (`authHeader`)
  - `components/sections/HowItWorks.tsx` 373, 441: `no-img-element` (the file is deleted in Task 10)
- `pnpm build`: succeeds and writes `out/`. One non-fatal notice: "Failed to patch lockfile" from Next's lockfile patcher. It's a pnpm and Next 14 quirk, not a build failure.
- `grep -c "<loc>" public/sitemap.xml`: **17**.

## Marketing surface inventory

| Path | Lines | Imported by | Hard-coded colours/gradients |
|---|---|---|---|
| `app/page.tsx` | 42 | (route) | yes: L24,26,29,31,34,36 |
| `app/layout.tsx` | 204 | (route) | no |
| `app/not-found.tsx` | 30 | (route) | no |
| `app/about/page.tsx` | 209 | (route) | no |
| `app/areas/[slug]/page.tsx` | 317 | (route) | no |
| `app/contact/layout.tsx` | 29 | (route) | no |
| `app/contact/page.tsx` | 206 | (route) | no |
| `app/industries/[slug]/page.tsx` | 272 | (route) | no |
| `app/services/[slug]/page.tsx` | 302 | (route) | no |
| `app/website-cost/page.tsx` | 319 | (route) | no |
| `components/motion/Reveal.tsx` | 89 | app/about/page.tsx app/areas/[slug]/page.tsx app/contact/page.tsx app/industries/[slug]/page.tsx app/services/[slug]/page.tsx app/website-cost/page.tsx components/sections/FAQ.tsx components/sections/FreeAudit.tsx components/sections/Hero.tsx components/sections/HeroBrowserMockup.tsx components/sections/HowItWorks.tsx components/sections/InnerHero.tsx components/sections/Nav.tsx components/sections/PageCTA.tsx components/sections/Pricing.tsx components/sections/Services.tsx components/sections/SocialProof.tsx components/sections/Thesis.tsx components/sections/TooGoodToBeTrue.tsx components/sections/WaitlistCTA.tsx components/ui/EnquiryModal.tsx  | no |
| `components/motion/SlideReveal.tsx` | 41 | components/sections/HowItWorks.tsx components/sections/Services.tsx  | no |
| `components/motion/Stagger.tsx` | 65 | **none** | no |
| `components/motion/useCountUp.ts` | 53 | components/sections/Thesis.tsx  | no |
| `components/sections/FAQ.tsx` | 104 | app/page.tsx  | yes: L93 |
| `components/sections/Footer.tsx` | 191 | app/about/page.tsx app/areas/[slug]/page.tsx app/contact/page.tsx app/industries/[slug]/page.tsx app/page.tsx app/services/[slug]/page.tsx app/website-cost/page.tsx  | no |
| `components/sections/FreeAudit.tsx` | 98 | app/page.tsx  | no |
| `components/sections/Hero.tsx` | 113 | app/page.tsx  | yes: L44,93 |
| `components/sections/HeroBrowserMockup.tsx` | 275 | components/sections/Hero.tsx (relative) | yes: L32,34,41,42,43,51,53,60 |
| `components/sections/HowItWorks.tsx` | 564 | app/page.tsx  | yes: L105,132,142,155,160,282,307,385 |
| `components/sections/InnerHero.tsx` | 70 | app/about/page.tsx app/areas/[slug]/page.tsx app/contact/page.tsx app/industries/[slug]/page.tsx app/services/[slug]/page.tsx app/website-cost/page.tsx  | yes: L26 |
| `components/sections/Nav.tsx` | 236 | app/about/page.tsx app/areas/[slug]/page.tsx app/contact/page.tsx app/industries/[slug]/page.tsx app/page.tsx app/services/[slug]/page.tsx app/website-cost/page.tsx  | no |
| `components/sections/PageCTA.tsx` | 83 | app/about/page.tsx app/areas/[slug]/page.tsx app/industries/[slug]/page.tsx app/services/[slug]/page.tsx app/website-cost/page.tsx  | yes: L28 |
| `components/sections/Pricing.tsx` | 174 | app/page.tsx  | yes: L53 |
| `components/sections/SegmentMarquee.tsx` | 71 | app/page.tsx  | yes: L67,68 |
| `components/sections/Services.tsx` | 357 | app/page.tsx  | yes: L27,28,29,293,295,297,298 |
| `components/sections/SocialProof.tsx` | 152 | app/page.tsx  | no |
| `components/sections/Thesis.tsx` | 80 | app/page.tsx  | no |
| `components/sections/TooGoodToBeTrue.tsx` | 72 | app/page.tsx  | no |
| `components/sections/WaitlistCTA.tsx` | 124 | app/page.tsx  | yes: L41 |
| `components/ui/Badge.tsx` | 20 | **none** | no |
| `components/ui/Button.tsx` | 34 | components/forms/ContactForm.tsx  | yes: L23 |
| `components/ui/Card.tsx` | 22 | **none** | yes: L14 |
| `components/ui/Container.tsx` | 13 | app/about/page.tsx app/areas/[slug]/page.tsx app/contact/page.tsx app/demo/booking/page.tsx app/demo/chatbot/page.tsx app/demo/contactus/page.tsx app/industries/[slug]/page.tsx app/services/[slug]/page.tsx app/website-cost/page.tsx components/sections/FAQ.tsx components/sections/Footer.tsx components/sections/FreeAudit.tsx components/sections/Hero.tsx components/sections/HowItWorks.tsx components/sections/InnerHero.tsx components/sections/PageCTA.tsx components/sections/Pricing.tsx components/sections/Services.tsx components/sections/SocialProof.tsx components/sections/Thesis.tsx components/sections/TooGoodToBeTrue.tsx components/sections/WaitlistCTA.tsx  | no |
| `components/ui/EnquiryModal.tsx` | 223 | app/contact/page.tsx components/sections/FAQ.tsx components/sections/Nav.tsx components/sections/PageCTA.tsx  | yes: L179 |
| `components/ui/Eyebrow.tsx` | 21 | components/ui/SectionHeader.tsx (relative; itself unimported) | no |
| `components/ui/GrainOverlay.tsx` | 15 | app/layout.tsx  | no |
| `components/ui/ScrollProgress.tsx` | 17 | components/sections/Nav.tsx  | no |
| `components/ui/SectionDivider.tsx` | 27 | app/page.tsx  | no |
| `components/ui/SectionHeader.tsx` | 56 | **none** | no |
| `lib/data/areas.ts` | 210 | app/areas/[slug]/page.tsx  | no |
| `lib/data/faq.ts` | 24 | app/layout.tsx components/sections/FAQ.tsx  | no |
| `lib/data/industries.ts` | 280 | app/industries/[slug]/page.tsx  | no |
| `lib/data/services.ts` | 405 | app/industries/[slug]/page.tsx app/services/[slug]/page.tsx  | no |
| `lib/seo.ts` | 34 | app/about/page.tsx app/areas/[slug]/page.tsx app/contact/layout.tsx app/contact/page.tsx app/industries/[slug]/page.tsx app/services/[slug]/page.tsx app/website-cost/page.tsx components/sections/Footer.tsx components/sections/Nav.tsx components/sections/PageCTA.tsx  | no |
| `lib/constants.ts` | 22 | components/forms/EnquiryFormFields.tsx  | no |

## Unimported files

- `components/motion/Stagger.tsx`
- `components/ui/Badge.tsx`
- `components/ui/Card.tsx`
- `components/ui/SectionHeader.tsx`
- `components/ui/Eyebrow.tsx`: imported only by `SectionHeader.tsx`, which nothing imports, so it is effectively dead too.
- `components/Nav.tsx`, `components/Footer.tsx` (outside the scope above; confirmed unimported for A2).

## Token and motion usage

### Legacy token fragments per file

| Path | Fragment | Count |
|---|---|---|
| `app/about/page.tsx` | accent | 5 |
| `app/about/page.tsx` | text-dark | 4 |
| `app/about/page.tsx` | bg-white | 2 |
| `app/about/page.tsx` | bg-warm | 2 |
| `app/about/page.tsx` | border-border | 1 |
| `app/about/page.tsx` | rounded-card | 1 |
| `app/about/page.tsx` | rounded-full | 1 |
| `app/admin/page.tsx` | primary | 18 |
| `app/admin/page.tsx` | accent | 6 |
| `app/admin/page.tsx` | text-dark | 9 |
| `app/admin/page.tsx` | bg-dark | 3 |
| `app/admin/page.tsx` | bg-white | 12 |
| `app/admin/page.tsx` | bg-surface | 13 |
| `app/admin/page.tsx` | border-border | 21 |
| `app/admin/page.tsx` | rounded-card | 5 |
| `app/admin/page.tsx` | rounded-full | 10 |
| `app/admin/page.tsx` | shadow-medium | 1 |
| `app/admin/page.tsx` | text-white/ | 2 |
| `app/admin/workspace/page.tsx` | primary | 9 |
| `app/admin/workspace/page.tsx` | accent | 10 |
| `app/admin/workspace/page.tsx` | text-dark | 10 |
| `app/admin/workspace/page.tsx` | bg-dark | 3 |
| `app/admin/workspace/page.tsx` | bg-white | 6 |
| `app/admin/workspace/page.tsx` | bg-surface | 8 |
| `app/admin/workspace/page.tsx` | border-border | 12 |
| `app/admin/workspace/page.tsx` | rounded-card | 5 |
| `app/admin/workspace/page.tsx` | rounded-full | 10 |
| `app/admin/workspace/page.tsx` | shadow-medium | 2 |
| `app/admin/workspace/page.tsx` | text-white/ | 2 |
| `app/areas/[slug]/page.tsx` | primary | 4 |
| `app/areas/[slug]/page.tsx` | accent | 6 |
| `app/areas/[slug]/page.tsx` | text-dark | 7 |
| `app/areas/[slug]/page.tsx` | bg-white | 5 |
| `app/areas/[slug]/page.tsx` | bg-warm | 2 |
| `app/areas/[slug]/page.tsx` | border-border | 3 |
| `app/areas/[slug]/page.tsx` | rounded-card | 2 |
| `app/areas/[slug]/page.tsx` | rounded-full | 1 |
| `app/areas/[slug]/page.tsx` | shadow-medium | 2 |
| `app/contact/page.tsx` | primary | 9 |
| `app/contact/page.tsx` | accent | 7 |
| `app/contact/page.tsx` | text-dark | 6 |
| `app/contact/page.tsx` | bg-white | 2 |
| `app/contact/page.tsx` | bg-warm | 1 |
| `app/contact/page.tsx` | border-border | 2 |
| `app/contact/page.tsx` | rounded-card | 2 |
| `app/contact/page.tsx` | rounded-full | 5 |
| `app/contact/page.tsx` | shadow-medium | 2 |
| `app/demo/booking/page.tsx` | accent | 1 |
| `app/demo/booking/page.tsx` | text-dark | 2 |
| `app/demo/booking/page.tsx` | bg-white | 2 |
| `app/demo/booking/page.tsx` | bg-surface | 2 |
| `app/demo/booking/page.tsx` | border-border | 2 |
| `app/demo/booking/page.tsx` | rounded-card | 1 |
| `app/demo/chatbot/page.tsx` | accent | 16 |
| `app/demo/chatbot/page.tsx` | text-dark | 6 |
| `app/demo/chatbot/page.tsx` | bg-white | 5 |
| `app/demo/chatbot/page.tsx` | bg-surface | 2 |
| `app/demo/chatbot/page.tsx` | border-border | 5 |
| `app/demo/chatbot/page.tsx` | rounded-card | 2 |
| `app/demo/contactus/page.tsx` | text-dark | 1 |
| `app/demo/contactus/page.tsx` | bg-white | 1 |
| `app/demo/contactus/page.tsx` | bg-surface | 2 |
| `app/demo/contactus/page.tsx` | border-border | 1 |
| `app/industries/[slug]/page.tsx` | primary | 2 |
| `app/industries/[slug]/page.tsx` | accent | 10 |
| `app/industries/[slug]/page.tsx` | text-dark | 8 |
| `app/industries/[slug]/page.tsx` | bg-white | 5 |
| `app/industries/[slug]/page.tsx` | bg-warm | 2 |
| `app/industries/[slug]/page.tsx` | border-border | 3 |
| `app/industries/[slug]/page.tsx` | rounded-card | 3 |
| `app/industries/[slug]/page.tsx` | rounded-full | 2 |
| `app/industries/[slug]/page.tsx` | shadow-medium | 3 |
| `app/not-found.tsx` | primary | 2 |
| `app/not-found.tsx` | accent | 1 |
| `app/not-found.tsx` | text-dark | 1 |
| `app/not-found.tsx` | bg-surface | 1 |
| `app/not-found.tsx` | rounded-full | 1 |
| `app/not-found.tsx` | shadow-medium | 1 |
| `app/services/[slug]/page.tsx` | primary | 3 |
| `app/services/[slug]/page.tsx` | accent | 8 |
| `app/services/[slug]/page.tsx` | text-dark | 9 |
| `app/services/[slug]/page.tsx` | bg-white | 4 |
| `app/services/[slug]/page.tsx` | bg-warm | 3 |
| `app/services/[slug]/page.tsx` | border-border | 2 |
| `app/services/[slug]/page.tsx` | rounded-card | 2 |
| `app/services/[slug]/page.tsx` | rounded-full | 2 |
| `app/services/[slug]/page.tsx` | shadow-medium | 2 |
| `app/upload/page.tsx` | primary | 9 |
| `app/upload/page.tsx` | accent | 2 |
| `app/upload/page.tsx` | text-dark | 7 |
| `app/upload/page.tsx` | bg-dark | 4 |
| `app/upload/page.tsx` | bg-white | 5 |
| `app/upload/page.tsx` | bg-surface | 6 |
| `app/upload/page.tsx` | border-border | 9 |
| `app/upload/page.tsx` | rounded-card | 4 |
| `app/upload/page.tsx` | rounded-full | 2 |
| `app/upload/page.tsx` | shadow-medium | 1 |
| `app/upload/page.tsx` | text-white/ | 1 |
| `app/website-cost/page.tsx` | primary | 9 |
| `app/website-cost/page.tsx` | accent | 8 |
| `app/website-cost/page.tsx` | text-dark | 6 |
| `app/website-cost/page.tsx` | bg-white | 3 |
| `app/website-cost/page.tsx` | bg-warm | 2 |
| `app/website-cost/page.tsx` | border-border | 1 |
| `app/website-cost/page.tsx` | rounded-card | 1 |
| `app/website-cost/page.tsx` | rounded-full | 2 |
| `app/website-cost/page.tsx` | shadow-medium | 1 |
| `components/ChatWidget.tsx` | accent | 6 |
| `components/ChatWidget.tsx` | bg-white | 1 |
| `components/ChatWidget.tsx` | rounded-2xl | 3 |
| `components/ChatWidget.tsx` | rounded-full | 7 |
| `components/ChatWidget.tsx` | text-white/ | 1 |
| `components/Footer.tsx` | primary | 1 |
| `components/Footer.tsx` | bg-dark | 1 |
| `components/Footer.tsx` | text-white/ | 5 |
| `components/forms/BookingForm.tsx` | bg-white | 6 |
| `components/forms/BookingForm.tsx` | rounded-full | 3 |
| `components/forms/ContactForm.tsx` | primary | 4 |
| `components/forms/ContactForm.tsx` | text-dark | 7 |
| `components/forms/ContactForm.tsx` | bg-white | 2 |
| `components/forms/ContactForm.tsx` | bg-surface | 1 |
| `components/forms/ContactForm.tsx` | border-border | 3 |
| `components/forms/ContactForm.tsx` | rounded-2xl | 2 |
| `components/forms/EnquiryFormFields.tsx` | primary | 12 |
| `components/forms/EnquiryFormFields.tsx` | text-dark | 3 |
| `components/forms/EnquiryFormFields.tsx` | bg-dark | 1 |
| `components/forms/EnquiryFormFields.tsx` | bg-white | 9 |
| `components/forms/EnquiryFormFields.tsx` | bg-surface | 1 |
| `components/forms/EnquiryFormFields.tsx` | border-border | 3 |
| `components/forms/EnquiryFormFields.tsx` | rounded-2xl | 4 |
| `components/forms/EnquiryFormFields.tsx` | rounded-full | 3 |
| `components/forms/EnquiryFormFields.tsx` | text-white/ | 3 |
| `components/Nav.tsx` | primary | 5 |
| `components/Nav.tsx` | text-dark | 4 |
| `components/Nav.tsx` | bg-white | 2 |
| `components/Nav.tsx` | border-border | 2 |
| `components/onboard/_primitives.tsx` | primary | 9 |
| `components/onboard/_primitives.tsx` | accent | 1 |
| `components/onboard/_primitives.tsx` | text-dark | 5 |
| `components/onboard/_primitives.tsx` | bg-dark | 1 |
| `components/onboard/_primitives.tsx` | bg-white | 4 |
| `components/onboard/_primitives.tsx` | border-border | 4 |
| `components/onboard/_primitives.tsx` | rounded-full | 5 |
| `components/onboard/_primitives.tsx` | shadow-medium | 1 |
| `components/onboard/BrandPalette.tsx` | primary | 6 |
| `components/onboard/BrandPalette.tsx` | accent | 1 |
| `components/onboard/BrandPalette.tsx` | text-dark | 4 |
| `components/onboard/BrandPalette.tsx` | bg-white | 3 |
| `components/onboard/BrandPalette.tsx` | bg-surface | 1 |
| `components/onboard/BrandPalette.tsx` | border-border | 4 |
| `components/onboard/BrandPalette.tsx` | rounded-full | 3 |
| `components/onboard/BrandPalette.tsx` | shadow-medium | 1 |
| `components/onboard/StepBusinessBasics.tsx` | text-dark | 1 |
| `components/onboard/StepBusinessBasics.tsx` | bg-warm | 1 |
| `components/onboard/StepBusinessBasics.tsx` | bg-surface | 1 |
| `components/onboard/StepBusinessBasics.tsx` | border-border | 1 |
| `components/onboard/StepDigitalPresence.tsx` | primary | 1 |
| `components/onboard/StepDigitalPresence.tsx` | text-dark | 1 |
| `components/onboard/StepDigitalPresence.tsx` | bg-white | 1 |
| `components/onboard/StepDigitalPresence.tsx` | border-border | 2 |
| `components/onboard/StepLookFeel.tsx` | primary | 1 |
| `components/onboard/StepReview.tsx` | primary | 3 |
| `components/onboard/StepReview.tsx` | accent | 2 |
| `components/onboard/StepReview.tsx` | text-dark | 1 |
| `components/onboard/StepReview.tsx` | bg-white | 1 |
| `components/onboard/StepReview.tsx` | bg-warm | 1 |
| `components/onboard/StepReview.tsx` | border-border | 3 |
| `components/onboard/StepReview.tsx` | rounded-full | 1 |
| `components/onboard/StepServices.tsx` | primary | 2 |
| `components/onboard/StepServices.tsx` | text-dark | 2 |
| `components/onboard/StepServices.tsx` | bg-white | 1 |
| `components/onboard/StepServices.tsx` | border-border | 3 |
| `components/onboard/StepSiteAssets.tsx` | text-dark | 1 |
| `components/onboard/StepSiteAssets.tsx` | bg-white | 1 |
| `components/onboard/StepSiteAssets.tsx` | border-border | 1 |
| `components/onboard/StepSuccess.tsx` | accent | 1 |
| `components/onboard/StepSuccess.tsx` | bg-warm | 1 |
| `components/onboard/StepSuccess.tsx` | border-border | 1 |
| `components/onboard/SubmittedScreen.tsx` | primary | 7 |
| `components/onboard/SubmittedScreen.tsx` | bg-dark | 1 |
| `components/onboard/SubmittedScreen.tsx` | bg-white | 1 |
| `components/onboard/SubmittedScreen.tsx` | rounded-full | 3 |
| `components/onboard/SubmittedScreen.tsx` | text-white/ | 3 |
| `components/onboard/TermsModal.tsx` | text-dark | 3 |
| `components/onboard/TermsModal.tsx` | bg-dark | 1 |
| `components/onboard/TermsModal.tsx` | bg-white | 1 |
| `components/onboard/TermsModal.tsx` | bg-surface | 1 |
| `components/onboard/TermsModal.tsx` | border-border | 1 |
| `components/onboard/TermsModal.tsx` | rounded-card | 1 |
| `components/onboard/TermsModal.tsx` | rounded-full | 1 |
| `components/onboard/TermsModal.tsx` | shadow-medium | 1 |
| `components/onboard/WelcomeScreen.tsx` | primary | 6 |
| `components/onboard/WelcomeScreen.tsx` | accent | 3 |
| `components/onboard/WelcomeScreen.tsx` | text-dark | 5 |
| `components/onboard/WelcomeScreen.tsx` | bg-dark | 1 |
| `components/onboard/WelcomeScreen.tsx` | bg-white | 3 |
| `components/onboard/WelcomeScreen.tsx` | bg-warm | 2 |
| `components/onboard/WelcomeScreen.tsx` | border-border | 6 |
| `components/onboard/WelcomeScreen.tsx` | rounded-full | 4 |
| `components/onboard/WelcomeScreen.tsx` | text-white/ | 1 |
| `components/onboard/WizardShell.tsx` | primary | 7 |
| `components/onboard/WizardShell.tsx` | accent | 2 |
| `components/onboard/WizardShell.tsx` | text-dark | 6 |
| `components/onboard/WizardShell.tsx` | bg-white | 6 |
| `components/onboard/WizardShell.tsx` | bg-warm | 1 |
| `components/onboard/WizardShell.tsx` | bg-surface | 3 |
| `components/onboard/WizardShell.tsx` | border-border | 8 |
| `components/onboard/WizardShell.tsx` | rounded-full | 6 |
| `components/sections/FAQ.tsx` | primary | 4 |
| `components/sections/FAQ.tsx` | accent | 1 |
| `components/sections/FAQ.tsx` | text-dark | 3 |
| `components/sections/FAQ.tsx` | bg-white | 1 |
| `components/sections/FAQ.tsx` | bg-warm | 1 |
| `components/sections/FAQ.tsx` | bg-surface | 1 |
| `components/sections/FAQ.tsx` | border-border | 3 |
| `components/sections/FAQ.tsx` | rounded-full | 1 |
| `components/sections/Footer.tsx` | primary | 1 |
| `components/sections/Footer.tsx` | accent | 1 |
| `components/sections/Footer.tsx` | bg-dark | 1 |
| `components/sections/Footer.tsx` | text-white/ | 15 |
| `components/sections/FreeAudit.tsx` | primary | 3 |
| `components/sections/FreeAudit.tsx` | accent | 5 |
| `components/sections/FreeAudit.tsx` | text-dark | 2 |
| `components/sections/FreeAudit.tsx` | bg-white | 2 |
| `components/sections/FreeAudit.tsx` | border-border | 1 |
| `components/sections/FreeAudit.tsx` | rounded-card | 1 |
| `components/sections/FreeAudit.tsx` | rounded-full | 1 |
| `components/sections/FreeAudit.tsx` | shadow-medium | 1 |
| `components/sections/Hero.tsx` | primary | 4 |
| `components/sections/Hero.tsx` | accent | 1 |
| `components/sections/Hero.tsx` | text-dark | 2 |
| `components/sections/Hero.tsx` | bg-white | 2 |
| `components/sections/Hero.tsx` | bg-surface | 1 |
| `components/sections/Hero.tsx` | border-border | 1 |
| `components/sections/Hero.tsx` | rounded-full | 2 |
| `components/sections/Hero.tsx` | shadow-medium | 1 |
| `components/sections/Hero.tsx` | radial-gradient | 3 |
| `components/sections/HeroBrowserMockup.tsx` | accent | 6 |
| `components/sections/HeroBrowserMockup.tsx` | text-dark | 1 |
| `components/sections/HeroBrowserMockup.tsx` | bg-white | 3 |
| `components/sections/HeroBrowserMockup.tsx` | bg-surface | 1 |
| `components/sections/HeroBrowserMockup.tsx` | border-border | 3 |
| `components/sections/HeroBrowserMockup.tsx` | rounded-card | 2 |
| `components/sections/HeroBrowserMockup.tsx` | rounded-full | 10 |
| `components/sections/HeroBrowserMockup.tsx` | shadow-glow | 1 |
| `components/sections/HowItWorks.tsx` | primary | 12 |
| `components/sections/HowItWorks.tsx` | accent | 17 |
| `components/sections/HowItWorks.tsx` | text-dark | 7 |
| `components/sections/HowItWorks.tsx` | bg-white | 6 |
| `components/sections/HowItWorks.tsx` | bg-surface | 5 |
| `components/sections/HowItWorks.tsx` | border-border | 11 |
| `components/sections/HowItWorks.tsx` | rounded-card | 1 |
| `components/sections/HowItWorks.tsx` | rounded-full | 18 |
| `components/sections/HowItWorks.tsx` | shadow-medium | 1 |
| `components/sections/HowItWorks.tsx` | text-white/ | 1 |
| `components/sections/HowItWorks.tsx` | bg-gradient | 3 |
| `components/sections/InnerHero.tsx` | accent | 1 |
| `components/sections/InnerHero.tsx` | text-dark | 3 |
| `components/sections/InnerHero.tsx` | bg-white | 1 |
| `components/sections/InnerHero.tsx` | radial-gradient | 2 |
| `components/sections/Nav.tsx` | primary | 13 |
| `components/sections/Nav.tsx` | accent | 1 |
| `components/sections/Nav.tsx` | text-dark | 9 |
| `components/sections/Nav.tsx` | bg-white | 2 |
| `components/sections/Nav.tsx` | border-border | 2 |
| `components/sections/Nav.tsx` | rounded-full | 2 |
| `components/sections/Nav.tsx` | shadow-medium | 2 |
| `components/sections/PageCTA.tsx` | primary | 4 |
| `components/sections/PageCTA.tsx` | accent | 2 |
| `components/sections/PageCTA.tsx` | bg-dark | 1 |
| `components/sections/PageCTA.tsx` | bg-white | 2 |
| `components/sections/PageCTA.tsx` | rounded-full | 2 |
| `components/sections/PageCTA.tsx` | shadow-medium | 1 |
| `components/sections/PageCTA.tsx` | text-white/ | 3 |
| `components/sections/PageCTA.tsx` | radial-gradient | 2 |
| `components/sections/Pricing.tsx` | primary | 11 |
| `components/sections/Pricing.tsx` | accent | 5 |
| `components/sections/Pricing.tsx` | text-dark | 4 |
| `components/sections/Pricing.tsx` | bg-white | 2 |
| `components/sections/Pricing.tsx` | bg-surface | 1 |
| `components/sections/Pricing.tsx` | border-border | 2 |
| `components/sections/Pricing.tsx` | rounded-card | 3 |
| `components/sections/Pricing.tsx` | rounded-full | 3 |
| `components/sections/Pricing.tsx` | shadow-medium | 1 |
| `components/sections/Pricing.tsx` | bg-gradient | 1 |
| `components/sections/SegmentMarquee.tsx` | accent | 2 |
| `components/sections/SegmentMarquee.tsx` | text-dark | 2 |
| `components/sections/SegmentMarquee.tsx` | bg-warm | 1 |
| `components/sections/SegmentMarquee.tsx` | border-border | 1 |
| `components/sections/SegmentMarquee.tsx` | rounded-full | 1 |
| `components/sections/SegmentMarquee.tsx` | bg-gradient | 2 |
| `components/sections/Services.tsx` | primary | 6 |
| `components/sections/Services.tsx` | accent | 11 |
| `components/sections/Services.tsx` | text-dark | 3 |
| `components/sections/Services.tsx` | bg-dark | 5 |
| `components/sections/Services.tsx` | bg-white | 8 |
| `components/sections/Services.tsx` | bg-warm | 1 |
| `components/sections/Services.tsx` | bg-surface | 4 |
| `components/sections/Services.tsx` | border-border | 6 |
| `components/sections/Services.tsx` | rounded-card | 4 |
| `components/sections/Services.tsx` | rounded-2xl | 1 |
| `components/sections/Services.tsx` | rounded-full | 17 |
| `components/sections/Services.tsx` | shadow-medium | 1 |
| `components/sections/Services.tsx` | text-white/ | 1 |
| `components/sections/Services.tsx` | radial-gradient | 4 |
| `components/sections/SocialProof.tsx` | primary | 5 |
| `components/sections/SocialProof.tsx` | accent | 1 |
| `components/sections/SocialProof.tsx` | text-dark | 2 |
| `components/sections/SocialProof.tsx` | bg-warm | 1 |
| `components/sections/SocialProof.tsx` | rounded-full | 2 |
| `components/sections/Thesis.tsx` | accent | 1 |
| `components/sections/Thesis.tsx` | text-dark | 2 |
| `components/sections/Thesis.tsx` | bg-warm | 1 |
| `components/sections/Thesis.tsx` | border-border | 1 |
| `components/sections/TooGoodToBeTrue.tsx` | primary | 3 |
| `components/sections/TooGoodToBeTrue.tsx` | accent | 3 |
| `components/sections/TooGoodToBeTrue.tsx` | text-dark | 1 |
| `components/sections/TooGoodToBeTrue.tsx` | bg-white | 1 |
| `components/sections/TooGoodToBeTrue.tsx` | bg-warm | 1 |
| `components/sections/TooGoodToBeTrue.tsx` | border-border | 1 |
| `components/sections/TooGoodToBeTrue.tsx` | rounded-card | 1 |
| `components/sections/TooGoodToBeTrue.tsx` | rounded-full | 1 |
| `components/sections/TooGoodToBeTrue.tsx` | shadow-medium | 1 |
| `components/sections/WaitlistCTA.tsx` | primary | 4 |
| `components/sections/WaitlistCTA.tsx` | accent | 2 |
| `components/sections/WaitlistCTA.tsx` | bg-dark | 1 |
| `components/sections/WaitlistCTA.tsx` | bg-white | 1 |
| `components/sections/WaitlistCTA.tsx` | rounded-card | 1 |
| `components/sections/WaitlistCTA.tsx` | rounded-full | 1 |
| `components/sections/WaitlistCTA.tsx` | shadow-medium | 1 |
| `components/sections/WaitlistCTA.tsx` | text-white/ | 3 |
| `components/sections/WaitlistCTA.tsx` | radial-gradient | 2 |
| `components/ui/Badge.tsx` | accent | 3 |
| `components/ui/Badge.tsx` | rounded-full | 1 |
| `components/ui/Button.tsx` | primary | 6 |
| `components/ui/Button.tsx` | text-dark | 2 |
| `components/ui/Button.tsx` | bg-white | 1 |
| `components/ui/Button.tsx` | bg-surface | 2 |
| `components/ui/Button.tsx` | border-border | 1 |
| `components/ui/Button.tsx` | rounded-full | 2 |
| `components/ui/Card.tsx` | bg-white | 1 |
| `components/ui/Card.tsx` | border-border | 1 |
| `components/ui/Card.tsx` | rounded-card | 1 |
| `components/ui/Card.tsx` | shadow-medium | 1 |
| `components/ui/EnquiryModal.tsx` | primary | 5 |
| `components/ui/EnquiryModal.tsx` | accent | 2 |
| `components/ui/EnquiryModal.tsx` | text-dark | 4 |
| `components/ui/EnquiryModal.tsx` | bg-dark | 1 |
| `components/ui/EnquiryModal.tsx` | bg-white | 2 |
| `components/ui/EnquiryModal.tsx` | bg-surface | 2 |
| `components/ui/EnquiryModal.tsx` | border-border | 3 |
| `components/ui/EnquiryModal.tsx` | rounded-card | 1 |
| `components/ui/EnquiryModal.tsx` | rounded-full | 3 |
| `components/ui/EnquiryModal.tsx` | shadow-medium | 2 |
| `components/ui/Eyebrow.tsx` | accent | 2 |
| `components/ui/ScrollProgress.tsx` | primary | 1 |
| `components/ui/SectionHeader.tsx` | text-dark | 1 |
| `components/ui/SectionHeader.tsx` | text-white/ | 1 |

**Retired effect uses**

- app/globals.css:49:  /* Safety net for mobile: decorative bleed (SlideReveal's x-transform,
- app/page.tsx:14:import SectionDivider from "@/components/ui/SectionDivider";
- app/page.tsx:24:        <SectionDivider fill="#FFFFFF" />
- app/page.tsx:26:        <SectionDivider fill="#FDFAF7" />
- app/page.tsx:29:        <SectionDivider fill="#FFFFFF" />
- app/page.tsx:31:        <SectionDivider fill="#FDFAF7" />
- app/page.tsx:34:        <SectionDivider fill="#FFFFFF" />
- app/page.tsx:36:        <SectionDivider fill="#1A1A2E" />
- components/motion/SlideReveal.tsx:7:interface SlideRevealProps extends HTMLAttributes<HTMLDivElement> {
- components/motion/SlideReveal.tsx:15:export function SlideReveal({
- components/motion/SlideReveal.tsx:24:}: SlideRevealProps) {
- components/motion/useCountUp.ts:7:export function useCountUp(
- components/sections/HeroBrowserMockup.tsx:5:import Tilt from "react-parallax-tilt";
- components/sections/HeroBrowserMockup.tsx:270:          <span className="inline-block w-px h-3 bg-text-muted/60 align-middle ml-px animate-pulse-subtle" />
- components/sections/HowItWorks.tsx:13:import { SlideReveal } from "@/components/motion/SlideReveal";
- components/sections/HowItWorks.tsx:204:        <SlideReveal
- components/sections/HowItWorks.tsx:214:        </SlideReveal>
- components/sections/HowItWorks.tsx:225:        <SlideReveal
- components/sections/HowItWorks.tsx:231:        </SlideReveal>
- components/sections/Pricing.tsx:163:              <span className="h-2 w-2 rounded-full bg-primary animate-pulse-subtle" />
- components/sections/SegmentMarquee.tsx:28:          reverse ? "animate-marquee-reverse" : "animate-marquee"
- components/sections/Services.tsx:7:import { SlideReveal } from "@/components/motion/SlideReveal";
- components/sections/Services.tsx:280:        <SlideReveal
- components/sections/Services.tsx:303:        </SlideReveal>
- components/sections/Thesis.tsx:7:import { useCountUp } from "@/components/motion/useCountUp";
- components/sections/Thesis.tsx:63:  const value = useCountUp(stat.target, trigger, { duration: 1.6, overshoot: true });
- components/ui/SectionDivider.tsx:7:export default function SectionDivider({ fill, flip = false, className = "" }: Props) {

**framer-motion transitions off the house timings** (duration not in 0.16/0.28/0.48/0.6)

- components/sections/FAQ.tsx:47:duration: 0.4
- components/sections/HeroBrowserMockup.tsx:104:duration: 0.8
- components/sections/Nav.tsx:152:duration: 0.3
- components/sections/Nav.tsx:178:duration: 0.5
- components/sections/Nav.tsx:205:duration: 0.5
- components/sections/SocialProof.tsx:98:duration: 0.5
- components/sections/Thesis.tsx:63:duration: 1.6
- components/sections/WaitlistCTA.tsx:70:duration: 0.5
- components/sections/WaitlistCTA.tsx:110:duration: 0.5
- components/ui/EnquiryModal.tsx:114:duration: 0.3
- components/ui/EnquiryModal.tsx:133:duration: 0.4
- components/ui/EnquiryModal.tsx:164:duration: 0.4
- components/ui/EnquiryModal.tsx:190:duration: 0.3

**Invisible until JS runs** (initial opacity 0)

- components/motion/Reveal.tsx:45:          hidden: { opacity: 0, y },
- components/motion/Reveal.tsx:75:      initial={shouldReduce ? {} : { opacity: 0, y }}
- components/motion/SlideReveal.tsx:31:      initial={shouldReduce ? {} : { opacity: 0, x }}
- components/motion/Stagger.tsx:15:  hidden: { opacity: 0, y: 24 },
- components/sections/FAQ.tsx:44:            initial={shouldReduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
- components/sections/FAQ.tsx:46:            exit={shouldReduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
- components/sections/Hero.tsx:16:    initial: shouldReduce ? {} : { opacity: 0, y: 20 },
- components/sections/Hero.tsx:29:    hidden: shouldReduce ? {} : { opacity: 0, y: 24 },
- components/sections/HeroBrowserMockup.tsx:102:      initial={shouldReduce ? {} : { opacity: 0, x: 40 }}
- components/sections/HeroBrowserMockup.tsx:134:                initial={shouldReduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
- components/sections/HeroBrowserMockup.tsx:136:                exit={shouldReduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
- components/sections/Nav.tsx:149:            initial={shouldReduce ? { opacity: 0 } : { opacity: 0 }}
- components/sections/Nav.tsx:151:            exit={{ opacity: 0 }}
- components/sections/Nav.tsx:174:                      hidden: shouldReduce ? {} : { opacity: 0, y: 24 },
- components/sections/Nav.tsx:203:                initial={shouldReduce ? {} : { opacity: 0, y: 20 }}
- components/sections/SocialProof.tsx:95:              initial={shouldReduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
- components/sections/SocialProof.tsx:97:              exit={shouldReduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
- components/sections/WaitlistCTA.tsx:67:                  initial={{ opacity: 0, y: 8 }}
- components/sections/WaitlistCTA.tsx:69:                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
- components/sections/WaitlistCTA.tsx:108:      initial={{ opacity: 0, scale: 0.96 }}
- components/ui/EnquiryModal.tsx:111:          initial={shouldReduce ? { opacity: 0 } : { opacity: 0 }}
- components/ui/EnquiryModal.tsx:113:          exit={{ opacity: 0 }}
- components/ui/EnquiryModal.tsx:130:            initial={shouldReduce ? { opacity: 0 } : { y: 24, opacity: 0, scale: 0.98 }}
- components/ui/EnquiryModal.tsx:132:            exit={shouldReduce ? { opacity: 0 } : { y: 16, opacity: 0, scale: 0.98 }}
- components/ui/EnquiryModal.tsx:162:                    initial={{ opacity: 0, scale: 0.96 }}
- components/ui/EnquiryModal.tsx:187:                    initial={{ opacity: 0 }}
- components/ui/EnquiryModal.tsx:189:                    exit={{ opacity: 0 }}

## SEO and enquiry plumbing

### Routes and titles

| Route | Source | How the title is set | Title already ends in "Dorza"? | Canonical |
|---|---|---|---|---|
| `/` | `app/page.tsx` | inherits the layout default | the default is a full title, not templated | layout sets `SITE_URL` on every page |
| `/about` | `app/about/page.tsx` | static `"About Dorza — Built for Western Sydney Small Business"` | no, but it contains "Dorza", so the template adds a second | `${SITE_URL}/about` |
| `/contact` | `app/contact/layout.tsx` | static `"Contact Dorza — Western Sydney Web Design & Marketing"` | same as `/about` | `${SITE_URL}/contact` |
| `/website-cost` | `app/website-cost/page.tsx` | `PAGE_TITLE` constant, ending `\| Western Sydney \| Dorza` | **yes**, so the rendered title has `\| Dorza \| Dorza` | `${SITE_URL}/website-cost` |
| `/services/[slug]` (4) | `generateMetadata` from `SERVICES[].metaTitle` | all end in `\| Dorza` | **yes** | its own |
| `/areas/[slug]` (6) | `generateMetadata` from `AREAS[].metaTitle` | all end in `\| Dorza` | **yes** | its own |
| `/industries/[slug]` (3) | `generateMetadata` from `INDUSTRIES[].metaTitle` | all end in `\| Dorza` | **yes** | its own |
| 404 | `app/not-found.tsx` | `"Page not found — Dorza"` | yes | inherited from the layout |
| `/onboard`, `/admin`, `/upload`, `/demo/*` | out of scope | | | |

### JSON-LD

| File | Type | Scope |
|---|---|---|
| `app/layout.tsx` | ProfessionalService (with ContactPoint and Service offers) | every page |
| `app/layout.tsx` | WebSite | every page |
| `app/layout.tsx` | FAQPage | **every page**, so the services and website-cost pages each emit two FAQPage blocks |
| `app/services/[slug]/page.tsx` | BreadcrumbList, FAQPage | each service page |
| `app/areas/[slug]/page.tsx` | BreadcrumbList, ProfessionalService | each area page |
| `app/industries/[slug]/page.tsx` | BreadcrumbList | each industry page |
| `app/about/page.tsx`, `app/contact/page.tsx` | BreadcrumbList | one page each |
| `app/website-cost/page.tsx` | BreadcrumbList, FAQPage | one page |

### Text in public/ that names places, prices or plans

- `public/sitemap.xml`: the six `/areas/*` URLs (Western Sydney, Parramatta, Blacktown, Penrith, Liverpool, Campbelltown). No prices.
- `public/robots.txt`: none.
- `public/llms.txt`:
  - line 3: "Dorza is a Western Sydney-based AI-native digital agency…"
  - line 16: a `| Plan | Monthly | Setup fee |` pricing table
  - line 22: "Founding client offer: 50% off setup for the first 20 Sydney clients"
  - lines 34 to 39: a suburb list with population claims ("400,000+ residents", "population doubling by 2036")
  - lines 57 to 62: area URLs
  - line 74: "Location: Parramatta, NSW 2150"

### Anchor links

- `#waitlist`: `components/Nav.tsx` 33 and 62; `components/sections/FreeAudit.tsx` 84; `Hero.tsx` 82; `Pricing.tsx` 150; `TooGoodToBeTrue.tsx` 62. All are in files the plan deletes.
- `#how-it-works`: `components/Nav.tsx` 8, `components/Footer.tsx` 3, `Hero.tsx` 92. All deleted.
- `#services`: `components/Nav.tsx` 7, `components/Footer.tsx` 2, `components/sections/Nav.tsx` 98 (`/#services`). All replaced.
- `#pricing`: `components/sections/Nav.tsx` 45 and 110; `components/sections/Footer.tsx` 29; **`components/sections/PageCTA.tsx` 56 (`/#pricing`)**. The new `HomePricing` keeps `id="pricing"`, so this link still works.

### Enquiry path

- Two components render the form: `components/sections/WaitlistCTA.tsx` (inline, `source: 'inline'`) and `components/ui/EnquiryModal.tsx` (`source: 'modal'`). Both go through `components/forms/EnquiryFormFields.tsx`.
- `EnquiryModal` is a default export with props `{ open: boolean; onClose: () => void }`.
- `lib/useEnquirySubmit.ts` posts `EnquiryFormData` to `NEXT_PUBLIC_ENQUIRY_SUBMIT_URL` via `submitForm`.
- `SERVICE_OPTIONS` before this work: "Custom websites", "Social media management", "Research & strategy", "AI assistant", "Not sure yet".
- `enquiry-submit` keeps any non-empty string in `servicesInterested` (up to 20) and accepts only `inline` or `modal` for `source`.

## Claims register

| Claim | Where | Call | Why |
|---|---|---|---|
| Websites from $499 | Thesis, website-cost, Pricing | keep | Confirmed price, in `docs/proof-sources.md` |
| Plan and price within 72 hours | contact, PageCTA, FreeAudit, Pricing, website-cost | keep | Service promise, in the proof register |
| No lock-in | PageCTA, website-cost, Pricing | keep | Dorza terms |
| "100%: you own everything we build" | Thesis | keep the claim, drop the counter | True under the terms; the count-up animation is retired |
| "Live in 24 hours" and "From signup to your site going live: 24h" | Thesis, Pricing, about, website-cost | remove | The plan allows one start condition only: after the client approves the plan |
| Founding client offer, 50% off for the first 20 | Pricing, website-cost, llms.txt | remove | The plan and tests ban "Founding client" |
| Free audit for the first 20 Western Sydney businesses | FreeAudit, Hero, PageCTA, website-cost | remove | "free audit" is banned old voice |
| Testimonials from Sam T. (Westmead Electrical), Mia L. (Granville Coffee Co.) and Jordan K. (Penrith Hair Studio) | SocialProof | remove | No source in the proof register |
| Mock client names: Parramatta Coffee Co., Blacktown Hair Studio, Parramatta Beans, Smith Plumbing, "On-site in 2 hours" | HeroBrowserMockup, HowItWorks, Services | remove | Invented businesses shown as if they were real work |
| "+42% vs last" | HowItWorks | remove | Unsourced statistic |
| "Profiles with photos get 42% more…" | `lib/data/services.ts` 250 | remove | Unsourced statistic |
| Industry outcome stats "70%" and "40%" | `lib/data/industries.ts` 105, 262 | remove | Unsourced; the `outcomes` arrays are deleted in Task 14 |
| "30% commission… to a delivery app" | `lib/data/industries.ts` 62 | remove | A number other than $499, 72 hours or a session fact |
| "3-5 posts per week" | `lib/data/services.ts` 148 | remove | A number outside the allowed set |
| Western Sydney, Parramatta, Blacktown and Penrith in brand copy | Hero, about, contact, website-cost, layout metadata | move to the local layer | The brand layer names no suburbs; area pages keep them |
| Parramatta NSW 2150 address | layout JSON-LD, contact | keep, in the schema only | It's the real base address; visible brand pages drop it |
| Suburb population claims (400,000+, doubling by 2036) | llms.txt | remove | llms.txt is replaced in Task 16 |
| Local detail on area pages | `lib/data/areas.ts` | keep | Local layer; only banned words, `!` and em dashes get fixed |

## Assumption check

| # | Assumption | Result | Evidence |
|---|---|---|---|
| A1 | `output: 'export'` and `images.unoptimized: true` | TRUE | `next.config.mjs` |
| A2 | Marketing pages import `sections/Nav` and `sections/Footer`; nothing imports `components/Nav.tsx` or `components/Footer.tsx` | TRUE | All 7 marketing pages import `@/components/sections/Nav`; grep for `components/Nav"`, `components/Footer"` and their relative forms returns nothing |
| A3 | `EnquiryModal` is a default export taking `{ open, onClose }` | TRUE | `components/ui/EnquiryModal.tsx` 24 to 29 |
| A4 | `cn` joins with a space and doesn't merge | TRUE | `lib/cn.ts`: `classes.filter(Boolean).join(" ")` |
| A5 | Custom animations appear only in HeroBrowserMockup, Pricing and SegmentMarquee | TRUE | `animate-pulse-subtle` (HeroBrowserMockup 270, Pricing 163), `animate-marquee(-reverse)` (SegmentMarquee 28) |
| A6 | `react-parallax-tilt` appears only in HeroBrowserMockup | TRUE | HeroBrowserMockup 5 |
| A7 | `useCountUp` appears only in Thesis; `SlideReveal` only in Services and HowItWorks | TRUE | Thesis 7; Services 7; HowItWorks 13 |
| A8 | `SERVICES`, `AREAS` and `INDUSTRIES` have `slug` and `metaTitle`; industries have `outcomes` | TRUE | `lib/data/*.ts`; `IndustryPage.outcomes: IndustryOutcome[]` |
| A9 | `faqs` is `{ q; a }[]`; the layout emits FAQPage on every page | TRUE | `lib/data/faq.ts` 1 to 3; `app/layout.tsx` 158 |
| A10 | `enquiry-submit` accepts any string array; `source` is inline or modal only | TRUE | `index.ts` 11 (`ALLOWED_SOURCES`), 88 to 89 |
| A11 | No test runner and no `test` script | TRUE | `package.json` has no `test` script, vitest or jest |
| A12 | `DESIGN.md` describes Figma's design system | TRUE | First line is "# Figma Design System" |

## Per-file change list

| Path | Task | What changes | What the plan didn't expect |
|---|---|---|---|
| `docs/superpowers/audits/2026-11-12-reposition-audit.md` | 1 | Created | |
| `DESIGN.md` → `docs/archive/DESIGN.figma-reference.md` | 2 | Moved | |
| `PRODUCT.md` | 2 | Created | The spec §11 text it should be built from is missing |
| `docs/proof-sources.md` | 2 | Created | |
| `vitest.config.ts`, `tests/**` | 3 to 16 | Created | |
| `lib/site.ts` | 3 | Created | |
| `lib/routes.ts` | 16 | Created | |
| `lib/data/pillars.ts` | 5 | Created | |
| `lib/data/work.ts` | 6 | Created | |
| `lib/data/faq.ts`, `lib/constants.ts`, `lib/seo.ts` | 5, 16 | New FAQ, enquiry options, national constants | |
| `lib/data/services.ts`, `areas.ts`, `industries.ts` | 14 | Title suffix fixed, voice sweep, stats removed | Two industry `metaTitle` values wrap onto their own line (the plan already notes this) |
| `app/globals.css`, `tailwind.config.ts`, `app/layout.tsx` | 4, 8, 10, 16 | Tokens, aliases, fonts, JSON-LD | Services and website-cost pages currently get two FAQPage blocks; Task 16 removes the site-wide one |
| `components/ui/buttonClasses.ts`, `StatusTag.tsx`, `ImageFrame.tsx`, `PlusList.tsx` | 7 | Created | |
| `components/ui/Button.tsx`, `Eyebrow.tsx` | 7 | v7 variants | `Eyebrow` is used only by the unimported `SectionHeader`, not by the local or industry templates |
| `components/motion/Reveal.tsx`, `Stagger.tsx` | 8 | No-JS safety, house timings | `Stagger` is unimported |
| `components/motion/LineReveal.tsx`, `Spine.tsx` | 8 | Created | |
| `components/sections/Nav.tsx`, `Footer.tsx` | 9 | Rewritten | |
| `components/sections/home/*.tsx` | 10 | Created | |
| `components/sections/PillarPage.tsx`, `PageCTA.tsx`, `InnerHero.tsx`, `FAQ.tsx`, `WaitlistCTA.tsx` | 10, 11, 13, 14 | Created or restyled | `PageCTA` links to `/#pricing`, which keeps working because `HomePricing` has `id="pricing"` |
| `components/work/WorkCard.tsx` | 10 | Created | |
| `app/page.tsx`, `app/about/page.tsx`, `app/contact/**`, `app/not-found.tsx` | 10, 13, 16 | Rewritten or modified | |
| `app/start`, `app/grow`, `app/support`, `app/work`, `app/work/[slug]`, `app/areas/page.tsx`, `app/privacy` | 11 to 13 | Created | |
| `scripts/capture-work.mjs`, `scripts/og-images.mjs`, `app/icon.svg` | 15 | Created | |
| `public/sitemap.xml`, `public/llms.txt` | 16 | Replaced | |
| Retired sections, `components/Nav.tsx`, `components/Footer.tsx`, `SectionDivider`, `SlideReveal`, `useCountUp` | 9, 10 | Deleted | `Card`, `Badge` and `SectionHeader` are also unimported; the plan sweeps them in Task 14 instead of deleting them |
| `DESIGN.md` | 17 | Written from the finished build | |
