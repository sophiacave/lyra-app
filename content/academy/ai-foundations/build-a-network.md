---
title: "Build a Network"
course: "ai-foundations"
order: 2
type: "builder"
free: true
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>
  <a href="index.html" class="nav-link">← Back to Course</a>
</nav>
<div class="container">
  <div class="lesson-header">
    <div class="meta">
      <span class="type-badge">Drag & Drop</span>
      <span class="xp-badge">+75 XP</span>
      <span class="time-badge">~30 min</span>
    </div>
    <h1>Build a Network</h1>
    <p>Drag neurons onto the canvas, connect them into layers, and watch data flow through your creation.</p>
  </div>

  <div class="status-bar" id="statusBar">Drag neurons from the palette → drop into the canvas</div>

  <div class="workspace">
    <div class="palette">
      <h3>Neuron Palette</h3>
      <div class="drag-neuron" draggable="true" data-type="input"><div class="dot dot-input"></div>Input Neuron</div>
      <div class="drag-neuron" draggable="true" data-type="hidden"><div class="dot dot-hidden"></div>Hidden Neuron</div>
      <div class="drag-neuron" draggable="true" data-type="output"><div class="dot dot-output"></div>Output Neuron</div>
    </div>
    <div class="network-area" id="networkArea">
      <canvas id="connCanvas"></canvas>
    </div>
  </div>

  <div class="actions">
    <button class="btn btn-connect" id="connectBtn" onclick="toggleConnect()">🔗 Connect Mode</button>
    <button class="btn btn-train" id="trainBtn" onclick="trainNetwork()">⚡ Train Network</button>
    <button class="btn btn-clear" onclick="clearNetwork()">Clear All</button>
  </div>

  <div class="challenge">
    <h3>🏆 Challenge: Cats vs Dogs Classifier</h3>
    <p>Build a network that could classify images of cats and dogs. You'll need the right architecture!</p>
    <div class="checklist">
      <div class="checklist-item" id="check1"><div class="check"></div>Place at least 2 input neurons</div>
      <div class="checklist-item" id="check2"><div class="check"></div>Add 2+ hidden neurons</div>
      <div class="checklist-item" id="check3"><div class="check"></div>Place 2 output neurons (cat/dog)</div>
      <div class="checklist-item" id="check4"><div class="check"></div>Connect all layers</div>
      <div class="checklist-item" id="check5"><div class="check"></div>Run training to see data flow</div>
    </div>
  </div>

  <div class="narration">
    <strong>Neural networks are layers of neurons connected together.</strong> Input neurons receive data (like pixel values from an image). Hidden neurons find patterns. Output neurons make decisions. The magic is in the connections — each one has a weight that gets adjusted during training.
  </div>

  <button class="complete-btn" id="completeBtn" onclick="completeLesson()">Complete & Continue →</button>
</div>
<div class="footer-progress"><span id="footerProgress">0 of 9</span> lessons complete</div>

<script>
const area=document.getElementById('networkArea');
const connCanvas=document.getElementById('connCanvas');
const connCtx=connCanvas.getContext('2d');
let neurons=[];
let connections=[];
let connectMode=false;
let connectFrom=null;
let neuronId=0;
let trained=false;

function resizeCanvas(){
  const r=area.getBoundingClientRect();
  const dpr=window.devicePixelRatio||1;
  connCanvas.width=r.width*dpr;connCanvas.height=r.height*dpr;
  connCanvas.style.width=r.width+'px';connCanvas.style.height=r.height+'px';
  connCtx.scale(dpr,dpr);
  drawConnections();
}
window.addEventListener('resize',resizeCanvas);
setTimeout(resizeCanvas,100);

// Drag & Drop
document.querySelectorAll('.drag-neuron').forEach(el=>{
  el.addEventListener('dragstart',e=>{
    e.dataTransfer.setData('type',el.dataset.type);
  });
});
area.addEventListener('dragover',e=>{e.preventDefault();area.classList.add('drag-over')});
area.addEventListener('dragleave',()=>area.classList.remove('drag-over'));
area.addEventListener('drop',e=>{
  e.preventDefault();area.classList.remove('drag-over');
  const type=e.dataTransfer.getData('type');
  const rect=area.getBoundingClientRect();
  const x=e.clientX-rect.left-24;
  const y=e.clientY-rect.top-24;
  addNeuron(type,x,y);
});

function addNeuron(type,x,y){
  const id='n'+neuronId++;
  const labels={input:'IN',hidden:'H',output:'OUT'};
  const el=document.createElement('div');
  el.className='placed-neuron '+type+'-type';
  el.textContent=labels[type];
  el.style.left=x+'px';el.style.top=y+'px';
  el.dataset.id=id;el.dataset.type=type;
  area.appendChild(el);
  neurons.push({id,type,el,x:x+24,y:y+24});

  // Make draggable inside canvas
  let dragging=false,ox,oy;
  el.addEventListener('mousedown',e=>{
    if(connectMode){
      handleConnect(id);return;
    }
    dragging=true;ox=e.offsetX;oy=e.offsetY;
    el.style.zIndex=10;
  });
  document.addEventListener('mousemove',e=>{
    if(!dragging)return;
    const rect=area.getBoundingClientRect();
    const nx=e.clientX-rect.left-ox;
    const ny=e.clientY-rect.top-oy;
    el.style.left=nx+'px';el.style.top=ny+'px';
    const n=neurons.find(n=>n.id===id);
    if(n){n.x=nx+24;n.y=ny+24}
    drawConnections();
  });
  document.addEventListener('mouseup',()=>{if(dragging){dragging=false}});

  updateStatus();checkChallenge();
}

