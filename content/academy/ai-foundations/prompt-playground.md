---
title: "Prompt Playground"
course: "ai-foundations"
order: 5
type: "lesson"
free: false
---<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-foundations/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 5 of 9</span>
</nav>

<div class="lesson-hero">
  <h1>Prompt <span class="accent">Playground.</span></h1>
  <p class="sub">Master four essential prompt engineering techniques. Edit, experiment, and see the difference firsthand.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>Zero-Shot: clear instructions, no examples needed</li>
    <li>Few-Shot: teach by showing input/output examples</li>
    <li>Chain-of-Thought: force step-by-step reasoning</li>
    <li>Role-Play: give the AI a persona with expertise</li>
  </ul>
</div>

<!-- SECTION 0: PROMPT ENGINEERING FUNDAMENTALS -->
<div class="lesson-section">
  <span class="section-label">Fundamentals</span>
  <h2 class="section-title">Why prompt engineering matters.</h2>
  <p class="section-text">The same AI model can give you a brilliant answer or a useless one — the difference is how you ask. Prompt engineering is the skill of structuring your instructions to get the best possible output. It is the most accessible AI skill because it requires zero coding, zero math — just clear thinking and good communication.</p>

  <div style="display:grid;gap:.75rem;margin-top:.75rem">
    <div style="padding:1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
      <strong style="color:#34d399;font-size:.88rem">Be specific, not vague</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Vague: "Tell me about dogs." Specific: "List the top 5 dog breeds for apartment living, with pros and cons for each." The more specific your instruction, the more useful the output. Think of the AI as an eager intern — incredibly capable, but needs clear direction.</p>
    </div>
    <div style="padding:1rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
      <strong style="color:#8b5cf6;font-size:.88rem">Structure your prompt</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Break your prompt into clear sections. Use labels like "Context:", "Task:", "Format:", "Constraints:". Just like a well-organized email is easier to act on than a rambling paragraph, a structured prompt produces more focused output. The AI can distinguish what is background from what is the actual request.</p>
    </div>
    <div style="padding:1rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
      <strong style="color:#fb923c;font-size:.88rem">Iterate and refine</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Your first prompt is rarely your best. Start with a simple version, see what comes back, then refine. Add constraints to fix problems: if the output is too long, add "Keep it under 100 words." If it is too formal, add "Use a casual, friendly tone." Each iteration teaches you what the AI needs to hear.</p>
    </div>
    <div style="padding:1rem;border-radius:10px;background:rgba(56,189,248,.04);border:1px solid rgba(56,189,248,.1)">
      <strong style="color:#38bdf8;font-size:.88rem">Know when to use which technique</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">The four techniques below are your core toolkit. Each is best for a different type of task. Learning when to use each one — and when to combine them — is what separates a casual user from a prompt engineer. The good news: the decision tree is simple, and practice makes it second nature.</p>
    </div>
  </div>

  <p class="section-text" style="margin-top:1.25rem">Here are the common anti-patterns — mistakes that make AI outputs worse:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.5;overflow-x:auto">
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a">  PROMPT ANTI-PATTERNS (avoid these)</span>

  <span style="color:#ef4444">BAD</span>: "Write something about marketing"
  <span style="color:#34d399">GOOD</span>: "Write a 200-word LinkedIn post about email marketing
         for small business owners. Include 3 actionable tips."

  <span style="color:#ef4444">BAD</span>: "Fix this code" (with no context)
  <span style="color:#34d399">GOOD</span>: "This Python function should return the sum of even
         numbers but returns 0. Find and fix the bug: [code]"

  <span style="color:#ef4444">BAD</span>: "Be creative"
  <span style="color:#34d399">GOOD</span>: "Generate 5 unique product name ideas for a sustainable
         water bottle brand. Names should be 1-2 words, memorable,
         and suggest environmental consciousness."

  <span style="color:#71717a">The pattern: specific task + clear context + output format</span></code></pre>
</div>

  <div class="narration" style="margin-top:1rem">
    <strong>Prompt engineering is the highest-leverage AI skill you can learn.</strong> It costs nothing, requires no technical background, and immediately improves every AI interaction you have. The four techniques below are your toolkit — master them, and you will get better results from any AI model.
  </div>
</div>

<!-- SECTION 1: TECHNIQUE OVERVIEW -->
<div class="lesson-section">
  <span class="section-label">The Four Techniques</span>
  <h2 class="section-title">Each one solves a different problem.</h2>

