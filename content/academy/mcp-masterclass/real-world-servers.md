---
title: "Real-World Servers"
course: "mcp-masterclass"
order: 8
type: "lesson"
free: false
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>
  
</nav>

<div class="lesson-container">
  <div class="lesson-badge">Module 3 &middot; Lesson 8</div>
  <h1>Real-World Servers</h1>
  <p class="subtitle">Explore six production MCP server patterns that developers use every day — from database queries to browser automation.</p>

  <div class="section">
    <h2>Server Gallery</h2>
    <p>Click each server to see its architecture, exposed tools, and real-world use cases:</p>

    <div class="gallery">
      <div class="gallery-card" style="--c:#38bdf8" onclick="showServer(0)" id="gc0">
        <div class="icon">&#x1F4BE;</div>
        <h3>Database</h3>
        <p>Query any DB from Claude</p>
      </div>
      <div class="gallery-card" style="--c:#8b5cf6" onclick="showServer(1)" id="gc1">
        <div class="icon">&#x1F4BB;</div>
        <h3>GitHub</h3>
        <p>Manage repos, PRs, issues</p>
      </div>
      <div class="gallery-card" style="--c:#fb923c" onclick="showServer(2)" id="gc2">
        <div class="icon">&#x1F4AC;</div>
        <h3>Slack</h3>
        <p>Read and send messages</p>
      </div>
      <div class="gallery-card" style="--c:#f472b6" onclick="showServer(3)" id="gc3">
        <div class="icon">&#x1F310;</div>
        <h3>Browser</h3>
        <p>Navigate and interact with web</p>
      </div>
      <div class="gallery-card" style="--c:#a78bfa" onclick="showServer(4)" id="gc4">
        <div class="icon">&#x1F9E0;</div>
        <h3>Memory</h3>
        <p>Persistent knowledge recall</p>
      </div>
      <div class="gallery-card" style="--c:#34d399" onclick="showServer(5)" id="gc5">
        <div class="icon">&#x2699;&#xFE0F;</div>
        <h3>Custom API</h3>
        <p>Wrap any API as MCP</p>
      </div>
    </div>
  </div>

  <button class="complete-btn" id="completeBtn" onclick="complete()">Complete Lesson &mdash; Earn 200 XP</button>
  
</div>

