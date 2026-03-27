---
title: "RAG Quiz"
course: "rag-vector-search"
order: 10
type: "quiz"
free: false
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>
  <a href="index.html" class="nav-link">&larr; Back to Course</a>
</nav>
<div class="container">
  <div class="lesson-header">
    <div class="meta">
      <span class="type-badge">Quiz</span>
      <span class="xp-badge">+150 XP</span>
      <span class="time-badge">~20 min</span>
    </div>
    <h1>RAG Mastery Quiz</h1>
    <p>Test your knowledge across all 9 lessons. 8 questions covering embeddings, chunking, retrieval, evaluation, and production patterns.</p>
  </div>

  <div class="progress-bar"><div class="progress-fill" id="quizProgress" style="width:0%"></div></div>

  <div id="quizArea"></div>
  <div class="results" id="results"></div>

  <div class="nav-btns" id="navBtns">
    <div></div>
    <button class="btn-next" id="nextBtn" onclick="nextQuestion()" disabled>Next Question</button>
  </div>

  <div id="completionArea" style="display:none">
    <button class="complete-btn" id="completeBtn" onclick="completeLesson()">Complete Course — Claim 150 XP</button>
  </div>

  <div class="footer-nav">
    <a href="advanced-patterns.html">&larr; Previous: Advanced Patterns</a>
    <a href="index.html">Back to Course Overview &rarr;</a>
  </div>
</div>

<script>
const QUESTIONS = [
  {
    q:'What does an embedding model produce?',
    options:['A summary of the input text','A list of keywords extracted from the text','A fixed-length vector of floating-point numbers that captures semantic meaning','A JSON object with sentiment analysis scores'],
    correct:2,
    explanation:'Embedding models convert text into dense vectors (lists of numbers) where similar meanings map to nearby points in the vector space. These vectors are the foundation of semantic search.'
  },
  {
    q:'Why is cosine similarity preferred over Euclidean distance for comparing embeddings?',
    options:['Cosine similarity is faster to compute','Cosine similarity measures the angle between vectors, making it magnitude-independent','Euclidean distance only works in 2D','Cosine similarity returns values between -1 and 1 which is easier to read'],
    correct:1,
    explanation:'Cosine similarity measures the angle between vectors, ignoring their magnitude. This means a long vector and a short vector pointing in the same direction are considered similar — which is what we want when comparing meaning, not vector length.'
  },
  {
    q:'What is the main tradeoff when choosing a smaller chunk size for RAG?',
    options:['Smaller chunks are more expensive to embed','Smaller chunks provide more precise retrieval but may lack surrounding context','Smaller chunks cause the vector database to run slower','Smaller chunks always produce worse results'],
    correct:1,
    explanation:'Small chunks give precise retrieval (the matched text is highly relevant) but may miss the context needed to understand that text. A chunk saying "This causes X" is useless if "This" refers to something in the previous chunk. Overlap helps mitigate this.'
  },
  {
    q:'In the RAG pipeline, what happens AFTER the relevant chunks are retrieved from the vector database?',
    options:['The chunks are fed back into the embedding model','The chunks are inserted into the LLM prompt as context alongside the original question','The chunks are stored in a new database','The chunks are sent directly to the user as the answer'],
    correct:1,
    explanation:'This is the "Augmentation" step in RAG. Retrieved chunks become the context in a carefully crafted prompt: "Based on this context, answer this question." The LLM then generates an answer grounded in the retrieved information.'
  },
  {
    q:'What is the key advantage of hybrid search over pure vector search?',
    options:['Hybrid search is always faster','Hybrid search combines keyword precision with semantic understanding','Hybrid search uses less storage','Hybrid search does not require an embedding model'],
    correct:1,
    explanation:'Hybrid search combines BM25 (keyword) and vector (semantic) search. Keywords catch exact matches like "error 404" that vector search might miss, while vectors catch meaning-based matches like "joyful" when searching for "happy." Together they cover more ground.'
  },
  {
    q:'Which metric measures whether a RAG answer contains ONLY information from the retrieved context?',
    options:['Relevance','Completeness','Faithfulness (Groundedness)','Precision'],
    correct:2,
    explanation:'Faithfulness (also called Groundedness) measures whether every claim in the answer is supported by the retrieved context. A faithfulness score of 1.0 means zero hallucination — the answer only states things found in the context.'
  },
  {
    q:'What distinguishes Self-RAG from standard RAG?',
    options:['Self-RAG uses a different embedding model','Self-RAG lets the LLM decide whether retrieval is needed and self-evaluates answer quality','Self-RAG retrieves from multiple databases simultaneously','Self-RAG caches all previous queries for faster responses'],
    correct:1,
    explanation:'Self-RAG adds decision-making to the pipeline: the LLM first decides "Do I need to retrieve?" (saving cost on simple questions), then after generating, it self-evaluates: "Is my answer supported by the context?" This built-in quality check reduces hallucination.'
  },
  {
    q:'You are building a RAG system for a legal firm. Documents contain exact statute numbers (like "Section 42(b)(3)") that lawyers search for. What search strategy should you use?',
    options:['Pure vector search — it understands meaning better','Pure keyword search — exact matching is all you need','Hybrid search with higher keyword weight — statutes need exact matching, but context needs semantic understanding','No search at all — just use a large context window LLM'],
    correct:2,
    explanation:'Legal documents require exact statute references (keyword strength) combined with understanding legal concepts and questions in natural language (semantic strength). Hybrid search with higher keyword weight ensures "Section 42(b)(3)" finds the exact section while still supporting conceptual queries.'
  }
];

