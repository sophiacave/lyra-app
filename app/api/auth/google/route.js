import { NextResponse } from 'next/server';
import { createSessionToken, sessionCookieHeader } from '../../../lib/auth.js';
import { upsertProfile } from '../../../lib/supabase.js';

export const runtime = 'nodejs';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

export async function POST(req) {
  try {
    const { credential } = await req.json();
    if (!credential) {
      return NextResponse.json({ error: 'Missing credential' }, { status: 400 });
    }

    // Verify the Google ID token
    const payload = await verifyGoogleToken(credential);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { email, name, picture, email_verified } = payload;
    if (!email_verified) {
      return NextResponse.json({ error: 'Email not verified' }, { status: 401 });
    }

    // Create our own session (same as magic link auth)
    const sessionToken = createSessionToken(email);
    const cookie = sessionCookieHeader(sessionToken);

    // Upsert user profile in Supabase (fire-and-forget, don't block login)
    upsertProfile({ email, name, picture }).catch(() => {});

    const response = NextResponse.json({
      success: true,
      email,
      name: name || email.split('@')[0],
      picture,
    });

    response.headers.set('Set-Cookie', cookie);
    return response;
  } catch (err) {
    console.error('Google auth error:', err);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

async function verifyGoogleToken(idToken) {
  // Verify via Google's tokeninfo endpoint (simplest, no library needed)
  const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
  if (!res.ok) return null;

  const payload = await res.json();

  // Verify audience matches our client ID
  if (GOOGLE_CLIENT_ID && payload.aud !== GOOGLE_CLIENT_ID) {
    console.error('Token audience mismatch:', payload.aud);
    return null;
  }

  // Verify issuer
  if (!['accounts.google.com', 'https://accounts.google.com'].includes(payload.iss)) {
    return null;
  }

  // Verify not expired
  if (payload.exp && Number(payload.exp) * 1000 < Date.now()) {
    return null;
  }

  return {
    email: payload.email,
    name: payload.name,
    picture: payload.picture,
    email_verified: payload.email_verified === 'true' || payload.email_verified === true,
  };
}
