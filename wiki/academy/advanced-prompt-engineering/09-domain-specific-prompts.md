# Domain-Specific Prompts

**Course:** Advanced Prompt Engineering
**Order:** 9
**Type:** lesson
**Access:** Premium

---
[Advanced Prompt Engineering](/academy/advanced-prompt-engineering/)
  Lesson 9 of 10


  # Domain-Specific Prompts

  Coding, writing, analysis, data — each domain has its own prompting patterns. Master them all.


  ### What You'll Learn


    - Prompting patterns for software development

    - Prompting patterns for writing and content creation

    - Prompting patterns for data analysis and research

    - How to adapt your general skills to any domain




  Coding
  ## Prompts for Software Development

  Coding prompts need precision. The AI must understand your stack, your patterns, and your constraints — or you'll spend more time fixing its code than writing your own.



      Code Generation
      `"Write a TypeScript function that validates email addresses. Requirements: RFC 5322 compliant, returns { valid: boolean, reason?: string }, handles edge cases (plus addressing, international domains). Use no external libraries. Include JSDoc comments. Write 3 unit tests using Vitest."`


      Code Review
      `"Review this function for: security vulnerabilities, performance issues, error handling gaps, and readability. For each issue found, explain the risk, show the problematic line, and provide a fix. If the code is solid, say so. Don't nitpick style preferences."`


      Debugging
      `"This function returns undefined when the input array has duplicate values. Here's the function: [code]. Here's a failing test case: [test]. Walk through the execution step by step with the failing input. Identify exactly where the logic breaks and why."`




  Writing
  ## Prompts for Content Creation

  Writing prompts need voice and audience clarity. Without them, you get perfectly grammatical content that sounds like it was written by nobody, for nobody.



      Blog Post
      `"Write a blog post about [topic]. Audience: [who]. They already know [baseline knowledge] but don't know [what this teaches]. Tone: conversational, like explaining to a smart friend over coffee. Use concrete examples, not abstract theory. 800-1000 words. Include a practical takeaway they can use today."`


      Email Sequence
      `"Write a 3-email welcome sequence for new subscribers to [product]. Email 1 (Day 0): Welcome + immediate value. Email 2 (Day 3): The #1 mistake beginners make. Email 3 (Day 7): Soft pitch for [paid offering]. Each email: subject line, preview text, body under 200 words. Tone: helpful mentor, not salesperson."`




  Analysis
  ## Prompts for Data and Research

  Analysis prompts need structure and rigor. You want the AI to think systematically, not just generate plausible-sounding conclusions.



      Data Analysis
      `"Analyze this sales data. First: identify the top 3 trends. For each trend, quantify the change (% or absolute), identify the likely cause, and rate your confidence (high/medium/low). Then: flag any anomalies that don't fit the trends. Finally: recommend 2 actions based on your analysis."`


      Research Synthesis
      `"I have 5 articles about [topic]. For each, extract: main argument, key evidence, methodology used, and limitations. Then synthesize across all 5: where do they agree? Where do they contradict? What questions remain unanswered? Present as a research brief."`





### Domain-Specific Prompt Patterns

**Card 1:**
Front: Code Generation Prompt — what must you specify?
Back: Stack, requirements (e.g. RFC compliance), return types, edge cases, no external libraries, documentation style, and test framework.

**Card 2:**
Front: Code Review Prompt — what should you ask AI to check?
Back: Security vulnerabilities, performance issues, error handling gaps, readability — with severity, problematic line, and a fix for each.

**Card 3:**
Front: Blog Post Prompt — what context is essential?
Back: Topic, audience, their baseline knowledge, unique angle, tone, length, and a practical takeaway. Without these, output is generic.

**Card 4:**
Front: Data Analysis Prompt — how do you structure it?
Back: Ask for: top trends with quantified change + likely cause + confidence rating, plus anomalies, plus 2 recommended actions.

