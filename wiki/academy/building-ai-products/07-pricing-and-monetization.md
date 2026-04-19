# Pricing and Monetization

**Course:** Building AI Products
**Order:** 7
**Type:** lesson
**Access:** Premium

---
[Building AI Products](/academy/building-ai-products/)
  Lesson 7 of 10


  # Pricing and Monetization

  Your AI costs money every time someone uses it. Price accordingly.
  AI products have a unique pricing challenge: your costs scale with usage in ways traditional SaaS doesn't. Get this wrong and growth kills your business.


  ### What you'll learn


    - The four pricing models for AI products

    - How to calculate your true cost-per-query

    - Why free tiers can bankrupt AI startups

    - Value-based pricing vs. cost-plus pricing




  Models
  ## Four Ways to Charge for AI

  **1. Subscription (flat monthly fee).** Simple for users, risky for you. If a power user sends 10,000 queries a month and each costs you $0.03, that's $300 in API costs against a $29 subscription. You need usage limits or tiered plans.
  **2. Usage-based (pay per query/token/action).** Aligns your revenue with your costs perfectly. But users hate unpredictable bills. The solution: credit packs. "Buy 100 analyses for $19." Users get predictability. You get margin protection.
  **3. Hybrid (subscription + usage).** Base subscription includes X queries per month. Overages billed per unit. This is where most mature AI products land. Jasper, Copy.ai, and Midjourney all use variations of this model.
  **4. Outcome-based (pay per result).** Charge for successful outcomes, not attempts. "Pay $2 per qualified lead generated" or "$5 per completed analysis." Highest perceived value, but hardest to implement.


  ### Know Your Unit Economics

  **API cost per query:** Claude Sonnet ~$0.01-0.05 depending on context length
  **Infrastructure:** Hosting, database, vector storage — typically $50-200/mo baseline
  **Margin target:** Aim for 70%+ gross margin. If a query costs $0.03, charge at least $0.10
  **Rule of thumb:** Your price should be 3-10x your cost. Not 1.5x. Not 2x. Three minimum.


  Warning
  ## The Free Tier Trap

  In traditional SaaS, free tiers cost almost nothing to maintain — a user sitting idle in your database costs fractions of a cent. In AI products, every free-tier query costs real money. A generous free tier with viral growth can literally bankrupt you.
  If you offer a free tier, make it tiny: 5-10 queries to experience the magic trick, then a paywall. Or make the free tier use a cheaper model (GPT-3.5) while paid users get the premium model (Claude/GPT-4). Your free tier is a demo, not a product.



### AI Pricing Models — Four Options

**Card 1:**
Front: Subscription (Flat Monthly)
Back: Simple for users, risky for you. Power users can cost you 10x more than their fee. Requires usage limits or tiered plans to protect margin.

**Card 2:**
Front: Usage-Based (Pay Per Query)
Back: Aligns revenue with costs perfectly but users hate unpredictable bills. Solution: credit packs — buy 100 analyses for $19 — gives users predictability and you margin protection.

**Card 3:**
Front: Hybrid (Subscription + Usage)
Back: Base subscription includes X queries per month, overages billed per unit. Where most mature AI products land — Jasper, Copy.ai, Midjourney.

**Card 4:**
Front: Outcome-Based
Back: Charge for successful outcomes, not attempts — $2 per qualified lead, $5 per completed analysis. Highest perceived value, hardest to implement.

