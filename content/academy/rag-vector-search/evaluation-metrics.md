---
title: "Evaluation Metrics"
course: "rag-vector-search"
order: 8
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
    <h1>Evaluation Metrics</h1>
    <p>If you can't measure it, you can't improve it. Learn the three critical dimensions of RAG quality and how to score them systematically.</p>
  </div>

  <div class="narration">
    <strong>The RAG quality triangle:</strong> A good RAG answer must be (1) <strong>Relevant</strong> — the retrieved context actually relates to the question, (2) <strong>Faithful</strong> — the answer only contains claims supported by the context, and (3) <strong>Complete</strong> — the answer covers all the important information from the context. Rate the scenarios below.
  </div>

  <div class="narration" style="margin-top:2rem">
    <strong>Automated evaluation:</strong> In production, you use LLM-as-a-judge to score these metrics automatically. You send the question + context + answer to GPT-4 and ask it to rate relevance, faithfulness, and completeness on a 1-5 scale. This lets you evaluate thousands of question-answer pairs without manual review.
  </div>

  <h3 style="font-size:1rem;margin-bottom:1rem">Evaluation Frameworks</h3>
  <div class="frameworks">
    <div class="framework"><h4>RAGAS</h4><p>Open-source framework for RAG evaluation. Measures faithfulness, answer relevancy, context precision, and context recall. The most popular automated RAG evaluation tool.</p></div>
    <div class="framework"><h4>DeepEval</h4><p>LLM evaluation framework with RAG-specific metrics: hallucination, answer relevancy, contextual precision/recall. Integrates with CI/CD pipelines.</p></div>
    <div class="framework"><h4>TruLens</h4><p>Evaluation and tracking for LLM apps. Provides the "RAG Triad" of metrics: answer relevance, context relevance, and groundedness.</p></div>
    <div class="framework"><h4>Custom LLM Judge</h4><p>Build your own evaluator by prompting GPT-4: "Rate this answer's faithfulness to the context on 1-5. Explain." Simple, flexible, and domain-adaptable.</p></div>
  </div>

  <button class="complete-btn" id="completeBtn" onclick="completeLesson()">Complete Lesson — Claim 200 XP</button>
  </div>

<script>
const SCENARIOS = [
  {
    name:'Good RAG',
    question:'What are the opening hours of the downtown library?',
    context:'The downtown Central Library is open Monday-Friday 9am-8pm, Saturday 10am-6pm, and Sunday 12pm-5pm. The branch is closed on federal holidays. Free parking is available in the adjacent garage.',
    answer:'The downtown library is open Monday-Friday 9am-8pm, Saturday 10am-6pm, and Sunday 12pm-5pm. It is closed on federal holidays.',
    expected:{relevance:5,faithfulness:5,completeness:4}
  },
  {
    name:'Hallucinated',
    question:'What is the return policy for electronics?',
    context:'Our store offers a 30-day return policy for most items. Electronics must be returned within 15 days in original packaging. A receipt is required for all returns.',
    answer:'Electronics can be returned within 30 days. If you don\'t have a receipt, you can get store credit. Extended warranties can be purchased for $19.99 per item.',
    expected:{relevance:4,faithfulness:1,completeness:2}
  },
  {
    name:'Irrelevant Context',
    question:'How do I reset my password?',
    context:'Our company was founded in 2015 by three Stanford graduates. We now serve over 2 million users in 45 countries. Our headquarters is in San Francisco with offices in London and Tokyo.',
    answer:'Based on the available information, I don\'t have specific instructions for resetting your password. I recommend visiting the login page and clicking "Forgot Password" or contacting support.',
    expected:{relevance:1,faithfulness:4,completeness:1}
  },
  {
    name:'Partial Answer',
    question:'What are the ingredients and nutritional info for the protein shake?',
    context:'Our Vanilla Protein Shake contains whey protein isolate, natural vanilla flavoring, stevia, and sunflower lecithin. Each serving provides 25g protein, 2g carbs, 1g fat, and 120 calories. It is gluten-free and soy-free. Allergen warning: contains milk.',
    answer:'The protein shake contains whey protein isolate and natural vanilla flavoring with 25g of protein per serving.',
    expected:{relevance:5,faithfulness:5,completeness:2}
  }
];

let currentScenario = 0;
let ratings = {};

