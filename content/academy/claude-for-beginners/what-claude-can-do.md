---
title: "What Claude Can Do For You"
course: "claude-for-beginners"
order: 1
type: "lesson"
free: true
css: "claude-beginners.css"
---<div class="wrap">

<nav class="local-nav">
  <a href="/academy/claude-for-beginners/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 1 of 9</span>
</nav>

<!-- HERO -->
<div class="lesson-hero">
  <h1>What Claude Can <span class="accent">Do For You.</span></h1>
  <p class="sub">Forget everything you've heard about AI. Let's start with what actually matters: saving you time at work.</p>
</div>

<!-- LEARNING GOALS -->
<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>What Claude actually is (in plain English)</li>
    <li>5 things Claude can do for you starting today</li>
    <li>What Claude can't do (and why that matters)</li>
    <li>How to access Claude right now</li>
  </ul>
</div>

<!-- SECTION 1: WHAT IS CLAUDE -->
<div class="lesson-section">
  <span class="section-label">The Basics</span>
  <h2 class="section-title">Claude is a smart coworker who never sleeps.</h2>
  <p class="section-text">Claude is an AI assistant made by Anthropic. Think of it as <strong>a brilliant colleague who can read, write, analyze, and brainstorm</strong> — instantly. You talk to it in plain English. No commands. No code. Just conversation.</p>
  <p class="section-text">It's not a search engine. It doesn't give you links. It gives you <strong>actual answers, actual writing, actual analysis</strong>. The difference is like asking Google "how to write a thank-you email" vs. telling Claude "write a thank-you email to my client Sarah for the Q3 contract, professional but warm."</p>

  <div class="callout">
    <p><strong>Real talk:</strong> Claude won't replace you. It's a tool that makes you faster, clearer, and more effective. The people who learn to work with AI will outperform those who don't — not because AI is smarter, but because <strong>the combination is unstoppable.</strong></p>
  </div>
</div>

<!-- SECTION 2: 5 THINGS -->
<div class="lesson-section">
  <span class="section-label">The Good Stuff</span>
  <h2 class="section-title">5 things you can do with Claude today.</h2>

  <div id="demo-area">
    <p class="section-text">Click any card below to see a real example. These aren't hypothetical — these are things people use Claude for <strong>every single day</strong>.</p>

    <div class="prompt-grid">
      <div class="prompt-card" onclick="showDemo(0)">
        <div class="emoji">📧</div>
        <h4>Draft Emails</h4>
        <p>"Write a follow-up to my client about the delayed shipment. Apologetic but professional."</p>
      </div>
      <div class="prompt-card" onclick="showDemo(1)">
        <div class="emoji">📝</div>
        <h4>Summarize Documents</h4>
        <p>"Summarize this 15-page report into 5 bullet points my boss will actually read."</p>
      </div>
      <div class="prompt-card" onclick="showDemo(2)">
        <div class="emoji">💡</div>
        <h4>Brainstorm Ideas</h4>
        <p>"Give me 10 team-building activities for a remote team of 12 on a $200 budget."</p>
      </div>
      <div class="prompt-card" onclick="showDemo(3)">
        <div class="emoji">📊</div>
        <h4>Analyze Data</h4>
        <p>"Look at these sales numbers and tell me which product is trending up and why."</p>
      </div>
      <div class="prompt-card" onclick="showDemo(4)">
        <div class="emoji">🎯</div>
        <h4>Solve Problems</h4>
        <p>"My team keeps missing deadlines. What are 5 practical things I can try this week?"</p>
      </div>
    </div>

    <!-- DEMO DISPLAY -->
    <div class="demo-container" id="demo-display" style="display:none">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
        <span style="font-size:.75rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--orange)">LIVE EXAMPLE</span>
        <button onclick="hideDemo()" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:1rem">&times;</button>
      </div>
      <div id="demo-chat"></div>
      </div>
  </div>
</div>

