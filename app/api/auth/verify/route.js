import { NextResponse } from 'next/server';
import { verifyMagicToken, createSessionToken, sessionCookieHeader } from '../../../lib/auth.js';

export const runtime = 'nodejs';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');
  const returnTo = searchParams.get('returnTo') || '/account';

  if (!token) {
    return NextResponse.redirect(new URL('/account?error=missing_token', req.url));
  }

  const result = verifyMagicToken(token);
  if (!result) {
    return NextResponse.redirect(new URL('/account?error=invalid_or_expired', req.url));
  }

  // Create long-lived session
  const sessionToken = createSessionToken(result.email);
  const origin = new URL(req.url).origin;
  const redirectUrl = new URL(returnTo, origin);

  // Add session info to URL for client-side localStorage sync
  redirectUrl.searchParams.set('lo_auth', sessionToken);
  redirectUrl.searchParams.set('lo_email', result.email);

  const response = NextResponse.redirect(redirectUrl);
  response.headers.set('Set-Cookie', sessionCookieHeader(sessionToken));
  return response;
}
