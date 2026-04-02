---
title: "Auth and Tokens"
course: "ai-stack-builder"
order: 6
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-stack-builder/">AI Stack Builder</a>
  <span class="lesson-badge">Lesson 6 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Auth & <span class="accent">Tokens</span></h1>
  <p class="sub">Authentication is how your app knows who is talking to it. JWTs (JSON Web Tokens) are the standard. Understanding them is the difference between a secure app and a data breach waiting to happen.</p>
</div>

<div class="content">

<div class="card">
<h2>Why Authentication Matters</h2>
<p>Without authentication, every request to your app is anonymous. Anyone can read anyone's data. Anyone can modify anyone's records. <strong style="color:#e5e5e5">Authentication proves identity</strong> — it answers "who is making this request?" before your app does anything.</p>

<p>Supabase handles the hard parts (password hashing, session management, email verification) so you never write security-critical code yourself. You get a battle-tested auth system with one import.</p>

<div style="display:flex;gap:1rem;flex-wrap:wrap;margin-top:1.25rem">
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(52,211,153,.06);border-radius:10px;border:1px solid rgba(52,211,153,.12);flex:1;min-width:160px">
<div style="font-size:1.25rem">&#x1f512;</div>
<div><div style="font-size:.8rem;font-weight:700;color:#34d399;margin-bottom:.2rem">JWT Standard</div><div style="font-size:.78rem;color:#71717a;line-height:1.5">Industry standard for stateless authentication — no server-side sessions needed</div></div>
</div>
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(139,92,246,.06);border-radius:10px;border:1px solid rgba(139,92,246,.12);flex:1;min-width:160px">
<div style="font-size:1.25rem">&#x1f6e1;&#xfe0f;</div>
<div><div style="font-size:.8rem;font-weight:700;color:#8b5cf6;margin-bottom:.2rem">RLS + JWT</div><div style="font-size:.78rem;color:#71717a;line-height:1.5">Database-level security using token claims — even buggy code cannot bypass it</div></div>
</div>
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(251,146,60,.06);border-radius:10px;border:1px solid rgba(251,146,60,.12);flex:1;min-width:160px">
<div style="font-size:1.25rem">&#x26a1;</div>
<div><div style="font-size:.8rem;font-weight:700;color:#fb923c;margin-bottom:.2rem">Zero Custom Code</div><div style="font-size:.78rem;color:#71717a;line-height:1.5">Supabase Auth handles signup, login, password reset, email verification</div></div>
</div>
</div>
</div>

<div class="card">
<h2>JWT Anatomy: Three Parts, One Token</h2>
<p>A JWT has three parts separated by dots. Each part is base64url-encoded. Together they form a self-contained credential that proves who the user is without hitting a database on every request.</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;overflow-x:auto">
<div style="font-family:'JetBrains Mono',monospace;font-size:.75rem;line-height:1.5;word-break:break-all">
<span style="color:#ef4444">eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9</span><span style="color:#71717a">.</span><span style="color:#8b5cf6">eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJidWlsZGVyQGV4YW1wbGUuY29tIiwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJpYXQiOjE3MTExNTIwMDAsImV4cCI6MTcxMTE1NTYwMH0</span><span style="color:#71717a">.</span><span style="color:#34d399">SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c</span>
</div>
</div>

<div style="display:grid;gap:.75rem;margin-top:1rem">
<div style="padding:1rem 1.25rem;background:rgba(239,68,68,.04);border-radius:10px;border:1px solid rgba(239,68,68,.08)">
<strong style="color:#ef4444;font-size:.88rem">Header (Red) — Algorithm + Type</strong>
<div style="background:#0a0a0a;border-radius:8px;padding:.75rem;margin-top:.5rem;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#e5e5e5;line-height:1.7">
{ <span style="color:#fb923c">"alg"</span>: <span style="color:#fb923c">"HS256"</span>, <span style="color:#71717a">// HMAC-SHA256 signing algorithm</span><br>
&nbsp;&nbsp;<span style="color:#fb923c">"typ"</span>: <span style="color:#fb923c">"JWT"</span> }  <span style="color:#71717a">// token type</span>
</div>
<p style="font-size:.82rem;color:#a1a1aa;margin:.5rem 0 0;line-height:1.7">Tells the server which algorithm was used to create the signature. HS256 (HMAC with SHA-256) is the most common for Supabase.</p>
</div>