<script>
const servers = [
  {
    name:'Database Server',
    icon:'&#x1F4BE;',
    color:'#38bdf8',
    desc:'Connects Claude to PostgreSQL, MySQL, SQLite, or any SQL database. Maintains a connection pool, handles query execution, and returns structured results. Claude can analyze data, generate reports, and modify records — all through natural language.',
    arch:[
      {label:'Claude', bg:'rgba(139,92,246,.15)', color:'#8b5cf6'},
      {label:'MCP Client', bg:'rgba(255,255,255,.05)', color:'#a1a1aa'},
      {label:'DB Server', bg:'rgba(56,189,248,.15)', color:'#38bdf8'},
      {label:'PostgreSQL', bg:'rgba(56,189,248,.08)', color:'#38bdf8'}
    ],
    tools:[
      {icon:'&#x1F4CA;', name:'query', desc:'Run SQL SELECT'},
      {icon:'&#x2795;', name:'insert_row', desc:'Add records'},
      {icon:'&#x1F504;', name:'update_rows', desc:'Modify records'},
      {icon:'&#x1F4CB;', name:'list_tables', desc:'Show schema'},
      {icon:'&#x1F50D;', name:'describe_table', desc:'Column details'},
      {icon:'&#x1F4C8;', name:'explain_query', desc:'Query plan analysis'}
    ],
    useCases:[
      '<strong>Data analysis:</strong> "Show me our top 10 customers by revenue this quarter"',
      '<strong>Report generation:</strong> "Create a summary of user signups by month"',
      '<strong>Schema exploration:</strong> "What tables relate to the orders system?"',
      '<strong>Migration help:</strong> "Add a status column to the projects table"'
    ]
  },
  {
    name:'GitHub Server',
    icon:'&#x1F4BB;',
    color:'#8b5cf6',
    desc:'Gives Claude full access to GitHub repositories. Create branches, manage pull requests, review code, open issues, and search across codebases. Uses the GitHub API with fine-grained personal access tokens for security.',
    arch:[
      {label:'Claude', bg:'rgba(139,92,246,.15)', color:'#8b5cf6'},
      {label:'MCP Client', bg:'rgba(255,255,255,.05)', color:'#a1a1aa'},
      {label:'GitHub Server', bg:'rgba(139,92,246,.15)', color:'#8b5cf6'},
      {label:'GitHub API', bg:'rgba(139,92,246,.08)', color:'#8b5cf6'}
    ],
    tools:[
      {icon:'&#x1F4C2;', name:'list_repos', desc:'Your repositories'},
      {icon:'&#x1F500;', name:'create_pr', desc:'Open pull request'},
      {icon:'&#x1F41B;', name:'create_issue', desc:'File an issue'},
      {icon:'&#x1F50D;', name:'search_code', desc:'Search codebase'},
      {icon:'&#x1F4DD;', name:'review_pr', desc:'Review PR changes'},
      {icon:'&#x1F33F;', name:'create_branch', desc:'Branch management'}
    ],
    useCases:[
      '<strong>Code review:</strong> "Review the latest PR on my project and suggest improvements"',
      '<strong>Issue management:</strong> "Create an issue for the login bug with reproduction steps"',
      '<strong>Code search:</strong> "Find all files that import the auth module"',
      '<strong>PR creation:</strong> "Create a PR with these changes and add a description"'
    ]
  },
  {
    name:'Slack Server',
    icon:'&#x1F4AC;',
    color:'#fb923c',
    desc:'Connects Claude to your Slack workspace. Read channel history, search messages, post updates, and manage threads. Uses Slack Bot tokens with scoped permissions for secure access.',
    arch:[
      {label:'Claude', bg:'rgba(139,92,246,.15)', color:'#8b5cf6'},
      {label:'MCP Client', bg:'rgba(255,255,255,.05)', color:'#a1a1aa'},
      {label:'Slack Server', bg:'rgba(251,146,60,.15)', color:'#fb923c'},
      {label:'Slack API', bg:'rgba(251,146,60,.08)', color:'#fb923c'}
    ],
    tools:[
      {icon:'&#x1F4E8;', name:'send_message', desc:'Post to channel'},
      {icon:'&#x1F4D6;', name:'read_channel', desc:'Get recent messages'},
      {icon:'&#x1F50D;', name:'search_messages', desc:'Find messages'},
      {icon:'&#x1F9F5;', name:'reply_thread', desc:'Thread replies'},
      {icon:'&#x1F4CB;', name:'list_channels', desc:'Available channels'},
      {icon:'&#x1F464;', name:'get_user_info', desc:'User profiles'}
    ],
    useCases:[
      '<strong>Team updates:</strong> "Post a deployment summary to #engineering"',
      '<strong>Context gathering:</strong> "What did the team discuss about the API redesign?"',
      '<strong>Meeting follow-up:</strong> "Summarize the key decisions from today\'s standup thread"',
      '<strong>Search:</strong> "Find when someone last mentioned the billing migration"'
    ]
  },
  {
    name:'Browser Server',
    icon:'&#x1F310;',
    color:'#f472b6',
    desc:'Gives Claude browser automation capabilities via Puppeteer or Playwright. Navigate web pages, fill forms, take screenshots, extract content, and interact with web applications programmatically.',
    arch:[
      {label:'Claude', bg:'rgba(139,92,246,.15)', color:'#8b5cf6'},
      {label:'MCP Client', bg:'rgba(255,255,255,.05)', color:'#a1a1aa'},
      {label:'Browser Server', bg:'rgba(244,114,182,.15)', color:'#f472b6'},
      {label:'Chromium', bg:'rgba(244,114,182,.08)', color:'#f472b6'}
    ],
    tools:[
      {icon:'&#x1F30D;', name:'navigate', desc:'Go to URL'},
      {icon:'&#x1F4F7;', name:'screenshot', desc:'Capture page'},
      {icon:'&#x1F5B1;&#xFE0F;', name:'click', desc:'Click element'},
      {icon:'&#x2328;&#xFE0F;', name:'type_text', desc:'Type into fields'},
      {icon:'&#x1F4C4;', name:'get_content', desc:'Extract text/HTML'},
      {icon:'&#x23F3;', name:'wait_for', desc:'Wait for selector'}
    ],
    useCases:[
      '<strong>Web scraping:</strong> "Get the pricing from this competitor\'s website"',
      '<strong>Testing:</strong> "Check if the login flow works on staging"',
      '<strong>Form filling:</strong> "Fill out this application form with my details"',
      '<strong>Monitoring:</strong> "Take a screenshot of our dashboard every hour"'
    ]
  },
  {
    name:'Memory Server',
    icon:'&#x1F9E0;',
    color:'#a78bfa',
    desc:'Provides persistent memory across AI sessions using a knowledge graph. Stores entities, relationships, and observations that Claude can recall later. Essential for long-running projects where context exceeds the conversation window.',
    arch:[
      {label:'Claude', bg:'rgba(139,92,246,.15)', color:'#8b5cf6'},
      {label:'MCP Client', bg:'rgba(255,255,255,.05)', color:'#a1a1aa'},
      {label:'Memory Server', bg:'rgba(167,139,250,.15)', color:'#a78bfa'},
      {label:'Knowledge Graph', bg:'rgba(167,139,250,.08)', color:'#a78bfa'}
    ],
    tools:[
      {icon:'&#x1F4DD;', name:'create_entity', desc:'Store a concept'},
      {icon:'&#x1F517;', name:'create_relation', desc:'Link concepts'},
      {icon:'&#x1F4A1;', name:'add_observation', desc:'Add fact to entity'},
      {icon:'&#x1F50D;', name:'search_nodes', desc:'Find memories'},
      {icon:'&#x1F4D6;', name:'read_graph', desc:'Full knowledge dump'},
      {icon:'&#x1F5D1;&#xFE0F;', name:'delete_entity', desc:'Remove outdated'}
    ],
    useCases:[
      '<strong>Project context:</strong> "Remember that we decided to use Postgres for the auth service"',
      '<strong>Preference tracking:</strong> "I prefer TypeScript over JavaScript for backend code"',
      '<strong>Knowledge base:</strong> "Store the API rate limits we discovered for each provider"',
      '<strong>Session continuity:</strong> "What were we working on last time?"'
    ]
  },
  {
    name:'Custom API Server',
    icon:'&#x2699;&#xFE0F;',
    color:'#34d399',
    desc:'The most flexible pattern — wrap any REST or GraphQL API as an MCP server. Your internal tools, third-party services, or proprietary systems become AI-accessible through a standard interface. You control auth, rate limits, and data filtering.',
    arch:[
      {label:'Claude', bg:'rgba(139,92,246,.15)', color:'#8b5cf6'},
      {label:'MCP Client', bg:'rgba(255,255,255,.05)', color:'#a1a1aa'},
      {label:'Custom Server', bg:'rgba(52,211,153,.15)', color:'#34d399'},
      {label:'Your API', bg:'rgba(52,211,153,.08)', color:'#34d399'}
    ],
    tools:[
      {icon:'&#x1F4E8;', name:'get_data', desc:'Fetch from API'},
      {icon:'&#x1F4E4;', name:'create_record', desc:'POST to API'},
      {icon:'&#x1F504;', name:'update_record', desc:'PUT/PATCH'},
      {icon:'&#x1F5D1;&#xFE0F;', name:'delete_record', desc:'DELETE'},
      {icon:'&#x1F4CB;', name:'list_endpoints', desc:'Available routes'},
      {icon:'&#x1F511;', name:'refresh_auth', desc:'Token management'}
    ],
    useCases:[
      '<strong>Internal tools:</strong> "Check the status of deployment #4521 in our CI system"',
      '<strong>CRM access:</strong> "Look up the account details for Acme Corp"',
      '<strong>Monitoring:</strong> "What alerts fired in PagerDuty this week?"',
      '<strong>Workflow automation:</strong> "Create a Jira ticket and assign it to the frontend team"'
    ]
  }
];

