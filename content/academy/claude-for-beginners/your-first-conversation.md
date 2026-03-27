---
title: "Your First Conversation"
course: "claude-for-beginners"
order: 2
type: "lesson"
free: true
css: "claude-beginners.css"
---<div class="wrap">

<nav class="local-nav">
  <a href="/academy/claude-for-beginners/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 2 of 9</span>
</nav>

<div class="lesson-hero">
  <h1>Your First <span class="accent">Conversation.</span></h1>
  <p class="sub">The difference between getting junk from AI and getting gold comes down to how you talk to it. Let's practice.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>The 3-part prompt formula that works every time</li>
    <li>Why vague prompts get vague answers</li>
    <li>How to give Claude context, role, and format</li>
    <li>5 real prompts you can steal for your job</li>
  </ul>
</div>

<!-- SECTION 1: THE FORMULA -->
<div class="lesson-section">
  <span class="section-label">The Secret</span>
  <h2 class="section-title">The 3-part prompt formula.</h2>
  <p class="section-text">Most people type something vague and get disappointed. "Write me an email." "Help me with this." That's like walking into a restaurant and saying "give me food." You'll get <em>something</em>, but it probably won't be what you wanted.</p>
  <p class="section-text">Great prompts have three parts:</p>

  <div class="demo-container" style="padding:1.75rem">
    <div style="display:flex;flex-direction:column;gap:16px">
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(251,146,60,.12);color:var(--orange);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0;margin-top:2px">1</div>
        <div>
          <div style="font-weight:700;font-size:.95rem;margin-bottom:2px">Role</div>
          <div style="color:var(--dim);font-size:.85rem">Tell Claude WHO it should be. "You are an experienced project manager" or "Act as a professional editor."</div>
        </div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(192,132,252,.12);color:var(--purple);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0;margin-top:2px">2</div>
        <div>
          <div style="font-weight:700;font-size:.95rem;margin-bottom:2px">Context</div>
          <div style="color:var(--dim);font-size:.85rem">Give Claude the SITUATION. Background info, constraints, who it's for, what you've tried.</div>
        </div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(74,222,128,.12);color:var(--green);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0;margin-top:2px">3</div>
        <div>
          <div style="font-weight:700;font-size:.95rem;margin-bottom:2px">Format</div>
          <div style="color:var(--dim);font-size:.85rem">Tell Claude WHAT you want back. "Give me 5 bullet points" or "Write a 3-paragraph email" or "Create a table comparing options."</div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- SECTION 2: BAD VS GOOD -->
<div class="lesson-section">
  <span class="section-label">See The Difference</span>
  <h2 class="section-title">Vague vs specific — side by side.</h2>

  <div class="demo-container" style="padding:1.75rem">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div>
        <div style="font-size:.7rem;font-weight:700;color:var(--red);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Vague Prompt</div>
        <div style="background:var(--bg);border:1px solid rgba(248,113,113,.2);border-radius:10px;padding:12px;font-size:.85rem;color:var(--dim);line-height:1.6">"Write me an email to my team about the project."</div>
      </div>
      <div>
        <div style="font-size:.7rem;font-weight:700;color:var(--green);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Specific Prompt</div>
        <div style="background:var(--bg);border:1px solid rgba(74,222,128,.2);border-radius:10px;padding:12px;font-size:.85rem;color:var(--dim);line-height:1.6">"You're a friendly but professional team lead. Write a 4-sentence email to my team of 8 letting them know that the website redesign deadline is moving from Friday to next Wednesday. Keep the tone encouraging, not apologetic. End with one specific action item for the team."</div>
      </div>
    </div>
    <div style="margin-top:16px;padding:12px;background:rgba(192,132,252,.06);border:1px solid rgba(192,132,252,.15);border-radius:10px">
      <p style="color:var(--dim);font-size:.82rem;line-height:1.6"><strong style="color:var(--text)">The difference:</strong> The vague prompt has no role, no context, no format. Claude has to guess everything. The specific prompt has all three — and Claude will nail it every time.</p>
    </div>
  </div>
</div>

