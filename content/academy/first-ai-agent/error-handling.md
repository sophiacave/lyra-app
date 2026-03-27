---
title: "Error Handling"
course: "first-ai-agent"
order: 8
type: "lesson"
free: false
---<nav class="nav">
  <a href="/academy/first-ai-agent/" class="logo">Build Your First AI Agent</a>
  <a href="/academy/first-ai-agent/" class="nav-link">← Course</a>
</nav>

<div class="content">
  <div class="lesson-num">Lesson 8 of 10</div>
  <h1>Error Handling</h1>
  <p class="subtitle">Agents fail. Good agents fail gracefully. For each scenario, pick the best recovery strategy.</p>

  <div class="progress-bar"></div>

  <div class="complete-section" id="complete">
    <h2>Lesson Complete!</h2>
    <p>You now know the 5 most common agent failure modes and how to handle each one. Resilient agents are deployable agents.</p>
    
  </div>
</div>

<script>
const scenarios = [
  {
    icon: 'tool', emoji: '🔧', title: 'Tool Failure',
    desc: 'Your agent tries to call the weather API, but the service is down. The agent needs weather data to complete the user\'s request.',
    terminal: [
      { cls: 't-agent', text: '> agent: Calling weather_api.get("Tokyo")...' },
      { cls: 't-error', text: '✗ ERROR 503: Service Unavailable — the server is running but temporarily cannot handle requests (overloaded or in maintenance)' },
      { cls: 't-error', text: '✗ Connection refused after 3 retries — the agent tried 3 times but the service never responded' },
      { cls: 't-info', text: '  What should the agent do now?' }
    ],
    options: [
      { text: 'Tell the user "I can\'t help with that" and stop', correct: false, why: 'Giving up immediately is the worst option. The user asked for weather — there might be other ways to get it.' },
      { text: 'Retry the same API call 100 times until it works', correct: false, why: 'Hammering a failing service wastes time and could get your API key rate-limited. Retries should have a cap.' },
      { text: 'Try an alternative tool (web search for weather), explain the fallback to the user', correct: true, why: 'This is graceful degradation. The agent adapts to failure by trying alternative paths while keeping the user informed. If the backup also fails, THEN escalate.' }
    ]
  },
  {
    icon: 'data', emoji: '📊', title: 'Bad Data',
    desc: 'The agent queries the database for user spending data, but gets results that are clearly wrong — negative spending amounts and dates from the future.',
    terminal: [
      { cls: 't-agent', text: '> agent: Querying expenses for Q4...' },
      { cls: 't-info', text: '  Result: { total: -$45,000, date: "2027-13-45" }' },
      { cls: 't-error', text: '✗ Data validation failed: negative amount (spending can\'t be negative), invalid date (month 13 and day 45 don\'t exist)' },
      { cls: 't-info', text: '  What should the agent do now?' }
    ],
    options: [
      { text: 'Use the data anyway — the database is the source of truth', correct: false, why: 'Garbage in, garbage out. Presenting clearly invalid data to the user destroys trust. The agent should never treat bad data as trustworthy.' },
      { text: 'Flag the anomaly, refuse to present invalid data, and suggest the user check the data source', correct: true, why: 'The agent validates data before using it. When validation fails, it\'s honest about the problem and points toward the root cause rather than presenting bad information.' },
      { text: 'Silently fix the data by removing the negative sign and adjusting the date', correct: false, why: 'The agent would be making assumptions about what the "correct" data should be. Silently altering data is dangerous — the real problem (corrupt database) would go unnoticed.' }
    ]
  },
  {
    icon: 'conflict', emoji: '⚔️', title: 'Conflicting Goals',
    desc: 'User says "Send this confidential report to everyone in the company." The agent\'s guardrails say confidential documents can only go to authorized recipients.',
    terminal: [
      { cls: 't-agent', text: '> agent: Preparing to send confidential_report.pdf...' },
      { cls: 't-info', text: '  Recipients: all_company (342 people)' },
      { cls: 't-error', text: '✗ GUARDRAIL CONFLICT: document marked "confidential" but send target is "all_company" — guardrails restrict confidential docs to authorized recipients only' },
      { cls: 't-info', text: '  What should the agent do now?' }
    ],
    options: [
      { text: 'Override the guardrail — the user explicitly asked for it', correct: false, why: 'Guardrails exist for a reason. An agent that overrides its own safety rules whenever a user asks is an agent that can\'t be trusted. This could cause a serious data breach.' },
      { text: 'Explain the conflict, refuse the unsafe action, and suggest a safe alternative (send to authorized list only, or ask for override approval from an admin)', correct: true, why: 'The agent respects its guardrails while being helpful. It explains WHY it can\'t comply and offers a path forward. This builds trust.' },
      { text: 'Silently send it only to authorized recipients without telling the user', correct: false, why: 'Silently changing what the user asked for is deceptive. The user would think everyone got it, but only some did. Always be transparent about what you did and why.' }
    ]
  },
  {
    icon: 'user', emoji: '😕', title: 'User Confusion',
    desc: 'The user sends: "Do the thing with the stuff from last time." The agent has no clear instruction and no memory of "last time."',
    terminal: [
      { cls: 't-agent', text: '> agent: Processing user request...' },
      { cls: 't-info', text: '  Intent: unclear | Context: none | Confidence: 12% — the agent is only 12% sure it understands what the user wants' },
      { cls: 't-error', text: '✗ Cannot determine action: the request is too vague to act on safely' },
      { cls: 't-info', text: '  What should the agent do now?' }
    ],
    options: [
      { text: 'Guess what the user meant based on common requests and execute it', correct: false, why: 'Guessing with 12% confidence is reckless. The agent could take a completely wrong action — potentially an irreversible one. When in doubt, ask.' },
      { text: 'Ask a specific clarifying question: "I want to help! Could you tell me: (1) what action to take, and (2) which data from our previous work you\'re referring to?"', correct: true, why: 'Asking for clarification is NOT weakness — it\'s intelligence. Good agents know the boundary between confident action and dangerous guessing. The question is specific, not vague.' },
      { text: 'Reply "I don\'t understand" and wait', correct: false, why: 'This is technically safe but unhelpful. The agent should guide the user toward a clear request, not just state its confusion. Be proactive in resolving ambiguity.' }
    ]
  },
  {
    icon: 'loop', emoji: '🔄', title: 'Infinite Loop',
    desc: 'The agent is trying to fix a failing test. It changes the code, runs the test, the test fails differently, it changes the code again, runs the test... 47 iterations and counting.',
    terminal: [
      { cls: 't-agent', text: '> agent: Attempt #47 — modifying test_auth.py...' },
      { cls: 't-error', text: '✗ Test failed: AssertionError — the code produced a different result than expected (a new, different failure each time)' },
      { cls: 't-agent', text: '> agent: Attempt #48 — trying different approach...' },
      { cls: 't-error', text: '✗ LOOP DETECTED: 48 attempts with zero progress over 23 minutes — the agent is stuck repeating without making headway' },
      { cls: 't-info', text: '  What should the agent do now?' }
    ],
    options: [
      { text: 'Keep trying — the 49th attempt might work', correct: false, why: 'After 48 failed attempts with no progress, continuing is wasteful. The definition of insanity applies. The agent needs a circuit breaker.' },
      { text: 'Stop, summarize what was tried and what failed, escalate to a human with full context', correct: true, why: 'A good agent knows when to stop. It provides a detailed summary of attempts so the human doesn\'t start from scratch. This is the most productive handoff possible.' },
      { text: 'Delete the test file so the test can\'t fail anymore', correct: false, why: 'This is the AI equivalent of hiding the problem. The test exists for a reason. Deleting it "solves" the symptom while creating a much bigger problem.' }
    ]
  }
];

