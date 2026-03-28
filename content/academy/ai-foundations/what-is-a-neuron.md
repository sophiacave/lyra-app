---
title: "What Is a Neuron?"
course: "ai-foundations"
order: 1
type: "lesson"
free: true
---<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-foundations/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 1 of 9</span>
</nav>

<div class="lesson-hero">
  <h1>What Is a <span class="accent">Neuron?</span></h1>
  <p class="sub">Your brain has 86 billion neurons. Each one does something embarrassingly simple. AI neurons do the exact same thing — and that simplicity is why they're so powerful.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>What a neuron computes: weighted sum + bias + activation</li>
    <li>What weights, biases, and activation functions do</li>
    <li>Why stacking simple neurons creates intelligence</li>
    <li>The difference between Step, ReLU, and Sigmoid activations</li>
  </ul>
</div>

<!-- SECTION 1: THE ANALOGY -->
<div class="lesson-section">
  <span class="section-label">The Concept</span>
  <h2 class="section-title">A voting booth in your brain.</h2>
  <p class="section-text">Think of it like a voting booth. Three friends each send you a signal — maybe weak, maybe strong. You multiply each signal by how much you trust that friend (that's the <strong>weight</strong>). You add up all the votes, plus a little nudge called the <strong>bias</strong> (your default mood). Then you decide: do I fire, or stay quiet? That decision is the <strong>activation function</strong>.</p>
  <p class="section-text">That's it. That's the entire computation a neuron does. And AI is made of millions of these.</p>
</div>

<!-- SECTION 2: INTERACTIVE NEURON SIMULATOR -->
<div class="lesson-section">
  <span class="section-label">Play With It</span>
  <h2 class="section-title">Live neuron — move the sliders and watch.</h2>

  <div style="background:rgba(251,146,60,.06);border:1px solid rgba(251,146,60,.12);border-radius:10px;padding:.75rem 1rem;margin-bottom:1rem;font-size:.85rem;color:#fb923c;font-weight:600">
    Try this: Set w1 to a large positive number and w2 to a large negative number. Watch how they compete. What happens to the output?
  </div>

  <canvas id="neuronCanvas" height="420"></canvas>

  <div class="activation-toggle">
    <span>Activation Function:</span>
    <button class="active" data-fn="step">Step (Historical)</button>
    <button data-fn="relu">ReLU (Modern Standard)</button>
    <button data-fn="sigmoid">Sigmoid (Probabilities)</button>
  </div>

  <div class="controls">
    <div class="control-group">
      <label>Input x1</label>
      <div class="slider-row"><input type="range" id="x1" min="-100" max="100" value="50"><span class="slider-val" id="x1v">0.50</span></div>
      <label style="margin-top:.75rem">Weight w1</label>
      <div class="slider-row"><input type="range" id="w1" min="-200" max="200" value="80"><span class="slider-val" id="w1v">0.80</span></div>
    </div>
    <div class="control-group">
      <label>Input x2</label>
      <div class="slider-row"><input type="range" id="x2" min="-100" max="100" value="30"><span class="slider-val" id="x2v">0.30</span></div>
      <label style="margin-top:.75rem">Weight w2</label>
      <div class="slider-row"><input type="range" id="w2" min="-200" max="200" value="-40"><span class="slider-val" id="w2v">-0.40</span></div>
    </div>
    <div class="control-group">
      <label>Input x3</label>
      <div class="slider-row"><input type="range" id="x3" min="-100" max="100" value="70"><span class="slider-val" id="x3v">0.70</span></div>
      <label style="margin-top:.75rem">Weight w3</label>
      <div class="slider-row"><input type="range" id="w3" min="-200" max="200" value="60"><span class="slider-val" id="w3v">0.60</span></div>
    </div>
    <div class="control-group">
      <label>Bias</label>
      <div class="slider-row"><input type="range" id="bias" min="-200" max="200" value="10"><span class="slider-val" id="biasv">0.10</span></div>
      <p style="font-size:.75rem;color:#71717a;margin-top:.5rem;line-height:1.4">The bias shifts the activation threshold.</p>
    </div>
  </div>

  <div class="math-display">
    <span class="label">Live Computation</span>
    <div id="mathLine1"></div>
    <div id="mathLine2"></div>
    <div id="mathLine3"></div>
  </div>
</div>

<!-- SECTION 3: CORE CONCEPTS -->
<div class="lesson-section">
  <span class="section-label">Key Concepts</span>
  <h2 class="section-title">The building blocks of every neuron.</h2>

<div data-learn="MatchConnect" data-props='{"title":"Match Each Concept to Its Role","instruction":"Tap a concept on the left, then what it does on the right","pairs":[{"left":"Weights","right":"Multipliers that control how much each input matters"},{"left":"Bias","right":"An offset that shifts when the neuron fires"},{"left":"Activation Function","right":"Non-linear transform that decides if the neuron fires"},{"left":"Forward Pass","right":"The computation flowing left-to-right through the neuron"}]}'></div>

</div>

<!-- SECTION 4: ACTIVATION FUNCTIONS -->
<div class="lesson-section">
  <span class="section-label">Deep Dive</span>
  <h2 class="section-title">Three activation functions you need to know.</h2>

<div data-learn="FlashDeck" data-props='{"title":"Activation Functions — Flip for Details","cards":[{"front":"📐 STEP FUNCTION (1957)\n\nThe original. Outputs 0 or 1.\nUsed in the first Perceptron.","back":"HOW IT WORKS: If the weighted sum is >= 0, output 1. Otherwise, output 0.\n\nPROBLEM: No gradient — the network cannot learn gradually. It is either on or off. Like a light switch with no dimmer.\n\nUSED TODAY: Almost never. Historical importance only."},{"front":"⚡ ReLU (Modern Standard)\n\nRectified Linear Unit.\nThe workhorse of modern AI.","back":"HOW IT WORKS: max(0, z). If positive, pass it through. If negative, output 0.\n\nWHY IT WORKS: Dead simple, trains extremely fast, and avoids the vanishing gradient problem that killed earlier activations.\n\nUSED TODAY: Almost everywhere — image classifiers, language models, recommendation systems."},{"front":"🎯 SIGMOID (Probabilities)\n\nSquashes output to between 0 and 1.\nPerfect for yes/no decisions.","back":"HOW IT WORKS: 1/(1+e^-z). Smoothly maps any number to the range (0, 1).\n\nWHY IT WORKS: The output can be interpreted as a probability. Is this email spam? 0.92 = 92% likely spam.\n\nUSED TODAY: Final layer of binary classifiers. Replaced by ReLU in hidden layers."}]}'></div>

</div>

<!-- SECTION 5: KNOWLEDGE CHECK -->
<div class="lesson-section">
  <span class="section-label">Knowledge Check</span>
  <h2 class="section-title">Test your understanding.</h2>

<div data-learn="QuizMC" data-props='{"title":"Neuron Mastery","questions":[{"q":"What does a weight in a neural network control?","options":["The physical size of a neuron","How much influence an input has on the output","The number of connections in the network","The speed at which data flows"],"correct":1,"explanation":"Weights determine how much each input contributes to the neuron output. Higher weights mean more influence. Training a neural network means finding the right weights."},{"q":"Why are activation functions necessary?","options":["They make the network run faster","They add non-linearity so the network can learn complex patterns","They reduce the number of neurons needed","They store the training data"],"correct":1,"explanation":"Without activation functions, a neural network is just a linear equation — no matter how many layers you stack. Non-linearity is what allows networks to learn curves, edges, language, and everything else."},{"q":"Which activation function is used in most modern neural networks?","options":["Step function","Sigmoid","ReLU","Logarithm"],"correct":2,"explanation":"ReLU (Rectified Linear Unit) is the standard. It is simple (max(0, z)), trains fast, and avoids the vanishing gradient problem that plagued older activations like sigmoid in hidden layers."}]}'></div>

  <div class="narration" style="margin-top:1.5rem">
    <strong>This is the real building block of AI.</strong> Every neural network — from image classifiers to large language models — is made of neurons that compute exactly this: weighted sum + bias, passed through an activation function. Stack thousands of these together and you get intelligence.
  </div>
</div>

<!-- NEXT LESSON -->
<div class="lesson-section" style="text-align:center;padding:2rem 0">
  <a href="/academy/ai-foundations/build-a-network" style="display:inline-block;background:var(--orange);color:var(--bg);font-weight:700;padding:.75rem 2rem;border-radius:10px;text-decoration:none;font-size:.95rem">Next: Build a Network →</a>
</div>

</div>

<script>
let activationFn = 'step';
const canvas = document.getElementById('neuronCanvas');
if (canvas) {
const ctx = canvas.getContext('2d');
let W, H, dpr;

function getVal(id) { return document.getElementById(id).value / 100; }

function activation(z) {
  switch(activationFn) {
    case 'step': return z >= 0 ? 1 : 0;
    case 'relu': return Math.max(0, z);
    case 'sigmoid': return 1 / (1 + Math.exp(-z));
  }
}

function activationLabel(z) {
  switch(activationFn) {
    case 'step': return 'step(' + z.toFixed(3) + ') = ' + (z >= 0 ? '1' : '0');
    case 'relu': return 'ReLU(' + z.toFixed(3) + ') = max(0, ' + z.toFixed(3) + ') = ' + Math.max(0,z).toFixed(3);
    case 'sigmoid': return 'sigmoid(' + z.toFixed(3) + ') = ' + (1/(1+Math.exp(-z))).toFixed(4);
  }
}

document.querySelectorAll('.activation-toggle button').forEach(function(btn) {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.activation-toggle button').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    activationFn = btn.dataset.fn;
    update();
  });
});

