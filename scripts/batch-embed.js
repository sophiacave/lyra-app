#!/usr/bin/env node
/**
 * Batch embed all brain_context entries that don't have embeddings yet.
 * Calls the brain-embed edge function for each entry.
 * Run: node scripts/batch-embed.js
 */

const SUPABASE_URL = "https://vpaynwebgmmnwttqkwmh.supabase.co";
const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwYXlud2ViZ21tbnd0dHFrd21oIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzI2NzQ5OSwiZXhwIjoyMDg4ODQzNDk5fQ._IRdLX3vwlyzs0zU9M-JqnYK4merTd3NHC9c9GQNhPY";

const BATCH_SIZE = 5; // concurrent requests
const DELAY_MS = 500; // delay between batches to avoid rate limits

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchWithRetry(url, opts, retries = 5) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, opts);
      if (res.ok) return res;
      if (res.status >= 500 && i < retries - 1) {
        console.log(`  Retry ${i + 1}/${retries} (HTTP ${res.status})... waiting ${(i + 1) * 3}s`);
        await sleep((i + 1) * 3000);
        continue;
      }
      throw new Error(`HTTP ${res.status}`);
    } catch (err) {
      if (i < retries - 1 && (err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT' || err.message?.includes('fetch failed'))) {
        console.log(`  Retry ${i + 1}/${retries} (${err.code || err.message})... waiting ${(i + 1) * 3}s`);
        await sleep((i + 1) * 3000);
        continue;
      }
      throw err;
    }
  }
}

async function fetchUnembedded() {
  const res = await fetchWithRetry(
    `${SUPABASE_URL}/rest/v1/brain_context?select=key,value&embedding=is.null&order=key&limit=500`,
    { headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` } }
  );
  return res.json();
}

async function embedEntry(key, value) {
  // Create text to embed: key + truncated value
  let text = key;
  if (value) {
    let valStr = typeof value === "string" ? value : JSON.stringify(value);
    // Strip escaped JSON noise
    valStr = valStr.replace(/\\\\n/g, " ").replace(/\\\\"/g, '"').replace(/\\\\/g, "").replace(/\s+/g, " ");
    text += ": " + valStr.slice(0, 500);
  }

  const res = await fetch(`${SUPABASE_URL}/functions/v1/brain-embed`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "embed", key, text }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Embed failed for ${key}: ${res.status} ${err}`);
  }
  return res.json();
}

async function main() {
  console.log("Fetching unembedded brain_context entries...");
  const entries = await fetchUnembedded();
  console.log(`Found ${entries.length} entries to embed.\n`);

  let success = 0, failed = 0;

  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const batch = entries.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map(e => embedEntry(e.key, e.value))
    );

    for (let j = 0; j < results.length; j++) {
      const key = batch[j].key;
      if (results[j].status === "fulfilled") {
        success++;
        process.stdout.write(`  ✓ ${key}\n`);
      } else {
        failed++;
        process.stdout.write(`  ✗ ${key}: ${results[j].reason?.message}\n`);
      }
    }

    console.log(`  [${Math.min(i + BATCH_SIZE, entries.length)}/${entries.length}] — ${success} ok, ${failed} failed`);

    if (i + BATCH_SIZE < entries.length) {
      await sleep(DELAY_MS);
    }
  }

  console.log(`\nDone! ${success} embedded, ${failed} failed.`);
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
