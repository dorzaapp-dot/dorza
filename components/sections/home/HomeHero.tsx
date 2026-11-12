import Link from "next/link";
import { LineReveal } from "@/components/motion/LineReveal";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { buttonClasses } from "@/components/ui/buttonClasses";
import { hasPublicWork } from "@/lib/data/workStatus";
import { CTA_LABEL } from "@/lib/site";

export default function HomeHero() {
  const showWork = hasPublicWork();

  return (
    <section className="bg-chalk pb-6 pt-16 md:pb-10 md:pt-24">
      <Container>
        <h1 className="d-display">
          <LineReveal
            lines={[
              "You run the business.",
              <>
                We&rsquo;ll <em className="d-display-italic">mind</em> the tech.
              </>,
            ]}
          />
        </h1>

        <Reveal delay={0.3}>
          <p className="d-lede mt-7 max-w-text">
            Dorza gets Australian small businesses online, helps them grow, and looks after the tech that keeps
            them running. One team. No lock-in.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Link href="#quote" className={buttonClasses("primary", "lg")}>
              {CTA_LABEL}
            </Link>
            {showWork ? (
              <Link href="/work" className="d-link inline-block text-[15px]">
                See the work
              </Link>
            ) : null}
          </div>

          <p className="d-label mt-7">Quote within 72 hours &middot; No lock-in</p>
        </Reveal>
      </Container>
    </section>
  );
}
