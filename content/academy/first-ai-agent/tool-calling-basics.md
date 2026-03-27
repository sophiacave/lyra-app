---
title: "Tool Calling Basics"
course: "first-ai-agent"
order: 7
type: "lesson"
free: false
---<nav class="nav">
  <a href="/academy/first-ai-agent/" class="logo">Build Your First AI Agent</a>
  <a href="/academy/first-ai-agent/" class="nav-link">← Course</a>
</nav>

<div class="content">
  <div class="lesson-num">Lesson 7 of 10</div>
  <h1>Tool Calling Basics</h1>
  <p class="subtitle">Watch an agent decide which tool to use, make the call, and use the result. Pick a question to see the full flow.</p>

  <div class="question-picker">
    <h3>Pick a question for the agent to answer:</h3>
    <div class="q-grid" id="q-grid"></div>
    <div class="dots" id="dots"></div>
  </div>

  <div class="flow-viz" id="flow-viz"></div>

  <div class="complete-section" id="complete">
    <h2>Lesson Complete!</h2>
    <p>You've seen how tool calling works — the agent reasons about what it needs, calls the right tool, and uses the result. This is the mechanism that makes agents powerful.</p>
    
  </div>
</div>

<script>
const questions = [
  {
    emoji: '🌤️', text: 'What\'s the weather in Tokyo right now?',
    steps: [
      { type: 'user', icon: '👤', label: 'User asks', text: '"What\'s the weather in Tokyo right now?"' },
      { type: 'think', icon: '🧠', label: 'Agent thinks', text: 'I need real-time weather data. My training data is static — I can\'t know today\'s weather. I need to call a tool.',
        code: '// Agent reasoning:\n// "weather" + "right now" → need real-time data\n// Available tools: [weather_api, web_search, calculator]\n// Best tool: weather_api' },
      { type: 'tool', icon: '🔧', label: 'Tool call', text: 'Calling the weather API with location parameter...',
        code: 'weather_api.get({\n  location: "Tokyo, Japan",\n  units: "metric"\n})' },
      { type: 'response', icon: '📦', label: 'Tool response', text: 'The API returns structured data that the agent can parse.',
        code: '{\n  "temp": 22,\n  "condition": "Partly cloudy",\n  "humidity": 65,\n  "wind": "12 km/h NW"\n}' },
      { type: 'result', icon: '✅', label: 'Agent responds', text: '"It\'s currently 22°C in Tokyo with partly cloudy skies, 65% humidity, and a light 12 km/h northwest wind." — Precise answer using real data, not a guess.' }
    ]
  },
  {
    emoji: '📊', text: 'How much did we spend on marketing last quarter?',
    steps: [
      { type: 'user', icon: '👤', label: 'User asks', text: '"How much did we spend on marketing last quarter?"' },
      { type: 'think', icon: '🧠', label: 'Agent thinks', text: 'This requires company-specific financial data. I need to query the database to find marketing expenses for Q4.',
        code: '// Agent reasoning:\n// "spend" + "marketing" + "last quarter" → financial query\n// Available tools: [database, web_search, calculator]\n// Best tool: database (company-specific data)' },
      { type: 'tool', icon: '🔧', label: 'Tool call', text: 'Querying the company database for marketing expenses...',
        code: 'database.query({\n  sql: "SELECT SUM(amount) FROM expenses\\n  WHERE department = \'marketing\'\\n  AND quarter = \'Q4-2025\'"\n})' },
      { type: 'response', icon: '📦', label: 'Tool response', text: 'Database returns the aggregated financial data.',
        code: '{\n  "total": 47250.00,\n  "currency": "USD",\n  "rows": 34\n}' },
      { type: 'result', icon: '✅', label: 'Agent responds', text: '"Marketing spent $47,250 last quarter across 34 transactions. That\'s within your $50K budget." — The agent provides context, not just a number.' }
    ]
  },
  {
    emoji: '📧', text: 'Email the team about the meeting change',
    steps: [
      { type: 'user', icon: '👤', label: 'User asks', text: '"Email the team about the meeting change — moved to Thursday 2pm."' },
      { type: 'think', icon: '🧠', label: 'Agent thinks', text: 'I need to (1) look up the team email list, then (2) compose and send the email. This requires two tool calls in sequence.',
        code: '// Agent reasoning:\n// "email" + "team" → need contacts + email tool\n// Step 1: Get team list from contacts\n// Step 2: Send email with meeting update' },
      { type: 'tool', icon: '🔧', label: 'Tool call #1', text: 'First, looking up the team members...',
        code: 'contacts.search({\n  group: "engineering-team"\n})' },
      { type: 'response', icon: '📦', label: 'Tool response #1', text: 'Got the team\'s email addresses.',
        code: '{\n  "members": [\n    "alex@co.com", "jordan@co.com",\n    "sam@co.com", "riley@co.com"\n  ]\n}' },
      { type: 'tool', icon: '🔧', label: 'Tool call #2', text: 'Now composing and sending the email...',
        code: 'email.send({\n  to: ["alex@co.com", "jordan@co.com",\n       "sam@co.com", "riley@co.com"],\n  subject: "Meeting moved to Thu 2pm",\n  body: "Hi team, the weekly sync has\\n  been moved to Thursday at 2pm."\n})' },
      { type: 'result', icon: '✅', label: 'Agent responds', text: '"Done — emailed all 4 team members about the Thursday 2pm change." — The agent chained two tools together autonomously.' }
    ]
  },
  {
    emoji: '🧮', text: 'If I invest $10K at 7% for 20 years, what do I get?',
    steps: [
      { type: 'user', icon: '👤', label: 'User asks', text: '"If I invest $10,000 at 7% annual return for 20 years, what\'s the total?"' },
      { type: 'think', icon: '🧠', label: 'Agent thinks', text: 'This is a compound interest calculation. LLMs are bad at precise math — I should use the calculator tool instead of guessing.',
        code: '// Agent reasoning:\n// Math problem → use calculator for precision\n// Formula: A = P(1 + r)^t\n// LLMs hallucinate math. Tools don\'t.' },
      { type: 'tool', icon: '🔧', label: 'Tool call', text: 'Sending the compound interest formula to the calculator...',
        code: 'calculator.compute({\n  expression: "10000 * (1 + 0.07) ** 20"\n})' },
      { type: 'response', icon: '📦', label: 'Tool response', text: 'Calculator returns the precise result.',
        code: '{\n  "result": 38696.84\n}' },
      { type: 'result', icon: '✅', label: 'Agent responds', text: '"$10,000 at 7% annual return for 20 years compounds to $38,696.84. That\'s nearly 4x your initial investment." — Precise math, no hallucination.' }
    ]
  }
];

