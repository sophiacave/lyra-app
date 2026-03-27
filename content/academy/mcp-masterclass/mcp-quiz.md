---
title: "MCP Quiz"
course: "mcp-masterclass"
order: 10
type: "quiz"
free: false
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>
  <a href="index.html" class="nav-link">&larr; Course Overview</a>
</nav>

<div class="lesson-container">
  <div class="lesson-badge">Module 3 &middot; Lesson 10</div>
  <h1>MCP Mastery Quiz</h1>
  <p class="subtitle">Test your knowledge across all three modules — architecture, server building, tool definitions, security, and production patterns.</p>

  <div class="quiz-progress">
    <div class="quiz-dots" id="quizDots"></div>
    <div class="quiz-score" id="quizScore">0 / 10</div>
  </div>

  <div id="questionArea"></div>
  <div class="results" id="results"></div>

  <button class="complete-btn" id="completeBtn" onclick="complete()" style="display:none">Complete Course &mdash; Earn 100 XP</button>
  <a href="index.html" class="back-link">&larr; Back to Course Overview</a>
</div>

<script>
const questions = [
  {
    q: 'What does MCP stand for?',
    opts: ['Machine Connection Protocol', 'Model Context Protocol', 'Multi-Channel Platform', 'Module Computation Pipeline'],
    correct: 1,
    explain: 'MCP stands for Model Context Protocol. It\'s an open standard created by Anthropic that defines how AI models communicate with external tools and data sources.'
  },
  {
    q: 'What are the three components of MCP architecture?',
    opts: ['Client, Server, Database', 'Host, MCP Client, MCP Server', 'Browser, API, Model', 'Frontend, Backend, Database'],
    correct: 1,
    explain: 'The three MCP components are: Host (the AI application like Claude Desktop), MCP Client (the protocol bridge), and MCP Server (your tool or data source).'
  },
  {
    q: 'What transport protocols does MCP support?',
    opts: ['HTTP and WebSocket only', 'gRPC and REST', 'stdio and HTTP with Server-Sent Events (SSE)', 'TCP/IP sockets only'],
    correct: 2,
    explain: 'MCP supports two transport mechanisms: stdio (standard input/output, ideal for local servers) and HTTP with Server-Sent Events (SSE) for remote servers.'
  },
  {
    q: 'In the server.tool() method, what are the three arguments?',
    opts: ['url, method, callback', 'name, schema, handler', 'route, middleware, controller', 'endpoint, params, response'],
    correct: 1,
    explain: 'server.tool() takes three arguments: name (a string identifier), schema (a Zod schema defining input parameters), and handler (an async function that executes the tool logic).'
  },
  {
    q: 'What are the three MCP primitives?',
    opts: ['Read, Write, Execute', 'Input, Output, Error', 'Tools, Resources, Prompts', 'Query, Mutation, Subscription'],
    correct: 2,
    explain: 'The three MCP primitives are: Tools (actions the AI can take), Resources (data the AI can read), and Prompts (templates the AI can use). Each serves a different purpose.'
  },
  {
    q: 'How does an MCP Server differ from a direct tool call?',
    opts: ['There is no difference', 'Servers are faster', 'Servers are long-running, expose multiple tools, and maintain state', 'Servers only work with Claude'],
    correct: 2,
    explain: 'MCP Servers are long-running processes that expose multiple tools, maintain state across calls (like DB connections), and support automatic tool discovery. Direct tool calls are one-off and stateless.'
  },
  {
    q: 'Where do you configure MCP servers for Claude Desktop?',
    opts: ['In the Claude Desktop UI settings', 'In claude_desktop_config.json', 'In the server\'s package.json', 'In a .env file'],
    correct: 1,
    explain: 'MCP servers are configured in claude_desktop_config.json, located in ~/Library/Application Support/Claude/ on macOS or %APPDATA%\\Claude\\ on Windows.'
  },
  {
    q: 'What happens during the MCP capability negotiation phase?',
    opts: ['The user manually selects which tools to enable', 'Claude sends initialize, then lists available tools from the server', 'The server pushes notifications to Claude', 'The client uploads all data to the server'],
    correct: 1,
    explain: 'During negotiation, Claude sends an initialize request with its protocol version, the server responds with capabilities, then Claude sends tools/list to discover all available tools.'
  },
  {
    q: 'Which security practice prevents a prompt injection from executing DROP TABLE?',
    opts: ['Rate limiting', 'Audit logging', 'Principle of least privilege', 'Transport security'],
    correct: 2,
    explain: 'Principle of least privilege means connecting with minimal permissions (e.g., read-only DB user). Even if a prompt injection gets through, destructive queries are impossible because the server doesn\'t have permission.'
  },
  {
    q: 'Which MCP primitive would you use to give Claude access to your project\'s README without executing any code?',
    opts: ['A Tool that reads the file', 'A Resource that exposes the file', 'A Prompt with the content embedded', 'A Server with full filesystem access'],
    correct: 1,
    explain: 'Resources are read-only data exposed through MCP. A resource like file://project/README.md gives the AI access to the content without executing any action — it\'s the safest, most appropriate primitive for read-only data.'
  }
];

let currentQ = 0;
let answers = [];
let score = 0;

