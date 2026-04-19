# Context Window Mastery

**Course:** Advanced Prompt Engineering
**Order:** 7
**Type:** lesson
**Access:** Premium

---
[Advanced Prompt Engineering](/academy/advanced-prompt-engineering/)
  Lesson 7 of 10


  # Context Window Mastery

  The context window is your workspace. Learn to use every square inch of it.


  ### What You'll Learn


    - What the context window is and why it has limits

    - How to prioritize what goes in (and what stays out)

    - Compression techniques for fitting more signal in less space

    - Long-context strategies for big documents and codebases




  Foundation
  ## Your Context Window Is Not Infinite

  Every AI model has a context window — the total amount of text it can "see" at once (your prompt + its response). Claude's can handle up to 200K tokens, GPT-4 up to 128K. That sounds like a lot, but it fills fast when you're working with documents, code, or long conversations.
  More importantly: just because a model can see 200K tokens doesn't mean it pays equal attention to all of them. Information at the beginning and end of the context gets more attention than the middle. This is called the "lost in the middle" effect, and it matters for how you structure your prompts.


  Strategy 1
  ## Front-Load What Matters

  Put your most important instructions and context at the very beginning of your prompt. Critical rules, key constraints, and the primary task should come first. Supporting details, reference material, and nice-to-haves go later.



      Good Structure
      `1. System instructions (who you are, critical rules)
2. The specific task (what to do right now)
3. Key constraints (must-haves and must-nots)
4. Reference material (supporting context)
5. Examples (if needed)
6. The actual input to process`




  Strategy 2
  ## Compress Without Losing Signal

  When you need to fit a lot of context, compression is your friend. But bad compression loses the important parts. Here's how to compress well.
  **Summarize first:** Before pasting a long document, ask AI to summarize it. Then use the summary as context for your actual task.
  **Extract relevant sections:** Don't paste an entire 50-page document. Pull out the 3 sections that actually matter for your question.
  **Use structured references:** Instead of pasting full files, paste function signatures, class names, and key logic blocks. The AI can reason about architecture without seeing every line.


  [Interactive: FlashDeck]


  Strategy 3
  ## The Rolling Context Technique

  For long tasks that span many turns in a conversation, context accumulates. Old messages eat up space. The rolling context technique keeps things fresh.



      Rolling Context Prompt
      `"Before we continue, summarize our work so far in 200 words: what we've decided, what's been built, and what's left to do. I'll use this summary to continue in a fresh context."`



  This is essentially creating a checkpoint. You capture the essential state, start fresh, and lose nothing important.


  Strategy 4
  ## Chunking Large Documents

  When analyzing a document that's too large for one pass, break it into chunks with overlap. Process each chunk, then combine the results.
  **The overlap is crucial.** If you split a document at page 10, important context might span pages 9-11. A 10-15% overlap between chunks prevents information from falling through the cracks.


  Strategy 5
  ## The Attention Budget Framework

  Think of the context window like a budget. Every token you include costs attention. Some tokens are high-value (instructions, constraints, key data). Others are low-value (boilerplate, redundant context, nice-to-have details). Your job is to maximize signal-to-noise ratio.



      Low Signal-to-Noise
      `"Here's our complete company handbook (15,000 words). Based on this, write an onboarding email for new engineers."`
      The AI drowns in irrelevant policy details. The engineering-specific content is maybe 5% of the handbook.


      High Signal-to-Noise
      `"Here are the key points new engineers need to know:
- Dev environment setup: [3 sentences]
- Code review process: [3 sentences]
- Deployment pipeline: [3 sentences]
- Team communication norms: [3 sentences]

Write a warm, practical onboarding email covering these points. Under 300 words."`
      Same information, 1/50th the tokens. The AI focuses on what matters.




  Strategy 6
  ## Working with Code in the Context Window

  Code is one of the most token-hungry types of content. A single file can consume thousands of tokens. Use these techniques to work with codebases efficiently.
  **Show the interface, not the implementation:** When asking about architecture, paste type definitions, function signatures, and class structures — not the full implementation. The AI can reason about design from interfaces alone.
  **Include only the relevant function:** If a bug is in one function, don't paste the entire file. Paste the function, its imports, and any functions it calls. That's usually enough context.
  **Use tree output:** When explaining project structure, paste the output of a directory tree command rather than describing each file in prose. It's denser and more precise.
  **Reference by name:** Once you've shown the AI a function or class in the conversation, you can reference it by name in later messages without re-pasting. Say "modify the validateUser function from earlier" instead of re-including the full code.


  Strategy 7
  ## Multi-Document Analysis

  When analyzing multiple documents at once, structure matters even more. Here's a framework that prevents the "lost in the middle" problem.



      Multi-Document Prompt Structure
      `"I'm going to give you 3 documents to compare. For each, I'll label it clearly.

=== DOCUMENT A: Q1 Financial Report ===
[content]
=== END DOCUMENT A ===

=== DOCUMENT B: Q2 Financial Report ===
[content]
=== END DOCUMENT B ===

=== DOCUMENT C: Competitor Analysis ===
[content]
=== END DOCUMENT C ===

TASK: Compare Documents A and B for revenue trends. Then cross-reference with Document C to identify competitive threats. Present findings as a 3-column table."`



  Clear labels and delimiters prevent the AI from confusing which content belongs to which document. The task at the end — after all documents — ensures the AI reads everything before acting.


  Token Awareness
  ## Understanding Token Counts

  Tokens are not words. A token is roughly 4 characters or three-quarters of a word. Knowing this helps you estimate whether your content fits the context window.
  **Quick estimates:** A single-spaced page of text is roughly 500-600 tokens. A typical code file (200 lines) is 800-1,200 tokens. A 10-page document is about 5,000-6,000 tokens. A full-length book is 75,000-100,000 tokens.
  **The response counts too:** Remember that the AI's response also consumes context window space. If you fill 190K of a 200K context window, the AI only has 10K tokens to respond — which might cut off a long analysis mid-sentence.
  **Leave breathing room:** As a rule of thumb, use no more than 60-70% of the context window for your input. This leaves room for a full response and avoids quality degradation that occurs when the window is near capacity.


  Pro Tip
  ## Context Window Sizes by Model

  Knowing your model's limits helps you plan your prompts. Here are the current context windows for major models.
  **Claude (Anthropic):** 200K tokens. The largest standard context window available. Can process entire codebases, long documents, and extended conversations in a single context.
  **GPT-4 (OpenAI):** 128K tokens. Sufficient for most professional tasks. The "lost in the middle" effect is more pronounced here than in Claude — front-loading is even more important.
  **Gemini (Google):** Up to 1M tokens in Gemini 1.5 Pro. The largest context window available, suitable for analyzing entire books or large codebases in a single pass.
  **Open-source models:** Typically 4K-32K tokens. Much smaller windows require aggressive compression. The techniques in this lesson become essential, not optional, with these models.
  The key takeaway: even with massive context windows, the techniques in this lesson improve output quality. A well-structured 5K token prompt outperforms a poorly-structured 50K token prompt because the AI can focus its attention on what matters.


  Try It Yourself
  ## Optimize a Long Prompt


    Take a prompt you've written that includes a lot of context (a document, code, conversation history). Apply these strategies: front-load instructions, compress reference material, cut anything that doesn't directly serve the task. Compare results before and after.

      `TASK: [your specific task — put this first]
RULES: [critical constraints]
CONTEXT SUMMARY: [compressed version of your reference material]
INPUT: [the thing to process]`





