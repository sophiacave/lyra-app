import { NextResponse } from 'next/server';
import crypto from 'node:crypto';

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
    const url = process.env.BRAIN_URL;
    const key = process.env.BRAIN_V2_SERVICE_KEY;
    if (!url || !key) throw new Error('BRAIN_URL/BRAIN_V2_SERVICE_KEY missing');

    const row = {
      id: crypto.randomUUID(),
      page_url: (body.page_url || '').toString().slice(0, 500) || null,
      user_agent: (body.user_agent || '').toString().slice(0, 500) || null,
      screen_size: (body.screen_size || '').toString().slice(0, 32) || null,
      session_id: (body.session_id || '').toString().slice(0, 64) || null,
      messages: typeof body.messages === 'string' ? body.messages : JSON.stringify(body.messages ?? []),
      status: body.status === 'closed' ? 'closed' : 'open',
      severity: ['low', 'medium', 'high', 'critical'].includes(body.severity) ? body.severity : 'medium',
    };

    const res = await fetch(`${url}/rest/v1/beta_reports`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(row),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('beta-report insert error:', res.status, text);
      return NextResponse.json({ success: false }, { status: 500, headers: corsHeaders });
    }
    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (err) {
    console.error('beta-report error:', err);
    return NextResponse.json({ success: false }, { status: 500, headers: corsHeaders });
  }
}
