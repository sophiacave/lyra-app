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

<!-- SECTION 0: STRATEGY GUIDE -->
<div class="lesson-section">
  <span class="section-label">Strategy Guide</span>
  <h2 class="section-title">The prompt engineer's decision tree.</h2>
  <p class="section-text">Before you battle, let's build your mental toolkit. Prompt engineering is about choosing the right strategy for the right situation — like picking the right tool from a toolbox. A hammer is great for nails, terrible for screws. Same with prompt techniques.</p>

  <div style="display:grid;gap:.75rem;margin-top:.75rem">
    <div style="padding:1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
      <strong style="color:#34d399;font-size:.88rem">Zero-Shot — when the task speaks for itself</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Use zero-shot when the task is common and well-defined. Classifying sentiment, translating text, summarizing a paragraph — the AI already knows how to do these. No examples needed. Just give a clear, specific instruction. Think of it as asking a skilled colleague to do something they already know how to do: "Summarize this in 3 bullet points." Simple. Direct. Effective.</p>
    </div>
    <div style="padding:1rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
      <strong style="color:#8b5cf6;font-size:.88rem">Few-Shot — when you need a specific pattern</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Use few-shot when you need the AI to follow a format it would not guess on its own. Showing 2-3 examples of input-output pairs teaches the pattern better than describing it. It is like training a new employee: instead of writing a 10-page manual, you show them three completed examples and say "do it like this." The AI picks up the pattern from your demonstrations.</p>
    </div>
    <div style="padding:1rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
      <strong style="color:#fb923c;font-size:.88rem">Chain-of-Thought — when accuracy matters most</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Use chain-of-thought for math, logic, debugging, and any multi-step reasoning. The magic phrase "think step by step" forces the AI to show its work — and showing work dramatically reduces errors. Research shows up to 2x accuracy improvement. It is like asking a student to show their math work: the process catches mistakes that a rushed final answer would miss.</p>
    </div>
    <div style="padding:1rem;border-radius:10px;background:rgba(56,189,248,.04);border:1px solid rgba(56,189,248,.1)">
      <strong style="color:#38bdf8;font-size:.88rem">Role-Play — when you need an expert voice</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Use role-play when you want specialized expertise or a specific tone. "You are a senior security engineer" produces different output than "check this code." The persona shapes word choice, focus areas, and depth. It is like the difference between asking your friend about a legal issue versus asking a lawyer — same question, vastly different quality of answer.</p>
    </div>
  </div>

  <p class="section-text" style="margin-top:1.25rem">Here is the decision tree. Follow it before every prompt you write:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.5;overflow-x:auto">
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a">  PROMPT TECHNIQUE DECISION TREE</span>

  Is the task simple and well-defined?
  ├── <span style="color:#34d399">YES</span> → <span style="color:#34d399">Zero-Shot</span> (just ask clearly)
  └── <span style="color:#ef4444">NO</span> → Does it need a specific output format?
       ├── <span style="color:#34d399">YES</span> → <span style="color:#8b5cf6">Few-Shot</span> (show 2-3 examples)
       └── <span style="color:#ef4444">NO</span> → Does it need reasoning or accuracy?
            ├── <span style="color:#34d399">YES</span> → <span style="color:#fb923c">Chain-of-Thought</span> (think step by step)
            └── <span style="color:#ef4444">NO</span> → Does it need expertise or tone?
                 ├── <span style="color:#34d399">YES</span> → <span style="color:#38bdf8">Role-Play</span> (set a persona)
                 └── <span style="color:#ef4444">NO</span> → <span style="color:#34d399">Zero-Shot</span> (default)

  <span style="color:#71717a">PRO TIP: You can combine techniques!</span>
  <span style="color:#71717a">Role-Play + Chain-of-Thought = expert reasoning</span>
  <span style="color:#71717a">Few-Shot + Role-Play = patterned expert output</span></code></pre>
