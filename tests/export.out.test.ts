import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { CASE_STUDIES, visibleCaseStudies } from "@/lib/data/work";
import { NEEDS, STACK, needStatus } from "@/lib/data/needs";
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

  it("paints each page's opening section without waiting for JavaScript (LCP)", () => {
    for (const route of allRoutes(false)) {
      const first = readFileSync(fileFor(route), "utf8").match(/<main[\s\S]*?<section[\s\S]*?<\/section>/)?.[0] ?? "";
      expect(first.length, route).toBeGreaterThan(0);
      expect(first, `${route} hides its opening content until JS runs`).not.toMatch(/opacity:0|transform:translateY/);
    }
  });

  it("opens the homepage on the 'I need' picker, every answer in the HTML so it works without JavaScript", () => {
    const home = readFileSync("out/index.html", "utf8");
    const first = home.match(/<main[\s\S]*?<section[\s\S]*?<\/section>/)?.[0] ?? "";
    expect(first).toMatch(/<h1[^>]*>[\s\S]*Whatever the tech,[\s\S]*sort[\s\S]*<\/h1>/);
    expect(first).toMatch(/<fieldset[\s\S]*<legend[^>]*>[\s\S]*I need/);
    for (const need of NEEDS) {
      expect(first, need.slug).toMatch(new RegExp(`<input[^>]+type="radio"[^>]+id="need-${need.slug}"`));
      const panel = first.match(new RegExp(`<article[^>]*data-need-panel="${need.slug}"[\\s\\S]*?</article>`))?.[0] ?? "";
      expect(panel, `${need.slug} panel`).toContain(need.headline.replace(/'/g, "&#x27;"));
      if (needStatus(need) === "ask") expect(panel, `${need.slug} says Ask us`).toContain("Ask us");
    }
    expect(first.match(/checked=""/g)?.length, "exactly one need starts selected").toBe(1);
  });

  it("draws the business as a stack, with a lifted layer for every need, in the first paint", () => {
    const first = readFileSync("out/index.html", "utf8").match(/<main[\s\S]*?<section[\s\S]*?<\/section>/)?.[0] ?? "";
    const svg = first.match(/<svg[^>]*class="need-stack[\s\S]*?<\/svg>/)?.[0] ?? "";
    expect(svg, "stack drawing").toMatch(/role="img"/);
    expect(svg).toMatch(/<title[^>]*>[^<]+<\/title>/);
    for (const slug of STACK) {
      expect(svg, `${slug} slot`).toContain(`data-slot="${slug}"`);
      expect(svg, `${slug} lift`).toContain(`data-lift="${slug}"`);
    }
    for (const slug of ["support", "unsure"]) expect(svg, slug).toContain(`data-lift="${slug}"`);
  });

  it("keeps case study screenshots off the homepage (they live in /work)", () => {
    expect(readFileSync("out/index.html", "utf8")).not.toMatch(/<img[^>]+src="\/images\/work\//);
  });

  it("doesn't rush a below-the-fold image ahead of the homepage hero", () => {
    const home = readFileSync("out/index.html", "utf8");
    expect(home).not.toMatch(/<link[^>]+as="image"/);
    expect(home).not.toMatch(/fetchpriority="high"/i);
  });

  it("serves case study screenshots at phone and desktop sizes, in WebP as well as JPEG", () => {
    for (const route of allRoutes(false)) {
      const html = readFileSync(fileFor(route), "utf8");
      const imgs = html.match(/<img[^>]+src="\/images\/work\/[^>]+>/g) ?? [];
      for (const img of imgs) {
        expect(img, route).toMatch(/srcset="[^"]+640w/i);
        expect(img, route).toMatch(/sizes="/i);
      }
      const pictures = html.match(/<picture>[\s\S]*?<\/picture>/g) ?? [];
      expect(pictures.length, route).toBe(imgs.length);
      for (const p of pictures) expect(p, route).toMatch(/<source type="image\/webp" srcset="/i);
      for (const set of Array.from(html.matchAll(/srcset="([^"]+)"/gi))) {
        for (const entry of set[1].split(",")) {
          const file = entry.trim().split(" ")[0];
          if (file.startsWith("/images/work/")) expect(existsSync(`out${file}`), file).toBe(true);
        }
      }
    }
  });

  it("ships a favicon.ico, an Apple touch icon and a square logo for search", () => {
    expect(existsSync("out/favicon.ico")).toBe(true);
    const home = readFileSync("out/index.html", "utf8");
    expect(home).toMatch(/<link rel="apple-touch-icon" href="\/apple-icon\.png/);
    expect(home).toContain('"logo":"https://www.dorza.com.au/images/logo.png"');
  });

  it("gives every link words that say where it goes", () => {
    const vague = /^(start|grow|support|here|click here|more|read more|learn more|this|go)$/i;
    for (const route of allRoutes(false)) {
      const html = readFileSync(fileFor(route), "utf8").replace(/<script[\s\S]*?<\/script>/g, "");
      for (const a of Array.from(html.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/g))) {
        const text = a[1].replace(/<[^>]+>/g, "").replace(/&[a-z]+;/g, " ").replace(/\s+/g, " ").trim();
        expect(vague.test(text), `${route}: "${text}"`).toBe(false);
      }
    }
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
