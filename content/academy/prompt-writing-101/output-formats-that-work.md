---
title: "Output Formats That Work"
course: "prompt-writing-101"
order: 5
type: "lesson"
free: true
---<div class="wrap">

<nav class="local-nav">
  <a href="/academy/prompt-writing-101/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 5 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Output Formats <span class="accent">That Work.</span></h1>
  <p class="sub">Tell AI what shape the answer should take and you'll never get a wall of useless text again.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>The 8 most useful output formats and when to use each</li>
    <li>How to specify format without being rigid</li>
    <li>The "show me the structure" technique</li>
    <li>How to get AI to output in formats you can paste directly into other tools</li>
  </ul>
</div>

<!-- SECTION 1 -->
<div class="lesson-section">
  <span class="section-label">The Problem</span>
  <h2 class="section-title">Why AI gives you walls of text.</h2>
  <p class="section-text">When you don't specify a format, AI defaults to flowing paragraphs. It's like asking someone a question and getting a 10-minute monologue when you needed a yes or no.</p>
  <p class="section-text">The fix is simple: <strong>tell the AI what shape the answer should take.</strong> Not just "give me a list" — but specifically how you want the information organized.</p>
</div>

<!-- SECTION 2: THE 8 FORMATS -->
<div class="lesson-section">
  <span class="section-label">The Formats</span>
  <h2 class="section-title">8 formats you'll use constantly.</h2>

  <div class="demo-container" style="padding:1.5rem">
    <div style="display:flex;flex-direction:column;gap:14px">
      <div style="display:flex;gap:12px;align-items:flex-start;padding-bottom:14px;border-bottom:1px solid var(--border)">
        <div style="background:rgba(251,146,60,.12);color:var(--orange);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0;min-width:36px;text-align:center">1</div>
        <div>
          <div style="font-weight:700;font-size:.95rem;margin-bottom:4px">Bullet Points</div>
          <div style="color:var(--dim);font-size:.85rem">Best for: brainstorming, lists, quick summaries</div>
          <div style="color:var(--muted);font-size:.8rem;margin-top:4px;font-style:italic">"Give me 10 bullet points on..."</div>
        </div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start;padding-bottom:14px;border-bottom:1px solid var(--border)">
        <div style="background:rgba(251,146,60,.12);color:var(--orange);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0;min-width:36px;text-align:center">2</div>
        <div>
          <div style="font-weight:700;font-size:.95rem;margin-bottom:4px">Numbered Steps</div>
          <div style="color:var(--dim);font-size:.85rem">Best for: instructions, processes, how-tos</div>
          <div style="color:var(--muted);font-size:.8rem;margin-top:4px;font-style:italic">"Walk me through this step by step, numbered 1-N."</div>
        </div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start;padding-bottom:14px;border-bottom:1px solid var(--border)">
        <div style="background:rgba(251,146,60,.12);color:var(--orange);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0;min-width:36px;text-align:center">3</div>
        <div>
          <div style="font-weight:700;font-size:.95rem;margin-bottom:4px">Table</div>
          <div style="color:var(--dim);font-size:.85rem">Best for: comparisons, data, decision matrices</div>
          <div style="color:var(--muted);font-size:.8rem;margin-top:4px;font-style:italic">"Create a table comparing X, Y, Z with columns for price, features, and pros/cons."</div>
        </div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start;padding-bottom:14px;border-bottom:1px solid var(--border)">
        <div style="background:rgba(251,146,60,.12);color:var(--orange);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0;min-width:36px;text-align:center">4</div>
        <div>
          <div style="font-weight:700;font-size:.95rem;margin-bottom:4px">Email/Message Format</div>
          <div style="color:var(--dim);font-size:.85rem">Best for: communications you'll send directly</div>
          <div style="color:var(--muted);font-size:.8rem;margin-top:4px;font-style:italic">"Write this as a ready-to-send email with subject line."</div>
        </div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start;padding-bottom:14px;border-bottom:1px solid var(--border)">
        <div style="background:rgba(251,146,60,.12);color:var(--orange);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0;min-width:36px;text-align:center">5</div>
        <div>
          <div style="font-weight:700;font-size:.95rem;margin-bottom:4px">Pros/Cons</div>
          <div style="color:var(--dim);font-size:.85rem">Best for: decisions, evaluations, debates</div>
          <div style="color:var(--muted);font-size:.8rem;margin-top:4px;font-style:italic">"Give me pros and cons in two columns."</div>
        </div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start;padding-bottom:14px;border-bottom:1px solid var(--border)">
        <div style="background:rgba(251,146,60,.12);color:var(--orange);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0;min-width:36px;text-align:center">6</div>
        <div>
          <div style="font-weight:700;font-size:.95rem;margin-bottom:4px">TL;DR + Deep Dive</div>
          <div style="color:var(--dim);font-size:.85rem">Best for: research, reports, analysis</div>
          <div style="color:var(--muted);font-size:.8rem;margin-top:4px;font-style:italic">"Start with a 2-sentence summary, then go deeper in sections."</div>
        </div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start;padding-bottom:14px;border-bottom:1px solid var(--border)">
        <div style="background:rgba(251,146,60,.12);color:var(--orange);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0;min-width:36px;text-align:center">7</div>
        <div>
          <div style="font-weight:700;font-size:.95rem;margin-bottom:4px">JSON/CSV/Structured Data</div>
          <div style="color:var(--dim);font-size:.85rem">Best for: data you'll import into other tools</div>
          <div style="color:var(--muted);font-size:.8rem;margin-top:4px;font-style:italic">"Output as JSON with keys: name, category, priority."</div>
        </div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(251,146,60,.12);color:var(--orange);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0;min-width:36px;text-align:center">8</div>
        <div>
          <div style="font-weight:700;font-size:.95rem;margin-bottom:4px">Script/Dialogue</div>
          <div style="color:var(--dim);font-size:.85rem">Best for: presentations, videos, role-plays</div>
          <div style="color:var(--muted);font-size:.8rem;margin-top:4px;font-style:italic">"Write this as a 2-minute video script with speaker directions."</div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- SECTION 3 -->
