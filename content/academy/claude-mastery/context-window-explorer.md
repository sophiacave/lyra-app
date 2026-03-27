---
title: "Context Window"
course: "claude-mastery"
order: 2
type: "lab"
free: true
---<div class="xp-burst" id="xpBurst"><div class="xp-burst-text">+240 XP</div></div>

<nav class="nav">


</nav>

<div class="lesson-header">
<div class="lesson-badge">Lesson 2 · Lab</div>
<h1>Context Window Explorer</h1>
<p>Visualize and understand Claude's massive 200K token context</p>
<div class="lesson-meta-bar">⏱ <span>75 min</span> · ⚡ <span>240 XP</span> · 📚 <span>Module 1</span></div>
</div>

<div class="content">

<div class="card">
<h2>What Is a Context Window?</h2>
<p>The context window is the total amount of text an AI can "see" at once — including your prompt, system instructions, conversation history, and the response. Think of it as the model's working memory. Claude's 200K token window means it can process roughly <strong>500 pages</strong> of text in a single conversation.</p>
</div>

<div class="card">
<h2>Model Comparison</h2>
<p>See how Claude stacks up against other models:</p>
<div class="comparison-grid">
<div class="model-bar">
<div class="model-name" style="color:#8b5cf6">Claude 3.5</div>
<div class="model-tokens">200K tokens</div>
<div class="model-visual"></div>
</div>
<div class="model-bar">
<div class="model-name" style="color:#34d399">GPT-4o</div>
<div class="model-tokens">128K tokens</div>
<div class="model-visual"></div>
</div>
<div class="model-bar">
<div class="model-name" style="color:#fb923c">Gemini 1.5</div>
<div class="model-tokens">1M tokens</div>
<div class="model-visual"></div>
</div>
</div>
<p style="font-size:.85rem"><strong>Key insight:</strong> While Gemini has a larger window, Claude's 200K context is often more <em>effectively utilized</em> — Claude shows stronger recall and reasoning across its full context compared to models that may "lose" information in the middle of long contexts (the "lost in the middle" phenomenon).</p>
</div>

<div class="card">
<h2>Live Token Counter</h2>
<p>Type or paste text below to see tokens fill up in real-time. Try different content types to see how they tokenize differently.</p>

<div class="preset-btns">
<button class="preset-btn" onclick="loadPreset('prose')">📝 Prose</button>
<button class="preset-btn" onclick="loadPreset('code')">💻 Code</button>
<button class="preset-btn" onclick="loadPreset('data')">📊 JSON Data</button>
<button class="preset-btn" onclick="loadPreset('poetry')">🎭 Poetry</button>
<button class="preset-btn" onclick="loadPreset('legal')">⚖️ Legal Text</button>
</div>

<textarea id="tokenInput" placeholder="Start typing or paste text here to see the token counter in action..." oninput="updateTokens()"></textarea>

<div class="context-bar-container">
<div class="context-bar-bg">
</div>
<div class="context-labels">
<span>0 tokens</span>
<span>200,000 tokens</span>
</div>
</div>

<div class="context-stats">
<div class="stat-box">
<div class="stat-num" id="tokenCount">0</div>
<div class="stat-label">Est. Tokens</div>
</div>
<div class="stat-box">
<div class="stat-num" id="charCount">0</div>
<div class="stat-label">Characters</div>
</div>
<div class="stat-box">
<div class="stat-num" id="ratioDisplay">0</div>
<div class="stat-label">Chars per Token</div>
</div>
</div>
</div>

<div class="card">
<h2>Token Density by Content Type</h2>
<p>Different types of content tokenize very differently. Code tends to use more tokens per character due to special characters and indentation, while prose is more efficient.</p>
<div id="tokenTypes">
<div class="token-type">
<div class="token-info"><strong>English Prose</strong><span>~4 characters per token</span></div>
<div class="token-ratio">~4:1</div>
</div>
<div class="token-type">
<div class="token-info"><strong>Python Code</strong><span>~3.5 characters per token</span></div>
<div class="token-ratio">~3.5:1</div>
</div>
<div class="token-type">
<div class="token-info"><strong>JSON Data</strong><span>~3 characters per token</span></div>
<div class="token-ratio">~3:1</div>
</div>
<div class="token-type">
<div class="token-info"><strong>HTML/XML</strong><span>~2.5 characters per token</span></div>
<div class="token-ratio">~2.5:1</div>
</div>
<div class="token-type">
<div class="token-info"><strong>Non-English Text</strong><span>~2 characters per token</span></div>
<div class="token-ratio">~2:1</div>
</div>
</div>
</div>

