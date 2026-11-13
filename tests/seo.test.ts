import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { visibleCaseStudies } from "@/lib/data/work";
import { allRoutes } from "@/lib/routes";

const sitemap = readFileSync("public/sitemap.xml", "utf8");
const locs = Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)).map((m) => m[1].replace("https://dorza.com.au", "") || "/");
const llms = readFileSync("public/llms.txt", "utf8");

const LEGACY = [
  "/", "/about", "/contact", "/website-cost",
  "/services/web-design", "/services/social-media-management", "/services/google-business-profile", "/services/local-seo",
  "/areas/western-sydney", "/areas/parramatta", "/areas/blacktown", "/areas/penrith", "/areas/liverpool", "/areas/campbelltown",
  "/industries/cafes-restaurants", "/industries/tradies", "/industries/salons-beauty",
];

describe("routes and sitemap", () => {
  it("keeps every URL the site had before the reposition", () => {
    for (const path of LEGACY) expect(allRoutes(false), path).toContain(path);
  });

  it("adds the pillar, areas index and privacy routes", () => {
    for (const path of ["/start", "/grow", "/support", "/areas", "/privacy"]) {
      expect(allRoutes(false)).toContain(path);
    }
  });

  it("lists the work index and case studies only when drafts are asked for or a study is published", () => {
    expect(allRoutes(true)).toContain("/work");
    expect(allRoutes(true)).toContain("/work/drivable");
    expect(allRoutes(false).includes("/work")).toBe(visibleCaseStudies(false).length > 0);
  });

  it("lists exactly the public routes in the sitemap, no drafts", () => {
    expect([...locs].sort()).toEqual([...allRoutes(false)].sort());
  });

  it("never lists internal surfaces", () => {
    expect(locs.some((l) => /^\/(admin|onboard|upload|demo)/.test(l))).toBe(false);
  });
});

describe("llms.txt", () => {
  it("describes the national, three-stage business with no stale pricing table", () => {
    expect(llms).toMatch(/Australia/);
    expect(llms).toMatch(/Start/);
    expect(llms).not.toMatch(/Western Sydney-based|\$199|\$349|\$549|Founding client/);
  });

  it("lists every published case study and no draft", () => {
    for (const c of visibleCaseStudies(false)) expect(llms, c.slug).toContain(`https://dorza.com.au/work/${c.slug}`);
    expect(llms.includes("https://dorza.com.au/work")).toBe(visibleCaseStudies(false).length > 0);
  });
});
