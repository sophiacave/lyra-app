---
title: "The Art of Constraints"
course: "prompt-writing-101"
order: 6
type: "lesson"
free: true
---<div class="wrap">

<nav class="local-nav">
  <a href="/academy/prompt-writing-101/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 6 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>The Art of <span class="accent">Constraints.</span></h1>
  <p class="sub">Limits don't limit AI. They focus it. The tighter the box, the more creative the output.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>Why constraints improve output quality (not reduce it)</li>
    <li>The 5 constraint types and when to use each</li>
    <li>How to use negative constraints ("Don't..." prompts)</li>
    <li>The "invisible guardrail" technique for tone control</li>
  </ul>
</div>

<!-- SECTION 1 -->
<div class="lesson-section">
  <span class="section-label">The Paradox</span>
  <h2 class="section-title">Why limits make AI better, not worse.</h2>
  <p class="section-text">It feels counterintuitive: give AI fewer options and it performs better? But think about writing a song. "Write a song about anything" is paralyzing. "Write a 4-line verse about losing your keys, in the style of country music" — now you can work.</p>
  <p class="section-text">Constraints do the same thing for AI. They eliminate the infinite space of mediocre possibilities and force the model into a focused, specific output space where the quality is higher.</p>
  <p class="section-text">Every professional who uses AI well has figured this out: <strong>constraints are not limitations. They're creative fuel.</strong></p>
</div>

<!-- SECTION 2: 5 TYPES -->
<div class="lesson-section">
  <span class="section-label">The Types</span>
  <h2 class="section-title">5 types of constraints.</h2>

  <div class="demo-container" style="padding:1.75rem">
    <div style="display:flex;flex-direction:column;gap:16px">
      <div style="display:flex;gap:12px;align-items:flex-start;padding-bottom:16px;border-bottom:1px solid var(--border)">
        <div style="background:rgba(251,146,60,.12);color:var(--orange);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0;margin-top:2px">1</div>
        <div>
          <div style="font-weight:700;font-size:.95rem;margin-bottom:4px">Length Constraints</div>
          <div style="color:var(--dim);font-size:.85rem">"Under 200 words." "Exactly 3 paragraphs." "One sentence per point."</div>
          <div style="color:var(--muted);font-size:.8rem;margin-top:4px">Forces conciseness. Eliminates padding and filler.</div>
        </div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start;padding-bottom:16px;border-bottom:1px solid var(--border)">
        <div style="background:rgba(192,132,252,.12);color:var(--purple);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0;margin-top:2px">2</div>
        <div>
          <div style="font-weight:700;font-size:.95rem;margin-bottom:4px">Tone Constraints</div>
          <div style="color:var(--dim);font-size:.85rem">"Casual but not sloppy." "Confident, not arrogant." "Empathetic without being patronizing."</div>
          <div style="color:var(--muted);font-size:.8rem;margin-top:4px">Defines the emotional register. Best when paired with what to avoid.</div>
        </div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start;padding-bottom:16px;border-bottom:1px solid var(--border)">
        <div style="background:rgba(56,189,248,.12);color:var(--blue);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0;margin-top:2px">3</div>
        <div>
          <div style="font-weight:700;font-size:.95rem;margin-bottom:4px">Scope Constraints</div>
          <div style="color:var(--dim);font-size:.85rem">"Only cover the marketing angle." "Focus on the first 30 days." "B2B SaaS only, not consumer."</div>
          <div style="color:var(--muted);font-size:.8rem;margin-top:4px">Prevents AI from going broad when you need depth on one area.</div>
        </div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start;padding-bottom:16px;border-bottom:1px solid var(--border)">
        <div style="background:rgba(74,222,128,.12);color:var(--green);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0;margin-top:2px">4</div>
        <div>
          <div style="font-weight:700;font-size:.95rem;margin-bottom:4px">Audience Constraints</div>
          <div style="color:var(--dim);font-size:.85rem">"Explain like I'm 12." "Written for a CTO." "Assume the reader has never used AI."</div>
          <div style="color:var(--muted);font-size:.8rem;margin-top:4px">Controls vocabulary, depth, and assumed knowledge level.</div>
        </div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(248,113,113,.12);color:var(--red);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0;margin-top:2px">5</div>
        <div>
          <div style="font-weight:700;font-size:.95rem;margin-bottom:4px">Negative Constraints</div>
          <div style="color:var(--dim);font-size:.85rem">"Don't use buzzwords." "No emojis." "Avoid the phrase 'in today's fast-paced world.'"</div>
          <div style="color:var(--muted);font-size:.8rem;margin-top:4px">Eliminates the AI's worst habits. Often the most impactful constraint you can add.</div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- SECTION 3: NEGATIVE CONSTRAINTS -->
