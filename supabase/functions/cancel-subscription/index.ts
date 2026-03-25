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
    const { email } = await req.json();

    if (!email?.trim()) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get the profile
    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", email.trim().toLowerCase())
      .maybeSingle();

    if (profileErr || !profile) {
      return new Response(
        JSON.stringify({ error: "Profile not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (profile.subscription_status !== "active") {
      return new Response(
        JSON.stringify({ error: "No active subscription to cancel" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // TODO: When Stripe API key is available, call Stripe to cancel at period end:
    // await stripe.subscriptions.update(profile.subscription_id, { cancel_at_period_end: true });

    // For now: update profile to cancelled and log the request
    const { error: updateErr } = await supabase
      .from("profiles")
      .update({
        subscription_status: "cancelling",
        updated_at: new Date().toISOString(),
      })
      .eq("email", email.trim().toLowerCase());

    if (updateErr) {
      console.error("Cancel error:", updateErr);
      return new Response(
        JSON.stringify({ error: "Failed to cancel. Please email faye@likeone.ai" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Log the cancellation in issue_reports as a record
    await supabase.from("issue_reports").insert({
      reporter_name: "System",
      reporter_email: email.trim().toLowerCase(),
      category: "other",
      description: `Subscription cancellation requested by ${email}. Status set to cancelling. Stripe cancellation pending API key setup.`,
      status: "open",
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Subscription cancelled. You keep access until your current billing period ends.",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Cancel subscription error:", err);
    return new Response(
      JSON.stringify({ error: "Something went wrong. Email faye@likeone.ai and we'll cancel immediately." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