**Card 5:**
Front: Research Synthesis Prompt — what 4 things to extract?
Back: Main argument, key evidence, methodology, and limitations — then synthesize: agreements, contradictions, unanswered questions.


  The Meta-Pattern
  ## Adapting to Any Domain

  Every domain has the same underlying needs. When entering a new domain, ask yourself:
  **What does "good" look like here?** Define quality criteria specific to this domain.
  **What are the common mistakes?** Tell the AI to avoid domain-specific pitfalls.
  **What terminology matters?** Use the right jargon so the AI activates the right knowledge.
  **What's the expected output format?** Every domain has conventions. Match them.


  Education
  ## Prompts for Teaching and Learning

  Education prompts require a different mindset — the goal isn't just accurate output, it's output that builds understanding.



      Concept Explanation
      `"Explain [concept] to someone who understands [prerequisite] but has never encountered [concept] before. Use an analogy from everyday life. Then give a concrete example. Then explain what the analogy gets wrong — where the analogy breaks down. Target: 200 words."`


      Quiz Generator
      `"Create 5 multiple-choice questions testing understanding of [topic]. Requirements:
- Each question tests a different concept or skill
- One obviously wrong answer (eliminates guessing)
- One 'close but wrong' answer (tests deeper understanding)
- One correct answer
- One tricky answer that's partially correct
- Include a brief explanation for why the correct answer is right and why the tricky answer is wrong"`


      Socratic Tutor
      `"You are a Socratic tutor. When I ask a question, don't give me the answer directly. Instead: ask me what I already know about the topic, then ask a question that leads me toward the answer. If I get stuck, give a hint — never the full answer. If I'm wrong, ask me to explain my reasoning so we can find where the logic breaks. Only give the direct answer if I explicitly ask for it."`




  Legal and Compliance
  ## Prompts That Require Precision and Caution

  Some domains carry higher stakes. Legal, medical, and financial prompts need extra guardrails because errors have real consequences.



      Contract Review
      `"Review this contract clause for potential risks. For each risk identified:
- Quote the exact language that creates the risk
- Explain the risk in plain English
- Rate severity: HIGH (could cause significant financial/legal harm), MEDIUM (disadvantageous but manageable), LOW (minor concern)
- Suggest alternative language that protects both parties

IMPORTANT: Flag any clause you're uncertain about with [NEEDS LAWYER REVIEW]. Do not provide definitive legal advice — frame findings as 'potential concerns for discussion with counsel.'"`



  Notice the explicit disclaimer instruction. In high-stakes domains, telling the AI to flag uncertainty and recommend professional review is a critical safety pattern — not because the AI can't analyze, but because the consequences of overconfidence are severe.


  Creative
  ## Prompts for Creative Work

  Creative prompts are paradoxically the hardest to write. Too many constraints kill creativity. Too few produce generic output. The sweet spot: constrain the structure, free the content.
  **Constrain structure:** "Write a 6-word story" or "Write a poem in three stanzas of four lines each." Structure gives the AI a creative challenge to work within.
  **Free content:** Instead of dictating what to write about, provide a theme or emotion. "Write about the moment right before everything changes" gives more creative space than "write about a person deciding to quit their job."
  **Reference creative influences:** "Write in the style of Raymond Carver" activates a specific literary voice. "Write like a noir detective narrating a cooking show" creates an unexpected combination that produces original output.
  **Use anti-cliche constraints:** "Write a love story. You may not use the words: heart, soul, forever, destiny, or fate." Constraints that remove defaults force the AI into more original territory.


  Cross-Domain
  ## Combining Domain Patterns for Unique Results

  The most powerful prompts often combine patterns from multiple domains. Here are three combinations that produce unexpectedly strong results.
  **Code + Writing:** "Document this API endpoint like you're writing a tutorial for a developer who's used REST APIs but never used ours. Include a working curl example, explain what each parameter does in plain English, and show the response with annotations."
  **Analysis + Creative:** "Analyze our customer churn data and present the findings as a narrative — tell the story the data is telling. Who are the characters (segments)? What's the conflict (why they leave)? What's the resolution (what we should do)?"
  **Education + Analysis:** "Explain our quarterly financial results to the marketing team. They understand revenue and growth but not CAC, LTV, or cohort analysis. Use analogies from marketing (campaigns, conversion funnels) to explain financial concepts. Include a glossary of terms they'll need."
  Cross-domain prompts work because they force the AI to translate between modes of thinking. The output isn't just accurate — it's accessible to people outside the original domain.


  Building Expertise
  ## Developing Your Domain Prompt Intuition

  The fastest way to develop domain-specific prompting skills is to study how experts in that domain think. Every field has implicit quality standards, common failure modes, and specialized vocabulary. Your prompt needs to capture all three.
  **Technique: Interview an expert.** If you're writing prompts for a domain you're not expert in, interview someone who is. Ask: "What does a beginner always get wrong? What would you check for first? What separates good work from great work in this field?" Their answers become your prompt constraints.
  **Technique: Study examples of great work.** Find 3 examples of excellent output in your target domain. Analyze what makes them excellent. Those qualities become your quality criteria in the prompt.
  **Technique: Build incrementally.** Start with a basic prompt for your domain. Use it 10 times. After each use, note what was wrong or missing. Refine. After 10 iterations, you'll have a battle-tested domain prompt that captures real-world edge cases no theoretical approach would catch.


  Try It Yourself
  ## Write a Domain-Specific Prompt


    Choose your primary domain (coding, writing, analysis, or something else entirely). Write a prompt using the patterns from this lesson. Include: domain-specific quality criteria, the right terminology, and a clear output format.

      `Domain: [your field]
Task: [specific deliverable]
Quality criteria: [what makes this good in your domain]
Terminology: [key terms the AI should use]
Output format: [domain conventions]
Avoid: [common mistakes in this domain]`





### Quiz

**Q1: When writing a code generation prompt, what should you specify beyond the task itself?**
    A. Only the programming language
  ✓ B. Stack, return types, edge cases, library restrictions, documentation style, and test framework
    C. Just a description of what the function should do
    D. The AI model to use
  *Coding prompts need precision across multiple dimensions — the AI must understand your stack, patterns, type signatures, and constraints or you’ll spend more time fixing than coding.*

**Q2: What four questions help you adapt to ANY domain?**
    A. Who, what, when, where
  ✓ B. What does good look like, what are the common mistakes, what terminology matters, what is the expected output format
    C. Role, context, task, format
    D. Audience, tone, length, examples
  *These four domain-adaptation questions ensure your prompt activates the right knowledge, avoids common pitfalls, uses the correct terminology, and matches domain conventions.*

**Q3: For a writing prompt, what is the most critical missing element that makes output sound generic?**
    A. Not specifying word count
  ✓ B. Not defining audience, baseline knowledge, angle, and tone
    C. Not asking for bullet points
    D. Not specifying the title
  *Without knowing the audience, what they already know, the unique angle, and the tone — the AI writes for nobody in particular. Voice and audience clarity are the keys to non-generic writing.*


  [← Previous: Debugging Bad Outputs](/academy/advanced-prompt-engineering/08-debugging-bad-outputs/)
  [Next: Your Prompt Library →](/academy/advanced-prompt-engineering/10-your-prompt-library/)
