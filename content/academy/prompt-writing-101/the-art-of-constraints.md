---
title: "The Art of Constraints"
course: "prompt-writing-101"
order: 6
type: "lesson"
free: false
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

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Prompt — Constraint-Heavy Template</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">You are a seasoned brand copywriter.</span>

Write a product description for <span style="color:#4ade80">[product name]</span>.

<span style="color:#fb923c">[LENGTH CONSTRAINT]:</span>    <span style="color:#c084fc">Exactly 3 sentences. No more, no less.</span>
<span style="color:#fb923c">[TONE CONSTRAINT]:</span>     <span style="color:#c084fc">Confident, not arrogant. Warm, not sappy.</span>
<span style="color:#fb923c">[AUDIENCE CONSTRAINT]:</span> <span style="color:#c084fc">Written for <span style="color:#4ade80">[target buyer persona]</span>
                        who cares about <span style="color:#4ade80">[key value — e.g., sustainability]</span>.</span>
<span style="color:#fb923c">[SCOPE CONSTRAINT]:</span>    <span style="color:#c084fc">Focus ONLY on <span style="color:#4ade80">[one key benefit]</span>.
                        Do not mention features, specs, or price.</span>
<span style="color:#fb923c">[NEGATIVE CONSTRAINT]:</span> <span style="color:#c084fc">Do not use: "revolutionary," "game-changing,"
                        "best-in-class," or any superlatives.
                        Do not start with a question.
                        No exclamation marks.</span>
<span style="color:#fb923c">[FORMAT CONSTRAINT]:</span>   <span style="color:#c084fc">First sentence = hook. Second = value.
                        Third = one concrete proof point.</span></code></pre>
</div>

  <p class="section-text">Count the constraints in that template: six types working together. Length keeps it tight. Tone draws a precise emotional line. Audience focuses the language. Scope prevents feature-dumping. Negatives kill cliches. Format ensures structure. The AI has almost no room to produce anything generic.</p>
</div>

<!-- SECTION 2: 5 TYPES -->
<div class="lesson-section">
  <span class="section-label">The Types</span>
  <h2 class="section-title">5 types of constraints.</h2>

<div data-learn="FlashDeck" data-props='{"title":"5 Constraint Types — Flip to See Examples","cards":[{"front":"📏 1. LENGTH Constraints\n\nControl how much output you get.","back":"EXAMPLES:\n\n\"Exactly 3 sentences.\"\n\"Under 200 words.\"\n\"One paragraph, no more.\"\n\"5-7 bullet points.\"\n\nWHY: Without length constraints, AI defaults to exhaustive answers. Shorter is almost always better for usability."},{"front":"🎭 2. TONE Constraints\n\nControl how it sounds.","back":"EXAMPLES:\n\n\"Conversational but authoritative.\"\n\"Like a friendly mentor, not a professor.\"\n\"Confident, not arrogant. Warm, not sappy.\"\n\"Match the energy of a team standup, not a board meeting.\"\n\nWHY: \"Professional\" is too vague. Pairing a positive with a negative (confident, not arrogant) draws a precise emotional line."},{"front":"🎯 3. SCOPE Constraints\n\nControl what the output covers.","back":"EXAMPLES:\n\n\"Focus ONLY on pricing strategy. Ignore marketing.\"\n\"Cover the last 90 days, not the full year.\"\n\"Only discuss the technical implementation, not the business case.\"\n\"Address only the objections from enterprise buyers.\"\n\nWHY: Without scope, AI tries to be comprehensive. Comprehensive usually means shallow. Narrow scope = deeper value."},{"front":"👥 4. AUDIENCE Constraints\n\nControl who the output is written for.","back":"EXAMPLES:\n\n\"Written for a CFO who has 5 minutes to read this.\"\n\"Accessible to someone with no coding background.\"\n\"For an audience that already understands the basics — skip introductions.\"\n\"Written for a skeptic who has tried this approach before and it failed.\"\n\nWHY: The same information presented to a CEO vs an intern looks completely different. Audience shapes vocabulary, depth, and structure."},{"front":"🚫 5. NEGATIVE Constraints\n\nControl what the output must NOT include.","back":"EXAMPLES:\n\n\"Do not use the word \\\"delve\\\" or \\\"leverage.\\\"\"\n\"No preamble. No summary. Just the content.\"\n\"Do not hedge — commit to a recommendation.\"\n\"Avoid generic advice anyone could give.\"\n\"No exclamation marks. No emoji.\"\n\nWHY: Negative constraints directly target AI-isms. They are the fastest way to make output sound human."}]}'></div>

