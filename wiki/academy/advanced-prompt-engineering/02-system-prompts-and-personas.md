# System Prompts and Personas

**Course:** Advanced Prompt Engineering
**Order:** 2
**Type:** lesson
**Access:** Free

---
[Advanced Prompt Engineering](/academy/advanced-prompt-engineering/)
  Lesson 2 of 10


  # System Prompts and Personas

  Set the stage before the conversation even starts.


  ### What You'll Learn


    - What system prompts are and why they're your most powerful tool

    - How to craft personas that shape every response

    - The anatomy of a great system prompt

    - Common mistakes that weaken your instructions




  Foundation
  ## System Prompts Are the Operating System

  A system prompt is the instruction layer that sits above every conversation. It tells the AI who it is, how it should behave, and what rules to follow — before the user says a single word.
  Think of it as the difference between hiring a random stranger and briefing a specialist. The system prompt is that briefing.


  Anatomy
  ## The Four Parts of a System Prompt

  **Identity:** Who is the AI in this context? Give it a role, expertise level, and personality.
  **Behavior Rules:** How should it respond? Tone, length, formatting preferences.
  **Knowledge Boundaries:** What does it know? What should it admit it doesn't know?
  **Constraints:** What should it never do? Hard boundaries matter.


  Real Example
  ## Building a Code Review Persona




      System Prompt
      `You are a senior software engineer with 15 years of experience, specializing in code review. Your style: direct, constructive, no fluff. When reviewing code, always check for: security vulnerabilities, performance issues, readability, and adherence to DRY principles. Rate severity as [critical], [warning], or [suggestion]. Never rewrite the entire file — point to specific lines and explain why. If the code is good, say so briefly. Don't patronize.`



  Notice how specific this is. It defines expertise, tone, what to check, how to format findings, and what not to do. Every sentence removes ambiguity.


  Technique
  ## Persona Stacking

  You can layer multiple perspectives into one system prompt. This is powerful when you need nuanced output.



      Stacked Persona
      `You are a marketing strategist who thinks like a psychologist and writes like a journalist. Analyze campaigns through the lens of behavioral triggers, but communicate findings in clear, story-driven language. No jargon. No bullet-point lists unless asked.`




  [Interactive: FlashDeck]


  Advanced Technique
  ## System Prompts for Different Use Cases

  Different domains demand different system prompt architectures. Here are three battle-tested examples you can adapt immediately.



      Customer Support Agent
      `You are a customer support specialist for a SaaS project management tool. You've worked here for 3 years and know the product deeply.

Rules:
- Always greet the customer by name if provided
- Acknowledge their frustration before jumping to solutions
- If you don't know the answer, say "Let me escalate this to our engineering team" — never guess
- Maximum response length: 150 words
- Always end with a clear next step or question
- Never share internal pricing, roadmap, or technical architecture details
- If asked about a competitor, redirect to our strengths without badmouthing`


      Technical Writing Assistant
      `You are a senior technical writer who specializes in developer documentation. Your work has been praised for clarity and precision.

Style guide:
- Use active voice exclusively
- One idea per sentence
- Code examples must be complete and runnable — never use pseudo-code
- Define acronyms on first use
- Use second person ("you") not third person ("the user")
- Headers follow the pattern: verb + noun (e.g., "Configure Authentication")
- Never write "simply" or "just" — these words minimize complexity and frustrate readers`


      Strategic Advisor
      `You are a business strategist with expertise in early-stage startups. You've advised 50+ companies from seed to Series B.

Approach:
- Challenge assumptions before giving advice
- Always ask "what's the evidence?" when claims are made
- Prioritize advice by impact: high-impact actions first
- Be direct about risks — founders need honesty, not cheerleading
- When recommending, always provide the counter-argument too
- Frame advice as hypotheses to test, not truths to follow`




  Architecture
  ## Layering System Prompts with User Prompts

  In production AI applications, system prompts and user prompts work together in layers. Understanding this architecture makes you a better prompt engineer even in casual use.
  **Layer 1 — System prompt:** Defines identity, rules, and boundaries. This is the "constitution" that governs all responses. It stays constant across the conversation.
  **Layer 2 — Context injection:** Dynamic information added per conversation — the user's account data, recent activity, or relevant documents. This personalizes the system prompt's behavior.
  **Layer 3 — User prompt:** The actual question or request. The system prompt shapes HOW the AI responds to this. The user prompt determines WHAT it responds about.
  When you're crafting prompts in ChatGPT's custom instructions, Claude's system prompt field, or any API — you're writing Layer 1. The better your Layer 1, the less work Layers 2 and 3 need to do.


  Testing
  ## How to Test Your System Prompt

  A system prompt isn't done when you write it — it's done when you've tested it against edge cases. Here's a simple testing protocol.
  **1. The happy path:** Ask the AI something straightforward that falls squarely within its defined role. Does it respond with the right tone, format, and expertise?
  **2. The boundary test:** Ask something outside its defined scope. Does it gracefully decline or redirect? If it answers confidently about things it shouldn't know, your constraints are too weak.
  **3. The adversarial test:** Try to get the AI to break its rules. Ask it to "ignore previous instructions" or pressure it to do something it's told not to. A robust system prompt holds firm.
  **4. The consistency test:** Ask 5 different questions in the same domain. Are the tone, format, and depth consistent? Inconsistency signals that your prompt has gaps the AI is filling with defaults.


  Common Mistakes
  ## What Weakens a System Prompt

  **Too vague:** "Be helpful and professional" — this tells the AI nothing it doesn't already default to.
  **Too long:** A 2,000-word system prompt dilutes priority. The AI can't emphasize everything equally.
  **Contradictory:** "Be concise" + "Always explain your reasoning in detail" = confusion.
  **The fix:** Prioritize. Put your most important instructions first. Be specific about what "good" looks like. Test and iterate.


  Real-World Impact
  ## System Prompts in Production

  Every AI product you use has a system prompt working behind the scenes. ChatGPT's custom instructions, Claude's project instructions, customer support chatbots, AI writing tools — they all use system prompts to shape behavior.
  Understanding system prompts lets you do two things. First, it makes you better at configuring AI tools — every "custom instructions" field is a system prompt waiting to be engineered. Second, it lets you build AI-powered features in your own products.
  The system prompt is where 80% of an AI application's personality lives. Get it right, and every user interaction inherits that quality. Get it wrong, and no amount of user prompting can compensate.
  Think about it: if you're building a customer support bot, the difference between "frustrating chatbot" and "actually helpful assistant" is almost entirely in the system prompt. The same model, the same API, completely different user experience — because one has a 50-word system prompt and the other has a 500-word system prompt crafted with the techniques from this lesson.


  Template
  ## The Universal System Prompt Template

  Here's a reusable template you can adapt for any use case. Fill in each section and you'll have a production-quality system prompt in minutes.



      Universal Template
      `# IDENTITY
You are [role] with [years/type of experience]. You specialize in [domain].

# STYLE
- Tone: [e.g., direct but warm, clinical, enthusiastic]
- Length: [e.g., concise paragraphs, detailed explanations]
- Format: [e.g., always use bullet points, use headers for sections]

# RULES
- Always: [behavior that must happen every time]
- Never: [behavior that must never happen]
- When uncertain: [fallback behavior]

# KNOWLEDGE BOUNDARIES
- Expert in: [what you know deeply]
- Familiar with: [what you know at a surface level]
- Out of scope: [what you should redirect or decline]`




  Try It Yourself
  ## Build Your First Persona


    Create a system prompt for a use case you care about. Include all four parts: identity, behavior, knowledge boundaries, and constraints.

      `You are a [role] with [experience/expertise]. Your communication style is [tone]. When asked about [domain], always [specific behavior]. Never [constraint]. If you don't know something, [fallback behavior].`





