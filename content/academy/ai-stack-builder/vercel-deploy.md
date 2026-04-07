---
title: "Vercel Deploy"
course: "ai-stack-builder"
order: 8
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-stack-builder/">AI Stack Builder</a>
  <span class="lesson-badge">Lesson 8 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Vercel <span class="accent">Deploy</span></h1>
  <p class="sub">Vercel turns <code style="color:#f59e0b">git push</code> into a live URL. No servers, no Docker, no YAML. Push code, get a website. This is the deployment layer of your AI stack — and it eliminates an entire category of DevOps work.</p>
</div>

<div class="content">

<div class="card">
<h2>Why Vercel Changes Everything</h2>
<p>Traditional deployment means provisioning servers, configuring Nginx, setting up SSL certificates, building CI/CD pipelines, and praying nothing breaks at 2am. Vercel replaces <strong style="color:#e5e5e5">all of that</strong> with one concept: push to GitHub, get a live site.</p>

<p>Vercel built Next.js, so the integration is seamless — zero configuration, automatic optimizations, and deployment that works the way it should: instantly and invisibly.</p>

<div style="display:flex;gap:1rem;flex-wrap:wrap;margin-top:1.25rem">
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(52,211,153,.06);border-radius:10px;border:1px solid rgba(52,211,153,.12);flex:1;min-width:160px">
<div style="font-size:1.25rem">&#x26a1;</div>
<div><div style="font-size:.8rem;font-weight:700;color:#34d399;margin-bottom:.2rem">30-90 sec</div><div style="font-size:.78rem;color:#71717a;line-height:1.5">From git push to live production URL — fully automated</div></div>
</div>
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(139,92,246,.06);border-radius:10px;border:1px solid rgba(139,92,246,.12);flex:1;min-width:160px">
<div style="font-size:1.25rem">&#x1f310;</div>
<div><div style="font-size:.8rem;font-weight:700;color:#8b5cf6;margin-bottom:.2rem">50+ PoPs</div><div style="font-size:.78rem;color:#71717a;line-height:1.5">Global edge network — users hit the closest server automatically</div></div>
</div>
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(251,146,60,.06);border-radius:10px;border:1px solid rgba(251,146,60,.12);flex:1;min-width:160px">
<div style="font-size:1.25rem">&#x1f512;</div>
<div><div style="font-size:.8rem;font-weight:700;color:#fb923c;margin-bottom:.2rem">Auto SSL</div><div style="font-size:.78rem;color:#71717a;line-height:1.5">HTTPS certificates provisioned and renewed automatically — zero config</div></div>
</div>
</div>
</div>

<div class="card">
<h2>The Deploy Pipeline</h2>
<p>Every time you push to your main branch, Vercel triggers this exact sequence. Understanding it helps you debug when something goes wrong.</p>

<div style="display:grid;gap:.3rem;margin-top:1rem;font-size:.85rem;color:#a1a1aa;line-height:2">
<div style="padding:.5rem .75rem;background:rgba(52,211,153,.04);border-radius:6px"><span style="color:#34d399;font-weight:700">1.</span> <strong style="color:#e5e5e5">git push origin main</strong> — your code reaches GitHub</div>
<div style="padding:.5rem .75rem;background:rgba(139,92,246,.04);border-radius:6px"><span style="color:#8b5cf6;font-weight:700">2.</span> <strong style="color:#e5e5e5">Detect</strong> — Vercel identifies your framework (Next.js, React, Astro, etc.) automatically</div>
<div style="padding:.5rem .75rem;background:rgba(251,146,60,.04);border-radius:6px"><span style="color:#fb923c;font-weight:700">3.</span> <strong style="color:#e5e5e5">Install</strong> — runs <code style="color:#f59e0b">npm install</code> to fetch dependencies</div>
<div style="padding:.5rem .75rem;background:rgba(244,114,182,.04);border-radius:6px"><span style="color:#f472b6;font-weight:700">4.</span> <strong style="color:#e5e5e5">Build</strong> — compiles your app (<code style="color:#f59e0b">next build</code> for Next.js), catches errors here</div>
<div style="padding:.5rem .75rem;background:rgba(56,189,248,.04);border-radius:6px"><span style="color:#38bdf8;font-weight:700">5.</span> <strong style="color:#e5e5e5">Deploy</strong> — distributes the built assets to 50+ global edge servers</div>
<div style="padding:.5rem .75rem;background:rgba(52,211,153,.04);border-radius:6px"><span style="color:#34d399;font-weight:700">6.</span> <strong style="color:#e5e5e5">Live!</strong> — your site is accessible at <code style="color:#f59e0b">your-project.vercel.app</code> (and your custom domain)</div>
</div>

