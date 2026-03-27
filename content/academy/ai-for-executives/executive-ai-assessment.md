---
title: "Executive AI Assessment"
course: "ai-for-executives"
order: 10
type: "quiz"
free: false
---<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-for-executives/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 10 of 10 — Final Assessment</span>
</nav>

<!-- HERO -->
<div class="lesson-hero">
  <h1>Executive AI <span class="accent">Assessment.</span></h1>
  <p class="sub">8 questions that separate executives who understand AI from those who just talk about it. No jargon. No trick questions. Just business judgment.</p>
</div>

<div class="nav-row">
  
  <a href="/academy/ai-for-executives/" class="nav-link">Back to Course Overview &rarr;</a>
</div>
<!-- QUIZ PROGRESS -->
<div class="quiz-progress" id="quiz-progress"></div>

<!-- QUIZ AREA -->
<div id="quiz-area"></div>

<!-- FEEDBACK -->
<div id="feedback" class="quiz-feedback"></div>

<!-- RESULTS -->
<div id="result-page" class="result-page"></div>

</div>

<script>
const questions = [
  {
    q: "A vendor demos an AI tool that performs flawlessly on their sample data. Before signing a contract, your most important next step is:",
    opts: [
      "Negotiate the price down while they're eager",
      "Ask to run a pilot with YOUR real data for 30-90 days",
      "Check their website for customer testimonials",
      "Ask your IT team if the technology is cutting-edge"
    ],
    ans: 1,
    explain: "Demos with vendor-curated data prove nothing about real-world performance. A pilot with your actual data, your edge cases, and your team's workflows is the only way to evaluate an AI tool. Any vendor unwilling to offer this isn't confident in their product."
  },
  {
    q: "Your CFO asks for the AI budget. Using the framework from this course, approximately what percentage should go to PEOPLE (hiring, upskilling, change management)?",
    opts: [
      "20% — most of the budget should go to tools",
      "40% — split evenly between people and technology",
      "60% — people are the primary investment",
      "90% — tools are basically free now"
    ],
    ans: 2,
    explain: "The 60/20/10/10 framework allocates 60% to people, 20% to tools and platforms, 10% to data preparation, and 10% to training and change management. The best AI tools are worthless without people who know how to deploy and maintain them."
  },
  {
    q: "Your head of manufacturing wants to implement predictive maintenance AI. The factory floor has no sensors on critical equipment. What do you do?",
    opts: [
      "Buy the AI platform first and add sensors later",
      "Tell them AI isn't ready for manufacturing yet",
      "Fund the sensor infrastructure first — AI needs data to work",
      "Hire a data scientist to work with the data you have"
    ],
    ans: 2,
    explain: "Predictive maintenance AI requires real-time sensor data. Without sensors, there's no data. Without data, there's no AI. Infrastructure readiness comes before tool selection. Fund the sensors, get 3-6 months of baseline data, then deploy the AI."
  },
  {
    q: "An AI tool your team adopted three months ago has a 92% accuracy rate on customer inquiry classification. Half the team refuses to use it, saying they 'don't trust it.' The best response is:",
    opts: [
      "Mandate usage — the numbers prove it works",
      "Remove the tool — team buy-in matters more than accuracy",
      "Show the team the accuracy data AND build a human review step for the 8% it gets wrong",
      "Replace the resistant team members with people who embrace technology"
    ],
    ans: 2,
    explain: "Resistance usually comes from lack of understanding and lack of control. Showing the data builds trust. Adding a human review step gives the team agency over AI errors. Mandating usage creates resentment. This is culture change, not a technology problem."
  },
  {
    q: "You're evaluating your organization's AI maturity. You have two pilot projects running, a small budget, and an informal AI champion, but no formal governance or training program. What stage are you in?",
    opts: [
      "Stage 1: AI-Curious",
      "Stage 2: AI-Exploring",
      "Stage 3: AI-Implementing",
      "Stage 4: AI-Integrated"
    ],
    ans: 1,
    explain: "Stage 2 (AI-Exploring) is characterized by first pilot projects, small budget allocation, an informal AI champion, and basic policies. The next priority is formalizing governance, assigning a dedicated AI Champion, and building a structured training program to move toward Stage 3."
  },
  {
    q: "A competitor announces they're 'fully AI-powered' and the board is concerned you're falling behind. Your response should be:",
    opts: [
      "Fast-track every AI initiative to catch up immediately",
      "Hire a Chief AI Officer and give them a blank check",
      "Analyze which specific capabilities they've deployed and assess whether those apply to your business",
      "Ignore it — marketing claims don't affect market share"
    ],
    ans: 2,
    explain: "'Fully AI-powered' is almost always marketing. But competitive AI adoption is real. The executive response is to analyze specifically what they've deployed, assess relevance to your strategy, and accelerate where it matters. Panic-buying AI tools wastes budget. Ignoring the market loses ground."
  },
  {
    q: "Your legal team flags that an AI vendor's contract allows them to use your data to train their models. You should:",
    opts: [
      "Sign anyway — that's how all AI products work",
      "Negotiate a data ownership clause: your data stays yours, no training without written consent",
      "Reject the vendor entirely — this is always unacceptable",
      "Ask IT to anonymize all data before sending it to the vendor"
    ],
    ans: 1,
    explain: "Data ownership is a non-negotiable contract term. Your data should remain yours, never be used for model training without explicit written consent, and be fully deletable on contract termination. Many vendors will agree to these terms when pressed. Walk away from those who won't."
  },
  {
    q: "You have budget for ONE AI hire this year. Based on the team-building framework, who should it be?",
    opts: [
      "A machine learning engineer to build custom models",
      "A data scientist to analyze patterns in your data",
      "An AI Champion — a senior leader to own AI strategy and vendor evaluation",
      "A prompt engineer to optimize your team's AI usage"
    ],
    ans: 2,
    explain: "The AI Champion is always the first hire. This is a senior leader who owns AI strategy, evaluates vendors, drives adoption, and bridges the gap between business needs and AI capabilities. Without strategic leadership, technical hires build solutions nobody uses."
  }
];