function toggleConnect(){
  connectMode=!connectMode;
  const btn=document.getElementById('connectBtn');
  btn.classList.toggle('active',connectMode);
  btn.textContent=connectMode?'🔗 Click two neurons':'🔗 Connect Mode';
  connectFrom=null;
  document.getElementById('statusBar').innerHTML=connectMode?'Click a <span>source neuron</span>, then click a <span>target neuron</span>':'Drag neurons from the palette → drop into the canvas';
}

function handleConnect(id){
  if(!connectFrom){
    connectFrom=id;
    const el=neurons.find(n=>n.id===id).el;
    el.style.boxShadow='0 0 20px rgba(192,132,252,.5)';
    document.getElementById('statusBar').innerHTML='Now click the <span>target neuron</span>';
  }else if(connectFrom!==id){
    connections.push({from:connectFrom,to:id});
    const el=neurons.find(n=>n.id===connectFrom).el;
    el.style.boxShadow='';
    connectFrom=null;
    drawConnections();checkChallenge();
    document.getElementById('statusBar').innerHTML='Connected! Click another <span>source neuron</span> or toggle off';
  }
}

function drawConnections(){
  resizeCanvasRaw();
  connCtx.clearRect(0,0,connCanvas.width,connCanvas.height);
  connections.forEach(c=>{
    const from=neurons.find(n=>n.id===c.from);
    const to=neurons.find(n=>n.id===c.to);
    if(!from||!to)return;
    connCtx.beginPath();connCtx.moveTo(from.x,from.y);connCtx.lineTo(to.x,to.y);
    connCtx.strokeStyle=c.pulse?'rgba(34,197,94,.8)':'rgba(255,255,255,.12)';
    connCtx.lineWidth=c.pulse?3:1.5;connCtx.stroke();
    if(c.pulse&&c.pulsePos!==undefined){
      const px=from.x+(to.x-from.x)*c.pulsePos;
      const py=from.y+(to.y-from.y)*c.pulsePos;
      connCtx.beginPath();connCtx.arc(px,py,5,0,Math.PI*2);
      connCtx.fillStyle='#22c55e';connCtx.fill();
    }
  });
}

function resizeCanvasRaw(){
  const r=area.getBoundingClientRect();
  const dpr=window.devicePixelRatio||1;
  if(connCanvas.width!==r.width*dpr){
    connCanvas.width=r.width*dpr;connCanvas.height=r.height*dpr;
    connCanvas.style.width=r.width+'px';connCanvas.style.height=r.height+'px';
    connCtx.setTransform(dpr,0,0,dpr,0,0);
  }
}

function trainNetwork(){
  if(connections.length===0){
    document.getElementById('statusBar').innerHTML='<span style="color:#ef4444">Connect some neurons first!</span>';return;
  }
  trained=true;
  document.getElementById('statusBar').innerHTML='<span style="color:#22c55e">⚡ Training... watch the data flow!</span>';

  // Animate pulses
  let frame=0;
  connections.forEach(c=>{c.pulse=true;c.pulsePos=0});
  function animatePulse(){
    frame++;
    let running=false;
    connections.forEach((c,i)=>{
      c.pulsePos=(frame-i*10)/80;
      if(c.pulsePos<0)c.pulsePos=0;
      if(c.pulsePos>1){c.pulsePos=1;c.pulse=false}else{running=true}
    });
    drawConnections();
    if(running)requestAnimationFrame(animatePulse);
    else{
      connections.forEach(c=>{c.pulse=false;c.pulsePos=undefined});
      drawConnections();
      // Pulse output neurons
      neurons.filter(n=>n.type==='output').forEach(n=>{n.el.classList.add('pulsing');setTimeout(()=>n.el.classList.remove('pulsing'),600)});
      document.getElementById('statusBar').innerHTML='<span style="color:#22c55e">✓ Training complete! Data flowed through your network.</span>';
      checkChallenge();
    }
  }
  animatePulse();
}

function clearNetwork(){
  neurons.forEach(n=>n.el.remove());neurons=[];connections=[];connectFrom=null;trained=false;
  drawConnections();updateStatus();checkChallenge();
}

function updateStatus(){
  if(!connectMode)document.getElementById('statusBar').innerHTML='<span>'+neurons.length+'</span> neurons placed · <span>'+connections.length+'</span> connections';
}

function checkChallenge(){
  const inp=neurons.filter(n=>n.type==='input').length;
  const hid=neurons.filter(n=>n.type==='hidden').length;
  const out=neurons.filter(n=>n.type==='output').length;
  const hasConn=connections.length>=(inp+hid);
  document.getElementById('check1').classList.toggle('done',inp>=2);
  document.getElementById('check2').classList.toggle('done',hid>=2);
  document.getElementById('check3').classList.toggle('done',out>=2);
  document.getElementById('check4').classList.toggle('done',hasConn);
  document.getElementById('check5').classList.toggle('done',trained);
}

function getProgress(){try{return JSON.parse(localStorage.getItem('ai-foundations-progress'))||{}}catch(e){return{}}}
function updateFooter(){
  const p=getProgress();const c=Object.keys(p).filter(k=>p[k]).length;
  document.getElementById('footerProgress').textContent=c+' of 9';
  if(p['build-a-network']){document.getElementById('completeBtn').textContent='Completed ✓';document.getElementById('completeBtn').classList.add('done')}
}
function completeLesson(){
  const p=getProgress();p['build-a-network']=true;localStorage.setItem('ai-foundations-progress',JSON.stringify(p));
  LO_NAV.goNext();
}
updateFooter();
</script>
