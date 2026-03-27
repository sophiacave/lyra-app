---
title: "Measuring AI Success"
course: "ai-for-business"
order: 9
type: "lesson"
free: false
---<div class="wrap">

<div class="lesson-num">Lesson 9 of 10</div>
<h1>Measuring AI Success</h1>
<p class="intro">What gets measured gets improved. Enter your numbers for the past 4 weeks and see your AI ROI dashboard come to life. This is what "success" looks like, quantified.</p>

<div style="background:rgba(245,158,11,.06);border:1px solid rgba(245,158,11,.15);border-radius:12px;padding:1.25rem;margin-bottom:24px;font-size:14px;color:#a3a3a3;line-height:1.6">
  <strong style="color:#f59e0b">What is a metric?</strong> A metric is simply a number you track over time to measure progress. Below are four key metrics (measurements) for evaluating AI impact. <strong style="color:#e5e5e5">Not sure what to measure?</strong> Start with "Hours Saved" -- it is the easiest to estimate and the most universally valuable. Track how much time AI saves you each week on tasks like writing, research, or data entry.
</div>

<h2>Enter Your Weekly Numbers</h2>
<p style="font-size:13px;color:#737373;margin-bottom:20px">Fill in each metric for 4 weeks. Use your best estimates — perfect data isn't required.</p>

<div class="metric-cards">
<div class="metric-card">
<div class="metric-icon">⏱️</div>
<div class="metric-title">Hours Saved Per Week</div>
<div class="metric-inputs">
<div class="metric-row"><span class="metric-label">Week 1</span><input class="metric-input" data-metric="time" data-week="0" type="number" min="0" value="2"><span class="metric-unit">hrs</span></div>
<div class="metric-row"><span class="metric-label">Week 2</span><input class="metric-input" data-metric="time" data-week="1" type="number" min="0" value="4"><span class="metric-unit">hrs</span></div>
<div class="metric-row"><span class="metric-label">Week 3</span><input class="metric-input" data-metric="time" data-week="2" type="number" min="0" value="5"><span class="metric-unit">hrs</span></div>
<div class="metric-row"><span class="metric-label">Week 4</span><input class="metric-input" data-metric="time" data-week="3" type="number" min="0" value="7"><span class="metric-unit">hrs</span></div>
</div>
</div>
<div class="metric-card">
<div class="metric-icon">💰</div>
<div class="metric-title">Cost Reduced Per Week</div>
<div class="metric-inputs">
<div class="metric-row"><span class="metric-label">Week 1</span><input class="metric-input" data-metric="cost" data-week="0" type="number" min="0" value="100"><span class="metric-unit">$</span></div>
<div class="metric-row"><span class="metric-label">Week 2</span><input class="metric-input" data-metric="cost" data-week="1" type="number" min="0" value="200"><span class="metric-unit">$</span></div>
<div class="metric-row"><span class="metric-label">Week 3</span><input class="metric-input" data-metric="cost" data-week="2" type="number" min="0" value="250"><span class="metric-unit">$</span></div>
<div class="metric-row"><span class="metric-label">Week 4</span><input class="metric-input" data-metric="cost" data-week="3" type="number" min="0" value="350"><span class="metric-unit">$</span></div>
</div>
</div>
<div class="metric-card">
<div class="metric-icon">📈</div>
<div class="metric-title">Output Increase (%)</div>
<div class="metric-inputs">
<div class="metric-row"><span class="metric-label">Week 1</span><input class="metric-input" data-metric="output" data-week="0" type="number" min="0" value="10"><span class="metric-unit">%</span></div>
<div class="metric-row"><span class="metric-label">Week 2</span><input class="metric-input" data-metric="output" data-week="1" type="number" min="0" value="20"><span class="metric-unit">%</span></div>
<div class="metric-row"><span class="metric-label">Week 3</span><input class="metric-input" data-metric="output" data-week="2" type="number" min="0" value="25"><span class="metric-unit">%</span></div>
<div class="metric-row"><span class="metric-label">Week 4</span><input class="metric-input" data-metric="output" data-week="3" type="number" min="0" value="30"><span class="metric-unit">%</span></div>
</div>
</div>
<div class="metric-card">
<div class="metric-icon">⭐</div>
<div class="metric-title">Quality Score (1-10)</div>
<div class="metric-inputs">
<div class="metric-row"><span class="metric-label">Week 1</span><input class="metric-input" data-metric="quality" data-week="0" type="number" min="1" max="10" value="6"><span class="metric-unit">/10</span></div>
<div class="metric-row"><span class="metric-label">Week 2</span><input class="metric-input" data-metric="quality" data-week="1" type="number" min="1" max="10" value="7"><span class="metric-unit">/10</span></div>
<div class="metric-row"><span class="metric-label">Week 3</span><input class="metric-input" data-metric="quality" data-week="2" type="number" min="1" max="10" value="7"><span class="metric-unit">/10</span></div>
<div class="metric-row"><span class="metric-label">Week 4</span><input class="metric-input" data-metric="quality" data-week="3" type="number" min="1" max="10" value="8"><span class="metric-unit">/10</span></div>
</div>
</div>
</div>

<button class="btn" onclick="buildDashboard()" style="display:block;margin:0 auto 32px">Generate My Dashboard</button>

<div class="dashboard" id="dashboard" style="display:none">
<h2>Your AI ROI Dashboard</h2>
<div class="chart-container">
<canvas id="chart" height="250"></canvas>
</div>
</div>

