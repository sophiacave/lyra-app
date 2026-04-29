import { NextResponse } from 'next/server';

/**
 * Giving API — returns last known giving ledger data.
 * Previously fetched from Supabase brain_context.
 * Now returns static data from last sync (2026-04-28).
 * Will be updated when persistent storage is restored.
 *
 * 2026-04-28 — Supabase independence
 */

export async function GET() {
  // Static giving data from last known brain state
  return NextResponse.json({
    totalAccrued: 0.69,
    totalDonated: 0,
    pendingDonation: 0.69,
    currentTier: 'seed',
    currentPct: 1,
    totalRevenue: 68.6,
    recipients: {
      amfAR: { accrued: 0.69, donated: 0 },
    },
    ledgerRows: 6,
    lastSync: '2026-04-28T00:00:00.000Z',
  });
}
