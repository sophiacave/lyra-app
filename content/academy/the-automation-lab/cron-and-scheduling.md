---
title: "Cron and Scheduling"
course: "the-automation-lab"
order: 8
type: "lesson"
free: false
---<nav class="nav"><a href="/academy" class="logo">LIKE ONE ACADEMY</a><div class="nav-links"><a href="index.html" class="nav-link">Course Overview</a><a href="/academy" class="nav-link">All Courses</a></div></nav>

<div class="container">
  <div class="lesson-badge">Module 3 &bull; Lesson 8</div>
  <h1>Cron &amp; Scheduling</h1>
  <p class="subtitle">Autonomous agents need to run on schedule. Master cron expressions, schedule your fleet, and detect conflicts before they happen.</p>

  <div style="background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.12);border-radius:12px;padding:1.25rem;margin-bottom:1.5rem;font-size:.88rem;color:#a1a1aa;line-height:1.6">
    <strong style="color:#fb923c">Real-world context:</strong> Cron is a scheduling system used on virtually every server in the world. It was created in the 1970s and is still the standard way to run automated tasks. AI agents use cron expressions to define when they wake up and do work -- for example, a monitoring agent that checks server health every 5 minutes, or a reporting agent that sends a daily summary at 5 PM. The five-field format below (minute, hour, day, month, weekday) lets you express any schedule from "every minute" to "quarterly on Fridays."
  </div>

  <h2 class="section-title">&#9200; Cron Expression Builder</h2>
  <div class="cron-builder">
    <div class="cron-title">Build Your Schedule</div>
    <div class="cron-fields">
      <div class="cron-field"><label>Minute</label><select id="c-min" onchange="updateCron()"><option value="*">Every (*)</option><option value="0">:00</option><option value="15">:15</option><option value="30">:30</option><option value="45">:45</option><option value="*/5">Every 5</option><option value="*/10">Every 10</option><option value="*/15">Every 15</option><option value="*/30">Every 30</option></select></div>
      <div class="cron-field"><label>Hour</label><select id="c-hr" onchange="updateCron()"><option value="*">Every (*)</option><option value="0">12 AM</option><option value="6">6 AM</option><option value="8">8 AM</option><option value="9">9 AM</option><option value="12">12 PM</option><option value="17">5 PM</option><option value="21">9 PM</option><option value="*/2">Every 2h</option><option value="*/6">Every 6h</option></select></div>
      <div class="cron-field"><label>Day (Month)</label><select id="c-dom" onchange="updateCron()"><option value="*">Every (*)</option><option value="1">1st</option><option value="15">15th</option><option value="1,15">1st & 15th</option></select></div>
      <div class="cron-field"><label>Month</label><select id="c-mon" onchange="updateCron()"><option value="*">Every (*)</option><option value="1">Jan</option><option value="*/3">Quarterly</option></select></div>
      <div class="cron-field"><label>Day (Week)</label><select id="c-dow" onchange="updateCron()"><option value="*">Every (*)</option><option value="1-5">Mon-Fri</option><option value="0,6">Weekends</option><option value="1">Monday</option><option value="5">Friday</option></select></div>
    </div>
    <div class="cron-expr">
      <div class="cron-expr-val" id="cron-val">* * * * *</div>
      <div class="cron-english" id="cron-eng">Every minute, every hour, every day</div>
    </div>
  </div>

  <h2 class="section-title">&#128197; Schedule Your Fleet</h2>
  <div class="timeline-section">
    <div class="tl-title">24-Hour Agent Timeline</div>
    <div class="tl-desc">Assign schedules to 5 agents and watch the timeline update. Red markers indicate scheduling conflicts -- when too many agents run at the same time, they compete for resources (CPU, memory, API rate limits). Stagger heavy tasks to avoid this.</div>

    <div class="agent-scheduler" id="agent-sched"></div>
    <div class="conflict-alert" id="conflict-alert">&#9888;&#65039; Scheduling conflict detected! Two agents overlap at the same time.</div>

    <div class="timeline" id="timeline">
      <div class="tl-hours"><span>12AM</span><span>3AM</span><span>6AM</span><span>9AM</span><span>12PM</span><span>3PM</span><span>6PM</span><span>9PM</span><span>12AM</span></div>
      <div id="tl-rows"></div>
    </div>
  </div>

  <div class="complete-section">
    <button class="complete-btn" id="complete-btn" onclick="completeLsn()">Complete Lesson &mdash; 300 XP</button>
    <div class="complete-msg" id="complete-msg">&#10003; Lesson complete! +300 XP earned</div>
  </div>
  <div class="lesson-nav">
    <a href="build-a-team.html">&larr; Build a Team</a>
    <a href="monitoring-and-healing.html">Next: Monitoring &amp; Healing &rarr;</a>
  </div>
</div>
<div class="xp-toast" id="xp-toast">+300 XP earned! &#9889;</div>

