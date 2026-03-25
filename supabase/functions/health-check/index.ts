/**
 * LIKE ONE OPS — Health Check
 * Monitors all 4 brains and reports status.
 * Deploy to: like-one-ops (iairxsntsvqzzrgrvkqy)
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const BRAINS = [
  {
    name: "brain",
    ref: "tnsujchfrixxsdpodygu",
    url: "https://tnsujchfrixxsdpodygu.supabase.co",
    anon: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuc3VqY2hmcml4eHNkcG9keWd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0MjkyNTQsImV4cCI6MjA5MDAwNTI1NH0.ef9DQbJPZ3m47gdz6zBfVnWKGInrsa-6idV3GmJSc6U",
    test_table: "brain_context",
  },
  {
    name: "app",
    ref: "blknphuwwgagtueqtoji",
    url: "https://blknphuwwgagtueqtoji.supabase.co",
    anon: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsa25waHV3d2dhZ3R1ZXF0b2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0MDcxNTgsImV4cCI6MjA4OTk4MzE1OH0.Wm7-plwu9N7sG2SzD_C9mHUwB4Ceh91F7fimraVBG_s",
    test_table: "profiles",
  },
  {
    name: "revenue",
    ref: "munmhzylfoiyigismbds",
    url: "https://munmhzylfoiyigismbds.supabase.co",
    anon: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11bm1oenlsZm9peWlnaXNtYmRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0MDcxODYsImV4cCI6MjA4OTk4MzE4Nn0.f6J4AnYwjA-WFYrEs_RSpYux3yewHiAwJb8u4_kJUvA",
    test_table: "revenue_events",
  },
  {
    name: "ops",
    ref: "iairxsntsvqzzrgrvkqy",
    url: "https://iairxsntsvqzzrgrvkqy.supabase.co",
    anon: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhaXJ4c250c3ZxenpyZ3J2a3F5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0MDcyMDIsImV4cCI6MjA4OTk4MzIwMn0.bOrfvZ1kp9Kg2gp6KVmgrG2Imqf5Y9VYte1xv-TbGME",
    test_table: "health_checks",
  },
];

async function checkBrain(brain: typeof BRAINS[0]): Promise<{
  name: string;
  status: "healthy" | "degraded" | "down";
  response_ms: number;
  error?: string;
}> {
  const start = Date.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(
      `${brain.url}/rest/v1/${brain.test_table}?select=id&limit=1`,
      {
        headers: {
          apikey: brain.anon,
          Authorization: `Bearer ${brain.anon}`,
        },
        signal: controller.signal,
      }
    );
    clearTimeout(timeout);

    const ms = Date.now() - start;

    if (res.ok) {
      return { name: brain.name, status: ms > 3000 ? "degraded" : "healthy", response_ms: ms };
    } else {
      return { name: brain.name, status: "degraded", response_ms: ms, error: `HTTP ${res.status}` };
    }
  } catch (err) {
    return {
      name: brain.name,
      status: "down",
      response_ms: Date.now() - start,
      error: err.message || "Connection failed",
    };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const results = await Promise.all(BRAINS.map(checkBrain));

  const overall = results.every((r) => r.status === "healthy")
    ? "ALL_HEALTHY"
    : results.some((r) => r.status === "down")
    ? "DEGRADED"
    : "PARTIAL";

  // Log to ops DB
  try {
    const OPS_URL = Deno.env.get("SUPABASE_URL")!;
    const OPS_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    for (const r of results) {
      await fetch(`${OPS_URL}/rest/v1/health_checks`, {
        method: "POST",
        headers: {
          apikey: OPS_KEY,
          Authorization: `Bearer ${OPS_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          service: r.name,
          status: r.status,
          response_ms: r.response_ms,
          details: r.error ? { error: r.error } : {},
        }),
      });
    }
  } catch (_) {
    // Don't fail the health check because logging failed
  }

  return new Response(
    JSON.stringify({ status: overall, brains: results, checked_at: new Date().toISOString() }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
});
