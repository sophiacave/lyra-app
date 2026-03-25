import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { email, source, goal } = await req.json();

    if (!email?.trim()) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Upsert subscriber — if they already exist, update source/reactivate
    const { error: subError } = await supabase
      .from("subscribers")
      .upsert(
        {
          email: cleanEmail,
          source: source?.trim() || "website",
          goal: goal?.trim()?.slice(0, 500) || null,
          status: "active",
          subscribed_at: new Date().toISOString(),
        },
        { onConflict: "email" }
      );

    if (subError) {
      console.error("Subscribe error:", subError);
      return new Response(
        JSON.stringify({ error: "Failed to subscribe. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // If this is a community_access signup, also claim a spot
    if (source === "community_access") {
      // Get current week's Monday
      const now = new Date();
      const day = now.getUTCDay();
      const monday = new Date(now);
      monday.setUTCDate(now.getUTCDate() - ((day + 6) % 7));
      const weekStart = monday.toISOString().split("T")[0];

      // Check spots remaining this week
      const { count } = await supabase
        .from("community_access")
        .select("id", { count: "exact", head: true })
        .eq("week_start", weekStart);

      if ((count ?? 0) >= 15) {
        return new Response(
          JSON.stringify({
            success: true,
            message: "Subscribed! But all 15 community spots are claimed this week. You'll be first in line next Monday.",
            waitlisted: true,
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Check if already claimed this week
      const { data: existing } = await supabase
        .from("community_access")
        .select("id")
        .eq("email", cleanEmail)
        .eq("week_start", weekStart)
        .maybeSingle();

      if (!existing) {
        await supabase.from("community_access").insert({
          email: cleanEmail,
          goal: goal?.trim()?.slice(0, 500) || null,
          week_start: weekStart,
        });

        // Grant academy access by upserting profile with community tier
        await supabase
          .from("profiles")
          .upsert(
            {
              email: cleanEmail,
              subscription_status: "active",
              subscription_tier: "community",
              updated_at: new Date().toISOString(),
            },
            { onConflict: "email", ignoreDuplicates: false }
          );
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: "Welcome to the path, friend." }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Subscribe error:", err);
    return new Response(
      JSON.stringify({ error: "Something went wrong. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