</div>

<!-- SECTION 2B: CONSTRAINT COMBINATIONS -->
<div class="lesson-section">
  <span class="section-label">Advanced</span>
  <h2 class="section-title">Stacking constraints for maximum impact.</h2>
  <p class="section-text">Individual constraints are useful. But the real power comes from combining them strategically. Here's how different constraint combinations serve different goals.</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Combination 1 — The "Executive Brief" Stack</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#fb923c">LENGTH:</span>    Under 150 words.
<span style="color:#8b5cf6">TONE:</span>     Direct. Lead with the conclusion.
<span style="color:#38bdf8">SCOPE:</span>    Only the three metrics that changed this quarter.
<span style="color:#34d399">AUDIENCE:</span> A CEO who reads 50 reports a week.
<span style="color:#ef4444">NEGATIVE:</span> No background. No methodology. No caveats.

<span style="color:#71717a">RESULT: A razor-sharp brief that respects the reader's time
and gets to the point in the first sentence.</span></code></pre>
</div>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Combination 2 — The "Human Voice" Stack</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#8b5cf6">TONE:</span>     Conversational. Like texting a smart friend.
<span style="color:#ef4444">NEGATIVE:</span> No buzzwords. No "in today's fast-paced world."
           No "it's important to note." No transition phrases
           like "furthermore" or "additionally."
<span style="color:#fb923c">LENGTH:</span>    Short paragraphs. Max 2 sentences each.
<span style="color:#38bdf8">SCOPE:</span>    One idea per paragraph.

<span style="color:#71717a">RESULT: Output that sounds like a person wrote it, not an AI.
The negative constraints do the heavy lifting by banning
the specific patterns that make AI writing feel robotic.</span></code></pre>
</div>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Combination 3 — The "Actionable Advice" Stack</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#38bdf8">SCOPE:</span>    Only advice I can implement this week with zero budget.
<span style="color:#34d399">AUDIENCE:</span> A solo founder with no team and no funding.
<span style="color:#ef4444">NEGATIVE:</span> No "it depends." No "consider hiring." No advice
           that requires tools I do not already have.
<span style="color:#8b5cf6">TONE:</span>     Like a mentor who has been in my shoes.
<span style="color:#fb923c">LENGTH:</span>    5 actions. One sentence each. No explanations unless
           the action is non-obvious.

<span style="color:#71717a">RESULT: Advice that is immediately useful, not theoretically
interesting. The scope + negative constraints filter out
everything that sounds wise but is actually useless.</span></code></pre>
</div>

  <p class="section-text">Notice how each stack tells a different story about what kind of output you want. The constraints work together like ingredients in a recipe — each one adds something the others cannot provide alone.</p>
</div>

<!-- SECTION 3: NEGATIVE CONSTRAINTS -->
<div class="lesson-section">
  <span class="section-label">The Secret Weapon</span>
  <h2 class="section-title">Negative constraints are your best friend.</h2>
  <p class="section-text">AI has patterns it falls into. You know them: the overly enthusiastic tone, the unnecessary preamble, the "great question!" response, the list that starts with "here are some..." AI-isms are the enemy of authentic output.</p>
  <p class="section-text">Negative constraints kill them instantly:</p>

<div data-learn="FlashDeck" data-props='{"title":"Negative Constraints That Work — Flip to See Why","cards":[{"front":"🚫 \"Do not start with Sure! or Great question! — just answer directly.\"","back":"WHY IT WORKS: AI defaults to sycophantic openers. This one constraint instantly makes output feel more professional and authentic. Use it in every prompt."},{"front":"🚫 \"Do not use the words delve, leverage, utilize, or synergy.\"","back":"WHY IT WORKS: These are the most overused AI words. Banning them forces the model to use simpler, more natural language. Your readers will never suspect AI wrote it."},{"front":"🚫 \"No preamble. No summary at the end. Just the content.\"","back":"WHY IT WORKS: AI loves to add \"Here is what I will cover...\" before and \"In summary...\" after the actual content. This constraint eliminates the fluff and gives you pure value."},{"front":"🚫 \"Do not hedge with it depends — commit to a recommendation.\"","back":"WHY IT WORKS: AI naturally hedges to seem balanced. But you asked for advice, not a debate. This forces a clear, actionable recommendation instead of wishy-washy on-one-hand analysis."},{"front":"🚫 \"Avoid generic advice anyone could give. Be specific to my situation.\"","back":"WHY IT WORKS: This is a meta-constraint — it tells AI to actually USE the context you provided instead of falling back on generic platitudes. Pair it with detailed context for maximum impact."}]}'></div>

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

