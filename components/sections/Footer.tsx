import { Container } from "@/components/ui/Container";

const serviceLinks = [
  { label: "Website", href: "#services" },
  { label: "Social media", href: "#services" },
  { label: "Research & strategy", href: "#services" },
  { label: "AI agents", href: "#services" },
];

const companyLinks = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Join waitlist", href: "/waitlist" },
];

const socialLinks = [
  {
    href: "https://www.instagram.com/dorza.ai/",
    label: "Instagram",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
  {
    href: "https://www.linkedin.com/company/dorzaai/",
    label: "LinkedIn",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-dark text-white">
      <Container className="py-16 md:py-20">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <a
              href="/"
              className="inline-block font-display text-[30px] leading-none animate-breathe"
              aria-label="Dorza home"
            >
              d<span className="text-primary">o</span>rza
            </a>
            <p className="mt-3 text-white/50 text-sm leading-relaxed">
              The AI-powered agency for Sydney local business.
            </p>
            <p className="mt-2 text-white/30 font-mono text-[11px]">Sydney, NSW 2000</p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="font-mono text-[11px] uppercase tracking-widest text-white/40 mb-4">
                Services
              </h4>
              <ul className="space-y-2.5">
                {serviceLinks.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-white/60 hover:text-white text-sm transition-colors duration-[160ms]"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-mono text-[11px] uppercase tracking-widest text-white/40 mb-4">
                Company
              </h4>
              <ul className="space-y-2.5">
                {companyLinks.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-white/60 hover:text-white text-sm transition-colors duration-[160ms]"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-widest text-white/40 mb-4">
              Contact
            </h4>
            <a
              href="mailto:hello@dorza.com.au"
              className="text-white/60 hover:text-white text-sm transition-colors duration-[160ms]"
            >
              hello@dorza.com.au
            </a>
            <div className="flex gap-4 mt-5">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-accent-light transition-colors duration-300 ease-dorza"
                >
                  {s.svg}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <p className="font-mono text-[11px] text-white/30 uppercase tracking-[0.18em]">
            © 2026 dorza · made in sydney
          </p>
          <p className="font-mono text-[11px] text-white/30 uppercase tracking-[0.18em]">
            Made with AI and good taste
          </p>
        </div>
      </Container>
    </footer>
  );
}
