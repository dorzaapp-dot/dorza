import Footer from "@/components/sections/Footer";
import Nav from "@/components/sections/Nav";
import PageCTA from "@/components/sections/PageCTA";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "About",
  description:
    "Dorza is two founders in Sydney who look after the tech for small businesses across Australia: websites, booking systems and support.",
  path: "/about",
});

const FOUNDERS = [
  {
    name: "Mahir Mahbub",
    role: "Customers, product and strategy",
    line: "Mahir comes from product management and financial risk. He's the one you'll talk to first.",
  },
  {
    name: "Adi Widodo",
    role: "Build and infrastructure",
    line: "Adi comes from building tracking and attribution systems for media companies. He builds what we ship and keeps it running.",
  },
];

const PRINCIPLES = [
  {
    title: "We only promise what's live.",
    body: "If we can't deliver something next week, the site says \"ask us\", or says nothing.",
  },
  {
    title: "You own what we build.",
    body: "The site and everything on it are yours. If you leave, it goes with you.",
  },
  {
    title: "No lock-in.",
    body: "Monthly support runs month to month. We keep your business by being useful.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main id="main">
        <section className="bg-chalk py-section-tight md:py-section">
          <Container>
            <h1 className="d-display max-w-[14ch]">
              The tech team you don&rsquo;t have.
            </h1>
            <Reveal delay={0.2}>
              <p className="d-lede mt-7 max-w-text">
                Dorza is two founders in Sydney who look after the tech for small businesses across Australia.
              </p>
            </Reveal>
          </Container>
        </section>

        <section className="bg-paper py-section-tight md:py-section">
          <Container>
            <Reveal className="max-w-text space-y-5">
              <p className="d-lede">
                Big businesses have people for this. A web team, an IT desk, someone who knows why the email
                stopped working. Small businesses have the owner, at night, with a search engine.
              </p>
              <p className="d-lede">
                We started Dorza to be those people for businesses that can&rsquo;t hire them. We help you start,
                we help you grow, and we stay on to support you.
              </p>
            </Reveal>
          </Container>
        </section>

        <section className="bg-chalk py-section-tight md:py-section">
          <Container>
            <Reveal>
              <h2 className="d-heading">Who you&rsquo;ll deal with.</h2>
            </Reveal>
            <Reveal stagger={0.045} className="mt-10 grid gap-y-10 md:grid-cols-2 md:gap-x-12">
              {FOUNDERS.map((f) => (
                <div key={f.name} className="border-t border-rule pt-6">
                  <h3 className="font-display text-[26px] font-medium leading-[1.1] tracking-[-0.014em] text-pine">
                    {f.name}
                  </h3>
                  <p className="d-body mt-3">{f.line}</p>
                  <p className="d-label mt-4">{f.role}</p>
                </div>
              ))}
            </Reveal>
          </Container>
        </section>

        <section className="bg-haze py-section-tight md:py-section">
          <Container>
            <Reveal>
              <h2 className="d-heading">How we work.</h2>
            </Reveal>
            <Reveal stagger={0.045} className="mt-10 grid gap-y-8 md:grid-cols-3 md:gap-x-8">
              {PRINCIPLES.map((p) => (
                <div key={p.title} className="border-t border-forest/30 pt-5">
                  <h3 className="font-body text-[17px] font-semibold text-forest">{p.title}</h3>
                  <p className="d-body mt-2">{p.body}</p>
                </div>
              ))}
            </Reveal>
          </Container>
        </section>

        <PageCTA />
      </main>
      <Footer />
    </>
  );
}
