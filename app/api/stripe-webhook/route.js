import { NextResponse } from 'next/server';
import crypto from 'node:crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Stripe Webhook v11 — Sovereign. Zero Supabase.
 *
 * Stripe IS the database. This webhook:
 * 1. Verifies Stripe signature
 * 2. Sends product delivery emails via Resend
 * 3. Logs all events to console (Vercel captures)
 * 4. Calculates giving (derived from event data)
 *
 * Revenue tracking, subscription status, enrollment = all in Stripe.
 * No external DB writes needed.
 *
 * 2026-04-28 — Supabase independence
 */

const GIVING_SCALE = [
  { maxRevenue: 1000, pct: 0.01, tier: 'seed' },
  { maxRevenue: 5000, pct: 0.02, tier: 'growing' },
  { maxRevenue: 10000, pct: 0.05, tier: 'stable' },
  { maxRevenue: 50000, pct: 0.1, tier: 'thriving' },
  { maxRevenue: 100000, pct: 0.2, tier: 'abundant' },
  { maxRevenue: 500000, pct: 0.3, tier: 'wealthy' },
  { maxRevenue: 1000000, pct: 0.4, tier: 'beyond' },
  { maxRevenue: Infinity, pct: 0.5, tier: 'convergence' },
];

function verifyStripeSignature(payload, header, secret) {
  try {
    const parts = {};
    header.split(',').forEach((p) => {
      const idx = p.indexOf('=');
      if (idx > 0) parts[p.slice(0, idx)] = p.slice(idx + 1);
    });
    const timestamp = parts['t'];
    const sig = parts['v1'];
    if (!timestamp || !sig) return false;
    if (Math.abs(Math.floor(Date.now() / 1000) - parseInt(timestamp, 10)) > 300) return false;
    const mac = crypto
      .createHmac('sha256', secret)
      .update(`${timestamp}.${payload}`)
      .digest('hex');
    return crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(sig));
  } catch {
    return false;
  }
}

function generateDownloadToken(email) {
  const expiry = Date.now() + 365 * 24 * 60 * 60 * 1000;
  const payload = `${email}|${expiry}`;
  const secret = process.env.DOWNLOAD_TOKEN_SECRET || 'likeone-dl-2026-secret';
  const mac = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return Buffer.from(`${payload}|${mac}`).toString('base64');
}

function getGivingTier(monthlyRevenue) {
  const tier = GIVING_SCALE.find((t) => monthlyRevenue <= t.maxRevenue) || GIVING_SCALE[GIVING_SCALE.length - 1];
  return { pct: tier.pct, tier: tier.tier, monthlyRevenue };
}

async function sendProductDelivery(email, name, productId, amount, downloadToken) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.log(`[DRY RUN] Would deliver ${productId} to ${email}`);
    return;
  }
  const subject = `Order confirmed: ${productId || 'purchase'}`;
  const html = `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#1a1a1e;color:#e0e0e0;font-family:-apple-system,sans-serif"><div style="max-width:560px;margin:0 auto;padding:40px 24px"><h1 style="color:#fff;font-size:22px">Thanks, ${name || 'friend'} —</h1><p style="color:#aaa;font-size:15px;line-height:1.7">Your order is confirmed. Amount: $${amount}.</p>${downloadToken ? `<p><a href="https://likeone.ai/download?t=${encodeURIComponent(downloadToken)}" style="background:#c084fc;color:#000;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700">Access your purchase &rarr;</a></p>` : '<p style="color:#aaa">Visit <a href="https://likeone.ai/academy/" style="color:#c084fc">likeone.ai/academy</a> to start.</p>'}<p style="color:#888;font-size:13px;margin-top:32px">— Sophia at Like One</p></div></body></html>`;
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Sophia at Like One <hello@likeone.ai>',
        to: [email],
        subject,
        html,
      }),
    });
    console.log(`[Delivery] Sent to ${email}: ${productId} ($${amount})`);
  } catch (err) {
    console.error('Product delivery failed:', err);
  }
}

