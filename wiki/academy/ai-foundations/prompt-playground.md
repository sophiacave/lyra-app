# Prompt Playground

**Course:** AI Foundations
**Order:** 5
**Type:** lesson
**Access:** Premium

---
[← Course Home](/academy/ai-foundations/)
  Lesson 5 of 9


  # Prompt Playground.

  Master four essential prompt engineering techniques. Edit, experiment, and see the difference firsthand.


  ### After this lesson you'll know


    - Zero-Shot: clear instructions, no examples needed

    - Few-Shot: teach by showing input/output examples

    - Chain-of-Thought: force step-by-step reasoning

    - Role-Play: give the AI a persona with expertise




  Fundamentals
  ## Why prompt engineering matters.

  The same AI model can give you a brilliant answer or a useless one — the difference is how you ask. Prompt engineering is the skill of structuring your instructions to get the best possible output. It is the most accessible AI skill because it requires zero coding, zero math — just clear thinking and good communication.



      **Be specific, not vague**
      Vague: "Tell me about dogs." Specific: "List the top 5 dog breeds for apartment living, with pros and cons for each." The more specific your instruction, the more useful the output. Think of the AI as an eager intern — incredibly capable, but needs clear direction.


      **Structure your prompt**
      Break your prompt into clear sections. Use labels like "Context:", "Task:", "Format:", "Constraints:". Just like a well-organized email is easier to act on than a rambling paragraph, a structured prompt produces more focused output. The AI can distinguish what is background from what is the actual request.


      **Iterate and refine**
      Your first prompt is rarely your best. Start with a simple version, see what comes back, then refine. Add constraints to fix problems: if the output is too long, add "Keep it under 100 words." If it is too formal, add "Use a casual, friendly tone." Each iteration teaches you what the AI needs to hear.


      **Know when to use which technique**
      The four techniques below are your core toolkit. Each is best for a different type of task. Learning when to use each one — and when to combine them — is what separates a casual user from a prompt engineer. The good news: the decision tree is simple, and practice makes it second nature.



  Here are the common anti-patterns — mistakes that make AI outputs worse:


```
  PROMPT ANTI-PATTERNS (avoid these)

  BAD: "Write something about marketing"
  GOOD: "Write a 200-word LinkedIn post about email marketing
         for small business owners. Include 3 actionable tips."

  BAD: "Fix this code" (with no context)
  GOOD: "This Python function should return the sum of even
         numbers but returns 0. Find and fix the bug: [code]"

  BAD: "Be creative"
  GOOD: "Generate 5 unique product name ideas for a sustainable
         water bottle brand. Names should be 1-2 words, memorable,
         and suggest environmental consciousness."

  The pattern: specific task + clear context + output format
```



    **Prompt engineering is the highest-leverage AI skill you can learn.** It costs nothing, requires no technical background, and immediately improves every AI interaction you have. The four techniques below are your toolkit — master them, and you will get better results from any AI model.



  The Four Techniques
  ## Each one solves a different problem.


### Four Prompt Techniques — Flip for Details

**Card 1:**
Front: 🎯 ZERO-SHOT  No examples given. Just a clear instruction.
Back: WHEN TO USE: Simple, well-defined tasks like classification, translation, or formatting.  EXAMPLE: "Classify this review as POSITIVE or NEGATIVE: [text]"  TIP: Be specific about format, length, and tone. The more precise, the better.

**Card 2:**
Front: 📋 FEW-SHOT  Give 2-3 examples first. AI learns the pattern.
Back: WHEN TO USE: When you need a specific output format or style the AI might not guess.  EXAMPLE: Show 2 informal→professional email conversions, then give a new informal message.  TIP: Make examples diverse. If all examples are similar, the AI may not generalize.

**Card 3:**
Front: 🔗 CHAIN-OF-THOUGHT  Force step-by-step reasoning. Dramatically improves accuracy.
Back: WHEN TO USE: Math, logic, multi-step reasoning, anything that needs accuracy over speed.  EXAMPLE: "Solve this step by step: [problem]. Let us think step by step."  RESEARCH: Up to 2x accuracy improvement on complex problems.

**Card 4:**
Front: 🎭 ROLE-PLAY  Give the AI a persona. Get expert-level output.
Back: WHEN TO USE: When you need specialized expertise or a specific communication style.  EXAMPLE: "You are a senior security engineer reviewing code for vulnerabilities. Flag issues by severity."  TIP: Include expertise level, style, focus areas, and what to avoid.


  The Code
  ## Each technique in real Python.

  Here is how each technique looks when you call the Claude API. These are production-ready patterns you can copy directly:


