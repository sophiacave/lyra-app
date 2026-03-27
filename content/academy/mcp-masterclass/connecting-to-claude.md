---
title: "Connecting to Claude"
course: "mcp-masterclass"
order: 7
type: "lesson"
free: false
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>
  <a href="index.html" class="nav-link">&larr; Course Overview</a>
</nav>

<div class="lesson-container">
  <div class="lesson-badge">Module 3 &middot; Lesson 7</div>
  <h1>Connecting to Claude</h1>
  <p class="subtitle">Walk through the four phases of connecting an MCP server to Claude Desktop or Claude Code -- from installation to live tool usage. Click each phase tab below to walk through the process step by step.</p>

  <div class="phase-nav">
    <div class="phase-tab active" onclick="goPhase(0)" id="ptab0"><span class="num">1</span>Install</div>
    <div class="phase-tab" onclick="goPhase(1)" id="ptab1"><span class="num">2</span>Configure</div>
    <div class="phase-tab" onclick="goPhase(2)" id="ptab2"><span class="num">3</span>Discover</div>
    <div class="phase-tab" onclick="goPhase(3)" id="ptab3"><span class="num">4</span>Use</div>
  </div>

  <!-- Phase 1: Install -->
  <div class="phase-content active" id="phase0">
    <div class="section">
      <h2>Phase 1: Install Your MCP Server</h2>
      <p>In this phase, you get the MCP server code onto your machine. MCP servers are typically Node.js packages published to npm, or standalone scripts you run locally. Installation is straightforward:</p>

      <div class="visual-step">
        <div class="step-icon" style="background:rgba(139,92,246,.1)">&#x1F4E6;</div>
        <div class="step-body">
          <h3>Option A: Install from npm</h3>
          <p>Most community MCP servers are published as npm packages. Install globally or use npx:</p>
        </div>
      </div>
      <div class="code-block">
        <div class="code-header"><span class="filename">Terminal</span><span class="lang">bash</span></div>
        <div class="code-body"><span class="cm"># Install a community MCP server globally</span>
<span class="kw">npm</span> install -g @modelcontextprotocol/server-filesystem

<span class="cm"># Or use npx to run without installing</span>
<span class="kw">npx</span> @modelcontextprotocol/server-filesystem /path/to/allowed/dir</div>
      </div>

      <div class="visual-step">
        <div class="step-icon" style="background:rgba(52,211,153,.1)">&#x1F4BB;</div>
        <div class="step-body">
          <h3>Option B: Run your own server</h3>
          <p>If you built a custom server (like in Lesson 4), you can run it directly with Node or compile it first:</p>
        </div>
      </div>
      <div class="code-block">
        <div class="code-header"><span class="filename">Terminal</span><span class="lang">bash</span></div>
        <div class="code-body"><span class="cm"># Run a TypeScript server with tsx</span>
<span class="kw">npx</span> tsx my-server.ts

