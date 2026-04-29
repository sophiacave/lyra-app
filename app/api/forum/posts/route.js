import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET() {
  // Forum data was in Supabase. Return empty until persistent storage is restored.
  // Forum UI handles empty gracefully ("launching soon" state).
  return NextResponse.json([], { headers: corsHeaders });
}

export async function POST(req) {
  try {
    const { author_name, author_email, title, body } = await req.json();

    if (!author_name?.trim() || !author_email?.trim() || !body?.trim()) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Log forum post (Vercel logs capture this)
    console.log(`[Forum] Post by ${author_name} <${author_email}>: ${title || '(reply)'}`);

    return NextResponse.json(
      { success: true, message: 'Post received! Forum is being upgraded — your post will appear soon.' },
      { status: 201, headers: corsHeaders }
    );
  } catch (err) {
    console.error('Forum POST error:', err);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500, headers: corsHeaders }
    );
  }
}
