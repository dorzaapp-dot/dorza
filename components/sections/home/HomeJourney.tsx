import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { Spine, SpineStage } from "@/components/motion/Spine";
import { Container } from "@/components/ui/Container";
import { StatusTag } from "@/components/ui/StatusTag";
import { SupportProof } from "@/components/work/SupportProof";
import { WorkCard } from "@/components/work/WorkCard";
import { PILLARS, type PillarSlug } from "@/lib/data/pillars";
import { getCaseStudy } from "@/lib/data/work";

const LINK_LABEL: Record<PillarSlug, string> = {
  start: "How we get you started",
  grow: "How we help you grow",
  support: "How support works",
};

export default function HomeJourney() {
  return (
    <section aria-label="Start, grow, support" className="bg-chalk pb-section-tight md:pb-section">
      <Container>
        <Spine>
          {PILLARS.map((pillar, i) => {
            const proof = pillar.proofSlug ? getCaseStudy(pillar.proofSlug) : undefined;
            const live = pillar.services.filter((s) => s.status === "live");

            return (
              <SpineStage key={pillar.slug} marker={pillar.marker}>
                <Reveal>
                  <h2 className="d-display d-display-md">{pillar.headline}</h2>
                  <p className="d-lede mt-5 max-w-text">{pillar.lede}</p>
                </Reveal>

                <Reveal delay={0.09} className={proof ? "mt-9 grid gap-10 lg:grid-cols-2 lg:gap-x-12" : "mt-9 max-w-text"}>
                  <div>
                    <ul className="m-0 list-none p-0">
                      {live.map((s) => (
                        <li
                          key={s.name}
                          className="flex items-center justify-between gap-4 border-t border-rule-soft py-3 last:border-b"
                        >
                          <span className="text-[15px] text-ink">{s.name}</span>
                          <StatusTag status={s.status} />
                        </li>
                      ))}
                    </ul>
                    {pillar.slug === "support" ? <SupportProof className="d-body mt-6" /> : null}
                    <Link href={`/${pillar.slug}`} className="d-link mt-6 inline-block text-[15px]">
                      {LINK_LABEL[pillar.slug]}
                    </Link>
                  </div>

                  {proof ? <WorkCard study={proof} priority={i === 0} /> : null}
                </Reveal>
              </SpineStage>
            );
          })}
        </Spine>
      </Container>
    </section>
  );
}
