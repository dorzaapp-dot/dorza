import type { ReactNode } from "react";

/**
 * Headline lines rise into place behind a mask, one after another. H1 only.
 * Pure CSS (`.d-line-rise` in globals.css) so the headline paints before any JavaScript loads.
 */
export function LineReveal({ lines, className }: { lines: ReactNode[]; className?: string }) {
  return (
    <span className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.1em]">
          <span className="d-line-rise block" style={{ animationDelay: `${100 + i * 90}ms` }}>
            {line}
          </span>
        </span>
      ))}
    </span>
  );
}
