"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { DORZA_EASE } from "./Reveal";

/** Headline lines rise into place behind a mask, one after another. H1 only. */
export function LineReveal({ lines, className }: { lines: ReactNode[]; className?: string }) {
  const reduce = useReducedMotion();

  return (
    <span className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.1em]">
          <motion.span
            data-reveal=""
            className="block"
            initial={reduce ? false : { y: "105%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 + i * 0.09, ease: DORZA_EASE }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
