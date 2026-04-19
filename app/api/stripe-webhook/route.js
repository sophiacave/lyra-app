import { NextResponse } from 'next/server';
import crypto from 'node:crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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

function brainHeaders() {
  const key = process.env.BRAIN_V2_SERVICE_KEY;
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
    Prefer: 'return=minimal',
  };
}

async function brainFetch(path, init = {}) {
  const url = process.env.BRAIN_URL;
  const res = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: { ...brainHeaders(), ...(init.headers || {}) },
  });
  return res;
}

async function brainSelect(path) {
  const res = await brainFetch(path, { method: 'GET', headers: { Prefer: '' } });
  if (!res.ok) return [];
  try { return await res.json(); } catch { return []; }
}

async function brainInsert(table, body) {
  const withId = body.id ? body : { id: crypto.randomUUID(), ...body };
  return brainFetch(table, { method: 'POST', body: JSON.stringify(withId) });
}

async function brainPatch(path, body) {
  return brainFetch(path, { method: 'PATCH', body: JSON.stringify(body) });
}

async function getGivingTier() {
  try {
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];
    const rows = await brainSelect(
      `revenue_events?date=gte.${since}&event_type=neq.churn&select=amount`
    );
    const monthlyRevenue = Array.isArray(rows)
      ? rows.reduce((s, r) => s + parseFloat(r.amount || 0), 0)
      : 0;
    const tier =
      GIVING_SCALE.find((t) => monthlyRevenue <= t.maxRevenue) ||
      GIVING_SCALE[GIVING_SCALE.length - 1];
    return { pct: tier.pct, tier: tier.tier, monthlyRevenue };
  } catch (err) {
    console.error('Giving tier lookup failed, defaulting to seed:', err);
    return { pct: 0.01, tier: 'seed', monthlyRevenue: 0 };
  }
}

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

async function upsertProfileSubscription(email, status, stripeCustomerId, subscriptionId) {
  const tier = status === 'active' ? 'pro' : 'free';
  const existing = await brainSelect(
    `profiles?email=eq.${encodeURIComponent(email)}&select=id`
  );
  const body = {
    subscription_status: status,
    subscription_tier: tier,
    stripe_customer_id: stripeCustomerId || null,
    subscription_id: subscriptionId || null,
    updated_at: new Date().toISOString(),
  };
  if (Array.isArray(existing) && existing.length > 0) {
    await brainPatch(`profiles?email=eq.${encodeURIComponent(email)}`, body);
  } else {
    await brainInsert('profiles', { email, ...body });
  }
}

