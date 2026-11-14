import { LineReveal } from "@/components/motion/LineReveal";
import { HeroRise } from "@/components/motion/HeroRise";
import { NeedPicker } from "@/components/sections/home/NeedPicker";
import { Container } from "@/components/ui/Container";

/*
 * Sized so the whole hero, choices and quote button included, fits one screen: 1280×800 and
 * up on desktop, 390×844 on a phone (375×667 drops the answer's sentence; see globals.css).
 */
export default function HomeHero() {
  return (
    <section className="bg-chalk pb-section-tight pt-6 md:pb-section md:pt-10 lg:pt-12">
      <Container>
        <NeedPicker
          intro={
            <>
              <h1 className="d-display hero-title">
                <LineReveal
                  lines={[
                    "Whatever the tech,",
                    <>
                      we&rsquo;ll <em className="d-display-italic">sort</em> it.
                    </>,
                  ]}
                />
              </h1>

              <HeroRise delay={0.3}>
                <p className="hero-lede d-lede mt-3 max-w-[30rem] md:mt-5">
                  Pick what you need. One team builds it, then stays to look after it.
                </p>
              </HeroRise>
            </>
          }
        />
      </Container>
    </section>
  );
}
