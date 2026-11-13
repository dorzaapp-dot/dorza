import { AREAS } from "@/lib/data/areas";
import { INDUSTRIES } from "@/lib/data/industries";
import { PILLARS } from "@/lib/data/pillars";
import { SERVICES } from "@/lib/data/services";
import { visibleCaseStudies } from "@/lib/data/work";
import { SHOW_DRAFTS } from "@/lib/data/workStatus";

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

/** A link target only if it leads somewhere public: case-study links drop out while the study is a draft. */
export function routableHref(href: string | undefined, showDrafts: boolean = SHOW_DRAFTS): string | undefined {
  if (!href) return undefined;
  if (href.startsWith("/work")) return allRoutes(showDrafts).includes(href) ? href : undefined;
  return href;
}
