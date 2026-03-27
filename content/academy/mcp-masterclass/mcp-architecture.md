---
title: "MCP Architecture"
course: "mcp-masterclass"
order: 2
type: "lesson"
free: true
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>
  <a href="index.html" class="nav-link">&larr; Course Overview</a>
</nav>

<div class="lesson-container">
  <div class="lesson-badge">Module 1 &middot; Lesson 2</div>
  <h1>MCP Architecture</h1>
  <p class="subtitle">Three components, one protocol. Understand how Hosts, Clients, and Servers form the MCP communication layer.</p>

  <div class="section">
    <h2>The Three Components</h2>
    <p>Click each component to explore what it does in the MCP architecture:</p>

    <div class="component-cards">
      <div class="comp-card host active" onclick="showComponent('host')">
        <div class="icon">&#x1F9E0;</div>
        <h3>Host</h3>
        <p>Claude, ChatGPT, or any LLM application</p>
      </div>
      <div class="comp-card client" onclick="showComponent('client')">
        <div class="icon">&#x1F310;</div>
        <h3>MCP Client</h3>
        <p>The bridge between Host and Server</p>
      </div>
      <div class="comp-card server" onclick="showComponent('server')">
        <div class="icon">&#x2699;&#xFE0F;</div>
        <h3>MCP Server</h3>
        <p>Your tool or data source</p>
      </div>
    </div>

    <div class="detail-panel" id="detailPanel">
      <h3 id="detailTitle" style="color:#8b5cf6">Host Application</h3>
      <p id="detailDesc">The Host is the AI application the user interacts with — like Claude Desktop, Claude Code, or a custom app built with the Anthropic SDK. The Host initiates MCP connections and decides which servers to connect to. It contains one or more MCP Clients.</p>
      <p id="detailRole"><strong>Role:</strong> Receives user input, decides when tools are needed, orchestrates the overall interaction.</p>
      <div class="examples" id="detailExamples">
        <span class="example-tag">Claude Desktop</span>
        <span class="example-tag">Claude Code</span>
        <span class="example-tag">Custom SDK apps</span>
        <span class="example-tag">IDE extensions</span>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Architecture Diagram</h2>
    <p>Watch how data flows through the MCP architecture:</p>
    <div class="arch-canvas">
      <canvas id="archCanvas"></canvas>
    </div>
  </div>

  <div class="section">
    <h2>Data Flow — Step by Step</h2>
    <p>Click play to animate the request lifecycle, or click individual steps:</p>
    <button class="play-btn" id="playBtn" onclick="playFlow()">&#x25B6; Play Animation</button>

    <div class="flow-steps" id="flowSteps">
      <div class="flow-step active" onclick="setStep(0)">
        <div class="step-num">1</div>
        <div class="step-text"><strong>User asks a question</strong><span>"What files are in my project directory?"</span></div>
      </div>
      <div class="flow-arrow" id="arrow0">&darr;</div>
      <div class="flow-step" onclick="setStep(1)">
        <div class="step-num">2</div>
        <div class="step-text"><strong>Host realizes it needs external data</strong><span>The LLM sees available tools and decides to use the filesystem tool</span></div>
      </div>
      <div class="flow-arrow" id="arrow1">&darr;</div>
      <div class="flow-step" onclick="setStep(2)">
        <div class="step-num">3</div>
        <div class="step-text"><strong>Client sends request to Server</strong><span>MCP Client sends a tools/call request via JSON-RPC to the filesystem server</span></div>
      </div>
      <div class="flow-arrow" id="arrow2">&darr;</div>
      <div class="flow-step" onclick="setStep(3)">
        <div class="step-num">4</div>
        <div class="step-text"><strong>Server executes and returns data</strong><span>Filesystem server reads the directory and returns the file listing</span></div>
      </div>
      <div class="flow-arrow" id="arrow3">&darr;</div>
      <div class="flow-step" onclick="setStep(4)">
        <div class="step-num">5</div>
        <div class="step-text"><strong>Host generates an informed answer</strong><span>The LLM uses the real file data to respond accurately to the user</span></div>
      </div>
    </div>
  </div>

  <button class="complete-btn" id="completeBtn" onclick="complete()">Complete Lesson &mdash; Earn 200 XP</button>
  <a href="servers-vs-tools.html" class="next-link">Next: Servers vs Tools &rarr;</a>