</div>

  <div style="display:grid;gap:.75rem;margin-top:1rem">
    <div style="padding:1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
      <strong style="color:#ef4444;font-size:.88rem">Temperature — the creativity dial</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Temperature is a number from 0 to 1 that controls randomness. At <strong style="color:#e5e5e5">0</strong>, the AI always picks the most likely next word — deterministic, consistent, factual. At <strong style="color:#e5e5e5">1</strong>, it sometimes picks less likely words — creative, surprising, but error-prone. Think of it as a dial between "accountant mode" and "poet mode." Code and facts want low temperature. Brainstorming and creative writing want high temperature.</p>
    </div>
    <div style="padding:1rem;border-radius:10px;background:rgba(192,132,252,.04);border:1px solid rgba(192,132,252,.1)">
      <strong style="color:#c084fc;font-size:.88rem">System prompts — the invisible rulebook</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">A system prompt is a hidden message processed before any user input. The user never sees it, but it shapes every response. Think of it as giving an actor their character brief before the show starts. System prompts define persona, rules, constraints, and tone. Every major AI product uses them — ChatGPT, Claude, Copilot all have system prompts running behind the scenes.</p>
    </div>
  </div>

  <div class="narration" style="margin-top:1rem">
    <strong>Now you have the playbook.</strong> The battle below will test whether you can pick the right technique for each situation. Remember: there is usually one best answer, but combining techniques is a sign of mastery.
  </div>
</div>

<!-- SECTION 1: BATTLE QUIZ -->
<div class="lesson-section">
  <span class="section-label">The Battle</span>
  <h2 class="section-title">Answer fast, answer right.</h2>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Prompt Example — Zero-Shot vs Few-Shot vs Chain-of-Thought</div>
<pre style="margin:0;color:#e5e5e5"><code># ZERO-SHOT (no examples — just the task)
Classify this review as POSITIVE, NEGATIVE, or NEUTRAL:
"The battery lasts forever but the screen is dim."

# FEW-SHOT (teach by example)
Review: "Absolutely love it!" → POSITIVE
Review: "Broke after one day." → NEGATIVE
Review: "It's fine, nothing special." → NEUTRAL
Review: "The battery lasts forever but the screen is dim." → ???

# CHAIN-OF-THOUGHT (force step-by-step reasoning)
Classify this review as POSITIVE, NEGATIVE, or NEUTRAL.
Think step by step before answering:
"The battery lasts forever but the screen is dim."

Step 1: "battery lasts forever" = strong positive.
Step 2: "screen is dim" = moderate negative.
Step 3: Mixed sentiment, but positive outweighs.
Answer: POSITIVE</code></pre>
</div>

<div data-learn="FlashDeck" data-props='{"title":"Prompt Engineering Techniques","cards":[{"front":"Zero-Shot Prompting","back":"Ask the AI to perform a task with no examples. Works well for simple tasks like classification: Is this email spam or not?"},{"front":"Few-Shot Prompting","back":"Provide 2-3 examples of input-output pairs before your actual request. Teaches the AI your desired format and style by demonstration."},{"front":"Chain-of-Thought","back":"Ask the AI to show its reasoning step by step before giving an answer. Dramatically improves accuracy on math, logic, and complex analysis."},{"front":"Temperature","back":"Controls randomness. Low (0.0-0.2) = deterministic, focused, correct. High (0.8-1.0) = creative, varied, surprising. Use low for code, high for brainstorming."},{"front":"Context Window","back":"The total amount of text (prompt + response) the model can process at once. Claude has 200K tokens. Everything must fit inside this window."}]}'></div>

