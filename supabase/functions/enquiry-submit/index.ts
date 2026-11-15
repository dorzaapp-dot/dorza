import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SMTPClient } from "https://deno.land/x/denomailer/mod.ts";
import { handleEnquiry, type EnquiryDeps } from "./handler.ts";

// Supabase Edge Runtime global: keeps the isolate alive for work that outlives the response.
declare const EdgeRuntime: { waitUntil(promise: Promise<unknown>): void } | undefined;

const ADMIN_FALLBACK = "dorza.app@gmail.com";

async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const gmailUser = Deno.env.get("GMAIL_USER")!;
  const gmailPassword = Deno.env.get("GMAIL_APP_PASSWORD")!;

  const client = new SMTPClient({
    connection: {
      hostname: "smtp.gmail.com",
      port: 465,
      tls: true,
      auth: { username: gmailUser, password: gmailPassword },
    },
  });

  // Each send was observed taking ~7.6s in production. These timings show whether the
  // time goes on connect+send or on close.
  const t0 = performance.now();
  let sentAt = t0;
  try {
    await client.send({ from: `Dorza <${gmailUser}>`, to, subject, content: " ", html });
    sentAt = performance.now();
  } finally {
    await client.close();
    const done = performance.now();
    console.log(
      `[enquiry-submit] smtp timing — send=${Math.round(sentAt - t0)}ms close=${Math.round(done - sentAt)}ms total=${Math.round(done - t0)}ms`,
    );
  }
}

const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

const deps: EnquiryDeps = {
  async insertEnquiry(row) {
    const { data, error } = await supabase.from("enquiries").insert(row).select("id").single();
    if (error) throw error;
    return { id: data.id };
  },
  sendEmail,
  // Answer the browser now; keep the isolate alive until the emails settle. Without
  // background support, return the task so the handler waits for it (old behaviour).
  runInBackground(task) {
    if (typeof EdgeRuntime !== "undefined") {
      EdgeRuntime.waitUntil(task);
      return;
    }
    return task.then(() => undefined);
  },
  adminEmail: Deno.env.get("ADMIN_NOTIFICATION_EMAIL") || ADMIN_FALLBACK,
  log: console,
};

Deno.serve((req) => {
  console.log(`[enquiry-submit] ${req.method} ${req.url}`);
  return handleEnquiry(req, deps);
});
