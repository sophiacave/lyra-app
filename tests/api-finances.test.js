import { describe, it, expect } from 'vitest';

const PLAID_CLIENT_ID = '69b3bb073b4bfa000e7cbc0b';
const PLAID_SECRET = 'f680cbaed5306465aa1c4e6f72d8db';
const PLAID_BASE = 'https://sandbox.plaid.com';

describe('Plaid sandbox API', () => {
  it('creates a sandbox public token', async () => {
    const res = await fetch(`${PLAID_BASE}/sandbox/public_token/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: PLAID_CLIENT_ID,
        secret: PLAID_SECRET,
        institution_id: 'ins_109508',
        initial_products: ['auth', 'transactions'],
      }),
    });
    expect(res.ok).toBe(true);
    const data = await res.json();
    expect(data.public_token).toBeTruthy();
    expect(data.public_token).toContain('public-sandbox-');
  });

  it('exchanges public token for access token', async () => {
    // Create public token first
    const ptRes = await fetch(`${PLAID_BASE}/sandbox/public_token/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: PLAID_CLIENT_ID,
        secret: PLAID_SECRET,
        institution_id: 'ins_109508',
        initial_products: ['auth', 'transactions'],
      }),
    });
    const ptData = await ptRes.json();

    // Exchange
    const exRes = await fetch(`${PLAID_BASE}/item/public_token/exchange`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: PLAID_CLIENT_ID,
        secret: PLAID_SECRET,
        public_token: ptData.public_token,
      }),
    });
    expect(exRes.ok).toBe(true);
    const exData = await exRes.json();
    expect(exData.access_token).toBeTruthy();
    expect(exData.access_token).toContain('access-sandbox-');
  });

  it('fetches accounts from sandbox', async () => {
    // Full flow: create → exchange → get accounts
    const ptRes = await fetch(`${PLAID_BASE}/sandbox/public_token/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: PLAID_CLIENT_ID,
        secret: PLAID_SECRET,
        institution_id: 'ins_109508',
        initial_products: ['auth'],
      }),
    });
    const { public_token } = await ptRes.json();

    const exRes = await fetch(`${PLAID_BASE}/item/public_token/exchange`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: PLAID_CLIENT_ID,
        secret: PLAID_SECRET,
        public_token,
      }),
    });
    const { access_token } = await exRes.json();

    const accRes = await fetch(`${PLAID_BASE}/accounts/get`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: PLAID_CLIENT_ID,
        secret: PLAID_SECRET,
        access_token,
      }),
    });
    expect(accRes.ok).toBe(true);
    const accData = await accRes.json();
    expect(accData.accounts).toBeTruthy();
    expect(accData.accounts.length).toBeGreaterThan(0);
    // Verify account structure
    const first = accData.accounts[0];
    expect(first.account_id).toBeTruthy();
    expect(first.name).toBeTruthy();
    expect(first.balances).toBeTruthy();
    expect(typeof first.balances.current).toBe('number');
  });
});
