---
title: "Build a Network"
course: "ai-foundations"
order: 2
type: "lesson"
free: true
videoId: "b06cfa1b-cd8f-49e6-b6c6-87d256a47255"
---<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-foundations/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 2 of 9</span>
</nav>

<div class="lesson-hero">
  <h1>Build a <span class="accent">Network.</span></h1>
  <p class="sub">Drag neurons onto the canvas, connect them into layers, and watch data flow through your creation.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>How neurons connect to form layers</li>
    <li>The difference between input, hidden, and output layers</li>
    <li>Why architecture matters for what a network can learn</li>
    <li>What happens when data flows through a network</li>
  </ul>
</div>

<!-- SECTION 1: CONCEPT -->
<div class="lesson-section">
  <span class="section-label">The Concept</span>
  <h2 class="section-title">Layers are the architecture of intelligence.</h2>
  <p class="section-text">A single neuron can make simple decisions. But stack neurons into layers — input, hidden, output — and suddenly the network can recognize faces, translate languages, and write code. The architecture (how many layers, how they connect) determines what the network can learn.</p>

<div data-learn="SortStack" data-props='{"title":"Order the Layers","instruction":"Arrange the three layer types in the order data flows through them","items":["Input Layer — receives raw data (pixels, text, numbers)","Hidden Layer — finds patterns and intermediate features","Output Layer — makes the final prediction or decision"]}'></div>

</div>

<!-- SECTION 2: INTERACTIVE BUILDER -->
<div class="lesson-section">
  <span class="section-label">Build It</span>
  <h2 class="section-title">Drag, drop, connect, train.</h2>

  <div class="status-bar" id="statusBar">Drag neurons from the palette → drop into the canvas</div>

  <div class="workspace">
    <div class="palette">
      <h3>Neuron Palette</h3>
      <div class="drag-neuron" draggable="true" data-type="input">Input Neuron</div>
      <div class="drag-neuron" draggable="true" data-type="hidden">Hidden Neuron</div>
      <div class="drag-neuron" draggable="true" data-type="output">Output Neuron</div>
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
    <h3>Challenge: Cats vs Dogs Classifier</h3>
    <p>Build a network that could classify images of cats and dogs.</p>
    <div class="checklist">
      <div class="checklist-item" id="check1">Place at least 2 input neurons</div>
      <div class="checklist-item" id="check2">Add 2+ hidden neurons</div>
      <div class="checklist-item" id="check3">Place 2 output neurons (cat/dog)</div>
      <div class="checklist-item" id="check4">Connect all layers</div>
      <div class="checklist-item" id="check5">Run training to see data flow</div>
    </div>
  </div>
</div>

<!-- SECTION 3: KNOWLEDGE CHECK -->
<div class="lesson-section">
  <span class="section-label">Knowledge Check</span>
  <h2 class="section-title">Test your understanding.</h2>

<div data-learn="FlashDeck" data-props='{"title":"Network Architecture Concepts","cards":[{"front":"Input Layer","back":"The first layer of a neural network. It receives raw data — pixels, text, numbers — and passes it to the hidden layers for processing."},{"front":"Hidden Layer","back":"Middle layers that find patterns and intermediate representations. Each hidden layer builds on the previous one to detect increasingly complex features."},{"front":"Output Layer","back":"The final layer that makes the prediction or decision. For a cat/dog classifier, the output layer has one neuron per class."},{"front":"Forward Pass","back":"When data flows from input through hidden layers to output. Each neuron multiplies inputs by weights, adds bias, and applies an activation function."},{"front":"Network Architecture","back":"The structure of a neural network — how many layers, how many neurons per layer, how they connect. Architecture determines what the network can learn."}]}'></div>

<div data-learn="MatchConnect" data-props='{"title":"Match Network Components","instruction":"Tap one on the left, then its match on the right","pairs":[{"left":"Input neurons","right":"Receive raw data like pixel values or text"},{"left":"Hidden neurons","right":"Find patterns and intermediate features"},{"left":"Output neurons","right":"Produce the final prediction or class label"},{"left":"Connections","right":"Weighted links that carry signals between neurons"},{"left":"Training","right":"Adjusting weights so the network output improves"}]}'></div>

