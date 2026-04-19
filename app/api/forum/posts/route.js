import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

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

export async function GET() {
  try {
    const url = process.env.BRAIN_URL;
    if (!url) throw new Error('BRAIN_URL missing');
    const res = await fetch(
      `${url}/rest/v1/forum_posts?select=*&order=is_pinned.desc&limit=500`,
      { headers: brainHeaders() }
    );
    const rows = res.ok ? await res.json() : [];
    rows.sort((a, b) => {
      if ((b.is_pinned || 0) - (a.is_pinned || 0) !== 0) {
        return (b.is_pinned || 0) - (a.is_pinned || 0);
      }
      return new Date(b.created_at) - new Date(a.created_at);
    });
    return NextResponse.json(rows, { headers: corsHeaders });
  } catch (err) {
    console.error('Forum GET error:', err);
    return NextResponse.json([], { headers: corsHeaders });
  }
}

export async function POST(req) {
  try {
    const { author_name, author_email, title, body, course_slug, parent_id } = await req.json();

    if (!author_name?.trim() || !author_email?.trim() || !body?.trim()) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400, headers: corsHeaders }
      );
    }
    if (!parent_id && !title?.trim()) {
      return NextResponse.json(
        { error: 'Title is required for new posts' },
        { status: 400, headers: corsHeaders }
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(author_email.trim())) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400, headers: corsHeaders }
      );
    }

    const url = process.env.BRAIN_URL;
    if (!url) throw new Error('BRAIN_URL missing');

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const rateRes = await fetch(
      `${url}/rest/v1/forum_posts?author_email=eq.${encodeURIComponent(
        author_email.trim().toLowerCase()
      )}&created_at=gte.${encodeURIComponent(oneHourAgo)}&select=id`,
      { headers: brainHeaders() }
    );
    const recent = rateRes.ok ? await rateRes.json() : [];
    if (Array.isArray(recent) && recent.length >= 5) {
      return NextResponse.json(
        { error: "You're posting too quickly. Please wait a bit." },
        { status: 429, headers: corsHeaders }
      );
    }

    const clean = (s) => (s || '').replace(/<[^>]*>/g, '').trim();

    const insertData = {
      author_name: clean(author_name).slice(0, 100),
      author_email: author_email.trim().toLowerCase().slice(0, 255),
      body: clean(body).slice(0, 5000),
      course_slug: course_slug?.trim() || 'general',
      is_pinned: 0,
      is_faye_reply: 0,
      upvotes: 0,
    };
    if (parent_id) {
      insertData.parent_id = parent_id;
    } else {
      insertData.title = clean(title).slice(0, 200);
    }

    const insertRes = await fetch(`${url}/rest/v1/forum_posts`, {
      method: 'POST',
      headers: { ...brainHeaders(), Prefer: 'return=representation' },
      body: JSON.stringify(insertData),
    });
    if (!insertRes.ok) {
      const text = await insertRes.text();
      console.error('Forum insert error:', insertRes.status, text);
      return NextResponse.json(
        { error: 'Failed to save post. Please try again.' },
        { status: 500, headers: corsHeaders }
      );
    }
    const post = await insertRes.json().catch(() => null);
    return NextResponse.json(
      { success: true, post: Array.isArray(post) ? post[0] : post },
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
