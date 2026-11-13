// Cuts phone, tablet and high-density phone sizes of each case study screenshot, in JPEG and WebP.
// Run after scripts/capture-work.mjs: `node scripts/resize-work.mjs`.
// Uses Playwright's Chromium to scale and encode, so no image library is needed.
import { chromium } from "playwright";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const WIDTHS = [640, 1080, 1440]; // keep in step with SCREENSHOT_WIDTHS in lib/images.ts
const QUALITY = { jpg: 0.8, webp: 0.78 };
const ROOT = "public/images/work";

const browser = await chromium.launch();
const page = await browser.newPage();

for (const slug of readdirSync(ROOT)) {
  for (const shot of ["desktop", "mobile"]) {
    const file = join(ROOT, slug, `${shot}.jpg`);
    const dataUrl = `data:image/jpeg;base64,${readFileSync(file).toString("base64")}`;
    const fullWidth = await page.evaluate(async (url) => {
      const img = new Image();
      img.src = url;
      await img.decode();
      window.__img = img;
      return img.naturalWidth;
    }, dataUrl);

    const targets = [...WIDTHS.filter((w) => w < fullWidth).map((w) => ({ w, ext: "jpg" })), ...WIDTHS.filter((w) => w < fullWidth).map((w) => ({ w, ext: "webp" })), { w: fullWidth, ext: "webp" }];
    for (const { w, ext } of targets) {
      const out = await page.evaluate(
        ({ w, type, q }) => {
          const img = window.__img;
          const h = Math.round((img.naturalHeight * w) / img.naturalWidth);
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, w, h);
          return canvas.toDataURL(type, q).split(",")[1];
        },
        { w, type: ext === "jpg" ? "image/jpeg" : "image/webp", q: QUALITY[ext] }
      );
      const name = w === fullWidth ? `${shot}.${ext}` : `${shot}-${w}.${ext}`;
      const buf = Buffer.from(out, "base64");
      writeFileSync(join(ROOT, slug, name), buf);
      console.log(`${slug}/${name} ${Math.round(buf.length / 1024)}KB`);
    }
  }
}
await browser.close();
