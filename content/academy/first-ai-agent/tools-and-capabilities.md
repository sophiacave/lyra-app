---
title: "Tools and Capabilities"
course: "first-ai-agent"
order: 3
type: "lesson"
free: true
---<nav class="nav">
  <a href="/academy/first-ai-agent/" class="logo">Build Your First AI Agent</a>
  <a href="/academy/first-ai-agent/" class="nav-link">← Course</a>
</nav>

<div class="content">
  <div class="lesson-num">Lesson 3 of 10</div>
  <h1>Tools & Capabilities</h1>
  <p class="subtitle">An agent without tools is just a chatbot. Drag tools onto the agent and watch its capabilities expand.</p>

  <div class="workspace">
    <div class="toolbox">
      <h3>🧰 Toolbox</h3>
      </div>
    <div class="agent-zone" id="agent-zone">
      <div class="agent-avatar">🤖</div>
      <div class="agent-label">Your Agent</div>
      <div class="agent-status" id="agent-status">No tools equipped — just a chatbot</div>
      </div>
  </div>

  <div class="insight" id="insight">
    <h3>💡 Key Insight</h3>
    <p id="insight-text">Right now your agent has zero tools. It can only generate text — exactly like a chatbot. Try dragging some tools over to see what changes.</p>
  </div>

  <div class="complete-section" id="complete">
    <h2>Lesson Complete!</h2>
    <p>Tools are what give agents real power. The right tools turn text generation into autonomous action.</p>
    
  </div>
</div>

<script>
const tools = [
  { id: 'search', icon: '🔍', name: 'Web Search', desc: 'Find information online',
    capabilities: { knowledge: 40, action: 10, autonomy: 15, reach: 30 },
    insight: 'With web search, your agent can find current information instead of relying only on training data. It can answer questions about today, not just yesterday.' },
  { id: 'database', icon: '🗄️', name: 'Database', desc: 'Store and query data',
    capabilities: { knowledge: 20, action: 25, autonomy: 20, reach: 10 },
    insight: 'A database gives your agent persistent memory. It can store user preferences, track history, and build up knowledge over time.' },
  { id: 'email', icon: '📧', name: 'Email', desc: 'Send and read emails',
    capabilities: { knowledge: 5, action: 30, autonomy: 20, reach: 35 },
    insight: 'Now your agent can communicate with the outside world. It can notify users, send reports, and respond to incoming messages automatically.' },
  { id: 'calculator', icon: '🧮', name: 'Calculator', desc: 'Precise math operations',
    capabilities: { knowledge: 15, action: 10, autonomy: 5, reach: 0 },
    insight: 'LLMs are notoriously bad at math. A calculator tool means your agent gives precise answers instead of probabilistic guesses.' },
  { id: 'files', icon: '📁', name: 'File Reader', desc: 'Read and write files',
    capabilities: { knowledge: 25, action: 20, autonomy: 15, reach: 5 },
    insight: 'File access means your agent can process documents, generate reports, and work with data on disk. It can do real office work.' },
  { id: 'api', icon: '🔗', name: 'API Caller', desc: 'Call any external API',
    capabilities: { knowledge: 15, action: 35, autonomy: 25, reach: 40 },
    insight: 'API access is the ultimate force multiplier. Your agent can now connect to any service — payments, shipping, CRMs, social media, anything with an API.' }
];

const capabilities = { knowledge: 0, action: 0, autonomy: 0, reach: 0 };
const capLabels = { knowledge: 'Knowledge', action: 'Action Power', autonomy: 'Autonomy', reach: 'Reach' };
const capColors = { knowledge: '#06b6d4', action: '#a855f7', autonomy: '#38bdf8', reach: '#fb923c' };
const equipped = new Set();

// Render tools
const grid = document.getElementById('tool-grid');
tools.forEach(t => {
  const div = document.createElement('div');
  div.className = 'tool';
  div.draggable = true;
  div.dataset.id = t.id;
  div.innerHTML = `<span class="tool-icon">${t.icon}</span><div class="tool-name">${t.name}</div><div class="tool-desc">${t.desc}</div>`;
  div.addEventListener('dragstart', e => { e.dataTransfer.setData('text/plain', t.id); div.classList.add('dragging'); });
  div.addEventListener('dragend', () => div.classList.remove('dragging'));
  div.addEventListener('click', () => equipTool(t.id)); // Also support click
  grid.appendChild(div);
});

// Render meters
const metersDiv = document.getElementById('meters');
metersDiv.innerHTML = '<h3>📊 Agent Capabilities</h3>';
for (const [key, label] of Object.entries(capLabels)) {
  metersDiv.innerHTML += `<div class="meter-row"><div class="meter-label">${label}</div><div class="meter-bar"></div><div class="meter-val" id="val-${key}">0%</div></div>`;
}

// Drop zone
const zone = document.getElementById('agent-zone');
zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
zone.addEventListener('drop', e => { e.preventDefault(); zone.classList.remove('drag-over'); const id = e.dataTransfer.getData('text/plain'); equipTool(id); });

function equipTool(id) {
  if (equipped.has(id)) return;
  const tool = tools.find(t => t.id === id);
  if (!tool) return;
  equipped.add(id);

  // Mark as equipped in toolbox
  const toolEl = grid.querySelector(`[data-id="${id}"]`);
  if (toolEl) { toolEl.classList.add('equipped'); toolEl.draggable = false; }

  // Add to equipped list
  const tag = document.createElement('div');
  tag.className = 'equipped-tool';
  tag.innerHTML = `${tool.icon} ${tool.name}`;
  document.getElementById('equipped-list').appendChild(tag);

  // Update capabilities
  for (const [key, val] of Object.entries(tool.capabilities)) {
    capabilities[key] = Math.min(100, capabilities[key] + val);
    document.getElementById(`meter-${key}`).style.width = capabilities[key] + '%';
    document.getElementById(`val-${key}`).textContent = capabilities[key] + '%';
  }

  // Update status
  const count = equipped.size;
  const statusTexts = [
    'No tools equipped — just a chatbot',
    '1 tool — it can do one thing well',
    '2 tools — starting to feel useful',
    '3 tools — now it\'s a real agent',
    '4 tools — it can handle complex tasks',
    '5 tools — it\'s becoming autonomous',
    '6 tools — full-stack agent unlocked!'
  ];
  document.getElementById('agent-status').textContent = statusTexts[count] || statusTexts[6];

  // Update insight
  document.getElementById('insight-text').textContent = tool.insight;

  // Check completion
  if (equipped.size >= 4) {
    setTimeout(() => {
      document.getElementById('complete').style.display = 'block';
      if (typeof LO !== 'undefined') LO.completeLesson('first_ai_agent', 3, 160);
    }, 500);
  }
}
</script>
