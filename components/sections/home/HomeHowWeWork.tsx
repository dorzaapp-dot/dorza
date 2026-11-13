import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { PlusList } from "@/components/ui/PlusList";

export default function HomeHowWeWork() {
  return (
    <section className="bg-paper py-section-tight md:py-section">
      <Container>
        <div className="grid gap-10 md:grid-cols-12 md:gap-x-8">
          <Reveal className="md:col-span-5">
            <h2 className="d-display d-display-md">Small team. Sharp tools.</h2>
          </Reveal>

          <Reveal delay={0.09} className="md:col-span-6 md:col-start-7">
            <p className="d-lede">
              We&rsquo;re two founders. We use AI to build faster, which keeps the price within reach of a small
              business.
            </p>
            <p className="d-body mt-5">You deal with us directly, from the first call to the tenth change.</p>
            <PlusList
              className="mt-8"
              items={[
                "You see the real site before it goes live.",
                "You own what we build.",
                "No lock-in. Stop any time.",
              ]}
            />
            <Link href="/about" className="d-link mt-7 inline-block text-[15px]">
              About Dorza
            </Link>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
