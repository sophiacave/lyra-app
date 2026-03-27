---
title: "Triggers and Actions"
course: "automation-architect"
order: 1
type: "lesson"
free: true
---<div class="container">
  <div class="header">
    <div class="tag">Automation Architect — Lesson 1</div>
    <h1>Triggers & Actions</h1>
    <p>Drag triggers and actions onto the canvas to build automation flows.</p>
  </div>

  <div class="hud">
    <div class="hud-item"><div class="hud-label">Challenge</div><div class="hud-val" id="challengeNum">1/3</div></div>
    <div class="hud-item"><div class="hud-label">Score</div><div class="hud-val" id="scoreVal">0</div></div>
  </div>

  <div class="challenge-dots">
    <div class="dot active" id="dot-0"></div>
    <div class="dot" id="dot-1"></div>
    <div class="dot" id="dot-2"></div>
  </div>

  <div class="challenge-bar">
    <div class="challenge-label">Build this automation</div>
    <div class="challenge-text" id="challengeText"></div>
  </div>

  <div class="builder">
    <div class="palette" id="triggerPalette">
      <div class="palette-title">Triggers</div>
      <div class="palette-node trigger" draggable="true" data-type="trigger" data-id="webhook"><span class="icon">🔗</span>Webhook</div>
      <div class="palette-node trigger" draggable="true" data-type="trigger" data-id="schedule"><span class="icon">⏰</span>Schedule</div>
      <div class="palette-node trigger" draggable="true" data-type="trigger" data-id="event"><span class="icon">⚡</span>Event</div>
    </div>

    <div class="canvas-area" id="canvasArea">
      <div class="canvas-label" id="canvasLabel">Drop a trigger here,<br>then add an action</div>
      <canvas id="flowCanvas"></canvas>
    </div>

    <div class="palette" id="actionPalette">
      <div class="palette-title">Actions</div>
      <div class="palette-node action" draggable="true" data-type="action" data-id="email"><span class="icon">📧</span>Send Email</div>
      <div class="palette-node action" draggable="true" data-type="action" data-id="database"><span class="icon">💾</span>Save to DB</div>
      <div class="palette-node action" draggable="true" data-type="action" data-id="api"><span class="icon">🌐</span>Call API</div>
      <div class="palette-node action" draggable="true" data-type="action" data-id="notify"><span class="icon">🔔</span>Notification</div>
    </div>
  </div>

  <button class="run-btn" id="runBtn" onclick="runFlow()">Run Automation</button>
  <div class="feedback" id="feedback"></div>
  <div class="complete-card" id="completeCard">
    <h3>Lesson Complete!</h3>
    <p>You've built 3 real automation flows. You now understand how triggers initiate workflows and actions execute them.</p>
  </div>
</div>

<script>
const CHALLENGES = [
  { text: "Send an email when a form is submitted", trigger: "webhook", action: "email", desc: "A webhook receives the form data and triggers an email action." },
  { text: "Save sensor data to a database every hour", trigger: "schedule", action: "database", desc: "A schedule trigger fires every hour and the data is saved to the database." },
  { text: "Call an API when a new user signs up", trigger: "event", action: "api", desc: "The user signup event triggers an API call to sync data externally." }
];

let currentChallenge = 0, score = 0;
let placedTrigger = null, placedAction = null;
let triggerNode = null, actionNode = null;

const canvasArea = document.getElementById('canvasArea');
const flowCanvas = document.getElementById('flowCanvas');
const fctx = flowCanvas.getContext('2d');
let pulseAnim = null;

function resizeFlowCanvas() {
  const rect = canvasArea.getBoundingClientRect();
  flowCanvas.width = rect.width * 2;
  flowCanvas.height = rect.height * 2;
  flowCanvas.style.width = rect.width + 'px';
  flowCanvas.style.height = rect.height + 'px';
  drawConnection();
}
window.addEventListener('resize', resizeFlowCanvas);

function loadChallenge() {
  const c = CHALLENGES[currentChallenge];
  document.getElementById('challengeText').textContent = c.text;
  document.getElementById('challengeNum').textContent = `${currentChallenge + 1}/3`;
  document.getElementById('feedback').textContent = '';
  document.getElementById('runBtn').classList.remove('ready', 'running');
  document.getElementById('canvasLabel').style.display = 'block';
  document.getElementById('canvasLabel').innerHTML = 'Drop a trigger here,<br>then add an action';

  placedTrigger = null; placedAction = null;
  if (triggerNode) triggerNode.remove();
  if (actionNode) actionNode.remove();
  triggerNode = null; actionNode = null;

  document.querySelectorAll('.palette-node').forEach(n => n.classList.remove('used'));
  cancelAnimationFrame(pulseAnim);
  fctx.clearRect(0, 0, flowCanvas.width, flowCanvas.height);

  for (let i = 0; i < 3; i++) {
    const dot = document.getElementById(`dot-${i}`);
    dot.classList.remove('active', 'done');
    if (i < currentChallenge) dot.classList.add('done');
    if (i === currentChallenge) dot.classList.add('active');
  }
  resizeFlowCanvas();
}