<div data-learn="QuizMC" data-props='{"title":"Network Architecture","questions":[{"q":"Why do neural networks need hidden layers?","options":["To hide the computation from users","To find intermediate patterns that are too complex for a single layer","To reduce the amount of training data needed","To make the network smaller"],"correct":1,"explanation":"Hidden layers find intermediate representations — first layer might detect edges, second detects shapes, third detects objects. Each layer builds on the previous one to learn increasingly complex patterns."},{"q":"For a cats vs dogs image classifier, why do you need 2 output neurons?","options":["One for each pixel in the image","One outputs cat probability, the other outputs dog probability","Two outputs make the network faster","It is just a convention with no real purpose"],"correct":1,"explanation":"Each output neuron represents one class. The network learns to activate the cat neuron when it sees a cat and the dog neuron when it sees a dog. The outputs are often probabilities that sum to 1."}]}'></div>

  <div class="narration" style="margin-top:1.5rem">
    <strong>Neural networks are layers of neurons connected together.</strong> Input neurons receive data. Hidden neurons find patterns. Output neurons make decisions. The magic is in the connections — each one has a weight that gets adjusted during training.
  </div>
</div>

<!-- NEXT LESSON -->
<div class="lesson-section" style="text-align:center;padding:2rem 0">
  <a href="/academy/ai-foundations/neural-net-quiz" style="display:inline-block;background:var(--orange);color:var(--bg);font-weight:700;padding:.75rem 2rem;border-radius:10px;text-decoration:none;font-size:.95rem">Next: Neural Net Quiz →</a>
</div>

</div>

