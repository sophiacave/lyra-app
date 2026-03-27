---
title: "What Is a Neuron?"
course: "ai-foundations"
order: 1
type: "lesson"
free: true
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>
  <a href="index.html" class="nav-link">&larr; Back to Course</a>
</nav>
<div class="container">
  <div class="lesson-header">
    <div class="meta">
      <span class="type-badge">Interactive</span>
      <span class="xp-badge">+50 XP</span>
      <span class="time-badge">~15 min</span>
    </div>
    <h1>What Is a Neuron</h1>
    <p>Your brain has 86 billion neurons. Each one does something embarrassingly simple: it adds up signals and decides whether to fire or stay quiet. AI neurons do the exact same thing — and that simplicity is why they're so powerful.</p>
  </div>

  <div style="background:rgba(192,132,252,.06);border:1px solid rgba(192,132,252,.12);border-radius:12px;padding:1.25rem;margin-bottom:1.5rem;font-size:.9rem;color:#a1a1aa;line-height:1.7">
    <strong style="color:#e5e5e5">Think of it like a voting booth.</strong> Three friends each send you a signal — maybe weak, maybe strong. You multiply each signal by how much you trust that friend (that's the <strong style="color:#c084fc">weight</strong>). You add up all the votes, plus a little nudge called the <strong style="color:#c084fc">bias</strong> (your default mood). Then you decide: do I fire, or stay quiet? That decision is the <strong style="color:#c084fc">activation function</strong>. Move the sliders below and watch the vote count change in real time.
  </div>

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
      <p style="font-size:.75rem;color:#71717a;margin-top:.5rem;line-height:1.4">The bias shifts the activation threshold. Without it, the neuron can only learn functions that pass through the origin.</p>
    </div>
  </div>

  <div class="math-display">
    <span class="label">Live Computation</span>
    <div id="mathLine1"></div>
    <div id="mathLine2"></div>
    <div id="mathLine3"></div>
  </div>

  <div class="concepts">
    <div class="concept" onclick="this.classList.toggle('active')">
      <h3>Weights</h3>
      <p>Multipliers that control how much each input matters.</p>
      <div class="detail">A large positive weight means that input strongly pushes the output up. A negative weight means that input pushes the output down. Training a neural network means finding the right weights.</div>
    </div>
    <div class="concept" onclick="this.classList.toggle('active')">
      <h3>Bias</h3>
      <p>An offset that shifts when the neuron activates.</p>
      <div class="detail">Without bias, a neuron with all-zero inputs always outputs zero (or the activation of zero). Bias lets the neuron fire even when inputs are zero, and shifts the decision boundary. Every neuron in a real network has its own bias term.</div>
    </div>
    <div class="concept" onclick="this.classList.toggle('active')">
      <h3>Activation Functions</h3>
      <p>Non-linear transforms that give networks their power.</p>
      <div class="detail"><strong>Step</strong> (Perceptron, 1957): outputs 0 or 1. Can't learn gradually -- no useful gradient.<br><strong>ReLU</strong> (Rectified Linear Unit): max(0, z). Dead simple, trains fast, used in most modern networks.<br><strong>Sigmoid</strong>: 1/(1+e^-z). Squashes output to (0,1) -- used for probabilities, like the final layer of a binary classifier.</div>
    </div>
    <div class="concept" onclick="this.classList.toggle('active')">
      <h3>Forward Pass</h3>
      <p>The computation flowing left-to-right through the neuron.</p>
      <div class="detail">Multiply each input by its weight, sum them, add bias, apply activation. That's one forward pass through one neuron. A full network does this across thousands of neurons in sequence -- layer by layer.</div>
    </div>
  </div>

  <div class="narration">
    <strong>This is the real building block of AI.</strong> Every neural network -- from image classifiers to large language models -- is made of neurons that compute exactly this: weighted sum + bias, passed through an activation function. Stack thousands of these together and you get intelligence.
  </div>

  <button class="complete-btn" id="completeBtn" onclick="completeLesson()">Complete &amp; Continue &rarr;</button>
</div>
<div class="footer-progress"><span id="footerProgress">0 of 9</span> lessons complete</div>

<script>
// === STATE ===
let activationFn = 'step';
const canvas = document.getElementById('neuronCanvas');
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
    case 'sigmoid': return 'sigmoid(' + z.toFixed(3) + ') = 1/(1+e^(' + (-z).toFixed(3) + ')) = ' + (1/(1+Math.exp(-z))).toFixed(4);
  }
}

