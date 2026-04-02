---
title: "Your First Conversation"
course: "claude-for-beginners"
order: 2
type: "lesson"
free: true
css: "claude-beginners.css"
---<div class="wrap">

<nav class="local-nav">
  <a href="/academy/claude-for-beginners/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 2 of 9</span>
</nav>

<div class="lesson-hero">
  <h1>Your First <span class="accent">Conversation.</span></h1>
  <p class="sub">The difference between getting junk from AI and getting gold comes down to how you talk to it. Let's practice.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>The 3-part prompt formula that works every time</li>
    <li>Why vague prompts get vague answers</li>
    <li>How to give Claude context, role, and format</li>
    <li>5 real prompts you can steal for your job</li>
  </ul>
</div>

<!-- SECTION 1: THE FORMULA -->
<div class="lesson-section">
  <span class="section-label">The Secret</span>
  <h2 class="section-title">The 3-part prompt formula.</h2>
  <p class="section-text">Most people type something vague and get disappointed. "Write me an email." "Help me with this." That's like walking into a restaurant and saying "give me food." You'll get <em>something</em>, but it probably won't be what you wanted.</p>
  <p class="section-text">Great prompts have three parts:</p>

  <div class="demo-container" style="padding:1.75rem">
    <div style="display:flex;flex-direction:column;gap:16px">
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(251,146,60,.12);color:var(--orange);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0;margin-top:2px">1</div>
        <div>
          <div style="font-weight:700;font-size:.95rem;margin-bottom:2px">Role</div>
          <div style="color:var(--dim);font-size:.85rem">Tell Claude WHO it should be. "You are an experienced project manager" or "Act as a professional editor."</div>
        </div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(192,132,252,.12);color:var(--purple);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0;margin-top:2px">2</div>
        <div>
          <div style="font-weight:700;font-size:.95rem;margin-bottom:2px">Context</div>
          <div style="color:var(--dim);font-size:.85rem">Give Claude the SITUATION. Background info, constraints, who it's for, what you've tried.</div>
        </div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(74,222,128,.12);color:var(--green);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0;margin-top:2px">3</div>
        <div>
          <div style="font-weight:700;font-size:.95rem;margin-bottom:2px">Format</div>
          <div style="color:var(--dim);font-size:.85rem">Tell Claude WHAT you want back. "Give me 5 bullet points" or "Write a 3-paragraph email" or "Create a table comparing options."</div>
        </div>
      </div>
    </div>
  </div>

  <p class="section-text">Here's the formula in action — a complete prompt you can copy and customize:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Prompt — The 3-Part Formula in action</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#fb923c">[ROLE]</span> You are an experienced project manager.

<span style="color:#c084fc">[CONTEXT]</span> My team of 6 just missed a deadline by 2
weeks. The client is frustrated but not angry yet.
I need to send an update email today.

<span style="color:#4ade80">[FORMAT]</span> Write a 4-sentence email. Acknowledge the
delay, explain briefly, give the new timeline, and
end with one concrete action we are taking to
prevent this from happening again.</code></pre>
</div>

  <p class="section-text">Now put the formula parts in the right order:</p>

<div data-learn="SortStack" data-props='{"title":"Order the Prompt Formula","instruction":"Drag these into the correct order for building a great prompt","items":["Role — Tell Claude who to be","Context — Give the situation and details","Format — Specify what you want back"]}'></div>

</div>

<!-- SECTION 2: BAD VS GOOD -->
<div class="lesson-section">
  <span class="section-label">See The Difference</span>
  <h2 class="section-title">Vague vs specific — side by side.</h2>

<div data-learn="FlashDeck" data-props='{"title":"Vague vs Specific Prompts","cards":[{"front":"❌ VAGUE\n\n\"Write me an email to my team about the project.\"","back":"✅ SPECIFIC\n\n\"You are a friendly but professional team lead. Write a 4-sentence email to my team of 8 letting them know the website redesign deadline is moving from Friday to next Wednesday. Encouraging, not apologetic. End with one action item.\"\n\nThe vague prompt has no role, no context, no format. Claude has to guess everything."},{"front":"❌ VAGUE\n\n\"Help me with my presentation.\"","back":"✅ SPECIFIC\n\n\"You are a presentation coach. I am presenting our Q3 sales results to the executive team tomorrow. Create 5 slide titles with 3 bullet points each. Focus on the 12% revenue growth and what drove it. Professional tone.\"\n\nRole + Context + Format = Claude nails it every time."},{"front":"❌ VAGUE\n\n\"Summarize this document.\"","back":"✅ SPECIFIC\n\n\"You are an executive assistant. Summarize this 20-page quarterly report into 5 bullet points for my CEO. Focus on: what changed, what needs attention, and any risks. Each bullet should be one sentence.\"\n\nThe more specific you are, the less work you do editing afterward."}]}'></div>

