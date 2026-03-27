---
title: "Design Your Agent"
course: "first-ai-agent"
order: 4
type: "builder"
free: false
---<nav class="nav">
  <a href="/academy/first-ai-agent/" class="logo">Build Your First AI Agent</a>
  <a href="/academy/first-ai-agent/" class="nav-link">← Course</a>
</nav>

<div class="content">
  <div class="lesson-num">Lesson 4 of 10</div>
  <h1>Design Your Agent</h1>
  <p class="subtitle">Every great agent starts with a clear design. Fill in each section to create your agent's identity card.</p>

  <div class="design-grid">
    <div class="form-section">
      <div class="field">
        <label>1. Name Your Agent</label>
        <input type="text" id="agent-name" placeholder="e.g., Atlas, Scout, Nova..." maxlength="30">
        <div class="hint">A good name makes it memorable. Keep it short.</div>
      </div>

      <div class="field">
        <label>2. Define Its Goal (one sentence)</label>
        <textarea id="agent-goal" placeholder="e.g., Monitor my website and fix issues before I notice them..." maxlength="200"></textarea>
        <div class="hint">Clear goals = effective agents. Vague goals = confused agents.</div>
      </div>

      <div class="field">
        <label>3. Pick 3 Tools</label>
        <div class="tool-picker" id="tool-picker"></div>
        <div class="tool-count" id="tool-count">0/3 selected</div>
      </div>

      <div class="field">
        <label>4. Define Its Memory</label>
        <textarea id="agent-memory" placeholder="e.g., Past incidents, user preferences, resolution history..." maxlength="200"></textarea>
        <div class="hint">What should it remember between sessions to do its job better?</div>
      </div>

      <div class="field">
        <label>5. Set One Guardrail</label>
        <input type="text" id="agent-guardrail" placeholder="e.g., Never delete production data without human approval" maxlength="150">
        <div class="hint">What should this agent NEVER do, even if asked?</div>
      </div>
    </div>

    <div>
      <div class="agent-card" id="agent-card">
        <div class="card-header">
          <span class="card-avatar">🤖</span>
          <div class="card-name" id="card-name">Your Agent</div>
          <div class="card-goal" id="card-goal">Define a goal...</div>
        </div>
        <div class="card-section">
          <h4>Tools</h4>
          <div class="card-tools" id="card-tools"></div>
          </div>
        <div class="card-section">
          <h4>Memory</h4>
          <div class="card-memory" id="card-memory">Not defined yet</div>
        </div>
        <div class="card-section">
          <h4>Guardrail</h4>
          <div class="card-guardrail" id="card-guardrail">Not defined yet</div>
        </div>
        <div class="card-score">
          <div class="pct" id="card-pct">0%</div>
          <div class="label">Design Completeness</div>
          <div class="card-completeness"><div class="card-fill" id="card-fill" style="width:0%;height:100%;background:linear-gradient(90deg,#22c55e,#3b82f6);border-radius:6px;transition:width .3s"></div></div>
        </div>
      </div>
    </div>
  </div>

  <div class="complete-section" id="complete">
    <h2>Agent Designed!</h2>
    <p>You just created a complete agent specification. In the next lesson, you'll turn this into a system prompt.</p>
    
  </div>
</div>

<script>
const toolOptions = [
  { id: 'search', icon: '🔍', name: 'Web Search' },
  { id: 'db', icon: '🗄️', name: 'Database' },
  { id: 'email', icon: '📧', name: 'Email' },
  { id: 'calc', icon: '🧮', name: 'Calculator' },
  { id: 'files', icon: '📁', name: 'File R/W' },
  { id: 'api', icon: '🔗', name: 'API Calls' },
  { id: 'code', icon: '💻', name: 'Run Code' },
  { id: 'schedule', icon: '⏰', name: 'Scheduler' },
  { id: 'notify', icon: '🔔', name: 'Notifications' }
];
const selectedTools = new Set();

const picker = document.getElementById('tool-picker');
toolOptions.forEach(t => {
  const div = document.createElement('div');
  div.className = 'tool-opt';
  div.dataset.id = t.id;
  div.innerHTML = `<span class="t-icon">${t.icon}</span><span class="t-name">${t.name}</span>`;
  div.addEventListener('click', () => toggleTool(t, div));
  picker.appendChild(div);
});

function toggleTool(tool, el) {
  if (selectedTools.has(tool.id)) {
    selectedTools.delete(tool.id);
    el.classList.remove('selected');
  } else if (selectedTools.size < 3) {
    selectedTools.add(tool.id);
    el.classList.add('selected');
  }
  document.getElementById('tool-count').textContent = `${selectedTools.size}/3 selected`;
  updateCard();
}

// Real-time card updates
document.getElementById('agent-name').addEventListener('input', updateCard);
document.getElementById('agent-goal').addEventListener('input', updateCard);
document.getElementById('agent-memory').addEventListener('input', updateCard);
document.getElementById('agent-guardrail').addEventListener('input', updateCard);

function updateCard() {
  const name = document.getElementById('agent-name').value.trim();
  const goal = document.getElementById('agent-goal').value.trim();
  const memory = document.getElementById('agent-memory').value.trim();
  const guardrail = document.getElementById('agent-guardrail').value.trim();

  document.getElementById('card-name').textContent = name || 'Your Agent';
  document.getElementById('card-goal').textContent = goal || 'Define a goal...';

  const toolsDiv = document.getElementById('card-tools');
  toolsDiv.innerHTML = '';
  selectedTools.forEach(id => {
    const t = toolOptions.find(o => o.id === id);
    if (t) { const span = document.createElement('span'); span.className = 'card-tool'; span.textContent = t.icon + ' ' + t.name; toolsDiv.appendChild(span); }
  });
  if (selectedTools.size === 0) toolsDiv.innerHTML = '<span style="color:#52525b;font-size:.75rem">Pick tools above</span>';

  document.getElementById('card-memory').textContent = memory || 'Not defined yet';
  document.getElementById('card-guardrail').textContent = guardrail || 'Not defined yet';

  // Calculate completeness
  let score = 0;
  if (name.length >= 2) score += 20;
  if (goal.length >= 10) score += 20;
  if (selectedTools.size === 3) score += 20;
  if (memory.length >= 10) score += 20;
  if (guardrail.length >= 10) score += 20;

  document.getElementById('card-pct').textContent = score + '%';
  document.getElementById('card-fill').style.width = score + '%';

  if (score === 100) {
    setTimeout(() => {
      const comp = document.getElementById('complete');
      if (comp.style.display !== 'block') {
        comp.style.display = 'block';
        if (typeof LO !== 'undefined') LO.completeLesson('first_ai_agent', 4, 160);
      }
    }, 400);
  }
}
</script>
