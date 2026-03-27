---
title: "What Is an API?"
course: "automation-architect"
order: 4
type: "lesson"
free: false
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>
  
</nav>

<header class="lesson-header">
  <div class="lesson-badge">Module 2 &middot; Animated</div>
  <h1>What Is an API?</h1>
  <p>APIs are how machines talk to each other. Master this and you can connect anything to anything.</p>
</header>

<div class="content">
  <h2>The Request / Response Cycle</h2>
  <p class="section-text">Every API interaction follows one pattern: your code sends a <strong>request</strong>, the server processes it, and sends back a <strong>response</strong>. Click a method below to see it in action.</p>

  <div class="api-animation" id="apiAnimation">
    <div class="api-entity entity-client">
      <div class="entity-icon">&#128187;</div>
      <div class="entity-label">Client</div>
      <div class="entity-sub">Your Code</div>
    </div>
    <div class="api-pipe" id="apiPipe">
      <div class="packet-label label-req" id="labelReq">REQUEST</div>
      <div class="packet-label label-res" id="labelRes">RESPONSE</div>
    </div>
    <div class="api-entity entity-server">
      <div class="entity-icon">&#9729;&#65039;</div>
      <div class="entity-label">Server</div>
      <div class="entity-sub">API Endpoint</div>
    </div>
  </div>

  <h2>HTTP Methods</h2>
  <p class="section-text">Click each method to see a real-world example with request and response details.</p>

  <div class="method-grid">
    <div class="method-card" data-method="GET" onclick="selectMethod('GET')"><div class="method-name">GET</div><div class="method-desc">Read data</div></div>
    <div class="method-card" data-method="POST" onclick="selectMethod('POST')"><div class="method-name">POST</div><div class="method-desc">Create data</div></div>
    <div class="method-card" data-method="PUT" onclick="selectMethod('PUT')"><div class="method-name">PUT</div><div class="method-desc">Update data</div></div>
    <div class="method-card" data-method="DELETE" onclick="selectMethod('DELETE')"><div class="method-name">DELETE</div><div class="method-desc">Remove data</div></div>
  </div>

  <div class="detail-panel" id="detailPanel">
    <h3 id="detailTitle">Click a method above to see its anatomy</h3>
    </div>

  <h2>Status Codes</h2>
  <p class="section-text">The server tells you what happened with a status code.</p>
  <div class="status-row">
    <div class="status-card status-2xx"><div class="status-code">200 OK</div><div class="status-label">Success &mdash; here's your data</div></div>
    <div class="status-card status-2xx"><div class="status-code">201 Created</div><div class="status-label">Success &mdash; resource was created</div></div>
    <div class="status-card status-4xx"><div class="status-code">400 Bad Request</div><div class="status-label">Your request was malformed</div></div>
  </div>
  <div class="status-row">
    <div class="status-card status-4xx"><div class="status-code">401 Unauthorized</div><div class="status-label">Missing or invalid auth</div></div>
    <div class="status-card status-4xx"><div class="status-code">404 Not Found</div><div class="status-label">Resource doesn't exist</div></div>
    <div class="status-card status-5xx"><div class="status-code">500 Server Error</div><div class="status-label">Something broke on the server</div></div>
  </div>

  <button class="complete-btn" id="completeBtn" onclick="completeLesson()">Complete Lesson &mdash; Earn 50 XP</button>
</div>

<footer class="progress-footer">
  <p>Lesson 4 of 9 &middot; Automation Architect</p>
</footer>

<script>
const SLUG='what-is-an-api';
const STORAGE_KEY='automation-architect-progress';

