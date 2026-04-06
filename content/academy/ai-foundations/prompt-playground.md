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

