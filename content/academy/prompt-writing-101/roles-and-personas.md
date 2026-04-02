---
title: "Roles and Personas"
course: "prompt-writing-101"
order: 3
type: "lesson"
free: true
---<div class="wrap">

<nav class="local-nav">
  <a href="/academy/prompt-writing-101/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 3 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Roles and <span class="accent">Personas.</span></h1>
  <p class="sub">Tell AI who to be and it becomes an expert on demand. The secret weapon most people never use.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>Why role-setting dramatically changes AI output quality</li>
    <li>How to write effective role descriptions in one sentence</li>
    <li>10 powerful roles you can use immediately</li>
    <li>When NOT to assign a role</li>
  </ul>
</div>

<!-- SECTION 1: WHY ROLES WORK -->
<div class="lesson-section">
  <span class="section-label">The Psychology</span>
  <h2 class="section-title">Why "You are a..." changes everything.</h2>
  <p class="section-text">When you tell AI "You are a senior marketing strategist with 15 years of experience in B2B SaaS," something shifts. The vocabulary changes. The suggestions become more specific. The advice carries the weight of implied experience.</p>
  <p class="section-text">This isn't magic — it's pattern matching. AI has learned from millions of texts written by experts in every field. When you set a role, you're telling it: "Draw from <em>that</em> pool of knowledge. Use <em>that</em> vocabulary. Think at <em>that</em> level."</p>
  <p class="section-text">Without a role, AI defaults to "helpful general assistant." That's fine for quick questions. But for anything that requires expertise, you're leaving quality on the table.</p>
</div>

<!-- SECTION 2: ANATOMY OF A GOOD ROLE -->
<div class="lesson-section">
  <span class="section-label">The Structure</span>
  <h2 class="section-title">The 3 elements of an effective role.</h2>
  <p class="section-text">A great role assignment has three parts:</p>
<div class="demo-container" style="padding:1.5rem;margin-top:1rem">
    <div style="font-size:.7rem;font-weight:700;color:var(--green);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Formula</div>
    <div style="background:var(--bg);border:1px solid rgba(74,222,128,.2);border-radius:10px;padding:12px;font-size:.9rem;color:var(--text);line-height:1.6;font-weight:600">"You are a <span style="color:var(--orange)">[senior/expert]</span> <span style="color:var(--purple)">[title]</span> who specializes in <span style="color:var(--green)">[niche]</span>."</div>
  </div>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Prompt — Role-Based Expert Template</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#fb923c">[ROLE]:</span> <span style="color:#c084fc">You are a senior <span style="color:#4ade80">[job title]</span> with <span style="color:#4ade80">[X years]</span>
of experience specializing in <span style="color:#4ade80">[niche/industry]</span>.</span>

<span style="color:#fb923c">[AUDIENCE]:</span> <span style="color:#c084fc">You are advising <span style="color:#4ade80">[who — e.g., a first-time founder]</span>
who needs <span style="color:#4ade80">[what — e.g., help pricing their SaaS product]</span>.</span>

<span style="color:#fb923c">[TASK]:</span> <span style="color:#4ade80">[The specific thing you need them to do]</span>

<span style="color:#fb923c">[VOICE]:</span> <span style="color:#c084fc">Speak like you would to a paying client —
direct, specific, no filler. Back up every recommendation
with a reason.</span></code></pre>
</div>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Prompt — Example: Role in Action</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">You are a senior UX researcher with 12 years of experience
specializing in mobile e-commerce apps.</span>

I am redesigning the checkout flow for my <span style="color:#4ade80">[app name]</span>.
Current conversion rate is <span style="color:#4ade80">[X%]</span> and the main drop-off
happens at <span style="color:#4ade80">[step — e.g., the payment info screen]</span>.

<span style="color:#fb923c">Task:</span> <span style="color:#c084fc">Audit my current flow and give me 5 specific changes
ranked by expected impact on conversion. For each change,
explain WHY it works psychologically.</span>

<span style="color:#fb923c">Format:</span> <span style="color:#c084fc">Numbered list. Each item: the change, the reason,
and one real-world app that does this well.</span></code></pre>
</div>

</div>

<!-- SECTION 2B: PERSONA EXAMPLES -->
<div class="lesson-section">
  <span class="section-label">In Practice</span>
  <h2 class="section-title">5 role-based prompts you can steal.</h2>
  <p class="section-text">Seeing roles in full prompts is more useful than learning them in isolation. Here are five complete examples showing how the role shapes everything that follows.</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Role Example 1 — The Negotiation Coach</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#8b5cf6">You are a salary negotiation coach who has helped 200+
professionals negotiate raises averaging 18% increases.</span>

I just received a job offer for $95K. My research shows
the market range is $100K-$120K for this role in my city.
I have 6 years of experience and a competing offer at $105K.

Give me:
1. An exact script for the counter-offer conversation
2. Three phrases to use if they push back
3. One thing to NEVER say during salary negotiation
4. How to handle "that's our final offer"</code></pre>
</div>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Role Example 2 — The Empathetic Teacher</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#8b5cf6">You are a patient computer science teacher who explains
technical concepts using everyday analogies. Your students
are business professionals with no coding background.</span>

