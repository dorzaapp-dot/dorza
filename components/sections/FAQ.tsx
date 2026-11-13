"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Reveal, DORZA_EASE } from "@/components/motion/Reveal";
import EnquiryModal from "@/components/ui/EnquiryModal";
import { buttonClasses } from "@/components/ui/buttonClasses";
import { faqs } from "@/lib/data/faq";

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  const shouldReduce = useReducedMotion();
  const id = `faq-${index}`;

  return (
    <div className="border-b border-rule-soft">
      <button
        id={`${id}-btn`}
        aria-expanded={open}
        aria-controls={`${id}-content`}
        onClick={() => setOpen((o) => !o)}
        className="group flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="font-body text-[17px] font-semibold leading-snug tracking-[-0.005em] text-ink transition-colors duration-fast ease-dorza group-hover:text-pine md:text-[18px]">
          {q}
        </span>
        <span
          aria-hidden
          className={`relative h-4 w-4 shrink-0 transition-transform duration-base ease-dorza ${
            open ? "rotate-45 text-claret" : "rotate-0 text-pine"
          }`}
        >
          <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current" />
          <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-current" />
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
            transition={{ duration: 0.28, ease: DORZA_EASE }}
            className="overflow-hidden"
          >
            <p className="d-body pb-5">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  return (
    <section className="bg-chalk py-section-tight md:py-section">
      <Container>
        <div className="grid gap-10 md:grid-cols-12 md:gap-x-8">
          <Reveal className="md:col-span-4">
            <h2 className="d-display d-display-md">Fair questions.</h2>
          </Reveal>

          <div className="md:col-span-7 md:col-start-6">
            <Reveal delay={0.09} stagger={0.045} className="border-t border-rule-soft">
              {faqs.map((item, i) => (
                <FAQItem key={item.q} q={item.q} a={item.a} index={i} />
              ))}
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="d-body">Still have a question? Ask us directly.</p>
                <button
                  type="button"
                  onClick={() => setEnquiryOpen(true)}
                  className={buttonClasses("secondary", "default", "self-start sm:self-auto")}
                >
                  Talk to us
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>

      <EnquiryModal open={enquiryOpen} onClose={() => setEnquiryOpen(false)} />
    </section>
  );
}
