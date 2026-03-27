---
title: "Final Assessment"
course: "claude-for-beginners"
order: 9
type: "quiz"
free: false
css: "claude-beginners.css"
---<div class="wrap">

<nav class="local-nav">
  <a href="/academy/claude-for-beginners/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 9 of 9</span>
</nav>

<div class="lesson-hero">
  <h1>Final <span class="accent">Assessment.</span></h1>
  <p class="sub">12 questions across all 3 modules. Score 8 or higher to earn your completion. You've got this.</p>
</div>

<button class="complete-btn" id="completeBtn" onclick="completeLesson()" style="display:none">Complete Course ✓</button>

</div>

<script>
const SLUG = 'claude-for-beginners';
const LESSON_NUM = 9;

const QUESTIONS = [
  {
    module: 'Module 1',
    q: "What is Claude BEST described as?",
    options: ["A search engine", "An AI assistant you talk to in plain English", "A coding tool", "A chatbot with pre-written responses"],
    correct: 1,
    explanation: "Claude is an AI assistant by Anthropic that understands natural language. You talk to it like a person — no special syntax or commands needed."
  },
  {
    module: 'Module 1',
    q: "What should you ALWAYS do with important facts from Claude?",
    options: ["Trust them completely", "Verify them independently", "Ignore them", "Ask Claude to double-check itself"],
    correct: 1,
    explanation: "Claude can occasionally get specific facts wrong. Always verify important claims with a reliable source before using them in presentations, reports, or decisions."
  },
  {
    module: 'Module 1',
    q: "What makes a good prompt?",
    options: ["Keep it as short as possible", "Use technical jargon", "Be specific about what you want, include context, and describe the desired output", "Start with \"please\" and \"thank you\""],
    correct: 2,
    explanation: "Great prompts are specific, contextual, and describe what you want back. The more Claude knows about your situation and desired format, the better the result."
  },
  {
    module: 'Module 1',
    q: "Claude can't do which of the following?",
    options: ["Write emails", "Analyze data", "Access the internet in real time", "Summarize documents"],
    correct: 2,
    explanation: "Claude works from its training data — it doesn't browse the web in real time. That's why providing context and verifying time-sensitive facts is important."
  },
  {
    module: 'Module 2',
    q: "You want Claude to reply to a client email. What gives the BEST result?",
    options: ["\"Write a reply\"", "Paste the full thread, explain the relationship, and describe what you want to say", "Forward the email to Claude's email address", "Only paste the subject line"],
    correct: 1,
    explanation: "Claude needs full context to write a great reply. The thread shows conversation history, the relationship context sets the tone, and your intent guides the response."
  },
  {
    module: 'Module 2',
    q: "For a 50-page document, the best approach is to:",
    options: ["Paste it all at once", "Upload the file and ask for specific sections or use the chunk strategy", "Skip it and use a different tool", "Summarize it yourself first"],
    correct: 1,
    explanation: "Uploading the file gives Claude the full document. You can then target specific sections or use the chunking strategy for deeper analysis of each part."
  },
  {
    module: 'Module 2',
    q: "Which is NOT a good summary style to request from Claude?",
    options: ["Executive summary", "Action items only", "\"Just make it shorter\" with no other guidance", "ELI5"],
    correct: 2,
    explanation: "\"Just make it shorter\" gives Claude no direction on what to prioritize. Specific styles like executive summary, action items, or ELI5 produce far better results."
  },
  {
    module: 'Module 2',
    q: "The copy-paste workflow is effective because:",
    options: ["It's the only way to use Claude", "It works on any Claude tier and with any app or tool", "Claude prefers pasted text", "It's faster than typing"],
    correct: 1,
    explanation: "Copy-paste is universal — it works on Free or Pro, with Gmail or Outlook, Slack or Teams. No special integrations needed. Just copy, paste, and prompt."
  },
  {
    module: 'Module 3',
    q: "Custom instructions help you by:",
    options: ["Making Claude faster", "Giving Claude persistent context about your preferences and role", "Unlocking secret features", "Saving money on your subscription"],
    correct: 1,
    explanation: "Custom instructions let Claude know who you are, what you do, and how you like responses — so every conversation starts with that context already loaded."
  },
  {
    module: 'Module 3',
    q: "Claude's memory within a conversation means:",
    options: ["Claude remembers everything forever", "Claude can reference what you've discussed in the current conversation", "Claude stores your data on its servers", "Claude can access your files after you close the chat"],
    correct: 1,
    explanation: "Within a single conversation, Claude remembers everything discussed. But each new conversation starts fresh — context doesn't carry over automatically."
  },
  {
    module: 'Module 3',
    q: "A good personal assistant setup includes:",
    options: ["Custom instructions, a prompt library, and a daily routine", "Only custom instructions", "Letting Claude decide everything", "Using Claude only for emergencies"],
    correct: 0,
    explanation: "The trifecta: custom instructions (persistent context), a prompt library (reusable templates), and a daily routine (consistent habits) — this turns Claude into a true personal assistant."
  },
  {
    module: 'Module 3',
    q: "The MOST important skill this course teaches is:",
    options: ["How to write code", "How to communicate clearly and specifically with AI", "How to replace human workers", "How to use every AI tool"],
    correct: 1,
    explanation: "Clear, specific communication is the master skill. Every technique in this course — prompting, context-setting, formatting requests — comes down to communicating effectively with AI."
  }
];