</div>

<script>
function getData(){
  const metrics = {time:[],cost:[],output:[],quality:[]};
  document.querySelectorAll('.metric-input').forEach(input => {
    const m = input.dataset.metric;
    const w = +input.dataset.week;
    metrics[m][w] = +input.value || 0;
  });
  return metrics;
}

function buildDashboard(){
  const d = getData();
  const dash = document.getElementById('dashboard');
  dash.style.display = 'block';

  // Draw chart
  const canvas = document.getElementById('chart');
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  canvas.width = canvas.offsetWidth * dpr;
  canvas.height = 250 * dpr;
  ctx.scale(dpr, dpr);
  const W = canvas.offsetWidth, H = 250;
  ctx.clearRect(0,0,W,H);

  // Background
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0,0,W,H);

  // Grid
  ctx.strokeStyle = '#1a1a24';
  ctx.lineWidth = 1;
  for(let i=0;i<5;i++){
    const y = 30 + (H-60) * i/4;
    ctx.beginPath(); ctx.moveTo(60,y); ctx.lineTo(W-20,y); ctx.stroke();
  }

  // Labels
  ctx.fillStyle = '#737373';
  ctx.font = '11px Inter, sans-serif';
  ctx.textAlign = 'center';
  ['Week 1','Week 2','Week 3','Week 4'].forEach((label,i) => {
    const x = 80 + (W-120) * i / 3;
    ctx.fillText(label, x, H-8);
  });

  // Draw lines
  const datasets = [
    {data: d.time, color:'#f59e0b', label:'Hours Saved'},
    {data: d.cost.map(v=>v/50), color:'#22c55e', label:'Cost Reduced ($)'},
    {data: d.output.map(v=>v/5), color:'#3b82f6', label:'Output Increase (%)'},
    {data: d.quality, color:'#8b5cf6', label:'Quality Score'},
  ];

  const maxVal = Math.max(...datasets.flatMap(ds=>ds.data), 10);

  datasets.forEach(ds => {
    ctx.strokeStyle = ds.color;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ds.data.forEach((v,i) => {
      const x = 80 + (W-120) * i / 3;
      const y = H - 40 - ((v/maxVal) * (H-80));
      if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    });
    ctx.stroke();

    // Dots
    ds.data.forEach((v,i) => {
      const x = 80 + (W-120) * i / 3;
      const y = H - 40 - ((v/maxVal) * (H-80));
      ctx.fillStyle = ds.color;
      ctx.beginPath(); ctx.arc(x,y,4,0,Math.PI*2); ctx.fill();
    });
  });

  // Legend
  ctx.textAlign = 'left';
  datasets.forEach((ds,i) => {
    const lx = 70 + i * (W-80)/4;
    ctx.fillStyle = ds.color;
    ctx.fillRect(lx, 8, 12, 3);
    ctx.fillStyle = '#737373';
    ctx.font = '10px Inter, sans-serif';
    ctx.fillText(ds.label, lx+16, 12);
  });

  // KPIs
  const totalTime = d.time.reduce((a,b)=>a+b,0);
  const totalCost = d.cost.reduce((a,b)=>a+b,0);
  const avgOutput = Math.round(d.output.reduce((a,b)=>a+b,0)/4);
  const avgQuality = (d.quality.reduce((a,b)=>a+b,0)/4).toFixed(1);

  const timeTrend = d.time[3] > d.time[0] ? 'up' : 'down';
  const costTrend = d.cost[3] > d.cost[0] ? 'up' : 'down';

  // Trend arrows explanation is shown via title attributes
  document.getElementById('kpis').innerHTML = `
    <div class="kpi"><div class="kpi-value">${totalTime}h</div><div class="kpi-label">Total Hours Saved</div><div class="kpi-trend ${timeTrend}" title="Arrow up means your savings are increasing week over week">${timeTrend==='up'?'↑':'↓'} ${timeTrend==='up'?'Growing':'Declining'}</div></div>
    <div class="kpi"><div class="kpi-value">$${totalCost.toLocaleString()}</div><div class="kpi-label">Total Cost Saved</div><div class="kpi-trend ${costTrend}">${costTrend==='up'?'↑':'↓'} ${costTrend==='up'?'Growing':'Declining'}</div></div>
    <div class="kpi"><div class="kpi-value">${avgOutput}%</div><div class="kpi-label">Avg Output Increase</div><div class="kpi-trend up">↑ Productive</div></div>
    <div class="kpi"><div class="kpi-value">${avgQuality}</div><div class="kpi-label">Avg Quality Score</div><div class="kpi-trend ${avgQuality>=7?'up':'down'}">${avgQuality>=7?'↑ Strong':'→ Room to grow'}</div></div>
  `;

  // Insight
  const annualSavings = totalCost * 13;
  const annualHours = totalTime * 13;
  document.getElementById('insight').innerHTML = `<h3>Projected Annual Impact</h3><p>At this rate, AI will save your business approximately <strong>$${annualSavings.toLocaleString()}</strong> and <strong>${annualHours} hours</strong> over the next year. ${avgOutput >= 20 ? "Your output increase of "+avgOutput+"% means you're getting significantly more done without adding headcount." : "As you get more comfortable with AI, expect these numbers to accelerate."}</p>`;

  dash.scrollIntoView({behavior:'smooth'});
  LO.sfx.success();
  LO.completeLesson('ai-biz', 9, 120);
}
</script>
