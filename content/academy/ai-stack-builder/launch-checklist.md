---
title: "Launch Checklist"
course: "ai-stack-builder"
order: 10
type: "lesson"
free: false
---<div class="container">
<div class="nav">
<a href="wire-it-all.html">&larr; Prev</a>
<span class="current">Lesson 10 of 10</span>
<a href="index.html">Course &rarr;</a>
</div>

<div class="lesson-badge">MODULE 3 &middot; 260 XP</div>
<h1>Launch Checklist</h1>
<p class="intro">Before you ship, run through every item. 20 checks across 4 categories. Miss one, and your launch could stumble. Check them all for the full celebration.</p>

<div style="background:#111118;border:1px solid #f59e0b33;border-radius:12px;padding:1.5rem;margin:1.5rem 0">
<p style="color:#f59e0b;font-weight:700;font-size:.9rem;margin-bottom:.75rem">Before you start</p>
<p style="font-size:.9rem;color:#ccc;margin-bottom:.75rem">This checklist assumes you've completed the previous 9 lessons. Each item connects back to skills you've already learned. If anything feels unfamiliar, revisit the lesson where it was covered.</p>
<p style="font-size:.85rem;color:#999;margin-bottom:0"><strong style="color:#ccc">Jargon cheat sheet:</strong></p>
<ul style="list-style:none;padding:0;margin:.5rem 0 0 0;font-size:.82rem;color:#999;line-height:2">
<li><strong style="color:#f59e0b">RLS (Row Level Security)</strong> — database rules that control who can read/write each row. Like a bouncer for your data.</li>
<li><strong style="color:#f59e0b">CORS (Cross-Origin Resource Sharing)</strong> — browser security that controls which websites can call your API. Prevents strangers from using your backend.</li>
<li><strong style="color:#f59e0b">Tree-shaking</strong> — automatically removing unused code from your final bundle, so users download less JavaScript.</li>
<li><strong style="color:#f59e0b">Cache-Control</strong> — an HTTP header that tells browsers how long to keep a copy of a file before re-downloading it.</li>
<li><strong style="color:#f59e0b">Indexes</strong> — a database optimization (like a book's index) that makes lookups fast instead of scanning every row.</li>
</ul>
</div>

<div class="overall-progress">
<div class="big-num" id="bigNum">0</div>
<div class="of-total">of 20 items checked</div>
<div class="overall-bar"><div class="overall-fill" id="overallFill" style="width:0%"></div></div>
<div class="cat-progress">
<span class="cat-badge" id="catBadge0">Security 0/5</span>
<span class="cat-badge" id="catBadge1">Performance 0/5</span>
<span class="cat-badge" id="catBadge2">UX 0/5</span>
<span class="cat-badge" id="catBadge3">Revenue 0/5</span>
</div>
</div>

<div id="checklistContainer"></div>

<div class="celebration" id="celebration">
<span class="cel-icon">&#x1f680;</span>
<h2>Ready to Launch!</h2>
<p>All 20 items checked. Your product is ready for the world. Ship it.</p>
</div>

<div class="progress-section">
<div style="display:flex;justify-content:space-between;font-size:.85rem;color:#999">
<span>Lesson Progress</span><span id="lessonPct">0%</span>
</div>
<div class="progress-bar"><div class="progress-fill" id="lessonProgress" style="width:0%"></div></div>
</div>
<button class="complete-btn" id="completeBtn" onclick="completeLesson()">Complete Lesson & Earn 260 XP</button>
<div class="nav" style="border-top:1px solid #1e1e2e;border-bottom:none;margin-top:0;padding-top:1rem">
<a href="wire-it-all.html">&larr; Wire It All Together</a>
<a href="index.html">Course Overview &rarr;</a>
</div>
<div class="footer">Like One Academy &copy; 2026</div>
</div>
<div class="confetti" id="confetti"></div>

<script>
const categories=[
{name:'Security',icon:'&#x1f512;',items:[
{title:'Enable RLS on all tables',desc:'<strong>Where:</strong> Supabase Dashboard &rarr; Table Editor &rarr; select a table &rarr; click "RLS Disabled" button at the top.<br><br>Row Level Security (RLS) prevents unauthorized data access. Every table in Supabase needs RLS enabled, even if you use a permissive policy. (Covered in Lesson 3)'},
{title:'Verify Stripe webhook signatures',desc:'<strong>Where:</strong> Stripe Dashboard &rarr; Developers &rarr; Webhooks &rarr; your endpoint &rarr; "Signing secret".<br><br>Always call constructEvent() with your webhook secret. Never trust raw POST data — anyone can send a fake event to your endpoint. (Covered in Lesson 7)'},
{title:'Store secrets in environment variables',desc:'<strong>Where:</strong> Vercel Dashboard &rarr; your project &rarr; Settings &rarr; Environment Variables. For edge functions: Supabase Dashboard &rarr; Edge Functions &rarr; Secrets.<br><br>Never commit API keys, passwords, or secrets to git. Use Vercel environment variables and Deno.env.get() in edge functions. (Covered in Lesson 4)'},
{title:'Set CORS headers correctly',desc:'<strong>Where:</strong> In your edge function code (the corsHeaders object). No dashboard UI for this — it\'s set in code.<br><br>Don\'t use Access-Control-Allow-Origin: * in production. Whitelist your specific domains to prevent cross-origin attacks. (Covered in Lesson 4)'},
{title:'Enable Supabase email confirmation',desc:'<strong>Where:</strong> Supabase Dashboard &rarr; Authentication &rarr; Providers &rarr; Email &rarr; toggle "Confirm email".<br><br>Require email verification before granting access. Prevents fake signups and protects your user base. (Covered in Lesson 3)'}
]},
{name:'Performance',icon:'&#x26a1;',items:[
{title:'Optimize images (WebP, lazy loading)',desc:'<strong>Where:</strong> Your code editor — add <code>loading="lazy"</code> to &lt;img&gt; tags. Use an online tool like squoosh.app to convert images to WebP format.<br><br>Use next/image or manual lazy loading. Convert PNGs to WebP. Images are usually the #1 performance bottleneck. (Covered in Lesson 8)'},
{title:'Enable caching headers',desc:'<strong>Where:</strong> Vercel Dashboard &rarr; your project &rarr; Settings &rarr; Headers. Or in your vercel.json config file.<br><br>Set Cache-Control headers (tells browsers how long to keep files) for static assets (1 year) and API responses (appropriate TTL). Vercel handles this for static files automatically. (Covered in Lesson 8)'},
{title:'Minimize JavaScript bundle size',desc:'<strong>Where:</strong> Your terminal — run <code>next build</code> or <code>npm run build</code> and check the output for file sizes.<br><br>Tree-shake (remove unused code automatically) and dynamic-import heavy components. Check bundle size with next build — aim for under 100KB first load. (Covered in Lesson 8)'},
{title:'Add database indexes',desc:'<strong>Where:</strong> Supabase Dashboard &rarr; SQL Editor &rarr; run: <code>CREATE INDEX idx_name ON table_name(column_name);</code><br><br>Create indexes (think of them like a book\'s index — they help the database find things fast) on frequently queried columns (email, key, created_at). Without indexes, every query scans every row. (Covered in Lesson 3)'},
{title:'Test on slow connections',desc:'<strong>Where:</strong> Chrome browser &rarr; right-click &rarr; Inspect &rarr; Network tab &rarr; click "No throttling" dropdown &rarr; select "Slow 3G".<br><br>Your site should be usable, not just functional, on slow connections. This reveals loading issues you\'d never notice on fast Wi-Fi. (Covered in Lesson 8)'}
]},
{name:'UX',icon:'&#x1f3a8;',items:[
{title:'Mobile responsive on all pages',desc:'<strong>Where:</strong> Chrome browser &rarr; right-click &rarr; Inspect &rarr; click the phone/tablet icon (top-left of DevTools) &rarr; select "iPhone SE" from device dropdown.<br><br>Test every page on 375px width (iPhone SE). Check forms, modals, and navigation. Use CSS grid/flexbox, not fixed widths. (Covered in Lesson 8)'},
{title:'Loading states for all async actions',desc:'<strong>Where:</strong> In your frontend code — anywhere you have a button with an onclick that calls an API.<br><br>Every button that triggers an API call needs a loading spinner or disabled state. Users should never wonder "did it work?" (Covered in Lesson 9)'},
{title:'Error messages are human-readable',desc:'<strong>Where:</strong> In your frontend code — look for catch blocks and error handlers.<br><br>Replace "500 Internal Server Error" with "Something went wrong. Please try again." Show specific errors for forms (invalid email, etc). (Covered in Lesson 9)'},
{title:'Success confirmation for key actions',desc:'<strong>Where:</strong> In your frontend code — after successful API responses (subscribe, purchase, signup).<br><br>After subscribe, purchase, or signup — show a clear success state. Redirect to a thank-you page or show an inline confirmation. (Covered in Lesson 9)'},
{title:'Favicon and meta tags set',desc:'<strong>Where:</strong> In your HTML &lt;head&gt; section. Favicon: add <code>&lt;link rel="icon" href="/favicon.ico"&gt;</code>. Meta tags: add <code>&lt;meta property="og:image" content="..."&gt;</code>.<br><br>Set title, description, og:image for social sharing. Add a favicon. These tiny details make your product look professional. (Covered in Lesson 8)'}
]},
{name:'Revenue',icon:'&#x1f4b0;',items:[
{title:'Stripe in live mode (not test)',desc:'<strong>Where:</strong> Stripe Dashboard &rarr; toggle "Test mode" switch (top-right) to OFF. Then: Developers &rarr; API keys &rarr; copy your live keys.<br><br>Switch from sk_test_ to sk_live_ keys. Create real products and prices. Verify your Stripe account for payouts. (Covered in Lesson 7)'},
{title:'Payment success page works',desc:'<strong>Where:</strong> Stripe Dashboard &rarr; Products &rarr; your payment link &rarr; "After payment" settings. Or in your code: the success_url parameter in your checkout session.<br><br>After Stripe checkout, users should land on a success page that confirms their purchase and provides next steps (access, download, etc). (Covered in Lesson 7)'},
{title:'Payment failure handling',desc:'<strong>Where:</strong> In your checkout session code — set the cancel_url parameter. Also in your frontend: handle the redirect from Stripe when payment fails.<br><br>If payment fails, redirect to an error page with a retry option. Don\'t leave users on a blank page or Stripe\'s generic error. (Covered in Lesson 7)'},
{title:'Revenue tracking in database',desc:'<strong>Where:</strong> In your Stripe webhook handler (edge function) — after verifying the event, insert a row into your revenue table via Supabase.<br><br>Every successful payment should be logged in your revenue table with amount, product, customer email, and Stripe session ID. (Covered in Lessons 5 &amp; 7)'},
{title:'Automated welcome/receipt email',desc:'<strong>Where:</strong> In your Stripe webhook handler — after a successful checkout.session.completed event, call the Resend API to send an email.<br><br>Send a confirmation email immediately after purchase via Resend. Include what they bought, how to access it, and support contact. (Covered in Lesson 6)'}
]}
];

const state=JSON.parse(localStorage.getItem('aisb_checklist')||'{}');

function render(){
const container=document.getElementById('checklistContainer');
let html='';
let totalChecked=0;
const catCounts=[0,0,0,0];
categories.forEach((cat,ci)=>{
let catChecked=0;
html+='<div class="category"><div class="cat-header"><span class="cat-icon">'+cat.icon+'</span><span class="cat-name">'+cat.name+'</span><span class="cat-count" id="catCount'+ci+'">0/'+cat.items.length+'</span></div>';
cat.items.forEach((item,ii)=>{
const key=ci+'-'+ii;
const checked=state[key]||false;
if(checked){catChecked++;totalChecked++}
html+='<div class="check-item'+(checked?' checked':'')+'" onclick="toggleCheck(\''+key+'\',event)" data-key="'+key+'">';
html+='<div class="checkbox"></div>';
html+='<div class="check-content"><div class="check-title">'+item.title+'</div><div class="check-desc">'+item.desc+'</div></div>';
html+='<span class="expand-hint">&#x25B8;</span></div>'});
catCounts[ci]=catChecked;
html+='</div>'});
container.innerHTML=html;

document.getElementById('bigNum').textContent=totalChecked;
const pct=Math.round(totalChecked/20*100);
const fill=document.getElementById('overallFill');
fill.style.width=pct+'%';
if(totalChecked===20)fill.classList.add('complete');else fill.classList.remove('complete');

categories.forEach((cat,ci)=>{
const badge=document.getElementById('catBadge'+ci);
badge.textContent=cat.name+' '+catCounts[ci]+'/'+cat.items.length;
badge.classList.toggle('done',catCounts[ci]===cat.items.length);
document.getElementById('catCount'+ci).textContent=catCounts[ci]+'/'+cat.items.length});

document.getElementById('lessonProgress').style.width=pct+'%';
document.getElementById('lessonPct').textContent=pct+'%';

if(totalChecked===20){
document.getElementById('celebration').classList.add('active');
launchConfetti()}}

function toggleCheck(key,e){
const item=e.currentTarget;
// Toggle expand on description click
if(e.target.closest('.check-desc')){return}
// If clicking the checkbox area or title, toggle check
if(e.target.closest('.checkbox')||e.target.closest('.check-title')){
state[key]=!state[key];
localStorage.setItem('aisb_checklist',JSON.stringify(state));
render();return}
// Otherwise toggle expand
item.classList.toggle('expanded')}

function launchConfetti(){
const container=document.getElementById('confetti');
container.innerHTML='';
const colors=['#f59e0b','#22c55e','#3b82f6','#ef4444','#c084fc','#f97316'];
for(let i=0;i<60;i++){
const piece=document.createElement('div');
piece.className='confetti-piece';
piece.style.left=Math.random()*100+'%';
piece.style.background=colors[Math.floor(Math.random()*colors.length)];
piece.style.animationDelay=Math.random()*2+'s';
piece.style.animationDuration=(2+Math.random()*2)+'s';
piece.style.width=(6+Math.random()*8)+'px';
piece.style.height=(6+Math.random()*8)+'px';
container.appendChild(piece)}
setTimeout(()=>container.innerHTML='',5000)}

function completeLesson(){localStorage.setItem('aisb_lesson_10','complete');const btn=document.getElementById('completeBtn');btn.textContent='\u2713 Course Complete — 260 XP Earned!';btn.classList.add('done');document.getElementById('lessonProgress').style.width='100%';document.getElementById('lessonPct').textContent='100%'}
if(localStorage.getItem('aisb_lesson_10')==='complete'){document.getElementById('completeBtn').textContent='\u2713 Complete';document.getElementById('completeBtn').classList.add('done')}

render();
</script>
