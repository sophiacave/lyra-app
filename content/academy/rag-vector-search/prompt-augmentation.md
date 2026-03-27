---
title: "Prompt Augmentation"
course: "rag-vector-search"
order: 6
type: "lesson"
free: false
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>
  
</nav>
<div class="container">
  <div class="lesson-header">
    <div class="meta">
      <span class="type-badge">Interactive</span>
      <span class="xp-badge">+200 XP</span>
      <span class="time-badge">~50 min</span>
    </div>
    <h1>Prompt Augmentation</h1>
    <p>The "A" in RAG. How you insert retrieved context into the prompt determines whether the LLM gives accurate answers or confident hallucinations.</p>
  </div>

  <div class="narration">
    <strong>The critical moment in RAG:</strong> You have your retrieved chunks. Now you need to construct a prompt that tells the LLM: "Here is the context. Answer based ONLY on this context." The template you use for this matters enormously. See the difference below.
  </div>

  <h3 class="section">Same Question, Dramatically Different Answers</h3>

  <div class="side-by-side">
    <div class="response-panel without">
      <h4 style="color:#ef4444">Without RAG Context</h4>
      <div class="q">"What is the refund policy for the Pro plan?"</div>
      <p>Based on industry standards, most SaaS companies offer a <span class="hallucination">30-day money-back guarantee</span> for their Pro plans. You can typically <span class="hallucination">request a refund through the settings page</span> or by <span class="hallucination">emailing support@company.com</span>. Pro plans usually cost <span class="hallucination">$49/month</span> and include premium features.</p>
      <p style="margin-top:.75rem;font-size:.75rem;color:#ef4444;font-weight:600">4 hallucinations. Sounds confident but completely made up.</p>
    </div>
    <div class="response-panel with">
      <h4 style="color:#10b981">With RAG Context</h4>
      <div class="q">"What is the refund policy for the Pro plan?"</div>
      <p>According to our documentation, the Pro plan has a <span class="grounded">14-day refund window</span> from the date of purchase. To request a refund, <span class="grounded">contact billing@acme.io</span> with your order number. After 14 days, refunds are handled <span class="grounded">on a case-by-case basis</span> by the support team.</p>
      <p style="margin-top:.75rem;font-size:.75rem;color:#10b981;font-weight:600">0 hallucinations. Every claim traced to retrieved context.</p>
    </div>
  </div>

  <h3 class="section">Build Your Prompt Template</h3>

  <div class="template-editor">
    <label>System prompt template (use {context} and {question} placeholders):</label>
    <div class="presets">
      <button class="active" onclick="setPreset(0,this)">Simple</button>
      <button onclick="setPreset(1,this)">Strict</button>
      <button onclick="setPreset(2,this)">Cited</button>
      <button onclick="setPreset(3,this)">Conversational</button>
    </div>
    <textarea id="templateInput" oninput="updatePreview()">Answer the user's question based on the following context.

Context:
{context}

Question: {question}

Answer:</textarea>
    <label>Live Preview (with sample data filled in):</label>
    </div>

  <h3 class="section">Prompt Engineering Tips for RAG</h3>
  <div class="tips">
    <div class="tip"><h4>Be Explicit About Grounding</h4><p>"Answer ONLY based on the provided context" prevents the LLM from filling gaps with training knowledge that may be wrong.</p></div>
    <div class="tip"><h4>Handle Missing Info</h4><p>Add: "If the context doesn't contain the answer, say 'I don't have that information.'" This prevents hallucination on unanswerable questions.</p></div>
    <div class="tip"><h4>Request Citations</h4><p>"Cite the specific passage that supports your answer" makes responses verifiable and catches cases where the model fabricates sources.</p></div>
    <div class="tip"><h4>Control Format</h4><p>"Answer in 2-3 sentences" or "Use bullet points" keeps responses focused. Long, rambling answers are harder to verify.</p></div>
    <div class="tip"><h4>Separate Context Clearly</h4><p>Use clear delimiters like --- or triple backticks around context. This helps the LLM distinguish context from instructions.</p></div>
    <div class="tip"><h4>System vs User Role</h4><p>Put grounding instructions in the system message, context+question in the user message. This leverages the model's role-following behavior.</p></div>
  </div>

  <button class="complete-btn" id="completeBtn" onclick="completeLesson()">Complete Lesson — Claim 200 XP</button>
  </div>

<script>
const PRESETS = [
  `Answer the user's question based on the following context.

Context:
{context}

Question: {question}

Answer:`,
  `You are a precise assistant. Answer the question using ONLY the information in the provided context. If the context does not contain enough information to answer, respond with "I don't have enough information to answer that."

Do NOT use any prior knowledge. Only use the context below.

---
Context:
{context}
---

Question: {question}

Answer:`,
  `Answer the question based on the provided context. For each claim in your answer, cite the relevant passage in [brackets].

Context:
{context}

Question: {question}

Answer (with citations):`,
  `You are a friendly, helpful assistant for our company. A customer is asking a question. Use the information below to give them a warm, accurate response. If you're not sure, let them know you'll escalate to a human.

Relevant information:
{context}

Customer question: {question}

Your response:`
];

const SAMPLE_CONTEXT = `Our Pro plan costs $29/month and includes unlimited projects, priority support, and API access. Refunds are available within 14 days of purchase by contacting billing@acme.io with your order number. After 14 days, refund requests are handled on a case-by-case basis.`;
const SAMPLE_QUESTION = `What is the refund policy for the Pro plan?`;

function setPreset(i,btn){
  document.getElementById('templateInput').value=PRESETS[i];
  document.querySelectorAll('.presets button').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  updatePreview();
}

function updatePreview(){
  const template=document.getElementById('templateInput').value;
  const filled=template
    .replace('{context}',`<span class="filled">${SAMPLE_CONTEXT}</span>`)
    .replace('{question}',`<span class="filled">${SAMPLE_QUESTION}</span>`);
  document.getElementById('preview').innerHTML=filled;
}

updatePreview();

function completeLesson(){
  const btn=document.getElementById('completeBtn');
  if(btn.classList.contains('done')) return;
  const progress=JSON.parse(localStorage.getItem('rag-vector-search-progress')||'{}');
  progress['prompt-augmentation']=true;
  localStorage.setItem('rag-vector-search-progress',JSON.stringify(progress));
  LO.completeLesson('rag-vector-search',6,200);
  btn.textContent='Lesson Complete!';btn.classList.add('done');
}
(function(){const p=JSON.parse(localStorage.getItem('rag-vector-search-progress')||'{}');if(p['prompt-augmentation']){const b=document.getElementById('completeBtn');b.textContent='Lesson Complete!';b.classList.add('done');}})();
</script>
