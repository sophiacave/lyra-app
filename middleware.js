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
  matcher: ['/', '/about', '/about/', '/_temp', '/brain-tools/:path*', '/brain-mcp/:path*'],
};
