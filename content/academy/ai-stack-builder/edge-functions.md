---
title: "Edge Functions"
course: "ai-stack-builder"
order: 4
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-stack-builder/">AI Stack Builder</a>
  <span class="lesson-badge">Lesson 4 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Edge <span class="accent">Functions</span></h1>
  <p class="sub">Edge functions are serverless code that runs close to your users. Write once, deploy globally, pay per invocation. No servers to manage, no infrastructure to maintain. This is your backend.</p>
</div>

<div class="content">

<div class="card">
<h2>What Are Edge Functions?</h2>
<p>Think of edge functions as <strong style="color:#e5e5e5">mini-programs that live on the internet</strong>. Instead of running on your laptop or a single server, they run on servers spread around the world, close to wherever your users are. When someone visits your app from Tokyo, the edge function runs in Tokyo. From London? It runs in London. This makes everything faster.</p>

<p>You do not manage servers, install software, or worry about scaling. You write a small function, deploy it with one command, and it is available to the whole world instantly. You only pay when someone actually uses it.</p>

<div style="display:flex;gap:1rem;flex-wrap:wrap;margin-top:1.25rem">
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(52,211,153,.06);border-radius:10px;border:1px solid rgba(52,211,153,.12);flex:1;min-width:160px">
<div style="font-size:1.25rem">&#x1f310;</div>
<div><div style="font-size:.8rem;font-weight:700;color:#34d399;margin-bottom:.2rem">Global</div><div style="font-size:.78rem;color:#71717a;line-height:1.5">Runs close to users — Tokyo users get Tokyo servers automatically</div></div>
</div>
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(139,92,246,.06);border-radius:10px;border:1px solid rgba(139,92,246,.12);flex:1;min-width:160px">
<div style="font-size:1.25rem">&#x26a1;</div>
<div><div style="font-size:.8rem;font-weight:700;color:#8b5cf6;margin-bottom:.2rem">Deno Runtime</div><div style="font-size:.78rem;color:#71717a;line-height:1.5">Modern TypeScript runtime — faster cold starts, better security than Node.js</div></div>
</div>
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(251,146,60,.06);border-radius:10px;border:1px solid rgba(251,146,60,.12);flex:1;min-width:160px">
<div style="font-size:1.25rem">&#x1f4b0;</div>
<div><div style="font-size:.8rem;font-weight:700;color:#fb923c;margin-bottom:.2rem">Pay Per Use</div><div style="font-size:.78rem;color:#71717a;line-height:1.5">500K invocations free on Pro plan — most projects never exceed this</div></div>
</div>
</div>
</div>

<div class="card">
<h2>Deno vs. Node.js: Why Supabase Chose Deno</h2>
<p><strong style="color:#e5e5e5">Deno</strong> is a modern JavaScript/TypeScript runtime — the engine that runs your code on the server. If you have heard of Node.js, Deno is its newer, more secure sibling. Supabase chose Deno for three reasons:</p>

<div style="display:grid;gap:.75rem;margin-top:1rem">
<div style="display:flex;gap:1rem;align-items:flex-start;padding:1rem 1.25rem;background:rgba(52,211,153,.04);border-radius:10px;border:1px solid rgba(52,211,153,.08)">
<div style="min-width:2.5rem;height:2.5rem;border-radius:50%;background:rgba(52,211,153,.12);display:flex;align-items:center;justify-content:center;font-weight:700;color:#34d399;font-size:.8rem">1</div>
<div>
<strong style="color:#34d399;font-size:.88rem">Faster Cold Starts</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0;line-height:1.7">Edge functions spin up on demand. The first request after being idle is a "cold start" (~100ms). Deno initializes faster than Node.js, keeping that delay minimal.</p>
</div>
</div>
<div style="display:flex;gap:1rem;align-items:flex-start;padding:1rem 1.25rem;background:rgba(139,92,246,.04);border-radius:10px;border:1px solid rgba(139,92,246,.08)">
<div style="min-width:2.5rem;height:2.5rem;border-radius:50%;background:rgba(139,92,246,.12);display:flex;align-items:center;justify-content:center;font-weight:700;color:#8b5cf6;font-size:.8rem">2</div>
<div>
<strong style="color:#8b5cf6;font-size:.88rem">Better Security Defaults</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0;line-height:1.7">Deno requires explicit permission for file, network, and environment access. A malicious package cannot silently read your filesystem or make network calls without your code granting permission.</p>
</div>
</div>
<div style="display:flex;gap:1rem;align-items:flex-start;padding:1rem 1.25rem;background:rgba(251,146,60,.04);border-radius:10px;border:1px solid rgba(251,146,60,.08)">
<div style="min-width:2.5rem;height:2.5rem;border-radius:50%;background:rgba(251,146,60,.12);display:flex;align-items:center;justify-content:center;font-weight:700;color:#fb923c;font-size:.8rem">3</div>
<div>
<strong style="color:#fb923c;font-size:.88rem">Native TypeScript</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0;line-height:1.7">Deno runs TypeScript natively — no build step, no tsconfig, no compilation. Write <code style="color:#f59e0b">.ts</code> files and deploy. The same JavaScript/TypeScript you already know works in Deno.</p>
</div>
</div>
</div>
</div>

