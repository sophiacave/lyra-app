---
title: "Build Your First RAG"
course: "rag-vector-search"
order: 5
type: "builder"
free: false
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>
  
</nav>
<div class="container">
  <div class="lesson-header">
    <div class="meta">
      <span class="type-badge">Builder</span>
      <span class="xp-badge">+250 XP</span>
      <span class="time-badge">~75 min</span>
    </div>
    <h1>Build Your First RAG</h1>
    <p>Walk through building a complete RAG system step by step. Choose your documents, chunk them, embed them, store them, and query them.</p>
  </div>

  <button class="complete-btn" id="completeBtn" onclick="completeLesson()">Complete Lesson — Claim 250 XP</button>
  </div>

<script>
const DOCS = [
  {id:'cooking',title:'Cooking Guide',desc:'Italian recipes: pasta, pizza, risotto techniques.',text:'Italian cooking emphasizes fresh ingredients and simple techniques. Pasta should be cooked al dente in well-salted water. Risotto requires constant stirring and gradual addition of warm broth. Pizza dough needs at least 24 hours of cold fermentation for the best flavor. The key to a great tomato sauce is San Marzano tomatoes, olive oil, garlic, and fresh basil. Never overcook garlic — it becomes bitter. Fresh mozzarella should be added at the end of baking.'},
  {id:'space',title:'Space Exploration',desc:'Solar system facts, Mars missions, rocket propulsion.',text:'Mars is the fourth planet from the Sun with a thin atmosphere of mostly carbon dioxide. The Perseverance rover landed in Jezero Crater in February 2021 to search for ancient microbial life. SpaceX Starship is designed to carry 100 passengers to Mars. The journey takes approximately 7 months using a Hohmann transfer orbit. The first human mission to Mars is planned for the late 2030s. Rocket propulsion works by Newton third law: exhaust gases push backward, the rocket moves forward.'},
  {id:'health',title:'Nutrition Basics',desc:'Macronutrients, vitamins, hydration science.',text:'The three macronutrients are proteins, carbohydrates, and fats. Protein is essential for muscle repair and immune function, recommended intake is 0.8-1.6g per kilogram of body weight. Carbohydrates are the body primary energy source. Complex carbs from whole grains release energy slowly. Healthy fats from avocados, nuts, and olive oil support brain function. The average adult needs 2-3 liters of water daily. Vitamin D deficiency affects over 1 billion people worldwide.'},
  {id:'python',title:'Python Programming',desc:'Functions, classes, async patterns, best practices.',text:'Python functions are defined with the def keyword and can return multiple values using tuples. Classes use __init__ for constructors and self to reference instance attributes. List comprehensions provide a concise way to create lists: [x**2 for x in range(10)]. Async functions use async def and await for non-blocking I/O. Type hints improve code readability: def greet(name: str) -> str. Virtual environments isolate project dependencies. PEP 8 recommends 4-space indentation and 79-character line limits.'}
];

let currentStep = 0;
let selectedDocs = [];
let selectedModel = 'small';
let chunkData = [];
const TOTAL_STEPS = 6;
const STEP_NAMES = ['Choose Docs','Chunk','Embed','Store','Query','Generate'];

function renderTracker(){
  document.getElementById('stepTracker').innerHTML = STEP_NAMES.map((name,i)=>
    `<div class="step-dot${i===currentStep?' active':''}${i<currentStep?' done':''}" onclick="goStep(${i})">${i+1}. ${name}</div>`
  ).join('');
}

function goStep(i){
  if(i>currentStep) return; // Can't skip ahead
  currentStep=i;
  renderTracker();
  renderStep();
}

function nextStep(){
  if(currentStep<TOTAL_STEPS-1){currentStep++;renderTracker();renderStep();}
}

function renderStep(){
  const area = document.getElementById('builderArea');
  switch(currentStep){
    case 0: renderChooseDocs(area); break;
    case 1: renderChunk(area); break;
    case 2: renderEmbed(area); break;
    case 3: renderStore(area); break;
    case 4: renderQuery(area); break;
    case 5: renderGenerate(area); break;
  }
}

function renderChooseDocs(area){
  area.innerHTML = `<h3>Step 1: Choose Your Documents</h3>
    <div class="desc"><strong>Why this step matters:</strong> Your RAG system can only answer questions about information it has seen. The documents you select here become the system's entire knowledge base. In production, this could be thousands of PDFs, web pages, or database records. Select at least one topic to continue.</div>
    <div class="doc-grid">${DOCS.map(d=>`<div class="doc-card${selectedDocs.includes(d.id)?' selected':''}" onclick="toggleDoc('${d.id}')">
      <h4>${d.title}</h4><p>${d.desc}</p>
    </div>`).join('')}</div>
    <p style="font-size:.8rem;color:#71717a;margin-bottom:1rem">Selected: ${selectedDocs.length} document(s)</p>
    ${selectedDocs.length>0?'<button class="next-step-btn" onclick="nextStep()">Next: Chunk Documents &rarr;</button>':'<p style="color:#fb923c;font-size:.85rem">Select at least one document to continue.</p>'}`;
}
window.toggleDoc=function(id){
  const i=selectedDocs.indexOf(id);
  if(i>=0) selectedDocs.splice(i,1); else selectedDocs.push(id);
  renderStep();
};

