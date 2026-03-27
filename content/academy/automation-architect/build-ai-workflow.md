---
title: "Build AI Workflow"
course: "automation-architect"
order: 8
type: "builder"
free: false
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>
  
</nav>
<header class="lesson-header">
  <div class="lesson-badge">Module 3 &middot; Interactive</div>
  <h1>Build AI Workflow</h1>
  <p>Assemble a workflow from components: trigger, AI classify, filter, transform, and action. Then simulate data flowing through it.</p>
</header>

<div class="content">
  <div class="palette">
    <h2>Component Palette</h2>
    <p>Click components to add them to your workflow canvas. Build a pipeline that processes incoming data with AI.</p>
    <div class="palette-grid" id="paletteGrid">
      <div class="palette-item pi-trigger" onclick="addComponent('trigger')" id="pal-trigger">
        <div class="pi-icon">&#9889;</div>
        <div class="pi-name">Webhook Trigger</div>
        <div class="pi-type">trigger</div>
      </div>
      <div class="palette-item pi-ai" onclick="addComponent('ai')" id="pal-ai">
        <div class="pi-icon">&#129504;</div>
        <div class="pi-name">AI Classify</div>
        <div class="pi-type">ai (claude)</div>
      </div>
      <div class="palette-item pi-filter" onclick="addComponent('filter')" id="pal-filter">
        <div class="pi-icon">&#128269;</div>
        <div class="pi-name">Filter</div>
        <div class="pi-type">condition</div>
      </div>
      <div class="palette-item pi-transform" onclick="addComponent('transform')" id="pal-transform">
        <div class="pi-icon">&#128260;</div>
        <div class="pi-name">Transform</div>
        <div class="pi-type">reshape data</div>
      </div>
      <div class="palette-item pi-action" onclick="addComponent('action')" id="pal-action">
        <div class="pi-icon">&#128640;</div>
        <div class="pi-name">Send to Team</div>
        <div class="pi-type">action</div>
      </div>
    </div>
  </div>

  <div class="canvas" id="canvas">
    <div class="canvas-label" id="canvasEmpty">Click components above to build your workflow</div>
    <div id="canvasFlow"></div>
    </div>

  <div class="sim-log" id="simLog"></div>

  <div class="run-area">
    <button class="run-btn" id="runBtn" disabled onclick="runSimulation()">Run Simulation</button>
  </div>

  <button class="complete-btn hidden" id="completeBtn" onclick="completeLesson()">Complete Lesson &mdash; Earn 75 XP</button>
</div>

<footer class="progress-footer"><p>Lesson 8 of 9 &middot; Automation Architect</p></footer>

<script>
const SLUG='build-ai-workflow';
const STORAGE_KEY='automation-architect-progress';

const components={
  trigger:{icon:'&#9889;',name:'Webhook Trigger',desc:'Receives incoming HTTP data',cssClass:'cn-trigger',logColor:'log-green',logMsg:'Webhook received: customer email from jane@acme.co'},
  ai:{icon:'&#129504;',name:'AI Classify (Claude)',desc:'Analyzes content, determines intent',cssClass:'cn-ai',logColor:'log-purple',logMsg:'Claude classified: intent="billing_issue" confidence=94%'},
  filter:{icon:'&#128269;',name:'Filter',desc:'Passes only high-confidence results',cssClass:'cn-filter',logColor:'log-red',logMsg:'Filter passed: confidence 94% > threshold 80%'},
  transform:{icon:'&#128260;',name:'Transform',desc:'Reshapes data for the action',cssClass:'cn-transform',logColor:'log-orange',logMsg:'Transformed: {team:"billing", priority:"high", ticket_id:"TK-4821"}'},
  action:{icon:'&#128640;',name:'Send to Team',desc:'Routes to the appropriate team',cssClass:'cn-action',logColor:'log-blue',logMsg:'Routed to Billing Team. Ticket TK-4821 created. Notification sent.'}
};

let pipeline=[];

function addComponent(type){
  if(pipeline.includes(type))return;
  pipeline.push(type);
  document.getElementById('pal-'+type).classList.add('used');
  renderCanvas();
}

function removeComponent(type){
  pipeline=pipeline.filter(t=>t!==type);
  document.getElementById('pal-'+type).classList.remove('used');
  renderCanvas();
}

function renderCanvas(){
  const flow=document.getElementById('canvasFlow');
  const empty=document.getElementById('canvasEmpty');
  const canvas=document.getElementById('canvas');

  if(pipeline.length===0){
    empty.style.display='block';
    flow.innerHTML='';
    canvas.classList.remove('has-items');
    document.getElementById('runBtn').disabled=true;
    return;
  }

  empty.style.display='none';
  canvas.classList.add('has-items');

  let html='';
  pipeline.forEach((type,i)=>{
    const c=components[type];
    html+=`<div class="canvas-node ${c.cssClass}" id="cn-${type}">
      <div class="cn-icon">${c.icon}</div>
      <div class="cn-info"><div class="cn-name">${c.name}</div><div class="cn-desc">${c.desc}</div></div>
      <button class="cn-remove" onclick="removeComponent('${type}')">&times;</button>
    </div>`;
    if(i<pipeline.length-1){
      html+=`<div class="canvas-connector"><div class="cc-arrow">&#9660;</div></div>`;
    }
  });
  flow.innerHTML=html;

  // Enable run if pipeline has at least trigger + 1 more
  document.getElementById('runBtn').disabled=pipeline.length<2;
}

function runSimulation(){
  const log=document.getElementById('simLog');
  log.classList.add('visible');
  log.innerHTML='';

  let delay=0;
  const addLog=(msg,color,d)=>{
    setTimeout(()=>{
      const line=document.createElement('div');
      line.className='log-line';
      line.style.animationDelay='0s';
      line.innerHTML=`<span class="log-dim">[${new Date().toLocaleTimeString()}]</span> <span class="${color}">${msg}</span>`;
      log.appendChild(line);
      log.scrollTop=log.scrollHeight;

      // Highlight node
      const nodeId='cn-'+pipeline[Math.min(Math.floor(d/800),pipeline.length-1)];
      const node=document.getElementById(nodeId);
      if(node){
        node.style.boxShadow='0 0 30px rgba(255,255,255,.15)';
        node.style.transform='scale(1.03)';
        setTimeout(()=>{node.style.boxShadow='';node.style.transform=''},600);
      }
    },d);
  };

  addLog('Simulation starting...','log-dim',0);
  delay=400;
  pipeline.forEach((type,i)=>{
    const c=components[type];
    addLog(c.logMsg,c.logColor,delay);
    delay+=800;
  });
  addLog('Workflow complete. All steps executed successfully.','log-green',delay);

  setTimeout(()=>{
    document.getElementById('completeBtn').classList.remove('hidden');
  },delay+500);
}

function completeLesson(){
  const progress=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');
  progress[SLUG]=true;localStorage.setItem(STORAGE_KEY,JSON.stringify(progress));
  const btn=document.getElementById('completeBtn');btn.textContent='Completed! +75 XP';btn.classList.add('done');
}

(function(){
  const progress=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');
  if(progress[SLUG]){
    document.getElementById('completeBtn').classList.remove('hidden');
    document.getElementById('completeBtn').textContent='Completed! +75 XP';
    document.getElementById('completeBtn').classList.add('done');
  }
})();
</script>
