# Chain of Thought

**Course:** Claude Mastery
**Order:** 5
**Type:** lesson
**Access:** Premium

---
[Claude Mastery](/academy/claude-mastery/)
  Lesson 5 of 10


  # Chain-of-Thought Reasoning

  Unlock Claude's deeper reasoning — from simple CoT to extended thinking, with production code


## The Power of "Think Step by Step"

Chain-of-thought (CoT) prompting is one of the most powerful techniques in prompt engineering. By asking Claude to show its reasoning before giving a final answer, you dramatically improve accuracy on complex tasks — math, logic, coding, analysis, and multi-step decisions.

The reason is simple: when Claude writes out intermediate steps, each step becomes context for the next. It can catch errors mid-reasoning, check its own logic, and build on solid intermediate conclusions. Without CoT, the model jumps directly from question to answer — and on complex problems, that jump often lands wrong.


Without CoT
"If a store has a 25% off sale and then offers an additional 10% off the sale price, what's the total discount on a $200 item?"
"The total discount is 35%, so the price would be $130."
Wrong — that's not how compound discounts work!


With CoT
"Think step by step: If a store has a 25% off sale..."

Step 1: Original price = $200

Step 2: 25% off: $200 x 0.75 = $150

Step 3: Additional 10% off sale price: $150 x 0.90 = $135

Step 4: Total discount = $200 - $135 = $65 = 32.5%

Correct! The compound discount is 32.5%, not 35%


## CoT in the API — Three Approaches

There are three ways to use chain-of-thought with Claude, each with different tradeoffs:


Approach 1: prompt-based CoT (simplest)

```
import anthropic
client = anthropic.Anthropic()

# Just add "Think step by step" to your prompt
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    messages=[{
        "role": "user",
        "content": (
            "Think step by step.\n\n"
            "A store has a 25% off sale, then offers an additional "
            "10% off the sale price. What is the total discount "
            "on a $200 item?"
        )
    }]
)
print(response.content[0].text)
# Claude shows: Step 1... Step 2... Step 3... Answer: $135 (32.5% off)
```


Approach 2: structured CoT in system prompt

```
# For production: enforce CoT format in the system prompt
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=2048,
    system=(
        "You are a precise analytical assistant.\n\n"
        "For EVERY question, respond in this exact format:\n"
        "\n"
        "Step-by-step analysis here...\n"
        "\n\n"
        "\n"
        "Final answer here.\n"
        "\n\n"
        "HIGH/MEDIUM/LOW"
    ),
    messages=[{
        "role": "user",
        "content": "Should we use a SQL or NoSQL database for a social media feed?"
    }]
)

# Parse the structured output
text = response.content[0].text
reasoning = text.split("")[1].split("")[0]
answer = text.split("")[1].split("")[0]
print(f"Answer: {answer.strip()}")
```


Approach 3: extended thinking (most powerful)

```
# Extended thinking: Claude reasons internally before responding
# Available on Opus 4.6 and Sonnet 4.6
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000  # tokens for internal reasoning
    },
    messages=[{
        "role": "user",
        "content": "Analyze the tradeoffs between microservices and a monolith for a startup with 5 engineers."
    }]
)

# Response has both thinking and text blocks
for block in response.content:
    if block.type == "thinking":
        print(f"Internal reasoning ({len(block.thinking)} chars):")
        print(block.thinking[:200] + "...")
    elif block.type == "text":
        print(f"\nFinal answer:\n{block.text}")
```


**Prompt-based CoT**
Simplest. Add "think step by step." Reasoning visible in output. Costs output tokens.


**Structured CoT**
Parseable. XML tags separate reasoning from answer. Best for production APIs.


**Extended Thinking**
Most powerful. Internal reasoning with budget. Best for hard problems. Separate thinking block in response.


## How the Thinking Process Works

When Claude uses chain-of-thought, its reasoning unfolds in a visible sequence. For a math puzzle, it might look like this:


**Step 1:** Identify the key variables and constraints in the problem.
**Step 2:** Break the problem into sub-problems that can be solved sequentially.
**Step 3:** Solve each sub-problem, checking intermediate results for consistency.
**Step 4:** Combine results and verify the final answer against the original constraints.

This pattern applies to math puzzles, logic problems, and code debugging alike. The key is that each step becomes context for the next — allowing Claude to catch errors mid-reasoning rather than jumping to a wrong conclusion.


## When CoT Helps (and When It Doesn't)

CoT is not a universal improvement. Understanding when to use it saves tokens and latency:


**CoT helps significantly**
Multi-step math and logic problems
Code debugging (trace through execution)
Causal reasoning ("why did X happen?")
Decision analysis with multiple factors
Any problem where intermediate steps matter


**CoT adds cost without benefit**
Simple classification (spam/not spam)
Translation tasks
Simple factual lookups
Creative writing (reasoning can over-constrain)
Tasks where the answer is one word/number


## Write Your Own CoT Prompt

Here is a challenging question. Write a prompt that guides Claude to reason through it step by step:

**Question:** A farmer has a fox, a chicken, and a bag of grain. He needs to cross a river in a boat that can only carry him and one item at a time. If left alone, the fox will eat the chicken, and the chicken will eat the grain. How can he get everything across safely?

A good CoT prompt for this problem would include: "Think step by step. List all constraints first. Consider what happens if you leave each pair alone. Then find a sequence of crossings that satisfies all constraints."


**Solution (spoiler):** Take chicken across. Return empty. Take fox across. Bring chicken back. Take grain across. Return empty. Take chicken across. The key insight: the chicken is the problem — it conflicts with both others. So it needs to travel back once.


## CoT Best Practices


1
**"Think step by step"**The classic trigger. Simple and effective for most problems. Add it at the beginning of the prompt, not the end.


2
**"Before answering, consider..."**Guides the model to evaluate specific aspects before concluding. Great for decision analysis: "Before recommending, consider cost, complexity, and team size."


3
**Use XML tags to separate reasoning from answer**In production, wrap reasoning in tags so you can parse the final answer programmatically: <reasoning>...</reasoning> <answer>...</answer>


4
**Use extended thinking for hard problems**For math, code generation, complex analysis — give Claude a thinking budget. The reasoning happens internally and the response is cleaner.


### Chain-of-Thought Key Concepts

**Card 1:**
Front: Chain-of-Thought (CoT) prompting
Back: Asking Claude to show its step-by-step reasoning before arriving at an answer. Dramatically improves accuracy on math, logic, coding, and analysis by making intermediate steps visible for self-correction.

**Card 2:**
Front: Extended thinking
Back: Claude's built-in deep reasoning mode. You set a thinking budget (tokens), and Claude reasons internally before responding. Available on Sonnet 4.6 and Opus 4.6. Use the thinking parameter in the API.

**Card 3:**
Front: Structured CoT with XML tags
Back: Wrapping reasoning in XML tags (... ...) so production code can parse the final answer separately from the reasoning.

**Card 4:**
Front: When NOT to use CoT
Back: Simple classification, translation, factual lookups, and creative writing. CoT adds token cost and latency without accuracy benefit on tasks that don't have multi-step reasoning.

**Card 5:**
Front: Compound discount example
Back: 25% off then 10% off is NOT 35% off. It is 25% off the original, then 10% off the reduced price = 32.5% total. CoT catches this; direct answering often misses it.


### Quiz

**Q1: A store offers 20% off, then an additional 10% off the sale price. Without CoT, Claude says the total discount is 30%. What is the actual answer?**
    A. 30% — Claude was correct
  ✓ B. 28% — compound discounts multiply
    C. 25% — sequential discounts are always less
    D. The discounts cannot be combined
  *Compound discounts are multiplicative, not additive. 20% off leaves 80%, then 10% off that leaves 72% — so 28% total discount, not 30%. CoT forces Claude to compute each step sequentially.*

**Q2: Which approach gives Claude the deepest reasoning on hard problems?**
    A. Prompt-based CoT (think step by step)
    B. Structured CoT with XML tags
  ✓ C. Extended thinking with a budget
    D. Temperature 0
  *Extended thinking gives Claude a dedicated reasoning budget. It can think for thousands of tokens internally before producing a clean final answer. This is the most powerful option for genuinely hard problems.*

**Q3: When is chain-of-thought prompting NOT worth the extra tokens?**
    A. Multi-step math problems
  ✓ B. Simple spam/not-spam classification
    C. Code debugging with complex logic
    D. Analyzing tradeoffs between two architectures
  *Simple binary classification doesn't benefit from step-by-step reasoning. The model already knows the answer in one step. Adding CoT just costs more tokens and adds latency without improving accuracy.*

**Q4: In production, what is the best way to separate Claude's reasoning from its final answer?**
    A. Ask Claude to put the answer at the end
  ✓ B. Use XML tags: reasoning and answer blocks
    C. Check the last sentence only
    D. Use a separate API call
  *XML tags give you a reliable, parseable boundary between reasoning and answer. Your code can extract the answer block programmatically without parsing natural language.*


Lesson 5 of 10

Module 2
