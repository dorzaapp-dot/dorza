import Link from "next/link";
import { visibleCaseStudies } from "@/lib/data/work";

/** Support's proof (spec §3): the clients Dorza still looks after. Renders nothing until one is public. */
export function SupportProof({ className }: { className?: string }) {
  const studies = visibleCaseStudies();
  if (studies.length === 0) return null;

  return (
    <p className={className ?? "d-body"}>
      We still look after{" "}
      {studies.map((c, i) => (
        <span key={c.slug}>
          {i > 0 ? (i === studies.length - 1 ? " and " : ", ") : null}
          <Link href={`/work/${c.slug}`} className="d-link">
            {c.client}
          </Link>
        </span>
      ))}
      , the businesses we built for.
    </p>
  );
}
