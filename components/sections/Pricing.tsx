"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { DORZA_EASE } from "@/components/motion/Reveal";
import { useCountUp } from "@/components/motion/useCountUp";

const plans = [
  {
    name: "Starter",
    setup: 499,
    monthly: 199,
    tagline: "Website + Google Business",
    features: [
      "Custom website",
      "Google Business setup",
      "Mobile-optimised & SEO-ready",
      "Basic analytics dashboard",
    ],
    highlighted: false,
  },
  {
    name: "Growth",
    setup: 799,
    monthly: 349,
    tagline: "Website + Social + Chatbot",
    features: [
      "Everything in Starter",
      "Social media (3 posts/week)",
      "AI customer service chatbot",
      "Review management",
      "Monthly performance report",
    ],
    highlighted: true,
  },
  {
    name: "Pro",
    setup: 1299,
    monthly: 549,
    tagline: "Full service, everything on",
    features: [
      "Everything in Growth",
      "Social media (5 posts/week)",
      "Paid ad campaigns",
      "Monthly strategy call",
      "Priority support",
    ],
    highlighted: false,
  },
];

const comparison = {
  agency: {
    label: "Traditional agency",
    monthly: 3000,
    setup: 5000,
    features: [
      "Discovery workshops, decks, drawn-out approvals",
      "12-month lock-in retainer",
      "Multiple stakeholders, slow turnaround",
      "Bill-by-the-hour change requests",
    ],
  },
  dorza: {
    label: "With Dorza",
    monthly: 349,
    setup: 799,
    features: [
      "AI-assisted build, hand-coded by a real team",
      "Month-to-month, cancel any time",
      "One team, fast iteration",
      "All revisions included",
    ],
  },
};

