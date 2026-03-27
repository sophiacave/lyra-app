---
title: "Agent Quiz"
course: "first-ai-agent"
order: 10
type: "quiz"
free: false
---<nav class="nav">
  <a href="/academy/first-ai-agent/" class="logo">Build Your First AI Agent</a>
  <a href="/academy/first-ai-agent/" class="nav-link">← Course</a>
</nav>

<div class="content">
  <div class="lesson-num">Lesson 10 of 10 — Final Quiz</div>
  <h1>Agent Mastery Quiz</h1>
  <p class="subtitle">8 questions covering everything you've learned. Prove you understand agent fundamentals.</p>

  <div class="progress-label" id="prog-label">Question 0 of 8</div>
  <div class="progress-bar"></div>

  <div class="results" id="results">
    <div class="results-score" id="results-score">0/8</div>
    <div class="results-breakdown">
      <div class="rb-item"><div class="rb-num" id="rb-correct" style="color:#06b6d4">0</div><div class="rb-label">Correct</div></div>
      <div class="rb-item"><div class="rb-num" id="rb-wrong" style="color:#ef4444">0</div><div class="rb-label">Incorrect</div></div>
      <div class="rb-item"><div class="rb-num" id="rb-xp" style="color:#a855f7">0</div><div class="rb-label">XP Earned</div></div>
    </div>
    <a href="/academy/first-ai-agent/" class="next-btn">Back to Course Overview</a>
  </div>
</div>

<script>
const questions = [
  {
    q: 'What is the fundamental difference between a chatbot and an agent?',
    answers: [
      'Agents use more advanced AI models',
      'Agents can perceive, decide, act, and loop autonomously — chatbots just respond once',
      'Chatbots are free, agents cost money',
      'Agents always use voice, chatbots use text'
    ],
    correct: 1,
    explanation: 'The core difference is the agent loop: perceive → think → act → observe → learn → repeat. A chatbot does one thing: you ask, it answers. An agent operates autonomously toward a goal.'
  },
  {
    q: 'What happens in the "Observe" step of the agent loop?',
    answers: [
      'The agent watches the user type',
      'The agent looks at its training data',
      'The agent checks the result of its action to see if it succeeded or failed',
      'The agent observes other agents working'
    ],
    correct: 2,
    explanation: 'Observation is the feedback step. After taking an action (calling a tool), the agent checks the result. Did it work? Did it fail? Was the data good? This closes the loop and enables self-correction.'
  },
  {
    q: 'Why does an agent need tools?',
    answers: [
      'To look more professional',
      'Without tools, an agent can only generate text — tools let it actually DO things in the real world',
      'Tools make the AI faster',
      'Tools are optional — agents work fine without them'
    ],
    correct: 1,
    explanation: 'Tools are what separate agents from chatbots. Without tools, an agent can only generate text. With tools (APIs, databases, email, etc.), it can take actions, retrieve real data, and interact with the world.'
  },
  {
    q: 'What should a system prompt for an agent include?',
    answers: [
      'Just the agent\'s name',
      'Only a list of available tools',
      'Identity, goal, available tools, memory instructions, guardrails, and output format',
      'A copy of the agent\'s training data'
    ],
    correct: 2,
    explanation: 'A complete agent system prompt covers all six blocks: Identity (who it is), Goal (what it\'s trying to do), Tools (what it can use), Memory (what it should remember), Guardrails (what it must never do), and Output Format (how to respond).'
  },
  {
    q: 'What\'s the main advantage of long-term memory over short-term memory?',
    answers: [
      'Long-term memory is faster',
      'Long-term memory persists across sessions, so the agent improves over time instead of starting fresh',
      'Long-term memory is cheaper',
      'Short-term memory doesn\'t actually exist'
    ],
    correct: 1,
    explanation: 'Short-term memory helps within a single session but is lost when the session ends. Long-term memory persists — the agent remembers what worked, what failed, and user preferences across all interactions. This is how agents get genuinely smarter over time.'
  },
  {
    q: 'When an agent\'s tool call fails, what\'s the best recovery strategy?',
    answers: [
      'Retry the exact same call 100 times',
      'Tell the user "I can\'t do that" and stop',
      'Try an alternative approach (fallback tool), and explain what happened to the user',
      'Ignore the error and make up a response'
    ],
    correct: 2,
    explanation: 'Graceful degradation: try alternatives first, be transparent about what happened, and only escalate if all fallbacks fail. Never hammer a failing service, give up immediately, or fabricate data.'
  },
  {
    q: 'An agent encounters a user request that conflicts with its guardrails. What should it do?',
    answers: [
      'Override the guardrail — the user asked for it',
      'Silently do something different from what was asked',
      'Explain the conflict, refuse the unsafe action, and suggest a safe alternative',
      'Shut down completely'
    ],
    correct: 2,
    explanation: 'Guardrails exist for safety. The agent should never override them, but it should be helpful — explain WHY it can\'t comply and offer an alternative path that achieves the user\'s goal safely.'
  },
  {
    q: 'Which 5 dimensions should you evaluate an agent on before deploying?',
    answers: [
      'Speed, color, size, weight, and temperature',
      'Accuracy, speed, reliability, cost efficiency, and user satisfaction',
      'Number of tools, model size, training data, compute, and uptime',
      'Revenue, profit, growth, retention, and churn'
    ],
    correct: 1,
    explanation: 'The five evaluation dimensions are: Accuracy (does it give correct answers?), Speed (how fast?), Reliability (does it work consistently?), Cost Efficiency (affordable at scale?), and User Satisfaction (are people happy?). All five need to meet your threshold before deploying.'
  }
];