<div data-learn="QuizMC" data-props='{"title":"Prompt Engineering Battle — 6 Rounds","questions":[{"q":"Which prompt technique is BEST for getting accurate math solutions?","options":["Zero-shot: just ask the question","Few-shot: show 3 similar solved problems","Chain-of-thought: ask for step-by-step reasoning","Role-play: pretend to be a calculator"],"correct":2,"explanation":"Chain-of-thought prompting forces the model to show its reasoning, which dramatically reduces errors on multi-step problems. Research shows up to 2x accuracy improvement."},{"q":"What does lowering the temperature parameter do?","options":["Makes the AI respond faster","Makes outputs more deterministic and focused","Reduces the context window size","Makes the AI more creative"],"correct":1,"explanation":"Temperature controls randomness. Lower temperature (closer to 0) makes the model always pick the highest-probability token, giving consistent, focused outputs."},{"q":"A system prompt is powerful because it:","options":["Gets processed before any user messages, shaping all responses","Uses fewer tokens than regular prompts","Bypasses the model safety guidelines","Runs on a separate, faster processor"],"correct":0,"explanation":"System prompts set the behavioral framework before any user interaction. They are processed first and influence every subsequent response — like giving the AI its job description."},{"q":"When should you use few-shot prompting instead of zero-shot?","options":["Always — few-shot is strictly better","When the task requires a specific output format or style the AI might not guess","Only for creative writing tasks","When you want shorter responses"],"correct":1,"explanation":"Few-shot prompting shines when you need the AI to follow a specific pattern. Showing 2-3 examples of input-output pairs teaches the format better than describing it."},{"q":"You need AI to write code. What temperature should you use?","options":["High (0.8-1.0) for creative solutions","Medium (0.5) as a balanced default","Low (0.0-0.2) for deterministic, correct code","Temperature does not affect code quality"],"correct":2,"explanation":"Code needs to be correct, not creative. Low temperature makes the model pick the most likely (usually most correct) tokens. High temperature introduces randomness that can cause syntax errors and bugs."},{"q":"What is the context window?","options":["The browser window where you chat with AI","The total amount of text (prompt + response) the model can process at once","A debugging tool for prompt engineers","The time limit for each AI response"],"correct":1,"explanation":"The context window is the model working memory — everything it can see at once. Your prompt plus the response must fit inside. Claude has 200K tokens, GPT-4 has 128K tokens."}]}'></div>

</div>

<!-- SECTION 2: TECHNIQUE MATCHING -->
<div class="lesson-section">
  <span class="section-label">Technique Mastery</span>
  <h2 class="section-title">Match the technique to the task.</h2>

<div data-learn="QuizMC" data-props='{"title":"Match Technique to Task","questions":[{"q":"You need the AI to extract structured data from messy emails in a format unique to your company. Which technique?","options":["Zero-shot with clear instructions","Few-shot with 3 examples of your exact format","Chain-of-thought step-by-step","Role-play as a data entry clerk"],"correct":1,"explanation":"A unique company format is best taught by showing examples. Few-shot lets the AI learn your specific pattern from 2-3 demonstrations — far more reliable than trying to describe the format in words."},{"q":"You are debugging a complex algorithm and need the AI to find the logical error. Which technique?","options":["Zero-shot: just paste the code","Few-shot: show other bugs you have found","Chain-of-thought: ask it to trace through step by step","Role-play: pretend to be a rubber duck"],"correct":2,"explanation":"Debugging requires reasoning through the code execution step by step. Chain-of-thought forces the AI to trace the logic explicitly, making the error visible in the reasoning chain."},{"q":"You want a casual, funny social media post about a new product. Which technique?","options":["Zero-shot with tone instructions","Few-shot with examples of your brand voice","Chain-of-thought reasoning","Role-play as your brand's social media manager"],"correct":3,"explanation":"Role-play is ideal for tone and style. Telling the AI to be your brand social media manager gives it a holistic persona — voice, expertise, audience awareness — that produces more authentic content than listing instructions."},{"q":"You need to classify 10,000 customer support tickets into 5 categories. Which technique?","options":["Zero-shot: list the 5 categories and classify","Few-shot: show 3 examples of each category","Chain-of-thought for each ticket","Role-play as a support agent"],"correct":1,"explanation":"For straightforward classification with clear categories, zero-shot is fastest and cheapest. 10,000 tickets at chain-of-thought cost would be expensive. Zero-shot with precise category descriptions works well for well-defined tasks."}]}'></div>

</div>

<!-- SECTION 2B: COMBINING TECHNIQUES -->
<div class="lesson-section">
  <span class="section-label">Advanced Moves</span>
  <h2 class="section-title">Combine techniques for maximum power.</h2>
  <p class="section-text">The real masters do not use one technique at a time — they layer them. Here are the most effective combinations:</p>

  <div style="display:grid;gap:.75rem;margin-top:.75rem">
    <div style="padding:1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
      <strong style="color:#34d399;font-size:.88rem">Role-Play + Chain-of-Thought</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">"You are a senior financial analyst. Analyze this quarterly report step by step before giving your recommendation." The role sets the expertise level and vocabulary. The chain-of-thought forces rigorous reasoning. Together they produce expert-quality analysis with visible logic.</p>
    </div>
    <div style="padding:1rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
      <strong style="color:#8b5cf6;font-size:.88rem">Few-Shot + Constraints</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">"Here are 3 examples of how we format support tickets. Now format this one. Never include the customer's email address in the summary." The examples teach the pattern. The constraints add guardrails. This is the standard pattern for production AI applications where consistency and safety matter.</p>
    </div>
    <div style="padding:1rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
      <strong style="color:#fb923c;font-size:.88rem">System Prompt + Few-Shot + Temperature</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Set the persona in the system prompt, provide examples in the user message, and tune temperature for the task. This triple-layer approach is what powers most commercial AI products. The system prompt sets the foundation, examples calibrate the format, and temperature controls the creativity level.</p>
    </div>
  </div>

  <div class="narration" style="margin-top:1rem">
    <strong>The best prompts are designed, not written.</strong> Think of each technique as a tool in your belt. Simple tasks need one tool. Complex tasks need a combination. The quiz below tests whether you can pick the right tool — or the right combination — for each situation.
  </div>
