# Your AI Infrastructure Stack

**Course:** AI Infrastructure & DevOps
**Order:** 10
**Type:** lesson
**Access:** Premium

---
[AI Infrastructure & DevOps](/academy/ai-infrastructure/)
  Lesson 10 of 10


  # Building Your Complete Infrastructure

  Nine lessons of theory and technique. Now it's time to put it all together into a production-ready AI infrastructure stack — one that's secure, cost-efficient, observable, and ready to scale.


  ### What you'll learn


    - How to assemble a complete AI infrastructure from the ground up

    - A reference architecture you can adapt to your own project

    - The order of operations for building each layer

    - Common pitfalls and how to avoid them




  The Blueprint
  ## Reference Architecture

  Here's the complete stack, layer by layer. This is the architecture that Like One runs on — proven in production, affordable for indie developers, and scalable when growth demands it.
  **Frontend:** Next.js on Vercel. Auto-deploys from GitHub. Edge middleware for auth checks and rate limiting. Streaming responses for AI-generated content so users see results immediately.
  **Backend / API:** Supabase edge functions. Serverless, auto-scaling, close to the database. These handle AI orchestration — receiving requests, checking caches, calling providers, and returning results.
  **Database:** PostgreSQL on Supabase with pgvector enabled. One database for application data, vector embeddings, operation logs, and cached responses. Row-level security for multi-tenant isolation.
  **AI Layer:** Tiered provider setup. Free embeddings via HuggingFace. Mid-tier model for simple tasks. Flagship model for complex reasoning. Semantic cache in front of everything.
  **Monitoring:** Structured logs in a dedicated Supabase table. Cost tracking per operation. Alerts via cron-triggered edge functions to Slack or email.


  Build Order
  ## What to Build First

  Don't try to build everything at once. This is the order that minimizes rework and gets you to production fastest.
  **Week 1: Foundation.** Set up your Vercel project and Supabase database. Deploy a basic app that serves pages. Confirm your CI/CD pipeline works — push to main, see it live.
  **Week 2: AI Integration.** Add your first AI API call through a Supabase edge function. Store the API key in environment variables. Add basic logging — every call writes to your operations log table.
  **Week 3: Vector Search.** Enable pgvector. Create your embeddings table. Build a basic RAG pipeline: embed content, store vectors, query by similarity, inject context into your AI prompts.
  **Week 4: Hardening.** Add rate limiting, input validation, and output checking. Implement response caching. Set up cost alerts. Write your first post-deploy smoke test.
  After four weeks, you have a production-grade AI infrastructure. Everything after this is optimization and scaling — which you do when you need it, not before.


  Starter Code
  ## Complete Edge Function — AI Orchestrator

  Here's a production-ready Supabase edge function that ties together everything from this course: rate limiting, caching, RAG, provider fallback, cost logging, and input validation — all in one function.

TypeScript — Complete AI Orchestrator Edge Function

