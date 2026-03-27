---
title: "Misinformation and Hallucinations"
course: "ai-ethics-and-safety"
order: 4
type: "lesson"
free: false
---<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-ethics-and-safety/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 4 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Misinformation and <span class="accent">Hallucinations.</span></h1>
  <p class="sub">AI can state complete falsehoods with perfect confidence. Knowing this is your superpower.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>What AI hallucinations are and why they happen</li>
    <li>The 5 situations where hallucinations are most dangerous</li>
    <li>How to fact-check AI output efficiently</li>
    <li>Prompt techniques that reduce hallucinations</li>
  </ul>
</div>

<!-- SECTION 1 -->
<div class="lesson-section">
  <span class="section-label">What's Happening</span>
  <h2 class="section-title">AI doesn't "know" things. It predicts the next word.</h2>
  <p class="section-text">When AI generates text, it's not retrieving facts from a database. It's predicting what word should come next based on patterns in its training data. Most of the time, this produces accurate information. But sometimes, the statistically likely next word leads to a completely fabricated "fact."</p>
  <p class="section-text">This is called a <strong>hallucination</strong> — when AI generates information that sounds authoritative but is partially or completely false. It might invent a statistic, cite a paper that doesn't exist, misattribute a quote, or describe an event that never happened.</p>
  <p class="section-text">The dangerous part: <strong>hallucinations sound exactly like real facts.</strong> There's no change in tone, no disclaimer, no hesitation. AI presents fiction and fact with identical confidence.</p>
</div>

<!-- SECTION 2 -->
<div class="lesson-section">
  <span class="section-label">Danger Zones</span>
  <h2 class="section-title">5 situations where hallucinations are most dangerous.</h2>

  <div class="demo-container" style="padding:1.75rem">
    <div style="display:flex;flex-direction:column;gap:16px">
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(248,113,113,.12);color:var(--red);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0">1</div>
        <div>
          <div style="font-weight:700;font-size:.85rem;color:var(--text)">Statistics and data</div>
          <div style="color:var(--dim);font-size:.85rem">AI will confidently state "studies show that 73% of..." when no such study exists. Never publish AI-generated statistics without verifying the source.</div>
        </div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(248,113,113,.12);color:var(--red);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0">2</div>
        <div>
          <div style="font-weight:700;font-size:.85rem;color:var(--text)">Citations and references</div>
          <div style="color:var(--dim);font-size:.85rem">AI will create perfectly formatted citations to books, papers, and articles that don't exist. The author might be real but the paper isn't. Always verify.</div>
        </div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(248,113,113,.12);color:var(--red);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0">3</div>
        <div>
          <div style="font-weight:700;font-size:.85rem;color:var(--text)">Legal and regulatory claims</div>
          <div style="color:var(--dim);font-size:.85rem">"This is required by law in California" — maybe, maybe not. AI mixes up jurisdictions, cites repealed laws, and invents regulations.</div>
        </div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(248,113,113,.12);color:var(--red);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0">4</div>
        <div>
          <div style="font-weight:700;font-size:.85rem;color:var(--text)">Medical and health information</div>
          <div style="color:var(--dim);font-size:.85rem">AI should never be your primary source for health decisions. It can mix up dosages, contraindications, and symptoms.</div>
        </div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(248,113,113,.12);color:var(--red);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0">5</div>
        <div>
          <div style="font-weight:700;font-size:.85rem;color:var(--text)">People and organizations</div>
          <div style="color:var(--dim);font-size:.85rem">AI can attribute actions, quotes, or positions to real people that are completely fabricated. This can damage reputations.</div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- SECTION 3: FACT CHECK -->
<div class="lesson-section">
  <span class="section-label">The Practice</span>
  <h2 class="section-title">How to fact-check AI efficiently.</h2>
  <p class="section-text">You don't need to verify every word. Focus on the claims that matter most:</p>

  <div class="demo-container" style="padding:1.5rem">
    <div style="display:flex;flex-direction:column;gap:12px">
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(56,189,248,.12);color:var(--blue);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0">✓</div>
        <div style="color:var(--dim);font-size:.85rem"><strong>Verify all specific numbers.</strong> Any statistic, date, price, or measurement — look it up.</div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(56,189,248,.12);color:var(--blue);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0">✓</div>
        <div style="color:var(--dim);font-size:.85rem"><strong>Check all named sources.</strong> If AI cites a study, book, or article — confirm it exists.</div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(56,189,248,.12);color:var(--blue);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0">✓</div>
        <div style="color:var(--dim);font-size:.85rem"><strong>Validate legal/medical claims.</strong> Cross-reference with authoritative sources (government sites, medical databases).</div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(56,189,248,.12);color:var(--blue);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0">✓</div>
        <div style="color:var(--dim);font-size:.85rem"><strong>Confirm quotes and attributions.</strong> Search for the exact quote. If you can't find it, it probably doesn't exist.</div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(56,189,248,.12);color:var(--blue);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0">✓</div>
        <div style="color:var(--dim);font-size:.85rem"><strong>Trust general advice, verify specifics.</strong> "Eating vegetables is healthy" is safe. "Vitamin D deficiency affects 42% of adults" needs a source.</div>
      </div>
    </div>
  </div>
</div>

<!-- SECTION 4: REDUCE -->
<div class="lesson-section">
  <span class="section-label">Prevention</span>
  <h2 class="section-title">Prompt techniques that reduce hallucinations.</h2>

  <div class="demo-container" style="padding:1.5rem">
    <div style="display:flex;flex-direction:column;gap:12px">
      <div style="background:var(--bg);border:1px solid rgba(74,222,128,.2);border-radius:8px;padding:10px 14px;font-size:.85rem;color:var(--dim)">"If you're not sure about something, say so rather than guessing."</div>
      <div style="background:var(--bg);border:1px solid rgba(74,222,128,.2);border-radius:8px;padding:10px 14px;font-size:.85rem;color:var(--dim)">"Only include statistics if you're confident they're accurate. If you can't verify a number, say 'approximately' or omit it."</div>
      <div style="background:var(--bg);border:1px solid rgba(74,222,128,.2);border-radius:8px;padding:10px 14px;font-size:.85rem;color:var(--dim)">"Don't cite sources unless you're certain they exist. I'd rather have no citation than a fake one."</div>
      <div style="background:var(--bg);border:1px solid rgba(74,222,128,.2);border-radius:8px;padding:10px 14px;font-size:.85rem;color:var(--dim)">"Distinguish between what you know with high confidence and what you're inferring or extrapolating."</div>
    </div>
  </div>
  <p class="section-text" style="margin-top:1rem">These instructions won't eliminate hallucinations, but they significantly reduce them. The AI is more likely to hedge or qualify when you've explicitly given it permission to be uncertain.</p>
</div>

<!-- NEXT -->
<div class="lesson-section" style="text-align:center;padding:2rem 0">
  <a href="/academy/ai-ethics-and-safety/transparency-and-disclosure" style="display:inline-block;background:var(--orange);color:var(--bg);font-weight:700;padding:.75rem 2rem;border-radius:10px;text-decoration:none;font-size:.95rem">Next: Transparency and Disclosure →</a>
</div>

</div>
