---
title: "Your First Automation"
course: "automation-architect"
order: 2
type: "lesson"
free: true
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>
  
</nav>

<header class="lesson-header">
  <div class="lesson-badge">Module 1 &middot; Interactive</div>
  <h1>Your First Automation</h1>
  <p>Pick a trigger, choose an action, wire them together, and deploy. You'll build a real automation pattern.</p>
</header>

<div class="content">
  <div class="step-indicator">
    <div class="step-dot active" id="step1"><span class="step-label">Pick Trigger</span><div class="dot">1</div></div>
    <div class="step-dot" id="step2"><span class="step-label">Pick Action</span><div class="dot">2</div></div>
    <div class="step-dot" id="step3"><span class="step-label">Deploy</span><div class="dot">3</div></div>
  </div>

  <!-- Step 1: Pick trigger -->
  <div class="builder-section" id="triggerSection">
    <h2>Step 1: Choose Your Trigger</h2>
    <p>What event starts your automation?</p>
    <div class="option-grid">
      <div class="option-card" onclick="pickTrigger('email','&#128232;','New Email','Fires when a new email arrives')">
        <div class="opt-icon">&#128232;</div>
        <div class="opt-name">New Email</div>
        <div class="opt-desc">Fires when a new email arrives in your inbox</div>
      </div>
      <div class="option-card" onclick="pickTrigger('form','&#128203;','Form Submission','Fires when someone submits a form')">
        <div class="opt-icon">&#128203;</div>
        <div class="opt-name">Form Submission</div>
        <div class="opt-desc">Fires when someone submits a form on your site</div>
      </div>
      <div class="option-card" onclick="pickTrigger('schedule','&#9200;','Schedule','Runs on a set schedule (e.g. daily)')">
        <div class="opt-icon">&#9200;</div>
        <div class="opt-name">Schedule</div>
        <div class="opt-desc">Runs on a set schedule, like every day at 9 AM</div>
      </div>
    </div>
  </div>

  <!-- Step 2: Pick action -->
  <div class="builder-section hidden" id="actionSection">
    <h2>Step 2: Choose Your Action</h2>
    <p>What should happen when the trigger fires?</p>
    <div class="option-grid">
      <div class="option-card" onclick="pickAction('db','&#128451;','Save to Database','Write the data to your database')">
        <div class="opt-icon">&#128451;</div>
        <div class="opt-name">Save to Database</div>
        <div class="opt-desc">Store the incoming data in your database</div>
      </div>
      <div class="option-card" onclick="pickAction('notify','&#128276;','Send Notification','Send a Slack or email alert')">
        <div class="opt-icon">&#128276;</div>
        <div class="opt-name">Send Notification</div>
        <div class="opt-desc">Alert your team via Slack or email</div>
      </div>
      <div class="option-card" onclick="pickAction('api','&#127760;','Call API','Hit an external API endpoint')">
        <div class="opt-icon">&#127760;</div>
        <div class="opt-name">Call API</div>
        <div class="opt-desc">Send a request to an external service</div>
      </div>
    </div>
  </div>

  <!-- Wiring diagram -->
  <div class="wiring-diagram">
    <h3>Your Automation</h3>
    <div class="wire-container">
      <div class="wire-node wire-empty" id="wireTrigger">
        <div class="wire-icon" id="wireTriggerIcon">?</div>
        <div class="wire-label" id="wireTriggerLabel">Trigger</div>
        <div class="wire-sublabel">not selected</div>
      </div>
      <div class="wire-connector">
        <div class="wire-arrow">&rarr;</div>
      </div>
      <div class="wire-node wire-empty" id="wireAction">
        <div class="wire-icon" id="wireActionIcon">?</div>
        <div class="wire-label" id="wireActionLabel">Action</div>
        <div class="wire-sublabel">not selected</div>
      </div>
    </div>
  </div>

  <!-- Step 3: Deploy -->
  <div class="deploy-area">
    <button class="deploy-btn" id="deployBtn" disabled onclick="deploy()">Deploy Automation</button>
  </div>

  <button class="complete-btn hidden" id="completeBtn" onclick="completeLesson()">Complete Lesson &mdash; Earn 75 XP</button>
</div>

<div class="success-overlay" id="successOverlay">
  <div class="success-card">
    <div class="success-icon">&#9889;</div>
    <div class="success-title">Automation Deployed!</div>
    <div class="success-desc" id="successDesc">Your automation is live and waiting for triggers.</div>
    <button class="success-close" onclick="closeSuccess()">Continue</button>
  </div>
</div>

<footer class="progress-footer">
  <p>Lesson 2 of 9 &middot; Automation Architect</p>
</footer>

<script>
const SLUG='your-first-automation';
const STORAGE_KEY='automation-architect-progress';
let selectedTrigger=null,selectedAction=null;

function pickTrigger(id,icon,name,desc){
  selectedTrigger={id,icon,name,desc};
  document.querySelectorAll('#triggerSection .option-card').forEach(c=>c.classList.remove('selected'));
  event.currentTarget.classList.add('selected');

  // Update wire
  const wt=document.getElementById('wireTrigger');
  wt.className='wire-node wire-trigger';
  document.getElementById('wireTriggerIcon').innerHTML=icon;
  document.getElementById('wireTriggerLabel').textContent=name;
  wt.querySelector('.wire-sublabel').textContent='trigger ready';

  // Advance step
  document.getElementById('step1').classList.add('done');
  document.getElementById('step2').classList.add('active');
  document.getElementById('actionSection').classList.remove('hidden');
  checkDeploy();
}

function pickAction(id,icon,name,desc){
  selectedAction={id,icon,name,desc};
  document.querySelectorAll('#actionSection .option-card').forEach(c=>c.classList.remove('selected'));
  event.currentTarget.classList.add('selected');

  // Update wire
  const wa=document.getElementById('wireAction');
  wa.className='wire-node wire-action';
  document.getElementById('wireActionIcon').innerHTML=icon;
  document.getElementById('wireActionLabel').textContent=name;
  wa.querySelector('.wire-sublabel').textContent='action ready';
  document.getElementById('wireLine').classList.add('active');

  document.getElementById('step2').classList.add('done');
  document.getElementById('step3').classList.add('active');
  checkDeploy();
}

function checkDeploy(){
  document.getElementById('deployBtn').disabled=!(selectedTrigger&&selectedAction);
}

function deploy(){
  document.getElementById('successDesc').textContent=
    `When "${selectedTrigger.name}" fires, "${selectedAction.name}" will execute automatically.`;
  document.getElementById('successOverlay').classList.add('visible');
}

function closeSuccess(){
  document.getElementById('successOverlay').classList.remove('visible');
  document.getElementById('completeBtn').classList.remove('hidden');
}

function completeLesson(){
  const progress=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');
  progress[SLUG]=true;
  localStorage.setItem(STORAGE_KEY,JSON.stringify(progress));
  const btn=document.getElementById('completeBtn');
  btn.textContent='Completed! +75 XP';
  btn.classList.add('done');
}

(function(){
  const progress=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');
  if(progress[SLUG]){
    document.getElementById('completeBtn').classList.remove('hidden');
    document.getElementById('completeBtn').textContent='Completed! +75 XP';
    document.getElementById('completeBtn').classList.add('done');
  }
})();
</script>