Python — zero-shot classification

```
import anthropic

client = anthropic.Anthropic()

# Zero-shot: just a clear instruction, no examples
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=50,
    messages=[{
        "role": "user",
        "content": "Classify this review as POSITIVE or NEGATIVE:\n\n"
                   "'The food was incredible but the service was painfully slow.'\n\n"
                   "Classification:"
    }]
)
```


Python — few-shot (teach by example)

```
# Few-shot: give 2 examples, then the real task
prompt = """Extract the product and sentiment:

Review: "Love my new AirPods, sound quality is amazing"
→ Product: AirPods | Sentiment: positive

Review: "The laptop keyboard broke after two weeks"
→ Product: laptop | Sentiment: negative

Review: "This standing desk changed my work life"
→"""

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=50,
    messages=[{"role": "user", "content": prompt}]
)
# → Product: standing desk | Sentiment: positive
```


Python — chain-of-thought (step-by-step reasoning)

```
# Chain-of-thought: "think step by step" = 2x accuracy
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=500,
    messages=[{
        "role": "user",
        "content": "A store has a 'buy 2, get 1 free' deal on $3 notebooks. "
                   "Sarah wants 7 notebooks. How much does she pay?\n\n"
                   "Think step by step before giving the final answer."
    }]
)
```


Python — role-play (expert persona via system prompt)

```
# Role-play: system prompt sets the expert persona
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=500,
    system="You are a senior security engineer with 15 years of "
           "experience. Review code for vulnerabilities. Flag by "
           "severity: CRITICAL, HIGH, MEDIUM, LOW. Always suggest a fix.",
    messages=[{
        "role": "user",
        "content": """Review this code:
app.get("/user", (req, res) => {
  const userId = req.query.id;
  const query = `SELECT * FROM users WHERE id = ${userId}`;
  db.query(query).then(user => res.json(user));
});"""
    }]
)
```


Notice the pattern: zero-shot and chain-of-thought modify the *user message*. Role-play uses the *system prompt*. Few-shot embeds examples *inside* the user message. Same API call — different strategy.


  Try It
  ## Edit prompts and see the difference.


  Production Patterns
  ## Prompt patterns used in real products.

  The techniques above are the building blocks. Here are three production patterns that combine them for specific use cases:



      **The Guardrail Pattern — safe AI products**
      System prompt sets strict boundaries: "You are a customer service agent for AcmeCorp. Only answer questions about our products. Never discuss competitors. Never share pricing not listed on our website. If asked about something outside your scope, politely redirect." This pattern prevents the AI from going off-script in customer-facing applications.


      **The Extraction Pattern — structured data from chaos**
      Combine few-shot with format constraints: show 2-3 examples of messy input transformed into clean JSON, then provide the new messy input. This pattern powers data extraction pipelines that process thousands of unstructured documents (emails, PDFs, forms) into clean database records automatically.


      **The Evaluation Pattern — AI grading AI**
      Use one AI call to generate content, then a second AI call (with chain-of-thought) to evaluate the quality. "Rate this summary from 1-10 on accuracy, completeness, and clarity. Think step by step about each dimension before giving scores." This self-evaluation loop is how teams build reliable AI systems without manual review of every output.




  Knowledge Check
  ## Pick the right technique.


### Quiz

**Q1: You need the AI to format data in a very specific way that it has never seen before. Which technique?**
    A. Zero-shot with detailed instructions
  ✓ B. Few-shot with 2-3 examples of the exact format you want
    C. Chain-of-thought reasoning
    D. Role-play as a data formatter
  *When you need a specific, unusual format, showing the AI 2-3 examples is far more effective than trying to describe the format in words. Few-shot lets the AI learn the pattern from examples.*

**Q2: Research shows chain-of-thought prompting can improve math accuracy by up to:**
    A. 10%
    B. 25%
    C. 50%
  ✓ D. 100% (2x)
  *Studies show chain-of-thought prompting can double accuracy on multi-step reasoning tasks. By forcing the model to show its work, errors in intermediate steps become visible and correctable.*


  [Next: Prompt Battle →](/academy/ai-foundations/prompt-battle)
