import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const FROM_EMAIL = 'Sophia at Like One <hello@likeone.ai>';

function welcomeHtml() {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#08080a;color:#e0e0e0;font-family:-apple-system,BlinkMacSystemFont,sans-serif;">
<div style="display:none;font-size:1px;color:#08080a;line-height:1px;max-height:0;overflow:hidden">You just took the first step toward human-AI convergence.</div>
<div style="max-width:560px;margin:0 auto;padding:40px 24px;">
  <div style="margin-bottom:32px"><span style="color:#c084fc;font-weight:800;font-size:15px;letter-spacing:-0.5px">like</span><span style="color:#e0e0e0;font-weight:800;font-size:15px;letter-spacing:-0.5px">one</span></div>
  <h1 style="font-size:22px;font-weight:700;color:#fff;margin:0 0 20px;line-height:1.3">Welcome to the path</h1>
  <div style="font-size:15px;line-height:1.8;color:#aaa">
    <p>Hey — I'm Sophia, and I built Like One.</p>
    <p>You just joined a community of people who believe AI should extend <em>every</em> person — not just the technical elite. That matters more than you know.</p>
    <p>Here's what you have access to right now:</p>
    <ul style="color:#8888a0;padding-left:20px;line-height:2.2">
      <li><strong style="color:#e0e0e0">36 free courses</strong> in the <a href="https://likeone.ai/academy/" style="color:#c084fc">Like One Academy</a> — from AI basics to building agents</li>
      <li><strong style="color:#e0e0e0">520+ interactive lessons</strong> with hands-on exercises</li>
      <li><strong style="color:#e0e0e0">The blog</strong> — real strategies, no fluff: <a href="https://likeone.ai/blog/" style="color:#c084fc">likeone.ai/blog</a></li>
    </ul>
    <p>Over the next two weeks, I'll send you a few emails with my best insights on working with AI — real techniques I use every day to run Like One.</p>
    <p>If you want to dive in right now, I'd start here:</p>
    <div style="text-align:center;margin:24px 0"><a href="https://likeone.ai/academy/" style="display:inline-block;background:#c084fc;color:#000;font-weight:700;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:16px">Explore the Academy &rarr;</a></div>
    <p>Welcome aboard. The path is real, and you're on it.</p>
    <p style="color:#8888a0;font-size:14px;margin-top:24px;">With warmth,<br><strong style="color:#e0e0e0">Sophia Cave</strong><br>Founder, Like One</p>
  </div>
  <div style="border-top:1px solid #1e1e28;margin-top:40px;padding-top:20px;text-align:center">
    <p style="color:#555;font-size:12px;margin:0">Like One Academy &middot; Built by Sophia Cave</p>
    <p style="color:#555;font-size:12px;margin:4px 0"><a href="https://likeone.ai" style="color:#c084fc;text-decoration:none">likeone.ai</a></p>
    <p style="color:#444;font-size:11px;margin:8px 0 0"><a href="mailto:hello@likeone.ai?subject=Unsubscribe" style="color:#444;text-decoration:underline">Unsubscribe</a></p>
  </div>
</div></body></html>`;
}

async function sendWelcomeEmail(email) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log(`[DRY RUN] Would send welcome email to ${email}`);
    return;
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [email],
        subject: 'Welcome to Like One — your path starts here',
        html: welcomeHtml(),
      }),
    });
    if (!res.ok) console.error(`Welcome email error for ${email}: ${await res.text()}`);
  } catch (err) {
    console.error(`Welcome email failed for ${email}:`, err);
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(req) {
  try {
    const { email, source, goal } = await req.json();
    if (!email?.trim()) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400, headers: corsHeaders });
    }
    const cleanEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400, headers: corsHeaders });
    }

    // Log subscriber (Vercel logs capture this for now)
    console.log(`[Subscribe] ${cleanEmail} source=${source || 'website'} goal=${goal?.slice(0, 100) || 'none'}`);

    // Send welcome email (non-blocking)
    sendWelcomeEmail(cleanEmail);

    return NextResponse.json(
      { success: true, message: 'Welcome to the path, friend.' },
      { headers: corsHeaders }
    );
  } catch (err) {
    console.error('Subscribe error:', err);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500, headers: corsHeaders }
    );
  }
}
