import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Serve home.html at root without ugly /home.html in URL
  if (pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/home.html';
    return NextResponse.rewrite(url);
  }

  // Clean URL for about page
  if (pathname === '/about' || pathname === '/about/') {
    const url = request.nextUrl.clone();
    url.pathname = '/about.html';
    return NextResponse.rewrite(url);
  }

  // Clean URL for community access
  if (pathname === '/community-access' || pathname === '/community-access/') {
    const url = request.nextUrl.clone();
    url.pathname = '/community-access.html';
    return NextResponse.rewrite(url);
  }

  // Clean URL for pricing
  if (pathname === '/pricing' || pathname === '/pricing/') {
    const url = request.nextUrl.clone();
    url.pathname = '/pricing.html';
    return NextResponse.rewrite(url);
  }

  // Clean URL for privacy policy
  if (pathname === '/privacy' || pathname === '/privacy/') {
    const url = request.nextUrl.clone();
    url.pathname = '/privacy.html';
    return NextResponse.rewrite(url);
  }

  // Clean URL for terms of service
  if (pathname === '/terms' || pathname === '/terms/') {
    const url = request.nextUrl.clone();
    url.pathname = '/terms.html';
    return NextResponse.rewrite(url);
  }

  // Clean URL for support/donate page
  if (pathname === '/support' || pathname === '/support/') {
    const url = request.nextUrl.clone();
    url.pathname = '/support.html';
    return NextResponse.rewrite(url);
  }

  // Clean URL for account
  if (pathname === '/account' || pathname === '/account/') {
    const url = request.nextUrl.clone();
    url.pathname = '/account.html';
    return NextResponse.rewrite(url);
  }

  // Clean URL for meet-claude
  if (pathname === '/meet-claude' || pathname === '/meet-claude/') {
    const url = request.nextUrl.clone();
    url.pathname = '/meet-claude.html';
    return NextResponse.rewrite(url);
  }

  // Clean URL for forum
  if (pathname === '/forum' || pathname === '/forum/') {
    const url = request.nextUrl.clone();
    url.pathname = '/forum.html';
    return NextResponse.rewrite(url);
  }

  // Thank you page (after purchase)
  if (pathname === '/thank-you' || pathname === '/thank-you/') {
    const url = request.nextUrl.clone();
    url.pathname = '/thank-you.html';
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
  matcher: ['/', '/about', '/about/', '/pricing', '/pricing/', '/privacy', '/privacy/', '/terms', '/terms/', '/community-access', '/community-access/', '/support', '/support/', '/forum', '/forum/', '/meet-claude', '/meet-claude/', '/account', '/account/', '/thank-you', '/thank-you/', '/_temp', '/brain-tools/:path*', '/brain-mcp/:path*'],
};
