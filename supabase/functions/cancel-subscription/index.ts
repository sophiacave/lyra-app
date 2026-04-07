import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

let _stripeKey: string | null = null;
async function getStripeKey(): Promise<string> {
  const envKey = Deno.env.get("STRIPE_SECRET_KEY");
  if (envKey) return envKey;
  if (_stripeKey) return _stripeKey;
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/brain_context?key=eq.credentials.stripe_live&select=value`,
      { headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` } }
    );
    const rows = await res.json();
    if (rows[0]?.value) {
      const val = typeof rows[0].value === "string" ? JSON.parse(rows[0].value) : rows[0].value;
      _stripeKey = val.sk_live || val.secret_key || val.key || "";
      return _stripeKey!;
    }
  } catch (e) {
    console.error("Failed to fetch Stripe key from brain:", e);
  }
  return "";
}

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

    // Cancel via Stripe API
    const stripeKey = await getStripeKey();
    let stripeCancelled = false;
    let stripeSubId = "";

    if (stripeKey) {
      try {
        // Determine subscription ID: use profile.subscription_id if available, otherwise look up by customer
        if (profile.subscription_id) {
          stripeSubId = profile.subscription_id;
        } else if (profile.stripe_customer_id) {
          const listRes = await fetch(
            `https://api.stripe.com/v1/subscriptions?customer=${encodeURIComponent(profile.stripe_customer_id)}&status=active&limit=1`,
            {
              headers: { Authorization: `Bearer ${stripeKey}` },
            }
          );
          const listData = await listRes.json();
          if (listData.data?.length > 0) {
            stripeSubId = listData.data[0].id;
          }
        }

        if (stripeSubId) {
          const cancelRes = await fetch(
            `https://api.stripe.com/v1/subscriptions/${encodeURIComponent(stripeSubId)}`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${stripeKey}`,
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: "cancel_at_period_end=true",
            }
          );
          const cancelData = await cancelRes.json();
          if (cancelData.error) {
            console.error("Stripe cancel error:", cancelData.error);
          } else {
            stripeCancelled = true;
          }
        } else {
          console.warn(`No Stripe subscription found for ${email} — proceeding with local-only cancellation`);
        }
      } catch (stripeErr) {
        console.error("Stripe API call failed:", stripeErr);
      }
    } else {
      console.warn("Stripe key not available — proceeding with local-only cancellation");
    }

    // Update profile to cancelling status
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
    const logDescription = stripeCancelled
      ? `Subscription cancellation requested by ${email}. Stripe cancellation confirmed (${stripeSubId}). Status set to cancelling — access continues until period end.`
      : `Subscription cancellation requested by ${email}. Status set to cancelling. WARNING: Stripe cancellation could not be confirmed${stripeKey ? " (no subscription found)" : " (Stripe key unavailable)"} — manual review needed.`;

    await supabase.from("issue_reports").insert({
      reporter_name: "System",
      reporter_email: email.trim().toLowerCase(),
      category: "other",
      description: logDescription,
      status: stripeCancelled ? "resolved" : "open",
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
