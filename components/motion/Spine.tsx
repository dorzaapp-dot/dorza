"use client";

import { motion, useReducedMotion, useScroll } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/** The spine sits 11px in on phones and a quarter of the way across from 768px up. */
const SPINE_X = "left-[11px] md:left-1/4";

/**
 * The homepage timeline. A hairline runs the full height; a pine line draws
 * over it as the section scrolls through view. With reduced motion the pine
 * line is fully drawn.
 */
export function Spine({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.75", "end 0.55"] });

  return (
    <div ref={ref} className={cn("relative", className)}>
      <span aria-hidden className={cn("absolute inset-y-0 w-px bg-rule-soft", SPINE_X)} />
      <motion.span
        aria-hidden
        className={cn("absolute inset-y-0 w-px origin-top bg-pine", SPINE_X)}
        style={{ scaleY: reduce ? 1 : scrollYProgress }}
      />
      {children}
    </div>
  );
}

/** One stage on the spine: a mono marker, a tick that crosses the line, then the content. */
export function SpineStage({
  marker,
  children,
  className,
}: {
  marker: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative grid grid-cols-1 gap-y-4 py-14 pl-10 md:grid-cols-12 md:gap-x-8 md:py-24 md:pl-0",
        className
      )}
    >
      <div className="relative md:col-span-3 md:pr-3 md:text-right">
        <span aria-hidden className="absolute -left-10 top-[0.45em] h-px w-6 bg-pine md:left-full md:w-8" />
        <p className="d-label">{marker}</p>
      </div>
      <div className="md:col-span-9 md:pl-8">{children}</div>
    </div>
  );
}
