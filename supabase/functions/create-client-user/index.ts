import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SMTPClient } from "https://deno.land/x/denomailer/mod.ts";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ADMIN_EMAILS = ["abrahamadiwidodo@gmail.com"];

async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const gmailUser = Deno.env.get("GMAIL_USER")!;
  const gmailPassword = Deno.env.get("GMAIL_APP_PASSWORD")!;
  const client = new SMTPClient({
    connection: { hostname: "smtp.gmail.com", port: 465, tls: true, auth: { username: gmailUser, password: gmailPassword } },
  });
  try {
    await client.send({ from: `Dorza <${gmailUser}>`, to, subject, content: " ", html });
  } finally {
    await client.close();
  }
}

Deno.serve(async (req) => {
  console.log(`[create-client-user] ${req.method}`);
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing authorization header");

    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Verify caller is admin using their JWT
    const token = authHeader.replace("Bearer ", "");
    const { data: { user: caller }, error: callerError } = await adminClient.auth.getUser(token);
    if (callerError || !caller) throw new Error("Invalid token");
    if (!ADMIN_EMAILS.includes(caller.email!)) throw new Error("Not authorized");

    const { submissionId } = await req.json();
    if (!submissionId) throw new Error("Missing submissionId");

    // Get submission
    const { data: submission, error: fetchError } = await adminClient
      .from("onboard_submissions")
      .select("*")
      .eq("id", submissionId)
      .single();
    if (fetchError || !submission) throw new Error("Submission not found");
    if (submission.status === "provisioned") throw new Error("Already provisioned");

    const uploadUrl = `${Deno.env.get("SITE_URL") ?? "https://dorza.app"}/upload`;

    // Try invite (creates user + link). If user exists, fall back to magic link.
    const { data: inviteData, error: inviteError } = await adminClient.auth.admin.generateLink({
      type: "invite",
      email: submission.email,
      options: { redirectTo: uploadUrl },
    });

    let userId: string;
    let actionLink: string;

    if (inviteData) {
      userId = inviteData.user.id;
      actionLink = inviteData.properties.action_link;
    } else if (inviteError.message?.toLowerCase().includes("already")) {
      const { data: magicData, error: magicError } = await adminClient.auth.admin.generateLink({
        type: "magiclink",
        email: submission.email,
        options: { redirectTo: uploadUrl },
      });
      if (magicError || !magicData) throw magicError ?? new Error("Failed to generate link");
      userId = magicData.user.id;
      actionLink = magicData.properties.action_link;
    } else {
      throw inviteError;
    }

    // Send branded invitation email
    await sendEmail({
      to: submission.email,
      subject: "Your Dorza portal is ready — upload your assets",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
          <h2 style="color:#1A1A2E;margin:0 0 12px">Hi ${submission.owner_name || "there"},</h2>
          <p style="color:#555;margin:0 0 20px">Your Dorza client portal is ready. Click below to set up your account and upload your logo and photos.</p>
          <a href="${actionLink}" style="display:inline-block;background:#D4845A;color:#fff;padding:12px 28px;border-radius:999px;text-decoration:none;font-weight:600;margin-bottom:20px">
            Access your portal
          </a>
          <p style="color:#888;font-size:13px;margin:0 0 8px">This link expires in 24 hours.</p>
          <p style="color:#555;margin:0">— The Dorza team</p>
        </div>
      `,
    });
    console.log(`[create-client-user] invitation email sent to ${submission.email}`);

    // Update submission with user_id and provisioned status
    const { error: updateError } = await adminClient
      .from("onboard_submissions")
      .update({ user_id: userId, status: "provisioned" })
      .eq("id", submissionId);
    if (updateError) throw updateError;

    console.log(`[create-client-user] done — provisioned ${submission.email}`);
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[create-client-user] error:", err);
    return new Response(JSON.stringify({ success: false, error: String(err) }), {
      status: 500,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
});
