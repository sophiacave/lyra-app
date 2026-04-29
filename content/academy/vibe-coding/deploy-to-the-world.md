---
title: "Deploy to the World"
course: "vibe-coding"
order: 8
type: "lesson"
free: false
---<div class="wrap">

<nav class="local-nav">
  <a href="/academy/vibe-coding/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 8 of 10</span>
</nav>

<!-- HERO -->
<div class="lesson-hero">
  <h1>Deploy to <span class="accent">the World.</span></h1>
  <p class="sub">From localhost to a real URL in minutes. Vercel, Netlify, Replit hosting — put your app on the internet.</p>
</div>

<!-- LEARNING GOALS -->
<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>What "deploying" actually means (it is simpler than you think)</li>
    <li>Three hosting platforms and which one to pick</li>
    <li>How to go from "it works on my computer" to "anyone can use it"</li>
    <li>How to get a custom domain name for your app</li>
  </ul>
</div>

<!-- SECTION 1: WHAT IS DEPLOYING -->
<div class="lesson-section">
  <span class="section-label">The Basics</span>
  <h2 class="section-title">Deploying = putting your app on the internet.</h2>
  <p class="section-text">Right now, your app lives on your computer. Only you can see it. "Deploying" just means copying it to a server on the internet so anyone with the link can use it. Think of it like the difference between a document on your desktop and one you share via Google Drive.</p>
  <p class="section-text">The word "deploy" sounds intimidating, but in 2026, it is genuinely a few clicks. The platforms we are about to cover handle all the hard stuff — servers, security certificates, global distribution — automatically. <strong>You click a button. Your app goes live.</strong></p>
</div>

<!-- SECTION 2: THE PLATFORMS -->
<div class="lesson-section">
  <span class="section-label">Your Options</span>
  <h2 class="section-title">Three platforms, all free to start.</h2>

  <div class="demo-container" style="padding:1.75rem">
    <div style="display:flex;flex-direction:column;gap:16px">
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(74,222,128,.12);color:var(--green);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0;margin-top:2px">REPLIT</div>
        <div>
          <div style="font-weight:700;font-size:.95rem;margin-bottom:2px">Replit Deploy (Easiest)</div>
          <div style="color:var(--dim);font-size:.85rem">If you built your app on Replit, deployment is one click. Your app is already running on their servers. Just click "Deploy" and share the URL. Free tier available with some limitations on always-on.</div>
        </div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(192,132,252,.12);color:var(--purple);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0;margin-top:2px">VERCEL</div>
        <div>
          <div style="font-weight:700;font-size:.95rem;margin-bottom:2px">Vercel (Most popular)</div>
          <div style="color:var(--dim);font-size:.85rem">The gold standard for web app hosting. Connect your GitHub account, push your code, and Vercel automatically deploys. Free tier is generous — great for most projects. Used by huge companies and solo builders alike.</div>
        </div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(56,189,248,.12);color:#38bdf8;font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0;margin-top:2px">NETLIFY</div>
        <div>
          <div style="font-weight:700;font-size:.95rem;margin-bottom:2px">Netlify (Great alternative)</div>
          <div style="color:var(--dim);font-size:.85rem">Similar to Vercel. Drag and drop your project folder to deploy. Excellent for static sites and simpler apps. Generous free tier. Very beginner-friendly interface.</div>
        </div>
      </div>
    </div>
  </div>

  <div class="tip-box">
    <div class="tip-label">Which one should I pick?</div>
    <p>If you used Replit to build, deploy on Replit. If you used Cursor or Claude Code, use Vercel or Netlify. If you are not sure, <strong>Vercel is the safest default.</strong> All three are free to start.</p>
  </div>
</div>

<!-- SECTION 3: DEPLOYING WITH AI -->
<div class="lesson-section">
  <span class="section-label">The Process</span>
  <h2 class="section-title">Let AI handle the deployment.</h2>
  <p class="section-text">The fastest way to deploy? Tell your AI coding tool to do it. Here are the prompts:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Deploy prompts — use the one that matches your setup</div>
<pre style="margin:0;color:#e5e5e5"><code># If using Vercel:
"Help me deploy this project to Vercel. Walk me
through connecting my GitHub repo and deploying."

# If using Netlify:
"Help me deploy this to Netlify. I want to drag and
drop my project folder to get it live."

# If using Replit:
"Deploy this Repl so anyone with the link can use
it. Make sure it stays running."</code></pre>
</div>

  <p class="section-text">AI will walk you through the specific steps for your project. Different types of apps (static HTML, React, Next.js) have slightly different deployment steps, but AI knows the right process for each one.</p>
</div>

