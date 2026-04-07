---
title: "Anatomy of a Prompt"
course: "ai-foundations"
order: 4
type: "lesson"
free: false
---<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-foundations/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 4 of 9</span>
</nav>

<div class="lesson-hero">
  <h1>Anatomy of a <span class="accent">Prompt.</span></h1>
  <p class="sub">Watch your words get sliced into tokens in real-time. Understand the hidden structure behind every AI interaction.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>How AI breaks text into tokens (not words, not characters)</li>
    <li>What the context window is and why it matters</li>
    <li>How system prompts shape AI behavior</li>
    <li>What temperature controls and when to adjust it</li>
  </ul>
</div>

<!-- SECTION 1: LIVE TOKENIZER -->
<div class="lesson-section">
  <span class="section-label">Live Demo</span>
  <h2 class="section-title">Type anything and watch it get tokenized.</h2>
</div>

<!-- SECTION 1B: PROMPT COMPONENTS -->
<div class="lesson-section">
  <span class="section-label">The Five Parts</span>
  <h2 class="section-title">Every great prompt has up to five components.</h2>
  <p class="section-text">A well-crafted prompt is not just a question — it is an instruction manual. The best prompts give the AI everything it needs to succeed. Here are the five building blocks, from most essential to most advanced:</p>

  <div style="display:grid;gap:.75rem;margin-top:.75rem">
    <div style="padding:1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
      <strong style="color:#34d399;font-size:.88rem">1. Task — what you want done</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">The core instruction. Every prompt has one. "Summarize this article." "Write a Python function that sorts a list." "Translate this to Spanish." Be specific about the action: "summarize" is clearer than "tell me about." A vague task gets a vague answer. A precise task gets a precise answer.</p>
    </div>
    <div style="padding:1rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
      <strong style="color:#8b5cf6;font-size:.88rem">2. Context — the background information</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Give the AI the information it needs to do the job well. This could be a document to summarize, data to analyze, or background about your situation. The more relevant context you provide, the better the response. Think of it as briefing a consultant before they start work — they cannot help you if they do not understand your situation.</p>
    </div>
    <div style="padding:1rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
      <strong style="color:#fb923c;font-size:.88rem">3. Role — who the AI should be</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">"You are a senior data scientist" produces different output than "you are a high school teacher" — even with the same question. Roles shape vocabulary, depth, assumptions, and focus. A security engineer reviews code for vulnerabilities. A UX designer reviews it for user experience. Same code, completely different analysis. Roles are typically set in the system prompt.</p>
    </div>
    <div style="padding:1rem;border-radius:10px;background:rgba(56,189,248,.04);border:1px solid rgba(56,189,248,.1)">
      <strong style="color:#38bdf8;font-size:.88rem">4. Format — how the output should look</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Tell the AI what shape the answer should take. "Respond in bullet points." "Use JSON format." "Write exactly 3 paragraphs." "Include a code example." Without format instructions, the AI guesses — and it might guess wrong. Specifying format is especially important when you are building applications that need to parse the AI's output programmatically.</p>
    </div>
    <div style="padding:1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
      <strong style="color:#ef4444;font-size:.88rem">5. Constraints — what to avoid or limit</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">"Do not use jargon." "Keep it under 200 words." "Never make promises about delivery dates." "Only use information from the provided document." Constraints are guardrails. They prevent common failure modes and keep the AI within bounds. Especially critical for customer-facing applications where the AI should not make promises or share sensitive information.</p>
    </div>
  </div>

  <p class="section-text" style="margin-top:1.25rem">Here is how all five components look in a single prompt:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Anatomy of a complete prompt</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a"># ROLE (who the AI should be)</span>
<span style="color:#8b5cf6">You are a senior technical writer with 10 years of experience</span>
<span style="color:#8b5cf6">writing developer documentation.</span>