<div style="background:rgba(52,211,153,.06);border:1px solid rgba(52,211,153,.12);border-radius:12px;padding:1rem;margin-top:.75rem;font-size:.82rem;color:#a1a1aa;line-height:1.7">
<strong style="color:#e5e5e5">If the build fails:</strong> Vercel does NOT deploy the broken code. Your existing production site stays live and unaffected. Check the build logs in the Vercel dashboard — the error is almost always a TypeScript type error or a missing environment variable.
</div>
</div>

<div class="card">
<h2>Environment Variables: The Security Gate</h2>
<p>Environment variables are how your app accesses secrets (API keys, database URLs) without hardcoding them in your source code. In Next.js, the <code style="color:#f59e0b">NEXT_PUBLIC_</code> prefix is the dividing line between safe and dangerous.</p>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:1rem">
<div style="padding:1rem 1.25rem;background:rgba(52,211,153,.04);border-radius:10px;border:1px solid rgba(52,211,153,.08)">
<strong style="color:#34d399;font-size:.88rem">NEXT_PUBLIC_ (Browser-Safe)</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.5rem 0 0;line-height:1.7">Included in the browser bundle. Anyone can see these in your page source. <strong style="color:#e5e5e5">Only use for values designed to be public</strong> — Supabase URL and anon key are fine (RLS protects data).</p>
</div>
<div style="padding:1rem 1.25rem;background:rgba(239,68,68,.04);border-radius:10px;border:1px solid rgba(239,68,68,.08)">
<strong style="color:#ef4444;font-size:.88rem">No Prefix (Server-Only)</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.5rem 0 0;line-height:1.7">Only accessible in server-side code (API routes, Server Components, middleware). <strong style="color:#e5e5e5">ALL secret keys go here</strong> — Stripe secret, service role key, webhook secrets. Never prefix these with NEXT_PUBLIC_.</p>
</div>
</div>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Vercel Dashboard — Environment Variables</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a"># PUBLIC — safe for browser (RLS protects data)</span>
<span style="color:#34d399">NEXT_PUBLIC_SUPABASE_URL</span>=https://&lt;your-ref&gt;.supabase.co
<span style="color:#34d399">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>=eyJhbGciOi...

<span style="color:#71717a"># SECRET — server-side only (NEVER prefix with NEXT_PUBLIC_)</span>
<span style="color:#ef4444">SUPABASE_SERVICE_ROLE_KEY</span>=eyJhbGciOi...
<span style="color:#ef4444">STRIPE_SECRET_KEY</span>=sk_live_...
<span style="color:#ef4444">STRIPE_WEBHOOK_SECRET</span>=whsec_...
<span style="color:#ef4444">RESEND_API_KEY</span>=re_...</code></pre>
</div>

<div style="background:rgba(239,68,68,.06);border:1px solid rgba(239,68,68,.12);border-radius:12px;padding:1rem;margin-top:.75rem;font-size:.82rem;color:#a1a1aa;line-height:1.7">
<strong style="color:#ef4444">If you accidentally expose a secret:</strong> (1) Immediately revoke the key in that service's dashboard. (2) Generate a new key. (3) Update it in Vercel. (4) Redeploy. Assume the old key is compromised — git history is public and bots scan for leaked secrets within minutes.
</div>
</div>

<div class="card">
<h2>Preview Deploys: Test Before You Ship</h2>
<p>Every pull request gets its own unique URL. This is one of Vercel's most powerful features — it turns code review from "reading diffs" to "clicking a link and testing the actual app."</p>

