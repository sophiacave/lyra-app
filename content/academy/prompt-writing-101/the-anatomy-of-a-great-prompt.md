---
title: "The Anatomy of a Great Prompt"
course: "prompt-writing-101"
order: 2
type: "lesson"
free: true
---<div class="wrap">

<nav class="local-nav">
  <a href="/academy/prompt-writing-101/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 2 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>The Anatomy of a <span class="accent">Great Prompt.</span></h1>
  <p class="sub">Five building blocks. Infinite combinations. One framework that works every time.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>The 5 components of every effective prompt</li>
    <li>Which components are mandatory vs optional</li>
    <li>How to assemble them in the right order</li>
    <li>A reusable template you can apply to any task</li>
  </ul>
</div>

<!-- SECTION 1: THE FRAMEWORK -->
<div class="lesson-section">
  <span class="section-label">The Framework</span>
  <h2 class="section-title">The RCFCE Framework.</h2>
  <p class="section-text">Every great prompt is built from five components. You don't always need all five, but knowing them gives you a toolkit for any situation.</p>

  <div class="demo-container" style="padding:1.75rem">
    <div style="display:flex;flex-direction:column;gap:16px">
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(251,146,60,.12);color:var(--orange);font-weight:800;font-size:.9rem;padding:4px 12px;border-radius:6px;flex-shrink:0;margin-top:2px">R</div>
        <div>
          <div style="font-weight:700;font-size:.95rem;margin-bottom:2px">Role</div>
          <div style="color:var(--dim);font-size:.85rem">Who should the AI be? "You are a senior copywriter" sets the expertise level and perspective.</div>
        </div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(192,132,252,.12);color:var(--purple);font-weight:800;font-size:.9rem;padding:4px 12px;border-radius:6px;flex-shrink:0;margin-top:2px">C</div>
        <div>
          <div style="font-weight:700;font-size:.95rem;margin-bottom:2px">Context</div>
          <div style="color:var(--dim);font-size:.85rem">What's the situation? Background info, audience, constraints, what you've already tried.</div>
        </div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(56,189,248,.12);color:var(--blue);font-weight:800;font-size:.9rem;padding:4px 12px;border-radius:6px;flex-shrink:0;margin-top:2px">F</div>
        <div>
          <div style="font-weight:700;font-size:.95rem;margin-bottom:2px">Format</div>
          <div style="color:var(--dim);font-size:.85rem">What should the output look like? Bullet points, paragraphs, table, code, email format.</div>
        </div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(74,222,128,.12);color:var(--green);font-weight:800;font-size:.9rem;padding:4px 12px;border-radius:6px;flex-shrink:0;margin-top:2px">C</div>
        <div>
          <div style="font-weight:700;font-size:.95rem;margin-bottom:2px">Constraints</div>
          <div style="color:var(--dim);font-size:.85rem">What are the boundaries? Word count, tone, things to avoid, specific requirements.</div>
        </div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(248,113,113,.12);color:var(--red);font-weight:800;font-size:.9rem;padding:4px 12px;border-radius:6px;flex-shrink:0;margin-top:2px">E</div>
        <div>
          <div style="font-weight:700;font-size:.95rem;margin-bottom:2px">Examples</div>
          <div style="color:var(--dim);font-size:.85rem">What does "good" look like? Show the AI a sample of what you want.</div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- SECTION 2: MANDATORY VS OPTIONAL -->
<div class="lesson-section">
  <span class="section-label">Priorities</span>
  <h2 class="section-title">You don't always need all five.</h2>
  <p class="section-text">Here's the truth: for most everyday prompts, you need <strong>Context + Format</strong> at minimum. Those two alone put you ahead of 90% of AI users.</p>

  <div class="demo-container" style="padding:1.5rem">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div>
        <div style="font-size:.7rem;font-weight:700;color:var(--green);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Always Include</div>
        <ul style="list-style:none;padding:0;margin:0;font-size:.85rem;color:var(--dim)">
          <li style="padding:6px 0;border-bottom:1px solid var(--border)">✓ Context — what you need and why</li>
          <li style="padding:6px 0">✓ Format — what the output should look like</li>
        </ul>
      </div>
      <div>
        <div style="font-size:.7rem;font-weight:700;color:var(--purple);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Add When Needed</div>
        <ul style="list-style:none;padding:0;margin:0;font-size:.85rem;color:var(--dim)">
          <li style="padding:6px 0;border-bottom:1px solid var(--border)">+ Role — for specialized expertise</li>
          <li style="padding:6px 0;border-bottom:1px solid var(--border)">+ Constraints — for precision</li>
          <li style="padding:6px 0">+ Examples — for style matching</li>
        </ul>
      </div>
    </div>
  </div>
