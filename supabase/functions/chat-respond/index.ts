import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-haiku-4-5";
const MAX_TOKENS = 1024;
const MAX_TOOL_ROUNDS = 5;
const MAX_CONVERSATION_MESSAGES = 40;

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00",
];

function formatTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${period}`;
}

type ChatMessage = { role: "user" | "assistant"; content: string };

type Payload = {
  clientId?: string;
  messages?: ChatMessage[];
};

// deno-lint-ignore no-explicit-any
type AnthropicMessage = { role: string; content: any };

const TOOLS = [
  {
    name: "check_availability",
    description:
      "Check available booking time slots for a specific date. Returns which 30-minute slots between 9 AM and 5 PM are still open.",
    input_schema: {
      type: "object",
      properties: {
        date: {
          type: "string",
          description: "Date to check availability for, in YYYY-MM-DD format",
        },
      },
      required: ["date"],
    },
  },
  {
    name: "create_booking",
    description:
      "Create a booking appointment. Only call this after confirming the preferred date, time, full name, and email address with the customer.",
    input_schema: {
      type: "object",
      properties: {
        booking_date: {
          type: "string",
          description: "Booking date in YYYY-MM-DD format",
        },
        booking_time: {
          type: "string",
          description:
            "Booking time in HH:MM 24-hour format (e.g. '09:00', '14:30')",
        },
        customer_name: {
          type: "string",
          description: "Customer's full name",
        },
        customer_email: {
          type: "string",
          description: "Customer's email address",
        },
        customer_phone: {
          type: "string",
          description: "Customer's phone number (optional)",
        },
        message: {
          type: "string",
          description: "Additional notes from the customer (optional)",
        },
      },
      required: [
        "booking_date",
        "booking_time",
        "customer_name",
        "customer_email",
      ],
    },
  },
];

// deno-lint-ignore no-explicit-any
async function executeTool(
  toolName: string,
  toolInput: Record<string, string>,
  clientId: string,
  // deno-lint-ignore no-explicit-any
  supabase: any,
): Promise<string> {
  if (toolName === "check_availability") {
    const date = toolInput.date;
    const today = new Date().toISOString().split("T")[0];
    if (date < today) {
      return JSON.stringify({ error: "Cannot check availability for past dates." });
    }

    const { data, error } = await supabase
      .from("bookings")
      .select("booking_time")
      .eq("client_id", clientId)
      .eq("booking_date", date)
      .neq("status", "cancelled");

    if (error) {
      console.error("[chat-respond] availability query failed:", error);
      return JSON.stringify({ error: "Failed to check availability." });
    }

    const bookedSlots = (data ?? []).map(
      (row: { booking_time: string }) => String(row.booking_time).slice(0, 5),
    );
    const availableSlots = TIME_SLOTS.filter((s) => !bookedSlots.includes(s));

    return JSON.stringify({
      date,
      available_slots: availableSlots.map((s) => ({
        time_24h: s,
        display: formatTime(s),
      })),
      fully_booked: availableSlots.length === 0,
    });
  }

  if (toolName === "create_booking") {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const res = await fetch(
      `${supabaseUrl}/functions/v1/booking-submit`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${serviceRoleKey}`,
        },
        body: JSON.stringify({
          clientId,
          name: toolInput.customer_name,
          email: toolInput.customer_email,
          phone: toolInput.customer_phone || null,
          message: toolInput.message || null,
          bookingDate: toolInput.booking_date,
          bookingTime: toolInput.booking_time,
        }),
      },
    );
    const result = await res.json();

    if (result.success) {
      return JSON.stringify({
        success: true,
        message: "Booking confirmed. Confirmation emails have been sent.",
      });
    }
    if (result.error === "SLOT_UNAVAILABLE") {
      return JSON.stringify({
        success: false,
        error: "That time slot was just taken by someone else.",
      });
    }
    return JSON.stringify({
      success: false,
      error: result.error || "Failed to create booking.",
    });
  }

  return JSON.stringify({ error: `Unknown tool: ${toolName}` });
}

// deno-lint-ignore no-explicit-any
function buildSystemPrompt(businessData: any): string {
  const state = businessData.state_json || {};
  const name =
    state.businessName || businessData.business_name || "our business";
  const type = state.businessType || "";
  const suburb = state.suburb || "";
  const phone = state.phone || "";
  const email = state.email || businessData.email || "";
  const services = (state.services || []).filter(Boolean);
  const hours = state.openingHours || "9:00 AM – 5:00 PM";
  const differentiator = state.differentiator || "";

  const today = new Date().toISOString().split("T")[0];

  let prompt = `You are a friendly and helpful chat assistant for ${name}`;
  if (type) prompt += `, a ${type} business`;
  if (suburb) prompt += ` in ${suburb}`;
  prompt += ".\n\n";

  prompt +=
    "Your role is to help customers with questions about the business, check appointment availability, and assist with bookings.\n\n";

  if (services.length > 0) {
    prompt += "Services offered:\n";
    for (const s of services) prompt += `- ${s}\n`;
    prompt += "\n";
  }
  if (differentiator) prompt += `What sets us apart: ${differentiator}\n\n`;
  if (phone) prompt += `Phone: ${phone}\n`;
  if (email) prompt += `Email: ${email}\n`;
  if (hours) prompt += `Hours: ${hours}\n`;
  prompt += "\n";

  prompt += `Appointment slots run every 30 minutes from 9:00 AM to 5:00 PM.\nToday's date is ${today}.\n\n`;

  prompt += `Guidelines:
- Be warm, professional, and concise — keep replies to 2-3 sentences when possible.
- Use the check_availability tool when a customer asks about open times for a specific date.
- To make a booking, you need: date, time, full name, and email. Collect any missing details conversationally before calling create_booking.
- If a requested slot is taken, suggest the nearest available times from the tool result.
- Present times in 12-hour format (e.g. "2:30 PM").
- Only discuss topics related to this business. Politely redirect unrelated questions.
- Never invent facts about the business that aren't provided above.`;

  return prompt;
}

