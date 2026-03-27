---
title: "Workflow Quiz"
course: "automation-architect"
order: 9
type: "quiz"
free: false
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>
  
</nav>
<header class="lesson-header">
  <div class="lesson-badge">Module 3 &middot; Final Quiz</div>
  <h1>Workflow Quiz</h1>
  <p>Final assessment on workflow patterns, AI integration, and error handling in automations.</p>
</header>
<div class="content">
  <div class="quiz-progress" id="quizProgress">
    <span class="pip" id="pip0"></span>
    <span class="pip" id="pip1"></span>
    <span class="pip" id="pip2"></span>
    <span class="pip" id="pip3"></span>
    <span class="pip" id="pip4"></span>
    <span class="pip" id="pip5"></span>
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
  <div class="course-complete" id="courseComplete">
    <h2>Course Complete!</h2>
    <p>You've finished Automation Architect. You now understand triggers, APIs, and AI-powered workflows.</p>
    
  </div>
</div>
<footer class="progress-footer"><p>Lesson 9 of 9 &middot; Automation Architect</p></footer>

<script>
const SLUG='workflow-quiz';
const STORAGE_KEY='automation-architect-progress';

const questions=[
  {q:"What advantage does AI classification have over a traditional rules engine?",answers:["It's always faster","It handles ambiguous and novel inputs without explicit rules","It never makes mistakes","It doesn't need any data"],correct:1,explanation:"AI classification handles <strong>ambiguous and novel inputs</strong> gracefully. A rules engine only matches patterns you've explicitly coded — AI generalizes from training data."},
  {q:"In an automation workflow, what is a 'dead letter queue'?",answers:["A queue for emails marked as spam","A place where failed messages go for retry or inspection","A queue that automatically deletes old messages","A priority queue for urgent tasks"],correct:1,explanation:"A <strong>dead letter queue</strong> captures messages that failed processing. This prevents data loss and lets you debug and retry failed automations."},
  {q:"What should happen when an AI classifier returns low confidence?",answers:["Ignore the message entirely","Route it to a random team","Flag it for human review","Delete the data"],correct:2,explanation:"Low confidence means the AI isn't sure. <strong>Flagging for human review</strong> prevents misrouting while keeping data safe. This is called a human-in-the-loop pattern."},
  {q:"What is idempotency and why does it matter in automations?",answers:["It means running the same operation twice produces the same result — prevents duplicate processing","It means the system runs faster each time","It means all operations are reversible","It means the system auto-scales"],correct:0,explanation:"<strong>Idempotency</strong> means re-running an operation produces the same result. Critical in automations because webhooks can fire twice — without idempotency, you'd process duplicates."},
  {q:"Which pattern best handles a step in your workflow that might fail?",answers:["Ignore the error and continue","Retry with exponential backoff, then dead letter queue","Delete the entire workflow","Send an angry email to the API provider"],correct:1,explanation:"<strong>Retry with exponential backoff</strong> handles transient failures (network blips, rate limits). If retries exhaust, the dead letter queue preserves the data for manual recovery."},
  {q:"What is the best way to test an AI-powered workflow before going live?",answers:["Deploy directly to production","Run it with sample data in a staging environment","Only test the AI model, skip the rest","Ask users to test it for you"],correct:1,explanation:"Always test with <strong>sample data in staging</strong> first. This catches issues in the full pipeline — trigger, AI processing, routing, and actions — before real data flows through."},
];

let currentQ=0,score=0,answered=false;

function renderProgress(){
  document.getElementById('quizProgress').innerHTML=questions.map((_,i)=>`<span class="pip" id="pip${i}"></span>`).join('');
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
  document.getElementById('resultsMsg').textContent=pct>=80?'Outstanding! You\'re ready to build AI-powered automations.':pct>=50?'Good foundation. Review error handling patterns.':'Keep learning. Revisit the smart routing lesson.';
  if(pct>=50){
    document.getElementById('completeBtn').style.display='block';
  }
}

function resetQuiz(){currentQ=0;score=0;document.getElementById('results').classList.remove('visible');document.getElementById('completeBtn').style.display='none';document.getElementById('courseComplete').classList.remove('visible');renderQuestion();}

function completeLesson(){
  const progress=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');
  progress[SLUG]=true;localStorage.setItem(STORAGE_KEY,JSON.stringify(progress));
  const btn=document.getElementById('completeBtn');btn.textContent='Completed! +40 XP';btn.classList.add('done');

  // Check if all 9 lessons done
  const allSlugs=['triggers-and-actions','your-first-automation','automation-quiz','what-is-an-api','api-playground','api-quiz','smart-routing','build-ai-workflow','workflow-quiz'];
  const allDone=allSlugs.every(s=>progress[s]);
  if(allDone){
    document.getElementById('courseComplete').classList.add('visible');
  }
}

(function(){
  const progress=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');
  if(progress[SLUG]){
    document.getElementById('completeBtn').style.display='block';
    document.getElementById('completeBtn').textContent='Completed! +40 XP';
    document.getElementById('completeBtn').classList.add('done');
    const allSlugs=['triggers-and-actions','your-first-automation','automation-quiz','what-is-an-api','api-playground','api-quiz','smart-routing','build-ai-workflow','workflow-quiz'];
    if(allSlugs.every(s=>progress[s]))document.getElementById('courseComplete').classList.add('visible');
  }
  renderQuestion();
})();
</script>