<div style="padding:1rem 1.25rem;background:rgba(139,92,246,.04);border-radius:10px;border:1px solid rgba(139,92,246,.08)">
<strong style="color:#8b5cf6;font-size:.88rem">Payload (Purple) — Claims (Your Data)</strong>
<div style="background:#0a0a0a;border-radius:8px;padding:.75rem;margin-top:.5rem;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#e5e5e5;line-height:1.7">
{ <span style="color:#fb923c">"sub"</span>: <span style="color:#fb923c">"1234567890"</span>,          <span style="color:#71717a">// subject (user ID)</span><br>
&nbsp;&nbsp;<span style="color:#fb923c">"email"</span>: <span style="color:#fb923c">"builder@example.com"</span>, <span style="color:#71717a">// custom claim</span><br>
&nbsp;&nbsp;<span style="color:#fb923c">"role"</span>: <span style="color:#fb923c">"authenticated"</span>,       <span style="color:#71717a">// Supabase role</span><br>
&nbsp;&nbsp;<span style="color:#fb923c">"iat"</span>: <span style="color:#34d399">1711152000</span>,             <span style="color:#71717a">// issued at (Unix timestamp)</span><br>
&nbsp;&nbsp;<span style="color:#fb923c">"exp"</span>: <span style="color:#34d399">1711155600</span> }            <span style="color:#71717a">// expires in 1 hour</span>
</div>
<p style="font-size:.82rem;color:#a1a1aa;margin:.5rem 0 0;line-height:1.7">The actual data. <code style="color:#f59e0b">sub</code> is the user ID — Supabase's <code style="color:#f59e0b">auth.uid()</code> extracts this for RLS. <code style="color:#f59e0b">exp</code> is when the token expires (default: 1 hour). <strong style="color:#e5e5e5">The payload is NOT encrypted</strong> — anyone can decode it. It is only signed.</p>
</div>

