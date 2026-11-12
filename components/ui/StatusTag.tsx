import { cn } from "@/lib/cn";
import type { ServiceStatus } from "@/lib/data/pillars";

/** "Live" or "Ask us". The only two things Dorza says about a service. */
export function StatusTag({ status }: { status: ServiceStatus }) {
  const live = status === "live";
  return (
    <span
      className={cn(
        "inline-flex h-[22px] shrink-0 items-center rounded-chip px-2 font-mono text-[11px] font-medium uppercase tracking-[0.14em]",
        live ? "bg-haze text-forest" : "border border-rule text-ink-soft"
      )}
    >
      {live ? "Live" : "Ask us"}
    </span>
  );
}