const methods={
  GET:{
    title:'GET — Read Data (Weather API)',
    content:`<div class="code-block"><span class="comment">// Request</span>
<span class="method-get">GET</span> https://api.weather.com/v1/current?city=tokyo
<span class="header">Authorization:</span> Bearer sk_abc123
<span class="header">Accept:</span> application/json</div>
<div class="code-block"><span class="comment">// Response — <span class="status">200 OK</span></span>
{
  <span class="key">"city"</span>: <span class="val">"Tokyo"</span>,
  <span class="key">"temp"</span>: <span class="val">22</span>,
  <span class="key">"condition"</span>: <span class="val">"Partly Cloudy"</span>,
  <span class="key">"humidity"</span>: <span class="val">65</span>
}</div>`
  },
  POST:{
    title:'POST — Create Data (Stripe API)',
    content:`<div class="code-block"><span class="comment">// Request</span>
<span class="method-post">POST</span> https://api.stripe.com/v1/charges
<span class="header">Authorization:</span> Bearer sk_live_xxx
<span class="header">Content-Type:</span> application/json

{
  <span class="key">"amount"</span>: <span class="val">7900</span>,
  <span class="key">"currency"</span>: <span class="val">"usd"</span>,
  <span class="key">"customer"</span>: <span class="val">"cus_abc123"</span>
}</div>
<div class="code-block"><span class="comment">// Response — <span class="status">201 Created</span></span>
{
  <span class="key">"id"</span>: <span class="val">"ch_1abc"</span>,
  <span class="key">"status"</span>: <span class="val">"succeeded"</span>,
  <span class="key">"amount"</span>: <span class="val">7900</span>
}</div>`
  },
  PUT:{
    title:'PUT — Update Data (User Settings)',
    content:`<div class="code-block"><span class="comment">// Request</span>
<span class="method-put">PUT</span> https://api.myapp.com/v1/settings/user_42
<span class="header">Authorization:</span> Bearer token_xxx
<span class="header">Content-Type:</span> application/json

{
  <span class="key">"theme"</span>: <span class="val">"dark"</span>,
  <span class="key">"notifications"</span>: <span class="val">true</span>,
  <span class="key">"timezone"</span>: <span class="val">"America/New_York"</span>
}</div>
<div class="code-block"><span class="comment">// Response — <span class="status">200 OK</span></span>
{
  <span class="key">"id"</span>: <span class="val">"user_42"</span>,
  <span class="key">"updated"</span>: <span class="val">true</span>,
  <span class="key">"settings"</span>: { <span class="key">"theme"</span>: <span class="val">"dark"</span> ... }
}</div>`
  },
  DELETE:{
    title:'DELETE — Remove Data',
    content:`<div class="code-block"><span class="comment">// Request</span>
<span class="method-delete">DELETE</span> https://api.myapp.com/v1/users/user_42
<span class="header">Authorization:</span> Bearer admin_token</div>
<div class="code-block"><span class="comment">// Response — <span class="status">200 OK</span></span>
{
  <span class="key">"deleted"</span>: <span class="val">true</span>,
  <span class="key">"id"</span>: <span class="val">"user_42"</span>
}</div>`
  }
};

function animateRequest(){
  const req=document.getElementById('packetReq');
  const res=document.getElementById('packetRes');
  const lReq=document.getElementById('labelReq');
  const lRes=document.getElementById('labelRes');

  req.classList.remove('sending');res.classList.remove('returning');
  lReq.classList.remove('visible');lRes.classList.remove('visible');

  void req.offsetWidth;
  req.classList.add('sending');
  lReq.classList.add('visible');

  setTimeout(()=>{
    lReq.classList.remove('visible');
    res.classList.add('returning');
    lRes.classList.add('visible');
    setTimeout(()=>lRes.classList.remove('visible'),1500);
  },1400);
}

function selectMethod(m){
  document.querySelectorAll('.method-card').forEach(c=>c.classList.remove('selected'));
  document.querySelector(`[data-method="${m}"]`).classList.add('selected');
  const d=methods[m];
  document.getElementById('detailTitle').textContent=d.title;
  document.getElementById('detailContent').innerHTML=d.content;
  animateRequest();
}

function completeLesson(){
  const progress=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');
  progress[SLUG]=true;
  localStorage.setItem(STORAGE_KEY,JSON.stringify(progress));
  const btn=document.getElementById('completeBtn');
  btn.textContent='Completed! +50 XP';
  btn.classList.add('done');
}

(function(){
  const progress=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');
  if(progress[SLUG]){
    document.getElementById('completeBtn').textContent='Completed! +50 XP';
    document.getElementById('completeBtn').classList.add('done');
  }
  setTimeout(()=>selectMethod('GET'),600);
})();
</script>
