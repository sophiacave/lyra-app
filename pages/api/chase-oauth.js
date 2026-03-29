export async function handler(req, res) {
  const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
  const PLAID_SECRET = process.env.PLAID_SECRET;
  const PLAID_PUBLIC_KEY = process.env.PLAID_PUBLIC_KEY;

  const plaid = require('plaid');

  const client = new plaid.Client({
    clientID: PLAID_CLIENT_ID,
    secret: PLAID_SECRET,
    publicKey: PLAID_PUBLIC_KEY,
    env: plaid.environments.production,
  });

  try {
    const response = await client.createLinkToken({
      user: { client_user_id: 'unique_user_id' },
      client_name: 'Like One',
      products: ['transactions'],
      country_codes: ['US'],
      language: 'en',
      webhook: 'https://your-webhook-url.com/webhook',
    });

    res.status(200).json({ link_token: response.link_token });
  } catch (error) {
    console.error('Error creating Link token:', error);
    res.status(500).json({ error: 'Failed to create Link token' });
  }
  
}