['x1','x2','x3','w1','w2','w3','bias'].forEach(function(id) {
  var el = document.getElementById(id);
  if (el) el.addEventListener('input', update);
});

function update() {
  var x1=getVal('x1'), x2=getVal('x2'), x3=getVal('x3');
  var w1=getVal('w1')*2, w2=getVal('w2')*2, w3=getVal('w3')*2;
  var bias=getVal('bias')*2;
  document.getElementById('x1v').textContent = x1.toFixed(2);
  document.getElementById('x2v').textContent = x2.toFixed(2);
  document.getElementById('x3v').textContent = x3.toFixed(2);
  document.getElementById('w1v').textContent = w1.toFixed(2);
  document.getElementById('w2v').textContent = w2.toFixed(2);
  document.getElementById('w3v').textContent = w3.toFixed(2);
  document.getElementById('biasv').textContent = bias.toFixed(2);
  var z = w1*x1 + w2*x2 + w3*x3 + bias;
  var out = activation(z);
  var ml1 = document.getElementById('mathLine1');
  var ml2 = document.getElementById('mathLine2');
  var ml3 = document.getElementById('mathLine3');
  if (ml1) ml1.innerHTML = '<span class="formula">z = (' + w1.toFixed(2) + ' × ' + x1.toFixed(2) + ') + (' + w2.toFixed(2) + ' × ' + x2.toFixed(2) + ') + (' + w3.toFixed(2) + ' × ' + x3.toFixed(2) + ') + ' + bias.toFixed(2) + '</span>';
  if (ml2) ml2.innerHTML = '<span class="formula">z = ' + (w1*x1).toFixed(3) + ' + ' + (w2*x2).toFixed(3) + ' + ' + (w3*x3).toFixed(3) + ' + ' + bias.toFixed(2) + ' = <span class="result">' + z.toFixed(3) + '</span></span>';
  if (ml3) ml3.innerHTML = '<span class="formula">output = ' + activationLabel(z) + ' = <span class="result">' + out.toFixed(4) + '</span></span>';
  drawNeuron(x1,x2,x3,w1,w2,w3,bias,z,out);
}

