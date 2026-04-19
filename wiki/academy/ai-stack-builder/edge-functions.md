# Edge Functions

**Course:** AI Stack Builder
**Order:** 4
**Type:** lesson
**Access:** Premium

---
[AI Stack Builder](/academy/ai-stack-builder/)
  Lesson 4 of 10


  # Edge Functions

  Edge functions are serverless code that runs close to your users. Write once, deploy globally, pay per invocation. No servers to manage, no infrastructure to maintain. This is your backend.


## What Are Edge Functions?

Think of edge functions as **mini-programs that live on the internet**. Instead of running on your laptop or a single server, they run on servers spread around the world, close to wherever your users are. When someone visits your app from Tokyo, the edge function runs in Tokyo. From London? It runs in London. This makes everything faster.

You do not manage servers, install software, or worry about scaling. You write a small function, deploy it with one command, and it is available to the whole world instantly. You only pay when someone actually uses it.


&#x1f310;
GlobalRuns close to users — Tokyo users get Tokyo servers automatically


&#x26a1;
Deno RuntimeModern TypeScript runtime — faster cold starts, better security than Node.js


&#x1f4b0;
Pay Per Use500K invocations free on Pro plan — most projects never exceed this


## Deno vs. Node.js: Why Supabase Chose Deno

**Deno** is a modern JavaScript/TypeScript runtime — the engine that runs your code on the server. If you have heard of Node.js, Deno is its newer, more secure sibling. Supabase chose Deno for three reasons:


1

**Faster Cold Starts**
Edge functions spin up on demand. The first request after being idle is a "cold start" (~100ms). Deno initializes faster than Node.js, keeping that delay minimal.


2

**Better Security Defaults**
Deno requires explicit permission for file, network, and environment access. A malicious package cannot silently read your filesystem or make network calls without your code granting permission.


3

**Native TypeScript**
Deno runs TypeScript natively — no build step, no tsconfig, no compilation. Write `.ts` files and deploy. The same JavaScript/TypeScript you already know works in Deno.


## Challenge 1: Hello World

Every API you have ever used — weather apps, payment systems, social media feeds — works by sending and receiving JSON responses. This first challenge teaches you the most fundamental skill in backend development: **making a function that responds when someone calls it**.


TypeScript — supabase/functions/hello/index.ts

```
// The simplest possible edge function
// Deno.serve is the modern way to create an HTTP server in Deno
Deno.serve(async (req) => {
  return new Response(
    JSON.stringify({ message: "Hello from the edge!" }),
    { headers: { "Content-Type": "application/json" } }
  )
})
```


Terminal — Deploy and test

```
# Deploy to Supabase
supabase functions deploy hello --project-ref

# Test it
curl https://.supabase.co/functions/v1/hello
# → {"message":"Hello from the edge!"}
```


## Challenge 2: JSON API (Read User Input)

Challenge 1 always returned the same thing. Real APIs need to **read what the user sends** and respond differently. This is how login forms, search bars, and checkout buttons work — your frontend sends data, and your edge function processes it.


TypeScript — supabase/functions/greet/index.ts

```
Deno.serve(async (req) => {
  // Parse the JSON body from the incoming request
  const { name } = await req.json()

  // Return a personalized greeting
  return new Response(
    JSON.stringify({
      greeting: `Hello, ${name}! Welcome to the edge.`
    }),
    { headers: { "Content-Type": "application/json" } }
  )
})
```


Terminal — Test with curl

```
curl -X POST https://.supabase.co/functions/v1/greet \
  -H "Content-Type: application/json" \
  -d '{"name": "Alex"}'
# → {"greeting":"Hello, Alex! Welcome to the edge."}
```


## Challenge 3: Database Query (The Real Power)

This is where it gets powerful. Your edge function can talk to your database — reading user data, checking subscriptions, pulling content. This is exactly how real products work: **user clicks button → frontend calls edge function → edge function queries database → data flows back**.


TypeScript — supabase/functions/read-brain/index.ts

```
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

Deno.serve(async (req) => {
  // Connect to Supabase with the service role key
  // (server-side only — bypasses RLS for full access)
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  )

  // Query the brain_context table
  const { data, error } = await supabase
    .from("brain_context")
    .select("key, value")
    .order("updated_at", { ascending: false })
    .limit(10)

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    )
  }

  return new Response(
    JSON.stringify({ brain: data }),
    { headers: { "Content-Type": "application/json" } }
  )
})
```


## CORS: Letting Your Frontend Call Your Functions

Browsers block requests from one domain to another by default — this is called CORS (Cross-Origin Resource Sharing). If your frontend is on `likeone.ai` and your edge function is on `supabase.co`, the browser will block the call unless you explicitly allow it.


TypeScript — CORS-enabled edge function

```
const corsHeaders = {
  "Access-Control-Allow-Origin": "https://yourdomain.com",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
}

Deno.serve(async (req) => {
  // Handle preflight OPTIONS request (browser sends this first)
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  // Your actual function logic here...
  const data = { message: "Hello!" }

  // Include CORS headers in EVERY response
  return new Response(
    JSON.stringify(data),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  )
})
```


