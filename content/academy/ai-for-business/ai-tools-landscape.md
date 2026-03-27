---
title: "AI Tools Landscape"
course: "ai-for-business"
order: 6
type: "lesson"
free: false
---<div class="wrap">
<a href="index.html" class="back">← Course Overview</a>
<div class="lesson-num">Lesson 6 of 10</div>
<h1>The AI Tools Landscape</h1>
<p class="intro">Real tools. Real prices. Click a category to explore, then filter by your budget. No hype -- just what works.</p>

<div style="background:rgba(245,158,11,.06);border:1px solid rgba(245,158,11,.15);border-radius:12px;padding:1.25rem;margin-bottom:24px;font-size:14px;color:#a3a3a3;line-height:1.6">
  <strong style="color:#f59e0b">New to AI tools?</strong> Start with the <strong>Writing & Content</strong> category -- tools like Claude and ChatGPT have free tiers and are the easiest way to get value from AI immediately. Look for the <span style="color:#22c55e;font-weight:700">green "Best" tags</span> for our recommended starting points in each category.
</div>

<p style="font-size:13px;color:#737373;margin-bottom:16px"><strong style="color:#a3a3a3">How filtering works:</strong> Click a budget button below to show only tools within that price range. Then click any category card to see the matching tools. Each category groups tools by what they do.</p>

<div class="filter-row">
<span style="font-size:13px;font-weight:700;color:#737373;padding:8px 0">Budget:</span>
<button class="filter-btn active" data-budget="all">All</button>
<button class="filter-btn" data-budget="0">Free</button>
<button class="filter-btn" data-budget="50">&lt; $50/mo</button>
<button class="filter-btn" data-budget="200">&lt; $200/mo</button>
</div>

<div class="categories" id="categories"></div>
<div class="tools-panel" id="tools-panel">
<div class="panel-header">
<div class="panel-title" id="panel-title"></div>
<button class="panel-close" onclick="closePanel()">&times;</button>
</div>
<div id="tools-list"></div>
</div>

<div class="nav-row">
<a href="build-vs-buy.html" class="nav-link">← Prev: Build vs. Buy</a>
<a href="your-first-week-with-ai.html" class="nav-link">Next: Your First Week →</a>
</div>
</div>

<script>
const data = {
  writing: {emoji:"✍️", name:"Writing & Content", tools:[
    {name:"Claude (Anthropic)", price:0, priceTxt:"Free / $20/mo Pro", desc:"Best for long-form writing, analysis, and nuanced business communication. Understands context exceptionally well.", tags:["Best for Business","popular"]},
    {name:"ChatGPT (OpenAI)", price:0, priceTxt:"Free / $20/mo Plus", desc:"The most well-known AI assistant. Strong at drafting, brainstorming, and general writing tasks.", tags:["Most Popular","popular"]},
    {name:"Jasper", price:49, priceTxt:"From $49/mo", desc:"Built specifically for marketing teams. Templates for ads, blogs, social media, and product descriptions.", tags:["Marketing Focus"]},
  ]},
  image: {emoji:"🎨", name:"Image Generation", tools:[
    {name:"Midjourney", price:10, priceTxt:"From $10/mo", desc:"Highest quality AI images. Perfect for marketing materials, social posts, and brand visuals.", tags:["Best Quality","popular"]},
    {name:"DALL-E 3 (via ChatGPT)", price:20, priceTxt:"Included in ChatGPT Plus ($20/mo)", desc:"Easy to use, good quality. Great for quick visuals and brainstorming design ideas.", tags:["Easiest to Use"]},
    {name:"Canva AI", price:0, priceTxt:"Free / $13/mo Pro", desc:"AI features built into the design tool you probably already use. Magic Write, Magic Design, background removal.", tags:["Best Value","best"]},
  ]},
  video: {emoji:"🎬", name:"Video & Audio", tools:[
    {name:"Descript", price:24, priceTxt:"Free / $24/mo Pro", desc:"Edit video by editing text. Remove filler words automatically. Create clips for social media.", tags:["Best for Business","best"]},
    {name:"HeyGen", price:29, priceTxt:"From $29/mo", desc:"Create AI avatar videos. Great for training content, product demos, and personalized outreach.", tags:["AI Avatars"]},
    {name:"ElevenLabs", price:0, priceTxt:"Free / $5/mo Starter", desc:"Ultra-realistic AI voice generation. Clone your voice for consistent content creation.", tags:["Voice Cloning","popular"]},
  ]},
  voice: {emoji:"🎙️", name:"Transcription & Voice", tools:[
    {name:"Otter.ai", price:0, priceTxt:"Free / $17/mo Pro", desc:"Live meeting transcription with speaker identification. Integrates with Zoom, Teams, Google Meet.", tags:["Best for Meetings","best"]},
    {name:"Fireflies.ai", price:0, priceTxt:"Free / $19/mo Pro", desc:"AI meeting assistant that records, transcribes, and summarizes. Creates action items automatically.", tags:["Auto Summaries","popular"]},
    {name:"Rev", price:0, priceTxt:"$0.25/minute", desc:"Human + AI transcription for maximum accuracy. Best when you need perfect transcripts.", tags:["Most Accurate"]},
  ]},
  automation: {emoji:"⚡", name:"Automation", tools:[
    {name:"Zapier", price:0, priceTxt:"Free / $20/mo Starter", desc:"Connect 6,000+ apps with AI-powered workflows. The glue between your existing tools.", tags:["Most Integrations","popular"]},
    {name:"Make (formerly Integromat)", price:0, priceTxt:"Free / $9/mo Core", desc:"Visual automation builder. More powerful than Zapier for complex workflows, lower price.", tags:["Best Value","best"]},
    {name:"Microsoft Power Automate", price:15, priceTxt:"From $15/user/mo", desc:"Best if your company already uses Microsoft 365. Deep integration with Office apps.", tags:["Best for Microsoft"]},
  ]},
  analytics: {emoji:"📊", name:"Analytics & Data", tools:[
    {name:"Julius AI", price:0, priceTxt:"Free / $20/mo Pro", desc:"Upload a spreadsheet, ask questions in plain English, get charts and insights. No formulas needed.", tags:["Easiest to Use","best"]},
    {name:"Tableau (with AI)", price:75, priceTxt:"From $75/user/mo", desc:"Enterprise-grade dashboards with AI-powered insights. Ask questions about your data naturally.", tags:["Enterprise"]},
    {name:"Google Looker Studio + Gemini", price:0, priceTxt:"Free", desc:"Free dashboards with Google's AI built in. Best if you already use Google Workspace.", tags:["Free","popular"]},
  ]},
  code: {emoji:"🔌", name:"No-Code AI Builders", tools:[
    {name:"Bubble", price:0, priceTxt:"Free / $29/mo Starter", desc:"Build full web apps without writing a single line. AI features help you build faster.", tags:["Most Popular","popular"]},
    {name:"Softr", price:0, priceTxt:"Free / $49/mo Basic", desc:"Turn your Airtable or Google Sheets data into apps, portals, and internal tools.", tags:["Spreadsheet to App"]},
    {name:"Relevance AI", price:0, priceTxt:"Free / $19/mo", desc:"Build AI agents and workflows without technical knowledge. Automate complex multi-step tasks.", tags:["AI Agents","best"]},
  ]},
  support: {emoji:"🎧", name:"Customer Service", tools:[
    {name:"Intercom Fin", price:99, priceTxt:"From $0.99/resolution", desc:"AI chatbot that actually resolves customer issues. Learns from your help docs and past conversations.", tags:["Best AI Chatbot","popular"]},
    {name:"Zendesk AI", price:55, priceTxt:"From $55/agent/mo", desc:"AI-powered ticket routing, suggested replies, and automated responses. Integrates with your existing support.", tags:["Enterprise"]},
    {name:"Tidio", price:0, priceTxt:"Free / $29/mo Starter", desc:"AI chatbot + live chat + helpdesk in one. Great for small businesses getting started with AI support.", tags:["Best for SMBs","best"]},
  ]},
};

