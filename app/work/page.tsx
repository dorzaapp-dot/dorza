import Footer from "@/components/sections/Footer";
import Nav from "@/components/sections/Nav";
import PageCTA from "@/components/sections/PageCTA";
import { LineReveal } from "@/components/motion/LineReveal";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { WorkCard } from "@/components/work/WorkCard";
import { visibleCaseStudies } from "@/lib/data/work";
import { pageMetadata } from "@/lib/site";

export const metadata = {
  ...pageMetadata({
    title: "Work",
    description: "Real businesses and live sites built and looked after by Dorza. Click through and use them.",
    path: "/work",
  }),
  // Until a case study is public, the index is a holding page and stays out of search.
  robots: visibleCaseStudies().length > 0 ? undefined : { index: false, follow: true },
};

export default function WorkPage() {
  const studies = visibleCaseStudies();

  return (
    <>
      <Nav />
      <main id="main">
        <section className="bg-chalk py-section-tight md:py-section">
          <Container>
            <h1 className="d-display">
              <LineReveal lines={["The work."]} />
            </h1>
            <Reveal delay={0.2}>
              <p className="d-lede mt-7 max-w-text">
                {studies.length > 0
                  ? "Real businesses, live sites. Click through and use them."
                  : "We publish a case study once the business owner has said yes. The first ones are on their way."}
              </p>
            </Reveal>

            {studies.length > 0 ? (
              <div className="mt-14 grid gap-x-12 gap-y-16 md:grid-cols-2">
                {studies.map((study, i) => (
                  <Reveal key={study.slug} delay={0.09 * i}>
                    <WorkCard study={study} priority={i < 2} />
                  </Reveal>
                ))}
              </div>
            ) : null}
          </Container>
        </section>
        <PageCTA />
      </main>
      <Footer />
    </>
  );
}
