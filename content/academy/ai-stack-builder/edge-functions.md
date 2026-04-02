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
  <h1>Edge Functions</h1>
  <p class="sub">Edge functions are serverless code that runs close to your users. Write once, deploy globally, pay per invocation. Supabase edge functions use Deno (TypeScript runtime).</p>
</div>

<div class="panel">
<div class="label">What you're building in this lesson</div>
<p>By the end of this lesson, you'll have written three edge functions from scratch: a simple "Hello World" response, a JSON API that reads user input, and a database-connected function that queries real data. These are the same building blocks behind every modern web API.</p>
</div>

<div class="panel">
<div class="label">What are edge functions?</div>
<p>Think of edge functions as <strong>mini-programs that live on the internet</strong>. Instead of running on your laptop, they run on servers spread around the world, close to wherever your users are. When someone visits your app from Tokyo, the edge function runs in Tokyo. From London? It runs in London. This makes everything faster.</p>
<p>You don't need to manage servers, install software, or worry about scaling. You just write a small function, deploy it, and it's available to the whole world instantly. You only pay when someone actually uses it.</p>
</div>

<div class="panel">
<div class="label">What is Deno?</div>
<p><strong>Deno is a modern JavaScript runtime</strong> — think of it as the engine that runs your code on the server. If you've heard of Node.js, Deno is its newer, more secure sibling. Supabase chose Deno because it starts up faster (important for edge functions) and has better security defaults. You write the same JavaScript/TypeScript you already know — Deno just runs it.</p>
</div>

<h2>Challenge 1: Hello World</h2>
<div class="panel" style="border-color:#f59e0b33">
<div class="label">Why this matters</div>
<p>Every API you've ever used — weather apps, payment systems, social media feeds — works by sending and receiving JSON responses. This first challenge teaches you the most fundamental skill in backend development: making a function that responds when someone calls it. Once you can do this, you can build anything.</p>
</div>
<div class="challenge" id="ch1">
<div class="challenge-header">
<div class="challenge-num">1</div>
<div class="challenge-title">Return a JSON response</div>
</div>
<p style="font-size:.9rem;color:#999">Write an edge function that returns <code style="color:#f59e0b">{"message": "Hello from the edge!"}</code></p>
<p style="font-size:.85rem;color:#666"><strong>Your task:</strong> Fill in the empty <code style="color:#f59e0b">return new Response()</code> below. You need to put <code style="color:#f59e0b">JSON.stringify({message: "Hello from the edge!"})</code> inside the Response, and add a Content-Type header. Try writing it yourself before looking at Challenge 2 for the pattern.</p>
</div>

<div class="panel">
<div class="label">supabase/functions/hello/index.ts</div>
<div class="code-block">
<span class="kw">import</span> { serve } <span class="kw">from</span> <span class="str">"https://deno.land/std@0.168.0/http/server.ts"</span><br><br>
<span class="fn">serve</span>(<span class="kw">async</span> (req) => {<br>
&nbsp;&nbsp;<span class="cm">// Your code here: return a JSON response</span><br>
&nbsp;&nbsp;<span class="cm">// Hint: use new Response() with JSON.stringify()</span><br><br>
&nbsp;&nbsp;<span class="kw">return new</span> <span class="fn">Response</span>(<br>
&nbsp;&nbsp;&nbsp;&nbsp;JSON.<span class="fn">stringify</span>({ message: <span class="str">"Hello from the edge!"</span> }),<br>
&nbsp;&nbsp;&nbsp;&nbsp;{ headers: { <span class="str">"Content-Type"</span>: <span class="str">"application/json"</span> } }<br>
&nbsp;&nbsp;)<br>
})
</div>
<p style="font-size:.85rem;color:#888">Deploy this with: <code style="color:#f59e0b">supabase functions deploy hello --project-ref &lt;your-ref&gt;</code></p>
</div>
<h2>Challenge 2: JSON API</h2>
<div class="panel" style="border-color:#f59e0b33">
<div class="label">Why this matters</div>
<p>Challenge 1 always returned the same thing. But real APIs need to <em>read</em> what the user sends and respond differently. This is how login forms, search bars, and checkout buttons work — your frontend sends data, and your edge function processes it and responds. This pattern is the backbone of every interactive web app.</p>
</div>
<div class="challenge" id="ch2">
<div class="challenge-header">
<div class="challenge-num">2</div>
<div class="challenge-title">Parse request body and respond</div>
</div>
<p style="font-size:.9rem;color:#999">Upgrade your function: read a JSON body with a <code style="color:#f59e0b">name</code> field and respond with a greeting.</p>
<p style="font-size:.85rem;color:#666"><strong>Study the code below</strong>, then try modifying it: change the greeting message, add a second field (like <code style="color:#f59e0b">age</code>), or return different responses based on the name. The code is provided as a reference — understanding <em>why</em> each line exists is the real skill.</p>
</div>