<div class="lesson-section">
  <span class="section-label">The Secret Weapon</span>
  <h2 class="section-title">Negative constraints are your best friend.</h2>
  <p class="section-text">AI has patterns it falls into. You know them: the overly enthusiastic tone, the unnecessary preamble, the "great question!" response, the list that starts with "here are some..." AI-isms are the enemy of authentic output.</p>
  <p class="section-text">Negative constraints kill them instantly:</p>

  <div class="demo-container" style="padding:1.5rem">
    <div style="display:flex;flex-direction:column;gap:10px">
      <div style="background:var(--bg);border:1px solid rgba(248,113,113,.2);border-radius:8px;padding:10px 14px;font-size:.85rem;color:var(--dim)">"Don't start with 'Sure!' or 'Great question!' — just answer directly."</div>
      <div style="background:var(--bg);border:1px solid rgba(248,113,113,.2);border-radius:8px;padding:10px 14px;font-size:.85rem;color:var(--dim)">"Don't use the words 'delve,' 'leverage,' 'utilize,' or 'synergy.'"</div>
      <div style="background:var(--bg);border:1px solid rgba(248,113,113,.2);border-radius:8px;padding:10px 14px;font-size:.85rem;color:var(--dim)">"No preamble. No summary at the end. Just the content."</div>
      <div style="background:var(--bg);border:1px solid rgba(248,113,113,.2);border-radius:8px;padding:10px 14px;font-size:.85rem;color:var(--dim)">"Don't hedge with 'it depends' — commit to a recommendation."</div>
      <div style="background:var(--bg);border:1px solid rgba(248,113,113,.2);border-radius:8px;padding:10px 14px;font-size:.85rem;color:var(--dim)">"Avoid generic advice anyone could give. Be specific to my situation."</div>
    </div>
  </div>
</div>

<!-- SECTION 4 -->
<div class="lesson-section">
  <span class="section-label">Pro Technique</span>
  <h2 class="section-title">The "invisible guardrail" for tone.</h2>
  <p class="section-text">The most sophisticated way to control tone is pairing what you want with what you don't:</p>

  <div class="demo-container" style="padding:1.5rem">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div>
        <div style="font-size:.7rem;font-weight:700;color:var(--green);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Be This</div>
        <div style="background:var(--bg);border:1px solid rgba(74,222,128,.2);border-radius:10px;padding:12px;font-size:.85rem;color:var(--dim);line-height:1.8">
          Confident<br>Direct<br>Warm<br>Conversational<br>Honest
        </div>
      </div>
      <div>
        <div style="font-size:.7rem;font-weight:700;color:var(--red);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Not This</div>
        <div style="background:var(--bg);border:1px solid rgba(248,113,113,.2);border-radius:10px;padding:12px;font-size:.85rem;color:var(--dim);line-height:1.8">
          Arrogant<br>Blunt<br>Sappy<br>Sloppy<br>Brutal
        </div>
      </div>
    </div>
  </div>

  <p class="section-text" style="margin-top:1rem">This technique draws a precise line. "Confident, not arrogant" gives AI a much clearer target than "professional tone." The negative defines the boundary of the positive.</p>
</div>

<!-- NEXT LESSON -->
<div class="lesson-section" style="text-align:center;padding:2rem 0">
  <a href="/academy/prompt-writing-101/iteration-and-refinement" style="display:inline-block;background:var(--orange);color:var(--bg);font-weight:700;padding:.75rem 2rem;border-radius:10px;text-decoration:none;font-size:.95rem">Next: Iteration and Refinement →</a>
</div>

</div>
