import { Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

const promises = [
  "You'll see a real, working website — not a proposal or a mood board.",
  "Not happy with what we build? You don't pay.",
  "No lock-in — and you own everything we build.",
];

export default function TooGoodToBeTrue() {
  return (
    <section
      id="how-we-do-it"
      className="scroll-mt-24 py-16 md:py-[7.5rem] bg-warm"
    >
      <Container>
        <Reveal>
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-4">
              {"// Too good to be true?"}
            </p>
            <h2 className="font-display text-[44px] md:text-[60px] leading-[1.02] tracking-[-0.025em] text-dark">
              How can it be this fast — and this affordable?
            </h2>
            <p className="mt-6 text-[17px] md:text-[18px] text-text-secondary leading-relaxed">
              Fair question. The answer&apos;s simple: we&apos;ve cut everything
              a traditional agency charges you for that doesn&apos;t actually
              help your business. No pitch decks. No drawn-out discovery phases.
              No layers of account managers. No six-week timelines. A small,
              senior team works a leaner way — so you get agency-quality work in
              a fraction of the time, without the agency price tag.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12 max-w-2xl rounded-card border border-border bg-white p-6 md:p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-5">
              {"// The Dorza promise"}
            </p>
            <ul className="space-y-4">
              {promises.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check
                    size={16}
                    className="mt-1 shrink-0 text-accent"
                    aria-hidden
                  />
                  <span className="text-[17px] md:text-[18px] text-text-secondary leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-12">
            <a
              href="#waitlist"
              className="inline-flex items-center justify-center h-12 px-6 bg-primary hover:bg-primary-dark text-white font-semibold text-sm rounded-full transition-all duration-300 ease-dorza hover:-translate-y-px hover:shadow-medium active:translate-y-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Get my free audit →
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