</div>

<!-- SECTION 3: PIXEL QUEST -->
<div class="lesson-section">
  <span class="section-label">Final Challenge</span>
  <h2 class="section-title">Collect the prompt engineering knowledge.</h2>

<div data-learn="QuizMC" data-props='{"title":"Prompt Engineering Concepts","questions":[{"q":"What is a system prompt?","options":["The first message a user sends","Hidden instructions that define how the AI behaves for the entire conversation","An error message from the operating system","The AI model name"],"correct":1,"explanation":"System prompts are behind-the-scenes instructions. They set the AI persona, rules, and behavior before the user says anything."},{"q":"What is a context window?","options":["A pop-up window showing AI context","The maximum amount of text the AI can process in one conversation","A browser window for reading context","The speed at which AI processes text"],"correct":1,"explanation":"The context window is the AI total memory per conversation — input + output combined. Claude Opus 4.6 has a 1M token context window."},{"q":"What is Chain-of-Thought prompting?","options":["Sending many prompts in a chain","Asking the AI to show its reasoning step by step before giving an answer","Linking multiple AI models together","A way to speed up AI responses"],"correct":1,"explanation":"Chain-of-Thought asks the AI to reason out loud. This dramatically improves accuracy on math, logic, and complex analysis tasks."}]}'></div>

</div>

<!-- SECTION 3B: KEY TAKEAWAYS -->
<div class="lesson-section">
  <span class="section-label">Remember</span>
  <h2 class="section-title">The prompt engineer's cheat sheet.</h2>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.5;overflow-x:auto">
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a">  PROMPT ENGINEERING CHEAT SHEET</span>

  Technique        Best For                   Key Phrase
  ─────────        ────────                   ──────────
  <span style="color:#34d399">Zero-Shot</span>        Simple, clear tasks        "Classify this as..."
  <span style="color:#8b5cf6">Few-Shot</span>         Custom formats/styles      "Here are 3 examples..."
  <span style="color:#fb923c">Chain-of-Thought</span> Math, logic, debugging     "Think step by step..."
  <span style="color:#38bdf8">Role-Play</span>        Expert voice/persona       "You are a senior..."

  <span style="color:#71717a">TEMPERATURE GUIDE</span>
  <span style="color:#34d399">0.0 - 0.2</span>  Code, math, facts, data extraction
  <span style="color:#fb923c">0.3 - 0.6</span>  Business writing, explanations, general use
  <span style="color:#ef4444">0.7 - 1.0</span>  Brainstorming, creative writing, idea generation

  <span style="color:#71717a">POWER COMBOS</span>
  Role + CoT        Expert-level reasoning with visible logic
  Few-Shot + Guard  Consistent format with safety constraints
  System + Examples Production-ready AI applications</code></pre>
</div>

  <div class="narration" style="margin-top:1rem">
    <strong>Prompt engineering is a skill, not a talent.</strong> The more you practice, the better your instincts become. Save this cheat sheet and reference it every time you write a prompt until the patterns become second nature.
  </div>
</div>

<!-- NEXT LESSON -->
<div class="lesson-section" style="text-align:center;padding:2rem 0">
  <a href="/academy/ai-foundations/words-as-numbers" style="display:inline-block;background:var(--orange);color:var(--bg);font-weight:700;padding:.75rem 2rem;border-radius:10px;text-decoration:none;font-size:.95rem">Next: Words as Numbers →</a>
</div>

</div>