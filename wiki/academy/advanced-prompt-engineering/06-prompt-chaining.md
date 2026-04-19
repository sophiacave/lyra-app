# Prompt Chaining

**Course:** Advanced Prompt Engineering
**Order:** 6
**Type:** lesson
**Access:** Premium

---
[Advanced Prompt Engineering](/academy/advanced-prompt-engineering/)
  Lesson 6 of 10


  # Prompt Chaining

  Break complex tasks into connected steps. This is where prompt engineering becomes workflow engineering.


  ### What You'll Learn


    - Why one mega-prompt often fails and chains succeed

    - How to decompose tasks into chainable steps

    - Passing output from one prompt as input to the next

    - Building reliable multi-step workflows




  The Problem
  ## One Prompt Can't Do Everything

  There's a limit to what you can accomplish in a single prompt. Ask AI to research, analyze, write, format, and review — all at once — and quality drops across the board. The model spreads its attention too thin.
  Prompt chaining fixes this. You break the work into focused steps, where each prompt does one thing well, and the output of each step feeds into the next.


  The Pattern
  ## Input -> Process -> Output -> Next Input

  Every chain follows this pattern. The key insight: each step should produce clean, structured output that the next step can consume without confusion.



      Step 1: Research
      `"Analyze this company's website and extract: their target audience, main value proposition, top 3 competitors, and pricing model. Return as a structured brief."`


      Step 2: Strategy
      `"Based on this competitive brief: [paste Step 1 output]. Identify 3 positioning opportunities they're missing. For each, explain the gap and suggest a specific angle."`


      Step 3: Execution
      `"Using positioning opportunity #2 from this analysis: [paste Step 2 output]. Write 3 landing page headlines and a 100-word hero section that captures this angle. Tone: confident, not salesy."`




  Technique
  ## Gate Checks Between Steps

  Before passing output forward, add a validation step. This catches errors early instead of compounding them through the chain.



      Gate Check Prompt
      `"Review this output from the previous step. Check for: factual accuracy, completeness (all requested fields present), and internal consistency. If anything is wrong or missing, fix it. Then output the corrected version."`




  Advanced
  ## Parallel Chains and Merge Points

  Not every chain is linear. Sometimes you run parallel branches and merge the results.
  **Example:** You're writing a blog post. Branch A: research the topic and produce key facts. Branch B: analyze your audience and determine the right angle. Merge point: combine both outputs into a writing brief, then write the post from that brief.
  This mirrors how teams work. One person researches, another strategizes, then they combine insights. You can do the same thing with prompts.



### Prompt Chaining Patterns

**Card 1:**
Front: Generate → Critique → Revise
Back: Create something, evaluate it against criteria, then improve it based on the critique. Best for writing, proposals, and designs.

**Card 2:**
Front: Extract → Transform → Load
Back: Pull data from messy sources, clean and restructure it, then format for the destination. Best for data workflows.

**Card 3:**
Front: Brainstorm → Filter → Develop
Back: Generate many ideas, evaluate and select the best, then flesh out the winners. Best for ideation and strategy.

**Card 4:**
Front: What is a Gate Check?
Back: A validation step between chain steps that checks output for accuracy, completeness, and consistency — catching errors before they compound.

