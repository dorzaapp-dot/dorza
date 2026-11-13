import { cn } from "@/lib/cn";
import { screenshotSrcSet } from "@/lib/images";

interface ImageFrameProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** How wide the frame renders, for the browser to pick a file. Defaults to full width. */
  sizes?: string;
  caption?: string;
  /** The page's largest image above the fold: load it first. */
  priority?: boolean;
  className?: string;
}

/**
 * A real screenshot or photo in the house frame: 2px corner, hairline, soft shadow.
 * Case study screenshots ship at 640px, 1080px and full size, in WebP and JPEG
 * (`scripts/resize-work.mjs`), so a phone downloads a phone-sized file.
 */
export function ImageFrame({ src, alt, width, height, sizes = "100vw", caption, priority = false, className }: ImageFrameProps) {
  const jpg = screenshotSrcSet(src, width, "jpg");
  const webp = screenshotSrcSet(src, width, "webp");
  const img = (
    // A plain <img>: the site is a static export with unoptimised next/image, which can't emit a srcset.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      srcSet={jpg ?? undefined}
      sizes={jpg ? sizes : undefined}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className="block h-auto w-full"
    />
  );

  return (
    <figure className={cn("m-0", className)}>
      <div className="overflow-hidden rounded-card border border-rule-soft bg-paper shadow-card">
        {webp ? (
          <picture>
            <source type="image/webp" srcSet={webp} sizes={sizes} />
            {img}
          </picture>
        ) : (
          img
        )}
      </div>
      {caption ? <figcaption className="d-label mt-3">{caption}</figcaption> : null}
    </figure>
  );
}