async function callClaude(
  systemPrompt: string,
  messages: AnthropicMessage[],
  clientId: string,
  // deno-lint-ignore no-explicit-any
  supabase: any,
  apiKey: string,
): Promise<string> {
  let currentMessages = [...messages];

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    const body = {
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: systemPrompt,
      messages: currentMessages,
      tools: TOOLS,
    };

    const res = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[chat-respond] Claude API error:", res.status, errText);
      throw new Error(`Claude API returned ${res.status}`);
    }

    const data = await res.json();

    if (data.stop_reason === "end_turn" || data.stop_reason === "max_tokens") {
      const textBlock = (data.content || []).find(
        // deno-lint-ignore no-explicit-any
        (b: any) => b.type === "text",
      );
      return textBlock?.text || "Sorry, I wasn't able to generate a response.";
    }

    if (data.stop_reason === "tool_use") {
      currentMessages.push({ role: "assistant", content: data.content });

      // deno-lint-ignore no-explicit-any
      const toolUseBlocks = (data.content || []).filter(
        // deno-lint-ignore no-explicit-any
        (b: any) => b.type === "tool_use",
      );

      const toolResults = [];
      for (const toolBlock of toolUseBlocks) {
        console.log(
          `[chat-respond] executing tool: ${toolBlock.name}`,
          JSON.stringify(toolBlock.input),
        );
        const result = await executeTool(
          toolBlock.name,
          toolBlock.input,
          clientId,
          supabase,
        );
        console.log(`[chat-respond] tool result:`, result);
        toolResults.push({
          type: "tool_result",
          tool_use_id: toolBlock.id,
          content: result,
        });
      }

      currentMessages.push({ role: "user", content: toolResults });
      continue;
    }

    const fallbackText = (data.content || []).find(
      // deno-lint-ignore no-explicit-any
      (b: any) => b.type === "text",
    );
    return (
      fallbackText?.text ||
      "Sorry, something unexpected happened. Please try again."
    );
  }

  return "I need to look up a few more things than I can right now. Could you try rephrasing your question?";
}

Deno.serve(async (req) => {
  console.log(`[chat-respond] ${req.method} ${req.url}`);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS });
  }

  try {
    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      console.error("[chat-respond] ANTHROPIC_API_KEY not set");
      return new Response(
        JSON.stringify({ error: "Chat service not configured." }),
        { status: 503, headers: { ...CORS, "Content-Type": "application/json" } },
      );
    }

    const body = (await req.json()) as Payload;
    const clientId = (body.clientId ?? "").trim();
    const messages = body.messages ?? [];

    if (!clientId) {
      return new Response(
        JSON.stringify({ error: "clientId is required." }),
        { status: 400, headers: { ...CORS, "Content-Type": "application/json" } },
      );
    }
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "messages array is required." }),
        { status: 400, headers: { ...CORS, "Content-Type": "application/json" } },
      );
    }
    if (messages.length > MAX_CONVERSATION_MESSAGES) {
      return new Response(
        JSON.stringify({
          error: "Conversation limit reached. Please start a new chat.",
        }),
        { status: 429, headers: { ...CORS, "Content-Type": "application/json" } },
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: clientRow, error: clientError } = await supabase
      .from("onboard_submissions")
      .select("business_name, email, state_json")
      .eq("id", clientId)
      .single();

    if (clientError || !clientRow) {
      console.error(
        "[chat-respond] client lookup failed for",
        clientId,
        clientError,
      );
      return new Response(
        JSON.stringify({ error: "Unknown client." }),
        { status: 404, headers: { ...CORS, "Content-Type": "application/json" } },
      );
    }

    const systemPrompt = buildSystemPrompt(clientRow);

    const anthropicMessages: AnthropicMessage[] = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    console.log(
      `[chat-respond] calling Claude — client="${clientId}" messages=${messages.length}`,
    );
    const reply = await callClaude(
      systemPrompt,
      anthropicMessages,
      clientId,
      supabase,
      apiKey,
    );

    console.log("[chat-respond] done — reply length:", reply.length);
    return new Response(JSON.stringify({ reply }), {
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[chat-respond] unhandled error:", err);
    return new Response(
      JSON.stringify({ error: "Something went wrong. Please try again." }),
      { status: 500, headers: { ...CORS, "Content-Type": "application/json" } },
    );
  }
});
