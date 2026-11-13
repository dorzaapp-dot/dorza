import Image from "next/image";
import { cn } from "@/lib/cn";

interface ImageFrameProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  priority?: boolean;
  className?: string;
}

/** A real screenshot or photo in the house frame: 2px corner, hairline, soft shadow. */
export function ImageFrame({ src, alt, width, height, caption, priority = false, className }: ImageFrameProps) {
  return (
    <figure className={cn("m-0", className)}>
      <div className="overflow-hidden rounded-card border border-rule-soft bg-paper shadow-card">
        <Image src={src} alt={alt} width={width} height={height} priority={priority} className="block h-auto w-full" />
      </div>
      {caption ? <figcaption className="d-label mt-3">{caption}</figcaption> : null}
    </figure>
  );
}
