import "jsr:@supabase/functions-js/edge-runtime.d.ts";

/**
 * Visual Memory — Image captioning + semantic storage
 * Uses Florence-2 (Microsoft) on HuggingFace for image understanding
 * Stores descriptions + embeddings in visual_memories table for semantic search
 *
 * Actions:
 *   caption  — Caption an image URL, store in visual_memories
 *   search   — Semantic search across visual memories by text query
 *   list     — List recent visual memories
 */

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

let _hfToken: string | null = null;
async function getHFToken(): Promise<string> {
  const envKey = Deno.env.get("HF_TOKEN");
  if (envKey) return envKey;
  if (_hfToken) return _hfToken;
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/brain_context?key=eq.credentials.huggingface&select=value`,
      { headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` } }
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

// Fetch image as base64
async function fetchImageBase64(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch image: ${res.status}`);
  const buffer = await res.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Caption image via Florence-2 on HuggingFace
async function captionImage(imageUrl: string, hfToken: string): Promise<string> {
  // Try Florence-2 large first, fall back to base
  const models = [
    "microsoft/Florence-2-large",
    "microsoft/Florence-2-base",
  ];

  for (const model of models) {
    try {
      const imageBase64 = await fetchImageBase64(imageUrl);

      const res = await fetch(
        `https://router.huggingface.co/hf-inference/models/${model}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${hfToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: imageBase64,
            parameters: {
              task: "<CAPTION>",
            },
          }),
        }
      );

      if (!res.ok) {
        const err = await res.text();
        console.error(`Florence-2 ${model} failed (${res.status}): ${err}`);
        continue;
      }

      const result = await res.json();

      // Florence-2 returns various formats
      if (typeof result === "string") return result;
      if (Array.isArray(result) && result[0]?.generated_text) return result[0].generated_text;
      if (result?.generated_text) return result.generated_text;
      if (result?.[0]?.label) return result.map((r: { label: string }) => r.label).join(", ");

      // Fallback: try image-to-text pipeline
      const res2 = await fetch(
        `https://router.huggingface.co/hf-inference/models/Salesforce/blip-image-captioning-large`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${hfToken}` },
          body: await (await fetch(imageUrl)).arrayBuffer(),
        }
      );

      if (res2.ok) {
        const result2 = await res2.json();
        if (Array.isArray(result2) && result2[0]?.generated_text) {
          return result2[0].generated_text;
        }
      }

      return JSON.stringify(result).slice(0, 500);
    } catch (e) {
      console.error(`Model ${model} error:`, e);
      continue;
    }
  }

  throw new Error("All captioning models failed");
}

// Embed text via BGE-small (same as brain-embed)
async function embedText(text: string, hfToken: string): Promise<number[]> {
  const res = await fetch(
    "https://router.huggingface.co/hf-inference/models/BAAI/bge-small-en-v1.5/pipeline/feature-extraction",
    {
      method: "POST",
      headers: { Authorization: `Bearer ${hfToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ inputs: text }),
    }
  );
  if (!res.ok) throw new Error(`Embedding failed: ${res.status}`);
  const result = await res.json();
  return Array.isArray(result[0]) ? result[0] : result;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { action, image_url, description, query, metadata, limit } = await req.json();
    const hfToken = await getHFToken();
    if (!hfToken) {
      return new Response(JSON.stringify({ error: "HuggingFace token not configured" }), {
        status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ACTION: caption — Caption an image and store in visual_memories
    if (action === "caption" && image_url) {
      // Get caption from Florence-2 or use provided description
      const caption = description || await captionImage(image_url, hfToken);

      // Embed the caption for semantic search
      const embedding = await embedText(caption, hfToken);

      // Store in visual_memories
      const insertRes = await fetch(
        `${SUPABASE_URL}/rest/v1/visual_memories`,
        {
          method: "POST",
          headers: {
            apikey: SERVICE_KEY,
            Authorization: `Bearer ${SERVICE_KEY}`,
            "Content-Type": "application/json",
            Prefer: "return=representation",
          },
          body: JSON.stringify({
            image_url,
            description: caption,
            embedding: `[${embedding.join(",")}]`,
            metadata: metadata || {},
          }),
        }
      );

      if (!insertRes.ok) {
        const err = await insertRes.text();
        throw new Error(`Failed to store visual memory: ${err}`);
      }

      const stored = await insertRes.json();
      return new Response(JSON.stringify({
        success: true,
        id: stored[0]?.id,
        description: caption,
        embedding_dimensions: embedding.length,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ACTION: search — Semantic search across visual memories
    if (action === "search" && query) {
      const queryEmbedding = await embedText(query, hfToken);
      const searchLimit = limit || 5;

      // Use raw SQL via RPC or direct query with vector similarity
      const rpcRes = await fetch(
        `${SUPABASE_URL}/rest/v1/rpc/visual_semantic_search`,
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

      if (!rpcRes.ok) {
        // Fallback: simple query without vector search
        const fallbackRes = await fetch(
          `${SUPABASE_URL}/rest/v1/visual_memories?select=id,description,image_url,metadata,created_at&order=created_at.desc&limit=${searchLimit}`,
          { headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` } }
        );
        const fallbackData = await fallbackRes.json();
        return new Response(JSON.stringify({ results: fallbackData, note: "text search fallback — vector search RPC not found" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const results = await rpcRes.json();
      return new Response(JSON.stringify({ results }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ACTION: list — List recent visual memories
    if (action === "list") {
      const listLimit = limit || 20;
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/visual_memories?select=id,description,image_url,metadata,created_at&order=created_at.desc&limit=${listLimit}`,
        { headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` } }
      );
      const data = await res.json();
      return new Response(JSON.stringify({ memories: data, count: data.length }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action. Use: caption, search, list" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("visual-memory error:", err);
    return new Response(JSON.stringify({ error: (err as Error).message || "Something went wrong" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
