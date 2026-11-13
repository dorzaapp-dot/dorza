// Renders app/icon.svg into the raster icons browsers and search engines still ask for:
// app/favicon.ico (16, 32, 48), app/apple-icon.png (180, square corners: iOS rounds them itself)
// and public/images/logo.png (512, the square logo in the business schema).
// Run: `node scripts/make-icons.mjs`.
import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "node:fs";

const svg = readFileSync("app/icon.svg", "utf8");
const square = svg.replace(/ rx="[^"]*"/, "");

const browser = await chromium.launch();
const page = await browser.newPage();

async function png(source, size) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(
    `<html><body style="margin:0;background:transparent">${source.replace("<svg ", `<svg width="${size}" height="${size}" `)}</body></html>`
  );
  return page.locator("svg").screenshot({ omitBackground: true, type: "png" });
}

// ICO with PNG-compressed entries (supported by every current browser).
const sizes = [16, 32, 48];
const images = [];
for (const s of sizes) images.push(await png(svg, s));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((s, i) => {
  const e = 6 + 16 * i;
  header.writeUInt8(s, e);
  header.writeUInt8(s, e + 1);
  header.writeUInt8(0, e + 2);
  header.writeUInt8(0, e + 3);
  header.writeUInt16LE(1, e + 4);
  header.writeUInt16LE(32, e + 6);
  header.writeUInt32LE(images[i].length, e + 8);
  header.writeUInt32LE(offset, e + 12);
  offset += images[i].length;
});
writeFileSync("app/favicon.ico", Buffer.concat([header, ...images]));
writeFileSync("app/apple-icon.png", await png(square, 180));
writeFileSync("public/images/logo.png", await png(square, 512));
await browser.close();
console.log("favicon.ico, apple-icon.png, logo.png written");