<div class="card">
<h2>Challenge 1: Hello World</h2>
<p>Every API you have ever used — weather apps, payment systems, social media feeds — works by sending and receiving JSON responses. This first challenge teaches you the most fundamental skill in backend development: <strong style="color:#e5e5e5">making a function that responds when someone calls it</strong>.</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">TypeScript — supabase/functions/hello/index.ts</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a">// The simplest possible edge function</span>
<span style="color:#71717a">// Deno.serve is the modern way to create an HTTP server in Deno</span>
Deno.<span style="color:#34d399">serve</span>(<span style="color:#c084fc">async</span> (req) => {
  <span style="color:#c084fc">return new</span> <span style="color:#34d399">Response</span>(
    JSON.<span style="color:#34d399">stringify</span>({ message: <span style="color:#fb923c">"Hello from the edge!"</span> }),
    { headers: { <span style="color:#fb923c">"Content-Type"</span>: <span style="color:#fb923c">"application/json"</span> } }
  )
})</code></pre>
</div>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Terminal — Deploy and test</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a"># Deploy to Supabase</span>
<span style="color:#c084fc">supabase</span> functions deploy hello --project-ref &lt;your-ref&gt;

<span style="color:#71717a"># Test it</span>
<span style="color:#c084fc">curl</span> https://&lt;your-ref&gt;.supabase.co/functions/v1/hello
<span style="color:#71717a"># → {"message":"Hello from the edge!"}</span></code></pre>
</div>
</div>

<div class="card">
<h2>Challenge 2: JSON API (Read User Input)</h2>
<p>Challenge 1 always returned the same thing. Real APIs need to <strong style="color:#e5e5e5">read what the user sends</strong> and respond differently. This is how login forms, search bars, and checkout buttons work — your frontend sends data, and your edge function processes it.</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">TypeScript — supabase/functions/greet/index.ts</div>
<pre style="margin:0;color:#e5e5e5"><code>Deno.<span style="color:#34d399">serve</span>(<span style="color:#c084fc">async</span> (req) => {
  <span style="color:#71717a">// Parse the JSON body from the incoming request</span>
  <span style="color:#c084fc">const</span> { name } = <span style="color:#c084fc">await</span> req.<span style="color:#34d399">json</span>()

  <span style="color:#71717a">// Return a personalized greeting</span>
  <span style="color:#c084fc">return new</span> <span style="color:#34d399">Response</span>(
    JSON.<span style="color:#34d399">stringify</span>({
      greeting: <span style="color:#fb923c">`Hello, ${name}! Welcome to the edge.`</span>
    }),
    { headers: { <span style="color:#fb923c">"Content-Type"</span>: <span style="color:#fb923c">"application/json"</span> } }
  )
})</code></pre>
</div>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Terminal — Test with curl</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">curl</span> -X POST https://&lt;ref&gt;.supabase.co/functions/v1/greet \
  -H <span style="color:#fb923c">"Content-Type: application/json"</span> \
  -d <span style="color:#fb923c">'{"name": "Alex"}'</span>
<span style="color:#71717a"># → {"greeting":"Hello, Alex! Welcome to the edge."}</span></code></pre>
</div>
</div>

<div class="card">
<h2>Challenge 3: Database Query (The Real Power)</h2>
<p>This is where it gets powerful. Your edge function can talk to your database — reading user data, checking subscriptions, pulling content. This is exactly how real products work: <strong style="color:#e5e5e5">user clicks button &rarr; frontend calls edge function &rarr; edge function queries database &rarr; data flows back</strong>.</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">TypeScript — supabase/functions/read-brain/index.ts</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> { createClient } <span style="color:#c084fc">from</span> <span style="color:#fb923c">"https://esm.sh/@supabase/supabase-js@2"</span>

