---
title: "Your First Week with AI"
course: "ai-for-business"
order: 7
type: "lesson"
free: false
---<div class="wrap">
<a href="index.html" class="back">← Course Overview</a>
<div class="lesson-num">Lesson 7 of 10</div>
<h1>Your First Week with AI</h1>
<p class="intro">Five days. Five missions. By Friday, you'll have real experience with AI — not just theory. Check off each task as you complete it.</p>

<div class="progress-overview">
<div class="progress-ring">
<svg width="64" height="64"><circle class="bg" cx="32" cy="32" r="28"/><circle class="fill" id="ring-fill" cx="32" cy="32" r="28" stroke-dasharray="176" stroke-dashoffset="176"/></svg>
<div class="progress-pct" id="ring-pct">0%</div>
</div>
<div class="progress-text"><strong id="tasks-done">0</strong> of <strong>15</strong> tasks complete</div>
</div>

<div id="days-container"></div>
<div class="complete-banner" id="complete-banner">
<div class="icon">🎉</div>
<h2>Week Complete!</h2>
<p>You just did more with AI in 5 days than most business owners do in 6 months. You're ready to scale this across your whole operation.</p>
</div>

<div class="nav-row">
<a href="ai-tools-landscape.html" class="nav-link">← Prev: AI Tools</a>
<a href="ai-policy-template.html" class="nav-link">Next: AI Policy Template →</a>
</div>
</div>

<script>
const days = [
  {day:1, title:"Get Set Up", subtitle:"Sign up and do 3 real tasks", tasks:[
    {title:"Sign up for Claude or ChatGPT (free tier)", desc:"Go to claude.ai or chat.openai.com. Create an account. Takes 2 minutes.", tip:"Pro tip: Claude is better for business writing, ChatGPT is better for creative brainstorming."},
    {title:"Ask AI to summarize a long email or document", desc:"Paste something real from your inbox. Ask: 'Summarize this in 3 bullet points.'", tip:"Notice how it pulls out the key points instantly? That's 10 minutes saved."},
    {title:"Have AI draft a response to a tricky email", desc:"Paste the email and say: 'Write a professional response that declines politely but keeps the door open.'", tip:"Edit the draft to match your voice. It's faster to edit than to write from scratch."},
  ]},
  {day:2, title:"Automate One Workflow", subtitle:"Stop doing repetitive email work", tasks:[
    {title:"Identify your most repetitive email type", desc:"Look at your sent folder. What do you write over and over? Follow-ups? Thank yous? Status updates?", tip:"Most business owners send 5-10 versions of the same email every week."},
    {title:"Create 3 templates with AI", desc:"Tell AI: 'Create 3 email templates for [your scenario]. Professional tone. Include a subject line.'", tip:"Save these somewhere you can grab them fast — a Google Doc or email drafts folder."},
    {title:"Use them for real today", desc:"Actually send at least one AI-drafted email (after reviewing and editing it, of course).", tip:"Time yourself. Most people cut email time by 60% with templates."},
  ]},
  {day:3, title:"Create Content", subtitle:"Use AI to produce real business content", tasks:[
    {title:"Generate 5 social media posts for your business", desc:"Tell AI your business, your audience, and your goal. Ask for 5 posts with different angles.", tip:"'Write 5 LinkedIn posts for a [your business] targeting [your customer]. Mix educational and promotional.'"},
    {title:"Draft a blog post or newsletter outline", desc:"Give AI a topic relevant to your customers. Ask for an outline with key points and a strong opening.", tip:"Don't publish AI content without adding your own experience and perspective."},
    {title:"Create a customer FAQ page", desc:"List your 10 most common questions. Ask AI to write clear, helpful answers in your brand voice.", tip:"This one saves the most time — every FAQ you write is one less support email you'll answer."},
  ]},
  {day:4, title:"Analyze Your Data", subtitle:"Turn numbers into decisions", tasks:[
    {title:"Upload a spreadsheet to an AI tool", desc:"Use Julius AI (free) or ChatGPT with data analysis. Upload last month's sales, expenses, or customer data.", tip:"Even a simple CSV export from your accounting software works perfectly."},
    {title:"Ask 3 business questions about your data", desc:"Try: 'What are my top 3 revenue sources?' 'Where am I overspending?' 'What trends do you see?'", tip:"AI finds patterns humans miss. Ask follow-up questions when something surprises you."},
    {title:"Create one chart or summary for your team", desc:"Ask AI to create a visual summary you can share. 'Make a chart showing monthly revenue trends.'", tip:"One clear chart replaces a 20-minute meeting."},
  ]},
  {day:5, title:"Measure Your Results", subtitle:"Quantify what you saved this week", tasks:[
    {title:"Estimate hours saved this week", desc:"Add up: time saved on emails + content + data analysis + repetitive tasks.", tip:"Most people save 3-5 hours in their first week. That scales to 150+ hours per year."},
    {title:"Calculate the dollar value", desc:"Multiply hours saved by your hourly rate (or the hourly cost of whoever would do this work).", tip:"If you saved 4 hours at $50/hr, that's $200 this week — $10,400 per year."},
    {title:"Write down your top 3 AI use cases going forward", desc:"Based on this week, which 3 tasks will you keep using AI for? Commit to them.", tip:"Consistency is the ROI multiplier. One-off use doesn't build momentum."},
  ]},
];

