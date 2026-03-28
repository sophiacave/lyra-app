---
title: "Domain-Specific Prompts"
course: "advanced-prompt-engineering"
order: 9
type: "lesson"
free: false
---

<div class="wrap">

<nav class="local-nav">
  <a href="/academy/advanced-prompt-engineering/">Advanced Prompt Engineering</a>
  <span class="lesson-badge">Lesson 9 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Domain-Specific Prompts</h1>
  <p><span class="accent">Coding, writing, analysis, data — each domain has its own prompting patterns. Master them all.</span></p>
</div>

<div class="learn-card">
  <h3>What You'll Learn</h3>
  <ul>
    <li>Prompting patterns for software development</li>
    <li>Prompting patterns for writing and content creation</li>
    <li>Prompting patterns for data analysis and research</li>
    <li>How to adapt your general skills to any domain</li>
  </ul>
</div>

<div class="lesson-section">
  <span class="section-label">Coding</span>
  <h2 class="section-title">Prompts for Software Development</h2>
  <p class="section-text">Coding prompts need precision. The AI must understand your stack, your patterns, and your constraints — or you'll spend more time fixing its code than writing your own.</p>

  <div class="demo-container">
    <div class="demo-block" style="border-left: 3px solid var(--green);">
      <h4 style="color: var(--green);">Code Generation</h4>
      <code>"Write a TypeScript function that validates email addresses. Requirements: RFC 5322 compliant, returns { valid: boolean, reason?: string }, handles edge cases (plus addressing, international domains). Use no external libraries. Include JSDoc comments. Write 3 unit tests using Vitest."</code>
    </div>
    <div class="demo-block" style="border-left: 3px solid var(--orange);">
      <h4 style="color: var(--orange);">Code Review</h4>
      <code>"Review this function for: security vulnerabilities, performance issues, error handling gaps, and readability. For each issue found, explain the risk, show the problematic line, and provide a fix. If the code is solid, say so. Don't nitpick style preferences."</code>
    </div>
    <div class="demo-block" style="border-left: 3px solid var(--purple);">
      <h4 style="color: var(--purple);">Debugging</h4>
      <code>"This function returns undefined when the input array has duplicate values. Here's the function: [code]. Here's a failing test case: [test]. Walk through the execution step by step with the failing input. Identify exactly where the logic breaks and why."</code>
    </div>
  </div>
</div>

<div class="lesson-section">
  <span class="section-label">Writing</span>
  <h2 class="section-title">Prompts for Content Creation</h2>
  <p class="section-text">Writing prompts need voice and audience clarity. Without them, you get perfectly grammatical content that sounds like it was written by nobody, for nobody.</p>

  <div class="demo-container">
    <div class="demo-block" style="border-left: 3px solid var(--blue);">
      <h4 style="color: var(--blue);">Blog Post</h4>
      <code>"Write a blog post about [topic]. Audience: [who]. They already know [baseline knowledge] but don't know [what this teaches]. Tone: conversational, like explaining to a smart friend over coffee. Use concrete examples, not abstract theory. 800-1000 words. Include a practical takeaway they can use today."</code>
    </div>
    <div class="demo-block" style="border-left: 3px solid var(--orange);">
      <h4 style="color: var(--orange);">Email Sequence</h4>
      <code>"Write a 3-email welcome sequence for new subscribers to [product]. Email 1 (Day 0): Welcome + immediate value. Email 2 (Day 3): The #1 mistake beginners make. Email 3 (Day 7): Soft pitch for [paid offering]. Each email: subject line, preview text, body under 200 words. Tone: helpful mentor, not salesperson."</code>
    </div>
  </div>
</div>

<div class="lesson-section">
  <span class="section-label">Analysis</span>
  <h2 class="section-title">Prompts for Data and Research</h2>
  <p class="section-text">Analysis prompts need structure and rigor. You want the AI to think systematically, not just generate plausible-sounding conclusions.</p>

  <div class="demo-container">
    <div class="demo-block" style="border-left: 3px solid var(--green);">
      <h4 style="color: var(--green);">Data Analysis</h4>
      <code>"Analyze this sales data. First: identify the top 3 trends. For each trend, quantify the change (% or absolute), identify the likely cause, and rate your confidence (high/medium/low). Then: flag any anomalies that don't fit the trends. Finally: recommend 2 actions based on your analysis."</code>
    </div>
    <div class="demo-block" style="border-left: 3px solid var(--purple);">
      <h4 style="color: var(--purple);">Research Synthesis</h4>
      <code>"I have 5 articles about [topic]. For each, extract: main argument, key evidence, methodology used, and limitations. Then synthesize across all 5: where do they agree? Where do they contradict? What questions remain unanswered? Present as a research brief."</code>
    </div>
  </div>
</div>

