"use client";

import { ReactNode, useRef } from "react";
import {
  MotionValue,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { SlideReveal } from "@/components/motion/SlideReveal";

type Step = {
  num: string;
  title: string;
  desc: string;
  visual: ReactNode;
};

const steps: Step[] = [
  {
    num: "01",
    title: "Tell us about your business",
    desc: "Fill out a quick form — takes about 5 minutes. Tell us what you do, who your customers are, and what you want your digital presence to look like.",
    visual: <IntakeFormVisual />,
  },
  {
    num: "02",
    title: "We build everything",
    desc: "Our team builds your website, sets up Google Business, and prepares your social profiles. Done end-to-end, no back-and-forth.",
    visual: <BuildShowcaseVisual />,
  },
  {
    num: "03",
    title: "You review and approve",
    desc: "We send you a link to preview everything. You ask for changes, we make them quickly. When you're happy, you say go.",
    visual: <ReviewVisual />,
  },
  {
    num: "04",
    title: "Sit back, we run it",
    desc: "Posts go out on schedule. Enquiries get answered. Your Google ranking starts climbing. You get a monthly report. You just run your business.",
    visual: <GrowthVisual />,
  },
];

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 65%", "end 35%"],
  });

  return (
    <section id="how-it-works" className="scroll-mt-24 bg-white py-20 md:py-[7.5rem]">
      <Container>
        <Reveal>
          <div className="mb-16 md:mb-24 max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-3">
              {"// How it works"}
            </p>
            <h2 className="font-display text-[40px] md:text-[60px] leading-[1.02] tracking-[-0.025em] text-dark">
              From zero to live in four steps
            </h2>
          </div>
        </Reveal>

        <div ref={ref} className="relative">
          <Pipeline progress={scrollYProgress} />

          <div className="space-y-20 md:space-y-28">
            {steps.map((s, i) => (
              <StepBlock
                key={s.num}
                step={s}
                index={i}
                total={steps.length}
                progress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function Pipeline({ progress }: { progress: MotionValue<number> }) {
  const shouldReduce = useReducedMotion();
  const fill = useTransform(progress, [0, 1], ["0%", "100%"]);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-0 bottom-0 left-5 md:left-1/2 md:-translate-x-1/2"
    >
      <span className="absolute inset-y-0 left-0 w-px bg-border" />
      <motion.span
        style={{ height: shouldReduce ? "100%" : fill }}
        className="absolute top-0 left-0 w-px bg-gradient-to-b from-accent via-primary to-accent origin-top"
      />
    </div>
  );
}

function StepNode({
  num,
  index,
  total,
  progress,
}: {
  num: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const shouldReduce = useReducedMotion();
  const threshold = total <= 1 ? 0 : index / (total - 1);
  const scale = useTransform(
    progress,
    [Math.max(0, threshold - 0.06), threshold],
    [1, 1.15],
  );
  const bg = useTransform(
    progress,
    [Math.max(0, threshold - 0.06), threshold],
    ["#FFFFFF", "#D4845A"],
  );
  const ringOpacity = useTransform(
    progress,
    [Math.max(0, threshold - 0.06), threshold],
    [0, 0.18],
  );
  const numColor = useTransform(
    progress,
    [Math.max(0, threshold - 0.06), threshold],
    ["#888888", "#FFFFFF"],
  );

  return (
    <div className="relative flex items-center justify-center">
      <motion.span
        aria-hidden
        style={{ opacity: shouldReduce ? 0 : ringOpacity }}
        className="absolute w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary"
      />
      <motion.div
        style={{
          scale: shouldReduce ? 1 : scale,
          backgroundColor: shouldReduce ? "#D4845A" : bg,
        }}
        className="relative w-9 h-9 md:w-11 md:h-11 rounded-full border-2 border-border flex items-center justify-center shadow-soft"
      >
        <motion.span
          style={{ color: shouldReduce ? "#FFFFFF" : numColor }}
          className="font-mono text-[11px] md:text-[12px] font-semibold tabular-nums"
        >
          {num}
        </motion.span>
      </motion.div>
    </div>
  );
}

function StepBlock({
  step,
  index,
  total,
  progress,
}: {
  step: Step;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const isOdd = index % 2 === 1;
  const slideFrom = isOdd ? "right" : "left";

  return (
    <div className="relative">
      {/* Mobile: pipeline node sits at left:5, content offset to right */}
      <div className="md:hidden">
        <div className="absolute left-5 top-6 -translate-x-1/2">
          <StepNode
            num={step.num}
            index={index}
            total={total}
            progress={progress}
          />
        </div>
        <div className="pl-14">
          <StepContent step={step} index={index} totalSteps={total} />
          <div className="mt-6">{step.visual}</div>
        </div>
      </div>

      {/* Desktop: alternating zig-zag with center node */}
      <div className="hidden md:grid grid-cols-12 gap-6 items-center">
        <SlideReveal
          from={slideFrom}
          className={`col-span-5 ${isOdd ? "col-start-8 row-start-1" : "row-start-1"}`}
        >
          <StepContent
            step={step}
            index={index}
            totalSteps={total}
            align={isOdd ? "left" : "right"}
          />
        </SlideReveal>

        <div className="col-span-2 col-start-6 row-start-1 flex justify-center">
          <StepNode
            num={step.num}
            index={index}
            total={total}
            progress={progress}
          />
        </div>

        <SlideReveal
          from={isOdd ? "left" : "right"}
          delay={0.1}
          className={`col-span-5 ${isOdd ? "col-start-1 row-start-1" : "col-start-8 row-start-1"}`}
        >
          {step.visual}
        </SlideReveal>
      </div>
    </div>
  );
}

function StepContent({
  step,
  index,
  totalSteps,
  align = "left",
}: {
  step: Step;
  index: number;
  totalSteps: number;
  align?: "left" | "right";
}) {
  return (
    <div className={align === "right" ? "md:text-right" : ""}>
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-3">
        Step {index + 1} of {totalSteps}
      </p>
      <h3 className="font-body font-semibold text-[22px] md:text-[30px] leading-[1.15] tracking-[-0.02em] text-dark mb-4">
        {step.title}
      </h3>
      <p
        className={`text-[15px] md:text-[17px] leading-relaxed tracking-[-0.01em] text-text-secondary max-w-md ${
          align === "right" ? "md:ml-auto md:text-left" : ""
        }`}
      >
        {step.desc}
      </p>
    </div>
  );
}

/* ---------- Visuals ---------- */

function VisualCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative rounded-card border border-border bg-white shadow-soft hover:shadow-medium hover-glow transition-all duration-500 ease-dorza overflow-hidden ${className}`}
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
      />
      {children}
    </div>
  );
}

function IntakeFormVisual() {
  return (
    <VisualCard className="p-5 md:p-6">
      <div className="flex items-center justify-between mb-5">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
          New project
        </span>
        <span className="font-mono text-[10px] text-text-muted tabular-nums">
          1 / 3
        </span>
      </div>
      <div className="space-y-4">
        <FormField label="Business name" value="Parramatta Beans" filled />
        <FormField label="Your suburb" value="Parramatta, NSW" filled />
        <FormField label="What you do" value="" active />
      </div>
      <div className="flex gap-2 mt-6">
        <div className="h-9 flex-1 rounded-full bg-surface border border-border" />
        <div className="h-9 flex-[1.4] rounded-full bg-primary text-white text-[12px] font-semibold flex items-center justify-center shadow-[0_4px_12px_rgba(212,132,90,0.25)]">
          Continue →
        </div>
      </div>
    </VisualCard>
  );
}

function FormField({
  label,
  value,
  filled,
  active,
}: {
  label: string;
  value: string;
  filled?: boolean;
  active?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] font-medium text-text-secondary">
          {label}
        </span>
        {filled && (
          <span className="text-[10px] text-accent font-mono">✓ saved</span>
        )}
      </div>
      <div
        className={`h-9 rounded-full border px-4 flex items-center text-[13px] ${
          active
            ? "border-primary bg-primary-tint text-dark"
            : filled
              ? "border-border bg-white text-dark"
              : "border-border bg-white text-text-muted"
        }`}
      >
        {value || (active && <span className="inline-block w-px h-4 bg-primary animate-pulse" />)}
      </div>
    </div>
  );
}

function BuildShowcaseVisual() {
  const mocks = [
    { src: "/images/mockups/cafe-hero.jpg", label: "Café", done: true },
    { src: "/images/mockups/salon-hero.jpg", label: "Salon", done: true },
    { src: "/images/mockups/tradie-hero.jpg", label: "Tradie", done: false },
  ];
  return (
    <VisualCard className="p-5 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
          Building
        </span>
        <span className="font-mono text-[10px] text-text-muted">
          End-to-end
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        {mocks.map((m, i) => (
          <div
            key={m.label}
            className="relative rounded-md overflow-hidden border border-border bg-surface aspect-[4/5]"
          >
            <img
              src={m.src}
              alt={`${m.label} site preview`}
              loading="lazy"
              decoding="async"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                m.done ? "opacity-100" : "opacity-40"
              }`}
              style={{
                transform: `translateY(${i * 2}px)`,
              }}
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent p-2">
              <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/95">
                {m.label}
              </span>
            </div>
            {!m.done && (
              <div className="absolute top-1.5 right-1.5 flex items-center gap-1 bg-white/95 rounded-full px-1.5 py-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="font-mono text-[8px] text-dark font-semibold">
                  WIP
                </span>
              </div>
            )}
            {m.done && (
              <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-accent flex items-center justify-center shadow">
                <span className="text-white text-[8px]">✓</span>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2.5">
        {["Website", "Google Business", "Socials"].map((label, i) => (
          <div
            key={label}
            className="text-center rounded-md bg-surface border border-border py-1.5"
          >
            <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-text-secondary">
              {label}
            </span>
            <div
              className={`h-1 rounded-full mt-1 mx-2 ${
                i < 2 ? "bg-accent" : "bg-primary animate-pulse"
              }`}
            />
          </div>
        ))}
      </div>
    </VisualCard>
  );
}

function ReviewVisual() {
  return (
    <VisualCard className="p-0">
      <div className="bg-surface border-b border-border px-3 py-2 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#FF5F57]" />
        <span className="w-2 h-2 rounded-full bg-[#FEBC2E]" />
        <span className="w-2 h-2 rounded-full bg-[#28C840]" />
        <div className="ml-3 flex-1 h-5 rounded-full bg-white border border-border flex items-center px-3">
          <span className="font-mono text-[9px] text-text-muted truncate">
            preview.dorza.au/parramatta-beans
          </span>
        </div>
      </div>
      <div className="relative">
        <img
          src="/images/mockups/cafe-hero.jpg"
          alt="Café site preview"
          loading="lazy"
          decoding="async"
          className="w-full h-44 md:h-48 object-cover"
        />
        <div className="absolute top-2.5 left-2.5 bg-accent/95 text-white rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em]">
          Preview
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-start gap-2">
          <div className="w-6 h-6 rounded-full bg-primary-tint flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-primary text-[10px] font-bold">D</span>
          </div>
          <div className="flex-1">
            <p className="text-[12px] text-dark leading-snug">
              Looks great — could we make the hero a touch warmer?
            </p>
            <span className="font-mono text-[9px] text-text-muted">
              You · 2m ago
            </span>
          </div>
        </div>
        <div className="flex gap-2 pt-1">
          <div className="h-9 flex-1 rounded-full bg-surface border border-border text-text-secondary text-[12px] font-medium flex items-center justify-center">
            Request changes
          </div>
          <div className="h-9 flex-1 rounded-full bg-primary text-white text-[12px] font-semibold flex items-center justify-center shadow-[0_4px_12px_rgba(212,132,90,0.25)]">
            Approve & launch
          </div>
        </div>
      </div>
    </VisualCard>
  );
}

function GrowthVisual() {
  const months = [
    { label: "Dec", val: 38 },
    { label: "Jan", val: 56 },
    { label: "Feb", val: 92 },
    { label: "Mar", val: 124 },
    { label: "Apr", val: 154 },
    { label: "May", val: 218, current: true },
  ];
  const max = Math.max(...months.map((m) => m.val));

  return (
    <VisualCard className="p-5 md:p-6">
      {/* Header — label + trending pill */}
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
          {"// Enquiries"}
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-tint border border-accent/20">
          <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden>
            <path
              d="M2 7 L5 4 L8 7"
              stroke="#4A6B4E"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-accent-dark">
            +42% vs last
          </span>
        </span>
      </div>

      {/* Big number */}
      <div className="flex items-baseline gap-2 mb-5">
        <span className="font-display text-[44px] md:text-[52px] text-dark leading-none tracking-[-0.025em] tabular-nums">
          218
        </span>
        <span className="font-mono text-[11px] text-text-muted">this month</span>
      </div>

      {/* Bar chart */}
      <div className="flex items-end gap-2 h-24 md:h-32">
        {months.map((m) => {
          const heightPct = (m.val / max) * 100;
          return (
            <div
              key={m.label}
              className="flex-1 flex flex-col items-center gap-1.5 h-full"
            >
              <div className="flex-1 w-full flex flex-col justify-end">
                <div
                  className={`w-full rounded-t-sm transition-all duration-700 ease-dorza ${
                    m.current ? "bg-accent" : "bg-accent-tint"
                  }`}
                  style={{ height: `${heightPct}%` }}
                  aria-label={`${m.label}: ${m.val}`}
                />
              </div>
              <span
                className={`font-mono text-[10px] tabular-nums ${
                  m.current
                    ? "text-accent-dark font-semibold"
                    : "text-text-muted"
                }`}
              >
                {m.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-5 pt-3 border-t border-border flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-muted">
          Auto-managed
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-muted">
          Next report · Fri
        </span>
      </div>
    </VisualCard>
  );
}
