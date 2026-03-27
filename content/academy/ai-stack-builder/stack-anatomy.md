---
title: "Stack Anatomy"
course: "ai-stack-builder"
order: 1
type: "lesson"
free: true
---<canvas id="confettiCanvas"></canvas>
<div class="container">
  <div class="header">
    <div class="tag">AI Stack Builder — Lesson 1</div>
    <h1>Stack Anatomy</h1>
    <p>Build your perfect AI stack layer by layer. Click to choose, watch it come together.</p>
  </div>

  <div class="progress-bar">
    <div class="prog-dot" id="prog-0"></div>
    <div class="prog-dot" id="prog-1"></div>
    <div class="prog-dot" id="prog-2"></div>
    <div class="prog-dot" id="prog-3"></div>
    <div class="prog-dot" id="prog-4"></div>
  </div>

  <div id="stackBuilder"></div>

  <div class="result-card" id="resultCard">
    <div class="result-title">Your Stack</div>
    <div class="stack-summary" id="stackSummary"></div>
    <div class="stats-row">
      <div class="stat"><div class="val cost" id="totalCost">$0</div><div class="lbl">Per Month</div></div>
      <div class="stat"><div class="val compat" id="compatScore">0%</div><div class="lbl">Compatibility</div></div>
    </div>
    <div class="faye-stack">
      <h4>The Sophia Stack (Recommended)</h4>
      <p><strong>Supabase + Edge Functions + Claude + Next.js + Vercel</strong> — $29/mo, 95% compatibility. Battle-tested for AI-powered apps. This is what Like One Academy runs on.</p>
    </div>
  </div>
</div>

<script>
const LAYERS = [
  {
    name: 'Database', num: 1,
    options: [
      { id: 'supabase', brand: 'supabase', name: 'Supabase', icon: '💚', sub: 'Postgres + Auth + Realtime', price: '$0-25/mo', priceVal: 12, priceClass: 'green' },
      { id: 'firebase', brand: 'firebase', name: 'Firebase', icon: '🔥', sub: 'NoSQL + Auth + Hosting', price: '$0-25/mo', priceVal: 15, priceClass: 'green' },
      { id: 'planetscale', brand: 'planetscale', name: 'PlanetScale', icon: '🪐', sub: 'Serverless MySQL', price: '$29+/mo', priceVal: 29, priceClass: 'yellow' },
    ]
  },
  {
    name: 'Backend', num: 2,
    options: [
      { id: 'edge', brand: 'edge', name: 'Edge Functions', icon: '⚡', sub: 'Deno/Supabase Edge', price: '$0-2/mo', priceVal: 1, priceClass: 'green' },
      { id: 'express', brand: 'express', name: 'Express', icon: '🟢', sub: 'Node.js Classic', price: '$5-20/mo', priceVal: 10, priceClass: 'green' },
      { id: 'fastapi', brand: 'fastapi', name: 'FastAPI', icon: '🐍', sub: 'Python Async', price: '$5-20/mo', priceVal: 12, priceClass: 'green' },
    ]
  },
  {
    name: 'AI Model', num: 3,
    options: [
      { id: 'claude', brand: 'claude', name: 'Claude', icon: '🟣', sub: 'Anthropic — Best for code', price: '$0-20/mo', priceVal: 10, priceClass: 'green' },
      { id: 'chatgpt', brand: 'chatgpt', name: 'ChatGPT', icon: '🤖', sub: 'OpenAI — Best for math', price: '$0-20/mo', priceVal: 10, priceClass: 'green' },
      { id: 'gemini', brand: 'gemini', name: 'Gemini', icon: '💎', sub: 'Google — Best for multimodal', price: '$0-20/mo', priceVal: 10, priceClass: 'green' },
    ]
  },
  {
    name: 'Frontend', num: 4,
    options: [
      { id: 'nextjs', brand: 'nextjs', name: 'Next.js', icon: '▲', sub: 'React SSR Framework', price: '$0', priceVal: 0, priceClass: 'green' },
      { id: 'react', brand: 'react', name: 'React', icon: '⚛️', sub: 'SPA Library', price: '$0', priceVal: 0, priceClass: 'green' },
      { id: 'astro', brand: 'astro', name: 'Astro', icon: '🚀', sub: 'Content-First', price: '$0', priceVal: 0, priceClass: 'green' },
    ]
  },
  {
    name: 'Deploy', num: 5,
    options: [
      { id: 'vercel', brand: 'vercel', name: 'Vercel', icon: '▲', sub: 'Best for Next.js', price: '$0-20/mo', priceVal: 6, priceClass: 'green' },
      { id: 'netlify', brand: 'netlify', name: 'Netlify', icon: '🌐', sub: 'Great for static + forms', price: '$0-19/mo', priceVal: 7, priceClass: 'green' },
      { id: 'railway', brand: 'railway', name: 'Railway', icon: '🚂', sub: 'Best for backends', price: '$5-20/mo', priceVal: 10, priceClass: 'green' },
    ]
  }
];

