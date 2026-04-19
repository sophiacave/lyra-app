import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const VALID_CATEGORIES = ['bug', 'feature', 'content', 'other'];

function brainHeaders() {
  const key = process.env.BRAIN_V2_SERVICE_KEY;
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
  };
}

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

    const url = process.env.BRAIN_URL;
    if (!url) throw new Error('BRAIN_URL missing');

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const rateRes = await fetch(
      `${url}/rest/v1/issue_reports?reporter_email=eq.${encodeURIComponent(
        reporter_email.trim().toLowerCase()
      )}&created_at=gte.${encodeURIComponent(oneHourAgo)}&select=id`,
      { headers: brainHeaders() }
    );
    const recent = rateRes.ok ? await rateRes.json() : [];
    if (Array.isArray(recent) && recent.length >= 3) {
      return NextResponse.json(
        { error: 'Too many reports. Please wait before submitting another.' },
        { status: 429, headers: corsHeaders }
      );
    }

    const clean = (s) => (s || '').replace(/<[^>]*>/g, '').trim();
    const cat = VALID_CATEGORIES.includes(category) ? category : 'other';

    const insertRes = await fetch(`${url}/rest/v1/issue_reports`, {
      method: 'POST',
      headers: { ...brainHeaders(), Prefer: 'return=minimal' },
      body: JSON.stringify({
        reporter_name: clean(reporter_name).slice(0, 100),
        reporter_email: reporter_email.trim().toLowerCase().slice(0, 255),
        category: cat,
        page_url: page_url?.trim()?.slice(0, 500) || null,
        description: clean(description).slice(0, 5000),
      }),
    });
    if (!insertRes.ok) {
      const text = await insertRes.text();
      console.error('Issue insert error:', insertRes.status, text);
      return NextResponse.json(
        { error: 'Failed to submit report. Please try again.' },
        { status: 500, headers: corsHeaders }
      );
    }
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
