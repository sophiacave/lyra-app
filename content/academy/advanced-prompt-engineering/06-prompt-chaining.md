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
  <span class="section-label">Real-World Chain</span>
  <h2 class="section-title">Content Creation Pipeline</h2>
  <p class="section-text">Here's a complete 5-step chain for creating a blog post — the kind of workflow that produces consistently high-quality content.</p>

  <div class="demo-container">
    <div class="demo-block" style="border-left: 3px solid var(--orange);">
      <h4 style="color: var(--orange);">Step 1: Research Brief</h4>
      <code>"Research the topic: [topic]. Produce a brief with: 5 key facts, 3 common misconceptions, 2 expert perspectives, and 1 surprising angle most articles miss. Format as a structured brief I can hand to a writer."</code>
    </div>
    <div class="demo-block" style="border-left: 3px solid var(--purple);">
      <h4 style="color: var(--purple);">Step 2: Audience Analysis</h4>
      <code>"Given this research brief: [Step 1 output]. My audience is [description]. What do they already know about this topic? What's their #1 question? What objection will they raise? What format do they prefer (listicle, deep-dive, how-to)?"</code>
    </div>
    <div class="demo-block" style="border-left: 3px solid var(--green);">
      <h4 style="color: var(--green);">Step 3: Outline</h4>
      <code>"Using this research and audience analysis: [Step 1 + 2 outputs]. Create a detailed blog post outline. Include: headline, subheads, key points under each section, the hook for the intro, and the takeaway for the conclusion. Target: [word count] words."</code>
    </div>
    <div class="demo-block" style="border-left: 3px solid var(--blue);">
      <h4 style="color: var(--blue);">Step 4: Draft</h4>
      <code>"Write the full blog post from this outline: [Step 3 output]. Tone: [tone]. Use specific examples and data from the research brief. Every paragraph must either teach something or prove something — no filler."</code>
    </div>
    <div class="demo-block" style="border-left: 3px solid var(--red);">
      <h4 style="color: var(--red);">Step 5: Edit</h4>
      <code>"Edit this draft: [Step 4 output]. Check for: weak openings on any paragraph, unsupported claims, redundant sentences, passive voice, and jargon the target audience won't know. Return the edited version with changes tracked in [brackets]."</code>
    </div>
  </div>

  <p class="section-text">Each step is focused, and the output of each step is designed to be the perfect input for the next. This is the difference between prompt engineering and workflow engineering.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Error Recovery</span>
  <h2 class="section-title">What to Do When a Chain Step Fails</h2>
  <p class="section-text">Chains aren't fragile if you build in recovery points. When a step produces bad output, you have three options.</p>
  <p class="section-text"><strong style="color: var(--orange);">Option 1: Re-run the step.</strong> Sometimes the same prompt produces better output on a second run. This works when the issue is randomness, not a flawed prompt.</p>
  <p class="section-text"><strong style="color: var(--purple);">Option 2: Fix the prompt.</strong> If the output is consistently wrong, the prompt needs adjustment. Apply the debugging techniques from Lesson 8 — identify which failure mode it is, make one targeted change.</p>
  <p class="section-text"><strong style="color: var(--green);">Option 3: Insert a correction step.</strong> Add a new step between the failed step and the next one: "The previous step produced this output: [output]. It has this problem: [problem]. Fix the output so it meets these criteria: [criteria]. Then continue."</p>
  <p class="section-text">The correction step is often the fastest fix because it doesn't require you to redesign the original prompt — it just patches the output before it flows downstream.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Automation</span>
  <h2 class="section-title">From Manual Chains to Automated Workflows</h2>
  <p class="section-text">Once you've validated a chain manually, you can automate it. The same sequence of prompts that you run by hand — copying output from one step into the next — can be scripted.</p>
  <p class="section-text"><strong style="color: var(--blue);">API-based chaining:</strong> Use the AI's API to run each step programmatically. The script captures each response and passes it as input to the next call. This is the foundation of AI agents and workflow automation tools.</p>
  <p class="section-text"><strong style="color: var(--blue);">No-code tools:</strong> Platforms like Make, Zapier, or n8n let you build multi-step AI chains visually. Each step calls the AI with a different prompt, and connectors handle passing data between them.</p>
  <p class="section-text">The skill you're learning here — decomposing tasks and designing clean handoffs between steps — is the same skill used to build production AI systems. You're learning architecture, not just prompting.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Design Principle</span>
  <h2 class="section-title">How to Decompose Any Task Into a Chain</h2>
  <p class="section-text">The hardest part of chaining isn't writing the prompts — it's deciding where to split. Here's a framework for decomposing any complex task.</p>
  <p class="section-text"><strong style="color: var(--orange);">Rule 1: Split at context switches.</strong> When the AI needs to shift from "gathering information" to "creating something" to "evaluating quality" — those are natural chain boundaries. Each mode of thinking gets its own step.</p>
  <p class="section-text"><strong style="color: var(--purple);">Rule 2: Split when output format changes.</strong> If one part of the task produces structured data and another produces prose, those should be separate steps. Format shifts are a signal that the task has distinct phases.</p>
  <p class="section-text"><strong style="color: var(--green);">Rule 3: Split at decision points.</strong> If the next step depends on a judgment call (which option is best, which direction to take), make the judgment its own step. This lets you review the decision before the chain continues.</p>
  <p class="section-text"><strong style="color: var(--blue);">Rule 4: Don't over-split.</strong> Every step adds overhead — prompting, reviewing output, passing data forward. If two sub-tasks are simple and closely related, keep them in one step. The goal is focused steps, not microscopic ones.</p>
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
</div>

<div class="lesson-section">
  <div data-learn="QuizMC" data-props='{"title":"Prompt Chaining Quiz","questions":[{"q":"Why does prompt chaining produce better results than one mega-prompt?","options":["It is faster","Each step focuses on one thing well, and the model isn’t forced to spread attention across too many tasks at once","It costs less","It uses fewer tokens"],"correct":1,"explanation":"When a single prompt asks the AI to research, analyze, write, format, and review simultaneously, quality drops across all tasks. Chaining keeps each step focused."},{"q":"What does a Gate Check do in a prompt chain?","options":["It stops the chain from running too long","It validates output from the previous step for accuracy and completeness before passing it forward","It generates a summary of the chain","It selects the best model for each step"],"correct":1,"explanation":"Gate checks catch errors early. Without them, a mistake in step 2 compounds through steps 3, 4, and 5 — making the final output worse than if you’d caught it immediately."},{"q":"What is the key rule for making each step in a chain work well?","options":["Keep each step under 100 words","Each step should produce clean, structured output that the next step can consume without confusion","Each step should use a different model","Always use JSON between steps"],"correct":1,"explanation":"The output format of each step must be designed to be the clean input for the next step. Messy handoffs between steps are the primary cause of chain failures."}]}'></div>
</div>

<nav class="lesson-nav">
  <a href="/academy/advanced-prompt-engineering/05-structured-output/" class="prev">&larr; Previous: Structured Output</a>
  <a href="/academy/advanced-prompt-engineering/07-context-window-mastery/" class="next">Next: Context Window Mastery &rarr;</a>
</nav>

</div>
