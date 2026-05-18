import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SMTPClient } from "https://deno.land/x/denomailer/mod.ts";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ADMIN_FALLBACK = "dorza.app@gmail.com";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_SOURCES = new Set(["inline", "modal"]);

type Payload = {
  name?: string;
  email?: string;
  businessType?: string;
  suburb?: string;
  servicesInterested?: string[];
  message?: string;
  source?: string;
  // Honeypot — must be empty. Real users don't fill hidden fields.
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
      from: `Dorza <${gmailUser}>`,
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
  console.log(`[enquiry-submit] ${req.method} ${req.url}`);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS });
  }

  try {
    const body = (await req.json()) as Payload;

    // Honeypot — silently succeed without storing or emailing.
    if (body.website && body.website.trim().length > 0) {
      console.log("[enquiry-submit] honeypot triggered — discarding");
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    const name = (body.name ?? "").trim();
    const email = (body.email ?? "").trim().toLowerCase();
    const businessType = (body.businessType ?? "").trim() || null;
    const suburb = (body.suburb ?? "").trim() || null;
    const message = (body.message ?? "").trim() || null;
    const source = ALLOWED_SOURCES.has(body.source ?? "") ? body.source! : "inline";
    const servicesInterested = Array.isArray(body.servicesInterested)
      ? body.servicesInterested.filter((s) => typeof s === "string" && s.length > 0).slice(0, 20)
      : [];

    if (!name || !email) {
      return new Response(JSON.stringify({ success: false, error: "Name and email required" }), {
        status: 400,
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }
    if (!EMAIL_RE.test(email)) {
      return new Response(JSON.stringify({ success: false, error: "Invalid email" }), {
        status: 400,
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    console.log(`[enquiry-submit] inserting — email="${email}", source="${source}"`);
    const { data: insertData, error: dbError } = await supabase
      .from("enquiries")
      .insert({
        name,
        email,
        business_type: businessType,
        suburb,
        services_interested: servicesInterested,
        message,
        source,
        state_json: body,
      })
      .select("id")
      .single();

    if (dbError) {
      console.error("[enquiry-submit] DB insert failed:", dbError);
      throw dbError;
    }
    console.log("[enquiry-submit] DB insert OK — id:", insertData.id);

    const adminTo = Deno.env.get("ADMIN_NOTIFICATION_EMAIL") || ADMIN_FALLBACK;
    const servicesHtml = servicesInterested.length
      ? `<ul style="margin:6px 0 0 0;padding-left:18px">${servicesInterested.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ul>`
      : "<em>None selected</em>";

    const adminHtml = `
      <p>New enquiry from <strong>${escapeHtml(name)}</strong> (${escapeHtml(email)}).</p>
      <p><strong>Business type:</strong> ${escapeHtml(businessType ?? "—")}<br/>
      <strong>Suburb:</strong> ${escapeHtml(suburb ?? "—")}<br/>
      <strong>Source:</strong> ${escapeHtml(source)}</p>
      <p><strong>Services of interest:</strong></p>
      ${servicesHtml}
      ${message ? `<p><strong>Message:</strong><br/>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>` : ""}
      <p style="color:#888;font-size:12px">Enquiry ID: ${insertData.id}</p>
    `;

    console.log(`[enquiry-submit] sending admin email to ${adminTo}`);
    await sendEmail({
      to: adminTo,
      subject: `New enquiry: ${name}${businessType ? ` (${businessType})` : ""}`,
      html: adminHtml,
    });

    console.log(`[enquiry-submit] sending confirmation to ${email}`);
    await sendEmail({
      to: email,
      subject: "You're on the list — Dorza",
      html: `
        <p>Hi ${escapeHtml(name.split(" ")[0])},</p>
        <p>Thanks for getting in touch. You're on the founding-client list — a real Sydney human from Dorza will reach out within 72 hours.</p>
        <p>In the meantime, if you want to add anything, just reply to this email.</p>
        <p>— The Dorza team</p>
      `,
    });

    console.log("[enquiry-submit] done");
    return new Response(JSON.stringify({ success: true, enquiryId: insertData.id }), {
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[enquiry-submit] unhandled error:", err);
    return new Response(JSON.stringify({ success: false, error: String(err) }), {
      status: 500,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
});
