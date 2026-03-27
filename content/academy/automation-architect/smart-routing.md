---
title: "Smart Routing"
course: "automation-architect"
order: 7
type: "lesson"
free: false
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>
  
</nav>
<header class="lesson-header">
  <div class="lesson-badge">Module 3 &middot; Animated</div>
  <h1>Smart Routing</h1>
  <p>Use AI to classify incoming data and automatically route it to the right team. No rules engine needed.</p>
</header>

<div class="content">
  <h2>AI-Powered Classification</h2>
  <p class="section-text">Instead of writing hundreds of if/else rules, an AI classifier reads the content, determines intent, and routes data to the correct handler. One model replaces a wall of conditions.</p>

  <!-- Workflow diagram -->
  <div class="workflow">
    <div class="wf-row" style="justify-content:center">
      <div class="wf-node wf-input" id="wf-input">
        <div class="wf-icon">&#128232;</div>
        <div class="wf-label">Incoming Email</div>
        <div class="wf-sub">customer message</div>
      </div>
    </div>
    <div class="wf-connector"><div class="wf-line wf-line-down"></div></div>
    <div class="wf-row" style="justify-content:center">
      <div class="wf-node wf-ai" id="wf-ai">
        <div class="wf-icon">&#129504;</div>
        <div class="wf-label">AI Classifier</div>
        <div class="wf-sub">determines intent</div>
      </div>
    </div>
    <div class="wf-connector" style="display:flex;flex-direction:row;gap:6rem;justify-content:center;padding:0">
      <div style="display:flex;flex-direction:column;align-items:center;padding:.75rem 0"><div class="wf-line wf-line-left"></div></div>
      <div style="display:flex;flex-direction:column;align-items:center;padding:.75rem 0"><div class="wf-line wf-line-mid"></div></div>
      <div style="display:flex;flex-direction:column;align-items:center;padding:.75rem 0"><div class="wf-line wf-line-right"></div></div>
    </div>
    <div class="wf-branches">
      <div class="wf-branch">
        <div class="wf-node wf-billing" id="wf-billing">
          <div class="wf-icon">&#128179;</div>
          <div class="wf-label">Billing Team</div>
          <div class="wf-sub">invoices, payments</div>
        </div>
      </div>
      <div class="wf-branch">
        <div class="wf-node wf-support" id="wf-support">
          <div class="wf-icon">&#128736;</div>
          <div class="wf-label">Support Team</div>
          <div class="wf-sub">bugs, help requests</div>
        </div>
      </div>
      <div class="wf-branch">
        <div class="wf-node wf-sales" id="wf-sales">
          <div class="wf-icon">&#128176;</div>
          <div class="wf-label">Sales Team</div>
          <div class="wf-sub">upgrades, demos</div>
        </div>
      </div>
    </div>
  </div>

  <h2>Try It: Click an Email</h2>
  <p class="section-text">Click each sample email to see the AI classify its intent and route it to the correct team.</p>

  <div class="email-grid">
    <div class="email-card" id="email-billing" onclick="classifyEmail('billing')">
      <div class="email-from">From: jane@acme.co</div>
      <div class="email-subject">Invoice #4821 is incorrect</div>
      <div class="email-preview">Hi, I was charged $299 instead of $199 on my last invoice. Can you correct this and issue a refund for the difference?</div>
    </div>
    <div class="email-card" id="email-support" onclick="classifyEmail('support')">
      <div class="email-from">From: mike@startup.io</div>
      <div class="email-subject">Dashboard not loading</div>
      <div class="email-preview">Getting a blank white screen when I try to access the analytics dashboard. Cleared cache, tried different browser. Still broken.</div>
    </div>
    <div class="email-card" id="email-sales" onclick="classifyEmail('sales')">
      <div class="email-from">From: cto@enterprise.com</div>
      <div class="email-subject">Enterprise plan for 500 seats</div>
      <div class="email-preview">We're evaluating your platform for our engineering org (500+ people). Can we schedule a demo and discuss enterprise pricing?</div>
    </div>
  </div>

  <div class="classification-result" id="classResult">
    <div class="class-label">AI Classification</div>
    <div style="color:#52525b;font-size:.85rem">Click an email above to see the AI route it</div>
  </div>

  <button class="complete-btn" id="completeBtn" onclick="completeLesson()">Complete Lesson &mdash; Earn 50 XP</button>
</div>

<footer class="progress-footer"><p>Lesson 7 of 9 &middot; Automation Architect</p></footer>

<script>
const SLUG='smart-routing';
const STORAGE_KEY='automation-architect-progress';

const classifications={
  billing:{intent:'Billing Issue',confidence:94,route:'Billing Team',color:'intent-billing',nodeId:'wf-billing',selClass:'billing-sel'},
  support:{intent:'Technical Support',confidence:97,route:'Support Team',color:'intent-support',nodeId:'wf-support',selClass:'support-sel'},
  sales:{intent:'Sales Inquiry',confidence:91,route:'Sales Team',color:'intent-sales',nodeId:'wf-sales',selClass:'sales-sel'}
};

function classifyEmail(type){
  // Reset
  document.querySelectorAll('.email-card').forEach(c=>{c.classList.remove('selected','billing-sel','support-sel','sales-sel')});
  document.querySelectorAll('.wf-node').forEach(n=>n.classList.remove('active'));

  const c=classifications[type];
  const card=document.getElementById('email-'+type);
  card.classList.add('selected',c.selClass);

  // Animate workflow
  const inputNode=document.getElementById('wf-input');
  const aiNode=document.getElementById('wf-ai');
  const targetNode=document.getElementById(c.nodeId);

  inputNode.classList.add('active');
  setTimeout(()=>{inputNode.classList.remove('active');aiNode.classList.add('active')},500);
  setTimeout(()=>{aiNode.classList.remove('active');targetNode.classList.add('active')},1200);

  // Show classification
  setTimeout(()=>{
    document.getElementById('classResult').innerHTML=`
      <div class="class-label">AI Classification</div>
      <div class="class-intent ${c.color}">${c.intent}</div>
      <div class="class-confidence">Confidence: ${c.confidence}%</div>
      <div class="class-route ${c.color}">Routed to: ${c.route}</div>
    `;
  },800);
}

function completeLesson(){
  const progress=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');
  progress[SLUG]=true;localStorage.setItem(STORAGE_KEY,JSON.stringify(progress));
  const btn=document.getElementById('completeBtn');btn.textContent='Completed! +50 XP';btn.classList.add('done');
}

(function(){
  const progress=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');
  if(progress[SLUG]){document.getElementById('completeBtn').textContent='Completed! +50 XP';document.getElementById('completeBtn').classList.add('done');}
})();

setTimeout(()=>classifyEmail('billing'),800);
</script>
