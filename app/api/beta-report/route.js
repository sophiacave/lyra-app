import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(req) {
  try {
    const body = await req.json();
    // Log beta report (Vercel logs capture this)
    console.log(`[BetaReport] page=${body.page_url} severity=${body.severity || 'medium'} session=${body.session_id || 'none'}`);
    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (err) {
    console.error('beta-report error:', err);
    return NextResponse.json({ success: false }, { status: 500, headers: corsHeaders });
  }
}
