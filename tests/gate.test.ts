import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PILLARS } from "@/lib/data/pillars";
import { allRoutes, routableHref } from "@/lib/routes";

describe("published gate", () => {
  it("keeps case-study content out of client components", () => {
    // Anything imported by a "use client" file ships in public JS, drafts included.
    for (const file of ["components/sections/Nav.tsx"]) {
      expect(readFileSync(file, "utf8"), file).not.toMatch(/@\/lib\/data\/work"/);
    }
  });

  it("never links a pillar service to a route that isn't public", () => {
    const publicRoutes = new Set(allRoutes(false));
    for (const p of PILLARS) {
      for (const s of p.services) {
        const href = routableHref(s.href, false);
        if (href) expect(publicRoutes.has(href), `${p.slug}: ${s.name} -> ${href}`).toBe(true);
      }
    }
    expect(routableHref("/work/drivable", true)).toBe("/work/drivable");
  });
});

describe("privacy page", () => {
  const src = readFileSync("app/privacy/page.tsx", "utf8");
  it("covers every place the site collects data, not just enquiries", () => {
    expect(src).toMatch(/onboarding|brief/i);
    expect(src).toMatch(/upload/i);
    expect(src).toMatch(/GitHub/);
  });
});

describe("link hit areas", () => {
  const css = readFileSync("app/globals.css", "utf8");
  it("only extends the hit area of links that sit on their own line", () => {
    expect(css).not.toMatch(/\.d-link::after/);
    expect(css).toMatch(/\.d-link\.inline-block::after/);
  });
});