function shuffleOptions(q) {
  const indices = q.options.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return {
    options: indices.map(i => q.options[i]),
    correct: indices.indexOf(q.correct)
  };
}

const shuffled = QUESTIONS.map(q => {
  const s = shuffleOptions(q);
  return { ...q, options: s.options, correct: s.correct };
});

let current = 0;
let score = 0;
let answered = false;

function renderProgress() {
  const el = document.getElementById('quiz-progress');
  el.innerHTML = shuffled.map((_, i) => ``).join('');
}

function renderQuestion() {
  const q = shuffled[current];
  answered = false;
  renderProgress();
  document.getElementById('quiz-area').innerHTML = `
    <div class="quiz-question">
      <span class="module-label">${q.module} &middot; Question ${current + 1} of 12</span>
      <h2>${q.q}</h2>
      <div class="quiz-options">
        ${q.options.map((opt, i) => `<button class="quiz-option" onclick="answer(${i})">${opt}</button>`).join('')}
      </div>
      </div>
  `;
}

function answer(idx) {
  if (answered) return;
  answered = true;
  const q = shuffled[current];
  const btns = document.querySelectorAll('.quiz-option');
  const fb = document.getElementById('feedback');

  btns.forEach((btn, i) => {
    btn.style.pointerEvents = 'none';
    if (i === q.correct) btn.classList.add('correct');
    if (i === idx && idx !== q.correct) btn.classList.add('wrong');
  });

  const dot = document.getElementById('dot-' + current);
  if (idx === q.correct) {
    score++;
    dot.classList.add('correct');
    fb.className = 'quiz-feedback visible correct';
    fb.innerHTML = `<strong>Correct!</strong> ${q.explanation}`;
  } else {
    dot.classList.add('wrong');
    fb.className = 'quiz-feedback visible wrong';
    fb.innerHTML = `<strong>Not quite.</strong> ${q.explanation}`;
  }

  setTimeout(() => {
    current++;
    if (current < shuffled.length) {
      renderQuestion();
    } else {
      showResults();
    }
  }, 2800);
}

function launchConfetti() {
  const container = document.createElement('div');
  container.className = 'confetti-container';
  document.body.appendChild(container);
  const colors = ['#fb923c','#c084fc','#f59e0b','#34d399','#60a5fa','#f472b6','#fbbf24','#a78bfa'];
  for (let i = 0; i < 120; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.width = (Math.random() * 8 + 6) + 'px';
    piece.style.height = (Math.random() * 8 + 6) + 'px';
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    piece.style.animationDelay = (Math.random() * 2) + 's';
    piece.style.animationDuration = (Math.random() * 2 + 2.5) + 's';
    container.appendChild(piece);
  }
  setTimeout(() => container.remove(), 5000);
}

