---
title: "The ROI Calculator"
course: "ai-for-business"
order: 3
type: "lesson"
free: true
---<div class="wrap">
<a href="index.html" class="back">← Course Overview</a>
<div class="lesson-num">Lesson 3 of 10</div>
<h1>The ROI Calculator</h1>
<p class="intro">Stop guessing if AI is "worth it." Plug in your real numbers and see the math. This calculator shows you exactly what AI automation could save your business.</p>

<div class="calc-card">
<div class="input-group">
<div class="input-label"><span>Hours spent on repetitive tasks per week</span><span class="val" id="hours-val">20 hrs</span></div>
<div class="input-desc">Think: emails, data entry, scheduling, report formatting, invoice processing</div>
<input type="range" id="hours" min="5" max="80" value="20" step="1">
</div>
<div class="input-group">
<div class="input-label"><span>Hourly cost of that labor</span><span class="val" id="rate-val">$35/hr</span></div>
<div class="input-desc">Include salary + benefits. For your own time, use what you'd bill a client.</div>
<input type="range" id="rate" min="15" max="200" value="35" step="5">
</div>
<div class="input-group">
<div class="input-label"><span>Estimated AI automation rate</span><span class="val" id="auto-val">40%</span></div>
<div class="input-desc">Conservative: 20-30%. Moderate: 40-50%. Aggressive: 60%+. Start conservative.</div>
<input type="range" id="auto" min="10" max="80" value="40" step="5">
</div>
<div class="input-group">
<div class="input-label"><span>Monthly AI tool costs</span><span class="val" id="cost-val">$100/mo</span></div>
<div class="input-desc">Typical: $20-50 for one tool, $100-300 for a full stack.</div>
<input type="range" id="toolcost" min="0" max="500" value="100" step="10">
</div>
</div>

<div class="results">
<h2>Your Annual AI Savings</h2>
<div class="big-num" id="annual-savings">$14,560</div>
<div class="big-label">net savings per year (after tool costs)</div>

<div class="stats-row">
<div class="stat">
<div class="stat-num" id="hours-saved">416</div>
<div class="stat-label">Hours saved per year</div>
</div>
<div class="stat">
<div class="stat-num" id="weekly-savings">$280</div>
<div class="stat-label">Saved per week</div>
</div>
<div class="stat">
<div class="stat-num" id="roi-pct">1,213%</div>
<div class="stat-label">Return on investment</div>
</div>
</div>

<div class="breakeven" id="breakeven">
<div class="breakeven-title">Break-even point</div>
<div class="breakeven-text" id="breakeven-text">You'll recoup your AI tool costs in about 3 days each month.</div>
</div>
</div>

<div class="lesson-complete" id="lesson-complete">Lesson Complete! +120 XP</div>

<div class="cta">
<p>Want a step-by-step guide to actually implement these savings?</p>
<a href="#" class="btn">Get the Quick Start Guide — $9</a>
</div>

<div class="nav-row">
<a href="what-ai-can-and-cannot-do.html" class="nav-link">← Prev: What AI Can & Cannot Do</a>
<a href="find-your-ai-opportunities.html" class="nav-link">Next: Find Your AI Opportunities →</a>
</div>
</div>

<script>
const sliders = ['hours','rate','auto','toolcost'];
let interacted = 0;

function calc(){
  const hours = +document.getElementById('hours').value;
  const rate = +document.getElementById('rate').value;
  const autoPct = +document.getElementById('auto').value / 100;
  const toolCost = +document.getElementById('toolcost').value;

  document.getElementById('hours-val').textContent = hours + ' hrs';
  document.getElementById('rate-val').textContent = '$' + rate + '/hr';
  document.getElementById('auto-val').textContent = Math.round(autoPct*100) + '%';
  document.getElementById('cost-val').textContent = '$' + toolCost + '/mo';

  const weeklyHoursSaved = hours * autoPct;
  const weeklySavings = weeklyHoursSaved * rate;
  const annualSavings = (weeklySavings * 52) - (toolCost * 12);
  const annualHoursSaved = Math.round(weeklyHoursSaved * 52);
  const annualToolCost = toolCost * 12;
  const roi = annualToolCost > 0 ? Math.round((annualSavings / annualToolCost) * 100) : Infinity;

  document.getElementById('annual-savings').textContent = '$' + Math.max(0, Math.round(annualSavings)).toLocaleString();
  document.getElementById('hours-saved').textContent = annualHoursSaved.toLocaleString();
  document.getElementById('weekly-savings').textContent = '$' + Math.round(weeklySavings).toLocaleString();
  document.getElementById('roi-pct').textContent = roi === Infinity ? '∞' : roi.toLocaleString() + '%';

  if(toolCost > 0 && weeklySavings > 0){
    const daysToBreakeven = Math.ceil(toolCost / (weeklySavings / 5));
    document.getElementById('breakeven-text').textContent = `You'll recoup your monthly AI costs in about ${daysToBreakeven} working day${daysToBreakeven > 1 ? 's' : ''}.`;
  } else if(toolCost === 0){
    document.getElementById('breakeven-text').textContent = 'Free tools means instant ROI from day one.';
  }
}

sliders.forEach(id => {
  document.getElementById(id).addEventListener('input', () => {
    calc();
    interacted++;
    if(interacted >= 4 && !document.getElementById('lesson-complete').style.display){
      // Complete after meaningful interaction
    }
  });
  document.getElementById(id).addEventListener('change', () => {
    interacted++;
    if(interacted >= 8){
      LO.completeLesson('ai-biz', 3, 120);
      document.getElementById('lesson-complete').style.display = 'block';
    }
  });
});

calc();
</script>
