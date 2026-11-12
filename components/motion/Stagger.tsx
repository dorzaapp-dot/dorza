"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

interface StaggerProps {
  delay?: number;
  staggerDelay?: number;
  className?: string;
  itemClassName?: string;
  children: ReactNode;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, ease: [0.23, 1, 0.32, 1] },
  },
};

const itemVariantsReduced = {
  hidden: {},
  visible: {},
};

export function Stagger({
  delay = 0,
  staggerDelay = 0.045,
  className,
  itemClassName,
  children,
}: StaggerProps) {
  const shouldReduce = useReducedMotion();

  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduce ? 0 : staggerDelay,
        delayChildren: delay,
      },
    },
  };

  const variants = shouldReduce ? itemVariantsReduced : itemVariants;
  const items = Array.isArray(children) ? children : [children];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className={className}
    >
      {items.map((child, i) => (
        <motion.div data-reveal="" key={i} variants={variants} className={itemClassName}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
