import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const SITE_URL = "https://likeone.ai";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

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

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stripeKey = await getStripeKey();
    if (!stripeKey) {
      return new Response(JSON.stringify({ error: "Payment system not configured yet. Email hello@likeone.ai" }), {
        status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Step 1: Look up stripe_customer_id from profiles table
    let stripeCustomerId: string | null = null;

    try {
      const profileRes = await fetch(
        `${SUPABASE_URL}/rest/v1/profiles?email=eq.${encodeURIComponent(email)}&select=stripe_customer_id&limit=1`,
        { headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` } }
      );
      const profiles = await profileRes.json();
      if (profiles[0]?.stripe_customer_id) {
        stripeCustomerId = profiles[0].stripe_customer_id;
      }
    } catch (e) {
      console.error("Failed to look up profile:", e);
    }

    // Step 2: If no customer ID from profile, search Stripe by email
    if (!stripeCustomerId) {
      const searchRes = await fetch(
        `https://api.stripe.com/v1/customers?email=${encodeURIComponent(email)}&limit=1`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${stripeKey}` },
        }
      );
      const searchData = await searchRes.json();
      if (searchData.error) {
        console.error("Stripe customer search error:", searchData.error);
        return new Response(JSON.stringify({ error: "Something went wrong looking up your account. Email hello@likeone.ai" }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (searchData.data && searchData.data.length > 0) {
        stripeCustomerId = searchData.data[0].id;
      }
    }

    // Step 3: No customer found anywhere
    if (!stripeCustomerId) {
      return new Response(JSON.stringify({ error: "No subscription found for this email. If you believe this is an error, email hello@likeone.ai" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Step 4: Create Stripe Billing Portal session
    const params = new URLSearchParams();
    params.append("customer", stripeCustomerId);
    params.append("return_url", `${SITE_URL}/account/`);

    const portalRes = await fetch("https://api.stripe.com/v1/billing_portal/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
    const session = await portalRes.json();

    if (session.error) {
      console.error("Stripe portal error:", session.error);
      return new Response(JSON.stringify({ error: "Unable to open subscription management. Email hello@likeone.ai" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Step 5: Return portal URL
    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Manage subscription error:", err);
    return new Response(JSON.stringify({ error: "Something went wrong. Email hello@likeone.ai" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
