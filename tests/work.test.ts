import { describe, expect, it } from "vitest";
import { PILLARS } from "@/lib/data/pillars";
import { CASE_STUDIES, getCaseStudy, visibleCaseStudies } from "@/lib/data/work";
import { BANNED, PLACES, collectStrings, findViolations, isHeadline } from "./helpers/voice";

describe("case studies", () => {
  it("cover Drivable and Active Rise Health", () => {
    expect(CASE_STUDIES.map((c) => c.slug).sort()).toEqual(["active-rise-health", "drivable"]);
  });

  it("are complete and in voice", () => {
    for (const c of CASE_STUDIES) {
      expect(isHeadline(c.headline), c.headline).toBe(true);
      expect(findViolations([c.headline, c.teaser], PLACES), c.slug).toEqual([]);
      expect(c.problem.length).toBeGreaterThan(0);
      expect(c.built.length).toBeGreaterThanOrEqual(4);
      expect(c.facts.length).toBeGreaterThanOrEqual(4);
      expect(c.liveUrl).toMatch(/^https:\/\//);
    }
    expect(findViolations(collectStrings(CASE_STUDIES), BANNED)).toEqual([]);
  });

  it("back every pillar that names a proof", () => {
    for (const p of PILLARS) {
      if (p.proofSlug) expect(getCaseStudy(p.proofSlug, true)?.pillar, p.slug).toBe(p.slug);
    }
  });

  it("hide unpublished studies unless drafts are on", () => {
    expect(visibleCaseStudies(true)).toHaveLength(CASE_STUDIES.length);
    expect(visibleCaseStudies(false).every((c) => c.published)).toBe(true);
    const draft = CASE_STUDIES.find((c) => !c.published);
    if (draft) expect(getCaseStudy(draft.slug, false)).toBeUndefined();
  });
});
