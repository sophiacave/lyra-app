---
title: "Creative AI Assessment"
course: "ai-for-creatives"
order: 10
type: "quiz"
free: false
---

<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-for-creatives/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 10 of 10 &mdash; Final Assessment</span>
</nav>

<div class="lesson-hero">
  <h1>Creative AI <span class="accent">Assessment.</span></h1>
  <p class="sub">8 questions that test whether you can wield AI as a creative tool -- not a creative crutch.</p>
</div>

<div class="learn-card">
  <h3>What this quiz covers</h3>
  <ul>
    <li>Building and curating your creative AI toolkit</li>
    <li>Advanced prompting techniques for creative output</li>
    <li>Content pipelines, batch creation, and quality control</li>
    <li>Ethics, copyright, originality, and disclosure</li>
  </ul>
</div>

<!-- QUIZ PROGRESS -->
<div class="quiz-progress" id="quiz-progress">
  <span class="quiz-dot active" id="dot-0"></span>
  <span class="quiz-dot" id="dot-1"></span>
  <span class="quiz-dot" id="dot-2"></span>
  <span class="quiz-dot" id="dot-3"></span>
  <span class="quiz-dot" id="dot-4"></span>
  <span class="quiz-dot" id="dot-5"></span>
  <span class="quiz-dot" id="dot-6"></span>
  <span class="quiz-dot" id="dot-7"></span>
</div>

<!-- QUIZ AREA -->
<!-- RESULTS -->
<script>
const SLUG = 'ai-for-creatives';
const LESSON_NUM = 10;

