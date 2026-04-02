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

  <div data-learn="TokenViz" data-props='{"initialText":"Write a haiku about artificial intelligence learning to dream","mode":"tokenizer"}'></div>
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

<!-- SECTION 3: TEMPERATURE DEMO -->
<div class="lesson-section">
  <span class="section-label">Experiment</span>
  <h2 class="section-title">See how temperature changes output.</h2>

  <div data-learn="TokenViz" data-props='{"mode":"temperature"}'></div>

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

<!-- NEXT LESSON -->
<div class="lesson-section" style="text-align:center;padding:2rem 0">
  <a href="/academy/ai-foundations/prompt-playground" style="display:inline-block;background:var(--orange);color:var(--bg);font-weight:700;padding:.75rem 2rem;border-radius:10px;text-decoration:none;font-size:.95rem">Next: Prompt Playground →</a>
</div>

</div>

