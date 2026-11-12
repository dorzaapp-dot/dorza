import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { CASE_STUDIES } from "@/lib/data/work";
import { allRoutes } from "@/lib/routes";

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const hasOut = existsSync("out/index.html");
const fileFor = (route: string) => (route === "/" ? "out/index.html" : `out${route}.html`);
const BRAND = ["/", "/start", "/grow", "/support", "/about", "/privacy"];

describe.skipIf(!hasOut)("static export", () => {
  it("builds a page for every public route", () => {
    for (const route of allRoutes(false)) expect(existsSync(fileFor(route)), route).toBe(true);
  });

  it("gives every page one h1, one brand suffix and its own apex canonical", () => {
    for (const route of allRoutes(false)) {
      const html = readFileSync(fileFor(route), "utf8");
      const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
      expect(title.match(/Dorza/g)?.length ?? 0, `${route} title: ${title}`).toBeLessThanOrEqual(2);
      expect(title, route).not.toMatch(/\| Dorza \| Dorza/);
      expect(html.match(/<h1[\s>]/g)?.length, `${route} h1`).toBe(1);
      const expected = route === "/" ? "https://dorza.com.au" : `https://dorza.com.au${route}`;
      expect(html, `${route} canonical`).toMatch(new RegExp(`<link rel="canonical" href="${expected}/?"`));
    }
  });

  it("keeps place names off brand pages and the old claims off every page", () => {
    for (const route of BRAND) {
      // The business schema keeps the real Parramatta address, so check visible markup only.
      const visible = readFileSync(fileFor(route), "utf8").replace(/<script[\s\S]*?<\/script>/g, "");
      expect(visible, route).not.toMatch(/Western Sydney|Parramatta|Blacktown|Penrith/);
    }
    for (const route of allRoutes(false)) {
      const html = readFileSync(fileFor(route), "utf8");
      expect(html, route).not.toMatch(/Westmead Electrical|Parramatta Coffee|free audit|Founding client/i);
    }
  });

  it("ships no draft case study, in pages or in public JS (build with drafts off)", () => {
    const drafts = CASE_STUDIES.filter((c) => !c.published);
    for (const c of drafts) {
      const html = readFileSync(`out/work/${c.slug}.html`, "utf8");
      expect(html, `${c.slug} holding page`).toMatch(/Not public yet/);
      expect(html, `${c.slug} noindex`).toMatch(/noindex/);
    }
    const files = walk("out").filter((f) => /\.(html|js|txt|json)$/.test(f));
    for (const f of files) {
      const text = readFileSync(f, "utf8");
      for (const c of drafts) expect(text.includes(c.summary.slice(0, 28)), `${f} leaks ${c.slug}`).toBe(false);
    }
  });
});
