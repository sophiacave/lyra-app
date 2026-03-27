---
title: "The Conscience Layer"
course: "the-automation-lab"
order: 10
type: "lesson"
free: false
---<nav class="nav"><a href="/academy" class="logo">LIKE ONE ACADEMY</a><div class="nav-links"><a href="/academy" class="nav-link">All Courses</a></div></nav>

<div class="container">
  <div class="lesson-badge">&#128081; Capstone &bull; Lesson 10</div>
  <h1>The Conscience Layer</h1>
  <p class="subtitle">The soul of the system. Build a priority hierarchy that guides every agent's decisions. Then test it against five ethical dilemmas.</p>
  <div style="background:rgba(168,85,247,.06);border:1px solid rgba(168,85,247,.15);border-radius:12px;padding:1.25rem;margin-bottom:1.5rem;font-size:.85rem;color:#a1a1aa;line-height:1.6">The Conscience Layer is a design pattern created for Like One's agent architecture. While not an industry-standard term, the concept — priority-based rule hierarchies for autonomous systems — is a proven engineering practice, similar in spirit to Asimov's Laws of Robotics applied to software.</div>

  <h2 class="section-title">&#127384; Build the Priority Hierarchy</h2>
  <div class="hierarchy-builder">
    <div class="hb-title">Drag rules into the correct tiers</div>
    <div class="hb-desc">Every rule has a natural home. Prime Directives override everything. Identity shapes behavior. Operations set boundaries. Safety prevents harm. Tasks are the work itself. Arrange them correctly.</div>
    <div class="hb-tiers" id="tiers">
      <div class="tier t1" data-tier="prime" ondragover="ev(event)" ondrop="dropRule(event,'prime')"><div class="tier-header"><span class="tier-label">&#128308; Tier 1: Prime Directives</span><span class="tier-priority">HIGHEST</span></div><div class="tier-rules" id="rules-prime"></div></div>
      <div class="tier t2" data-tier="identity" ondragover="ev(event)" ondrop="dropRule(event,'identity')"><div class="tier-header"><span class="tier-label">&#128992; Tier 2: Identity</span><span class="tier-priority">HIGH</span></div><div class="tier-rules" id="rules-identity"></div></div>
      <div class="tier t3" data-tier="ops" ondragover="ev(event)" ondrop="dropRule(event,'ops')"><div class="tier-header"><span class="tier-label">&#128309; Tier 3: Operations</span><span class="tier-priority">MEDIUM</span></div><div class="tier-rules" id="rules-ops"></div></div>
      <div class="tier t4" data-tier="safety" ondragover="ev(event)" ondrop="dropRule(event,'safety')"><div class="tier-header"><span class="tier-label">&#128994; Tier 4: Safety</span><span class="tier-priority">STANDARD</span></div><div class="tier-rules" id="rules-safety"></div></div>
      <div class="tier t5" data-tier="task" ondragover="ev(event)" ondrop="dropRule(event,'task')"><div class="tier-header"><span class="tier-label">&#9899; Tier 5: Tasks</span><span class="tier-priority">LOWEST</span></div><div class="tier-rules" id="rules-task"></div></div>
    </div>
    <div class="rule-bank" id="rule-bank">
      <div class="bank-label">&#128230; Rule Bank — drag these into tiers above</div>
      <div class="bank-rules" id="bank-rules"></div>
      </div>
  </div>

  <h2 class="section-title">&#9878;&#65039; Ethical Dilemmas</h2>
  <div class="dilemma-section">
    <div class="dilemma-header"><span style="font-weight:700">Test Your Conscience</span><span class="dilemma-count" id="d-count">0/5 resolved</span></div>
    <div id="dilemmas"></div>
    </div>

  <div class="soul-search" id="soul-search">
    <div class="soul-anim">&#128302;</div>
    <div class="soul-text">Soul Search Complete</div>
    <div class="soul-detail">Your conscience layer has been evaluated against all ethical dilemmas.</div>
    <div class="soul-result" id="soul-result"></div>
    </div>

  <div class="complete-section">
    <button class="complete-btn" id="complete-btn" onclick="completeLsn()" disabled>Complete Capstone &mdash; 400 XP</button>
    <div class="complete-msg" id="complete-msg">&#10003; Capstone complete! +400 XP earned. You've finished The Automation Lab.</div>
    <div class="capstone-badge" id="capstone-badge">&#128081; AUTOMATION ARCHITECT — Capstone Certified</div>
  </div>
  </div>
