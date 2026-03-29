import "jsr:@supabase/functions-js/edge-runtime.d.ts";

/**
 * brain-nerve — The nervous system executor
 * Polls brain_actions for pending work, executes it, reports results.
 * Called by pg_cron every 5 minutes or manually.
 *
 * Supported action types:
 *   embed    → re-embed stale/new brain_context entries via brain-embed
 *   notify   → send notification (future: Resend email)
 *   build    → run build tasks (chunking pipeline, etc.)
 *   audit    → run brain_self_audit and log results
 */

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Helper: call a Supabase RPC function
async function rpc(fnName: string, params: Record<string, unknown> = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fnName}`, {
    method: "POST",
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`RPC ${fnName} failed (${res.status}): ${err}`);
  }
  const text = await res.text();
  if (!text || text === "null") return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// Helper: call brain-embed edge function
async function callBrainEmbed(
  action: string,
  params: Record<string, unknown>
) {
  const res = await fetch(
    `${SUPABASE_URL}/functions/v1/brain-embed`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SERVICE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action, ...params }),
    }
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`brain-embed ${action} failed (${res.status}): ${err}`);
  }
  return res.json();
}

// Execute an embed action — find unembedded/stale entries and embed them
async function executeEmbed(
  target: string,
  payload: Record<string, unknown>
): Promise<{ embedded: number; errors: string[] }> {
  const errors: string[] = [];
  let embedded = 0;

  // Fetch entries needing embedding via RPC (handles cross-column comparisons)
  const mode = target === "stale_entries" ? "stale" : target === "brain_context" ? "all" : "missing";

  const entriesRes = await fetch(
    `${SUPABASE_URL}/rest/v1/rpc/brain_get_unembedded`,
    {
      method: "POST",
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ p_mode: mode, p_limit: 20 }),
    }
  );

  if (!entriesRes.ok) {
    throw new Error(`Failed to fetch entries: ${await entriesRes.text()}`);
  }

  const entries = await entriesRes.json();

  for (const entry of entries) {
    try {
      // Build text to embed: description + stringified value
      const valueText =
        typeof entry.value === "string"
          ? entry.value
          : JSON.stringify(entry.value);
      const text = `${entry.key}: ${entry.description || ""}. ${valueText}`.slice(
        0,
        8000
      );

      // Call brain-embed to generate and store embedding
      const result = await callBrainEmbed("embed", {
        key: entry.key,
        text,
      });

      if (result.success) {
        // Update embedded_at timestamp
        await fetch(
          `${SUPABASE_URL}/rest/v1/brain_context?key=eq.${encodeURIComponent(
            entry.key
          )}`,
          {
            method: "PATCH",
            headers: {
              apikey: SERVICE_KEY,
              Authorization: `Bearer ${SERVICE_KEY}`,
              "Content-Type": "application/json",
              Prefer: "return=minimal",
            },
            body: JSON.stringify({ embedded_at: new Date().toISOString() }),
          }
        );
        embedded++;
      }
    } catch (err) {
      errors.push(`${entry.key}: ${(err as Error).message}`);
    }
  }

  return { embedded, errors };
}

// Execute an audit action
async function executeAudit(): Promise<Record<string, unknown>> {
  return await rpc("brain_self_audit");
}

// Execute a nerve check (dispatches new actions based on audit)
async function executeNerveCheck(): Promise<Record<string, unknown>> {
  return await rpc("brain_nerve_check");
}

// Main: process up to N pending actions
async function processActions(
  maxActions: number = 5
): Promise<{
  processed: number;
  results: Array<{ action_id: string; type: string; status: string; detail: unknown }>;
}> {
  const results: Array<{
    action_id: string;
    type: string;
    status: string;
    detail: unknown;
  }> = [];

  for (let i = 0; i < maxActions; i++) {
    // Claim next action
    const claimed = await rpc("brain_claim_action", {
      p_session: "brain-nerve",
    });

    if (claimed.status === "empty") break;

    const { action_id, action_type, target, payload } = claimed;
    let success = true;
    let result: unknown = {};

    try {
      switch (action_type) {
        case "embed":
          result = await executeEmbed(target, payload || {});
          break;

        case "audit":
          result = await executeAudit();
          break;

        case "nerve_check":
          result = await executeNerveCheck();
          break;

        case "notify":
          // Future: Resend email integration
          result = { status: "skipped", reason: "notify handler not yet implemented" };
          break;

        case "build":
          // Future: chunking pipeline, code generation, etc.
          result = { status: "skipped", reason: "build handler not yet implemented" };
          break;

        default:
          result = {
            status: "unknown_type",
            reason: `No handler for action type: ${action_type}`,
          };
          success = false;
      }
    } catch (err) {
      success = false;
      result = { error: (err as Error).message };
    }

    // Complete the action
    await rpc("brain_complete_action", {
      p_action_id: action_id,
      p_result: result,
      p_success: success,
    });

    results.push({
      action_id,
      type: action_type,
      status: success ? "completed" : "failed",
      detail: result,
    });
  }

  return { processed: results.length, results };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const maxActions = body.max_actions || 5;
    const mode = body.mode || "process"; // process | nerve_check | status

    let response: unknown;

    switch (mode) {
      case "nerve_check":
        // Run nerve check first (dispatches actions), then process them
        const nerveResult = await executeNerveCheck();
        const processResult = await processActions(maxActions);
        response = { nerve_check: nerveResult, execution: processResult };
        break;

      case "status":
        // Just report pending action count
        const statusRes = await fetch(
          `${SUPABASE_URL}/rest/v1/brain_actions?status=eq.pending&select=id,action_type,target,priority,created_at&order=priority.desc,created_at.asc`,
          {
            headers: {
              apikey: SERVICE_KEY,
              Authorization: `Bearer ${SERVICE_KEY}`,
            },
          }
        );
        const pending = await statusRes.json();
        response = { pending_count: pending.length, actions: pending };
        break;

      default:
        // Process pending actions
        response = await processActions(maxActions);
    }

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("brain-nerve error:", err);
    return new Response(
      JSON.stringify({ error: (err as Error).message || "Nerve failure" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
