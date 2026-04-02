---
title: "Chain of Thought"
course: "advanced-prompt-engineering"
order: 3
type: "lesson"
free: true
---

<div class="wrap">

<nav class="local-nav">
  <a href="/academy/advanced-prompt-engineering/">Advanced Prompt Engineering</a>
  <span class="lesson-badge">Lesson 3 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Chain of Thought</h1>
  <p><span class="accent">Make AI show its work — and watch accuracy skyrocket.</span></p>
</div>

<div class="learn-card">
  <h3>What You'll Learn</h3>
  <ul>
    <li>What chain-of-thought prompting is and why it works</li>
    <li>When to use step-by-step reasoning vs. direct answers</li>
    <li>How to trigger deep thinking with simple phrases</li>
    <li>Advanced: thinking budgets and structured reasoning</li>
  </ul>
</div>

<div class="lesson-section">
  <span class="section-label">The Science</span>
  <h2 class="section-title">Why "Think Step by Step" Actually Works</h2>
  <p class="section-text">When you ask AI a complex question directly, it tries to jump straight to the answer. Sometimes it nails it. Often it doesn't — especially with math, logic, or multi-part problems.</p>
  <p class="section-text">Chain-of-thought (CoT) prompting forces the model to reason through intermediate steps before reaching a conclusion. Research shows this can improve accuracy on complex tasks by 20-40%. It's not magic — it's giving the AI scratch paper.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Basic Technique</span>
  <h2 class="section-title">Three Ways to Trigger Reasoning</h2>

  <div class="demo-container">
    <div class="demo-block" style="border-left: 3px solid var(--orange);">
      <h4 style="color: var(--orange);">1. The Simple Trigger</h4>
      <code>"Think step by step before answering."</code>
      <p style="color: var(--dim); margin-top: 0.5rem;">Surprisingly effective. Just adding this phrase improves results on reasoning tasks.</p>
    </div>
    <div class="demo-block" style="border-left: 3px solid var(--purple);">
      <h4 style="color: var(--purple);">2. The Structured Trigger</h4>
      <code>"First, identify the key variables. Then, analyze how they interact. Then, draw your conclusion. Show each step."</code>
      <p style="color: var(--dim); margin-top: 0.5rem;">More control. You define the reasoning structure.</p>
    </div>
    <div class="demo-block" style="border-left: 3px solid var(--green);">
      <h4 style="color: var(--green);">3. The Expert Trigger</h4>
      <code>"Approach this like a detective solving a case. Examine each piece of evidence, note what's relevant, eliminate what's not, then present your theory with supporting reasoning."</code>
      <p style="color: var(--dim); margin-top: 0.5rem;">Combines persona with reasoning. The metaphor shapes how the AI thinks.</p>
    </div>
  </div>
</div>

<div class="lesson-section">
  <div data-learn="FlashDeck" data-props='{"title":"Chain of Thought — Key Concepts","cards":[{"front":"What is chain-of-thought (CoT) prompting?","back":"A technique that forces the AI to reason through intermediate steps before reaching a conclusion — like giving it scratch paper. Research shows it improves accuracy by 20-40% on complex tasks."},{"front":"When should you use CoT?","back":"Math problems, logic puzzles, code debugging, strategic analysis, comparing options — any task where the reasoning matters as much as the answer."},{"front":"When should you skip CoT?","back":"Simple factual questions, creative writing, translation, formatting tasks — forcing reasoning here just adds noise without improving quality."},{"front":"What is a thinking budget?","back":"A prompt that asks the AI to consider multiple approaches (e.g., at least 3), evaluate trade-offs for each, then recommend the best path with justification — maximizing reasoning depth."},{"front":"What is the Expert Trigger technique?","back":"Combining a persona metaphor with step-by-step reasoning — e.g., 'approach this like a detective solving a case' — so the metaphor shapes HOW the AI thinks, not just what it says."}]}'></div>
</div>