<script>
const area=document.getElementById('networkArea');
if(area){
const connCanvas=document.getElementById('connCanvas');
const connCtx=connCanvas.getContext('2d');
let neurons=[],connections=[],connectMode=false,connectFrom=null,neuronId=0,trained=false;

function resizeCanvas(){const r=area.getBoundingClientRect();const dpr=window.devicePixelRatio||1;connCanvas.width=r.width*dpr;connCanvas.height=r.height*dpr;connCanvas.style.width=r.width+'px';connCanvas.style.height=r.height+'px';connCtx.scale(dpr,dpr);drawConnections()}
window.addEventListener('resize',resizeCanvas);setTimeout(resizeCanvas,100);

document.querySelectorAll('.drag-neuron').forEach(el=>{el.addEventListener('dragstart',e=>{e.dataTransfer.setData('type',el.dataset.type)})});
area.addEventListener('dragover',e=>{e.preventDefault();area.classList.add('drag-over')});
area.addEventListener('dragleave',()=>area.classList.remove('drag-over'));
area.addEventListener('drop',e=>{e.preventDefault();area.classList.remove('drag-over');const type=e.dataTransfer.getData('type');const rect=area.getBoundingClientRect();addNeuron(type,e.clientX-rect.left-24,e.clientY-rect.top-24)});

function addNeuron(type,x,y){
  const id='n'+neuronId++;const labels={input:'IN',hidden:'H',output:'OUT'};
  const el=document.createElement('div');el.className='placed-neuron '+type+'-type';el.textContent=labels[type];
  el.style.left=x+'px';el.style.top=y+'px';el.dataset.id=id;el.dataset.type=type;area.appendChild(el);
  neurons.push({id,type,el,x:x+24,y:y+24});
  let dragging=false,ox,oy;
  el.addEventListener('mousedown',e=>{if(connectMode){handleConnect(id);return}dragging=true;ox=e.offsetX;oy=e.offsetY;el.style.zIndex=10});
  document.addEventListener('mousemove',e=>{if(!dragging)return;const rect=area.getBoundingClientRect();const nx=e.clientX-rect.left-ox;const ny=e.clientY-rect.top-oy;el.style.left=nx+'px';el.style.top=ny+'px';const n=neurons.find(n=>n.id===id);if(n){n.x=nx+24;n.y=ny+24}drawConnections()});
  document.addEventListener('mouseup',()=>{if(dragging)dragging=false});
  updateStatus();checkChallenge();
}

window.toggleConnect=function(){connectMode=!connectMode;const btn=document.getElementById('connectBtn');btn.classList.toggle('active',connectMode);btn.textContent=connectMode?'🔗 Click two neurons':'🔗 Connect Mode';connectFrom=null;document.getElementById('statusBar').innerHTML=connectMode?'Click a <span>source neuron</span>, then click a <span>target neuron</span>':'Drag neurons from the palette → drop into the canvas'};

function handleConnect(id){if(!connectFrom){connectFrom=id;neurons.find(n=>n.id===id).el.style.boxShadow='0 0 20px rgba(192,132,252,.5)';document.getElementById('statusBar').innerHTML='Now click the <span>target neuron</span>'}else if(connectFrom!==id){connections.push({from:connectFrom,to:id});neurons.find(n=>n.id===connectFrom).el.style.boxShadow='';connectFrom=null;drawConnections();checkChallenge();document.getElementById('statusBar').innerHTML='Connected! Click another <span>source neuron</span> or toggle off'}}

function drawConnections(){resizeCanvasRaw();connCtx.clearRect(0,0,connCanvas.width,connCanvas.height);connections.forEach(c=>{const from=neurons.find(n=>n.id===c.from);const to=neurons.find(n=>n.id===c.to);if(!from||!to)return;connCtx.beginPath();connCtx.moveTo(from.x,from.y);connCtx.lineTo(to.x,to.y);connCtx.strokeStyle=c.pulse?'rgba(34,197,94,.8)':'rgba(255,255,255,.12)';connCtx.lineWidth=c.pulse?3:1.5;connCtx.stroke();if(c.pulse&&c.pulsePos!==undefined){const px=from.x+(to.x-from.x)*c.pulsePos;const py=from.y+(to.y-from.y)*c.pulsePos;connCtx.beginPath();connCtx.arc(px,py,5,0,Math.PI*2);connCtx.fillStyle='#22c55e';connCtx.fill()}})}

function resizeCanvasRaw(){const r=area.getBoundingClientRect();const dpr=window.devicePixelRatio||1;if(connCanvas.width!==r.width*dpr){connCanvas.width=r.width*dpr;connCanvas.height=r.height*dpr;connCanvas.style.width=r.width+'px';connCanvas.style.height=r.height+'px';connCtx.setTransform(dpr,0,0,dpr,0,0)}}

window.trainNetwork=function(){if(connections.length===0){document.getElementById('statusBar').innerHTML='<span style="color:#ef4444">Connect some neurons first!</span>';return}trained=true;document.getElementById('statusBar').innerHTML='<span style="color:#22c55e">⚡ Training... watch the data flow!</span>';let frame=0;connections.forEach(c=>{c.pulse=true;c.pulsePos=0});function animatePulse(){frame++;let running=false;connections.forEach((c,i)=>{c.pulsePos=(frame-i*10)/80;if(c.pulsePos<0)c.pulsePos=0;if(c.pulsePos>1){c.pulsePos=1;c.pulse=false}else{running=true}});drawConnections();if(running)requestAnimationFrame(animatePulse);else{connections.forEach(c=>{c.pulse=false;c.pulsePos=undefined});drawConnections();neurons.filter(n=>n.type==='output').forEach(n=>{n.el.classList.add('pulsing');setTimeout(()=>n.el.classList.remove('pulsing'),600)});document.getElementById('statusBar').innerHTML='<span style="color:#22c55e">✓ Training complete!</span>';checkChallenge()}}animatePulse()};

window.clearNetwork=function(){neurons.forEach(n=>n.el.remove());neurons=[];connections=[];connectFrom=null;trained=false;drawConnections();updateStatus();checkChallenge()};

function updateStatus(){if(!connectMode)document.getElementById('statusBar').innerHTML='<span>'+neurons.length+'</span> neurons · <span>'+connections.length+'</span> connections'}

function checkChallenge(){const inp=neurons.filter(n=>n.type==='input').length;const hid=neurons.filter(n=>n.type==='hidden').length;const out=neurons.filter(n=>n.type==='output').length;const hasConn=connections.length>=(inp+hid);document.getElementById('check1').classList.toggle('done',inp>=2);document.getElementById('check2').classList.toggle('done',hid>=2);document.getElementById('check3').classList.toggle('done',out>=2);document.getElementById('check4').classList.toggle('done',hasConn);document.getElementById('check5').classList.toggle('done',trained)}
}
</script>