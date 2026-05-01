/**
 * stripe-db.js — Stripe as the subscription database. Zero Supabase.
 *
 * Stripe is the source of truth for:
 * - Customer existence
 * - Subscription status (active, cancelled, past_due)
 * - Payment history
 *
 * 2026-04-28 — Supabase independence
 */

const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_API_KEY;

async function stripeGet(path) {
  if (!STRIPE_SECRET) throw new Error('STRIPE_SECRET_KEY not configured');
  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    headers: { Authorization: `Bearer ${STRIPE_SECRET}` },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Stripe API ${res.status}`);
  }
  return res.json();
}

/**
 * Get subscription status for an email.
 * Returns { status, tier, customerId, subscriptionId } or null
 */
export async function getSubscriptionStatus(email) {
  if (!STRIPE_SECRET || !email) return null;
  try {
    const customers = await stripeGet(
      `/customers?email=${encodeURIComponent(email.toLowerCase().trim())}&limit=1`
    );
    if (!customers.data?.length) return null;

    const customer = customers.data[0];
    const subs = await stripeGet(
      `/subscriptions?customer=${customer.id}&status=active&limit=1`
    );

    if (subs.data?.length) {
      return {
        status: 'active',
        tier: 'pro',
        customerId: customer.id,
        subscriptionId: subs.data[0].id,
      };
    }

    // Check consulting Pro access (3-month comp via customer metadata)
    const consultingProExpires = customer.metadata?.consulting_pro_expires;
    if (consultingProExpires && new Date(consultingProExpires) > new Date()) {
      return {
        status: 'active',
        tier: 'pro',
        customerId: customer.id,
        subscriptionId: null,
      };
    }

    // Check for cancelled but not yet expired
    const allSubs = await stripeGet(
      `/subscriptions?customer=${customer.id}&limit=1`
    );
    if (allSubs.data?.length) {
      const sub = allSubs.data[0];
      return {
        status: sub.status === 'canceled' ? 'cancelled' : sub.status,
        tier: sub.status === 'active' ? 'pro' : 'free',
        customerId: customer.id,
        subscriptionId: sub.id,
      };
    }

    return {
      status: 'free',
      tier: 'free',
      customerId: customer.id,
      subscriptionId: null,
    };
  } catch (err) {
    console.error('Stripe subscription check failed:', err.message);
    return null;
  }
}

/**
 * Check if email is a pro member
 */
export async function isProMember(email) {
  const sub = await getSubscriptionStatus(email);
  return sub?.status === 'active' && sub?.tier === 'pro';
}

/**
 * Create a Stripe billing portal session for a customer
 */
export async function createBillingPortalSession(email, returnUrl) {
  if (!STRIPE_SECRET) return null;
  try {
    const sub = await getSubscriptionStatus(email);
    if (!sub?.customerId) return null;

    const res = await fetch('https://api.stripe.com/v1/billing_portal/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${STRIPE_SECRET}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        customer: sub.customerId,
        return_url: returnUrl || 'https://likeone.ai/account',
      }),
    });
    if (!res.ok) return null;
    const session = await res.json();
    return session.url;
  } catch {
    return null;
  }
}

/**
 * Cancel a subscription by email
 */
export async function cancelSubscription(email) {
  if (!STRIPE_SECRET) return { error: 'Stripe not configured' };
  try {
    const sub = await getSubscriptionStatus(email);
    if (!sub?.subscriptionId) return { error: 'No active subscription' };

    const res = await fetch(
      `https://api.stripe.com/v1/subscriptions/${sub.subscriptionId}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${STRIPE_SECRET}` },
      }
    );
    if (!res.ok) return { error: 'Cancel failed' };
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}
