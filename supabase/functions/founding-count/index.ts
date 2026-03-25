import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

const FOUNDING_LIMIT = 1000;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Count active founding members from profiles
    // Founding members have subscription_status = 'active' and a subscription_id
    // We count all active paid subscribers (community access doesn't count toward founding)
    const { count, error } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("subscription_status", "active")
      .not("subscription_id", "is", null)
      .neq("subscription_tier", "community");

    if (error) {
      console.error("Founding count error:", error);
      // Return safe fallback
      return new Response(
        JSON.stringify({ remaining: FOUNDING_LIMIT - 5, total: 5, sold_out: false }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const total = count ?? 0;
    const remaining = Math.max(0, FOUNDING_LIMIT - total);
    const sold_out = total >= FOUNDING_LIMIT;

    return new Response(
      JSON.stringify({ remaining, total, sold_out }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          // Cache for 5 minutes to avoid hammering the DB
          "Cache-Control": "public, max-age=300, s-maxage=300",
        },
      }
    );
  } catch (err) {
    console.error("Founding count error:", err);
    return new Response(
      JSON.stringify({ remaining: 995, total: 5, sold_out: false }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
