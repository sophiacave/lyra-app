---
title: "Few-Shot and Examples"
course: "advanced-prompt-engineering"
order: 4
type: "lesson"
free: false
---

<div class="wrap">

<nav class="local-nav">
  <a href="/academy/advanced-prompt-engineering/">Advanced Prompt Engineering</a>
  <span class="lesson-badge">Lesson 4 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Few-Shot and Examples</h1>
  <p><span class="accent">Show, don't just tell. Examples are the most underused prompting superpower.</span></p>
</div>

<div class="learn-card">
  <h3>What You'll Learn</h3>
  <ul>
    <li>Zero-shot vs. few-shot prompting and when to use each</li>
    <li>How to pick examples that actually improve output</li>
    <li>The pattern-matching trick that makes AI "get it" immediately</li>
    <li>How many examples you actually need (hint: fewer than you think)</li>
  </ul>
</div>

<div class="lesson-section">
  <span class="section-label">Core Concept</span>
  <h2 class="section-title">AI Learns From Patterns in Your Prompt</h2>
  <p class="section-text">When you give the AI examples of what you want, you're not just explaining — you're demonstrating. The model picks up on patterns in your examples: tone, structure, length, level of detail, formatting choices. It then replicates those patterns in its response.</p>
  <p class="section-text">This is called few-shot prompting, and it's dramatically more effective than describing what you want in abstract terms.</p>
</div>

<div class="lesson-section">
  <span class="section-label">The Spectrum</span>
  <h2 class="section-title">Zero, One, Few</h2>
  <p class="section-text"><strong style="color: var(--orange);">Zero-shot:</strong> No examples. Just instructions. Works for simple, well-understood tasks.</p>
  <p class="section-text"><strong style="color: var(--purple);">One-shot:</strong> One example. Sets the pattern. Good for style matching and format demonstration.</p>
  <p class="section-text"><strong style="color: var(--green);">Few-shot:</strong> 2-5 examples. Establishes a strong pattern. Best for complex or nuanced tasks where one example isn't enough to capture all the rules.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Real Example</span>
  <h2 class="section-title">Product Descriptions, Two Ways</h2>

  <div class="demo-container">
    <div class="demo-block" style="border-left: 3px solid var(--red);">
      <h4 style="color: var(--red);">Zero-Shot (Vague)</h4>
      <code>"Write a product description for wireless earbuds. Make it punchy."</code>
      <p style="color: var(--dim); margin-top: 0.5rem;">You'll get something generic. "Punchy" means different things to different people.</p>
    </div>
    <div class="demo-block" style="border-left: 3px solid var(--green);">
      <h4 style="color: var(--green);">Few-Shot (Clear Pattern)</h4>
      <code>"Write product descriptions in this style:

EXAMPLE 1:
Product: Running shoes
Description: Built for the long run. Featherlight mesh breathes with every stride. Carbon-plate response pushes you forward. 42 grams lighter than last year. Your PR doesn't stand a chance.

EXAMPLE 2:
Product: Laptop stand
Description: Your neck called. It wants its natural curve back. Machined aluminum. Seven angles. Cable routing that doesn't look like spaghetti. Looks good on the desk. Feels better on your spine.

NOW WRITE:
Product: Wireless earbuds"</code>
      <p style="color: var(--dim); margin-top: 0.5rem;">The AI now understands your exact style: short sentences, physical benefits, personality, specific details.</p>
    </div>
  </div>
</div>

<div class="lesson-section">
  <span class="section-label">Technique</span>
  <h2 class="section-title">Choosing Good Examples</h2>
  <p class="section-text"><strong style="color: var(--blue);">Diverse:</strong> Pick examples that cover different scenarios. If all your examples are similar, the AI might over-fit to that one pattern.</p>
  <p class="section-text"><strong style="color: var(--blue);">Representative:</strong> Your examples should look like what you want the output to look like. If you show sloppy examples, you get sloppy output.</p>
  <p class="section-text"><strong style="color: var(--blue);">Edge cases:</strong> Include at least one tricky example that shows how to handle unusual inputs. This teaches the AI your judgment calls.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Pro Tip</span>
  <h2 class="section-title">Negative Examples Are Powerful</h2>
  <p class="section-text">Show the AI what NOT to do. A "bad example" with an explanation of why it's bad teaches boundaries just as effectively as good examples teach patterns.</p>

  <div class="demo-container">
    <div class="demo-block" style="border-left: 3px solid var(--orange);">
      <h4 style="color: var(--orange);">Negative Example</h4>
      <code>"BAD (too generic): 'These earbuds deliver amazing sound quality and long battery life.'
WHY: No personality, no specific details, reads like every other product page."</code>
    </div>
  </div>
</div>

<div class="lesson-section">
  <span class="section-label">Try It Yourself</span>
  <h2 class="section-title">Build a Few-Shot Prompt</h2>
  <div class="try-it-box">
    <p>Pick a writing task you do regularly (emails, social posts, documentation). Write 2-3 examples that capture your style. Then ask AI to generate a new one following the pattern.</p>
    <div class="prompt-box">
      <code>Here are examples of how I write [type]:

EXAMPLE 1: [your real example]
EXAMPLE 2: [your real example]

Now write one for: [new topic]
Match the tone, length, and structure exactly.</code>
    </div>
  </div>
</div>

<nav class="lesson-nav">
  <a href="/academy/advanced-prompt-engineering/03-chain-of-thought/" class="prev">&larr; Previous: Chain of Thought</a>
  <a href="/academy/advanced-prompt-engineering/05-structured-output/" class="next">Next: Structured Output &rarr;</a>
</nav>

</div>
