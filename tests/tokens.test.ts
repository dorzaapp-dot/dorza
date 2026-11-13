import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync("app/globals.css", "utf8");
const tw = readFileSync("tailwind.config.ts", "utf8");

const V7: Record<string, string> = {
  forest: "#1E3328", pine: "#3F6B47", moss: "#5C8264", sage: "#8FA890", haze: "#D0DCCF",
  paper: "#FBFAF5", chalk: "#F3F0E8", stone: "#E5E0D2", linen: "#CFC8B6",
  claret: "#7C2E3B", ochre: "#C9A24A",
  ink: "#1B1A14", "ink-soft": "#43403A", "ink-mute": "#807A6D",
  rule: "#BFB7A4", "rule-soft": "#DCD5C2",
};

const V6 = ["#D4845A", "#E8A87C", "#B8673F", "#FBEDE3", "#6B8F71", "#A4C2A8", "#4A6B4E", "#1A1A2E"];

describe("v7 tokens", () => {
  it.each(Object.entries(V7))("defines --%s as %s", (name, hex) => {
    expect(css).toContain(`--${name}: ${hex};`);
  });

  it("has no v6 colour left in globals.css or the Tailwind config", () => {
    for (const hex of V6) {
      expect(css.toUpperCase()).not.toContain(hex);
      expect(tw.toUpperCase()).not.toContain(hex);
    }
  });

  it("keeps the legacy class names as aliases for out-of-scope surfaces", () => {
    for (const key of ["primary", "accent", "dark", "surface", "warm", "border", "status"]) {
      expect(tw).toMatch(new RegExp(`\\b${key}:`));
    }
  });

  it("uses the house corner and curve", () => {
    expect(css).toContain("--radius-card: 2px;");
    expect(css).toContain("--ease-dorza: cubic-bezier(0.23, 1, 0.32, 1);");
  });

  it("drops the retired keyframes", () => {
    for (const k of ["float", "bounce-gentle", "breathe", "pulse-ring", "pulse-subtle", "marquee"]) {
      expect(tw).not.toContain(k);
    }
  });
});
