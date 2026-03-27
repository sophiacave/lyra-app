---
title: "Vector Databases 101"
course: "rag-vector-search"
order: 2
type: "lesson"
free: true
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>
  
</nav>
<div class="container">
  <div class="lesson-header">
    <div class="meta">
      <span class="type-badge">Visual</span>
      <span class="xp-badge">+200 XP</span>
      <span class="time-badge">~50 min</span>
    </div>
    <h1>Vector Databases 101</h1>
    <p>Traditional databases find exact matches. Vector databases find similar meanings. This changes everything about how AI retrieves information.</p>
  </div>

  <div class="narration">
    <strong>The problem:</strong> You search a traditional database for "joyful" and it returns nothing — because the data contains "happy," not "joyful." A vector database finds "happy" because it understands they <strong>mean the same thing</strong>. Type a query below to see the difference.
  </div>

  <div class="search-box">
    <label>Search both databases with the same query:</label>
    <div class="search-row">
      <input type="text" id="queryInput" placeholder='Try "joyful", "automobile", "canine"...' value="joyful">
      <button onclick="runSearch()">Search</button>
    </div>
  </div>

  <div class="compare">
    <div class="db-panel" id="tradPanel">
      <h3><span class="icon">&#128451;</span> Traditional Database</h3>
      <p class="subtitle">Exact keyword matching (SQL LIKE)</p>
      <p class="result-label" id="tradLabel">Results for "joyful":</p>
      <table class="table-viz" id="tradTable">
        <thead><tr><th>ID</th><th>Text</th><th>Match</th></tr></thead>
        <tbody id="tradBody"></tbody>
      </table>
    </div>
    <div class="db-panel" id="vecPanel">
      <h3><span class="icon">&#128269;</span> Vector Database</h3>
      <p class="subtitle">Semantic similarity search</p>
      <p class="result-label" id="vecLabel">Results for "joyful":</p>
      <div id="vecResults"></div>
      </div>
  </div>

  <div class="insight" id="insightBox">
    <strong>Notice:</strong> The traditional database found <span id="tradCount">0</span> result(s) using exact matching. The vector database found <span id="vecCount">0</span> semantically similar result(s) — even without sharing any words.
  </div>

  <div class="narration">
    <strong>How vector databases work under the hood:</strong> They use special index structures (like HNSW — Hierarchical Navigable Small World graphs) to search billions of vectors in milliseconds. Instead of scanning every row, they navigate a graph of connected vectors to find the nearest neighbors quickly.
  </div>

  <h3 style="font-size:1rem;margin-bottom:1rem">Popular Vector Databases</h3>
  <div class="features">
    <div class="feature"><h4>Pinecone</h4><p>Fully managed, serverless vector DB. Great for getting started fast. Auto-scales.</p></div>
    <div class="feature"><h4>Weaviate</h4><p>Open-source with built-in vectorization. Supports hybrid search natively.</p></div>
    <div class="feature"><h4>Chroma</h4><p>Lightweight, open-source, runs locally. Perfect for prototyping RAG apps.</p></div>
    <div class="feature"><h4>pgvector</h4><p>PostgreSQL extension. Use vectors in your existing Postgres DB. Supabase supports it.</p></div>
    <div class="feature"><h4>Qdrant</h4><p>Rust-based, high-performance. Great filtering + payload support.</p></div>
    <div class="feature"><h4>Milvus</h4><p>Enterprise-grade, handles billions of vectors. Used by major tech companies.</p></div>
  </div>

  <button class="complete-btn" id="completeBtn" onclick="completeLesson()">Complete Lesson — Claim 200 XP</button>
  </div>

<script>
const DOCS = [
  {id:1, text:"The happy dog played in the park", embedding:[0.72,0.68,0.50,0.80]},
  {id:2, text:"She felt cheerful after the good news", embedding:[0.73,0.73,0.65,0.60]},
  {id:3, text:"The database server crashed overnight", embedding:[0.25,0.73,0.15,0.75]},
  {id:4, text:"A joyful celebration was held downtown", embedding:[0.75,0.71,0.68,0.55]},
  {id:5, text:"The car drove quickly down the highway", embedding:[0.40,0.35,0.42,0.38]},
  {id:6, text:"Glad tidings were shared at the meeting", embedding:[0.70,0.65,0.62,0.58]},
  {id:7, text:"Neural networks learn from training data", embedding:[0.20,0.56,0.18,0.58]},
  {id:8, text:"The sad kitten sat alone in the rain", embedding:[0.65,0.25,0.48,0.82]},
  {id:9, text:"Elated fans cheered at the stadium", embedding:[0.76,0.74,0.60,0.45]},
  {id:10, text:"Pizza and pasta are Italian favorites", embedding:[0.85,0.35,0.87,0.38]},
];

