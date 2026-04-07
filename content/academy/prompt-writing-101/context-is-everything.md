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

<div data-learn="FlashDeck" data-props='{"title":"The 6 Types of Context","cards":[{"front":"1. WHO — Your Identity\n\nWho are you in this situation?","back":"Your role, title, and expertise level. \"I am a marketing director at a B2B SaaS company\" changes everything about how AI writes for you.\n\nWithout it: AI defaults to generic, entry-level language."},{"front":"2. WHO — Your Audience\n\nWho will read/use the output?","back":"Their role, knowledge level, and what they care about. Writing for a CEO is radically different from writing for a junior developer.\n\nWithout it: AI writes for \"anyone\" — which means it resonates with no one."},{"front":"3. WHAT — The Situation\n\nWhat is happening? What led to this moment?","back":"Background info, previous conversations, constraints, deadlines, relationships. \"This is the 3rd email in a thread where the client is getting frustrated\" changes the entire tone.\n\nWithout it: AI treats every task as isolated and context-free."},{"front":"4. WHY — The Goal\n\nWhat outcome do you want from this?","back":"Not the task — the PURPOSE. \"I want them to approve the budget\" is different from \"I want them to feel confident in our team.\"\n\nWithout it: AI focuses on completing the task, not achieving your goal."},{"front":"5. HOW — Tone & Style\n\nHow should it sound?","back":"Formal, casual, urgent, empathetic, witty, authoritative. Describe it in human terms: \"like a friendly but sharp colleague\" works better than \"professional.\"\n\nWithout it: AI defaults to generic corporate speak."},{"front":"6. WHAT NOT — Boundaries\n\nWhat should AI avoid?","back":"Topics, phrases, tones, or approaches to steer clear of. \"Don\'t mention the competitor by name\" or \"Don\'t use buzzwords like synergy.\"\n\nWithout it: AI may include things that hurt more than help."}]}'></div>
</div>

<!-- SECTION 2B: BEFORE AND AFTER -->
<div class="lesson-section">
  <span class="section-label">Before &amp; After</span>
  <h2 class="section-title">Watch context transform real prompts.</h2>
  <p class="section-text">Each example below shows the same task — first without context, then with each context type layered in. Watch how the output would change at every step.</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Example 1 — Writing a LinkedIn Post</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#ef4444">NO CONTEXT:</span>
"Write a LinkedIn post about hiring."

<span style="color:#fb923c">+ WHO (Identity):</span>
"I'm a startup CEO who just grew from 5 to 20 people."

<span style="color:#8b5cf6">+ WHO (Audience):</span>
"My audience is other founders and engineering talent."

<span style="color:#38bdf8">+ WHAT (Situation):</span>
"We just closed our Series A and are hiring 8 engineers."

<span style="color:#34d399">+ WHY (Goal):</span>
"I want top engineers to DM me — not just like the post."

<span style="color:#fb923c">+ HOW (Tone):</span>
"Honest and vulnerable — not the typical 'we're hiring!' post."

<span style="color:#ef4444">+ WHAT NOT (Boundaries):</span>
"Don't list perks. Don't use 'excited to announce.' Don't
include a bulleted job description."</code></pre>
</div>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Example 2 — Asking for Career Advice</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#ef4444">NO CONTEXT:</span>
"Should I change jobs?"

<span style="color:#fb923c">+ WHO (Identity):</span>
"I'm a mid-level product manager, 4 years at my company."

<span style="color:#8b5cf6">+ WHO (Audience):</span>
"I'm asking for myself — I need an honest assessment."

<span style="color:#38bdf8">+ WHAT (Situation):</span>
"I got an offer for 30% more pay but it's at a later-stage
company. My current company might promote me in 6 months."

<span style="color:#34d399">+ WHY (Goal):</span>
"I want to maximize my career trajectory over 5 years,
not just next year's salary."

<span style="color:#fb923c">+ HOW (Tone):</span>
"Be direct. I can handle hard truths."