<div style="display:grid;gap:.75rem;margin-top:1rem">
<div style="display:flex;gap:1rem;align-items:flex-start;padding:1rem 1.25rem;background:rgba(139,92,246,.04);border-radius:10px;border:1px solid rgba(139,92,246,.08)">
<div style="min-width:2.5rem;height:2.5rem;border-radius:50%;background:rgba(139,92,246,.12);display:flex;align-items:center;justify-content:center;font-weight:700;color:#8b5cf6;font-size:.8rem">PR</div>
<div>
<strong style="color:#8b5cf6;font-size:.88rem">How It Works</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0;line-height:1.7">Create a PR on GitHub &rarr; Vercel builds and deploys that branch &rarr; a unique preview URL (like <code style="color:#f59e0b">my-app-git-feature-xyz.vercel.app</code>) appears as a comment on your PR. Click it to test the changes in a real browser. The preview uses the same infrastructure as production.</p>
</div>
</div>
<div style="display:flex;gap:1rem;align-items:flex-start;padding:1rem 1.25rem;background:rgba(52,211,153,.04);border-radius:10px;border:1px solid rgba(52,211,153,.08)">
<div style="min-width:2.5rem;height:2.5rem;border-radius:50%;background:rgba(52,211,153,.12);display:flex;align-items:center;justify-content:center;font-weight:700;color:#34d399;font-size:.8rem">&#x2713;</div>
<div>
<strong style="color:#34d399;font-size:.88rem">Why It Matters</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0;line-height:1.7">Preview deploys catch problems that code review misses — layout bugs, broken links, mobile rendering issues, environment variable misconfigurations. They also let non-technical stakeholders review changes without setting up a local dev environment.</p>
</div>
</div>
</div>
</div>

<div class="card">
<h2>Custom Domains</h2>
<p>Pointing your domain to Vercel takes two steps. SSL certificates are provisioned and renewed automatically — no more expired cert emergencies.</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">DNS — Custom domain setup</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a"># Step 1: Add domain in Vercel dashboard</span>
<span style="color:#71717a"># Project → Settings → Domains → Add "yourdomain.com"</span>

<span style="color:#71717a"># Step 2: Update DNS at your registrar (Namecheap, Cloudflare, etc.)</span>
<span style="color:#c084fc">Type</span>  <span style="color:#c084fc">Name</span>  <span style="color:#c084fc">Value</span>
<span style="color:#34d399">A</span>     @     <span style="color:#fb923c">76.76.21.21</span>        <span style="color:#71717a"># Vercel's IP</span>
<span style="color:#34d399">CNAME</span> www   <span style="color:#fb923c">cname.vercel-dns.com</span>

<span style="color:#71717a"># Vercel provisions SSL automatically — live in minutes</span></code></pre>
</div>
</div>

<div class="card">
<h2>Deploy from CLI</h2>
<p>Most of the time you will just <code style="color:#f59e0b">git push</code> and let the GitHub integration handle deployment. But the Vercel CLI is useful for quick previews or deploying without committing.</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Terminal — Vercel CLI commands</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a"># Install Vercel CLI globally</span>
<span style="color:#c084fc">npm</span> i -g vercel

<span style="color:#71717a"># Link your local project to Vercel</span>
<span style="color:#c084fc">vercel</span> link

<span style="color:#71717a"># Deploy to preview (unique URL, not production)</span>
<span style="color:#c084fc">vercel</span>

<span style="color:#71717a"># Deploy directly to production</span>
<span style="color:#c084fc">vercel</span> --prod

<span style="color:#71717a"># Pull env vars from Vercel to local .env.local</span>
<span style="color:#c084fc">vercel</span> env pull

<span style="color:#71717a"># Or the simplest path — push to main and forget</span>
<span style="color:#c084fc">git</span> push origin main  <span style="color:#71717a"># auto-deploys to production</span></code></pre>
</div>

<div style="background:rgba(139,92,246,.06);border:1px solid rgba(139,92,246,.12);border-radius:12px;padding:1rem;margin-top:.75rem;font-size:.82rem;color:#a1a1aa;line-height:1.7">
<strong style="color:#e5e5e5">Pro tip: <code style="color:#f59e0b">vercel env pull</code></strong> downloads your Vercel environment variables to a local <code style="color:#f59e0b">.env.local</code> file. This keeps your local dev environment in sync with production without manually copying secrets. The file is automatically gitignored by Next.js.
</div>
</div>

<div class="card">
<h2>Deployment Environments</h2>
<p>Vercel separates your environment variables into three scopes. This prevents your development Stripe key from touching production data.</p>

