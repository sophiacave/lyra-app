---
title: "Webhooks Deep Dive"
course: "ai-stack-builder"
order: 5
type: "lesson"
free: false
---<div class="container">
<div class="nav">
<a href="edge-functions.html">&larr; Prev</a>
<span class="current">Lesson 5 of 10</span>
<a href="auth-and-tokens.html">Next &rarr;</a>
</div>

<div class="lesson-badge">MODULE 2 &middot; 260 XP</div>
<h1>Webhooks Deep Dive</h1>
<p class="intro">Webhooks are how services talk to each other in real-time. When something happens in one system, it sends an HTTP POST to your endpoint. No polling. No delays.</p>

<h2>How Webhooks Work</h2>
<p>Click "Trigger Event" to watch data flow through the webhook pipeline step by step.</p>

<div class="flow-diagram">
<div class="flow-row">
<div class="flow-box trigger" id="f1">&#x26a1; Event Occurs</div>
<span class="flow-arrow-h" id="a1">&#x2192;</span>
<div class="flow-box" id="f2">&#x1f4e8; HTTP POST</div>
<span class="flow-arrow-h" id="a2">&#x2192;</span>
<div class="flow-box endpoint" id="f3">&#x1f3af; Your Endpoint</div>
<span class="flow-arrow-h" id="a3">&#x2192;</span>
<div class="flow-box process" id="f4">&#x2699; Process</div>
<span class="flow-arrow-h" id="a4">&#x2192;</span>
<div class="flow-box respond" id="f5">&#x2705; 200 OK</div>
</div>
<div class="flow-row">
<div class="flow-packet" id="pkt1">{"type":"checkout.session.completed"}</div>
</div>
</div>
<button class="test-btn" onclick="animateFlow()">&#x26a1; Trigger Event</button>

<h2>Configure a Stripe Webhook</h2>
<p>Build a real Stripe webhook configuration. Pick which events to listen for and set your endpoint URL.</p>
<p style="font-size:.85rem;color:#888"><strong>Where to do this in production:</strong> Go to your <a href="https://dashboard.stripe.com/webhooks" target="_blank" style="color:#f59e0b">Stripe Dashboard</a> &rarr; Developers &rarr; Webhooks &rarr; "Add endpoint." Paste your Supabase Edge Function URL and select the events below. Stripe will give you a signing secret (starts with <code style="color:#888">whsec_</code>) — save it as an environment variable in Supabase.</p>

<div class="config-section">
<div class="config-group">
<div class="config-label">Endpoint URL</div>
<input class="config-input" id="webhookUrl" value="https://yourproject.supabase.co/functions/v1/stripe-webhook" placeholder="https://your-endpoint.com/webhook">
</div>
<div class="config-group">
<div class="config-label">Events to Listen For</div>
<p style="font-size:.8rem;color:#888;margin:.25rem 0 .5rem"><strong>Recommended for a course/product site:</strong> Start with <code style="color:#f59e0b">checkout.session.completed</code> (fires when someone pays) and <code style="color:#f59e0b">customer.subscription.deleted</code> (fires when someone cancels). Add others as your product grows.</p>
<div class="event-grid" id="eventGrid">
<div class="event-chip" onclick="toggleEvent(this)">checkout.session.completed</div>
<div class="event-chip" onclick="toggleEvent(this)">payment_intent.succeeded</div>
<div class="event-chip" onclick="toggleEvent(this)">payment_intent.failed</div>
<div class="event-chip" onclick="toggleEvent(this)">customer.subscription.created</div>
<div class="event-chip" onclick="toggleEvent(this)">customer.subscription.deleted</div>
<div class="event-chip" onclick="toggleEvent(this)">invoice.paid</div>
<div class="event-chip" onclick="toggleEvent(this)">invoice.payment_failed</div>
<div class="event-chip" onclick="toggleEvent(this)">charge.refunded</div>
</div>
</div>
<div class="config-group">
<div class="config-label">Signing Secret</div>
<input class="config-input" value="whsec_..." readonly style="color:#666">
<p style="font-size:.8rem;color:#666;margin-top:.3rem">Always verify the signature to prevent spoofed events.</p>
</div>
</div>

