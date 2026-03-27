---
title: "Edge Functions"
course: "ai-stack-builder"
order: 4
type: "lesson"
free: false
---<div class="container">
<div class="nav">
<a href="make-com-101.html">&larr; Prev</a>
<span class="current">Lesson 4 of 10</span>
<a href="webhooks-deep-dive.html">Next &rarr;</a>
</div>

<div class="lesson-badge">MODULE 2 &middot; 260 XP</div>
<h1>Edge Functions</h1>
<p class="intro">Edge functions are serverless code that runs close to your users. Write once, deploy globally, pay per invocation. Supabase edge functions use Deno (TypeScript runtime).</p>

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

<div class="editor-container">
<div class="editor-tabs">
<div class="editor-tab active" onclick="switchTab(0)">index.ts</div>
<div class="editor-tab" onclick="switchTab(1)">response</div>
</div>
<div class="editor-body">
<textarea id="codeEditor" spellcheck="false">import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  // Your code here: return a JSON response
  // Hint: use new Response() with JSON.stringify()

  return new Response(

  )
})</textarea>
</div>
<div class="editor-toolbar">
<span class="file-name">supabase/functions/hello/index.ts</span>
<button class="deploy-btn" onclick="deployCode()">&#x1f680; Deploy</button>
</div>
</div>

<p style="font-size:.75rem;color:#555;margin-top:.5rem;font-style:italic">Simulated terminal — in production, you'd see this output in your Supabase dashboard after running <code style="color:#666">supabase functions deploy</code> from your real terminal.</p>
<div class="terminal" id="terminal" style="display:none"></div>

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

<div class="editor-container">
<div class="editor-tabs">
<div class="editor-tab active">index.ts</div>
</div>
<div class="editor-body">
<textarea id="codeEditor2" spellcheck="false">import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  // Parse the JSON body
  const { name } = await req.json()

  // Return a personalized greeting
  return new Response(
    JSON.stringify({ greeting: `Hello, ${name}! Welcome to the edge.` }),
    { headers: { "Content-Type": "application/json" } }
  )
})</textarea>
</div>
<div class="editor-toolbar">
<span class="file-name">supabase/functions/greet/index.ts</span>
<button class="deploy-btn" onclick="deployCode2()">&#x1f680; Deploy</button>
</div>
</div>
<p style="font-size:.75rem;color:#555;margin-top:.5rem;font-style:italic">Simulated terminal — in production, you'd run this from your local terminal and see results in your Supabase dashboard.</p>
<div class="terminal" id="terminal2" style="display:none"></div>

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

<div class="editor-container">
<div class="editor-tabs">
<div class="editor-tab active">index.ts</div>
</div>
<div class="editor-body">
<textarea id="codeEditor3" spellcheck="false">import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
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
})</textarea>
</div>
<div class="editor-toolbar">
<span class="file-name">supabase/functions/read-brain/index.ts</span>
<button class="deploy-btn" onclick="deployCode3()">&#x1f680; Deploy</button>
</div>
</div>
<p style="font-size:.75rem;color:#555;margin-top:.5rem;font-style:italic">Simulated terminal — in production, you'd run this from your local terminal and see results in your Supabase dashboard.</p>
<div class="terminal" id="terminal3" style="display:none"></div>

<div class="panel">
<div class="label">Key Concepts</div>
<p><strong>Cold starts:</strong> Edge functions spin up on demand. First request may take ~100ms, subsequent requests are near-instant. Deno is faster than Node.js for cold starts.</p>
<p><strong>Environment variables:</strong> Never hardcode secrets. Use <code style="color:#f59e0b">Deno.env.get()</code> — Supabase automatically injects SUPABASE_URL and keys.</p>
<p><strong>CORS:</strong> Always set CORS headers if your frontend calls the function directly. Common gotcha for beginners.</p>
<div class="code-block"><span class="kw">const</span> corsHeaders = {<br>  <span class="str">"Access-Control-Allow-Origin"</span>: <span class="str">"*"</span>,<br>  <span class="str">"Access-Control-Allow-Headers"</span>: <span class="str">"authorization, x-client-info, apikey, content-type"</span>,<br>}</div>
</div>