<div class="lesson-section">
  <div data-learn="MatchConnect" data-props='{"title":"Match the CoT Technique","instruction":"Match each chain-of-thought concept to its description.","pairs":[{"left":"Simple Trigger","right":"Adding \"think step by step\" to improve reasoning"},{"left":"Structured Trigger","right":"Defining the exact reasoning steps the AI must follow"},{"left":"Expert Trigger","right":"Combining a persona metaphor with step-by-step reasoning"},{"left":"Thinking Budget","right":"Asking the AI to consider multiple approaches before deciding"},{"left":"Use CoT For","right":"Math, logic, debugging, and strategic analysis"},{"left":"Skip CoT For","right":"Translation, factual lookups, and formatting tasks"}]}'></div>
</div>

<div class="lesson-section">
  <span class="section-label">When to Use It</span>
  <h2 class="section-title">Not Everything Needs a Chain</h2>
  <p class="section-text"><strong style="color: var(--green);">Use CoT for:</strong> Math problems, logic puzzles, code debugging, strategic analysis, comparing options, anything where the reasoning matters as much as the answer.</p>
  <p class="section-text"><strong style="color: var(--red);">Skip CoT for:</strong> Simple factual questions, creative writing, translation, formatting tasks. Forcing reasoning here just adds noise.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Advanced</span>
  <h2 class="section-title">Thinking Budgets and Internal Reasoning</h2>
  <p class="section-text">Some AI systems (including Claude) support extended thinking — where the model reasons internally before responding. You can guide this by specifying how much thinking you want.</p>

  <div class="demo-container">
    <div class="demo-block" style="border-left: 3px solid var(--blue);">
      <h4 style="color: var(--blue);">Thinking Budget Prompt</h4>
      <code>"This is a complex architectural decision. Take your time. Consider at least 3 approaches, evaluate trade-offs for each, then recommend the best path with clear justification."</code>
    </div>
  </div>

  <p class="section-text">The key insight: you're not just asking for an answer. You're asking for a reasoning process. The quality of the process determines the quality of the output.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Try It Yourself</span>
  <h2 class="section-title">Compare Direct vs. Chain-of-Thought</h2>
  <div class="try-it-box">
    <p>Pick a problem that requires reasoning. Ask it twice — once directly, once with chain-of-thought. Compare the quality and accuracy of both answers.</p>
    <div class="prompt-box">
      <code>Direct: "What's the best database for my project?"
CoT: "I'm building [description]. Help me choose a database. First, identify my key requirements from the description. Then, list 3 database options that could work. For each, analyze pros and cons given my specific needs. Finally, recommend one with clear reasoning."</code>
    </div>
  </div>
</div>

<div class="lesson-section">
  <div data-learn="QuizMC" data-props='{"title":"Chain of Thought Quiz","questions":[{"q":"Why does chain-of-thought prompting improve accuracy on complex tasks?","options":["It makes the AI use more tokens","It forces the model to reason through intermediate steps before concluding","It gives the AI a longer time limit","It switches the AI to a different model"],"correct":1,"explanation":"CoT prompting requires the AI to work through reasoning steps before reaching a conclusion, reducing the chance of jumping to a wrong answer — like giving it scratch paper."},{"q":"When should you SKIP chain-of-thought prompting?","options":["Math problems","Code debugging","Translation and simple factual questions","Strategic analysis"],"correct":2,"explanation":"CoT adds value for reasoning-heavy tasks but creates noise for simple tasks like translation, factual lookups, or formatting where direct answers are better."},{"q":"What does a ‘thinking budget’ prompt accomplish?","options":["It limits how many tokens the AI can use","It asks the AI to evaluate multiple approaches before recommending one","It speeds up the AI’s response","It prevents the AI from showing its reasoning"],"correct":1,"explanation":"A thinking budget prompt asks the AI to consider multiple approaches, evaluate trade-offs for each, and then make a justified recommendation — maximizing reasoning depth."}]}'></div>
</div>

<nav class="lesson-nav">
  <a href="/academy/advanced-prompt-engineering/02-system-prompts-and-personas/" class="prev">&larr; Previous: System Prompts &amp; Personas</a>
  <a href="/academy/advanced-prompt-engineering/04-few-shot-and-examples/" class="next">Next: Few-Shot &amp; Examples &rarr;</a>
</nav>

</div>