<div class="card">
<h2>What Fits in 200K Tokens?</h2>
<p>To put Claude's context window in perspective:</p>
<div class="comparison-grid">
<div class="model-bar" style="border-color:rgba(139,92,246,.2)">
<div style="font-size:2rem;margin-bottom:.5rem">📚</div>
<div class="model-name">~500 Pages</div>
<div style="font-size:.8rem;color:#71717a">of a novel</div>
</div>
<div class="model-bar" style="border-color:rgba(251,146,60,.2)">
<div style="font-size:2rem;margin-bottom:.5rem">💻</div>
<div class="model-name">~150K Lines</div>
<div style="font-size:.8rem;color:#71717a">of code</div>
</div>
<div class="model-bar" style="border-color:rgba(56,189,248,.2)">
<div style="font-size:2rem;margin-bottom:.5rem">📄</div>
<div class="model-name">~300 PDFs</div>
<div style="font-size:.8rem;color:#71717a">typical business docs</div>
</div>
<div class="model-bar" style="border-color:rgba(52,211,153,.2)">
<div style="font-size:2rem;margin-bottom:.5rem">💬</div>
<div class="model-name">~8 Hours</div>
<div style="font-size:.8rem;color:#71717a">of conversation</div>
</div>
</div>
</div>

<div class="card">
<button class="complete-btn" onclick="completeLesson()">Complete & Continue →</button>
</div>
</div>

<div class="progress-footer">
<span class="progress-label">Lesson 2 of 10</span>
<div class="progress-bar-wrap"></div>
<span class="progress-label">Module 1</span>
</div>

<script>
const PRESETS={
prose:`The art of prompt engineering is both a science and a craft. When working with large language models like Claude, the way you frame your request dramatically influences the quality of the response you receive. A well-crafted prompt provides clear context, specifies the desired format, and includes relevant constraints that guide the model toward producing exactly what you need.\n\nConsider the difference between asking "Write about dogs" versus "Write a 200-word informative paragraph about Golden Retrievers' temperament, suitable for a family pet adoption website, using warm and encouraging language." The second prompt is specific, contextual, and bounded — leading to a far more useful response.`,
code:`import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  createdAt: Date;
}

export function UserDashboard({ organizationId }: { organizationId: string }) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data: users, isLoading } = useQuery({
    queryKey: ['users', organizationId, search, page],
    queryFn: () => fetchUsers({ organizationId, search, page, limit: 20 }),
    keepPreviousData: true,
  });

  const deleteMutation = useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
    onSuccess: () => queryClient.invalidateQueries(['users']),
  });

  const handleDelete = useCallback((userId: string) => {
    if (confirm('Are you sure?')) deleteMutation.mutate(userId);
  }, [deleteMutation]);

  return (
    <div className="dashboard">
      <SearchBar value={search} onChange={setSearch} />
      <UserTable users={users?.items ?? []} onDelete={handleDelete} />
      <Pagination page={page} total={users?.total ?? 0} onPageChange={setPage} />
    </div>
  );
}`,
data:`{
  "company": "Acme Corp",
  "employees": [
    {"id": 1, "name": "Alice Johnson", "department": "Engineering", "salary": 125000, "skills": ["Python", "React", "AWS"]},
    {"id": 2, "name": "Bob Smith", "department": "Marketing", "salary": 95000, "skills": ["SEO", "Analytics", "Content"]},
    {"id": 3, "name": "Carol Williams", "department": "Engineering", "salary": 135000, "skills": ["Rust", "Go", "Kubernetes"]},
    {"id": 4, "name": "David Brown", "department": "Sales", "salary": 88000, "skills": ["CRM", "Negotiation", "Forecasting"]},
    {"id": 5, "name": "Eve Davis", "department": "Engineering", "salary": 142000, "skills": ["ML", "Python", "TensorFlow"]}
  ],
  "metrics": {"revenue": 5200000, "growth": 0.23, "churn": 0.04}
}`,
poetry:`Two roads diverged in a yellow wood,
And sorry I could not travel both
And be one traveler, long I stood
And looked down one as far as I could
To where it bent in the undergrowth;

Then took the other, as just as fair,
And having perhaps the better claim,
Because it was grassy and wanted wear;
Though as for that the passing there
Had worn them really about the same.`,
legal:`WHEREAS, the Party of the First Part (hereinafter referred to as "Licensor") is the owner of certain intellectual property rights, including but not limited to patents, trademarks, copyrights, and trade secrets related to the Software (as defined herein); and WHEREAS, the Party of the Second Part (hereinafter referred to as "Licensee") desires to obtain a non-exclusive, non-transferable license to use, modify, and distribute the Software subject to the terms and conditions set forth herein; NOW, THEREFORE, in consideration of the mutual covenants and agreements contained herein, and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the parties agree as follows: Section 1.1 - Definitions. "Software" shall mean the computer program(s) identified in Exhibit A, including all source code, object code, documentation, and related materials.`
};

