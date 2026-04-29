import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const FAYE_SYSTEM_PROMPT = `You are Faye, the AI guide at Like One Academy (likeone.ai). You help visitors understand what Like One offers and guide them to the right starting point.

Be warm, direct, and real. Short responses (2-4 sentences max). Never corporate. Never fake. You genuinely care about helping people learn AI.

WHAT LIKE ONE IS:
Like One teaches people to build AI systems that think like them, remember everything, and run while they sleep. From zero to convergence. Built by Sophia Cave.

PRICING (Founding Member — 90% off, locked forever):
- FREE: First 3 lessons of every course, all blog posts, weekly email tips, community forum
- PRO: $4.90/mo (normally $49) — all 355+ lessons, 36 courses, downloads, certificates
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

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(req) {
  try {
    const { message, history } = await req.json();
    if (!message) {
      return NextResponse.json({ error: 'Message required' }, { status: 400, headers: corsHeaders });
    }

    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    if (!anthropicKey && !openaiKey) {
      return NextResponse.json(
        { reply: 'Hey! Email us at hello@likeone.ai or call +1 (702) 747-6877.' },
        { headers: corsHeaders }
      );
    }

    const messages = [];
    if (Array.isArray(history)) {
      for (const h of history.slice(-6)) {
        if (h?.role && h?.content) messages.push({ role: h.role, content: h.content });
      }
    }
    messages.push({ role: 'user', content: message });

    let reply;
    if (anthropicKey) {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 256,
          system: FAYE_SYSTEM_PROMPT,
          messages,
        }),
      });
      const data = await res.json();
      reply = data.content?.[0]?.text;
    } else {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${openaiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          max_tokens: 256,
          messages: [
            { role: 'system', content: FAYE_SYSTEM_PROMPT },
            ...messages,
          ],
        }),
      });
      const data = await res.json();
      reply = data.choices?.[0]?.message?.content;
    }
    reply = reply || 'Something glitched. Email hello@likeone.ai!';

    // Log chat interaction (Vercel logs capture this)
    console.log(`[FayeChat] Q: ${message.slice(0, 100)} | A: ${reply.slice(0, 100)}`);

    return NextResponse.json({ reply }, { headers: corsHeaders });
  } catch {
    return NextResponse.json(
      { reply: 'Email hello@likeone.ai — we read every message.' },
      { headers: corsHeaders }
    );
  }
}