<div style="padding:1rem 1.25rem;background:rgba(52,211,153,.04);border-radius:10px;border:1px solid rgba(52,211,153,.08)">
<strong style="color:#34d399;font-size:.88rem">Signature (Green) — Verification</strong>
<div style="background:#0a0a0a;border-radius:8px;padding:.75rem;margin-top:.5rem;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#e5e5e5;line-height:1.7">
<span style="color:#34d399">HMACSHA256</span>(<br>
&nbsp;&nbsp;<span style="color:#34d399">base64UrlEncode</span>(header) + <span style="color:#fb923c">"."</span> + <span style="color:#34d399">base64UrlEncode</span>(payload),<br>
&nbsp;&nbsp;secret <span style="color:#71717a">// your JWT secret (server-side only)</span><br>
)
</div>
<p style="font-size:.82rem;color:#a1a1aa;margin:.5rem 0 0;line-height:1.7">The server uses this to verify the token was not tampered with. If anyone changes the payload (e.g., swapping their user ID for another's), the signature will not match, and the server rejects the request.</p>
</div>
</div>

<div style="background:rgba(239,68,68,.06);border:1px solid rgba(239,68,68,.12);border-radius:12px;padding:1rem;margin-top:.75rem;font-size:.82rem;color:#a1a1aa;line-height:1.7">
<strong style="color:#ef4444">Key insight:</strong> JWTs are <strong style="color:#e5e5e5">signed, not encrypted</strong>. Anyone can decode the payload (it is just base64). The signature only prevents tampering — it proves the data has not been modified since the server issued it. <strong style="color:#e5e5e5">Never put secrets in JWT payloads.</strong>
</div>
</div>

<div class="card">
<h2>The Auth Flow: Signup to Database Query</h2>
<p>Here is exactly what happens from the moment a user signs up to the moment they read their own data — and how JWT + RLS work together at each step.</p>

<div style="display:grid;gap:.3rem;margin-top:1rem;font-size:.85rem;color:#a1a1aa;line-height:2">
<div style="padding:.5rem .75rem;background:rgba(52,211,153,.04);border-radius:6px"><span style="color:#34d399;font-weight:700">1.</span> <strong style="color:#e5e5e5">User signs up</strong> — email + password sent to Supabase Auth via <code style="color:#f59e0b">supabase.auth.signUp()</code></div>
<div style="padding:.5rem .75rem;background:rgba(139,92,246,.04);border-radius:6px"><span style="color:#8b5cf6;font-weight:700">2.</span> <strong style="color:#e5e5e5">Email verification</strong> — Supabase sends a magic link or OTP to confirm the address</div>
<div style="padding:.5rem .75rem;background:rgba(251,146,60,.04);border-radius:6px"><span style="color:#fb923c;font-weight:700">3.</span> <strong style="color:#e5e5e5">JWT issued</strong> — after verification, Supabase returns an access token (1hr) + refresh token (long-lived)</div>
<div style="padding:.5rem .75rem;background:rgba(244,114,182,.04);border-radius:6px"><span style="color:#f472b6;font-weight:700">4.</span> <strong style="color:#e5e5e5">Authenticated requests</strong> — the JWT travels in the <code style="color:#f59e0b">Authorization: Bearer</code> header with every API call</div>
<div style="padding:.5rem .75rem;background:rgba(56,189,248,.04);border-radius:6px"><span style="color:#38bdf8;font-weight:700">5.</span> <strong style="color:#e5e5e5">RLS enforced</strong> — Postgres extracts <code style="color:#f59e0b">auth.uid()</code> from the JWT and scopes all queries to that user's rows</div>
</div>
</div>

<div class="card">
<h2>Supabase Auth in Code</h2>
<p>The Supabase client handles token management automatically — storing tokens, refreshing expired ones, and attaching them to requests. You rarely need to touch JWTs directly.</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">JavaScript — Frontend auth with Supabase</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> { createClient } <span style="color:#c084fc">from</span> <span style="color:#fb923c">'@supabase/supabase-js'</span>

<span style="color:#c084fc">const</span> supabase = <span style="color:#34d399">createClient</span>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

<span style="color:#71717a">// Sign up a new user</span>
<span style="color:#c084fc">const</span> { data, error } = <span style="color:#c084fc">await</span> supabase.auth.<span style="color:#34d399">signUp</span>({
  email: <span style="color:#fb923c">'builder@example.com'</span>,
  password: <span style="color:#fb923c">'secure-password-123'</span>
})

<span style="color:#71717a">// Sign in an existing user</span>
<span style="color:#c084fc">const</span> { data, error } = <span style="color:#c084fc">await</span> supabase.auth.<span style="color:#34d399">signInWithPassword</span>({
  email: <span style="color:#fb923c">'builder@example.com'</span>,
  password: <span style="color:#fb923c">'secure-password-123'</span>
})

<span style="color:#71717a">// Get the current session (includes the JWT)</span>
<span style="color:#c084fc">const</span> { data: { session } } = <span style="color:#c084fc">await</span> supabase.auth.<span style="color:#34d399">getSession</span>()
console.<span style="color:#34d399">log</span>(session.access_token) <span style="color:#71717a">// This is the JWT!</span>

<span style="color:#71717a">// All subsequent queries automatically use the JWT</span>
<span style="color:#71717a">// RLS scopes results to this user's rows</span>
<span style="color:#c084fc">const</span> { data } = <span style="color:#c084fc">await</span> supabase
  .<span style="color:#34d399">from</span>(<span style="color:#fb923c">'user_data'</span>)
  .<span style="color:#34d399">select</span>(<span style="color:#fb923c">'*'</span>)  <span style="color:#71717a">// returns only this user's rows</span></code></pre>
</div>
</div>

<div class="card">
<h2>Protecting Edge Functions with JWT</h2>
<p>When your frontend calls an edge function, it sends the JWT in the Authorization header. The edge function verifies it before doing anything — this is the security gate for your backend.</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">TypeScript — Edge function with JWT verification</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> { createClient } <span style="color:#c084fc">from</span> <span style="color:#fb923c">"https://esm.sh/@supabase/supabase-js@2"</span>

Deno.<span style="color:#34d399">serve</span>(<span style="color:#c084fc">async</span> (req) => {
  <span style="color:#71717a">// 1. Extract the Bearer token</span>
  <span style="color:#c084fc">const</span> authHeader = req.headers.<span style="color:#34d399">get</span>(<span style="color:#fb923c">"Authorization"</span>)
  <span style="color:#c084fc">if</span> (!authHeader?.<span style="color:#34d399">startsWith</span>(<span style="color:#fb923c">"Bearer "</span>)) {
    <span style="color:#c084fc">return new</span> <span style="color:#34d399">Response</span>(<span style="color:#fb923c">"Missing token"</span>, { status: <span style="color:#fb923c">401</span> })
  }
  <span style="color:#c084fc">const</span> token = authHeader.<span style="color:#34d399">replace</span>(<span style="color:#fb923c">"Bearer "</span>, <span style="color:#fb923c">""</span>)

  <span style="color:#71717a">// 2. Create client with the user's token</span>
  <span style="color:#c084fc">const</span> supabase = <span style="color:#34d399">createClient</span>(
    Deno.env.<span style="color:#34d399">get</span>(<span style="color:#fb923c">"SUPABASE_URL"</span>)!,
    Deno.env.<span style="color:#34d399">get</span>(<span style="color:#fb923c">"SUPABASE_ANON_KEY"</span>)!,
    { global: { headers: { Authorization: <span style="color:#fb923c">`Bearer ${token}`</span> } } }
  )

  <span style="color:#71717a">// 3. Verify the token — this hits Supabase Auth</span>
  <span style="color:#c084fc">const</span> { data: { user }, error } = <span style="color:#c084fc">await</span> supabase.auth.<span style="color:#34d399">getUser</span>()
  <span style="color:#c084fc">if</span> (error || !user) {
    <span style="color:#c084fc">return new</span> <span style="color:#34d399">Response</span>(<span style="color:#fb923c">"Invalid token"</span>, { status: <span style="color:#fb923c">401</span> })
  }

  <span style="color:#71717a">// 4. Token valid — RLS scopes queries to this user</span>
  <span style="color:#c084fc">const</span> { data } = <span style="color:#c084fc">await</span> supabase
    .<span style="color:#34d399">from</span>(<span style="color:#fb923c">"user_data"</span>)
    .<span style="color:#34d399">select</span>(<span style="color:#fb923c">"*"</span>)  <span style="color:#71717a">// only this user's rows returned</span>

  <span style="color:#c084fc">return new</span> <span style="color:#34d399">Response</span>(JSON.<span style="color:#34d399">stringify</span>({ user: user.email, data }))
})</code></pre>
</div>
</div>

<div class="card">
<h2>RLS Policies: The Database Bouncer</h2>
<p>Row Level Security is what makes JWT + Supabase truly powerful. Instead of checking permissions in your application code (where bugs can bypass them), <strong style="color:#e5e5e5">the database itself enforces who can see what</strong>.</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">SQL — RLS policies that use JWT claims</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a">-- Enable RLS on a user-scoped table</span>
<span style="color:#c084fc">ALTER TABLE</span> user_data <span style="color:#c084fc">ENABLE ROW LEVEL SECURITY</span>;

<span style="color:#71717a">-- Users can only READ their own rows</span>
<span style="color:#71717a">-- auth.uid() extracts the 'sub' claim from the JWT automatically</span>
<span style="color:#c084fc">CREATE POLICY</span> <span style="color:#fb923c">"users read own data"</span> <span style="color:#c084fc">ON</span> user_data
  <span style="color:#c084fc">FOR SELECT TO</span> authenticated
  <span style="color:#c084fc">USING</span> ( <span style="color:#34d399">auth.uid</span>() = user_id );

<span style="color:#71717a">-- Users can only INSERT rows with their own user_id</span>
<span style="color:#c084fc">CREATE POLICY</span> <span style="color:#fb923c">"users insert own data"</span> <span style="color:#c084fc">ON</span> user_data
  <span style="color:#c084fc">FOR INSERT TO</span> authenticated
  <span style="color:#c084fc">WITH CHECK</span> ( <span style="color:#34d399">auth.uid</span>() = user_id );

<span style="color:#71717a">-- Users can only UPDATE their own rows</span>
<span style="color:#c084fc">CREATE POLICY</span> <span style="color:#fb923c">"users update own data"</span> <span style="color:#c084fc">ON</span> user_data
  <span style="color:#c084fc">FOR UPDATE TO</span> authenticated
  <span style="color:#c084fc">USING</span> ( <span style="color:#34d399">auth.uid</span>() = user_id )
  <span style="color:#c084fc">WITH CHECK</span> ( <span style="color:#34d399">auth.uid</span>() = user_id );</code></pre>
</div>

<div style="background:rgba(52,211,153,.06);border:1px solid rgba(52,211,153,.12);border-radius:12px;padding:1rem;margin-top:.75rem;font-size:.82rem;color:#a1a1aa;line-height:1.7">
<strong style="color:#e5e5e5">Why this is powerful:</strong> Even if your application code has a bug that forgets to filter by user_id, the database rejects unauthorized rows automatically. RLS is defense-in-depth — security at the lowest possible layer.
</div>
</div>

<div class="card">
<h2>Access Tokens vs. Refresh Tokens</h2>
<p>Supabase issues two tokens on login. Understanding the difference prevents the most common auth bugs.</p>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:1rem">
<div style="padding:1rem 1.25rem;background:rgba(251,146,60,.04);border-radius:10px;border:1px solid rgba(251,146,60,.08)">
<strong style="color:#fb923c;font-size:.88rem">Access Token (JWT)</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.5rem 0 0;line-height:1.7"><strong style="color:#e5e5e5">Lifespan:</strong> 1 hour (3600 seconds)</p>
<p style="font-size:.82rem;color:#a1a1aa;margin:.25rem 0 0;line-height:1.7"><strong style="color:#e5e5e5">Purpose:</strong> Sent with every API request to prove identity</p>
<p style="font-size:.82rem;color:#a1a1aa;margin:.25rem 0 0;line-height:1.7"><strong style="color:#e5e5e5">Storage:</strong> In memory (Supabase client manages this)</p>
<p style="font-size:.82rem;color:#a1a1aa;margin:.25rem 0 0;line-height:1.7"><strong style="color:#e5e5e5">If stolen:</strong> Attacker has access for up to 1 hour</p>
</div>
<div style="padding:1rem 1.25rem;background:rgba(139,92,246,.04);border-radius:10px;border:1px solid rgba(139,92,246,.08)">
<strong style="color:#8b5cf6;font-size:.88rem">Refresh Token</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.5rem 0 0;line-height:1.7"><strong style="color:#e5e5e5">Lifespan:</strong> Long-lived (configurable, typically days/weeks)</p>
<p style="font-size:.82rem;color:#a1a1aa;margin:.25rem 0 0;line-height:1.7"><strong style="color:#e5e5e5">Purpose:</strong> Used ONLY to silently get a new access token</p>
<p style="font-size:.82rem;color:#a1a1aa;margin:.25rem 0 0;line-height:1.7"><strong style="color:#e5e5e5">Storage:</strong> HTTP-only cookie (browser cannot read it via JS)</p>
<p style="font-size:.82rem;color:#a1a1aa;margin:.25rem 0 0;line-height:1.7"><strong style="color:#e5e5e5">If stolen:</strong> Revoke it immediately in Supabase dashboard</p>
</div>
</div>

<div style="background:rgba(139,92,246,.06);border:1px solid rgba(139,92,246,.12);border-radius:12px;padding:1rem;margin-top:.75rem;font-size:.82rem;color:#a1a1aa;line-height:1.7">
<strong style="color:#e5e5e5">The Supabase client handles this automatically.</strong> When the access token expires, the client silently uses the refresh token to get a new one. Your users never see a login screen mid-session. You do not need to write any token refresh logic.
</div>
</div>

<div class="card">
<h2>Common Auth Mistakes</h2>
<p>These mistakes are how data breaches happen. Avoid all of them.</p>

<div style="overflow-x:auto;margin-top:1rem">
<table style="width:100%;border-collapse:collapse;font-size:.82rem">
<thead>
<tr style="border-bottom:1px solid rgba(255,255,255,.1)">
<th style="text-align:left;padding:.75rem;color:#e5e5e5;font-weight:600">Mistake</th>
<th style="text-align:left;padding:.75rem;color:#e5e5e5;font-weight:600">Risk</th>
<th style="text-align:left;padding:.75rem;color:#e5e5e5;font-weight:600">Fix</th>
</tr>
</thead>
<tbody style="color:#a1a1aa">
<tr style="border-bottom:1px solid rgba(255,255,255,.05)">
<td style="padding:.75rem">Storing JWT in localStorage</td>
<td style="padding:.75rem">XSS attack can steal the token</td>
<td style="padding:.75rem">Let the Supabase client handle storage (uses secure cookies)</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,.05)">
<td style="padding:.75rem">Putting secrets in JWT payload</td>
<td style="padding:.75rem">Anyone can decode and read them</td>
<td style="padding:.75rem">JWTs are signed, not encrypted — never include sensitive data</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,.05)">
<td style="padding:.75rem">Skipping RLS</td>
<td style="padding:.75rem">Any authenticated user can read ALL data</td>
<td style="padding:.75rem">Enable RLS + create policies on every user-facing table</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,.05)">
<td style="padding:.75rem">Using service role key in frontend</td>
<td style="padding:.75rem">Bypasses ALL RLS — full database access from browser</td>
<td style="padding:.75rem">Service role key belongs ONLY in edge functions (server-side)</td>
</tr>
<tr>
<td style="padding:.75rem">Not verifying JWT in edge functions</td>
<td style="padding:.75rem">Anyone can call your API without authentication</td>
<td style="padding:.75rem">Always call <code style="color:#f59e0b">supabase.auth.getUser()</code> before processing</td>
</tr>
</tbody>
</table>
</div>
</div>