<!-- SECTION 3: PRACTICE -->
<div class="lesson-section">
  <span class="section-label">Your Turn</span>
  <h2 class="section-title">Build a prompt using the formula.</h2>
  <p class="section-text">Use the builder below to construct a prompt. Pick a role, add your context, choose a format. Then copy it and try it in <a href="https://claude.ai" target="_blank" style="color:var(--purple)">Claude</a>.</p>

  <div class="demo-container" id="prompt-builder">
    <div style="margin-bottom:16px">
      <label style="font-size:.75rem;font-weight:700;color:var(--orange);text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:6px">1. Role</label>
      <select id="role-select" onchange="buildPrompt()" style="width:100%;background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:10px 12px;color:var(--text);font-size:.9rem;font-family:inherit;outline:none">
        <option value="">Choose a role...</option>
        <option value="You are a professional email writer who matches my tone perfectly.">Professional email writer</option>
        <option value="You are an experienced project manager who gives practical advice.">Project manager</option>
        <option value="You are a data analyst who explains findings in plain English.">Data analyst</option>
        <option value="You are a creative brainstorming partner who thinks outside the box.">Creative brainstormer</option>
        <option value="You are a patient teacher who explains complex topics simply.">Patient teacher</option>
      </select>
    </div>
    <div style="margin-bottom:16px">
      <label style="font-size:.75rem;font-weight:700;color:var(--purple);text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:6px">2. Context (your situation)</label>
      <textarea id="context-input" onkeyup="buildPrompt()" placeholder="Describe your situation... e.g., 'I need to tell my boss that the Q3 numbers are 15% below target, but we have a plan to recover in Q4.'" style="width:100%;background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:10px 12px;color:var(--text);font-size:.9rem;font-family:inherit;outline:none;min-height:80px;resize:vertical;line-height:1.6"></textarea>
    </div>
    <div style="margin-bottom:16px">
      <label style="font-size:.75rem;font-weight:700;color:var(--green);text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:6px">3. Format</label>
      <select id="format-select" onchange="buildPrompt()" style="width:100%;background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:10px 12px;color:var(--text);font-size:.9rem;font-family:inherit;outline:none">
        <option value="">Choose a format...</option>
        <option value="Write a short email (under 150 words).">Short email</option>
        <option value="Give me 5 bullet points.">5 bullet points</option>
        <option value="Write 3 paragraphs.">3 paragraphs</option>
        <option value="Create a table comparing the options.">Comparison table</option>
        <option value="Give me a step-by-step action plan.">Step-by-step plan</option>
      </select>
    </div>

    <div style="background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:14px;margin-bottom:12px;min-height:60px">
      <div style="font-size:.65rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Your Prompt</div>
      <div id="built-prompt" style="font-size:.9rem;color:var(--dim);line-height:1.7;white-space:pre-wrap">Select a role, add context, and choose a format to build your prompt...</div>
    </div>
    <button onclick="copyPrompt()" id="copy-btn" class="btn btn-primary" style="width:100%" disabled>Copy Prompt to Clipboard</button>
  </div>
</div>

<!-- SECTION 4: STEAL THESE -->
<div class="lesson-section">
  <span class="section-label">Steal These</span>
  <h2 class="section-title">5 prompts you can use today.</h2>
  <p class="section-text">Copy any of these, paste into Claude, and customize for your situation.</p>

  <div style="display:flex;flex-direction:column;gap:12px">
    <div class="demo-container" style="padding:1.25rem;cursor:pointer" onclick="copyText(this.querySelector('.prompt-text').textContent)">
      <div style="font-size:.75rem;font-weight:700;color:var(--orange);margin-bottom:6px">Meeting Notes → Action Items</div>
      <div class="prompt-text" style="font-size:.85rem;color:var(--dim);line-height:1.6">"Here are my meeting notes: [paste notes]. Extract all action items, who's responsible, and deadlines. Format as a checklist I can paste into Slack."</div>
      <div style="font-size:.7rem;color:var(--text-muted);margin-top:6px">Click to copy</div>
    </div>
    <div class="demo-container" style="padding:1.25rem;cursor:pointer" onclick="copyText(this.querySelector('.prompt-text').textContent)">
      <div style="font-size:.75rem;font-weight:700;color:var(--purple);margin-bottom:6px">Professional Reply</div>
      <div class="prompt-text" style="font-size:.85rem;color:var(--dim);line-height:1.6">"I received this email: [paste email]. Write a professional reply that [agrees/declines/asks for more info]. Match a warm but professional tone. Keep it under 100 words."</div>
      <div style="font-size:.7rem;color:var(--text-muted);margin-top:6px">Click to copy</div>
    </div>
    <div class="demo-container" style="padding:1.25rem;cursor:pointer" onclick="copyText(this.querySelector('.prompt-text').textContent)">
      <div style="font-size:.75rem;font-weight:700;color:var(--green);margin-bottom:6px">Explain Like I'm New</div>
      <div class="prompt-text" style="font-size:.85rem;color:var(--dim);line-height:1.6">"Explain [complex topic] to someone who has never encountered it before. Use an everyday analogy. Keep it to 3 sentences."</div>
      <div style="font-size:.7rem;color:var(--text-muted);margin-top:6px">Click to copy</div>
    </div>
    <div class="demo-container" style="padding:1.25rem;cursor:pointer" onclick="copyText(this.querySelector('.prompt-text').textContent)">
      <div style="font-size:.75rem;font-weight:700;color:var(--blue);margin-bottom:6px">Weekly Report</div>
      <div class="prompt-text" style="font-size:.85rem;color:var(--dim);line-height:1.6">"Here's what I worked on this week: [list tasks]. Write a weekly status report for my manager. Include: what was completed, what's in progress, any blockers, and plan for next week. Professional but not stuffy."</div>
      <div style="font-size:.7rem;color:var(--text-muted);margin-top:6px">Click to copy</div>
    </div>
    <div class="demo-container" style="padding:1.25rem;cursor:pointer" onclick="copyText(this.querySelector('.prompt-text').textContent)">
      <div style="font-size:.75rem;font-weight:700;color:var(--warm);margin-bottom:6px">Decision Helper</div>
      <div class="prompt-text" style="font-size:.85rem;color:var(--dim);line-height:1.6">"I'm deciding between [option A] and [option B]. Here's my situation: [context]. Create a pros/cons table for each option, then give me your recommendation with reasoning."</div>
      <div style="font-size:.7rem;color:var(--text-muted);margin-top:6px">Click to copy</div>
    </div>
  </div>
