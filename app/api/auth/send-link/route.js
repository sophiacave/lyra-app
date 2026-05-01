import { NextResponse } from 'next/server';
import { createMagicToken } from '../../../lib/auth.js';

export const runtime = 'nodejs';

const FROM_EMAIL = 'Sophia at Like One <hello@likeone.ai>';

function magicLinkHtml(url) {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#1a1a1e;color:#e0e0e0;font-family:-apple-system,BlinkMacSystemFont,sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:40px 24px;">
  <div style="margin-bottom:24px"><span style="color:#c084fc;font-weight:800;font-size:15px;letter-spacing:-0.5px">like</span><span style="color:#e0e0e0;font-weight:800;font-size:15px;letter-spacing:-0.5px">one</span></div>
  <h1 style="font-size:22px;font-weight:700;color:#fff;margin:0 0 16px">Sign in to Like One</h1>
  <p style="color:#aaa;font-size:15px;line-height:1.7">Click below to sign in. This link expires in 15 minutes.</p>
  <div style="text-align:center;margin:28px 0">
    <a href="${url}" style="display:inline-block;background:#c084fc;color:#000;font-weight:700;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:16px">Sign In</a>
  </div>
  <p style="color:#555;font-size:13px">If you didn't request this, you can safely ignore it.</p>
  <div style="border-top:1px solid #2a2a30;margin-top:32px;padding-top:16px;text-align:center">
    <p style="color:#555;font-size:12px">Like One Academy &middot; <a href="https://likeone.ai" style="color:#c084fc;text-decoration:none">likeone.ai</a></p>
  </div>
</div></body></html>`;
}

export async function POST(req) {
  try {
    const { email, returnTo } = await req.json();
    if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const token = createMagicToken(cleanEmail);
    const origin = req.headers.get('origin') || 'https://likeone.ai';
    const callbackUrl = `${origin}/api/auth/verify?token=${encodeURIComponent(token)}&returnTo=${encodeURIComponent(returnTo || '/account')}`;

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      console.log(`[DRY RUN] Magic link for ${cleanEmail}: ${callbackUrl}`);
      return NextResponse.json({ success: true, message: 'Check your email for the sign-in link.' });
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [cleanEmail],
        subject: 'Sign in to Like One',
        html: magicLinkHtml(callbackUrl),
      }),
    });

    if (!res.ok) {
      console.error('Resend error:', await res.text());
      return NextResponse.json({ error: 'Failed to send email. Try again.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Check your email for the sign-in link.' });
  } catch (err) {
    console.error('send-link error:', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
