import { NextResponse } from 'next/server';

export async function GET() {
  const BRAIN_V2_URL = process.env.BRAIN_URL;
  const serviceKey = process.env.BRAIN_V2_SERVICE_KEY;
  if (!BRAIN_V2_URL || !serviceKey) {
    return NextResponse.json(
      { error: 'Giving data temporarily unavailable' },
      { status: 503 }
    );
  }

  try {
    const res = await fetch(
      `${BRAIN_V2_URL}/rest/v1/brain_context?key=eq.giving.ledger_status&select=value`,
      {
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
        },
        next: { revalidate: 300 },
      }
    );

    if (!res.ok) {
      throw new Error(`Brain query failed: ${res.status}`);
    }

    const rows = await res.json();
    if (!rows.length || !rows[0].value) {
      return NextResponse.json({ error: 'No giving data found' }, { status: 404 });
    }

    const ledger = typeof rows[0].value === 'string'
      ? JSON.parse(rows[0].value)
      : rows[0].value;

    return NextResponse.json({
      totalAccrued: ledger.total_accrued || 0,
      totalDonated: ledger.total_donated || 0,
      pendingDonation: ledger.pending || 0,
      currentTier: ledger.current_tier || 'seed',
      currentPct: ledger.current_pct || 1,
      totalRevenue: ledger.total_revenue_lifetime || 0,
      recipients: ledger.recipients || {},
      ledgerRows: ledger.ledger_rows || 0,
      lastSync: ledger.last_sync || null,
    });
  } catch (err) {
    console.error('Giving API error:', err.message);
    return NextResponse.json(
      { error: 'Failed to fetch giving data' },
      { status: 500 }
    );
  }
}
