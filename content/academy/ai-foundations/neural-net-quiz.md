---
title: "Neural Net Quiz"
course: "ai-foundations"
order: 3
type: "quiz"
free: true
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>
  
</nav>
<div class="container">
  <div class="lesson-header">
    <div class="meta">
      <span class="type-badge">Quiz</span>
      <span class="xp-badge">+40 XP</span>
      <span class="time-badge">~10 min</span>
    </div>
    <h1>Neural Net Quiz</h1>
    <p>Test your understanding of neurons, weights, and network architecture.</p>
  </div>

  <div class="score-bar">
    <div class="score-label">Score</div>
    <div class="score-val" id="score">0 / 40 XP</div>
    <div class="q-count" id="qCount">Question 1 of 3</div>
  </div>

  <div class="results" id="results">
    <h2>Quiz Complete!</h2>
    <div class="big-score" id="finalScore">0/3</div>
    <p id="finalMsg">Review your answers above and continue to the next module.</p>
  </div>

  <button class="complete-btn" id="completeBtn" onclick="completeLesson()">Complete & Continue →</button>
</div>
<div class="footer-progress"><span id="footerProgress">0 of 9</span> lessons complete</div>

<script>
const questions=[
  {
    q:"What does a weight in a neural network represent?",
    opts:["The physical size of a neuron","How much influence an input has on the output","The number of connections in the network","The speed at which data flows"],
    correct:1,
    explain:"Weights determine how much each input contributes to the neuron's output. Higher weights mean more influence — they're what the network adjusts during training."
  },
  {
    q:"What is the role of a hidden layer?",
    opts:["To store the training data","To display results to the user","To find patterns and intermediate representations in data","To reduce the network's size"],
    correct:2,
    explain:"Hidden layers transform input data through learned patterns. Each layer can detect increasingly complex features — from edges to shapes to objects."
  },
  {
    q:"What does an activation function do?",
    opts:["Turns the computer on","Decides whether a neuron should fire based on its input","Counts the number of neurons","Stores data permanently"],
    correct:1,
    explain:"Activation functions introduce non-linearity — they decide if a neuron's summed input is strong enough to pass a signal forward. Without them, the network could only learn linear patterns."
  }
];

let answered=0,totalScore=0;

function renderQuiz(){
  const container=document.getElementById('quizContainer');
  container.innerHTML=questions.map((q,i)=>`
    <div class="quiz-card" id="card${i}">
      <div class="q-number">Question ${i+1} of ${questions.length}</div>
      <div class="q-text">${q.q}</div>
      <div class="options" id="opts${i}">
        ${q.opts.map((o,j)=>`<div class="option" data-q="${i}" data-o="${j}" onclick="answer(${i},${j})">
          <div class="letter">${String.fromCharCode(65+j)}</div>${o}
        </div>`).join('')}
      </div>
      </div>
  `).join('');
}

function answer(qi,oi){
  const card=document.getElementById('card'+qi);
  if(card.classList.contains('correct')||card.classList.contains('incorrect'))return;

  const opts=document.querySelectorAll(`#opts${qi} .option`);
  const q=questions[qi];
  const fb=document.getElementById('fb'+qi);

  opts.forEach(o=>o.classList.add('disabled'));

  if(oi===q.correct){
    opts[oi].classList.add('correct-answer');
    card.classList.add('correct');
    fb.className='feedback correct show';
    fb.textContent='✓ Correct! '+q.explain;
    totalScore+=Math.round(40/questions.length);
  }else{
    opts[oi].classList.add('wrong-answer');
    opts[q.correct].classList.add('correct-answer');
    card.classList.add('incorrect');
    fb.className='feedback incorrect show';
    fb.textContent='✗ Not quite. '+q.explain;
  }

  answered++;
  document.getElementById('score').textContent=totalScore+' / 40 XP';
  document.getElementById('qCount').textContent='Answered '+answered+' of '+questions.length;

  if(answered===questions.length){
    const res=document.getElementById('results');
    res.classList.add('show');
    const correct=document.querySelectorAll('.quiz-card.correct').length;
    document.getElementById('finalScore').textContent=correct+'/'+questions.length;
    document.getElementById('finalMsg').textContent=correct===questions.length?'Perfect score! You\'ve mastered neural network basics.':'Review the explanations above, then continue to the next module.';
  }
}

renderQuiz();

function getProgress(){try{return JSON.parse(localStorage.getItem('ai-foundations-progress'))||{}}catch(e){return{}}}
function updateFooter(){
  const p=getProgress();const c=Object.keys(p).filter(k=>p[k]).length;
  document.getElementById('footerProgress').textContent=c+' of 9';
  if(p['neural-net-quiz']){document.getElementById('completeBtn').textContent='Completed ✓';document.getElementById('completeBtn').classList.add('done')}
}
function completeLesson(){
  const p=getProgress();p['neural-net-quiz']=true;localStorage.setItem('ai-foundations-progress',JSON.stringify(p));
  LO_NAV.goNext();
}
updateFooter();
</script>
