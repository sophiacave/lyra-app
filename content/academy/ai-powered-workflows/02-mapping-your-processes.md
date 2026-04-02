---
title: "Mapping Your Processes"
course: "ai-powered-workflows"
order: 2
type: "lesson"
free: true
---

<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-powered-workflows/">← Back to Course</a>
  <span class="badge">Lesson 2 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Mapping Your <span class="accent">Processes</span></h1>
  <p class="subtitle">You can't automate what you can't see. Let's make the invisible visible.</p>
</div>

<div class="learn-card">
  <h3>What You'll Learn</h3>
  <ul>
    <li>How to document a process without overcomplicating it</li>
    <li>The input-action-output framework for any task</li>
    <li>How to score processes for automation potential</li>
    <li>Building your first process map</li>
  </ul>
</div>

<div class="lesson-section">
  <span class="section-label">Foundation</span>
  <h2 class="section-title">The Input-Action-Output Framework</h2>
  <p class="section-text">Every process, no matter how complex, breaks down into three parts: something comes in (input), something happens to it (action), and something comes out (output). An invoice arrives, you verify the numbers, you approve it. A customer asks a question, you find the answer, you send a reply.</p>
  <p class="section-text">When you map a process this way, automation opportunities jump out at you. Any step where the action is predictable and the rules are clear? That's automatable.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Method</span>
  <h2 class="section-title">The 5-Step Process Audit</h2>
  <p class="section-text"><strong style="color: var(--orange);">Step 1:</strong> Pick one process you do at least weekly.</p>
  <p class="section-text"><strong style="color: var(--orange);">Step 2:</strong> Write down every single step, even the ones that feel obvious. "Open email" counts. "Click the link" counts.</p>
  <p class="section-text"><strong style="color: var(--orange);">Step 3:</strong> Mark each step as either <em>decision</em> (requires judgment) or <em>mechanical</em> (same every time).</p>
  <p class="section-text"><strong style="color: var(--orange);">Step 4:</strong> Note where data moves between tools — email to spreadsheet, form to database, chat to task board.</p>
  <p class="section-text"><strong style="color: var(--orange);">Step 5:</strong> Score the process: frequency (daily/weekly/monthly) × time per run × number of mechanical steps. Higher score = higher automation priority.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Example</span>
  <h2 class="section-title">Mapping a Real Process</h2>

  <div class="demo-container">
    <p><strong style="color: var(--purple);">Process:</strong> Weekly client report</p>
    <p><strong>Steps:</strong></p>
    <p>1. Pull analytics data from dashboard (mechanical)</p>
    <p>2. Copy numbers into spreadsheet template (mechanical)</p>
    <p>3. Write summary paragraph (decision — AI can assist)</p>
    <p>4. Add client-specific notes (decision)</p>
    <p>5. Export as PDF (mechanical)</p>
    <p>6. Email to client (mechanical)</p>
    <p><strong style="color: var(--green);">Result:</strong> 4 of 6 steps are fully automatable. Step 3 is AI-assistable. Only step 4 truly needs you.</p>
  </div>
</div>

<div class="lesson-section">
  <span class="section-label">Common Traps</span>
  <h2 class="section-title">What People Get Wrong</h2>
  <p class="section-text">The biggest mistake is trying to automate your most complex process first. Start with the boring stuff — the processes so routine you could do them half asleep. Those are the ones where automation delivers immediate, obvious value and teaches you the fundamentals without high stakes.</p>
  <p class="section-text">The second trap: skipping the map entirely and jumping to tools. Tools change. Your understanding of your own processes is forever.</p>
</div>

<div class="try-it-box">
  <h3>Try It Now</h3>
  <p>Map one of your weekly processes using the Input-Action-Output framework.</p>
  <div class="prompt-box">
    <code>Pick a task you do every week. List every step from start to finish. For each step, write: [Input] → [Action] → [Output] and mark it as "mechanical" or "decision."</code>
  </div>
</div>

<div class="lesson-section">
  <span class="section-label">The Code</span>
  <h2 class="section-title">Process mapping as a data structure.</h2>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Python — score processes to find the best automation targets</div>
<pre style="margin:0;color:#e5e5e5"><code>processes = [
    {
        <span style="color:#fbbf24">"name"</span>: <span style="color:#fbbf24">"Weekly client report"</span>,
        <span style="color:#fbbf24">"frequency_per_week"</span>: <span style="color:#fb923c">5</span>,
        <span style="color:#fbbf24">"minutes_per_run"</span>: <span style="color:#fb923c">45</span>,
        <span style="color:#fbbf24">"steps"</span>: [
            {<span style="color:#fbbf24">"action"</span>: <span style="color:#fbbf24">"Pull data from analytics"</span>, <span style="color:#fbbf24">"type"</span>: <span style="color:#fbbf24">"mechanical"</span>},
            {<span style="color:#fbbf24">"action"</span>: <span style="color:#fbbf24">"Copy to report template"</span>, <span style="color:#fbbf24">"type"</span>: <span style="color:#fbbf24">"mechanical"</span>},
            {<span style="color:#fbbf24">"action"</span>: <span style="color:#fbbf24">"Write executive summary"</span>, <span style="color:#fbbf24">"type"</span>: <span style="color:#fbbf24">"decision"</span>},
            {<span style="color:#fbbf24">"action"</span>: <span style="color:#fbbf24">"Add client-specific notes"</span>, <span style="color:#fbbf24">"type"</span>: <span style="color:#fbbf24">"decision"</span>},
            {<span style="color:#fbbf24">"action"</span>: <span style="color:#fbbf24">"Export as PDF"</span>, <span style="color:#fbbf24">"type"</span>: <span style="color:#fbbf24">"mechanical"</span>},
            {<span style="color:#fbbf24">"action"</span>: <span style="color:#fbbf24">"Email to client"</span>, <span style="color:#fbbf24">"type"</span>: <span style="color:#fbbf24">"mechanical"</span>},
        ]
    },
]

