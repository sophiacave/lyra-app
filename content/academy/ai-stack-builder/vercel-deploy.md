---
title: "Vercel Deploy"
course: "ai-stack-builder"
order: 8
type: "lesson"
free: false
---<div class="container">
<div class="nav">

<span class="current">Lesson 8 of 10</span>

</div>

<div class="lesson-badge">MODULE 3 &middot; 260 XP</div>
<h1>Vercel Deploy</h1>
<p class="intro">Vercel turns <code style="color:#f59e0b">git push</code> into a live URL. No servers, no Docker, no YAML. Push code, get a website. Let's simulate the full pipeline.</p>

<h2>The Deploy Pipeline</h2>
<p>Click "Deploy" to watch code go from your machine to a live global CDN (Content Delivery Network — servers around the world that serve your site from the closest location to each visitor).</p>
<p style="font-size:.8rem;color:#666;font-style:italic">This is a simulation — the pipeline below shows what happens when you deploy to Vercel, but runs entirely in your browser. In production, this process is triggered automatically when you <code>git push</code> to your repo.</p>

<div class="pipeline">
<div class="pipeline-steps">
<div class="pipe-step" id="ps0"><span class="pipe-icon">&#x1f4bb;</span><span class="pipe-name">git push</span></div>
<span class="pipe-arrow" id="pa0">&#x2192;</span>
<div class="pipe-step" id="ps1"><span class="pipe-icon">&#x1f50d;</span><span class="pipe-name">Detect</span></div>
<span class="pipe-arrow" id="pa1">&#x2192;</span>
<div class="pipe-step" id="ps2"><span class="pipe-icon">&#x1f3d7;</span><span class="pipe-name">Build</span></div>
<span class="pipe-arrow" id="pa2">&#x2192;</span>
<div class="pipe-step" id="ps3"><span class="pipe-icon">&#x1f310;</span><span class="pipe-name">Deploy</span></div>
<span class="pipe-arrow" id="pa3">&#x2192;</span>
<div class="pipe-step" id="ps4"><span class="pipe-icon">&#x2705;</span><span class="pipe-name">Live!</span></div>
</div>
<div class="pipe-status">
<div class="status-text" id="statusText">Ready to deploy</div>
<div class="status-url" id="statusUrl">https://your-app-abc123.vercel.app</div>
</div>
</div>

<button class="deploy-btn" id="deployBtn" onclick="runDeploy()">&#x1f680; Deploy to Vercel</button>

<p style="font-size:.75rem;color:#555;text-align:center;margin-top:-.5rem;display:none" id="buildLogNote">Simulated build output — real logs appear in your Vercel dashboard after deployment.</p>