Explain how APIs work. Use an analogy involving a restaurant
(waiter = API, kitchen = server, menu = documentation).

Keep it under 200 words. End with one sentence on why a
non-technical person should care about APIs.</code></pre>
</div>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Role Example 3 — The Devil's Advocate</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#8b5cf6">You are a skeptical investor who has seen 500 startup
pitches this year. You are hard to impress and you ask
the questions founders do not want to hear.</span>

Here is my startup idea: [paste your pitch]

Poke holes in it. Give me:
1. The 3 biggest risks I am probably ignoring
2. The question a VC would ask that I am not prepared for
3. What would need to be true for this to be a $100M company
4. One thing that is actually strong about this idea

Be brutally honest. I can take it.</code></pre>
</div>

  <p class="section-text">Notice how each role doesn't just set expertise — it sets a <strong>posture</strong>. The negotiation coach is encouraging. The teacher is patient. The devil's advocate is skeptical. The posture shapes the entire response more than any other instruction could.</p>
</div>

<!-- SECTION 2C: ROLE PATTERNS -->
<div class="lesson-section">
  <span class="section-label">Patterns</span>
  <h2 class="section-title">3 role patterns for different situations.</h2>
  <p class="section-text">Not all roles work the same way. Here are three patterns you can use depending on what kind of output you need.</p>

  <div class="demo-container" style="padding:1.5rem">
    <div style="display:flex;flex-direction:column;gap:16px">
      <div>
        <div style="font-size:.7rem;font-weight:700;color:#34d399;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px">Pattern 1: The Expert Advisor</div>
        <div style="background:var(--bg);border:1px solid rgba(74,222,128,.2);border-radius:10px;padding:12px;font-size:.85rem;color:#a1a1aa;line-height:1.6"><strong style="color:#e5e5e5">When to use:</strong> You need deep, specialized knowledge on a specific topic.<br><strong style="color:#e5e5e5">Formula:</strong> "You are a [senior/veteran] [title] with [X years] experience in [niche]."<br><strong style="color:#e5e5e5">Example:</strong> "You are a veteran tax accountant who specializes in small business deductions."<br><strong style="color:#a1a1aa">This pattern works because it accesses the most specific knowledge pool in the AI's training data.</strong></div>
      </div>
      <div>
        <div style="font-size:.7rem;font-weight:700;color:#8b5cf6;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px">Pattern 2: The Peer Reviewer</div>
        <div style="background:var(--bg);border:1px solid rgba(139,92,246,.2);border-radius:10px;padding:12px;font-size:.85rem;color:#a1a1aa;line-height:1.6"><strong style="color:#e5e5e5">When to use:</strong> You need honest feedback on something you've created.<br><strong style="color:#e5e5e5">Formula:</strong> "You are a [role] reviewing my work. Be [critical/honest/thorough]."<br><strong style="color:#e5e5e5">Example:</strong> "You are a senior editor at The Atlantic reviewing my draft article. Be candid about what doesn't work."<br><strong style="color:#a1a1aa">This pattern works because it gives AI permission to be critical, which it normally avoids.</strong></div>
      </div>
      <div>
        <div style="font-size:.7rem;font-weight:700;color:#fb923c;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px">Pattern 3: The Audience Simulator</div>
        <div style="background:var(--bg);border:1px solid rgba(251,146,60,.2);border-radius:10px;padding:12px;font-size:.85rem;color:#a1a1aa;line-height:1.6"><strong style="color:#e5e5e5">When to use:</strong> You want to test how someone specific would react to your work.<br><strong style="color:#e5e5e5">Formula:</strong> "You are a [target audience member]. React to this [content] as you naturally would."<br><strong style="color:#e5e5e5">Example:</strong> "You are a busy parent scrolling Instagram at 9pm. Read this ad and tell me if you'd stop scrolling."<br><strong style="color:#a1a1aa">This pattern works because it simulates real-world reception before you publish.</strong></div>
      </div>
    </div>
  </div>
</div>

<!-- SECTION 3: MATCH ROLES -->
<div class="lesson-section">
  <span class="section-label">Practice</span>
  <h2 class="section-title">Match the task to the best role.</h2>

<div data-learn="QuizMC" data-props='{"title":"Role Matching","questions":[{"q":"You need to review a legal contract for your freelance business. Which role?","options":["You are a creative director.","You are a contracts attorney specializing in freelance service agreements.","You are a helpful assistant.","You are an experienced teacher."],"correct":1,"explanation":"The contracts attorney role accesses legal expertise AND the freelance specialization ensures relevant advice rather than generic corporate law."},{"q":"You want honest feedback on whether your startup pitch is convincing. Which role pattern?","options":["Expert Advisor","Peer Reviewer","Audience Simulator","No role needed"],"correct":1,"explanation":"The Peer Reviewer pattern gives AI permission to be critical. An Expert Advisor would give advice; a Peer Reviewer will tell you what doesn't work."},{"q":"You want to know if your landing page copy would convince a skeptical enterprise buyer. Which role pattern?","options":["Expert Advisor","Peer Reviewer","Audience Simulator","No role needed"],"correct":2,"explanation":"The Audience Simulator lets you test your copy against the exact person you're trying to reach. \"You are a VP of IT at a Fortune 500 company evaluating our landing page\" gives you real-world perspective."}]}'></div>