<div style="overflow-x:auto;margin-top:1rem">
<table style="width:100%;border-collapse:collapse;font-size:.82rem">
<thead>
<tr style="border-bottom:1px solid rgba(255,255,255,.1)">
<th style="text-align:left;padding:.75rem;color:#e5e5e5;font-weight:600">Environment</th>
<th style="text-align:left;padding:.75rem;color:#e5e5e5;font-weight:600">When It Runs</th>
<th style="text-align:left;padding:.75rem;color:#e5e5e5;font-weight:600">Example Use</th>
</tr>
</thead>
<tbody style="color:#a1a1aa">
<tr style="border-bottom:1px solid rgba(255,255,255,.05)">
<td style="padding:.75rem;font-weight:600;color:#34d399">Production</td>
<td style="padding:.75rem">Push to main branch</td>
<td style="padding:.75rem">Live Stripe keys, production Supabase URL, real customer data</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,.05)">
<td style="padding:.75rem;font-weight:600;color:#8b5cf6">Preview</td>
<td style="padding:.75rem">Push to any other branch or PR</td>
<td style="padding:.75rem">Test Stripe keys, staging Supabase, safe to experiment</td>
</tr>
<tr>
<td style="padding:.75rem;font-weight:600;color:#fb923c">Development</td>
<td style="padding:.75rem">Local dev via <code style="color:#f59e0b">vercel dev</code> or <code style="color:#f59e0b">vercel env pull</code></td>
<td style="padding:.75rem">Local Stripe test mode, local Supabase instance</td>
</tr>
</tbody>
</table>
</div>

<div style="background:rgba(52,211,153,.06);border:1px solid rgba(52,211,153,.12);border-radius:12px;padding:1rem;margin-top:.75rem;font-size:.82rem;color:#a1a1aa;line-height:1.7">
<strong style="color:#e5e5e5">The golden rule:</strong> Never use production API keys in development. Stripe test keys (starting with <code style="color:#f59e0b">sk_test_</code>) generate test transactions that do not charge real cards. Supabase lets you branch your database for isolated testing. Keep environments separate.
</div>
</div>

<div class="card">
<h2>Common Deployment Issues</h2>
<p>When a deploy fails, the answer is almost always in the build logs. Here are the most common issues and their fixes.</p>

<div style="overflow-x:auto;margin-top:1rem">
<table style="width:100%;border-collapse:collapse;font-size:.82rem">
<thead>
<tr style="border-bottom:1px solid rgba(255,255,255,.1)">
<th style="text-align:left;padding:.75rem;color:#e5e5e5;font-weight:600">Error</th>
<th style="text-align:left;padding:.75rem;color:#e5e5e5;font-weight:600">Cause</th>
<th style="text-align:left;padding:.75rem;color:#e5e5e5;font-weight:600">Fix</th>
</tr>
</thead>
<tbody style="color:#a1a1aa">
<tr style="border-bottom:1px solid rgba(255,255,255,.05)">
<td style="padding:.75rem"><code style="color:#ef4444">Build failed</code></td>
<td style="padding:.75rem">TypeScript type error or syntax error in code</td>
<td style="padding:.75rem">Run <code style="color:#f59e0b">npm run build</code> locally first — fix all errors before pushing</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,.05)">
<td style="padding:.75rem"><code style="color:#ef4444">NEXT_PUBLIC_* is undefined</code></td>
<td style="padding:.75rem">Environment variable not set in Vercel dashboard</td>
<td style="padding:.75rem">Add the variable in Settings &rarr; Environment Variables &rarr; redeploy</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,.05)">
<td style="padding:.75rem"><code style="color:#ef4444">Page loads blank</code></td>
<td style="padding:.75rem">Missing Supabase URL or anon key — client cannot connect</td>
<td style="padding:.75rem">Check that NEXT_PUBLIC_ vars are set for Production environment</td>
</tr>
<tr>
<td style="padding:.75rem"><code style="color:#ef4444">API route returns 500</code></td>
<td style="padding:.75rem">Server-side env var missing (Stripe key, service role)</td>
<td style="padding:.75rem">Add the variable without NEXT_PUBLIC_ prefix — redeploy</td>
</tr>
</tbody>
</table>
</div>
</div>

