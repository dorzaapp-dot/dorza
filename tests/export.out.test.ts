import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { CASE_STUDIES, visibleCaseStudies } from "@/lib/data/work";
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
  it("lays the v7 grain over every page (spec §6, §9)", () => {
    for (const route of allRoutes(false)) expect(readFileSync(fileFor(route), "utf8"), route).toMatch(/data-grain/);
  });

  it("proves Support with the published clients Dorza still looks after (spec §3)", () => {
    const studies = visibleCaseStudies(false);
    for (const route of ["/", "/support"]) {
      const html = readFileSync(fileFor(route), "utf8");
      expect(html.includes("We still look after"), route).toBe(studies.length > 0);
      for (const c of studies) expect(html, `${route} ${c.slug}`).toContain(`href="/work/${c.slug}"`);
    }
  });

  it("links the website cost guide from /start (spec §5)", () => {
    const main = readFileSync("out/start.html", "utf8").match(/<main[\s\S]*<\/main>/)?.[0] ?? "";
    expect(main).toContain('href="/website-cost"');
  });

  it("names only the www host, never the bare domain (one canonical host)", () => {
    const files = walk("out").filter((f) => /\.(html|xml|txt)$/.test(f));
    for (const f of files) expect(readFileSync(f, "utf8").includes("https://dorza.com.au"), f).toBe(false);
    expect(readFileSync("out/robots.txt", "utf8")).toContain("Sitemap: https://www.dorza.com.au/sitemap.xml");
  });

  it("gives every public page a share image", () => {
    for (const route of allRoutes(false)) {
      expect(readFileSync(fileFor(route), "utf8"), route).toMatch(/<meta property="og:image" content="https:\/\/www\.dorza\.com\.au\/images\/og\//);
    }
  });

  it("keeps the demo harnesses out of the index", () => {
    for (const f of walk("out/demo").filter((x) => x.endsWith(".html"))) {
      expect(readFileSync(f, "utf8"), f).toMatch(/<meta name="robots" content="noindex/);
    }
  });

  it("marks up published case studies as articles and the founders as people", () => {
    for (const c of visibleCaseStudies(false)) {
      const html = readFileSync(`out/work/${c.slug}.html`, "utf8");
      expect(html, c.slug).toContain('"@type":"Article"');
      expect(html, c.slug).toContain(`"url":"${c.liveUrl}"`);
    }
    expect(readFileSync("out/about.html", "utf8").match(/"@type":"Person"/g)?.length).toBe(2);
  });

  it("links each case study to its service and its area pages, and back", () => {
    const main = (route: string) => readFileSync(fileFor(route), "utf8").match(/<main[\s\S]*<\/main>/)?.[0] ?? "";
    for (const c of visibleCaseStudies(false)) {
      for (const s of c.services) {
        expect(main(`/work/${c.slug}`), `${c.slug} -> ${s}`).toContain(`href="/services/${s}"`);
        expect(main(`/services/${s}`), `${s} -> ${c.slug}`).toContain(`href="/work/${c.slug}"`);
      }
      for (const a of c.areas ?? []) expect(main(`/areas/${a}`), `${a} -> ${c.slug}`).toContain(`href="/work/${c.slug}"`);
    }
    expect(visibleCaseStudies(false).find((c) => c.slug === "active-rise-health")?.areas).toEqual(["parramatta", "western-sydney"]);
  });

  it("builds a page for every public route", () => {
    for (const route of allRoutes(false)) expect(existsSync(fileFor(route)), route).toBe(true);
  });

  it("gives every page one h1, one brand suffix and its own www canonical", () => {
    for (const route of allRoutes(false)) {
      const html = readFileSync(fileFor(route), "utf8");
      const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
      expect(title.match(/Dorza/g)?.length ?? 0, `${route} title: ${title}`).toBeLessThanOrEqual(2);
      expect(title, route).not.toMatch(/\| Dorza \| Dorza/);
      expect(html.match(/<h1[\s>]/g)?.length, `${route} h1`).toBe(1);
      const expected = route === "/" ? "https://www.dorza.com.au" : `https://www.dorza.com.au${route}`;
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
