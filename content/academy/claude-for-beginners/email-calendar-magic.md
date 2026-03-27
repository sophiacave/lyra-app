---
title: "Email & Calendar Magic"
course: "claude-for-beginners"
order: 4
type: "lesson"
free: false
css: "claude-beginners.css"
---<div class="wrap">

<nav class="local-nav">
  <a href="/academy/claude-for-beginners/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 4 of 9</span>
</nav>

<!-- HERO -->
<div class="lesson-hero">
  <h1>Email & Calendar <span class="accent">Magic.</span><span class="pro-badge">PRO</span></h1>
  <p class="sub">The hands-on lesson where you stop spending 45 minutes on a 3-sentence email. Claude writes it in seconds. You hit send in confidence.</p>
</div>

<!-- LEARNING GOALS -->
<div class="learn-card">
  <h3>After this lesson you'll be able to</h3>
  <ul>
    <li>Draft professional emails in seconds, not minutes</li>
    <li>Handle awkward email situations gracefully (pushback, bad news, negotiations)</li>
    <li>Prep for meetings faster with AI-generated agendas and notes</li>
    <li>Create a copy-paste workflow that saves hours every week</li>
  </ul>
</div>

<!-- SECTION 1: EMAIL DRAFTING -->
<div class="lesson-section">
  <span class="section-label">Hands-On</span>
  <h2 class="section-title">Email drafting that actually sounds like you.</h2>
  <p class="section-text">Most people stare at a blank email for 10 minutes, write something mediocre, then rewrite it twice. Claude skips all of that. <strong>You describe what you need, Claude writes it, you tweak and send.</strong> The key is giving Claude enough context about tone, audience, and goal.</p>

  <div id="email-demo-area">
    <p class="section-text">Click any template below to see Claude in action. These are real-world emails you can adapt and use today.</p>

    <div class="template-grid">
      <div class="template-card" onclick="showEmailDemo(0)">
        <div class="emoji">🤝</div>
        <h4>Cold Outreach</h4>
        <p>"Write a cold outreach email to a potential client I met at a conference."</p>
      </div>
      <div class="template-card" onclick="showEmailDemo(1)">
        <div class="emoji">📋</div>
        <h4>Meeting Follow-Up</h4>
        <p>"Write a follow-up email after a project kickoff meeting with action items."</p>
      </div>
      <div class="template-card" onclick="showEmailDemo(2)">
        <div class="emoji">🛑</div>
        <h4>Pushing Back</h4>
        <p>"Write an email declining a request without burning the relationship."</p>
      </div>
      <div class="template-card" onclick="showEmailDemo(3)">
        <div class="emoji">📊</div>
        <h4>Weekly Status Update</h4>
        <p>"Write my weekly status email that people will actually read."</p>
      </div>
    </div>

    <!-- DEMO DISPLAY -->
    <div class="demo-container" id="email-demo-display" style="display:none">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
        <span style="font-size:.75rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--orange)">LIVE EXAMPLE</span>
        <button onclick="hideEmailDemo()" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:1rem">&times;</button>
      </div>
      </div>
  </div>

  <div class="tip-box">
    <div class="tip-label">Pro Tip</div>
    <p><strong>Always specify the tone.</strong> "Professional but warm," "direct but not rude," "casual but competent." Claude nails tone when you name it. Without a tone instruction, you get generic corporate speak.</p>
  </div>
</div>

