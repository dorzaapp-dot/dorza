"use client";

import { motion, useReducedMotion, Variants } from "framer-motion";
import { Children, HTMLAttributes, isValidElement, ReactNode } from "react";

export const DORZA_EASE = [0.23, 1, 0.32, 1] as const;

interface RevealProps extends HTMLAttributes<HTMLDivElement> {
  delay?: number;
  duration?: number;
  y?: number;
  as?: "div" | "section" | "article" | "li" | "ul" | "header";
  stagger?: boolean | number;
}

export function Reveal({
  delay = 0,
  duration = 0.48,
  y = 20,
  as = "div",
  stagger = false,
  className,
  children,
  ...props
}: RevealProps) {
  const shouldReduce = useReducedMotion();
  const Tag = motion[as] as typeof motion.div;

  if (stagger) {
    const staggerDelay = typeof stagger === "number" ? stagger : 0.045;

    const container: Variants = {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: shouldReduce ? 0 : staggerDelay,
          delayChildren: delay,
        },
      },
    };

    const item: Variants = shouldReduce
      ? { hidden: {}, visible: {} }
      : {
          hidden: { opacity: 0, y },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration, ease: DORZA_EASE },
          },
        };

    const items = Children.toArray(children);

    return (
      <Tag
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className={className}
        {...(props as object)}
      >
        {items.map((child, i) => (
          <motion.div data-reveal="" key={isValidElement(child) && child.key != null ? child.key : i} variants={item}>
            {child as ReactNode}
          </motion.div>
        ))}
      </Tag>
    );
  }

  return (
    <Tag
      data-reveal=""
      initial={shouldReduce ? {} : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration,
        delay,
        ease: DORZA_EASE,
      }}
      className={className}
      {...(props as object)}
    >
      {children}
    </Tag>
  );
}
