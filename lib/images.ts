/** Widths `scripts/resize-work.mjs` cuts below each screenshot's full size. */
export const SCREENSHOT_WIDTHS = [640, 1080, 1440] as const;

/** The variant file for one width: `/a/desktop.jpg` at 640 -> `/a/desktop-640.jpg`; full width keeps the original name. */
export function variantPath(src: string, width: number, fullWidth: number, ext: "jpg" | "webp"): string {
  const base = src.replace(/\.jpg$/, "");
  return width >= fullWidth ? `${base}.${ext}` : `${base}-${width}.${ext}`;
}

/** A srcset for a case study screenshot, or null for any other image. */
export function screenshotSrcSet(src: string, fullWidth: number, ext: "jpg" | "webp"): string | null {
  if (!src.startsWith("/images/work/") || !src.endsWith(".jpg")) return null;
  const widths = [...SCREENSHOT_WIDTHS.filter((w) => w < fullWidth), fullWidth];
  return widths.map((w) => `${variantPath(src, w, fullWidth, ext)} ${w}w`).join(", ");
}