<h2>Test with Simulated Events</h2>
<p>Click an event to see the exact payload Stripe would send to your endpoint.</p>
<p style="font-size:.8rem;color:#666;font-style:italic">This is a simulation — the payloads below match Stripe's real format, but run in your browser. In production, Stripe sends these JSON payloads to your endpoint URL automatically when events occur.</p>

<div style="display:flex;flex-wrap:wrap;gap:.5rem;margin:1rem 0">
<button class="test-btn" onclick="simulateEvent('checkout')">&#x1f4b3; Checkout Complete</button>
<button class="test-btn" onclick="simulateEvent('payment')">&#x2705; Payment Succeeded</button>
<button class="test-btn" onclick="simulateEvent('failed')">&#x274c; Payment Failed</button>
</div>

<div class="payload-viewer" id="payloadView" style="display:none"></div>
<div class="test-result" id="testResult"></div>

<div class="panel">
<div class="label">Key Concept: Signature Verification</div>
<p style="font-size:.9rem">Anyone can send a POST to your endpoint. A bad actor could fake a "payment succeeded" event to get free access. Stripe prevents this by cryptographically signing every webhook with a secret only you and Stripe know. <strong>Always verify the signature.</strong></p>
<p style="font-size:.85rem;color:#999">Here's what this code does step by step: it reads the raw request body and the signature header that Stripe attached, then uses the Stripe library to verify they match your webhook secret. If someone tampered with the payload or sent a fake request, <code style="color:#f59e0b">constructEvent</code> throws an error and your code stops — no fraudulent data gets processed.</p>
<div class="code-block">
<span class="cm">// Import Stripe library (Deno-style for Supabase Edge Functions)</span><br>
<span class="kw">import</span> Stripe <span class="kw">from</span> <span class="str">"https://esm.sh/stripe@14"</span><br><br>
<span class="cm">// Initialize Stripe with your secret key</span><br>
<span class="kw">const</span> stripe = <span class="kw">new</span> <span class="fn">Stripe</span>(Deno.env.get(<span class="str">"STRIPE_SECRET_KEY"</span>))<br>
<span class="cm">// Get the signature Stripe attached to this request</span><br>
<span class="kw">const</span> sig = req.headers.get(<span class="str">"stripe-signature"</span>)<br>
<span class="cm">// Read the raw request body (must be raw text, not parsed JSON)</span><br>
<span class="kw">const</span> body = <span class="kw">await</span> req.<span class="fn">text</span>()<br><br>
<span class="cm">// This is the security check — it verifies the signature matches</span><br>
<span class="kw">const</span> event = stripe.webhooks.<span class="fn">constructEvent</span>(<br>
&nbsp;&nbsp;body, sig, Deno.env.get(<span class="str">"STRIPE_WEBHOOK_SECRET"</span>)<br>
)<br><br>
<span class="cm">// If signature is invalid, constructEvent throws an error</span><br>
<span class="cm">// If we get here, the event is genuine — safe to process</span>
</div>
</div>

<div class="panel">
<div class="label">Pro Tips</div>
<p style="font-size:.9rem"><strong>Respond fast:</strong> Stripe expects a 200 response within 20 seconds. Do heavy processing asynchronously — acknowledge the webhook first, then process.</p>
<p style="font-size:.9rem"><strong>Idempotency</strong> (processing the same event safely twice): Stripe may send the same event multiple times — network hiccups, timeouts, etc. "Idempotent" means your code produces the same result whether it runs once or ten times. In practice: store the event ID in your database, and before processing, check if you've already handled it. If yes, skip. This prevents double-charging or double-granting access.</p>
<p style="font-size:.9rem"><strong>Retry logic with exponential backoff:</strong> If your endpoint returns an error (500, timeout, etc.), Stripe retries automatically. "Exponential backoff" means it waits longer between each retry — first 1 minute, then 5 minutes, then 30, and so on — for up to 3 days. This gives your server time to recover without being hammered with requests. Design your endpoint to handle retries gracefully (see idempotency above).</p>
</div>