const STORAGE_KEY = 'ai-biz-week-tasks';
let taskStates = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
const container = document.getElementById('days-container');

days.forEach(day => {
  const card = document.createElement('div');
  card.className = `day-card day-${day.day}`;
  const tasksHTML = day.tasks.map((t,i) => {
    const key = `${day.day}-${i}`;
    const done = taskStates[key];
    return `<div class="task"><div class="task-check ${done?'done':''}" data-key="${key}">${done?'✓':''}</div><div class="task-content"><div class="task-title">${t.title}</div><div class="task-desc">${t.desc}</div><div class="task-tip">${t.tip}</div></div></div>`;
  }).join('');

  card.innerHTML = `<div class="day-header"><div class="day-badge">Day ${day.day}</div><div class="day-info"><div class="day-title">${day.title}</div><div class="day-subtitle">${day.subtitle}</div></div><div class="day-status" id="status-${day.day}">▸</div></div><div class="day-body" id="body-${day.day}">${tasksHTML}</div>`;
  container.appendChild(card);

  card.querySelector('.day-header').addEventListener('click', () => {
    const body = document.getElementById('body-'+day.day);
    const status = document.getElementById('status-'+day.day);
    const isOpen = body.classList.contains('open');
    body.classList.toggle('open');
    status.textContent = isOpen ? '▸' : '▾';
  });
});

// Open day 1 by default
document.getElementById('body-1').classList.add('open');
document.getElementById('status-1').textContent = '▾';

document.querySelectorAll('.task-check').forEach(el => {
  el.addEventListener('click', () => {
    const key = el.dataset.key;
    const done = !taskStates[key];
    taskStates[key] = done;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(taskStates));
    el.classList.toggle('done', done);
    el.textContent = done ? '✓' : '';
    if(done) LO.sfx.success(); else LO.sfx.click();
    updateProgress();
  });
});

function updateProgress(){
  const total = 15;
  const done = Object.values(taskStates).filter(Boolean).length;
  document.getElementById('tasks-done').textContent = done;
  const pct = Math.round(done/total*100);
  document.getElementById('ring-pct').textContent = pct+'%';
  const circ = 2 * Math.PI * 28;
  document.getElementById('ring-fill').style.strokeDashoffset = circ - (circ * pct / 100);
  if(done >= 10){
    LO.completeLesson('ai-biz', 7, 120);
  }
  if(done >= 15){
    document.getElementById('complete-banner').style.display = 'block';
  }
}
updateProgress();
</script>