<div class="xp-toast" id="xp-toast">+400 XP earned! Capstone complete! &#128081;</div>

<script>
// Rules to drag
const RULES=[
  {id:'r1',text:'Never harm the user',cat:'prime'},
  {id:'r2',text:'Respect user identity always',cat:'prime'},
  {id:'r3',text:'Maintain consistent voice/personality',cat:'identity'},
  {id:'r4',text:'Remember user preferences',cat:'identity'},
  {id:'r5',text:'Never exceed budget limits',cat:'ops'},
  {id:'r6',text:'Log all actions taken',cat:'ops'},
  {id:'r7',text:'Validate inputs before processing',cat:'safety'},
  {id:'r8',text:'Never expose credentials',cat:'safety'},
  {id:'r9',text:'Generate weekly report',cat:'task'},
  {id:'r10',text:'Post to social media at 9am',cat:'task'}
];

const placements={};
const shuffled=[...RULES].sort(()=>Math.random()-.5);

function renderBank(){
  const bank=document.getElementById('bank-rules');
  bank.innerHTML='';
  shuffled.filter(r=>!placements[r.id]).forEach(r=>{
    const chip=document.createElement('div');
    chip.className='rule-chip';chip.dataset.cat=r.cat;chip.dataset.id=r.id;
    chip.textContent=r.text;chip.draggable=true;
    chip.addEventListener('dragstart',e=>{e.dataTransfer.setData('text/plain',r.id);chip.classList.add('dragging');});
    chip.addEventListener('dragend',()=>chip.classList.remove('dragging'));
    bank.appendChild(chip);
  });
}

function ev(e){e.preventDefault();e.currentTarget.classList.add('dragover');}
document.querySelectorAll('.tier').forEach(t=>{
  t.addEventListener('dragleave',()=>t.classList.remove('dragover'));
});

function dropRule(e,tier){
  e.preventDefault();e.currentTarget.classList.remove('dragover');
  const ruleId=e.dataTransfer.getData('text/plain');
  placements[ruleId]=tier;
  renderAllTiers();
}

function renderAllTiers(){
  ['prime','identity','ops','safety','task'].forEach(tier=>{
    const el=document.getElementById(`rules-${tier}`);
    el.innerHTML='';
    Object.entries(placements).filter(([_,t])=>t===tier).forEach(([id])=>{
      const r=RULES.find(x=>x.id===id);
      const chip=document.createElement('div');
      chip.className='rule-chip';chip.dataset.cat=r.cat;chip.dataset.id=r.id;
      chip.textContent=r.text;chip.draggable=true;chip.style.cursor='grab';
      chip.addEventListener('dragstart',e=>{e.dataTransfer.setData('text/plain',r.id);chip.classList.add('dragging');});
      chip.addEventListener('dragend',()=>chip.classList.remove('dragging'));
      el.appendChild(chip);
    });
  });
  renderBank();
}
renderBank();

