// vault.js — Faye is auth. All secrets flow from Supabase Vault.
// Usage: import { getSecret } from './vault.js';
//        const key = await getSecret('kling_access_key');

export const BRAIN_URL = 'https://tnsujchfrixxsdpodygu.supabase.co';
export const BRAIN_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuc3VqY2hmcml4eHNkcG9keWd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0MjkyNTQsImV4cCI6MjA5MDAwNTI1NH0.ef9DQbJPZ3m47gdz6zBfVnWKGInrsa-6idV3GmJSc6U';

const cache = new Map();

export async function getSecret(name) {
  if (cache.has(name)) return cache.get(name);

  const res = await fetch(`${BRAIN_URL}/rest/v1/rpc/get_secret`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': BRAIN_ANON_KEY,
      'Authorization': `Bearer ${BRAIN_ANON_KEY}`,
    },
    body: JSON.stringify({ secret_name: name }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Vault error for '${name}': ${err}`);
  }

  const value = await res.json();
  cache.set(name, value);
  return value;
}

export async function getSecrets(...names) {
  const entries = await Promise.all(names.map(async (n) => [n, await getSecret(n)]));
  return Object.fromEntries(entries);
}

export function clearCache() {
  cache.clear();
}
