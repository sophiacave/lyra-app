import { NextResponse } from 'next/server';

const ALLOWED_ORIGINS = [
  'https://likeone.ai',
  'capacitor://localhost',
  'http://localhost:3000',
];

const ALLOWED_METHODS = 'GET, POST, OPTIONS';
const ALLOWED_HEADERS = 'Content-Type, Authorization';

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

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Block public access to brain tools and MCP server
  if (pathname.startsWith('/brain-tools') || pathname.startsWith('/brain-mcp')) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // CORS for /api/v1/*
  if (pathname.startsWith('/api/v1/')) {
    const origin = request.headers.get('origin');
    const corsHeaders = buildCorsHeaders(origin);

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    // Pass through and attach CORS headers to the response
    const response = NextResponse.next();
    corsHeaders.forEach((value, key) => {
      response.headers.set(key, value);
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/v1/:path*',
    '/brain-tools/:path*',
    '/brain-mcp/:path*',
  ],
};
