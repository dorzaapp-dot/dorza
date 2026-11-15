export type EnquiryRow = {
  name: string;
  email: string;
  business_type: string | null;
  suburb: string | null;
  services_interested: string[];
  message: string | null;
  source: "inline" | "modal";
  state_json: unknown;
};

export type EnquiryDeps = {
  insertEnquiry(row: EnquiryRow): Promise<{ id: string }>;
  sendEmail(msg: { to: string; subject: string; html: string }): Promise<void>;
  runInBackground(task: Promise<unknown>): void | Promise<void>;
  adminEmail: string;
  log: Pick<Console, "log" | "error">;
};

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_SOURCES = new Set(["inline", "modal"]);

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}

export async function handleEnquiry(req: Request, deps: EnquiryDeps): Promise<Response> {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ success: false, error: "Invalid request body" }, 400);
  }

  // Honeypot: real visitors never fill this hidden field.
  if (typeof body.website === "string" && body.website.trim().length > 0) {
    return json({ success: true });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  if (!name || !email) return json({ success: false, error: "Name and email required" }, 400);
  if (!EMAIL_RE.test(email)) return json({ success: false, error: "Invalid email" }, 400);

  const businessType = String(body.businessType ?? "").trim() || null;
  const suburb = String(body.suburb ?? "").trim() || null;
  const message = String(body.message ?? "").trim() || null;
  const source = ALLOWED_SOURCES.has(String(body.source)) ? (body.source as "inline" | "modal") : "inline";
  const servicesInterested = Array.isArray(body.servicesInterested)
    ? body.servicesInterested.filter((s): s is string => typeof s === "string" && s.length > 0).slice(0, 20)
    : [];

  let id: string;
  try {
    ({ id } = await deps.insertEnquiry({
      name,
      email,
      business_type: businessType,
      suburb,
      services_interested: servicesInterested,
      message,
      source,
      state_json: body,
    }));
  } catch (err) {
    deps.log.error("[enquiry-submit] DB insert failed:", err);
    return json({ success: false, error: String(err) }, 500);
  }

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
      <p style="color:#888;font-size:12px">Enquiry ID: ${id}</p>
    `;
  const confirmationHtml = `
        <p>Hi ${escapeHtml(name.split(" ")[0])},</p>
        <p>Thanks for getting in touch. You're on the founding-client list — a real Sydney human from Dorza will reach out within 72 hours.</p>
        <p>In the meantime, if you want to add anything, just reply to this email.</p>
        <p>— The Dorza team</p>
      `;

  await deps.runInBackground(
    Promise.allSettled([
      deps.sendEmail({
        to: deps.adminEmail,
        subject: `New enquiry: ${name}${businessType ? ` (${businessType})` : ""}`,
        html: adminHtml,
      }),
      deps.sendEmail({ to: email, subject: "You're on the list — Dorza", html: confirmationHtml }),
    ]).then((results) => {
      const labels = ["admin email", "confirmation email"];
      results.forEach((r, i) => {
        if (r.status === "rejected") deps.log.error(`[enquiry-submit] ${labels[i]} failed (enquiry ${id}):`, r.reason);
      });
    }),
  );

  return json({ success: true, enquiryId: id });
}
