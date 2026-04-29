import { NextResponse } from 'next/server';
import { getSessionFromRequest, clearSessionCookieHeader } from '../../../lib/auth.js';
import { getSubscriptionStatus } from '../../../lib/stripe-db.js';

export const runtime = 'nodejs';

export async function GET(req) {
  const session = getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ authenticated: false });
  }

  const sub = await getSubscriptionStatus(session.email);

  return NextResponse.json({
    authenticated: true,
    email: session.email,
    subscription: sub || { status: 'free', tier: 'free' },
  });
}

export async function DELETE(req) {
  const response = NextResponse.json({ success: true });
  response.headers.set('Set-Cookie', clearSessionCookieHeader());
  return response;
}
