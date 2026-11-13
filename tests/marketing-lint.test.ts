import { describe, expect, it } from "vitest";
import { brandSources, marketingSources } from "./helpers/files";
import { PLACES } from "./helpers/voice";

const RULES: { name: string; pattern: RegExp }[] = [
  { name: "legacy colour class", pattern: /\b(?:bg|text|border|ring|outline|decoration|placeholder|from|to|via)-(?:primary|accent|dark|surface|warm|status|text-primary|text-secondary|text-muted|border|border-strong)\b/ },
  { name: "pure white or black", pattern: /\b(?:bg|text|border)-(?:white|black)\b|#fff\b|#ffffff\b|#000\b|#000000\b/i },
  { name: "gradient", pattern: /gradient/i },
  { name: "soft corner", pattern: /\brounded-(?:md|lg|xl|2xl|3xl|\[)/ },
  { name: "retired animation", pattern: /animate-(?:float|bounce|pulse|breathe|marquee)/ },
  { name: "v6 hex", pattern: /#(?:D4845A|E8A87C|B8673F|FBEDE3|6B8F71|A4C2A8|4A6B4E|1A1A2E)\b/i },
  { name: "eyebrow label", pattern: /["'`]\/\/ / },
  { name: "tick icon list", pattern: /\bCheck\b.*from "lucide-react"/ },
];

function violations(sources: { path: string; text: string }[], rules: { name: string; pattern: RegExp }[]) {
  const hits: string[] = [];
  for (const { path, text } of sources) {
    text.split("\n").forEach((line, i) => {
      for (const rule of rules) {
        if (rule.pattern.test(line)) hits.push(`${path}:${i + 1} ${rule.name}`);
      }
    });
  }
  return hits;
}

describe("marketing code", () => {
  it("uses only v7 tokens, shapes and motion", () => {
    expect(violations(marketingSources(), RULES)).toEqual([]);
  });

  it("names no suburb or region in the brand layer", () => {
    const rules = PLACES.map((pattern) => ({ name: `place name ${pattern}`, pattern }));
    expect(violations(brandSources(), rules)).toEqual([]);
  });

  it("keeps the old voice out of brand components", () => {
    const rules = [/\beasiest\b/i, /\bslapped\b/i, /invisible online/i, /\bseamless/i, /real Sydney human/i, /free audit/i].map(
      (pattern) => ({ name: `old voice ${pattern}`, pattern })
    );
    expect(violations(brandSources(), rules)).toEqual([]);
  });
});