const COMPAT = {
  supabase_edge: 10, supabase_express: 6, supabase_fastapi: 6,
  firebase_edge: 4, firebase_express: 8, firebase_fastapi: 4,
  planetscale_edge: 5, planetscale_express: 8, planetscale_fastapi: 8,
  edge_claude: 10, edge_chatgpt: 7, edge_gemini: 7,
  express_claude: 8, express_chatgpt: 9, express_gemini: 7,
  fastapi_claude: 7, fastapi_chatgpt: 8, fastapi_gemini: 9,
  claude_nextjs: 9, claude_react: 8, claude_astro: 7,
  chatgpt_nextjs: 8, chatgpt_react: 9, chatgpt_astro: 7,
  gemini_nextjs: 7, gemini_react: 8, gemini_astro: 7,
  nextjs_vercel: 10, nextjs_netlify: 7, nextjs_railway: 6,
  react_vercel: 8, react_netlify: 9, react_railway: 6,
  astro_vercel: 8, astro_netlify: 10, astro_railway: 5,
};

let selections = [null, null, null, null, null];
let filled = 0;
let resultShown = false;

function buildUI() {
  const builder = document.getElementById('stackBuilder');
  builder.innerHTML = LAYERS.map((layer, li) => `
    <div class="layer" id="layer-${li}">
      <div class="layer-header">
        <div class="layer-num">${layer.num}</div>
        <div class="layer-name">${layer.name}</div>
      </div>
      <div class="layer-options">
        ${layer.options.map((opt, oi) => `
          <div class="option" data-layer="${li}" data-option="${oi}" data-brand="${opt.brand}" onclick="selectOption(${li},${oi})">
            <div class="selected-indicator">✓</div>
            <span class="icon">${opt.icon}</span>
            <div class="name">${opt.name}</div>
            <div class="sub">${opt.sub}</div>
            <div class="price ${opt.priceClass}">${opt.price}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function selectOption(layerIdx, optIdx) {
  const wasNull = selections[layerIdx] === null;
  selections[layerIdx] = optIdx;

  const options = document.querySelectorAll(`.option[data-layer="${layerIdx}"]`);
  options.forEach((o, i) => {
    o.classList.toggle('selected', i === optIdx);
    if (i === optIdx) {
      o.style.transform = 'scale(1.06)';
      setTimeout(() => o.style.transform = 'scale(1.03)', 200);
    }
  });

  if (wasNull) filled++;
  document.getElementById(`prog-${layerIdx}`).classList.add('filled');
  try { LO.sfx.click(); } catch(e){}

  if (filled === 5) {
    setTimeout(showResult, 500);
  } else if (resultShown) {
    updateResult();
  }
}

function showResult() {
  resultShown = true;
  const card = document.getElementById('resultCard');
  card.classList.add('show');
  updateResult();
  try { LO.completeLesson('ai-stack-builder', 1, 60); } catch(e){}
}

function updateResult() {
  const summary = document.getElementById('stackSummary');
  let totalPrice = 0;

  const displayOrder = [4, 3, 2, 1, 0];
  summary.innerHTML = displayOrder.map(li => {
    const layer = LAYERS[li];
    const opt = layer.options[selections[li]];
    totalPrice += opt.priceVal;
    return `<div class="stack-row">
      <span class="layer-label">${layer.name}</span>
      <span class="choice-label">${opt.icon} ${opt.name}</span>
    </div>`;
  }).join('');

  document.getElementById('totalCost').textContent = `$${totalPrice}/mo`;

  // Compatibility
  const ids = selections.map((s, i) => LAYERS[i].options[s].id);
  let compatTotal = 0, compatCount = 0;
  for (let i = 0; i < ids.length - 1; i++) {
    const key = `${ids[i]}_${ids[i+1]}`;
    if (COMPAT[key] !== undefined) { compatTotal += COMPAT[key]; compatCount++; }
  }
  const compatPct = compatCount > 0 ? Math.round((compatTotal / (compatCount * 10)) * 100) : 50;
  document.getElementById('compatScore').textContent = `${compatPct}%`;

  if (compatPct > 80) {
    document.getElementById('compatScore').style.color = '#22c55e';
    launchConfetti();
  } else if (compatPct > 60) {
    document.getElementById('compatScore').style.color = '#38bdf8';
  } else {
    document.getElementById('compatScore').style.color = '#fb923c';
  }
}

function launchConfetti() {
  const cvs = document.getElementById('confettiCanvas');
  const ctx = cvs.getContext('2d');
  cvs.width = window.innerWidth * 2;
  cvs.height = window.innerHeight * 2;
  cvs.style.width = window.innerWidth + 'px';
  cvs.style.height = window.innerHeight + 'px';

  const colors = ['#c084fc','#38bdf8','#22c55e','#fb923c','#f472b6','#fbbf24'];
  const pieces = [];
  for (let i = 0; i < 120; i++) {
    pieces.push({
      x: Math.random() * cvs.width,
      y: -20 - Math.random() * 200,
      w: 8 + Math.random() * 8,
      h: 4 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 6,
      vy: 3 + Math.random() * 5,
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.2,
      life: 1
    });
  }

  function frame() {
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    let alive = false;
    pieces.forEach(p => {
      if (p.life <= 0) return;
      alive = true;
      p.x += p.vx; p.y += p.vy; p.vy += 0.1; p.rot += p.rotV;
      if (p.y > cvs.height) p.life = 0;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.min(1, p.life);
      ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
      ctx.restore();
    });
    if (alive) requestAnimationFrame(frame);
    else ctx.clearRect(0, 0, cvs.width, cvs.height);
  }
  requestAnimationFrame(frame);
  try { LO.sfx.success(); } catch(e){}
}

buildUI();
</script>
