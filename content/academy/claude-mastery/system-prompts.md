---
title: "System Prompts"
course: "claude-mastery"
order: 4
type: "lesson"
free: false
---<div class="xp-burst" id="xpBurst"><div class="xp-burst-text">+240 XP</div></div>

<nav class="nav">


</nav>

<div class="lesson-header">
<div class="lesson-badge">Lesson 4 · Builder</div>
<h1>System Prompt Builder</h1>
<p>Master the art of crafting powerful system prompts</p>
<div class="lesson-meta-bar">⏱ <span>75 min</span> · ⚡ <span>240 XP</span> · 📚 <span>Module 2</span></div>
</div>

<div class="content">
<div class="card">
<h2>What Are System Prompts?</h2>
<p>A system prompt is the invisible instruction set that defines <em>who</em> Claude is and <em>how</em> it behaves for a given conversation. It's like hiring an expert and briefing them before they start work. A great system prompt has five key components: <strong>Identity</strong>, <strong>Constraints</strong>, <strong>Format</strong>, <strong>Tone</strong>, and <strong>Examples</strong>.</p>
</div>

<div class="card">
<h2>Build Your System Prompt</h2>
<p>Click blocks from the palette to add them to your prompt. Arrange the components to create the perfect system prompt.</p>

<div class="builder-grid">
<div class="block-palette">
<h3>Available Blocks</h3>
<div class="draggable-block" data-type="identity" data-text="You are a senior software engineer with 15 years of experience in full-stack development." onclick="addBlock(this)">
<span class="block-tag tag-identity">Identity</span>
Senior Software Engineer
</div>
<div class="draggable-block" data-type="identity" data-text="You are a friendly writing tutor who specializes in helping beginners improve their creative writing." onclick="addBlock(this)">
<span class="block-tag tag-identity">Identity</span>
Writing Tutor
</div>
<div class="draggable-block" data-type="constraints" data-text="Never provide medical, legal, or financial advice. Always recommend consulting a professional for those topics." onclick="addBlock(this)">
<span class="block-tag tag-constraints">Constraints</span>
Safety Guardrails
</div>
<div class="draggable-block" data-type="constraints" data-text="Keep all responses under 200 words unless the user explicitly asks for more detail." onclick="addBlock(this)">
<span class="block-tag tag-constraints">Constraints</span>
Concise Responses
</div>
<div class="draggable-block" data-type="format" data-text="Always structure your response with: 1) A brief summary, 2) Detailed explanation, 3) Code example if applicable, 4) Next steps." onclick="addBlock(this)">
<span class="block-tag tag-format">Format</span>
Structured Response
</div>
<div class="draggable-block" data-type="format" data-text="Respond using markdown with headers, bullet points, and code blocks where appropriate." onclick="addBlock(this)">
<span class="block-tag tag-format">Format</span>
Markdown Output
</div>
<div class="draggable-block" data-type="tone" data-text="Be encouraging and supportive. Celebrate progress. Use analogies to explain complex concepts." onclick="addBlock(this)">
<span class="block-tag tag-tone">Tone</span>
Warm & Encouraging
</div>
<div class="draggable-block" data-type="tone" data-text="Be direct and technical. Skip pleasantries. Focus on accuracy and efficiency." onclick="addBlock(this)">
<span class="block-tag tag-tone">Tone</span>
Direct & Technical
</div>
<div class="draggable-block" data-type="examples" data-text='Example:\nUser: "How do I center a div?"\nAssistant: "**Quick answer:** Use flexbox.\n```css\n.parent { display: flex; justify-content: center; align-items: center; }\n```\n**Why this works:** Flexbox creates a flex container..."' onclick="addBlock(this)">
<span class="block-tag tag-examples">Examples</span>
Code Q&A Example
</div>
<div class="draggable-block" data-type="examples" data-text='Example:\nUser: "Review my paragraph"\nAssistant: "Great start! I love your opening hook. Here are 3 suggestions:\n1. **Stronger verbs** — Replace \'walked\' with \'strode\' or \'ambled\'\n2. **Show, don\'t tell** — Instead of \'she was sad\'...\n3. **Pacing** — Your second sentence could be split..."' onclick="addBlock(this)">
<span class="block-tag tag-examples">Examples</span>
Writing Review Example
</div>
</div>

