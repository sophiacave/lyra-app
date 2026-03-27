---
title: "Meeting Notes & Action Items"
course: "ai-project-management"
order: 3
type: "lesson"
free: true
---

<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-project-management/">← AI Project Management</a>
  <span class="badge" style="background: var(--orange);">Lesson 3 of 10</span>
</nav>

<div class="lesson-hero">
  <h1><span class="accent">Meeting Notes</span> & Action Items</h1>
  <p class="subtitle">Turn every meeting into clear outcomes with AI-powered summaries and follow-ups.</p>
</div>

<div class="learn-card">
  <h3>What You'll Learn</h3>
  <ul>
    <li>How to structure meeting input for the best AI summaries</li>
    <li>Extracting action items with owners, deadlines, and context</li>
    <li>Building a follow-up system that actually works</li>
  </ul>
</div>

<div class="lesson-section">
  <span class="section-label" style="color: var(--orange);">The Pain</span>
  <h2 class="section-title">Meetings Are Where Information Goes to Die</h2>
  <p class="section-text">You've been there. Great discussion, solid decisions, everyone nods — and two days later nobody remembers who agreed to what. The meeting notes are either missing, incomplete, or a wall of text nobody reads.</p>
  <p class="section-text">AI solves this by being the perfect note-taker. It doesn't zone out. It doesn't miss the action item buried in minute 47. It captures everything and organizes it in a format people actually use.</p>
</div>

<div class="lesson-section">
  <span class="section-label" style="color: var(--purple);">The Input</span>
  <h2 class="section-title">Feeding AI Your Meeting Data</h2>
  <p class="section-text">You have options. If your meeting tool creates transcripts (Zoom, Teams, Otter), paste the transcript directly. If you took rough notes, those work too. Even a bullet-point brain dump after the meeting is enough for AI to work with.</p>
  <p class="section-text">The key is telling AI what format you want back. Don't just say "summarize this." Tell it exactly what sections you need: decisions, action items, parking lot items, key discussion points. Structure in, structure out.</p>
</div>

<div class="demo-container">
  <h3>Before & After</h3>
  <p><strong>Raw input:</strong> "talked about the Q3 launch, Sarah said design won't be ready until July 15, Mike pushed back on the API timeline, we agreed to cut the admin panel from v1, need to tell the client about the scope change, testing should start by July 20"</p>
  <p><strong>AI output:</strong></p>
  <ul>
    <li><strong>Decision:</strong> Admin panel removed from v1 scope</li>
    <li><strong>Action:</strong> [Owner TBD] Notify client about scope change — by [date]</li>
    <li><strong>Action:</strong> Sarah — deliver design by July 15</li>
    <li><strong>Action:</strong> Mike — resolve API timeline concerns — by [date]</li>
    <li><strong>Milestone:</strong> Testing begins July 20</li>
    <li><strong>Risk:</strong> Client may react negatively to scope reduction</li>
  </ul>
</div>

<div class="lesson-section">
  <span class="section-label" style="color: var(--green);">The System</span>
  <h2 class="section-title">Building a Follow-Up Loop</h2>
  <p class="section-text">Meeting notes are only valuable if they drive action. After AI extracts your action items, feed them into your next meeting's agenda. Ask AI: "Here are last week's action items. Generate an agenda that checks status on each one and addresses this week's topics."</p>
  <p class="section-text">This creates accountability without you having to chase people. The system does the chasing. You just run the meeting.</p>
</div>

<div class="try-it-box">
  <h3>Try It Yourself</h3>
  <p>Grab a transcript or your rough notes from your last meeting. Use this prompt:</p>
  <div class="prompt-box"><code>Here are notes from a [type] meeting with [who]. Please produce: (1) A 3-sentence executive summary, (2) All decisions made, (3) Action items in format: [Owner] — [Task] — [Deadline if mentioned], (4) Open questions or parking lot items, (5) Suggested agenda items for the next meeting based on follow-ups needed. Notes: [paste here]</code></div>
  <p>Send the output to your team. Watch how much faster the next meeting starts when everyone already knows the context.</p>
</div>

<div class="lesson-section">
  <span class="section-label" style="color: var(--blue);">Pro Tip</span>
  <h2 class="section-title">Template Once, Use Forever</h2>
  <p class="section-text">Save your best meeting summary prompt as a template. Tweak it for different meeting types — standups get a lighter format, steering committees get more detail. Once you have 3-4 templates dialed in, processing any meeting takes under two minutes.</p>
</div>

<div class="lesson-section">
  <div data-learn="MatchConnect" data-props='{"title":"Meeting Output Types — Match Each to Its Purpose","instruction":"Tap one on the left, then its match on the right","pairs":[{"left":"Executive Summary","right":"3 sentences max — who attended, what was decided, what is the status. Gets the summary without reading the whole document."},{"left":"Action Items","right":"Format: [Owner] — [Task] — [Deadline]. The most important output — drives accountability and follow-through after the meeting."},{"left":"Parking Lot Items","right":"Topics raised but not resolved — questions to answer, decisions to defer, issues to revisit. Prevents good ideas from disappearing."},{"left":"Next Meeting Agenda","right":"Generated automatically from open action items and parking lot topics — closes the loop and starts the next meeting with purpose."}]}'></div>
</div>

<div class="lesson-section">
  <div data-learn="QuizMC" data-props='{"title":"Meeting Notes & Action Items Quiz","questions":[{"q":"What is the key to getting well-structured output from AI meeting summaries?","options":["Give AI as much raw transcript as possible","Tell AI exactly what sections you need — decisions, action items, parking lot, key points. Structure in, structure out.","Always use full verbatim transcripts rather than rough notes","Let AI decide the best format based on meeting type"],"correct":1,"explanation":"The key is telling AI what format you want back. Don\u2019t just say \u2018summarize this.\u2019 Specify exactly which sections you need. Structure in, structure out — vague input produces vague output."},{"q":"Which of the following is NOT a valid input format for AI meeting processing?","options":["Full verbatim transcript from Zoom or Teams","Rough bullet-point notes taken during the meeting","A brain dump written immediately after the meeting","A calendar invite with attendee names only"],"correct":3,"explanation":"Transcripts, rough notes, and post-meeting brain dumps all give AI enough to work with. A calendar invite with only attendee names provides no meeting content — AI needs to know what was actually discussed."},{"q":"How does AI create accountability in the meeting follow-up loop?","options":["By automatically sending emails to action item owners","By generating the next meeting\u2019s agenda from open action items, so follow-through is built into the next session","By tracking which team members complete tasks on time","By escalating overdue items to management automatically"],"correct":1,"explanation":"After AI extracts action items, you feed them into the next meeting\u2019s agenda. Ask AI: \u2018Here are last week\u2019s action items. Generate an agenda that checks status on each.\u2019 The system creates accountability without you having to chase people."}]}'></div>
</div>

<nav class="lesson-nav">
  <a href="/academy/ai-project-management/02-project-planning-with-ai/" class="prev">← Previous: Project Planning with AI</a>
  <a href="/academy/ai-project-management/04-status-reports-and-updates/" class="next">Next: Status Reports & Updates →</a>
</nav>

</div>
