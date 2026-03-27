---
title: "Embedding Explorer"
course: "ai-foundations"
order: 8
type: "lab"
free: false
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>
  
</nav>
<div class="container">
  <div class="lesson-header">
    <div class="meta">
      <span class="type-badge">Interactive</span>
      <span class="xp-badge">+50 XP</span>
      <span class="time-badge">~15 min</span>
    </div>
    <h1>Embedding Explorer</h1>
    <p>Words as vectors. Click any word to see its coordinates. Click two words to compute real cosine similarity and see the angle between them.</p>
  </div>

  <p class="hint">Click one word to see its vector. Click a second word to compare them with cosine similarity. The angle between the vectors IS the similarity.</p>

  <canvas id="embedCanvas" height="480"></canvas>

  <div class="info-panel">
    <div class="info-box" id="vecA">
      <h4>Word A</h4>
      <div class="vec" id="vecAtext">Click a word...</div>
    </div>
    <div class="info-box" id="vecB">
      <h4>Word B</h4>
      <div class="vec" id="vecBtext">Click a second word...</div>
    </div>
  </div>

  <div class="formula-display" id="formulaBox" style="display:none">
    <span class="label">Cosine Similarity</span>
    </div>

  <div class="analogy-section">
    <h3>Vector Analogy Calculator</h3>
    <p style="font-size:.8rem;color:#a1a1aa;margin-bottom:1rem;line-height:1.5">Real word embeddings encode relationships as vector offsets. The classic example: king - man + woman = queen. Try it below with our 2D embeddings.</p>
    <div class="analogy-row">
      <select id="anaA"></select>
      <span>&minus;</span>
      <select id="anaB"></select>
      <span>+</span>
      <select id="anaC"></select>
      <span>=</span>
      <span id="anaResult" style="color:#34d399;font-weight:700">?</span>
    </div>
    </div>

  <div class="narration">
    <strong>Embeddings turn language into geometry.</strong> Words that mean similar things point in similar directions. Cosine similarity measures this by computing the cosine of the angle between two vectors -- 1.0 means identical direction, 0 means unrelated, -1.0 means opposite. Real embeddings use 768+ dimensions, but the math is identical to what you see here in 2D.
  </div>

  <button class="complete-btn" id="completeBtn" onclick="completeLesson()">Complete &amp; Continue &rarr;</button>
</div>
<div class="footer-progress"><span id="footerProgress">0 of 9</span> lessons complete</div>

<script>
// === WORD EMBEDDINGS (2D, semantically clustered) ===
var words = {
  // Royalty cluster
  king:     { x: 3.8, y: 3.5, color: '#c084fc' },
  queen:    { x: 3.2, y: 4.2, color: '#c084fc' },
  prince:   { x: 4.2, y: 3.0, color: '#c084fc' },
  princess: { x: 3.6, y: 3.8, color: '#c084fc' },
  // Gender cluster
  man:      { x: 1.5, y: 1.2, color: '#fb923c' },
  woman:    { x: 0.9, y: 1.9, color: '#fb923c' },
  boy:      { x: 1.9, y: 0.7, color: '#fb923c' },
  girl:     { x: 1.3, y: 1.4, color: '#fb923c' },
  // Animals
  cat:      { x:-2.0, y: 1.5, color: '#34d399' },
  dog:      { x:-1.5, y: 1.0, color: '#34d399' },
  puppy:    { x:-1.2, y: 0.6, color: '#34d399' },
  kitten:   { x:-1.7, y: 1.8, color: '#34d399' },
  // Food
  apple:    { x:-1.0, y:-2.5, color: '#f472b6' },
  banana:   { x:-0.5, y:-2.8, color: '#f472b6' },
  pizza:    { x: 0.8, y:-2.2, color: '#f472b6' },
  sushi:    { x: 1.2, y:-2.6, color: '#f472b6' },
  // Tech
  computer: { x: 3.0, y:-1.5, color: '#38bdf8' },
  robot:    { x: 3.5, y:-0.8, color: '#38bdf8' },
  code:     { x: 2.5, y:-1.8, color: '#38bdf8' },
  AI:       { x: 3.2, y:-1.0, color: '#38bdf8' }
};

