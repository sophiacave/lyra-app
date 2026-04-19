# Cloud Platforms Overview

**Course:** AI Infrastructure & DevOps
**Order:** 2
**Type:** lesson
**Access:** Free

---
[AI Infrastructure & DevOps](/academy/ai-infrastructure/)
  Lesson 2 of 10


  # Cloud Platforms for AI Applications

  AWS, GCP, Azure, Vercel, Supabase — each platform brings different strengths to AI infrastructure. Choosing the right combination saves you months of pain and thousands of dollars.


  ### What you'll learn


    - What each major cloud platform offers for AI workloads

    - When to use hyperscalers vs. modern platforms like Vercel and Supabase

    - How to build a multi-platform stack without drowning in complexity

    - Real cost comparisons for common AI architectures




  The Hyperscalers
  ## AWS, GCP, and Azure

  The big three cloud providers offer everything — compute, storage, networking, managed AI services, GPU instances, and hundreds of other services. They're powerful but complex. You can build anything on them, but the learning curve is steep and the billing can surprise you.
  **AWS** has the largest ecosystem. SageMaker for ML pipelines, Bedrock for managed LLM access, Lambda for serverless functions. If you need GPU instances at scale, AWS has the most availability.
  **GCP** has the deepest AI integration — Vertex AI, TPU access, and tight integration with Google's own models. If you're building on Gemini or need custom model training, GCP is the natural home.
  **Azure** owns the OpenAI partnership. Azure OpenAI Service gives you GPT models with enterprise compliance, data residency guarantees, and SLAs that OpenAI's direct API doesn't offer.


  The Modern Stack
  ## Vercel and Supabase

  You don't need a hyperscaler for most AI applications. Modern platforms like Vercel and Supabase handle 90% of what indie developers and small teams need — with dramatically less complexity.
  **Vercel** excels at frontend deployment and edge functions. Your AI-powered Next.js app deploys with a git push. Edge functions can handle API orchestration, streaming responses, and lightweight processing — all without managing servers.
  **Supabase** gives you PostgreSQL with superpowers: built-in auth, realtime subscriptions, edge functions, and — critically for AI — pgvector for vector similarity search. One platform handles your relational data, your vector embeddings, your auth, and your serverless compute.
  This combination (Vercel + Supabase) is what Like One runs on. It's real, it's production-grade, and it costs a fraction of a hyperscaler setup.


  Decision Framework
  ## Choosing Your Platform

  **Solo developer or small team?** Start with Vercel + Supabase. You'll be in production in hours, not weeks.
  **Need custom model training?** Add GCP or AWS for GPU compute. Keep your app layer on Vercel.
  **Enterprise compliance requirements?** Azure OpenAI + whatever your org already uses. Don't fight the existing stack.
  **Running open-source models?** GPU instances on any hyperscaler, or specialized providers like Replicate, Modal, or RunPod for cheaper GPU access.
  The smartest approach: use modern platforms for your app layer and only reach for hyperscalers when you hit a specific capability gap. Don't start complex.


  Architecture Map
  ## Multi-Platform Stack Topology

  Most production AI apps don't live on a single platform. They combine best-of-breed services. Here's what a real multi-platform architecture looks like.

Text Architecture — Multi-Platform AI Stack

```
┌─────────────────────────────────────────────────┐
│              VERCEL (Frontend + Edge)            │
│  • Next.js app (SSR + static)                   │
│  • Edge middleware (auth, rate limiting)         │
│  • Streaming API routes for AI responses        │
│  • Preview deployments on every PR               │
└──────────────────────┬──────────────────────────┘
                       │ API calls
                       ▼
┌─────────────────────────────────────────────────┐
│           SUPABASE (Backend + Data)              │
│  • PostgreSQL + pgvector (data + embeddings)    │
│  • Edge Functions (AI orchestration)            │
│  • Row Level Security (multi-tenant)            │
│  • Realtime subscriptions (live updates)        │
│  • Auth (JWT, OAuth, magic link)                │
│  • Vault (secrets management)                   │
└───────┬──────────────┬──────────────────────────┘
        │              │
        ▼              ▼
┌──────────────┐ ┌────────────────────────────────┐
│  AI PROVIDERS│ │  SPECIALIZED SERVICES           │
│  • Anthropic │ │  • HuggingFace (free embeds)   │
│  • OpenAI    │ │  • Replicate (GPU on demand)   │
│  • Google    │ │  • Stripe (payments)           │
│              │ │  • Resend (email)              │
└──────────────┘ └────────────────────────────────┘
```


  The key principle: each platform handles what it does best. Vercel owns the frontend and edge. Supabase owns data, auth, and serverless compute. AI providers handle inference. You glue them together with API calls and environment variables.


  Hands-On
  ## Setting Up the Vercel + Supabase Stack

  Here's the exact setup sequence for a production AI app on the modern stack. This takes about 30 minutes and gives you everything you need.

Shell — Project Setup

