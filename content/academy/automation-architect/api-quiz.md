---
title: "API Quiz"
course: "automation-architect"
order: 6
type: "quiz"
free: false
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>
  <a href="index.html" class="back-link">&larr; Automation Architect</a>
</nav>
<header class="lesson-header">
  <div class="lesson-badge">Module 2 &middot; Quiz</div>
  <h1>API Quiz</h1>
  <p>Test your knowledge of HTTP methods, status codes, headers, and authentication.</p>
</header>
<div class="content">
  <div class="quiz-progress" id="quizProgress"></div>
  <div id="questionContainer"></div>
  <button class="next-btn" id="nextBtn" onclick="nextQuestion()">Next Question &rarr;</button>
  <div class="results" id="results">
    <div class="results-score" id="resultsScore"></div>
    <div class="results-msg" id="resultsMsg"></div>
    <button class="retry-btn" onclick="resetQuiz()">Try Again</button>
  </div>
  <button class="complete-btn" id="completeBtn" style="display:none" onclick="completeLesson()">Complete Lesson &mdash; Earn 40 XP</button>
</div>
<footer class="progress-footer"><p>Lesson 6 of 9 &middot; Automation Architect</p></footer>

<script>
const SLUG='api-quiz';
const STORAGE_KEY='automation-architect-progress';

const questions=[
  {q:"Which HTTP method is used to retrieve data without modifying it?",answers:["POST","GET","PUT","DELETE"],correct:1,explanation:"<strong>GET</strong> is the read-only method. It retrieves data from the server without changing anything."},
  {q:"What does a 201 status code mean?",answers:["OK — request succeeded","Resource was created successfully","Resource not found","Server error"],correct:1,explanation:"<strong>201 Created</strong> means the server successfully created a new resource, typically returned after a POST request."},
  {q:"Where is an API key typically sent in a request?",answers:["In the URL path","In the response body","In the Authorization header","In the status code"],correct:2,explanation:"Best practice is to send API keys in headers (e.g., <strong>Authorization: Bearer token</strong> or <strong>X-API-Key: key</strong>). This keeps credentials out of URLs where they might be logged. Note: 'Bearer' tokens are typically OAuth tokens — API keys may use different header formats."},
  {q:"What does a 404 status code indicate?",answers:["Authentication required","Request was malformed","The requested resource was not found","Server crashed"],correct:2,explanation:"<strong>404 Not Found</strong> means the server understood your request but the resource at that URL doesn't exist."},
  {q:"Which content type header indicates you're sending JSON data?",answers:["text/html","application/json","multipart/form-data","text/plain"],correct:1,explanation:"<strong>application/json</strong> tells the server that your request body contains JSON-formatted data."},
  {q:"What is the difference between PUT and POST?",answers:["PUT creates, POST updates","PUT updates/replaces, POST creates","They are identical","PUT deletes, POST reads"],correct:1,explanation:"<strong>PUT</strong> updates or replaces an existing resource. <strong>POST</strong> creates a new resource. PUT is idempotent (same result each time)."},
];

let currentQ=0,score=0,answered=false;

function renderProgress(){
  document.getElementById('quizProgress').innerHTML=questions.map((_,i)=>`<div class="quiz-pip${i===currentQ?' current':''}" id="pip${i}"></div>`).join('');
}

function renderQuestion(){
  answered=false;renderProgress();
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
  if(answered)return;answered=true;
  const q=questions[currentQ];
  const btns=document.querySelectorAll('.answer-btn');
  btns.forEach((b,i)=>{
    if(i===q.correct)b.classList.add('correct');
    if(i===idx&&i!==q.correct)b.classList.add('wrong');
    if(i!==q.correct&&i!==idx)b.classList.add('disabled');
  });
  if(idx===q.correct){score++;document.getElementById('pip'+currentQ).classList.add('correct');}
  else{document.getElementById('pip'+currentQ).classList.add('wrong');}
  document.getElementById('explanation').classList.add('visible');
  if(currentQ<questions.length-1)document.getElementById('nextBtn').classList.add('visible');
  else setTimeout(showResults,1200);
}

function nextQuestion(){currentQ++;renderQuestion();}

function showResults(){
  document.getElementById('questionContainer').innerHTML='';
  document.getElementById('nextBtn').classList.remove('visible');
  const pct=Math.round((score/questions.length)*100);
  document.getElementById('results').classList.add('visible');
  const s=document.getElementById('resultsScore');
  s.textContent=score+'/'+questions.length;
  s.className='results-score '+(pct>=80?'great':pct>=50?'ok':'low');
  document.getElementById('resultsMsg').textContent=pct>=80?'You know your APIs!':pct>=50?'Good start. Review HTTP methods and status codes.':'Keep studying. Re-read the API lesson.';
  if(pct>=50)document.getElementById('completeBtn').style.display='block';
}

function resetQuiz(){currentQ=0;score=0;document.getElementById('results').classList.remove('visible');document.getElementById('completeBtn').style.display='none';renderQuestion();}

function completeLesson(){
  const progress=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');
  progress[SLUG]=true;localStorage.setItem(STORAGE_KEY,JSON.stringify(progress));
  const btn=document.getElementById('completeBtn');btn.textContent='Completed! +40 XP';btn.classList.add('done');
}

(function(){
  const progress=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');
  if(progress[SLUG]){document.getElementById('completeBtn').style.display='block';document.getElementById('completeBtn').textContent='Completed! +40 XP';document.getElementById('completeBtn').classList.add('done');}
  renderQuestion();
})();
</script>