const QUERY_EMBEDDINGS = {
  joyful:[0.75,0.71,0.67,0.56],
  automobile:[0.42,0.36,0.40,0.37],
  canine:[0.50,0.78,0.52,0.83],
  delicious:[0.84,0.36,0.86,0.40],
  melancholy:[0.64,0.24,0.63,0.22],
  intelligent:[0.19,0.57,0.20,0.56],
  happy:[0.72,0.68,0.65,0.60],
  computer:[0.23,0.72,0.15,0.75],
  ecstatic:[0.77,0.72,0.68,0.54],
  puppy:[0.52,0.80,0.51,0.83],
};

function getQueryEmbed(q){
  q=q.toLowerCase().trim();
  if(QUERY_EMBEDDINGS[q]) return QUERY_EMBEDDINGS[q];
  let h=0;for(let i=0;i<q.length;i++) h=((h<<5)-h)+q.charCodeAt(i);
  h=Math.abs(h);
  return [(h%1000)/1000,(h*3%1000)/1000,(h*7%1000)/1000,(h*11%1000)/1000];
}

function cosineSim(a,b){
  let dot=0,magA=0,magB=0;
  for(let i=0;i<a.length;i++){dot+=a[i]*b[i];magA+=a[i]**2;magB+=b[i]**2;}
  return dot/(Math.sqrt(magA)*Math.sqrt(magB));
}

function runSearch(){
  const query=document.getElementById('queryInput').value.trim();
  if(!query) return;
  const qLower=query.toLowerCase();

  // Traditional: exact keyword match
  document.getElementById('tradLabel').textContent=`Results for "${query}":`;
  document.getElementById('vecLabel').textContent=`Results for "${query}":`;

  const tradResults=DOCS.map(d=>{
    const match=d.text.toLowerCase().includes(qLower);
    return {...d,match};
  });
  tradResults.sort((a,b)=>b.match-a.match);

  const tbody=document.getElementById('tradBody');
  let tradMatches=0;
  tbody.innerHTML=tradResults.map(d=>{
    if(d.match) tradMatches++;
    return `<tr class="${d.match?'match':'no-match'}"><td>${d.id}</td><td>${d.text}</td><td>${d.match?'YES':'—'}</td></tr>`;
  }).join('');

  // Vector: similarity
  const qEmbed=getQueryEmbed(query);
  const vecResults=DOCS.map(d=>({...d,sim:cosineSim(qEmbed,d.embedding)}));
  vecResults.sort((a,b)=>b.sim-a.sim);
  const top5=vecResults.slice(0,5);
  const threshold=0.85;
  let vecMatches=top5.filter(d=>d.sim>threshold).length;

  document.getElementById('vecResults').innerHTML=top5.map(d=>{
    const isMatch=d.sim>threshold;
    return `<div class="vec-row${isMatch?' match':''}">
      <span class="word">#${d.id}</span>
      <span style="flex:1;font-size:.75rem;color:${isMatch?'#e5e5e5':'#71717a'}">${d.text}</span>
      <div class="vec-bar" style="max-width:80px"></div>
      <span class="score">${d.sim.toFixed(2)}</span>
    </div>`;
  }).join('');

  // Highlight panels
  document.getElementById('tradPanel').classList.toggle('highlight',tradMatches>0);
  document.getElementById('vecPanel').classList.toggle('highlight',vecMatches>0);

  document.getElementById('tradCount').textContent=tradMatches;
  document.getElementById('vecCount').textContent=vecMatches||'several';
}

runSearch();

document.getElementById('queryInput').addEventListener('keydown',e=>{if(e.key==='Enter')runSearch();});

function completeLesson(){
  const btn=document.getElementById('completeBtn');
  if(btn.classList.contains('done')) return;
  const progress=JSON.parse(localStorage.getItem('rag-vector-search-progress')||'{}');
  progress['vector-databases-101']=true;
  localStorage.setItem('rag-vector-search-progress',JSON.stringify(progress));
  LO.completeLesson('rag-vector-search',2,200);
  btn.textContent='Lesson Complete!';btn.classList.add('done');
}
(function(){const p=JSON.parse(localStorage.getItem('rag-vector-search-progress')||'{}');if(p['vector-databases-101']){const b=document.getElementById('completeBtn');b.textContent='Lesson Complete!';b.classList.add('done');}})();
</script>
