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
      <li><strong style="color:#e0e0e0">30 free courses</strong> in the <a href="https://likeone.ai/academy/" style="color:#c084fc">Like One Academy</a> — from AI basics to building agents</li>
      <li><strong style="color:#e0e0e0">300+ interactive lessons</strong> with hands-on exercises</li>
      <li><strong style="color:#e0e0e0">The blog</strong> — real strategies, no fluff: <a href="https://likeone.ai/blog/" style="color:#c084fc">likeone.ai/blog</a></li>
    </ul>
    <p>Over the next two weeks, I'll send you a few emails with my best insights on working with AI — real techniques I use every day to run Like One.</p>
    <p>If you want to dive in right now, I'd start here:</p>
    <div style="text-align:center;margin:24px 0"><a href="https://likeone.ai/academy/" style="display:inline-block;background:#c084fc;color:#000;font-weight:700;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:16px">Explore the Academy →</a></div>
    <p>Welcome aboard. The path is real, and you're on it.</p>
    <p style="color:#8888a0;font-size:14px;margin-top:24px;">With warmth,<br><strong style="color:#e0e0e0">Sophia Cave</strong><br>Founder, Like One</p>
  </div>
  <div style="border-top:1px solid #1e1e28;margin-top:40px;padding-top:20px;text-align:center">
    <p style="color:#555;font-size:12px;margin:0">Like One Academy · Built by Sophia Cave</p>
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

async function brainFetch(path, method, body) {
  const url = process.env.BRAIN_URL;
  const key = process.env.BRAIN_V2_SERVICE_KEY;
  if (!url || !key) throw new Error('BRAIN_URL/BRAIN_V2_SERVICE_KEY missing');
  const res = await fetch(`${url}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`brain ${method} ${path}: ${res.status} ${text}`);
  try { return text ? JSON.parse(text) : null; } catch { return null; }
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

    const existing = await brainFetch(
      `subscribers?email=eq.${encodeURIComponent(cleanEmail)}&select=id`,
      'GET'
    );
    const isNew = !(Array.isArray(existing) && existing.length > 0);

    if (isNew) {
      await brainFetch('subscribers', 'POST', {
        email: cleanEmail,
        source: source?.trim() || 'website',
        goal: goal?.trim()?.slice(0, 500) || null,
        status: 'active',
        subscribed_at: new Date().toISOString(),
      });
      sendWelcomeEmail(cleanEmail);
    } else {
      await brainFetch(`subscribers?email=eq.${encodeURIComponent(cleanEmail)}`, 'PATCH', {
        source: source?.trim() || 'website',
        status: 'active',
        subscribed_at: new Date().toISOString(),
      });
    }

    if (source === 'community_access') {
      const now = new Date();
      const day = now.getUTCDay();
      const monday = new Date(now);
      monday.setUTCDate(now.getUTCDate() - ((day + 6) % 7));
      const weekStart = monday.toISOString().split('T')[0];

      const claimed = await brainFetch(
        `community_access?week_start=eq.${weekStart}&select=id`,
        'GET'
      );
      const count = Array.isArray(claimed) ? claimed.length : 0;
      if (count >= 15) {
        return NextResponse.json(
          {
            success: true,
            message: "Subscribed! But all 15 community spots are claimed this week. You'll be first in line next Monday.",
            waitlisted: true,
          },
          { headers: corsHeaders }
        );
      }
      const mine = await brainFetch(
        `community_access?email=eq.${encodeURIComponent(cleanEmail)}&week_start=eq.${weekStart}&select=id`,
        'GET'
      );
      if (!Array.isArray(mine) || mine.length === 0) {
        await brainFetch('community_access', 'POST', {
          email: cleanEmail,
          goal: goal?.trim()?.slice(0, 500) || null,
          week_start: weekStart,
        });
        const prof = await brainFetch(
          `profiles?email=eq.${encodeURIComponent(cleanEmail)}&select=id`,
          'GET'
        );
        if (Array.isArray(prof) && prof.length > 0) {
          await brainFetch(`profiles?email=eq.${encodeURIComponent(cleanEmail)}`, 'PATCH', {
            subscription_status: 'active',
            subscription_tier: 'community',
            updated_at: new Date().toISOString(),
          });
        } else {
          await brainFetch('profiles', 'POST', {
            email: cleanEmail,
            subscription_status: 'active',
            subscription_tier: 'community',
            updated_at: new Date().toISOString(),
          });
        }
      }
    }

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
