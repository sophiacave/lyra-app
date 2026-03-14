import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  // Rewrite /_temp to /temp (Next.js treats _prefixed folders as private)
  if (pathname === '/_temp') {
    const url = request.nextUrl.clone();
    url.pathname = '/temp';
    return NextResponse.rewrite(url);
  }
}

export const config = {
  matcher: ['/_temp'],
};
