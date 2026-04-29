import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const FROM_EMAIL = 'Sophia at Like One <hello@likeone.ai>';
const CODE_TTL_MINUTES = 15;

// In-memory code store (resets on deploy — acceptable for calculator auth)
const codeStore = new Map();

function codeEmailHtml(code) {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#08080a;color:#e0e0e0;font-family:-apple-system,BlinkMacSystemFont,sans-serif;">
<div style="max-width:480px;margin:0 auto;padding:40px 24px;">
  <div style="margin-bottom:32px"><span style="color:#c084fc;font-weight:800;font-size:15px;letter-spacing:-0.5px">like</span><span style="color:#e0e0e0;font-weight:800;font-size:15px;letter-spacing:-0.5px">one</span></div>
  <h1 style="font-size:22px;font-weight:700;color:#fff;margin:0 0 20px;line-height:1.3">Your ROI Calculator code</h1>
  <p style="color:#aaa;font-size:15px;line-height:1.8;margin:0 0 24px">Enter this code to unlock the calculator:</p>
  <div style="font-size:34px;font-weight:800;letter-spacing:12px;color:#c084fc;text-align:center;padding:24px;background:#111118;border-radius:12px;margin:0 0 24px">${code}</div>
  <p style="color:#8888a0;font-size:13px;line-height:1.7">This code expires in ${CODE_TTL_MINUTES} minutes. If you didn't request it, you can ignore this email.</p>
  <div style="border-top:1px solid #1e1e28;margin-top:40px;padding-top:20px;text-align:center">
    <p style="color:#555;font-size:12px;margin:0">Like One &middot; <a href="https://likeone.ai" style="color:#c084fc;text-decoration:none">likeone.ai</a></p>
  </div>
</div></body></html>`;
}

async function sendCodeEmail(email, code) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log(`[DRY RUN] Would email code ${code} to ${email}`);
    return true;
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [email],
      subject: `Your Like One calculator code: ${code}`,
      html: codeEmailHtml(code),
    }),
  });
  if (!res.ok) {
    console.error(`Calculator code email error: ${res.status} ${await res.text()}`);
    return false;
  }
  return true;
}

function cleanEmail(raw) {
  const e = (raw || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return null;
  return e;
}

function generateCode() {
  return String(Math.floor(Math.random() * 1_000_000)).padStart(6, '0');
}

// Cleanup expired codes periodically
function cleanupCodes() {
  const now = Date.now();
  for (const [key, entry] of codeStore) {
    if (now > entry.expires) codeStore.delete(key);
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { action } = body;
    const email = cleanEmail(body.email);
    if (!email) {
      return NextResponse.json({ success: false, error: 'Invalid email' }, { status: 400, headers: corsHeaders });
    }

    cleanupCodes();

    if (action === 'send') {
      // Rate limit: max 3 sends per email per hour
      const recentCount = Array.from(codeStore.values())
        .filter(e => e.email === email && Date.now() - e.created < 3600000).length;
      if (recentCount >= 3) {
        return NextResponse.json(
          { success: false, error: 'Too many code requests. Please wait an hour.' },
          { status: 429, headers: corsHeaders }
        );
      }

      const code = generateCode();
      const now = Date.now();
      const key = `${email}:${code}`;
      codeStore.set(key, {
        email,
        code,
        created: now,
        expires: now + CODE_TTL_MINUTES * 60 * 1000,
        used: false,
      });

      const sent = await sendCodeEmail(email, code);
      return NextResponse.json(
        { success: sent, message: sent ? 'Code sent' : 'Email send failed' },
        { status: sent ? 200 : 500, headers: corsHeaders }
      );
    }

    if (action === 'verify') {
      const code = (body.code || '').trim();
      if (!/^\d{6}$/.test(code)) {
        return NextResponse.json({ success: false, error: 'Code must be 6 digits' }, { status: 400, headers: corsHeaders });
      }

      const key = `${email}:${code}`;
      const entry = codeStore.get(key);
      if (!entry || entry.used || Date.now() > entry.expires) {
        return NextResponse.json({ success: false, error: 'Invalid or expired code' }, { status: 400, headers: corsHeaders });
      }

      entry.used = true;
      return NextResponse.json({ success: true }, { headers: corsHeaders });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400, headers: corsHeaders });
  } catch (err) {
    console.error('Calculator auth error:', err);
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500, headers: corsHeaders }
    );
  }
}
