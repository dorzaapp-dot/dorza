import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

Deno.serve(async (req) => {
  console.log(`[booking-availability] ${req.method} ${req.url}`);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS });
  }

  try {
    const url = new URL(req.url);
    const clientId = url.searchParams.get("client_id") ?? "";
    const date = url.searchParams.get("date") ?? "";

    if (!clientId || !date || !DATE_RE.test(date)) {
      return new Response(
        JSON.stringify({ error: "client_id and a valid date (YYYY-MM-DD) are required" }),
        { status: 400, headers: { ...CORS, "Content-Type": "application/json" } },
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data, error } = await supabase
      .from("bookings")
      .select("booking_time")
      .eq("client_id", clientId)
      .eq("booking_date", date)
      .neq("status", "cancelled");

    if (error) {
      console.error("[booking-availability] DB error:", error);
      throw error;
    }

    // booking_time comes back as "HH:MM:SS" — normalise to "HH:MM"
    const bookedSlots = (data ?? []).map((row) =>
      String(row.booking_time).slice(0, 5)
    );

    console.log(`[booking-availability] client="${clientId}" date="${date}" booked=${JSON.stringify(bookedSlots)}`);

    return new Response(JSON.stringify({ bookedSlots }), {
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[booking-availability] unhandled error:", err);
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...CORS, "Content-Type": "application/json" } },
    );
  }
});