### Quiz

**Q1: What is the ‘lost in the middle’ effect?**
    A. The AI forgets earlier conversations
  ✓ B. Content in the middle of a long context gets less attention than content at the beginning or end
    C. The AI runs out of tokens mid-response
    D. Long prompts cause the AI to lose track of the task
  *Research shows AI models pay more attention to content at the beginning and end of the context window than to content in the middle — so structure your prompts with critical info first.*

**Q2: What is the correct structure order for a well-organized prompt?**
    A. Input first, then task, then rules
  ✓ B. System instructions, task, constraints, reference material, examples, input
    C. Examples first, then instructions, then input
    D. Input, examples, instructions
  *Front-loading the most critical elements (instructions, task, constraints) ensures the AI prioritizes them. Reference material and input go later since they’re supporting details.*

**Q3: Why is a 10-15% overlap important when chunking large documents?**
    A. It makes the chunks easier to process
  ✓ B. Important context can span chunk boundaries — overlap prevents information from falling through the cracks
    C. It reduces the total token count
    D. It helps the AI remember previous chunks
  *If you split a document at a page boundary, key context might span both sides of that boundary. Overlap ensures nothing gets lost between chunks.*


  [← Previous: Prompt Chaining](/academy/advanced-prompt-engineering/06-prompt-chaining/)
  [Next: Debugging Bad Outputs →](/academy/advanced-prompt-engineering/08-debugging-bad-outputs/)