Deno.<span style="color:#34d399">serve</span>(<span style="color:#c084fc">async</span> (req) => {
  <span style="color:#71717a">// Connect to Supabase with the service role key</span>
  <span style="color:#71717a">// (server-side only — bypasses RLS for full access)</span>
  <span style="color:#c084fc">const</span> supabase = <span style="color:#34d399">createClient</span>(
    Deno.env.<span style="color:#34d399">get</span>(<span style="color:#fb923c">"SUPABASE_URL"</span>)!,
    Deno.env.<span style="color:#34d399">get</span>(<span style="color:#fb923c">"SUPABASE_SERVICE_ROLE_KEY"</span>)!
  )

  <span style="color:#71717a">// Query the brain_context table</span>
  <span style="color:#c084fc">const</span> { data, error } = <span style="color:#c084fc">await</span> supabase
    .<span style="color:#34d399">from</span>(<span style="color:#fb923c">"brain_context"</span>)
    .<span style="color:#34d399">select</span>(<span style="color:#fb923c">"key, value"</span>)
    .<span style="color:#34d399">order</span>(<span style="color:#fb923c">"updated_at"</span>, { ascending: <span style="color:#fb923c">false</span> })
    .<span style="color:#34d399">limit</span>(<span style="color:#fb923c">10</span>)

  <span style="color:#c084fc">if</span> (error) {
    <span style="color:#c084fc">return new</span> <span style="color:#34d399">Response</span>(
      JSON.<span style="color:#34d399">stringify</span>({ error: error.message }),
      { status: <span style="color:#fb923c">400</span>, headers: { <span style="color:#fb923c">"Content-Type"</span>: <span style="color:#fb923c">"application/json"</span> } }
    )
  }

  <span style="color:#c084fc">return new</span> <span style="color:#34d399">Response</span>(
    JSON.<span style="color:#34d399">stringify</span>({ brain: data }),
    { headers: { <span style="color:#fb923c">"Content-Type"</span>: <span style="color:#fb923c">"application/json"</span> } }
  )
})</code></pre>
</div>
</div>

<div class="card">
<h2>CORS: Letting Your Frontend Call Your Functions</h2>
<p>Browsers block requests from one domain to another by default — this is called CORS (Cross-Origin Resource Sharing). If your frontend is on <code style="color:#f59e0b">likeone.ai</code> and your edge function is on <code style="color:#f59e0b">supabase.co</code>, the browser will block the call unless you explicitly allow it.</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">TypeScript — CORS-enabled edge function</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">const</span> corsHeaders = {
  <span style="color:#fb923c">"Access-Control-Allow-Origin"</span>: <span style="color:#fb923c">"https://yourdomain.com"</span>,
  <span style="color:#fb923c">"Access-Control-Allow-Headers"</span>:
    <span style="color:#fb923c">"authorization, x-client-info, apikey, content-type"</span>,
}

Deno.<span style="color:#34d399">serve</span>(<span style="color:#c084fc">async</span> (req) => {
  <span style="color:#71717a">// Handle preflight OPTIONS request (browser sends this first)</span>
  <span style="color:#c084fc">if</span> (req.method === <span style="color:#fb923c">"OPTIONS"</span>) {
    <span style="color:#c084fc">return new</span> <span style="color:#34d399">Response</span>(<span style="color:#fb923c">"ok"</span>, { headers: corsHeaders })
  }

  <span style="color:#71717a">// Your actual function logic here...</span>
  <span style="color:#c084fc">const</span> data = { message: <span style="color:#fb923c">"Hello!"</span> }

  <span style="color:#71717a">// Include CORS headers in EVERY response</span>
  <span style="color:#c084fc">return new</span> <span style="color:#34d399">Response</span>(
    JSON.<span style="color:#34d399">stringify</span>(data),
    { headers: { ...corsHeaders, <span style="color:#fb923c">"Content-Type"</span>: <span style="color:#fb923c">"application/json"</span> } }
  )
})</code></pre>
</div>

