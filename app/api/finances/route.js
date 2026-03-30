import { NextResponse } from 'next/server';

const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID || '69b3bb073b4bfa000e7cbc0b';
const PLAID_SECRET = process.env.PLAID_SECRET || 'f680cbaed5306465aa1c4e6f72d8db';
const PLAID_ENV = process.env.PLAID_ENV || 'sandbox';
const PLAID_BASE = PLAID_ENV === 'sandbox' ? 'https://sandbox.plaid.com' : 'https://production.plaid.com';

// Cache the access token in memory (sandbox only — resets on deploy)
let cachedAccessToken = null;

async function plaidRequest(endpoint, body) {
  const res = await fetch(`${PLAID_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: PLAID_CLIENT_ID,
      secret: PLAID_SECRET,
      ...body,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error_message || `Plaid ${endpoint} failed: ${res.status}`);
  }
  return res.json();
}

async function getAccessToken() {
  if (cachedAccessToken) return cachedAccessToken;

  // Create sandbox public token, then exchange for access token
  const ptData = await plaidRequest('/sandbox/public_token/create', {
    institution_id: 'ins_109508', // First Platypus Bank (sandbox test bank)
    initial_products: ['auth', 'transactions'],
  });

  const exchangeData = await plaidRequest('/item/public_token/exchange', {
    public_token: ptData.public_token,
  });

  cachedAccessToken = exchangeData.access_token;
  return cachedAccessToken;
}

export async function GET(request) {
  // Auth check — require valid session from like-one-app
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Verify the token against like-one-app Supabase
  const token = authHeader.split(' ')[1];
  const APP_URL = 'https://app.likeone.ai';
  const APP_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsa25waHV3d2dhZ3R1ZXF0b2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0MDcxNTgsImV4cCI6MjA4OTk4MzE1OH0.Wm7-plwu9N7sG2SzD_C9mHUwB4Ceh91F7fimraVBG_s';

  try {
    const userRes = await fetch(`${APP_URL}/auth/v1/user`, {
      headers: {
        apikey: APP_ANON,
        Authorization: `Bearer ${token}`,
      },
    });
    if (!userRes.ok) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }
    const user = await userRes.json();

    // Only allow Faye's email
    const allowedEmails = ['sophiacave@icloud.com', 'sophia@likeone.ai', 'hello@likeone.ai'];
    if (!allowedEmails.includes(user.email?.toLowerCase())) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: 'Auth check failed' }, { status: 401 });
  }

  try {
    const accessToken = await getAccessToken();

    // Get accounts
    const accountsData = await plaidRequest('/accounts/get', { access_token: accessToken });
    const accounts = accountsData.accounts.map(a => ({
      id: a.account_id,
      name: a.name,
      official_name: a.official_name,
      type: a.type,
      subtype: a.subtype,
      balance: a.balances.current,
      available: a.balances.available,
      currency: a.balances.iso_currency_code || 'USD',
    }));

    // Get recent transactions (last 30 days)
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const startDate = thirtyDaysAgo.toISOString().split('T')[0];
    const endDate = now.toISOString().split('T')[0];

    const txData = await plaidRequest('/transactions/get', {
      access_token: accessToken,
      start_date: startDate,
      end_date: endDate,
      options: { count: 50, offset: 0 },
    });

    const transactions = txData.transactions.map(t => ({
      id: t.transaction_id,
      date: t.date,
      name: t.name,
      amount: t.amount,
      category: t.personal_finance_category?.primary || t.category?.[0] || 'Other',
      pending: t.pending,
      account_id: t.account_id,
    }));

    const totalBalance = accounts.reduce((sum, a) => sum + (a.balance || 0), 0);
    const totalAvailable = accounts.reduce((sum, a) => sum + (a.available || 0), 0);

    return NextResponse.json({
      accounts,
      transactions,
      summary: {
        total_balance: totalBalance,
        total_available: totalAvailable,
        account_count: accounts.length,
        transaction_count: txData.total_transactions,
        as_of: new Date().toISOString(),
        environment: PLAID_ENV,
      },
    });
  } catch (err) {
    console.error('Plaid API error:', err.message);
    return NextResponse.json(
      { error: 'Failed to fetch financial data', detail: err.message },
      { status: 500 }
    );
  }
}
