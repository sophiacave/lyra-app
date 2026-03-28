---
title: "Debugging Bad Outputs"
course: "advanced-prompt-engineering"
order: 8
type: "lesson"
free: false
---

<div class="wrap">

<nav class="local-nav">
  <a href="/academy/advanced-prompt-engineering/">Advanced Prompt Engineering</a>
  <span class="lesson-badge">Lesson 8 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Debugging Bad Outputs</h1>
  <p><span class="accent">When AI gets it wrong, the problem is almost always in the prompt. Here's how to find it.</span></p>
</div>

<div class="learn-card">
  <h3>What You'll Learn</h3>
  <ul>
    <li>The 5 most common reasons AI output goes wrong</li>
    <li>A systematic debugging framework for prompts</li>
    <li>How to diagnose vague, wrong, or off-tone responses</li>
    <li>Iterative refinement: making prompts better fast</li>
  </ul>
</div>

<div class="lesson-section">
  <span class="section-label">Mindset</span>
  <h2 class="section-title">Bad Output Is Feedback, Not Failure</h2>
  <p class="section-text">When the AI gives you something wrong, it's telling you something about your prompt. Maybe the instructions were ambiguous. Maybe the context was missing. Maybe you assumed the AI knew something it didn't. Every bad output is a clue pointing to a specific fix.</p>
</div>

<div class="lesson-section">
  <span class="section-label">The Five Failure Modes</span>
  <h2 class="section-title">What Went Wrong and Why</h2>
  <p class="section-text"><strong style="color: var(--red);">1. Too vague:</strong> The output is generic, surface-level, could apply to anything. <em>Fix: Add specifics. Name the audience, the context, the constraints. Show an example of what "good" looks like.</em></p>
  <p class="section-text"><strong style="color: var(--red);">2. Wrong format:</strong> You wanted bullet points, you got paragraphs. You wanted JSON, you got prose with a JSON block buried in it. <em>Fix: Be explicit about format. Use the "output first" technique from Lesson 5. Say what you DON'T want.</em></p>
  <p class="section-text"><strong style="color: var(--red);">3. Wrong tone:</strong> Too formal, too casual, too verbose, too terse. <em>Fix: Describe tone with specific comparisons ("write like a Slack message to a colleague, not a formal email"). Provide a style example.</em></p>
  <p class="section-text"><strong style="color: var(--red);">4. Hallucination:</strong> The AI stated something confidently that's factually wrong. <em>Fix: Ask it to cite sources. Add "if you're not sure, say so." For critical facts, ask it to flag confidence levels.</em></p>
  <p class="section-text"><strong style="color: var(--red);">5. Ignored instructions:</strong> You gave clear rules and the AI broke them. <em>Fix: Move critical instructions to the top. Repeat key constraints. Use emphasis: "IMPORTANT:" or "NEVER:" for non-negotiable rules.</em></p>
</div>

<div class="lesson-section">
  <span class="section-label">Framework</span>
  <h2 class="section-title">The Debug Loop</h2>

  <div class="demo-container">
    <div class="demo-block" style="border-left: 3px solid var(--blue);">
      <h4 style="color: var(--blue);">4-Step Debug Process</h4>
      <code>1. IDENTIFY: What specifically is wrong? Name the gap between expected and actual output.
2. DIAGNOSE: Which failure mode is it? (vague, format, tone, hallucination, ignored instruction)
3. HYPOTHESIZE: What in the prompt caused this? (missing context, ambiguous instruction, wrong placement)
4. FIX: Make ONE targeted change to the prompt. Test again. Repeat.</code>
    </div>
  </div>

  <p class="section-text">The critical rule: change one thing at a time. If you rewrite the entire prompt, you won't know what fixed it (or what broke something else).</p>
</div>

<div class="lesson-section">
  <div data-learn="FlashDeck" data-props='{"title":"Debugging Bad Outputs — Key Concepts","cards":[{"front":"What are the 5 failure modes of AI output?","back":"Too vague, wrong format, wrong tone, hallucination, and ignored instructions — each has a specific diagnostic fix."},{"front":"What is the 4-step debug loop?","back":"Identify (what\\\'s wrong), Diagnose (which failure mode), Hypothesize (what in the prompt caused it), Fix (make ONE targeted change and test again)."},{"front":"Why change only one thing at a time when debugging?","back":"If you rewrite the entire prompt, you won\\\'t know which change fixed the problem — or what might have broken something else. One targeted change per iteration."},{"front":"What is the self-debug technique?","back":"Asking the AI to explain its interpretation of your instructions and where it made assumptions — this surfaces hidden misinterpretations you didn\\\'t know existed."},{"front":"What is a failure log and why keep one?","back":"A record of what went wrong and what fixed it. Over time it builds intuition for writing good prompts the first time and reveals your personal patterns of mistakes."}]}'></div>