let currentQ = 0;
let score = 0;
let answers = [];

const quizArea = document.getElementById('quiz-area');
const progressEl = document.getElementById('quiz-progress');

function renderDots() {
  progressEl.innerHTML = '';
  for (let i = 0; i < questions.length; i++) {
    const dot = document.createElement('span');
    dot.className = 'quiz-dot';
    if (i < currentQ) dot.classList.add('filled');
    if (i === currentQ) dot.classList.add('current');
    progressEl.appendChild(dot);
  }
}

function renderQuestion() {
  if (currentQ >= questions.length) { showResults(); return; }
  renderDots();

  const q = questions[currentQ];
  quizArea.innerHTML = `
    <div class="quiz-question">
      <div class="q-count">Question ${currentQ + 1} of ${questions.length}</div>
      <div class="q-text">${q.q}</div>
      <div class="quiz-options">
        ${q.opts.map((o, i) => `<div class="quiz-option" data-i="${i}">${o}</div>`).join('')}
      </div>
      <div class="quiz-feedback" id="feedback">${q.explain}</div>
    </div>
  `;

  quizArea.querySelectorAll('.quiz-option').forEach(el => {
    el.addEventListener('click', () => {
      const idx = +el.dataset.i;
      const correct = idx === q.ans;
      answers.push({ q: currentQ, correct, picked: idx });

      if (correct) {
        score++;
        el.classList.add('correct');
        if (typeof LO !== 'undefined' && LO.sfx) LO.sfx.success();
      } else {
        el.classList.add('wrong');
        quizArea.querySelector(`[data-i="${q.ans}"]`).classList.add('correct');
        if (typeof LO !== 'undefined' && LO.sfx) LO.sfx.error();
      }

      quizArea.querySelectorAll('.quiz-option').forEach(o => o.classList.add('disabled'));
      document.getElementById('feedback').classList.add('show');

      setTimeout(() => {
        currentQ++;
        renderQuestion();
      }, 2800);
    });
  });
}

function showResults() {
  renderDots();
  quizArea.style.display = 'none';
  const pct = Math.round(score / questions.length * 100);
  let grade, gradeClass, msg;

  if (pct >= 88) {
    grade = 'A — AI-Ready Executive';
    gradeClass = 'grade-a';
    msg = "You have the judgment and frameworks to lead AI transformation with confidence. Your organization is in good hands.";
  } else if (pct >= 75) {
    grade = 'A- — Strong Foundation';
    gradeClass = 'grade-a';
    msg = "Solid executive AI instincts. Review the one or two areas you missed and you're ready to lead.";
  } else if (pct >= 63) {
    grade = 'B — Getting There';
    gradeClass = 'grade-b';
    msg = "Good grasp of the fundamentals. Revisit the vendor selection and team-building lessons to strengthen your approach.";
  } else if (pct >= 50) {
    grade = 'B- — Building Knowledge';
    gradeClass = 'grade-b';
    msg = "You understand the basics but need more depth on execution frameworks. Review lessons 6-9 before making major AI decisions.";
  } else {
    grade = 'C — More Study Needed';
    gradeClass = 'grade-c';
    msg = "AI leadership requires deeper understanding of vendor evaluation, team building, and organizational readiness. Review the full course before committing budget.";
  }

  const breakdown = answers.map((a, i) => {
    const q = questions[i];
    const shortQ = q.q.length > 70 ? q.q.substring(0, 70) + '...' : q.q;
    return `<div class="breakdown-row">
      <span class="breakdown-q">${i + 1}. ${shortQ}</span>
      <span class="breakdown-status ${a.correct ? 'right' : 'wrong'}">${a.correct ? 'Correct' : 'Missed'}</span>
    </div>`;
  }).join('');

  const resultPage = document.getElementById('result-page');
  resultPage.className = 'result-page active';
  resultPage.innerHTML = `
    <div class="result-score">${pct}%</div>
    <div class="result-label">${score} of ${questions.length} correct</div>
    <div class="result-grade ${gradeClass}">${grade}</div>
    <p style="color:#a3a3a3;font-size:16px;margin-bottom:24px;max-width:600px;margin-left:auto;margin-right:auto">${msg}</p>
    <div class="result-breakdown">${breakdown}</div>
    ${pct >= 63 ? `
    <div class="cert-card">
      <h3>AI for Executives — Complete</h3>
      <p>You've finished the AI for Executives course. You now have frameworks for vendor evaluation, industry-specific AI deployment, team building, organizational readiness, and strategic decision-making. The next step is execution.</p>
    </div>` : ''}
    <div style="margin-top:24px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
      ${pct < 88 ? '<button class="btn-outline btn" onclick="retry()">Try Again</button>' : ''}
      <a href="/academy/ai-for-executives/" class="btn" style="text-decoration:none">Back to Course</a>
    </div>
  `;

  if (typeof LO !== 'undefined') {
    if (pct >= 63) {
      LO.completeLesson('ai-exec', 10, 150);
      LO.addXP(pct >= 88 ? 200 : 50);
    }
    if (pct === 100 && LO.unlockAchievement) LO.unlockAchievement('quiz_master');
  }
}

function retry() {
  currentQ = 0;
  score = 0;
  answers = [];
  quizArea.style.display = 'block';
  document.getElementById('result-page').className = 'result-page';
  renderQuestion();
}

renderQuestion();
</script>