```
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async (req) => {
  const startTime = Date.now();
  const { message, userId } = await req.json();

  // 1. INPUT VALIDATION
  if (!message || message.length > 10_000) {
    return new Response(JSON.stringify({ error: "Invalid input" }), { status: 400 });
  }
  const injectionPatterns = [
    /ignore\s+previous\s+instructions/i,
    /reveal\s+(your|the)\s+prompt/i,
  ];
  if (injectionPatterns.some(p => p.test(message))) {
    return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400 });
  }

  // 2. RATE LIMITING
  const windowStart = new Date(Date.now() - 3600_000).toISOString();
  const { count } = await supabase
    .from("ai_api_calls")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", windowStart);

  if ((count ?? 0) >= 20) {
    return new Response(
      JSON.stringify({ error: "Rate limit exceeded. Try again later." }),
      { status: 429 }
    );
  }

  // 3. SEMANTIC CACHE CHECK
  const embedRes = await fetch(
    "https://api-inference.huggingface.co/pipeline/feature-extraction/BAAI/bge-small-en-v1.5",
    {
      method: "POST",
      headers: { Authorization: `Bearer ${Deno.env.get("HF_TOKEN")}` },
      body: JSON.stringify({ inputs: message }),
    }
  );
  const embedding = await embedRes.json();

  const { data: cached } = await supabase.rpc("find_cached_response", {
    query_vec: JSON.stringify(embedding),
    similarity_threshold: 0.95,
  });

  if (cached?.length > 0) {
    await logOperation(userId, "cache_hit", 0, 0, Date.now() - startTime, 0);
    return new Response(JSON.stringify({ response: cached[0].response_text }));
  }

  // 4. RAG RETRIEVAL
  const { data: docs } = await supabase.rpc("match_documents", {
    query_embedding: embedding,
    match_threshold: 0.7,
    match_count: 5,
  });
  const context = docs?.map((d: any) => d.content).join("\n\n") ?? "";

  // 5. LLM CALL WITH FALLBACK
  let response: string;
  let provider = "anthropic";
  try {
    response = await callClaude(message, context);
  } catch {
    provider = "openai";
    try {
      response = await callGPT(message, context);
    } catch {
      response = "All AI providers are currently unavailable. Please try again.";
      provider = "none";
    }
  }

  // 6. COST LOGGING
  const latency = Date.now() - startTime;
  const inputTokens = Math.ceil((message.length + context.length) / 4);
  const outputTokens = Math.ceil(response.length / 4);
  const cost = provider === "anthropic"
    ? (inputTokens * 3 + outputTokens * 15) / 1_000_000
    : (inputTokens * 2.5 + outputTokens * 10) / 1_000_000;

  await logOperation(userId, provider, inputTokens, outputTokens, latency, cost);

  // 7. CACHE THE RESPONSE
  if (provider !== "none") {
    await supabase.from("semantic_cache").insert({
      query_text: message,
      query_embedding: JSON.stringify(embedding),
      response_text: response,
      provider, model: provider === "anthropic" ? "claude-sonnet" : "gpt-4o",
    });
  }

  return new Response(JSON.stringify({ response, provider, latency }));
});

async function logOperation(
  userId: string, provider: string, input: number,
  output: number, latency: number, cost: number
) {
  await supabase.from("ai_api_calls").insert({
    user_id: userId, provider, input_tokens: input,
    output_tokens: output, latency_ms: latency,
    estimated_cost: cost, status: "success",
  });
}
```


  This single function implements 7 of the 10 lessons in this course. Study it, understand each layer, then adapt it for your own project. The patterns are the same regardless of your specific use case — input validation, rate limiting, caching, RAG, provider fallback, cost logging, and response caching.


  Architecture
  ## Full Stack Architecture Diagram

  Here's the complete architecture of a production AI application, showing how every component from this course connects together.

Text Architecture — Complete Production AI Stack

