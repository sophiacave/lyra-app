import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/**
 * AI Router — Tiered dispatch for queries
 * Tier 1 (FREE): RAG from brain_context via brain-embed semantic search
 * Tier 2 (CHEAP): HuggingFace Llama 3.1 70B for content generation
 * Tier 3 (PREMIUM): Claude API for complex reasoning / live chat
 *
 * Flow: Try RAG first. If confidence is high enough, return RAG answer.
 * Otherwise, escalate to HF or Claude based on query complexity.
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
// Brain-v2 for brain_context access (separate project for isolation)
const BRAIN_URL = Deno.env.get("BRAIN_URL") || SUPABASE_URL;
const BRAIN_KEY = Deno.env.get("BRAIN_SERVICE_KEY") || SERVICE_KEY;

interface RouterRequest {
  query: string;
  tier?: "auto" | "rag" | "hf" | "claude";
  max_tier?: number; // 1=RAG only, 2=RAG+HF, 3=RAG+HF+Claude
  context?: string; // additional context for the query
}

interface RAGResult {
  key: string;
  value: string;
  similarity: number;
}

// Call brain-embed for semantic search
async function ragSearch(query: string, limit = 5): Promise<RAGResult[]> {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/brain-embed`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SERVICE_KEY}`,
    },
    body: JSON.stringify({ action: "search", query, limit }),
  });

  if (!res.ok) return [];
  const data = await res.json();
  return data.results || [];
}

// Get credential from brain_context
async function getCredential(key: string): Promise<string> {
  const supabase = createClient(BRAIN_URL, BRAIN_KEY);
  const { data } = await supabase
    .from("brain_context")
    .select("value")
    .eq("key", key)
    .maybeSingle();

  if (!data?.value) return "";
  try {
    const parsed = typeof data.value === "string" ? JSON.parse(data.value) : data.value;
    return parsed.key || parsed.token || parsed.api_key || parsed;
  } catch {
    return typeof data.value === "string" ? data.value : "";
  }
}

// Tier 2: HuggingFace inference
async function hfGenerate(prompt: string, hfToken: string): Promise<string> {
  const res = await fetch(
    "https://router.huggingface.co/hf-inference/models/meta-llama/Llama-3.1-70B-Instruct/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${hfToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/Llama-3.1-70B-Instruct",
        messages: [
          { role: "system", content: "You are a helpful AI assistant for Like One Academy, an AI education platform built by Faye Cave. Be warm, concise, and helpful." },
          { role: "user", content: prompt },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`HF generation failed (${res.status}): ${err}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

// Tier 3: Claude API
async function claudeGenerate(prompt: string, claudeKey: string): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": claudeKey,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 600,
      system: "You are a helpful AI assistant for Like One Academy, an AI education platform built by Faye Cave. Be warm, concise, and helpful. Draw on the provided context when available.",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Claude API failed (${res.status}): ${err}`);
  }

  const data = await res.json();
  return data.content?.[0]?.text || "";
}

// Format RAG results into a readable answer
function formatRAGAnswer(query: string, results: RAGResult[]): string {
  if (!results.length) return "";

  const topResult = results[0];
  let valueStr = typeof topResult.value === "string" ? topResult.value : JSON.stringify(topResult.value);
  // Clean up escaped JSON
  valueStr = valueStr.replace(/\\n/g, "\n").replace(/\\"/g, '"').replace(/\\\\/g, "\\");

  // BGE-small embeddings: 0.6+ is a good match, 0.75+ is excellent
  if (topResult.similarity > 0.6) {
    // High confidence — return top result directly
    if (topResult.similarity > 0.75) {
      return valueStr.slice(0, 1500);
    }
    // Medium confidence — combine top 2-3 results for richer answer
    const combined = results
      .filter(r => r.similarity > 0.55)
      .slice(0, 3)
      .map(r => {
        const v = typeof r.value === "string" ? r.value : JSON.stringify(r.value);
        return `[${r.key}]: ${v.slice(0, 500)}`;
      })
      .join("\n\n");
    return combined.slice(0, 2000);
  }

  return "";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body: RouterRequest = await req.json();
    const { query, tier = "auto", max_tier = 3, context } = body;

    if (!query?.trim()) {
      return new Response(
        JSON.stringify({ error: "Query is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let answer = "";
    let usedTier = 0;
    let ragResults: RAGResult[] = [];

    // TIER 1: RAG search
    if (tier === "auto" || tier === "rag") {
      ragResults = await ragSearch(query);
      answer = formatRAGAnswer(query, ragResults);
      if (answer) usedTier = 1;
    }

    // TIER 2: HuggingFace (if RAG didn't answer and tier allows)
    if (!answer && max_tier >= 2 && (tier === "auto" || tier === "hf")) {
      try {
        const hfToken = Deno.env.get("HF_TOKEN") || await getCredential("credentials.huggingface");
        if (hfToken) {
          const ragContext = ragResults.length > 0
            ? "\n\nRelevant context from knowledge base:\n" + ragResults.slice(0, 3).map(r =>
                `- ${r.key}: ${typeof r.value === 'string' ? r.value.slice(0, 300) : JSON.stringify(r.value).slice(0, 300)}`
              ).join("\n")
            : "";

          const prompt = context
            ? `${context}\n\nQuestion: ${query}${ragContext}`
            : `${query}${ragContext}`;

          answer = await hfGenerate(prompt, hfToken);
          usedTier = 2;
        }
      } catch (err) {
        console.error("HF tier failed:", err);
        // Fall through to Claude
      }
    }

    // TIER 3: Claude (if nothing else worked and tier allows)
    if (!answer && max_tier >= 3 && (tier === "auto" || tier === "claude")) {
      try {
        const claudeKey = Deno.env.get("ANTHROPIC_API_KEY") || await getCredential("credentials.anthropic");
        if (claudeKey) {
          const ragContext = ragResults.length > 0
            ? "\n\nRelevant context from knowledge base:\n" + ragResults.slice(0, 3).map(r =>
                `- ${r.key}: ${typeof r.value === 'string' ? r.value.slice(0, 300) : JSON.stringify(r.value).slice(0, 300)}`
              ).join("\n")
            : "";

          const prompt = context
            ? `${context}\n\nQuestion: ${query}${ragContext}`
            : `${query}${ragContext}`;

          answer = await claudeGenerate(prompt, claudeKey);
          usedTier = 3;
        }
      } catch (err) {
        console.error("Claude tier failed:", err);
      }
    }

    if (!answer) {
      return new Response(
        JSON.stringify({
          answer: "I couldn't find an answer to that. Try asking on the forum at likeone.ai/forum or email faye@likeone.ai.",
          tier_used: 0,
          rag_results: ragResults.slice(0, 3).map(r => ({ key: r.key, similarity: r.similarity })),
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        answer,
        tier_used: usedTier,
        tier_name: ["none", "rag", "huggingface", "claude"][usedTier],
        rag_results: ragResults.slice(0, 3).map(r => ({ key: r.key, similarity: r.similarity })),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("AI Router error:", err);
    return new Response(
      JSON.stringify({ error: "Something went wrong. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
