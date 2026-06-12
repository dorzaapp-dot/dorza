"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ContactForm from "@/components/forms/ContactForm";
import { Container } from "@/components/ui/Container";

function ContactUsDemo() {
  const searchParams = useSearchParams();
  const clientId = searchParams.get("clientId") ?? "";
  const endpoint = process.env.NEXT_PUBLIC_CONTACT_SUBMIT_URL ?? "";

  if (!clientId) {
    return (
      <main className="min-h-screen bg-surface flex items-center justify-center">
        <p className="text-text-muted text-sm">
          Missing{" "}
          <code className="bg-white border border-border px-2 py-0.5 rounded-lg text-dark">
            clientId
          </code>{" "}
          query parameter.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface py-16">
      <Container>
        <div className="max-w-lg mx-auto">
          <ContactForm clientId={clientId} endpoint={endpoint} source="demo" />
        </div>
      </Container>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense>
      <ContactUsDemo />
    </Suspense>
  );
}
