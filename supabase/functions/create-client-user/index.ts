import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SMTPClient } from "https://deno.land/x/denomailer/mod.ts";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ADMIN_EMAILS = ["dorza.app@gmail.com"];

function generatePassword(length = 12): string {
  const chars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => chars[b % chars.length]).join("");
}

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

    const siteUrl = Deno.env.get("SITE_URL") ?? "https://dorza.app";
    const dashboardUrl = `${siteUrl}/dashboard`;
    const tempPassword = generatePassword();

    let userId: string;

    // Try creating user with password. If user exists, update their password.
    const { data: createData, error: createError } = await adminClient.auth.admin.createUser({
      email: submission.email,
      password: tempPassword,
      email_confirm: true,
    });

    if (createData?.user) {
      userId = createData.user.id;
    } else if (createError?.message?.toLowerCase().includes("already")) {
      const { data: { users } } = await adminClient.auth.admin.listUsers();
      const existing = users.find((u: { email?: string }) => u.email === submission.email);
      if (!existing) throw new Error("User exists but could not be found");
      userId = existing.id;
      const { error: updateError } = await adminClient.auth.admin.updateUserById(userId, {
        password: tempPassword,
      });
      if (updateError) throw updateError;
    } else {
      throw createError ?? new Error("Failed to create user");
    }

    // Send branded credentials email
    await sendEmail({
      to: submission.email,
      subject: "Your Dorza dashboard is ready",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
          <h2 style="color:#1A1A2E;margin:0 0 12px">Hi ${submission.owner_name || "there"},</h2>
          <p style="color:#555;margin:0 0 20px">Your Dorza client dashboard is ready. Sign in to view your bookings and manage your assets.</p>
          <div style="background:#F9F7F5;border:1px solid #F0EBE4;border-radius:12px;padding:20px;margin:0 0 20px">
            <p style="color:#555;margin:0 0 8px;font-size:14px"><strong>Email:</strong> ${submission.email}</p>
            <p style="color:#555;margin:0;font-size:14px"><strong>Temporary password:</strong> ${tempPassword}</p>
          </div>
          <a href="${dashboardUrl}" style="display:inline-block;background:#D4845A;color:#fff;padding:12px 28px;border-radius:999px;text-decoration:none;font-weight:600;margin-bottom:20px">
            Go to your dashboard
          </a>
          <p style="color:#888;font-size:13px;margin:16px 0 8px">Please change your password after signing in.</p>
          <p style="color:#555;margin:0">— The Dorza team</p>
        </div>
      `,
    });
    console.log(`[create-client-user] credentials email sent to ${submission.email}`);

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
