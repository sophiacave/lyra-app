---
title: "System Prompts and Personas"
course: "advanced-prompt-engineering"
order: 2
type: "lesson"
free: true
---

<div class="wrap">

<nav class="local-nav">
  <a href="/academy/advanced-prompt-engineering/">Advanced Prompt Engineering</a>
  <span class="lesson-badge">Lesson 2 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>System Prompts and Personas</h1>
  <p><span class="accent">Set the stage before the conversation even starts.</span></p>
</div>

<div class="learn-card">
  <h3>What You'll Learn</h3>
  <ul>
    <li>What system prompts are and why they're your most powerful tool</li>
    <li>How to craft personas that shape every response</li>
    <li>The anatomy of a great system prompt</li>
    <li>Common mistakes that weaken your instructions</li>
  </ul>
</div>

<div class="lesson-section">
  <span class="section-label">Foundation</span>
  <h2 class="section-title">System Prompts Are the Operating System</h2>
  <p class="section-text">A system prompt is the instruction layer that sits above every conversation. It tells the AI who it is, how it should behave, and what rules to follow — before the user says a single word.</p>
  <p class="section-text">Think of it as the difference between hiring a random stranger and briefing a specialist. The system prompt is that briefing.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Anatomy</span>
  <h2 class="section-title">The Four Parts of a System Prompt</h2>
  <p class="section-text"><strong style="color: var(--orange);">Identity:</strong> Who is the AI in this context? Give it a role, expertise level, and personality.</p>
  <p class="section-text"><strong style="color: var(--purple);">Behavior Rules:</strong> How should it respond? Tone, length, formatting preferences.</p>
  <p class="section-text"><strong style="color: var(--green);">Knowledge Boundaries:</strong> What does it know? What should it admit it doesn't know?</p>
  <p class="section-text"><strong style="color: var(--blue);">Constraints:</strong> What should it never do? Hard boundaries matter.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Real Example</span>
  <h2 class="section-title">Building a Code Review Persona</h2>

  <div class="demo-container">
    <div class="demo-block" style="border-left: 3px solid var(--green);">
      <h4 style="color: var(--green);">System Prompt</h4>
      <code>You are a senior software engineer with 15 years of experience, specializing in code review. Your style: direct, constructive, no fluff. When reviewing code, always check for: security vulnerabilities, performance issues, readability, and adherence to DRY principles. Rate severity as [critical], [warning], or [suggestion]. Never rewrite the entire file — point to specific lines and explain why. If the code is good, say so briefly. Don't patronize.</code>
    </div>
  </div>

  <p class="section-text">Notice how specific this is. It defines expertise, tone, what to check, how to format findings, and what not to do. Every sentence removes ambiguity.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Technique</span>
  <h2 class="section-title">Persona Stacking</h2>
  <p class="section-text">You can layer multiple perspectives into one system prompt. This is powerful when you need nuanced output.</p>

  <div class="demo-container">
    <div class="demo-block" style="border-left: 3px solid var(--purple);">
      <h4 style="color: var(--purple);">Stacked Persona</h4>
      <code>You are a marketing strategist who thinks like a psychologist and writes like a journalist. Analyze campaigns through the lens of behavioral triggers, but communicate findings in clear, story-driven language. No jargon. No bullet-point lists unless asked.</code>
    </div>
  </div>
</div>

<div class="lesson-section">
  <div data-learn="FlashDeck" data-props='{"title":"System Prompts — Key Concepts","cards":[{"front":"What is a system prompt?","back":"The instruction layer that sits above every conversation — it tells the AI who it is, how to behave, and what rules to follow before the user says a word."},{"front":"What is persona stacking?","back":"Layering multiple perspectives into one system prompt — e.g., a marketing strategist who thinks like a psychologist and writes like a journalist — for nuanced, multi-lens output."},{"front":"What are the four parts of a system prompt?","back":"Identity (who the AI is), Behavior Rules (tone and formatting), Knowledge Boundaries (what it knows and doesn\\\'t), and Constraints (hard limits on what it should never do)."},{"front":"Why does 'be helpful and professional' fail as a system prompt?","back":"It tells the AI nothing beyond its default behavior. Effective system prompts add specificity that changes output — domain expertise, tone, format, and constraints."},{"front":"What is the #1 cause of a weak system prompt?","back":"Contradictory instructions — e.g., 'be concise' plus 'always explain in detail.' The AI cannot prioritize conflicting rules, so output quality drops."}]}'></div>