let answered = 0;
let correct = 0;
const quizDiv = document.getElementById('quiz');

questions.forEach((q, qi) => {
  const div = document.createElement('div');
  div.className = 'question';
  div.id = `q-${qi}`;

  let answersHtml = q.answers.map((a, ai) => `
    <div class="answer" data-q="${qi}" data-a="${ai}" onclick="pickAnswer(${qi},${ai})">${String.fromCharCode(65 + ai)}. ${a}</div>
  `).join('');

  div.innerHTML = `
    <div class="q-num">Question ${qi + 1}</div>
    <div class="q-text">${q.q}</div>
    <div class="answers">${answersHtml}</div>
    <div class="explanation" id="exp-${qi}">${q.explanation}</div>
  `;
  quizDiv.appendChild(div);
});

function pickAnswer(qi, ai) {
  const qDiv = document.getElementById(`q-${qi}`);
  if (qDiv.classList.contains('answered')) return;
  qDiv.classList.add('answered');

  const isCorrect = ai === questions[qi].correct;
  if (isCorrect) correct++;
  answered++;

  const answers = qDiv.querySelectorAll('.answer');
  answers.forEach((a, i) => {
    a.classList.add('locked');
    if (i === ai) a.classList.add(isCorrect ? 'selected-correct' : 'selected-wrong');
    if (i === questions[qi].correct && !isCorrect) a.classList.add('reveal-correct');
  });

  qDiv.classList.add(isCorrect ? 'correct-q' : 'wrong-q');
  document.getElementById(`exp-${qi}`).style.display = 'block';

  document.getElementById('prog-fill').style.width = (answered / 8 * 100) + '%';
  document.getElementById('prog-label').textContent = `Question ${answered} of 8`;

  if (answered === 8) {
    setTimeout(showResults, 800);
  }
}

function showResults() {
  const pct = Math.round(correct / 8 * 100);
  document.getElementById('results-score').textContent = `${correct}/8`;
  document.getElementById('rb-correct').textContent = correct;
  document.getElementById('rb-wrong').textContent = 8 - correct;

  let xpEarned = 160;
  if (correct === 8) xpEarned = 160;

  document.getElementById('rb-xp').textContent = xpEarned;

  let text, sub;
  if (correct === 8) { text = 'Perfect Score!'; sub = 'You\'ve mastered every concept. You\'re ready to build real agents.'; }
  else if (correct >= 6) { text = 'Great Job!'; sub = 'You understand agent fundamentals. Review the ones you missed and you\'re ready.'; }
  else if (correct >= 4) { text = 'Solid Foundation'; sub = 'You\'re getting there. Review the lessons for the concepts you missed.'; }
  else { text = 'Keep Learning'; sub = 'Go back through the lessons and try the quiz again. You\'ll get it.'; }

  document.getElementById('results-text').textContent = text;
  document.getElementById('results-sub').textContent = sub;
  document.getElementById('results').style.display = 'block';

  if (typeof LO !== 'undefined') {
    LO.completeLesson('first_ai_agent', 10, xpEarned);
    if (correct === 8) LO.unlockAchievement('quiz_master');
  }
}
</script>
