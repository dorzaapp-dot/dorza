import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { WorkCard } from "@/components/work/WorkCard";
import type { CaseStudy } from "@/lib/data/work";

/** Closing proof block for service and area pages. Renders nothing when no study applies. */
export function RelatedWork({ studies }: { studies: CaseStudy[] }) {
  if (studies.length === 0) return null;

  return (
    <section className="bg-haze py-section-tight md:py-section">
      <Container>
        <Reveal>
          <h2 className="d-heading">{studies.length > 1 ? "Businesses we did this for." : "A business we did this for."}</h2>
        </Reveal>
        <Reveal stagger={0.045} className="mt-10 grid gap-12 md:grid-cols-2 md:gap-x-8">
          {studies.map((study) => (
            <WorkCard key={study.slug} study={study} />
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