function renderDots(){
  document.getElementById('quizDots').innerHTML = questions.map((_, i) => {
    let cls = 'quiz-dot';
    if(i === currentQ && answers[i] === undefined) cls += ' current';
    if(answers[i] !== undefined) cls += answers[i] ? ' correct' : ' wrong';
    return `<div class="${cls}"></div>`;
  }).join('');
  document.getElementById('quizScore').textContent = `${score} / ${questions.length}`;
}

function renderQuestion(){
  if(currentQ >= questions.length){
    showResults();
    return;
  }
  const q = questions[currentQ];
  const area = document.getElementById('questionArea');
  area.innerHTML = `
    <div class="question-card">
      <div class="question-header">
        <div class="question-num">Question ${currentQ + 1} of ${questions.length}</div>
        <div class="question-text">${q.q}</div>
      </div>
      <div class="question-body">
        <div class="options">
          ${q.opts.map((opt, i) => `
            <div class="option" onclick="selectOption(${i})" id="opt${i}">
              <div class="option-letter">${String.fromCharCode(65+i)}</div>
              <div class="option-text">${opt}</div>
            </div>
          `).join('')}
        </div>
        <div class="explanation" id="explanation"></div>
        <button class="submit-btn" id="submitBtn" onclick="submitAnswer()" disabled>Check Answer</button>
      </div>
    </div>
  `;
  renderDots();
}

let selectedOpt = null;

function selectOption(i){
  if(answers[currentQ] !== undefined) return;
  selectedOpt = i;
  document.querySelectorAll('.option').forEach((el, j) => {
    el.classList.toggle('selected', j === i);
  });
  document.getElementById('submitBtn').disabled = false;
}

function submitAnswer(){
  if(selectedOpt === null || answers[currentQ] !== undefined) return;
  const q = questions[currentQ];
  const isCorrect = selectedOpt === q.correct;
  answers[currentQ] = isCorrect;
  if(isCorrect) score++;

  // Show correct/wrong
  document.querySelectorAll('.option').forEach((el, i) => {
    el.classList.add('disabled');
    if(i === q.correct) el.classList.add('correct');
    if(i === selectedOpt && !isCorrect) el.classList.add('wrong');
  });

  // Show explanation
  const exp = document.getElementById('explanation');
  exp.className = `explanation visible ${isCorrect ? 'correct-exp' : 'wrong-exp'}`;
  exp.textContent = (isCorrect ? 'Correct! ' : 'Not quite. ') + q.explain;

  // Sound
  if(typeof LO !== 'undefined' && LO.sfx){
    isCorrect ? LO.sfx.success() : LO.sfx.error();
  }

  // Update button
  const btn = document.getElementById('submitBtn');
  btn.textContent = currentQ < questions.length - 1 ? 'Next Question' : 'See Results';
  btn.onclick = () => { currentQ++; selectedOpt = null; renderQuestion(); };

  renderDots();
}

function showResults(){
  document.getElementById('questionArea').style.display = 'none';
  const pct = Math.round((score / questions.length) * 100);
  let grade = 'ok';
  if(pct === 100) grade = 'perfect';
  else if(pct >= 70) grade = 'good';

  const results = document.getElementById('results');
  results.className = 'results visible';
  results.innerHTML = `
    <div class="big-score ${grade}">${pct}%</div>
    <div class="score-label">${score} out of ${questions.length} correct</div>
    <div class="xp-earned">+100 XP</div>
    <p style="color:#a1a1aa;font-size:.9rem;margin-top:1rem">${
      pct === 100 ? 'Perfect score! You have mastered MCP inside and out.' :
      pct >= 70 ? 'Strong showing! You have a solid grasp of MCP concepts.' :
      'Review the lessons and try again. MCP mastery takes practice.'
    }</p>
  `;

  document.getElementById('completeBtn').style.display = 'block';
  renderDots();

  // Auto-complete if score >= 60%
  if(pct >= 60){
    const progress = JSON.parse(localStorage.getItem('mcp-masterclass-progress')||'{}');
    if(!progress['mcp-quiz']){
      progress['mcp-quiz'] = true;
      localStorage.setItem('mcp-masterclass-progress', JSON.stringify(progress));
      LO.completeLesson('mcp-masterclass', 10, 100);
      if(pct === 100 && typeof LO !== 'undefined') LO.unlockAchievement('quiz_master');
    }
    const btn = document.getElementById('completeBtn');
    btn.textContent = 'Course Complete!';
    btn.disabled = true;
  }
}

function complete(){
  const btn = document.getElementById('completeBtn');
  if(btn.disabled) return;
  const progress = JSON.parse(localStorage.getItem('mcp-masterclass-progress')||'{}');
  progress['mcp-quiz'] = true;
  localStorage.setItem('mcp-masterclass-progress', JSON.stringify(progress));
  LO.completeLesson('mcp-masterclass', 10, 100);
  btn.textContent = 'Course Complete!';
  btn.disabled = true;
}

// Check if already done
(function(){
  const progress = JSON.parse(localStorage.getItem('mcp-masterclass-progress')||'{}');
  if(progress['mcp-quiz']){
    document.getElementById('completeBtn').style.display = 'block';
    document.getElementById('completeBtn').textContent = 'Course Complete!';
    document.getElementById('completeBtn').disabled = true;
  }
})();

renderQuestion();
</script>