<div style="background:rgba(239,68,68,.06);border:1px solid rgba(239,68,68,.12);border-radius:12px;padding:1rem;margin-top:.75rem;font-size:.82rem;color:#a1a1aa;line-height:1.7">
<strong style="color:#ef4444">Never use <code style="color:#ef4444">"*"</code> in production.</strong> Wildcard CORS allows <em>any</em> website to call your API. In production, whitelist only your specific frontend domain. Use <code style="color:#ef4444">"*"</code> only during local development.
</div>
</div>

<div class="card">
<h2>Environment Variables and Secrets</h2>
<p>Never hardcode API keys or secrets in your function code. Use environment variables — Supabase automatically injects some, and you can add custom ones.</p>

<div style="overflow-x:auto;margin-top:1rem">
<table style="width:100%;border-collapse:collapse;font-size:.82rem">
<thead>
<tr style="border-bottom:1px solid rgba(255,255,255,.1)">
<th style="text-align:left;padding:.75rem;color:#e5e5e5;font-weight:600">Variable</th>
<th style="text-align:left;padding:.75rem;color:#e5e5e5;font-weight:600">Auto-Injected?</th>
<th style="text-align:left;padding:.75rem;color:#e5e5e5;font-weight:600">Purpose</th>
</tr>
</thead>
<tbody style="color:#a1a1aa">
<tr style="border-bottom:1px solid rgba(255,255,255,.05)">
<td style="padding:.75rem;font-weight:600;color:#34d399">SUPABASE_URL</td>
<td style="padding:.75rem">Yes</td>
<td style="padding:.75rem">Your project's API endpoint</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,.05)">
<td style="padding:.75rem;font-weight:600;color:#34d399">SUPABASE_ANON_KEY</td>
<td style="padding:.75rem">Yes</td>
<td style="padding:.75rem">Public key (respects RLS)</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,.05)">
<td style="padding:.75rem;font-weight:600;color:#34d399">SUPABASE_SERVICE_ROLE_KEY</td>
<td style="padding:.75rem">Yes</td>
<td style="padding:.75rem">Secret key (bypasses RLS)</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,.05)">
<td style="padding:.75rem;font-weight:600;color:#fb923c">STRIPE_SECRET_KEY</td>
<td style="padding:.75rem">No — add manually</td>
<td style="padding:.75rem">Stripe API access</td>
</tr>
<tr>
<td style="padding:.75rem;font-weight:600;color:#fb923c">RESEND_API_KEY</td>
<td style="padding:.75rem">No — add manually</td>
<td style="padding:.75rem">Email delivery</td>
</tr>
</tbody>
</table>
</div>

<div style="background:rgba(139,92,246,.06);border:1px solid rgba(139,92,246,.12);border-radius:12px;padding:1rem;margin-top:.75rem;font-size:.82rem;color:#a1a1aa;line-height:1.7">
<strong style="color:#e5e5e5">Adding custom secrets:</strong> In the Supabase dashboard, go to Edge Functions &rarr; select your function &rarr; Secrets. Or use the CLI: <code style="color:#f59e0b">supabase secrets set STRIPE_SECRET_KEY=sk_live_...</code>
</div>
</div>

<div class="card">
<h2>Deploy and Test Workflow</h2>
<p>The complete workflow from writing a function to testing it in production:</p>

<div style="display:grid;gap:.3rem;margin-top:1rem;font-size:.85rem;color:#a1a1aa;line-height:2">
<div style="padding:.5rem .75rem;background:rgba(52,211,153,.04);border-radius:6px"><span style="color:#34d399;font-weight:700">1.</span> Write your function in <code style="color:#f59e0b">supabase/functions/&lt;name&gt;/index.ts</code></div>
<div style="padding:.5rem .75rem;background:rgba(139,92,246,.04);border-radius:6px"><span style="color:#8b5cf6;font-weight:700">2.</span> Test locally: <code style="color:#f59e0b">supabase functions serve &lt;name&gt;</code> (runs on localhost:54321)</div>
<div style="padding:.5rem .75rem;background:rgba(251,146,60,.04);border-radius:6px"><span style="color:#fb923c;font-weight:700">3.</span> Deploy: <code style="color:#f59e0b">supabase functions deploy &lt;name&gt; --project-ref &lt;ref&gt;</code></div>
<div style="padding:.5rem .75rem;background:rgba(244,114,182,.04);border-radius:6px"><span style="color:#f472b6;font-weight:700">4.</span> Test with curl: <code style="color:#f59e0b">curl https://&lt;ref&gt;.supabase.co/functions/v1/&lt;name&gt;</code></div>
<div style="padding:.5rem .75rem;background:rgba(56,189,248,.04);border-radius:6px"><span style="color:#38bdf8;font-weight:700">5.</span> Check logs: Supabase dashboard &rarr; Edge Functions &rarr; Logs</div>
</div>
</div>

