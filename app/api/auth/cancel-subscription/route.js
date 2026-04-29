import { NextResponse } from 'next/server';
import { getSessionFromRequest } from '../../../lib/auth.js';
import { cancelSubscription } from '../../../lib/stripe-db.js';

export const runtime = 'nodejs';

export async function POST(req) {
  const session = getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const result = await cancelSubscription(session.email);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ success: true, message: 'Subscription cancelled. You keep access until current period ends.' });
}
