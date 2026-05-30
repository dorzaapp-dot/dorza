"use client";

import { motion, useScroll, useReducedMotion } from "framer-motion";

export default function ScrollProgress() {
  const shouldReduce = useReducedMotion();
  const { scrollYProgress } = useScroll();

  if (shouldReduce) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-primary origin-left z-[51]"
      style={{ scaleX: scrollYProgress }}
    />
  );
}
