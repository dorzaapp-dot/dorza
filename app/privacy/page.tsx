import Footer from "@/components/sections/Footer";
import Nav from "@/components/sections/Nav";
import { Container } from "@/components/ui/Container";
import { CONTACT_EMAIL } from "@/lib/seo";
import { ABN, pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Privacy policy",
  description: "What Dorza collects when you get in touch, why, where it's kept and how to have it removed.",
  path: "/privacy",
});

// Plain-English summary. Needs a lawyer's review before launch (spec §13).
// Adi to confirm the Supabase region before launch.
const SECTIONS = [
  {
    title: "What we collect.",
    body: "When you send an enquiry we collect your name, email address, business type, suburb or town, what you're interested in, and anything you write in the message. If you call or email us, we keep that correspondence.",
  },
  {
    title: "If you become a client.",
    body: "We ask for a fuller brief about your business through our onboarding form, and you can upload your logo and photos through a private client page with its own login. We use these to build and run your site.",
  },
  {
    title: "Why we collect it.",
    body: "To reply to you, prepare a quote and, if you become a customer, do the work. We don't sell your details and we don't pass them on for anyone else's marketing.",
  },
  {
    title: "Where it's kept.",
    body: "Enquiries, briefs, uploads and client logins are stored with Supabase. A copy of each onboarding brief is kept in a GitHub repository we control and use to build your site. We're notified by email through Google's Gmail. These services hold the data on our behalf, and they may store it outside Australia.",
  },
  {
    title: "Analytics.",
    body: "This site uses Vercel Web Analytics to count visits. It doesn't use cookies and doesn't identify you.",
  },
  {
    title: "Your choices.",
    body: "Ask us what we hold about you, ask us to correct it, or ask us to delete it. Email us and we'll do it.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main id="main" className="bg-chalk py-section-tight md:py-section">
        <Container>
          <h1 className="d-display d-display-md">Privacy.</h1>
          <p className="d-label mt-6">Last updated 12 November 2026</p>
          <div className="mt-12 max-w-text">
            {SECTIONS.map((s) => (
              <section key={s.title} className="border-t border-rule-soft py-7">
                <h2 className="font-display text-[26px] font-medium leading-[1.1] tracking-[-0.014em] text-pine">
                  {s.title}
                </h2>
                <p className="d-body mt-3">{s.body}</p>
              </section>
            ))}
            <section className="border-t border-rule-soft py-7">
              <h2 className="font-display text-[26px] font-medium leading-[1.1] tracking-[-0.014em] text-pine">
                Who we are.
              </h2>
              <p className="d-body mt-3">
                Dorza, ABN {ABN}, Sydney, Australia.{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="d-link">
                  {CONTACT_EMAIL}
                </a>
              </p>
            </section>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