// Drag & Drop
document.querySelectorAll('.palette-node').forEach(node => {
  node.addEventListener('dragstart', e => {
    e.dataTransfer.setData('type', node.dataset.type);
    e.dataTransfer.setData('id', node.dataset.id);
    e.dataTransfer.setData('label', node.textContent.trim());
    e.dataTransfer.setData('icon', node.querySelector('.icon').textContent);
    try { LO.sfx.click(); } catch(ex){}
  });
});

canvasArea.addEventListener('dragover', e => { e.preventDefault(); canvasArea.classList.add('drag-over'); });
canvasArea.addEventListener('dragleave', () => canvasArea.classList.remove('drag-over'));

canvasArea.addEventListener('drop', e => {
  e.preventDefault();
  canvasArea.classList.remove('drag-over');
  const type = e.dataTransfer.getData('type');
  const id = e.dataTransfer.getData('id');
  const label = e.dataTransfer.getData('label');
  const icon = e.dataTransfer.getData('icon');

  if (type === 'trigger' && !placedTrigger) {
    placedTrigger = id;
    placeNode(type, id, label, icon, 'trigger');
  } else if (type === 'action' && !placedAction && placedTrigger) {
    placedAction = id;
    placeNode(type, id, label, icon, 'action');
  }

  const paletteNode = document.querySelector(`.palette-node[data-id="${id}"]`);
  if (paletteNode) paletteNode.classList.add('used');

  if (placedTrigger && placedAction) {
    document.getElementById('runBtn').classList.add('ready');
    document.getElementById('canvasLabel').style.display = 'none';
  } else if (placedTrigger) {
    document.getElementById('canvasLabel').innerHTML = 'Now drop an action';
  }
});

function placeNode(type, id, label, icon, which) {
  const rect = canvasArea.getBoundingClientRect();
  const node = document.createElement('div');
  node.className = `placed-node ${which === 'trigger' ? 'trigger-placed' : 'action-placed'}`;
  node.innerHTML = `<span class="icon">${icon}</span>${label}`;

  if (which === 'trigger') {
    node.style.left = '20px';
    node.style.top = `${rect.height / 2 - 30}px`;
    triggerNode = node;
  } else {
    node.style.right = '20px';
    node.style.top = `${rect.height / 2 - 30}px`;
    actionNode = node;
  }

  node.style.opacity = '0';
  node.style.transform = 'scale(0.8)';
  canvasArea.appendChild(node);
  requestAnimationFrame(() => {
    node.style.transition = 'all .3s cubic-bezier(.34,1.56,.64,1)';
    node.style.opacity = '1';
    node.style.transform = 'scale(1)';
  });

  setTimeout(drawConnection, 100);
  try { LO.sfx.click(); } catch(ex){}
}

function drawConnection() {
  fctx.clearRect(0, 0, flowCanvas.width, flowCanvas.height);
  if (!triggerNode || !actionNode) return;

  const areaRect = canvasArea.getBoundingClientRect();
  const tRect = triggerNode.getBoundingClientRect();
  const aRect = actionNode.getBoundingClientRect();
  const scale = 2;

  const x1 = (tRect.right - areaRect.left) * scale;
  const y1 = (tRect.top + tRect.height / 2 - areaRect.top) * scale;
  const x2 = (aRect.left - areaRect.left) * scale;
  const y2 = (aRect.top + aRect.height / 2 - areaRect.top) * scale;
  const cpx = (x1 + x2) / 2;

  fctx.setLineDash([10, 6]);
  fctx.lineWidth = 3;
  fctx.strokeStyle = 'rgba(255,255,255,0.15)';
  fctx.beginPath();
  fctx.moveTo(x1, y1);
  fctx.bezierCurveTo(cpx, y1, cpx, y2, x2, y2);
  fctx.stroke();
  fctx.setLineDash([]);

  fctx.fillStyle = 'rgba(255,255,255,0.2)';
  fctx.beginPath();
  fctx.moveTo(x2, y2);
  fctx.lineTo(x2 - 16, y2 - 8);
  fctx.lineTo(x2 - 16, y2 + 8);
  fctx.closePath();
  fctx.fill();
}

