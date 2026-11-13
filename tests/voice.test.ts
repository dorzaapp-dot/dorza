import { describe, expect, it } from "vitest";
import { faqs } from "@/lib/data/faq";
import { PILLARS } from "@/lib/data/pillars";
import { SERVICE_OPTIONS } from "@/lib/constants";
import { DEFAULT_TITLE, FOOTER_GROUPS, NAV_LINKS, SITE_DESCRIPTION, TAGLINE } from "@/lib/site";
import { BANNED, PLACES, collectStrings, findViolations } from "./helpers/voice";

const brandStrings = collectStrings([
  PILLARS, faqs, SERVICE_OPTIONS, TAGLINE, SITE_DESCRIPTION, DEFAULT_TITLE,
  NAV_LINKS.map((l) => l.label), FOOTER_GROUPS.map((g) => [g.title, g.links.map((l) => l.label)]),
]);

describe("brand voice", () => {
  it("uses no banned words, exclamation marks, em dashes or unfilled gaps", () => {
    expect(findViolations(brandStrings, BANNED)).toEqual([]);
  });

  it("names no suburb or region in the brand layer", () => {
    expect(findViolations(brandStrings, PLACES)).toEqual([]);
  });

  it("answers the Australia-wide question in the FAQ", () => {
    expect(faqs.some((f) => /Australia/.test(f.a))).toBe(true);
  });
});