</div>

<div class="lesson-section">
  <div data-learn="MatchConnect" data-props='{"title":"Failure Modes — Match the Problem to Its Fix","instruction":"Tap one on the left, then its match on the right","pairs":[{"left":"Too Vague","right":"Add specifics: name the audience, context, and show an example of good output"},{"left":"Wrong Format","right":"Be explicit about format and use the Output First technique to anchor structure"},{"left":"Hallucination","right":"Ask it to flag confidence levels and say ‘if unsure, say so’"},{"left":"Ignored Instructions","right":"Move critical rules to the top and emphasize with IMPORTANT: or NEVER:"}]}'></div>
</div>

<div class="lesson-section">
  <span class="section-label">Technique</span>
  <h2 class="section-title">Ask the AI to Debug Itself</h2>
  <p class="section-text">This is a powerful meta-technique. When output is wrong, ask the AI to explain its reasoning.</p>

  <div class="demo-container">
    <div class="demo-block" style="border-left: 3px solid var(--green);">
      <h4 style="color: var(--green);">Self-Debug Prompt</h4>
      <code>"Your previous response didn't match what I needed. Here's what was wrong: [specific issue]. Before trying again, explain: what did you interpret my instructions to mean? Where did you make assumptions? Then give me a revised response addressing those gaps."</code>
    </div>
  </div>

  <p class="section-text">This surfaces misinterpretations you didn't know existed. The AI might reveal it understood "brief" to mean 50 words when you meant 200, or it focused on the wrong part of a multi-part instruction.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Pro Tip</span>
  <h2 class="section-title">Keep a Failure Log</h2>
  <p class="section-text">When a prompt fails and you fix it, write down what went wrong and what fixed it. Over time, you'll build an intuition for writing good prompts the first time. You'll also spot your personal patterns — maybe you consistently forget to specify format, or you tend to write prompts that are too short on context.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Try It Yourself</span>
  <h2 class="section-title">Debug a Bad Prompt</h2>
  <div class="try-it-box">
    <p>Write an intentionally vague prompt and run it. Then apply the debug loop: identify the gap, diagnose the failure mode, and fix the prompt one change at a time until the output is exactly right.</p>
    <div class="prompt-box">
      <code>Round 1 (vague): "Write something about marketing."
Round 2 (add task): "Write 5 social media post ideas for a SaaS product."
Round 3 (add context): "...for a project management tool targeting remote teams."
Round 4 (add format): "...each post should be under 280 characters with a hook and CTA."
Watch how each round gets closer to what you actually want.</code>
    </div>
  </div>
</div>

<div class="lesson-section">
  <div data-learn="QuizMC" data-props='{"title":"Debugging Bad Outputs Quiz","questions":[{"q":"What is the most important rule when debugging a prompt?","options":["Rewrite the entire prompt from scratch","Change one thing at a time so you know what fixed it","Add more examples","Make the prompt shorter"],"correct":1,"explanation":"If you rewrite everything at once, you won’t know which change fixed the problem — or what might have broken something else. One targeted change per iteration."},{"q":"What is the self-debug technique?","options":["Running the same prompt multiple times","Asking the AI to explain its interpretation of your instructions and where it made assumptions, then revising","Asking the AI to critique itself","Using a different AI model to check the output"],"correct":1,"explanation":"The self-debug prompt surfaces hidden misinterpretations — the AI might reveal it understood ‘brief’ to mean 50 words when you meant 200, or focused on the wrong part of a multi-part instruction."},{"q":"Which failure mode describes an AI that confidently states incorrect facts?","options":["Wrong format","Wrong tone","Hallucination","Ignored instructions"],"correct":2,"explanation":"Hallucination is when the AI states something confidently that is factually wrong. The fix is to ask for cited sources, confidence flags, or human verification for critical facts."}]}'></div>
</div>

<nav class="lesson-nav">
  <a href="/academy/advanced-prompt-engineering/07-context-window-mastery/" class="prev">&larr; Previous: Context Window Mastery</a>
  <a href="/academy/advanced-prompt-engineering/09-domain-specific-prompts/" class="next">Next: Domain-Specific Prompts &rarr;</a>
</nav>

</div>