let activeBudget = 'all';
let activeCategory = null;
let explored = new Set();

// Render categories
const catGrid = document.getElementById('categories');
Object.entries(data).forEach(([key, cat]) => {
  const card = document.createElement('div');
  card.className = 'cat-card';
  card.dataset.key = key;
  card.innerHTML = `<div class="cat-emoji">${cat.emoji}</div><div class="cat-name">${cat.name}</div><div class="cat-count">${cat.tools.length} tools</div>`;
  card.addEventListener('click', () => openCategory(key));
  catGrid.appendChild(card);
});

// Budget filter
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    activeBudget = btn.dataset.budget;
    if(activeCategory) filterTools();
    LO.sfx.click();
  });
});

function openCategory(key){
  activeCategory = key;
  explored.add(key);
  const cat = data[key];
  document.querySelectorAll('.cat-card').forEach(c=>c.classList.toggle('active', c.dataset.key===key));
  document.getElementById('panel-title').textContent = cat.emoji + ' ' + cat.name;
  renderTools(cat.tools);
  document.getElementById('tools-panel').classList.add('active');
  document.getElementById('tools-panel').scrollIntoView({behavior:'smooth',block:'nearest'});
  LO.sfx.click();

  if(explored.size >= 4){
    LO.completeLesson('ai-biz', 6, 120);
  }
}

function renderTools(tools){
  const list = document.getElementById('tools-list');
  list.innerHTML = '';
  tools.forEach(t => {
    const card = document.createElement('div');
    card.className = 'tool-card';
    card.dataset.price = t.price;
    const tagsHTML = t.tags.map(tag => {
      const cls = tag.toLowerCase().includes('best') ? 'best' : tag.toLowerCase().includes('popular') ? 'popular' : '';
      return `<span class="tag ${cls}">${tag}</span>`;
    }).join('');
    card.innerHTML = `<div class="tool-header"><div class="tool-name">${t.name}</div><div class="tool-price">${t.price===0?'<span class="free">'+t.priceTxt+'</span>':t.priceTxt}</div></div><div class="tool-desc">${t.desc}</div><div class="tool-tags">${tagsHTML}</div>`;
    list.appendChild(card);
  });
  filterTools();
}

function filterTools(){
  document.querySelectorAll('.tool-card').forEach(card => {
    const price = +card.dataset.price;
    let show = true;
    if(activeBudget === '0') show = price === 0;
    else if(activeBudget === '50') show = price < 50;
    else if(activeBudget === '200') show = price < 200;
    card.classList.toggle('hidden', !show);
  });
}

function closePanel(){
  document.getElementById('tools-panel').classList.remove('active');
  document.querySelectorAll('.cat-card').forEach(c=>c.classList.remove('active'));
  activeCategory = null;
}
</script>