<h2>Environment Variables</h2>
<p>Secrets go in Vercel's environment variables — never in your code. Configure them here.</p>
<div class="panel" style="margin-bottom:1rem;padding:1rem 1.25rem">
<p style="font-size:.85rem;margin-bottom:.5rem"><strong>Public vs. Secret — the critical difference:</strong></p>
<p style="font-size:.85rem;color:#999;margin-bottom:.5rem">Variables starting with <code style="color:#f59e0b">NEXT_PUBLIC_</code> are <strong>exposed to the browser</strong>. Anyone can see them in your page source. This is fine for your Supabase URL and anon key (they're designed to be public — RLS protects your data).</p>
<p style="font-size:.85rem;color:#ef4444;margin-bottom:0">Variables <strong>without</strong> that prefix are <strong>secret</strong> — they only exist on the server. API keys, service role keys, and Stripe secret keys must NEVER start with <code style="color:#ef4444">NEXT_PUBLIC_</code>. If you accidentally expose a secret key, revoke it immediately in that service's dashboard.</p>
</div>

<div class="config-editor">
<div class="panel label" style="padding:0;background:none;border:none;margin-bottom:.75rem">Environment Variables</div>
<div id="envRows">
<div class="env-row">
<input class="env-key" value="NEXT_PUBLIC_SUPABASE_URL" readonly>
<input class="env-val" value="https://vpaynwebgmmnwttqkwmh.supabase.co">
<span class="env-type">Public</span>
</div>
<div class="env-row">
<input class="env-key" value="NEXT_PUBLIC_SUPABASE_ANON_KEY" readonly>
<input class="env-val" value="eyJhbGciOi..." type="password">
<span class="env-type">Public</span>
</div>
<div class="env-row">
<input class="env-key" value="SUPABASE_SERVICE_ROLE_KEY" readonly>
<input class="env-val" value="eyJhbGciOi..." type="password">
<span class="env-type">Secret</span>
</div>
<div class="env-row">
<input class="env-key" value="STRIPE_SECRET_KEY" readonly>
<input class="env-val" value="sk_live_..." type="password">
<span class="env-type">Secret</span>
</div>
</div>
<button class="add-env" onclick="addEnv()">+ Add Variable</button>
</div>

<h2>Key Concepts</h2>
<div class="concept-grid">
<div class="concept-card">
<h4>&#x1f50d; Preview Deploys</h4>
<p>Every PR gets its own URL. Test changes before merging to main.</p>
</div>
<div class="concept-card">
<h4>&#x1f310; Edge Network</h4>
<p>Your site is served from 50+ global PoPs. Users hit the closest one.</p>
</div>
<div class="concept-card">
<h4>&#x1f512; Environment Vars</h4>
<p>Separate configs for Production, Preview, and Development.</p>
</div>
<div class="concept-card">
<h4>&#x1f517; Custom Domains</h4>
<p>Point your domain to Vercel. SSL is automatic. Zero config.</p>
</div>
</div>

<div class="panel">
<div class="label">Deploy from CLI</div>
<p style="font-size:.85rem;color:#999;margin-bottom:.5rem">These terminal commands let you deploy without leaving your editor. Most of the time you'll just <code style="color:#f59e0b">git push</code> and let Vercel's GitHub integration handle it automatically. The CLI is useful for quick previews or when you want to deploy without committing.</p>
<div class="code-block">
<span class="cm"># Install Vercel CLI</span><br>
<span class="kw">npm</span> i -g vercel<br><br>
<span class="cm"># Link your project</span><br>
<span class="kw">vercel</span> link<br><br>
<span class="cm"># Deploy to preview</span><br>
<span class="kw">vercel</span><br><br>
<span class="cm"># Deploy to production</span><br>
<span class="kw">vercel</span> --prod<br><br>
<span class="cm"># Or just push to main — Vercel watches your repo</span><br>
<span class="kw">git</span> push origin main <span class="cm"># auto-deploys!</span>
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
let deployed=false;
const logLines=[
{t:'dim',m:'Cloning repository...'},
{t:'dim',m:'Detected Next.js project'},
{t:'dim',m:'Installing dependencies...'},
{t:'dim',m:'npm packages: 847 installed in 12.3s'},
{t:'ok',m:'Dependencies installed'},
{t:'dim',m:'Running next build...'},
{t:'dim',m:'Creating optimized production build...'},
{t:'dim',m:'Compiled successfully'},
{t:'dim',m:'Collecting page data...'},
{t:'info',m:'Route (app) | Size | First Load JS'},
{t:'dim',m:'\u250c /                    | 5.2 kB | 87.4 kB'},
{t:'dim',m:'\u251c /academy             | 3.1 kB | 85.3 kB'},
{t:'dim',m:'\u2514 /api/webhook         | 0 B    | 0 B (Edge)'},
{t:'ok',m:'Build completed in 34.2s'},
{t:'dim',m:'Deploying to Vercel Edge Network...'},
{t:'dim',m:'Uploading build artifacts (2.4 MB)...'},
{t:'dim',m:'Assigning domain...'},
{t:'ok',m:'Deployment complete!'},
{t:'info',m:'URL: https://your-app-abc123.vercel.app'},
{t:'info',m:'Production: https://likeone.ai'},
{t:'ok',m:'All checks passed. Site is LIVE.'}
];

function runDeploy(){
const btn=document.getElementById('deployBtn');btn.disabled=true;btn.textContent='Deploying...';
const log=document.getElementById('buildLog');log.style.display='block';log.innerHTML='';document.getElementById('buildLogNote').style.display='block';
const steps=['ps0','ps1','ps2','ps3','ps4'];
const arrows=['pa0','pa1','pa2','pa3'];
let i=0;
function nextLog(){
if(i>=logLines.length){
document.getElementById('statusText').textContent='Deployed successfully!';document.getElementById('statusText').style.color='#22c55e';
document.getElementById('statusUrl').style.display='block';
btn.textContent='\u2713 Deployed!';btn.style.background='linear-gradient(135deg,#22c55e,#16a34a)';
deployed=true;updateProg();return}
const l=logLines[i];
const div=document.createElement('div');div.className='log-line log-'+l.t;div.textContent=(l.t==='dim'?'  ':l.t==='ok'?'\u2713 ':l.t==='info'?'\u2139 ':'')+l.m;
log.appendChild(div);log.scrollTop=log.scrollHeight;
// Activate pipeline steps
const stepIdx=i<2?0:i<5?1:i<14?2:i<18?3:4;
steps.forEach((s,si)=>{const el=document.getElementById(s);el.classList.toggle('active',si<=stepIdx);if(si<stepIdx)el.classList.add('done')});
arrows.forEach((a,ai)=>document.getElementById(a).classList.toggle('active',ai<stepIdx));
document.getElementById('statusText').textContent=['Pushing...','Detecting framework...','Building...','Deploying to edge...','Live!'][stepIdx];
i++;setTimeout(nextLog,i<5?300:i<14?200:300)}
nextLog();updateProg()}

function addEnv(){const rows=document.getElementById('envRows');const div=document.createElement('div');div.className='env-row';div.innerHTML='<input class="env-key" placeholder="VARIABLE_NAME"><input class="env-val" placeholder="value"><span class="env-type">Secret</span><button class="del-env" onclick="this.parentElement.remove()">&times;</button>';rows.appendChild(div);updateProg()}

let actions=0;function updateProg(){actions++;const p=Math.min(100,deployed?100:actions*20);document.getElementById('lessonProgress').style.width=p+'%';document.getElementById('lessonPct').textContent=p+'%'}
function completeLesson(){localStorage.setItem('aisb_lesson_8','complete');const btn=document.getElementById('completeBtn');btn.textContent='\u2713 Lesson Complete — 260 XP Earned!';btn.classList.add('done');document.getElementById('lessonProgress').style.width='100%';document.getElementById('lessonPct').textContent='100%'}
if(localStorage.getItem('aisb_lesson_8')==='complete'){document.getElementById('completeBtn').textContent='\u2713 Complete';document.getElementById('completeBtn').classList.add('done')}
</script>