**Card 5:**
Front: The 3-10x Rule
Back: Your price should be 3-10x your cost per query. Not 1.5x. Not 2x. Three minimum. If a query costs $0.03, charge at least $0.10.


  Strategy
  ## Price on Value, Not Cost

  If your AI saves a lawyer 5 hours of document review, that's worth $1,500 at their billing rate. Charging $50 for that analysis is a steal — even if your API cost is $0.50. Never anchor your price to your cost. Anchor it to the value you create.
  The question isn't "how much does this cost me to run?" It's "how much is the outcome worth to the customer?" A recruiter will pay $200/month to save 15 hours of resume screening. A student won't pay $5 for the same technology applied to homework. Same AI, different value, different price.


  Tactic
  ## Launch Pricing Strategy

  Launch with a simple two-tier structure: Free trial (limited queries, no credit card) and one paid plan. Don't build three tiers on day one. You don't have enough data to know where the breakpoints should be. Let user behavior tell you when to add tiers.
  Start higher than you think you should. It's easy to lower prices or add a cheaper tier. It's nearly impossible to raise prices without losing existing customers. Your early adopters are the least price-sensitive — they'll pay a premium for early access.


  Deep Dive
  ## Calculating True Cost Per Query

  Most AI founders dramatically underestimate their cost per query because they only count the API call. True cost includes everything the system does to produce one output.
  **Direct AI costs:** Input tokens + output tokens at your provider's rate. For Claude Sonnet with a 1,500-token input and 500-token output, that's roughly $0.01-0.02 per query. For GPT-4o with the same, it's similar. These are your marginal costs.
  **Embedding costs:** If you use RAG, every query triggers an embedding call to convert the user's question into a vector. At OpenAI's rates, this is about $0.0001 per query — negligible individually, meaningful at millions of queries.
  **Infrastructure costs:** Database hosting, vector storage, compute for pre-processing, CDN for serving the frontend. Divide your monthly infrastructure bill by your monthly query count. For early-stage products, this is often $0.05-0.50 per query because the fixed costs are spread across few users.
  **Retry costs:** If 20% of queries require a regeneration, your effective AI cost is 1.2x what you calculated. If some queries fail and trigger automatic retry logic, factor that in. Your cost per successful output matters more than cost per API call.
  **The formula:** True cost = (AI tokens + embedding + retry overhead) + (monthly infrastructure / monthly queries). Track this number weekly. It should decrease over time as you optimize prompts and grow query volume to amortize fixed costs.


  Strategy
  ## The Freemium Decision Framework

  Whether to offer a free tier is the most consequential pricing decision for an AI product. Unlike traditional SaaS, every free user costs you real money. Here's how to decide.
  **Offer free if:** Your product has strong network effects (each user makes the product better for others). Your product's output is inherently viral (users share generated content, bringing new users). Your marginal cost per query is below $0.005 (you can absorb it as marketing spend).
  **Don't offer free if:** Your product targets businesses (they expect to pay for professional tools). Your cost per query is above $0.02 (free users will eat your runway). Your product doesn't benefit from virality (B2B tools rarely go viral).
  **The middle path:** Instead of a free tier, offer a free trial — 7 days or 20 queries, whichever comes first. This gives users enough time to experience the value without becoming a permanent cost center. Require a credit card upfront and convert automatically. The credit card requirement filters out tire-kickers and increases trial-to-paid conversion by 2-3x.


  Model
  ## Building a Pricing Page That Converts

  Your pricing page is the most important page on your site after the homepage. It must answer three questions instantly: What do I get? How much does it cost? Is it worth it?
  **Anchor with value, not features.** Don't list "10,000 tokens" or "GPT-4 access." List outcomes: "50 document analyses per month" or "Unlimited email drafts." Users don't know what tokens are. They know what documents and emails are.
  **Show the math.** "The average user saves 8 hours/month. At $50/hour, that's $400 in recaptured time — for $39/month." Making the ROI explicit removes the "is this worth it?" objection before it forms.
  **Limit plan options.** Two plans is ideal for launch. Three is maximum. Five is a maze. Analysis paralysis kills conversion. If you must have three plans, make the middle plan visually prominent — it should be the obvious choice for 70% of users.
  **Annual discounts.** Offer 20% off for annual billing. This serves two purposes: it reduces churn (users who pay annually feel committed) and it improves your cash flow (you receive 12 months of revenue upfront). Never offer more than 30% off — it signals that your monthly price is inflated.


  Warning
  ## Pricing Mistakes That Kill AI Startups

  **Pricing too low.** The most common mistake. You set $9/month because it "feels accessible." But your cost per user is $7/month in API fees. That's a $2 gross margin before you pay for anything else — hosting, Stripe fees, support, your own salary. You've built a charity, not a business.
  **No usage limits on flat plans.** A $29/month plan with no query cap. Your average user sends 50 queries. Your power user sends 5,000. That power user costs you $150/month and pays you $29. Without caps, a small number of power users can make your business unprofitable.
  **Competing on price.** If your competitor charges $49/month, you charge $19/month. This is a race to the bottom. AI products should compete on quality, specialization, and user experience — not price. The customer who chooses the cheapest option will leave for an even cheaper option tomorrow.
  **Ignoring churn economics.** If your monthly churn rate is 10%, you lose half your customers every 7 months. At that rate, no amount of new acquisition keeps you growing. Before optimizing acquisition, fix retention. A product people keep paying for is infinitely more valuable than one that attracts and loses customers in a revolving door.


  Case Study
  ## Pricing in Practice: Three Real Models

  **The token-based model (like OpenAI's API):** Users pay exactly for what they consume. Advantage: perfect cost alignment. Disadvantage: unpredictable bills make users anxious. Best for: developer-facing API products where usage is programmatic and budgetable.
  **The credit-pack model (like Midjourney):** Users buy credits in bundles — 200 generations for $10. Advantage: predictable spending for users, margin protection for you. Disadvantage: users hoard credits and feel anxious about "wasting" them. Best for: creative AI products where each output is a discrete, valuable artifact.
  **The flat-with-limits model (like Jasper):** Monthly subscription with a generous but capped usage limit. Advantage: simple to understand, easy to compare with competitors. Disadvantage: power users can still exhaust limits; must carefully set caps to protect margin. Best for: productivity AI products where daily use is expected.
  No model is universally correct. Start with the one that best matches your product's usage pattern, and be prepared to evolve as you learn how users actually behave. The data from your first 6 months of paying customers will teach you more about pricing than any framework can.


  Strategy
  ## International Pricing Considerations

  If your AI product serves a global audience, pricing becomes significantly more complex. A $29/month subscription that feels reasonable in San Francisco is a week's wages in many countries.
  **Purchasing power parity (PPP):** Adjust prices based on the user's country. Many SaaS products offer 40-60% discounts for developing countries. The marginal cost of serving an international user is the same, but the willingness to pay varies dramatically. A $12/month price in India can yield more total revenue than a $29/month price that nobody in India can afford.
  **Currency and tax:** Display prices in local currency. Handle VAT and sales tax correctly — EU customers need VAT-inclusive pricing. Use Stripe Tax or a similar service to automate compliance. Getting international taxation wrong creates legal exposure that isn't worth the manual accounting savings.
  **Payment methods:** Not everyone has a credit card. In many markets, bank transfers, mobile payment, or local payment processors are preferred. Stripe supports most of these through its payment methods API. Meeting users where they are — including how they pay — removes the last barrier to conversion.


  Principle
  ## The Pricing Evolution Timeline

  Your pricing will change as your product, costs, and market evolve. Here's a typical timeline for how pricing develops over the first two years.
  **Month 1-3:** Simple. One paid plan, maybe a free trial. Your goal is learning, not optimizing revenue. Watch what users do. Track who churns and who upgrades. Collect data on usage patterns.
  **Month 4-6:** Add a second tier based on the natural segmentation you observe. Some users use 10x more than others. Create a plan that accommodates each group. Introduce annual billing with a discount.
  **Month 7-12:** Optimize based on data. Adjust pricing where conversion data suggests you're leaving money on the table. Test credit packs or usage-based components if flat subscriptions don't align with your cost structure. Consider removing the free tier if it's unprofitable.
  **Month 13-24:** Mature pricing. Three tiers with clear value differentiation. Enterprise pricing with custom quotes. Established annual/monthly split. By this point, your pricing should be data-driven, not gut-driven. Every pricing change should be testable and reversible.
  The key insight: pricing is a living system, not a one-time decision. The pricing you launch with should be intentionally imperfect — it's a hypothesis you'll refine with real user data. Start simple, measure aggressively, and iterate quarterly.


  Checklist
  ## Pricing Launch Readiness

  Before you finalize your launch pricing, verify each of these:
  **1.** You know your true cost per query (including retries, embeddings, and infrastructure overhead).
  **2.** Your price is at least 3x your cost — giving you room for growth, support, and margin.
  **3.** Your pricing page communicates value in outcomes, not features or technical specs.
  **4.** Your free tier (if any) has strict limits that let users experience the magic trick without becoming a cost center.
  **5.** You have usage caps or tiered pricing that protects you from power user cost blow-up.
  **6.** You can track cost per user, revenue per user, and LTV:CAC ratio from day one.
  **7.** You've stress-tested the billing flow — signup, payment, plan change, cancellation — end to end.
  Pricing is one of the most powerful levers you have as a product builder. Get it right and your business sustains itself. Get it wrong and even a great product dies from unsustainable economics. Take the time to understand your costs, your value, and your market — then price with confidence.
  With your pricing strategy in place, you're ready to put your product in front of the world. Lesson 8 covers launch strategies, distribution channels, and how to build sustained growth — because the best-priced product in the world is worthless if nobody knows it exists.


  Advanced
  ## Revenue Expansion Strategies

  The initial subscription is just the beginning. Successful AI products expand revenue per customer over time through add-ons, upgrades, and new use cases.
  **Usage-based expansion:** As users get more value from your product, they naturally use it more. Design your pricing so increased usage translates to increased revenue — either through per-query charges above the plan limit, or through plan upgrades triggered by usage thresholds.
  **Feature-gated tiers:** Reserve premium features for higher-priced plans. Bulk processing, API access, team collaboration, advanced analytics, priority support. Each feature should unlock enough additional value to justify the price increase.
  **Team and enterprise plans:** When one person at a company loves your product, their whole team wants it. Offer team plans with centralized billing, shared templates, and admin controls. Team plans typically yield 3-10x the revenue of individual plans per account.
  **Marketplace and templates:** If your product supports custom configurations, sell premium templates. An AI writing tool could offer industry-specific template packs — legal writing, medical documentation, real estate descriptions — at $9-29 each. Users get specialized value; you get additional revenue with zero marginal cost.


  Data
  ## Pricing Analytics: What to Track

  Your pricing strategy should evolve based on data, not intuition. Track these metrics from day one and adjust quarterly.
  **Price sensitivity:** When you raise prices, what happens to conversion rate and churn? A 20% price increase that causes only 5% fewer signups is a net win. Test price changes on new users first — never change prices for existing customers without grandfathering.
  **Plan distribution:** What percentage of users are on each plan? If 90% of users are on your cheapest plan, either your other plans are overpriced or you're not communicating their value. Ideal distribution: 20-30% on the lowest tier, 50-60% on the middle tier, 10-20% on the top tier.
  **Upgrade triggers:** What action or threshold causes users to upgrade? Is it hitting their query limit? Discovering a premium feature? Growing their team? Identify these triggers and engineer your product to surface them at the right moment.
  **LTV:CAC ratio:** Lifetime value divided by customer acquisition cost. For AI products, target a ratio of 3:1 or higher. If it costs you $50 to acquire a customer who pays you $29/month and stays for 8 months ($232 LTV), your ratio is 4.6:1 — healthy. Below 3:1, you're spending too much to acquire or not retaining long enough.


  ### Try It Yourself

  Calculate your AI product's unit economics:
  `1. Average tokens per query: _____ (input + output)
2. API cost per query: $_____ (check your provider's pricing)
3. Queries per user per month: _____ (estimate from prototype data)
4. Monthly cost per user: $_____ (queries x cost per query)
5. Target price per user: $_____ (monthly cost x 5 minimum)
6. Does this price feel reasonable for the value delivered?`



### Quiz

**Q1: Why can a generous free tier bankrupt an AI startup?**
    A. Free users convert poorly
  ✓ B. In traditional SaaS, idle free users cost fractions of a cent; in AI products, every free-tier query costs real money — viral free growth can exceed revenue instantly
    C. Free tiers attract the wrong users
    D. Free users share too much feedback
  *In traditional SaaS, free users sitting idle cost almost nothing. In AI products, every query — free or paid — has a direct API cost. A generous free tier going viral means you pay for every interaction without receiving revenue.*

**Q2: Why should you start with higher prices than you think you should?**
    A. Higher prices signal quality
  ✓ B. It is easy to lower prices or add a cheaper tier, but nearly impossible to raise prices without losing existing customers — early adopters are the least price-sensitive
    C. Higher prices help with investor optics
    D. Higher prices reduce support volume
  *Price anchoring is permanent. Early customers form expectations. If you launch too cheap and later raise prices, you face churn and resentment. Starting higher preserves flexibility to move in either direction.*

**Q3: What is the correct anchor for pricing an AI product?**
    A. Your cost to provide the service
    B. The price your competitors charge
  ✓ C. The value the outcome creates for the customer — not what it costs you to deliver
    D. The market’s median SaaS price
  *If your AI saves a lawyer 5 hours at $300/hr billing rate, the outcome is worth $1,500. Charging $50 for that analysis — even if your API cost is $0.50 — is rational value-based pricing, not gouging.*


  [← Previous: User Experience for AI](/academy/building-ai-products/user-experience-for-ai/)
  [Next: Launch and Distribution →](/academy/building-ai-products/launch-and-distribution/)
