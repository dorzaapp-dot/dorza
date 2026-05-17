"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import HeroBrowserMockup from "./HeroBrowserMockup";
import { DORZA_EASE } from "@/components/motion/Reveal";

const headline = "Sydney's easiest web and growth service for small business";
const words = headline.split(" ");

export default function Hero() {
  const shouldReduce = useReducedMotion();

  const fadeUp = (delay: number) => ({
    initial: shouldReduce ? {} : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: DORZA_EASE },
  });

  const wordContainer = {
    hidden: {},
    visible: {
      transition: { staggerChildren: shouldReduce ? 0 : 0.045, delayChildren: 0.15 },
    },
  };

  const wordVariant = {
    hidden: shouldReduce ? {} : { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: DORZA_EASE },
    },
  };

  return (
    <section className="pt-28 pb-16 md:pt-36 md:pb-24 bg-white overflow-hidden">
      <Container>
        <div className="grid md:grid-cols-5 gap-12 lg:gap-16 items-center">
          {/* Left — 60% */}
          <div className="md:col-span-3">
            <motion.p
              {...fadeUp(0)}
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-6"
            >
              Live in 24 hours · No lock-in · Built for cafes, tradies, salons
            </motion.p>

            <h1 className="font-display text-[44px] sm:text-[52px] md:text-[76px] lg:text-[88px] leading-[1.02] tracking-[-0.015em] sm:tracking-[-0.025em] md:tracking-[-0.03em] text-dark overflow-hidden">
              <motion.span
                variants={wordContainer}
                initial="hidden"
                animate="visible"
                className="flex flex-wrap gap-x-[0.22em] gap-y-1"
                aria-label={headline}
              >
                {words.map((word, i) => (
                  <motion.span key={i} variants={wordVariant} className="inline-block">
                    {word}
                  </motion.span>
                ))}
              </motion.span>
            </h1>

            <motion.div {...fadeUp(0.5)}>
              <p className="mt-7 text-[17px] md:text-[18px] leading-relaxed tracking-[-0.01em] text-text-secondary max-w-xs sm:max-w-md">
                We build your website, run your social media, and get you found
                on Google — all from $199/month, no contracts.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <a
                  href="/onboard"
                  className="inline-flex items-center justify-center h-12 px-6 bg-primary hover:bg-primary-dark text-white font-semibold text-sm rounded-full transition-all duration-300 ease-dorza hover:-translate-y-px hover:shadow-medium active:translate-y-0 group focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  Get your free consultation{" "}
                  <ArrowRight
                    size={16}
                    className="ml-2 transition-transform duration-300 ease-dorza group-hover:translate-x-1 arrow"
                  />
                </a>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center h-12 px-6 bg-white border border-border text-dark font-semibold text-sm rounded-full hover:bg-surface hover:border-[#E5DFD6] transition-all duration-300 ease-dorza hover:-translate-y-px active:translate-y-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  See how it works
                </a>
              </div>

              <p className="mt-6 text-[13px] text-text-secondary leading-relaxed max-w-md">
                Built by Mahir, a Sydneysider with 10 years in digital — not an offshore agency.
              </p>
              <p className="mt-3 font-mono text-[11px] text-text-muted uppercase tracking-[0.16em]">
                No lock-in contracts · Built for Sydney
              </p>
            </motion.div>
          </div>

          {/* Right — 40% on desktop, full width below text on mobile */}
          <div className="md:col-span-2">
            <HeroBrowserMockup />
          </div>
        </div>
      </Container>
    </section>
  );
}
