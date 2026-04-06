---
title: "Pricing and Monetization"
course: "building-ai-products"
order: 7
type: "lesson"
free: false
---

<div class="wrap">

<nav class="local-nav">
  <a href="/academy/building-ai-products/">Building AI Products</a>
  <span class="lesson-badge">Lesson 7 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Pricing and Monetization</h1>
  <p><span class="accent">Your AI costs money every time someone uses it. Price accordingly.</span></p>
  <p>AI products have a unique pricing challenge: your costs scale with usage in ways traditional SaaS doesn't. Get this wrong and growth kills your business.</p>
</div>

<div class="learn-card">
  <h3>What you'll learn</h3>
  <ul>
    <li>The four pricing models for AI products</li>
    <li>How to calculate your true cost-per-query</li>
    <li>Why free tiers can bankrupt AI startups</li>
    <li>Value-based pricing vs. cost-plus pricing</li>
  </ul>
</div>

<div class="lesson-section">
  <span class="section-label">Models</span>
  <h2 class="section-title">Four Ways to Charge for AI</h2>
  <p class="section-text"><strong>1. Subscription (flat monthly fee).</strong> Simple for users, risky for you. If a power user sends 10,000 queries a month and each costs you $0.03, that's $300 in API costs against a $29 subscription. You need usage limits or tiered plans.</p>
  <p class="section-text"><strong>2. Usage-based (pay per query/token/action).</strong> Aligns your revenue with your costs perfectly. But users hate unpredictable bills. The solution: credit packs. "Buy 100 analyses for $19." Users get predictability. You get margin protection.</p>
  <p class="section-text"><strong>3. Hybrid (subscription + usage).</strong> Base subscription includes X queries per month. Overages billed per unit. This is where most mature AI products land. Jasper, Copy.ai, and Midjourney all use variations of this model.</p>
  <p class="section-text"><strong>4. Outcome-based (pay per result).</strong> Charge for successful outcomes, not attempts. "Pay $2 per qualified lead generated" or "$5 per completed analysis." Highest perceived value, but hardest to implement.</p>
</div>

<div class="demo-container">
  <h3>Know Your Unit Economics</h3>
  <p><strong>API cost per query:</strong> Claude Sonnet ~$0.01-0.05 depending on context length</p>
  <p><strong>Infrastructure:</strong> Hosting, database, vector storage — typically $50-200/mo baseline</p>
  <p><strong>Margin target:</strong> Aim for 70%+ gross margin. If a query costs $0.03, charge at least $0.10</p>
  <p><strong>Rule of thumb:</strong> Your price should be 3-10x your cost. Not 1.5x. Not 2x. Three minimum.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Warning</span>
  <h2 class="section-title">The Free Tier Trap</h2>
  <p class="section-text">In traditional SaaS, free tiers cost almost nothing to maintain — a user sitting idle in your database costs fractions of a cent. In AI products, every free-tier query costs real money. A generous free tier with viral growth can literally bankrupt you.</p>
  <p class="section-text">If you offer a free tier, make it tiny: 5-10 queries to experience the magic trick, then a paywall. Or make the free tier use a cheaper model (GPT-3.5) while paid users get the premium model (Claude/GPT-4). Your free tier is a demo, not a product.</p>
</div>

<div class="lesson-section">
  <div data-learn="FlashDeck" data-props='{"title":"AI Pricing Models — Four Options","cards":[{"front":"Subscription (Flat Monthly)","back":"Simple for users, risky for you. Power users can cost you 10x more than their fee. Requires usage limits or tiered plans to protect margin."},{"front":"Usage-Based (Pay Per Query)","back":"Aligns revenue with costs perfectly but users hate unpredictable bills. Solution: credit packs — buy 100 analyses for $19 — gives users predictability and you margin protection."},{"front":"Hybrid (Subscription + Usage)","back":"Base subscription includes X queries per month, overages billed per unit. Where most mature AI products land — Jasper, Copy.ai, Midjourney."},{"front":"Outcome-Based","back":"Charge for successful outcomes, not attempts — $2 per qualified lead, $5 per completed analysis. Highest perceived value, hardest to implement."},{"front":"The 3-10x Rule","back":"Your price should be 3-10x your cost per query. Not 1.5x. Not 2x. Three minimum. If a query costs $0.03, charge at least $0.10."}]}'></div>
