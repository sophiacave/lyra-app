---
title: "What AI Can and Cannot Do"
course: "ai-for-business"
order: 2
type: "lesson"
free: true
---<div class="wrap">
<a href="index.html" class="back">← Course Overview</a>
<div class="lesson-num">Lesson 2 of 10</div>
<h1>What AI Can and Cannot Do</h1>
<p class="intro">Sort each task into the right category. Click a task, then click the zone where it belongs. Get realistic about AI — it's powerful but it's not magic.</p>

<div class="pool" id="pool">
<div class="pool-title">Tasks to Sort (<span id="remaining">20</span> remaining)</div>
<div class="pool-items" id="pool-items"></div>
</div>

<div class="zones">
<div class="zone" data-zone="can" id="zone-can">
<div class="zone-title">AI Can Do This Well</div>
<div class="zone-items" id="items-can"></div>
</div>
<div class="zone" data-zone="help" id="zone-help">
<div class="zone-title">AI Can Help With This</div>
<div class="zone-items" id="items-help"></div>
</div>
<div class="zone" data-zone="cannot" id="zone-cannot">
<div class="zone-title">AI Cannot Do This</div>
<div class="zone-items" id="items-cannot"></div>
</div>
</div>

<button class="check-btn" id="check-btn" disabled onclick="checkAnswers()">Check My Answers</button>
<div class="result hidden" id="result"></div>

<div class="nav-row">
<a href="ai-without-jargon.html" class="nav-link">← Prev: AI Without Jargon</a>
<a href="the-roi-calculator.html" class="nav-link">Next: The ROI Calculator →</a>
</div>
</div>

<script>
const tasks = [
  {text:"Write first drafts of emails", zone:"can"},
  {text:"Summarize long documents", zone:"can"},
  {text:"Analyze spreadsheet data", zone:"can"},
  {text:"Generate social media posts", zone:"can"},
  {text:"Transcribe meeting recordings", zone:"can"},
  {text:"Translate content to other languages", zone:"can"},
  {text:"Answer FAQs from customers", zone:"can"},
  {text:"Create marketing strategies", zone:"help"},
  {text:"Write job descriptions", zone:"help"},
  {text:"Research competitors", zone:"help"},
  {text:"Draft legal contracts", zone:"help"},
  {text:"Plan project timelines", zone:"help"},
  {text:"Brainstorm product ideas", zone:"help"},
  {text:"Make final hiring decisions", zone:"cannot"},
  {text:"Replace your business judgment", zone:"cannot"},
  {text:"Guarantee legal compliance", zone:"cannot"},
  {text:"Build genuine relationships", zone:"cannot"},
  {text:"Handle sensitive HR conversations", zone:"cannot"},
  {text:"Make ethical decisions for your company", zone:"cannot"},
  {text:"Understand your company culture", zone:"cannot"},
];

let placements = {};
let selectedChip = null;

function shuffle(arr){ for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];} return arr; }

const poolItems = document.getElementById('pool-items');
shuffle([...tasks]).forEach((t,i) => {
  const chip = document.createElement('div');
  chip.className = 'task-chip';
  chip.textContent = t.text;
  chip.dataset.task = t.text;
  chip.addEventListener('click', () => selectChip(chip));
  poolItems.appendChild(chip);
});

document.querySelectorAll('.zone').forEach(zone => {
  zone.addEventListener('click', (e) => {
    if(!selectedChip || e.target.classList.contains('x')) return;
    placeChip(selectedChip, zone.dataset.zone);
  });
});

function selectChip(chip){
  if(chip.classList.contains('placed')) return;
  document.querySelectorAll('.task-chip.active').forEach(c=>c.classList.remove('active'));
  chip.classList.add('active');
  selectedChip = chip;
  LO.sfx.click();
}

function placeChip(chip, zoneName){
  const taskText = chip.dataset.task;
  placements[taskText] = zoneName;
  chip.classList.add('placed');
  chip.classList.remove('active');
  selectedChip = null;

  const container = document.getElementById('items-'+zoneName);
  const item = document.createElement('div');
  item.className = 'zone-item';
  item.innerHTML = `<span>${taskText}</span><span class="x" data-task="${taskText}">&times;</span>`;
  item.querySelector('.x').addEventListener('click', (e) => {
    e.stopPropagation();
    removeItem(taskText, item);
  });
  container.appendChild(item);
  LO.sfx.click();
  updateCount();
}

function removeItem(taskText, itemEl){
  delete placements[taskText];
  itemEl.remove();
  const chip = document.querySelector(`.task-chip[data-task="${taskText}"]`);
  if(chip){ chip.classList.remove('placed'); }
  updateCount();
}

function updateCount(){
  const placed = Object.keys(placements).length;
  document.getElementById('remaining').textContent = 20 - placed;
  document.getElementById('check-btn').disabled = placed < 20;
}

function checkAnswers(){
  let correct = 0;
  tasks.forEach(t => {
    if(placements[t.text] === t.zone) correct++;
  });
  const pct = Math.round(correct/20*100);
  const msg = pct >= 90 ? "Outstanding! You have a realistic view of AI." : pct >= 70 ? "Good instincts. Review the ones you missed." : "AI expectations need calibrating. Try again!";
  document.getElementById('result').classList.remove('hidden');
  document.getElementById('result').innerHTML = `<div class="score">${pct}%</div><div>${correct} of 20 correct</div><div class="msg">${msg}</div>`;
  if(pct >= 70){
    LO.completeLesson('ai-biz', 2, 120);
  }
  if(pct === 100) LO.unlockAchievement('quiz_master');

  // Highlight wrong answers
  document.querySelectorAll('.zone-item').forEach(item => {
    const txt = item.querySelector('span').textContent;
    const task = tasks.find(t=>t.text===txt);
    const zone = item.closest('.zone').dataset.zone;
    if(task && task.zone !== zone){
      item.style.borderLeft = '3px solid #ef4444';
    } else {
      item.style.borderLeft = '3px solid #22c55e';
    }
    item.querySelector('.x').style.display='none';
  });
}
</script>