<span style="color:#ef4444">+ WHAT NOT (Boundaries):</span>
"Don't give me generic 'follow your passion' advice.
Give me a framework for making this decision."</code></pre>
</div>

  <p class="section-text">See the difference? Each layer of context removes another guess the AI would have to make. By the time you've included all six types, the AI is operating with almost the same information you have — and the output reflects that.</p>
</div>

<!-- SECTION 2C: CONTEXT TYPES CHEAT SHEET -->
<div class="lesson-section">
  <span class="section-label">Quick Reference</span>
  <h2 class="section-title">Context types at a glance.</h2>
  <p class="section-text">Bookmark this. Before writing any important prompt, scan this list and ask: which of these would change my output if I included it?</p>

  <div class="demo-container" style="padding:1.5rem">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div>
        <div style="font-size:.7rem;font-weight:700;color:#fb923c;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">High-Impact Context (include first)</div>
        <ul style="list-style:none;padding:0;margin:0;font-size:.85rem;color:#a1a1aa">
          <li style="padding:6px 0;border-bottom:1px solid rgba(255,255,255,.06)"><strong style="color:#e5e5e5">Audience</strong> — who reads this changes everything</li>
          <li style="padding:6px 0;border-bottom:1px solid rgba(255,255,255,.06)"><strong style="color:#e5e5e5">Goal</strong> — what outcome you actually want</li>
          <li style="padding:6px 0"><strong style="color:#e5e5e5">Situation</strong> — what led to this moment</li>
        </ul>
      </div>
      <div>
        <div style="font-size:.7rem;font-weight:700;color:#8b5cf6;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Refinement Context (add when needed)</div>
        <ul style="list-style:none;padding:0;margin:0;font-size:.85rem;color:#a1a1aa">
          <li style="padding:6px 0;border-bottom:1px solid rgba(255,255,255,.06)"><strong style="color:#e5e5e5">Your identity</strong> — your role and expertise level</li>
          <li style="padding:6px 0;border-bottom:1px solid rgba(255,255,255,.06)"><strong style="color:#e5e5e5">Tone/style</strong> — how the output should sound</li>
          <li style="padding:6px 0"><strong style="color:#e5e5e5">Boundaries</strong> — what to avoid or exclude</li>
        </ul>
      </div>
    </div>
  </div>

  <p class="section-text" style="margin-top:1rem"><strong>The 10-second context check:</strong> Before hitting send on any prompt, ask yourself — "If I gave this to a stranger with no knowledge of my situation, would they have enough information to do a great job?" If the answer is no, add more context. If the answer is yes, you're ready.</p>
</div>

<!-- SECTION 3: HOW MUCH -->
<div class="lesson-section">
  <span class="section-label">The Balance</span>
  <h2 class="section-title">How much context is the right amount?</h2>

<div data-learn="FlashDeck" data-props='{"title":"Too Little vs Just Right vs Too Much","cards":[{"front":"🔴 TOO LITTLE\n\n\"Write a social media post.\"","back":"What platform? What brand? What audience? What goal?\n\nThe AI has to guess EVERYTHING. You will get the most generic, forgettable post imaginable."},{"front":"🟢 JUST RIGHT\n\n\"Write an Instagram caption for our coffee shop new cold brew. Audience: 25-35 urban professionals. Tone: witty, casual. Include a CTA to visit this weekend. Under 150 characters.\"","back":"Platform, product, audience, tone, action, length — all specified.\n\nEvery detail removes a guess. The AI can focus on being creative within clear boundaries."},{"front":"🟠 TOO MUCH\n\n500 words of company history, every menu item, founding story, competitor analysis, brand guidelines...","back":"Context overload buries the actual ask. The AI gives equal weight to everything and loses focus on what matters.\n\nTHE RULE: Include context that would change the output if it were different. If swapping coffee shop for law firm would change the post — that context matters. If your 2015 founding story would not — leave it out."}]}'></div>

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

  <p class="section-text" style="margin-top:1.5rem"><strong>More briefing document ideas:</strong></p>
  <ul class="section-text" style="padding-left:1.5rem;margin-top:.5rem;margin-bottom:1rem">
    <li><strong>Personal brand brief</strong> — your voice, values, audience, and style for social media</li>
    <li><strong>Client brief</strong> — one per major client, with their preferences, history, and communication style</li>
    <li><strong>Product brief</strong> — features, differentiators, target market, and positioning for product-related tasks</li>
    <li><strong>Team communication brief</strong> — how your team likes to receive info, what format works, what to avoid</li>
  </ul>
  <p class="section-text">The more briefs you build, the faster every prompt becomes. Instead of spending 2 minutes writing context, you spend 5 seconds pasting it. That's the compound interest of good prompt engineering.</p>
