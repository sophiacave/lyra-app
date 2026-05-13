import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const FROM = 'lo-dig <hello@likeone.ai>';
const TO = 'hello@likeone.ai';

export async function POST(req) {
  try {
    const body = await req.json();
    const { formType, data } = body;

    if (!formType || !data) {
      return NextResponse.json({ error: 'Missing formType or data' }, { status: 400 });
    }

    // Format email based on form type
    const subject = `lo-dig: ${formType} — from Sophie Watanabe`;
    const html = formatEmail(formType, data);

    // Send via Resend
    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      console.log('No RESEND_API_KEY — logging form data:', JSON.stringify(body));
      return NextResponse.json({ ok: true, note: 'Logged (no email key)' });
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: FROM,
        to: TO,
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Resend error:', err);
      return NextResponse.json({ error: 'Email failed' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('dig API error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

function formatEmail(formType, data) {
  const rows = Object.entries(data)
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:8px 12px;color:#888;white-space:nowrap;vertical-align:top">${k}</td><td style="padding:8px 12px;color:#e5e5e5">${String(v).replace(/\n/g, '<br>')}</td></tr>`)
    .join('');

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#08080a;color:#e5e5e5;font-family:-apple-system,sans-serif">
<div style="max-width:600px;margin:0 auto;padding:32px 24px">
  <div style="margin-bottom:16px">
    <span style="font-size:20px;font-weight:700;color:#c084fc">lo-dig</span>
    <span style="color:#555;font-size:14px;margin-left:8px">form submission</span>
  </div>
  <h2 style="font-size:18px;color:#fff;margin:0 0 16px">${formType}</h2>
  <table style="width:100%;border-collapse:collapse;background:#111114;border-radius:8px;overflow:hidden">
    ${rows}
  </table>
  <p style="color:#555;font-size:12px;margin-top:24px">Submitted from likeone.ai/dig/</p>
</div></body></html>`;
}
