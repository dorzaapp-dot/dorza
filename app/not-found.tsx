import Link from "next/link";
import { buttonClasses } from "@/components/ui/buttonClasses";

export const metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main id="main" className="flex min-h-screen items-center bg-chalk px-6">
      <div className="mx-auto max-w-text">
        <h1 className="d-display d-display-md">That page isn&rsquo;t here.</h1>
        <p className="d-lede mt-6">The link may be old, or the page may have moved.</p>
        <Link href="/" className={buttonClasses("primary", "default", "mt-8")}>
          Back to the homepage
        </Link>
      </div>
    </main>
  );
}
