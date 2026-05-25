import { NextResponse } from 'next/server';
import { getSessionFromRequest, clearSessionCookieHeader } from '../../../lib/auth.js';
import { getSubscriptionStatus } from '../../../lib/stripe-db.js';
import { getProfile, getProgress } from '../../../lib/supabase.js';

export const runtime = 'nodejs';

export async function GET(req) {
  const session = getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ authenticated: false });
  }

  // Parallel fetch: Stripe sub status + Supabase profile + progress
  const [sub, profile, progress] = await Promise.all([
    getSubscriptionStatus(session.email),
    getProfile(session.email),
    getProgress(session.email),
  ]);

  return NextResponse.json({
    authenticated: true,
    email: session.email,
    name: profile?.full_name || null,
    subscription: sub || { status: 'free', tier: 'free' },
    progress: {
      xp: progress.totalXp,
      level: progress.level,
      streak: progress.streak,
      lessonsCompleted: progress.completedLessons.length,
    },
  });
}

export async function DELETE(req) {
  const response = NextResponse.json({ success: true });
  response.headers.set('Set-Cookie', clearSessionCookieHeader());
  return response;
}
