import { AREAS } from "@/lib/data/areas";
import { INDUSTRIES } from "@/lib/data/industries";
import { PILLARS } from "@/lib/data/pillars";
import { SERVICES } from "@/lib/data/services";
import { visibleCaseStudies } from "@/lib/data/work";

/** Every public, indexable route. Drafts are excluded unless asked for. */
export function allRoutes(showDrafts = false): string[] {
  return [
    "/",
    ...PILLARS.map((p) => `/${p.slug}`),
    // The work index is public only once there is something on it.
    ...(visibleCaseStudies(showDrafts).length > 0 ? ["/work"] : []),
    ...visibleCaseStudies(showDrafts).map((c) => `/work/${c.slug}`),
    "/about",
    "/contact",
    "/website-cost",
    "/privacy",
    ...SERVICES.map((s) => `/services/${s.slug}`),
    "/areas",
    ...AREAS.map((a) => `/areas/${a.slug}`),
    ...INDUSTRIES.map((i) => `/industries/${i.slug}`),
  ];
}