<div style="margin:1.5rem 0">
<div data-learn="QuizMC" data-props='{"title":"Vercel Deploy — Mastery Check","questions":[{"q":"What happens automatically when you push to the main branch on GitHub?","options":["Nothing — you must run vercel --prod manually","Vercel detects the push and triggers a production deployment","A preview deployment is created but not promoted to production","Vercel sends you an email to confirm the deploy"],"correct":1,"explanation":"When you connect your GitHub repo to Vercel, it watches for pushes to the main branch and automatically triggers a production deployment. No manual step needed — git push is the entire deploy workflow."},{"q":"What is the purpose of a preview deployment?","options":["To deploy to a staging server","Each pull request gets its own unique URL so you can test changes before merging","To reduce production costs","To test environment variables"],"correct":1,"explanation":"Vercel creates a unique preview URL for every pull request. You can share the URL with teammates, test the changes in a real browser, and confirm everything works before merging to main and deploying to production."},{"q":"Which environment variable prefix exposes values to the browser in Next.js?","options":["PUBLIC_","BROWSER_","NEXT_PUBLIC_","CLIENT_"],"correct":2,"explanation":"In Next.js, only variables prefixed with NEXT_PUBLIC_ are included in the browser bundle. All other environment variables remain server-side only. This distinction is critical — secret keys (Stripe, service role) must never use this prefix."},{"q":"What does the vercel env pull command do?","options":["Uploads local env vars to Vercel","Downloads Vercel environment variables to a local .env.local file","Deletes all environment variables","Shows env var values in the terminal"],"correct":1,"explanation":"vercel env pull downloads your Vercel environment variables to a local .env.local file, keeping your local development in sync with production config. The file is automatically gitignored by Next.js so secrets are not committed."},{"q":"A deploy succeeds but the page loads blank. What is the most likely cause?","options":["The CSS file is missing","NEXT_PUBLIC_SUPABASE_URL is not set in Vercel — the frontend cannot connect to the database","The domain is not configured correctly","Vercel is experiencing an outage"],"correct":1,"explanation":"A blank page after successful deploy usually means the frontend app cannot connect to its data source. If NEXT_PUBLIC_SUPABASE_URL is missing, the Supabase client initializes with undefined and all data fetches fail silently, rendering an empty page."}]}'></div>
</div>

<div data-learn="FlashDeck" data-props='{"title":"Vercel Deploy Flashcards","cards":[{"front":"What is a CDN (Content Delivery Network) and why does Vercel use one?","back":"A CDN is a network of servers distributed globally. When a user requests your site, it is served from the closest server (Point of Presence / PoP). Vercel has 50+ PoPs, so users in Tokyo get served from Tokyo — reducing latency and improving performance for everyone."},{"front":"What should you do if you accidentally commit a secret key to git?","back":"Immediately revoke the exposed key in that service dashboard (Stripe, Supabase, etc.) and generate a new one. Assume the key is already compromised — git history is public. Update your environment variables with the new key and redeploy."},{"front":"What is the difference between vercel and vercel --prod?","back":"vercel (without --prod) creates a preview deployment — a unique URL for testing. vercel --prod promotes the build to production and updates your main domain. Most teams use git push to trigger --prod automatically via the GitHub integration."},{"front":"Why separate environment variables by Production, Preview, and Development?","back":"To prevent test keys from touching production data and vice versa. Production uses live Stripe keys and real customer data. Preview uses test Stripe keys for safe experimentation. Development uses local instances. Mixing them risks charging test cards or corrupting production data."},{"front":"What does vercel env pull do?","back":"Downloads your Vercel environment variables to a local .env.local file. This keeps your local dev environment in sync with production config without manually copying secrets. The file is automatically gitignored by Next.js."},{"front":"What happens if a Vercel build fails?","back":"Vercel does NOT deploy the broken code. Your existing production site stays live and unaffected. The failed build appears in the dashboard with detailed logs showing exactly where the error occurred. Fix the error, push again, and Vercel rebuilds."}]}'></div>

</div>

<div class="progress-footer">
<span class="progress-label">Lesson 8 of 10</span>
<div class="progress-bar-wrap"></div>
<span class="progress-label">Module 1</span>
</div>
</div>