async function syncBrainLedger() {
  try {
    const [ledgerRows, revenueRows] = await Promise.all([
      brainSelect(`donation_ledger?select=donation_amount,status,recipient&order=created_at.desc&limit=1000`),
      brainSelect(
        `revenue_events?select=amount&date=gte.${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}&event_type=neq.churn`
      ),
    ]);
    const totalAccrued = ledgerRows
      .filter((r) => r.status === 'accrued')
      .reduce((s, r) => s + parseFloat(r.donation_amount || 0), 0);
    const totalDonated = ledgerRows
      .filter((r) => r.status === 'donated')
      .reduce((s, r) => s + parseFloat(r.donation_amount || 0), 0);
    const monthlyRevenue = revenueRows.reduce((s, r) => s + parseFloat(r.amount || 0), 0);
    const giving = await getGivingTier();

    const recipients = {};
    for (const r of ledgerRows) {
      const key = r.recipient || 'unknown';
      if (!recipients[key]) recipients[key] = { accrued: 0, donated: 0 };
      recipients[key][r.status === 'donated' ? 'donated' : 'accrued'] += parseFloat(
        r.donation_amount || 0
      );
    }

    const ledgerStatus = {
      phase: 'C',
      source: 'stripe-webhook v10-rqlite',
      total_accrued: Math.round(totalAccrued * 100) / 100,
      total_donated: Math.round(totalDonated * 100) / 100,
      pending: Math.round((totalAccrued - totalDonated) * 100) / 100,
      recipients,
      current_pct: giving.pct * 100,
      current_tier: giving.tier,
      monthly_revenue: Math.round(monthlyRevenue * 100) / 100,
      total_revenue_lifetime: Math.round(monthlyRevenue * 100) / 100,
      ledger_rows: ledgerRows.length,
      revenue_events_rows_30d: revenueRows.length,
      last_sync: new Date().toISOString(),
      recurring_donation: {
        target: 'UCSF HIV Cure Research Fund',
        url: 'https://giving.ucsf.edu/fund/hiv-cure-research',
        amount_monthly: 5,
        status: 'SETUP_NEEDED',
      },
    };

    await brainPatch('brain_context?key=eq.giving.ledger_status', {
      value: ledgerStatus,
      description: `LIVE giving ledger status — written by stripe-webhook v10-rqlite. ${new Date().toISOString()}`,
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error('syncBrainLedger failed (non-fatal):', err);
  }
}

async function sendProductDelivery(email, name, productId, amount, downloadToken) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.log(`[DRY RUN] Would deliver ${productId} to ${email}`);
    return;
  }
  const subject = `Order confirmed: ${productId || 'purchase'}`;
  const html = `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#08080a;color:#e0e0e0;font-family:-apple-system,sans-serif"><div style="max-width:560px;margin:0 auto;padding:40px 24px"><h1 style="color:#fff;font-size:22px">Thanks, ${name || 'friend'} —</h1><p style="color:#aaa;font-size:15px;line-height:1.7">Your order is confirmed. Amount: $${amount}.</p>${downloadToken ? `<p><a href="https://likeone.ai/download?t=${encodeURIComponent(downloadToken)}" style="background:#c084fc;color:#000;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700">Access your purchase →</a></p>` : '<p style="color:#aaa">Visit <a href="https://likeone.ai/academy/" style="color:#c084fc">likeone.ai/academy</a> to start.</p>'}<p style="color:#888;font-size:13px;margin-top:32px">— Sophia at Like One</p></div></body></html>`;
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
    await brainInsert('notification_log', {
      type: 'product_delivery',
      recipient: email,
      recipient_name: name || '',
      subject,
      source: 'stripe-webhook',
      status: 'sent',
      html_body: JSON.stringify({ product_id: productId, amount, download_token: downloadToken ? 'present' : 'none' }),
    });
  } catch (err) {
    console.error('Product delivery failed:', err);
  }
}

