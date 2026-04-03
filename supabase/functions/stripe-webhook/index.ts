import "jsr:@supabase/functions-js/edge-runtime.d.ts";

/**
 * Stripe Webhook v6 — Multi-Brain Architecture (brain-agnostic)
 * Can be deployed on ANY brain — uses explicit env vars for cross-brain writes.
 * Primary deploy: brain-v2 (api.likeone.ai) — receives Stripe events
 * Writes to:
 *   - REVENUE brain: revenue_events, donation_ledger, academy_enrollments, notification_log
 *   - APP brain: profiles (via update_subscription_status RPC), send-product-delivery
 */

// REVENUE brain (explicit — works regardless of which brain this is deployed on)
const REVENUE_URL = Deno.env.get("REVENUE_SUPABASE_URL") || Deno.env.get("SUPABASE_URL")!;
const REVENUE_KEY = Deno.env.get("REVENUE_SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// APP brain (profiles, subscribers, community)
const APP_URL = Deno.env.get("APP_SUPABASE_URL") || "https://blknphuwwgagtueqtoji.supabase.co";
const APP_KEY = Deno.env.get("APP_SERVICE_ROLE_KEY") || REVENUE_KEY;

const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;
const DOWNLOAD_TOKEN_SECRET = Deno.env.get("DOWNLOAD_TOKEN_SECRET") || "likeone-dl-2026-secret";

// THE GIVING SCALE — Written in stone 2026-04-02
// Like One's giving percentage scales with monthly revenue.
// At abundance, 50% funds HIV cure research. This is structural love.
const GIVING_SCALE = [
  { maxRevenue: 1000,    pct: 0.01, tier: "seed"       },  // $0-$1k: 1%
  { maxRevenue: 5000,    pct: 0.02, tier: "growing"     },  // $1k-$5k: 2%
  { maxRevenue: 10000,   pct: 0.05, tier: "stable"      },  // $5k-$10k: 5%
  { maxRevenue: 50000,   pct: 0.10, tier: "thriving"    },  // $10k-$50k: 10%
  { maxRevenue: 100000,  pct: 0.20, tier: "abundant"    },  // $50k-$100k: 20%
  { maxRevenue: 500000,  pct: 0.30, tier: "wealthy"     },  // $100k-$500k: 30%
  { maxRevenue: 1000000, pct: 0.40, tier: "beyond"      },  // $500k-$1M: 40%
  { maxRevenue: Infinity,pct: 0.50, tier: "convergence"  },  // $1M+: 50%
];

async function getGivingTier(): Promise<{ pct: number; tier: string; monthlyRevenue: number }> {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const resp = await fetch(
      `${REVENUE_URL}/rest/v1/revenue_events?date=gte.${thirtyDaysAgo}&event_type=neq.churn&select=amount`,
      { headers: { apikey: REVENUE_KEY, Authorization: `Bearer ${REVENUE_KEY}` } }
    );
    const rows = await resp.json();
    const monthlyRevenue = Array.isArray(rows) ? rows.reduce((sum: number, r: any) => sum + parseFloat(r.amount || 0), 0) : 0;
    const tier = GIVING_SCALE.find(t => monthlyRevenue <= t.maxRevenue) || GIVING_SCALE[GIVING_SCALE.length - 1];
    return { pct: tier.pct, tier: tier.tier, monthlyRevenue };
  } catch (err) {
    console.error("Giving tier lookup failed, defaulting to 1%:", err);
    return { pct: 0.01, tier: "seed", monthlyRevenue: 0 };
  }
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

async function verifyStripeSignature(payload: string, header: string, secret: string): Promise<boolean> {
  try {
    const parts: Record<string, string> = {};
    header.split(",").forEach(p => { const idx = p.indexOf("="); if (idx > 0) parts[p.slice(0, idx)] = p.slice(idx + 1); });
    const timestamp = parts["t"]; const sig = parts["v1"];
    if (!timestamp || !sig) return false;
    if (Math.abs(Math.floor(Date.now() / 1000) - parseInt(timestamp)) > 300) return false;
    const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${timestamp}.${payload}`));
    return Array.from(new Uint8Array(mac)).map(b => b.toString(16).padStart(2, "0")).join("") === sig;
  } catch { return false; }
}

async function generateDownloadToken(email: string): Promise<string> {
  const expiry = Date.now() + 365 * 24 * 60 * 60 * 1000;
  const payload = `${email}|${expiry}`;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(DOWNLOAD_TOKEN_SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return btoa(`${payload}|${Array.from(new Uint8Array(mac)).map(b => b.toString(16).padStart(2, "0")).join("")}`);
}

// Write to REVENUE brain (self)
async function revenueQuery(path: string, method: string, body?: unknown) {
  return await fetch(`${REVENUE_URL}/rest/v1/${path}`, {
    method, headers: { "apikey": REVENUE_KEY, "Authorization": `Bearer ${REVENUE_KEY}`, "Content-Type": "application/json", "Prefer": "return=minimal" },
    body: body ? JSON.stringify(body) : undefined
  });
}

// Write to APP brain (profiles, subscribers)
async function appQuery(path: string, method: string, body?: unknown) {
  return await fetch(`${APP_URL}/rest/v1/${path}`, {
    method, headers: { "apikey": APP_KEY, "Authorization": `Bearer ${APP_KEY}`, "Content-Type": "application/json", "Prefer": "return=minimal" },
    body: body ? JSON.stringify(body) : undefined
  });
}

async function updateSubscriptionProfile(email: string, status: string, stripeCustomerId?: string, subscriptionId?: string) {
  await fetch(`${APP_URL}/rest/v1/rpc/update_subscription_status`, {
    method: 'POST',
    headers: { "apikey": APP_KEY, "Authorization": `Bearer ${APP_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ p_email: email, p_status: status, p_tier: status === 'active' ? 'pro' : 'free', p_stripe_customer_id: stripeCustomerId || null, p_subscription_id: subscriptionId || null })
  });
  console.log(`Profile updated (APP brain): ${email} -> ${status}`);
}

