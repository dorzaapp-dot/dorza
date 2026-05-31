import { chromium } from "playwright";
import { mkdirSync } from "fs";

const OUT = "scripts/_shots";
mkdirSync(OUT, { recursive: true });

const viewports = [
  { name: "desktop", width: 1280, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

for (const vp of viewports) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 2,
  });
  const p = await ctx.newPage();
  await p.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await p.waitForTimeout(1200);
  await p.screenshot({ path: `${OUT}/${vp.name}-hero.png` });
  await browser.close();
  console.log(`${vp.name} hero done`);
}
console.log("ALL DONE");
