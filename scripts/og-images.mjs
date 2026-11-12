import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const CARDS = [
  { file: "default", headline: "You run the business.<br>We’ll mind the tech.", foot: "dorza.com.au" },
  { file: "drivable", headline: "Open for bookings.", foot: "Case study · Drivable" },
  { file: "active-rise-health", headline: "One physio. Two clinics.<br>One front door.", foot: "Case study · Active Rise Health" },
];

const html = (card) => `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,500&family=Geist+Mono:wght@500&display=block" rel="stylesheet">
<style>
  html,body{margin:0;width:1200px;height:630px;background:#1E3328;color:#F3F0E8}
  .wrap{box-sizing:border-box;width:1200px;height:630px;padding:72px 80px;display:flex;flex-direction:column;justify-content:space-between}
  .mark{font:500 44px/1 "Newsreader",serif;letter-spacing:-0.02em}
  .mark span{color:#C9A24A}
  h1{margin:0;font:500 92px/0.96 "Newsreader",serif;letter-spacing:-0.022em}
  .foot{font:500 18px/1 "Geist Mono",monospace;letter-spacing:0.18em;text-transform:uppercase;color:rgba(243,240,232,0.62);border-top:1px solid rgba(243,240,232,0.18);padding-top:24px}
</style></head><body><div class="wrap">
  <div class="mark">d<span>o</span>rza</div>
  <h1>${card.headline}</h1>
  <div class="foot">${card.foot}</div>
</div></body></html>`;

mkdirSync("public/images/og", { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
for (const card of CARDS) {
  await page.setContent(html(card), { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `public/images/og/${card.file}.png` });
  console.log(`${card.file} done`);
}
await browser.close();
