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

<!-- MISTAKE 1 -->
<div class="lesson-section">
  <span class="section-label">Mistake 1</span>
  <h2 class="section-title">Being too vague.</h2>
  <div class="demo-container" style="padding:1.5rem">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div>
        <div style="font-size:.7rem;font-weight:700;color:var(--red);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">The Mistake</div>
        <div style="background:var(--bg);border:1px solid rgba(248,113,113,.2);border-radius:10px;padding:12px;font-size:.85rem;color:var(--dim)">"Help me with my resume."</div>
      </div>
      <div>
        <div style="font-size:.7rem;font-weight:700;color:var(--green);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">The Fix</div>
        <div style="background:var(--bg);border:1px solid rgba(74,222,128,.2);border-radius:10px;padding:12px;font-size:.85rem;color:var(--dim)">"Rewrite the experience section of my resume for a senior product manager role at a fintech company. Here's my current version: [paste]"</div>
      </div>
    </div>
    <p style="font-size:.8rem;color:var(--purple);margin:12px 0 0;padding:10px;background:rgba(192,132,252,.06);border-radius:8px"><strong>Why it matters:</strong> Vague prompts = vague output. The AI doesn't know which part of your resume, what role you're targeting, or what "help" means.</p>
  </div>
</div>

<!-- MISTAKE 2 -->
<div class="lesson-section">
  <span class="section-label">Mistake 2</span>
  <h2 class="section-title">Asking multiple questions at once.</h2>
  <div class="demo-container" style="padding:1.5rem">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div>
        <div style="font-size:.7rem;font-weight:700;color:var(--red);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">The Mistake</div>
        <div style="background:var(--bg);border:1px solid rgba(248,113,113,.2);border-radius:10px;padding:12px;font-size:.85rem;color:var(--dim)">"What's the best CRM, how do I set it up, and can you write me a sales email template and also suggest a pricing strategy?"</div>
      </div>
      <div>
        <div style="font-size:.7rem;font-weight:700;color:var(--green);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">The Fix</div>
        <div style="background:var(--bg);border:1px solid rgba(74,222,128,.2);border-radius:10px;padding:12px;font-size:.85rem;color:var(--dim)">"I'm setting up a CRM for my 5-person sales team selling B2B SaaS ($5K-$50K deals). Compare HubSpot, Pipedrive, and Close.io in a table with columns: price, best for, biggest limitation."</div>
      </div>
    </div>
    <p style="font-size:.8rem;color:var(--purple);margin:12px 0 0;padding:10px;background:rgba(192,132,252,.06);border-radius:8px"><strong>Why it matters:</strong> AI spreads attention across all questions equally. One focused question gets 10x the depth of four bundled ones.</p>
  </div>
</div>

<!-- MISTAKE 3 -->
<div class="lesson-section">
  <span class="section-label">Mistake 3</span>
  <h2 class="section-title">No audience specified.</h2>
  <div class="demo-container" style="padding:1.5rem">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div>
        <div style="font-size:.7rem;font-weight:700;color:var(--red);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">The Mistake</div>
        <div style="background:var(--bg);border:1px solid rgba(248,113,113,.2);border-radius:10px;padding:12px;font-size:.85rem;color:var(--dim)">"Explain machine learning."</div>
      </div>
      <div>
        <div style="font-size:.7rem;font-weight:700;color:var(--green);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">The Fix</div>
        <div style="background:var(--bg);border:1px solid rgba(74,222,128,.2);border-radius:10px;padding:12px;font-size:.85rem;color:var(--dim)">"Explain machine learning to a marketing manager who has never written code. Use analogies from advertising and customer behavior. Keep it under 200 words."</div>
      </div>
    </div>
    <p style="font-size:.8rem;color:var(--purple);margin:12px 0 0;padding:10px;background:rgba(192,132,252,.06);border-radius:8px"><strong>Why it matters:</strong> "Explain X" to a PhD and a teenager are completely different tasks. Without an audience, AI picks the middle — which satisfies no one.</p>
  </div>
</div>

<!-- MISTAKE 4 -->
<div class="lesson-section">
  <span class="section-label">Mistake 4</span>
  <h2 class="section-title">Accepting the first output.</h2>
  <div class="demo-container" style="padding:1.5rem">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div>
        <div style="font-size:.7rem;font-weight:700;color:var(--red);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">The Mistake</div>
        <div style="background:var(--bg);border:1px solid rgba(248,113,113,.2);border-radius:10px;padding:12px;font-size:.85rem;color:var(--dim)">Getting mediocre output → "AI sucks" → giving up</div>
      </div>
      <div>
        <div style="font-size:.7rem;font-weight:700;color:var(--green);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">The Fix</div>
        <div style="background:var(--bg);border:1px solid rgba(74,222,128,.2);border-radius:10px;padding:12px;font-size:.85rem;color:var(--dim)">Getting mediocre output → "Make it more specific to my industry. Remove the generic advice. Give me numbers." → great result</div>
      </div>
    </div>
    <p style="font-size:.8rem;color:var(--purple);margin:12px 0 0;padding:10px;background:rgba(192,132,252,.06);border-radius:8px"><strong>Why it matters:</strong> First outputs are first drafts. The iteration is where quality lives. (See Lesson 7.)</p>
  </div>
