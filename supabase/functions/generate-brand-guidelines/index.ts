import Anthropic from "https://esm.sh/@anthropic-ai/sdk@0.39.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") || "dorza.app@gmail.com";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing authorization header");

    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { data: { user }, error: authError } = await adminClient.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    if (authError || !user) throw new Error("Invalid token");
    if (user.email !== ADMIN_EMAIL) throw new Error("Not authorized");

    const { submissionId } = await req.json();
    if (!submissionId) throw new Error("Missing submissionId");

    const { data: submission, error: dbError } = await adminClient
      .from("onboard_submissions")
      .select("business_name, state_json")
      .eq("id", submissionId)
      .single();

    if (dbError || !submission) throw new Error("Submission not found");

    const { tone, brandColours, brandKeywords } = (submission.state_json || {}) as {
      tone?: string;
      brandColours?: string;
      brandKeywords?: string;
    };

    const prompt = `You are a brand strategist creating brand guidelines for a small Australian business website project.

Business name: ${submission.business_name || "Unknown"}
Tone: ${tone || "Not specified"}
Brand colours: ${brandColours || "Not specified"}
Brand keywords: ${brandKeywords || "Not specified"}

Generate a concise, practical brand guidelines document in markdown. Cover these five sections:

## Brand Voice & Tone
Describe the personality in 2-3 sentences. List 3 "we are / we are not" contrasts. Give 2 example phrases that match the tone.

## Colour Palette
Interpret the provided colours. Assign roles (primary, secondary, accent, background). Suggest one neutral to pair with them. If hex codes are provided, list them.

## Typography
Recommend 2 Google Fonts that match the tone — one display/heading font and one body font. One sentence explaining why each fits.

## Key Messaging
3 short core messages (one sentence each) derived from the keywords. These should work as homepage sub-headings or taglines.

## Do's and Don'ts
3 do's and 3 don'ts specific to this brand. Make them concrete, not generic.

Write for a web designer who will implement this. Be specific and skip filler.`;

    console.log(`[generate-brand-guidelines] calling Claude for submission ${submissionId}`);

    const anthropic = new Anthropic({ apiKey: Deno.env.get("ANTHROPIC_API_KEY")! });

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    const guidelines = message.content[0].type === "text" ? message.content[0].text : "";

    console.log(`[generate-brand-guidelines] done — ${guidelines.length} chars`);

    return new Response(JSON.stringify({ success: true, guidelines }), {
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[generate-brand-guidelines] error:", err);
    return new Response(JSON.stringify({ success: false, error: String(err) }), {
      status: 500,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
});