function showServer(idx){
  document.querySelectorAll('.gallery-card').forEach((el,i) => el.classList.toggle('active', i===idx));
  const s = servers[idx];
  const detail = document.getElementById('detailView');
  detail.className = 'detail-view visible';
  detail.innerHTML = `
    <div class="detail-header">
      <div class="detail-icon">${s.icon}</div>
      <div class="detail-info">
        <h3 style="color:${s.color}">${s.name}</h3>
        <p>${s.desc}</p>
      </div>
    </div>
    <div class="detail-body">
      <div class="sub-title">Architecture</div>
      <div class="arch-mini">
        ${s.arch.map((a,i) => `
          ${i>0?'<div class="arch-arrow">&rarr;</div>':''}
          <div class="arch-box" style="background:${a.bg};color:${a.color}">${a.label}</div>
        `).join('')}
      </div>

      <div class="sub-title">Exposed Tools</div>
      <div class="tools-exposed">
        ${s.tools.map(t => `
          <div class="tool-item">
            <div class="t-icon">${t.icon}</div>
            <div class="t-name">${t.name}</div>
            <div class="t-desc">${t.desc}</div>
          </div>
        `).join('')}
      </div>

      <div class="sub-title" style="margin-top:1.5rem">Real-World Use Cases</div>
      <div class="use-cases" style="--c:${s.color}">
        ${s.useCases.map(u => `<div class="use-case">${u}</div>`).join('')}
      </div>
    </div>
  `;
}

function complete(){
  const btn = document.getElementById('completeBtn');
  if(btn.disabled) return;
  const progress = JSON.parse(localStorage.getItem('mcp-masterclass-progress')||'{}');
  progress['real-world-servers'] = true;
  localStorage.setItem('mcp-masterclass-progress', JSON.stringify(progress));
  LO.completeLesson('mcp-masterclass', 8, 200);
  btn.textContent = 'Lesson Complete!';
  btn.disabled = true;
}
(function(){
  const progress = JSON.parse(localStorage.getItem('mcp-masterclass-progress')||'{}');
  if(progress['real-world-servers']){
    const btn = document.getElementById('completeBtn');
    btn.textContent = 'Lesson Complete!';
    btn.disabled = true;
  }
})();
</script>
