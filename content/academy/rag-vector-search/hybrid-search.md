---
title: "Hybrid Search"
course: "rag-vector-search"
order: 7
type: "lesson"
free: false
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>
  
</nav>
<div class="container">
  <div class="lesson-header">
    <div class="meta">
      <span class="type-badge">Simulation</span>
      <span class="xp-badge">+200 XP</span>
      <span class="time-badge">~55 min</span>
    </div>
    <h1>Hybrid Search</h1>
    <p>Keyword search is precise. Vector search understands meaning. Hybrid search combines both for the best of both worlds.</p>
  </div>

  <div class="narration">
    <strong>The problem with pure approaches:</strong> Keyword search misses synonyms ("happy" won't find "joyful"). Vector search sometimes misses exact terms (searching for "error code 404" might return generic error pages). <strong>Hybrid search</strong> combines both: keyword matching for precision + vector similarity for understanding. Adjust the slider below to see how the weight affects results.
  </div>

  <div class="search-input">
    <input type="text" id="queryInput" placeholder="Try: error 404, happy customers, machine learning basics" value="error 404">
    <button onclick="search()">Search</button>
  </div>

  <div class="slider-control">
    <div class="slider-label"><span class="kw">Keyword Weight</span><span class="sem">Semantic Weight</span></div>
    <input type="range" class="weight-slider" id="weightSlider" min="0" max="100" value="50" oninput="search()">
    <div class="weight-display"><span id="kwWeight">50%</span><span id="semWeight">50%</span></div>
  </div>

  <h3 style="font-size:1rem;margin-bottom:1rem">When Each Approach Wins</h3>
  <div class="when-grid">
    <div class="when-card">
      <h4 style="color:#3b82f6">Keyword Search Wins</h4>
      <p>Error codes, product IDs, exact names, legal clauses, API endpoints. When the exact term IS the meaning.</p>
    </div>
    <div class="when-card">
      <h4 style="color:#10b981">Semantic Search Wins</h4>
      <p>Conceptual questions, synonym-heavy queries, "how to" questions, finding related content across different phrasings.</p>
    </div>
    <div class="when-card">
      <h4 style="color:#f59e0b">Hybrid Wins</h4>
      <p>Real-world queries that mix specific terms with concepts: "how to fix error 404 in React" needs both keyword AND semantic understanding.</p>
    </div>
  </div>

  <div class="narration">
    <strong>Implementation:</strong> Most vector databases support hybrid search natively. Weaviate uses BM25 + vector. Pinecone has sparse-dense vectors. The key parameter is the <strong>alpha weight</strong> — the balance between keyword and semantic scores. Typical production values are 0.3-0.7 semantic weight.
  </div>

  <button class="complete-btn" id="completeBtn" onclick="completeLesson()">Complete Lesson — Claim 200 XP</button>
  </div>

<script>
const DOCS = [
  {id:1, text:"HTTP 404 error: page not found. Check the URL path and ensure the route exists in your application.", keywords:['404','error','http','page','not','found','url','route']},
  {id:2, text:"Common web errors include 500 Internal Server Error, 403 Forbidden, and 404 Not Found responses.", keywords:['errors','500','403','404','server','forbidden','found']},
  {id:3, text:"When users can't find what they're looking for, the experience breaks down and frustration increases.", keywords:['users','find','looking','experience','frustration']},
  {id:4, text:"Troubleshooting missing pages: verify the deployment, check routing config, and look at server access logs.", keywords:['troubleshooting','missing','pages','deployment','routing','server','logs']},
  {id:5, text:"Our customers are happy with the new dashboard redesign. Satisfaction scores increased 34% this quarter.", keywords:['customers','happy','dashboard','redesign','satisfaction','scores']},
  {id:6, text:"Joyful users tend to become repeat customers. Positive experiences drive loyalty and word-of-mouth growth.", keywords:['joyful','users','repeat','customers','positive','experiences','loyalty','growth']},
  {id:7, text:"Customer satisfaction metrics should track NPS, CSAT, and retention rates across all product touchpoints.", keywords:['customer','satisfaction','metrics','nps','csat','retention']},
  {id:8, text:"Machine learning fundamentals: supervised learning, neural networks, gradient descent, and backpropagation.", keywords:['machine','learning','fundamentals','supervised','neural','networks','gradient','backpropagation']},
  {id:9, text:"Introduction to AI: artificial intelligence encompasses machine learning, deep learning, and natural language processing.", keywords:['ai','artificial','intelligence','machine','learning','deep','natural','language','processing']},
  {id:10, text:"Getting started with ML: first understand your data, choose the right algorithm, train, evaluate, and deploy.", keywords:['ml','data','algorithm','train','evaluate','deploy']},
];

// Semantic similarity clusters
const SEM_CLUSTERS = {
  'error 404': [1,2,4,3,8],
  'happy customers': [5,6,7,3,10],
  'machine learning basics': [8,9,10,3,6],
};

function keywordScore(query, doc){
  const qWords = query.toLowerCase().split(/\s+/).filter(w=>w.length>1);
  let score = 0;
  qWords.forEach(w=>{
    if(doc.keywords.some(k=>k.includes(w)||w.includes(k))) score += 1/qWords.length;
    if(doc.text.toLowerCase().includes(w)) score += 0.3/qWords.length;
  });
  return Math.min(1, score);
}

function semanticScore(query, doc){
  const q = query.toLowerCase();
  // Check cluster mappings
  let bestCluster = null, bestMatch = 0;
  for(const [cq, cids] of Object.entries(SEM_CLUSTERS)){
    const overlap = cq.split(' ').filter(w=>q.includes(w)).length / cq.split(' ').length;
    if(overlap > bestMatch){bestMatch = overlap; bestCluster = cids;}
  }
  if(bestCluster && bestMatch > 0.3){
    const idx = bestCluster.indexOf(doc.id);
    if(idx >= 0) return 1 - idx * 0.15;
  }
  // Fallback: simple word overlap with semantic expansion
  const qWords = q.split(/\s+/);
  let score = 0;
  qWords.forEach(w=>{
    if(doc.text.toLowerCase().includes(w)) score += 0.2;
    // Semantic synonyms
    const syns = {'error':['problem','issue','bug'],'happy':['joyful','satisfied','positive'],'learning':['training','education','understanding'],'basics':['fundamentals','introduction','getting started']};
    if(syns[w]) syns[w].forEach(s=>{if(doc.text.toLowerCase().includes(s)) score+=0.15;});
  });
  return Math.min(1, score + Math.random()*0.1);
}

function search(){
  const query = document.getElementById('queryInput').value.trim();
  if(!query) return;
  const alpha = parseInt(document.getElementById('weightSlider').value)/100; // 0=keyword, 1=semantic
  document.getElementById('kwWeight').textContent = (100-alpha*100).toFixed(0)+'%';
  document.getElementById('semWeight').textContent = (alpha*100).toFixed(0)+'%';

  const kwResults = DOCS.map(d=>({...d, score:keywordScore(query,d)})).sort((a,b)=>b.score-a.score).slice(0,5);
  const semResults = DOCS.map(d=>({...d, score:semanticScore(query,d)})).sort((a,b)=>b.score-a.score).slice(0,5);
  const hybridResults = DOCS.map(d=>{
    const kw = keywordScore(query,d);
    const sem = semanticScore(query,d);
    return {...d, score: kw*(1-alpha) + sem*alpha, kwScore:kw, semScore:sem};
  }).sort((a,b)=>b.score-a.score).slice(0,5);

  const grid = document.getElementById('resultsGrid');
  grid.innerHTML = `
    <div class="result-col">
      <h4><span class="dot" style="background:#3b82f6"></span> Keyword (BM25)</h4>
      ${kwResults.map((d,i)=>`<div class="result-item${i===0?' top':''}"><span class="text">${d.text.substring(0,80)}...</span><span class="score" style="color:#3b82f6">${d.score.toFixed(2)}</span></div>`).join('')}
    </div>
    <div class="result-col">
      <h4><span class="dot" style="background:#10b981"></span> Semantic (Vector)</h4>
      ${semResults.map((d,i)=>`<div class="result-item${i===0?' top':''}"><span class="text">${d.text.substring(0,80)}...</span><span class="score" style="color:#10b981">${d.score.toFixed(2)}</span></div>`).join('')}
    </div>
    <div class="result-col best">
      <h4><span class="dot" style="background:#f59e0b"></span> Hybrid (${(100-alpha*100).toFixed(0)}/${(alpha*100).toFixed(0)})</h4>
      ${hybridResults.map((d,i)=>`<div class="result-item${i===0?' top':''}"><span class="text">${d.text.substring(0,80)}...</span><span class="score" style="color:#f59e0b">${d.score.toFixed(2)}</span></div>`).join('')}
    </div>`;

  // Insight
  const kwTop = kwResults[0], semTop = semResults[0], hybTop = hybridResults[0];
  document.getElementById('insightBox').innerHTML = `<strong>Analysis:</strong> Keyword search ranked doc #${kwTop.id} highest (exact term matches). Semantic search preferred doc #${semTop.id} (meaning similarity). Hybrid at ${(alpha*100).toFixed(0)}% semantic weight chose doc #${hybTop.id} — ${alpha>0.5?'leaning toward meaning-based results':'prioritizing exact keyword matches'}.`;
}

document.getElementById('queryInput').addEventListener('keydown',e=>{if(e.key==='Enter')search();});
search();

function completeLesson(){
  const btn=document.getElementById('completeBtn');
  if(btn.classList.contains('done')) return;
  const progress=JSON.parse(localStorage.getItem('rag-vector-search-progress')||'{}');
  progress['hybrid-search']=true;
  localStorage.setItem('rag-vector-search-progress',JSON.stringify(progress));
  LO.completeLesson('rag-vector-search',7,200);
  btn.textContent='Lesson Complete!';btn.classList.add('done');
}
(function(){const p=JSON.parse(localStorage.getItem('rag-vector-search-progress')||'{}');if(p['hybrid-search']){const b=document.getElementById('completeBtn');b.textContent='Lesson Complete!';b.classList.add('done');}})();
</script>