// === ACTIVATION TOGGLE ===
document.querySelectorAll('.activation-toggle button').forEach(function(btn) {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.activation-toggle button').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    activationFn = btn.dataset.fn;
    update();
  });
});

// === SLIDERS ===
['x1','x2','x3','w1','w2','w3','bias'].forEach(function(id) {
  document.getElementById(id).addEventListener('input', update);
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

  var weighted = w1*x1 + w2*x2 + w3*x3;
  var z = weighted + bias;
  var out = activation(z);

  document.getElementById('mathLine1').innerHTML =
    '<span class="formula">z = (' + w1.toFixed(2) + ' * ' + x1.toFixed(2) + ') + (' + w2.toFixed(2) + ' * ' + x2.toFixed(2) + ') + (' + w3.toFixed(2) + ' * ' + x3.toFixed(2) + ') + ' + bias.toFixed(2) + '</span>';
  document.getElementById('mathLine2').innerHTML =
    '<span class="formula">z = ' + (w1*x1).toFixed(3) + ' + ' + (w2*x2).toFixed(3) + ' + ' + (w3*x3).toFixed(3) + ' + ' + bias.toFixed(2) + ' = <span class="result">' + z.toFixed(3) + '</span></span>';
  document.getElementById('mathLine3').innerHTML =
    '<span class="formula">output = ' + activationLabel(z) + ' = <span class="result">' + out.toFixed(4) + '</span></span>';

  drawNeuron(x1,x2,x3,w1,w2,w3,bias,z,out);
}

// === CANVAS ===
function resizeCanvas() {
  dpr = window.devicePixelRatio || 1;
  var rect = canvas.getBoundingClientRect();
  W = rect.width;
  H = 420;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.height = H + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function drawNeuron(x1,x2,x3,w1,w2,w3,bias,z,out) {
  ctx.clearRect(0,0,W,H);

  var inputX = W * 0.12;
  var biasX = W * 0.30;
  var sumX = W * 0.50;
  var actX = W * 0.68;
  var outX = W * 0.88;
  var inputYs = [H*0.18, H*0.42, H*0.66];
  var biasY = H * 0.88;
  var centerY = H * 0.42;

  var inputs = [x1,x2,x3];
  var weights = [w1,w2,w3];
  var labels = ['x1','x2','x3'];

  // Connections: inputs to sum
  for (var i = 0; i < 3; i++) {
    var strength = Math.abs(weights[i]) / 2;
    var alpha = 0.2 + strength * 0.6;
    var lw = 1 + strength * 3;
    ctx.strokeStyle = weights[i] >= 0 ? 'rgba(192,132,252,' + alpha + ')' : 'rgba(251,146,60,' + alpha + ')';
    ctx.lineWidth = lw;
    ctx.beginPath();
    ctx.moveTo(inputX + 28, inputYs[i]);
    ctx.bezierCurveTo(inputX + 80, inputYs[i], sumX - 80, centerY, sumX - 28, centerY);
    ctx.stroke();

    // Weight label
    var mx = (inputX + sumX) / 2;
    var my = (inputYs[i] + centerY) / 2;
    ctx.fillStyle = weights[i] >= 0 ? '#c084fc' : '#fb923c';
    ctx.font = '600 11px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('w' + (i+1) + '=' + weights[i].toFixed(1), mx, my - 8);
  }

  // Bias connection
  ctx.strokeStyle = 'rgba(56,189,248,0.5)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(biasX, biasY - 20);
  ctx.bezierCurveTo(biasX, centerY + 60, sumX - 40, centerY + 40, sumX - 28, centerY + 4);
  ctx.stroke();

  // Sum to activation
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(sumX + 28, centerY);
  ctx.lineTo(actX - 32, centerY);
  ctx.stroke();

  // Activation to output
  var outStrength = Math.min(Math.abs(out), 1);
  ctx.strokeStyle = 'rgba(52,211,153,' + (0.3 + outStrength * 0.5) + ')';
  ctx.lineWidth = 2 + outStrength * 3;
  ctx.beginPath();
  ctx.moveTo(actX + 32, centerY);
  ctx.lineTo(outX - 28, centerY);
  ctx.stroke();

  // Input nodes
  for (var j = 0; j < 3; j++) {
    drawNode(inputX, inputYs[j], 22, 'rgba(192,132,252,' + (0.15 + Math.abs(inputs[j])*0.3) + ')', '#c084fc');
    ctx.fillStyle = '#e5e5e5';
    ctx.font = '700 13px Inter';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(labels[j], inputX, inputYs[j] - 1);
    ctx.fillStyle = '#a1a1aa';
    ctx.font = '600 10px Inter';
    ctx.fillText(inputs[j].toFixed(2), inputX, inputYs[j] + 14);
  }

  // Bias node (always 1, shifted by bias value)
  drawNode(biasX, biasY, 18, 'rgba(56,189,248,0.15)', '#38bdf8');
  ctx.fillStyle = '#38bdf8';
  ctx.font = '700 10px Inter';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('bias', biasX, biasY - 1);
  ctx.fillStyle = '#a1a1aa';
  ctx.font = '600 9px Inter';
  ctx.fillText(bias.toFixed(2), biasX, biasY + 12);

  // Sum node
  drawNode(sumX, centerY, 26, 'rgba(255,255,255,0.06)', '#71717a');
  ctx.fillStyle = '#e5e5e5';
  ctx.font = '700 18px Inter';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('\u03A3', sumX, centerY);
  ctx.fillStyle = '#71717a';
  ctx.font = '600 10px Inter';
  ctx.fillText('z=' + z.toFixed(2), sumX, centerY + 36);

  // Activation node
  var actLabel = activationFn === 'step' ? 'step' : activationFn === 'relu' ? 'ReLU' : '\u03C3';
  drawNode(actX, centerY, 28, 'rgba(251,146,60,0.12)', '#fb923c');
  ctx.fillStyle = '#fb923c';
  ctx.font = '700 12px Inter';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(actLabel, actX, centerY);

  // Output node
  var outColor = out > 0.5 ? '#34d399' : '#71717a';
  drawNode(outX, centerY, 24, 'rgba(52,211,153,' + (0.1 + outStrength*0.2) + ')', outColor);
  ctx.fillStyle = '#e5e5e5';
  ctx.font = '800 14px Inter';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(out.toFixed(3), outX, centerY);
  ctx.fillStyle = '#71717a';
  ctx.font = '600 10px Inter';
  ctx.fillText('output', outX, centerY + 34);

  // Column labels
  ctx.fillStyle = '#52525b';
  ctx.font = '600 10px Inter';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('INPUTS', inputX, 26);
  ctx.fillText('WEIGHTED SUM', sumX, 26);
  ctx.fillText('ACTIVATION', actX, 26);
  ctx.fillText('OUTPUT', outX, 26);
}

function drawNode(x, y, r, fill, stroke) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI*2);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

// === INIT ===
window.addEventListener('resize', function() { resizeCanvas(); update(); });
resizeCanvas();
update();

// === PROGRESS ===
function getProgress(){try{return JSON.parse(localStorage.getItem('ai-foundations-progress'))||{}}catch(e){return{}}}
function updateFooter(){
  var p=getProgress();var c=Object.keys(p).filter(function(k){return p[k]}).length;
  document.getElementById('footerProgress').textContent=c+' of 9';
  if(p['what-is-a-neuron']){document.getElementById('completeBtn').textContent='Completed';document.getElementById('completeBtn').classList.add('done')}
}
function completeLesson(){
  var p=getProgress();p['what-is-a-neuron']=true;localStorage.setItem('ai-foundations-progress',JSON.stringify(p));
  LO_NAV.goNext();
}
updateFooter();
</script>