<div class="panel">
<div class="label">supabase/functions/greet/index.ts</div>
<div class="code-block">
<span class="kw">import</span> { serve } <span class="kw">from</span> <span class="str">"https://deno.land/std@0.168.0/http/server.ts"</span><br><br>
<span class="fn">serve</span>(<span class="kw">async</span> (req) => {<br>
&nbsp;&nbsp;<span class="cm">// Parse the JSON body</span><br>
&nbsp;&nbsp;<span class="kw">const</span> { name } = <span class="kw">await</span> req.<span class="fn">json</span>()<br><br>
&nbsp;&nbsp;<span class="cm">// Return a personalized greeting</span><br>
&nbsp;&nbsp;<span class="kw">return new</span> <span class="fn">Response</span>(<br>
&nbsp;&nbsp;&nbsp;&nbsp;JSON.<span class="fn">stringify</span>({ greeting: <span class="str">`Hello, ${name}! Welcome to the edge.`</span> }),<br>
&nbsp;&nbsp;&nbsp;&nbsp;{ headers: { <span class="str">"Content-Type"</span>: <span class="str">"application/json"</span> } }<br>
&nbsp;&nbsp;)<br>
})
</div>
<p style="font-size:.85rem;color:#888">Try modifying this: change the greeting message, add a second field (like <code style="color:#f59e0b">age</code>), or return different responses based on the name.</p>
</div>
<h2>Challenge 3: Database Query</h2>
<div class="panel" style="border-color:#f59e0b33">
<div class="label">Why this matters</div>
<p>This is where it gets powerful. Your edge function can now talk to your database — reading user data, checking subscriptions, pulling content. This is exactly how real products work: a user clicks a button, the frontend calls an edge function, and the edge function fetches the right data from your database. After this challenge, you'll understand the full request cycle from user click to database response.</p>
</div>
<div class="challenge" id="ch3">
<div class="challenge-header">
<div class="challenge-num">3</div>
<div class="challenge-title">Read from Supabase inside an edge function</div>
</div>
<p style="font-size:.9rem;color:#999">Connect to your Supabase database from an edge function using the service role key.</p>
<p style="font-size:.85rem;color:#666"><strong>Study the code below</strong>, then try modifying it: change the table name, adjust the query limit, or add a filter with <code style="color:#f59e0b">.eq("key", "some_value")</code>. The reference code shows the pattern — your job is to understand each piece and experiment with variations.</p>
</div>

