---
title: "Chunking Strategies"
course: "rag-vector-search"
order: 3
type: "lesson"
free: true
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>
  <a href="index.html" class="nav-link">&larr; Back to Course</a>
</nav>
<div class="container">
  <div class="lesson-header">
    <div class="meta">
      <span class="type-badge">Interactive</span>
      <span class="xp-badge">+200 XP</span>
      <span class="time-badge">~55 min</span>
    </div>
    <h1>Chunking Strategies</h1>
    <p>Before you can search your documents, you need to split them into chunks. The size and overlap of those chunks dramatically affects retrieval quality.</p>
  </div>

  <div class="narration">
    <strong>Why chunk at all?</strong> Embedding models have token limits (typically 512-8192 tokens). A <strong>token</strong> is roughly 3/4 of a word -- so 100 tokens is about 75 words. A 50-page document won't fit into one embedding. We split it into smaller pieces, embed each piece separately, then search across all chunks. The art is choosing the right chunk size and overlap.
  </div>

  <textarea id="docInput" placeholder="Paste your text here, or use the sample text...">Retrieval-Augmented Generation (RAG) is a technique that enhances large language models by providing them with relevant external knowledge. Instead of relying solely on what the model learned during training, RAG systems retrieve relevant documents at query time and include them in the prompt.

The RAG pipeline consists of several key stages. First, documents are split into manageable chunks. Each chunk is then converted into a vector embedding using an embedding model. These embeddings are stored in a vector database for efficient similarity search.

When a user asks a question, the question is also embedded into a vector. The vector database finds the most similar document chunks. These retrieved chunks are then inserted into the LLM's prompt as context, allowing the model to generate answers grounded in specific, relevant information.

Chunk size is one of the most important parameters in a RAG system. Small chunks (100-200 tokens) provide precise, focused retrieval but may lack context. Large chunks (1000+ tokens) preserve more context but may include irrelevant information and reduce retrieval precision.

Overlap between chunks ensures that information at chunk boundaries isn't lost. A typical overlap of 10-20% means the end of one chunk repeats at the beginning of the next. This redundancy prevents the system from missing relevant passages that happen to fall on a chunk boundary.

Advanced chunking strategies include semantic chunking (splitting at natural topic boundaries), recursive chunking (trying multiple split strategies), and document-aware chunking (respecting headers, paragraphs, and sections). The best strategy depends on your document structure and use case.</textarea>

  <div class="controls">
    <div class="control-group">
      <label>Chunk Size (words)</label>
      <div class="slider-row">
        <input type="range" id="chunkSize" min="20" max="200" value="50" step="10">
        <span class="slider-val" id="chunkSizeVal">50</span>
      </div>
    </div>
    <div class="control-group">
      <label>Overlap (words)</label>
      <div class="slider-row">
        <input type="range" id="overlap" min="0" max="50" value="10" step="5">
        <span class="slider-val" id="overlapVal">10</span>
      </div>
    </div>
    <div class="control-group">
      <label>Strategy</label>
      <div class="slider-row">
        <select id="strategy" style="flex:1;padding:.5rem;border:1px solid rgba(255,255,255,.1);border-radius:8px;background:rgba(255,255,255,.04);color:#e5e5e5;font-family:Inter,sans-serif;font-size:.8rem;outline:none">
          <option value="fixed">Fixed Size</option>
          <option value="sentence">Sentence-Based</option>
          <option value="paragraph">Paragraph-Based</option>
        </select>
      </div>
    </div>
  </div>

  <div class="stats" id="stats"></div>

  <div class="math-display" id="mathDisplay"></div>

  <div class="chunks-viz" id="chunksViz"></div>

  <div class="narration">
    <strong>Rules of thumb:</strong> Start with 200-500 token chunks and 10-20% overlap. <strong>Good overlap</strong> means repeating the last 10-20% of each chunk at the beginning of the next one -- for example, a 100-word chunk with 15-word overlap. This ensures sentences that fall on the boundary between two chunks are not lost. For technical docs, use larger chunks. For Q&A, use smaller chunks. Always test with real queries -- the "best" chunk size depends on your data and questions.
  </div>

  <h3 style="font-size:1rem;margin-bottom:1rem">Chunk Size Tradeoffs</h3>
  <div class="tradeoffs">
    <div class="tradeoff good">
      <h4>Small Chunks (50-200 words)</h4>
      <p>More precise retrieval. Better for specific factual questions. Faster embedding. But may lose context needed to understand the passage.</p>
    </div>
    <div class="tradeoff good">
      <h4>Large Chunks (200-500 words)</h4>
      <p>More context preserved. Better for complex questions requiring reasoning. But may include irrelevant info that confuses the LLM.</p>
    </div>
    <div class="tradeoff bad">
      <h4>Too Small (&lt;50 words)</h4>
      <p>Chunks become meaningless fragments. "The cat sat on" tells the LLM nothing useful. Retrieval becomes noise.</p>
    </div>
    <div class="tradeoff bad">
      <h4>Too Large (&gt;500 words)</h4>
      <p>Dilutes relevance. A chunk about 10 topics matches everything poorly. Also wastes LLM context window tokens.</p>
    </div>
  </div>

  <button class="complete-btn" id="completeBtn" onclick="completeLesson()">Complete Lesson — Claim 200 XP</button>
  <div class="footer-nav">
    <a href="vector-databases-101.html">&larr; Previous: Vector Databases 101</a>
    <a href="the-rag-loop.html">Next: The RAG Loop &rarr;</a>
  </div>
</div>

