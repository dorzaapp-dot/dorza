import { LineReveal } from "@/components/motion/LineReveal";
import { HeroRise } from "@/components/motion/HeroRise";
import { NeedPicker } from "@/components/sections/home/NeedPicker";
import { Container } from "@/components/ui/Container";

export default function HomeHero() {
  return (
    <section className="bg-chalk pb-section-tight pt-16 md:pb-section md:pt-24">
      <Container>
        <h1 className="d-display">
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
          <p className="d-lede mt-7 max-w-text">
            Pick what you need and see what we&rsquo;d set up. One team builds it, then stays to look after it.
          </p>
        </HeroRise>

        <NeedPicker />
      </Container>
    </section>
  );
}
