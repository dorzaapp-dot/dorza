import type { Metadata } from "next";
import type { ReactNode } from "react";

/** Dev harnesses for the client drop-ins. Never in search results. Not blocked in robots.txt, so Google can see this noindex. */
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function DemoLayout({ children }: { children: ReactNode }) {
  return children;
}
