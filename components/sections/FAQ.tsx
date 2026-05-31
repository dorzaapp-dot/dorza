"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Reveal, DORZA_EASE } from "@/components/motion/Reveal";
import EnquiryModal from "@/components/ui/EnquiryModal";
import { faqs } from "@/lib/data/faq";

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  const shouldReduce = useReducedMotion();
  const id = `faq-${index}`;

  return (
    <div className="border-b border-border last:border-0">
      <button
        id={`${id}-btn`}
        aria-expanded={open}
        aria-controls={`${id}-content`}
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
      >
        <span className="font-body font-semibold text-[17px] md:text-[18px] leading-snug tracking-[-0.005em] text-dark group-hover:text-primary transition-colors duration-300 ease-dorza">
          {q}
        </span>
        <span
          aria-hidden
          className={`relative shrink-0 h-5 w-5 text-text-muted transition-transform duration-300 ease-dorza ${
            open ? "rotate-45 text-primary" : "rotate-0"
          }`}
        >
          <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-current" />
          <span className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-current" />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${id}-content`}
            role="region"
            aria-labelledby={`${id}-btn`}
            key="content"
            initial={shouldReduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={shouldReduce ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={shouldReduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: DORZA_EASE }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-[15px] leading-[1.65] tracking-[-0.005em] text-text-secondary max-w-prose">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  return (
    <section className="py-16 md:py-[7.5rem] bg-warm">
      <Container>
        <Reveal>
          <div className="max-w-2xl mb-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-4">
              {"// Questions"}
            </p>
            <h2 className="font-display text-[44px] md:text-[60px] leading-[1.02] tracking-[-0.025em] text-dark">
              Answers to the real questions
            </h2>
          </div>
        </Reveal>

        <div className="max-w-2xl">
          <Reveal delay={0.1} stagger={0.06}>
            {faqs.map((item, i) => (
              <FAQItem key={i} q={item.q} a={item.a} index={i} />
            ))}
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <div className="max-w-2xl mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-8 border-t border-border">
            <p className="text-[15px] text-text-secondary leading-relaxed">
              Still have questions? Talk to a real Sydney human.
            </p>
            <button
              type="button"
              onClick={() => setEnquiryOpen(true)}
              className="inline-flex items-center justify-center h-11 px-5 bg-white border border-border text-dark font-semibold text-sm rounded-full hover:bg-surface hover:border-[#E5DFD6] transition-all duration-300 ease-dorza hover:-translate-y-px active:translate-y-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 self-start sm:self-auto"
            >
              Talk to us →
            </button>
          </div>
        </Reveal>
      </Container>

      <EnquiryModal open={enquiryOpen} onClose={() => setEnquiryOpen(false)} />
    </section>
  );
}
