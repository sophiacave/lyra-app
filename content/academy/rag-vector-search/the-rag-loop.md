---
title: "The RAG Loop"
course: "rag-vector-search"
order: 4
type: "lesson"
free: false
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>
  <a href="index.html" class="nav-link">&larr; Back to Course</a>
</nav>
<div class="container">
  <div class="lesson-header">
    <div class="meta">
      <span class="type-badge">Animated</span>
      <span class="xp-badge">+200 XP</span>
      <span class="time-badge">~60 min</span>
    </div>
    <h1>The RAG Loop</h1>
    <p>Follow a query through the complete RAG pipeline — from user question to AI-generated answer grounded in your data.</p>
  </div>

  <div class="narration">
    <strong>RAG in one sentence:</strong> Instead of hoping the LLM memorized the answer, we <strong>find</strong> the relevant documents and <strong>hand them to the LLM</strong> along with the question. Click "Play" to watch the pipeline animate, or click any step to explore it.
  </div>

  <canvas id="pipeCanvas" width="760" height="340"></canvas>

  <div class="pipeline-controls">
    <button id="playBtn" onclick="playAnimation()">&#9654; Play Animation</button>
    <button onclick="showStep(0)">1. Query</button>
    <button onclick="showStep(1)">2. Embed</button>
    <button onclick="showStep(2)">3. Search</button>
    <button onclick="showStep(3)">4. Retrieve</button>
    <button onclick="showStep(4)">5. Augment</button>
    <button onclick="showStep(5)">6. Generate</button>
  </div>

  <div class="step-detail" id="stepDetail">
    <h3>Click a step or press Play</h3>
    <div class="desc">Each step of the RAG pipeline transforms data in a specific way. Click any step above to see what happens at that point, including the actual code and data.</div>
  </div>

  <button class="complete-btn" id="completeBtn" onclick="completeLesson()">Complete Lesson — Claim 200 XP</button>
  <div class="footer-nav">
    <a href="chunking-strategies.html">&larr; Previous: Chunking Strategies</a>
    <a href="build-your-first-rag.html">Next: Build Your First RAG &rarr;</a>
  </div>
</div>

