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
<div class="progress-bar"></div>
</div>
<button class="complete-btn" id="completeBtn" onclick="completeLesson()">Complete Lesson & Earn 260 XP</button>
<div class="footer">Like One Academy &copy; 2026</div>
</div>

<script>
let actions=0;
function updateProg(){actions++;const p=Math.min(100,actions*18);document.getElementById('lessonProgress').style.width=p+'%';document.getElementById('lessonPct').textContent=p+'%'}

function showPanel(which){
['header','payload','sig'].forEach(p=>{document.getElementById('panel-'+p).classList.remove('active')});
document.getElementById('panel-'+which).classList.add('active');updateProg()}

function decodeJWT(){
const token=document.getElementById('jwtInput').value.trim();
const parts=token.split('.');
if(parts.length!==3){document.getElementById('decodeOutput').style.display='block';document.getElementById('decodeOutput').innerHTML='<span style="color:#ef4444">Invalid JWT — must have 3 parts separated by dots.</span>';return}
try{
const header=JSON.parse(atob(parts[0].replace(/-/g,'+').replace(/_/g,'/')));
const payload=JSON.parse(atob(parts[1].replace(/-/g,'+').replace(/_/g,'/')));
const out=document.getElementById('decodeOutput');out.style.display='block';
let html='<div style="margin-bottom:.75rem"><span style="color:#ef4444;font-weight:600">HEADER:</span></div>';
html+='<div style="margin-bottom:.75rem">'+syntaxHighlight(JSON.stringify(header,null,2))+'</div>';
html+='<div style="margin-bottom:.75rem"><span style="color:#c084fc;font-weight:600">PAYLOAD:</span></div>';
html+='<div style="margin-bottom:.75rem">'+syntaxHighlight(JSON.stringify(payload,null,2))+'</div>';
if(payload.exp){const exp=new Date(payload.exp*1000);const now=new Date();html+='<div style="margin-top:.5rem;color:'+(exp<now?'#ef4444':'#22c55e')+'">Token '+(exp<now?'EXPIRED':'valid')+' — expires: '+exp.toISOString()+'</div>'}
out.innerHTML=html;updateProg()}catch(e){document.getElementById('decodeOutput').style.display='block';document.getElementById('decodeOutput').innerHTML='<span style="color:#ef4444">Failed to decode: '+e.message+'</span>'}}

function syntaxHighlight(json){return json.replace(/(".*?")\s*:/g,'<span style="color:#60a5fa">$1</span>:').replace(/:\s*(".*?")/g,': <span style="color:#34d399">$1</span>').replace(/:\s*(\d+)/g,': <span style="color:#fb923c">$1</span>')}

const stepDetails=[
{label:'Sign Up Code',code:'<span class="kw">const</span> { data, error } = <span class="kw">await</span> supabase.auth.<span class="fn">signUp</span>({<br>&nbsp;&nbsp;email: <span class="str">\'user@email.com\'</span>,<br>&nbsp;&nbsp;password: <span class="str">\'password123\'</span><br>})<br><span class="cm">// data.user is created, but not confirmed yet</span>'},
{label:'Confirmation',code:'<span class="cm">// User clicks email link, hits:</span><br>https://yourproject.supabase.co/auth/v1/verify?<br>&nbsp;&nbsp;token=<span class="str">abc123</span>&type=<span class="str">signup</span>&redirect_to=<span class="str">https://yoursite.com</span>'},
{label:'Token Response',code:'<span class="cm">// After verification, Supabase returns:</span><br>{<br>&nbsp;&nbsp;<span class="str">"access_token"</span>: <span class="str">"eyJhbG..."</span>,  <span class="cm">// JWT, 1 hour</span><br>&nbsp;&nbsp;<span class="str">"refresh_token"</span>: <span class="str">"v1.abc..."</span>, <span class="cm">// long-lived</span><br>&nbsp;&nbsp;<span class="str">"expires_in"</span>: <span class="num">3600</span>,<br>&nbsp;&nbsp;<span class="str">"token_type"</span>: <span class="str">"bearer"</span><br>}'},
{label:'Authenticated Request',code:'<span class="cm">// Every API call includes the token:</span><br><span class="fn">fetch</span>(<span class="str">\'https://proj.supabase.co/rest/v1/brain_context\'</span>, {<br>&nbsp;&nbsp;headers: {<br>&nbsp;&nbsp;&nbsp;&nbsp;<span class="str">\'Authorization\'</span>: <span class="str">`Bearer ${session.access_token}`</span>,<br>&nbsp;&nbsp;&nbsp;&nbsp;<span class="str">\'apikey\'</span>: <span class="str">SUPABASE_ANON_KEY</span><br>&nbsp;&nbsp;}<br>})'},
{label:'Row Level Security',code:'<span class="cm">-- Postgres checks JWT claims in the policy:</span><br><span class="kw">CREATE POLICY</span> <span class="str">"users see own data"</span> <span class="kw">ON</span> brain_context<br>&nbsp;&nbsp;<span class="kw">FOR SELECT USING</span> (<br>&nbsp;&nbsp;&nbsp;&nbsp;auth.uid() = user_id <span class="cm">-- auth.uid() extracts sub from JWT</span><br>&nbsp;&nbsp;);'}
];

function activateStep(idx){
document.querySelectorAll('.auth-step').forEach((s,i)=>{s.classList.toggle('active',i<=idx)});
document.querySelectorAll('.auth-arrow').forEach((a,i)=>{a.classList.toggle('active',i<idx)});
const detail=document.getElementById('stepDetail');detail.style.display='block';
document.getElementById('stepLabel').textContent=stepDetails[idx].label;
document.getElementById('stepCode').innerHTML=stepDetails[idx].code;
updateProg()}

function completeLesson(){localStorage.setItem('aisb_lesson_6','complete');const btn=document.getElementById('completeBtn');btn.textContent='\u2713 Lesson Complete — 260 XP Earned!';btn.classList.add('done');document.getElementById('lessonProgress').style.width='100%';document.getElementById('lessonPct').textContent='100%'}
if(localStorage.getItem('aisb_lesson_6')==='complete'){document.getElementById('completeBtn').textContent='\u2713 Complete';document.getElementById('completeBtn').classList.add('done')}
</script>