</div>

<!-- SECTION 3: PRACTICE BUILDER -->
<div class="lesson-section">
  <span class="section-label">Your Turn</span>
  <h2 class="section-title">Build a prompt using the formula.</h2>
  <p class="section-text">Use the builder below to construct a prompt. Pick a role, add your context, choose a format. Then copy it and try it in <a href="https://claude.ai" target="_blank" style="color:var(--purple)">Claude</a>.</p>

  <div data-learn="PromptBuilder" data-props='{}'></div>
</div>

<!-- SECTION 4: STEAL THESE -->
<div class="lesson-section">
  <span class="section-label">Steal These</span>
  <h2 class="section-title">5 prompts you can use today.</h2>
  <p class="section-text">Flip each card to see the full prompt. Copy and paste into Claude, then customize for your situation.</p>

<div data-learn="FlashDeck" data-props='{"title":"Copy-Paste Prompt Library","cards":[{"front":"📋 Meeting Notes → Action Items\n\nTurn messy meeting notes into a clear checklist in seconds.","back":"PROMPT:\n\nHere are my meeting notes: [paste notes]. Extract all action items, who is responsible, and deadlines. Format as a checklist I can paste into Slack."},{"front":"💌 Professional Reply\n\nCraft the perfect response to any email — fast.","back":"PROMPT:\n\nI received this email: [paste email]. Write a professional reply that [agrees/declines/asks for more info]. Match a warm but professional tone. Keep it under 100 words."},{"front":"🧠 Explain Like I Am New\n\nMake any complex topic simple and clear.","back":"PROMPT:\n\nExplain [complex topic] to someone who has never encountered it before. Use an everyday analogy. Keep it to 3 sentences."},{"front":"📊 Weekly Report\n\nTurn a list of tasks into a polished status update.","back":"PROMPT:\n\nHere is what I worked on this week: [list tasks]. Write a weekly status report for my manager. Include: what was completed, what is in progress, any blockers, and plan for next week. Professional but not stuffy."},{"front":"⚖️ Decision Helper\n\nGet a clear pros/cons analysis for any choice.","back":"PROMPT:\n\nI am deciding between [option A] and [option B]. Here is my situation: [context]. Create a pros/cons table for each option, then give me your recommendation with reasoning."}]}'></div>

</div>


</div>

<!-- KEY TAKEAWAY -->
<div class="callout purple">
  <p><strong>The key insight:</strong> You don't need to be a "prompt engineer." You just need to tell Claude three things: <strong>who to be, what the situation is, and what format you want.</strong> That's it. The rest is just practice.</p>
</div>

<!-- LESSON CHECK -->
<div class="lesson-section">
  <span class="section-label">Quick Check</span>
  <h2 class="section-title">Lock it in.</h2>

<div data-learn="QuizMC" data-props='{"questions":[{"q":"What are the 3 parts of a great prompt?","options":["Question, Answer, Follow-up","Role, Context, Format","Introduction, Body, Conclusion","Who, What, When"],"correct":1,"explanation":"The 3-part formula is Role (who Claude should be), Context (the situation), and Format (what you want back). This works every time."},{"q":"Which prompt will get a better result?","options":["Write me an email about the project.","Help me with something at work.","You are a professional editor. Rewrite this paragraph for my company blog. Keep it under 80 words, conversational tone.","Can you do emails?"],"correct":2,"explanation":"The specific prompt has all three parts: Role (professional editor), Context (paragraph for company blog), and Format (under 80 words, conversational). The others are vague and force Claude to guess."}]}'></div>

</div>

<div data-learn="LessonComplete" data-props='{"courseSlug":"claude-for-beginners","lessonNum":2}'></div>

</div>
