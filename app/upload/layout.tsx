import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upload your assets — Dorza",
  robots: { index: false, follow: false, nocache: true },
};

export default function UploadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
