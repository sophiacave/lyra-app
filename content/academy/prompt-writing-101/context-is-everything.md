---
title: "Context Is Everything"
course: "prompt-writing-101"
order: 4
type: "lesson"
free: false
---<div class="wrap">

<nav class="local-nav">
  <a href="/academy/prompt-writing-101/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 4 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Context Is <span class="accent">Everything.</span></h1>
  <p class="sub">AI doesn't know your situation, your audience, or your goals. Until you tell it.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>The 6 types of context that transform AI output</li>
    <li>How much context is too much (and too little)</li>
    <li>The "briefing document" technique for complex tasks</li>
    <li>How to reuse context across multiple prompts</li>
  </ul>
</div>

<!-- SECTION 1: THE PROBLEM -->
<div class="lesson-section">
  <span class="section-label">The Problem</span>
  <h2 class="section-title">Without context, AI has to guess. And it guesses wrong.</h2>
  <p class="section-text">When you prompt "Write me a marketing email," the AI doesn't know:</p>
  <ul class="section-text" style="padding-left:1.5rem;margin-top:.5rem;margin-bottom:1rem">
    <li>What you're selling</li>
    <li>Who you're selling to</li>
    <li>What makes your product different</li>
    <li>What tone your brand uses</li>
    <li>Whether this is a cold email or a follow-up</li>
    <li>What action you want the reader to take</li>
  </ul>
  <p class="section-text">So it fills in every blank with the most generic, average answer possible. That's not the AI being bad at its job — it's the AI doing the best it can with nothing to work with.</p>
</div>

<!-- SECTION 2: 6 TYPES -->
<div class="lesson-section">
  <span class="section-label">The Six Types</span>
  <h2 class="section-title">The 6 types of context that matter most.</h2>

<div data-learn="MatchConnect" data-props='{
  "title": "Match Context Type to Description",
  "instruction": "Tap a context type on the left, then its description on the right",
  "pairs": [
    { "left": "Situation", "right": "What is happening right now? A launch, a complaint, a deadline" },
    { "left": "Audience", "right": "Who is this for? Their age, role, expertise level" },
    { "left": "Goal", "right": "What outcome do you want? Click, buy, understand, decide" },
    { "left": "Background", "right": "Relevant history — company info, previous attempts, data" },
    { "left": "Constraints", "right": "Budget, compliance rules, things you cannot mention" },
    { "left": "Prior Attempts", "right": "What you have already tried — paste it for improvement" }
  ]
}'></div>

</div>

<!-- SECTION 3: HOW MUCH -->
<div class="lesson-section">
  <span class="section-label">The Balance</span>
  <h2 class="section-title">How much context is the right amount?</h2>

<div data-learn="FlashDeck" data-props='{
  "title": "Too Little vs Just Right vs Too Much",
  "cards": [
    {
      "front": "🔴 TOO LITTLE\n\n\"Write a social media post.\"",
      "back": "What platform? What brand? What audience? What goal?\n\nThe AI has to guess EVERYTHING. You will get the most generic, forgettable post imaginable."
    },
    {
      "front": "🟢 JUST RIGHT\n\n\"Write an Instagram caption for our coffee shop new cold brew. Audience: 25-35 urban professionals. Tone: witty, casual. Include a CTA to visit this weekend. Under 150 characters.\"",
      "back": "Platform, product, audience, tone, action, length — all specified.\n\nEvery detail removes a guess. The AI can focus on being creative within clear boundaries."
    },
    {
      "front": "🟠 TOO MUCH\n\n500 words of company history, every menu item, founding story, competitor analysis, brand guidelines...",
      "back": "Context overload buries the actual ask. The AI gives equal weight to everything and loses focus on what matters.\n\nTHE RULE: Include context that would change the output if it were different. If swapping coffee shop for law firm would change the post — that context matters. If your 2015 founding story would not — leave it out."
    }
  ]
}'></div>

</div>

<!-- SECTION 4: BRIEFING DOC -->
<div class="lesson-section">
  <span class="section-label">Pro Technique</span>
  <h2 class="section-title">The briefing document technique.</h2>
  <p class="section-text">For complex or recurring tasks, create a reusable context block — a "briefing document" — that you paste at the start of any related prompt:</p>

  <div class="demo-container" style="padding:1.5rem;background:var(--surface);border:1px solid var(--border2)">
    <pre style="font-family:'JetBrains Mono',monospace;font-size:.8rem;color:var(--text);line-height:1.8;white-space:pre-wrap;margin:0"><span style="color:var(--orange)">COMPANY BRIEF:</span>
Company: Apex Design Studio (B2B web design agency)
Founded: 2021 | Team: 12 people | Revenue: $1.2M/year
Clients: SaaS companies, 50-500 employees
Voice: Professional but human. No corporate jargon.
Differentiator: We build sites that convert, not just look pretty.
Competitors: We don't trash-talk. Focus on our strengths.

<span style="color:var(--purple)">NOW — THE TASK:</span>
[Your specific prompt here]</pre>
  </div>

  <p class="section-text" style="margin-top:1rem">Save this somewhere you can copy-paste it. Every prompt you write for this company instantly gets the right voice, positioning, and constraints — without retyping it every time.</p>
  <p class="section-text">This is how professionals use AI. Not one-off prompts, but <strong>systems of context</strong> that make every interaction better.</p>
</div>

<!-- SECTION 5: KNOWLEDGE CHECK -->
<div class="lesson-section">
  <span class="section-label">Knowledge Check</span>
  <h2 class="section-title">Test your context skills.</h2>

<div data-learn="QuizMC" data-props='{
  "title": "Context Mastery",
  "questions": [
    {
      "q": "You are writing a prompt for a marketing email. Which context type is MOST likely to change the output dramatically?",
      "options": ["Your company founding year", "Who the audience is and what they care about", "Your office address", "How many employees you have"],
      "correct": 1,
      "explanation": "Audience is the single most impactful context type. An email to tech-savvy millennials vs retired professionals will be completely different in vocabulary, tone, and structure."
    },
    {
      "q": "What is the briefing document technique?",
      "options": ["Writing the longest possible prompt", "Creating a reusable context block you paste at the start of related prompts", "Sending the AI a separate document before your prompt", "Asking the AI to brief you on a topic first"],
      "correct": 1,
      "explanation": "A briefing document is a saved block of context (company info, voice, constraints) that you paste before your specific ask. It ensures consistency across all prompts for the same project."
    },
    {
      "q": "How do you decide if a piece of context is worth including?",
      "options": ["Include everything just to be safe", "If removing it would change the output, include it", "Only include context the AI specifically asks for", "Keep context under 10 words total"],
      "correct": 1,
      "explanation": "The test: would the output change if this context were different? If swapping coffee shop for law firm changes the result, that context matters. If your founding story would not change a social media caption, leave it out."
    }
  ]
}'></div>

<div data-learn="SortStack" data-props='{
  "title": "Rank Context Types by Typical Impact",
  "instruction": "Order these context types from MOST impactful to LEAST impactful for a typical business prompt",
  "items": ["Audience — who will see this output", "Goal — what outcome you want", "Situation — what is happening right now", "Background — relevant history and data", "Prior Attempts — what you already tried"]
}'></div>

</div>

<!-- NEXT LESSON -->
<div class="lesson-section" style="text-align:center;padding:2rem 0">
  <a href="/academy/prompt-writing-101/output-formats-that-work" style="display:inline-block;background:var(--orange);color:var(--bg);font-weight:700;padding:.75rem 2rem;border-radius:10px;text-decoration:none;font-size:.95rem">Next: Output Formats That Work →</a>
</div>

</div>