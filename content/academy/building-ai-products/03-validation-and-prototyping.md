---
title: "Validation and Prototyping"
course: "building-ai-products"
order: 3
type: "lesson"
free: true
---

<div class="wrap">

<nav class="local-nav">
  <a href="/academy/building-ai-products/">Building AI Products</a>
  <span class="lesson-badge">Lesson 3 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Validation and Prototyping</h1>
  <p><span class="accent">Build the demo before you build the product.</span></p>
  <p>The fastest way to waste six months is to build something nobody wants. The fastest way to avoid that is to fake it first.</p>
</div>

<div class="learn-card">
  <h3>What you'll learn</h3>
  <ul>
    <li>How to validate an AI product idea in under a week</li>
    <li>The "Wizard of Oz" method for AI prototyping</li>
    <li>When to use no-code tools vs. writing code</li>
    <li>What signals tell you to proceed — or pivot</li>
  </ul>
</div>

<div class="lesson-section">
  <span class="section-label">Method</span>
  <h2 class="section-title">The Wizard of Oz Prototype</h2>
  <p class="section-text">Before you integrate a single API, simulate the AI experience manually. Create a form where users submit inputs. You (a human) process them using ChatGPT or Claude behind the scenes. Deliver the output as if the product did it automatically.</p>
  <p class="section-text">This tests the only question that matters: does the output actually solve the user's problem? If people don't care about the result even when a human curates it, no amount of automation will save the idea.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Framework</span>
  <h2 class="section-title">The 48-Hour Validation Sprint</h2>
  <p class="section-text"><strong>Hour 0-4:</strong> Write the magic trick sentence. Build a landing page describing the outcome. Include a waitlist signup or a "try the beta" button.</p>
  <p class="section-text"><strong>Hour 4-12:</strong> Share the landing page in 5 communities where your target users hang out. Reddit, Discord, LinkedIn, niche forums. Don't pitch — describe the problem and ask if others face it.</p>
  <p class="section-text"><strong>Hour 12-36:</strong> For anyone who signs up, manually deliver the AI result using existing tools. ChatGPT, Claude, a Python script — whatever gets the output into their hands.</p>
  <p class="section-text"><strong>Hour 36-48:</strong> Collect feedback. Did they use it? Did they come back? Did they share it? These behavioral signals are worth more than any survey response.</p>
</div>

<div class="demo-container">
  <h3>Validation Signals That Matter</h3>
  <p><strong style="color: var(--green);">Go signal:</strong> Users come back unprompted and ask "when is the full version ready?"</p>
  <p><strong style="color: var(--green);">Go signal:</strong> Users share it with colleagues without being asked</p>
  <p><strong style="color: var(--orange);">Caution:</strong> Users say "this is cool" but don't actually use it again</p>
  <p><strong style="color: var(--red);">Stop signal:</strong> Users try it once and ghost. No follow-up. No questions.</p>
</div>

<div class="lesson-section">
  <div data-learn="FlashDeck" data-props='{"title":"Validation Methods — Key Concepts","cards":[{"front":"Wizard of Oz Prototype","back":"Simulate the AI manually. User submits input, you process it with ChatGPT behind the scenes, deliver output as if automated. Tests whether the output is valuable before building anything."},{"front":"48-Hour Validation Sprint","back":"Hours 0-4: landing page. 4-12: share in 5 communities. 12-36: manually deliver AI results to signups. 36-48: measure behavior — returns, shares, follow-up questions."},{"front":"Go Signal","back":"Users come back unprompted and ask when the full version is ready. Users share with colleagues without being asked."},{"front":"Stop Signal","back":"Users try it once and ghost. No follow-up. No questions. The problem isn’t painful enough to be worth solving."},{"front":"When to Pivot (vs. Kill)","back":"When the problem is real but your solution misses the mark — users engage but the output isn’t quite right. Adjust, don’t abandon."}]}'></div>
</div>

