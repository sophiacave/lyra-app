---
title: "Resources and Prompts"
course: "mcp-masterclass"
order: 6
type: "lesson"
free: false
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>
  
</nav>

<div class="lesson-container">
  <div class="lesson-badge">Module 2 &middot; Lesson 6</div>
  <h1>Resources & Prompts</h1>
  <p class="subtitle">MCP has three primitives: Tools, Resources, and Prompts. Each serves a different purpose in connecting AI to the world.</p>

  <div class="section">
    <h2>The Three MCP Primitives</h2>
    <p>Click each primitive to explore how it works, see examples, and understand the data flow:</p>

    <div class="primitives">
      <div class="primitive-card tools-card active" onclick="showPrimitive('tools')">
        <div class="icon">&#x2699;&#xFE0F;</div>
        <h3>Tools</h3>
        <p>Actions the AI can take</p>
      </div>
      <div class="primitive-card resources-card" onclick="showPrimitive('resources')">
        <div class="icon">&#x1F4C4;</div>
        <h3>Resources</h3>
        <p>Data the AI can read</p>
      </div>
      <div class="primitive-card prompts-card" onclick="showPrimitive('prompts')">
        <div class="icon">&#x1F4DD;</div>
        <h3>Prompts</h3>
        <p>Templates the AI can use</p>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Side-by-Side Comparison</h2>
    <table class="comparison-table">
      <thead>
        <tr><th>Aspect</th><th style="color:#8b5cf6">Tools</th><th style="color:#34d399">Resources</th><th style="color:#fb923c">Prompts</th></tr>
      </thead>
      <tbody>
        <tr><td><strong>Direction</strong></td><td>AI &rarr; World</td><td>World &rarr; AI</td><td>User &rarr; AI</td></tr>
        <tr><td><strong>Triggered by</strong></td><td>AI model decides</td><td>Client/user requests</td><td>User selects</td></tr>
        <tr><td><strong>Purpose</strong></td><td>Execute actions</td><td>Provide context</td><td>Structure interactions</td></tr>
        <tr><td><strong>Example</strong></td><td>Write a file</td><td>Read config data</td><td>Code review template</td></tr>
        <tr><td><strong>State change</strong></td><td>Yes (side effects)</td><td>No (read-only)</td><td>No (templates only)</td></tr>
        <tr><td><strong>Discovery</strong></td><td>tools/list</td><td>resources/list</td><td>prompts/list</td></tr>
      </tbody>
    </table>
  </div>

  <button class="complete-btn" id="completeBtn" onclick="complete()">Complete Lesson &mdash; Earn 200 XP</button>
  
</div>

