// Chase OAuth link token creation — uses Plaid REST API directly (no SDK)
export default async function handler(req, res) {
  const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
  const PLAID_SECRET = process.env.PLAID_SECRET;
  const PLAID_ENV = process.env.PLAID_ENV || 'sandbox';
  const BASE = PLAID_ENV === 'sandbox' ? 'https://sandbox.plaid.com' : 'https://production.plaid.com';

  if (!PLAID_CLIENT_ID || !PLAID_SECRET) {
    return res.status(500).json({ error: 'Plaid credentials not configured' });
  }

  try {
    const response = await fetch(`${BASE}/link/token/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: PLAID_CLIENT_ID,
        secret: PLAID_SECRET,
        user: { client_user_id: 'faye-likeone' },
        client_name: 'Like One',
        products: ['transactions'],
        country_codes: ['US'],
        language: 'en',
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error_message || `Plaid error ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json({ link_token: data.link_token });
  } catch (error) {
    console.error('Error creating Link token:', error);
    res.status(500).json({ error: 'Failed to create Link token' });
  }
}
