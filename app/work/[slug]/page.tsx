import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/sections/Footer";
import Nav from "@/components/sections/Nav";
import PageCTA from "@/components/sections/PageCTA";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { CASE_STUDIES, getCaseStudy } from "@/lib/data/work";
import { pageMetadata } from "@/lib/site";

export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

export const dynamicParams = false;

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const study = getCaseStudy(params.slug);
  if (!study) {
    return { title: "Case study coming soon", robots: { index: false, follow: false } };
  }
  return pageMetadata({
    title: `${study.client}: ${study.headline}`,
    description: study.metaDescription,
    path: `/work/${study.slug}`,
    image: `/images/og/${study.slug}.png`,
  });
}

function Holding() {
  return (
    <>
      <Nav />
      <main id="main" className="bg-chalk py-section md:py-section-large">
        <Container>
          <h1 className="d-display d-display-md">Not public yet.</h1>
          <p className="d-lede mt-6 max-w-text">
            We publish a case study once the business owner has said yes. This one is on its way.
          </p>
          <Link href="/" className="d-link mt-8 inline-block text-[15px]">
            Back to the homepage
          </Link>
        </Container>
      </main>
      <Footer />
    </>
  );
}

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const study = getCaseStudy(params.slug);
  if (!study) return <Holding />;

  return (
    <>
      <Nav />
      <main id="main">
        <section className="bg-chalk pb-section-tight pt-section-tight md:pb-section md:pt-section">
          <Container>
            <h1 className="d-display max-w-[16ch]">
              {study.headline}
            </h1>
            <Reveal delay={0.2}>
              <p className="d-lede mt-7 max-w-text">{study.summary}</p>
            </Reveal>

            <Reveal delay={0.3} className="mt-14">
              <ImageFrame src={study.shots.desktop} alt={study.shots.alt} width={2160} height={1350} priority />
            </Reveal>

            <dl className="m-0 mt-12 grid gap-x-8 gap-y-6 border-t border-rule-soft pt-8 sm:grid-cols-2 lg:grid-cols-5">
              {study.facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="d-label">{fact.label}</dt>
                  <dd className="d-mono m-0 mt-2 text-ink">
                    {fact.label === "Live site" ? (
                      <a href={study.liveUrl} className="d-link" rel="noopener noreferrer" target="_blank">
                        {fact.value}
                      </a>
                    ) : (
                      fact.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </Container>
        </section>

        <section className="bg-paper py-section-tight md:py-section">
          <Container>
            <div className="grid gap-8 md:grid-cols-12 md:gap-x-8">
              <Reveal className="md:col-span-4">
                <h2 className="d-heading">The problem.</h2>
              </Reveal>
              <Reveal delay={0.09} className="space-y-5 md:col-span-7 md:col-start-6">
                {study.problem.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)} className="d-lede">
                    {paragraph}
                  </p>
                ))}
              </Reveal>
            </div>
          </Container>
        </section>

        <section className="bg-chalk py-section-tight md:py-section">
          <Container>
            <div className="grid gap-12 md:grid-cols-12 md:gap-x-8">
              <div className="md:col-span-4">
                <Reveal>
                  <h2 className="d-heading">What we built.</h2>
                </Reveal>
                <Reveal delay={0.09} className="mt-8 hidden max-w-[260px] md:block">
                  <ImageFrame
                    src={study.shots.mobile}
                    alt={`${study.client} on a phone`}
                    width={780}
                    height={1688}
                  />
                </Reveal>
              </div>
              <Reveal stagger={0.045} className="md:col-span-7 md:col-start-6">
                {study.built.map((item) => (
                  <div key={item.title} className="border-t border-rule-soft py-6">
                    <h3 className="font-display text-[26px] font-medium leading-[1.1] tracking-[-0.014em] text-pine">
                      {item.title}
                    </h3>
                    <p className="d-body mt-3">{item.body}</p>
                  </div>
                ))}
              </Reveal>
            </div>
          </Container>
        </section>

        {study.result || study.quote ? (
          <section className="bg-haze py-section-tight md:py-section">
            <Container>
              <div className="max-w-text">
                <h2 className="d-heading">What happened.</h2>
                {study.result ? <p className="d-lede mt-6">{study.result}</p> : null}
                {study.quote ? (
                  <figure className="m-0 mt-10 border-t border-rule pt-6">
                    <blockquote className="m-0 font-display text-[24px] leading-[1.3] text-forest">
                      {study.quote.text}
                    </blockquote>
                    <figcaption className="d-label mt-4">
                      {study.quote.name} &middot; {study.quote.role}
                    </figcaption>
                  </figure>
                ) : null}
              </div>
            </Container>
          </section>
        ) : null}

        <PageCTA headline={study.closing} />
      </main>
      <Footer />
    </>
  );
}
