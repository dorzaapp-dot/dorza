import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** The house list: a mono plus sign, hairline rules, no tick icons. */
export function PlusList({ items, className }: { items: ReactNode[]; className?: string }) {
  return (
    <ul className={cn("m-0 list-none p-0", className)}>
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 border-t border-rule-soft py-3 last:border-b">
          <span aria-hidden className="font-mono text-[13px] leading-[1.6] text-pine">+</span>
          <span className="d-body">{item}</span>
        </li>
      ))}
    </ul>
  );
}
