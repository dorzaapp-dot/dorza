import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SMTPClient } from "https://deno.land/x/denomailer/mod.ts";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}$/;

type Payload = {
  clientId?: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  bookingDate?: string;
  bookingTime?: string;
  website?: string; // honeypot
};

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

function formatDateTime(date: string, time: string): string {
  const d = new Date(`${date}T${time}:00`);
  return d.toLocaleString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

Deno.serve(async (req) => {
  console.log(`[booking-submit] ${req.method} ${req.url}`);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS });
  }

  try {
    const body = (await req.json()) as Payload;

    // Honeypot — silently succeed without storing.
    if (body.website && body.website.trim().length > 0) {
      console.log("[booking-submit] honeypot triggered — discarding");
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    const clientId = (body.clientId ?? "").trim();
    const name = (body.name ?? "").trim();
    const email = (body.email ?? "").trim().toLowerCase();
    const phone = (body.phone ?? "").trim() || null;
    const message = (body.message ?? "").trim() || null;
    const bookingDate = (body.bookingDate ?? "").trim();
    const bookingTime = (body.bookingTime ?? "").trim();

    if (!clientId || !name || !email || !bookingDate || !bookingTime) {
      return new Response(
        JSON.stringify({ success: false, error: "clientId, name, email, bookingDate and bookingTime are required." }),
        { status: 400, headers: { ...CORS, "Content-Type": "application/json" } },
      );
    }
    if (!EMAIL_RE.test(email)) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid email address." }),
        { status: 400, headers: { ...CORS, "Content-Type": "application/json" } },
      );
    }
    if (!DATE_RE.test(bookingDate)) {
      return new Response(
        JSON.stringify({ success: false, error: "bookingDate must be YYYY-MM-DD." }),
        { status: 400, headers: { ...CORS, "Content-Type": "application/json" } },
      );
    }
    if (!TIME_RE.test(bookingTime)) {
      return new Response(
        JSON.stringify({ success: false, error: "bookingTime must be HH:MM." }),
        { status: 400, headers: { ...CORS, "Content-Type": "application/json" } },
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Resolve client's business email for notification.
    const { data: clientRow, error: clientRowError } = await supabase
      .from("onboard_submissions")
      .select("email")
      .eq("id", clientId)
      .single();

    if (clientRowError || !clientRow?.email) {
      console.error("[booking-submit] failed to resolve client email for clientId=", clientId, clientRowError);
      return new Response(
        JSON.stringify({ success: false, error: "Unable to resolve client recipient email." }),
        { status: 400, headers: { ...CORS, "Content-Type": "application/json" } },
      );
    }

    const clientEmail = (clientRow.email as string).trim().toLowerCase();
    if (!EMAIL_RE.test(clientEmail)) {
      console.error("[booking-submit] invalid client email for clientId=", clientId, clientEmail);
      return new Response(
        JSON.stringify({ success: false, error: "Client recipient email is invalid." }),
        { status: 400, headers: { ...CORS, "Content-Type": "application/json" } },
      );
    }

    console.log(`[booking-submit] inserting — client="${clientId}" date="${bookingDate}" time="${bookingTime}" email="${email}"`);

    const { data: insertData, error: dbError } = await supabase
      .from("bookings")
      .insert({
        client_id: clientId,
        booking_date: bookingDate,
        booking_time: bookingTime,
        name,
        email,
        phone,
        message,
        metadata: { user_agent: req.headers.get("user-agent") ?? null },
        raw_payload: body,
      })
      .select("id")
      .single();

    if (dbError) {
      // Postgres unique violation — slot was taken by a concurrent booking.
      if ((dbError as { code?: string }).code === "23505") {
        console.log("[booking-submit] slot conflict — unique constraint violated");
        return new Response(
          JSON.stringify({ success: false, error: "SLOT_UNAVAILABLE" }),
          { status: 409, headers: { ...CORS, "Content-Type": "application/json" } },
        );
      }
      console.error("[booking-submit] DB insert failed:", dbError);
      throw dbError;
    }

    const bookingId = insertData?.id;
    const formattedDateTime = formatDateTime(bookingDate, bookingTime);

    // Notify the business owner.
    const businessHtml = `
      <p>You have a new booking via your website.</p>
      <p>
        <strong>When:</strong> ${escapeHtml(formattedDateTime)}<br/>
        <strong>Name:</strong> ${escapeHtml(name)}<br/>
        <strong>Email:</strong> ${escapeHtml(email)}<br/>
        <strong>Phone:</strong> ${escapeHtml(phone ?? "—")}
      </p>
      ${message ? `<p><strong>Note from customer:</strong><br/>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>` : ""}
      <p style="color:#888;font-size:12px">Booking ID: ${escapeHtml(String(bookingId))}</p>
    `;

    console.log(`[booking-submit] sending business email to ${clientEmail}`);
    await sendEmail({
      to: clientEmail,
      subject: `New booking: ${name} — ${formattedDateTime}`,
      html: businessHtml,
    });

    // Confirm to the customer.
    const customerHtml = `
      <p>Hi ${escapeHtml(name.split(" ")[0])},</p>
      <p>Your booking is confirmed for <strong>${escapeHtml(formattedDateTime)}</strong>.</p>
      <p>If you need to reschedule or have any questions, just reply to this email.</p>
      <p>See you soon!</p>
    `;

    console.log(`[booking-submit] sending confirmation to ${email}`);
    await sendEmail({
      to: email,
      subject: `Booking confirmed — ${formattedDateTime}`,
      html: customerHtml,
    });

    console.log("[booking-submit] done — id:", bookingId);
    return new Response(JSON.stringify({ success: true, bookingId }), {
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[booking-submit] unhandled error:", err);
    return new Response(
      JSON.stringify({ success: false, error: String(err) }),
      { status: 500, headers: { ...CORS, "Content-Type": "application/json" } },
    );
  }
});