<script>
function updateCron(){
  const m=document.getElementById('c-min').value;
  const h=document.getElementById('c-hr').value;
  const dom=document.getElementById('c-dom').value;
  const mon=document.getElementById('c-mon').value;
  const dow=document.getElementById('c-dow').value;
  document.getElementById('cron-val').textContent=`${m} ${h} ${dom} ${mon} ${dow}`;
  // English translation
  let eng=[];
  if(m==='*')eng.push('Every minute');
  else if(m.startsWith('*/'))eng.push(`Every ${m.slice(2)} minutes`);
  else eng.push(`At minute ${m}`);
  if(h==='*')eng.push('every hour');
  else if(h.startsWith('*/'))eng.push(`every ${h.slice(2)} hours`);
  else{const hr=parseInt(h);eng.push(`at ${hr>12?hr-12:hr||12}${hr>=12?'PM':'AM'}`);}
  if(dom!=='*')eng.push(`on day ${dom} of the month`);
  if(mon!=='*'&&!mon.startsWith('*/'))eng.push(`in month ${mon}`);
  else if(mon.startsWith('*/'))eng.push('quarterly');
  if(dow==='1-5')eng.push('Mon-Fri');
  else if(dow==='0,6')eng.push('weekends only');
  else if(dow!=='*')eng.push(`on day ${dow} of the week`);
  document.getElementById('cron-eng').textContent=eng.join(', ');
}

const FLEET=[
  {id:'content',name:'Content',icon:'&#9997;&#65039;',color:'#ef4444'},
  {id:'analytics',name:'Analytics',icon:'&#128202;',color:'#38bdf8'},
  {id:'monitor',name:'Monitor',icon:'&#128065;&#65039;',color:'#22c55e'},
  {id:'backup',name:'Backup',icon:'&#128451;&#65039;',color:'#fb923c'},
  {id:'report',name:'Report',icon:'&#128220;',color:'#a855f7'}
];

const SCHEDULES=[
  {val:'0',label:'12 AM',hours:[0]},
  {val:'6',label:'6 AM',hours:[6]},
  {val:'8',label:'8 AM',hours:[8]},
  {val:'9',label:'9 AM',hours:[9]},
  {val:'12',label:'12 PM',hours:[12]},
  {val:'14',label:'2 PM',hours:[14]},
  {val:'17',label:'5 PM',hours:[17]},
  {val:'21',label:'9 PM',hours:[21]},
  {val:'every2',label:'Every 2h',hours:[0,2,4,6,8,10,12,14,16,18,20,22]},
  {val:'every6',label:'Every 6h',hours:[0,6,12,18]},
  {val:'every4',label:'Every 4h',hours:[0,4,8,12,16,20]}
];

const agentSchedules={};
function initScheduler(){
  const el=document.getElementById('agent-sched');
  el.innerHTML=FLEET.map(a=>`<div class="as-row"><div class="as-icon">${a.icon}</div><div class="as-name">${a.name}</div><div class="as-select"><label>Runs at:</label><select onchange="updateTimeline()" id="sched-${a.id}">${SCHEDULES.map(s=>`<option value="${s.val}">${s.label}</option>`).join('')}</select></div></div>`).join('');
  // Set defaults
  document.getElementById('sched-content').value='9';
  document.getElementById('sched-analytics').value='every6';
  document.getElementById('sched-monitor').value='every2';
  document.getElementById('sched-backup').value='0';
  document.getElementById('sched-report').value='17';
  updateTimeline();
}

function updateTimeline(){
  const rows=document.getElementById('tl-rows');
  rows.innerHTML='';
  const hourMap={};
  FLEET.forEach(a=>{
    const val=document.getElementById(`sched-${a.id}`).value;
    const sched=SCHEDULES.find(s=>s.val===val);
    const hours=sched?sched.hours:[parseInt(val)];
    agentSchedules[a.id]=hours;
    hours.forEach(h=>{if(!hourMap[h])hourMap[h]=[];hourMap[h].push(a.id);});
    const row=document.createElement('div');row.className='tl-agent-row';
    row.innerHTML=`<div class="tl-agent-label" style="color:${a.color}">${a.icon} ${a.name}</div><div class="tl-agent-bar" id="bar-${a.id}"></div>`;
    rows.appendChild(row);
    setTimeout(()=>{
      const bar=document.getElementById(`bar-${a.id}`);
      hours.forEach(h=>{
        const pct=(h/24)*100;
        const block=document.createElement('div');
        block.className='tl-block';
        block.style.cssText=`left:${pct}%;width:${(1/24)*100}%;background:${a.color}40;border:1px solid ${a.color}`;
        block.textContent=`${h>12?h-12:h||12}${h>=12?'p':'a'}`;
        bar.appendChild(block);
      });
    },0);
  });
  // Check conflicts
  let hasConflict=false;
  for(const h in hourMap){
    if(hourMap[h].length>2){hasConflict=true;break;}
  }
  document.getElementById('conflict-alert').style.display=hasConflict?'block':'none';
}

initScheduler();

function completeLsn(){
  if(localStorage.getItem('autolab-8')==='complete')return;
  localStorage.setItem('autolab-8','complete');
  document.getElementById('complete-btn').disabled=true;
  document.getElementById('complete-msg').style.display='block';
  const t=document.getElementById('xp-toast');t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3000);
}
if(localStorage.getItem('autolab-8')==='complete'){document.getElementById('complete-btn').disabled=true;document.getElementById('complete-msg').style.display='block';}
</script>
