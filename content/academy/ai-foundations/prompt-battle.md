---
title: "Prompt Battle"
course: "ai-foundations"
order: 6
type: "quiz"
free: false
---<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-foundations/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 6 of 9</span>
</nav>

<div class="lesson-hero">
  <h1>Prompt <span class="accent">Battle.</span></h1>
  <p class="sub">Test your prompt engineering skills. Score points for accuracy and prove your mastery.</p>
</div>

<div class="learn-card">
  <h3>This battle covers</h3>
  <ul>
    <li>Choosing the right prompt technique for each situation</li>
    <li>Understanding temperature and its effects</li>
    <li>System prompts and how they shape behavior</li>
    <li>When to use zero-shot vs few-shot vs chain-of-thought</li>
  </ul>
</div>

<!-- SECTION 1: BATTLE QUIZ -->
<div class="lesson-section">
  <span class="section-label">The Battle</span>
  <h2 class="section-title">Answer fast, answer right.</h2>

<div data-learn="FlashDeck" data-props='{"title":"Prompt Engineering Techniques","cards":[{"front":"Zero-Shot Prompting","back":"Ask the AI to perform a task with no examples. Works well for simple tasks like classification: Is this email spam or not?"},{"front":"Few-Shot Prompting","back":"Provide 2-3 examples of input-output pairs before your actual request. Teaches the AI your desired format and style by demonstration."},{"front":"Chain-of-Thought","back":"Ask the AI to show its reasoning step by step before giving an answer. Dramatically improves accuracy on math, logic, and complex analysis."},{"front":"Temperature","back":"Controls randomness. Low (0.0-0.2) = deterministic, focused, correct. High (0.8-1.0) = creative, varied, surprising. Use low for code, high for brainstorming."},{"front":"Context Window","back":"The total amount of text (prompt + response) the model can process at once. Claude has 200K tokens. Everything must fit inside this window."}]}'></div>

<div data-learn="QuizMC" data-props='{"title":"Prompt Engineering Battle — 6 Rounds","questions":[{"q":"Which prompt technique is BEST for getting accurate math solutions?","options":["Zero-shot: just ask the question","Few-shot: show 3 similar solved problems","Chain-of-thought: ask for step-by-step reasoning","Role-play: pretend to be a calculator"],"correct":2,"explanation":"Chain-of-thought prompting forces the model to show its reasoning, which dramatically reduces errors on multi-step problems. Research shows up to 2x accuracy improvement."},{"q":"What does lowering the temperature parameter do?","options":["Makes the AI respond faster","Makes outputs more deterministic and focused","Reduces the context window size","Makes the AI more creative"],"correct":1,"explanation":"Temperature controls randomness. Lower temperature (closer to 0) makes the model always pick the highest-probability token, giving consistent, focused outputs."},{"q":"A system prompt is powerful because it:","options":["Gets processed before any user messages, shaping all responses","Uses fewer tokens than regular prompts","Bypasses the model safety guidelines","Runs on a separate, faster processor"],"correct":0,"explanation":"System prompts set the behavioral framework before any user interaction. They are processed first and influence every subsequent response — like giving the AI its job description."},{"q":"When should you use few-shot prompting instead of zero-shot?","options":["Always — few-shot is strictly better","When the task requires a specific output format or style the AI might not guess","Only for creative writing tasks","When you want shorter responses"],"correct":1,"explanation":"Few-shot prompting shines when you need the AI to follow a specific pattern. Showing 2-3 examples of input-output pairs teaches the format better than describing it."},{"q":"You need AI to write code. What temperature should you use?","options":["High (0.8-1.0) for creative solutions","Medium (0.5) as a balanced default","Low (0.0-0.2) for deterministic, correct code","Temperature does not affect code quality"],"correct":2,"explanation":"Code needs to be correct, not creative. Low temperature makes the model pick the most likely (usually most correct) tokens. High temperature introduces randomness that can cause syntax errors and bugs."},{"q":"What is the context window?","options":["The browser window where you chat with AI","The total amount of text (prompt + response) the model can process at once","A debugging tool for prompt engineers","The time limit for each AI response"],"correct":1,"explanation":"The context window is the model working memory — everything it can see at once. Your prompt plus the response must fit inside. Claude has 200K tokens, GPT-4 has 128K tokens."}]}'></div>

