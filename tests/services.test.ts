import { describe, expect, it } from "vitest";
import { SERVICES, serviceStatus } from "@/lib/data/services";
import { PILLARS } from "@/lib/data/pillars";
import { isHeadline } from "./helpers/voice";

const pillarServices = PILLARS.flatMap((p) => p.services);

describe("service pages", () => {
  it("names a real pillar service when it ties to one, so its status can't drift", () => {
    for (const s of SERVICES) {
      if (!s.pillarService) continue;
      expect(pillarServices.some((p) => p.name === s.pillarService), `${s.slug}: ${s.pillarService}`).toBe(true);
    }
  });

  it("reads 'ask' for a service the pillar data hasn't made live", () => {
    for (const s of SERVICES) {
      const pillar = pillarServices.find((p) => p.name === s.pillarService);
      expect(serviceStatus(s), s.slug).toBe(pillar ? pillar.status : "live");
    }
  });

  it("gives every page Dorza headlines", () => {
    for (const s of SERVICES) {
      for (const h of [s.title, s.problemHeadline, s.solutionHeadline]) expect(isHeadline(h), `${s.slug}: ${h}`).toBe(true);
    }
  });

  it("links each pillar service that has its own page to that page", () => {
    for (const s of SERVICES.filter((x) => x.pillarService)) {
      const pillar = pillarServices.find((p) => p.name === s.pillarService)!;
      expect(pillar.href, s.slug).toBe(`/services/${s.slug}`);
    }
  });

  it("only links to related services that exist", () => {
    const slugs = new Set(SERVICES.map((s) => s.slug));
    for (const s of SERVICES) for (const r of s.relatedSlugs) expect(slugs.has(r), `${s.slug} -> ${r}`).toBe(true);
  });

  it("states no price except the promised website price", () => {
    for (const s of SERVICES) {
      const text = JSON.stringify(s);
      if (s.slug === "web-design") continue;
      expect(text, s.slug).not.toMatch(/\$\d/);
    }
  });
});