</div>

<!-- MISTAKE 5 -->
<div class="lesson-section">
  <span class="section-label">Mistake 5</span>
  <h2 class="section-title">Being polite instead of clear.</h2>
  <div class="demo-container" style="padding:1.5rem">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div>
        <div style="font-size:.7rem;font-weight:700;color:var(--red);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">The Mistake</div>
        <div style="background:var(--bg);border:1px solid rgba(248,113,113,.2);border-radius:10px;padding:12px;font-size:.85rem;color:var(--dim)">"If it's not too much trouble, could you maybe try to perhaps write something about marketing? Only if you have time!"</div>
      </div>
      <div>
        <div style="font-size:.7rem;font-weight:700;color:var(--green);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">The Fix</div>
        <div style="background:var(--bg);border:1px solid rgba(74,222,128,.2);border-radius:10px;padding:12px;font-size:.85rem;color:var(--dim)">"Write 5 email subject lines for a Black Friday sale targeting existing customers. Product: online courses. Tone: urgent but not spammy."</div>
      </div>
    </div>
    <p style="font-size:.8rem;color:var(--purple);margin:12px 0 0;padding:10px;background:rgba(192,132,252,.06);border-radius:8px"><strong>Why it matters:</strong> AI doesn't have feelings. Hedging language adds noise and reduces clarity. Be direct.</p>
  </div>
</div>

<!-- MISTAKE 6 -->
<div class="lesson-section">
  <span class="section-label">Mistake 6</span>
  <h2 class="section-title">No examples of what "good" looks like.</h2>
  <p class="section-text">When you're trying to match a specific style, voice, or format — and you don't provide an example — the AI is guessing in the dark.</p>
  <p class="section-text"><strong>The fix:</strong> Paste a sample. "Write in a style similar to this: [example paragraph]." Even a 2-sentence example gives AI a target to aim at.</p>
</div>

<!-- MISTAKE 7 -->
<div class="lesson-section">
  <span class="section-label">Mistake 7</span>
  <h2 class="section-title">Treating AI like a search engine.</h2>
  <p class="section-text">AI isn't Google. It doesn't just retrieve information — it generates, analyzes, transforms, and creates. When you only ask "what is X?" you're using 5% of its capability.</p>
  <p class="section-text"><strong>The fix:</strong> Instead of "What is content marketing?" try "Create a 30-day content marketing plan for a new yoga studio targeting busy professionals. Include specific post ideas, platforms, and a posting schedule."</p>
</div>

<!-- MISTAKE 8 -->
<div class="lesson-section">
  <span class="section-label">Mistake 8</span>
  <h2 class="section-title">Ignoring what you already know.</h2>
  <p class="section-text">The biggest mistake isn't about prompting technique at all. It's not giving the AI your existing knowledge, drafts, data, or context.</p>
  <p class="section-text">You have a rough draft? <strong>Paste it.</strong> You have data? <strong>Include it.</strong> You have a style guide? <strong>Share it.</strong> You already know what's wrong with the last version? <strong>Say so.</strong></p>
  <p class="section-text">AI works best when it's building on something you've started — not creating from nothing.</p>
</div>

<!-- DIAGNOSTIC -->
<div class="lesson-section">
  <span class="section-label">Quick Diagnostic</span>
  <h2 class="section-title">When a prompt fails, ask yourself these 3 questions.</h2>
  <div class="demo-container" style="padding:1.5rem">
    <div style="display:flex;flex-direction:column;gap:12px">
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(251,146,60,.12);color:var(--orange);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0">1</div>
        <div style="color:var(--dim);font-size:.85rem"><strong>Did I tell it what I actually want?</strong> Not what topic, but what specific output — format, length, style, structure.</div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(251,146,60,.12);color:var(--orange);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0">2</div>
        <div style="color:var(--dim);font-size:.85rem"><strong>Did I give it enough context to succeed?</strong> Would a smart stranger be able to do this task with only the info in my prompt?</div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(251,146,60,.12);color:var(--orange);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0">3</div>
        <div style="color:var(--dim);font-size:.85rem"><strong>Did I tell it what NOT to do?</strong> The patterns I hate — the generic tone, the filler, the hedging — did I explicitly exclude them?</div>
      </div>
    </div>
  </div>
  <p class="section-text" style="margin-top:1rem">If the answer to any of these is "no," that's your fix. It's almost always that simple.</p>
</div>

<!-- NEXT LESSON -->
<div class="lesson-section" style="text-align:center;padding:2rem 0">
  <a href="/academy/prompt-writing-101/prompt-writing-assessment" style="display:inline-block;background:var(--orange);color:var(--bg);font-weight:700;padding:.75rem 2rem;border-radius:10px;text-decoration:none;font-size:.95rem">Next: Final Assessment →</a>
</div>

</div>
