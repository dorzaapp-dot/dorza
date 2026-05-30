const footerLinks = [
  { label: "Services", href: "#services" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "mailto:customer@dorza.com.au" },
];

const socialLinks = [
  {
    href: "#",
    label: "Instagram",
    svg: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
  {
    href: "#",
    label: "LinkedIn",
    svg: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    href: "#",
    label: "X (Twitter)",
    svg: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-dark text-white">
      <div className="max-w-6xl mx-auto px-5 py-14 md:py-20">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <a href="/" className="font-display font-bold text-2xl">
              d<span className="text-primary">o</span>rza
            </a>
            <p className="mt-3 text-white/60 text-sm leading-relaxed">
              The AI-powered agency for local business.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4 font-body">
              Links
            </h4>
            <ul className="space-y-2">
              {footerLinks.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4 font-body">
              Contact
            </h4>
            <a
              href="mailto:customer@dorza.com.au"
              className="text-white/60 hover:text-white text-sm transition-colors"
            >
              customer@dorza.com.au
            </a>
            <div className="flex gap-4 mt-4">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  {s.svg}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-white/40 text-xs">
          <p>&copy; 2026 Dorza. All rights reserved.</p>
          <p>Sydney, Australia</p>
        </div>
      </div>
    </footer>
  );
}