async function handleCheckout(session: any) {
  const email = session.customer_details?.email || session.customer_email;
  const customerName = session.customer_details?.name || "Customer";
  const amountTotal = (session.amount_total || 0) / 100;
  const currency = session.currency || "usd";
  const stripeCustomerId = session.customer;
  const paymentIntentId = session.payment_intent;
  const mode = session.mode;
  if (!email) { console.error("No email"); return; }

  let productId = session.metadata?.product_id || "";
  let productName = session.metadata?.product_name || "";
  if (session.line_items?.data?.[0]) { const item = session.line_items.data[0]; productId = productId || item.price?.product; productName = productName || item.description; }
  const subscriptionId = session.subscription;

  console.log(`Checkout: ${email}, ${productId}, $${amountTotal}, mode=${mode}`);

  // 1. Revenue event → REVENUE brain
  await revenueQuery("revenue_events", "POST", {
    date: new Date().toISOString().split("T")[0],
    revenue_stream: mode === "subscription" ? "subscription" : "digital_product",
    amount: amountTotal, currency: currency.toUpperCase(),
    event_type: mode === "subscription" ? "subscription" : "payment",
    client: customerName, description: productName || `Product: ${productId}`,
    payment_method: "stripe", external_ref: session.id,
    stripe_payment_intent_id: paymentIntentId, stripe_customer_id: stripeCustomerId,
    metadata: { product_id: productId, product_name: productName, email, session_mode: mode, subscription_id: subscriptionId }
  });
  console.log("Revenue event recorded");

  // 2. Giving (sliding scale) → REVENUE brain — THE GIVING NEVER STOPS
  const giving = await getGivingTier();
  const donationAmount = Math.round(amountTotal * giving.pct * 100) / 100;
  if (donationAmount > 0) {
    await revenueQuery("donation_ledger", "POST", {
      sale_amount: amountTotal, donation_amount: donationAmount, donation_pct: giving.pct,
      recipient: "amfAR", status: "accrued",
      tier_name: giving.tier, monthly_revenue: giving.monthlyRevenue,
      notes: `Sliding scale: ${giving.tier} tier (${(giving.pct * 100).toFixed(0)}%) at $${giving.monthlyRevenue.toFixed(2)}/mo revenue`
    });
    console.log(`Giving: $${donationAmount} to amfAR (${giving.tier} tier, ${(giving.pct * 100).toFixed(0)}%, $${giving.monthlyRevenue.toFixed(2)}/mo)`);
  }

  // 3. Update subscription profile → APP brain
  if (mode === "subscription") {
    await updateSubscriptionProfile(email, 'active', stripeCustomerId, subscriptionId);
  }

  // 4. Product delivery email → APP brain
  const downloadToken = await generateDownloadToken(email);
  try {
    await fetch(`${APP_URL}/functions/v1/send-product-delivery`, {
      method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${APP_KEY}` },
      body: JSON.stringify({ email, name: customerName, product_id: productId, amount: amountTotal, download_token: downloadToken })
    });
  } catch (err) { console.error("Delivery email failed:", err); }

  // 5. Academy enrollment → REVENUE brain
  if (mode === "subscription" && subscriptionId) {
    await revenueQuery("academy_enrollments", "POST", {
      user_email: email, user_name: customerName, status: "active",
      stripe_subscription_id: subscriptionId, stripe_payment_intent_id: paymentIntentId,
      metadata: { product_id: productId, enrolled_via: "stripe_webhook" }
    });
  }

  // 6. Notification → REVENUE brain
  await revenueQuery("notification_log", "POST", {
    type: "purchase", recipient: email, recipient_name: customerName,
    subject: `Purchase: ${productName || productId} ($${amountTotal})`,
    source: "stripe-webhook", status: "processed",
    html_body: JSON.stringify({ product_id: productId, amount: amountTotal, donation: donationAmount })
  });
}

async function handleSubscriptionDeleted(sub: any) {
  const subscriptionId = sub.id;
  const customerEmail = sub.metadata?.email || sub.customer_email;

  // Update profile → APP brain
  if (customerEmail) {
    await updateSubscriptionProfile(customerEmail, 'cancelled');
  } else {
    const resp = await fetch(`${APP_URL}/rest/v1/profiles?subscription_id=eq.${subscriptionId}&select=email`, {
      headers: { apikey: APP_KEY, Authorization: `Bearer ${APP_KEY}` }
    });
    const rows = await resp.json();
    if (rows[0]?.email) await updateSubscriptionProfile(rows[0].email, 'cancelled');
  }

  // Academy enrollment → REVENUE brain
  await fetch(`${REVENUE_URL}/rest/v1/academy_enrollments?stripe_subscription_id=eq.${subscriptionId}`, {
    method: "PATCH", headers: { "apikey": REVENUE_KEY, "Authorization": `Bearer ${REVENUE_KEY}`, "Content-Type": "application/json", "Prefer": "return=minimal" },
    body: JSON.stringify({ status: "cancelled", completed_at: new Date().toISOString() })
  });

  // Churn event → REVENUE brain
  await revenueQuery("revenue_events", "POST", {
    date: new Date().toISOString().split("T")[0], revenue_stream: "subscription",
    amount: 0, currency: "USD", event_type: "churn",
    client: customerEmail || "unknown", description: `Subscription ${subscriptionId} cancelled`,
    payment_method: "stripe", external_ref: subscriptionId, stripe_customer_id: sub.customer,
    metadata: { subscription_id: subscriptionId, cancel_reason: sub.cancellation_details?.reason }
  });
}

async function handleSubscriptionUpdated(sub: any) {
  const subscriptionId = sub.id;
  const status = sub.status;

  // Profile lookup → APP brain
  const resp = await fetch(`${APP_URL}/rest/v1/profiles?subscription_id=eq.${subscriptionId}&select=email`, {
    headers: { apikey: APP_KEY, Authorization: `Bearer ${APP_KEY}` }
  });
  const rows = await resp.json();
  if (rows[0]?.email) {
    const profileStatus = status === 'active' ? 'active' : status === 'past_due' ? 'past_due' : status === 'canceled' ? 'cancelled' : status;
    await updateSubscriptionProfile(rows[0].email, profileStatus);
  }

  // Enrollment update → REVENUE brain
  const enrollmentStatus = status === "active" ? "active" : status === "past_due" ? "past_due" : status === "canceled" ? "cancelled" : status;
  await fetch(`${REVENUE_URL}/rest/v1/academy_enrollments?stripe_subscription_id=eq.${subscriptionId}`, {
    method: "PATCH", headers: { "apikey": REVENUE_KEY, "Authorization": `Bearer ${REVENUE_KEY}`, "Content-Type": "application/json", "Prefer": "return=minimal" },
    body: JSON.stringify({ status: enrollmentStatus, metadata: { last_stripe_status: status, updated_at: new Date().toISOString() } })
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
  const body = await req.text();
  const sigHeader = req.headers.get("stripe-signature");
  if (!sigHeader) {
    try { const json = JSON.parse(body); return new Response(JSON.stringify({ received: true, type: json.type || "health", version: "v6-multibrain" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } }); }
    catch { return new Response(JSON.stringify({ status: "ok", version: "v6-multibrain" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } }); }
  }
  if (!await verifyStripeSignature(body, sigHeader, STRIPE_WEBHOOK_SECRET)) {
    return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
  const event = JSON.parse(body);
  console.log(`Stripe event: ${event.type} (${event.id})`);
  try {
    switch (event.type) {
      case "checkout.session.completed": await handleCheckout(event.data.object); break;
      case "customer.subscription.deleted": await handleSubscriptionDeleted(event.data.object); break;
      case "customer.subscription.updated": await handleSubscriptionUpdated(event.data.object); break;
      default: console.log(`Unhandled: ${event.type}`);
    }
  } catch (err) { console.error(`Error: ${event.type}:`, err); }
  return new Response(JSON.stringify({ received: true, type: event.type, version: "v6-multibrain" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
});
