# Debugging Bad Outputs

**Course:** Advanced Prompt Engineering
**Order:** 8
**Type:** lesson
**Access:** Premium

---
[Advanced Prompt Engineering](/academy/advanced-prompt-engineering/)
  Lesson 8 of 10


  # Debugging Bad Outputs

  When AI gets it wrong, the problem is almost always in the prompt. Here's how to find it.


  ### What You'll Learn


    - The 5 most common reasons AI output goes wrong

    - A systematic debugging framework for prompts

    - How to diagnose vague, wrong, or off-tone responses

    - Iterative refinement: making prompts better fast




  Mindset
  ## Bad Output Is Feedback, Not Failure

  When the AI gives you something wrong, it's telling you something about your prompt. Maybe the instructions were ambiguous. Maybe the context was missing. Maybe you assumed the AI knew something it didn't. Every bad output is a clue pointing to a specific fix.


  The Five Failure Modes
  ## What Went Wrong and Why

  **1. Too vague:** The output is generic, surface-level, could apply to anything. *Fix: Add specifics. Name the audience, the context, the constraints. Show an example of what "good" looks like.*
  **2. Wrong format:** You wanted bullet points, you got paragraphs. You wanted JSON, you got prose with a JSON block buried in it. *Fix: Be explicit about format. Use the "output first" technique from Lesson 5. Say what you DON'T want.*
  **3. Wrong tone:** Too formal, too casual, too verbose, too terse. *Fix: Describe tone with specific comparisons ("write like a Slack message to a colleague, not a formal email"). Provide a style example.*
  **4. Hallucination:** The AI stated something confidently that's factually wrong. *Fix: Ask it to cite sources. Add "if you're not sure, say so." For critical facts, ask it to flag confidence levels.*
  **5. Ignored instructions:** You gave clear rules and the AI broke them. *Fix: Move critical instructions to the top. Repeat key constraints. Use emphasis: "IMPORTANT:" or "NEVER:" for non-negotiable rules.*


  Framework
  ## The Debug Loop




      4-Step Debug Process
      `1. IDENTIFY: What specifically is wrong? Name the gap between expected and actual output.
2. DIAGNOSE: Which failure mode is it? (vague, format, tone, hallucination, ignored instruction)
3. HYPOTHESIZE: What in the prompt caused this? (missing context, ambiguous instruction, wrong placement)
4. FIX: Make ONE targeted change to the prompt. Test again. Repeat.`



  The critical rule: change one thing at a time. If you rewrite the entire prompt, you won't know what fixed it (or what broke something else).


  [Interactive: FlashDeck]


  Technique
  ## Ask the AI to Debug Itself

  This is a powerful meta-technique. When output is wrong, ask the AI to explain its reasoning.



      Self-Debug Prompt
      `"Your previous response didn't match what I needed. Here's what was wrong: [specific issue]. Before trying again, explain: what did you interpret my instructions to mean? Where did you make assumptions? Then give me a revised response addressing those gaps."`



  This surfaces misinterpretations you didn't know existed. The AI might reveal it understood "brief" to mean 50 words when you meant 200, or it focused on the wrong part of a multi-part instruction.


  Pro Tip
  ## Keep a Failure Log

  When a prompt fails and you fix it, write down what went wrong and what fixed it. Over time, you'll build an intuition for writing good prompts the first time. You'll also spot your personal patterns — maybe you consistently forget to specify format, or you tend to write prompts that are too short on context.


  Case Study
  ## Debugging a Real Prompt: Before and After

  Let's walk through a complete debugging session. The task: generate product comparison content for a website.



      Round 1 — The Failing Prompt
      `"Compare our product to competitors. Make it sound good."`
      Problem: Output was a generic, biased puff piece with made-up competitor features. Three failure modes at once: vague (no specifics), hallucination (invented features), wrong tone (too salesy).


      Round 2 — Fix: Add Context
      `"Compare our project management tool (features: Kanban boards, time tracking, Slack integration, $15/user/mo) to Asana and Monday.com. Be factually accurate about competitor features."`
      Better: eliminated hallucination by specifying features. But output was still a wall of text with no clear structure. Diagnosis: wrong format.


      Round 3 — Fix: Add Format + Constraints
      `"...Present as a comparison table with these columns: Feature, Our Tool, Asana, Monday.com. Include rows for: task management, time tracking, integrations, pricing, best for. Keep cells under 8 words. Tone: honest and confident — acknowledge where competitors are stronger. Do NOT make up features you're unsure about — write 'unverified' instead."`
      Result: clean, honest, usable comparison table. Three rounds, one fix per round, clear improvement each time.




  Advanced Technique
  ## The Contrastive Debugging Method

  When you can't figure out why a prompt fails, try the contrastive method: run the same task with two different prompts and compare the outputs to isolate what's working.



      Contrastive Debugging
      `Prompt A (your failing prompt): "Write a professional bio for my LinkedIn."

Prompt B (control prompt): "Write a LinkedIn bio. Role: senior data scientist, 8 years experience. Tone: confident but approachable. Include: ML expertise, team leadership, business impact. Format: 3 paragraphs, under 150 words. Avoid: buzzwords like 'passionate' or 'guru'."

Compare outputs A and B. The gap between them shows you exactly which levers Prompt A was missing.`



  This method is especially helpful when you're stuck. Instead of staring at a bad prompt trying to figure out what's wrong, you build a good prompt alongside it. The contrast reveals the gaps.


  Systematic Testing
  ## Building a Prompt Test Suite

  For prompts you use repeatedly, build a test suite — a set of inputs with known expected outputs. Run your prompt against these test cases whenever you modify it.
  **Standard case:** A typical input that should produce a typical output. This confirms your prompt still works for the common scenario.
  **Edge case:** An unusual input that tests your prompt's boundaries. Empty input, very long input, ambiguous input, input in a different language.
  **Adversarial case:** An input designed to break the prompt. Contradictory information, instructions to ignore the system prompt, deliberately misleading context.
  Three test cases — one of each type — give you confidence that a prompt change is an improvement, not a trade-off. This is how professionals iterate on prompts without regressions.


  Mindset
  ## The Debugging Mindset for Prompt Engineers

  Software debugging and prompt debugging share a critical principle: resist the urge to start over. When code has a bug, experienced developers don't rewrite the entire file — they isolate the issue, understand the root cause, and make a surgical fix.
  Apply the same discipline to prompts. When output is wrong, your first instinct might be to scrap the prompt and start fresh. Resist that. Instead, ask: "What specifically is wrong?" Then: "Which part of my prompt is responsible?" Then fix just that part.
  Over time, this discipline builds a mental model of how prompts work. You'll start predicting failure modes before they happen: "This instruction is ambiguous — the AI might interpret it two ways." That predictive ability is the hallmark of an expert prompt engineer.
  Every prompt you debug successfully teaches you something that every future prompt benefits from. The debugging process is not overhead — it is the primary learning mechanism for becoming better at prompt engineering.


  Quick Reference
  ## The Debugging Cheat Sheet

  Bookmark this. When output goes wrong, scan this list for the fastest fix.
  **Output too generic?** Add specific context: audience, numbers, names, constraints.
  **Wrong format?** Show the exact format you want. Use the "output first" technique.
  **Wrong tone?** Describe tone with comparisons: "like a Slack message" not "professional."
  **Hallucinating facts?** Add: "If unsure, say so. Cite sources. Flag confidence levels."
  **Ignoring instructions?** Move critical rules to the top. Use "IMPORTANT:" prefix. Repeat key constraints.
  **Too long?** Add explicit word/sentence limits. "Under 150 words. Maximum 3 paragraphs."
  **Too short?** Ask for depth: "Explain in detail. Include examples. Cover edge cases."
  **Off-topic?** Restate the core task explicitly. Add: "Focus ONLY on [X]. Do not discuss [Y]."
  **Repetitive?** Add: "Each point must be distinct. No overlapping ideas. If you can't find enough unique points, say so."


  Prevention
  ## Writing Debug-Resistant Prompts

  The best debugging strategy is not needing to debug. These habits prevent the most common failures before they happen.
  **Always specify format explicitly.** Don't assume the AI will choose the right format. If you want bullets, say bullets. If you want paragraphs, say paragraphs. If you want a table, define the columns.
  **Always include at least one constraint.** A prompt with no constraints is a prompt where anything goes. Even a simple "keep it under 300 words" dramatically improves focus.
  **Always define "done."** What does the finished output look like? How will you know it's right? If you can't articulate this, the AI certainly can't either.
  **Read your prompt as if you knew nothing.** Before sending, pretend you have no context about the task. Does the prompt make sense on its own? Every gap you can identify is a gap the AI will fill with assumptions.


  Try It Yourself
  ## Debug a Bad Prompt


    Write an intentionally vague prompt and run it. Then apply the debug loop: identify the gap, diagnose the failure mode, and fix the prompt one change at a time until the output is exactly right.

      `Round 1 (vague): "Write something about marketing."
Round 2 (add task): "Write 5 social media post ideas for a SaaS product."
Round 3 (add context): "...for a project management tool targeting remote teams."
Round 4 (add format): "...each post should be under 280 characters with a hook and CTA."
Watch how each round gets closer to what you actually want.`





