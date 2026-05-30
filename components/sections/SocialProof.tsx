"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Star } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal, DORZA_EASE } from "@/components/motion/Reveal";

type Testimonial = {
  quote: string;
  name: string;
  business: string;
  type: string;
  stars: number;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "We went from zero online presence to getting 3-4 enquiries a week through our website. Dorza built it in two days — I didn't have to think about a thing.",
    name: "Sam T.",
    business: "Sydney Trade Co.",
    type: "Tradie",
    stars: 5,
  },
  {
    quote:
      "Our Instagram used to be dead. Now we've got consistent posts, our followers doubled, and people actually mention they saw us online before walking in.",
    name: "Mia L.",
    business: "Cremorne Coffee Co.",
    type: "Cafe",
    stars: 5,
  },
  {
    quote:
      "I was paying $3,000 a month to an agency that never answered my calls. Dorza costs a fraction and I've never waited more than a day for a reply.",
    name: "Jordan K.",
    business: "Bondi Hair Studio",
    type: "Salon",
    stars: 5,
  },
];

const CYCLE_MS = 5000;

function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className="fill-primary text-primary"
        />
      ))}
    </div>
  );
}

export default function SocialProof() {
  const shouldReduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (shouldReduce) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, [shouldReduce]);

  const t = testimonials[index];

  return (
    <section className="py-16 md:py-[7.5rem] bg-white">
      <Container>
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-4">
            {"// What our clients say"}
          </p>
        </Reveal>

        <div className="max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={shouldReduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: DORZA_EASE }}
            >
              <blockquote>
                <p className="font-display italic text-[28px] sm:text-[36px] md:text-[44px] leading-[1.1] tracking-[-0.02em] text-dark">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </blockquote>

              <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-tint flex items-center justify-center">
                    <span className="font-body font-bold text-[14px] text-primary">
                      {t.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-body font-semibold text-[15px] text-dark leading-tight">
                      {t.name}
                    </p>
                    <p className="text-[13px] text-text-secondary">
                      {t.business}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:ml-auto">
                  <Stars count={t.stars} />
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-text-muted">
                    {t.type}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots navigation */}
          <div className="flex items-center gap-2 mt-10">
            {testimonials.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Testimonial ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-500 ease-dorza ${
                  i === index
                    ? "w-8 bg-primary"
                    : "w-2 bg-border hover:bg-border-strong"
                }`}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