<span style="color:#71717a"># CONTEXT (background information)</span>
<span style="color:#34d399">Here is our API endpoint documentation for the /users route:</span>
<span style="color:#34d399">[... documentation text ...]</span>

<span style="color:#71717a"># TASK (what you want done)</span>
<span style="color:#fb923c">Rewrite this documentation to be beginner-friendly.</span>

<span style="color:#71717a"># FORMAT (how the output should look)</span>
<span style="color:#38bdf8">Use markdown. Include a "Quick Start" section with a code</span>
<span style="color:#38bdf8">example, followed by a detailed reference table.</span>

<span style="color:#71717a"># CONSTRAINTS (what to avoid)</span>
<span style="color:#ef4444">Do not assume the reader knows REST APIs.</span>
<span style="color:#ef4444">Keep sentences under 20 words. No jargon without definitions.</span></code></pre>
</div>

  <div class="narration" style="margin-top:1rem">
    <strong>You do not need all five components every time.</strong> A simple task might only need Task + Format. A complex application prompt might use all five. The key is knowing which components will improve your specific situation.
  </div>
</div>

<!-- SECTION 2: KEY CONCEPTS -->
<div class="lesson-section">
  <span class="section-label">Key Concepts</span>
  <h2 class="section-title">The four things that shape every AI response.</h2>

  <div style="display:grid;gap:.75rem;margin-top:.75rem">
    <div style="padding:1rem;border-radius:10px;background:rgba(192,132,252,.04);border:1px solid rgba(192,132,252,.1)">
      <strong style="color:#c084fc;font-size:.88rem">1. Tokens — how AI reads text</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">AI does not read words or characters. It reads <em>tokens</em> — subword chunks like "un" + "believ" + "able." Common words are one token; rare words get split. A token is roughly 4 characters or 0.75 words. This matters because you pay per token and your context window is measured in tokens.</p>
    </div>
    <div style="padding:1rem;border-radius:10px;background:rgba(56,189,248,.04);border:1px solid rgba(56,189,248,.1)">
      <strong style="color:#38bdf8;font-size:.88rem">2. Context Window — the model's working memory</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Everything the model can see at once: your prompt, conversation history, and its response. Claude Opus 4.6 has a 1M token context window. GPT-4o has 128K. Once you exceed the window, the oldest content gets dropped. This is why long conversations can "forget" earlier context.</p>
    </div>
    <div style="padding:1rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
      <strong style="color:#fb923c;font-size:.88rem">3. System Prompt — the invisible instructions</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">A hidden message processed before any user input. It defines the AI's persona, rules, and constraints. The user never sees it, but it shapes every response. Think of it as giving the AI a job description before it starts work.</p>
    </div>
    <div style="padding:1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
      <strong style="color:#34d399;font-size:.88rem">4. Temperature — creativity vs accuracy dial</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Controls randomness in the output. Low (0.0) = always picks the most likely word = deterministic, focused, correct. High (1.0) = sometimes picks unlikely words = creative, surprising, error-prone. Use low for code and facts, high for brainstorming.</p>
    </div>
  </div>

  <p class="section-text" style="margin-top:1.25rem">Here is a real API call showing all four concepts in action:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Python — all four concepts in one API call</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model=<span style="color:#fbbf24">"claude-sonnet-4-6"</span>,       <span style="color:#71717a"># which model</span>
    max_tokens=<span style="color:#fb923c">500</span>,                  <span style="color:#71717a"># ← context window budget</span>
    temperature=<span style="color:#fb923c">0.2</span>,                 <span style="color:#71717a"># ← low = factual, precise</span>
    system=<span style="color:#fbbf24">"You are a helpful coding tutor. "</span>  <span style="color:#71717a"># ← system prompt</span>
           <span style="color:#fbbf24">"Explain concepts simply. "</span>
           <span style="color:#fbbf24">"Always include a code example."</span>,
    messages=[                         <span style="color:#71717a"># ← user message (tokenized)</span>
        {<span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"user"</span>,
         <span style="color:#fbbf24">"content"</span>: <span style="color:#fbbf24">"What is a list comprehension in Python?"</span>}
    ]
)

