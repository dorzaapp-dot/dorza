import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SMTPClient } from "https://deno.land/x/denomailer/mod.ts";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function sendEmail({ to, subject, html, attachments = [] }: {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{ filename: string; content: string; encoding?: string }>;
}) {
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

  try {
    await client.send({
      from: `Dorza <${gmailUser}>`,
      to,
      subject,
      content: " ",
      html,
      attachments,
    });
  } finally {
    await client.close();
  }
}

Deno.serve(async (req) => {
  console.log(`[onboard-submit] ${req.method} ${req.url}`);

  if (req.method === "OPTIONS") {
    console.log("[onboard-submit] CORS preflight — returning ok");
    return new Response("ok", { headers: CORS });
  }

  try {
    const { state, markdown } = await req.json();
    console.log(`[onboard-submit] payload received — business: "${state.businessName}", email: "${state.email}"`);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    console.log("[onboard-submit] inserting into onboard_submissions...");
    const { error: dbError } = await supabase.from("onboard_submissions").insert({
      email: state.email,
      business_name: state.businessName,
      owner_name: state.ownerName,
      markdown_content: markdown,
      state_json: state,
    });

    if (dbError) {
      console.error("[onboard-submit] DB insert failed:", dbError);
      throw dbError;
    }
    console.log("[onboard-submit] DB insert OK");

    const mdBytes = new TextEncoder().encode(markdown);
    let mdBinary = "";
    for (const byte of mdBytes) mdBinary += String.fromCharCode(byte);
    const mdBase64 = btoa(mdBinary);

    console.log("[onboard-submit] sending notification email to Adi...");
    await sendEmail({
      to: "dorza.app@gmail.com",
      subject: `New brief: ${state.businessName || state.email}`,
      html: `<p>New onboarding submission from <strong>${state.ownerName || state.email}</strong>.</p><p>See attached intake.md.</p>`,
      attachments: [{ filename: "intake.md", content: mdBase64, encoding: "base64" }],
    });
    console.log("[onboard-submit] notification email sent");

    if (state.email) {
      console.log(`[onboard-submit] sending confirmation email to client: ${state.email}`);
      await sendEmail({
        to: state.email,
        subject: "We've received your brief!",
        html: `<p>Hi ${state.ownerName || "there"},</p><p>Thanks for submitting your brief — we'll be in touch shortly to get started on your website.</p><p>— The Dorza team</p>`,
      });
      console.log("[onboard-submit] confirmation email sent");
    }

    console.log("[onboard-submit] done — returning success");
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[onboard-submit] unhandled error:", err);
    return new Response(JSON.stringify({ success: false, error: String(err) }), {
      status: 500,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
});
