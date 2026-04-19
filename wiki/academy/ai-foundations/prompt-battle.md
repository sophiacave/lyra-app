# Prompt Battle

**Course:** AI Foundations
**Order:** 6
**Type:** quiz
**Access:** Premium

---
[← Course Home](/academy/ai-foundations/)
  Lesson 6 of 9


  # Prompt Battle.

  Test your prompt engineering skills. Score points for accuracy and prove your mastery.


  ### This battle covers


    - Choosing the right prompt technique for each situation

    - Understanding temperature and its effects

    - System prompts and how they shape behavior

    - When to use zero-shot vs few-shot vs chain-of-thought




  Strategy Guide
  ## The prompt engineer's decision tree.

  Before you battle, let's build your mental toolkit. Prompt engineering is about choosing the right strategy for the right situation — like picking the right tool from a toolbox. A hammer is great for nails, terrible for screws. Same with prompt techniques.



      **Zero-Shot — when the task speaks for itself**
      Use zero-shot when the task is common and well-defined. Classifying sentiment, translating text, summarizing a paragraph — the AI already knows how to do these. No examples needed. Just give a clear, specific instruction. Think of it as asking a skilled colleague to do something they already know how to do: "Summarize this in 3 bullet points." Simple. Direct. Effective.


      **Few-Shot — when you need a specific pattern**
      Use few-shot when you need the AI to follow a format it would not guess on its own. Showing 2-3 examples of input-output pairs teaches the pattern better than describing it. It is like training a new employee: instead of writing a 10-page manual, you show them three completed examples and say "do it like this." The AI picks up the pattern from your demonstrations.


      **Chain-of-Thought — when accuracy matters most**
      Use chain-of-thought for math, logic, debugging, and any multi-step reasoning. The magic phrase "think step by step" forces the AI to show its work — and showing work dramatically reduces errors. Research shows up to 2x accuracy improvement. It is like asking a student to show their math work: the process catches mistakes that a rushed final answer would miss.


      **Role-Play — when you need an expert voice**
      Use role-play when you want specialized expertise or a specific tone. "You are a senior security engineer" produces different output than "check this code." The persona shapes word choice, focus areas, and depth. It is like the difference between asking your friend about a legal issue versus asking a lawyer — same question, vastly different quality of answer.



  Here is the decision tree. Follow it before every prompt you write:


```
  PROMPT TECHNIQUE DECISION TREE

  Is the task simple and well-defined?
  ├── YES → Zero-Shot (just ask clearly)
  └── NO → Does it need a specific output format?
       ├── YES → Few-Shot (show 2-3 examples)
       └── NO → Does it need reasoning or accuracy?
            ├── YES → Chain-of-Thought (think step by step)
            └── NO → Does it need expertise or tone?
                 ├── YES → Role-Play (set a persona)
                 └── NO → Zero-Shot (default)

  PRO TIP: You can combine techniques!
  Role-Play + Chain-of-Thought = expert reasoning
  Few-Shot + Role-Play = patterned expert output
```




      **Temperature — the creativity dial**
      Temperature is a number from 0 to 1 that controls randomness. At **0**, the AI always picks the most likely next word — deterministic, consistent, factual. At **1**, it sometimes picks less likely words — creative, surprising, but error-prone. Think of it as a dial between "accountant mode" and "poet mode." Code and facts want low temperature. Brainstorming and creative writing want high temperature.


      **System prompts — the invisible rulebook**
      A system prompt is a hidden message processed before any user input. The user never sees it, but it shapes every response. Think of it as giving an actor their character brief before the show starts. System prompts define persona, rules, constraints, and tone. Every major AI product uses them — ChatGPT, Claude, Copilot all have system prompts running behind the scenes.




    **Now you have the playbook.** The battle below will test whether you can pick the right technique for each situation. Remember: there is usually one best answer, but combining techniques is a sign of mastery.



  The Battle
  ## Answer fast, answer right.


Prompt Example — Zero-Shot vs Few-Shot vs Chain-of-Thought

```
# ZERO-SHOT (no examples — just the task)
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
Answer: POSITIVE
```


### Prompt Engineering Techniques

**Card 1:**
Front: Zero-Shot Prompting
Back: Ask the AI to perform a task with no examples. Works well for simple tasks like classification: Is this email spam or not?

**Card 2:**
Front: Few-Shot Prompting
Back: Provide 2-3 examples of input-output pairs before your actual request. Teaches the AI your desired format and style by demonstration.

**Card 3:**
Front: Chain-of-Thought
Back: Ask the AI to show its reasoning step by step before giving an answer. Dramatically improves accuracy on math, logic, and complex analysis.

**Card 4:**
Front: Temperature
Back: Controls randomness. Low (0.0-0.2) = deterministic, focused, correct. High (0.8-1.0) = creative, varied, surprising. Use low for code, high for brainstorming.

**Card 5:**
Front: Context Window
Back: The total amount of text (prompt + response) the model can process at once. Claude has 200K tokens. Everything must fit inside this window.


### Quiz

**Q1: Which prompt technique is BEST for getting accurate math solutions?**
    A. Zero-shot: just ask the question
    B. Few-shot: show 3 similar solved problems
  ✓ C. Chain-of-thought: ask for step-by-step reasoning
    D. Role-play: pretend to be a calculator
  *Chain-of-thought prompting forces the model to show its reasoning, which dramatically reduces errors on multi-step problems. Research shows up to 2x accuracy improvement.*