</div>

<!-- SECTION 4: 10 POWER ROLES -->
<div class="lesson-section">
  <span class="section-label">Steal These</span>
  <h2 class="section-title">10 roles that instantly upgrade your prompts.</h2>

<div data-learn="FlashDeck" data-props='{"title":"10 Power Roles — Flip to See the Full Prompt","cards":[{"front":"✍️ Writing\n\nNeed polished, publication-ready text","back":"\"You are a professional editor at a major publishing house.\"\n\nUse when: blog posts, articles, marketing copy, anything that needs to read beautifully."},{"front":"📊 Strategy\n\nNeed high-level business thinking","back":"\"You are a McKinsey-trained management consultant.\"\n\nUse when: business plans, competitive analysis, strategic decisions."},{"front":"📈 Marketing\n\nNeed growth-focused content","back":"\"You are a growth marketer who has scaled 3 startups past $10M ARR.\"\n\nUse when: campaigns, funnels, conversion optimization, social media strategy."},{"front":"⚖️ Legal\n\nNeed contract or policy review","back":"\"You are a contracts attorney specializing in SaaS agreements.\"\n\nUse when: reviewing terms, writing policies, understanding legal implications."},{"front":"🎓 Teaching\n\nNeed complex ideas explained simply","back":"\"You are a patient teacher who explains complex topics using everyday analogies.\"\n\nUse when: learning new concepts, creating training materials, explaining to non-experts."},{"front":"🔬 Analysis\n\nNeed data interpreted clearly","back":"\"You are a data analyst who presents findings to non-technical executives.\"\n\nUse when: interpreting data, building reports, making data-driven recommendations."},{"front":"💼 Career\n\nNeed professional development help","back":"\"You are a career coach who has helped 500+ professionals negotiate raises.\"\n\nUse when: resumes, interview prep, salary negotiation, career transitions."},{"front":"💻 Technical\n\nNeed clean, working code","back":"\"You are a senior software engineer who writes clean, well-documented code.\"\n\nUse when: coding, debugging, architecture decisions, code reviews."},{"front":"🎨 Creative\n\nNeed bold, original ideas","back":"\"You are a creative director at a top-10 advertising agency.\"\n\nUse when: brainstorming, naming, branding, creative campaigns."},{"front":"🔍 Critical\n\nNeed honest, unflinching feedback","back":"\"You are a skeptical investigative journalist. Challenge every claim.\"\n\nUse when: fact-checking, finding holes in arguments, stress-testing ideas."}]}'></div>

</div>

<!-- SECTION 5: WHEN NOT TO -->
<div class="lesson-section">
  <span class="section-label">The Exception</span>
  <h2 class="section-title">When to skip the role.</h2>
  <p class="section-text">Not every prompt needs a role. Skip it when:</p>
  <ul class="section-text" style="padding-left:1.5rem;margin-top:.5rem;margin-bottom:1rem">
    <li><strong>Quick factual questions</strong> — "What's the capital of Norway?" doesn't need a role.</li>
    <li><strong>Simple transformations</strong> — "Translate this to Spanish" works fine without one.</li>
    <li><strong>You want multiple perspectives</strong> — Sometimes a neutral AI gives a more balanced view.</li>
    <li><strong>The role would be artificial</strong> — Don't force it. "You are an email-writing expert" is just noise.</li>
  </ul>

<div data-learn="QuizMC" data-props='{"title":"Role Mastery Check","questions":[{"q":"Which of these prompts would benefit MOST from adding a role?","options":["\"Translate this paragraph to French.\"","\"What year was the Eiffel Tower built?\"","\"Write a proposal to convince my CEO to invest in AI training for our sales team.\"","\"Convert 50 miles to kilometers.\""],"correct":2,"explanation":"The proposal needs a specific perspective and expertise level. Adding a role like senior business strategist or sales enablement consultant would dramatically improve the output. The other tasks are simple enough that a role adds no value."},{"q":"What makes a role assignment effective?","options":["Making it as long and detailed as possible","Including a title, experience level, and specialization","Always using the exact phrase You are a...","Picking the most impressive-sounding job title"],"correct":1,"explanation":"The three elements — title, experience, and specialization — give the AI a precise persona to draw from. You are a senior copywriter who specializes in B2B SaaS is better than You are a writing expert."}]}'></div>

</div>

<!-- NEXT LESSON -->
<div class="lesson-section" style="text-align:center;padding:2rem 0">
  <a href="/academy/prompt-writing-101/context-is-everything" style="display:inline-block;background:var(--orange);color:var(--bg);font-weight:700;padding:.75rem 2rem;border-radius:10px;text-decoration:none;font-size:.95rem">Next: Context Is Everything →</a>
</div>

</div>