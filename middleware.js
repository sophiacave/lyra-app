import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Clean URL for community access (still static HTML — complex JS)
  if (pathname === '/community-access' || pathname === '/community-access/') {
    const url = request.nextUrl.clone();
    url.pathname = '/community-access.html';
    return NextResponse.rewrite(url);
  }

  // Clean URL for account (still static HTML — Supabase Auth JS)
  if (pathname === '/account' || pathname === '/account/') {
    const url = request.nextUrl.clone();
    url.pathname = '/account.html';
    return NextResponse.rewrite(url);
  }

  // Clean URL for forum (still static HTML — complex Supabase JS)
  if (pathname === '/forum' || pathname === '/forum/') {
    const url = request.nextUrl.clone();
    url.pathname = '/forum.html';
    return NextResponse.rewrite(url);
  }

  // Rewrite /_temp to /temp (Next.js treats _prefixed folders as private)
  if (pathname === '/_temp') {
    const url = request.nextUrl.clone();
    url.pathname = '/temp';
    return NextResponse.rewrite(url);
  }

  // Block public access to brain tools and MCP server
  if (pathname.startsWith('/brain-tools') || pathname.startsWith('/brain-mcp')) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}

export const config = {
  matcher: [
    '/community-access', '/community-access/',
    '/account', '/account/',
    '/forum', '/forum/',
    '/_temp',
    '/brain-tools/:path*', '/brain-mcp/:path*',
  ],
};
