import { NextResponse } from 'next/server';

// SECURITY: This endpoint has been disabled.
// Service keys must never be served over HTTP, even behind a PIN.
// Machine config is now handled via local .env files and brain_vault.
export async function GET() {
  return NextResponse.json({ error: 'This endpoint has been permanently disabled for security.' }, { status: 410 });
}
