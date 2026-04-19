# Few-Shot and Examples

**Course:** Advanced Prompt Engineering
**Order:** 4
**Type:** lesson
**Access:** Premium

---
[Advanced Prompt Engineering](/academy/advanced-prompt-engineering/)
  Lesson 4 of 10


  # Few-Shot and Examples

  Show, don't just tell. Examples are the most underused prompting superpower.


  ### What You'll Learn


    - Zero-shot vs. few-shot prompting and when to use each

    - How to pick examples that actually improve output

    - The pattern-matching trick that makes AI "get it" immediately

    - How many examples you actually need (hint: fewer than you think)




  Core Concept
  ## AI Learns From Patterns in Your Prompt

  When you give the AI examples of what you want, you're not just explaining — you're demonstrating. The model picks up on patterns in your examples: tone, structure, length, level of detail, formatting choices. It then replicates those patterns in its response.
  This is called few-shot prompting, and it's dramatically more effective than describing what you want in abstract terms.


  The Spectrum
  ## Zero, One, Few

  **Zero-shot:** No examples. Just instructions. Works for simple, well-understood tasks.
  **One-shot:** One example. Sets the pattern. Good for style matching and format demonstration.
  **Few-shot:** 2-5 examples. Establishes a strong pattern. Best for complex or nuanced tasks where one example isn't enough to capture all the rules.


  Real Example
  ## Product Descriptions, Two Ways




      Zero-Shot (Vague)
      `"Write a product description for wireless earbuds. Make it punchy."`
      You'll get something generic. "Punchy" means different things to different people.


      Few-Shot (Clear Pattern)
      `"Write product descriptions in this style:

EXAMPLE 1:
Product: Running shoes
Description: Built for the long run. Featherlight mesh breathes with every stride. Carbon-plate response pushes you forward. 42 grams lighter than last year. Your PR doesn't stand a chance.

EXAMPLE 2:
Product: Laptop stand
Description: Your neck called. It wants its natural curve back. Machined aluminum. Seven angles. Cable routing that doesn't look like spaghetti. Looks good on the desk. Feels better on your spine.

NOW WRITE:
Product: Wireless earbuds"`
      The AI now understands your exact style: short sentences, physical benefits, personality, specific details.




  Technique
  ## Choosing Good Examples

  **Diverse:** Pick examples that cover different scenarios. If all your examples are similar, the AI might over-fit to that one pattern.
  **Representative:** Your examples should look like what you want the output to look like. If you show sloppy examples, you get sloppy output.
  **Edge cases:** Include at least one tricky example that shows how to handle unusual inputs. This teaches the AI your judgment calls.



### Few-Shot Prompting — Key Concepts

**Card 1:**
Front: What is zero-shot prompting?
Back: No examples provided — just instructions. Works for simple, well-understood tasks where the AI already has strong priors.

**Card 2:**
Front: What is one-shot prompting?
Back: Providing a single example to set the pattern. Good for style matching and demonstrating the desired format.

**Card 3:**
Front: What is few-shot prompting?
Back: Providing 2-5 examples to establish a strong pattern. Best for complex or nuanced tasks where one example cannot capture all the rules.

**Card 4:**
Front: What makes a good few-shot example?
Back: Diverse (covering different scenarios), representative (looking like what you want), and including at least one edge case to show judgment calls.

