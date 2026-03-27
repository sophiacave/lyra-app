---
title: "Similarity Challenge"
course: "ai-foundations"
order: 9
type: "lesson"
free: false
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>
  <a href="index.html" class="nav-link">← Back to Course</a>
</nav>
<div class="container">
  <div class="lesson-header">
    <div class="meta">
      <span class="type-badge">Quiz</span>
      <span class="xp-badge">+40 XP</span>
      <span class="time-badge">~10 min</span>
    </div>
    <h1>Similarity Challenge</h1>
    <p>Put your embedding knowledge to the test. Predict similarities, understand cosine distance, and prove your mastery.</p>
  </div>

  <div class="score-bar">
    <div class="score-label">Score</div>
    <div class="score-val" id="score">0 / 40 XP</div>
    <div class="q-count" id="qCount">Question 1 of 3</div>
  </div>

  <div id="quizContainer"></div>
  <div class="results" id="results">
    <h2>Challenge Complete!</h2>
    <div class="big-score" id="finalScore">0/3</div>
    <p id="finalMsg"></p>
  </div>

  <div class="course-complete-banner" id="courseBanner">
    <h2>AI Foundations Complete!</h2>
    <p>You've earned 500 XP and mastered the fundamentals of neural networks, prompt engineering, and embeddings. You're ready for the next course.</p>
  </div>

  <button class="complete-btn" id="completeBtn" onclick="completeLesson()">Complete Course →</button>
</div>
<div class="footer-progress"><span id="footerProgress">0 of 9</span> lessons complete</div>

<script>
const questions=[
  {
    q:"Which pair of words would have the HIGHEST cosine similarity in an embedding space?",
    opts:["'happy' and 'banana'","'dog' and 'skyscraper'","'car' and 'automobile'","'king' and 'purple'"],
    correct:2,
    explain:"'Car' and 'automobile' are synonyms — they appear in nearly identical contexts, so their embedding vectors point in almost the same direction. Cosine similarity measures the angle between vectors: identical direction = 1.0, perpendicular = 0, opposite = -1.0.",
    visual:'similarity-bars'
  },
  {
    q:"Why are embeddings useful for search engines?",
    opts:["They make web pages load faster","They allow matching by meaning, not just keywords","They compress images to save storage","They prevent users from making typos"],
    correct:1,
    explain:"With embeddings, searching 'affordable places to eat' can find a page titled 'budget-friendly restaurants' — even though they share zero keywords. Both phrases map to nearby vectors in embedding space because they mean similar things.",
    visual:null
  },
  {
    q:"In embedding space, the analogy 'Paris : France :: Tokyo : ?' works because:",
    opts:["The model memorized geography facts","The vector from Paris to France captures 'capital-of' and applying it to Tokyo lands near Japan","All cities are embedded close to all countries","Tokyo and France have similar spelling patterns"],
    correct:1,
    explain:"Embeddings encode relationships as directions in space. The vector offset from 'Paris' to 'France' represents the 'capital-of' relationship. Adding this same offset to 'Tokyo' lands you near 'Japan'. The model learned these relationships from patterns in text, not from explicit geography lessons.",
    visual:null
  }
];

let answered=0,totalScore=0;