async function sendWelcomeEmail(email, name) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return;
  const firstName = name?.split(' ')[0] || 'there';
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Sophia Cave <hello@likeone.ai>',
        to: [email],
        bcc: ['sophiacave.me@gmail.com'],
        reply_to: 'hello@likeone.ai',
        subject: 'Welcome to Like One Academy Pro',
        html: `<div style="max-width:560px;margin:0 auto;padding:40px 24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1a1a1a"><h1 style="font-size:24px;font-weight:600;margin-bottom:24px">Welcome to Like One Academy Pro</h1><p>Hey ${firstName},</p><p>You now have full access to all 52 courses and 520+ lessons. Here's how to get started:</p><ol style="line-height:2"><li><strong>Browse courses</strong> &mdash; <a href="https://likeone.ai/academy/" style="color:#0066cc">likeone.ai/academy</a></li><li><strong>Start with AI fundamentals</strong> or jump into RAG, Agents, or MCP</li><li><strong>Build real systems</strong> &mdash; every course is hands-on</li></ol><p>Questions? Reply to this email. I read everything.</p><p style="margin-top:32px"><a href="https://likeone.ai/academy/" style="background:#1a1a1a;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block">Start Learning</a></p><p style="margin-top:32px;color:#666;font-size:14px">&mdash; Sophia Cave, Like One<br><a href="https://likeone.ai" style="color:#666">likeone.ai</a></p></div>`,
      }),
    });
    console.log(`[Welcome] Sent to ${email}`);
  } catch (err) {
    console.error('[Welcome] Failed:', err.message);
  }
}

// Consulting product IDs — any checkout for these triggers 3-month Pro access
const CONSULTING_PRODUCTS = new Set([
  'prod_UPs2eSjYsWsxLi', // LO Consulting — Starter ($500/mo)
  'prod_UPs2rJms8sE7Og', // LO Consulting — Retainer ($5,000/mo)
]);

