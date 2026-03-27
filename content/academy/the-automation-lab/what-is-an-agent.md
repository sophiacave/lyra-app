---
title: "What Is an Agent?"
course: "the-automation-lab"
order: 1
type: "lesson"
free: true
---<div class="container">
  <div class="header">
    <div class="tag">The Automation Lab — Lesson 1</div>
    <h1>What Is an Agent?</h1>
    <p>Most "AI" you've seen is actually just automation — a trigger, an action, done. An agent is different: it perceives, decides, acts, and adapts in a continuous loop.</p>
  </div>

  <div style="background:rgba(192,132,252,.06);border:1px solid rgba(192,132,252,.12);border-radius:12px;padding:1.25rem;margin-bottom:1.5rem;font-size:.9rem;color:#a1a1aa;line-height:1.7">
    <strong style="color:#e5e5e5">An agent is a system that can:</strong> (1) observe its environment, (2) make decisions based on what it sees, (3) take real actions, and (4) keep going in a loop — adapting as it goes. It's not just following a script. It's responding to what's actually happening.
  </div>

  <div class="comparison">
    <div class="panel auto">
      <div class="panel-label">Automation</div>
      <div class="pipeline" id="autoPipeline">
        <div class="node node-auto" id="autoTrigger" style="opacity:0">Trigger</div>
        <div class="node node-auto" id="autoAction" style="opacity:0">Action</div>
        <div class="node node-auto" id="autoDone" style="opacity:0">Done</div>
      </div>
      <div class="auto-complete" id="autoComplete">Pipeline complete. Waiting for next trigger...</div>
    </div>

    <div class="panel agent">
      <div class="panel-label">Agent</div>
      <canvas id="agentCanvas"></canvas>
    </div>
  </div>

  <div class="divider"><span>Test Your Understanding</span></div>

  <div class="quiz-section">
    <h2>Automation or Agent?</h2>
    <p>Read each scenario and decide: is it an automation or an agent?</p>
    <div class="score-bar">
      <div class="score-item">Correct: <span id="quizScore">0</span>/5</div>
    </div>
    <div class="complete-card" id="completeCard">
      <h3>Lesson Complete!</h3>
      <p style="color:#a3a3a3;font-size:14px">You now understand the core difference: automations follow a fixed path, agents perceive, decide, act, and learn in a continuous loop.</p>
    </div>
  </div>
</div>

