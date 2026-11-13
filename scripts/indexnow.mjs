// Tells Bing (and the engines that share IndexNow: Yandex, Naver, Seznam) which pages changed.
// Google doesn't use IndexNow. Run after a deploy is live, since Bing fetches the key file from the site:
//   node scripts/indexnow.mjs            -> every URL in public/sitemap.xml
//   node scripts/indexnow.mjs /work /start  -> just those paths
import { readFileSync } from "node:fs";

const HOST = "www.dorza.com.au";
const KEY = readFileSync("lib/seo.ts", "utf8").match(/INDEXNOW_KEY = "([a-f0-9]{32})"/)?.[1];
if (!KEY) throw new Error("INDEXNOW_KEY not found in lib/seo.ts");

const paths = process.argv.slice(2);
const urlList = paths.length
  ? paths.map((p) => `https://${HOST}${p.startsWith("/") ? p : `/${p}`}`)
  : [...readFileSync("public/sitemap.xml", "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
});
// 200 or 202 means accepted. 403 means the key file isn't live yet; 422 means a URL isn't on this host.
console.log(`IndexNow: ${res.status} for ${urlList.length} URL(s)`);
if (!res.ok) process.exit(1);
