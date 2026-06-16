import { Container } from "@/components/ui/Container";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/seo";

const serviceLinks = [
  { label: "Web Design", href: "/services/web-design" },
  { label: "Social Media", href: "/services/social-media-management" },
  { label: "Google Business", href: "/services/google-business-profile" },
  { label: "Local SEO", href: "/services/local-seo" },
];

const areaLinks = [
  { label: "Western Sydney", href: "/areas/western-sydney" },
  { label: "Parramatta", href: "/areas/parramatta" },
  { label: "Blacktown", href: "/areas/blacktown" },
  { label: "Penrith", href: "/areas/penrith" },
  { label: "Liverpool", href: "/areas/liverpool" },
  { label: "Campbelltown", href: "/areas/campbelltown" },
];

const industryLinks = [
  { label: "Cafes & Restaurants", href: "/industries/cafes-restaurants" },
  { label: "Tradies", href: "/industries/tradies" },
  { label: "Salons & Beauty", href: "/industries/salons-beauty" },
];

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Pricing", href: "/#pricing" },
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <a
              href="/"
              className="inline-block font-display text-[30px] leading-none"
              aria-label="Dorza home"
            >
              d<span className="text-primary">o</span>rza
            </a>
            <p className="mt-3 text-white/50 text-sm leading-relaxed">
              Web design and digital marketing for Western Sydney small business.
            </p>
            <p className="mt-2 text-white/45 font-mono text-[11px]">Parramatta, NSW 2150</p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-widest text-white/55 mb-4">
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

          {/* Areas */}
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-widest text-white/55 mb-4">
              Areas
            </h4>
            <ul className="space-y-2.5">
              {areaLinks.map((l) => (
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

          {/* Industries */}
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-widest text-white/55 mb-4">
              Industries
            </h4>
            <ul className="space-y-2.5">
              {industryLinks.map((l) => (
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

          {/* Company + Contact */}
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-widest text-white/55 mb-4">
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
            <a
              href={`tel:${PHONE_TEL}`}
              className="block mt-5 text-white/60 hover:text-white text-sm transition-colors duration-[160ms]"
            >
              {PHONE_DISPLAY}
            </a>
            <a
              href="mailto:customer@dorza.com.au"
              className="block mt-2 text-white/60 hover:text-white text-sm transition-colors duration-[160ms]"
            >
              customer@dorza.com.au
            </a>
            <div className="flex gap-4 mt-4">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/55 hover:text-accent-light transition-colors duration-300 ease-dorza"
                >
                  {s.svg}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <p className="font-mono text-[11px] text-white/45 uppercase tracking-[0.18em]">
            © 2026 dorza · made in sydney
          </p>
          <p className="font-mono text-[11px] text-white/45 uppercase tracking-[0.18em]">
            Built with care and good taste
          </p>
        </div>
      </Container>
    </footer>
  );
}