var wordList = Object.keys(words);
var canvas = document.getElementById('embedCanvas');
var ctx = canvas.getContext('2d');
var W, H, dpr;
var selectedA = null, selectedB = null;

var RANGE = 5.5;
function toScreen(vx, vy) {
  var pad = 50;
  return {
    sx: pad + ((vx + RANGE) / (2*RANGE)) * (W - 2*pad),
    sy: (H - pad) - ((vy + RANGE) / (2*RANGE)) * (H - 2*pad)
  };
}

function resizeCanvas() {
  dpr = window.devicePixelRatio || 1;
  var rect = canvas.getBoundingClientRect();
  W = rect.width; H = 480;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.height = H + 'px';
  ctx.setTransform(dpr,0,0,dpr,0,0);
}

function draw() {
  ctx.clearRect(0,0,W,H);
  var pad = 50;

  // Grid
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth = 1;
  for (var v = -5; v <= 5; v++) {
    var g1 = toScreen(v,0);
    ctx.beginPath(); ctx.moveTo(g1.sx,pad); ctx.lineTo(g1.sx,H-pad); ctx.stroke();
    var g2 = toScreen(0,v);
    ctx.beginPath(); ctx.moveTo(pad,g2.sy); ctx.lineTo(W-pad,g2.sy); ctx.stroke();
  }

  // Axes
  var origin = toScreen(0,0);
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(pad, origin.sy); ctx.lineTo(W-pad, origin.sy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(origin.sx, pad); ctx.lineTo(origin.sx, H-pad); ctx.stroke();

  // If two words selected, draw vectors and angle
  if (selectedA && selectedB) {
    var a = words[selectedA], b = words[selectedB];
    var oS = toScreen(0,0);
    var aS = toScreen(a.x, a.y);
    var bS = toScreen(b.x, b.y);

    drawArrow(oS.sx, oS.sy, aS.sx, aS.sy, 'rgba(192,132,252,0.7)');
    drawArrow(oS.sx, oS.sy, bS.sx, bS.sy, 'rgba(251,146,60,0.7)');

    // Angle arc
    var angleA = Math.atan2(-(aS.sy - oS.sy), aS.sx - oS.sx);
    var angleB = Math.atan2(-(bS.sy - oS.sy), bS.sx - oS.sx);
    var arcR = 40;
    ctx.strokeStyle = 'rgba(52,211,153,0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    var diff = angleB - angleA;
    while (diff > Math.PI) diff -= 2*Math.PI;
    while (diff < -Math.PI) diff += 2*Math.PI;
    ctx.arc(oS.sx, oS.sy, arcR, -angleA, -angleB, diff < 0);
    ctx.stroke();

    // Theta label
    var theta = angleBetween(a, b);
    var midAngle = (angleA + angleB) / 2;
    var lx = oS.sx + Math.cos(-midAngle) * (arcR + 14);
    var ly = oS.sy + Math.sin(-midAngle) * (arcR + 14);
    ctx.fillStyle = '#34d399';
    ctx.font = '700 12px Inter';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('\u03B8=' + (theta * 180 / Math.PI).toFixed(1) + '\u00B0', lx, ly);
  } else if (selectedA) {
    var sa = words[selectedA];
    var oSa = toScreen(0,0);
    var aSa = toScreen(sa.x, sa.y);
    drawArrow(oSa.sx, oSa.sy, aSa.sx, aSa.sy, 'rgba(192,132,252,0.7)');
  }

  // Word dots
  var names = Object.keys(words);
  for (var i = 0; i < names.length; i++) {
    var name = names[i];
    var w = words[name];
    var pos = toScreen(w.x, w.y);
    var isSelected = (name === selectedA || name === selectedB);
    var r = isSelected ? 7 : 5;

    ctx.beginPath();
    ctx.arc(pos.sx, pos.sy, r, 0, Math.PI*2);
    ctx.fillStyle = isSelected ? '#fff' : w.color;
    ctx.fill();
    if (isSelected) {
      ctx.strokeStyle = w.color;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.fillStyle = isSelected ? '#fff' : w.color;
    ctx.font = (isSelected ? '700' : '600') + ' ' + (isSelected ? '12' : '11') + 'px Inter';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(name, pos.sx, pos.sy - r - 3);
  }
}

function drawArrow(x1,y1,x2,y2,color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x1,y1);
  ctx.lineTo(x2,y2);
  ctx.stroke();
  var angle = Math.atan2(y2-y1, x2-x1);
  var hl = 10;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - hl*Math.cos(angle-0.4), y2 - hl*Math.sin(angle-0.4));
  ctx.lineTo(x2 - hl*Math.cos(angle+0.4), y2 - hl*Math.sin(angle+0.4));
  ctx.closePath();
  ctx.fill();
}