let solved = 0;
const container = document.getElementById('scenarios');

scenarios.forEach((s, si) => {
  const div = document.createElement('div');
  div.className = 'scenario';
  div.id = `scenario-${si}`;

  let terminalHtml = s.terminal.map(l => `<div class="t-line ${l.cls}">${l.text}</div>`).join('');
  let optionsHtml = s.options.map((o, oi) => `
    <div class="option" data-scenario="${si}" data-option="${oi}" onclick="pickOption(${si},${oi})">
      <div class="option-label">${String.fromCharCode(65 + oi)}. ${o.text}</div>
      <div class="option-why">${o.why}</div>
    </div>
  `).join('');

  div.innerHTML = `
    <div class="scenario-header">
      <div class="error-icon ${s.icon}">${s.emoji}</div>
      <div class="scenario-title">${s.title}</div>
    </div>
    <div class="scenario-desc">${s.desc}</div>
    <div class="terminal">${terminalHtml}</div>
    <div class="options">${optionsHtml}</div>
  `;
  container.appendChild(div);
});

function pickOption(si, oi) {
  const scenario = document.getElementById(`scenario-${si}`);
  if (scenario.classList.contains('resolved')) return;

  const options = scenario.querySelectorAll('.option');
  const picked = scenarios[si].options[oi];

  options.forEach((opt, i) => {
    const isCorrect = scenarios[si].options[i].correct;
    if (i === oi) {
      opt.classList.add(picked.correct ? 'correct' : 'wrong');
    }
    if (isCorrect && !picked.correct) {
      opt.classList.add('correct');
    }
  });

  scenario.classList.add('resolved');
  solved++;
  document.getElementById('prog-fill').style.width = (solved / 5 * 100) + '%';

  if (solved === 5) {
    setTimeout(() => {
      document.getElementById('complete').style.display = 'block';
      if (typeof LO !== 'undefined') LO.completeLesson('first_ai_agent', 8, 160);
    }, 600);
  }
}
</script>