<div style="margin:1.5rem 0">
<div data-learn="QuizMC" data-props='{"title":"Auth & Tokens — Mastery Check","questions":[{"q":"Which part of a JWT is cryptographically signed to prevent tampering?","options":["Header only","Payload only","The signature is computed from the header AND payload together","All three parts are encrypted"],"correct":2,"explanation":"The signature is an HMAC computed from the base64-encoded header + payload using a secret. Any change to either part invalidates the signature. Note: the parts are signed, not encrypted — the payload is readable by anyone."},{"q":"What does the sub claim in a JWT payload represent?","options":["Subscription tier","Subject — typically the user ID","Supabase project ID","Secret key"],"correct":1,"explanation":"The sub (subject) claim uniquely identifies the principal — usually the user ID. Supabase auth.uid() extracts this value to enforce Row Level Security policies."},{"q":"How long does a Supabase access token (JWT) last by default?","options":["24 hours","7 days","1 hour","30 minutes"],"correct":2,"explanation":"Supabase access tokens expire after 1 hour (3600 seconds). The long-lived refresh token silently obtains a new access token when the old one expires — users stay logged in without interruption."},{"q":"Why is RLS more secure than checking permissions in application code?","options":["RLS is faster than code checks","Even if your app code has a bug that forgets to filter by user_id, the database itself rejects unauthorized rows","RLS encrypts all data at rest","RLS prevents SQL injection"],"correct":1,"explanation":"Application code can have bugs — a missed WHERE clause, a wrong variable, or a code path that skips validation. RLS operates at the database level, below your app code. It enforces access rules on EVERY query, regardless of how the query was constructed."},{"q":"What happens if you store the service role key in a NEXT_PUBLIC_ variable?","options":["Nothing — it is automatically protected","The key is exposed in the browser, bypassing ALL RLS — anyone can read, write, or delete all database data","Supabase rejects the key","The build fails"],"correct":1,"explanation":"NEXT_PUBLIC_ variables are included in the browser bundle, visible to anyone. The service role key bypasses RLS entirely. Exposing it gives any browser visitor full, unrestricted access to your entire database. This is a critical security vulnerability."}]}'></div>
</div>