async function handleCheckout(session) {
  const email = session.customer_details?.email || session.customer_email;
  const customerName = session.customer_details?.name || 'Customer';
  const amountTotal = (session.amount_total || 0) / 100;
  const currency = session.currency || 'usd';
  const stripeCustomerId = session.customer;
  const paymentIntentId = session.payment_intent;
  const mode = session.mode;
  if (!email) {
    console.error('No email');
    return;
  }

  let productId = session.metadata?.product_id || '';
  let productName = session.metadata?.product_name || '';
  if (session.line_items?.data?.[0]) {
    const item = session.line_items.data[0];
    productId = productId || item.price?.product;
    productName = productName || item.description;
  }
  const subscriptionId = session.subscription;

  await brainInsert('revenue_events', {
    date: new Date().toISOString().split('T')[0],
    revenue_stream: mode === 'subscription' ? 'subscription' : 'digital_product',
    amount: amountTotal,
    currency: currency.toUpperCase(),
    event_type: mode === 'subscription' ? 'subscription' : 'payment',
    client: customerName,
    description: productName || `Product: ${productId}`,
    payment_method: 'stripe',
    external_ref: session.id,
    stripe_payment_intent_id: paymentIntentId,
    stripe_customer_id: stripeCustomerId,
    metadata: { product_id: productId, product_name: productName, email, session_mode: mode, subscription_id: subscriptionId },
  });

  const giving = await getGivingTier();
  const donationAmount = Math.round(amountTotal * giving.pct * 100) / 100;
  if (donationAmount > 0) {
    const half = Math.round(donationAmount * 50) / 100;
    await brainInsert('donation_ledger', {
      sale_amount: amountTotal, donation_amount: half, donation_pct: giving.pct * 0.5,
      recipient: 'amfAR', status: 'accrued', tier_name: giving.tier, monthly_revenue: giving.monthlyRevenue,
      notes: `Sliding scale: ${giving.tier} (${(giving.pct * 100).toFixed(0)}%) at $${giving.monthlyRevenue.toFixed(2)}/mo — 50% HIV cure`,
    });
    await brainInsert('donation_ledger', {
      sale_amount: amountTotal, donation_amount: half, donation_pct: giving.pct * 0.5,
      recipient: 'NPR', status: 'accrued', tier_name: giving.tier, monthly_revenue: giving.monthlyRevenue,
      notes: `Sliding scale: ${giving.tier} (${(giving.pct * 100).toFixed(0)}%) at $${giving.monthlyRevenue.toFixed(2)}/mo — 50% public knowledge`,
    });
  }

  if (mode === 'subscription') {
    await upsertProfileSubscription(email, 'active', stripeCustomerId, subscriptionId);
  }

  const downloadToken = generateDownloadToken(email);
  await sendProductDelivery(email, customerName, productId, amountTotal, downloadToken);

  if (mode === 'subscription' && subscriptionId) {
    await brainInsert('academy_enrollments', {
      user_email: email, user_name: customerName, status: 'active',
      stripe_subscription_id: subscriptionId, stripe_payment_intent_id: paymentIntentId,
      metadata: { product_id: productId, enrolled_via: 'stripe_webhook' },
    });
  }

  await brainInsert('notification_log', {
    type: 'purchase', recipient: email, recipient_name: customerName,
    subject: `Purchase: ${productName || productId} ($${amountTotal})`,
    source: 'stripe-webhook', status: 'processed',
    html_body: JSON.stringify({ product_id: productId, amount: amountTotal, donation: donationAmount }),
  });

  const existingSub = await brainSelect(`subscribers?email=eq.${encodeURIComponent(email)}&select=id`);
  if (!Array.isArray(existingSub) || existingSub.length === 0) {
    await brainInsert('subscribers', {
      email, source: 'stripe_checkout', status: 'active',
      subscribed_at: new Date().toISOString(),
    });
  }

  await syncBrainLedger();
}

async function handleInvoicePaymentSucceeded(invoice) {
  const valid = ['subscription_cycle', 'subscription_update'];
  if (invoice.billing_reason === 'subscription_create') return;
  if (invoice.billing_reason && !valid.includes(invoice.billing_reason)) return;

  const email = invoice.customer_email;
  const customerName = invoice.customer_name || 'Subscriber';
  const amountPaid = (invoice.amount_paid || 0) / 100;
  const currency = invoice.currency || 'usd';
  const stripeCustomerId = invoice.customer;
  const subscriptionId = invoice.subscription;
  const paymentIntentId = invoice.payment_intent;
  if (!email || amountPaid <= 0) return;

  await brainInsert('revenue_events', {
    date: new Date().toISOString().split('T')[0],
    revenue_stream: 'subscription', amount: amountPaid, currency: currency.toUpperCase(),
    event_type: 'renewal', client: customerName,
    description: `Subscription renewal: ${invoice.lines?.data?.[0]?.description || subscriptionId}`,
    payment_method: 'stripe', external_ref: invoice.id,
    stripe_payment_intent_id: paymentIntentId, stripe_customer_id: stripeCustomerId,
    metadata: { subscription_id: subscriptionId, billing_reason: invoice.billing_reason, invoice_id: invoice.id, email },
  });

  const giving = await getGivingTier();
  const donationAmount = Math.round(amountPaid * giving.pct * 100) / 100;
  if (donationAmount > 0) {
    const half = Math.round(donationAmount * 50) / 100;
    await brainInsert('donation_ledger', {
      sale_amount: amountPaid, donation_amount: half, donation_pct: giving.pct * 0.5,
      recipient: 'amfAR', status: 'accrued', tier_name: giving.tier, monthly_revenue: giving.monthlyRevenue,
      notes: `Renewal: ${giving.tier} (${(giving.pct * 100).toFixed(0)}%) at $${giving.monthlyRevenue.toFixed(2)}/mo — 50% HIV cure`,
    });
    await brainInsert('donation_ledger', {
      sale_amount: amountPaid, donation_amount: half, donation_pct: giving.pct * 0.5,
      recipient: 'NPR', status: 'accrued', tier_name: giving.tier, monthly_revenue: giving.monthlyRevenue,
      notes: `Renewal: ${giving.tier} (${(giving.pct * 100).toFixed(0)}%) at $${giving.monthlyRevenue.toFixed(2)}/mo — 50% public knowledge`,
    });
  }

  await brainInsert('notification_log', {
    type: 'renewal', recipient: email, recipient_name: customerName,
    subject: `Renewal: $${amountPaid} (${invoice.billing_reason})`,
    source: 'stripe-webhook', status: 'processed',
    html_body: JSON.stringify({ amount: amountPaid, donation: donationAmount, subscription_id: subscriptionId }),
  });

  await syncBrainLedger();
}

