import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const MARKETING_DIRS = [
  "app/start", "app/grow", "app/support", "app/work", "app/about", "app/contact", "app/areas",
  "app/industries", "app/services", "app/website-cost", "app/privacy",
  "components/sections", "components/ui", "components/work", "components/motion",
];
const MARKETING_FILES = ["app/page.tsx", "app/not-found.tsx", "components/forms/EnquiryFormFields.tsx"];

/** Brand layer: no place names allowed. Local and industry templates are excluded. */
const BRAND_DIRS = ["app/start", "app/grow", "app/support", "app/work", "app/about", "app/privacy", "components/sections/home", "components/work"];
const BRAND_FILES = [
  "app/page.tsx", "app/not-found.tsx",
  "components/sections/Nav.tsx", "components/sections/Footer.tsx", "components/sections/PageCTA.tsx",
  "components/sections/WaitlistCTA.tsx", "components/sections/FAQ.tsx", "components/sections/PillarPage.tsx",
];

function walk(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return walk(full);
    return /\.(tsx?|css)$/.test(name) ? [full] : [];
  });
}

function load(dirs: string[], files: string[]) {
  const paths = Array.from(new Set([...dirs.flatMap(walk), ...files.filter(existsSync)]));
  return paths.map((path) => ({ path, text: readFileSync(path, "utf8") }));
}

export const marketingSources = () => load(MARKETING_DIRS, MARKETING_FILES);
export const brandSources = () => load(BRAND_DIRS, BRAND_FILES);