<div class="lesson-section">
  <span class="section-label">Tools</span>
  <h2 class="section-title">Prototyping Without Code</h2>
  <p class="section-text">You don't need to code a prototype. Use Typeform for input collection. Use Make or Zapier to connect it to an AI API. Use Notion or Airtable to store results. Use email to deliver outputs. The entire flow can be built in an afternoon.</p>
  <p class="section-text">The goal isn't a beautiful product. The goal is to learn whether the output is valuable. Ugly prototypes that deliver real value always beat polished products that solve imaginary problems.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Decision</span>
  <h2 class="section-title">Proceed, Pivot, or Kill</h2>
  <p class="section-text"><strong>Proceed</strong> when users demonstrate behavior, not just words. They return, they pay, they share, they ask for more. Behavior is truth.</p>
  <p class="section-text"><strong>Pivot</strong> when the problem is real but your solution misses the mark. Users engage but the output isn't quite right. Adjust the output format, the input method, or the scope.</p>
  <p class="section-text"><strong>Kill</strong> when the problem itself isn't painful enough. If users shrug at a hand-curated result, automation won't help. Move on. The graveyard of startups is full of solutions to problems nobody has.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Framework</span>
  <h2 class="section-title">The Five Validation Levels</h2>
  <p class="section-text">Not all validation is equal. Each level provides increasingly strong evidence that your idea is worth building. Don't skip levels — each one filters out a different kind of bad idea.</p>
  <p class="section-text"><strong>Level 1 — Problem validation:</strong> Does the problem actually exist? Talk to 10 people in your target audience. Don't pitch your solution — describe the problem and ask if they experience it. If fewer than 7 out of 10 recognize the pain, the problem isn't universal enough.</p>
  <p class="section-text"><strong>Level 2 — Solution validation:</strong> Does AI solve it better than alternatives? Show people the output — not the product, just the output. A summary. A categorized list. A generated draft. Ask: "Is this useful? Would you use this regularly?" If they say "I can do this myself in 10 minutes," your AI advantage isn't strong enough.</p>
  <p class="section-text"><strong>Level 3 — Willingness-to-pay validation:</strong> Will people actually pay? The simplest test: create a Stripe payment link for your product before it exists. Put it on a landing page. Track clicks. Even if you refund everyone, you now know who was willing to enter credit card details.</p>
  <p class="section-text"><strong>Level 4 — Usage validation:</strong> Do people use it more than once? This is where the Wizard of Oz prototype earns its keep. Deliver results manually to 20 people. Track how many come back for a second request without prompting. Repeat usage is the strongest pre-product signal.</p>
  <p class="section-text"><strong>Level 5 — Referral validation:</strong> Do people share it unprompted? If users send it to colleagues without being asked, you have something real. Referral behavior is the highest-fidelity signal because it costs the user social capital — they won't recommend garbage.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Method</span>
  <h2 class="section-title">The Concierge MVP for AI Products</h2>
  <p class="section-text">A concierge MVP goes beyond Wizard of Oz. Instead of just simulating the AI output, you simulate the entire product experience — onboarding, delivery, follow-up — by doing everything manually.</p>
  <p class="section-text"><strong>The process:</strong> Recruit 5-10 users through direct outreach. Set up a simple intake form (Typeform, Google Forms). When they submit a request, you manually produce the result using AI tools, then deliver it via email or a shared document within a defined SLA (e.g., 2 hours).</p>
  <p class="section-text"><strong>Why it works:</strong> You learn things a prototype never teaches you. What questions do users ask during onboarding? What format do they actually want the output in? How often do they come back? What do they complain about? These insights shape your real product in ways that no amount of theorizing can match.</p>
  <p class="section-text"><strong>When to graduate:</strong> When you're spending more time fulfilling requests than you have available — that's demand exceeding your manual capacity. That's the green light to automate.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Tactic</span>
  <h2 class="section-title">Building a Validation Landing Page</h2>
  <p class="section-text">Your landing page has one job: convert visitors into signal. Not into customers — into data points that tell you whether to build or not.</p>
  <p class="section-text"><strong>Headline:</strong> State the transformation, not the technology. "Stop spending 3 hours on expense reports" beats "AI-powered expense automation." The headline should make your target user think "that's me."</p>
  <p class="section-text"><strong>Before/after:</strong> Show the pain (current state) and the relief (future state). A screenshot of a messy spreadsheet next to a clean, categorized report. Visual transformation is more convincing than any paragraph of text.</p>
  <p class="section-text"><strong>Social proof:</strong> Even pre-launch, you can use proof. "47 accountants are waiting for early access." "Built by a team that processed 10,000 expense reports the hard way." Credibility signals reduce skepticism.</p>
  <p class="section-text"><strong>The ask:</strong> Email signup is the minimum. A paid pre-order or deposit is stronger signal. A short survey ("how much time do you spend on this weekly?") gives you segmentation data. The more friction in your ask, the higher-fidelity your signal — but the fewer responses you'll get.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Common Mistakes</span>
  <h2 class="section-title">Validation Anti-Patterns</h2>
  <p class="section-text"><strong>Asking friends and family.</strong> They'll say it's great because they love you. Their validation is worthless. Test with strangers who have no social obligation to be kind.</p>
  <p class="section-text"><strong>Validating the technology instead of the product.</strong> "Can AI summarize documents?" is a technology question — the answer is obviously yes. "Will busy executives pay $39/month to never read a full report again?" is a product question — the answer is unknown. Validate the second one.</p>
  <p class="section-text"><strong>Building too much before validating.</strong> If you've written more than 200 lines of code before talking to a single potential user, you're building on assumptions. Assumptions are comfortable but often wrong. One afternoon of user interviews saves months of misdirected engineering.</p>
  <p class="section-text"><strong>Treating "cool" as validation.</strong> "This is really cool!" is the most dangerous feedback you can receive. Cool means interesting. It doesn't mean useful. It doesn't mean valuable. It definitely doesn't mean "I'll pay for this." Dig deeper: "Would you use this tomorrow? What would you use it for? What would you pay?"</p>
