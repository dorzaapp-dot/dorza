"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import BookingForm from "@/components/forms/BookingForm";
import { Container } from "@/components/ui/Container";

function BookingDemo() {
  const searchParams = useSearchParams();
  const clientId = searchParams.get("clientId") ?? "";
  const submitEndpoint = process.env.NEXT_PUBLIC_BOOKING_SUBMIT_URL ?? "";
  const availabilityEndpoint = process.env.NEXT_PUBLIC_BOOKING_AVAILABILITY_URL ?? "";

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
          <div className="mb-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-3">
              Book an appointment
            </p>
            <h1 className="font-display text-[36px] leading-[1.05] tracking-[-0.02em] text-dark mb-2">
              Reserve your time
            </h1>
            <p className="text-text-secondary text-sm leading-relaxed">
              Pick a date and time below. You&apos;ll receive a confirmation by email straight away.
            </p>
          </div>
          <div className="bg-white border border-border rounded-card p-6 shadow-soft">
            <BookingForm
              clientId={clientId}
              submitEndpoint={submitEndpoint}
              availabilityEndpoint={availabilityEndpoint}
            />
          </div>
        </div>
      </Container>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense>
      <BookingDemo />
    </Suspense>
  );
}
