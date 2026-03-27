---
title: "Business AI Quiz"
course: "ai-for-business"
order: 10
type: "quiz"
free: false
---<div class="wrap">
<a href="index.html" class="back">← Course Overview</a>
<div class="lesson-num">Lesson 10 of 10 — Final Assessment</div>
<h1>Business AI Readiness Quiz</h1>
<p class="intro">10 questions that test whether you're ready to lead your business into the AI era. This isn't about technical knowledge — it's about business judgment.</p>

<div class="progress-bar"><div class="progress-fill" id="progress-fill" style="width:0%"></div></div>
<div id="quiz-area"></div>
<div class="result-page" id="result-page"></div>

<div class="nav-row">
<a href="measuring-ai-success.html" class="nav-link">← Prev: Measuring Success</a>
<a href="index.html" class="nav-link">Back to Course Overview →</a>
</div>
</div>

<script>
const questions = [
  {
    q: "Your marketing team spends 15 hours/week writing social media posts. Your hourly cost is $40. An AI writing tool costs $49/month. What's the annual ROI if AI handles 50% of that work?",
    context: "Think about the math, not the tool.",
    opts: ["About 200%","About 1,500%","About 6,300%","It's not worth it"],
    ans: 2,
    explain: "50% of 15 hours = 7.5 hours/week saved. At $40/hr = $300/week = $15,600/year. Tool cost = $588/year. Net savings = $15,012. ROI = $15,012 / $588 = ~6,300%. AI tools almost always deliver massive ROI on repetitive tasks."
  },
  {
    q: "A vendor pitches you an AI solution that 'replaces your entire customer service team.' What's your best response?",
    context: "Remember what AI can and cannot do.",
    opts: ["Sign up immediately — labor is your biggest cost","Ask for a pilot program with a small portion of tickets","Decline — AI can't do customer service","Ask them to guarantee zero customer complaints"],
    ans: 1,
    explain: "A pilot program lets you test real results without betting the farm. AI can handle many support tasks, but 'replaces your entire team' is a red flag. Start small, measure results, then expand."
  },
  {
    q: "You're choosing between two AI tools. Tool A is free but sends your data to train their models. Tool B costs $30/month with a privacy guarantee. You handle customer financial data. Which do you choose?",
    context: "Consider your AI policy principles.",
    opts: ["Tool A — free is always better for a small business","Tool B — customer data privacy is non-negotiable","Neither — don't use AI with financial data","Use Tool A but anonymize the data first"],
    ans: 1,
    explain: "When handling customer financial data, privacy isn't optional. The $30/month is trivial compared to the cost of a data breach or lost customer trust. Tool B is the only responsible choice."
  },
  {
    q: "After using AI for one month, you've saved $2,000 in labor costs but your team's quality scores dropped from 8/10 to 6/10. What should you do?",
    context: "ROI isn't just about money.",
    opts: ["Keep going — $2,000/month in savings is great","Stop using AI immediately","Add a human review step to AI-generated work","Switch to a different AI tool"],
    ans: 2,
    explain: "Cost savings mean nothing if quality tanks. A human review step keeps the speed advantage of AI while maintaining your standards. This is the most common fix — AI drafts, humans review and finalize."
  },
  {
    q: "Which business area typically sees the FASTEST ROI from AI?",
    context: "Think about repetitiveness and volume.",
    opts: ["Strategic planning","Content creation and communication","Product development","Company culture building"],
    ans: 1,
    explain: "Content and communication tasks are high-volume, repetitive, and well-suited to AI. Writing emails, social posts, reports, and FAQs are where most businesses see results in the first week."
  },
  {
    q: "Your competitor announces they're 'fully AI-powered.' You should...",
    context: "Marketing claims vs. reality.",
    opts: ["Panic and rush to implement AI everywhere","Ignore it — it's just marketing hype","Study what specific tasks they've automated and learn from it","Hire an AI consultant immediately"],
    ans: 2,
    explain: "'Fully AI-powered' is almost always marketing. No business runs entirely on AI. But there may be specific things they've automated that you should learn from. Study their actual operations, not their press releases."
  },
  {
    q: "An employee uses ChatGPT to write a client proposal and sends it without review. The proposal contains a made-up case study. What's the systemic fix?",
    context: "Think policy, not punishment.",
    opts: ["Fire the employee","Ban all AI tools company-wide","Implement a mandatory human review process for all external AI content","It's fine — clients won't notice"],
    ans: 2,
    explain: "This is exactly why you need an AI policy. The fix isn't banning AI or firing people — it's creating a clear process. All AI-generated external content must be reviewed for accuracy before sending. That's the policy section we built in Lesson 8."
  },
  {
    q: "You want to automate your invoice processing. You get 50 invoices/month in various formats. What's the smartest first step?",
    context: "Remember the build vs. buy framework.",
    opts: ["Build a custom AI system from scratch","Sign up for an invoice automation SaaS tool","Hire a developer to build one","Keep doing it manually — 50 invoices isn't enough to justify AI"],
    ans: 1,
    explain: "This is a common, well-solved problem. Multiple SaaS tools handle invoice processing for $20-100/month. Building custom would cost thousands and take months. For common problems, buy before you build."
  },
  {
    q: "Which metric matters MOST when measuring AI success in your business?",
    context: "Think about what drives actual business results.",
    opts: ["Number of AI tools you're using","Hours saved per week","Revenue impact (time saved × hourly value - tool costs)","How impressed your team is with AI"],
    ans: 2,
    explain: "Revenue impact is the only metric that captures the full picture. Hours saved is good, but if those hours aren't valuable, it doesn't matter. Revenue impact factors in both the savings AND the costs. That's real ROI."
  },
  {
    q: "You've completed this course. What should you do FIRST on Monday morning?",
    context: "Implementation beats knowledge every time.",
    opts: ["Research 10 more AI tools before committing","Pick your highest-pain repetitive task and automate it with AI this week","Present a 30-slide AI strategy to your board","Wait for AI technology to mature before starting"],
    ans: 1,
    explain: "Action beats analysis. Pick ONE high-pain, repetitive task and automate it this week. You'll learn more from doing than from planning. Start small, prove the value, then expand."
  },
];