**Card 5:**
Front: What are negative examples and why use them?
Back: Examples of what NOT to do with explanations. They teach boundaries just as effectively as good examples teach patterns.


  Pro Tip
  ## Negative Examples Are Powerful

  Show the AI what NOT to do. A "bad example" with an explanation of why it's bad teaches boundaries just as effectively as good examples teach patterns.



      Negative Example
      `"BAD (too generic): 'These earbuds deliver amazing sound quality and long battery life.'
WHY: No personality, no specific details, reads like every other product page."`




  Advanced Technique
  ## Few-Shot for Classification Tasks

  Few-shot prompting is devastatingly effective for classification — sorting items into categories. The examples teach the AI your exact criteria.



      Sentiment Classification
      `"Classify customer feedback as POSITIVE, NEGATIVE, or MIXED. Here are examples:

INPUT: 'Love the new dashboard, but the export feature is broken.'
OUTPUT: MIXED (positive about UI, negative about functionality)

INPUT: 'Best purchase I've made this year. Worth every penny.'
OUTPUT: POSITIVE (strong endorsement, no negatives)

INPUT: 'Cancelled my subscription. Support never responded to my tickets.'
OUTPUT: NEGATIVE (action taken, service failure cited)

INPUT: 'It's fine. Does what it says.'
OUTPUT: MIXED (neutral-to-positive, no enthusiasm — lukewarm is mixed, not positive)

NOW CLASSIFY:
'The onboarding was confusing but once I got through it, the tool is incredible.'"`



  Notice the fourth example: it teaches the AI that "fine" isn't positive — it's mixed. Without that edge case, the AI would likely classify lukewarm feedback as positive. One example changed the boundary.


  Technique
  ## How Many Examples Do You Need?

  There's no universal answer, but here's a practical framework based on task complexity.
  **1 example:** Enough for simple format matching — "write in this style" or "follow this structure." The AI picks up formatting patterns from a single demonstration.
  **2-3 examples:** The sweet spot for most tasks. Two examples establish a pattern; three confirm it. This covers standard classification, writing style, and data extraction.
  **4-5 examples:** Use when your task has subtle edge cases or the boundary between categories is blurry. The extra examples disambiguate tricky scenarios.
  **6+ examples:** Diminishing returns. If 5 examples aren't enough, the task may be too complex for few-shot prompting alone. Consider combining with explicit rules or chain-of-thought reasoning.
  A key insight: the diversity of your examples matters more than the quantity. Three examples that cover different scenarios beat ten examples that are all similar.


  Pro Tip
  ## Combining Few-Shot with Chain-of-Thought

  You can supercharge few-shot prompting by including the reasoning in your examples — not just the input and output, but the thinking process.



      Few-Shot + CoT
      `"Evaluate whether a startup idea is viable. Here's how I think through it:

IDEA: 'AI-powered pet food delivery'
REASONING: Market exists (pet food is $50B+). But AI adds no clear value over a standard subscription — this is a solution looking for a problem. Customer acquisition will be expensive against Chewy/Amazon. Low defensibility.
VERDICT: WEAK — AI is a gimmick here, not a genuine advantage.

IDEA: 'AI that reads medical imaging for rural clinics without radiologists'
REASONING: Clear problem (radiologist shortage in rural areas). AI adds genuine value (faster reads, 24/7 availability). Regulatory hurdles are real but navigable. High defensibility once trained on specific imaging types.
VERDICT: STRONG — solves a real gap with genuine AI advantage.

NOW EVALUATE:
IDEA: 'AI tutor for K-12 math'"`



  By showing the reasoning alongside the examples, you teach the AI both your evaluation criteria AND your thinking process. The output quality jumps dramatically.


  Common Mistakes
  ## Few-Shot Anti-Patterns

  **All similar examples:** If every example is a variation of the same scenario, the AI over-fits to that pattern and struggles with anything different. Vary your examples across categories, tones, or complexity levels.
  **Sloppy formatting in examples:** The AI mimics everything — including inconsistencies. If your first example uses dashes and your second uses bullets, the AI might mix formats randomly. Be meticulous about consistency across your examples.
  **Too much explanation between examples:** Keep the space between examples clean. Long paragraphs of instructions between examples break the pattern the AI is trying to learn. Put instructions before or after the example block, not inside it.
  **Using poor-quality examples:** Your examples set the quality ceiling. If your examples are mediocre, the AI matches mediocre. Always use your best work as examples — the AI will match that quality level.


  Try It Yourself
  ## Build a Few-Shot Prompt


    Pick a writing task you do regularly (emails, social posts, documentation). Write 2-3 examples that capture your style. Then ask AI to generate a new one following the pattern.

      `Here are examples of how I write [type]:

EXAMPLE 1: [your real example]
EXAMPLE 2: [your real example]

Now write one for: [new topic]
Match the tone, length, and structure exactly.`





### Quiz

**Q1: Why is few-shot prompting more effective than describing what you want in abstract terms?**
    A. It is shorter
  ✓ B. The AI picks up on patterns in your examples — tone, structure, length, detail — and replicates them
    C. It forces the AI to think step by step
    D. It is easier to write
  *Examples demonstrate rather than just describe. The AI pattern-matches against your examples and replicates those patterns in its response.*

**Q2: How many examples do you typically need for few-shot prompting to be highly effective?**
    A. 10-20 examples
    B. 50+ examples
  ✓ C. 2-5 examples
    D. Exactly 1 example
  *2-5 examples is the sweet spot — enough to establish a strong pattern without bloating your prompt. More examples don’t always mean better results.*

**Q3: What is the purpose of including edge case examples?**
    A. To make the prompt longer
  ✓ B. To show the AI how to handle unusual inputs and demonstrate your judgment calls
    C. To improve the AI’s grammar
    D. To reduce hallucinations on factual questions
  *Edge cases teach the AI how to handle tricky scenarios — inputs that don’t fit the normal pattern — so it applies your judgment in unexpected situations.*


  [← Previous: Chain of Thought](/academy/advanced-prompt-engineering/03-chain-of-thought/)
  [Next: Structured Output →](/academy/advanced-prompt-engineering/05-structured-output/)