</div>

<div class="lesson-section">
  <span class="section-label">Strategy</span>
  <h2 class="section-title">Price on Value, Not Cost</h2>
  <p class="section-text">If your AI saves a lawyer 5 hours of document review, that's worth $1,500 at their billing rate. Charging $50 for that analysis is a steal — even if your API cost is $0.50. Never anchor your price to your cost. Anchor it to the value you create.</p>
  <p class="section-text">The question isn't "how much does this cost me to run?" It's "how much is the outcome worth to the customer?" A recruiter will pay $200/month to save 15 hours of resume screening. A student won't pay $5 for the same technology applied to homework. Same AI, different value, different price.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Tactic</span>
  <h2 class="section-title">Launch Pricing Strategy</h2>
  <p class="section-text">Launch with a simple two-tier structure: Free trial (limited queries, no credit card) and one paid plan. Don't build three tiers on day one. You don't have enough data to know where the breakpoints should be. Let user behavior tell you when to add tiers.</p>
  <p class="section-text">Start higher than you think you should. It's easy to lower prices or add a cheaper tier. It's nearly impossible to raise prices without losing existing customers. Your early adopters are the least price-sensitive — they'll pay a premium for early access.</p>
</div>

<div class="lesson-section">
</div>

<div class="try-it-box">
  <h3>Try It Yourself</h3>
  <p>Calculate your AI product's unit economics:</p>
  <div class="prompt-box"><code>1. Average tokens per query: _____ (input + output)
2. API cost per query: $_____ (check your provider's pricing)
3. Queries per user per month: _____ (estimate from prototype data)
4. Monthly cost per user: $_____ (queries x cost per query)
5. Target price per user: $_____ (monthly cost x 5 minimum)
6. Does this price feel reasonable for the value delivered?</code></div>
</div>

<div class="lesson-section">
  <div data-learn="QuizMC" data-props='{"title":"Pricing and Monetization Quiz","questions":[{"q":"Why can a generous free tier bankrupt an AI startup?","options":["Free users convert poorly","In traditional SaaS, idle free users cost fractions of a cent; in AI products, every free-tier query costs real money — viral free growth can exceed revenue instantly","Free tiers attract the wrong users","Free users share too much feedback"],"correct":1,"explanation":"In traditional SaaS, free users sitting idle cost almost nothing. In AI products, every query — free or paid — has a direct API cost. A generous free tier going viral means you pay for every interaction without receiving revenue."},{"q":"Why should you start with higher prices than you think you should?","options":["Higher prices signal quality","It is easy to lower prices or add a cheaper tier, but nearly impossible to raise prices without losing existing customers — early adopters are the least price-sensitive","Higher prices help with investor optics","Higher prices reduce support volume"],"correct":1,"explanation":"Price anchoring is permanent. Early customers form expectations. If you launch too cheap and later raise prices, you face churn and resentment. Starting higher preserves flexibility to move in either direction."},{"q":"What is the correct anchor for pricing an AI product?","options":["Your cost to provide the service","The price your competitors charge","The value the outcome creates for the customer — not what it costs you to deliver","The market’s median SaaS price"],"correct":2,"explanation":"If your AI saves a lawyer 5 hours at $300/hr billing rate, the outcome is worth $1,500. Charging $50 for that analysis — even if your API cost is $0.50 — is rational value-based pricing, not gouging."}]}'></div>
</div>

<nav class="lesson-nav">
  <a href="/academy/building-ai-products/user-experience-for-ai/" class="prev">&larr; Previous: User Experience for AI</a>
  <a href="/academy/building-ai-products/launch-and-distribution/" class="next">Next: Launch and Distribution &rarr;</a>
</nav>

</div>
