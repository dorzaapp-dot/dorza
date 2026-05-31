"use client";

import { Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

const agencyPoints = [
  "$5,000+ to build a site",
  "Thousands a month to run it",
  "6-week wait, then lock-in",
  "Bill-by-the-hour changes",
];

const dorzaPoints = [
  "Custom builds from $499",
  "Live in 24 hours",
  "Tailored to your business",
  "No lock-in, ever",
];

const includes = [
  "Custom-designed website",
  "Google Business Profile set up",
  "Mobile-first & SEO-ready",
  "Built to get you found by locals",
];

export default function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-24 py-16 md:py-[7.5rem] bg-white">
      <Container>
        {/* Heading */}
        <Reveal>
          <div className="text-center mb-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-4">
              {"// Pricing"}
            </p>
            <h2 className="font-display text-[44px] md:text-[60px] leading-[1.02] tracking-[-0.025em] text-dark">
              No two businesses are the same. Neither are our prices.
            </h2>
            <p className="mt-5 text-[17px] md:text-[18px] text-text-secondary max-w-2xl mx-auto">
              We price every build to what your business actually needs — and
              send back an exact quote before you commit to anything.
            </p>
          </div>
        </Reveal>

        {/* Value-anchor comparison */}
        <Reveal delay={0.1}>
          <div className="relative rounded-card border border-border bg-white p-6 md:p-10 overflow-hidden">
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-transparent pointer-events-none"
            />

            <div className="relative">
              <div className="text-center md:text-left">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-2">
                  {"// See the difference"}
                </p>
                <h3 className="font-display text-[28px] md:text-[40px] leading-[1.05] tracking-[-0.025em] text-dark">
                  Agency-quality work. A fraction of the cost.
                </h3>
              </div>

              <div className="mt-8 grid md:grid-cols-2 gap-6 md:gap-8 items-start">
                {/* Traditional agency — the loser */}
                <div className="rounded-card border border-border bg-surface p-6">
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted mb-5">
                    Traditional agency
                  </p>
                  <ul className="space-y-3">
                    {agencyPoints.map((p) => (
                      <li
                        key={p}
                        className="flex items-start gap-2.5 text-[15px] text-text-muted leading-relaxed"
                      >
                        <span
                          aria-hidden
                          className="mt-0.5 shrink-0 inline-flex h-[15px] w-[15px] items-center justify-center text-text-muted"
                        >
                          ×
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* With Dorza — the winner */}
                <div className="rounded-card border border-primary/20 bg-primary-tint p-6">
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary-dark mb-5">
                    With Dorza
                  </p>
                  <ul className="space-y-3">
                    {dorzaPoints.map((p) => (
                      <li
                        key={p}
                        className="flex items-start gap-2.5 text-[15px] text-dark leading-relaxed"
                      >
                        <Check
                          size={16}
                          className="text-accent mt-0.5 shrink-0"
                        />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* What every build includes */}
        <Reveal delay={0.15}>
          <div className="mt-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-5 text-center md:text-left">
              {"// What you get"}
            </p>
            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
              {includes.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-[15px] text-text-secondary leading-relaxed"
                >
                  <Check size={16} className="text-accent mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[15px] text-text-secondary">
              Want us to keep it running — posts, updates, reviews? Optional
              ongoing management, built into your quote.
            </p>
          </div>
        </Reveal>

        {/* Anchor + CTA */}
        <Reveal delay={0.2}>
          <div className="mt-12 text-center">
            <p className="text-[17px] md:text-[18px] text-text-secondary max-w-xl mx-auto">
              Most builds start from{" "}
              <span className="font-semibold text-dark">$499</span>. Tell us
              about your business and we&apos;ll send back a tailored plan and
              price within 72 hours — no obligation.
            </p>
            <div className="mt-7 flex justify-center">
              <a
                href="#waitlist"
                className="inline-flex items-center justify-center h-12 px-6 bg-primary hover:bg-primary-dark text-white font-semibold text-sm rounded-full transition-all duration-300 ease-dorza hover:-translate-y-px hover:shadow-medium active:translate-y-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Get your free quote →
              </a>
            </div>
          </div>
        </Reveal>

        {/* Founding-offer pill */}
        <Reveal delay={0.3}>
          <div className="mt-12 flex items-center justify-center">
            <div className="inline-flex items-center gap-3 h-12 px-6 bg-primary-tint border border-primary/20 rounded-full">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse-subtle" />
              <p className="font-mono text-[11px] md:text-[12px] text-primary-dark uppercase tracking-[0.14em] font-semibold">
                Founding client offer · 50% off your build · First 20 Western
                Sydney businesses
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
