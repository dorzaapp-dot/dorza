import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SMTPClient } from "https://deno.land/x/denomailer/mod.ts";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Payload = {
  clientId?: string;
  source?: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  metadata?: Record<string, unknown>;
  website?: string;
};

async function sendEmail({ to, subject, html }: {
  to: string;
  subject: string;
  html: string;
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
      from: `Dorza <dorza.app@gmail.com>`,
      to,
      subject,
      content: " ",
      html,
    });
  } finally {
    await client.close();
  }
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

Deno.serve(async (req) => {
  console.log(`[contact-submit] ${req.method} ${req.url}`);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS });
  }

  try {
    const body = (await req.json()) as Payload;

    if (body.website && body.website.trim().length > 0) {
      console.log("[contact-submit] honeypot triggered — discarding");
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    const clientId = (body.clientId ?? "").trim();
    const name = (body.name ?? "").trim();
    const email = (body.email ?? "").trim().toLowerCase();
    const phone = (body.phone ?? "").trim() || null;
    const message = (body.message ?? "").trim() || null;
    const source = (body.source ?? "contact-form").trim() || "contact-form";
    const metadata = {
      ...(typeof body.metadata === "object" && body.metadata ? body.metadata : {}),
      user_agent: req.headers.get("user-agent") ?? null,
    };

    if (!clientId || !name || !email) {
      return new Response(JSON.stringify({ success: false, error: "clientId, name and email are required." }), {
        status: 400,
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    if (!EMAIL_RE.test(email)) {
      return new Response(JSON.stringify({ success: false, error: "Invalid email address." }), {
        status: 400,
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: clientRow, error: clientRowError } = await supabase
      .from("onboard_submissions")
      .select("email")
      .eq("id", clientId)
      .single();

    if (clientRowError || !clientRow?.email) {
      console.error("[contact-submit] failed to resolve client email for clientId=", clientId, clientRowError);
      return new Response(JSON.stringify({ success: false, error: "Unable to resolve client recipient email." }), {
        status: 400,
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    const clientEmail = (clientRow.email as string).trim().toLowerCase();
    if (!EMAIL_RE.test(clientEmail)) {
      console.error("[contact-submit] invalid client email for clientId=", clientId, clientEmail);
      return new Response(JSON.stringify({ success: false, error: "Client recipient email is invalid." }), {
        status: 400,
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    console.log(`[contact-submit] inserting contact for clientId="${clientId}" email="${email}" recipient="${clientEmail}"`);
    const { data: insertData, error: dbError } = await supabase
      .from("contact_messages")
      .insert({
        client_id: clientId,
        source,
        name,
        email,
        phone,
        message,
        metadata,
        raw_payload: body,
      })
      .select("id")
      .single();

    if (dbError) {
      console.error("[contact-submit] DB insert failed:", dbError);
      throw dbError;
    }

    const contactId = insertData?.id;

    const clientHtml = `
      <p>You have a new contact submission via your website.</p>
      <p><strong>Name:</strong> ${escapeHtml(name)}<br/>
      <strong>Email:</strong> ${escapeHtml(email)}<br/>
      <strong>Phone:</strong> ${escapeHtml(phone ?? "—")}<br/>
      <strong>Source:</strong> ${escapeHtml(source)}</p>
      ${message ? `<p><strong>Message:</strong><br/>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>` : ""}
      <p style="color:#888;font-size:12px">Contact ID: ${escapeHtml(String(contactId))}</p>
    `;

    console.log(`[contact-submit] sending client email to ${clientEmail}`);
    await sendEmail({
      to: clientEmail,
      subject: `New website contact from ${name}`,
      html: clientHtml,
    });

    return new Response(JSON.stringify({ success: true, contactId }), {
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[contact-submit] unhandled error:", err);
    return new Response(JSON.stringify({ success: false, error: String(err) }), {
      status: 500,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
});
