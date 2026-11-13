import { existsSync, readFileSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { INDEXNOW_KEY } from "@/lib/seo";

type HeaderRule = { source: string; headers: { key: string; value: string }[] };
const vercel = JSON.parse(readFileSync("vercel.json", "utf8")) as { headers: HeaderRule[] };
const global = vercel.headers.find((h) => h.source === "/(.*)")!.headers;
const header = (key: string) => global.find((h) => h.key.toLowerCase() === key.toLowerCase())?.value;

describe("security headers", () => {
  it("doesn't ask for HSTS preload the bare-domain redirect can't qualify for", () => {
    expect(header("Strict-Transport-Security")).toBe("max-age=63072000; includeSubDomains");
  });

  it("sends a Content-Security-Policy that blocks framing, plugins and base hijacks", () => {
    const csp = header("Content-Security-Policy") ?? "";
    expect(csp).toMatch(/default-src 'self'/);
    expect(csp).toMatch(/object-src 'none'/);
    expect(csp).toMatch(/base-uri 'self'/);
    expect(csp).toMatch(/frame-ancestors 'self'/);
    expect(csp).not.toMatch(/unsafe-eval/);
  });
});

describe("robots.txt", () => {
  const robots = readFileSync("public/robots.txt", "utf8");

  const groups = robots.split(/\n\s*\n/);
  const groupFor = (bot: string) => groups.find((g) => g.split("\n").includes(`User-agent: ${bot}`)) ?? "";

  it("welcomes the crawlers and fetchers that AI search answers come from", () => {
    for (const bot of ["OAI-SearchBot", "ChatGPT-User", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User"]) {
      expect(groupFor(bot), bot).not.toBe("");
      expect(groupFor(bot), bot).not.toMatch(/Disallow: \/\s*$/m);
    }
  });

  it("keeps every named crawler out of the private pages too (a named group ignores the * group)", () => {
    for (const g of groups.filter((x) => x.includes("User-agent:") && !/Disallow: \/\s*$/m.test(x))) {
      for (const path of ["/admin", "/upload", "/onboard"]) expect(g, g.split("\n")[0]).toContain(`Disallow: ${path}`);
    }
  });

  it("labels training crawlers as training crawlers and drops the retired anthropic-ai name", () => {
    expect(robots).not.toMatch(/anthropic-ai/);
    expect(robots).not.toMatch(/Explicitly allow AI search crawlers/);
    const training = robots.split("# AI training crawlers")[1] ?? "";
    for (const bot of ["GPTBot", "ClaudeBot", "Google-Extended"]) expect(training, bot).toMatch(new RegExp(`User-agent: ${bot}`));
  });
});

describe("IndexNow", () => {
  it("hosts the key file at the site root", () => {
    expect(INDEXNOW_KEY).toMatch(/^[a-f0-9]{32}$/);
    expect(readFileSync(`public/${INDEXNOW_KEY}.txt`, "utf8").trim()).toBe(INDEXNOW_KEY);
  });

  it("has a ping script that reads the sitemap", () => {
    const script = readFileSync("scripts/indexnow.mjs", "utf8");
    expect(script).toContain("sitemap.xml");
    expect(script).toContain("api.indexnow.org");
  });
});

describe("icons and images", () => {
  it("keeps a favicon.ico, an Apple touch icon and a square logo in the source", () => {
    expect(existsSync("app/favicon.ico")).toBe(true);
    expect(existsSync("app/apple-icon.png")).toBe(true);
    expect(existsSync("public/images/logo.png")).toBe(true);
  });

  it("has 640, 1080, 1440 and full-size versions of every case study screenshot, in JPEG and WebP", () => {
    for (const slug of readdirSync("public/images/work")) {
      for (const shot of ["desktop", "mobile"]) {
        for (const ext of ["jpg", "webp"]) {
          expect(existsSync(`public/images/work/${slug}/${shot}.${ext}`), `${slug} ${shot}.${ext}`).toBe(true);
          expect(existsSync(`public/images/work/${slug}/${shot}-640.${ext}`), `${slug} ${shot}-640.${ext}`).toBe(true);
        }
        for (const w of [1080, 1440]) expect(existsSync(`public/images/work/${slug}/desktop-${w}.webp`), `${slug} ${w}`).toBe(true);
      }
    }
  });
});

describe("display font", () => {
  it("never swaps the headline font after first paint, and sizes the fallback to Newsreader", () => {
    const layout = readFileSync("app/layout.tsx", "utf8");
    expect(layout).toMatch(/display: "optional"/);
    expect(layout).toMatch(/fallback: \["Newsreader Fallback"/);
    expect(readFileSync("app/globals.css", "utf8")).toMatch(/font-family: "Newsreader Fallback";[\s\S]*?size-adjust: 104\.45%/);
  });
});
