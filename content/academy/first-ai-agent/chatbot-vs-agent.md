---
title: "Chatbot vs Agent"
course: "first-ai-agent"
order: 1
type: "lesson"
free: true
---<nav class="nav">
  <a href="/academy/first-ai-agent/" class="logo">Build Your First AI Agent</a>
  <a href="/academy/first-ai-agent/" class="nav-link">← Course</a>
</nav>

<div class="content">
  <div class="lesson-num">Lesson 1 of 10</div>
  <h1>Chatbot vs Agent</h1>
  <p class="subtitle">They both use AI. But one is a tool, and the other is a worker. Let's see why that matters.</p>

  <div class="comparison">
    <div class="side side-chatbot">
      <h3>💬 Chatbot</h3>
      <div class="trait"><span class="x-mark">✗</span> You ask, it answers — done</div>
      <div class="trait"><span class="x-mark">✗</span> No memory between messages</div>
      <div class="trait"><span class="x-mark">✗</span> Can't take actions</div>
      <div class="trait"><span class="x-mark">✗</span> Waits for your input</div>
      <div class="trait"><span class="x-mark">✗</span> Single turn interaction</div>
    </div>
    <div class="side side-agent">
      <h3>🤖 Agent</h3>
      <div class="trait"><span class="check-mark">✓</span> Perceives → Decides → Acts</div>
      <div class="trait"><span class="check-mark">✓</span> Remembers context &amp; history</div>
      <div class="trait"><span class="check-mark">✓</span> Uses tools to do real work</div>
      <div class="trait"><span class="check-mark">✓</span> Operates autonomously</div>
      <div class="trait"><span class="check-mark">✓</span> Loops until goal is met</div>
    </div>
  </div>

  <canvas id="viz"></canvas>

  <div class="scenarios">
    <h2>Classify These 5 Scenarios</h2>
    <p style="color:#71717a;font-size:.85rem;margin-bottom:1.5rem">Is this a chatbot or an agent? Think about autonomy, memory, and actions.</p>
    <div class="progress-bar"></div>
    </div>

  <div class="complete-section" id="complete">
    <h2>Lesson Complete!</h2>
    <p>You can tell the difference between a chatbot and an agent. That's the first step to building one.</p>
    
  </div>
</div>

<script>
// ─── CANVAS ANIMATION ───
const canvas = document.getElementById('viz');
const ctx = canvas.getContext('2d');
let W, H, animFrame;
function resize() {
  const r = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  W = canvas.width = rect.width * r;
  H = canvas.height = rect.height * r;
  ctx.scale(r, r);
}
resize();
window.addEventListener('resize', resize);