const completed = new Set();
const qGrid = document.getElementById('q-grid');
const dots = document.getElementById('dots');

questions.forEach((q, i) => {
  const card = document.createElement('div');
  card.className = 'q-card';
  card.dataset.idx = i;
  card.innerHTML = `<div class="q-emoji">${q.emoji}</div><div class="q-text">${q.text}</div>`;
  card.addEventListener('click', () => showFlow(i));
  qGrid.appendChild(card);

  const dot = document.createElement('div');
  dot.className = 'dot';
  dot.id = `dot-${i}`;
  dots.appendChild(dot);
});

async function showFlow(idx) {
  // Update active state
  qGrid.querySelectorAll('.q-card').forEach(c => c.classList.remove('active'));
  qGrid.querySelector(`[data-idx="${idx}"]`).classList.add('active');

  const viz = document.getElementById('flow-viz');
  viz.innerHTML = '';

  const q = questions[idx];
  for (let i = 0; i < q.steps.length; i++) {
    const s = q.steps[i];
    if (i > 0) {
      const conn = document.createElement('div');
      conn.className = 'connector';
      viz.appendChild(conn);
      await new Promise(r => setTimeout(r, 200));
      conn.classList.add('show');
    }
    const step = document.createElement('div');
    step.className = `flow-step step-${s.type}`;
    let codeHtml = s.code ? `<div class="step-code">${s.code}</div>` : '';
    step.innerHTML = `
      <div class="step-icon">${s.icon}</div>
      <div class="step-content">
        <div class="step-label">${s.label}</div>
        <div class="step-text">${s.text}</div>
        ${codeHtml}
      </div>
    `;
    viz.appendChild(step);
    await new Promise(r => setTimeout(r, 100));
    step.classList.add('show');
    await new Promise(r => setTimeout(r, 500));
  }

  completed.add(idx);
  document.getElementById(`dot-${idx}`).classList.add('done');
  qGrid.querySelector(`[data-idx="${idx}"]`).classList.add('done');

  if (completed.size >= 3) {
    setTimeout(() => {
      document.getElementById('complete').style.display = 'block';
      if (typeof LO !== 'undefined') LO.completeLesson('first_ai_agent', 7, 160);
    }, 500);
  }
}
</script>
