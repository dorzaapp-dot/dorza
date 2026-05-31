import { chromium } from "playwright";
import { mkdirSync } from "fs";

const OUT = "scripts/_shots";
mkdirSync(OUT, { recursive: true });

const viewports = [
  { name: "desktop", width: 1280, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

// Per-step fillers (best-effort; wrapped in try/catch by caller)
const fillers = [
  // 0 basics
  async (p) => {
    await p.getByText("Cafe/Restaurant", { exact: true }).click();
    await p.locator("input").first().fill("Lumen Coffee House");
    await p.getByPlaceholder("0413 902 184").fill("0413 902 184");
    await p.locator("input[type='email']").fill("sam@lumencoffee.com.au");
  },
  // 1 digital
  async (p) => {
    await p.getByRole("button", { name: "Yes", exact: true }).first().click();
  },
  // 2 services
  async (p) => {
    const svc = p.locator("input[placeholder^='Service']");
    await svc.nth(0).fill("Specialty espresso & filter");
    await svc.nth(1).fill("All-day brunch");
  },
  // 3 customers
  async (p) => {
    await p.getByText("Word of mouth", { exact: true }).click();
  },
  // 4 look & feel
  async (p) => {
    await p.getByText("Casual & friendly", { exact: true }).click();
    await p.getByText("Earthy", { exact: true }).click();
  },
  // 5 site & assets
  async () => {},
  // 6 success
  async (p) => {
    await p.locator("textarea").first().fill("25 booking enquiries a month by spring.");
  },
  // 7 review
  async () => {},
];

const stepNames = [
  "01-basics",
  "02-digital",
  "03-services",
  "04-customers",
  "05-lookfeel",
  "06-site-assets",
  "07-success",
  "08-review",
];

for (const vp of viewports) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 2,
  });
  const p = await ctx.newPage();

  await p.goto("http://localhost:3000/onboard", { waitUntil: "networkidle" });
  await p.waitForTimeout(600);
  await p.screenshot({ path: `${OUT}/${vp.name}-00-welcome.png`, fullPage: true });

  await p.getByRole("button", { name: /Start onboarding/i }).click();
  await p.waitForTimeout(500);

  for (let i = 0; i < stepNames.length; i++) {
    try {
      await fillers[i](p);
    } catch (e) {
      console.log(`[${vp.name}] step ${i} filler skipped: ${e.message}`);
    }
    await p.waitForTimeout(350);
    await p.screenshot({
      path: `${OUT}/${vp.name}-${stepNames[i]}.png`,
      fullPage: true,
    });
    // advance unless we're on the final review step (don't submit)
    if (i < stepNames.length - 1) {
      await p.getByRole("button", { name: /^Continue$/ }).click();
      await p.waitForTimeout(450);
    }
  }

  await browser.close();
  console.log(`${vp.name} done`);
}
console.log("ALL DONE");