<!-- SECTION 3: WHAT CLAUDE CAN'T DO -->
<div class="lesson-section">
  <span class="section-label">Honesty Check</span>
  <h2 class="section-title">What Claude can't do.</h2>
  <p class="section-text">Being honest about limits is more important than hype. Claude is powerful, but it's not magic.</p>

  <div class="demo-container" style="padding:1.5rem">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div>
        <div style="font-size:.75rem;font-weight:700;color:var(--green);margin-bottom:.75rem;text-transform:uppercase;letter-spacing:1px">Claude CAN</div>
        <ul style="list-style:none;display:flex;flex-direction:column;gap:.5rem">
          <li style="font-size:.85rem;color:var(--dim);display:flex;gap:.5rem"><span style="color:var(--green)">✓</span> Write and edit text in your voice</li>
          <li style="font-size:.85rem;color:var(--dim);display:flex;gap:.5rem"><span style="color:var(--green)">✓</span> Analyze data and find patterns</li>
          <li style="font-size:.85rem;color:var(--dim);display:flex;gap:.5rem"><span style="color:var(--green)">✓</span> Summarize long documents</li>
          <li style="font-size:.85rem;color:var(--dim);display:flex;gap:.5rem"><span style="color:var(--green)">✓</span> Brainstorm and generate ideas</li>
          <li style="font-size:.85rem;color:var(--dim);display:flex;gap:.5rem"><span style="color:var(--green)">✓</span> Explain complex topics simply</li>
          <li style="font-size:.85rem;color:var(--dim);display:flex;gap:.5rem"><span style="color:var(--green)">✓</span> Help with code and formulas</li>
        </ul>
      </div>
      <div>
        <div style="font-size:.75rem;font-weight:700;color:var(--red);margin-bottom:.75rem;text-transform:uppercase;letter-spacing:1px">Claude CAN'T</div>
        <ul style="list-style:none;display:flex;flex-direction:column;gap:.5rem">
          <li style="font-size:.85rem;color:var(--dim);display:flex;gap:.5rem"><span style="color:var(--red)">✗</span> Access the internet in real time</li>
          <li style="font-size:.85rem;color:var(--dim);display:flex;gap:.5rem"><span style="color:var(--red)">✗</span> Remember past conversations (by default)</li>
          <li style="font-size:.85rem;color:var(--dim);display:flex;gap:.5rem"><span style="color:var(--red)">✗</span> Be 100% accurate on facts</li>
          <li style="font-size:.85rem;color:var(--dim);display:flex;gap:.5rem"><span style="color:var(--red)">✗</span> Replace human judgment</li>
          <li style="font-size:.85rem;color:var(--dim);display:flex;gap:.5rem"><span style="color:var(--red)">✗</span> Send emails or take actions for you</li>
          <li style="font-size:.85rem;color:var(--dim);display:flex;gap:.5rem"><span style="color:var(--red)">✗</span> Know about events after its training data</li>
        </ul>
      </div>
    </div>
  </div>

  <div class="tip-box">
    <div class="tip-label">Pro Tip</div>
    <p><strong>Always verify important facts.</strong> Claude is incredibly good at reasoning and writing, but it can occasionally get specific facts wrong. Think of it like a brilliant intern — trust the analysis, double-check the numbers.</p>
  </div>
</div>

<!-- SECTION 4: HOW TO ACCESS -->
<div class="lesson-section">
  <span class="section-label">Get Started</span>
  <h2 class="section-title">How to access Claude right now.</h2>
  <p class="section-text">You have options. All of them work. Pick the one that fits your life.</p>

  <div class="demo-container" style="padding:1.5rem">
    <div style="display:flex;flex-direction:column;gap:12px">
      <div style="display:flex;align-items:center;gap:1rem;padding:.75rem;background:var(--bg);border:1px solid var(--border);border-radius:10px">
        <span style="font-size:1.5rem">🌐</span>
        <div>
          <div style="font-weight:700;font-size:.9rem">claude.ai</div>
          <div style="color:var(--dim);font-size:.8rem">Free tier available. Use it in your browser right now. Best for getting started.</div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:1rem;padding:.75rem;background:var(--bg);border:1px solid var(--border);border-radius:10px">
        <span style="font-size:1.5rem">📱</span>
        <div>
          <div style="font-weight:700;font-size:.9rem">Claude iOS / Android App</div>
          <div style="color:var(--dim);font-size:.8rem">Same Claude, on your phone. Great for on-the-go tasks and voice input.</div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:1rem;padding:.75rem;background:var(--bg);border:1px solid var(--border);border-radius:10px">
        <span style="font-size:1.5rem">💻</span>
        <div>
          <div style="font-weight:700;font-size:.9rem">Claude Pro ($20/mo)</div>
          <div style="color:var(--dim);font-size:.8rem">More messages, bigger files, priority access. Worth it if you use it daily for work.</div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- KEY TAKEAWAY -->
<div class="callout purple">
  <p><strong>The key insight:</strong> Claude is not about AI. It's about <strong>you being better at your job</strong>. The people who win with AI aren't the most technical — they're the ones who learn to communicate clearly with it. That's what this course teaches.</p>
</div>

<!-- COMPLETION -->
<button class="complete-btn" id="completeBtn" onclick="completeLesson()">Complete Lesson 1 ✓</button>

<script>
const SLUG = 'claude-for-beginners';
const LESSON_NUM = 1;

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

