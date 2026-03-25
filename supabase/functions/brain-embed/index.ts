import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
// Brain-v2 for brain_context access (separate project for isolation)
const BRAIN_URL = Deno.env.get("BRAIN_URL") || SUPABASE_URL;
const BRAIN_KEY = Deno.env.get("BRAIN_SERVICE_KEY") || SERVICE_KEY;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Get HF token from brain or env
let _hfToken: string | null = null;
async function getHFToken(): Promise<string> {
  const envKey = Deno.env.get("HF_TOKEN");
  if (envKey) return envKey;
  if (_hfToken) return _hfToken;
  try {
    const res = await fetch(
      `${BRAIN_URL}/rest/v1/brain_context?key=eq.credentials.huggingface&select=value`,
      { headers: { apikey: BRAIN_KEY, Authorization: `Bearer ${BRAIN_KEY}` } }
    );
    const rows = await res.json();
    if (rows[0]?.value) {
      const val = typeof rows[0].value === "string" ? JSON.parse(rows[0].value) : rows[0].value;
      _hfToken = val.token || val.api_key || val.key || "";
      return _hfToken!;
    }
  } catch (e) {
    console.error("Failed to fetch HF token:", e);
  }
  return "";
}

// Generate embedding via HuggingFace BGE-small
async function embed(text: string, hfToken: string): Promise<number[]> {
  const res = await fetch(
    "https://router.huggingface.co/hf-inference/models/BAAI/bge-small-en-v1.5/pipeline/feature-extraction",
    {
      method: "POST",
      headers: { Authorization: `Bearer ${hfToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ inputs: text }),
    }
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`HF embed failed (${res.status}): ${err}`);
  }
  const result = await res.json();
  // HF returns [[...floats]] for single input
  return Array.isArray(result[0]) ? result[0] : result;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { action, text, key, query, limit } = await req.json();
    const hfToken = await getHFToken();
    if (!hfToken) {
      return new Response(JSON.stringify({ error: "HuggingFace token not configured" }), {
        status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ACTION: embed — embed text and store/update in brain_context
    if (action === "embed" && key && text) {
      const embedding = await embed(text, hfToken);
      // Update the brain_context row with the embedding
      const updateRes = await fetch(
        `${BRAIN_URL}/rest/v1/brain_context?key=eq.${encodeURIComponent(key)}`,
        {
          method: "PATCH",
          headers: {
            apikey: BRAIN_KEY,
            Authorization: `Bearer ${BRAIN_KEY}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify({ embedding: `[${embedding.join(",")}]` }),
        }
      );
      return new Response(JSON.stringify({ success: true, dimensions: embedding.length }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ACTION: search — semantic search across brain_context
    if (action === "search" && query) {
      const queryEmbedding = await embed(query, hfToken);
      const searchLimit = limit || 5;
      // Use Supabase RPC for vector similarity search
      const rpcRes = await fetch(
        `${SUPABASE_URL}/rest/v1/rpc/brain_semantic_search`,
        {
          method: "POST",
          headers: {
            apikey: SERVICE_KEY,
            Authorization: `Bearer ${SERVICE_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query_embedding: `[${queryEmbedding.join(",")}]`,
            match_count: searchLimit,
          }),
        }
      );
      const results = await rpcRes.json();
      return new Response(JSON.stringify({ results }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ACTION: embed_text — just return the embedding vector (utility)
    if (action === "embed_text" && text) {
      const embedding = await embed(text, hfToken);
      return new Response(JSON.stringify({ embedding, dimensions: embedding.length }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action. Use: embed, search, embed_text" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("brain-embed error:", err);
    return new Response(JSON.stringify({ error: err.message || "Something went wrong" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