let currentQ = 0;
let score = 0;
let answers = [];
const quizArea = document.getElementById('quiz-area');

function renderQuestion(){
  if(currentQ >= questions.length){ showResults(); return; }
  const q = questions[currentQ];
  document.getElementById('progress-fill').style.width = (currentQ/questions.length*100)+'%';

  quizArea.innerHTML = `
    <div class="question-card">
      <div class="q-count">Question ${currentQ+1} of ${questions.length}</div>
      <div class="q-text">${q.q}</div>
      ${q.context ? `<div class="q-context">${q.context}</div>` : ''}
      <div class="q-opts">${q.opts.map((o,i)=>`<div class="q-opt" data-i="${i}">${o}</div>`).join('')}</div>
      <div class="q-explain" id="explain">${q.explain}</div>
    </div>
  `;

  quizArea.querySelectorAll('.q-opt').forEach(el => {
    el.addEventListener('click', () => {
      const idx = +el.dataset.i;
      const correct = idx === q.ans;
      answers.push({q:currentQ, correct, picked:idx});
      if(correct){ score++; el.classList.add('correct'); LO.sfx.success(); }
      else { el.classList.add('wrong'); quizArea.querySelector(`[data-i="${q.ans}"]`).classList.add('correct'); LO.sfx.error(); }
      quizArea.querySelectorAll('.q-opt').forEach(o=>o.classList.add('disabled'));
      document.getElementById('explain').classList.add('show');
      setTimeout(() => { currentQ++; renderQuestion(); }, 2500);
    });
  });
}

function showResults(){
  document.getElementById('progress-fill').style.width = '100%';
  quizArea.style.display = 'none';
  const pct = Math.round(score/questions.length*100);
  let grade, gradeClass, msg;
  if(pct >= 80){ grade='A — AI Ready'; gradeClass='grade-a'; msg="You're ready to lead your business into the AI era with confidence."; }
  else if(pct >= 60){ grade='B — Almost There'; gradeClass='grade-b'; msg="Solid foundation. Review the lessons you missed and you'll be fully ready."; }
  else { grade='C — Keep Learning'; gradeClass='grade-c'; msg="Good start, but review the course material before implementing AI decisions."; }

  const breakdown = answers.map((a,i) => {
    const q = questions[i];
    return `<div class="breakdown-row"><span class="breakdown-q">${i+1}. ${q.q.substring(0,60)}...</span><span class="breakdown-status ${a.correct?'right':'wrong'}">${a.correct?'Correct':'Missed'}</span></div>`;
  }).join('');

  const resultPage = document.getElementById('result-page');
  resultPage.className = 'result-page active';
  resultPage.innerHTML = `
    <div class="result-score">${pct}%</div>
    <div class="result-label">${score} of ${questions.length} correct</div>
    <div class="result-grade ${gradeClass}">${grade}</div>
    <p style="color:#a3a3a3;font-size:16px;margin-bottom:24px">${msg}</p>
    <div class="result-breakdown">${breakdown}</div>
    ${pct >= 60 ? `<div class="cert-card"><h3>Course Complete!</h3><p>You've finished AI for Business Owners. You now have the knowledge to evaluate AI tools, calculate ROI, implement responsibly, and measure results. Go make it happen.</p></div>` : ''}
    <div style="margin-top:24px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
      ${pct < 80 ? '<button class="btn-outline btn" onclick="retry()">Try Again</button>' : ''}
      <a href="index.html" class="btn" style="text-decoration:none">Back to Course</a>
    </div>
  `;

  if(pct >= 60){
    LO.completeLesson('ai-biz', 10, 120);
    LO.addXP(pct === 100 ? 200 : 50);
  }
  if(pct === 100) LO.unlockAchievement('quiz_master');
}

function retry(){
  currentQ = 0; score = 0; answers = [];
  quizArea.style.display = 'block';
  document.getElementById('result-page').className = 'result-page';
  renderQuestion();
}

renderQuestion();
</script>