function loadPreset(type){
document.getElementById('tokenInput').value=PRESETS[type];
document.querySelectorAll('.preset-btn').forEach(b=>b.classList.remove('active'));
event.target.classList.add('active');
updateTokens();
}

function estimateTokens(text){
if(!text) return{tokens:0,chars:0,ratio:0};
const chars=text.length;
const words=text.split(/\s+/).filter(w=>w).length;
const specialChars=(text.match(/[^a-zA-Z0-9\s]/g)||[]).length;
const tokens=Math.ceil(words*1.3+specialChars*0.5);
return{tokens,chars,ratio:tokens>0?(chars/tokens).toFixed(1):0};
}

function updateTokens(){
const text=document.getElementById('tokenInput').value;
const{tokens,chars,ratio}=estimateTokens(text);
document.getElementById('tokenCount').textContent=tokens.toLocaleString();
document.getElementById('charCount').textContent=chars.toLocaleString();
document.getElementById('ratioDisplay').textContent=ratio;
const pct=Math.min((tokens/200000)*100,100);
const bar=document.getElementById('ctxBar');
bar.style.width=pct+'%';
if(pct>75) bar.style.background='linear-gradient(90deg,#8b5cf6,#f87171)';
else if(pct>50) bar.style.background='linear-gradient(90deg,#8b5cf6,#fb923c)';
else bar.style.background='linear-gradient(90deg,#8b5cf6,#6d28d9)';
}

// Animate model bars on load
setTimeout(()=>{
document.querySelectorAll('[data-anim]').forEach(el=>{
el.style.width=el.dataset.anim+'%';
});
},500);

function completeLesson(){
localStorage.setItem('cm_context-window','done');
const burst=document.getElementById('xpBurst');burst.classList.add('show');
const cont=document.getElementById('particles');
const colors=['#8b5cf6','#fb923c','#34d399','#f472b6','#38bdf8'];
for(let i=0;i<30;i++){const p=document.createElement('div');p.className='particle';const s=Math.random()*8+4;p.style.width=s+'px';p.style.height=s+'px';p.style.background=colors[Math.floor(Math.random()*colors.length)];p.style.left='50%';p.style.top='50%';p.style.setProperty('--tx',(Math.random()-0.5)*400+'px');p.style.setProperty('--ty',(Math.random()-0.5)*400+'px');p.style.animation='particleFly .8s ease forwards';p.style.animationDelay=(Math.random()*.2)+'s';cont.appendChild(p);setTimeout(()=>p.remove(),1200);}
setTimeout(()=>{burst.classList.remove('show');LO_NAV.goNext()},1200);
}
</script>
