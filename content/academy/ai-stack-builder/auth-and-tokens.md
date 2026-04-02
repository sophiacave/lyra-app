---
title: "Auth and Tokens"
course: "ai-stack-builder"
order: 6
type: "lesson"
free: false
---<div class="container">
<div class="nav">

<span class="current">Lesson 6 of 10</span>

</div>

<div class="lesson-badge">MODULE 2 &middot; 260 XP</div>
<h1>Auth & Tokens</h1>
<p class="intro">Authentication is how your app knows who's talking to it. JWTs (JSON Web Tokens) are the standard. Let's crack one open.</p>

<h2>JWT Anatomy</h2>
<p>A JWT has three parts, separated by dots. Click each part to decode it.</p>

<div class="jwt-display">
<span class="jwt-header" onclick="showPanel('header')">eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9</span><span class="jwt-dot">.</span><span class="jwt-payload" onclick="showPanel('payload')">eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJidWlsZGVyQGV4YW1wbGUuY29tIiwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJpYXQiOjE3MTExNTIwMDAsImV4cCI6MTcxMTE1NTYwMH0</span><span class="jwt-dot">.</span><span class="jwt-signature" onclick="showPanel('sig')">SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c</span>
</div>

<div class="jwt-decode-panel header-panel" id="panel-header">
<h4 class="hdr-color">Header (Algorithm + Type)</h4>
<div class="code-block" style="margin:0">{<br>&nbsp;&nbsp;<span class="str">"alg"</span>: <span class="str">"HS256"</span>, <span class="cm">// signing algorithm</span><br>&nbsp;&nbsp;<span class="str">"typ"</span>: <span class="str">"JWT"</span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="cm">// token type</span><br>}</div>
</div>

<div class="jwt-decode-panel payload-panel" id="panel-payload">
<h4 class="pay-color">Payload (Claims — Your Data)</h4>
<div class="code-block" style="margin:0">{<br>&nbsp;&nbsp;<span class="str">"sub"</span>: <span class="str">"1234567890"</span>,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="cm">// subject (user ID)</span><br>&nbsp;&nbsp;<span class="str">"email"</span>: <span class="str">"builder@example.com"</span>, <span class="cm">// custom claim</span><br>&nbsp;&nbsp;<span class="str">"role"</span>: <span class="str">"authenticated"</span>,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="cm">// Supabase role</span><br>&nbsp;&nbsp;<span class="str">"iat"</span>: <span class="num">1711152000</span>,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="cm">// issued at</span><br>&nbsp;&nbsp;<span class="str">"exp"</span>: <span class="num">1711155600</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="cm">// expires (1 hour)</span><br>}</div>
</div>

<div class="jwt-decode-panel sig-panel" id="panel-sig">
<h4 class="sig-color">Signature (Verification)</h4>
<div class="code-block" style="margin:0"><span class="fn">HMACSHA256</span>(<br>&nbsp;&nbsp;<span class="fn">base64UrlEncode</span>(header) + <span class="str">"."</span> +<br>&nbsp;&nbsp;<span class="fn">base64UrlEncode</span>(payload),<br>&nbsp;&nbsp;secret <span class="cm">// your JWT secret</span><br>)</div>
<p style="font-size:.85rem;color:#888;margin:.5rem 0 0">The server uses this to verify the token wasn't tampered with. If anyone changes the payload, the signature won't match.</p>
</div>

<h2>Live JWT Decoder</h2>
<p>Paste any JWT below to decode it instantly. Try it with tokens from your Supabase project.</p>

<div class="decoder">
<textarea id="jwtInput" placeholder="Paste a JWT here... (e.g. eyJhbGciOiJIUzI1NiIs...)">eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJidWlsZGVyQGV4YW1wbGUuY29tIiwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJpYXQiOjE3MTExNTIwMDAsImV4cCI6MTcxMTE1NTYwMH0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c</textarea>
<button class="decode-btn" onclick="decodeJWT()">&#x1f50d; Decode</button>
</div>
<div class="decode-output" id="decodeOutput" style="display:none"></div>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">JavaScript — Protecting an API route with JWT verification</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> { createClient } <span style="color:#c084fc">from</span> <span style="color:#fb923c">'@supabase/supabase-js'</span>

<span style="color:#c084fc">export default async function</span> <span style="color:#34d399">handler</span>(req) {
  <span style="color:#71717a">// 1. Extract the Bearer token from the request</span>
  <span style="color:#c084fc">const</span> authHeader = req.headers.<span style="color:#34d399">get</span>(<span style="color:#fb923c">'Authorization'</span>)
  <span style="color:#c084fc">if</span> (!authHeader?.startsWith(<span style="color:#fb923c">'Bearer '</span>)) {
    <span style="color:#c084fc">return new</span> <span style="color:#34d399">Response</span>(<span style="color:#fb923c">'Missing token'</span>, { status: <span style="color:#fb923c">401</span> })
  }
  <span style="color:#c084fc">const</span> token = authHeader.<span style="color:#34d399">replace</span>(<span style="color:#fb923c">'Bearer '</span>, <span style="color:#fb923c">''</span>)

  <span style="color:#71717a">// 2. Create a Supabase client with the user's token</span>
  <span style="color:#c084fc">const</span> supabase = <span style="color:#34d399">createClient</span>(
    Deno.env.<span style="color:#34d399">get</span>(<span style="color:#fb923c">'SUPABASE_URL'</span>),
    Deno.env.<span style="color:#34d399">get</span>(<span style="color:#fb923c">'SUPABASE_ANON_KEY'</span>),
    { global: { headers: { Authorization: <span style="color:#fb923c">`Bearer <span style="color:#c084fc">${</span>token<span style="color:#c084fc">}</span>`</span> } } }
  )

  <span style="color:#71717a">// 3. Verify the token and get the user</span>
  <span style="color:#c084fc">const</span> { data: { user }, error } = <span style="color:#c084fc">await</span> supabase.auth.<span style="color:#34d399">getUser</span>()
  <span style="color:#c084fc">if</span> (error || !user) {
    <span style="color:#c084fc">return new</span> <span style="color:#34d399">Response</span>(<span style="color:#fb923c">'Invalid token'</span>, { status: <span style="color:#fb923c">401</span> })
  }

  <span style="color:#71717a">// 4. Token is valid — RLS now scopes queries to this user</span>
  <span style="color:#c084fc">const</span> { data } = <span style="color:#c084fc">await</span> supabase
    .<span style="color:#34d399">from</span>(<span style="color:#fb923c">'brain_context'</span>)
    .<span style="color:#34d399">select</span>(<span style="color:#fb923c">'key, value'</span>)  <span style="color:#71717a">// RLS ensures only this user's rows</span>

  <span style="color:#c084fc">return new</span> <span style="color:#34d399">Response</span>(JSON.<span style="color:#34d399">stringify</span>({ user: user.email, data }))
}
</code></pre>
</div>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">SQL — RLS policy that uses JWT claims for row-level access</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a">-- Enable RLS on a user-scoped table</span>
<span style="color:#c084fc">ALTER TABLE</span> brain_context <span style="color:#c084fc">ENABLE ROW LEVEL SECURITY</span>;

<span style="color:#71717a">-- Users can only read their own rows</span>
<span style="color:#71717a">-- auth.uid() extracts the 'sub' claim from the JWT automatically</span>
<span style="color:#c084fc">CREATE POLICY</span> <span style="color:#fb923c">"users read own data"</span> <span style="color:#c084fc">ON</span> brain_context
  <span style="color:#c084fc">FOR SELECT</span>
  <span style="color:#c084fc">TO</span> authenticated
  <span style="color:#c084fc">USING</span> ( <span style="color:#34d399">auth.uid</span>() = user_id );

<span style="color:#71717a">-- Users can insert rows only with their own user_id</span>
<span style="color:#c084fc">CREATE POLICY</span> <span style="color:#fb923c">"users insert own data"</span> <span style="color:#c084fc">ON</span> brain_context
  <span style="color:#c084fc">FOR INSERT</span>
  <span style="color:#c084fc">TO</span> authenticated
  <span style="color:#c084fc">WITH CHECK</span> ( <span style="color:#34d399">auth.uid</span>() = user_id );
</code></pre>
</div>

<h2>Auth Flow: Step by Step</h2>
<p>Click each step to walk through how Supabase authentication works.</p>

<div class="auth-flow" id="authFlow">
<div class="auth-step" onclick="activateStep(0)">
<span class="step-icon">&#x1f464;</span>
<div class="step-info"><h4>1. User Signs Up</h4><p>Email + password sent to Supabase Auth</p></div>
</div>
<div class="auth-arrow" id="arrow0">&#x2193;</div>
<div class="auth-step" onclick="activateStep(1)">
<span class="step-icon">&#x1f4e7;</span>
<div class="step-info"><h4>2. Confirmation Email</h4><p>Supabase sends magic link or OTP to verify</p></div>
</div>
<div class="auth-arrow" id="arrow1">&#x2193;</div>
<div class="auth-step" onclick="activateStep(2)">
<span class="step-icon">&#x1f511;</span>
<div class="step-info"><h4>3. JWT Issued</h4><p>Access token (1hr) + refresh token returned</p></div>
</div>
<div class="auth-arrow" id="arrow2">&#x2193;</div>
<div class="auth-step" onclick="activateStep(3)">
<span class="step-icon">&#x1f4e8;</span>
<div class="step-info"><h4>4. Authenticated Requests</h4><p>JWT sent in Authorization: Bearer header</p></div>
</div>
<div class="auth-arrow" id="arrow3">&#x2193;</div>
<div class="auth-step" onclick="activateStep(4)">
<span class="step-icon">&#x1f6e1;</span>
<div class="step-info"><h4>5. RLS Enforced</h4><p>Postgres checks JWT claims against row policies</p></div>
</div>
</div>

<div class="panel" id="stepDetail" style="display:none">
<div class="label" id="stepLabel"></div>
<div class="code-block" id="stepCode"></div>
</div>

<div class="panel">
<div class="label">Key Concept: Supabase Auth in Code</div>
<div class="code-block">
<span class="cm">// Frontend: Sign up</span><br>
<span class="kw">const</span> { data, error } = <span class="kw">await</span> supabase.auth.<span class="fn">signUp</span>({<br>
&nbsp;&nbsp;email: <span class="str">'builder@example.com'</span>,<br>
&nbsp;&nbsp;password: <span class="str">'secure-password-123'</span><br>
})<br><br>
<span class="cm">// Frontend: Get current session</span><br>
<span class="kw">const</span> { data: { session } } = <span class="kw">await</span> supabase.auth.<span class="fn">getSession</span>()<br>
console.<span class="fn">log</span>(session.access_token) <span class="cm">// This is the JWT!</span><br><br>
<span class="cm">// Edge function: Verify the JWT</span><br>
<span class="kw">const</span> authHeader = req.headers.get(<span class="str">'Authorization'</span>)<br>
<span class="kw">const</span> token = authHeader.replace(<span class="str">'Bearer '</span>, <span class="str">''</span>)<br>
<span class="kw">const</span> { data: { user } } = <span class="kw">await</span> supabase.auth.<span class="fn">getUser</span>(token)
</div>
</div>

<div class="progress-section">
<div style="display:flex;justify-content:space-between;font-size:.85rem;color:#999">
<span>Lesson Progress</span><span id="lessonPct">0%</span>
</div>
<div class="progress-bar"><div class="progress-fill" id="lessonProgress"></div></div>
</div>
<div class="footer">Like One Academy &copy; 2026</div>

<div data-learn="QuizMC" data-props='{"title":"JWT Knowledge Check","questions":[{"q":"Which part of a JWT is cryptographically signed to prevent tampering?","options":["Header","Payload","Signature","All three parts"],"correct":2,"explanation":"The signature is computed from the header and payload using a secret. Any change to the header or payload invalidates the signature, so the server can detect tampering."},{"q":"What does the `sub` claim in a JWT payload represent?","options":["Subscription tier","Subject (typically the user ID)","Supabase project","Secret key"],"correct":1,"explanation":"The `sub` (subject) claim uniquely identifies the principal — usually the user ID. Supabase\u0027s auth.uid() function extracts this value to enforce Row Level Security policies."},{"q":"How long does a Supabase access token (JWT) last by default?","options":["24 hours","7 days","1 hour","30 minutes"],"correct":2,"explanation":"Supabase access tokens expire after 1 hour (3600 seconds). The refresh token is long-lived and can be used to silently get a new access token without re-authentication."}]}'></div>

<div data-learn="FlashDeck" data-props='{"title":"JWT & Auth Flashcards","cards":[{"front":"What are the three parts of a JWT?","back":"Header (algorithm + type), Payload (claims/data), Signature (cryptographic verification). Separated by dots and base64url-encoded."},{"front":"What is RLS and why does it matter for JWTs?","back":"Row Level Security is a Postgres feature that enforces data access rules per row. Supabase RLS policies use auth.uid() to extract the user ID from the JWT, so each user can only access their own data."},{"front":"What is the difference between an access token and a refresh token?","back":"Access token: short-lived JWT (1 hour) sent with every request. Refresh token: long-lived token stored securely, used only to silently get a new access token when the old one expires."},{"front":"What HTTP header carries a JWT in API requests?","back":"Authorization: Bearer <token>. The server reads this header, extracts the token, and verifies the signature to authenticate the request."}]}'></div>


</div>
