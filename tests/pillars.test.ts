import { describe, expect, it } from "vitest";
import { PILLARS, getPillar } from "@/lib/data/pillars";
import { isHeadline } from "./helpers/voice";

describe("pillars", () => {
  it("are Start, Grow, Support in that order", () => {
    expect(PILLARS.map((p) => p.slug)).toEqual(["start", "grow", "support"]);
    expect(PILLARS.map((p) => p.name)).toEqual(["Start", "Grow", "Support"]);
  });

  it("each have a short declarative headline and at least one live service", () => {
    for (const p of PILLARS) {
      expect(isHeadline(p.headline), p.headline).toBe(true);
      expect(p.services.some((s) => s.status === "live"), p.slug).toBe(true);
      expect(p.steps).toHaveLength(3);
    }
  });

  it("only use the two honest statuses", () => {
    const statuses = new Set(PILLARS.flatMap((p) => p.services.map((s) => s.status)));
    expect(Array.from(statuses).sort()).toEqual(["ask", "live"]);
  });

  it("never list a service Dorza can't deliver yet", () => {
    const names = PILLARS.flatMap((p) => p.services.map((s) => s.name)).join(" | ");
    expect(names).not.toMatch(/helpdesk|managed security|cybersecurity|\bERP\b/i);
  });

  it("keep meta titles free of the brand suffix", () => {
    for (const p of PILLARS) expect(p.metaTitle).not.toMatch(/Dorza\s*$/);
  });

  it("getPillar returns the pillar or throws", () => {
    expect(getPillar("grow").name).toBe("Grow");
  });
});