<script>
const primitives = {
  tools: {
    title: 'Tools — Actions AI Can Take',
    titleColor: '#8b5cf6',
    desc: 'Tools are functions that the AI model can invoke to perform actions in the real world. They are the most common MCP primitive. The AI reads the tool definition (name + description + schema) and decides autonomously when to call it.',
    flow: [
      {label:'User asks question', bg:'rgba(255,255,255,.05)', color:'#e5e5e5'},
      {label:'AI decides to use tool', bg:'rgba(139,92,246,.15)', color:'#8b5cf6'},
      {label:'Client sends tools/call', bg:'rgba(251,146,60,.15)', color:'#fb923c'},
      {label:'Server executes action', bg:'rgba(52,211,153,.15)', color:'#34d399'},
      {label:'Result flows back to AI', bg:'rgba(139,92,246,.15)', color:'#8b5cf6'},
    ],
    examples: [
      {icon:'&#x1F4DD;', title:'write_file', desc:'Creates or overwrites a file at a given path. AI uses this when asked to generate code, configs, or documents.'},
      {icon:'&#x1F50D;', title:'search_codebase', desc:'Searches across files using regex or semantic matching. AI uses this to find relevant code before making changes.'},
      {icon:'&#x1F4E7;', title:'send_slack_message', desc:'Posts a message to a Slack channel. AI uses this when asked to notify a team or share updates.'},
      {icon:'&#x1F4CA;', title:'query_database', desc:'Executes a SQL query and returns results. AI uses this to fetch data needed to answer questions.'},
    ]
  },
  resources: {
    title: 'Resources — Data AI Can Read',
    titleColor: '#34d399',
    desc: 'Resources are read-only data that MCP servers expose to the AI. Unlike tools (which the AI invokes), resources are typically requested by the client application or the user. They provide context that helps the AI generate better responses.',
    flow: [
      {label:'Client lists resources', bg:'rgba(255,255,255,.05)', color:'#e5e5e5'},
      {label:'User/app selects one', bg:'rgba(52,211,153,.15)', color:'#34d399'},
      {label:'Client sends resources/read', bg:'rgba(251,146,60,.15)', color:'#fb923c'},
      {label:'Server returns data', bg:'rgba(52,211,153,.15)', color:'#34d399'},
      {label:'Data added to AI context', bg:'rgba(139,92,246,.15)', color:'#8b5cf6'},
    ],
    examples: [
      {icon:'&#x1F4C4;', title:'file://project/README.md', desc:'Exposes a project file as a readable resource. The AI gets the file content as context without executing any action.'},
      {icon:'&#x1F4BE;', title:'db://users/schema', desc:'Exposes the database schema. The AI can read table structures to write better queries without guessing.'},
      {icon:'&#x2699;&#xFE0F;', title:'config://app/settings', desc:'Exposes application configuration. The AI knows the app\'s current settings when making recommendations.'},
      {icon:'&#x1F4CA;', title:'metrics://dashboard/today', desc:'Exposes real-time metrics. The AI can reference current performance data in its responses.'},
    ]
  },
  prompts: {
    title: 'Prompts — Templates AI Can Use',
    titleColor: '#fb923c',
    desc: 'Prompts are reusable templates that MCP servers provide to structure AI interactions. They are user-facing — the client application presents them as options the user can select. Think of them as pre-built workflows or conversation starters.',
    flow: [
      {label:'Client lists prompts', bg:'rgba(255,255,255,.05)', color:'#e5e5e5'},
      {label:'User picks a prompt', bg:'rgba(251,146,60,.15)', color:'#fb923c'},
      {label:'Client sends prompts/get', bg:'rgba(251,146,60,.15)', color:'#fb923c'},
      {label:'Server returns messages', bg:'rgba(52,211,153,.15)', color:'#34d399'},
      {label:'Messages sent to AI', bg:'rgba(139,92,246,.15)', color:'#8b5cf6'},
    ],
    examples: [
      {icon:'&#x1F50D;', title:'review-code', desc:'A code review template with arguments for language and focus area. Structures the AI to give consistent, thorough reviews.'},
      {icon:'&#x1F4CB;', title:'generate-migration', desc:'A database migration template. User provides source/target schemas, AI generates the migration SQL.'},
      {icon:'&#x1F41B;', title:'debug-error', desc:'A debugging template. User pastes error + context, AI follows a structured debugging methodology.'},
      {icon:'&#x1F4E6;', title:'create-release-notes', desc:'A release notes template. Pulls recent commits and generates formatted release documentation.'},
    ]
  }
};

function showPrimitive(key){
  const p = primitives[key];
  document.querySelectorAll('.primitive-card').forEach(el => el.classList.remove('active'));
  document.querySelector(`.${key==='tools'?'tools':key==='resources'?'resources':'prompts'}-card`).classList.add('active');

  document.getElementById('detailPanel').innerHTML = `
    <div class="detail-header">
      <h3 style="color:${p.titleColor}">${p.title}</h3>
      <p>${p.desc}</p>
    </div>
    <div class="detail-body">
      <div style="font-size:.8rem;font-weight:600;color:#71717a;margin-bottom:.75rem;text-transform:uppercase;letter-spacing:.04em">Data Flow</div>
      <div class="flow-diagram">
        ${p.flow.map((f,i) => `
          ${i>0?'<div class="flow-arrow-r">&rarr;</div>':''}
          <div class="flow-box" style="background:${f.bg};color:${f.color}">${f.label}</div>
        `).join('')}
      </div>
      <div style="font-size:.8rem;font-weight:600;color:#71717a;margin-bottom:.75rem;text-transform:uppercase;letter-spacing:.04em">Examples</div>
      <div class="examples-grid">
        ${p.examples.map(e => `
          <div class="example-card">
            <h4>${e.icon} <code>${e.title}</code></h4>
            <p>${e.desc}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

showPrimitive('tools');

function complete(){
  const btn = document.getElementById('completeBtn');
  if(btn.disabled) return;
  const progress = JSON.parse(localStorage.getItem('mcp-masterclass-progress')||'{}');
  progress['resources-and-prompts'] = true;
  localStorage.setItem('mcp-masterclass-progress', JSON.stringify(progress));
  LO.completeLesson('mcp-masterclass', 6, 200);
  btn.textContent = 'Lesson Complete!';
  btn.disabled = true;
}
(function(){
  const progress = JSON.parse(localStorage.getItem('mcp-masterclass-progress')||'{}');
  if(progress['resources-and-prompts']){
    const btn = document.getElementById('completeBtn');
    btn.textContent = 'Lesson Complete!';
    btn.disabled = true;
  }
})();
</script>