function initScenario(i){
  currentScenario = i;
  ratings[i] = ratings[i] || {relevance:3,faithfulness:3,completeness:3};

  document.getElementById('scenarioNav').innerHTML = SCENARIOS.map((s,idx)=>
    `<button class="${idx===i?'active':''}" onclick="initScenario(${idx})">${s.name}</button>`
  ).join('');

  const s = SCENARIOS[i];
  document.getElementById('evalScenario').innerHTML = `
    <h3>Scenario: ${s.name}</h3>
    <div class="scenario-box question"><span class="label">Question</span>${s.question}</div>
    <div class="scenario-box context"><span class="label">Retrieved Context</span>${s.context}</div>
    <div class="scenario-box answer"><span class="label">Generated Answer</span>${s.answer}</div>
  `;

  const r = ratings[i];
  const metrics = [
    {key:'relevance',name:'Relevance',desc:'Is the context related to the question?',color:'#3b82f6'},
    {key:'faithfulness',name:'Faithfulness',desc:'Does the answer only use info from the context?',color:'#10b981'},
    {key:'completeness',name:'Completeness',desc:'Does the answer cover all key info from context?',color:'#f59e0b'}
  ];

  document.getElementById('metricSliders').innerHTML = metrics.map(m=>`
    <div class="metric-row">
      <div class="metric-label"><div class="name">${m.name}</div><div class="desc">${m.desc}</div></div>
      <div class="metric-slider">
        <input type="range" min="1" max="5" value="${r[m.key]}" style="background:linear-gradient(to right,rgba(255,255,255,.06) 0%,${m.color} 100%)" oninput="updateRating('${m.key}',this.value)">
        <span class="metric-val" id="val_${m.key}" style="color:${m.color}">${r[m.key]}</span>
      </div>
    </div>
  `).join('');

  // Style slider thumbs
  document.querySelectorAll('.metric-slider input').forEach((inp,idx)=>{
    inp.style.setProperty('--thumb-color',metrics[idx].color);
    const style = document.createElement('style');
    style.textContent = `#metricSliders .metric-row:nth-child(${idx+1}) input::-webkit-slider-thumb{background:${metrics[idx].color}}`;
    document.head.appendChild(style);
  });

  updateSummary();
}

function updateRating(key,val){
  ratings[currentScenario][key]=parseInt(val);
  document.getElementById('val_'+key).textContent=val;
  updateSummary();
}

function updateSummary(){
  const r = ratings[currentScenario];
  const avg = ((r.relevance+r.faithfulness+r.completeness)/3).toFixed(1);
  const expected = SCENARIOS[currentScenario].expected;

  function getColor(val){return val>=4?'#10b981':val>=3?'#f59e0b':'#ef4444';}

  document.getElementById('scoreSummary').innerHTML = `
    <div class="score-item"><div class="val" style="color:#3b82f6">${r.relevance}/5</div><div class="lbl">Relevance</div><div class="bar"></div></div>
    <div class="score-item"><div class="val" style="color:#10b981">${r.faithfulness}/5</div><div class="lbl">Faithfulness</div><div class="bar"></div></div>
    <div class="score-item"><div class="val" style="color:#f59e0b">${r.completeness}/5</div><div class="lbl">Completeness</div><div class="bar"></div></div>
    <div class="score-item"><div class="val" style="color:${getColor(avg)}">${avg}</div><div class="lbl">Overall</div><div class="bar"></div></div>
    <div style="width:100%;font-size:.75rem;color:#71717a;margin-top:.5rem;text-align:center">Expert rating: Relevance ${expected.relevance}, Faithfulness ${expected.faithfulness}, Completeness ${expected.completeness}</div>
  `;
}

initScenario(0);

function completeLesson(){
  const btn=document.getElementById('completeBtn');
  if(btn.classList.contains('done')) return;
  const progress=JSON.parse(localStorage.getItem('rag-vector-search-progress')||'{}');
  progress['evaluation-metrics']=true;
  localStorage.setItem('rag-vector-search-progress',JSON.stringify(progress));
  LO.completeLesson('rag-vector-search',8,200);
  btn.textContent='Lesson Complete!';btn.classList.add('done');
}
(function(){const p=JSON.parse(localStorage.getItem('rag-vector-search-progress')||'{}');if(p['evaluation-metrics']){const b=document.getElementById('completeBtn');b.textContent='Lesson Complete!';b.classList.add('done');}})();
</script>