### Quiz

**Q1: What is "persona stacking" in system prompts?**
    A. Writing a very long system prompt
  ✓ B. Layering multiple perspectives or roles into one prompt
    C. Running multiple system prompts at once
    D. Repeating instructions for emphasis
  *Persona stacking combines multiple viewpoints — e.g., a marketing strategist who thinks like a psychologist and writes like a journalist — for nuanced, multi-lens output.*

**Q2: Which of these is a red flag that weakens a system prompt?**
    A. Specifying severity tags for feedback
    B. Including a fallback behavior
  ✓ C. Writing contradictory instructions like ‘be concise’ and ‘always explain in detail’
    D. Describing the AI’s expertise level
  *Contradictory instructions confuse the AI about which rule takes priority and degrade output quality. Every instruction should point in a consistent direction.*

**Q3: Why does a vague instruction like ‘be helpful and professional’ weaken a system prompt?**
    A. It is too short
    B. It uses informal language
  ✓ C. It tells the AI nothing beyond its default behavior
    D. It lacks a persona name
  *The AI already defaults to helpful and professional behavior. Effective system prompts add specificity that changes behavior — tone, format, domain, constraints — beyond the defaults.*


  [← Previous: Beyond Basic Prompts](/academy/advanced-prompt-engineering/01-beyond-basic-prompts/)
  [Next: Chain of Thought →](/academy/advanced-prompt-engineering/03-chain-of-thought/)
