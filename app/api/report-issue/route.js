import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(req) {
  try {
    const { reporter_name, reporter_email, category, page_url, description } = await req.json();

    if (!reporter_name?.trim() || !reporter_email?.trim() || !description?.trim()) {
      return NextResponse.json(
        { error: 'Name, email, and description are required' },
        { status: 400, headers: corsHeaders }
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reporter_email.trim())) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Log issue report (Vercel logs capture this)
    console.log(`[Issue] ${reporter_name} <${reporter_email}> cat=${category || 'other'} page=${page_url || 'none'}: ${description.slice(0, 200)}`);

    return NextResponse.json(
      { success: true, message: 'Report submitted. Thank you for helping improve Like One!' },
      { status: 201, headers: corsHeaders }
    );
  } catch (err) {
    console.error('Report issue error:', err);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500, headers: corsHeaders }
    );
  }
}