let currentQ = 0;
let answers = new Array(QUESTIONS.length).fill(null);
let answered = new Array(QUESTIONS.length).fill(false);

function renderQuestion(){
  const q = QUESTIONS[currentQ];
  document.getElementById('quizProgress').style.width = ((currentQ+1)/QUESTIONS.length*100)+'%';

  const area = document.getElementById('quizArea');
  area.style.display = 'block';
  document.getElementById('results').style.display = 'none';

  area.innerHTML = `
    <div class="question-card">
      <div class="q-number">Question ${currentQ+1} of ${QUESTIONS.length}</div>
      <div class="q-text">${q.q}</div>
      <div class="options">
        ${q.options.map((opt,i)=>{
          let cls = 'option';
          if(answered[currentQ]){
            cls += ' disabled';
            if(i===q.correct) cls += ' correct';
            else if(i===answers[currentQ] && i!==q.correct) cls += ' incorrect';
          } else if(answers[currentQ]===i){
            cls += ' selected';
          }
          return `<div class="${cls}" onclick="selectOption(${i})">
            <span class="letter">${String.fromCharCode(65+i)}</span>
            <span>${opt}</span>
          </div>`;
        }).join('')}
      </div>
      <div class="explanation${answers[currentQ]!==q.correct&&answered[currentQ]?' wrong':''}" id="explanation" style="display:${answered[currentQ]?'block':'none'}">
        <strong>${answers[currentQ]===q.correct?'Correct!':'Not quite.'}</strong> ${q.explanation}
      </div>
    </div>`;

  const nextBtn = document.getElementById('nextBtn');
  nextBtn.disabled = !answered[currentQ];
  nextBtn.textContent = currentQ === QUESTIONS.length-1 ? 'See Results' : 'Next Question';
}

function selectOption(i){
  if(answered[currentQ]) return;
  answers[currentQ] = i;
  answered[currentQ] = true;

  const q = QUESTIONS[currentQ];
  if(i === q.correct){
    if(typeof LO !== 'undefined') LO.sfx.success();
  } else {
    if(typeof LO !== 'undefined') LO.sfx.error();
  }

  renderQuestion();
}

function nextQuestion(){
  if(currentQ >= QUESTIONS.length-1){
    showResults();
    return;
  }
  currentQ++;
  renderQuestion();
}

function showResults(){
  const correct = answers.filter((a,i)=>a===QUESTIONS[i].correct).length;
  const pct = Math.round(correct/QUESTIONS.length*100);
  const color = pct>=80?'#10b981':pct>=60?'#f59e0b':'#ef4444';
  const msg = pct===100?'Perfect score! You have mastered RAG & Vector Search.':
    pct>=80?'Excellent work! You have a strong understanding of RAG systems.':
    pct>=60?'Good effort! Review the lessons where you missed questions.':
    'Keep studying! Go back through the lessons and try again.';

  document.getElementById('quizArea').style.display='none';
  document.getElementById('navBtns').style.display='none';
  const results = document.getElementById('results');
  results.style.display='block';
  results.innerHTML=`
    <h2>Quiz Complete</h2>
    <div class="score" style="color:${color}">${pct}%</div>
    <div class="message">${msg}</div>
    <div class="stats">
      <div class="stat"><div class="val" style="color:#10b981">${correct}</div><div class="lbl">Correct</div></div>
      <div class="stat"><div class="val" style="color:#ef4444">${QUESTIONS.length-correct}</div><div class="lbl">Incorrect</div></div>
      <div class="stat"><div class="val" style="color:#fb923c">${QUESTIONS.length}</div><div class="lbl">Total</div></div>
    </div>`;

  document.getElementById('completionArea').style.display='block';

  if(pct===100 && typeof LO !== 'undefined'){
    LO.unlockAchievement('quiz_master');
  }
}

renderQuestion();

function completeLesson(){
  const btn=document.getElementById('completeBtn');
  if(btn.classList.contains('done')) return;
  const progress=JSON.parse(localStorage.getItem('rag-vector-search-progress')||'{}');
  progress['rag-quiz']=true;
  localStorage.setItem('rag-vector-search-progress',JSON.stringify(progress));
  LO.completeLesson('rag-vector-search',10,150);
  LO.addXP(50); // bonus
  btn.textContent='Course Complete!';btn.classList.add('done');

  // Check if all lessons done
  const allSlugs=['what-are-embeddings','vector-databases-101','chunking-strategies','the-rag-loop','build-your-first-rag','prompt-augmentation','hybrid-search','evaluation-metrics','advanced-patterns','rag-quiz'];
  if(allSlugs.every(s=>progress[s])){
    LO.unlockAchievement('course_complete');
  }
}
(function(){const p=JSON.parse(localStorage.getItem('rag-vector-search-progress')||'{}');if(p['rag-quiz']){document.getElementById('completionArea').style.display='block';const b=document.getElementById('completeBtn');b.textContent='Course Complete!';b.classList.add('done');}})();
</script>