<div data-learn="FlashDeck" data-props='{"title":"Auth & Tokens Flashcards","cards":[{"front":"What are the three parts of a JWT?","back":"Header (algorithm + type), Payload (claims/data), Signature (cryptographic verification). Separated by dots and base64url-encoded. Signed but NOT encrypted — anyone can read the payload."},{"front":"What is RLS and why does it matter for JWTs?","back":"Row Level Security is a Postgres feature that enforces data access rules per row. Supabase RLS policies use auth.uid() to extract the user ID from the JWT, so each user can only access their own data — even if application code has bugs."},{"front":"What is the difference between an access token and a refresh token?","back":"Access token: short-lived JWT (1 hour) sent with every request. Refresh token: long-lived, stored securely, used only to silently get a new access token when the old one expires. The Supabase client handles refresh automatically."},{"front":"What HTTP header carries a JWT in API requests?","back":"Authorization: Bearer <token>. The server reads this header, extracts the token, and verifies the signature to authenticate the request."},{"front":"Why should you never store secrets in a JWT payload?","back":"JWTs are signed, not encrypted. The payload is simply base64-encoded — anyone can decode it and read the contents. The signature only prevents tampering, not reading. Store secrets in server-side environment variables."},{"front":"What does auth.uid() do in a Supabase RLS policy?","back":"Extracts the sub (subject) claim from the JWT — which is the authenticated user ID. RLS policies use this to restrict each query to only the rows belonging to the current user."}]}'></div>

</div>

<div class="progress-footer">
<span class="progress-label">Lesson 6 of 10</span>
<div class="progress-bar-wrap"></div>
<span class="progress-label">Module 1</span>
</div>
</div>