</div>

<!-- SECTION 2: TECHNIQUE MATCHING -->
<div class="lesson-section">
  <span class="section-label">Technique Mastery</span>
  <h2 class="section-title">Match the technique to the task.</h2>

<div data-learn="QuizMC" data-props='{"title":"Match Technique to Task","questions":[{"q":"You need the AI to extract structured data from messy emails in a format unique to your company. Which technique?","options":["Zero-shot with clear instructions","Few-shot with 3 examples of your exact format","Chain-of-thought step-by-step","Role-play as a data entry clerk"],"correct":1,"explanation":"A unique company format is best taught by showing examples. Few-shot lets the AI learn your specific pattern from 2-3 demonstrations — far more reliable than trying to describe the format in words."},{"q":"You are debugging a complex algorithm and need the AI to find the logical error. Which technique?","options":["Zero-shot: just paste the code","Few-shot: show other bugs you have found","Chain-of-thought: ask it to trace through step by step","Role-play: pretend to be a rubber duck"],"correct":2,"explanation":"Debugging requires reasoning through the code execution step by step. Chain-of-thought forces the AI to trace the logic explicitly, making the error visible in the reasoning chain."},{"q":"You want a casual, funny social media post about a new product. Which technique?","options":["Zero-shot with tone instructions","Few-shot with examples of your brand voice","Chain-of-thought reasoning","Role-play as your brand's social media manager"],"correct":3,"explanation":"Role-play is ideal for tone and style. Telling the AI to be your brand social media manager gives it a holistic persona — voice, expertise, audience awareness — that produces more authentic content than listing instructions."},{"q":"You need to classify 10,000 customer support tickets into 5 categories. Which technique?","options":["Zero-shot: list the 5 categories and classify","Few-shot: show 3 examples of each category","Chain-of-thought for each ticket","Role-play as a support agent"],"correct":1,"explanation":"For straightforward classification with clear categories, zero-shot is fastest and cheapest. 10,000 tickets at chain-of-thought cost would be expensive. Zero-shot with precise category descriptions works well for well-defined tasks."}]}'></div>

</div>

<!-- SECTION 3: PIXEL QUEST -->
<div class="lesson-section">
  <span class="section-label">Final Challenge</span>
  <h2 class="section-title">Collect the prompt engineering knowledge.</h2>

<div data-learn="QuizMC" data-props='{"title":"Prompt Engineering Concepts","questions":[{"q":"What is a system prompt?","options":["The first message a user sends","Hidden instructions that define how the AI behaves for the entire conversation","An error message from the operating system","The AI model name"],"correct":1,"explanation":"System prompts are behind-the-scenes instructions. They set the AI persona, rules, and behavior before the user says anything."},{"q":"What is a context window?","options":["A pop-up window showing AI context","The maximum amount of text the AI can process in one conversation","A browser window for reading context","The speed at which AI processes text"],"correct":1,"explanation":"The context window is the AI total memory per conversation — input + output combined. Claude Opus 4.6 has a 1M token context window."},{"q":"What is Chain-of-Thought prompting?","options":["Sending many prompts in a chain","Asking the AI to show its reasoning step by step before giving an answer","Linking multiple AI models together","A way to speed up AI responses"],"correct":1,"explanation":"Chain-of-Thought asks the AI to reason out loud. This dramatically improves accuracy on math, logic, and complex analysis tasks."}]}'></div>

</div>

<!-- NEXT LESSON -->
<div class="lesson-section" style="text-align:center;padding:2rem 0">
  <a href="/academy/ai-foundations/words-as-numbers" style="display:inline-block;background:var(--orange);color:var(--bg);font-weight:700;padding:.75rem 2rem;border-radius:10px;text-decoration:none;font-size:.95rem">Next: Words as Numbers →</a>
</div>

</div>