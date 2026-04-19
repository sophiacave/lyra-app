# Anatomy of a Prompt

**Course:** AI Foundations
**Order:** 4
**Type:** lesson
**Access:** Premium

---
[← Course Home](/academy/ai-foundations/)
  Lesson 4 of 9


  # Anatomy of a Prompt.

  Watch your words get sliced into tokens in real-time. Understand the hidden structure behind every AI interaction.


  ### After this lesson you'll know


    - How AI breaks text into tokens (not words, not characters)

    - What the context window is and why it matters

    - How system prompts shape AI behavior

    - What temperature controls and when to adjust it




  Live Demo
  ## Type anything and watch it get tokenized.


  The Five Parts
  ## Every great prompt has up to five components.

  A well-crafted prompt is not just a question — it is an instruction manual. The best prompts give the AI everything it needs to succeed. Here are the five building blocks, from most essential to most advanced:



      **1. Task — what you want done**
      The core instruction. Every prompt has one. "Summarize this article." "Write a Python function that sorts a list." "Translate this to Spanish." Be specific about the action: "summarize" is clearer than "tell me about." A vague task gets a vague answer. A precise task gets a precise answer.


      **2. Context — the background information**
      Give the AI the information it needs to do the job well. This could be a document to summarize, data to analyze, or background about your situation. The more relevant context you provide, the better the response. Think of it as briefing a consultant before they start work — they cannot help you if they do not understand your situation.


      **3. Role — who the AI should be**
      "You are a senior data scientist" produces different output than "you are a high school teacher" — even with the same question. Roles shape vocabulary, depth, assumptions, and focus. A security engineer reviews code for vulnerabilities. A UX designer reviews it for user experience. Same code, completely different analysis. Roles are typically set in the system prompt.


      **4. Format — how the output should look**
      Tell the AI what shape the answer should take. "Respond in bullet points." "Use JSON format." "Write exactly 3 paragraphs." "Include a code example." Without format instructions, the AI guesses — and it might guess wrong. Specifying format is especially important when you are building applications that need to parse the AI's output programmatically.


      **5. Constraints — what to avoid or limit**
      "Do not use jargon." "Keep it under 200 words." "Never make promises about delivery dates." "Only use information from the provided document." Constraints are guardrails. They prevent common failure modes and keep the AI within bounds. Especially critical for customer-facing applications where the AI should not make promises or share sensitive information.



  Here is how all five components look in a single prompt:


Anatomy of a complete prompt

```
# ROLE (who the AI should be)
You are a senior technical writer with 10 years of experience
writing developer documentation.

# CONTEXT (background information)
Here is our API endpoint documentation for the /users route:
[... documentation text ...]

# TASK (what you want done)
Rewrite this documentation to be beginner-friendly.

# FORMAT (how the output should look)
Use markdown. Include a "Quick Start" section with a code
example, followed by a detailed reference table.

# CONSTRAINTS (what to avoid)
Do not assume the reader knows REST APIs.
Keep sentences under 20 words. No jargon without definitions.
```



    **You do not need all five components every time.** A simple task might only need Task + Format. A complex application prompt might use all five. The key is knowing which components will improve your specific situation.



  Key Concepts
  ## The four things that shape every AI response.




      **1. Tokens — how AI reads text**
      AI does not read words or characters. It reads *tokens* — subword chunks like "un" + "believ" + "able." Common words are one token; rare words get split. A token is roughly 4 characters or 0.75 words. This matters because you pay per token and your context window is measured in tokens.


      **2. Context Window — the model's working memory**
      Everything the model can see at once: your prompt, conversation history, and its response. Claude Opus 4.6 has a 1M token context window. GPT-4o has 128K. Once you exceed the window, the oldest content gets dropped. This is why long conversations can "forget" earlier context.


      **3. System Prompt — the invisible instructions**
      A hidden message processed before any user input. It defines the AI's persona, rules, and constraints. The user never sees it, but it shapes every response. Think of it as giving the AI a job description before it starts work.


      **4. Temperature — creativity vs accuracy dial**
      Controls randomness in the output. Low (0.0) = always picks the most likely word = deterministic, focused, correct. High (1.0) = sometimes picks unlikely words = creative, surprising, error-prone. Use low for code and facts, high for brainstorming.



  Here is a real API call showing all four concepts in action:


Python — all four concepts in one API call

```
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-6",       # which model
    max_tokens=500,                  # ← context window budget
    temperature=0.2,                 # ← low = factual, precise
    system="You are a helpful coding tutor. "  # ← system prompt
           "Explain concepts simply. "
           "Always include a code example.",
    messages=[                         # ← user message (tokenized)
        {"role": "user",
         "content": "What is a list comprehension in Python?"}
    ]
)

# Check token usage
print(f"Input tokens:  {response.usage.input_tokens}")
print(f"Output tokens: {response.usage.output_tokens}")
print(response.content[0].text)
```


