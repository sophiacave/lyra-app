import { NextResponse } from 'next/server';

const CONSOLE_PIN = process.env.CONSOLE_PIN || '9135';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const pin = searchParams.get('pin');

  if (!pin || pin !== CONSOLE_PIN) {
    return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vpaynwebgmmnwttqkwmh.supabase.co';
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';
  const notionToken = process.env.NOTION_TOKEN || '';

  if (!supabaseKey || !notionToken) {
    return NextResponse.json({ error: 'Server env vars not configured' }, { status: 500 });
  }

  const envBlock = [
    `# Fractal Brain — Computer 02 Config`,
    `SUPABASE_URL=${supabaseUrl}`,
    `SUPABASE_SERVICE_KEY=${supabaseKey}`,
    `NOTION_TOKEN=${notionToken}`,
    `COMPUTER_ID=computer-02`,
  ].join('\n');

  return NextResponse.json({ env: envBlock });
}