<span style="color:#71717a"># Score each process: higher = automate first</span>
<span style="color:#c084fc">for</span> p <span style="color:#c084fc">in</span> processes:
    mechanical = sum(<span style="color:#fb923c">1</span> <span style="color:#c084fc">for</span> s <span style="color:#c084fc">in</span> p[<span style="color:#fbbf24">"steps"</span>] <span style="color:#c084fc">if</span> s[<span style="color:#fbbf24">"type"</span>] == <span style="color:#fbbf24">"mechanical"</span>)
    score = p[<span style="color:#fbbf24">"frequency_per_week"</span>] * p[<span style="color:#fbbf24">"minutes_per_run"</span>] * mechanical
    hours_saved = (p[<span style="color:#fbbf24">"frequency_per_week"</span>] * p[<span style="color:#fbbf24">"minutes_per_run"</span>] * <span style="color:#fb923c">52</span>) / <span style="color:#fb923c">60</span>
    <span style="color:#34d399">print</span>(<span style="color:#fbbf24">f"{p['name']}: score={score}, {hours_saved:.0f} hrs/year saved"</span>)
    <span style="color:#71717a"># → Weekly client report: score=900, 195 hrs/year saved</span></code></pre>
</div>
<p style="font-size:.85rem;color:#71717a;margin-top:.5rem">The scoring formula: <code>frequency × time × mechanical_steps</code>. The weekly client report scores 900 (5 × 45 × 4 mechanical steps). That's 195 hours/year — nearly 5 full work weeks. This is how you prioritize what to automate first.</p>
</div>

<div class="lesson-section">
  <div data-learn="FlashDeck" data-props='{"title":"The 5-Step Process Audit","cards":[{"front":"Step 1: Pick a Process","back":"Choose one process you do at least weekly. Start with something routine, not your most complex workflow."},{"front":"Step 2: Write Every Step","back":"Document every single step, even obvious ones. Open email counts. Click the link counts. Nothing is too small."},{"front":"Step 3: Mark Decision vs. Mechanical","back":"Each step is either decision (requires judgment) or mechanical (same every time). Mechanical steps are your automation targets."},{"front":"Step 4: Note Data Movement","back":"Where does data move between tools? Email to spreadsheet, form to database, chat to task board. These are integration points."},{"front":"Step 5: Score for Priority","back":"Frequency times time per run times mechanical step count. Higher score = higher automation priority. Start with the highest."}]}'></div>
</div>

<div class="lesson-section">
  <span class="section-label">Quick Review</span>
  <h2 class="section-title">The 5-Step Process Audit</h2>
  <div data-learn="SortStack" data-props='{"title":"Process Audit Steps — In Order","instruction":"Arrange the five audit steps in the correct sequence","items":["Pick one process you do at least weekly","Write down every single step including obvious ones like open email","Mark each step as decision (requires judgment) or mechanical (same every time)","Note where data moves between tools","Score by frequency times time per run times mechanical step count"]}'></div>
</div>

<div class="lesson-section">
  <span class="section-label">Check Your Understanding</span>
  <h2 class="section-title">Lesson 2 Quiz</h2>
  <div data-learn="QuizMC" data-props='{"title":"Mapping Your Processes","questions":[{"q":"In the Input-Action-Output framework, what makes a step automatable?","options":["The action is complex and requires expertise","The input is digital","The action is predictable and the rules are clear every time","The output is a document"],"correct":2,"explanation":"When an action is predictable — it follows the same logic every time — and the rules are clear, that step can be automated. Decision steps that require judgment are harder to automate."},{"q":"What is the biggest mistake people make when starting automation?","options":["Starting too small","Automating their most complex process first instead of the boring, routine ones","Documenting processes before automating","Using no-code tools"],"correct":1,"explanation":"Starting with your most complex process creates high-stakes failure points while you are still learning. Start with boring, routine tasks where automation delivers obvious value and teaches fundamentals without risk."},{"q":"In the weekly client report example, how many of the 6 steps are fully automatable?","options":["1","2","4","All 6"],"correct":2,"explanation":"4 of 6 steps are fully automatable (pulling data, copying to template, exporting PDF, emailing). Writing the summary is AI-assistable. Only adding client-specific notes truly requires a human."}]}'></div>
</div>

<nav class="lesson-nav">
  <a href="/academy/ai-powered-workflows/01-why-workflows-matter/" class="prev">← Previous: Why Workflows Matter</a>
  <a href="/academy/ai-powered-workflows/03-trigger-based-workflows/" class="next">Next: Trigger-Based Workflows →</a>
</nav>

</div>
