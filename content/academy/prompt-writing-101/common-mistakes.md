---
title: "Common Mistakes"
course: "prompt-writing-101"
order: 9
type: "lesson"
free: false
---<div class="wrap">

<nav class="local-nav">
  <a href="/academy/prompt-writing-101/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 9 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Common <span class="accent">Mistakes.</span></h1>
  <p class="sub">The 8 prompt mistakes everyone makes — and the one-line fix for each.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>The 8 most common prompt mistakes (you're probably making 3+ of them)</li>
    <li>Why each mistake produces bad output</li>
    <li>The instant fix for each one</li>
    <li>How to diagnose why a prompt failed</li>
  </ul>
</div>

<!-- MISTAKE FLASHDECK -->
<div class="lesson-section">
  <span class="section-label">The Mistakes</span>
  <h2 class="section-title">8 mistakes and their instant fixes.</h2>

<div data-learn="FlashDeck" data-props='{
  "title": "Flip Each Card: Mistake → Fix",
  "cards": [
    {
      "front": "❌ Mistake 1: Being Too Vague\n\n\"Help me with my resume.\"\n\nWhy is this bad?",
      "back": "✅ THE FIX:\n\n\"Rewrite the experience section of my resume for a senior product manager role at a fintech company. Here is my current version: [paste]\"\n\nVague prompts = vague output. The AI does not know which part, what role, or what help means."
    },
    {
      "front": "❌ Mistake 2: Multiple Questions at Once\n\n\"What is the best CRM, how do I set it up, and can you write me a sales email and suggest a pricing strategy?\"\n\nWhy is this bad?",
      "back": "✅ THE FIX:\n\n\"I am setting up a CRM for my 5-person sales team selling B2B SaaS ($5K-$50K deals). Compare HubSpot, Pipedrive, and Close.io in a table: price, best for, biggest limitation.\"\n\nOne focused question gets 10x the depth of four bundled ones."
    },
    {
      "front": "❌ Mistake 3: No Audience Specified\n\n\"Explain machine learning.\"\n\nWhy is this bad?",
      "back": "✅ THE FIX:\n\n\"Explain machine learning to a marketing manager who has never written code. Use analogies from advertising and customer behavior. Under 200 words.\"\n\nExplain X to a PhD and a teenager are completely different tasks."
    },
    {
      "front": "❌ Mistake 4: Accepting First Output\n\nGetting mediocre output → \"AI sucks\" → giving up\n\nWhy is this bad?",
      "back": "✅ THE FIX:\n\nIterate! \"Make it more specific to my industry. Remove the generic advice. Give me numbers.\"\n\nFirst outputs are first drafts. The iteration is where quality lives. Use the 4 follow-up patterns from Lesson 7."
    },
    {
      "front": "❌ Mistake 5: Being Polite Instead of Clear\n\n\"If it is not too much trouble, could you maybe try to perhaps write something about marketing? Only if you have time!\"\n\nWhy is this bad?",
      "back": "✅ THE FIX:\n\n\"Write 5 email subject lines for a Black Friday sale targeting existing customers. Product: online courses. Tone: urgent but not spammy.\"\n\nAI does not have feelings. Hedging adds noise and reduces clarity. Be direct."
    },
    {
      "front": "❌ Mistake 6: No Examples of Good\n\nTrying to match a specific style without showing the AI what it looks like\n\nWhy is this bad?",
      "back": "✅ THE FIX:\n\nPaste a sample. \"Write in a style similar to this: [example paragraph].\"\n\nEven a 2-sentence example gives AI a target. Without one, it is guessing in the dark about your voice and style preferences."
    },
    {
      "front": "❌ Mistake 7: Treating AI Like a Search Engine\n\n\"What is content marketing?\"\n\nWhy is this bad?",
      "back": "✅ THE FIX:\n\n\"Create a 30-day content marketing plan for a new yoga studio targeting busy professionals. Include specific post ideas, platforms, and a posting schedule.\"\n\nAI generates, analyzes, transforms, and creates. Asking what is X uses 5% of its capability."
    },
    {
      "front": "❌ Mistake 8: Ignoring What You Already Know\n\nNot sharing your drafts, data, or existing knowledge with the AI\n\nWhy is this bad?",
      "back": "✅ THE FIX:\n\nYou have a rough draft? PASTE IT. You have data? INCLUDE IT. You have a style guide? SHARE IT.\n\nAI works best building on something you started — not creating from nothing. Your existing knowledge is the most valuable context you can provide."
    }
  ]
}'></div>