function renderChunk(area){
  const docs=DOCS.filter(d=>selectedDocs.includes(d.id));
  chunkData=[];
  const colors=['#10b981','#3b82f6','#f59e0b','#ec4899'];
  docs.forEach((d,di)=>{
    const words=d.text.split(/\s+/);
    for(let i=0;i<words.length;i+=30){
      chunkData.push({text:words.slice(i,i+40).join(' '),source:d.title,color:colors[di%4]});
    }
  });
  area.innerHTML=`<h3>Step 2: Chunk the Documents</h3>
    <div class="desc"><strong>Why this step matters:</strong> Documents are too long to embed as a single vector. We split them into smaller pieces so each chunk captures one focused idea, making search results more precise. Splitting ${docs.length} document(s) into ${chunkData.length} chunks of ~40 words each with 10-word overlap.</div>
    <div class="chunk-preview">${chunkData.map((c,i)=>`<div class="chunk-item" style="border-color:${c.color}"><strong style="color:${c.color}">Chunk ${i+1}</strong> (${c.source}): ${c.text.substring(0,120)}...</div>`).join('')}</div>
    <div class="code-block">chunks = text_splitter.split_documents(
    documents,
    chunk_size=40,    # words per chunk
    chunk_overlap=10  # overlap between chunks
)
print(f"Created {len(chunks)} chunks")  # ${chunkData.length} chunks</div>
    <button class="next-step-btn" onclick="nextStep()">Next: Embed Chunks &rarr;</button>`;
}

function renderEmbed(area){
  area.innerHTML=`<h3>Step 3: Choose Embedding Model</h3>
    <div class="desc"><strong>Why this step matters:</strong> The embedding model determines how well your system understands meaning. Better models produce more nuanced vectors but cost more. <strong>Recommendation:</strong> Start with text-embedding-3-small -- it is the best balance of quality, speed, and cost for most use cases.</div>
    <div class="model-options">
      <div class="model-opt${selectedModel==='small'?' selected':''}" onclick="selectedModel='small';renderStep()">
        <div class="name">text-embedding-3-small</div>
        <div class="detail">1536 dims | $0.02/1M tokens | Fast</div>
      </div>
      <div class="model-opt${selectedModel==='large'?' selected':''}" onclick="selectedModel='large';renderStep()">
        <div class="name">text-embedding-3-large</div>
        <div class="detail">3072 dims | $0.13/1M tokens | Best quality</div>
      </div>
      <div class="model-opt${selectedModel==='cohere'?' selected':''}" onclick="selectedModel='cohere';renderStep()">
        <div class="name">Cohere embed-v3</div>
        <div class="detail">1024 dims | $0.10/1M tokens | Multilingual</div>
      </div>
    </div>
    <div class="code-block">embeddings = embed_model.embed_documents(
    [chunk.text for chunk in chunks]
)
# ${chunkData.length} chunks x ${selectedModel==='large'?3072:selectedModel==='cohere'?1024:1536} dimensions
# = ${chunkData.length} vectors ready for storage

# Example vector for chunk 1:
# [0.023, -0.041, 0.089, 0.012, -0.067, ...]</div>
    <button class="next-step-btn" onclick="nextStep()">Next: Store in Vector DB &rarr;</button>`;
}

function renderStore(area){
  const dims=selectedModel==='large'?3072:selectedModel==='cohere'?1024:1536;
  area.innerHTML=`<h3>Step 4: Store in Vector Database</h3>
    <div class="desc"><strong>Why this step matters:</strong> Storing vectors in a specialized database (not a regular one) enables lightning-fast similarity search. Uploading ${chunkData.length} vectors (${dims} dimensions each). An index is built so searches take milliseconds, not minutes.</div>
    <div class="code-block">import chromadb

client = chromadb.Client()
collection = client.create_collection(
    name="my_rag_knowledge",
    metadata={"hnsw:space": "cosine"}
)

collection.add(
    documents=[c.text for c in chunks],
    embeddings=embeddings,
    metadatas=[{"source": c.source} for c in chunks],
    ids=[f"chunk_{i}" for i in range(len(chunks))]
)

print(f"Stored {collection.count()} vectors")  # ${chunkData.length}</div>
    <div style="display:flex;gap:1rem;flex-wrap:wrap;margin:1rem 0">
      <div style="background:rgba(16,185,129,.08);border-radius:8px;padding:.75rem 1rem;font-size:.8rem"><strong style="color:#10b981">${chunkData.length}</strong> vectors stored</div>
      <div style="background:rgba(56,189,248,.08);border-radius:8px;padding:.75rem 1rem;font-size:.8rem"><strong style="color:#38bdf8">${dims}</strong> dimensions each</div>
      <div style="background:rgba(251,146,60,.08);border-radius:8px;padding:.75rem 1rem;font-size:.8rem"><strong style="color:#fb923c">HNSW</strong> index built</div>
    </div>
    <button class="next-step-btn" onclick="nextStep()">Next: Query the System &rarr;</button>`;
}