**Never use `"*"` in production.** Wildcard CORS allows *any* website to call your API. In production, whitelist only your specific frontend domain. Use `"*"` only during local development.


## Environment Variables and Secrets

Never hardcode API keys or secrets in your function code. Use environment variables — Supabase automatically injects some, and you can add custom ones.


Variable
Auto-Injected?
Purpose


SUPABASE_URL
Yes
Your project's API endpoint


SUPABASE_ANON_KEY
Yes
Public key (respects RLS)


SUPABASE_SERVICE_ROLE_KEY
Yes
Secret key (bypasses RLS)


STRIPE_SECRET_KEY
No — add manually
Stripe API access


RESEND_API_KEY
No — add manually
Email delivery


**Adding custom secrets:** In the Supabase dashboard, go to Edge Functions → select your function → Secrets. Or use the CLI: `supabase secrets set STRIPE_SECRET_KEY=sk_live_...`


## Deploy and Test Workflow

The complete workflow from writing a function to testing it in production:


1. Write your function in `supabase/functions//index.ts`
2. Test locally: `supabase functions serve ` (runs on localhost:54321)
3. Deploy: `supabase functions deploy  --project-ref `
4. Test with curl: `curl https://.supabase.co/functions/v1/`
5. Check logs: Supabase dashboard → Edge Functions → Logs


### Quiz

**Q1: Why did Supabase choose Deno over Node.js for edge functions?**
    A. Deno supports more npm packages
  ✓ B. Deno has faster cold starts and better security defaults — it requires explicit permissions for file and network access
    C. Deno is older and more battle-tested
    D. Deno uses Python syntax
  *Deno starts up faster than Node.js (critical for edge functions that spin up on demand) and has better security defaults — it requires explicit permission for file, network, and environment access.*

**Q2: What is a cold start in the context of edge functions?**
    A. A function that returns an error
  ✓ B. The delay when a function first spins up after being idle — typically ~100ms
    C. A network timeout
    D. A failed deployment
  *Edge functions spin up on demand. When no requests have come in recently, the runtime needs to initialize. This first request takes ~100ms. Subsequent requests reuse the running instance and are near-instant.*

**Q3: Why should you never use Access-Control-Allow-Origin: * in production?**
    A. It causes performance issues
    B. It breaks Deno compatibility
  ✓ C. It allows ANY website to call your API — enabling cross-origin attacks and unauthorized use of your backend
    D. It is not valid syntax
  *Wildcard CORS allows any domain to make requests to your API. In production, whitelist only your specific frontend domains to prevent unauthorized sites from abusing your backend.*

**Q4: What does the OPTIONS request do in a CORS-enabled edge function?**
    A. It fetches data from the database
  ✓ B. It is a preflight check — the browser asks if the cross-origin request is allowed before sending the actual request
    C. It logs the request for debugging
    D. It authenticates the user
  *Before sending a cross-origin POST/PUT/DELETE, the browser sends an OPTIONS preflight request to check if the server allows it. Your function must respond to OPTIONS with the correct CORS headers — otherwise the browser blocks the actual request.*

**Q5: Which environment variables does Supabase automatically inject into edge functions?**
    A. Only SUPABASE_URL
  ✓ B. SUPABASE_URL, SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY
    C. All environment variables from Vercel
    D. None — you must set all variables manually
  *Supabase automatically injects three variables: SUPABASE_URL (project endpoint), SUPABASE_ANON_KEY (public), and SUPABASE_SERVICE_ROLE_KEY (secret). Custom secrets like STRIPE_SECRET_KEY must be added manually via the dashboard or CLI.*


### Edge Functions Flashcards

**Card 1:**
Front: What command deploys a Supabase edge function?
Back: supabase functions deploy  --project-ref . Run from your local terminal after writing the function in supabase/functions//index.ts.

**Card 2:**
Front: How do you access environment variables inside a Deno edge function?
Back: Deno.env.get("VARIABLE_NAME"). Supabase automatically injects SUPABASE_URL, SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY. Add custom secrets via the dashboard or supabase secrets set.

**Card 3:**
Front: What is the minimum response a valid edge function must return?
Back: new Response(body, { headers: {...} }). The body can be a string or JSON.stringify(object). Always include Content-Type: application/json header when returning JSON.

**Card 4:**
Front: What is CORS and why does it matter for edge functions?
Back: Cross-Origin Resource Sharing. Browsers block requests from one domain to another by default. Your edge function must include Access-Control-Allow-Origin headers (set to your specific domain) and handle OPTIONS preflight requests.

**Card 5:**
Front: How do you test edge functions locally before deploying?
Back: Run supabase functions serve  to start a local server on localhost:54321. Then test with curl or your frontend. Only deploy after local testing passes.

**Card 6:**
Front: What is Deno and how is it different from Node.js?
Back: Deno is a modern JS/TS runtime created by Node.js original creator. Key differences: native TypeScript (no build step), faster cold starts, explicit security permissions, URL-based imports instead of node_modules.


Lesson 4 of 10

Module 1