</div>

<!-- SECTION 5: KNOWLEDGE CHECK -->
<div class="lesson-section">
  <span class="section-label">Knowledge Check</span>
  <h2 class="section-title">Test your context skills.</h2>

<div data-learn="QuizMC" data-props='{"title":"Context Mastery","questions":[{"q":"You are writing a prompt for a marketing email. Which context type is MOST likely to change the output dramatically?","options":["Your company founding year","Who the audience is and what they care about","Your office address","How many employees you have"],"correct":1,"explanation":"Audience is the single most impactful context type. An email to tech-savvy millennials vs retired professionals will be completely different in vocabulary, tone, and structure."},{"q":"What is the briefing document technique?","options":["Writing the longest possible prompt","Creating a reusable context block you paste at the start of related prompts","Sending the AI a separate document before your prompt","Asking the AI to brief you on a topic first"],"correct":1,"explanation":"A briefing document is a saved block of context (company info, voice, constraints) that you paste before your specific ask. It ensures consistency across all prompts for the same project."},{"q":"How do you decide if a piece of context is worth including?","options":["Include everything just to be safe","If removing it would change the output, include it","Only include context the AI specifically asks for","Keep context under 10 words total"],"correct":1,"explanation":"The test: would the output change if this context were different? If swapping coffee shop for law firm changes the result, that context matters. If your founding story would not change a social media caption, leave it out."}]}'></div>
</div>

<!-- SECTION 5B: CONTEXT MISTAKES -->
<div class="lesson-section">
  <span class="section-label">Common Traps</span>
  <h2 class="section-title">3 context mistakes that silently ruin output.</h2>
  <p class="section-text">Even people who understand context make these mistakes. Learn to spot them and your prompts will jump a level instantly.</p>

  <div class="demo-container" style="padding:1.5rem">
    <div style="display:flex;flex-direction:column;gap:12px">
      <div style="background:var(--bg);border:1px solid rgba(239,68,68,.2);border-radius:10px;padding:12px;font-size:.85rem;color:#a1a1aa;line-height:1.6">
        <strong style="color:#ef4444">Trap 1: Context without a goal.</strong> You give great background about your company, your product, your audience — but never say what you want the AI to DO with it. Context without a clear ask produces impressive-sounding output that doesn't serve any purpose.
      </div>
      <div style="background:var(--bg);border:1px solid rgba(251,146,60,.2);border-radius:10px;padding:12px;font-size:.85rem;color:#a1a1aa;line-height:1.6">
        <strong style="color:#fb923c">Trap 2: Stale context.</strong> You paste your company brief from 6 months ago, but your product has changed, your audience has shifted, and your messaging is different. The AI produces output that is technically correct but misaligned with where you are today. Update your briefs regularly.
      </div>
      <div style="background:var(--bg);border:1px solid rgba(139,92,246,.2);border-radius:10px;padding:12px;font-size:.85rem;color:#a1a1aa;line-height:1.6">
        <strong style="color:#8b5cf6">Trap 3: Context that contradicts itself.</strong> Your tone instruction says "casual and warm" but your negative constraints say "no contractions, no informal language." The AI tries to satisfy both and produces something awkward. Review your context for internal consistency before sending.
      </div>
    </div>
  </div>
</div>

<!-- NEXT LESSON -->
<div class="lesson-section" style="text-align:center;padding:2rem 0">
  <a href="/academy/prompt-writing-101/output-formats-that-work" style="display:inline-block;background:var(--orange);color:var(--bg);font-weight:700;padding:.75rem 2rem;border-radius:10px;text-decoration:none;font-size:.95rem">Next: Output Formats That Work →</a>
</div>

</div>