// Demo examples
const demos = [
  {
    prompt: "Write a follow-up email to my client Sarah about the delayed Q3 shipment. Apologetic but professional. Keep it short.",
    response: "Subject: Update on Your Q3 Shipment\n\nHi Sarah,\n\nI wanted to reach out personally about the delay on your Q3 order. We hit an unexpected supply chain issue that pushed delivery back by about 5 business days.\n\nI understand this impacts your timeline, and I'm sorry for the inconvenience. Here's what we're doing:\n\n• Your order has been prioritized in our fulfillment queue\n• Expected delivery: October 18th\n• I'll send you tracking info the moment it ships\n\nIf this creates any issues on your end, let's talk — I want to make this right.\n\nBest,\n[Your name]"
  },
  {
    prompt: "Summarize this quarterly report into 5 bullet points my boss will actually read. Focus on what changed and what needs attention.",
    response: "Here are the 5 key takeaways:\n\n• Revenue up 12% QoQ ($2.3M → $2.58M), driven primarily by the new enterprise tier — exceeding the 8% target\n\n• Customer churn increased from 4.2% to 5.8% — the biggest red flag this quarter. Exit surveys point to pricing concerns in the mid-market segment\n\n• Support ticket volume down 23% after the self-service portal launch — this is working and saving roughly $45K/month in support costs\n\n• The APAC expansion is 3 weeks behind schedule due to compliance delays in Singapore. Not critical yet, but needs executive attention this month\n\n• Cash runway remains strong at 18 months, but the planned Q4 hire of 6 engineers will reduce that to ~14 months if revenue growth doesn't accelerate"
  },
  {
    prompt: "Give me 10 team-building activities for a remote team of 12 people. Budget is $200 total. We're mostly introverts who are sick of icebreakers.",
    response: "Here are 10 introvert-friendly, low-budget ideas:\n\n1. **Async Photo Challenge** ($0) — Weekly theme (workspace, pet, view from window). Share in Slack. No pressure to present.\n\n2. **Virtual Escape Room** (~$15/person = $180) — Teamwork without small talk. Try Enchambered or The Escape Game.\n\n3. **Book Club Light** ($0) — Pick one article per month. 30-min optional discussion. Written reactions also welcome.\n\n4. **Show & Tell, Your Way** ($0) — Each person shares one thing they're proud of (hobby, project, collection). 3 minutes max. Camera optional.\n\n5. **Collaborative Playlist** ($0) — Everyone adds 3 songs. Play during focus work. Surprisingly revealing.\n\n6. **$15 Coffee Roulette** ($180) — Random pairs get $15 DoorDash for coffee. Meet 1:1 for 20 min. Less draining than group calls.\n\n7. **Trivia Tournament** ($0) — Use free Kahoot. 3 rounds over 3 weeks. Async-friendly with leaderboard.\n\n8. **Skill Swap** ($0) — One person teaches something in 15 min. Could be Excel tricks, cooking tips, guitar chords.\n\n9. **Silent Co-working Hour** ($0) — Everyone on camera (optional), no talking. Just working together. Surprisingly bonding.\n\n10. **Appreciation Wall** ($0) — Shared doc where people write anonymous compliments. Read them aloud monthly."
  },
  {
    prompt: "Here are our monthly sales by product:\nWidget A: Jan $12K, Feb $14K, Mar $11K, Apr $15K, May $18K\nWidget B: Jan $8K, Feb $7K, Mar $9K, Apr $6K, May $5K\nWidget C: Jan $3K, Feb $4K, Mar $5K, Apr $6K, May $8K\n\nWhat's the story here?",
    response: "Here's what the data tells me:\n\n**Widget A** is your workhorse — strong and growing. Up 50% from Jan to May ($12K → $18K). The March dip looks like a one-month anomaly, not a trend. This is where your growth is coming from.\n\n**Widget B** is declining steadily. Down 37.5% ($8K → $5K) over 5 months. This isn't random — it's a consistent downward trend. You need to investigate: Is it seasonal? Has a competitor entered? Has pricing become uncompetitive?\n\n**Widget C** is your dark horse. It's small but growing fast — up 167% ($3K → $8K). If this growth rate continues, it'll overtake Widget B by July. Worth investing marketing dollars here.\n\n**The big picture:** Your total revenue is actually flat-ish ($23K → $31K), but the mix is shifting. Widget A and C are carrying you. Widget B needs a decision: fix it, reposition it, or sunset it.\n\n**My recommendation:** Double down on Widget C's momentum. Investigate Widget B's decline this week — talk to 5 customers who stopped buying."
  },
  {
    prompt: "My team keeps missing deadlines. I've tried reminders, project management tools, and team meetings. What are 5 practical things I can try this week?",
    response: "Here are 5 things you can actually implement this week:\n\n**1. Cut scope, not deadlines.** Most missed deadlines happen because the task was bigger than estimated, not because people are lazy. Try this: for every task, ask \"What's the minimum version of this that ships?\" Start there.\n\n**2. Make deadlines collaborative, not assigned.** When people set their own deadlines, they hit them 2x more often. Ask: \"When can you realistically finish this?\" Then hold them to THEIR number.\n\n**3. Add a Wednesday check-in.** Not a meeting — a Slack message. \"Where are you on X? Any blockers?\" This catches problems with 2 days to fix them instead of discovering them on Friday.\n\n**4. Identify your bottleneck person.** There's usually one person (or one approval step) that everything waits on. Find that bottleneck and either give them fewer tasks or create a backup approver.\n\n**5. Start a 15-minute Monday kickoff.** Literally 15 minutes. Everyone says their top 3 priorities for the week out loud. When people say it publicly, accountability increases dramatically. End with \"What could block you?\" and solve those first."
  }
];

function showDemo(idx) {
  const demo = demos[idx];
  const chat = document.getElementById('demo-chat');
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
  document.getElementById('demo-display').style.display = 'block';
  document.getElementById('demo-display').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function hideDemo() {
  document.getElementById('demo-display').style.display = 'none';
}
</script>