</div>

<script>
// Component detail data
const components = {
  host: {
    title: 'Host Application',
    color: '#8b5cf6',
    desc: 'The Host is the AI application the user interacts with — like Claude Desktop, Claude Code, or a custom app built with the Anthropic SDK. The Host initiates MCP connections and decides which servers to connect to. It contains one or more MCP Clients.',
    role: '<strong>Role:</strong> Receives user input, decides when tools are needed, orchestrates the overall interaction.',
    examples: ['Claude Desktop', 'Claude Code', 'Custom SDK apps', 'IDE extensions']
  },
  client: {
    title: 'MCP Client',
    color: '#fb923c',
    desc: 'The MCP Client lives inside the Host application. It maintains a 1:1 connection with a single MCP Server. It handles protocol negotiation, capability exchange, and message routing. Think of it as the translator between the AI and the tool.',
    role: '<strong>Role:</strong> Establishes connections, negotiates capabilities, routes tool calls and responses between Host and Server.',
    examples: ['Built into Claude Desktop', 'SDK client libraries', 'Protocol handlers', 'Connection managers']
  },
  server: {
    title: 'MCP Server',
    color: '#34d399',
    desc: 'The MCP Server is a lightweight program that exposes specific capabilities through the MCP protocol. It wraps your tools, databases, or APIs and makes them accessible to any MCP Client. Servers can expose tools (actions), resources (data), and prompts (templates).',
    role: '<strong>Role:</strong> Exposes capabilities, handles tool execution, serves resources, and manages data access.',
    examples: ['Filesystem server', 'Database server', 'GitHub server', 'Slack server', 'Custom API wrappers']
  }
};

function showComponent(key){
  const c = components[key];
  document.querySelectorAll('.comp-card').forEach(el => el.classList.remove('active'));
  document.querySelector('.comp-card.' + key).classList.add('active');
  document.getElementById('detailTitle').textContent = c.title;
  document.getElementById('detailTitle').style.color = c.color;
  document.getElementById('detailDesc').textContent = c.desc;
  document.getElementById('detailRole').innerHTML = c.role;
  document.getElementById('detailExamples').innerHTML = c.examples.map(e => `<span class="example-tag">${e}</span>`).join('');
}

// Flow animation
let currentStep = 0;
let flowInterval;

function setStep(n){
  currentStep = n;
  document.querySelectorAll('.flow-step').forEach((el,i) => {
    el.classList.toggle('active', i <= n);
  });
  document.querySelectorAll('.flow-arrow').forEach((el,i) => {
    el.classList.toggle('visible', i < n);
  });
}

function playFlow(){
  clearInterval(flowInterval);
  currentStep = -1;
  setStep(-1);
  let step = 0;
  flowInterval = setInterval(() => {
    if(step > 4){ clearInterval(flowInterval); return; }
    setStep(step);
    step++;
  }, 1200);
}

// Architecture canvas animation
const canvas = document.getElementById('archCanvas');
const ctx = canvas.getContext('2d');
let t = 0;

function resize(){
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width * 2;
  canvas.height = rect.height * 2;
  ctx.scale(2,2);
}
resize();
window.addEventListener('resize', resize);

function drawRoundRect(x,y,w,h,r,fill,stroke){
  ctx.beginPath();
  ctx.roundRect(x,y,w,h,r);
  if(fill){ctx.fillStyle=fill;ctx.fill();}
  if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1.5;ctx.stroke();}
}

