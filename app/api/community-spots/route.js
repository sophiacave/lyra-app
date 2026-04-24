import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const WEEKLY_SPOTS = 15;
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

function currentWeekStart() {
  // Monday of current week (UTC) as YYYY-MM-DD
  const now = new Date();
  const day = now.getUTCDay();
  const monday = new Date(now);
  monday.setUTCDate(now.getUTCDate() - ((day + 6) % 7));
  return monday.toISOString().split('T')[0];
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET() {
  try {
    const url = process.env.BRAIN_URL;
    const key = process.env.BRAIN_V2_SERVICE_KEY;
    if (!url || !key) {
      return NextResponse.json({ remaining: WEEKLY_SPOTS }, { headers: corsHeaders });
    }
    const weekStart = currentWeekStart();
    const res = await fetch(
      `${url}/rest/v1/community_access?week_start=eq.${weekStart}&select=id`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` } }
    );
    if (!res.ok) return NextResponse.json({ remaining: WEEKLY_SPOTS }, { headers: corsHeaders });
    const rows = await res.json();
    const claimed = Array.isArray(rows) ? rows.length : 0;
    return NextResponse.json(
      { remaining: Math.max(0, WEEKLY_SPOTS - claimed) },
      { headers: corsHeaders }
    );
  } catch (err) {
    console.error('community-spots error:', err);
    return NextResponse.json({ remaining: WEEKLY_SPOTS }, { headers: corsHeaders });
  }
}