<span class="cm"># Or compile and run</span>
<span class="kw">tsc</span> my-server.ts && <span class="kw">node</span> my-server.js</div>
      </div>

      <button class="phase-btn" onclick="goPhase(1)">Next: Configure &rarr;</button>
    </div>
  </div>

  <!-- Phase 2: Configure -->
  <div class="phase-content" id="phase1">
    <div class="section">
      <h2>Phase 2: Configure in Claude</h2>
      <p>In this phase, you tell Claude where to find your server by editing a config file. This JSON file maps server names to the commands that launch them.</p>

      <div class="visual-step">
        <div class="step-icon" style="background:rgba(251,146,60,.1)">&#x1F4C4;</div>
        <div class="step-body">
          <h3>Claude Desktop Config Location</h3>
          <p>macOS: <code>~/Library/Application Support/Claude/claude_desktop_config.json</code><br>
          Windows: <code>%APPDATA%\Claude\claude_desktop_config.json</code></p>
        </div>
      </div>

      <div class="code-block">
        <div class="code-header"><span class="filename">claude_desktop_config.json</span><span class="lang">JSON</span></div>
        <div class="code-body">{
  <span class="key">"mcpServers"</span>: {
    <span class="key">"filesystem"</span>: {
      <span class="key">"command"</span>: <span class="str">"npx"</span>,
      <span class="key">"args"</span>: [
        <span class="str">"-y"</span>,
        <span class="str">"@modelcontextprotocol/server-filesystem"</span>,
        <span class="str">"/Users/you/projects"</span>
      ]
    },
    <span class="key">"database"</span>: {
      <span class="key">"command"</span>: <span class="str">"node"</span>,
      <span class="key">"args"</span>: [<span class="str">"./my-db-server.js"</span>],
      <span class="key">"env"</span>: {
        <span class="key">"DB_URL"</span>: <span class="str">"postgresql://localhost/mydb"</span>
      }
    }
  }
}</div>
      </div>

      <div class="visual-step">
        <div class="step-icon" style="background:rgba(56,189,248,.1)">&#x1F527;</div>
        <div class="step-body">
          <h3>Key Config Fields</h3>
          <p><code>command</code> — The program to run (node, npx, python, etc.). This is what launches your server.<br>
          <code>args</code> — Extra information passed to the command, like which directory to access or which server package to use.<br>
          <code>env</code> — Secret values the server needs to work, like API keys or database connection strings. These stay on your machine.</p>
        </div>
      </div>

      <button class="phase-btn" onclick="goPhase(2)">Next: Discover &rarr;</button>
    </div>
  </div>

  <!-- Phase 3: Discover -->
  <div class="phase-content" id="phase2">
    <div class="section">
      <h2>Phase 3: Claude Discovers Tools</h2>
      <p>In this phase, Claude automatically connects to your server and asks "what can you do?" This handshake happens every time Claude starts. Here is what happens under the hood:</p>

      <div class="anim-canvas">
        <canvas id="discoverCanvas"></canvas>
      </div>

      <div class="visual-step">
        <div class="step-icon" style="background:rgba(139,92,246,.1)">1</div>
        <div class="step-body">
          <h3>Initialize Connection</h3>
          <p>Claude sends an <code>initialize</code> request with its protocol version and capabilities. The server responds with its own capabilities.</p>
        </div>
      </div>
      <div class="visual-step">
        <div class="step-icon" style="background:rgba(52,211,153,.1)">2</div>
        <div class="step-body">
          <h3>List Available Tools</h3>
          <p>Claude sends <code>tools/list</code>. The server returns all available tool definitions — names, descriptions, and input schemas.</p>
        </div>
      </div>
      <div class="visual-step">
        <div class="step-icon" style="background:rgba(251,146,60,.1)">3</div>
        <div class="step-body">
          <h3>Ready to Use</h3>
          <p>Claude now knows every tool available across all connected servers. It can decide autonomously when to invoke them based on user requests.</p>
        </div>
      </div>

      <button class="phase-btn" onclick="goPhase(3)">Next: Use &rarr;</button>
    </div>
  </div>

  <!-- Phase 4: Use -->
  <div class="phase-content" id="phase3">
    <div class="section">
      <h2>Phase 4: Claude Uses Tools</h2>
      <p>Now the connection is live. When a user asks a question that needs external data or action, Claude automatically selects and invokes the right tool from your server:</p>

      <div class="visual-step">
        <div class="step-icon" style="background:rgba(255,255,255,.05)">&#x1F464;</div>
        <div class="step-body">
          <h3>User: "What files are in my src directory?"</h3>
          <p>The user asks a question that requires filesystem access.</p>
        </div>
      </div>
      <div class="visual-step">
        <div class="step-icon" style="background:rgba(139,92,246,.1)">&#x1F9E0;</div>
        <div class="step-body">
          <h3>Claude decides to use list_directory</h3>
          <p>Claude reads the tool definitions, identifies that <code>list_directory</code> from the filesystem server matches the need, and generates the call.</p>
        </div>
      </div>

      <div class="code-block">
        <div class="code-header"><span class="filename">Tool Call (JSON-RPC)</span><span class="lang">JSON</span></div>
        <div class="code-body">{
  <span class="key">"method"</span>: <span class="str">"tools/call"</span>,
  <span class="key">"params"</span>: {
    <span class="key">"name"</span>: <span class="str">"list_directory"</span>,
    <span class="key">"arguments"</span>: {
      <span class="key">"path"</span>: <span class="str">"/Users/you/projects/src"</span>
    }
  }
}</div>
      </div>

      <div class="visual-step">
        <div class="step-icon" style="background:rgba(52,211,153,.1)">&#x2705;</div>
        <div class="step-body">
          <h3>Server returns file listing, Claude responds</h3>
          <p>The filesystem server reads the directory and returns the results. Claude uses this real data to give an accurate, helpful response.</p>
        </div>
      </div>
    </div>
  </div>

  <button class="complete-btn" id="completeBtn" onclick="complete()">Complete Lesson &mdash; Earn 200 XP</button>
  <a href="real-world-servers.html" class="next-link">Next: Real-World Servers &rarr;</a>
