import Link from "next/link";
import { ImageFrame } from "@/components/ui/ImageFrame";
import type { CaseStudy } from "@/lib/data/work";

/** A case study teaser: the real site, the headline, one place-free line. The whole card is the link. */
export function WorkCard({ study, priority = false }: { study: CaseStudy; priority?: boolean }) {
  return (
    <Link
      href={`/work/${study.slug}`}
      className="group block transition-transform duration-fast ease-dorza hover:-translate-y-px"
    >
      <ImageFrame
        src={study.shots.desktop}
        alt={study.shots.alt}
        width={2160}
        height={1350}
        sizes="(min-width: 1200px) 576px, (min-width: 768px) 50vw, 100vw"
        priority={priority}
      />
      <h3 className="d-heading mt-6">{study.headline}</h3>
      <p className="d-body mt-3">{study.teaser}</p>
      <p className="d-label mt-5">
        {study.client} &middot; {study.industry}
      </p>
      <span className="d-link mt-3 inline-block text-[15px]">Read the case study</span>
    </Link>
  );
}