**Card 5:**
Front: What is a Parallel Chain?
Back: Running two branches simultaneously (e.g., research + audience analysis) then merging results at a single point before the final output.


  Common Patterns
  ## Chains You'll Use All the Time

  **Generate -> Critique -> Revise:** Create something, evaluate it against criteria, improve it based on the critique.
  **Extract -> Transform -> Load:** Pull data from messy sources, clean and restructure it, format for your destination.
  **Brainstorm -> Filter -> Develop:** Generate many ideas, evaluate and select the best, flesh out the winners.


  Real-World Chain
  ## Content Creation Pipeline

  Here's a complete 5-step chain for creating a blog post — the kind of workflow that produces consistently high-quality content.



      Step 1: Research Brief
      `"Research the topic: [topic]. Produce a brief with: 5 key facts, 3 common misconceptions, 2 expert perspectives, and 1 surprising angle most articles miss. Format as a structured brief I can hand to a writer."`


      Step 2: Audience Analysis
      `"Given this research brief: [Step 1 output]. My audience is [description]. What do they already know about this topic? What's their #1 question? What objection will they raise? What format do they prefer (listicle, deep-dive, how-to)?"`


      Step 3: Outline
      `"Using this research and audience analysis: [Step 1 + 2 outputs]. Create a detailed blog post outline. Include: headline, subheads, key points under each section, the hook for the intro, and the takeaway for the conclusion. Target: [word count] words."`


      Step 4: Draft
      `"Write the full blog post from this outline: [Step 3 output]. Tone: [tone]. Use specific examples and data from the research brief. Every paragraph must either teach something or prove something — no filler."`


      Step 5: Edit
      `"Edit this draft: [Step 4 output]. Check for: weak openings on any paragraph, unsupported claims, redundant sentences, passive voice, and jargon the target audience won't know. Return the edited version with changes tracked in [brackets]."`



  Each step is focused, and the output of each step is designed to be the perfect input for the next. This is the difference between prompt engineering and workflow engineering.


  Error Recovery
  ## What to Do When a Chain Step Fails

  Chains aren't fragile if you build in recovery points. When a step produces bad output, you have three options.
  **Option 1: Re-run the step.** Sometimes the same prompt produces better output on a second run. This works when the issue is randomness, not a flawed prompt.
  **Option 2: Fix the prompt.** If the output is consistently wrong, the prompt needs adjustment. Apply the debugging techniques from Lesson 8 — identify which failure mode it is, make one targeted change.
  **Option 3: Insert a correction step.** Add a new step between the failed step and the next one: "The previous step produced this output: [output]. It has this problem: [problem]. Fix the output so it meets these criteria: [criteria]. Then continue."
  The correction step is often the fastest fix because it doesn't require you to redesign the original prompt — it just patches the output before it flows downstream.


  Automation
  ## From Manual Chains to Automated Workflows

  Once you've validated a chain manually, you can automate it. The same sequence of prompts that you run by hand — copying output from one step into the next — can be scripted.
  **API-based chaining:** Use the AI's API to run each step programmatically. The script captures each response and passes it as input to the next call. This is the foundation of AI agents and workflow automation tools.
  **No-code tools:** Platforms like Make, Zapier, or n8n let you build multi-step AI chains visually. Each step calls the AI with a different prompt, and connectors handle passing data between them.
  The skill you're learning here — decomposing tasks and designing clean handoffs between steps — is the same skill used to build production AI systems. You're learning architecture, not just prompting.


  Design Principle
  ## How to Decompose Any Task Into a Chain

  The hardest part of chaining isn't writing the prompts — it's deciding where to split. Here's a framework for decomposing any complex task.
  **Rule 1: Split at context switches.** When the AI needs to shift from "gathering information" to "creating something" to "evaluating quality" — those are natural chain boundaries. Each mode of thinking gets its own step.
  **Rule 2: Split when output format changes.** If one part of the task produces structured data and another produces prose, those should be separate steps. Format shifts are a signal that the task has distinct phases.
  **Rule 3: Split at decision points.** If the next step depends on a judgment call (which option is best, which direction to take), make the judgment its own step. This lets you review the decision before the chain continues.
  **Rule 4: Don't over-split.** Every step adds overhead — prompting, reviewing output, passing data forward. If two sub-tasks are simple and closely related, keep them in one step. The goal is focused steps, not microscopic ones.


  Real-World Chain
  ## Code Refactoring Pipeline

  Prompt chains are powerful for code tasks. Here's a refactoring chain that produces thorough, safe refactors.



      Step 1: Analysis
      `"Read this code and identify: code smells (duplicated logic, long functions, unclear naming), potential bugs, and performance bottlenecks. For each issue, cite the line number and explain the risk. Don't suggest fixes yet — just diagnose."`


      Step 2: Prioritized Plan
      `"Given this analysis: [Step 1 output]. Rank the issues by impact (what would improve the code most). Create a refactoring plan: which changes to make, in what order, and why that order minimizes risk. Group changes that can be made together safely."`


      Step 3: Execute + Test
      `"Apply the top-priority refactoring group from this plan: [Step 2 output]. Show the refactored code. For each change, write a test that proves the behavior is preserved. Explain what changed and why it's safer/cleaner."`



  Splitting analysis from planning from execution prevents the AI from jumping to premature refactors. The diagnosis step often reveals that the highest-risk issue isn't the one you initially noticed.


  Try It Yourself
  ## Build a 3-Step Chain


    Pick a complex task you'd normally try in one prompt. Break it into 3 focused steps. Run each step separately, passing output forward. Compare the final result to what you'd get from a single mega-prompt.

      `Step 1: "Analyze [input]. Extract [specific data]. Format as [structure]."
Step 2: "Given this analysis: [Step 1 output]. Identify [insights/patterns]. Rank by [criteria]."
Step 3: "Using the top insight from: [Step 2 output]. Create [final deliverable]. Style: [specifications]."`





### Quiz

**Q1: Why does prompt chaining produce better results than one mega-prompt?**
    A. It is faster
  ✓ B. Each step focuses on one thing well, and the model isn’t forced to spread attention across too many tasks at once
    C. It costs less
    D. It uses fewer tokens
  *When a single prompt asks the AI to research, analyze, write, format, and review simultaneously, quality drops across all tasks. Chaining keeps each step focused.*

**Q2: What does a Gate Check do in a prompt chain?**
    A. It stops the chain from running too long
  ✓ B. It validates output from the previous step for accuracy and completeness before passing it forward
    C. It generates a summary of the chain
    D. It selects the best model for each step
  *Gate checks catch errors early. Without them, a mistake in step 2 compounds through steps 3, 4, and 5 — making the final output worse than if you’d caught it immediately.*

**Q3: What is the key rule for making each step in a chain work well?**
    A. Keep each step under 100 words
  ✓ B. Each step should produce clean, structured output that the next step can consume without confusion
    C. Each step should use a different model
    D. Always use JSON between steps
  *The output format of each step must be designed to be the clean input for the next step. Messy handoffs between steps are the primary cause of chain failures.*


  [← Previous: Structured Output](/academy/advanced-prompt-engineering/05-structured-output/)
  [Next: Context Window Mastery →](/academy/advanced-prompt-engineering/07-context-window-mastery/)