<!-- SECTION 2: REPLY CHAIN TECHNIQUE -->
<div class="lesson-section">
  <span class="section-label">Advanced Technique</span>
  <h2 class="section-title">The Reply Chain Technique.</h2>
  <p class="section-text">This is the single most useful email trick you'll learn in this course. <strong>Copy an entire email thread, paste it into Claude, and ask it to draft your reply.</strong> Claude reads the context, understands the dynamics, and writes a response that fits naturally into the conversation.</p>

  <p class="section-text">Here's a real example. Click below to see how it works:</p>

  <div class="demo-container" id="reply-chain-demo" style="cursor:pointer" onclick="showReplyChain()">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
      <span style="font-size:.75rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--purple)">SAMPLE EMAIL THREAD</span>
      <span style="font-size:.72rem;color:var(--muted)" id="reply-chain-hint">Click to see Claude's reply</span>
    </div>

    <div class="email-thread">
      <div class="email-header">
        <span class="email-from">From: Marcus Chen (VP Sales)</span>
        <span class="email-date">Mon 9:14 AM</span>
      </div>
      <div class="email-subject">Re: Q2 Marketing Budget Request</div>
      <div class="email-body">Team,<br><br>I've reviewed the proposed marketing budget and honestly I think $85K for the new campaign is too high given where we are with Q2 targets. Can we cut this by 40%? We need to prioritize the sales team's conference budget instead.<br><br>Marcus</div>
    </div>

    <div class="email-thread">
      <div class="email-header">
        <span class="email-from">From: Priya Sharma (CMO)</span>
        <span class="email-date">Mon 10:02 AM</span>
      </div>
      <div class="email-subject">Re: Q2 Marketing Budget Request</div>
      <div class="email-body">Marcus,<br><br>I understand the budget pressure but cutting 40% would basically kill the campaign. The $85K includes $30K in committed vendor contracts we can't back out of. Could we discuss finding a middle ground?<br><br>Priya</div>
    </div>

    <div class="email-thread">
      <div class="email-header">
        <span class="email-from">From: Marcus Chen (VP Sales)</span>
        <span class="email-date">Mon 11:30 AM</span>
      </div>
      <div class="email-subject">Re: Q2 Marketing Budget Request</div>
      <div class="email-body">Priya - the conferences are already booked too. I'm not sure where else we'd find the budget. Can you show me the ROI breakdown for the $85K? If the numbers are strong enough I'll go to bat for it with the CEO.<br><br>M</div>
    </div>

    <div id="reply-chain-response" style="display:none;margin-top:1rem">
      <div style="border-top:1px solid var(--border);padding-top:1rem;margin-top:.5rem">
        <div style="font-size:.75rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--orange);margin-bottom:.75rem">YOUR PROMPT TO CLAUDE</div>
        <div class="chat-window">
          <div class="chat-msg">
            <div class="chat-avatar user">👤</div>
            <div class="chat-bubble">I'm Priya. Draft my reply to Marcus. I want to be collaborative, not defensive. I do have strong ROI numbers — last quarter's campaign generated $340K pipeline from a $72K spend. I want to propose keeping $70K (cutting $15K from the photography budget) and suggest we share booth costs at the conference to help his budget too. Keep it concise and positive.</div>
          </div>
          <div class="chat-msg">
            <div class="chat-avatar claude" style="background:rgba(192,132,252,.15)">🤖</div>
            <div class="chat-bubble">Here's your reply:<br><br><strong>Subject: Re: Q2 Marketing Budget Request</strong><br><br>Marcus,<br><br>Great question on the ROI — happy to share. Last quarter's campaign generated <strong>$340K in pipeline from a $72K spend</strong>, roughly a 4.7x return. That's what gave us confidence in the bigger push this quarter.<br><br>That said, I hear you on budget pressure. Here's what I can do:<br><br>- Cut $15K from the photography line (we'll use our in-house team instead), bringing us to <strong>$70K</strong><br>- The $30K in vendor contracts stay, but the remaining $40K is focused on lead gen that feeds directly into your pipeline<br><br>Also — idea: what if marketing shares booth costs at the Austin conference? We'd get brand presence, your team gets the meetings, and we split the $12K. Saves you $6K right there.<br><br>Want to grab 15 minutes tomorrow to walk through the full breakdown?<br><br>Priya</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="callout">
    <p><strong>Why this works so well:</strong> Claude reads the <em>subtext</em> of the thread — the tension, the politics, who has leverage. It doesn't just reply to the last email; it crafts a response that addresses the entire conversation arc. This alone saves most people 20+ minutes per difficult email.</p>
  </div>
</div>

<!-- SECTION 3: CALENDAR & SCHEDULING -->
<div class="lesson-section">
  <span class="section-label">Level Up</span>
  <h2 class="section-title">Calendar & meeting prep, handled.</h2>
  <p class="section-text">Meetings don't have to be chaos. Use Claude to <strong>create agendas, plan your week, and prep talking points</strong> so you walk into every meeting ready. Click any template to see it in action.</p>

  <div id="calendar-demo-area">
    <div class="template-grid">
      <div class="template-card" onclick="showCalendarDemo(0)">
        <div class="emoji">📝</div>
        <h4>Meeting Agenda</h4>
        <p>"Create a 30-minute agenda for a project status meeting with 6 people."</p>
      </div>
      <div class="template-card" onclick="showCalendarDemo(1)">
        <div class="emoji">📅</div>
        <h4>Weekly Planning</h4>
        <p>"Help me plan my week around 12 meetings and 3 deadlines."</p>
      </div>
      <div class="template-card" onclick="showCalendarDemo(2)">
        <div class="emoji">🎯</div>
        <h4>Meeting Prep Notes</h4>
        <p>"Prep me for a performance review with my manager tomorrow."</p>
      </div>
    </div>

    <div class="demo-container" id="calendar-demo-display" style="display:none">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
        <span style="font-size:.75rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--orange)">LIVE EXAMPLE</span>
        <button onclick="hideCalendarDemo()" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:1rem">&times;</button>
      </div>
      </div>
  </div>

  <div class="tip-box">
    <div class="tip-label">Pro Tip</div>
    <p><strong>Paste your actual calendar.</strong> Copy your week's schedule from Google Calendar or Outlook, paste it into Claude, and say "Help me find 2 hours for deep work and identify any back-to-back meetings I should reschedule." Claude becomes a scheduling assistant instantly.</p>
  </div>
</div>

<!-- SECTION 4: COPY-PASTE WORKFLOW -->
<div class="lesson-section">
  <span class="section-label">The System</span>
  <h2 class="section-title">The copy-paste workflow that saves hours.</h2>
  <p class="section-text">Let's be real about how this works day-to-day. There's no magic integration (yet). The power is in a <strong>simple, repeatable system</strong> that becomes muscle memory within a week.</p>

  <div class="demo-container" style="padding:1.5rem">
    <div class="workflow-steps">
      <div class="workflow-step">
        <div class="step-num">1</div>
        <div class="step-content">
          <h4>Copy from your inbox</h4>
          <p>Select the email (or thread) you need to respond to. Ctrl+A, Ctrl+C. Don't overthink it — grab the whole thing.</p>
        </div>
      </div>
      <div class="workflow-step">
        <div class="step-num">2</div>
        <div class="step-content">
          <h4>Paste into Claude + add context</h4>
          <p>Paste the email and add one sentence: who you are, what tone you want, and what you want to say. That's it.</p>
        </div>
      </div>
      <div class="workflow-step">
        <div class="step-num">3</div>
        <div class="step-content">
          <h4>Copy Claude's response</h4>
          <p>Read it (takes 10 seconds). If it's good — and it usually is — copy it. If you want changes, tell Claude in one sentence.</p>
        </div>
      </div>
      <div class="workflow-step">
        <div class="step-num">4</div>
        <div class="step-content">
          <h4>Paste and send</h4>
          <p>Paste into your email client. Maybe tweak a name or detail. Hit send. Total time: under 60 seconds.</p>
        </div>
      </div>
    </div>
  </div>

  <div class="tip-box">
    <div class="tip-label">Power Move: Claude Projects</div>
    <p><strong>For people you email regularly</strong> (your manager, key clients, close collaborators), create a Claude Project. Add context about the relationship, their communication style, past interactions. Now every email Claude drafts for that person is <em>perfectly tailored</em> — it's like having a dedicated executive assistant for each relationship.</p>
  </div>

  <div class="callout">
    <p><strong>Did you know?</strong> Claude Pro now supports direct integrations with Gmail and Google Calendar — so you can skip the copy-paste entirely. But the copy-paste method works on <em>any</em> tier (including free) and with <em>any</em> email provider. Learn the manual workflow first; it works everywhere and makes you dangerous with any AI tool.</p>
  </div>
</div>

<!-- KEY TAKEAWAY -->
<div class="callout purple">
  <p><strong>The real magic:</strong> This isn't about AI writing your emails. It's about <strong>eliminating the blank-page paralysis</strong> that makes email feel like work. When Claude drafts a starting point in 5 seconds, all you have to do is edit. And editing is 10x faster than creating from scratch. Most people save 30-60 minutes per day once this becomes habit.</p>
</div>

<!-- COMPLETION -->
<button class="complete-btn" id="completeBtn" onclick="completeLesson()">Complete Lesson 4 ✓</button>

<script>
const SLUG = 'claude-for-beginners';
const LESSON_NUM = 4;

// Show complete button after scrolling 60%
window.addEventListener('scroll', function() {
  const scrollPct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  if (scrollPct > 0.6) {
    document.getElementById('completeBtn').classList.add('visible');
  }
});

function completeLesson() {
  const stored = localStorage.getItem('lo_progress_' + SLUG);
  const completed = stored ? JSON.parse(stored) : [];
  if (!completed.includes(LESSON_NUM)) {
    completed.push(LESSON_NUM);
    localStorage.setItem('lo_progress_' + SLUG, JSON.stringify(completed));
  }
  const btn = document.getElementById('completeBtn');
  btn.textContent = 'Completed! ✨';
  btn.style.background = 'var(--green)';
  btn.style.pointerEvents = 'none';
}

// Check if already completed
(function() {
  const stored = localStorage.getItem('lo_progress_' + SLUG);
  const completed = stored ? JSON.parse(stored) : [];
  if (completed.includes(LESSON_NUM)) {
    const btn = document.getElementById('completeBtn');
    btn.classList.add('visible');
    btn.textContent = 'Completed! ✨';
    btn.style.background = 'var(--green)';
    btn.style.pointerEvents = 'none';
  }
})();

// ---- EMAIL DRAFTING DEMOS ----
const emailDemos = [
  {
    prompt: "Write a cold outreach email to Jordan Rivera, VP of Operations at TechScale Inc. I met them briefly at the SaaS Growth Summit last week. We talked about their supply chain challenges for about 5 minutes. My company does supply chain analytics. Keep it short, warm, and not salesy. I want a conversation, not a pitch.",
    response: "Subject: Great meeting you at SaaS Growth Summit\n\nHi Jordan,\n\nReally enjoyed our conversation at the Summit last week — your point about visibility gaps in multi-vendor supply chains stuck with me.\n\nI've been thinking about what you described, and we've actually helped a few companies in a similar spot untangle that exact problem. No magic bullet, but some approaches that worked well.\n\nWould you be open to a 20-minute call next week? Not a pitch — I'd genuinely like to hear more about what you're seeing at TechScale and share a few ideas that might be useful.\n\nEither way, it was great connecting. Hope the rest of the conference was solid.\n\nBest,\n[Your name]"
  },
  {
    prompt: "Write a follow-up email after our project kickoff meeting for the website redesign. Attendees: me (project lead), 2 designers, 1 developer, and the client (Lisa Park from Bloom Co). We agreed on: March 15 wireframe deadline, weekly check-ins on Thursdays at 2pm, Lisa will send brand guidelines by Friday. Tone: professional but energetic — we want Lisa excited about this.",
    response: "Subject: Website Redesign Kickoff — Action Items & Next Steps 🚀\n\nHi everyone,\n\nGreat kickoff today! Excited to get this moving. Here's what we locked in:\n\n**Key Dates:**\n- Wireframes due: March 15\n- Weekly check-ins: Thursdays at 2:00 PM (invite coming shortly)\n- Brand guidelines from Lisa: by this Friday\n\n**Action Items:**\n| Who | What | By When |\n|-----|------|--------|\n| Lisa | Send brand guidelines + any inspiration references | Friday |\n| Design team | Initial wireframe concepts (3 directions) | March 15 |\n| Dev | Technical audit of current site | March 10 |\n| Me | Set up shared project folder + Slack channel | Tomorrow |\n\n**Next Thursday's Agenda:**\n- Review brand guidelines together\n- Discuss technical constraints from the audit\n- Align on wireframe direction before the team goes deep\n\nLisa — thank you for the clear vision today. The team is genuinely pumped about this one.\n\nLet me know if I missed anything!\n\n[Your name]"
  },
  {
    prompt: "I need to push back on a request from my manager. She asked me to take on a new client project starting Monday, but I'm already at capacity with two major deadlines next week. I don't want to say no — I want to say 'yes, but here's what needs to shift.' Tone: respectful, solution-oriented, not whiny.",
    response: "Subject: Re: New Client Project — Quick Capacity Check\n\nHi [Manager],\n\nI'd love to take on the Meridian project — it sounds like a great opportunity. I want to make sure I can give it the attention it deserves, so let me flag where I am this week:\n\n**Currently on my plate:**\n- Henderson deliverable — due Wednesday (about 60% done, needs focused time Mon-Tue)\n- Q2 strategy deck — due Friday (first draft complete, needs revision + stakeholder review)\n\n**Options I see:**\n1. **Start Meridian Wednesday** after Henderson ships. I can do a quick intro call Monday to get context while keeping my head down on Henderson.\n2. **Hand off the Q2 deck revisions** to [colleague] so I can start Meridian Monday at full speed.\n3. **Push Henderson to Friday** if the client is flexible — frees me up for Meridian earlier.\n\nI'm good with whatever works best for the team. What's your preference?\n\n[Your name]"
  },
  {
    prompt: "Write my weekly status update email. I'm a product manager. This week: shipped the new onboarding flow (finally), fixed 3 critical bugs in checkout, started user research for the mobile app redesign (5 interviews done). Next week: finish user research (5 more interviews), start mobile wireframes, planning meeting for Q3 roadmap. One blocker: still waiting on API documentation from the engineering team — need it by Wednesday or mobile wireframes will slip. Make it scannable. Nobody reads walls of text.",
    response: "Subject: Weekly Update — May 12\n\n**✅ Shipped This Week**\n- **New onboarding flow is LIVE** — rolled out to 100% of users Wednesday. Early data: completion rate up from 34% to 52%\n- Fixed 3 critical checkout bugs (cart clearing, double-charge edge case, mobile payment button)\n- Started mobile app user research — 5/10 interviews complete\n\n**🎯 Next Week**\n- Complete remaining 5 user interviews (scheduled Mon-Wed)\n- Begin mobile wireframe concepts (Thu-Fri)\n- Q3 roadmap planning meeting (Friday 2pm — agenda coming Wednesday)\n\n**🚧 Blocker**\n- **Need API docs from engineering by Wednesday.** Without them, mobile wireframes can't start on schedule. @[engineering lead] — can we get these by EOD Tuesday?\n\n**📊 Key Metric**\n- Onboarding completion: 34% → 52% (+53%). Will share full data next week once we have 7 days of clean numbers.\n\nQuestions? Ping me. Otherwise, see you at Friday's planning session.\n\n[Your name]"
  }
];

function showEmailDemo(idx) {
  const demo = emailDemos[idx];
  const chat = document.getElementById('email-demo-chat');
  chat.innerHTML = `
    <div class="chat-msg">
      <div class="chat-avatar user">👤</div>
      <div class="chat-bubble">${demo.prompt}</div>
    </div>
    <div class="chat-msg">
      <div class="chat-avatar claude" style="background:rgba(192,132,252,.15)">🤖</div>
      <div class="chat-bubble">${demo.response.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</div>
    </div>
  `;
  document.getElementById('email-demo-display').style.display = 'block';
  document.getElementById('email-demo-display').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function hideEmailDemo() {
  document.getElementById('email-demo-display').style.display = 'none';
}

// ---- REPLY CHAIN DEMO ----
function showReplyChain() {
  const resp = document.getElementById('reply-chain-response');
  const hint = document.getElementById('reply-chain-hint');
  if (resp.style.display === 'none') {
    resp.style.display = 'block';
    hint.textContent = 'Click to collapse';
    resp.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    resp.style.display = 'none';
    hint.textContent = 'Click to see Claude\'s reply';
  }
}

// ---- CALENDAR DEMOS ----
const calendarDemos = [
  {
    prompt: "Create a 30-minute agenda for a project status meeting. 6 attendees: me (PM), 2 engineers, 1 designer, 1 QA lead, and our director (she joins for the last 10 min). The project is a checkout redesign, 3 weeks in. We need to cover: progress update, a design decision on the payment flow, and a blocker with the payment API vendor. Keep it tight — this team hates long meetings.",
    response: "**Checkout Redesign — Status Meeting**\n📅 30 minutes | 6 attendees\n\n**[0:00 - 0:03] Quick Wins (3 min)**\nRound-robin: each person shares ONE thing completed since last meeting. One sentence each. No discussion.\n\n**[0:03 - 0:10] Progress vs. Plan (7 min)**\n- Engineering: where are we on cart logic and payment integration?\n- Design: user testing results on new flow?\n- QA: test coverage status + any early flags?\n- PM shares updated timeline on screen\n\n**[0:10 - 0:18] Decision: Payment Flow Design (8 min)**\n- Designer presents 2 options (2 min)\n- Quick pros/cons from eng + QA (3 min)\n- **Decision made before leaving this block** — no \"let's think about it\" (3 min)\n\n**[0:18 - 0:24] Blocker: Payment API Vendor (6 min)**\n- PM: what's the issue, what we've tried, what we need\n- Eng: technical workaround options\n- Agree on next step + owner + deadline\n\n**[0:24 - 0:30] Director Sync (6 min)** ← Director joins\n- PM: 60-second summary of status + decision made\n- Flag the vendor blocker — does she have a contact?\n- Any Q3 priority shifts we should know about?\n\n**Rules:**\n- No laptops unless presenting\n- If it's not on the agenda, it's a Slack conversation\n- Action items captured in shared doc in real-time"
  },
  {
    prompt: "Here's my week:\nMon: 9am standup, 10am-12pm client workshop, 2pm 1:1 with manager, 4pm design review\nTue: 9am standup, 11am candidate interview, 1pm-3pm deep work block (supposedly), 3:30pm sprint planning\nWed: 9am standup, 10am all-hands, 2pm vendor call, 4pm team retro\nThu: 9am standup, 10am-11:30am budget review, 1pm client call, 3pm cross-team sync\nFri: 9am standup, 11am 1:1 with report, 2pm demo day\n\nI also need to: finish the Q2 roadmap doc (needs ~3 hours), review 2 PRs (1 hour), prep for the client workshop on Monday, and write the team newsletter (1 hour).\n\nHelp me find time for everything and tell me if I'm overcommitted.",
    response: "**The honest answer: you're overcommitted.** You have ~8 hours of task work needed and maybe 5-6 hours of realistic open time. Here's how to make it work:\n\n**🟡 Monday**\n- 8:00-9:00 AM → **Prep for client workshop** (do this BEFORE standup — you'll be fresher)\n- 9:00 AM → Standup\n- 10:00-12:00 → Client workshop\n- 12:00-1:00 → Lunch + decompress\n- 1:00-2:00 → **Q2 Roadmap Doc — Session 1** (1 hr)\n- 2:00 PM → 1:1 with manager\n- 3:00-4:00 → **Review PR #1** (30 min) + buffer\n- 4:00 PM → Design review\n\n**🟢 Tuesday**\n- 9:00 AM → Standup\n- 9:30-11:00 → **Q2 Roadmap Doc — Session 2** (1.5 hrs) ← protect this\n- 11:00 AM → Interview\n- 12:00-1:00 → Lunch\n- 1:00-3:00 → **Deep work: Q2 Roadmap finish** (final 30 min) + **Review PR #2** (30 min) + **Newsletter draft** (1 hr)\n- 3:30 PM → Sprint planning\n\n**🔵 Wednesday — Accept the loss**\nThis day is basically wall-to-wall. Don't schedule task work.\n- Use gaps between meetings for email/Slack catch-up only\n- 8:00-9:00 AM → **Newsletter polish + send** (finish what you drafted Tue)\n\n**🟢 Thursday & Friday** → Keep open for overflow\n\n**⚠️ My recommendation:**\n- The Tuesday \"deep work block\" is your lifeline. CANCEL or move anything that tries to invade it.\n- If the roadmap doc isn't done by Tuesday, it's not getting done this week. Prioritize it.\n- Consider skipping Thursday's cross-team sync if you're not presenting. Ask for notes instead."
  },
  {
    prompt: "I have a performance review with my manager tomorrow at 2pm. I've been in this role for 8 months. I launched the new customer portal (big win), improved response times by 30%, and mentored a junior dev. I also missed the Q1 deadline on the mobile app by 2 weeks. I want to ask for a title change from 'Senior' to 'Staff' engineer. Help me prep.",
    response: "**Performance Review Prep — Your Playbook**\n\n**🏆 Your Narrative (lead with this)**\nTheme: \"I've been operating at Staff level for 8 months. Here's the evidence.\"\n\n**Wins to Highlight:**\n1. **Customer Portal Launch** — Frame it as staff-level work:\n   - \"I didn't just build it — I drove the architecture decisions, coordinated across 3 teams, and owned the rollout plan. That's staff-level scope.\"\n   - Have specific impact numbers ready (users, adoption rate, customer feedback)\n\n2. **30% Response Time Improvement**\n   - What was the business impact? (fewer support tickets? higher satisfaction scores?)\n   - Did you identify this problem yourself or were you assigned it? (Self-identified = staff behavior)\n\n3. **Mentoring Junior Dev**\n   - What did they ship that they couldn't have without you?\n   - This is the \"multiplier effect\" that distinguishes Staff from Senior\n\n**🟡 Address the Miss Before They Do**\n\"The mobile deadline slipped 2 weeks. Here's what happened and what I learned:\"\n- Be specific about the cause (scope creep? dependency? underestimation?)\n- Show what you've changed since (better estimation process? earlier risk flagging?)\n- Frame it: \"The project still shipped successfully. I now flag risks 2 weeks earlier.\"\n\n**🎯 The Title Ask — Script It**\n\"Based on the scope of work I've been leading — cross-team coordination, architecture decisions, mentoring — I believe I've been performing at Staff level. I'd like to discuss formalizing that with a title change.\"\n\nThen STOP talking. Let them respond.\n\n**If they say \"not yet\":**\n\"I respect that. Can we define exactly what Staff looks like here so I can close any gaps in Q2? I'd love to have a clear rubric.\"\n\n**📋 Bring to the Meeting:**\n- One-page summary of wins + impact (print or screen-share)\n- 2-3 specific examples of Staff-level behavior\n- Your growth plan for next quarter (shows you're forward-thinking)\n- A question for them: \"What's one area you'd want to see me grow in?\""
  }
];

function showCalendarDemo(idx) {
  const demo = calendarDemos[idx];
  const chat = document.getElementById('calendar-demo-chat');
  chat.innerHTML = `
    <div class="chat-msg">
      <div class="chat-avatar user">👤</div>
      <div class="chat-bubble">${demo.prompt}</div>
    </div>
    <div class="chat-msg">
      <div class="chat-avatar claude" style="background:rgba(192,132,252,.15)">🤖</div>
      <div class="chat-bubble">${demo.response.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</div>
    </div>
  `;
  document.getElementById('calendar-demo-display').style.display = 'block';
  document.getElementById('calendar-demo-display').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function hideCalendarDemo() {
  document.getElementById('calendar-demo-display').style.display = 'none';
}
</script>