<script>
// Automation Pipeline Animation
function animateAutoPipeline() {
  const ids = ['autoTrigger','autoArrow1','autoAction','autoArrow2','autoDone'];
  ids.forEach((id, i) => {
    setTimeout(() => {
      const el = document.getElementById(id);
      el.style.transition = 'opacity .4s, transform .4s';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, i * 500);
  });
  setTimeout(() => {
    document.getElementById('autoComplete').classList.add('show');
  }, ids.length * 500 + 300);
}
setTimeout(animateAutoPipeline, 400);

// Agent Canvas Animation
const canvas = document.getElementById('agentCanvas');
const ctx = canvas.getContext('2d');
let cW, cH;

function resizeCanvas() {
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width * 2;
  canvas.height = 220 * 2;
  canvas.style.width = rect.width + 'px';
  canvas.style.height = '220px';
  cW = canvas.width;
  cH = canvas.height;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const agentNodes = [
  { label: 'Perceive', color: '#38bdf8', angle: -Math.PI / 2 },
  { label: 'Decide', color: '#c084fc', angle: 0 },
  { label: 'Act', color: '#fb923c', angle: Math.PI / 2 },
  { label: 'Learn', color: '#22c55e', angle: Math.PI },
];

let particleT = 0;
function drawAgentLoop(time) {
  ctx.clearRect(0, 0, cW, cH);
  const cx = cW / 2, cy = cH / 2;
  const rx = cW * 0.3, ry = cH * 0.32;

  // Dashed circle path
  ctx.setLineDash([8, 8]);
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(251,146,60,0.15)';
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Nodes
  agentNodes.forEach((node, i) => {
    const x = cx + Math.cos(node.angle) * rx;
    const y = cy + Math.sin(node.angle) * ry;
    const glowPhase = (time / 1500 + i * 0.25) % 1;

    ctx.shadowBlur = 20;
    ctx.shadowColor = node.color;

    const w = 110, h = 40;
    ctx.fillStyle = 'rgba(10,10,15,0.9)';
    ctx.beginPath();
    ctx.roundRect(x - w/2, y - h/2, w, h, 10);
    ctx.fill();

    ctx.lineWidth = 2;
    ctx.strokeStyle = node.color + '66';
    ctx.beginPath();
    ctx.roundRect(x - w/2, y - h/2, w, h, 10);
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.fillStyle = node.color;
    ctx.font = '600 20px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.label, x, y);
  });

  // Traveling particle
  particleT = (time / 3000) % 1;
  const pAngle = -Math.PI / 2 + particleT * Math.PI * 2;
  const px = cx + Math.cos(pAngle) * rx;
  const py = cy + Math.sin(pAngle) * ry;

  for (let t = 0; t < 8; t++) {
    const trailT = particleT - t * 0.012;
    const ta = -Math.PI / 2 + trailT * Math.PI * 2;
    const tx = cx + Math.cos(ta) * rx;
    const ty = cy + Math.sin(ta) * ry;
    ctx.fillStyle = `rgba(251,146,60,${0.6 - t * 0.07})`;
    ctx.beginPath();
    ctx.arc(tx, ty, 8 - t * 0.8, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.shadowBlur = 25;
  ctx.shadowColor = '#fb923c';
  ctx.fillStyle = '#fb923c';
  ctx.beginPath();
  ctx.arc(px, py, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  requestAnimationFrame(drawAgentLoop);
}
requestAnimationFrame(drawAgentLoop);

// Quiz
const SCENARIOS = [
  { text: "A cron job sends a weekly analytics report every Monday at 9am.", answer: "automation", explain: "This is a fixed schedule followed by a fixed action. No decision-making, no learning. Classic automation." },
  { text: "A system monitors your inbox, categorizes emails by urgency, drafts responses, and improves its categorization based on your corrections.", answer: "agent", explain: "It perceives (monitors inbox), decides (categorizes), acts (drafts), and learns (improves from corrections). That's the full agent loop." },
  { text: "When a new user signs up, automatically send a welcome email and create a Slack notification.", answer: "automation", explain: "Trigger (signup) followed by fixed actions (email + Slack). No decisions, no adaptation. Standard automation workflow." },
  { text: "An AI customer support bot reads tickets, searches your knowledge base, tries to resolve issues, escalates what it can't handle, and tracks which answers actually helped.", answer: "agent", explain: "This agent perceives (reads tickets), decides (search vs escalate), acts (responds), and learns (tracks effectiveness). It adapts to new situations." },
  { text: "A script that resizes all uploaded images to 3 standard sizes and saves them to cloud storage.", answer: "automation", explain: "Fixed input followed by a fixed transformation followed by fixed output. No perception or decision-making. Pure automation." }
];

let quizScore = 0, answered = 0;

function buildScenarios() {
  const container = document.getElementById('scenarios');
  container.innerHTML = SCENARIOS.map((s, i) => `
    <div class="scenario" id="scenario-${i}">
      <div class="scenario-num">Scenario ${i + 1}</div>
      <div class="scenario-text">${s.text}</div>
      <div class="scenario-btns">
        <button class="scenario-btn" onclick="answerScenario(${i},'automation',this)">Automation</button>
        <button class="scenario-btn" onclick="answerScenario(${i},'agent',this)">Agent</button>
      </div>
      <div class="scenario-explain" id="explain-${i}">${s.explain}</div>
    </div>
  `).join('');
}
buildScenarios();

function answerScenario(idx, pick, btn) {
  const s = SCENARIOS[idx];
  const card = document.getElementById(`scenario-${idx}`);
  card.classList.add('answered');
  const btns = card.querySelectorAll('.scenario-btn');

  if (pick === s.answer) {
    quizScore++;
    btn.classList.add('correct-pick');
    try { LO.sfx.success(); const rect = btn.getBoundingClientRect(); LO.spawnParticles(rect.left + rect.width/2, rect.top + rect.height/2, '#22c55e', 12); } catch(e){}
  } else {
    btn.classList.add('wrong-pick');
    btn.classList.add('shake');
    btns.forEach(b => { if (b.textContent.toLowerCase() === s.answer) b.classList.add('was-correct'); });
    try { LO.sfx.error(); } catch(e){}
  }

  document.getElementById('quizScore').textContent = quizScore;
  document.getElementById(`explain-${idx}`).classList.add('show');
  answered++;

  if (answered === 5) {
    setTimeout(() => {
      document.getElementById('completeCard').classList.add('show');
      try { LO.completeLesson('automation-lab', 1, 60); } catch(e){}
    }, 600);
  }
}
</script>
