---
title: "Check Your Understanding"
course: "claude-for-beginners"
order: 3
type: "quiz"
free: true
css: "claude-beginners.css"
---<div class="wrap">

<nav class="local-nav">
  <a href="/academy/claude-for-beginners/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 3 of 9</span>
</nav>

<div class="lesson-hero">
  <h1>Check Your <span class="accent">Understanding.</span></h1>
  <p class="sub">6 quick questions to make sure the fundamentals are solid before we move to real workflows.</p>
</div>

<!-- QUIZ — React QuizMC component hydrated client-side -->
<div data-learn="QuizMC" data-props='{"questions":[{"q":"What is Claude?","options":["A search engine that finds web links","An AI assistant that reads, writes, and analyzes","A chatbot that only answers yes or no","A coding tool for software developers only"],"correct":1,"explanation":"Claude is an AI assistant made by Anthropic. It can read, write, analyze data, brainstorm, and much more — all through natural conversation."},{"q":"What are the 3 parts of a great prompt?","options":["Question, Answer, Follow-up","Role, Context, Format","Subject, Body, Signature","Input, Processing, Output"],"correct":1,"explanation":"Role (who Claude should be), Context (the situation), and Format (what you want back) — this formula works for almost any prompt."},{"q":"Which prompt will get a better result?","options":["Write me something about marketing","You are a marketing strategist. I run a small bakery with a $200/month budget. Give me 5 social media post ideas with captions.","Help with marketing please","Marketing ideas for business"],"correct":1,"explanation":"The specific prompt includes role (marketing strategist), context (small bakery, $200 budget), and format (5 ideas with captions). Claude can nail this because you told it exactly what you need."},{"q":"Can Claude access the internet to look things up?","options":["Yes — Claude can search the web for current information","No — it only works from its training data","Only with a paid subscription","Yes, but only Wikipedia"],"correct":0,"explanation":"Since March 2025, Claude can search the web for current information. However, you should still verify important facts — web search makes Claude more current, but not infallible."},{"q":"What should you do when Claude gives you a factual claim for a presentation?","options":["Trust it completely — AI is always accurate","Verify it with a reliable source","Ask Claude if it is sure","Ignore it and make up your own facts"],"correct":1,"explanation":"Always verify important facts. Claude is excellent at reasoning and writing, but can occasionally get specific facts wrong. Trust the analysis, double-check the numbers."},{"q":"What is the best way to think about Claude?","options":["A magic oracle that knows everything","A brilliant coworker who makes you faster and better","A replacement for human workers","A toy that is fun but not useful for real work"],"correct":1,"explanation":"Claude is a thinking partner — a brilliant coworker who never sleeps. It does not replace you; it amplifies you. Human judgment + AI capability is unstoppable."}]}'></div>

<button class="complete-btn" id="completeBtn" onclick="completeLesson()" style="display:none">Complete Lesson 3 ✓</button>

</div>

<script>
const SLUG = 'claude-for-beginners';
const LESSON_NUM = 3;

function completeLesson() {
  const stored = localStorage.getItem('lo_progress_' + SLUG);
  const completed = stored ? JSON.parse(stored) : [];
  if (!completed.includes(LESSON_NUM)) { completed.push(LESSON_NUM); localStorage.setItem('lo_progress_' + SLUG, JSON.stringify(completed)); }
  const btn = document.getElementById('completeBtn');
  btn.textContent = 'Completed! ✨'; btn.style.background = 'var(--green)'; btn.style.pointerEvents = 'none';
}

// Show complete button after quiz renders
setTimeout(() => {
  const btn = document.getElementById('completeBtn');
  if (btn) { btn.style.display = 'block'; btn.classList.add('visible'); }
}, 500);

(function() {
  const stored = localStorage.getItem('lo_progress_' + SLUG);
  const completed = stored ? JSON.parse(stored) : [];
  if (completed.includes(LESSON_NUM)) {
    const btn = document.getElementById('completeBtn');
    if (btn) {
      btn.style.display = 'block'; btn.classList.add('visible');
      btn.textContent = 'Completed! ✨'; btn.style.background = 'var(--green)'; btn.style.pointerEvents = 'none';
    }
  }
})();
</script>
