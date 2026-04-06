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
  <h1>Vercel Deploy</h1>
  <p class="sub">Vercel turns <code style="color:#f59e0b">git push</code> into a live URL. No servers, no Docker, no YAML. Push code, get a website. Let's simulate the full pipeline.</p>
</div>

<h2>The Deploy Pipeline</h2>
<p>Click "Deploy" to watch code go from your machine to a live global CDN (Content Delivery Network — servers around the world that serve your site from the closest location to each visitor).</p>
<p style="font-size:.8rem;color:#666;font-style:italic">This is a simulation — the pipeline below shows what happens when you deploy to Vercel, but runs entirely in your browser. In production, this process is triggered automatically when you <code>git push</code> to your repo.</p>

<div class="panel">
<div class="label">The Deploy Pipeline</div>
<p style="font-size:.9rem"><strong>git push</strong> &rarr; <strong>Detect</strong> (Vercel identifies your framework) &rarr; <strong>Build</strong> (compiles your app) &rarr; <strong>Deploy</strong> (distributes to global CDN) &rarr; <strong>Live!</strong> (your site is accessible at a unique URL)</p>
<p style="font-size:.85rem;color:#888">The entire process typically takes 30-90 seconds. Vercel watches your GitHub repo and triggers this pipeline automatically on every push to main.</p>
</div>

<h2>Environment Variables</h2>
<p>Secrets go in Vercel's environment variables — never in your code. Configure them here.</p>
<div class="panel" style="margin-bottom:1rem;padding:1rem 1.25rem">
<p style="font-size:.85rem;margin-bottom:.5rem"><strong>Public vs. Secret — the critical difference:</strong></p>
<p style="font-size:.85rem;color:#999;margin-bottom:.5rem">Variables starting with <code style="color:#f59e0b">NEXT_PUBLIC_</code> are <strong>exposed to the browser</strong>. Anyone can see them in your page source. This is fine for your Supabase URL and anon key (they're designed to be public — RLS protects your data).</p>
<p style="font-size:.85rem;color:#ef4444;margin-bottom:0">Variables <strong>without</strong> that prefix are <strong>secret</strong> — they only exist on the server. API keys, service role keys, and Stripe secret keys must NEVER start with <code style="color:#ef4444">NEXT_PUBLIC_</code>. If you accidentally expose a secret key, revoke it immediately in that service's dashboard.</p>
</div>

<div class="panel">
<div class="label">Typical Environment Variables</div>
<div class="code-block">
<span class="cm"># Public (safe for browser — RLS protects data)</span><br>
<span class="kw">NEXT_PUBLIC_SUPABASE_URL</span>=https://&lt;your-ref&gt;.supabase.co<br>
<span class="kw">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>=eyJhbGciOi...<br><br>
<span class="cm"># Secret (server-side only — NEVER prefix with NEXT_PUBLIC_)</span><br>
<span class="kw">SUPABASE_SERVICE_ROLE_KEY</span>=eyJhbGciOi...<br>
<span class="kw">STRIPE_SECRET_KEY</span>=sk_live_...
</div>
<p style="font-size:.85rem;color:#888">Set these in the Vercel dashboard under Settings &rarr; Environment Variables. You can configure different values for Production, Preview, and Development environments.</p>
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


<div data-learn="QuizMC" data-props='{"title":"Vercel Deploy Quiz","questions":[{"q":"What happens automatically when you push to the main branch on GitHub?","options":["Nothing — you must run vercel --prod manually","Vercel detects the push and triggers a production deployment","A preview deployment is created but not promoted to production","Vercel sends you an email to confirm the deploy"],"correct":1,"explanation":"When you connect your GitHub repo to Vercel, it watches for pushes to the main branch and automatically triggers a production deployment. No manual step needed — git push is the entire deploy workflow."},{"q":"What is the purpose of a preview deployment?","options":["To deploy to a staging server","Each pull request gets its own unique URL so you can test changes before merging","To reduce production costs","To test environment variables"],"correct":1,"explanation":"Vercel creates a unique preview URL for every pull request. You can share the URL with teammates, test the changes in a real browser, and confirm everything works before merging to main and deploying to production."},{"q":"Which environment variable prefix exposes values to the browser in Next.js?","options":["PUBLIC_","BROWSER_","NEXT_PUBLIC_","CLIENT_"],"correct":2,"explanation":"In Next.js, only variables prefixed with NEXT_PUBLIC_ are included in the browser bundle. All other environment variables remain server-side only. This distinction is critical — secret keys (Stripe, service role) must never use this prefix."}]}'></div>


<div data-learn="FlashDeck" data-props='{"title":"Vercel Deploy Flashcards","cards":[{"front":"What is a CDN (Content Delivery Network) and why does Vercel use one?","back":"A CDN is a network of servers distributed globally. When a user requests your site, it is served from the closest server (Point of Presence / PoP). Vercel has 50+ PoPs, so users in Tokyo get served from Tokyo — reducing latency and improving performance for everyone."},{"front":"What should you do if you accidentally commit a secret key to git?","back":"Immediately revoke the exposed key in that service\u0027s dashboard (Stripe, Supabase, etc.) and generate a new one. Assume the key is already compromised — git history is public. Update your environment variables with the new key and redeploy."},{"front":"What is the difference between vercel and vercel --prod?","back":"vercel (without --prod) creates a preview deployment — a unique URL for testing. vercel --prod promotes the build to production and updates your main domain. Most teams use git push to trigger --prod automatically via the GitHub integration."}]}'></div>

</div>
