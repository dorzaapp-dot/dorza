"use client";

import { ReactNode } from "react";
import { Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { SlideReveal } from "@/components/motion/SlideReveal";

const MOCKUP_DIR = "/images/mockups";

const browserCardImgs = [
  `${MOCKUP_DIR}/cafe-1.jpg`,
  `${MOCKUP_DIR}/cafe-3.jpg`,
  `${MOCKUP_DIR}/cafe-hero.jpg`,
];

const socialPostImgs = [
  `${MOCKUP_DIR}/cafe-1.jpg`,
  `${MOCKUP_DIR}/cafe-2.jpg`,
  `${MOCKUP_DIR}/cafe-hero.jpg`,
];

function BrowserMock() {
  return (
    <div className="rounded-card border border-border overflow-hidden bg-white shadow-soft">
      <div className="bg-surface border-b border-border px-3 py-2.5 flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
        <div className="flex-1 mx-3 h-5 bg-white border border-border rounded-full" />
      </div>
      <div className="p-6 space-y-3">
        <div className="h-2 w-20 rounded-full bg-primary/40" />
        <div className="space-y-1.5">
          <div className="h-6 bg-dark rounded-md w-11/12" />
          <div className="h-6 bg-dark rounded-md w-3/4" />
        </div>
        <div className="space-y-1.5 pt-1">
          <div className="h-2 bg-border rounded-full w-full" />
          <div className="h-2 bg-border rounded-full w-5/6" />
          <div className="h-2 bg-border rounded-full w-4/5" />
        </div>
        <div className="flex gap-2 pt-2">
          <div className="h-9 w-28 bg-primary rounded-full" />
          <div className="h-9 w-24 bg-white border border-border rounded-full" />
        </div>
        <div className="grid grid-cols-3 gap-2 pt-3">
          {browserCardImgs.map((src, i) => (
            <div
              key={i}
              className="aspect-[4/3] rounded-[10px] overflow-hidden bg-surface"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SocialMock() {
  const posts = [
    { src: socialPostImgs[0], caption: "Latte art Friday ☕" },
    { src: socialPostImgs[1], caption: "Behind the scenes" },
    { src: socialPostImgs[2], caption: "New menu drop" },
  ];
  return (
    <div className="mx-auto w-full max-w-[280px] rounded-[36px] bg-dark p-2 shadow-card">
      <div className="relative rounded-[28px] bg-white pt-6 pb-4 px-3">
        <span
          aria-hidden
          className="absolute top-2.5 left-1/2 -translate-x-1/2 w-14 h-1 bg-dark/15 rounded-full"
        />
        <div className="space-y-2.5 mt-1">
          {posts.map((p, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-surface border border-border rounded-card p-2.5"
            >
              <div className="w-12 h-12 rounded-md overflow-hidden shrink-0 bg-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.src}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex-1 space-y-1.5 min-w-0">
                <div className="h-2 bg-border rounded-full w-1/2" />
                <p className="text-[12px] text-text-secondary truncate">
                  {p.caption}
                </p>
              </div>
              <div className="shrink-0 w-6 h-6 rounded-full bg-accent-tint text-accent-dark flex items-center justify-center font-semibold text-[11px]">
                ↑
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ResearchMock() {
  const lines: { text: string; head?: boolean }[] = [
    { text: "# Competitor Analysis", head: true },
    { text: "→ Smith Plumbing: 23 reviews, no site" },
    { text: "→ City Trade Co: weak social, 3.8★" },
    { text: "→ Gap: no one doing video content" },
    { text: "" },
    { text: "# Opportunities", head: true },
    { text: "→ Google Local ranking #1–3" },
    { text: "→ Facebook Marketplace leads" },
    { text: "→ Instagram before/after content" },
  ];
  return (
    <div className="rounded-card border border-white/10 bg-dark p-6 shadow-medium">
      <div className="flex items-center gap-1.5 mb-4">
        <span className="w-2 h-2 rounded-full bg-white/20" />
        <span className="w-2 h-2 rounded-full bg-white/20" />
        <span className="w-2 h-2 rounded-full bg-white/20" />
      </div>
      <div className="font-mono text-[12px] leading-[1.85] text-white/70">
        {lines.map((line, i) => (
          <div
            key={i}
            className={line.head ? "text-accent-light font-semibold" : ""}
          >
            {line.text || <span className="opacity-0">.</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatMock() {
  const messages = [
    { from: "owner", text: "Can you reschedule next week's posts to Monday?" },
    { from: "agent", text: "Done. Moved 3 posts to Mon 11am. Want to preview?" },
    { from: "owner", text: "Yes please" },
    { from: "agent", text: "Here's your Mon schedule ✓" },
  ];
  return (
    <div className="rounded-card border border-border bg-white p-5 shadow-soft space-y-2.5">
      {messages.map((m, i) => (
        <div
          key={i}
          className={`flex ${m.from === "owner" ? "justify-end" : "justify-start"}`}
        >
          <span
            className={`text-[13px] px-3.5 py-2 rounded-2xl max-w-[85%] leading-snug ${
              m.from === "owner"
                ? "bg-primary text-white rounded-br-sm"
                : "bg-surface text-dark rounded-bl-sm"
            }`}
          >
            {m.text}
          </span>
        </div>
      ))}
    </div>
  );
}

type Service = {
  num: string;
  title: string;
  description: string;
  features: string[];
  badge?: { label: string; tone: "accent" | "primary" };
  visual: ReactNode;
};

const services: Service[] = [
  {
    num: "01",
    title: "Custom websites, built for you",
    description:
      "Built mobile-first, SEO-ready, and crafted around your brand — not a template. Hand-coded by a real team that gets it done fast.",
    features: [
      "Custom-designed, mobile-first",
      "Google Business profile setup",
      "SEO-ready from day one",
      "Hand-coded by a real team",
    ],
    badge: { label: "Most popular", tone: "primary" },
    visual: <BrowserMock />,
  },
  {
    num: "02",
    title: "Social media on autopilot",
    description:
      "Your Instagram and Facebook, posted on schedule, on-brand, with content that actually sounds like you.",
    features: [
      "Facebook, Instagram & more",
      "Done-for-you content calendar",
      "Automated posting",
      "Performance tracking",
    ],
    visual: <SocialMock />,
  },
  {
    num: "03",
    title: "Research & strategy",
    description:
      "We map your local competition, find the gaps, and turn it into a tailored marketing plan you can actually act on.",
    features: [
      "Competitor analysis",
      "Market opportunity mapping",
      "Tailored marketing plan",
      "Ongoing trend monitoring",
    ],
    visual: <ResearchMock />,
  },
  {
    num: "04",
    title: "An AI that answers missed calls and enquiries",
    description:
      "On-tap marketing help that learns your business — drafts your posts, replies to enquiries, and never lets a lead go cold.",
    features: [
      "On-demand marketing help",
      "Content creation & copywriting",
      "Campaign management",
      "Always learning your business",
    ],
    badge: { label: "New", tone: "accent" },
    visual: <ChatMock />,
  },
];

export default function Services() {
  return (
    <section id="services" className="scroll-mt-24 py-16 md:py-[7.5rem] bg-warm">
      <Container>
        <Reveal>
          <div className="max-w-2xl mb-16 md:mb-20">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-4">
              {"// What we do"}
            </p>
            <h2 className="font-display text-[44px] md:text-[64px] leading-[1.02] tracking-[-0.025em] text-dark">
              Everything you need, done for you
            </h2>
            <p className="mt-5 text-[17px] md:text-[18px] leading-relaxed tracking-[-0.01em] text-text-secondary">
              One agency. Website, social, Google, and an AI assistant — all
              running while you get on with your work.
            </p>
          </div>
        </Reveal>

        <div className="space-y-12 md:space-y-0 md:divide-y md:divide-border/40">
          {services.map((service, i) => (
            <ServiceRow key={service.num} service={service} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function ServiceRow({ service, index }: { service: Service; index: number }) {
  const mockOnLeft = index % 2 === 0;
  const isFirst = index === 0;
  // Visual order: when mockup is on the right, text content sits on the left.
  return (
    <div className={isFirst ? "md:py-20 lg:py-24" : "md:py-16 lg:py-20"}>
      <div className="grid md:grid-cols-12 gap-8 lg:gap-14 items-center">
        <SlideReveal
          from={mockOnLeft ? "left" : "right"}
          className={`md:col-span-6 ${
            mockOnLeft ? "md:order-1" : "md:order-2"
          }`}
        >
          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-4 md:-inset-6 rounded-[32px] opacity-40 blur-2xl pointer-events-none"
              style={{
                background:
                  index === 0
                    ? "radial-gradient(circle, rgba(212,132,90,0.15), transparent 70%)"
                    : index === 1
                      ? "radial-gradient(circle, rgba(107,143,113,0.12), transparent 70%)"
                      : index === 2
                        ? "radial-gradient(circle, rgba(26,26,46,0.08), transparent 70%)"
                        : "radial-gradient(circle, rgba(212,132,90,0.10), transparent 70%)",
              }}
            />
            <div className="relative">{service.visual}</div>
          </div>
        </SlideReveal>

        <Reveal
          stagger={0.1}
          className={`md:col-span-6 ${
            mockOnLeft ? "md:order-2" : "md:order-1"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
              {service.num}
            </span>
            {service.badge && (
              <span
                className={`inline-flex items-center h-6 px-3 rounded-full font-mono text-[10px] uppercase tracking-[0.16em] ${
                  service.badge.tone === "accent"
                    ? "bg-accent-light text-accent-dark"
                    : "bg-primary text-white"
                }`}
              >
                {service.badge.label}
              </span>
            )}
          </div>

          <h3
            className={`mt-3 font-body font-semibold leading-[1.15] tracking-[-0.02em] text-dark ${
              isFirst
                ? "text-[28px] md:text-[36px]"
                : "text-[26px] md:text-[32px]"
            }`}
          >
            {service.title}
          </h3>

          <p className="mt-4 text-[16px] md:text-[17px] leading-relaxed tracking-[-0.005em] text-text-secondary max-w-md">
            {service.description}
          </p>

          <ul className="mt-6 grid sm:grid-cols-2 gap-x-6 gap-y-2.5 max-w-md">
            {service.features.map((f) => (
              <li
                key={f}
                className="flex items-start gap-2 text-[14px] text-text-secondary"
              >
                <Check size={15} className="text-accent mt-0.5 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </div>
  );
}
