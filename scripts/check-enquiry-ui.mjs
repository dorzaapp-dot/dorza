// Browser check for the homepage enquiry form. Serves the built site (out/), stubs the
// edge function in Chromium with a fixed delay, and asserts what a visitor sees.
//   pnpm build && pnpm check:enquiry
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DELAY = 1500;
const CONFIRMATION_MAX_MS = 300; // 120ms form exit + 200ms confirmation entrance, measured ~250
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".json": "application/json", ".txt": "text/plain", ".webp": "image/webp", ".jpg": "image/jpeg", ".png": "image/png" };

if (!fs.existsSync(path.join(ROOT, "out", "index.html"))) {
  console.error("out/ not found: run `pnpm build` first");
  process.exit(2);
}

const server = http.createServer((q, s) => {
  let f = path.join(ROOT, "out", decodeURIComponent(q.url.split("?")[0]));
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, "index.html");
  if (!fs.existsSync(f) && fs.existsSync(f + ".html")) f += ".html";
  if (!fs.existsSync(f)) { s.writeHead(404); return s.end("nf"); }
  s.writeHead(200, { "Content-Type": MIME[path.extname(f)] || "application/octet-stream" });
  fs.createReadStream(f).pipe(s);
});

const cors = { "access-control-allow-origin": "*", "access-control-allow-headers": "*" };
const results = [];
const check = (name, ok, detail = "") => { results.push(ok); console.log(`${ok ? "PASS" : "FAIL"} ${name}${detail ? ` (${detail})` : ""}`); };

async function openForm(browser, base, answer) {
  const page = await browser.newPage({ viewport: { width: 412, height: 900 } });
  const posts = { count: 0, at: null, answeredAt: null };
  await page.route("**/functions/v1/enquiry-submit", async (route) => {
    if (route.request().method() === "OPTIONS") return route.fulfill({ status: 200, headers: cors, body: "ok" });
    posts.count += 1;
    posts.at ??= Date.now();
    await answer(route, posts);
  });
  await page.goto(base + "/#quote", { waitUntil: "networkidle" });
  const form = page.locator("#quote form");
  await form.getByPlaceholder("Your name").fill("Loop Test");
  await form.getByPlaceholder("you@business.com.au").fill("loop-test@example.com");
  await form.locator("select").selectOption({ index: 1 });
  await form.getByPlaceholder("Where you're based").fill("Parramatta");
  const btn = form.locator('button[type="submit"]');
  await btn.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200); // let the scroll settle so timings measure the app, not Playwright
  return { page, form, btn, posts };
}

async function main() {
  await new Promise((r) => server.listen(0, r));
  const base = `http://localhost:${server.address().port}`;
  const browser = await chromium.launch();

  // Scenario 1: slow success. Spinner while waiting, one request only, fast confirmation.
  {
    const { page, form, btn, posts } = await openForm(browser, base, async (route, p) => {
      await new Promise((r) => setTimeout(r, DELAY));
      p.answeredAt = Date.now();
      route.fulfill({ status: 200, headers: { ...cors, "content-type": "application/json" }, body: JSON.stringify({ success: true }) });
    });
    await btn.click();
    await page.waitForTimeout(300);
    await form.getByPlaceholder("Your name").press("Enter"); // a second submit attempt mid-flight
    await btn.click({ force: true, timeout: 1000 }).catch(() => {}); // and a double click
    await page.waitForTimeout(100);
    const mid = await page.evaluate(() => {
      const b = document.querySelector('#quote form button[type="submit"]');
      return { disabled: b?.disabled, busy: b?.getAttribute("aria-busy"), spinner: !!b?.querySelector("[data-spinner]"), live: !!document.querySelector('#quote [role="status"]') };
    });
    await page.getByText("got your details", { exact: false }).first().waitFor({ timeout: DELAY + 5000 });
    const lag = Date.now() - posts.answeredAt;
    check("button is disabled while sending", mid.disabled === true);
    check("spinner is visible while sending", mid.spinner === true);
    check("aria-busy and a live region are set while sending", mid.busy === "true" && mid.live === true);
    check("a double submit sends exactly one request", posts.count === 1, `${posts.count} request(s)`);
    check(`confirmation appears within ${CONFIRMATION_MAX_MS}ms of the response`, lag <= CONFIRMATION_MAX_MS, `${lag}ms`);
    await page.close();
  }

  // Scenario 2: the server fails. The visitor sees an error, can retry, and keeps what they typed.
  {
    const { page, form, btn } = await openForm(browser, base, async (route) =>
      route.fulfill({ status: 503, headers: { ...cors, "content-type": "text/plain" }, body: "unavailable" }));
    await btn.click();
    const alert = page.locator('#quote [role="alert"]');
    await alert.waitFor({ timeout: 5000 });
    check("a 503 shows the error message", (await alert.textContent())?.includes("Something went wrong. Please try again."));
    check("the button is usable again after an error", await btn.isEnabled());
    check("what the visitor typed is kept after an error", (await form.getByPlaceholder("Your name").inputValue()) === "Loop Test");
    await page.close();
  }

  await browser.close();
  server.close();
  process.exit(results.every(Boolean) ? 0 : 1);
}

main().catch((e) => { console.error("check-enquiry-ui error:", e.message); server.close(); process.exit(2); });