function renderQuiz(){
  const container=document.getElementById('quizContainer');
  container.innerHTML=questions.map((q,i)=>{
    let visualHtml='';
    if(q.visual==='similarity-bars'){
      visualHtml=`<div class="visual-aid">
        <div class="similarity-meter">
          <div class="sim-pair">car ↔ automobile</div>
          <div class="sim-bar-wrap"><div class="sim-bar" style="width:95%;background:#22c55e"></div></div>
          <div class="sim-val" style="color:#22c55e">0.95</div>
        </div>
        <div class="similarity-meter">
          <div class="sim-pair">happy ↔ joyful</div>
          <div class="sim-bar-wrap"><div class="sim-bar" style="width:88%;background:#34d399"></div></div>
          <div class="sim-val" style="color:#34d399">0.88</div>
        </div>
        <div class="similarity-meter">
          <div class="sim-pair">dog ↔ cat</div>
          <div class="sim-bar-wrap"><div class="sim-bar" style="width:72%;background:#fb923c"></div></div>
          <div class="sim-val" style="color:#fb923c">0.72</div>
        </div>
        <div class="similarity-meter">
          <div class="sim-pair">king ↔ purple</div>
          <div class="sim-bar-wrap"><div class="sim-bar" style="width:18%;background:#ef4444"></div></div>
          <div class="sim-val" style="color:#ef4444">0.18</div>
        </div>
        <div class="similarity-meter">
          <div class="sim-pair">happy ↔ banana</div>
          <div class="sim-bar-wrap"><div class="sim-bar" style="width:12%;background:#ef4444"></div></div>
          <div class="sim-val" style="color:#ef4444">0.12</div>
        </div>
        <div style="font-size:.7rem;color:#71717a;margin-top:.5rem;text-align:center">These are approximate values for illustration. Real similarity scores vary by embedding model.</div>
      </div>`;
    }
    return`<div class="quiz-card" id="card${i}">
      <div class="q-number">Question ${i+1} of ${questions.length}</div>
      <div class="q-text">${q.q}</div>
      ${visualHtml}
      <div class="options" id="opts${i}">
        ${q.opts.map((o,j)=>`<div class="option" data-q="${i}" data-o="${j}" onclick="answer(${i},${j})">
          <div class="letter">${String.fromCharCode(65+j)}</div>${o}
        </div>`).join('')}
      </div>
      <div class="feedback" id="fb${i}"></div>
    </div>`;
  }).join('');
}

function answer(qi,oi){
  const card=document.getElementById('card'+qi);
  if(card.classList.contains('correct')||card.classList.contains('incorrect'))return;
  const opts=document.querySelectorAll(`#opts${qi} .option`);
  const q=questions[qi];const fb=document.getElementById('fb'+qi);
  opts.forEach(o=>o.classList.add('disabled'));

  if(oi===q.correct){
    opts[oi].classList.add('correct-answer');
    card.classList.add('correct');
    fb.className='feedback correct-fb show';
    fb.textContent='Correct! '+q.explain;
    totalScore+=Math.round(40/questions.length);
  }else{
    opts[oi].classList.add('wrong-answer');
    opts[q.correct].classList.add('correct-answer');
    card.classList.add('incorrect');
    fb.className='feedback incorrect-fb show';
    fb.textContent='Not quite. '+q.explain;
  }
  answered++;
  document.getElementById('score').textContent=totalScore+' / 40 XP';
  document.getElementById('qCount').textContent='Answered '+answered+' of '+questions.length;

  if(answered===questions.length){
    const res=document.getElementById('results');res.classList.add('show');
    const correct=document.querySelectorAll('.quiz-card.correct').length;
    document.getElementById('finalScore').textContent=correct+'/'+questions.length;
    document.getElementById('finalMsg').textContent=correct===questions.length?'Perfect! You truly understand embedding spaces.':'Review the explanations above to strengthen your understanding.';
  }
}

renderQuiz();

function getProgress(){try{return JSON.parse(localStorage.getItem('ai-foundations-progress'))||{}}catch(e){return{}}}
function updateFooter(){
  const p=getProgress();const c=Object.keys(p).filter(k=>p[k]).length;
  document.getElementById('footerProgress').textContent=c+' of 9';
  if(p['similarity-challenge']){
    document.getElementById('completeBtn').textContent='Completed ✓';
    document.getElementById('completeBtn').classList.add('done');
  }
  // Check if all done
  const allSlugs=['what-is-a-neuron','build-a-network','neural-net-quiz','anatomy-of-a-prompt','prompt-playground','prompt-battle','words-as-numbers','embedding-explorer','similarity-challenge'];
  if(allSlugs.every(s=>p[s])){
    document.getElementById('courseBanner').classList.add('show');
  }
}
function completeLesson(){
  const p=getProgress();p['similarity-challenge']=true;localStorage.setItem('ai-foundations-progress',JSON.stringify(p));
  // Check full completion
  const allSlugs=['what-is-a-neuron','build-a-network','neural-net-quiz','anatomy-of-a-prompt','prompt-playground','prompt-battle','words-as-numbers','embedding-explorer','similarity-challenge'];
  if(allSlugs.every(s=>p[s])){
    document.getElementById('courseBanner').classList.add('show');
    document.getElementById('completeBtn').textContent='Completed ✓';
    document.getElementById('completeBtn').classList.add('done');
    setTimeout(()=>window.location.href='index.html',1500);
  }else{
    window.location.href='index.html';
  }
}
updateFooter();
</script>