function angleBetween(a, b) {
  var dot = a.x*b.x + a.y*b.y;
  var magA = Math.sqrt(a.x*a.x + a.y*a.y);
  var magB = Math.sqrt(b.x*b.x + b.y*b.y);
  if (magA === 0 || magB === 0) return 0;
  return Math.acos(Math.max(-1, Math.min(1, dot / (magA * magB))));
}

function cosineSimilarity(a, b) {
  var dot = a.x*b.x + a.y*b.y;
  var magA = Math.sqrt(a.x*a.x + a.y*a.y);
  var magB = Math.sqrt(b.x*b.x + b.y*b.y);
  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
}

// === CLICK HANDLING ===
canvas.addEventListener('click', function(e) {
  var rect = canvas.getBoundingClientRect();
  var mx = e.clientX - rect.left;
  var my = e.clientY - rect.top;

  var closest = null, closestDist = 25;
  var names = Object.keys(words);
  for (var i = 0; i < names.length; i++) {
    var w = words[names[i]];
    var pos = toScreen(w.x, w.y);
    var d = Math.sqrt((mx-pos.sx)*(mx-pos.sx) + (my-pos.sy)*(my-pos.sy));
    if (d < closestDist) { closest = names[i]; closestDist = d; }
  }

  if (!closest) return;

  if (!selectedA || selectedB) {
    selectedA = closest;
    selectedB = null;
    updateInfo();
  } else if (closest !== selectedA) {
    selectedB = closest;
    updateInfo();
  }
  draw();
});

function updateInfo() {
  if (selectedA) {
    var a = words[selectedA];
    document.getElementById('vecAtext').innerHTML =
      '<strong style="color:#e5e5e5">' + selectedA + '</strong> = [' + a.x.toFixed(2) + ', ' + a.y.toFixed(2) + ']';
  } else {
    document.getElementById('vecAtext').textContent = 'Click a word...';
  }

  if (selectedB) {
    var b = words[selectedB];
    document.getElementById('vecBtext').innerHTML =
      '<strong style="color:#e5e5e5">' + selectedB + '</strong> = [' + b.x.toFixed(2) + ', ' + b.y.toFixed(2) + ']';

    var a2 = words[selectedA];
    var dot = a2.x*b.x + a2.y*b.y;
    var magA = Math.sqrt(a2.x*a2.x + a2.y*a2.y);
    var magB = Math.sqrt(b.x*b.x + b.y*b.y);
    var cos = cosineSimilarity(a2, b);
    var theta = angleBetween(a2, b);

    var box = document.getElementById('formulaBox');
    box.style.display = 'block';
    document.getElementById('formulaContent').innerHTML =
      '<span class="hl">cos(\u03B8) = (A \u00B7 B) / (|A| \u00D7 |B|)</span>\n\n' +
      'A \u00B7 B = (' + a2.x.toFixed(2) + ' \u00D7 ' + b.x.toFixed(2) + ') + (' + a2.y.toFixed(2) + ' \u00D7 ' + b.y.toFixed(2) + ') = <span class="hl">' + dot.toFixed(3) + '</span>\n' +
      '|A| = \u221A(' + a2.x.toFixed(2) + '\u00B2 + ' + a2.y.toFixed(2) + '\u00B2) = <span class="hl">' + magA.toFixed(3) + '</span>\n' +
      '|B| = \u221A(' + b.x.toFixed(2) + '\u00B2 + ' + b.y.toFixed(2) + '\u00B2) = <span class="hl">' + magB.toFixed(3) + '</span>\n\n' +
      '<span class="res">Cosine Similarity = ' + dot.toFixed(3) + ' / (' + magA.toFixed(3) + ' \u00D7 ' + magB.toFixed(3) + ') = ' + cos.toFixed(4) + '</span>\n' +
      '<span class="hl">\u03B8 = ' + (theta * 180 / Math.PI).toFixed(1) + '\u00B0</span>  (smaller angle = more similar)';
  } else {
    document.getElementById('vecBtext').textContent = 'Click a second word...';
    document.getElementById('formulaBox').style.display = 'none';
  }
}