function renderQuery(area){
  area.innerHTML=`<h3>Step 5: Query Your Knowledge Base</h3>
    <div class="desc"><strong>Why this step matters:</strong> This is where it all comes together -- your question is converted to a vector, compared against all stored chunks, and the best matches are returned. Try changing the question to see how results change.</div>
    <div class="query-test">
      <input type="text" id="queryInput" placeholder="Ask a question about your documents..." value="How do you make a good tomato sauce?">
      <button class="next-step-btn" onclick="runQuery()" style="margin-bottom:1rem">Search</button>
      </div>`;
  setTimeout(()=>runQuery(),100);
}
window.runQuery=function(){
  const q=document.getElementById('queryInput').value.toLowerCase();
  const results=chunkData.map(c=>({...c,score:calcRelevance(q,c.text)})).sort((a,b)=>b.score-a.score).slice(0,3);
  const box=document.getElementById('queryResults');
  box.style.display='block';
  box.innerHTML=`<strong style="color:#10b981">Top 3 Retrieved Chunks:</strong><br><br>`+
    results.map((r,i)=>`<div style="margin-bottom:.75rem;padding:.5rem;background:rgba(0,0,0,.2);border-radius:6px">
      <span style="color:#fb923c;font-weight:700">Score: ${r.score.toFixed(3)}</span> | <span style="color:#71717a">${r.source}</span><br>
      <span style="font-size:.8rem">${r.text.substring(0,150)}...</span>
    </div>`).join('')+
    `<br><button class="next-step-btn" onclick="nextStep()">Next: Generate Answer &rarr;</button>`;
};

function calcRelevance(query,text){
  const qWords=query.split(/\s+/).filter(w=>w.length>2);
  const tLower=text.toLowerCase();
  let score=0;
  qWords.forEach(w=>{if(tLower.includes(w)) score+=0.15;});
  return Math.min(0.95,score+Math.random()*0.2+0.3);
}

function renderGenerate(area){
  const q=document.getElementById('queryInput')?.value||'How do you make a good tomato sauce?';
  area.innerHTML=`<h3>Step 6: Generate the Answer</h3>
    <div class="desc">The retrieved chunks are passed to the LLM as context, along with the original question. The LLM generates a grounded answer.</div>
    <div class="code-block">response = openai.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": "Answer based ONLY on the provided context."},
        {"role": "user", "content": f"""
Context:
{retrieved_chunks}

Question: ${q}

Answer:"""}
    ]
)</div>
    <div style="background:rgba(16,185,129,.08);border:1px solid rgba(16,185,129,.2);border-radius:10px;padding:1.25rem;margin:1.5rem 0;line-height:1.7">
      <strong style="color:#10b981">Generated Answer:</strong><br><br>
      Based on the provided documents, a good tomato sauce starts with San Marzano tomatoes, combined with olive oil, garlic, and fresh basil. The key is to never overcook the garlic, as it becomes bitter. Keep the technique simple and let the quality of the fresh ingredients shine through.<br><br>
      <span style="color:#71717a;font-size:.8rem">Source: Cooking Guide | Grounded in retrieved context (Simulation -- in production this would call a real LLM)</span>
    </div>
    <div style="background:rgba(251,146,60,.08);border:1px solid rgba(251,146,60,.2);border-radius:10px;padding:1rem;font-size:.85rem;line-height:1.6">
      <strong style="color:#fb923c">You built a complete RAG system!</strong> In production, you would add evaluation metrics (Lesson 8), hybrid search (Lesson 7), and advanced patterns (Lesson 9) to make it robust.
    </div>`;
}

renderTracker();
renderStep();

function completeLesson(){
  const btn=document.getElementById('completeBtn');
  if(btn.classList.contains('done')) return;
  const progress=JSON.parse(localStorage.getItem('rag-vector-search-progress')||'{}');
  progress['build-your-first-rag']=true;
  localStorage.setItem('rag-vector-search-progress',JSON.stringify(progress));
  LO.completeLesson('rag-vector-search',5,250);
  btn.textContent='Lesson Complete!';btn.classList.add('done');
}
(function(){const p=JSON.parse(localStorage.getItem('rag-vector-search-progress')||'{}');if(p['build-your-first-rag']){const b=document.getElementById('completeBtn');b.textContent='Lesson Complete!';b.classList.add('done');}})();
</script>