</div>

<!-- PIXEL QUEST: SPOT THE MISTAKE -->
<div class="lesson-section">
  <span class="section-label">Game Time</span>
  <h2 class="section-title">Collect the fixes, avoid the mistakes.</h2>

<div data-learn="PixelQuest" data-props='{
  "levels": [
    {
      "question": "Collect GOOD prompt practices. Avoid the bad ones!",
      "correct": ["Be specific", "Add context", "Set a role", "Iterate", "Use constraints"],
      "wrong": ["Be vague", "Ask 4 questions at once", "Skip the audience", "Give up after 1 try"],
      "gridSize": 7
    },
    {
      "question": "Collect the FIXES. Avoid the mistakes!",
      "correct": ["Paste examples", "Specify format", "One question at a time", "Include your data"],
      "wrong": ["Be polite not clear", "Treat AI like Google", "Accept first output", "No audience"],
      "gridSize": 7
    }
  ]
}'></div>

</div>

<!-- DIAGNOSTIC -->
<div class="lesson-section">
  <span class="section-label">Quick Diagnostic</span>
  <h2 class="section-title">When a prompt fails, ask yourself these 3 questions.</h2>

<div data-learn="SortStack" data-props='{
  "title": "The 3-Question Diagnostic — In Order",
  "instruction": "Arrange these diagnostic questions in the order you should ask them when a prompt fails",
  "items": ["Did I tell it what I actually want? (format, length, style, structure)", "Did I give it enough context for a smart stranger to succeed?", "Did I tell it what NOT to do? (generic tone, filler, hedging)"]
}'></div>

<div data-learn="QuizMC" data-props='{
  "title": "Diagnose These Prompts",
  "questions": [
    {
      "q": "A prompt says: \"Write something about our product for the website.\" What is the PRIMARY mistake?",
      "options": ["No examples provided", "Being too vague — no format, audience, tone, or specifics", "Being too polite", "Asking multiple questions at once"],
      "correct": 1,
      "explanation": "Something, product, and website are all undefined. The AI has to guess everything. The fix: specify exactly what content, for which product, for which page, for which audience."
    },
    {
      "q": "You asked AI to write a blog post. The content is solid but full of buzzwords like leverage, utilize, and synergy. What should your follow-up be?",
      "options": ["Start over with a new prompt", "Add a negative constraint: Rewrite without buzzwords — use simple, direct language", "Accept it and edit manually", "Ask AI why it used those words"],
      "correct": 1,
      "explanation": "This is a perfect case for a negative constraint follow-up. The content structure is good — you just need to eliminate the AI-isms. One follow-up fixes it."
    },
    {
      "q": "Your prompt has great context and format but the output reads like a textbook. What is the most likely missing element?",
      "options": ["Examples", "Role", "Constraints", "A longer prompt"],
      "correct": 2,
      "explanation": "A tone or audience constraint would fix this: Conversational, not academic. Write like you are explaining to a friend, not lecturing. Negative constraints are the fastest way to eliminate unwanted tone."
    }
  ]
}'></div>

</div>

<!-- NEXT LESSON -->
<div class="lesson-section" style="text-align:center;padding:2rem 0">
  <a href="/academy/prompt-writing-101/prompt-writing-assessment" style="display:inline-block;background:var(--orange);color:var(--bg);font-weight:700;padding:.75rem 2rem;border-radius:10px;text-decoration:none;font-size:.95rem">Next: Final Assessment →</a>
</div>

</div>