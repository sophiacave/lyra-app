import { NextResponse } from 'next/server';
import { getSessionFromRequest } from '../../lib/auth.js';

const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID || '69b3bb073b4bfa000e7cbc0b';
const PLAID_SECRET = process.env.PLAID_SECRET || 'f680cbaed5306465aa1c4e6f72d8db';
const PLAID_ENV = process.env.PLAID_ENV || 'sandbox';
const PLAID_BASE = PLAID_ENV === 'sandbox' ? 'https://sandbox.plaid.com' : 'https://production.plaid.com';

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
  const ptData = await plaidRequest('/sandbox/public_token/create', {
    institution_id: 'ins_109508',
    initial_products: ['auth', 'transactions'],
  });
  const exchangeData = await plaidRequest('/item/public_token/exchange', {
    public_token: ptData.public_token,
  });
  cachedAccessToken = exchangeData.access_token;
  return cachedAccessToken;
}

export async function GET(request) {
  // Auth check — sovereign auth (cookie or Bearer token)
  const session = getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Only allow Faye's emails
  const allowedEmails = ['sophiacave@icloud.com', 'sophia@likeone.ai', 'hello@likeone.ai'];
  if (!allowedEmails.includes(session.email?.toLowerCase())) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }

  try {
    const accessToken = await getAccessToken();

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