<span style="color:#71717a"># Check token usage</span>
<span style="color:#34d399">print</span>(<span style="color:#fbbf24">f"Input tokens:  </span>{response.usage.input_tokens}<span style="color:#fbbf24">"</span>)
<span style="color:#34d399">print</span>(<span style="color:#fbbf24">f"Output tokens: </span>{response.usage.output_tokens}<span style="color:#fbbf24">"</span>)
<span style="color:#34d399">print</span>(response.content[<span style="color:#fb923c">0</span>].text)</code></pre>
</div>
<p style="font-size:.85rem;color:#71717a;margin-top:.5rem">Every parameter in this call maps to one of the four concepts. The <code>system</code> message is the invisible instruction. The <code>messages</code> content gets tokenized. <code>max_tokens</code> limits the context window budget. <code>temperature</code> controls creativity.</p>

</div>

<!-- SECTION 2B: COMMON MISTAKES -->
<div class="lesson-section">
  <span class="section-label">Watch Out</span>
  <h2 class="section-title">Common prompt mistakes and how to fix them.</h2>
  <p class="section-text">Understanding what goes wrong helps you write better prompts from the start. Here are the four most common mistakes beginners make:</p>

  <div style="display:grid;gap:.75rem;margin-top:.75rem">
    <div style="padding:1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
      <strong style="color:#ef4444;font-size:.88rem">Mistake 1: Being too vague</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">"Help me with my project" gives the AI nothing to work with. Instead: "I am building a React dashboard that shows sales data. Help me create a bar chart component that takes an array of monthly revenue numbers." Specificity is the single biggest lever you have.</p>
    </div>
    <div style="padding:1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
      <strong style="color:#ef4444;font-size:.88rem">Mistake 2: Overloading one prompt</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Asking the AI to "write a blog post, optimize it for SEO, translate it to Spanish, and create social media posts" in one go leads to mediocre results on all fronts. Break complex tasks into steps. Each prompt should have one clear objective.</p>
    </div>
    <div style="padding:1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
      <strong style="color:#ef4444;font-size:.88rem">Mistake 3: Not specifying format</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">If you need JSON, say "respond in valid JSON." If you need bullet points, say so. The AI will guess the format if you do not specify — and it often guesses wrong. This is especially critical when building applications that need to parse AI output programmatically.</p>
    </div>
    <div style="padding:1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
      <strong style="color:#ef4444;font-size:.88rem">Mistake 4: Ignoring the context window</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Pasting an entire 50-page document and asking "summarize this" may hit context limits or dilute the AI's focus. Instead, identify the most relevant sections, paste those, and be specific about what to summarize. More context is not always better — focused context is.</p>
    </div>
  </div>
</div>

<!-- SECTION 3: TEMPERATURE DEMO -->
<div class="lesson-section">
  <span class="section-label">Experiment</span>
  <h2 class="section-title">See how temperature changes output.</h2>
<div data-learn="FlashDeck" data-props='{"title":"Temperature Guide — Flip for Details","cards":[{"front":"🧊 LOW TEMPERATURE (0.0 - 0.3)\n\nDeterministic and focused","back":"BEST FOR: Code, math, factual questions, data analysis\n\nThe model always picks the most likely next token. Consistent, predictable, correct — but potentially repetitive.\n\nUSE WHEN: You need one right answer, not creative options."},{"front":"⚖️ MEDIUM TEMPERATURE (0.4 - 0.7)\n\nBalanced default","back":"BEST FOR: General conversations, business writing, explanations\n\nGood mix of coherence and variety. The default for most AI chatbots.\n\nUSE WHEN: You want natural-sounding output that is still reliable."},{"front":"🔥 HIGH TEMPERATURE (0.8 - 1.0+)\n\nCreative and unpredictable","back":"BEST FOR: Brainstorming, creative writing, generating diverse options\n\nThe model sometimes picks unlikely tokens, leading to surprising and creative output — but also more errors.\n\nUSE WHEN: You want ideas, not accuracy. Be prepared to filter."}]}'></div>

</div>

<!-- SECTION 4: QUIZ -->
<div class="lesson-section">
  <span class="section-label">Knowledge Check</span>
  <h2 class="section-title">Test your understanding.</h2>

<div data-learn="QuizMC" data-props='{"title":"Prompt Anatomy","questions":[{"q":"How does AI read the word \"unbelievable\"?","options":["As one token: unbelievable","As individual characters: u-n-b-e-l-i-e-v-a-b-l-e","As subword chunks like: un-believ-able","As the dictionary definition of the word"],"correct":2,"explanation":"AI tokenizers break words into subword chunks. Unbelievable becomes something like un + believ + able. The model never sees raw text — only token IDs (numbers)."},{"q":"Claude has a 200K token context window. What does this mean?","options":["It can remember 200,000 previous conversations","Your prompt plus its response must fit within 200,000 tokens total","It can process 200,000 words per second","It has 200,000 neurons"],"correct":1,"explanation":"The context window is the model working memory. Everything it can see at once — your prompt, conversation history, and its response — must fit within this limit."},{"q":"You are writing a system prompt for a customer service bot. It should be helpful but never make promises about refunds. Where does this instruction go?","options":["In the user message","In the system prompt — it gets processed before any user messages","In a separate configuration file","Nowhere — AI cannot follow such instructions"],"correct":1,"explanation":"System prompts set behavioral rules before any user interaction. They are the ideal place for personality, constraints, and behavioral guardrails."}]}'></div>

  <div class="narration" style="margin-top:1.5rem">
    <strong>Every prompt is a performance.</strong> Your words get chopped into tokens, fed through the context window alongside a system prompt, shaped by temperature, and out comes a response. Understanding this anatomy turns you from a user into an engineer.
  </div>
</div>

<!-- SECTION 4B: PUTTING IT ALL TOGETHER -->
<div class="lesson-section">
  <span class="section-label">Summary</span>
  <h2 class="section-title">The complete prompt pipeline.</h2>
  <p class="section-text">Every time you send a message to an AI, here is exactly what happens under the hood:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.5;overflow-x:auto">
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a">  THE PROMPT PIPELINE</span>

  1. <span style="color:#8b5cf6">SYSTEM PROMPT</span> loads first (invisible to user)
     → Sets persona, rules, constraints

  2. <span style="color:#34d399">YOUR MESSAGE</span> gets tokenized
     → "Hello world" → ["Hello", " world"] → [15339, 1917]

  3. <span style="color:#38bdf8">CONTEXT WINDOW</span> assembles everything
     → System + conversation history + your message

  4. <span style="color:#fb923c">TEMPERATURE</span> shapes the generation
     → Low = predictable, High = creative

  5. <span style="color:#e5e5e5">TOKENS GENERATE</span> one at a time
     → Each token is chosen based on probabilities

  6. <span style="color:#34d399">RESPONSE</span> streams back to you
     → Tokens get decoded back into readable text</code></pre>
</div>

  <p class="section-text">Understanding this pipeline means you can optimize at every step. Write better system prompts. Structure your messages for clarity. Choose the right temperature. Stay within the context window. These are the levers that separate mediocre AI interactions from excellent ones.</p>
</div>

<!-- NEXT LESSON -->
<div class="lesson-section" style="text-align:center;padding:2rem 0">
  <a href="/academy/ai-foundations/prompt-playground" style="display:inline-block;background:var(--orange);color:var(--bg);font-weight:700;padding:.75rem 2rem;border-radius:10px;text-decoration:none;font-size:.95rem">Next: Prompt Playground →</a>
</div>

</div>