<script>
const STEPS = [
  {
    name:'User Query',
    color:'#3b82f6',
    desc:'The user asks a natural language question. This is the starting point of every RAG loop.',
    code:`user_query = "What are the side effects of metformin?"`,
    data:`Input: "What are the side effects of metformin?"
Type: string
Length: 46 characters`
  },
  {
    name:'Embed Query',
    color:'#8b5cf6',
    desc:'The query is converted to a vector embedding using the same model that embedded the documents. This ensures the query lives in the same semantic space so the comparison is meaningful.',
    code:`# Convert the user's question into a vector (list of numbers)
# so we can compare it against our stored document vectors.
from openai import OpenAI
client = OpenAI()

response = client.embeddings.create(
    model="text-embedding-3-small",
    input=user_query
)
query_vector = response.data[0].embedding
# Returns: [0.023, -0.041, 0.089, ...] (1536 dims)`,
    data:`Output: float[1536]
[0.023, -0.041, 0.089, 0.012, -0.067, 0.034, ...]
Model: text-embedding-3-small
Latency: ~50ms`
  },
  {
    name:'Vector Search',
    color:'#10b981',
    desc:'The query vector is compared against all stored document vectors using cosine similarity (a measure of how similar two vectors are by their direction). The vector database returns the top-K most similar chunks. This is fast because of a special index structure that avoids comparing every single vector.',
    code:`# This code asks the vector database: "find the 3 chunks
# most similar to my question."
results = vector_db.query(
    vector=query_vector,
    top_k=3,
    include_metadata=True
)
# Uses an HNSW index for fast search
# Searches millions of vectors in <10ms`,
    data:`Search: cosine_similarity(query_vec, doc_vecs)
Index type: HNSW (a graph-based structure that finds
  approximate nearest neighbors very quickly)
Vectors searched: 50,000
Top 3 results returned in 8ms`
  },
  {
    name:'Retrieve Chunks',
    color:'#f59e0b',
    desc:'The matching document chunks are retrieved with their text content and similarity scores (0 to 1, where higher means more relevant). These are the pieces of knowledge the LLM will use.',
    code:`# Pull out the actual text and scores from the search results.
chunks = []
for match in results.matches:
    chunks.append({
        "text": match.metadata["text"],
        "score": match.score,
        "source": match.metadata["source"]
    })`,
    data:`Retrieved 3 chunks:

[0.94] "Common side effects of metformin include
nausea, diarrhea, and stomach pain. These
usually improve after a few weeks..."
Source: drug_guide.pdf, page 42

[0.91] "Metformin may rarely cause lactic acidosis,
a serious condition. Seek immediate medical
attention if you experience..."
Source: safety_warnings.pdf, page 7

[0.87] "Long-term metformin use has been associated
with vitamin B12 deficiency. Regular monitoring
is recommended..."
Source: clinical_studies.pdf, page 156`
  },
  {
    name:'Augment Prompt',
    color:'#ec4899',
    desc:'The retrieved chunks are inserted into a prompt template along with the original question. This "augmented" (enriched with extra information) prompt gives the LLM the specific context it needs to answer accurately.',
    code:`# Build the final prompt: the retrieved chunks + the question.
prompt = f"""Answer the question based ONLY on the
provided context. If the context doesn't contain
the answer, say "I don't know."

Context:
{chr(10).join(c['text'] for c in chunks)}

Question: {user_query}

Answer:"""`,
    data:`Final prompt (sent to LLM):
─────────────────────────
System: You are a medical information assistant.
Answer based ONLY on the provided context.

Context:
[3 retrieved chunks inserted here - 847 tokens]

Question: What are the side effects of metformin?

Answer:
─────────────────────────
Total tokens: ~950 (context) + ~20 (question)`
  },
  {
    name:'LLM Response',
    color:'#ef4444',
    desc:'The LLM generates an answer grounded in the retrieved context. Because it has the actual documents, it can give specific, accurate, sourced answers instead of hallucinating (making up plausible-sounding but incorrect information).',
    code:`# Send the augmented prompt to the LLM to generate the answer.
response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": augmented_prompt}
    ],
    temperature=0.1  # Low temp for factual answers
)
answer = response.choices[0].message.content`,
    data:`Generated Answer:
─────────────────────────
"Based on the provided medical literature,
metformin has several known side effects:

**Common:** Nausea, diarrhea, and stomach pain
(typically improve after a few weeks of use).

**Serious (rare):** Lactic acidosis — seek
immediate medical attention if symptoms occur.

**Long-term:** Vitamin B12 deficiency with
extended use; regular monitoring recommended.

Sources: drug_guide.pdf, safety_warnings.pdf,
clinical_studies.pdf"
─────────────────────────
Grounded: YES | Hallucinated: NO`
  }
];

const canvas = document.getElementById('pipeCanvas');
const ctx = canvas.getContext('2d');
let dpr = window.devicePixelRatio||1;
let activeStep = -1;
let animProgress = 0;
let animating = false;
let animFrame = null;

function initCanvas(){
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width*dpr;
  canvas.height = rect.height*dpr;
  ctx.scale(dpr,dpr);
  draw();
}