<div data-learn="QuizMC" data-props='{"title":"Constraint Mastery","questions":[{"q":"Why do constraints IMPROVE AI output instead of limiting it?","options":["They make the AI work harder","They eliminate mediocre possibilities and focus the output space","They trick the AI into trying harder","They do not improve output — they just make it shorter"],"correct":1,"explanation":"Constraints narrow the infinite space of possible outputs into a focused zone where quality is higher. Like giving a songwriter a specific form to work within — the boundaries enable creativity."},{"q":"Which type of constraint is MOST effective at eliminating generic AI-sounding output?","options":["Length constraints","Scope constraints","Negative constraints (what NOT to do)","Audience constraints"],"correct":2,"explanation":"Negative constraints directly target AI-isms — the buzzwords, preambles, hedging, and sycophantic openers that make output feel robotic. Banning specific patterns forces more authentic language."},{"q":"What is the invisible guardrail technique?","options":["Hiding constraints inside the context section","Pairing positive tone instructions with negative boundaries (confident, not arrogant)","Setting constraints the AI cannot see","Using only negative constraints with no positive direction"],"correct":1,"explanation":"The invisible guardrail pairs what you want with what you do not want. Confident, not arrogant draws a precise line that professional tone alone cannot achieve."}]}'></div>

</div>

<!-- SECTION 4B: CONSTRAINT PRACTICE -->
<div class="lesson-section">
  <span class="section-label">Practice</span>
  <h2 class="section-title">Build constraint sets for real tasks.</h2>
  <p class="section-text">The best way to get comfortable with constraints is to practice building them for tasks you actually do. Here are three common scenarios with the constraint sets that would transform the output.</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Scenario — Weekly Team Update Email</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#fb923c">LENGTH:</span>    Under 100 words. If it cannot be said briefly, it is
           not right for a weekly update.
<span style="color:#8b5cf6">TONE:</span>     Encouraging but honest. Celebrate wins AND name
           challenges without sugarcoating.
<span style="color:#38bdf8">SCOPE:</span>    This week's top 3 accomplishments, 1 challenge,
           and next week's priority. Nothing else.
<span style="color:#ef4444">NEGATIVE:</span> No "I hope this email finds you well." No bullet
           points longer than one line. No passive voice.</code></pre>
</div>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Scenario — LinkedIn Post About a New Feature</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#fb923c">LENGTH:</span>    Under 150 words. Hook in the first line.
<span style="color:#8b5cf6">TONE:</span>     Excited but not salesy. Show, do not tell.
<span style="color:#34d399">AUDIENCE:</span> Product managers and engineering leaders who have
           this exact problem.
<span style="color:#38bdf8">SCOPE:</span>    ONE feature, ONE problem it solves, ONE result.
<span style="color:#ef4444">NEGATIVE:</span> No "excited to announce." No emoji. No hashtag
           spam. No "link in comments." Do not start with
           "We just launched" — start with the problem.</code></pre>
</div>

  <p class="section-text">Notice how the negative constraints in each scenario target the most common bad patterns for that specific format. LinkedIn posts have different AI-isms than emails. Your negative constraints should be specific to the format you're working with.</p>

  <p class="section-text" style="margin-top:1rem"><strong>Your constraint starter kit:</strong> Copy these negative constraints and keep them handy. They work in almost any prompt:</p>
  <ul class="section-text" style="padding-left:1.5rem;margin-top:.5rem;margin-bottom:1rem">
    <li>"Do not start with Sure! or Great question! — just answer directly."</li>
    <li>"No preamble. No summary at the end. Just the content."</li>
    <li>"Do not use the words delve, leverage, utilize, or synergy."</li>
    <li>"No hedging. Commit to a recommendation."</li>
    <li>"Avoid generic advice anyone could give. Be specific to my situation."</li>
  </ul>
  <p class="section-text">Add just two or three of these to your next prompt and compare the output to what you usually get. The difference is immediate and dramatic.</p>
</div>

<!-- NEXT LESSON -->
<div class="lesson-section" style="text-align:center;padding:2rem 0">
  <a href="/academy/prompt-writing-101/iteration-and-refinement" style="display:inline-block;background:var(--orange);color:var(--bg);font-weight:700;padding:.75rem 2rem;border-radius:10px;text-decoration:none;font-size:.95rem">Next: Iteration and Refinement →</a>
</div>

</div>