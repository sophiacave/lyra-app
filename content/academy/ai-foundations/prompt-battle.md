---
title: "Prompt Battle"
course: "ai-foundations"
order: 6
type: "lab"
free: false
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
    <h1>Prompt Battle</h1>
    <p>Test your prompt engineering skills in a fast-paced battle format. Score points for speed and accuracy.</p>
  </div>

  <div class="battle-arena">
    <div class="score-display">
      <div class="score-big" id="scoreBig">0</div>
      <div class="score-label">BATTLE POINTS</div>
      <div class="streak cold" id="streakBadge">No streak yet</div>
    </div>
  </div>

  <button class="complete-btn" id="completeBtn" onclick="completeLesson()">Complete & Continue →</button>
</div>
<div class="footer-progress"><span id="footerProgress">0 of 9</span> lessons complete</div>

<script>
const questions=[
  {
    q:"Which prompt technique is BEST for getting accurate math solutions?",
    opts:["Zero-shot: just ask the question","Few-shot: show 3 similar solved problems","Chain-of-thought: ask for step-by-step reasoning","Role-play: pretend to be a calculator"],
    correct:2,
    explain:"Chain-of-thought prompting forces the model to show its reasoning, which dramatically reduces errors on multi-step problems. Research shows up to 2x accuracy improvement."
  },
  {
    q:"What does lowering the temperature parameter do?",
    opts:["Makes the AI respond faster","Makes outputs more deterministic and focused","Reduces the context window size","Makes the AI more creative"],
    correct:1,
    explain:"Temperature controls randomness. Lower temperature (closer to 0) makes the model always pick the highest-probability token, giving consistent, focused outputs. Great for code and factual tasks."
  },
  {
    q:"A system prompt is powerful because it:",
    opts:["Gets processed before any user messages, shaping all responses","Uses fewer tokens than regular prompts","Bypasses the model's safety guidelines","Runs on a separate, faster processor"],
    correct:0,
    explain:"System prompts set the behavioral framework before any user interaction. They're processed first and influence every subsequent response — like giving the AI its job description before it starts work."
  }
];

let score=0,streak=0,current=0,answered=[];

function renderProgress(){
  const el=document.getElementById('battleProgress');
  el.innerHTML=questions.map((_,i)=>{
    let cls='bp-dot';
    if(i<current)cls+=' '+(answered[i]?'correct':'wrong');
    else if(i===current)cls+=' current';
    return``;
  }).join('');
}

function renderQuestion(){
  if(current>=questions.length){showResults();return}
  const q=questions[current];
  const container=document.getElementById('battleContainer');
  container.innerHTML=`
    <div class="battle-card">
      <div class="round-label">Round ${current+1} of ${questions.length}</div>
      <div class="q-text">${q.q}</div>
      <div class="battle-options" id="opts">
        ${q.opts.map((o,j)=>`<div class="b-option" onclick="answer(${j})">
          <div class="letter">${String.fromCharCode(65+j)}</div><span>${o}</span>
          <span class="streak-effect">${streak>=2?'🔥':''}</span>
        </div>`).join('')}
      </div>
      </div>`;
  renderProgress();
}

function answer(oi){
  const q=questions[current];
  const opts=document.querySelectorAll('#opts .b-option');
  if(opts[0].classList.contains('disabled'))return;
  opts.forEach(o=>o.classList.add('disabled'));

  const fb=document.getElementById('feedback');
  if(oi===q.correct){
    opts[oi].classList.add('correct-answer');
    streak++;
    const pts=10*(streak>=3?2:1);
    score+=pts;
    answered.push(true);
    fb.className='battle-feedback correct show';
    fb.textContent='✓ Correct! +'+pts+' points. '+q.explain;
  }else{
    opts[oi].classList.add('wrong-answer');
    opts[q.correct].classList.add('correct-answer');
    streak=0;
    answered.push(false);
    fb.className='battle-feedback incorrect show';
    fb.textContent='✗ Wrong! '+q.explain;
  }

  document.getElementById('scoreBig').textContent=score;
  const sb=document.getElementById('streakBadge');
  if(streak>=3){sb.className='streak hot';sb.textContent='🔥 '+streak+' streak — 2x points!'}
  else if(streak>=1){sb.className='streak hot';sb.textContent='⚡ '+streak+' in a row'}
  else{sb.className='streak cold';sb.textContent='Streak broken'}

  renderProgress();
  setTimeout(()=>{current++;renderQuestion()},2000);
}

function showResults(){
  document.getElementById('battleContainer').innerHTML='';
  const correct=answered.filter(a=>a).length;
  const res=document.getElementById('results');
  res.classList.add('show');
  let trophy,msg;
  if(correct===questions.length){trophy='🏆';msg='FLAWLESS VICTORY! You\'re a prompt engineering master.'}
  else if(correct>=2){trophy='🥈';msg='Great battle! You\'ve got strong prompt skills.'}
  else{trophy='💪';msg='Good effort! Review the explanations and try the playground again.'}
  res.innerHTML=`<div class="trophy">${trophy}</div><h2>${score} Points</h2><p>${correct}/${questions.length} correct — ${msg}</p>`;
}

renderQuestion();

function getProgress(){try{return JSON.parse(localStorage.getItem('ai-foundations-progress'))||{}}catch(e){return{}}}
function updateFooter(){
  const p=getProgress();const c=Object.keys(p).filter(k=>p[k]).length;
  document.getElementById('footerProgress').textContent=c+' of 9';
  if(p['prompt-battle']){document.getElementById('completeBtn').textContent='Completed ✓';document.getElementById('completeBtn').classList.add('done')}
}
function completeLesson(){
  const p=getProgress();p['prompt-battle']=true;localStorage.setItem('ai-foundations-progress',JSON.stringify(p));
  LO_NAV.goNext();
}
updateFooter();
</script>
