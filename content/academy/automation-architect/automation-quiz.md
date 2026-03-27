---
title: "Automation Quiz"
course: "automation-architect"
order: 3
type: "quiz"
free: true
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>
  
</nav>

<header class="lesson-header">
  <div class="lesson-badge">Module 1 &middot; Quiz</div>
  <h1>Automation Quiz</h1>
  <p>Test your knowledge of triggers, actions, webhooks, and cron schedules.</p>
</header>

<div class="content">
  <div class="quiz-progress" id="quizProgress">
    <span class="pip" id="pip0"></span>
    <span class="pip" id="pip1"></span>
    <span class="pip" id="pip2"></span>
    <span class="pip" id="pip3"></span>
    <span class="pip" id="pip4"></span>
  </div>
  <div id="questionContainer"></div>
  <div class="explanation" id="explanation"></div>
  <button class="next-btn" id="nextBtn" onclick="nextQuestion()">Next Question &rarr;</button>
  <div class="results" id="results">
    <div class="results-score" id="resultsScore"></div>
    <div class="results-msg" id="resultsMsg"></div>
    <button class="retry-btn" onclick="resetQuiz()">Try Again</button>
  </div>
  <button class="complete-btn" id="completeBtn" style="display:none" onclick="completeLesson()">Complete Lesson &mdash; Earn 40 XP</button>
</div>

<footer class="progress-footer">
  <p>Lesson 3 of 9 &middot; Automation Architect</p>
</footer>

<script>
const SLUG='automation-quiz';
const STORAGE_KEY='automation-architect-progress';

const questions=[
  {q:"What is a 'trigger' in automation?",answers:["A function that transforms data","An event that starts an automation","A database query","An API response"],correct:1,explanation:"A <strong>trigger</strong> is the event that kicks off your automation — it's the 'when' that fires before any actions execute."},
  {q:"Which cron expression runs a task every day at midnight?",answers:["* * * * *","0 0 * * *","0 12 * * 1","*/5 * * * *"],correct:1,explanation:"<strong>0 0 * * *</strong> means minute 0, hour 0 (midnight), every day, every month, every day of week."},
  {q:"What does a webhook do?",answers:["Polls a server every 5 seconds","Sends a scheduled email","Receives real-time data via HTTP POST","Stores data in a cache"],correct:2,explanation:"A <strong>webhook</strong> is a URL that receives real-time HTTP POST requests when an event occurs in an external system."},
  {q:"In a trigger-action pair, what flows between them?",answers:["HTML pages","Data (the event payload)","CSS styles","User credentials"],correct:1,explanation:"<strong>Data</strong> flows from trigger to action. The trigger produces a payload (event data) that the action consumes and acts upon."},
  {q:"Which is NOT a common automation action?",answers:["Send an email notification","Write to a database","Call an external API","Listen for a webhook"],correct:3,explanation:"<strong>Listening for a webhook</strong> is a trigger, not an action. Actions are the things that happen after a trigger fires."},
];

let currentQ=0,score=0,answered=false;

function renderProgress(){
  const el=document.getElementById('quizProgress');
  el.innerHTML=questions.map((_,i)=>``).join('');
}

function renderQuestion(){
  answered=false;
  renderProgress();
  const q=questions[currentQ];
  document.getElementById('questionContainer').innerHTML=`
    <div class="question-card">
      <div class="q-number">Question ${currentQ+1} of ${questions.length}</div>
      <div class="q-text">${q.q}</div>
      <div class="answers">${q.answers.map((a,i)=>`<button class="answer-btn" onclick="selectAnswer(${i})">${a}</button>`).join('')}</div>
      <div class="explanation" id="explanation">${q.explanation}</div>
    </div>`;
  document.getElementById('nextBtn').classList.remove('visible');
}

function selectAnswer(idx){
  if(answered)return;
  answered=true;
  const q=questions[currentQ];
  const btns=document.querySelectorAll('.answer-btn');
  btns.forEach((b,i)=>{
    if(i===q.correct)b.classList.add('correct');
    if(i===idx&&i!==q.correct)b.classList.add('wrong');
    if(i!==q.correct&&i!==idx)b.classList.add('disabled');
  });
  if(idx===q.correct){
    score++;
    document.getElementById('pip'+currentQ).classList.add('correct');
  }else{
    document.getElementById('pip'+currentQ).classList.add('wrong');
  }
  document.getElementById('explanation').classList.add('visible');
  if(currentQ<questions.length-1){
    document.getElementById('nextBtn').classList.add('visible');
  }else{
    setTimeout(showResults,1200);
  }
}

function nextQuestion(){
  currentQ++;
  renderQuestion();
}

function showResults(){
  document.getElementById('questionContainer').innerHTML='';
  document.getElementById('nextBtn').classList.remove('visible');
  const pct=Math.round((score/questions.length)*100);
  const el=document.getElementById('results');
  el.classList.add('visible');
  const scoreEl=document.getElementById('resultsScore');
  scoreEl.textContent=score+'/'+questions.length;
  scoreEl.className='results-score '+(pct>=80?'great':pct>=50?'ok':'low');
  document.getElementById('resultsMsg').textContent=
    pct>=80?'Excellent! You understand automation fundamentals.':
    pct>=50?'Good effort! Review triggers and actions for a stronger foundation.':
    'Keep learning! Re-read the triggers & actions lesson.';
  if(pct>=60)document.getElementById('completeBtn').style.display='block';
}

function resetQuiz(){
  currentQ=0;score=0;
  document.getElementById('results').classList.remove('visible');
  document.getElementById('completeBtn').style.display='none';
  renderQuestion();
}

function completeLesson(){
  const progress=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');
  progress[SLUG]=true;
  localStorage.setItem(STORAGE_KEY,JSON.stringify(progress));
  const btn=document.getElementById('completeBtn');
  btn.textContent='Completed! +40 XP';
  btn.classList.add('done');
}

(function(){
  const progress=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');
  if(progress[SLUG]){
    document.getElementById('completeBtn').style.display='block';
    document.getElementById('completeBtn').textContent='Completed! +40 XP';
    document.getElementById('completeBtn').classList.add('done');
  }
  renderQuestion();
})();
</script>