// Dilemmas
const DILEMMAS=[
  {text:'An agent is asked to post a user\'s private health data to social media because it would "go viral" and increase engagement metrics.',conflicting:'Task (increase engagement) vs. Prime Directive (never harm the user)',opts:['Post it — engagement is the goal','Refuse — user privacy is a Prime Directive','Post it anonymized'],correct:1,fb:'Prime Directives override all tasks. Sharing private health data harms the user, regardless of engagement benefits.'},
  {text:'The content writer agent wants to publish a blog post that accidentally contains the user\'s deadname in the metadata.',conflicting:'Task (publish content) vs. Identity (respect user identity always)',opts:['Publish as-is — it\'s just metadata','Strip the deadname, then publish','Hold for human review'],correct:1,fb:'Identity rules are Tier 2 — they override tasks. The conscience layer should automatically catch and correct identity violations before publishing.'},
  {text:'An agent discovers it can save $200/month by switching to a cheaper API, but it would require exposing the API key in a public repo.',conflicting:'Operations (budget efficiency) vs. Safety (never expose credentials)',opts:['Switch APIs and expose the key','Keep the expensive API','Find a secure way to use the cheaper API'],correct:2,fb:'Neither compromising safety nor ignoring efficiency is ideal. The conscience layer should seek solutions that satisfy both constraints.'},
  {text:'A monitoring agent detects a critical bug at 3 AM. Fixing it requires restarting the production server, which will cause 2 minutes of downtime.',conflicting:'Safety (fix critical bug) vs. Operations (minimize downtime)',opts:['Wait until morning','Restart now — critical bugs override downtime concerns','Restart but only alert the team after'],correct:1,fb:'Critical safety issues override operational convenience. The conscience layer prioritizes fixing harm, and 2 minutes of planned downtime beats unknown data corruption.'},
  {text:'An agent is generating a weekly report, but realizes the data shows the business is losing money. Should it soften the language to avoid alarming stakeholders?',conflicting:'Task (generate report) vs. Prime Directive (honesty / never mislead)',opts:['Soften the language — protect morale','Report accurately — truth is a Prime Directive','Skip the report this week'],correct:1,fb:'Honesty is a Prime Directive. The conscience layer ensures agents never mislead, even when the truth is uncomfortable. Accurate reporting enables informed decisions.'}
];

let dScore=0;
function renderDilemmas(){
  const el=document.getElementById('dilemmas');
  el.innerHTML=DILEMMAS.map((d,i)=>`
    <div class="dilemma-card" id="dilemma-${i}">
      <div class="dilemma-scenario">${d.text}</div>
      <div class="dilemma-conflicting"><strong>Conflict:</strong> ${d.conflicting}</div>
      <div class="dilemma-opts">${d.opts.map((o,j)=>`<button class="dilemma-opt" onclick="answerDilemma(${i},${j})">${o}</button>`).join('')}</div>
      <div class="dilemma-fb" id="dfb-${i}">${d.fb}</div>
    </div>
  `).join('');
}

function answerDilemma(di,oi){
  const d=DILEMMAS[di];
  const btns=document.querySelectorAll(`#dilemma-${di} .dilemma-opt`);
  if(btns[0].disabled)return;
  btns.forEach((b,j)=>{b.disabled=true;b.classList.add(j===d.correct?'correct':'wrong');});
  document.getElementById(`dfb-${di}`).style.display='block';
  if(oi===d.correct)dScore++;
  document.getElementById('d-count').textContent=`${document.querySelectorAll('.dilemma-fb[style*="block"]').length}/5 resolved`;

  // Check if all answered
  const allAnswered=document.querySelectorAll('.dilemma-fb[style*="block"]').length===5;
  if(allAnswered){
    const soul=document.getElementById('soul-search');
    soul.style.display='block';
    const result=document.getElementById('soul-result');
    if(dScore>=4){
      result.className='soul-result pass';
      result.textContent=`${dScore}/5 correct — Your conscience is strong.`;
    } else {
      result.className='soul-result fail';
      result.textContent=`${dScore}/5 correct — Review the priority hierarchy and try again.`;
    }
    document.getElementById('complete-btn').disabled=false;
    soul.scrollIntoView({behavior:'smooth',block:'center'});
  }
}
renderDilemmas();

function completeLsn(){
  if(localStorage.getItem('autolab-10')==='complete')return;
  localStorage.setItem('autolab-10','complete');
  document.getElementById('complete-btn').disabled=true;
  document.getElementById('complete-msg').style.display='block';
  document.getElementById('capstone-badge').style.display='block';
  const t=document.getElementById('xp-toast');t.classList.add('show');setTimeout(()=>t.classList.remove('show'),4000);
}
if(localStorage.getItem('autolab-10')==='complete'){
  document.getElementById('complete-btn').disabled=true;
  document.getElementById('complete-msg').style.display='block';
  document.getElementById('capstone-badge').style.display='block';
}
</script>