<div class="progress-section">
<div style="display:flex;justify-content:space-between;font-size:.85rem;color:#999">
<span>Lesson Progress</span><span id="lessonPct">0%</span>
</div>
<div class="progress-bar"><div class="progress-fill" id="lessonProgress" style="width:0%"></div></div>
</div>
<button class="complete-btn" id="completeBtn" onclick="completeLesson()">Complete Lesson & Earn 260 XP</button>
<div class="nav" style="border-top:1px solid #1e1e2e;border-bottom:none;margin-top:0;padding-top:1rem">
<a href="make-com-101.html">&larr; Make.com 101</a>
<a href="webhooks-deep-dive.html">Next: Webhooks Deep Dive &rarr;</a>
</div>
<div class="footer">Like One Academy &copy; 2026</div>
</div>

<script>
let challenges=[false,false,false];
function typeLine(termId,lines,cb){
const term=document.getElementById(termId);term.style.display='block';let i=0;
function next(){if(i>=lines.length){if(cb)cb();return}
const div=document.createElement('div');div.className='term-line';div.innerHTML=lines[i];term.appendChild(div);term.scrollTop=term.scrollHeight;i++;setTimeout(next,400)}
term.innerHTML='';next()}

function deployCode(){
const code=document.getElementById('codeEditor').value;
const hasResponse=code.includes('JSON.stringify')&&code.includes('message');
const hasHeaders=code.includes('Content-Type');
if(hasResponse){
typeLine('terminal',[
'<span class="term-prompt">$</span> supabase functions deploy hello',
'<span class="term-dim">Bundling function...</span>',
'<span class="term-dim">Deploying to edge network...</span>',
'<span class="term-success">&#x2713; Function deployed successfully!</span>',
'<span class="term-info">URL: https://vpaynwebgmmnwttqkwmh.supabase.co/functions/v1/hello</span>',
'',
'<span class="term-prompt">$</span> curl -s https://...functions/v1/hello',
'<span class="term-success">{"message":"Hello from the edge!"}</span>'
],()=>{challenges[0]=true;document.getElementById('ch1').classList.add('completed');updateProg()});
}else{
typeLine('terminal',[
'<span class="term-prompt">$</span> supabase functions deploy hello',
'<span class="term-dim">Bundling function...</span>',
'<span class="term-error">&#x2717; Error: Response body is empty</span>',
'<span class="term-dim">Hint: Use JSON.stringify({message: "Hello from the edge!"}) as the Response body</span>',
'<span class="term-dim">Don\'t forget Content-Type header!</span>'
])}
}

function deployCode2(){
typeLine('terminal2',[
'<span class="term-prompt">$</span> supabase functions deploy greet',
'<span class="term-dim">Bundling function...</span>',
'<span class="term-dim">Deploying to edge network...</span>',
'<span class="term-success">&#x2713; Function deployed!</span>',
'',
'<span class="term-prompt">$</span> curl -X POST -d \'{"name":"Builder"}\' https://...functions/v1/greet',
'<span class="term-success">{"greeting":"Hello, Builder! Welcome to the edge."}</span>'
],()=>{challenges[1]=true;document.getElementById('ch2').classList.add('completed');updateProg()});
}

function deployCode3(){
typeLine('terminal3',[
'<span class="term-prompt">$</span> supabase functions deploy read-brain',
'<span class="term-dim">Bundling function...</span>',
'<span class="term-dim">Deploying to edge network...</span>',
'<span class="term-success">&#x2713; Function deployed!</span>',
'',
'<span class="term-prompt">$</span> curl -H "Authorization: Bearer $ANON_KEY" https://...functions/v1/read-brain',
'<span class="term-success">{"brain":[</span>',
'<span class="term-success">  {"key":"identity.name","value":"\\"Stack Builder Student\\""},</span>',
'<span class="term-success">  {"key":"session.active_work","value":"\\"building edge functions\\""},</span>',
'<span class="term-success">  {"key":"system.version","value":"\\"1.0.0\\""}</span>',
'<span class="term-success">]}</span>'
],()=>{challenges[2]=true;document.getElementById('ch3').classList.add('completed');updateProg()});
}

function switchTab(idx){/* placeholder for multi-tab */}
function updateProg(){const done=challenges.filter(Boolean).length;const pct=Math.round(done/3*100);document.getElementById('lessonProgress').style.width=pct+'%';document.getElementById('lessonPct').textContent=pct+'%'}
function completeLesson(){localStorage.setItem('aisb_lesson_4','complete');const btn=document.getElementById('completeBtn');btn.textContent='\u2713 Lesson Complete — 260 XP Earned!';btn.classList.add('done');document.getElementById('lessonProgress').style.width='100%';document.getElementById('lessonPct').textContent='100%'}
if(localStorage.getItem('aisb_lesson_4')==='complete'){document.getElementById('completeBtn').textContent='\u2713 Complete';document.getElementById('completeBtn').classList.add('done')}
</script>