</div>

<!-- KEY TAKEAWAY -->
<div class="callout purple">
  <p><strong>The key insight:</strong> You don't need to be a "prompt engineer." You just need to tell Claude three things: <strong>who to be, what the situation is, and what format you want.</strong> That's it. The rest is just practice.</p>
</div>

<button class="complete-btn" id="completeBtn" onclick="completeLesson()">Complete Lesson 2 ✓</button>

</div>

<script>
const SLUG = 'claude-for-beginners';
const LESSON_NUM = 2;

window.addEventListener('scroll', function() {
  if (window.scrollY / (document.body.scrollHeight - window.innerHeight) > 0.5) {
    document.getElementById('completeBtn').classList.add('visible');
  }
});

function completeLesson() {
  const stored = localStorage.getItem('lo_progress_' + SLUG);
  const completed = stored ? JSON.parse(stored) : [];
  if (!completed.includes(LESSON_NUM)) { completed.push(LESSON_NUM); localStorage.setItem('lo_progress_' + SLUG, JSON.stringify(completed)); }
  const btn = document.getElementById('completeBtn');
  btn.textContent = 'Completed! ✨'; btn.style.background = 'var(--green)'; btn.style.pointerEvents = 'none';
}

(function() {
  const stored = localStorage.getItem('lo_progress_' + SLUG);
  const completed = stored ? JSON.parse(stored) : [];
  if (completed.includes(LESSON_NUM)) {
    const btn = document.getElementById('completeBtn');
    btn.classList.add('visible'); btn.textContent = 'Completed! ✨'; btn.style.background = 'var(--green)'; btn.style.pointerEvents = 'none';
  }
})();

function buildPrompt() {
  const role = document.getElementById('role-select').value;
  const context = document.getElementById('context-input').value.trim();
  const format = document.getElementById('format-select').value;
  const parts = [];
  if (role) parts.push(role);
  if (context) parts.push(context);
  if (format) parts.push(format);
  const prompt = parts.join('\n\n') || 'Select a role, add context, and choose a format to build your prompt...';
  document.getElementById('built-prompt').textContent = prompt;
  document.getElementById('copy-btn').disabled = parts.length === 0;
}

function copyPrompt() {
  const text = document.getElementById('built-prompt').textContent;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('copy-btn');
    btn.textContent = 'Copied! Now paste it into Claude →';
    btn.style.background = 'var(--green)';
    setTimeout(() => { btn.textContent = 'Copy Prompt to Clipboard'; btn.style.background = ''; }, 2000);
  });
}

function copyText(text) {
  navigator.clipboard.writeText(text).then(() => {
    const toast = document.createElement('div');
    toast.textContent = 'Copied!';
    toast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--green);color:#000;padding:8px 20px;border-radius:8px;font-weight:700;font-size:.85rem;z-index:9999;animation:fadeUp .3s ease';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 1500);
  });
}
</script>
