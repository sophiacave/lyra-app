import { NextResponse } from 'next/server';

// --- CORS config ---
const ALLOWED_ORIGINS = [
  'https://likeone.ai',
  'capacitor://localhost',
  'http://localhost:3000',
];
const ALLOWED_METHODS = 'GET, POST, OPTIONS';
const ALLOWED_HEADERS = 'Content-Type, Authorization';

// --- Auth config ---
const AUTH_SECRET = process.env.AUTH_SECRET || process.env.STRIPE_WEBHOOK_SECRET || 'likeone-auth-2026-sovereign';
// /account handles its own auth state (shows sign-in form when not authed)
// /profile is purely user data — must be gated
const AUTH_GATED_PREFIXES = ['/profile'];

function buildCorsHeaders(origin) {
  const headers = new Headers();
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Vary', 'Origin');
  }
  headers.set('Access-Control-Allow-Methods', ALLOWED_METHODS);
  headers.set('Access-Control-Allow-Headers', ALLOWED_HEADERS);
  headers.set('Access-Control-Max-Age', '86400');
  return headers;
}

async function verifySessionEdge(token) {
  try {
    const [b64, sig] = token.split('.');
    if (!b64 || !sig) return null;

    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(AUTH_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const signed = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(b64));
    const expectedHex = Array.from(new Uint8Array(signed))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    if (expectedHex !== sig) return null;

    const padding = '='.repeat((4 - (b64.length % 4)) % 4);
    const decoded = atob(b64.replace(/-/g, '+').replace(/_/g, '/') + padding);
    const payload = JSON.parse(decoded);

    if (payload.type !== 'session' || Date.now() > payload.exp) return null;
    return { email: payload.email };
  } catch {
    return null;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Block public access to brain tools and MCP server
  if (pathname.startsWith('/brain-tools') || pathname.startsWith('/brain-mcp')) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // Auth gating for protected routes
  if (AUTH_GATED_PREFIXES.some(p => pathname.startsWith(p))) {
    const sessionCookie = request.cookies.get('lo_session')?.value;
    if (!sessionCookie) {
      return redirectToLogin(request, pathname);
    }
    const session = await verifySessionEdge(sessionCookie);
    if (!session) {
      return redirectToLogin(request, pathname);
    }
    const response = NextResponse.next();
    response.headers.set('x-user-email', session.email);
    return response;
  }

  // CORS for /api/v1/*
  if (pathname.startsWith('/api/v1/')) {
    const origin = request.headers.get('origin');
    const corsHeaders = buildCorsHeaders(origin);

    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 204, headers: corsHeaders });
    }

    const response = NextResponse.next();
    corsHeaders.forEach((value, key) => response.headers.set(key, value));
    return response;
  }

  return NextResponse.next();
}

function redirectToLogin(request, returnTo) {
  const url = new URL('/', request.url);
  url.searchParams.set('login', '1');
  url.searchParams.set('returnTo', returnTo);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/api/v1/:path*',
    '/brain-tools/:path*',
    '/brain-mcp/:path*',
  ],
};