function PricingCard({ plan }: { plan: (typeof plans)[0] }) {
  if (plan.highlighted) {
    return (
      <div className="relative md:-my-3">
        {/* Gradient border via wrapper */}
        <div className="absolute -inset-px rounded-[22px] bg-gradient-to-br from-primary via-accent to-primary-light opacity-80" />
        <div className="relative rounded-card flex flex-col p-6 bg-white shadow-medium">
          <span className="absolute -top-3.5 left-6 inline-flex items-center h-7 px-4 bg-primary text-white font-mono text-[10px] uppercase tracking-[0.16em] rounded-full shadow-glow-sm">
            Most popular
          </span>

          <h3 className="font-display text-[34px] leading-none tracking-[-0.02em] text-dark">
            {plan.name}
          </h3>
          <p className="text-text-muted text-[13px] mt-1 font-mono">
            {plan.tagline}
          </p>

          <div className="mt-5 flex items-baseline gap-1 flex-wrap">
            <span className="font-body font-bold text-[48px] md:text-[56px] leading-none text-dark tracking-[-0.04em]">
              ${plan.monthly}
            </span>
            <span className="text-text-muted text-sm">/mo</span>
            <span className="text-text-muted text-sm ml-1">
              + ${plan.setup} setup
            </span>
          </div>

          <ul className="mt-6 space-y-3 flex-1">
            {plan.features.map((f) => (
              <li
                key={f}
                className="flex items-start gap-2 text-sm text-text-secondary"
              >
                <Check size={15} className="text-accent mt-0.5 shrink-0" />
                {f}
              </li>
            ))}
          </ul>

          <a
            href="#waitlist"
            className="mt-6 inline-flex items-center justify-center h-12 w-full font-semibold text-sm rounded-full transition-all duration-300 ease-dorza hover:-translate-y-px active:translate-y-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 bg-primary hover:bg-primary-dark text-white hover:shadow-medium"
          >
            Get started
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-card flex flex-col p-6 bg-white border border-border hover:shadow-medium hover:-translate-y-1 hover:border-border-strong transition-all duration-500 ease-dorza">
      <h3 className="font-display text-[34px] leading-none tracking-[-0.02em] text-dark">
        {plan.name}
      </h3>
      <p className="text-text-muted text-[13px] mt-1 font-mono">
        {plan.tagline}
      </p>

      <div className="mt-5 flex items-baseline gap-1 flex-wrap">
        <span className="font-body font-bold text-[48px] md:text-[56px] leading-none text-dark tracking-[-0.04em]">
          ${plan.monthly}
        </span>
        <span className="text-text-muted text-sm">/mo</span>
        <span className="text-text-muted text-sm ml-1">
          + ${plan.setup} setup
        </span>
      </div>

      <ul className="mt-6 space-y-3 flex-1">
        {plan.features.map((f) => (
          <li
            key={f}
            className="flex items-start gap-2 text-sm text-text-secondary"
          >
            <Check size={15} className="text-accent mt-0.5 shrink-0" />
            {f}
          </li>
        ))}
      </ul>

      <a
        href="#waitlist"
        className="mt-6 inline-flex items-center justify-center h-12 w-full font-semibold text-sm rounded-full transition-all duration-300 ease-dorza hover:-translate-y-px active:translate-y-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 bg-white border border-border text-dark hover:bg-surface hover:border-border-strong"
      >
        Get started
      </a>
    </div>
  );
}

function ComparisonToggle() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [side, setSide] = useState<"agency" | "dorza">("agency");

  // Auto-flip from agency to dorza shortly after entering view, for the reveal effect.
  const [autoFlipped, setAutoFlipped] = useState(false);
  useEffect(() => {
    if (!inView || autoFlipped) return;
    const t = setTimeout(() => {
      setSide("dorza");
      setAutoFlipped(true);
    }, 1400);
    return () => clearTimeout(t);
  }, [inView, autoFlipped]);

  const data = comparison[side];
  const monthly = useCountUp(data.monthly, inView, { duration: 0.9 });
  const setup = useCountUp(data.setup, inView, { duration: 0.9 });

  const savings = comparison.agency.monthly - comparison.dorza.monthly;
  const savingsPct = Math.round((savings / comparison.agency.monthly) * 100);

  return (
    <div
      ref={ref}
      className="relative rounded-card border border-border bg-white p-6 md:p-10 overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-transparent pointer-events-none"
      />

      <div className="relative">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-2">
              See the difference
            </p>
            <h3 className="font-display text-[32px] md:text-[44px] leading-[1.05] tracking-[-0.025em] text-dark">
              Same outcome. A fraction of the cost.
            </h3>
          </div>

          {/* Toggle */}
          <div
            role="tablist"
            aria-label="Compare pricing"
            className="relative inline-flex p-1 bg-surface border border-border rounded-full self-start md:self-auto"
          >
            <span
              aria-hidden
              className={`absolute top-1 bottom-1 w-1/2 rounded-full bg-white border border-border shadow-soft transition-transform duration-500 ease-dorza ${
                side === "dorza" ? "translate-x-full" : "translate-x-0"
              }`}
              style={{ left: 4, right: 4, width: "calc(50% - 4px)" }}
            />
            {(["agency", "dorza"] as const).map((k) => (
              <button
                key={k}
                role="tab"
                aria-selected={side === k}
                onClick={() => setSide(k)}
                className={`relative z-10 px-4 md:px-5 h-9 rounded-full font-semibold text-[13px] transition-colors duration-300 ease-dorza ${
                  side === k ? "text-dark" : "text-text-muted hover:text-text-secondary"
                }`}
              >
                {comparison[k].label}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="mt-8 grid md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-5">
            <motion.div
              key={`price-${side}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: DORZA_EASE }}
              className="flex items-baseline gap-2 flex-wrap"
            >
              <span className="font-body font-bold text-[48px] sm:text-[64px] md:text-[88px] leading-none tracking-[-0.05em] text-dark tabular-nums">
                ${Math.round(monthly).toLocaleString()}
              </span>
              <span className="text-text-muted text-base">/mo</span>
            </motion.div>
            <p className="mt-3 text-sm text-text-muted">
              + ${Math.round(setup).toLocaleString()} setup
            </p>

            <AnimatePresence>
              {side === "dorza" && (
                <motion.div
                  key="savings"
                  initial={{ opacity: 0, scale: 0.9, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 6 }}
                  transition={{ duration: 0.5, ease: DORZA_EASE }}
                  className="mt-5 inline-flex items-center gap-2 h-9 px-4 bg-accent-tint text-accent-dark border border-accent/30 rounded-full font-semibold text-[13px]"
                >
                  You save ${savings.toLocaleString()}/mo · {savingsPct}% off
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="md:col-span-7">
            <AnimatePresence mode="wait">
              <motion.ul
                key={`features-${side}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: DORZA_EASE }}
                className="space-y-3"
              >
                {data.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-[15px] text-text-secondary leading-relaxed"
                  >
                    <Check
                      size={16}
                      className={`mt-0.5 shrink-0 ${
                        side === "dorza" ? "text-accent" : "text-text-muted"
                      }`}
                    />
                    {f}
                  </li>
                ))}
              </motion.ul>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Pricing() {
  return (
    <section id="pricing" className="py-16 md:py-[7.5rem] bg-white">
      <Container>
        <Reveal>
          <div className="text-center mb-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-4">
              {"// Pricing"}
            </p>
            <h2 className="font-display text-[44px] md:text-[60px] leading-[1.02] tracking-[-0.025em] text-dark">
              Simple, transparent pricing
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <ComparisonToggle />
        </Reveal>

        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {plans.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 0.08}>
              <PricingCard plan={plan} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3}>
          <div className="mt-12 flex items-center justify-center">
            <div className="inline-flex items-center gap-3 h-12 px-6 bg-primary-tint border border-primary/20 rounded-full">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse-subtle" />
              <p className="font-mono text-[11px] md:text-[12px] text-primary-dark uppercase tracking-[0.14em] font-semibold">
                Founding client offer · 50% off setup · First 20 Sydney businesses
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