```
┌───────────────────────────────────────────────────────────┐
│                    GITHUB REPOSITORY                       │
│  Push to main → triggers Vercel deploy + GitHub Actions    │
└─────────────────────────┬─────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼                               ▼
┌──────────────────┐           ┌──────────────────────────┐
│  VERCEL           │           │  GITHUB ACTIONS           │
│  • Next.js SSR    │           │  • Run tests              │
│  • Edge middleware│           │  • Deploy edge functions   │
│  • Streaming API  │           │  • Post-deploy smoke test  │
└────────┬─────────┘           └──────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────┐
│                  SUPABASE PLATFORM                        │
│                                                           │
│  ┌────────────┐  ┌──────────────┐  ┌──────────────────┐ │
│  │ Edge Funcs  │  │ PostgreSQL   │  │ Auth + RLS       │ │
│  │ • AI orch.  │  │ • Users      │  │ • JWT tokens     │ │
│  │ • Rate lim. │  │ • Vectors    │  │ • Row-level sec. │ │
│  │ • Caching   │  │ • Logs       │  │ • OAuth          │ │
│  │ • Alerts    │  │ • Cache      │  │                  │ │
│  └──────┬─────┘  └──────────────┘  └──────────────────┘ │
│         │                                                 │
└─────────┼─────────────────────────────────────────────────┘
          │
    ┌─────┼──────────────────────┐
    ▼     ▼                      ▼
┌──────┐ ┌──────┐  ┌──────────────────────┐
│Claude│ │ GPT  │  │ HuggingFace          │
│ API  │ │ API  │  │ (free embeddings)    │
└──────┘ └──────┘  └──────────────────────┘
```


  Everything connects through well-defined APIs. The frontend talks to edge functions. Edge functions talk to the database and AI providers. GitHub Actions automates deployment and testing. Each component is independently deployable and replaceable.


  Pitfalls
  ## Mistakes Everyone Makes

  **Over-engineering on day one.** You don't need Kubernetes, multi-region deployment, or a microservices architecture to serve your first 1,000 users. Start simple. Add complexity when simple breaks.
  **Ignoring costs until the bill arrives.** Set up cost tracking and alerts before you launch, not after your first $500 surprise. The monitoring lesson exists for a reason — do it early.
  **No caching layer.** Every production AI app needs caching. The cost difference between "cache everything possible" and "call the API every time" is the difference between a viable business and a money pit.
  **Skipping security.** Prompt injection isn't theoretical. Data leakage isn't theoretical. API key exposure isn't theoretical. Build security in from the start — retrofitting it is always harder.
  **Single provider dependency.** If your entire app breaks when one AI provider goes down, your architecture is fragile. Even a simple fallback to a cached response is better than showing users an error page.


  What's Next
  ## Beyond the Basics

  This course gives you the foundation. From here, the path depends on your specific needs. Training custom models, fine-tuning for your domain, building agent systems, implementing real-time collaboration with AI — these are advanced topics that build on everything you've learned.
  The infrastructure you've built is flexible enough to support all of these. PostgreSQL with pgvector, serverless compute, tiered AI providers, caching, monitoring — this foundation doesn't become obsolete when you add advanced capabilities. It just grows with you.
  The most important thing: build something real. Deploy it. Let real users hit it. That's where the real learning happens — in production, under load, with actual humans doing things you never expected. Your infrastructure either holds or it teaches you what to fix.


  ### Your Complete Stack Checklist

  Frontend: Vercel + Next.js (auto-deploy from GitHub)
  Backend: Supabase edge functions (serverless AI orchestration)
  Database: Supabase PostgreSQL + pgvector (data + vectors + logs)
  AI: Tiered providers (free embeddings → mid-tier → flagship)
  Cache: Semantic cache + response cache (40-70% cost reduction)
  Security: Input validation, output checking, key rotation, rate limits
  Monitoring: Structured logs, cost tracking, automated alerts
  CI/CD: Git push → auto-deploy → smoke test → alert on failure


  ### Your final project

  `Build and deploy a complete AI-powered application using the reference architecture from this course. It should include: a Vercel-deployed frontend, a Supabase edge function that calls an AI API, vector search via pgvector, response caching, rate limiting, cost logging, and a post-deploy smoke test. Document your architecture decisions and deploy it to production.`


  Thank You
  ## You Built Real Infrastructure

  Every lesson in this course came from real production experience — real outages, real cost surprises, real security incidents. The infrastructure you've learned to build isn't theoretical. It's the same stack running Like One right now.
  Go build something that matters. The infrastructure will hold.


  [Interactive: FlashDeck]



### Quiz

**Q1: What is the correct build order for a production AI infrastructure?**
    A. AI integration first, then database, then frontend
  ✓ B. Foundation (Vercel + Supabase) → AI integration → vector search → hardening (rate limiting, caching, alerts)
    C. Security first, then everything else
    D. All layers simultaneously
  *This order minimizes rework: first prove CI/CD works with a deployed app, then add AI calls, then add vector search for RAG, then harden with production-grade rate limiting, caching, validation, and monitoring.*

**Q2: When should you add Kubernetes and multi-region deployment to your AI infrastructure?**
    A. From day one for scalability
    B. After you hit 100 users
    C. Never — Vercel handles it
  ✓ D. Only when simple infrastructure breaks under real load — not before
  *Over-engineering on day one is a primary failure mode. Vercel and Supabase handle 90% of what you need at 1,000 users. Add complexity only when and because the simple thing breaks.*

**Q3: Why is single AI provider dependency an architectural risk?**
    A. It costs more
  ✓ B. If your entire app breaks when one provider goes down, your architecture is fragile — even a cached response fallback is better than an error page
    C. Providers charge more for single-provider usage
    D. It limits your model options
  *Every major AI provider has outages. Building automatic failover — whether to another provider or to cached responses — is the difference between a 5-minute user disruption and a full service outage.*


  [← Previous: Scaling Patterns](/academy/ai-infrastructure/09-scaling-patterns/)
  [Back to Course Overview](/academy/ai-infrastructure/)
