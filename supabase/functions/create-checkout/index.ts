import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const SITE_URL = "https://likeone.ai";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const PRODUCTS: Record<string, { name: string; price: number; mode: "payment" | "subscription"; interval?: "month" | "year" }> = {
  "pro-monthly": { name: "Like One Academy Pro — Monthly", price: 4900, mode: "subscription", interval: "month" },
  "pro-annual": { name: "Like One Academy Pro — Annual", price: 39000, mode: "subscription", interval: "year" },
  "builder": { name: "Like One Academy Pro — Monthly", price: 4900, mode: "subscription", interval: "month" },
  "convergence": { name: "Like One Academy Pro — Annual", price: 39000, mode: "subscription", interval: "year" },
  "blueprint": { name: "The Convergence Blueprint", price: 2700, mode: "payment" },
  "identity-kit": { name: "Identity Document Kit", price: 1700, mode: "payment" },
  "agent-pack": { name: "Agent Starter Pack", price: 3700, mode: "payment" },
  "conscience-layer": { name: "The Conscience Layer", price: 4700, mode: "payment" },
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
    const { product_id, email, amount_cents, success_url, cancel_url } = await req.json();

    // Handle donations with custom amount
    if (product_id === "donation") {
      const amount = parseInt(amount_cents);
      if (!amount || amount < 100 || amount > 1000000) {
        return new Response(JSON.stringify({ error: "Amount must be between $1 and $10,000" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const stripeKey = await getStripeKey();
      if (!stripeKey) {
        return new Response(JSON.stringify({ error: "Payment system not configured yet. Contact faye@likeone.ai" }), {
          status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const params = new URLSearchParams();
      params.append("success_url", success_url || `${SITE_URL}/support?thanks=1`);
      params.append("cancel_url", cancel_url || `${SITE_URL}/support`);
      params.append("mode", "payment");
      params.append("submit_type", "donate");
      params.append("line_items[0][quantity]", "1");
      params.append("line_items[0][price_data][currency]", "usd");
      params.append("line_items[0][price_data][product_data][name]", "Support Like One — Donation");
      params.append("line_items[0][price_data][unit_amount]", amount.toString());
      params.append("metadata[type]", "donation");
      params.append("metadata[amount_dollars]", (amount / 100).toString());
      if (email) params.append("customer_email", email);
      const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
        method: "POST",
        headers: { Authorization: `Bearer ${stripeKey}`, "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });
      const session = await stripeRes.json();
      if (session.error) {
        return new Response(JSON.stringify({ error: session.error.message }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ url: session.url }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const product = PRODUCTS[product_id];
    if (!product) {
      return new Response(JSON.stringify({ error: "Invalid product" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const stripeKey = await getStripeKey();
    if (!stripeKey) {
      return new Response(JSON.stringify({ error: "Payment system not configured yet. Contact faye@likeone.ai" }), {
        status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const params = new URLSearchParams();
    params.append("success_url", `${SITE_URL}/thank-you?product=${product_id}`);
    params.append("cancel_url", `${SITE_URL}/#pricing`);
    params.append("mode", product.mode);
    params.append("line_items[0][quantity]", "1");
    params.append("line_items[0][price_data][currency]", "usd");
    params.append("line_items[0][price_data][product_data][name]", product.name);
    params.append("line_items[0][price_data][unit_amount]", product.price.toString());
    params.append("metadata[product_id]", product_id);
    params.append("metadata[product_name]", product.name);
    if (product.mode === "subscription" && product.interval) {
      params.append("line_items[0][price_data][recurring][interval]", product.interval);
    }
    if (email) {
      params.append("customer_email", email);
    }
    const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: { Authorization: `Bearer ${stripeKey}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
    const session = await stripeRes.json();
    if (session.error) {
      return new Response(JSON.stringify({ error: session.error.message }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Checkout error:", err);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});