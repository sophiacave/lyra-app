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
  <span class="section-label">Education</span>
  <h2 class="section-title">Prompts for Teaching and Learning</h2>
  <p class="section-text">Education prompts require a different mindset — the goal isn't just accurate output, it's output that builds understanding.</p>

  <div class="demo-container">
    <div class="demo-block" style="border-left: 3px solid var(--green);">
      <h4 style="color: var(--green);">Concept Explanation</h4>
      <code>"Explain [concept] to someone who understands [prerequisite] but has never encountered [concept] before. Use an analogy from everyday life. Then give a concrete example. Then explain what the analogy gets wrong — where the analogy breaks down. Target: 200 words."</code>
    </div>
    <div class="demo-block" style="border-left: 3px solid var(--purple);">
      <h4 style="color: var(--purple);">Quiz Generator</h4>
      <code>"Create 5 multiple-choice questions testing understanding of [topic]. Requirements:
- Each question tests a different concept or skill
- One obviously wrong answer (eliminates guessing)
- One 'close but wrong' answer (tests deeper understanding)
- One correct answer
- One tricky answer that's partially correct
- Include a brief explanation for why the correct answer is right and why the tricky answer is wrong"</code>
    </div>
    <div class="demo-block" style="border-left: 3px solid var(--orange);">
      <h4 style="color: var(--orange);">Socratic Tutor</h4>
      <code>"You are a Socratic tutor. When I ask a question, don't give me the answer directly. Instead: ask me what I already know about the topic, then ask a question that leads me toward the answer. If I get stuck, give a hint — never the full answer. If I'm wrong, ask me to explain my reasoning so we can find where the logic breaks. Only give the direct answer if I explicitly ask for it."</code>
    </div>
  </div>
</div>

<div class="lesson-section">
  <span class="section-label">Legal and Compliance</span>
  <h2 class="section-title">Prompts That Require Precision and Caution</h2>
  <p class="section-text">Some domains carry higher stakes. Legal, medical, and financial prompts need extra guardrails because errors have real consequences.</p>

  <div class="demo-container">
    <div class="demo-block" style="border-left: 3px solid var(--blue);">
      <h4 style="color: var(--blue);">Contract Review</h4>
      <code>"Review this contract clause for potential risks. For each risk identified:
- Quote the exact language that creates the risk
- Explain the risk in plain English
- Rate severity: HIGH (could cause significant financial/legal harm), MEDIUM (disadvantageous but manageable), LOW (minor concern)
- Suggest alternative language that protects both parties