function runFlow() {
  const c = CHALLENGES[currentChallenge];
  const btn = document.getElementById('runBtn');
  btn.classList.add('running');
  btn.classList.remove('ready');

  const isCorrect = placedTrigger === c.trigger && placedAction === c.action;

  animatePulse(() => {
    if (isCorrect) {
      score += 100;
      document.getElementById('scoreVal').textContent = score;
      document.getElementById('feedback').innerHTML = `<span style="color:#22c55e">Correct!</span> ${c.desc}`;
      if (triggerNode) triggerNode.style.boxShadow = '0 0 25px rgba(34,197,94,.4)';
      if (actionNode) actionNode.style.boxShadow = '0 0 25px rgba(34,197,94,.4)';
      try { LO.sfx.success(); const rect = canvasArea.getBoundingClientRect(); LO.spawnParticles(rect.left + rect.width/2, rect.top + rect.height/2, '#22c55e', 18); } catch(e){}

      document.getElementById(`dot-${currentChallenge}`).classList.remove('active');
      document.getElementById(`dot-${currentChallenge}`).classList.add('done');

      setTimeout(() => {
        currentChallenge++;
        if (currentChallenge < CHALLENGES.length) {
          loadChallenge();
        } else {
          document.getElementById('completeCard').classList.add('show');
          try { LO.completeLesson('automation-architect', 1, 60); } catch(e){}
        }
      }, 1800);
    } else {
      document.getElementById('feedback').innerHTML = `<span style="color:#ef4444">Not quite.</span> Try: ${c.trigger} trigger + ${c.action} action.`;
      try { LO.sfx.error(); } catch(e){}
      setTimeout(() => {
        placedTrigger = null; placedAction = null;
        if (triggerNode) triggerNode.remove();
        if (actionNode) actionNode.remove();
        triggerNode = null; actionNode = null;
        document.querySelectorAll('.palette-node').forEach(n => n.classList.remove('used'));
        fctx.clearRect(0, 0, flowCanvas.width, flowCanvas.height);
        document.getElementById('canvasLabel').style.display = 'block';
        document.getElementById('canvasLabel').innerHTML = 'Drop a trigger here,<br>then add an action';
        document.getElementById('runBtn').classList.remove('running');
        document.getElementById('feedback').textContent = '';
      }, 2000);
    }
  });
}

function animatePulse(callback) {
  if (!triggerNode || !actionNode) { callback(); return; }

  const areaRect = canvasArea.getBoundingClientRect();
  const tRect = triggerNode.getBoundingClientRect();
  const aRect = actionNode.getBoundingClientRect();
  const scale = 2;

  const x1 = (tRect.right - areaRect.left) * scale;
  const y1 = (tRect.top + tRect.height/2 - areaRect.top) * scale;
  const x2 = (aRect.left - areaRect.left) * scale;
  const y2 = (aRect.top + aRect.height/2 - areaRect.top) * scale;
  const cpx = (x1 + x2) / 2;

  let t = 0;
  function frame() {
    drawConnection();
    t += 0.02;
    if (t > 1) { callback(); return; }

    const px = bezPt(x1, cpx, cpx, x2, t);
    const py = bezPt(y1, y1, y2, y2, t);

    fctx.shadowBlur = 20;
    fctx.shadowColor = '#818cf8';
    fctx.fillStyle = '#818cf8';
    fctx.beginPath();
    fctx.arc(px, py, 12, 0, Math.PI * 2);
    fctx.fill();
    fctx.shadowBlur = 0;

    for (let i = 1; i <= 5; i++) {
      const tt = Math.max(0, t - i * 0.03);
      const tx = bezPt(x1, cpx, cpx, x2, tt);
      const ty = bezPt(y1, y1, y2, y2, tt);
      fctx.fillStyle = `rgba(129,140,248,${0.4 - i * 0.07})`;
      fctx.beginPath();
      fctx.arc(tx, ty, 10 - i, 0, Math.PI * 2);
      fctx.fill();
    }

    pulseAnim = requestAnimationFrame(frame);
  }
  frame();
}

function bezPt(p0, p1, p2, p3, t) {
  const mt = 1 - t;
  return mt*mt*mt*p0 + 3*mt*mt*t*p1 + 3*mt*t*t*p2 + t*t*t*p3;
}

loadChallenge();
</script>
