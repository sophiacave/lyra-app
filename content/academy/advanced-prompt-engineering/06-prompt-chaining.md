---
title: "Prompt Chaining"
course: "advanced-prompt-engineering"
order: 6
type: "lesson"
free: false
---

<div class="wrap">

<nav class="local-nav">
  <a href="/academy/advanced-prompt-engineering/">Advanced Prompt Engineering</a>
  <span class="lesson-badge">Lesson 6 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Prompt Chaining</h1>
  <p><span class="accent">Break complex tasks into connected steps. This is where prompt engineering becomes workflow engineering.</span></p>
</div>

<div class="learn-card">
  <h3>What You'll Learn</h3>
  <ul>
    <li>Why one mega-prompt often fails and chains succeed</li>
    <li>How to decompose tasks into chainable steps</li>
    <li>Passing output from one prompt as input to the next</li>
    <li>Building reliable multi-step workflows</li>
  </ul>
</div>

<div class="lesson-section">
  <span class="section-label">The Problem</span>
  <h2 class="section-title">One Prompt Can't Do Everything</h2>
  <p class="section-text">There's a limit to what you can accomplish in a single prompt. Ask AI to research, analyze, write, format, and review — all at once — and quality drops across the board. The model spreads its attention too thin.</p>
  <p class="section-text">Prompt chaining fixes this. You break the work into focused steps, where each prompt does one thing well, and the output of each step feeds into the next.</p>
</div>

<div class="lesson-section">
  <span class="section-label">The Pattern</span>
  <h2 class="section-title">Input -> Process -> Output -> Next Input</h2>
  <p class="section-text">Every chain follows this pattern. The key insight: each step should produce clean, structured output that the next step can consume without confusion.</p>

  <div class="demo-container">
    <div class="demo-block" style="border-left: 3px solid var(--orange);">
      <h4 style="color: var(--orange);">Step 1: Research</h4>
      <code>"Analyze this company's website and extract: their target audience, main value proposition, top 3 competitors, and pricing model. Return as a structured brief."</code>
    </div>
    <div class="demo-block" style="border-left: 3px solid var(--purple);">
      <h4 style="color: var(--purple);">Step 2: Strategy</h4>
      <code>"Based on this competitive brief: [paste Step 1 output]. Identify 3 positioning opportunities they're missing. For each, explain the gap and suggest a specific angle."</code>
    </div>
    <div class="demo-block" style="border-left: 3px solid var(--green);">
      <h4 style="color: var(--green);">Step 3: Execution</h4>
      <code>"Using positioning opportunity #2 from this analysis: [paste Step 2 output]. Write 3 landing page headlines and a 100-word hero section that captures this angle. Tone: confident, not salesy."</code>
    </div>
  </div>
</div>

<div class="lesson-section">
  <span class="section-label">Technique</span>
  <h2 class="section-title">Gate Checks Between Steps</h2>
  <p class="section-text">Before passing output forward, add a validation step. This catches errors early instead of compounding them through the chain.</p>

  <div class="demo-container">
    <div class="demo-block" style="border-left: 3px solid var(--blue);">
      <h4 style="color: var(--blue);">Gate Check Prompt</h4>
      <code>"Review this output from the previous step. Check for: factual accuracy, completeness (all requested fields present), and internal consistency. If anything is wrong or missing, fix it. Then output the corrected version."</code>
    </div>
  </div>
</div>

<div class="lesson-section">
  <span class="section-label">Advanced</span>
  <h2 class="section-title">Parallel Chains and Merge Points</h2>
  <p class="section-text">Not every chain is linear. Sometimes you run parallel branches and merge the results.</p>
  <p class="section-text"><strong style="color: var(--green);">Example:</strong> You're writing a blog post. Branch A: research the topic and produce key facts. Branch B: analyze your audience and determine the right angle. Merge point: combine both outputs into a writing brief, then write the post from that brief.</p>
  <p class="section-text">This mirrors how teams work. One person researches, another strategizes, then they combine insights. You can do the same thing with prompts.</p>