Every parameter in this call maps to one of the four concepts. The `system` message is the invisible instruction. The `messages` content gets tokenized. `max_tokens` limits the context window budget. `temperature` controls creativity.


  Watch Out
  ## Common prompt mistakes and how to fix them.

  Understanding what goes wrong helps you write better prompts from the start. Here are the four most common mistakes beginners make:



      **Mistake 1: Being too vague**
      "Help me with my project" gives the AI nothing to work with. Instead: "I am building a React dashboard that shows sales data. Help me create a bar chart component that takes an array of monthly revenue numbers." Specificity is the single biggest lever you have.


      **Mistake 2: Overloading one prompt**
      Asking the AI to "write a blog post, optimize it for SEO, translate it to Spanish, and create social media posts" in one go leads to mediocre results on all fronts. Break complex tasks into steps. Each prompt should have one clear objective.


      **Mistake 3: Not specifying format**
      If you need JSON, say "respond in valid JSON." If you need bullet points, say so. The AI will guess the format if you do not specify — and it often guesses wrong. This is especially critical when building applications that need to parse AI output programmatically.


      **Mistake 4: Ignoring the context window**
      Pasting an entire 50-page document and asking "summarize this" may hit context limits or dilute the AI's focus. Instead, identify the most relevant sections, paste those, and be specific about what to summarize. More context is not always better — focused context is.




  Experiment
  ## See how temperature changes output.


### Temperature Guide — Flip for Details

**Card 1:**
Front: 🧊 LOW TEMPERATURE (0.0 - 0.3)  Deterministic and focused
Back: BEST FOR: Code, math, factual questions, data analysis  The model always picks the most likely next token. Consistent, predictable, correct — but potentially repetitive.  USE WHEN: You need one right answer, not creative options.

**Card 2:**
Front: ⚖️ MEDIUM TEMPERATURE (0.4 - 0.7)  Balanced default
Back: BEST FOR: General conversations, business writing, explanations  Good mix of coherence and variety. The default for most AI chatbots.  USE WHEN: You want natural-sounding output that is still reliable.

**Card 3:**
Front: 🔥 HIGH TEMPERATURE (0.8 - 1.0+)  Creative and unpredictable
Back: BEST FOR: Brainstorming, creative writing, generating diverse options  The model sometimes picks unlikely tokens, leading to surprising and creative output — but also more errors.  USE WHEN: You want ideas, not accuracy. Be prepared to filter.


  Knowledge Check
  ## Test your understanding.


### Quiz

**Q1: How does AI read the word "unbelievable"?**
    A. As one token: unbelievable
    B. As individual characters: u-n-b-e-l-i-e-v-a-b-l-e
  ✓ C. As subword chunks like: un-believ-able
    D. As the dictionary definition of the word
  *AI tokenizers break words into subword chunks. Unbelievable becomes something like un + believ + able. The model never sees raw text — only token IDs (numbers).*

**Q2: Claude has a 200K token context window. What does this mean?**
    A. It can remember 200,000 previous conversations
  ✓ B. Your prompt plus its response must fit within 200,000 tokens total
    C. It can process 200,000 words per second
    D. It has 200,000 neurons
  *The context window is the model working memory. Everything it can see at once — your prompt, conversation history, and its response — must fit within this limit.*

**Q3: You are writing a system prompt for a customer service bot. It should be helpful but never make promises about refunds. Where does this instruction go?**
    A. In the user message
  ✓ B. In the system prompt — it gets processed before any user messages
    C. In a separate configuration file
    D. Nowhere — AI cannot follow such instructions
  *System prompts set behavioral rules before any user interaction. They are the ideal place for personality, constraints, and behavioral guardrails.*



    **Every prompt is a performance.** Your words get chopped into tokens, fed through the context window alongside a system prompt, shaped by temperature, and out comes a response. Understanding this anatomy turns you from a user into an engineer.



  Summary
  ## The complete prompt pipeline.

  Every time you send a message to an AI, here is exactly what happens under the hood:


```
  THE PROMPT PIPELINE

  1. SYSTEM PROMPT loads first (invisible to user)
     → Sets persona, rules, constraints

  2. YOUR MESSAGE gets tokenized
     → "Hello world" → ["Hello", " world"] → [15339, 1917]

  3. CONTEXT WINDOW assembles everything
     → System + conversation history + your message

  4. TEMPERATURE shapes the generation
     → Low = predictable, High = creative

  5. TOKENS GENERATE one at a time
     → Each token is chosen based on probabilities

  6. RESPONSE streams back to you
     → Tokens get decoded back into readable text
```


  Understanding this pipeline means you can optimize at every step. Write better system prompts. Structure your messages for clarity. Choose the right temperature. Stay within the context window. These are the levers that separate mediocre AI interactions from excellent ones.


  [Next: Prompt Playground →](/academy/ai-foundations/prompt-playground)