<div data-learn="FlashDeck" data-props='{"title":"Four Prompt Techniques — Flip for Details","cards":[{"front":"🎯 ZERO-SHOT\n\nNo examples given.\nJust a clear instruction.","back":"WHEN TO USE: Simple, well-defined tasks like classification, translation, or formatting.\n\nEXAMPLE: \"Classify this review as POSITIVE or NEGATIVE: [text]\"\n\nTIP: Be specific about format, length, and tone. The more precise, the better."},{"front":"📋 FEW-SHOT\n\nGive 2-3 examples first.\nAI learns the pattern.","back":"WHEN TO USE: When you need a specific output format or style the AI might not guess.\n\nEXAMPLE: Show 2 informal→professional email conversions, then give a new informal message.\n\nTIP: Make examples diverse. If all examples are similar, the AI may not generalize."},{"front":"🔗 CHAIN-OF-THOUGHT\n\nForce step-by-step reasoning.\nDramatically improves accuracy.","back":"WHEN TO USE: Math, logic, multi-step reasoning, anything that needs accuracy over speed.\n\nEXAMPLE: \"Solve this step by step: [problem]. Let us think step by step.\"\n\nRESEARCH: Up to 2x accuracy improvement on complex problems."},{"front":"🎭 ROLE-PLAY\n\nGive the AI a persona.\nGet expert-level output.","back":"WHEN TO USE: When you need specialized expertise or a specific communication style.\n\nEXAMPLE: \"You are a senior security engineer reviewing code for vulnerabilities. Flag issues by severity.\"\n\nTIP: Include expertise level, style, focus areas, and what to avoid."}]}'></div>

</div>

<!-- SECTION 1B: CODE EXAMPLES -->
<div class="lesson-section">
  <span class="section-label">The Code</span>
  <h2 class="section-title">Each technique in real Python.</h2>
  <p class="section-text">Here is how each technique looks when you call the Claude API. These are production-ready patterns you can copy directly:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Python — zero-shot classification</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> anthropic

client = anthropic.Anthropic()

<span style="color:#71717a"># Zero-shot: just a clear instruction, no examples</span>
response = client.messages.create(
    model=<span style="color:#fbbf24">"claude-sonnet-4-6"</span>,
    max_tokens=<span style="color:#fb923c">50</span>,
    messages=[{
        <span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"user"</span>,
        <span style="color:#fbbf24">"content"</span>: <span style="color:#fbbf24">"Classify this review as POSITIVE or NEGATIVE:\n\n"</span>
                   <span style="color:#fbbf24">"'The food was incredible but the service was painfully slow.'\n\n"</span>
                   <span style="color:#fbbf24">"Classification:"</span>
    }]
)</code></pre>
</div>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Python — few-shot (teach by example)</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a"># Few-shot: give 2 examples, then the real task</span>
prompt = <span style="color:#fbbf24">"""Extract the product and sentiment:

Review: "Love my new AirPods, sound quality is amazing"
→ Product: AirPods | Sentiment: positive

Review: "The laptop keyboard broke after two weeks"
→ Product: laptop | Sentiment: negative

Review: "This standing desk changed my work life"
→"""</span>

response = client.messages.create(
    model=<span style="color:#fbbf24">"claude-sonnet-4-6"</span>,
    max_tokens=<span style="color:#fb923c">50</span>,
    messages=[{<span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"user"</span>, <span style="color:#fbbf24">"content"</span>: prompt}]
)
<span style="color:#71717a"># → Product: standing desk | Sentiment: positive</span></code></pre>
</div>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Python — chain-of-thought (step-by-step reasoning)</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a"># Chain-of-thought: "think step by step" = 2x accuracy</span>
response = client.messages.create(
    model=<span style="color:#fbbf24">"claude-sonnet-4-6"</span>,
    max_tokens=<span style="color:#fb923c">500</span>,
    messages=[{
        <span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"user"</span>,
        <span style="color:#fbbf24">"content"</span>: <span style="color:#fbbf24">"A store has a 'buy 2, get 1 free' deal on $3 notebooks. "</span>
                   <span style="color:#fbbf24">"Sarah wants 7 notebooks. How much does she pay?\n\n"</span>
                   <span style="color:#fbbf24">"Think step by step before giving the final answer."</span>
    }]
)</code></pre>
</div>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Python — role-play (expert persona via system prompt)</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a"># Role-play: system prompt sets the expert persona</span>
response = client.messages.create(
    model=<span style="color:#fbbf24">"claude-sonnet-4-6"</span>,
    max_tokens=<span style="color:#fb923c">500</span>,
    system=<span style="color:#fbbf24">"You are a senior security engineer with 15 years of "</span>
           <span style="color:#fbbf24">"experience. Review code for vulnerabilities. Flag by "</span>
           <span style="color:#fbbf24">"severity: CRITICAL, HIGH, MEDIUM, LOW. Always suggest a fix."</span>,
    messages=[{
        <span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"user"</span>,
        <span style="color:#fbbf24">"content"</span>: <span style="color:#fbbf24">"""Review this code:
app.get("/user", (req, res) => {
  const userId = req.query.id;
  const query = `SELECT * FROM users WHERE id = ${userId}`;
  db.query(query).then(user => res.json(user));
});"""</span>
    }]
)</code></pre>
</div>
<p style="font-size:.85rem;color:#71717a;margin-top:.5rem">Notice the pattern: zero-shot and chain-of-thought modify the <em>user message</em>. Role-play uses the <em>system prompt</em>. Few-shot embeds examples <em>inside</em> the user message. Same API call — different strategy.</p>

