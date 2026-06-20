"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ChatWidget from "@/components/ChatWidget";
import { Container } from "@/components/ui/Container";

function ChatbotDemo() {
  const searchParams = useSearchParams();
  const clientId = searchParams.get("clientId") ?? "";
  const businessName = searchParams.get("businessName") ?? "Demo Business";
  const accentColor = searchParams.get("accentColor") ?? "#D4845A";

  if (!clientId) {
    return (
      <main className="min-h-screen bg-surface flex items-center justify-center">
        <Container>
          <div className="max-w-lg mx-auto text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-3">
              Chatbot demo
            </p>
            <h1 className="font-display text-[36px] leading-[1.05] tracking-[-0.02em] text-dark mb-4">
              AI Chat Widget
            </h1>
            <p className="text-text-secondary text-sm leading-relaxed mb-6">
              Add a{" "}
              <code className="bg-white border border-border px-2 py-0.5 rounded-lg text-dark">
                clientId
              </code>{" "}
              query parameter to test the chatbot. Optionally include{" "}
              <code className="bg-white border border-border px-2 py-0.5 rounded-lg text-dark">
                businessName
              </code>{" "}
              and{" "}
              <code className="bg-white border border-border px-2 py-0.5 rounded-lg text-dark">
                accentColor
              </code>
              .
            </p>
            <div className="bg-white border border-border rounded-card p-5 text-left">
              <p className="text-text-muted text-xs font-mono leading-relaxed break-all">
                /demo/chatbot?clientId=<span className="text-accent">your-uuid</span>
                &amp;businessName=<span className="text-accent">Acme Barber</span>
                &amp;accentColor=<span className="text-accent">%23D4845A</span>
              </p>
            </div>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface py-16">
      <Container>
        <div className="max-w-lg mx-auto">
          <div className="mb-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-3">
              Chatbot demo
            </p>
            <h1 className="font-display text-[36px] leading-[1.05] tracking-[-0.02em] text-dark mb-2">
              {businessName}
            </h1>
            <p className="text-text-secondary text-sm leading-relaxed">
              Click the chat bubble at the bottom-right to start a conversation.
              Try asking about services, availability, or making a booking.
            </p>
          </div>

          <div className="bg-white border border-border rounded-card p-6 shadow-soft">
            <h2 className="font-body text-sm font-semibold text-dark mb-4">
              Try these prompts
            </h2>
            <ul className="space-y-2.5 text-text-secondary text-sm">
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">&#x2022;</span>
                &quot;What services do you offer?&quot;
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">&#x2022;</span>
                &quot;Do you have any spots available tomorrow?&quot;
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">&#x2022;</span>
                &quot;I&apos;d like to book an appointment for Friday at 2pm&quot;
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">&#x2022;</span>
                &quot;What are your opening hours?&quot;
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">&#x2022;</span>
                &quot;Where are you located?&quot;
              </li>
            </ul>
          </div>
        </div>
      </Container>

      <ChatWidget
        clientId={clientId}
        businessName={businessName}
        accentColor={accentColor}
      />
    </main>
  );
}

export default function Page() {
  return (
    <Suspense>
      <ChatbotDemo />
    </Suspense>
  );
}
