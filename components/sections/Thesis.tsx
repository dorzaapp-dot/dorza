"use client";

import { useInView } from "framer-motion";
import { useRef } from "react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { useCountUp } from "@/components/motion/useCountUp";

type Stat = {
  prefix?: string;
  suffix?: string;
  target: number;
  decimals?: number;
  label: string;
};

const stats: Stat[] = [
  { prefix: "$", target: 0, label: "Hidden fees · No lock-in" },
  { suffix: "%", target: 85, label: "Cheaper than a traditional agency" },
  { prefix: "$", target: 199, label: "Starting from, per month" },
];

export default function Thesis() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-16 md:py-[7.5rem] bg-warm">
      <Container>
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-8">
            {"// Why dorza"}
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <p className="font-display italic text-[36px] md:text-[52px] lg:text-[64px] leading-[1.05] tracking-[-0.025em] text-dark max-w-5xl">
            An end-to-end digital agency, designed for how small businesses
            actually work.
            <span className="text-text-muted">
              {" "}
              Quick to launch. Simple to run. Priced to make sense.
            </span>
          </p>
        </Reveal>

        <div
          ref={ref}
          className="mt-14 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
        >
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={0.1 + i * 0.08}>
              <StatBlock stat={s} trigger={inView} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

function StatBlock({ stat, trigger }: { stat: Stat; trigger: boolean }) {
  const value = useCountUp(stat.target, trigger, { duration: 1.6 });
  const display = stat.decimals
    ? value.toFixed(stat.decimals)
    : Math.round(value).toLocaleString();

  return (
    <div className="border-t border-border pt-5">
      <p className="font-body font-bold text-[44px] md:text-[56px] leading-none tracking-[-0.04em] text-dark tabular-nums">
        {stat.prefix}
        {display}
        {stat.suffix}
      </p>
      <p className="mt-3 text-[15px] text-text-secondary leading-relaxed max-w-xs">
        {stat.label}
      </p>
    </div>
  );
}
