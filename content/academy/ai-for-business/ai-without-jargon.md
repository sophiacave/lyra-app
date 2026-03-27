---
title: "AI Without Jargon"
course: "ai-for-business"
order: 1
type: "lesson"
free: true
---<div class="wrap">

<div class="lesson-num">Lesson 1 of 10</div>
<h1>AI Without the Jargon</h1>
<p class="intro">The AI world loves fancy words. Here are the only 10 you need — translated into plain English. Click each card to flip it.</p>

<h2 class="section-title">Quick Check — Match the Terms</h2>
</div>

<script>
const terms = [
  {jargon:"LLM (Large Language Model)", plain:"A program that's read millions of documents and learned to write like a human. Think of it as an extremely well-read intern."},
  {jargon:"Fine-tuning", plain:"Teaching an AI your specific business style. Like training a new employee on how YOUR company writes emails."},
  {jargon:"Tokens", plain:"The way AI counts words. Roughly 1 token = 3/4 of a word. This is how AI companies charge you — by the token."},
  {jargon:"Prompt", plain:"The instruction you give to AI. The better your instruction, the better the result. It's like briefing a freelancer."},
  {jargon:"Hallucination", plain:"When AI confidently makes something up. It sounds right but it's wrong. Always verify facts and numbers."},
  {jargon:"Embeddings", plain:"How AI understands that 'happy' and 'joyful' mean similar things. It converts words into patterns it can compare."},
  {jargon:"API", plain:"A way for two programs to talk to each other. It's how you connect AI to your existing tools — like plugging in an adapter."},
  {jargon:"Training Data", plain:"Everything the AI studied to learn. Just like a new hire's background and experience shapes how they work."},
  {jargon:"Inference", plain:"When AI actually does work for you — answering questions, writing content, analyzing data. Training is school; inference is the job."},
  {jargon:"Generative AI", plain:"AI that creates new content — text, images, video. Instead of just finding information, it produces something original."}
];

// Render flip cards
const grid = document.getElementById('cards');
terms.forEach((t,i) => {
  const card = document.createElement('div');
  card.className = 'flip-card';
  card.innerHTML = `<div class="flip-inner"><div class="flip-front"><div class="jargon">${t.jargon}</div><div class="hint">tap to translate</div></div><div class="flip-back"><div class="label">In Plain English</div><div class="plain">${t.plain}</div></div></div>`;
  card.addEventListener('click', () => { card.classList.toggle('flipped'); LO.sfx.click(); });
  grid.appendChild(card);
});

// Quiz
const quizData = [
  {q:"Which term means AI confidently makes something up?", opts:["Fine-tuning","Hallucination","Inference","Embeddings"], ans:1},
  {q:"What's the business equivalent of a 'prompt'?", opts:["A company policy","A freelancer's portfolio","A brief or instruction","An invoice"], ans:2},
  {q:"Tokens are roughly...", opts:["AI credits you buy","3/4 of a word each","The same as passwords","One full sentence each"], ans:1},
  {q:"An API is best described as...", opts:["An AI brain","A plug/adapter between tools","A pricing model","A type of AI"], ans:1},
  {q:"'Generative AI' means AI that...", opts:["Only searches databases","Creates new content","Runs your accounting","Replaces your team"], ans:1},
];

let qIdx = 0, qScore = 0, answered = false;
const quizEl = document.getElementById('quiz');

function renderQ() {
  if (qIdx >= quizData.length) { showResult(); return; }
  answered = false;
  const q = quizData[qIdx];
  quizEl.innerHTML = `<div class="q-progress">Question ${qIdx+1} of ${quizData.length}</div><div class="q-text">${q.q}</div><div class="q-options">${q.opts.map((o,i) => `<div class="q-opt" data-i="${i}">${o}</div>`).join('')}</div>`;
  quizEl.querySelectorAll('.q-opt').forEach(el => {
    el.addEventListener('click', () => {
      if (answered) return;
      answered = true;
      const idx = parseInt(el.dataset.i);
      if (idx === q.ans) { el.classList.add('correct'); qScore++; LO.sfx.success(); }
      else { el.classList.add('wrong'); quizEl.querySelector(`[data-i="${q.ans}"]`).classList.add('correct'); LO.sfx.error(); }
      quizEl.querySelectorAll('.q-opt').forEach(o => o.classList.add('disabled'));
      setTimeout(() => { qIdx++; renderQ(); }, 1200);
    });
  });
}

function showResult() {
  const pct = Math.round(qScore / quizData.length * 100);
  const msg = pct === 100 ? "Perfect score! You speak AI fluently now." : pct >= 60 ? "Solid understanding. You've got the essentials." : "Review the cards above and try the quiz again.";
  quizEl.innerHTML = `<div class="result-box"><div class="score">${pct}%</div><div class="label">${qScore} of ${quizData.length} correct</div><div class="msg">${msg}</div>${pct < 100 ? '<button class="btn" onclick="qIdx=0;qScore=0;renderQ()">Try Again</button>' : ''}</div>`;
  if (pct >= 60) {
    LO.completeLesson('ai-biz', 1, 100);
  }
  if (pct === 100) LO.unlockAchievement('quiz_master');
}

renderQ();
</script>
