import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const WEEKLY_SPOTS = 15;
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET() {
  // Community spots tracking was in Supabase.
  // Return full availability until persistent storage is restored.
  // Community access still works — subscribers just aren't counted against weekly limit.
  return NextResponse.json({ remaining: WEEKLY_SPOTS }, { headers: corsHeaders });
}