<div class="lesson-section">
  <span class="section-label">Pro Technique</span>
  <h2 class="section-title">Show the structure, get the structure.</h2>
  <p class="section-text">The most powerful format trick: <strong>show the AI what your ideal output looks like.</strong> Even a rough skeleton works:</p>

  <div class="demo-container" style="padding:1.5rem;background:var(--surface);border:1px solid var(--border2)">
    <pre style="font-family:'JetBrains Mono',monospace;font-size:.8rem;color:var(--text);line-height:1.8;white-space:pre-wrap;margin:0">Structure your response like this:

<span style="color:var(--orange)">## [Topic Name]</span>
<span style="color:var(--dim)">One-sentence summary of the key insight.</span>

<span style="color:var(--purple)">**Why it matters:**</span> [2-3 sentences]
<span style="color:var(--green)">**What to do:**</span> [Specific actionable step]
<span style="color:var(--blue)">**Example:**</span> [Real-world example]

Repeat for each topic. Keep each section under 100 words.</pre>
  </div>

  <p class="section-text" style="margin-top:1rem">When AI sees this structure, it mirrors it precisely. You get consistent, scannable output every time — no reformatting needed.</p>
</div>

<!-- SECTION 4 -->
<div class="lesson-section">
  <span class="section-label">Power Move</span>
  <h2 class="section-title">Output for your tools, not your eyes.</h2>
  <p class="section-text">One of the most underused techniques: ask AI to output in the exact format your next tool needs.</p>
  <ul class="section-text" style="padding-left:1.5rem;margin-top:.5rem;margin-bottom:1rem">
    <li>Need to paste into a spreadsheet? Ask for <strong>CSV format</strong>.</li>
    <li>Building a website? Ask for <strong>HTML</strong>.</li>
    <li>Feeding into another AI tool? Ask for <strong>JSON</strong>.</li>
    <li>Creating a presentation? Ask for <strong>one slide per section with title + 3 bullet points</strong>.</li>
  </ul>
  <p class="section-text">Think about where this output is going <em>next</em> and format it for that destination. You'll skip an entire step of reformatting.</p>
</div>

<!-- NEXT LESSON -->
<div class="lesson-section" style="text-align:center;padding:2rem 0">
  <a href="/academy/prompt-writing-101/the-art-of-constraints" style="display:inline-block;background:var(--orange);color:var(--bg);font-weight:700;padding:.75rem 2rem;border-radius:10px;text-decoration:none;font-size:.95rem">Next: The Art of Constraints →</a>
</div>

</div>
