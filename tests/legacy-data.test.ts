import { describe, expect, it } from "vitest";
import { AREAS } from "@/lib/data/areas";
import { INDUSTRIES } from "@/lib/data/industries";
import { SERVICES } from "@/lib/data/services";
import { BANNED, PLACES, collectStrings, findViolations } from "./helpers/voice";

describe("kept page data", () => {
  it("has no brand suffix in any meta title", () => {
    for (const item of [...SERVICES, ...AREAS, ...INDUSTRIES]) {
      expect(item.metaTitle, item.slug).not.toMatch(/Dorza\s*$/);
    }
  });

  it("is in the new voice", () => {
    expect(findViolations(collectStrings([SERVICES, INDUSTRIES, AREAS]), BANNED)).toEqual([]);
  });

  it("keeps place names out of service and industry pages", () => {
    expect(findViolations(collectStrings([SERVICES, INDUSTRIES]), PLACES)).toEqual([]);
  });

  it("carries no unsourced outcome statistics", () => {
    for (const industry of INDUSTRIES) expect(industry).not.toHaveProperty("outcomes");
    expect(findViolations(collectStrings(INDUSTRIES), [/\bup to \d/i, /\d+\s?%/, /\d+x\b/])).toEqual([]);
  });

  it("keeps all six areas, four services and three industries", () => {
    expect(AREAS).toHaveLength(6);
    expect(SERVICES).toHaveLength(4);
    expect(INDUSTRIES).toHaveLength(3);
  });
});
