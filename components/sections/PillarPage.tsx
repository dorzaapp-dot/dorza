import Link from "next/link";
import Footer from "@/components/sections/Footer";
import Nav from "@/components/sections/Nav";
import PageCTA from "@/components/sections/PageCTA";
import { LineReveal } from "@/components/motion/LineReveal";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { StatusTag } from "@/components/ui/StatusTag";
import { buttonClasses } from "@/components/ui/buttonClasses";
import { WorkCard } from "@/components/work/WorkCard";
import { cn } from "@/lib/cn";
import { PILLARS, getPillar, type PillarSlug } from "@/lib/data/pillars";
import { getCaseStudy } from "@/lib/data/work";
import { CTA_LABEL } from "@/lib/site";

export default function PillarPage({ slug }: { slug: PillarSlug }) {
  const pillar = getPillar(slug);
  const proof = pillar.proofSlug ? getCaseStudy(pillar.proofSlug) : undefined;
  const ordered = [...pillar.services].sort((a, b) => (a.status === b.status ? 0 : a.status === "live" ? -1 : 1));

  return (
    <>
      <Nav />
      <main id="main">
        <section className="bg-chalk py-section-tight md:py-section">
          <Container>
            <h1 className="d-display">
              <LineReveal lines={[pillar.headline]} />
            </h1>
            <Reveal delay={0.2}>
              <p className="d-lede mt-7 max-w-text">{pillar.lede}</p>
              <div className="mt-9">
                <Link href="/#quote" className={buttonClasses("primary", "lg")}>
                  {CTA_LABEL}
                </Link>
              </div>
              <ol aria-label="Stages" className="m-0 mt-12 flex list-none gap-7 border-t border-rule-soft p-0 pt-2">
                {PILLARS.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/${p.slug}`}
                      aria-current={p.slug === slug ? "step" : undefined}
                      className={cn(
                        "d-label inline-flex min-h-11 items-center transition-colors duration-fast ease-dorza hover:text-forest",
                        p.slug === slug && "!text-forest underline decoration-pine decoration-[1.5px] underline-offset-[6px]"
                      )}
                    >
                      {p.name}
                    </Link>
                  </li>
                ))}
              </ol>
            </Reveal>
          </Container>
        </section>

        <section className="bg-paper py-section-tight md:py-section">
          <Container>
            <div className="grid gap-12 md:grid-cols-12 md:gap-x-8">
              <Reveal className="md:col-span-5">
                <h2 className="d-heading">What&rsquo;s in it.</h2>
                <p className="d-body mt-5">{pillar.intro}</p>
              </Reveal>

              <Reveal delay={0.09} className="md:col-span-7">
                <ul className="m-0 list-none p-0">
                  {ordered.map((s) => (
                    <li key={s.name} className="border-t border-rule-soft py-5 last:border-b">
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="font-body text-[17px] font-semibold text-ink">{s.name}</h3>
                        <StatusTag status={s.status} />
                      </div>
                      <p className="d-body mt-2">{s.blurb}</p>
                      {s.href ? (
                        <Link href={s.href} className="d-link mt-2 inline-block text-[14px]">
                          More on this
                        </Link>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </Container>
        </section>

        <section className="bg-chalk py-section-tight md:py-section">
          <Container>
            <Reveal>
              <h2 className="d-heading">How it goes.</h2>
            </Reveal>
            <Reveal stagger={0.045} className="mt-10 grid gap-y-8 md:grid-cols-3 md:gap-x-8">
              {pillar.steps.map((step, i) => (
                <div key={step.title} className="border-t border-rule pt-5 md:border-l md:border-t-0 md:pl-6 md:pt-0">
                  <p className="d-mono text-pine">{i + 1}</p>
                  <h3 className="mt-3 font-body text-[17px] font-semibold text-ink">{step.title}</h3>
                  <p className="d-body mt-2">{step.body}</p>
                </div>
              ))}
            </Reveal>
          </Container>
        </section>

        {proof ? (
          <section className="bg-haze py-section-tight md:py-section">
            <Container>
              <div className="grid gap-10 md:grid-cols-12 md:gap-x-8">
                <Reveal className="md:col-span-4">
                  <h2 className="d-heading">A business we did this for.</h2>
                </Reveal>
                <Reveal delay={0.09} className="md:col-span-7 md:col-start-6">
                  <WorkCard study={proof} />
                </Reveal>
              </div>
            </Container>
          </section>
        ) : null}

        <PageCTA />
      </main>
      <Footer />
    </>
  );
}