### Quiz

**Q1: What is the most important rule when debugging a prompt?**
    A. Rewrite the entire prompt from scratch
  ✓ B. Change one thing at a time so you know what fixed it
    C. Add more examples
    D. Make the prompt shorter
  *If you rewrite everything at once, you won’t know which change fixed the problem — or what might have broken something else. One targeted change per iteration.*

**Q2: What is the self-debug technique?**
    A. Running the same prompt multiple times
  ✓ B. Asking the AI to explain its interpretation of your instructions and where it made assumptions, then revising
    C. Asking the AI to critique itself
    D. Using a different AI model to check the output
  *The self-debug prompt surfaces hidden misinterpretations — the AI might reveal it understood ‘brief’ to mean 50 words when you meant 200, or focused on the wrong part of a multi-part instruction.*

**Q3: Which failure mode describes an AI that confidently states incorrect facts?**
    A. Wrong format
    B. Wrong tone
  ✓ C. Hallucination
    D. Ignored instructions
  *Hallucination is when the AI states something confidently that is factually wrong. The fix is to ask for cited sources, confidence flags, or human verification for critical facts.*


  [← Previous: Context Window Mastery](/academy/advanced-prompt-engineering/07-context-window-mastery/)
  [Next: Domain-Specific Prompts →](/academy/advanced-prompt-engineering/09-domain-specific-prompts/)