const questions = [
  {
    q: "You're a freelance designer evaluating AI tools. Which question should you ask FIRST before adding a new tool to your stack?",
    context: "Think about the 3-Question Filter from Lesson 6.",
    opts: [
      "Is this the most popular tool in my industry?",
      "Does this solve a real bottleneck in my current process?",
      "Is the free tier good enough to use forever?",
      "Can it replace my most expensive subscription?"
    ],
    ans: 1,
    explain: "The 3-Question Filter starts with: Does this solve a real bottleneck? Popularity, price, and replacement potential are secondary. If it doesn't address an actual friction point in YOUR workflow, it's just another subscription collecting dust."
  },
  {
    q: "You want AI to write in your personal style. What's the most effective approach?",
    context: "Remember the style transfer method from Lesson 7.",
    opts: [
      "Tell AI 'write casually' and hope for the best",
      "Feed AI 3-5 samples of your work and ask it to analyze your style, then use that analysis as a style anchor",
      "Copy a famous author's style and tweak it slightly",
      "Write very detailed prompts for every single piece"
    ],
    ans: 1,
    explain: "The style transfer method works in three steps: feed AI your work samples, have it analyze and describe your style, then use that description as a reusable style anchor. This gives AI a concrete blueprint instead of vague instructions -- and it scales across every piece you create."
  },
  {
    q: "During iterative prompting, your first AI output is decent but 'too formal.' What's the best next prompt?",
    context: "Think about the Pick & Push round from Lesson 7.",
    opts: [
      "Start over with a completely new prompt",
      "Accept it and edit manually -- AI can't adjust tone",
      "'Keep the structure but make it warmer and more conversational. Less corporate, more coffee shop.'",
      "'Make it less formal'"
    ],
    ans: 2,
    explain: "Effective iteration is specific about what to keep AND what to change. 'Keep the structure but make it warmer' preserves what works while directing the change. 'Make it less formal' is too vague. Starting over wastes the good parts. And AI absolutely can adjust tone -- that's one of its strengths."
  },
  {
    q: "In the content creation pipeline, which stage should always involve the MOST human creative input?",
    context: "Review the five pipeline stages from Lesson 8.",
    opts: [
      "Concept generation",
      "First draft creation",
      "Editing and refinement",
      "Repurposing across platforms"
    ],
    ans: 2,
    explain: "Editing and refinement is where your taste, judgment, and creative identity matter most. AI can brainstorm concepts and produce drafts efficiently, but the editorial decisions -- what stays, what gets cut, what gets rewritten -- are where your unique voice is protected. This is the quality gate."
  },
  {
    q: "You've been using AI for content creation for 3 months. Which signal suggests AI might be homogenizing your work?",
    context: "Think about the warning signs from Lesson 9.",
    opts: [
      "You're producing more content than before",
      "Your audience says your recent work feels 'different' -- and they don't mean that positively",
      "You're spending less time on research",
      "You've built a prompt library with 20+ prompts"
    ],
    ans: 1,
    explain: "When your audience notices a negative shift in your voice, that's the clearest sign of homogenization. Producing more content, spending less time on research, and having a big prompt library are all neutral or positive. But losing your distinctive voice -- the thing your audience connected with -- means AI's default patterns are overwriting yours."
  },
  {
    q: "A client asks you to write their website copy. You plan to use AI assistance. What's the most professional approach to disclosure?",
    context: "Consider the disclosure framework from Lesson 9.",
    opts: [
      "Don't mention it -- they're paying for results, not process",
      "Disclose after delivery so it doesn't affect their perception",
      "Be upfront: 'I use AI tools as part of my writing process for drafting and research. All final copy is reviewed, edited, and approved by me.'",
      "Refuse to use AI on client work"
    ],
    ans: 2,
    explain: "Upfront transparency is professional and builds trust. Hiding AI use and disclosing after delivery both feel deceptive. Refusing to use AI on principle leaves efficiency on the table. The best approach: be honest about your process, emphasize your editorial oversight, and let the quality of the work speak for itself."
  },
  {
    q: "You're batch-creating a month of social content. What's the most effective batching strategy?",
    context: "Review the batch creation methods from Lesson 8.",
    opts: [
      "Create one piece per day, every day, using AI each time",
      "Generate all 30 posts in a single AI session with one massive prompt",
      "Batch by format: write all captions in one session, all graphics briefs in another",
      "Let AI auto-schedule and auto-generate everything"
    ],
    ans: 2,
    explain: "Batching by format keeps you (and AI) in the right creative mode. Writing all captions at once produces more consistent voice than switching between formats daily. A single massive prompt loses nuance. Daily creation defeats the purpose of batching. And full automation removes the human quality control that keeps content good."
  },
  {
    q: "What is the single most important thing that protects your creative identity when working with AI?",
    context: "This is the big one. Think across everything you've learned.",
    opts: [
      "Using the most expensive AI tools available",
      "Never using AI for final drafts",
      "Your taste -- the creative judgment that decides what's good, what stays, and what gets cut",
      "Keeping your AI use secret so people think everything is 100% human-made"
    ],
    ans: 2,
    explain: "Your taste is your fingerprint. It's the thing AI cannot replicate -- your ability to look at output and know whether it's right or wrong, yours or not yours, good enough or not yet. Expensive tools, workflow rules, and secrecy don't protect your identity. Your creative judgment does. Sharpen it. Trust it. Never outsource it."
  }
];

let currentQ = 0;
let score = 0;
let answered = false;
let answers = [];
const quizArea = document.getElementById('quiz-area');

function updateDots() {
  for (let i = 0; i < questions.length; i++) {
    const dot = document.getElementById('dot-' + i);
    dot.className = 'quiz-dot';
    if (i === currentQ) dot.classList.add('active');
    if (answers[i] !== undefined) {
      dot.classList.add(answers[i] ? 'correct' : 'wrong');
    }
  }
}

