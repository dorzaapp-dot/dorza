import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface HeroRiseProps extends HTMLAttributes<HTMLDivElement> {
  /** Seconds, to match Reveal's prop. */
  delay?: number;
}

/**
 * Reveal for a page's opening section. Pure CSS (`.d-rise` in globals.css): the content is visible
 * in the first paint and settles 16px upward, so the largest paint never waits for framer-motion.
 * Use Reveal for everything below the opening section.
 */
export function HeroRise({ delay = 0, className, style, children, ...props }: HeroRiseProps) {
  return (
    <div className={cn("d-rise", className)} style={{ animationDelay: `${Math.round(delay * 1000)}ms`, ...style }} {...props}>
      {children}
    </div>
  );
}
