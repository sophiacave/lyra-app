---
title: "Context Is Everything"
course: "prompt-writing-101"
order: 4
type: "lesson"
free: false
---<div class="wrap">

<nav class="local-nav">
  <a href="/academy/prompt-writing-101/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 4 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Context Is <span class="accent">Everything.</span></h1>
  <p class="sub">AI doesn't know your situation, your audience, or your goals. Until you tell it.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>The 6 types of context that transform AI output</li>
    <li>How much context is too much (and too little)</li>
    <li>The "briefing document" technique for complex tasks</li>
    <li>How to reuse context across multiple prompts</li>
  </ul>
</div>

<!-- SECTION 1: THE PROBLEM -->
<div class="lesson-section">
  <span class="section-label">The Problem</span>
  <h2 class="section-title">Without context, AI has to guess. And it guesses wrong.</h2>
  <p class="section-text">When you prompt "Write me a marketing email," the AI doesn't know:</p>
  <ul class="section-text" style="padding-left:1.5rem;margin-top:.5rem;margin-bottom:1rem">
    <li>What you're selling</li>
    <li>Who you're selling to</li>
    <li>What makes your product different</li>
    <li>What tone your brand uses</li>
    <li>Whether this is a cold email or a follow-up</li>
    <li>What action you want the reader to take</li>
  </ul>
  <p class="section-text">So it fills in every blank with the most generic, average answer possible. That's not the AI being bad at its job — it's the AI doing the best it can with nothing to work with.</p>
</div>

<!-- SECTION 2: 6 TYPES -->
<div class="lesson-section">
  <span class="section-label">The Six Types</span>
  <h2 class="section-title">The 6 types of context that matter most.</h2>

  <div class="demo-container" style="padding:1.75rem">
    <div style="display:flex;flex-direction:column;gap:16px">
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(251,146,60,.12);color:var(--orange);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0;margin-top:2px">1</div>
        <div>
          <div style="font-weight:700;font-size:.95rem;margin-bottom:2px">Situation</div>
          <div style="color:var(--dim);font-size:.85rem">What's happening? "I'm launching a new product next week" or "I received a complaint from a long-time customer."</div>
        </div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(192,132,252,.12);color:var(--purple);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0;margin-top:2px">2</div>
        <div>
          <div style="font-weight:700;font-size:.95rem;margin-bottom:2px">Audience</div>
          <div style="color:var(--dim);font-size:.85rem">Who is this for? "Tech-savvy millennials" vs "retired professionals" changes everything about the output.</div>
        </div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(56,189,248,.12);color:var(--blue);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0;margin-top:2px">3</div>
        <div>
          <div style="font-weight:700;font-size:.95rem;margin-bottom:2px">Goal</div>
          <div style="color:var(--dim);font-size:.85rem">What outcome do you want? "Get them to click the link" vs "build trust for a future purchase" leads to very different content.</div>
        </div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(74,222,128,.12);color:var(--green);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0;margin-top:2px">4</div>
        <div>
          <div style="font-weight:700;font-size:.95rem;margin-bottom:2px">Background</div>
          <div style="color:var(--dim);font-size:.85rem">Relevant history or data. "We've been in business for 3 years and have 2,000 customers" or "This is a follow-up to last week's meeting."</div>
        </div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(248,113,113,.12);color:var(--red);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0;margin-top:2px">5</div>
        <div>
          <div style="font-weight:700;font-size:.95rem;margin-bottom:2px">Constraints</div>
          <div style="color:var(--dim);font-size:.85rem">Limitations. "Budget is $500" or "Must comply with HIPAA" or "Can't mention competitor by name."</div>
        </div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(251,146,60,.12);color:var(--orange);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0;margin-top:2px">6</div>
        <div>
          <div style="font-weight:700;font-size:.95rem;margin-bottom:2px">Prior Attempts</div>
          <div style="color:var(--dim);font-size:.85rem">What you've already tried. "I wrote a version but it feels too formal" — paste it in and ask for improvements.</div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- SECTION 3: HOW MUCH -->
<div class="lesson-section">
  <span class="section-label">The Balance</span>
  <h2 class="section-title">How much context is the right amount?</h2>

  <div class="demo-container" style="padding:1.5rem">
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px">
      <div style="text-align:center">
        <div style="font-size:.7rem;font-weight:700;color:var(--red);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Too Little</div>
        <div style="background:var(--bg);border:1px solid rgba(248,113,113,.2);border-radius:10px;padding:12px;font-size:.8rem;color:var(--dim);line-height:1.6">"Write a social media post."</div>
      </div>
      <div style="text-align:center">
        <div style="font-size:.7rem;font-weight:700;color:var(--green);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Just Right</div>
        <div style="background:var(--bg);border:1px solid rgba(74,222,128,.2);border-radius:10px;padding:12px;font-size:.8rem;color:var(--dim);line-height:1.6">"Write an Instagram caption for our coffee shop's new cold brew. Audience: 25-35 urban professionals. Tone: witty, casual. Include a CTA to visit this weekend. Under 150 characters."</div>
      </div>
      <div style="text-align:center">
        <div style="font-size:.7rem;font-weight:700;color:var(--orange);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Too Much</div>
        <div style="background:var(--bg);border:1px solid rgba(251,146,60,.2);border-radius:10px;padding:12px;font-size:.8rem;color:var(--dim);line-height:1.6">[500 words of company history, every menu item, founding story, competitor analysis, brand guidelines...]</div>
      </div>
    </div>
  </div>

  <p class="section-text" style="margin-top:1rem"><strong>The rule:</strong> Include context that would change the output if it were different. If swapping "coffee shop" for "law firm" would change the post, that context matters. If your founding story from 2015 wouldn't change a social media caption, leave it out.</p>
</div>

<!-- SECTION 4: BRIEFING DOC -->
<div class="lesson-section">
  <span class="section-label">Pro Technique</span>
  <h2 class="section-title">The briefing document technique.</h2>
  <p class="section-text">For complex or recurring tasks, create a reusable context block — a "briefing document" — that you paste at the start of any related prompt:</p>

  <div class="demo-container" style="padding:1.5rem;background:var(--surface);border:1px solid var(--border2)">
    <pre style="font-family:'JetBrains Mono',monospace;font-size:.8rem;color:var(--text);line-height:1.8;white-space:pre-wrap;margin:0"><span style="color:var(--orange)">COMPANY BRIEF:</span>
Company: Apex Design Studio (B2B web design agency)
Founded: 2021 | Team: 12 people | Revenue: $1.2M/year
Clients: SaaS companies, 50-500 employees
Voice: Professional but human. No corporate jargon.
Differentiator: We build sites that convert, not just look pretty.
Competitors: We don't trash-talk. Focus on our strengths.

<span style="color:var(--purple)">NOW — THE TASK:</span>
[Your specific prompt here]</pre>
  </div>

  <p class="section-text" style="margin-top:1rem">Save this somewhere you can copy-paste it. Every prompt you write for this company instantly gets the right voice, positioning, and constraints — without retyping it every time.</p>
  <p class="section-text">This is how professionals use AI. Not one-off prompts, but <strong>systems of context</strong> that make every interaction better.</p>
</div>

<!-- NEXT LESSON -->
<div class="lesson-section" style="text-align:center;padding:2rem 0">
  <a href="/academy/prompt-writing-101/output-formats-that-work" style="display:inline-block;background:var(--orange);color:var(--bg);font-weight:700;padding:.75rem 2rem;border-radius:10px;text-decoration:none;font-size:.95rem">Next: Output Formats That Work →</a>
</div>

</div>