</div>

<!-- SECTION 2: INTERACTIVE PLAYGROUND -->
<div class="lesson-section">
  <span class="section-label">Try It</span>
  <h2 class="section-title">Edit prompts and see the difference.</h2>
</div>

<!-- SECTION 2B: REAL-WORLD PATTERNS -->
<div class="lesson-section">
  <span class="section-label">Production Patterns</span>
  <h2 class="section-title">Prompt patterns used in real products.</h2>
  <p class="section-text">The techniques above are the building blocks. Here are three production patterns that combine them for specific use cases:</p>

  <div style="display:grid;gap:.75rem;margin-top:.75rem">
    <div style="padding:1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
      <strong style="color:#34d399;font-size:.88rem">The Guardrail Pattern — safe AI products</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">System prompt sets strict boundaries: "You are a customer service agent for AcmeCorp. Only answer questions about our products. Never discuss competitors. Never share pricing not listed on our website. If asked about something outside your scope, politely redirect." This pattern prevents the AI from going off-script in customer-facing applications.</p>
    </div>
    <div style="padding:1rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
      <strong style="color:#8b5cf6;font-size:.88rem">The Extraction Pattern — structured data from chaos</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Combine few-shot with format constraints: show 2-3 examples of messy input transformed into clean JSON, then provide the new messy input. This pattern powers data extraction pipelines that process thousands of unstructured documents (emails, PDFs, forms) into clean database records automatically.</p>
    </div>
    <div style="padding:1rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
      <strong style="color:#fb923c;font-size:.88rem">The Evaluation Pattern — AI grading AI</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Use one AI call to generate content, then a second AI call (with chain-of-thought) to evaluate the quality. "Rate this summary from 1-10 on accuracy, completeness, and clarity. Think step by step about each dimension before giving scores." This self-evaluation loop is how teams build reliable AI systems without manual review of every output.</p>
    </div>
  </div>
</div>

<!-- SECTION 3: QUIZ -->
<div class="lesson-section">
  <span class="section-label">Knowledge Check</span>
  <h2 class="section-title">Pick the right technique.</h2>


<div data-learn="QuizMC" data-props='{"title":"Technique Selection","questions":[{"q":"You need the AI to format data in a very specific way that it has never seen before. Which technique?","options":["Zero-shot with detailed instructions","Few-shot with 2-3 examples of the exact format you want","Chain-of-thought reasoning","Role-play as a data formatter"],"correct":1,"explanation":"When you need a specific, unusual format, showing the AI 2-3 examples is far more effective than trying to describe the format in words. Few-shot lets the AI learn the pattern from examples."},{"q":"Research shows chain-of-thought prompting can improve math accuracy by up to:","options":["10%","25%","50%","100% (2x)"],"correct":3,"explanation":"Studies show chain-of-thought prompting can double accuracy on multi-step reasoning tasks. By forcing the model to show its work, errors in intermediate steps become visible and correctable."}]}'></div>

</div>

<!-- NEXT LESSON -->
<div class="lesson-section" style="text-align:center;padding:2rem 0">
  <a href="/academy/ai-foundations/prompt-battle" style="display:inline-block;background:var(--orange);color:var(--bg);font-weight:700;padding:.75rem 2rem;border-radius:10px;text-decoration:none;font-size:.95rem">Next: Prompt Battle →</a>
</div>

</div>

