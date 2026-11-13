import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { CASE_STUDIES } from "@/lib/data/work";

const pub = (p: string) => `public${p}`;

describe("assets", () => {
  it("has a desktop capture, a mobile capture and a share image for every case study", () => {
    for (const c of CASE_STUDIES) {
      expect(existsSync(pub(c.shots.desktop)), c.shots.desktop).toBe(true);
      expect(existsSync(pub(c.shots.mobile)), c.shots.mobile).toBe(true);
      expect(existsSync(pub(`/images/og/${c.slug}.png`)), `${c.slug} og`).toBe(true);
    }
    expect(existsSync(pub("/images/og/default.png"))).toBe(true);
  });

  it("has a favicon and no old orange one", () => {
    expect(readFileSync("app/icon.svg", "utf8")).toContain("#1E3328");
    expect(existsSync("public/images/mockups/favicon.svg")).toBe(false);
  });

  it("records where every shipped raster came from", () => {
    const provenance = readFileSync("public/images/PROVENANCE.md", "utf8");
    for (const c of CASE_STUDIES) expect(provenance).toContain(c.slug);
  });
});
