---
title: "Find Your AI Opportunities"
course: "ai-for-business"
order: 4
type: "lesson"
free: false
---<div class="wrap">
<a href="index.html" class="back">← Course Overview</a>
<div class="lesson-num">Lesson 4 of 10</div>
<h1>Find Your AI Opportunities</h1>
<p class="intro">Rate each area of your business on three factors. We'll calculate where AI will have the biggest impact and show you exactly where to start.</p>

<h2>Rate Your Business Areas</h2>
<p style="font-size:13px;color:#737373;margin-bottom:16px">1 = Low, 5 = High. Be honest — this is for your eyes only.</p>

<div style="overflow-x:auto">
<table class="audit-table">
<thead>
<tr>
<th></th>
<th>Business Area</th>
<th>Time Spent</th>
<th>Repetitiveness</th>
<th>Pain Level</th>
</tr>
</thead>
<tbody id="audit-body"></tbody>
</table>
</div>

<button class="gen-btn" id="gen-btn" onclick="generateResults()">Generate My AI Opportunity Scores</button>

<div class="results-section" id="results-section">
<h2>Your AI Opportunity Rankings</h2>
<div id="opp-list"></div>
<div class="insight-box" id="insight-box"></div>
</div>

<div class="nav-row">
<a href="the-roi-calculator.html" class="nav-link">← Prev: ROI Calculator</a>
<a href="build-vs-buy.html" class="nav-link">Next: Build vs. Buy →</a>
</div>
</div>

<script>
const areas = [
  {name:"Email & Communication", emoji:"📧", tip:"drafting, sorting, responding"},
  {name:"Sales & Outreach", emoji:"💰", tip:"prospecting, follow-ups, proposals"},
  {name:"Marketing & Content", emoji:"📣", tip:"social media, blog posts, ads"},
  {name:"Customer Support", emoji:"🎧", tip:"tickets, FAQs, onboarding"},
  {name:"Operations & Logistics", emoji:"⚙️", tip:"scheduling, inventory, workflows"},
  {name:"Finance & Accounting", emoji:"📊", tip:"invoicing, reports, expense tracking"},
  {name:"HR & Recruiting", emoji:"👥", tip:"job posts, screening, onboarding"},
  {name:"Content Creation", emoji:"✍️", tip:"writing, design briefs, documentation"},
  {name:"Data & Analytics", emoji:"📈", tip:"reports, dashboards, insights"},
  {name:"Admin & Misc", emoji:"🗂️", tip:"filing, data entry, meeting notes"},
];

const ratings = {};
const tbody = document.getElementById('audit-body');

areas.forEach((a,i) => {
  ratings[i] = {time:0, rep:0, pain:0};
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td class="emoji">${a.emoji}</td>
    <td class="area">${a.name}<div style="font-size:11px;color:#737373;font-weight:400">${a.tip}</div></td>
    <td><div class="rating-group" data-area="${i}" data-dim="time">${[1,2,3,4,5].map(n=>`<button class="rating-btn" data-v="${n}">${n}</button>`).join('')}</div></td>
    <td><div class="rating-group" data-area="${i}" data-dim="rep">${[1,2,3,4,5].map(n=>`<button class="rating-btn" data-v="${n}">${n}</button>`).join('')}</div></td>
    <td><div class="rating-group" data-area="${i}" data-dim="pain">${[1,2,3,4,5].map(n=>`<button class="rating-btn" data-v="${n}">${n}</button>`).join('')}</div></td>
  `;
  tbody.appendChild(tr);
});

document.querySelectorAll('.rating-group').forEach(group => {
  group.querySelectorAll('.rating-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const area = +group.dataset.area;
      const dim = group.dataset.dim;
      const val = +btn.dataset.v;
      ratings[area][dim] = val;
      group.querySelectorAll('.rating-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      LO.sfx.click();
      checkReady();
    });
  });
});

function checkReady(){
  let filled = 0;
  for(let i=0;i<10;i++){
    if(ratings[i].time && ratings[i].rep && ratings[i].pain) filled++;
  }
  document.getElementById('gen-btn').disabled = filled < 5;
}

function generateResults(){
  const scored = areas.map((a,i) => {
    const r = ratings[i];
    const score = (r.time * 0.3 + r.rep * 0.4 + r.pain * 0.3) * 20;
    return {...a, idx:i, score: Math.round(score), ...r};
  }).filter(a => a.time > 0 || a.rep > 0 || a.pain > 0).sort((a,b) => b.score - a.score);

  const list = document.getElementById('opp-list');
  list.innerHTML = '';
  scored.forEach((s,i) => {
    const card = document.createElement('div');
    card.className = 'opp-card';
    card.style.animationDelay = i*0.1+'s';
    card.innerHTML = `
      <div class="opp-rank ${i<3?'gold':'silver'}">#${i+1}</div>
      <div class="opp-info">
        <div class="opp-name">${s.emoji} ${s.name}</div>
        <div class="opp-detail">Time: ${s.time}/5 · Repetitive: ${s.rep}/5 · Pain: ${s.pain}/5</div>
        <div class="opp-bar"><div class="opp-bar-fill" style="width:${s.score}%"></div></div>
      </div>
      <div class="opp-score">${s.score}</div>
    `;
    list.appendChild(card);
  });

  const top = scored[0];
  const insight = document.getElementById('insight-box');
  insight.innerHTML = `<h3>Start Here: ${top.emoji} ${top.name}</h3><p>This area scored ${top.score}/100 — it's your highest-impact AI opportunity. It's where you spend significant time on repetitive work that causes the most friction. Automating even 30% of this area could save you hours every week.</p>`;

  document.getElementById('results-section').style.display = 'block';
  document.getElementById('results-section').scrollIntoView({behavior:'smooth'});
  LO.sfx.success();
  LO.completeLesson('ai-biz', 4, 120);
}
</script>
