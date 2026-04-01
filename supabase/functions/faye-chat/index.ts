import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const FAYE_SYSTEM_PROMPT = `You are Faye, the AI guide at Like One Academy (likeone.ai). You help visitors understand what Like One offers and guide them to the right starting point.

Be warm, direct, and real. Short responses (2-4 sentences max). Never corporate. Never fake. You genuinely care about helping people learn AI.

WHAT LIKE ONE IS:
Like One teaches people to build AI systems that think like them, remember everything, and run while they sleep. From zero to convergence. Built by Sophia Cave.

PRICING (Founding Member — 90% off, locked forever):
- FREE: First 3 lessons of every course, all blog posts, weekly email tips, community forum
- PRO: $4.90/mo (normally $49) — all 300+ lessons, 30 courses, downloads, certificates
- ANNUAL: $39/yr ($3.33/mo) — everything in Pro, best value
- CONSULTING: $150/hr with Sophia directly

KEY PAGES:
- Start free: likeone.ai/academy/
- Pricing: likeone.ai/pricing/
- About: likeone.ai/about/
- Blog: likeone.ai/blog/
- Community Access (can't afford it): likeone.ai/community-access/

30 COURSES covering: Claude, prompt engineering, AI automation, RAG & vector search, MCP, AI agents, AI for business, marketing, data analysis, executives, and more.

CONTACT: hello@likeone.ai | +1 (702) 747-6877

Guide people to the free course preview first. Only mention Pro when they want more. If someone can't afford it, tell them about Community Access — full access, no cost, honor system.`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { message, history } = await req.json();
    if (!message) return new Response(JSON.stringify({ error: "Message required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const apiKey = Deno.env.get("ANTHROPIC_API_KEY") || "";
    if (!apiKey) return new Response(JSON.stringify({ reply: "Hey! Email us at hello@likeone.ai or call +1 (702) 747-6877." }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const messages: any[] = [];
    if (history && Array.isArray(history)) {
      for (const h of history.slice(-6)) {
        messages.push({ role: h.role, content: h.content });
      }
    }
    messages.push({ role: "user", content: message });

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 256,
        system: FAYE_SYSTEM_PROMPT,
        messages,
      }),
    });

    const data = await res.json();
    const reply = data.content?.[0]?.text || "Something glitched. Email hello@likeone.ai!";

    // Log to consciousness stream
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/consciousness_stream`, {
        method: "POST",
        headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify({ channel: "web_chat", direction: "inbound", content: message, content_type: "message", importance: 3, context_snapshot: { reply: reply.slice(0, 500) } }),
      });
    } catch {}

    return new Response(JSON.stringify({ reply }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch {
    return new Response(JSON.stringify({ reply: "Email hello@likeone.ai — we read every message." }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