function renderQuestion() {
  if (currentQ >= questions.length) { showResults(); return; }
  answered = false;
  const q = questions[currentQ];
  updateDots();

  quizArea.innerHTML = `
    <div class="quiz-question">
      <div class="q-count">Question ${currentQ + 1} of ${questions.length}</div>
      <div class="q-text">${q.q}</div>
      ${q.context ? `<div class="q-context">${q.context}</div>` : ''}
      <div class="quiz-options">
        ${q.opts.map((o, i) => `<div class="quiz-option" data-i="${i}">${o}</div>`).join('')}
      </div>
      </div>
  `;

  quizArea.querySelectorAll('.quiz-option').forEach(function(el) {
    el.addEventListener('click', function() {
      if (answered) return;
      answered = true;
      const idx = parseInt(el.dataset.i);
      const correct = idx === q.ans;
      answers[currentQ] = correct;
      if (correct) { score++; el.classList.add('correct'); }
      else {
        el.classList.add('wrong');
        quizArea.querySelector('[data-i="' + q.ans + '"]').classList.add('correct');
      }
      quizArea.querySelectorAll('.quiz-option').forEach(function(o) { o.classList.add('disabled'); });
      var fb = document.getElementById('feedback');
      fb.innerHTML = '<p>' + q.explain + '</p>';
      fb.classList.add('show');
      updateDots();
      if (typeof LO !== 'undefined') { correct ? LO.sfx.success() : LO.sfx.error(); }
      setTimeout(function() { currentQ++; renderQuestion(); }, 1200);
    });
  });
}

function showResults() {
  quizArea.style.display = 'none';
  const pct = Math.round(score / questions.length * 100);
  let grade, gradeClass, msg;

  if (pct >= 88) {
    grade = 'A — Creative AI Master';
    gradeClass = 'grade-a';
    msg = "You get it. AI is your tool, your taste is your compass, and your voice is non-negotiable. Go create something extraordinary.";
  } else if (pct >= 63) {
    grade = 'B — Almost There';
    gradeClass = 'grade-b';
    msg = "Strong foundation. Review the lessons you missed -- there are a few nuances that will level up your creative AI practice.";
  } else {
    grade = 'C — Keep Learning';
    gradeClass = 'grade-c';
    msg = "Good start, but revisit the course material. The difference between using AI and using AI well is in these details.";
  }

  var breakdown = answers.map(function(correct, i) {
    var q = questions[i];
    return '<div class="breakdown-row"><span class="breakdown-q">' + (i + 1) + '. ' + q.q.substring(0, 55) + '...</span><span class="breakdown-status ' + (correct ? 'right' : 'wrong') + '">' + (correct ? 'Correct' : 'Missed') + '</span></div>';
  }).join('');

  var resultPage = document.getElementById('result-page');
  resultPage.className = 'result-page active';
  resultPage.innerHTML = `
    <div class="result-score">${pct}%</div>
    <div class="result-label">${score} of ${questions.length} correct</div>
    <div class="result-grade ${gradeClass}">${grade}</div>
    <p style="color:#a3a3a3;font-size:16px;margin-bottom:24px;max-width:480px;margin-left:auto;margin-right:auto">${msg}</p>
    <div class="result-breakdown">${breakdown}</div>
    ${pct >= 63 ? '<div class="cert-card"><h3>Course Complete!</h3><p>You\'ve finished AI for Creatives. You now have the tools, techniques, and ethical framework to make AI a genuine creative partner -- without losing what makes your work yours. The future belongs to creatives who use every tool available and stay honest about it. That\'s you now.</p></div>' : ''}
    <div style="margin-top:24px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
      ${pct < 88 ? '<button class="btn-outline btn" onclick="retry()">Try Again</button>' : ''}
      <a href="/academy/ai-for-creatives/" class="btn" style="text-decoration:none">Back to Course</a>
    </div>
  `;

  if (pct >= 63) {
    if (typeof LO !== 'undefined') {
      LO.completeLesson(SLUG, LESSON_NUM, 120);
      LO.addXP(pct === 100 ? 200 : 50);
      if (pct === 100) LO.unlockAchievement('quiz_master');
    }
    var stored = localStorage.getItem('lo_progress_' + SLUG);
    var completed = stored ? JSON.parse(stored) : [];
    if (!completed.includes(LESSON_NUM)) {
      completed.push(LESSON_NUM);
      localStorage.setItem('lo_progress_' + SLUG, JSON.stringify(completed));
    }
  }
}

function retry() {
  currentQ = 0;
  score = 0;
  answered = false;
  answers = [];
  quizArea.style.display = 'block';
  document.getElementById('result-page').className = 'result-page';
  renderQuestion();
}

renderQuestion();
</script>
