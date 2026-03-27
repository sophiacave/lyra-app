---
title: "The System Prompt"
course: "first-ai-agent"
order: 5
type: "lesson"
free: false
---<nav class="nav">
  <a href="/academy/first-ai-agent/" class="logo">Build Your First AI Agent</a>
  <a href="/academy/first-ai-agent/" class="nav-link">← Course</a>
</nav>

<div class="content">
  <div class="lesson-num">Lesson 5 of 10</div>
  <h1>The System Prompt</h1>
  <p class="subtitle">A system prompt is an agent's DNA. Drag blocks to assemble your agent's instructions, then fill in the details.</p>

  <div class="progress-bar"><div class="progress-fill" id="prog-fill" style="width:0"></div></div>

  <div class="builder">
    <div>
      <h3 style="font-size:.9rem;color:#a1a1aa;margin-bottom:1rem">Available Blocks — drag to the prompt area or click to add</h3>
      <div class="blocks-panel" id="blocks-panel"></div>
    </div>

    <div class="preview-panel">
      <div class="preview">
        <h3>📋 System Prompt Preview</h3>
        <div class="drop-zone" id="drop-zone">
          <div class="drop-hint" id="drop-hint">Drag blocks here to build your system prompt.<br>Order matters — identity first, then goal, tools, etc.</div>
        </div>
      </div>
    </div>
  </div>

  <div class="complete-section" id="complete">
    <h2>System Prompt Built!</h2>
    <p>You've assembled a complete agent system prompt. This is exactly how real agent frameworks structure their instructions.</p>
    <a href="memory-matters.html" class="next-btn">Next: Memory Matters →</a>
  </div>
</div>

<script>
const blocks = [
  { id: 'identity', icon: '🪪', title: 'Identity', example: 'Who is this agent? Its name and role.',
    placeholder: 'You are [name], a [role] assistant that...', prefix: 'IDENTITY:' },
  { id: 'goal', icon: '🎯', title: 'Goal', example: 'The agent\'s primary mission.',
    placeholder: 'Your mission is to...', prefix: 'GOAL:' },
  { id: 'tools', icon: '🧰', title: 'Tools', example: 'What tools can this agent use?',
    placeholder: 'You have access to: web search, database, email...', prefix: 'TOOLS:' },
  { id: 'memory', icon: '🧠', title: 'Memory', example: 'What context does the agent carry?',
    placeholder: 'You remember past conversations, user preferences...', prefix: 'MEMORY:' },
  { id: 'guardrails', icon: '🛑', title: 'Guardrails', example: 'What must the agent NEVER do?',
    placeholder: 'You must never delete data, share credentials, or...', prefix: 'GUARDRAILS:' },
  { id: 'output', icon: '📤', title: 'Output Format', example: 'How should the agent respond?',
    placeholder: 'Respond in JSON with keys: action, reasoning, confidence...', prefix: 'OUTPUT FORMAT:' }
];

const placed = [];
const blockContents = {};
const panel = document.getElementById('blocks-panel');
const dropZone = document.getElementById('drop-zone');

blocks.forEach(b => {
  const div = document.createElement('div');
  div.className = 'block';
  div.draggable = true;
  div.dataset.id = b.id;
  div.innerHTML = `
    <div class="block-header"><span class="block-icon">${b.icon}</span><span class="block-title">${b.title}</span></div>
    <div class="block-example">${b.example}</div>
  `;
  div.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', b.id));
  div.addEventListener('click', () => placeBlock(b.id));
  panel.appendChild(div);
});

dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('drag-over'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
dropZone.addEventListener('drop', e => { e.preventDefault(); dropZone.classList.remove('drag-over'); placeBlock(e.dataTransfer.getData('text/plain')); });

function placeBlock(id) {
  if (placed.includes(id)) return;
  placed.push(id);
  const b = blocks.find(bl => bl.id === id);
  if (!b) return;

  // Mark source as placed
  const src = panel.querySelector(`[data-id="${id}"]`);
  if (src) { src.classList.add('placed'); src.draggable = false; }

  // Hide hint
  document.getElementById('drop-hint').style.display = 'none';

  // Create placed block with input
  const el = document.createElement('div');
  el.className = 'placed-block-wrap';
  el.innerHTML = `
    <div class="placed-block">
      ${b.icon} <strong>${b.title}</strong>
      <span class="remove" data-id="${id}">✕</span>
    </div>
    <textarea class="block-input" data-id="${id}" placeholder="${b.placeholder}"></textarea>
  `;
  dropZone.appendChild(el);

  el.querySelector('.remove').addEventListener('click', () => removeBlock(id));
  el.querySelector('.block-input').addEventListener('input', (e) => {
    blockContents[id] = e.target.value;
    updateProgress();
  });

  updateProgress();
}

function removeBlock(id) {
  const idx = placed.indexOf(id);
  if (idx > -1) placed.splice(idx, 1);
  delete blockContents[id];

  // Remove from drop zone
  const wraps = dropZone.querySelectorAll('.placed-block-wrap');
  wraps.forEach(w => { if (w.querySelector(`[data-id="${id}"]`)) w.remove(); });

  // Restore source
  const src = panel.querySelector(`[data-id="${id}"]`);
  if (src) { src.classList.remove('placed'); src.draggable = true; }

  if (placed.length === 0) document.getElementById('drop-hint').style.display = 'block';
  updateProgress();
}

function updateProgress() {
  let filled = 0;
  placed.forEach(id => { if ((blockContents[id] || '').trim().length >= 5) filled++; });
  const pct = Math.round((filled / 6) * 100);
  document.getElementById('prog-fill').style.width = pct + '%';

  if (filled >= 6) {
    setTimeout(() => {
      const comp = document.getElementById('complete');
      if (comp.style.display !== 'block') {
        comp.style.display = 'block';
        if (typeof LO !== 'undefined') LO.completeLesson('first_ai_agent', 5, 160);
      }
    }, 400);
  }
}
</script>