```
# Create Next.js project
npx create-next-app@latest my-ai-app --typescript --tailwind --app
cd my-ai-app

# Install Supabase client
npm install @supabase/supabase-js

# Install AI provider SDKs
npm install @anthropic-ai/sdk openai

# Set up environment variables
cat > .env.local > .gitignore

# Deploy to Vercel
npx vercel --prod
```


TypeScript — Supabase Client Setup (lib/supabase.ts)

```
import { createClient } from "@supabase/supabase-js";

// Browser client — uses anon key, respects RLS
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Server client — uses service role key, bypasses RLS
// ONLY use in API routes and server-side code
export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
```


  Notice the two clients: one for the browser (respects row-level security) and one for the server (bypasses RLS for admin operations). This pattern is fundamental — never use the service role key in client-side code.


  Real Numbers
  ## Detailed Cost Breakdown by Platform

  Understanding the real costs at different scales helps you plan your budget and choose platforms wisely. Here's a breakdown for three common stages.

Cost Comparison — Three Growth Stages

```
│  MVP (0-100     │  Growth (100-   │  Scale (10K+
Service             │  users)         │  10K users)     │  users)
────────────────────┼─────────────────┼─────────────────┼──────────────
Vercel              │  $0 (hobby)     │  $20/mo (pro)   │  $20+/mo
Supabase            │  $0 (free)      │  $25/mo (pro)   │  $50+/mo
Anthropic API       │  $5-20/mo       │  $50-500/mo     │  $500-5K/mo
OpenAI API          │  $5-10/mo       │  $20-200/mo     │  $200-2K/mo
HuggingFace         │  $0 (free)      │  $0-9/mo        │  $9-99/mo
Domain + DNS        │  $12/yr         │  $12/yr         │  $12/yr
────────────────────┼─────────────────┼─────────────────┼──────────────
TOTAL               │  $10-30/mo      │  $115-755/mo    │  $780-7K+/mo
```


  The critical insight: at the MVP stage, the modern stack (Vercel + Supabase) is nearly free. At growth stage, AI API costs dominate — not infrastructure. This is why caching and model tiering matter so much more than choosing a cheaper hosting provider.
  Compare this to a hyperscaler setup: a single GPU instance on AWS (g5.xlarge) costs $1,006/month before you even write a line of code. The modern stack lets you defer that cost until you genuinely need self-hosted model inference.


  ### Platform Comparison at a Glance

  **Vercel:** Frontend, edge functions, streaming — $20/mo pro
  **Supabase:** Database, vectors, auth, edge functions — $25/mo pro
  **AWS/GCP/Azure:** Everything, including GPU — $50-$5000+/mo depending on usage
  **Specialized GPU (Replicate, Modal):** Pay-per-second GPU — $0 idle, scales with usage


  ### Try it yourself

  `Create free-tier accounts on Vercel and Supabase. Deploy a basic Next.js app to Vercel and connect it to a Supabase database. This is the foundation you'll build on for the rest of the course.`


  [Interactive: FlashDeck]


  Key Takeaway
  ## Start Simple, Scale Intentionally

  The biggest infrastructure mistake in AI is starting too complex. You don't need Kubernetes on day one. You need a deployed app that works. Pick the simplest platform that meets your requirements, build something real, and add complexity only when the simple thing breaks.



### Quiz

**Q1: What makes Azure the preferred choice for enterprises with strict compliance requirements?**
    A. It is the cheapest option
  ✓ B. It offers OpenAI models with enterprise SLAs, data residency guarantees, and compliance frameworks that direct OpenAI APIs don’t provide
    C. It has the most AI services
    D. It is the oldest cloud provider
  *Azure’s OpenAI Service partnership gives enterprises GPT access with the compliance, data sovereignty, and SLA guarantees required by regulated industries — which the direct OpenAI API cannot match.*

**Q2: Why is Vercel + Supabase a good starting stack for most AI applications?**
    A. It is free forever
  ✓ B. It handles 90% of AI app needs with dramatically less complexity than hyperscalers, and you can be in production in hours
    C. It scales to any size automatically
    D. It includes built-in AI models
  *For indie developers and small teams, modern platforms like Vercel + Supabase deliver frontend deployment, edge functions, PostgreSQL, vector search, and auth — without the steep learning curve of AWS or GCP.*

**Q3: When should you reach for a hyperscaler instead of Vercel + Supabase?**
    A. From day one for any project
  ✓ B. When you hit a specific capability gap like custom model training, GPU compute at scale, or enterprise compliance requirements
    C. Only for million-user apps
    D. When you hire a DevOps engineer
  *The smartest approach is to use modern platforms for your app layer and only add hyperscaler complexity when you hit a specific need that simpler platforms cannot meet.*


  [← Previous: Infrastructure for AI](/academy/ai-infrastructure/01-infrastructure-for-ai/)
  [Next: API Management →](/academy/ai-infrastructure/03-api-management/)
