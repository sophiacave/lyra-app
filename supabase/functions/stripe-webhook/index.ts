import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;  // revenue project (auto-injected)
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;
const DOWNLOAD_TOKEN_SECRET = Deno.env.get("DOWNLOAD_TOKEN_SECRET") || "likeone-dl-2026-secret";
const DONATION_PCT = 0.01;

// Cross-project: app brain for profiles + enrollments
const APP_URL = Deno.env.get("APP_SUPABASE_URL") || SUPABASE_URL;
const APP_KEY = Deno.env.get("APP_SERVICE_KEY") || SERVICE_ROLE_KEY;

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

async function supabaseQuery(path: string, method: string, body?: unknown) {
  return await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method, headers: { "apikey": SERVICE_ROLE_KEY, "Authorization": `Bearer ${SERVICE_ROLE_KEY}`, "Content-Type": "application/json", "Prefer": "return=minimal" },
    body: body ? JSON.stringify(body) : undefined
  });
}

async function updateSubscriptionProfile(email: string, status: string, stripeCustomerId?: string, subscriptionId?: string) {
  await fetch(`${APP_URL}/rest/v1/rpc/update_subscription_status`, {
    method: 'POST',
    headers: { "apikey": APP_KEY, "Authorization": `Bearer ${APP_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ p_email: email, p_status: status, p_tier: status === 'active' ? 'pro' : 'free', p_stripe_customer_id: stripeCustomerId || null, p_subscription_id: subscriptionId || null })
  });
  console.log(`Profile updated: ${email} -> ${status}`);
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

  // 1. Revenue event
  await supabaseQuery("revenue_events", "POST", {
    date: new Date().toISOString().split("T")[0],
    revenue_stream: mode === "subscription" ? "subscription" : "digital_product",
    amount: amountTotal, currency: currency.toUpperCase(),
    event_type: mode === "subscription" ? "subscription" : "payment",
    client: customerName, description: productName || `Product: ${productId}`,
    payment_method: "stripe", external_ref: session.id,
    stripe_payment_intent_id: paymentIntentId, stripe_customer_id: stripeCustomerId,
    metadata: { product_id: productId, product_name: productName, email, session_mode: mode, subscription_id: subscriptionId }
  });

  // 2. Donation (1%)
  const donationAmount = Math.round(amountTotal * DONATION_PCT * 100) / 100;
  if (donationAmount > 0) {
    await supabaseQuery("donation_ledger", "POST", { sale_amount: amountTotal, donation_amount: donationAmount, donation_pct: DONATION_PCT, recipient: "amfAR", status: "accrued" });
  }

  // 3. UPDATE SUBSCRIPTION PROFILE
  if (mode === "subscription") {
    await updateSubscriptionProfile(email, 'active', stripeCustomerId, subscriptionId);
    console.log(`Subscription activated for ${email}`);
  }

  // 4. Product delivery email
  const downloadToken = await generateDownloadToken(email);
  try {
    await fetch(`${SUPABASE_URL}/functions/v1/send-product-delivery`, {
      method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${SERVICE_ROLE_KEY}` },
      body: JSON.stringify({ email, name: customerName, product_id: productId, amount: amountTotal, download_token: downloadToken })
    });
  } catch (err) { console.error("Delivery failed:", err); }

  // 5. Academy enrollment
  if (mode === "subscription" && subscriptionId) {
    await fetch(`${APP_URL}/rest/v1/academy_enrollments`, {
      method: "POST", headers: { "apikey": APP_KEY, "Authorization": `Bearer ${APP_KEY}`, "Content-Type": "application/json", "Prefer": "return=minimal" },
      body: JSON.stringify({ user_email: email, user_name: customerName, status: "active",
        stripe_subscription_id: subscriptionId, stripe_payment_intent_id: paymentIntentId,
        metadata: { product_id: productId, enrolled_via: "stripe_webhook" } })
    });
  }

  // 6. Notification
  await supabaseQuery("notification_log", "POST", {
    type: "purchase", recipient: email, recipient_name: customerName,
    subject: `Purchase: ${productName || productId} ($${amountTotal})`,
    source: "stripe-webhook", status: "processed",
    html_body: JSON.stringify({ product_id: productId, amount: amountTotal, donation: donationAmount })
  });
}

async function handleSubscriptionDeleted(sub: any) {
  const subscriptionId = sub.id;
  const customerEmail = sub.metadata?.email || sub.customer_email;
  
  // Update profile to free
  if (customerEmail) {
    await updateSubscriptionProfile(customerEmail, 'cancelled');
  } else {
    // Try to find email from profiles table by subscription_id (app project)
    const resp = await fetch(`${APP_URL}/rest/v1/profiles?subscription_id=eq.${subscriptionId}&select=email`, {
      headers: { apikey: APP_KEY, Authorization: `Bearer ${APP_KEY}` }
    });
    const rows = await resp.json();
    if (rows[0]?.email) await updateSubscriptionProfile(rows[0].email, 'cancelled');
  }

  await fetch(`${APP_URL}/rest/v1/academy_enrollments?stripe_subscription_id=eq.${subscriptionId}`, {
    method: "PATCH", headers: { "apikey": APP_KEY, "Authorization": `Bearer ${APP_KEY}`, "Content-Type": "application/json", "Prefer": "return=minimal" },
    body: JSON.stringify({ status: "cancelled", completed_at: new Date().toISOString() })
  });
  await supabaseQuery("revenue_events", "POST", {
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
  
  // Update profile subscription status
  const resp = await fetch(`${APP_URL}/rest/v1/profiles?subscription_id=eq.${subscriptionId}&select=email`, {
    headers: { apikey: APP_KEY, Authorization: `Bearer ${APP_KEY}` }
  });
  const rows = await resp.json();
  if (rows[0]?.email) {
    const profileStatus = status === 'active' ? 'active' : status === 'past_due' ? 'past_due' : status === 'canceled' ? 'cancelled' : status;
    await updateSubscriptionProfile(rows[0].email, profileStatus);
  }

  const enrollmentStatus = status === "active" ? "active" : status === "past_due" ? "past_due" : status === "canceled" ? "cancelled" : status;
  await fetch(`${APP_URL}/rest/v1/academy_enrollments?stripe_subscription_id=eq.${subscriptionId}`, {
    method: "PATCH", headers: { "apikey": APP_KEY, "Authorization": `Bearer ${APP_KEY}`, "Content-Type": "application/json", "Prefer": "return=minimal" },
    body: JSON.stringify({ status: enrollmentStatus, metadata: { last_stripe_status: status, updated_at: new Date().toISOString() } })
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
  const body = await req.text();
  const sigHeader = req.headers.get("stripe-signature");
  if (!sigHeader) {
    try { const json = JSON.parse(body); return new Response(JSON.stringify({ received: true, type: json.type || "health", version: "v4" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } }); }
    catch { return new Response(JSON.stringify({ status: "ok", version: "v4-sub" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } }); }
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
  return new Response(JSON.stringify({ received: true, type: event.type, version: "v4" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
});