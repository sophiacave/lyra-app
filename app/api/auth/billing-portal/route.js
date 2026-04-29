import { NextResponse } from 'next/server';
import { getSessionFromRequest } from '../../../lib/auth.js';
import { createBillingPortalSession } from '../../../lib/stripe-db.js';

export const runtime = 'nodejs';

export async function POST(req) {
  const session = getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const url = await createBillingPortalSession(session.email, 'https://likeone.ai/account');
  if (!url) {
    return NextResponse.json({ error: 'No subscription found or Stripe unavailable' }, { status: 404 });
  }

  return NextResponse.json({ url });
}