async function grantConsultingProAccess(email, customerName) {
  const stripeKey = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_API_KEY;
  if (!stripeKey) return;

  try {
    // Find the customer
    const custRes = await fetch(
      `https://api.stripe.com/v1/customers?email=${encodeURIComponent(email.toLowerCase().trim())}&limit=1`,
      { headers: { Authorization: `Bearer ${stripeKey}` } }
    );
    const customers = await custRes.json();
    if (!customers.data?.length) {
      console.error(`[ConsultingPro] No Stripe customer found for ${email}`);
      return;
    }

    // Set consulting_pro_expires metadata — 90 days from now
    const expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();
    await fetch(`https://api.stripe.com/v1/customers/${customers.data[0].id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'metadata[consulting_pro_expires]': expiresAt,
      }),
    });

    console.log(`[ConsultingPro] Granted 3-month Academy Pro to ${email} (expires ${expiresAt})`);

    // Send Pro access email
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'Sophia at Like One <hello@likeone.ai>',
          to: [email],
          subject: 'Your 3 months of Academy Pro are live',
          html: `<div style="max-width:560px;margin:0 auto;padding:40px 24px;background:#1a1a1e;color:#e0e0e0;font-family:-apple-system,sans-serif"><h1 style="color:#fff;font-size:22px">Welcome to consulting, ${customerName || 'friend'}</h1><p style="color:#aaa;font-size:15px;line-height:1.7">As part of your consulting engagement, you now have <strong style="color:#c084fc">3 months of full Academy Pro access</strong> — all 52 courses, 520+ lessons, downloads, and certificates.</p><p style="color:#aaa;font-size:15px;line-height:1.7">Learn the theory while we build the practice together.</p><p><a href="https://likeone.ai/academy/" style="display:inline-block;background:#c084fc;color:#000;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700">Start learning &rarr;</a></p><p style="color:#555;font-size:13px;margin-top:32px">Your Pro access expires ${new Date(expiresAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.</p><p style="color:#888;font-size:13px">— Sophia at Like One</p></div>`,
        }),
      });
    }
  } catch (err) {
    console.error('[ConsultingPro] Error:', err);
  }
}

function handleCheckout(session) {
  const email = session.customer_details?.email || session.customer_email;
  const customerName = session.customer_details?.name || 'Customer';
  const amountTotal = (session.amount_total || 0) / 100;
  const mode = session.mode;
  const productId = session.metadata?.product_id || session.line_items?.data?.[0]?.price?.product || '';
  const productName = session.metadata?.product_name || session.line_items?.data?.[0]?.description || '';

  if (!email) {
    console.error('[Webhook] checkout.session.completed: No email');
    return;
  }

  // Log revenue event
  console.log(`[Revenue] ${mode} $${amountTotal} from ${email} product=${productId || productName}`);

  // Calculate giving
  const giving = getGivingTier(100);
  const donationAmount = Math.round(amountTotal * giving.pct * 100) / 100;
  if (donationAmount > 0) {
    const half = Math.round(donationAmount * 50) / 100;
    console.log(`[Giving] $${half} to amfAR + $${half} to NPR (${giving.tier} tier, ${(giving.pct * 100).toFixed(0)}%)`);
  }

  // Send delivery email
  const downloadToken = generateDownloadToken(email);
  sendProductDelivery(email, customerName, productId, amountTotal, downloadToken);

  // Welcome email with onboarding
  sendWelcomeEmail(email, customerName);

  // Grant 3-month Pro for consulting customers
  // Detect by product ID or amount ($500+)
  const isConsulting = CONSULTING_PRODUCTS.has(productId) || amountTotal >= 500;
  if (isConsulting) {
    grantConsultingProAccess(email, customerName);
  }

  console.log(`[Checkout] Complete: ${email} ${mode} $${amountTotal} ${productName || productId}${isConsulting ? ' [CONSULTING → 3mo Pro]' : ''}`);
}

function handleInvoicePaymentSucceeded(invoice) {
  const valid = ['subscription_cycle', 'subscription_update'];
  if (invoice.billing_reason === 'subscription_create') return;
  if (invoice.billing_reason && !valid.includes(invoice.billing_reason)) return;

  const email = invoice.customer_email;
  const amountPaid = (invoice.amount_paid || 0) / 100;
  if (!email || amountPaid <= 0) return;

  console.log(`[Revenue] renewal $${amountPaid} from ${email} (${invoice.billing_reason})`);

  const giving = getGivingTier(100);
  const donationAmount = Math.round(amountPaid * giving.pct * 100) / 100;
  if (donationAmount > 0) {
    const half = Math.round(donationAmount * 50) / 100;
    console.log(`[Giving] Renewal: $${half} to amfAR + $${half} to NPR`);
  }
}

function handleSubscriptionDeleted(sub) {
  const email = sub.metadata?.email || sub.customer_email;
  console.log(`[Churn] Subscription ${sub.id} cancelled for ${email || 'unknown'}`);
}

function handleSubscriptionUpdated(sub) {
  console.log(`[Sub] ${sub.id} status=${sub.status}`);
}

export async function POST(req) {
  const body = await req.text();
  const sigHeader = req.headers.get('stripe-signature');
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sigHeader) {
    try {
      const json = JSON.parse(body);
      return NextResponse.json({ received: true, type: json.type || 'health', version: 'v11-sovereign' });
    } catch {
      return NextResponse.json({ status: 'ok', version: 'v11-sovereign' });
    }
  }
  if (!secret || !verifyStripeSignature(body, sigHeader, secret)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const event = JSON.parse(body);
  console.log(`[Stripe] ${event.type} (${event.id})`);
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        handleCheckout(event.data.object); break;
      case 'invoice.payment_succeeded':
        handleInvoicePaymentSucceeded(event.data.object); break;
      case 'customer.subscription.deleted':
        handleSubscriptionDeleted(event.data.object); break;
      case 'customer.subscription.updated':
        handleSubscriptionUpdated(event.data.object); break;
      default:
        console.log(`[Stripe] Unhandled: ${event.type}`);
    }
  } catch (err) {
    console.error(`[Stripe] Error processing ${event.type}:`, err);
  }
  return NextResponse.json({ received: true, type: event.type, version: 'v11-sovereign' });
}
