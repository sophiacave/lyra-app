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
    <p style="color:#555;font-size:12px;margin:0">Like One · <a href="https://likeone.ai" style="color:#c084fc;text-decoration:none">likeone.ai</a></p>
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

function cleanEmail(raw) {
  const e = (raw || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return null;
  return e;
}

function generateCode() {
  // 6-digit code, padded
  return String(Math.floor(Math.random() * 1_000_000)).padStart(6, '0');
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

    if (action === 'send') {
      // Rate limit: max 3 sends per email per hour
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const recent = await brainFetch(
        `calculator_auth_codes?email=eq.${encodeURIComponent(email)}&created=gte.${encodeURIComponent(oneHourAgo)}&select=code`,
        'GET'
      ).catch(() => []);
      if (Array.isArray(recent) && recent.length >= 3) {
        return NextResponse.json(
          { success: false, error: 'Too many code requests. Please wait an hour.' },
          { status: 429, headers: corsHeaders }
        );
      }

      // Cleanup: drop expired+used rows older than 24h (best-effort)
      const cleanupCutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      await brainFetch(
        `calculator_auth_codes?or=(used.eq.1,expires.lt.${encodeURIComponent(new Date().toISOString())})&created.lt.${encodeURIComponent(cleanupCutoff)}`,
        'DELETE'
      ).catch(() => null);

      const code = generateCode();
      const now = new Date();
      const expires = new Date(now.getTime() + CODE_TTL_MINUTES * 60 * 1000);
      // Invalidate prior unused codes for this email
      await brainFetch(
        `calculator_auth_codes?email=eq.${encodeURIComponent(email)}&used=eq.0`,
        'PATCH',
        { used: 1 }
      ).catch((e) => console.warn('prior-invalidate:', e.message));
      await brainFetch('calculator_auth_codes', 'POST', {
        email,
        code,
        created: now.toISOString(),
        expires: expires.toISOString(),
        used: 0,
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
      const rows = await brainFetch(
        `calculator_auth_codes?email=eq.${encodeURIComponent(email)}&code=eq.${code}&used=eq.0&select=expires`,
        'GET'
      );
      if (!Array.isArray(rows) || rows.length === 0) {
        return NextResponse.json({ success: false, error: 'Invalid or expired code' }, { status: 400, headers: corsHeaders });
      }
      const row = rows[0];
      if (new Date(row.expires) < new Date()) {
        return NextResponse.json({ success: false, error: 'Code expired' }, { status: 400, headers: corsHeaders });
      }
      await brainFetch(
        `calculator_auth_codes?email=eq.${encodeURIComponent(email)}&code=eq.${code}`,
        'PATCH',
        { used: 1 }
      );
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