function draw(){
  const w = canvas.getBoundingClientRect().width;
  const h = canvas.getBoundingClientRect().height;
  ctx.clearRect(0,0,w,h);

  const stepW = (w-60)/6;
  const cy = h/2;
  const boxH = 60;
  const boxW = stepW-16;

  STEPS.forEach((step,i)=>{
    const cx = 30 + i*stepW + stepW/2;
    const isActive = i===activeStep;
    const isPast = i<activeStep;
    const alpha = isActive?1:(isPast?0.7:0.35);

    // Connection arrow
    if(i<5){
      const nx = 30+(i+1)*stepW+stepW/2;
      const arrowActive = animating ? animProgress > i : isPast;
      ctx.strokeStyle = arrowActive ? step.color+'cc' : 'rgba(255,255,255,.1)';
      ctx.lineWidth = arrowActive ? 3 : 1.5;
      ctx.beginPath();
      ctx.moveTo(cx+boxW/2+4, cy);
      ctx.lineTo(nx-boxW/2-4, cy);
      ctx.stroke();
      // Arrow head
      if(arrowActive){
        const ax = nx-boxW/2-4;
        ctx.fillStyle = step.color;
        ctx.beginPath();ctx.moveTo(ax,cy-5);ctx.lineTo(ax+8,cy);ctx.lineTo(ax,cy+5);ctx.fill();
      }
    }

    // Animated pulse
    if(isActive && animating){
      ctx.beginPath();ctx.roundRect(cx-boxW/2-6,cy-boxH/2-6,boxW+12,boxH+12,14);
      ctx.fillStyle=step.color+'15';ctx.fill();
    }

    // Box
    ctx.beginPath();ctx.roundRect(cx-boxW/2,cy-boxH/2,boxW,boxH,10);
    ctx.fillStyle = isActive?step.color+'25':'rgba(255,255,255,.03)';
    ctx.fill();
    ctx.strokeStyle = isActive?step.color:(isPast?step.color+'60':'rgba(255,255,255,.08)');
    ctx.lineWidth = isActive?2:1;
    ctx.stroke();

    // Step number
    ctx.fillStyle = step.color;
    ctx.globalAlpha = alpha;
    ctx.font = '700 11px Inter,sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText((i+1).toString(), cx, cy-boxH/2-8);

    // Label
    ctx.font = (isActive?'700':'600')+' '+(isActive?'12px':'11px')+' Inter,sans-serif';
    ctx.fillStyle = isActive?'#fff':step.color;
    const words = step.name.split(' ');
    if(words.length>1){
      ctx.fillText(words[0],cx,cy-4);
      ctx.fillText(words.slice(1).join(' '),cx,cy+12);
    } else {
      ctx.fillText(step.name,cx,cy+4);
    }
    ctx.globalAlpha = 1;
  });

  // Data flow particle during animation
  if(animating && activeStep>=0 && activeStep<5){
    const frac = (animProgress - Math.floor(animProgress));
    const i = Math.floor(animProgress);
    if(i>=0 && i<5){
      const cx1 = 30+i*stepW+stepW/2+boxW/2;
      const cx2 = 30+(i+1)*stepW+stepW/2-boxW/2;
      const px = cx1+(cx2-cx1)*frac;
      ctx.beginPath();ctx.arc(px,cy,5,0,Math.PI*2);
      ctx.fillStyle=STEPS[i].color;ctx.fill();
      ctx.beginPath();ctx.arc(px,cy,8,0,Math.PI*2);
      ctx.fillStyle=STEPS[i].color+'30';ctx.fill();
    }
  }
}

function showStep(i){
  activeStep=i;
  animating=false;
  if(animFrame) cancelAnimationFrame(animFrame);
  draw();
  const step=STEPS[i];
  const detail=document.getElementById('stepDetail');
  detail.innerHTML=`<h3 style="color:${step.color}">Step ${i+1}: ${step.name}</h3>
    <div class="desc">${step.desc}</div>
    <pre>${step.code}</pre>
    <div class="data-preview" style="margin-top:1rem;white-space:pre-wrap">${step.data}</div>`;

  // Update button states
  document.querySelectorAll('.pipeline-controls button').forEach((b,idx)=>{
    if(idx===0) return;
    b.classList.toggle('active',idx-1===i);
  });
}

function playAnimation(){
  animating=true;
  animProgress=-0.5;
  activeStep=0;
  const btn=document.getElementById('playBtn');
  btn.classList.add('active');

  function tick(){
    animProgress+=0.015;
    const stepIdx=Math.floor(animProgress+0.5);
    if(stepIdx!==activeStep && stepIdx>=0 && stepIdx<6){
      activeStep=stepIdx;
      showStep(stepIdx);
      animating=true; // showStep sets this false
    }
    draw();
    if(animProgress<5.5){
      animFrame=requestAnimationFrame(tick);
    } else {
      animating=false;
      btn.classList.remove('active');
      draw();
    }
  }
  tick();
}

canvas.addEventListener('click',e=>{
  const rect=canvas.getBoundingClientRect();
  const mx=e.clientX-rect.left;
  const w=rect.width;
  const stepW=(w-60)/6;
  const i=Math.floor((mx-30)/stepW);
  if(i>=0&&i<6) showStep(i);
});

window.addEventListener('resize',initCanvas);
initCanvas();
showStep(0);

function completeLesson(){
  const btn=document.getElementById('completeBtn');
  if(btn.classList.contains('done')) return;
  const progress=JSON.parse(localStorage.getItem('rag-vector-search-progress')||'{}');
  progress['the-rag-loop']=true;
  localStorage.setItem('rag-vector-search-progress',JSON.stringify(progress));
  LO.completeLesson('rag-vector-search',4,200);
  btn.textContent='Lesson Complete!';btn.classList.add('done');
}
(function(){const p=JSON.parse(localStorage.getItem('rag-vector-search-progress')||'{}');if(p['the-rag-loop']){const b=document.getElementById('completeBtn');b.textContent='Lesson Complete!';b.classList.add('done');}})();
</script>