<div style="margin:1.5rem 0">
<div data-learn="QuizMC" data-props='{"title":"Edge Functions — Mastery Check","questions":[{"q":"Why did Supabase choose Deno over Node.js for edge functions?","options":["Deno supports more npm packages","Deno has faster cold starts and better security defaults — it requires explicit permissions for file and network access","Deno is older and more battle-tested","Deno uses Python syntax"],"correct":1,"explanation":"Deno starts up faster than Node.js (critical for edge functions that spin up on demand) and has better security defaults — it requires explicit permission for file, network, and environment access."},{"q":"What is a cold start in the context of edge functions?","options":["A function that returns an error","The delay when a function first spins up after being idle — typically ~100ms","A network timeout","A failed deployment"],"correct":1,"explanation":"Edge functions spin up on demand. When no requests have come in recently, the runtime needs to initialize. This first request takes ~100ms. Subsequent requests reuse the running instance and are near-instant."},{"q":"Why should you never use Access-Control-Allow-Origin: * in production?","options":["It causes performance issues","It breaks Deno compatibility","It allows ANY website to call your API — enabling cross-origin attacks and unauthorized use of your backend","It is not valid syntax"],"correct":2,"explanation":"Wildcard CORS allows any domain to make requests to your API. In production, whitelist only your specific frontend domains to prevent unauthorized sites from abusing your backend."},{"q":"What does the OPTIONS request do in a CORS-enabled edge function?","options":["It fetches data from the database","It is a preflight check — the browser asks if the cross-origin request is allowed before sending the actual request","It logs the request for debugging","It authenticates the user"],"correct":1,"explanation":"Before sending a cross-origin POST/PUT/DELETE, the browser sends an OPTIONS preflight request to check if the server allows it. Your function must respond to OPTIONS with the correct CORS headers — otherwise the browser blocks the actual request."},{"q":"Which environment variables does Supabase automatically inject into edge functions?","options":["Only SUPABASE_URL","SUPABASE_URL, SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY","All environment variables from Vercel","None — you must set all variables manually"],"correct":1,"explanation":"Supabase automatically injects three variables: SUPABASE_URL (project endpoint), SUPABASE_ANON_KEY (public), and SUPABASE_SERVICE_ROLE_KEY (secret). Custom secrets like STRIPE_SECRET_KEY must be added manually via the dashboard or CLI."}]}'></div>
</div>

<div data-learn="FlashDeck" data-props='{"title":"Edge Functions Flashcards","cards":[{"front":"What command deploys a Supabase edge function?","back":"supabase functions deploy <function-name> --project-ref <your-project-ref>. Run from your local terminal after writing the function in supabase/functions/<name>/index.ts."},{"front":"How do you access environment variables inside a Deno edge function?","back":"Deno.env.get(\"VARIABLE_NAME\"). Supabase automatically injects SUPABASE_URL, SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY. Add custom secrets via the dashboard or supabase secrets set."},{"front":"What is the minimum response a valid edge function must return?","back":"new Response(body, { headers: {...} }). The body can be a string or JSON.stringify(object). Always include Content-Type: application/json header when returning JSON."},{"front":"What is CORS and why does it matter for edge functions?","back":"Cross-Origin Resource Sharing. Browsers block requests from one domain to another by default. Your edge function must include Access-Control-Allow-Origin headers (set to your specific domain) and handle OPTIONS preflight requests."},{"front":"How do you test edge functions locally before deploying?","back":"Run supabase functions serve <name> to start a local server on localhost:54321. Then test with curl or your frontend. Only deploy after local testing passes."},{"front":"What is Deno and how is it different from Node.js?","back":"Deno is a modern JS/TS runtime created by Node.js original creator. Key differences: native TypeScript (no build step), faster cold starts, explicit security permissions, URL-based imports instead of node_modules."}]}'></div>

</div>

<div class="progress-footer">
<span class="progress-label">Lesson 4 of 10</span>
<div class="progress-bar-wrap"></div>
<span class="progress-label">Module 1</span>
</div>
</div>
