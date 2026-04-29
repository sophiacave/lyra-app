/**
 * auth.js — Sovereign auth system. Zero Supabase dependency.
 *
 * HMAC-signed tokens via Resend magic links.
 * Session stored in httpOnly cookie + localStorage mirror.
 *
 * 2026-04-28 — Supabase independence
 */

import crypto from 'node:crypto';

const AUTH_SECRET = process.env.AUTH_SECRET || process.env.STRIPE_WEBHOOK_SECRET || 'likeone-auth-2026-sovereign';
const TOKEN_TTL = 30 * 24 * 60 * 60 * 1000; // 30 days
const MAGIC_LINK_TTL = 15 * 60 * 1000; // 15 minutes

function hmac(payload) {
  return crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('hex');
}

/**
 * Create a magic link token (short-lived, for email)
 */
export function createMagicToken(email) {
  const exp = Date.now() + MAGIC_LINK_TTL;
  const payload = JSON.stringify({ email: email.toLowerCase().trim(), exp, type: 'magic' });
  const b64 = Buffer.from(payload).toString('base64url');
  return `${b64}.${hmac(b64)}`;
}

/**
 * Verify a magic link token, returns { email } or null
 */
export function verifyMagicToken(token) {
  try {
    const [b64, sig] = token.split('.');
    if (!b64 || !sig) return null;
    if (hmac(b64) !== sig) return null;
    const payload = JSON.parse(Buffer.from(b64, 'base64url').toString());
    if (payload.type !== 'magic') return null;
    if (Date.now() > payload.exp) return null;
    return { email: payload.email };
  } catch {
    return null;
  }
}

/**
 * Create a session token (long-lived, stored in cookie)
 */
export function createSessionToken(email) {
  const exp = Date.now() + TOKEN_TTL;
  const payload = JSON.stringify({ email: email.toLowerCase().trim(), exp, type: 'session' });
  const b64 = Buffer.from(payload).toString('base64url');
  return `${b64}.${hmac(b64)}`;
}

/**
 * Verify a session token, returns { email } or null
 */
export function verifySessionToken(token) {
  try {
    if (!token) return null;
    const [b64, sig] = token.split('.');
    if (!b64 || !sig) return null;
    if (hmac(b64) !== sig) return null;
    const payload = JSON.parse(Buffer.from(b64, 'base64url').toString());
    if (payload.type !== 'session') return null;
    if (Date.now() > payload.exp) return null;
    return { email: payload.email };
  } catch {
    return null;
  }
}

/**
 * Extract session from request (cookie or Authorization header)
 */
export function getSessionFromRequest(request) {
  // Try cookie first
  const cookies = request.headers.get('cookie') || '';
  const match = cookies.match(/lo_session=([^;]+)/);
  if (match) {
    const result = verifySessionToken(match[1]);
    if (result) return result;
  }

  // Try Authorization header
  const auth = request.headers.get('authorization');
  if (auth?.startsWith('Bearer ')) {
    return verifySessionToken(auth.slice(7));
  }

  return null;
}

/**
 * Build Set-Cookie header for session
 */
export function sessionCookieHeader(token) {
  const maxAge = 30 * 24 * 60 * 60; // 30 days in seconds
  return `lo_session=${token}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=${maxAge}`;
}

/**
 * Build Set-Cookie header to clear session
 */
export function clearSessionCookieHeader() {
  return 'lo_session=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0';
}