<div>
<h3 style="font-size:.85rem;font-weight:700;color:#71717a;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.75rem">Your System Prompt</h3>
<div class="drop-zone" id="dropZone">
<div class="drop-zone-placeholder" id="dzPlaceholder">Click blocks from the left to build your system prompt</div>
</div>
</div>
</div>
</div>

<div class="card">
<h2>Preview</h2>
<p>Your assembled system prompt:</p>
<div class="preview-box" id="previewBox">Add blocks above to see your system prompt here...</div>
</div>

<div class="card">
<h2>Test Against Scenarios</h2>
<p>See how your system prompt would influence Claude's response to these user messages:</p>
<div class="scenario-tabs">
<button class="scenario-tab active" onclick="showScenario(0,this)">Debugging Help</button>
<button class="scenario-tab" onclick="showScenario(1,this)">Explain Concept</button>
<button class="scenario-tab" onclick="showScenario(2,this)">Review My Work</button>
</div>
</div>

<div class="card">
<button class="complete-btn" onclick="completeLesson()">Complete & Continue →</button>
</div>
</div>

<div class="progress-footer">
<span class="progress-label">Lesson 4 of 10</span>
<div class="progress-bar-wrap"></div>
<span class="progress-label">Module 2</span>
</div>

<script>
let blocks=[];

const SCENARIOS=[
{prompt:"My React app crashes when I click the submit button. The console says 'Cannot read property map of undefined'. Help!",
responses:{
engineer:"**Summary:** You have a null reference error — you're calling `.map()` on a variable that's `undefined`.\n\n**Root cause:** Your state likely isn't initialized as an array, or an API response returned `undefined` instead of an array.\n\n**Fix:**\n```jsx\n// Add optional chaining and default value\nconst items = data?.results ?? [];\nreturn items.map(item => <Item key={item.id} {...item} />);\n```\n\n**Next steps:** Add error boundaries and loading states.",
tutor:"Don't worry — this is one of the most common React errors! 🎉 (Seriously, everyone hits this one.)\n\nThink of it like trying to read a book that hasn't been delivered yet. Your code says 'read each page' (.map), but the book (your data) hasn't arrived!\n\n**The fix is simple:** Just add a safety check:\n```jsx\n{data && data.map(item => ...)}\n```\n\nYou're doing great — debugging is a superpower you're building! 💪"}},
{prompt:"What is a closure in JavaScript?",
responses:{
engineer:"A closure is a function that retains access to its lexical scope even when executed outside that scope.\n\n```javascript\nfunction createCounter() {\n  let count = 0; // enclosed variable\n  return () => ++count;\n}\nconst counter = createCounter();\ncounter(); // 1\ncounter(); // 2\n```\n\nKey points:\n- Inner function captures outer variables by reference\n- Enables data privacy and state persistence\n- Common patterns: module pattern, partial application, event handlers\n- Watch for: memory leaks with large closures in loops",
tutor:"Imagine you have a backpack 🎒. Every time you walk into a room (a function), you can pick up items (variables) and put them in your backpack. A closure is when you leave the room but *keep the backpack* — you still have access to everything you picked up!\n\n```javascript\nfunction makeGreeter(name) {\n  // 'name' goes in the backpack!\n  return () => `Hello, ${name}!`;\n}\nconst greetAlice = makeGreeter('Alice');\ngreetAlice(); // \"Hello, Alice!\"\n// Alice's name is still in the backpack!\n```\n\nPretty cool, right? You already use closures all the time — now you just know the name for it! ✨"}},
{prompt:"Can you review this function I wrote?\nfunction getData() { var x = fetch('/api'); return x; }",
responses:{
engineer:"**Issues identified:**\n\n1. **Missing `await`** — `fetch()` returns a Promise, not data\n2. **No error handling** — network failures will crash silently\n3. **`var` usage** — use `const`/`let` in modern JS\n4. **No response parsing** — need `.json()` call\n\n**Corrected:**\n```javascript\nasync function getData() {\n  const response = await fetch('/api');\n  if (!response.ok) throw new Error(`HTTP ${response.status}`);\n  return response.json();\n}\n```",
tutor:"Nice work writing your first fetch function! You're on the right track. Let me help you level it up with 3 improvements:\n\n1. **The Promise thing** — `fetch` is like ordering food delivery. Your code grabs the receipt instead of waiting for the food! Add `async/await`:\n```javascript\nasync function getData() {\n  const response = await fetch('/api');\n  return response.json();\n}\n```\n\n2. **Safety net** — What if the API is down? Add error handling (we'll cover this more later!)\n\n3. **Modern style** — Swap `var` for `const` — it's the current best practice.\n\nYou're making great progress! 🚀"}}
];