</div>

<div class="lesson-section">
</div>

<div class="try-it-box">
  <h3>Try It Yourself</h3>
  <p>Pick your strongest idea from Lesson 2 and run the 48-hour sprint:</p>
  <div class="prompt-box"><code>1. Write the magic trick sentence
2. Build a one-page site (Carrd, Framer, or even a Google Form)
3. Manually deliver AI results to 5 real users
4. Track: Did they use it? Did they come back? Did they tell anyone?</code></div>
</div>

<div class="lesson-section">
  <div data-learn="QuizMC" data-props='{"title":"Validation and Prototyping Quiz","questions":[{"q":"What is the core question the Wizard of Oz prototype answers?","options":["How fast can you build the product","Does the output actually solve the user’s problem, before building any automation","How much would users pay","Which AI model produces the best results"],"correct":1,"explanation":"If people don’t care about the result even when a human curates it perfectly, no amount of automation will save the idea. The Wizard of Oz prototype tests value before investing in technology."},{"q":"Why are behavioral signals worth more than survey responses in validation?","options":["Surveys are too expensive to run","People lie in surveys but behavior reveals truth — returning, sharing, and paying are honest signals that describe words do not guarantee","Surveys take too long","Behavioral data is easier to collect"],"correct":1,"explanation":"What users say and what they do are often different. A user who says ‘this is cool’ but never returns reveals the truth. A user who comes back daily without prompting reveals a different truth."},{"q":"When should you KILL an idea based on validation results?","options":["When fewer than 100 people sign up","When the output is good but expensive to produce","When users try it once and ghost — no follow-up, no questions — because the problem isn’t painful enough","When competitors exist"],"correct":2,"explanation":"The graveyard of startups is full of solutions to problems nobody has. If users shrug at a hand-curated result from an expert human, automation will not change their indifference."}]}'></div>
</div>

<nav class="lesson-nav">
  <a href="/academy/building-ai-products/finding-ai-product-ideas/" class="prev">&larr; Previous: Finding AI Product Ideas</a>
  <a href="/academy/building-ai-products/architecture-decisions/" class="next">Next: Architecture Decisions &rarr;</a>
</nav>

</div>