**Q2: What does lowering the temperature parameter do?**
    A. Makes the AI respond faster
  ✓ B. Makes outputs more deterministic and focused
    C. Reduces the context window size
    D. Makes the AI more creative
  *Temperature controls randomness. Lower temperature (closer to 0) makes the model always pick the highest-probability token, giving consistent, focused outputs.*

**Q3: A system prompt is powerful because it:**
  ✓ A. Gets processed before any user messages, shaping all responses
    B. Uses fewer tokens than regular prompts
    C. Bypasses the model safety guidelines
    D. Runs on a separate, faster processor
  *System prompts set the behavioral framework before any user interaction. They are processed first and influence every subsequent response — like giving the AI its job description.*

**Q4: When should you use few-shot prompting instead of zero-shot?**
    A. Always — few-shot is strictly better
  ✓ B. When the task requires a specific output format or style the AI might not guess
    C. Only for creative writing tasks
    D. When you want shorter responses
  *Few-shot prompting shines when you need the AI to follow a specific pattern. Showing 2-3 examples of input-output pairs teaches the format better than describing it.*

**Q5: You need AI to write code. What temperature should you use?**
    A. High (0.8-1.0) for creative solutions
    B. Medium (0.5) as a balanced default
  ✓ C. Low (0.0-0.2) for deterministic, correct code
    D. Temperature does not affect code quality
  *Code needs to be correct, not creative. Low temperature makes the model pick the most likely (usually most correct) tokens. High temperature introduces randomness that can cause syntax errors and bugs.*

**Q6: What is the context window?**
    A. The browser window where you chat with AI
  ✓ B. The total amount of text (prompt + response) the model can process at once
    C. A debugging tool for prompt engineers
    D. The time limit for each AI response
  *The context window is the model working memory — everything it can see at once. Your prompt plus the response must fit inside. Claude has 200K tokens, GPT-4 has 128K tokens.*


  Technique Mastery
  ## Match the technique to the task.


[Interactive: QuizMC]


  Advanced Moves
  ## Combine techniques for maximum power.

  The real masters do not use one technique at a time — they layer them. Here are the most effective combinations:



      **Role-Play + Chain-of-Thought**
      "You are a senior financial analyst. Analyze this quarterly report step by step before giving your recommendation." The role sets the expertise level and vocabulary. The chain-of-thought forces rigorous reasoning. Together they produce expert-quality analysis with visible logic.


      **Few-Shot + Constraints**
      "Here are 3 examples of how we format support tickets. Now format this one. Never include the customer's email address in the summary." The examples teach the pattern. The constraints add guardrails. This is the standard pattern for production AI applications where consistency and safety matter.


      **System Prompt + Few-Shot + Temperature**
      Set the persona in the system prompt, provide examples in the user message, and tune temperature for the task. This triple-layer approach is what powers most commercial AI products. The system prompt sets the foundation, examples calibrate the format, and temperature controls the creativity level.




    **The best prompts are designed, not written.** Think of each technique as a tool in your belt. Simple tasks need one tool. Complex tasks need a combination. The quiz below tests whether you can pick the right tool — or the right combination — for each situation.



  Final Challenge
  ## Collect the prompt engineering knowledge.


### Quiz

**Q1: What is a system prompt?**
    A. The first message a user sends
  ✓ B. Hidden instructions that define how the AI behaves for the entire conversation
    C. An error message from the operating system
    D. The AI model name
  *System prompts are behind-the-scenes instructions. They set the AI persona, rules, and behavior before the user says anything.*

**Q2: What is a context window?**
    A. A pop-up window showing AI context
  ✓ B. The maximum amount of text the AI can process in one conversation
    C. A browser window for reading context
    D. The speed at which AI processes text
  *The context window is the AI total memory per conversation — input + output combined. Claude Opus 4.6 has a 1M token context window.*

**Q3: What is Chain-of-Thought prompting?**
    A. Sending many prompts in a chain
  ✓ B. Asking the AI to show its reasoning step by step before giving an answer
    C. Linking multiple AI models together
    D. A way to speed up AI responses
  *Chain-of-Thought asks the AI to reason out loud. This dramatically improves accuracy on math, logic, and complex analysis tasks.*


  Remember
  ## The prompt engineer's cheat sheet.


```
  PROMPT ENGINEERING CHEAT SHEET

  Technique        Best For                   Key Phrase
  ─────────        ────────                   ──────────
  Zero-Shot        Simple, clear tasks        "Classify this as..."
  Few-Shot         Custom formats/styles      "Here are 3 examples..."
  Chain-of-Thought Math, logic, debugging     "Think step by step..."
  Role-Play        Expert voice/persona       "You are a senior..."

  TEMPERATURE GUIDE
  0.0 - 0.2  Code, math, facts, data extraction
  0.3 - 0.6  Business writing, explanations, general use
  0.7 - 1.0  Brainstorming, creative writing, idea generation

  POWER COMBOS
  Role + CoT        Expert-level reasoning with visible logic
  Few-Shot + Guard  Consistent format with safety constraints
  System + Examples Production-ready AI applications
```



    **Prompt engineering is a skill, not a talent.** The more you practice, the better your instincts become. Save this cheat sheet and reference it every time you write a prompt until the patterns become second nature.



  [Next: Words as Numbers →](/academy/ai-foundations/words-as-numbers)