function addBlock(el){
const type=el.dataset.type;
const text=el.dataset.text;
const label=el.querySelector('.block-tag').textContent;
const name=el.textContent.replace(label,'').trim();
blocks.push({type,text,label,name});
el.style.opacity='.4';
el.style.pointerEvents='none';
renderBlocks();
}

function removeBlock(idx){
const block=blocks[idx];
blocks.splice(idx,1);
document.querySelectorAll('.draggable-block').forEach(el=>{
if(el.dataset.text===block.text){el.style.opacity='1';el.style.pointerEvents='auto';}
});
renderBlocks();
}

function renderBlocks(){
const dz=document.getElementById('dropZone');
const ph=document.getElementById('dzPlaceholder');
if(blocks.length===0){
ph.style.display='block';
dz.querySelectorAll('.dropped-block').forEach(b=>b.remove());
}else{
ph.style.display='none';
dz.querySelectorAll('.dropped-block').forEach(b=>b.remove());
blocks.forEach((b,i)=>{
const d=document.createElement('div');
d.className='dropped-block';
d.innerHTML=`<span><span class="block-tag tag-${b.type}" style="margin-right:.5rem">${b.label}</span>${b.name}</span><button class="remove-btn" onclick="removeBlock(${i})">✕</button>`;
dz.appendChild(d);
});
}
updatePreview();
}

function updatePreview(){
const box=document.getElementById('previewBox');
if(blocks.length===0){box.textContent='Add blocks above to see your system prompt here...';return;}
box.textContent=blocks.map(b=>b.text.replace(/\\n/g,'\n')).join('\n\n');
}

function showScenario(idx,btn){
document.querySelectorAll('.scenario-tab').forEach(t=>t.classList.remove('active'));
btn.classList.add('active');
const s=SCENARIOS[idx];
const cont=document.getElementById('scenarioContainer');
const hasEngineer=blocks.some(b=>b.name.includes('Software Engineer')||b.name.includes('Direct'));
const hasTutor=blocks.some(b=>b.name.includes('Writing Tutor')||b.name.includes('Warm'));
const responseType=(hasEngineer?'engineer':'tutor');
const response=s.responses[responseType];
cont.innerHTML=`<div class="scenario-result show">
<div class="scenario-prompt"><strong>User:</strong> ${s.prompt}</div>
<div><strong>Claude's response</strong> (shaped by your system prompt):</div>
<div style="margin-top:.75rem;white-space:pre-wrap;line-height:1.7">${response}</div>
</div>`;
}

showScenario(0,document.querySelector('.scenario-tab'));

function completeLesson(){
localStorage.setItem('cm_system-prompts','done');
const burst=document.getElementById('xpBurst');burst.classList.add('show');
const cont=document.getElementById('particles');const colors=['#8b5cf6','#fb923c','#34d399','#f472b6','#38bdf8'];
for(let i=0;i<30;i++){const p=document.createElement('div');p.className='particle';const s=Math.random()*8+4;p.style.width=s+'px';p.style.height=s+'px';p.style.background=colors[Math.floor(Math.random()*colors.length)];p.style.left='50%';p.style.top='50%';p.style.setProperty('--tx',(Math.random()-0.5)*400+'px');p.style.setProperty('--ty',(Math.random()-0.5)*400+'px');p.style.animation='particleFly .8s ease forwards';p.style.animationDelay=(Math.random()*.2)+'s';cont.appendChild(p);setTimeout(()=>p.remove(),1200);}
setTimeout(()=>{burst.classList.remove('show');LO_NAV.goNext()},1200);
}
</script>