</div>

<script>
function goPhase(n){
  document.querySelectorAll('.phase-content').forEach((el,i) => el.classList.toggle('active', i===n));
  document.querySelectorAll('.phase-tab').forEach((el,i) => {
    el.classList.toggle('active', i===n);
    if(i<n) el.classList.add('done');
  });
  if(n===2) startDiscoverAnim();
}

// Discovery animation
const canvas = document.getElementById('discoverCanvas');
const ctx = canvas.getContext('2d');
let animRunning = false;
let at = 0;

function resizeCanvas(){
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width * 2;
  canvas.height = rect.height * 2;
  ctx.scale(2,2);
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function startDiscoverAnim(){
  if(animRunning) return;
  animRunning = true;
  at = 0;
  drawDiscover();
}

function drawRR(x,y,w,h,r,fill,stroke){
  ctx.beginPath();ctx.roundRect(x,y,w,h,r);
  if(fill){ctx.fillStyle=fill;ctx.fill();}
  if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1.5;ctx.stroke();}
}

function drawDiscover(){
  const W = canvas.width/2, H = canvas.height/2;
  ctx.clearRect(0,0,W,H);
  at += 0.005;

  // Claude box
  drawRR(30, H/2-30, 120, 60, 10, '#8b5cf615', '#8b5cf640');
  ctx.font='600 12px Inter,sans-serif';ctx.fillStyle='#8b5cf6';ctx.textAlign='center';
  ctx.fillText('Claude', 90, H/2+4);

  // Server box
  drawRR(W-150, H/2-30, 120, 60, 10, '#34d39915', '#34d39940');
  ctx.font='600 12px Inter,sans-serif';ctx.fillStyle='#34d399';
  ctx.fillText('MCP Server', W-90, H/2+4);

  // Messages
  const phase = Math.floor(at * 3) % 3;
  const subPhase = (at * 3) % 1;

  const messages = [
    {text:'initialize', color:'#8b5cf6', dir:1},
    {text:'tools/list', color:'#8b5cf6', dir:1},
    {text:'[tool definitions]', color:'#34d399', dir:-1}
  ];

  const msg = messages[phase];
  const startX = msg.dir > 0 ? 150 : W-150;
  const endX = msg.dir > 0 ? W-150 : 150;
  const px = startX + (endX-startX) * Math.min(subPhase * 1.5, 1);

  // Line
  ctx.beginPath();ctx.moveTo(150,H/2);ctx.lineTo(W-150,H/2);
  ctx.strokeStyle='rgba(255,255,255,.06)';ctx.lineWidth=2;ctx.stroke();

  // Pulse
  ctx.beginPath();ctx.arc(px, H/2, 6, 0, Math.PI*2);
  ctx.fillStyle=msg.color;ctx.fill();
  ctx.beginPath();ctx.arc(px, H/2, 12, 0, Math.PI*2);
  ctx.fillStyle=msg.color+'25';ctx.fill();

  // Label
  ctx.font='500 10px Inter,sans-serif';ctx.fillStyle=msg.color;ctx.textAlign='center';
  ctx.fillText(msg.text, W/2, H/2-20);

  // Phase indicator
  ctx.font='500 10px Inter,sans-serif';ctx.fillStyle='#71717a';ctx.textAlign='center';
  ctx.fillText(`Step ${phase+1}/3: ${['Handshake','Tool Discovery','Definitions Received'][phase]}`, W/2, H-15);

  if(animRunning) requestAnimationFrame(drawDiscover);
}

function complete(){
  const btn = document.getElementById('completeBtn');
  if(btn.disabled) return;
  const progress = JSON.parse(localStorage.getItem('mcp-masterclass-progress')||'{}');
  progress['connecting-to-claude'] = true;
  localStorage.setItem('mcp-masterclass-progress', JSON.stringify(progress));
  LO.completeLesson('mcp-masterclass', 7, 200);
  btn.textContent = 'Lesson Complete!';
  btn.disabled = true;
}
(function(){
  const progress = JSON.parse(localStorage.getItem('mcp-masterclass-progress')||'{}');
  if(progress['connecting-to-claude']){
    const btn = document.getElementById('completeBtn');
    btn.textContent = 'Lesson Complete!';
    btn.disabled = true;
  }
})();
</script>