<script>
const COLORS = ['#10b981','#3b82f6','#f59e0b','#ef4444','#8b5cf6','#ec4899','#06b6d4','#f97316','#14b8a6','#a855f7','#6366f1','#84cc16','#e11d48','#0ea5e9','#d946ef'];

function chunk(){
  const text = document.getElementById('docInput').value.trim();
  if(!text) return;
  const strategy = document.getElementById('strategy').value;
  const chunkSize = parseInt(document.getElementById('chunkSize').value);
  const overlap = parseInt(document.getElementById('overlap').value);

  let chunks = [];

  if(strategy === 'paragraph'){
    const paras = text.split(/\n\s*\n/).filter(p=>p.trim());
    chunks = paras.map(p=>p.trim());
  } else if(strategy === 'sentence'){
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    let current = [];
    let wordCount = 0;
    sentences.forEach(s=>{
      const words = s.trim().split(/\s+/);
      if(wordCount + words.length > chunkSize && current.length > 0){
        chunks.push(current.join(' '));
        // Overlap: keep last N words
        const allWords = current.join(' ').split(/\s+/);
        const overlapWords = allWords.slice(-overlap);
        current = overlap > 0 ? [overlapWords.join(' '), s.trim()] : [s.trim()];
        wordCount = overlapWords.length + words.length;
      } else {
        current.push(s.trim());
        wordCount += words.length;
      }
    });
    if(current.length) chunks.push(current.join(' '));
  } else {
    // Fixed size
    const words = text.split(/\s+/);
    const step = Math.max(1, chunkSize - overlap);
    for(let i = 0; i < words.length; i += step){
      const end = Math.min(i + chunkSize, words.length);
      chunks.push(words.slice(i, end).join(' '));
      if(end >= words.length) break;
    }
  }

  // Stats
  const totalWords = text.split(/\s+/).length;
  const avgChunkWords = chunks.length ? Math.round(chunks.reduce((s,c)=>s+c.split(/\s+/).length,0)/chunks.length) : 0;
  const totalChunkWords = chunks.reduce((s,c)=>s+c.split(/\s+/).length,0);
  const overlapRatio = totalWords > 0 ? ((totalChunkWords - totalWords) / totalWords * 100).toFixed(1) : 0;

  document.getElementById('stats').innerHTML = `
    <div class="stat"><div class="val">${chunks.length}</div><div class="lbl">Chunks</div></div>
    <div class="stat"><div class="val">${totalWords}</div><div class="lbl">Total Words</div></div>
    <div class="stat"><div class="val">${avgChunkWords}</div><div class="lbl">Avg Words/Chunk</div></div>
    <div class="stat"><div class="val">${overlapRatio}%</div><div class="lbl">Overlap Ratio</div></div>
  `;

  const step = Math.max(1, chunkSize - overlap);
  document.getElementById('mathDisplay').innerHTML = `<span class="label">Chunking Calculation</span>
<span class="formula">Total words: ${totalWords}</span>
<span class="formula">Chunk size: ${chunkSize} words | Overlap: ${overlap} words</span>
<span class="formula">Step size: chunk_size - overlap = ${chunkSize} - ${overlap} = <span class="result">${step} words</span></span>
<span class="formula">Number of chunks: ceil((${totalWords} - ${overlap}) / ${step}) = <span class="result">${chunks.length} chunks</span></span>
<span class="formula">Total stored words: ${totalChunkWords} (${overlapRatio}% redundancy from overlap)</span>`;

  // Render chunks
  const viz = document.getElementById('chunksViz');
  viz.innerHTML = chunks.map((c,i)=>{
    const words = c.split(/\s+/);
    const color = COLORS[i % COLORS.length];
    const hasOverlap = overlap > 0 && i > 0 && strategy === 'fixed';
    return `<div class="chunk" style="background:${color}11;border-color:${color}33">
      <div class="chunk-header">
        <span class="chunk-num" style="color:${color}">Chunk ${i+1}</span>
        <span class="chunk-meta">${words.length} words${hasOverlap?' | <span class="overlap-indicator">'+overlap+' word overlap</span>':''}</span>
      </div>
      ${hasOverlap ? '<span style="background:rgba(251,146,60,.15);padding:0 3px;border-radius:3px;color:#fb923c">'+words.slice(0,overlap).join(' ')+'</span> '+words.slice(overlap).join(' ') : c}
    </div>`;
  }).join('');
}

document.getElementById('chunkSize').addEventListener('input',e=>{document.getElementById('chunkSizeVal').textContent=e.target.value;chunk();});
document.getElementById('overlap').addEventListener('input',e=>{
  const max=Math.floor(parseInt(document.getElementById('chunkSize').value)/2);
  if(parseInt(e.target.value)>max) e.target.value=max;
  document.getElementById('overlapVal').textContent=e.target.value;chunk();
});
document.getElementById('strategy').addEventListener('change',chunk);
document.getElementById('docInput').addEventListener('input',chunk);

chunk();

function completeLesson(){
  const btn=document.getElementById('completeBtn');
  if(btn.classList.contains('done')) return;
  const progress=JSON.parse(localStorage.getItem('rag-vector-search-progress')||'{}');
  progress['chunking-strategies']=true;
  localStorage.setItem('rag-vector-search-progress',JSON.stringify(progress));
  LO.completeLesson('rag-vector-search',3,200);
  btn.textContent='Lesson Complete!';btn.classList.add('done');
}
(function(){const p=JSON.parse(localStorage.getItem('rag-vector-search-progress')||'{}');if(p['chunking-strategies']){const b=document.getElementById('completeBtn');b.textContent='Lesson Complete!';b.classList.add('done');}})();
</script>
