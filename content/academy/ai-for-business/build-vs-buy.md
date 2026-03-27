---
title: "Build vs Buy"
course: "ai-for-business"
order: 5
type: "builder"
free: false
---<div class="wrap">

<div class="lesson-num">Lesson 5 of 10</div>
<h1>Build vs. Buy</h1>
<p class="intro">Answer 5 questions about your situation. We'll tell you whether to build a custom AI solution, buy an existing tool, hire a consultant, or save your money.</p>

</div>

<script>
const questions = [
  {q:"How unique is the problem you're trying to solve?", opts:[
    {text:"Very common — most businesses have this problem", val:"common"},
    {text:"Somewhat unique to my industry", val:"industry"},
    {text:"Very specific to my company's process", val:"unique"},
  ]},
  {q:"What's your budget for AI this year?", opts:[
    {text:"Under $500 — testing the waters", val:"low"},
    {text:"$500 - $5,000 — serious but practical", val:"mid"},
    {text:"$5,000+ — ready to invest significantly", val:"high"},
  ]},
  {q:"Do you have someone technical on your team?", opts:[
    {text:"No — we're a non-technical team", val:"none"},
    {text:"We have someone comfortable with tools and apps", val:"some"},
    {text:"Yes — we have developers or IT staff", val:"yes"},
  ]},
  {q:"How quickly do you need results?", opts:[
    {text:"This week — we need help now", val:"asap"},
    {text:"Within a month — we can plan a bit", val:"month"},
    {text:"Within a quarter — we want to do it right", val:"quarter"},
  ]},
  {q:"How sensitive is the data involved?", opts:[
    {text:"Public information, nothing sensitive", val:"public"},
    {text:"Internal business data, not customer PII", val:"internal"},
    {text:"Customer data, financials, or regulated info", val:"sensitive"},
  ]},
];

const recommendations = {
  saas: {icon:"🛒", title:"Buy a SaaS Tool", subtitle:"An existing tool already solves this. Don't reinvent the wheel.", cost:"$20 - $200/month", timeline:"Set up in 1-3 days", risk:"Low", examples:["Jasper or Claude for writing","Zapier for automation","Notion AI for docs","Descript for video editing"]},
  consultant: {icon:"🤝", title:"Hire a Consultant", subtitle:"Your needs are specific enough to warrant expert help, but not a full build.", cost:"$2,000 - $15,000 one-time", timeline:"2-6 weeks", risk:"Medium", examples:["Custom ChatGPT for your FAQ","Industry-specific workflow setup","Data pipeline configuration","AI strategy and training session"]},
  build: {icon:"🔧", title:"Build Custom", subtitle:"Your problem is unique enough that off-the-shelf tools won't cut it.", cost:"$10,000 - $100,000+", timeline:"1-6 months", risk:"High (but high reward)", examples:["Custom ML model for your data","Proprietary recommendation engine","Industry-specific analysis tool","Integrated AI across your stack"]},
  wait: {icon:"⏸️", title:"Do Nothing (Yet)", subtitle:"The ROI doesn't justify the investment right now. Revisit in 6 months.", cost:"$0", timeline:"Revisit Q3", risk:"None", examples:["AI tools are evolving fast — prices drop monthly","Your needs may become standard soon","Focus budget on higher-impact areas","Use free tiers to experiment meanwhile"]},
};

let answers = [];
let currentQ = 0;
const qContainer = document.getElementById('questions');
const dotsContainer = document.getElementById('dots');

// Render dots
for(let i=0;i<5;i++){
  const d = document.createElement('div');
  d.className = 'dot' + (i===0?' current':'');
  d.id = 'dot-'+i;
  dotsContainer.appendChild(d);
}

function renderQuestion(idx){
  qContainer.innerHTML = '';
  const q = questions[idx];
  const card = document.createElement('div');
  card.className = 'question-card active';
  card.innerHTML = `<div class="q-step">Question ${idx+1} of 5</div><div class="q-text">${q.q}</div><div class="q-opts">${q.opts.map((o,i)=>`<div class="q-opt" data-idx="${i}">${o.text}</div>`).join('')}</div>`;
  qContainer.appendChild(card);

  card.querySelectorAll('.q-opt').forEach(opt => {
    opt.addEventListener('click', () => {
      card.querySelectorAll('.q-opt').forEach(o=>o.classList.remove('selected'));
      opt.classList.add('selected');
      LO.sfx.click();
      answers[idx] = q.opts[+opt.dataset.idx].val;

      setTimeout(() => {
        document.getElementById('dot-'+idx).className = 'dot filled';
        if(idx < 4){
          currentQ = idx+1;
          document.getElementById('dot-'+currentQ).className = 'dot current';
          renderQuestion(currentQ);
        } else {
          showResult();
        }
      }, 400);
    });
  });
}

function showResult(){
  qContainer.innerHTML = '';
  dotsContainer.querySelectorAll('.dot').forEach(d=>d.className='dot filled');

  // Decision logic
  let rec;
  const [uniqueness, budget, tech, speed, data] = answers;

  if(uniqueness==='common' && speed==='asap') rec = 'saas';
  else if(uniqueness==='unique' && budget==='high' && tech==='yes') rec = 'build';
  else if(uniqueness==='unique' && budget!=='low') rec = 'consultant';
  else if(budget==='low' && uniqueness==='common') rec = 'saas';
  else if(budget==='low' && uniqueness!=='common') rec = 'wait';
  else if(data==='sensitive' && tech==='none') rec = 'consultant';
  else if(tech==='yes' && budget==='high') rec = 'build';
  else if(budget==='mid') rec = uniqueness==='common' ? 'saas' : 'consultant';
  else rec = 'saas';

  const r = recommendations[rec];
  const result = document.getElementById('result');
  result.className = 'result-card active';
  result.innerHTML = `
    <div class="result-icon">${r.icon}</div>
    <div class="result-title">${r.title}</div>
    <div class="result-subtitle">${r.subtitle}</div>
    <div class="result-details">
      <div class="detail-row"><span class="detail-label">Estimated Cost</span><span class="detail-value">${r.cost}</span></div>
      <div class="detail-row"><span class="detail-label">Timeline to Results</span><span class="detail-value">${r.timeline}</span></div>
      <div class="detail-row"><span class="detail-label">Risk Level</span><span class="detail-value">${r.risk}</span></div>
    </div>
    <div class="examples">
      <h3>Examples for Your Situation</h3>
      <ul>${r.examples.map(e=>`<li>${e}</li>`).join('')}</ul>
    </div>
    <button class="btn" onclick="restart()">Try Different Answers</button>
  `;
  result.scrollIntoView({behavior:'smooth'});
  LO.sfx.success();
  LO.completeLesson('ai-biz', 5, 120);
}

function restart(){
  answers = [];
  currentQ = 0;
  document.getElementById('result').className = 'result-card';
  dotsContainer.querySelectorAll('.dot').forEach((d,i)=>d.className='dot'+(i===0?' current':''));
  renderQuestion(0);
}

renderQuestion(0);
</script>