function drawArrow(x1,y1,x2,y2,color,progress){
  const px = x1+(x2-x1)*progress;
  const py = y1+(y2-y1)*progress;
  ctx.beginPath();
  ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);
  ctx.strokeStyle=color+'40';ctx.lineWidth=2;ctx.stroke();
  // Pulse
  ctx.beginPath();ctx.arc(px,py,5,0,Math.PI*2);
  ctx.fillStyle=color;ctx.fill();
  ctx.beginPath();ctx.arc(px,py,10,0,Math.PI*2);
  ctx.fillStyle=color+'30';ctx.fill();
}

function drawArch(){
  const W = canvas.width/2, H = canvas.height/2;
  ctx.clearRect(0,0,W,H);
  t += 0.006;

  // Host box
  drawRoundRect(20, H/2-40, 160, 80, 12, '#8b5cf610', '#8b5cf640');
  ctx.font='600 13px Inter,sans-serif';ctx.fillStyle='#8b5cf6';ctx.textAlign='center';
  ctx.fillText('HOST', 100, H/2-10);
  ctx.font='500 10px Inter,sans-serif';ctx.fillStyle='#a1a1aa';
  ctx.fillText('(Claude Desktop)', 100, H/2+10);

  // Client box
  drawRoundRect(W/2-70, H/2-40, 140, 80, 12, '#fb923c10', '#fb923c40');
  ctx.font='600 13px Inter,sans-serif';ctx.fillStyle='#fb923c';ctx.textAlign='center';
  ctx.fillText('MCP CLIENT', W/2, H/2-10);
  ctx.font='500 10px Inter,sans-serif';ctx.fillStyle='#a1a1aa';
  ctx.fillText('(Protocol Bridge)', W/2, H/2+10);

  // Server boxes
  const servers = [
    {label:'Files Server', y:H/2-100, color:'#34d399'},
    {label:'DB Server', y:H/2, color:'#38bdf8'},
    {label:'API Server', y:H/2+100, color:'#f472b6'}
  ];
  servers.forEach((s,i) => {
    drawRoundRect(W-170, s.y-30, 150, 60, 12, s.color+'10', s.color+'40');
    ctx.font='600 12px Inter,sans-serif';ctx.fillStyle=s.color;ctx.textAlign='center';
    ctx.fillText(s.label, W-95, s.y+5);
  });

  // Arrows: Host -> Client
  const p1 = (t*1.2)%1;
  drawArrow(180, H/2, W/2-70, H/2, '#8b5cf6', p1);

  // Arrows: Client -> Servers
  servers.forEach((s,i) => {
    const p = (t*1.2 + i*0.25)%1;
    drawArrow(W/2+70, H/2, W-170, s.y, s.color, p);
  });

  // Labels
  ctx.font='500 9px Inter,sans-serif';ctx.fillStyle='#71717a';ctx.textAlign='center';
  ctx.fillText('JSON-RPC', (180+W/2-70)/2, H/2-20);
  ctx.fillText('stdio / SSE', (W/2+70+W-170)/2, H/2-60);

  requestAnimationFrame(drawArch);
}
drawArch();

// Complete
function complete(){
  const btn = document.getElementById('completeBtn');
  if(btn.disabled) return;
  const progress = JSON.parse(localStorage.getItem('mcp-masterclass-progress')||'{}');
  progress['mcp-architecture'] = true;
  localStorage.setItem('mcp-masterclass-progress', JSON.stringify(progress));
  LO.completeLesson('mcp-masterclass', 2, 200);
  btn.textContent = 'Lesson Complete!';
  btn.disabled = true;
}
(function(){
  const progress = JSON.parse(localStorage.getItem('mcp-masterclass-progress')||'{}');
  if(progress['mcp-architecture']){
    const btn = document.getElementById('completeBtn');
    btn.textContent = 'Lesson Complete!';
    btn.disabled = true;
  }
})();
</script>
