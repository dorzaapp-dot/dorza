/**
 * Publication state for case studies, and nothing else.
 *
 * Client components (Nav) import this file, so it ships in public JS. Keep
 * case-study content in lib/data/work.ts, which only server components import.
 * To publish a study: set it to true here, after the owner's written OK
 * (see docs/proof-sources.md).
 */
export const WORK_PUBLISHED: Record<string, boolean> = {
  "active-rise-health": false,
  drivable: false,
};

/** Drafts show in `pnpm dev` and wherever NEXT_PUBLIC_SHOW_DRAFTS=1 (set it on Vercel Preview). */
export const SHOW_DRAFTS =
  process.env.NEXT_PUBLIC_SHOW_DRAFTS === "1" || process.env.NODE_ENV === "development";

/** True when the Work index has anything to show. */
export function hasPublicWork(showDrafts: boolean = SHOW_DRAFTS): boolean {
  return showDrafts || Object.values(WORK_PUBLISHED).some(Boolean);
}