<div class="panel">
<div class="label">supabase/functions/read-brain/index.ts</div>
<div class="code-block">
<span class="kw">import</span> { serve } <span class="kw">from</span> <span class="str">"https://deno.land/std@0.168.0/http/server.ts"</span><br>
<span class="kw">import</span> { createClient } <span class="kw">from</span> <span class="str">"https://esm.sh/@supabase/supabase-js@2"</span><br><br>
<span class="fn">serve</span>(<span class="kw">async</span> (req) => {<br>
&nbsp;&nbsp;<span class="kw">const</span> supabase = <span class="fn">createClient</span>(<br>
&nbsp;&nbsp;&nbsp;&nbsp;Deno.env.<span class="fn">get</span>(<span class="str">"SUPABASE_URL"</span>)!,<br>
&nbsp;&nbsp;&nbsp;&nbsp;Deno.env.<span class="fn">get</span>(<span class="str">"SUPABASE_SERVICE_ROLE_KEY"</span>)!<br>
&nbsp;&nbsp;)<br><br>
&nbsp;&nbsp;<span class="cm">// Query the brain_context table</span><br>
&nbsp;&nbsp;<span class="kw">const</span> { data, error } = <span class="kw">await</span> supabase<br>
&nbsp;&nbsp;&nbsp;&nbsp;.<span class="fn">from</span>(<span class="str">"brain_context"</span>)<br>
&nbsp;&nbsp;&nbsp;&nbsp;.<span class="fn">select</span>(<span class="str">"key, value"</span>)<br>
&nbsp;&nbsp;&nbsp;&nbsp;.<span class="fn">order</span>(<span class="str">"updated_at"</span>, { ascending: <span class="kw">false</span> })<br>
&nbsp;&nbsp;&nbsp;&nbsp;.<span class="fn">limit</span>(<span class="num">10</span>)<br><br>
&nbsp;&nbsp;<span class="kw">if</span> (error) {<br>
&nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">return new</span> <span class="fn">Response</span>(<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;JSON.<span class="fn">stringify</span>({ error: error.message }),<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{ status: <span class="num">400</span>, headers: { <span class="str">"Content-Type"</span>: <span class="str">"application/json"</span> } }<br>
&nbsp;&nbsp;&nbsp;&nbsp;)<br>
&nbsp;&nbsp;}<br><br>
&nbsp;&nbsp;<span class="kw">return new</span> <span class="fn">Response</span>(<br>
&nbsp;&nbsp;&nbsp;&nbsp;JSON.<span class="fn">stringify</span>({ brain: data }),<br>
&nbsp;&nbsp;&nbsp;&nbsp;{ headers: { <span class="str">"Content-Type"</span>: <span class="str">"application/json"</span> } }<br>
&nbsp;&nbsp;)<br>
})
</div>
<p style="font-size:.85rem;color:#888">Try modifying this: change the table name, adjust the query limit, or add a filter with <code style="color:#f59e0b">.eq("key", "some_value")</code>.</p>
</div>
<div class="panel">
<div class="label">Key Concepts</div>
<p><strong>Cold starts:</strong> Edge functions spin up on demand. First request may take ~100ms, subsequent requests are near-instant. Deno is faster than Node.js for cold starts.</p>
<p><strong>Environment variables:</strong> Never hardcode secrets. Use <code style="color:#f59e0b">Deno.env.get()</code> — Supabase automatically injects SUPABASE_URL and keys.</p>
<p><strong>CORS:</strong> Always set CORS headers if your frontend calls the function directly. Common gotcha for beginners.</p>
<div class="code-block"><span class="kw">const</span> corsHeaders = {<br>  <span class="str">"Access-Control-Allow-Origin"</span>: <span class="str">"*"</span>,<br>  <span class="str">"Access-Control-Allow-Headers"</span>: <span class="str">"authorization, x-client-info, apikey, content-type"</span>,<br>}</div>
</div>



<div data-learn="QuizMC" data-props='{"title":"Edge Functions Quiz","questions":[{"q":"Why did Supabase choose Deno over Node.js for edge functions?","options":["Deno supports more npm packages","Deno has faster cold starts and better security defaults","Deno is older and more battle-tested","Deno uses Python syntax"],"correct":1,"explanation":"Deno starts up faster than Node.js (critical for edge functions that spin up on demand) and has better security defaults — it requires explicit permission for file, network, and environment access."},{"q":"What is a cold start in the context of edge functions?","options":["A function that returns an error","The delay when a function first spins up after being idle","A network timeout","A failed deployment"],"correct":1,"explanation":"Edge functions spin up on demand. When no requests have come in recently, the runtime needs to initialize — this first request takes ~100ms. Subsequent requests reuse the running instance and are near-instant."},{"q":"Why should you never use Access-Control-Allow-Origin: * in production?","options":["It causes performance issues","It breaks Deno compatibility","It allows any website to call your API, enabling cross-origin attacks","It is not valid syntax"],"correct":2,"explanation":"Wildcard CORS allows any domain to make requests to your API. In production, whitelist only your specific frontend domains to prevent unauthorized sites from abusing your backend."}]}'></div>

<div data-learn="FlashDeck" data-props='{"title":"Edge Functions Flashcards","cards":[{"front":"What command deploys a Supabase edge function?","back":"supabase functions deploy <function-name> --project-ref <your-project-ref>. Run from your local terminal after writing the function in supabase/functions/<name>/index.ts."},{"front":"How do you access environment variables inside a Deno edge function?","back":"Deno.env.get(\"VARIABLE_NAME\"). Supabase automatically injects SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY. Add custom secrets via the Supabase dashboard under Edge Functions > Secrets."},{"front":"What is the minimum response a valid edge function must return?","back":"new Response(body, { headers: {...} }). The body can be a string or JSON.stringify(object). Always include Content-Type: application/json header when returning JSON."}]}'></div>
</div>