<div class="lesson-section">
  <div data-learn="FlashDeck" data-props='{"title":"Domain-Specific Prompt Patterns","cards":[{"front":"Code Generation Prompt — what must you specify?","back":"Stack, requirements (e.g. RFC compliance), return types, edge cases, no external libraries, documentation style, and test framework."},{"front":"Code Review Prompt — what should you ask AI to check?","back":"Security vulnerabilities, performance issues, error handling gaps, readability — with severity, problematic line, and a fix for each."},{"front":"Blog Post Prompt — what context is essential?","back":"Topic, audience, their baseline knowledge, unique angle, tone, length, and a practical takeaway. Without these, output is generic."},{"front":"Data Analysis Prompt — how do you structure it?","back":"Ask for: top trends with quantified change + likely cause + confidence rating, plus anomalies, plus 2 recommended actions."},{"front":"Research Synthesis Prompt — what 4 things to extract?","back":"Main argument, key evidence, methodology, and limitations — then synthesize: agreements, contradictions, unanswered questions."}]}'></div>
</div>

<div class="lesson-section">
  <span class="section-label">The Meta-Pattern</span>
  <h2 class="section-title">Adapting to Any Domain</h2>
  <p class="section-text">Every domain has the same underlying needs. When entering a new domain, ask yourself:</p>
  <p class="section-text"><strong style="color: var(--orange);">What does "good" look like here?</strong> Define quality criteria specific to this domain.</p>
  <p class="section-text"><strong style="color: var(--purple);">What are the common mistakes?</strong> Tell the AI to avoid domain-specific pitfalls.</p>
  <p class="section-text"><strong style="color: var(--green);">What terminology matters?</strong> Use the right jargon so the AI activates the right knowledge.</p>
  <p class="section-text"><strong style="color: var(--blue);">What's the expected output format?</strong> Every domain has conventions. Match them.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Try It Yourself</span>
  <h2 class="section-title">Write a Domain-Specific Prompt</h2>
  <div class="try-it-box">
    <p>Choose your primary domain (coding, writing, analysis, or something else entirely). Write a prompt using the patterns from this lesson. Include: domain-specific quality criteria, the right terminology, and a clear output format.</p>
    <div class="prompt-box">
      <code>Domain: [your field]
Task: [specific deliverable]
Quality criteria: [what makes this good in your domain]
Terminology: [key terms the AI should use]
Output format: [domain conventions]
Avoid: [common mistakes in this domain]</code>
    </div>
  </div>
</div>

<div class="lesson-section">
  <div data-learn="MatchConnect" data-props='{"title":"Domain Prompts — Match the Domain to Its Key Requirement","instruction":"Tap one on the left, then its match on the right","pairs":[{"left":"Code Generation","right":"Specify stack, return types, edge cases, library restrictions, and test framework"},{"left":"Code Review","right":"Check security, performance, error handling, and readability with severity ratings"},{"left":"Blog Writing","right":"Define audience, baseline knowledge, unique angle, tone, and practical takeaway"},{"left":"Data Analysis","right":"Identify trends with quantified change, confidence rating, anomalies, and actions"},{"left":"Research Synthesis","right":"Extract argument, evidence, methodology, limitations — then find agreements and gaps"}]}'></div>
</div>

<div class="lesson-section">
  <div data-learn="QuizMC" data-props='{"title":"Domain-Specific Prompts Quiz","questions":[{"q":"When writing a code generation prompt, what should you specify beyond the task itself?","options":["Only the programming language","Stack, return types, edge cases, library restrictions, documentation style, and test framework","Just a description of what the function should do","The AI model to use"],"correct":1,"explanation":"Coding prompts need precision across multiple dimensions — the AI must understand your stack, patterns, type signatures, and constraints or you’ll spend more time fixing than coding."},{"q":"What four questions help you adapt to ANY domain?","options":["Who, what, when, where","What does good look like, what are the common mistakes, what terminology matters, what is the expected output format","Role, context, task, format","Audience, tone, length, examples"],"correct":1,"explanation":"These four domain-adaptation questions ensure your prompt activates the right knowledge, avoids common pitfalls, uses the correct terminology, and matches domain conventions."},{"q":"For a writing prompt, what is the most critical missing element that makes output sound generic?","options":["Not specifying word count","Not defining audience, baseline knowledge, angle, and tone","Not asking for bullet points","Not specifying the title"],"correct":1,"explanation":"Without knowing the audience, what they already know, the unique angle, and the tone — the AI writes for nobody in particular. Voice and audience clarity are the keys to non-generic writing."}]}'></div>
</div>

<nav class="lesson-nav">
  <a href="/academy/advanced-prompt-engineering/08-debugging-bad-outputs/" class="prev">&larr; Previous: Debugging Bad Outputs</a>
  <a href="/academy/advanced-prompt-engineering/10-your-prompt-library/" class="next">Next: Your Prompt Library &rarr;</a>
</nav>

</div>