function showResults() {
  const pass = score >= 8;
  const certified = score >= 10;
  let badge, badgeClass, msg, shareText;

  if (certified) {
    badge = 'Claude Certified';
    badgeClass = 'gold';
    msg = "Claude Certified! You're ready to transform your workflow.";
    shareText = `I just completed Claude for Beginners at Like One Academy and scored ${score}/12 — Claude Certified! 🎓✨ If you want to learn how to use AI effectively, check it out: likeone.ai/academy/claude-for-beginners/`;
    setTimeout(launchConfetti, 300);
  } else if (pass) {
    badge = 'Course Complete';
    badgeClass = 'silver';
    msg = "Great job! You've got a solid foundation.";
    shareText = `I just completed Claude for Beginners at Like One Academy with a score of ${score}/12! 🎓 Learn how to use AI effectively: likeone.ai/academy/claude-for-beginners/`;
  } else {
    badge = 'Almost There';
    badgeClass = 'retry';
    msg = "Almost there! Review the lessons and try again.";
    shareText = '';
  }

  document.getElementById('quiz-area').style.display = 'none';
  document.getElementById('results-area').style.display = 'block';
  document.getElementById('results-area').innerHTML = `
    <div class="results-card ${certified ? 'certified' : ''}">
      <div class="score-display">${score}/12</div>
      <span class="cert-badge ${badgeClass}">${badge}</span>
      <p style="font-size:1.1rem;margin-top:.75rem">${msg}</p>
      ${pass && shareText ? `
      <div class="share-section">
        <h3>Share Your Result</h3>
        <textarea class="share-text" id="shareText" readonly>${shareText}</textarea>
        <button class="copy-share-btn" id="copyShareBtn" onclick="copyShare()">Copy to Clipboard</button>
      </div>` : ''}
      <div class="results-actions">
        <button onclick="retryQuiz()" class="btn btn-secondary">Try Again</button>
        <a href="/academy/claude-for-beginners/" class="btn btn-primary">Back to Course Home</a>
        <a href="/academy/" class="btn btn-secondary">Explore More Courses</a>
      </div>
    </div>
  `;

  if (pass) {
    completeLesson();
    document.getElementById('completeBtn').style.display = 'block';
    document.getElementById('completeBtn').classList.add('visible');
  }
}

function copyShare() {
  const text = document.getElementById('shareText');
  text.select();
  document.execCommand('copy');
  const btn = document.getElementById('copyShareBtn');
  btn.textContent = 'Copied!';
  btn.classList.add('copied');
  setTimeout(() => { btn.textContent = 'Copy to Clipboard'; btn.classList.remove('copied'); }, 2000);
}

function retryQuiz() {
  current = 0; score = 0;
  const reshuffled = QUESTIONS.map(q => {
    const s = shuffleOptions(q);
    return { ...q, options: s.options, correct: s.correct };
  });
  shuffled.length = 0;
  reshuffled.forEach(q => shuffled.push(q));
  document.getElementById('results-area').style.display = 'none';
  document.getElementById('quiz-area').style.display = 'block';
  document.getElementById('completeBtn').style.display = 'none';
  renderQuestion();
}

function completeLesson() {
  const stored = localStorage.getItem('lo_progress_' + SLUG);
  const completed = stored ? JSON.parse(stored) : [];
  if (!completed.includes(LESSON_NUM)) { completed.push(LESSON_NUM); localStorage.setItem('lo_progress_' + SLUG, JSON.stringify(completed)); }
  const btn = document.getElementById('completeBtn');
  btn.textContent = 'Course Completed! ✨'; btn.style.background = 'var(--green)'; btn.style.pointerEvents = 'none';
}

(function() {
  const stored = localStorage.getItem('lo_progress_' + SLUG);
  const completed = stored ? JSON.parse(stored) : [];
  if (completed.includes(LESSON_NUM)) {
    const btn = document.getElementById('completeBtn');
    btn.style.display = 'block'; btn.classList.add('visible');
    btn.textContent = 'Course Completed! ✨'; btn.style.background = 'var(--green)'; btn.style.pointerEvents = 'none';
  }
})();

renderQuestion();
</script>
