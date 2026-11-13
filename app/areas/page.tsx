import Link from "next/link";
import Footer from "@/components/sections/Footer";
import Nav from "@/components/sections/Nav";
import PageCTA from "@/components/sections/PageCTA";
import { Container } from "@/components/ui/Container";
import { AREAS } from "@/lib/data/areas";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Areas we work in",
  description:
    "Dorza works with small businesses across Australia. These are the areas we know best, with a page for each.",
  path: "/areas",
});

export default function AreasPage() {
  const ordered = [...AREAS].sort((a, b) => Number(b.isHub) - Number(a.isHub));

  return (
    <>
      <Nav />
      <main id="main">
        <section className="bg-chalk py-section-tight md:py-section">
          <Container>
            <h1 className="d-display d-display-md">Areas we work in.</h1>
            <p className="d-lede mt-6 max-w-text">
              We work with small businesses across Australia. These are the places we know best.
            </p>
            <ul className="m-0 mt-12 max-w-text list-none p-0">
              {ordered.map((area) => (
                <li key={area.slug} className="border-t border-rule-soft last:border-b">
                  <Link
                    href={`/areas/${area.slug}`}
                    className="flex items-center justify-between py-4 text-[17px] text-ink transition-colors duration-fast ease-dorza hover:text-pine"
                  >
                    {area.name}
                    <span aria-hidden className="font-mono text-[13px] text-pine">
                      &rarr;
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
        <PageCTA />
      </main>
      <Footer />
    </>
  );
}
