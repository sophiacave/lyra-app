import "jsr:@supabase/functions-js/edge-runtime.d.ts";

/**
 * Send Product Delivery Email
 * Called by stripe-webhook after successful purchase.
 * Uses Resend API for transactional email (free: 100/day).
 * Fallback: logs to notification_log if Resend isn't configured.
 */

// Writes notification_log to self (app brain) — email delivery records
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "";
const FROM_EMAIL = "Sophia at Like One <hello@likeone.ai>";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface DeliveryRequest {
  email: string;
  name?: string;
  product_id?: string;
  amount?: number;
  download_token?: string;
}

function buildEmailHtml(req: DeliveryRequest): string {
  const name = req.name || "there";
  const product = req.product_id?.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()) || "your purchase";

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#08080a;color:#e0e0e0;font-family:-apple-system,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:40px 24px;">
  <div style="text-align:center;margin-bottom:32px;">
    <h1 style="color:#fff;font-size:24px;margin:0;">Thank you, ${name}!</h1>
    <p style="color:#aaa;margin-top:8px;">Your order is confirmed.</p>
  </div>

  <div style="background:#111114;border:1px solid #1e1e28;border-radius:8px;padding:24px;margin-bottom:24px;">
    <p style="margin:0 0 8px;color:#c084fc;font-weight:600;">Order Details</p>
    <p style="margin:0;color:#ccc;">Product: ${product}</p>
    ${req.amount ? `<p style="margin:4px 0 0;color:#ccc;">Amount: $${req.amount}</p>` : ""}
  </div>

  <div style="background:#111114;border:1px solid #1e1e28;border-radius:8px;padding:24px;margin-bottom:24px;">
    <p style="margin:0 0 8px;color:#c084fc;font-weight:600;">What's Next</p>
    <p style="margin:0;color:#ccc;">Your Academy access is now active. Sign in at:</p>
    <a href="https://likeone.ai/account" style="display:inline-block;margin-top:12px;padding:12px 24px;background:linear-gradient(135deg,#6c5ce7,#c084fc);color:#fff;text-decoration:none;border-radius:6px;font-weight:600;">Go to My Account</a>
  </div>

  <div style="text-align:center;padding:16px;border-top:1px solid #1e1e28;margin-top:32px;">
    <p style="color:#666;font-size:12px;margin:0;">1% of your purchase supports HIV/AIDS research via amfAR.</p>
    <p style="color:#666;font-size:12px;margin:4px 0 0;">Like One | <a href="https://likeone.ai" style="color:#c084fc;">likeone.ai</a></p>
  </div>
</div>
</body>
</html>`;
}

async function sendViaResend(to: string, subject: string, html: string): Promise<boolean> {
  if (!RESEND_API_KEY) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM_EMAIL, to: [to], subject, html }),
    });
    if (res.ok) {
      console.log(`Email sent to ${to} via Resend`);
      return true;
    }
    console.error(`Resend error: ${res.status} ${await res.text()}`);
    return false;
  } catch (e) {
    console.error(`Resend failed: ${e}`);
    return false;
  }
}

async function logToNotificationTable(req: DeliveryRequest, sent: boolean) {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/notification_log`, {
      method: "POST",
      headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({
        type: "product_delivery",
        recipient: req.email,
        recipient_name: req.name || "",
        subject: `Order confirmed: ${req.product_id || "purchase"}`,
        source: "send-product-delivery",
        status: sent ? "sent" : "logged_no_email",
        html_body: JSON.stringify({ product_id: req.product_id, amount: req.amount, download_token: req.download_token ? "present" : "none" }),
      }),
    });
  } catch (_) {}
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });

  try {
    const body: DeliveryRequest = await req.json();
    if (!body.email) {
      return new Response(JSON.stringify({ error: "Email required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const subject = `Your Like One order is confirmed!`;
    const html = buildEmailHtml(body);
    const sent = await sendViaResend(body.email, subject, html);
    await logToNotificationTable(body, sent);

    return new Response(
      JSON.stringify({ success: true, email_sent: sent, fallback: !sent ? "logged_to_notification_table" : undefined }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("Delivery error:", e);
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
