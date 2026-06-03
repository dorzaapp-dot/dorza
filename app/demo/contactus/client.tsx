"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import ContactForm from "@/components/forms/ContactForm";
import { Container } from "@/components/ui/Container";

export default function DemoContactUsContent() {
  const searchParams = useSearchParams();
  const [clientId, setClientId] = useState(searchParams.get("clientId") || "");
  const [endpoint, setEndpoint] = useState(
    searchParams.get("endpoint") || process.env.NEXT_PUBLIC_CONTACT_SUBMIT_URL || ""
  );

  return (
    <main className="min-h-screen bg-surface py-12">
      <Container>
        <div className="space-y-8">
          <div>
            <h1 className="font-display text-4xl text-dark mb-4">Contact Form Demo</h1>
            <p className="text-text-secondary">
              Test the reusable contact form component. Inject <code className="bg-white px-2 py-1 rounded text-sm">clientId</code> and{" "}
              <code className="bg-white px-2 py-1 rounded text-sm">endpoint</code> via URL params.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Client ID</label>
                <input
                  type="text"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  placeholder="e.g. onboard_submission_uuid"
                  className="w-full rounded-2xl border border-border bg-white px-4 py-2 text-dark placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <p className="text-xs text-text-muted mt-1">
                  This is the <code>onboard_submissions.id</code> used to look up the client&apos;s email.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Endpoint URL</label>
                <input
                  type="text"
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                  placeholder="https://your-edge-function-url/contact-submit"
                  className="w-full rounded-2xl border border-border bg-white px-4 py-2 text-dark placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <p className="text-xs text-text-muted mt-1">
                  The Edge Function endpoint. Set via <code>NEXT_PUBLIC_CONTACT_SUBMIT_URL</code> env var.
                </p>
              </div>

              <div className="bg-white border border-border rounded-3xl p-4 space-y-2">
                <p className="text-sm font-semibold text-dark">Quick URL params:</p>
                <p className="text-xs text-text-secondary">
                  <code className="bg-surface px-1 py-0.5 rounded">?clientId=YOUR_ID&endpoint=YOUR_URL</code>
                </p>
              </div>
            </div>

            <div className="bg-white border border-border rounded-3xl p-6">
              {clientId && endpoint ? (
                <ContactForm clientId={clientId} endpoint={endpoint} source="demo" />
              ) : (
                <div className="text-center py-12">
                  <p className="text-text-muted">
                    {!clientId ? "Enter a Client ID" : ""}
                    {!clientId && !endpoint ? " and an " : !endpoint ? "" : ""}
                    {!endpoint ? "Endpoint URL" : ""} to see the form.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
