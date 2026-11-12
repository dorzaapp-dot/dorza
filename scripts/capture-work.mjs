import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const SITES = [
  { slug: "drivable", url: "https://drivablehire.com.au/" },
  { slug: "active-rise-health", url: "https://www.activerisehealth.com.au/" },
];

const SHOTS = [
  { name: "desktop", width: 1440, height: 900, scale: 1.5 },
  { name: "mobile", width: 390, height: 844, scale: 2 },
];

const browser = await chromium.launch();
for (const site of SITES) {
  const dir = `public/images/work/${site.slug}`;
  mkdirSync(dir, { recursive: true });
  for (const shot of SHOTS) {
    const context = await browser.newContext({
      viewport: { width: shot.width, height: shot.height },
      deviceScaleFactor: shot.scale,
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    await page.goto(site.url, { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${dir}/${shot.name}.jpg`, type: "jpeg", quality: 82 });
    await context.close();
    console.log(`${site.slug} ${shot.name} done`);
  }
}
await browser.close();