<!-- SECTION 4: CUSTOM DOMAINS -->
<div class="lesson-section">
  <span class="section-label">Level Up</span>
  <h2 class="section-title">Getting a real domain name.</h2>
  <p class="section-text">When you deploy, you get a URL like <strong>your-app.vercel.app</strong> or <strong>your-app.replit.app</strong>. That works fine. But if you want a professional custom domain like <strong>myapp.com</strong>, here is how:</p>

  <div class="tip-box">
    <div class="tip-label">Step 1: Buy a domain</div>
    <p>Go to <strong>Namecheap</strong>, <strong>Google Domains</strong>, or <strong>Cloudflare Registrar</strong>. Search for the name you want. Most .com domains cost $10-15 per year.</p>
  </div>

  <div class="tip-box">
    <div class="tip-label">Step 2: Connect it to your hosting</div>
    <p>In Vercel or Netlify, go to your project settings, click "Domains," and add your domain. They will give you DNS records to add at your domain registrar. Tell AI: "Help me connect my domain [name] to my Vercel project" and it will walk you through the exact steps.</p>
  </div>

  <div class="tip-box">
    <div class="tip-label">Step 3: Wait 15 minutes</div>
    <p>DNS changes take a few minutes to propagate. After that, your custom domain is live. You have a real website with a real URL that you built yourself.</p>
  </div>
</div>

<!-- SECTION 5: WHAT TO CHECK -->
<div class="lesson-section">
  <span class="section-label">Launch Checklist</span>
  <h2 class="section-title">Before you share your link, check these.</h2>

  <div class="demo-container" style="padding:1.75rem">
    <div style="display:flex;flex-direction:column;gap:12px">
      <div style="display:flex;gap:8px;align-items:center;font-size:.9rem;color:var(--dim)">
        <span style="color:var(--green)">&#9745;</span> Does the app work on your phone? (Open the URL on mobile)
      </div>
      <div style="display:flex;gap:8px;align-items:center;font-size:.9rem;color:var(--dim)">
        <span style="color:var(--green)">&#9745;</span> Does the app work in a private/incognito window? (Tests that it works for new users)
      </div>
      <div style="display:flex;gap:8px;align-items:center;font-size:.9rem;color:var(--dim)">
        <span style="color:var(--green)">&#9745;</span> Does the page title make sense? (What shows up in the browser tab)
      </div>
      <div style="display:flex;gap:8px;align-items:center;font-size:.9rem;color:var(--dim)">
        <span style="color:var(--green)">&#9745;</span> Do all the buttons work? (Click everything at least once)
      </div>
      <div style="display:flex;gap:8px;align-items:center;font-size:.9rem;color:var(--dim)">
        <span style="color:var(--green)">&#9745;</span> Is there a favicon? (The tiny icon in the browser tab — ask AI to add one)
      </div>
    </div>
  </div>
</div>

<!-- KEY TAKEAWAY -->
<div class="callout purple">
  <p><strong>The key insight:</strong> Deploying is not the scary, technical process it used to be. <strong>It is a few clicks and a free account.</strong> Your app can be live on the internet in under 5 minutes. The gap between "I built something" and "anyone can use it" has never been smaller.</p>
</div>

<!-- LESSON CHECK -->
<div class="lesson-section">
  <span class="section-label">Quick Check</span>
  <h2 class="section-title">Lock it in.</h2>

<div data-learn="QuizMC" data-props='{"questions":[{"q":"What does deploying your app mean?","options":["Deleting it from your computer","Putting it on a server so anyone with the link can use it","Converting it to a mobile app","Selling it on an app store"],"correct":1,"explanation":"Deploying means copying your app to a server on the internet so anyone with the URL can access it. Like sharing a Google Doc instead of keeping it on your desktop."},{"q":"Which platform is the easiest if you built your app on Replit?","options":["Vercel","AWS","Replit Deploy","Heroku"],"correct":2,"explanation":"If you built on Replit, deploying is one click — your app is already running on their servers. Just click Deploy and share the link."}]}'></div>

</div>

<!-- FLASHCARDS -->
<div class="lesson-section">
  <span class="section-label">Review</span>
  <h2 class="section-title">Key concepts to remember.</h2>

<div data-learn="FlashDeck" data-props='{"title":"Deployment Basics","cards":[{"front":"What is deployment?","back":"Putting your app on a server on the internet so anyone with the link can use it. Like sharing a document via Google Drive instead of keeping it on your desktop."},{"front":"What are the three main hosting platforms?","back":"Replit Deploy (easiest, one-click), Vercel (most popular, auto-deploys from GitHub), and Netlify (great alternative, drag-and-drop)."},{"front":"How much does hosting cost?","back":"All three platforms have generous free tiers. You can host most personal projects and prototypes for free. Paid plans start when you need more traffic or features."},{"front":"How do you get a custom domain?","back":"Buy a domain ($10-15/year) from Namecheap or Cloudflare, then connect it to your hosting platform in the project settings. AI can walk you through the DNS setup."},{"front":"What should you check before sharing your deployed app?","back":"Test on mobile, test in incognito/private window, check page title, click all buttons, and make sure there is a favicon."},{"front":"How long does deployment take?","back":"Under 5 minutes for most platforms. Replit is one click. Vercel and Netlify take a few minutes for initial setup, then auto-deploy on every update."}]}'></div>

</div>

</div>