async function handleSubscriptionDeleted(sub) {
  const subscriptionId = sub.id;
  const email = sub.metadata?.email || sub.customer_email;
  if (email) {
    await upsertProfileSubscription(email, 'cancelled');
  } else {
    const rows = await brainSelect(`profiles?subscription_id=eq.${subscriptionId}&select=email`);
    if (rows[0]?.email) await upsertProfileSubscription(rows[0].email, 'cancelled');
  }
  await brainPatch(`academy_enrollments?stripe_subscription_id=eq.${subscriptionId}`, {
    status: 'cancelled', completed_at: new Date().toISOString(),
  });
  await brainInsert('revenue_events', {
    date: new Date().toISOString().split('T')[0], revenue_stream: 'subscription',
    amount: 0, currency: 'USD', event_type: 'churn',
    client: email || 'unknown', description: `Subscription ${subscriptionId} cancelled`,
    payment_method: 'stripe', external_ref: subscriptionId, stripe_customer_id: sub.customer,
    metadata: { subscription_id: subscriptionId, cancel_reason: sub.cancellation_details?.reason },
  });
}

async function handleSubscriptionUpdated(sub) {
  const subscriptionId = sub.id;
  const status = sub.status;
  const rows = await brainSelect(`profiles?subscription_id=eq.${subscriptionId}&select=email`);
  if (rows[0]?.email) {
    const profileStatus =
      status === 'active' ? 'active' :
      status === 'past_due' ? 'past_due' :
      status === 'canceled' ? 'cancelled' : status;
    await upsertProfileSubscription(rows[0].email, profileStatus);
  }
  const enrollmentStatus =
    status === 'active' ? 'active' :
    status === 'past_due' ? 'past_due' :
    status === 'canceled' ? 'cancelled' : status;
  await brainPatch(`academy_enrollments?stripe_subscription_id=eq.${subscriptionId}`, {
    status: enrollmentStatus,
    metadata: { last_stripe_status: status, updated_at: new Date().toISOString() },
  });
}

export async function POST(req) {
  const body = await req.text();
  const sigHeader = req.headers.get('stripe-signature');
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sigHeader) {
    try {
      const json = JSON.parse(body);
      return NextResponse.json({ received: true, type: json.type || 'health', version: 'v10-rqlite' });
    } catch {
      return NextResponse.json({ status: 'ok', version: 'v10-rqlite' });
    }
  }
  if (!secret || !verifyStripeSignature(body, sigHeader, secret)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const event = JSON.parse(body);
  console.log(`Stripe event: ${event.type} (${event.id})`);
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckout(event.data.object); break;
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object); break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object); break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object); break;
      default:
        console.log(`Unhandled: ${event.type}`);
    }
  } catch (err) {
    console.error(`Error: ${event.type}:`, err);
  }
  return NextResponse.json({ received: true, type: event.type, version: 'v10-rqlite' });
}