// === ANALOGY CALCULATOR ===
var anaA = document.getElementById('anaA');
var anaB = document.getElementById('anaB');
var anaC = document.getElementById('anaC');

wordList.forEach(function(w) {
  [anaA, anaB, anaC].forEach(function(sel) {
    var opt = document.createElement('option');
    opt.value = w; opt.textContent = w;
    sel.appendChild(opt);
  });
});
anaA.value = 'king'; anaB.value = 'man'; anaC.value = 'woman';

function computeAnalogy() {
  var a = words[anaA.value], b = words[anaB.value], c = words[anaC.value];
  var rx = a.x - b.x + c.x;
  var ry = a.y - b.y + c.y;

  var best = null, bestDist = Infinity;
  var names = Object.keys(words);
  for (var i = 0; i < names.length; i++) {
    var name = names[i];
    if (name === anaA.value || name === anaB.value || name === anaC.value) continue;
    var w = words[name];
    var d = Math.sqrt((w.x - rx)*(w.x - rx) + (w.y - ry)*(w.y - ry));
    if (d < bestDist) { best = name; bestDist = d; }
  }

  document.getElementById('anaResult').textContent = best || '?';
  if (best) {
    document.getElementById('analogyMath').innerHTML =
      '[' + a.x.toFixed(2) + ', ' + a.y.toFixed(2) + '] \u2212 [' + b.x.toFixed(2) + ', ' + b.y.toFixed(2) + '] + [' + c.x.toFixed(2) + ', ' + c.y.toFixed(2) + ']\n' +
      '= [' + rx.toFixed(2) + ', ' + ry.toFixed(2) + ']\n' +
      'Nearest word: <span class="res">' + best + '</span> at [' + words[best].x.toFixed(2) + ', ' + words[best].y.toFixed(2) + '] (distance: ' + bestDist.toFixed(3) + ')';
  }
}

[anaA, anaB, anaC].forEach(function(sel) { sel.addEventListener('change', computeAnalogy); });
computeAnalogy();

// === INIT ===
window.addEventListener('resize', function() { resizeCanvas(); draw(); });
resizeCanvas();
draw();

// === PROGRESS ===
function getProgress(){try{return JSON.parse(localStorage.getItem('ai-foundations-progress'))||{}}catch(e){return{}}}
function updateFooter(){
  var p=getProgress();var c=Object.keys(p).filter(function(k){return p[k]}).length;
  document.getElementById('footerProgress').textContent=c+' of 9';
  if(p['embedding-explorer']){document.getElementById('completeBtn').textContent='Completed';document.getElementById('completeBtn').classList.add('done')}
}
function completeLesson(){
  var p=getProgress();p['embedding-explorer']=true;localStorage.setItem('ai-foundations-progress',JSON.stringify(p));
  LO_NAV.goNext();
}
updateFooter();
</script>
