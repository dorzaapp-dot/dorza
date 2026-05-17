import Link from "next/link";

export const metadata = {
  title: "Page not found — Dorza",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-surface flex items-center justify-center px-5">
      <div className="text-center max-w-md">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-4">
          404
        </p>
        <h1 className="font-display text-[44px] md:text-[60px] leading-[1.02] tracking-[-0.025em] text-dark mb-4">
          We couldn&apos;t find that page.
        </h1>
        <p className="text-text-secondary leading-relaxed mb-8">
          The link may be broken, or the page may have moved. Head back home and we&apos;ll get you where you need to go.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center h-12 px-6 bg-primary hover:bg-primary-dark text-white font-semibold text-sm rounded-full transition-all duration-300 ease-dorza hover:-translate-y-px hover:shadow-medium"
        >
          Back to homepage
        </Link>
      </div>
    </main>
  );
}