function resizeCanvas() {
  dpr = window.devicePixelRatio || 1;
  var rect = canvas.getBoundingClientRect();
  W = rect.width; H = 420;
  canvas.width = W * dpr; canvas.height = H * dpr;
  canvas.style.height = H + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function drawNode(x, y, r, fill, stroke) {
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2);
  ctx.fillStyle = fill; ctx.fill();
  ctx.strokeStyle = stroke; ctx.lineWidth = 1.5; ctx.stroke();
}

function drawNeuron(x1,x2,x3,w1,w2,w3,bias,z,out) {
  ctx.clearRect(0,0,W,H);
  var inputX=W*0.12, sumX=W*0.50, actX=W*0.68, outX=W*0.88;
  var inputYs=[H*0.18,H*0.42,H*0.66], biasY=H*0.88, centerY=H*0.42;
  var inputs=[x1,x2,x3], weights=[w1,w2,w3], labels=['x1','x2','x3'];
  for(var i=0;i<3;i++){
    var s=Math.abs(weights[i])/2, a=0.2+s*0.6, lw=1+s*3;
    ctx.strokeStyle=weights[i]>=0?'rgba(192,132,252,'+a+')':'rgba(251,146,60,'+a+')';
    ctx.lineWidth=lw; ctx.beginPath();
    ctx.moveTo(inputX+28,inputYs[i]);
    ctx.bezierCurveTo(inputX+80,inputYs[i],sumX-80,centerY,sumX-28,centerY);
    ctx.stroke();
    var mx=(inputX+sumX)/2, my=(inputYs[i]+centerY)/2;
    ctx.fillStyle=weights[i]>=0?'#c084fc':'#fb923c';
    ctx.font='600 11px Inter'; ctx.textAlign='center';
    ctx.fillText('w'+(i+1)+'='+weights[i].toFixed(1),mx,my-8);
  }
  ctx.strokeStyle='rgba(56,189,248,0.5)'; ctx.lineWidth=2; ctx.beginPath();
  ctx.moveTo(W*0.30,biasY-20);
  ctx.bezierCurveTo(W*0.30,centerY+60,sumX-40,centerY+40,sumX-28,centerY+4);
  ctx.stroke();
  ctx.strokeStyle='rgba(255,255,255,0.15)'; ctx.lineWidth=2; ctx.beginPath();
  ctx.moveTo(sumX+28,centerY); ctx.lineTo(actX-32,centerY); ctx.stroke();
  var os=Math.min(Math.abs(out),1);
  ctx.strokeStyle='rgba(52,211,153,'+(0.3+os*0.5)+')'; ctx.lineWidth=2+os*3;
  ctx.beginPath(); ctx.moveTo(actX+32,centerY); ctx.lineTo(outX-28,centerY); ctx.stroke();
  for(var j=0;j<3;j++){
    drawNode(inputX,inputYs[j],22,'rgba(192,132,252,'+(0.15+Math.abs(inputs[j])*0.3)+')','#c084fc');
    ctx.fillStyle='#e5e5e5'; ctx.font='700 13px Inter'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(labels[j],inputX,inputYs[j]-1);
    ctx.fillStyle='#a1a1aa'; ctx.font='600 10px Inter';
    ctx.fillText(inputs[j].toFixed(2),inputX,inputYs[j]+14);
  }
  drawNode(W*0.30,biasY,18,'rgba(56,189,248,0.15)','#38bdf8');
  ctx.fillStyle='#38bdf8'; ctx.font='700 10px Inter'; ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText('bias',W*0.30,biasY-1);
  ctx.fillStyle='#a1a1aa'; ctx.font='600 9px Inter'; ctx.fillText(bias.toFixed(2),W*0.30,biasY+12);
  drawNode(sumX,centerY,26,'rgba(255,255,255,0.06)','#71717a');
  ctx.fillStyle='#e5e5e5'; ctx.font='700 18px Inter'; ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText('\u03A3',sumX,centerY);
  ctx.fillStyle='#71717a'; ctx.font='600 10px Inter'; ctx.fillText('z='+z.toFixed(2),sumX,centerY+36);
  var actLabel=activationFn==='step'?'step':activationFn==='relu'?'ReLU':'\u03C3';
  drawNode(actX,centerY,28,'rgba(251,146,60,0.12)','#fb923c');
  ctx.fillStyle='#fb923c'; ctx.font='700 12px Inter'; ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText(actLabel,actX,centerY);
  var outColor=out>0.5?'#34d399':'#71717a';
  drawNode(outX,centerY,24,'rgba(52,211,153,'+(0.1+os*0.2)+')',''+outColor);
  ctx.fillStyle='#e5e5e5'; ctx.font='800 14px Inter'; ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText(out.toFixed(3),outX,centerY);
  ctx.fillStyle='#71717a'; ctx.font='600 10px Inter'; ctx.fillText('output',outX,centerY+34);
  ctx.fillStyle='#52525b'; ctx.font='600 10px Inter'; ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText('INPUTS',inputX,26); ctx.fillText('WEIGHTED SUM',sumX,26);
  ctx.fillText('ACTIVATION',actX,26); ctx.fillText('OUTPUT',outX,26);
}

window.addEventListener('resize', function() { resizeCanvas(); update(); });
resizeCanvas(); update();
}
</script>