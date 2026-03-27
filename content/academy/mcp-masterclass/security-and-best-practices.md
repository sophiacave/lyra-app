---
title: "Security and Best Practices"
course: "mcp-masterclass"
order: 9
type: "lesson"
free: false
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>
  <a href="index.html" class="nav-link">&larr; Course Overview</a>
</nav>

<div class="lesson-container">
  <div class="lesson-badge">Module 3 &middot; Lesson 9</div>
  <h1>Security & Best Practices</h1>
  <p class="subtitle">MCP gives AI real-world power. With great power comes great responsibility. Master these 10 security practices before deploying to production.</p>

  <div class="checklist-progress">
    <div class="progress-bar-wrap"><div class="progress-bar-fill" id="progressFill"></div></div>
    <div class="progress-text" id="progressText">0 / 10</div>
  </div>

  <div class="checklist" id="checklist"></div>

  <button class="complete-btn" id="completeBtn" onclick="complete()">Complete Lesson &mdash; Earn 200 XP</button>
  <a href="mcp-quiz.html" class="next-link">Next: MCP Mastery Quiz &rarr;</a>
</div>

<script>
const items = [
  {
    title:'Authentication & Authorization',
    attack:'An attacker connects to your MCP server with no credentials. They can now query your database, read your files, and execute arbitrary operations through the AI.',
    protected:'Server requires API keys or OAuth tokens. Each connection is authenticated before any tool calls are processed. Unauthorized connections are rejected immediately.'
  },
  {
    title:'Principle of Least Privilege',
    attack:'Your database server has full admin access. A prompt injection tricks the AI into running DROP TABLE, destroying your production data.',
    protected:'The database server connects with a read-only user. Write operations are limited to specific tables. Destructive queries (DROP, TRUNCATE) are blocked at the server level.'
  },
  {
    title:'Input Validation & Sanitization',
    attack:'A user asks Claude to search for files with a path like "../../etc/passwd". The filesystem server follows the path traversal and exposes system files.',
    protected:'All inputs are validated against strict schemas. Path parameters are resolved and checked against an allowed directory whitelist. SQL inputs are parameterized.'
  },
  {
    title:'Rate Limiting',
    attack:'A runaway AI loop calls your API server 10,000 times in a minute. You hit rate limits, get throttled or banned, and rack up massive API costs.',
    protected:'Server enforces per-minute and per-hour call limits. Exponential backoff on repeated failures. Cost-aware limits that prevent unexpected billing spikes.'
  },
  {
    title:'Sandboxing & Isolation',
    attack:'Your MCP server runs with the same permissions as your user account. A malicious tool call modifies system files or accesses sensitive credentials.',
    protected:'Server runs in a sandboxed environment (container, VM, or restricted user). File access is limited to explicit directories. Network access is filtered.'
  },
  {
    title:'Audit Logging',
    attack:'Something goes wrong — data is modified, a message is sent, a file is deleted — but you have no record of what happened or which tool call caused it.',
    protected:'Every tool invocation is logged with timestamp, parameters, caller identity, and result. Logs are immutable and retained for compliance review.'
  },
  {
    title:'Error Handling & Information Leakage',
    attack:'A failed database query returns the full stack trace including your connection string, database password, and internal network topology.',
    protected:'Errors are caught and sanitized before returning to the AI. Internal details (passwords, paths, IPs) are stripped. Only safe, user-friendly error messages are returned.'
  },
  {
    title:'Transport Security',
    attack:'An MCP server communicates over unencrypted HTTP. A man-in-the-middle intercepts the JSON-RPC messages and reads sensitive query results.',
    protected:'Remote servers use HTTPS/TLS for all communication. Local servers use stdio (which never leaves the machine). Auth tokens are never sent in URLs.'
  },
  {
    title:'Tool Description Accuracy',
    attack:'A vague tool description causes Claude to misuse the tool — calling a delete function when it meant to call a read function, destroying data.',
    protected:'Every tool has a precise, unambiguous description. Parameter names and descriptions clearly indicate their purpose. Destructive tools are clearly marked.'
  },
  {
    title:'Human-in-the-Loop for Destructive Actions',
    attack:'Claude autonomously executes a mass-delete operation based on a misunderstood user request. Thousands of records are permanently removed.',
    protected:'Destructive operations (delete, overwrite, send) require explicit user confirmation via the Host application. The AI proposes the action; the human approves it.'
  }
];

let checked = new Set();

function render(){
  const list = document.getElementById('checklist');
  list.innerHTML = items.map((item, i) => `
    <div class="check-item${checked.has(i)?' checked':''}" id="item${i}">
      <div class="check-header" onclick="toggleItem(${i})">
        <div class="check-box" onclick="event.stopPropagation();toggleCheck(${i})">${checked.has(i)?'&#x2713;':''}</div>
        <div class="check-title">${item.title}</div>
        <div class="check-num">#${i+1}</div>
        <div class="check-expand">&#x25BC;</div>
      </div>
      <div class="check-detail">
        <div class="check-detail-inner">
          <div class="scenario attack">
            <h4>&#x26A0;&#xFE0F; Without This Practice</h4>
            <p>${item.attack}</p>
          </div>
          <div class="scenario protected">
            <h4>&#x1F6E1;&#xFE0F; With This Practice</h4>
            <p>${item.protected}</p>
          </div>
        </div>
      </div>
    </div>
  `).join('');
  updateProgress();
}

function toggleItem(i){
  document.getElementById('item'+i).classList.toggle('open');
}

function toggleCheck(i){
  if(checked.has(i)){
    checked.delete(i);
  } else {
    checked.add(i);
    if(typeof LO !== 'undefined' && LO.sfx) LO.sfx.click();
  }
  render();
  // Reopen the item
  document.getElementById('item'+i).classList.add('open');
}

function updateProgress(){
  const pct = Math.round((checked.size / items.length) * 100);
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('progressText').textContent = checked.size + ' / ' + items.length;
}

render();

function complete(){
  const btn = document.getElementById('completeBtn');
  if(btn.disabled) return;
  const progress = JSON.parse(localStorage.getItem('mcp-masterclass-progress')||'{}');
  progress['security-and-best-practices'] = true;
  localStorage.setItem('mcp-masterclass-progress', JSON.stringify(progress));
  LO.completeLesson('mcp-masterclass', 9, 200);
  btn.textContent = 'Lesson Complete!';
  btn.disabled = true;
}
(function(){
  const progress = JSON.parse(localStorage.getItem('mcp-masterclass-progress')||'{}');
  if(progress['security-and-best-practices']){
    const btn = document.getElementById('completeBtn');
    btn.textContent = 'Lesson Complete!';
    btn.disabled = true;
  }
})();
</script>
