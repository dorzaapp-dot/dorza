"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Reveal, DORZA_EASE } from "@/components/motion/Reveal";

const faqs = [
  {
    q: "How much does it cost?",
    a: "Our Starter plan is $199/month plus a one-time $499 setup fee. Growth is $349/month + $799 setup. Pro is $549/month + $1,299 setup. Right now, founding clients get 50% off setup — so Starter setup is just $249. No lock-in contracts.",
  },
  {
    q: "I've been burned by agencies before — why is this different?",
    a: "We get it. Most agencies overpromise, underdeliver, and go quiet. With Dorza, you see a real working website — not a proposal, not a mood board. If you're not happy, you don't pay for the next month. Simple.",
  },
  {
    q: "I don't have time for this.",
    a: "Good — you don't need to make time. We handle everything. You fill out a short form, review what we build, and say go. After that, we run it. You'll hear from us once a month with a performance report.",
  },
  {
    q: "What if I want to cancel?",
    a: "Cancel any time, no questions asked. We don't do lock-in contracts. If you cancel, your website stays live for the rest of the month you've paid for. We'll hand over everything we've built — you own it.",
  },
  {
    q: "Can I just get one piece — say, only social media?",
    a: "Yes. Our Starter plan is website + Google Business only. If you only want social media management, talk to us — we can put together a custom package. We're flexible.",
  },
];

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
        <span className="font-body font-semibold text-[16px] md:text-[17px] leading-snug tracking-[-0.005em] text-dark group-hover:text-primary transition-colors duration-300 ease-dorza">
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
      </Container>
    </section>
  );
}