IMPORTANT: Flag any clause you're uncertain about with [NEEDS LAWYER REVIEW]. Do not provide definitive legal advice — frame findings as 'potential concerns for discussion with counsel.'"</code>
    </div>
  </div>

  <p class="section-text">Notice the explicit disclaimer instruction. In high-stakes domains, telling the AI to flag uncertainty and recommend professional review is a critical safety pattern — not because the AI can't analyze, but because the consequences of overconfidence are severe.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Creative</span>
  <h2 class="section-title">Prompts for Creative Work</h2>
  <p class="section-text">Creative prompts are paradoxically the hardest to write. Too many constraints kill creativity. Too few produce generic output. The sweet spot: constrain the structure, free the content.</p>
  <p class="section-text"><strong style="color: var(--orange);">Constrain structure:</strong> "Write a 6-word story" or "Write a poem in three stanzas of four lines each." Structure gives the AI a creative challenge to work within.</p>
  <p class="section-text"><strong style="color: var(--purple);">Free content:</strong> Instead of dictating what to write about, provide a theme or emotion. "Write about the moment right before everything changes" gives more creative space than "write about a person deciding to quit their job."</p>
  <p class="section-text"><strong style="color: var(--green);">Reference creative influences:</strong> "Write in the style of Raymond Carver" activates a specific literary voice. "Write like a noir detective narrating a cooking show" creates an unexpected combination that produces original output.</p>
  <p class="section-text"><strong style="color: var(--blue);">Use anti-cliche constraints:</strong> "Write a love story. You may not use the words: heart, soul, forever, destiny, or fate." Constraints that remove defaults force the AI into more original territory.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Cross-Domain</span>
  <h2 class="section-title">Combining Domain Patterns for Unique Results</h2>
  <p class="section-text">The most powerful prompts often combine patterns from multiple domains. Here are three combinations that produce unexpectedly strong results.</p>
  <p class="section-text"><strong style="color: var(--orange);">Code + Writing:</strong> "Document this API endpoint like you're writing a tutorial for a developer who's used REST APIs but never used ours. Include a working curl example, explain what each parameter does in plain English, and show the response with annotations."</p>
  <p class="section-text"><strong style="color: var(--purple);">Analysis + Creative:</strong> "Analyze our customer churn data and present the findings as a narrative — tell the story the data is telling. Who are the characters (segments)? What's the conflict (why they leave)? What's the resolution (what we should do)?"</p>
  <p class="section-text"><strong style="color: var(--green);">Education + Analysis:</strong> "Explain our quarterly financial results to the marketing team. They understand revenue and growth but not CAC, LTV, or cohort analysis. Use analogies from marketing (campaigns, conversion funnels) to explain financial concepts. Include a glossary of terms they'll need."</p>
  <p class="section-text">Cross-domain prompts work because they force the AI to translate between modes of thinking. The output isn't just accurate — it's accessible to people outside the original domain.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Building Expertise</span>
  <h2 class="section-title">Developing Your Domain Prompt Intuition</h2>
  <p class="section-text">The fastest way to develop domain-specific prompting skills is to study how experts in that domain think. Every field has implicit quality standards, common failure modes, and specialized vocabulary. Your prompt needs to capture all three.</p>
  <p class="section-text"><strong style="color: var(--orange);">Technique: Interview an expert.</strong> If you're writing prompts for a domain you're not expert in, interview someone who is. Ask: "What does a beginner always get wrong? What would you check for first? What separates good work from great work in this field?" Their answers become your prompt constraints.</p>
  <p class="section-text"><strong style="color: var(--purple);">Technique: Study examples of great work.</strong> Find 3 examples of excellent output in your target domain. Analyze what makes them excellent. Those qualities become your quality criteria in the prompt.</p>
  <p class="section-text"><strong style="color: var(--green);">Technique: Build incrementally.</strong> Start with a basic prompt for your domain. Use it 10 times. After each use, note what was wrong or missing. Refine. After 10 iterations, you'll have a battle-tested domain prompt that captures real-world edge cases no theoretical approach would catch.</p>
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
</div>

<div class="lesson-section">
  <div data-learn="QuizMC" data-props='{"title":"Domain-Specific Prompts Quiz","questions":[{"q":"When writing a code generation prompt, what should you specify beyond the task itself?","options":["Only the programming language","Stack, return types, edge cases, library restrictions, documentation style, and test framework","Just a description of what the function should do","The AI model to use"],"correct":1,"explanation":"Coding prompts need precision across multiple dimensions — the AI must understand your stack, patterns, type signatures, and constraints or you’ll spend more time fixing than coding."},{"q":"What four questions help you adapt to ANY domain?","options":["Who, what, when, where","What does good look like, what are the common mistakes, what terminology matters, what is the expected output format","Role, context, task, format","Audience, tone, length, examples"],"correct":1,"explanation":"These four domain-adaptation questions ensure your prompt activates the right knowledge, avoids common pitfalls, uses the correct terminology, and matches domain conventions."},{"q":"For a writing prompt, what is the most critical missing element that makes output sound generic?","options":["Not specifying word count","Not defining audience, baseline knowledge, angle, and tone","Not asking for bullet points","Not specifying the title"],"correct":1,"explanation":"Without knowing the audience, what they already know, the unique angle, and the tone — the AI writes for nobody in particular. Voice and audience clarity are the keys to non-generic writing."}]}'></div>
</div>

<nav class="lesson-nav">
  <a href="/academy/advanced-prompt-engineering/08-debugging-bad-outputs/" class="prev">&larr; Previous: Debugging Bad Outputs</a>
  <a href="/academy/advanced-prompt-engineering/10-your-prompt-library/" class="next">Next: Your Prompt Library &rarr;</a>
</nav>

</div>