let time = 0;
function draw() {
  const w = W / (window.devicePixelRatio || 1);
  const h = H / (window.devicePixelRatio || 1);
  ctx.clearRect(0, 0, w, h);
  time += 0.016;

  // Chatbot side
  const cx = w * 0.25, cy = h * 0.5;
  // User bubble
  ctx.beginPath();
  ctx.arc(cx - 50, cy - 30, 20, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(239,68,68,0.15)';
  ctx.fill();
  ctx.fillStyle = '#ef4444';
  ctx.font = '600 11px Inter';
  ctx.textAlign = 'center';
  ctx.fillText('User', cx - 50, cy - 26);
  // Arrow right
  const arrowPulse = (Math.sin(time * 2) + 1) * 0.3 + 0.4;
  ctx.beginPath();
  ctx.moveTo(cx - 25, cy - 30);
  ctx.lineTo(cx - 5, cy - 30);
  ctx.strokeStyle = `rgba(239,68,68,${arrowPulse})`;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - 10, cy - 35);
  ctx.lineTo(cx - 5, cy - 30);
  ctx.lineTo(cx - 10, cy - 25);
  ctx.stroke();
  // Bot bubble
  ctx.beginPath();
  ctx.arc(cx + 20, cy - 30, 20, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(239,68,68,0.1)';
  ctx.fill();
  ctx.fillStyle = '#ef4444';
  ctx.fillText('Bot', cx + 20, cy - 26);
  // Dead line (flatline)
  ctx.beginPath();
  ctx.moveTo(cx - 60, cy + 20);
  for (let i = 0; i < 120; i++) {
    const x = cx - 60 + i;
    const shouldPulse = i > 40 && i < 55;
    const y = shouldPulse ? cy + 20 + Math.sin((i - 40) * 0.4) * 15 * Math.max(0, 1 - (time % 4) / 2) : cy + 20;
    ctx.lineTo(x, y);
  }
  ctx.strokeStyle = 'rgba(239,68,68,0.4)';
  ctx.lineWidth = 2;
  ctx.stroke();
  // Label
  ctx.fillStyle = '#ef4444';
  ctx.font = '700 13px Inter';
  ctx.fillText('CHATBOT', cx, cy + 55);
  ctx.font = '400 10px Inter';
  ctx.fillStyle = '#71717a';
  ctx.fillText('Dies after response', cx, cy + 72);

  // Agent side
  const ax = w * 0.75, ay = h * 0.5;
  const loopRadius = 40;
  const nodes = ['👁', '🧠', '⚡', '📊', '📚'];
  const labels = ['See', 'Think', 'Act', 'Check', 'Learn'];
  const activeNode = Math.floor(time * 1.2) % 5;
  for (let i = 0; i < 5; i++) {
    const angle = (Math.PI * 2 * i / 5) - Math.PI / 2;
    const nx = ax + Math.cos(angle) * loopRadius;
    const ny = ay - 15 + Math.sin(angle) * loopRadius;
    const isActive = i === activeNode;
    ctx.beginPath();
    ctx.arc(nx, ny, isActive ? 16 : 13, 0, Math.PI * 2);
    ctx.fillStyle = isActive ? 'rgba(6,182,212,0.25)' : 'rgba(6,182,212,0.08)';
    ctx.fill();
    if (isActive) {
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    ctx.font = isActive ? '14px sans-serif' : '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#e5e5e5';
    ctx.fillText(nodes[i], nx, ny);
    // Tiny label
    ctx.font = '500 8px Inter';
    ctx.fillStyle = isActive ? '#06b6d4' : '#52525b';
    ctx.fillText(labels[i], nx, ny + 22);
    // Draw arc to next node
    const nextAngle = (Math.PI * 2 * ((i + 1) % 5) / 5) - Math.PI / 2;
    const nnx = ax + Math.cos(nextAngle) * loopRadius;
    const nny = ay - 15 + Math.sin(nextAngle) * loopRadius;
    ctx.beginPath();
    ctx.moveTo(nx + Math.cos(nextAngle - Math.PI) * -13, ny + Math.sin(nextAngle - Math.PI) * -13);
    ctx.strokeStyle = i === activeNode ? 'rgba(6,182,212,0.6)' : 'rgba(6,182,212,0.12)';
    ctx.lineWidth = i === activeNode ? 2 : 1;
    // Don't draw full line, just a subtle connector
  }
  // Continuous pulse ring
  const pulseR = loopRadius + 10 + Math.sin(time * 3) * 5;
  ctx.beginPath();
  ctx.arc(ax, ay - 15, pulseR, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(6,182,212,0.08)';
  ctx.lineWidth = 1;
  ctx.stroke();
  // Label
  ctx.fillStyle = '#06b6d4';
  ctx.font = '700 13px Inter';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('AGENT', ax, ay + 55);
  ctx.font = '400 10px Inter';
  ctx.fillStyle = '#71717a';
  ctx.fillText('Loops continuously', ax, ay + 72);

  // Divider
  ctx.beginPath();
  ctx.setLineDash([4, 4]);
  ctx.moveTo(w / 2, 20);
  ctx.lineTo(w / 2, h - 20);
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.setLineDash([]);

  animFrame = requestAnimationFrame(draw);
}
draw();

// ─── SCENARIOS ───
const scenarios = [
  {
    text: '"I ask ChatGPT to write an email. It writes it and shows it to me. I copy-paste it into Gmail myself."',
    answer: 'chatbot',
    explanation: "The AI just generated text — it didn't send it, track it, or follow up. You had to do the action. That's a chatbot."
  },
  {
    text: '"My AI assistant monitors my inbox, drafts replies based on context from past emails, and sends them after I approve — or automatically for low-priority messages."',
    answer: 'agent',
    explanation: "It perceives (monitors inbox), remembers (past email context), decides (draft vs auto-send), and acts (sends emails). That's an agent loop."
  },
  {
    text: '"I upload a PDF and ask the AI to summarize it. It gives me bullet points."',
    answer: 'chatbot',
    explanation: "Single input, single output, no memory, no action. Classic chatbot pattern — even though it's useful."
  },
  {
    text: '"An AI system checks my website every hour. If it detects downtime, it restarts the server, checks if it worked, and pages me if it didn\'t."',
    answer: 'agent',
    explanation: "It perceives (monitors), thinks (is it down?), acts (restart), observes (did it work?), and escalates. Full agent loop with error handling."
  },
  {
    text: '"I ask an AI to plan my vacation. It researches flights, compares hotels, checks my calendar for conflicts, and books everything within my budget."',
    answer: 'agent',
    explanation: "Multiple tools (search, calendar, booking), memory (budget constraints), autonomous multi-step execution. This is agent behavior."
  }
];

const list = document.getElementById('scenario-list');
let answered = 0;
scenarios.forEach((s, i) => {
  const div = document.createElement('div');
  div.className = 'scenario';
  div.innerHTML = `
    <div class="scenario-text">${s.text}</div>
    <div class="scenario-btns">
      <button class="scenario-btn" data-choice="chatbot" onclick="answer(${i},'chatbot',this)">💬 Chatbot</button>
      <button class="scenario-btn" data-choice="agent" onclick="answer(${i},'agent',this)">🤖 Agent</button>
    </div>
    <div class="explanation" id="exp-${i}">${s.explanation}</div>
  `;
  list.appendChild(div);
});

function answer(idx, choice, btn) {
  const scenario = btn.closest('.scenario');
  if (scenario.classList.contains('answered')) return;
  scenario.classList.add('answered');
  const btns = scenario.querySelectorAll('.scenario-btn');
  btns.forEach(b => b.disabled = true);
  const correct = choice === scenarios[idx].answer;
  btn.classList.add(correct ? 'correct' : 'wrong');
  if (!correct) {
    btns.forEach(b => { if (b.dataset.choice === scenarios[idx].answer) b.classList.add('correct'); });
  }
  document.getElementById(`exp-${idx}`).style.display = 'block';
  answered++;
  document.getElementById('prog-fill').style.width = (answered / 5 * 100) + '%';
  if (answered === 5) {
    setTimeout(() => {
      document.getElementById('complete').style.display = 'block';
      if (typeof LO !== 'undefined') LO.completeLesson('first_ai_agent', 1, 160);
    }, 600);
  }
}
</script>