</div>

<div class="lesson-section">
  <div data-learn="MatchConnect" data-props='{"title":"Match the System Prompt Component","instruction":"Match each system prompt element to what it controls.","pairs":[{"left":"Identity","right":"Who the AI is — role, expertise, and personality"},{"left":"Behavior Rules","right":"Tone, length, and formatting preferences"},{"left":"Knowledge Boundaries","right":"What the AI knows and should admit it does not know"},{"left":"Constraints","right":"Hard limits on what the AI must never do"},{"left":"Persona Stacking","right":"Layering multiple perspectives into one prompt"},{"left":"Contradictory Instructions","right":"The #1 cause of weak system prompt output"}]}'></div>
</div>

<div class="lesson-section">
  <span class="section-label">Common Mistakes</span>
  <h2 class="section-title">What Weakens a System Prompt</h2>
  <p class="section-text"><strong style="color: var(--red);">Too vague:</strong> "Be helpful and professional" — this tells the AI nothing it doesn't already default to.</p>
  <p class="section-text"><strong style="color: var(--red);">Too long:</strong> A 2,000-word system prompt dilutes priority. The AI can't emphasize everything equally.</p>
  <p class="section-text"><strong style="color: var(--red);">Contradictory:</strong> "Be concise" + "Always explain your reasoning in detail" = confusion.</p>
  <p class="section-text"><strong style="color: var(--green);">The fix:</strong> Prioritize. Put your most important instructions first. Be specific about what "good" looks like. Test and iterate.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Try It Yourself</span>
  <h2 class="section-title">Build Your First Persona</h2>
  <div class="try-it-box">
    <p>Create a system prompt for a use case you care about. Include all four parts: identity, behavior, knowledge boundaries, and constraints.</p>
    <div class="prompt-box">
      <code>You are a [role] with [experience/expertise]. Your communication style is [tone]. When asked about [domain], always [specific behavior]. Never [constraint]. If you don't know something, [fallback behavior].</code>
    </div>
  </div>
</div>

<div class="lesson-section">
  <div data-learn="QuizMC" data-props='{"title":"System Prompts Quiz","questions":[{"q":"What is \"persona stacking\" in system prompts?","options":["Writing a very long system prompt","Layering multiple perspectives or roles into one prompt","Running multiple system prompts at once","Repeating instructions for emphasis"],"correct":1,"explanation":"Persona stacking combines multiple viewpoints — e.g., a marketing strategist who thinks like a psychologist and writes like a journalist — for nuanced, multi-lens output."},{"q":"Which of these is a red flag that weakens a system prompt?","options":["Specifying severity tags for feedback","Including a fallback behavior","Writing contradictory instructions like ‘be concise’ and ‘always explain in detail’","Describing the AI’s expertise level"],"correct":2,"explanation":"Contradictory instructions confuse the AI about which rule takes priority and degrade output quality. Every instruction should point in a consistent direction."},{"q":"Why does a vague instruction like ‘be helpful and professional’ weaken a system prompt?","options":["It is too short","It uses informal language","It tells the AI nothing beyond its default behavior","It lacks a persona name"],"correct":2,"explanation":"The AI already defaults to helpful and professional behavior. Effective system prompts add specificity that changes behavior — tone, format, domain, constraints — beyond the defaults."}]}'></div>
</div>

<nav class="lesson-nav">
  <a href="/academy/advanced-prompt-engineering/01-beyond-basic-prompts/" class="prev">&larr; Previous: Beyond Basic Prompts</a>
  <a href="/academy/advanced-prompt-engineering/03-chain-of-thought/" class="next">Next: Chain of Thought &rarr;</a>
</nav>

</div>