</div>

<!-- SECTION 3: BUILD A PROMPT -->
<div class="lesson-section">
  <span class="section-label">Practice</span>
  <h2 class="section-title">Let's build a prompt piece by piece.</h2>
  <p class="section-text">Say you need help writing a thank-you email to a client. Watch how each layer improves the result:</p>

  <div class="demo-container" style="padding:1.5rem">
    <div style="display:flex;flex-direction:column;gap:16px">
      <div>
        <div style="font-size:.7rem;font-weight:700;color:var(--red);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px">Just the ask</div>
        <div style="background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:12px;font-size:.85rem;color:var(--dim);line-height:1.6">"Write a thank you email."</div>
      </div>
      <div>
        <div style="font-size:.7rem;font-weight:700;color:var(--orange);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px">+ Context</div>
        <div style="background:var(--bg);border:1px solid rgba(251,146,60,.2);border-radius:10px;padding:12px;font-size:.85rem;color:var(--dim);line-height:1.6">"Write a thank you email to a client who just signed a $50K annual contract with our design agency. They chose us over two larger competitors."</div>
      </div>
      <div>
        <div style="font-size:.7rem;font-weight:700;color:var(--purple);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px">+ Context + Format + Constraints</div>
        <div style="background:var(--bg);border:1px solid rgba(192,132,252,.2);border-radius:10px;padding:12px;font-size:.85rem;color:var(--dim);line-height:1.6">"Write a thank you email to a client who just signed a $50K annual contract with our design agency. They chose us over two larger competitors. Keep it under 150 words. Tone: warm and professional, not salesy. End with a concrete next step (scheduling a kickoff call). No exclamation marks — they feel forced in business emails."</div>
      </div>
      <div>
        <div style="font-size:.7rem;font-weight:700;color:var(--green);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px">+ Role + Context + Format + Constraints</div>
        <div style="background:var(--bg);border:1px solid rgba(74,222,128,.2);border-radius:10px;padding:12px;font-size:.85rem;color:var(--dim);line-height:1.6">"You're the founder of a 12-person design agency. Write a thank you email to a client who just signed a $50K annual contract. They chose us over two larger competitors. Keep it under 150 words. Tone: warm, confident, and founder-to-founder — not corporate. End with a concrete next step (scheduling a kickoff call). No exclamation marks."</div>
      </div>
    </div>
  </div>
  <p class="section-text" style="margin-top:1rem">Each layer adds specificity. The AI fills in fewer blanks. The output gets closer to what you actually want.</p>
</div>

<!-- SECTION 4: THE TEMPLATE -->
<div class="lesson-section">
  <span class="section-label">Your Template</span>
  <h2 class="section-title">Copy this. Use it everywhere.</h2>

  <div class="demo-container" style="padding:1.5rem;background:var(--surface);border:1px solid var(--border2)">
    <pre style="font-family:'JetBrains Mono',monospace;font-size:.8rem;color:var(--text);line-height:1.8;white-space:pre-wrap;margin:0"><span style="color:var(--orange)">[ROLE]</span> You are a [expertise/persona].

<span style="color:var(--purple)">[CONTEXT]</span> I need help with [situation].
Background: [relevant details].
Audience: [who will see this].

<span style="color:var(--blue)">[FORMAT]</span> Give me [specific output format].

<span style="color:var(--green)">[CONSTRAINTS]</span>
- [Length/word count]
- [Tone]
- [Things to avoid]
- [Specific requirements]

<span style="color:var(--red)">[EXAMPLE]</span> (optional)
Here's an example of what I'm looking for:
[paste example]</pre>
  </div>
  <p class="section-text" style="margin-top:1rem">You don't need to use labels like [ROLE] in your actual prompts — those are just training wheels. Once you internalize the framework, you'll naturally include these elements in flowing, natural language.</p>
</div>

<!-- NEXT LESSON -->
<div class="lesson-section" style="text-align:center;padding:2rem 0">
  <a href="/academy/prompt-writing-101/roles-and-personas" style="display:inline-block;background:var(--orange);color:var(--bg);font-weight:700;padding:.75rem 2rem;border-radius:10px;text-decoration:none;font-size:.95rem">Next: Roles and Personas →</a>
</div>

</div>