</div>

<div class="lesson-section">
  <div data-learn="FlashDeck" data-props='{"title":"Prompt Chaining Patterns","cards":[{"front":"Generate → Critique → Revise","back":"Create something, evaluate it against criteria, then improve it based on the critique. Best for writing, proposals, and designs."},{"front":"Extract → Transform → Load","back":"Pull data from messy sources, clean and restructure it, then format for the destination. Best for data workflows."},{"front":"Brainstorm → Filter → Develop","back":"Generate many ideas, evaluate and select the best, then flesh out the winners. Best for ideation and strategy."},{"front":"What is a Gate Check?","back":"A validation step between chain steps that checks output for accuracy, completeness, and consistency — catching errors before they compound."},{"front":"What is a Parallel Chain?","back":"Running two branches simultaneously (e.g., research + audience analysis) then merging results at a single point before the final output."}]}'></div>
</div>

<div class="lesson-section">
  <span class="section-label">Common Patterns</span>
  <h2 class="section-title">Chains You'll Use All the Time</h2>
  <p class="section-text"><strong style="color: var(--orange);">Generate -> Critique -> Revise:</strong> Create something, evaluate it against criteria, improve it based on the critique.</p>
  <p class="section-text"><strong style="color: var(--purple);">Extract -> Transform -> Load:</strong> Pull data from messy sources, clean and restructure it, format for your destination.</p>
  <p class="section-text"><strong style="color: var(--green);">Brainstorm -> Filter -> Develop:</strong> Generate many ideas, evaluate and select the best, flesh out the winners.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Try It Yourself</span>
  <h2 class="section-title">Build a 3-Step Chain</h2>
  <div class="try-it-box">
    <p>Pick a complex task you'd normally try in one prompt. Break it into 3 focused steps. Run each step separately, passing output forward. Compare the final result to what you'd get from a single mega-prompt.</p>
    <div class="prompt-box">
      <code>Step 1: "Analyze [input]. Extract [specific data]. Format as [structure]."
Step 2: "Given this analysis: [Step 1 output]. Identify [insights/patterns]. Rank by [criteria]."
Step 3: "Using the top insight from: [Step 2 output]. Create [final deliverable]. Style: [specifications]."</code>
    </div>
  </div>
</div>

<div class="lesson-section">
  <div data-learn="QuizMC" data-props='{"title":"Prompt Chaining Quiz","questions":[{"q":"Why does prompt chaining produce better results than one mega-prompt?","options":["It is faster","Each step focuses on one thing well, and the model isn’t forced to spread attention across too many tasks at once","It costs less","It uses fewer tokens"],"correct":1,"explanation":"When a single prompt asks the AI to research, analyze, write, format, and review simultaneously, quality drops across all tasks. Chaining keeps each step focused."},{"q":"What does a Gate Check do in a prompt chain?","options":["It stops the chain from running too long","It validates output from the previous step for accuracy and completeness before passing it forward","It generates a summary of the chain","It selects the best model for each step"],"correct":1,"explanation":"Gate checks catch errors early. Without them, a mistake in step 2 compounds through steps 3, 4, and 5 — making the final output worse than if you’d caught it immediately."},{"q":"What is the key rule for making each step in a chain work well?","options":["Keep each step under 100 words","Each step should produce clean, structured output that the next step can consume without confusion","Each step should use a different model","Always use JSON between steps"],"correct":1,"explanation":"The output format of each step must be designed to be the clean input for the next step. Messy handoffs between steps are the primary cause of chain failures."}]}'></div>
</div>

<nav class="lesson-nav">
  <a href="/academy/advanced-prompt-engineering/05-structured-output/" class="prev">&larr; Previous: Structured Output</a>
  <a href="/academy/advanced-prompt-engineering/07-context-window-mastery/" class="next">Next: Context Window Mastery &rarr;</a>
</nav>

</div>