<div class="progress-section">
<div style="display:flex;justify-content:space-between;font-size:.85rem;color:#999">
<span>Lesson Progress</span><span id="lessonPct">0%</span>
</div>
<div class="progress-bar"><div class="progress-fill" id="lessonProgress" style="width:0%"></div></div>
</div>
<button class="complete-btn" id="completeBtn" onclick="completeLesson()">Complete Lesson & Earn 260 XP</button>
<div class="nav" style="border-top:1px solid #1e1e2e;border-bottom:none;margin-top:0;padding-top:1rem">
<a href="edge-functions.html">&larr; Edge Functions</a>
<a href="auth-and-tokens.html">Next: Auth & Tokens &rarr;</a>
</div>
<div class="footer">Like One Academy &copy; 2026</div>
</div>

<script>
let actions=0;
function updateProg(){actions++;const p=Math.min(100,actions*15);document.getElementById('lessonProgress').style.width=p+'%';document.getElementById('lessonPct').textContent=p+'%'}

function animateFlow(){
const ids=['f1','a1','f2','a2','f3','a3','f4','a4','f5'];
ids.forEach(id=>{const el=document.getElementById(id);el.classList.remove('active')});
document.getElementById('pkt1').classList.remove('active');
let i=0;
function next(){if(i>=ids.length){document.getElementById('pkt1').classList.add('active');updateProg();return}
document.getElementById(ids[i]).classList.add('active');i++;setTimeout(next,350)}
next()}

function toggleEvent(el){el.classList.toggle('selected');updateProg()}

const payloads={
checkout:`{
  "id": "evt_1Nh4oF2eZvKYlo2C",
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_live_a1b2c3",
      "amount_total": 11900,
      "currency": "usd",
      "customer_email": "builder@example.com",
      "payment_status": "paid",
      "metadata": {
        "product": "ai-stack-builder",
        "course_id": "aisb-001"
      }
    }
  },
  "created": 1711152000
}`,
payment:`{
  "id": "evt_2Mh5pG3fAaLZmp3D",
  "type": "payment_intent.succeeded",
  "data": {
    "object": {
      "id": "pi_live_d4e5f6",
      "amount": 11900,
      "currency": "usd",
      "status": "succeeded",
      "receipt_email": "builder@example.com",
      "description": "AI Stack Builder Course"
    }
  },
  "created": 1711152060
}`,
failed:`{
  "id": "evt_3Ni6qH4gBbMAno4E",
  "type": "payment_intent.payment_failed",
  "data": {
    "object": {
      "id": "pi_live_g7h8i9",
      "amount": 11900,
      "currency": "usd",
      "status": "requires_payment_method",
      "last_payment_error": {
        "code": "card_declined",
        "message": "Your card was declined."
      }
    }
  },
  "created": 1711152120
}`};

function simulateEvent(type){
const view=document.getElementById('payloadView');
view.style.display='block';
view.innerHTML='<span style="color:#888">Incoming webhook...</span>';
setTimeout(()=>{
view.innerHTML=syntaxHighlight(payloads[type]);
const result=document.getElementById('testResult');
if(type==='failed'){result.className='test-result error';result.textContent='Payment failed — trigger recovery flow (send retry email, log to Supabase)'}
else{result.className='test-result success';result.textContent='200 OK — Event processed. Logged to database, email sent.'}
updateProg()},600)}

function syntaxHighlight(json){return json.replace(/(".*?")\s*:/g,'<span style="color:#60a5fa">$1</span>:').replace(/:\s*(".*?")/g,': <span style="color:#34d399">$1</span>').replace(/:\s*(\d+)/g,': <span style="color:#fb923c">$1</span>')}

function completeLesson(){localStorage.setItem('aisb_lesson_5','complete');const btn=document.getElementById('completeBtn');btn.textContent='\u2713 Lesson Complete — 260 XP Earned!';btn.classList.add('done');document.getElementById('lessonProgress').style.width='100%';document.getElementById('lessonPct').textContent='100%'}
if(localStorage.getItem('aisb_lesson_5')==='complete'){document.getElementById('completeBtn').textContent='\u2713 Complete';document.getElementById('completeBtn').classList.add('done')}
</script>
