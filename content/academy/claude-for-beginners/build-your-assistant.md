---
title: "Build Your Personal Assistant"
course: "claude-for-beginners"
order: 8
type: "builder"
free: false
css: "claude-beginners.css"
---<div class="wrap">

<nav class="local-nav">
  <a href="/academy/claude-for-beginners/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 8 of 9</span>
</nav>

<div class="lesson-hero">
  <h1>Build Your Personal <span class="accent">Assistant.</span></h1>
  <p class="sub">This is the capstone. Everything you've learned so far comes together here. You'll walk away with a fully configured AI assistant, a morning routine, a prompt library, and proof of how much time you'll save.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>How to build a complete personal assistant setup from scratch</li>
    <li>A morning AI routine you can start using tomorrow</li>
    <li>A personal prompt library with 8 ready-to-use prompts</li>
    <li>Exactly how much time Claude will save you each week</li>
  </ul>
</div>

<!-- ============================================= -->
<!-- SECTION 1: THE ASSISTANT BLUEPRINT            -->
<!-- ============================================= -->
<div class="lesson-section">
  <span class="section-label">The Blueprint</span>
  <h2 class="section-title">Design your assistant in 5 steps.</h2>
  <p class="section-text">A personal assistant is only as good as the instructions it gets. We're going to build yours right now -- step by step. At the end, you'll have a complete system prompt you can paste into Claude's custom instructions.</p>

  <!-- Step 1: Role -->
  <div class="demo-container" id="blueprint-step1" style="padding:1.75rem;margin-bottom:16px">
    <div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:16px">
      <div style="background:rgba(251,146,60,.12);color:var(--orange);font-weight:800;font-size:.85rem;padding:6px 12px;border-radius:8px;flex-shrink:0">Step 1</div>
      <div>
        <div style="font-weight:700;font-size:1rem;margin-bottom:4px">Define your assistant's role</div>
        <div style="color:var(--dim);font-size:.85rem">Pick an archetype or write your own. This tells Claude who it is when it talks to you.</div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px" id="archetype-grid">
      <button class="archetype-btn" data-role="You are my executive assistant. You're sharp, proactive, and always one step ahead. You manage my priorities, draft communications, and keep me organized." onclick="selectArchetype(this)">
        <span style="font-size:1.2rem">&#128188;</span>
        <span style="font-weight:600;font-size:.85rem">Executive Assistant</span>
        <span style="font-size:.75rem;color:var(--dim)">Sharp, proactive, organized</span>
      </button>
      <button class="archetype-btn" data-role="You are my creative partner. You brainstorm fearlessly, challenge my assumptions, and help me think bigger. You're enthusiastic but honest." onclick="selectArchetype(this)">
        <span style="font-size:1.2rem">&#127912;</span>
        <span style="font-weight:600;font-size:.85rem">Creative Partner</span>
        <span style="font-size:.75rem;color:var(--dim)">Bold, imaginative, honest</span>
      </button>
      <button class="archetype-btn" data-role="You are my strategic advisor. You help me think through decisions carefully, weigh trade-offs, and spot risks I might miss. You're calm, analytical, and direct." onclick="selectArchetype(this)">
        <span style="font-size:1.2rem">&#129504;</span>
        <span style="font-weight:600;font-size:.85rem">Strategic Advisor</span>
        <span style="font-size:.75rem;color:var(--dim)">Analytical, calm, direct</span>
      </button>
      <button class="archetype-btn" data-role="You are my learning coach. You explain things clearly, break down complex topics, and help me grow my skills. You're patient, encouraging, and thorough." onclick="selectArchetype(this)">
        <span style="font-size:1.2rem">&#128218;</span>
        <span style="font-weight:600;font-size:.85rem">Learning Coach</span>
        <span style="font-size:.75rem;color:var(--dim)">Patient, encouraging, clear</span>
      </button>
    </div>
    <textarea id="bp-role" onkeyup="updateBlueprint()" placeholder="Or write your own role... e.g., 'You are my marketing assistant who understands B2B SaaS and talks like a real person, not a corporate robot.'" style="width:100%;background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:10px 12px;color:var(--text);font-size:.9rem;font-family:inherit;outline:none;min-height:70px;resize:vertical;line-height:1.6;box-sizing:border-box"></textarea>
  </div>

  <!-- Step 2: Tone -->
  <div class="demo-container" id="blueprint-step2" style="padding:1.75rem;margin-bottom:16px">
    <div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:16px">
      <div style="background:rgba(192,132,252,.12);color:var(--purple);font-weight:800;font-size:.85rem;padding:6px 12px;border-radius:8px;flex-shrink:0">Step 2</div>
      <div>
        <div style="font-weight:700;font-size:1rem;margin-bottom:4px">Set the tone and personality</div>
        <div style="color:var(--dim);font-size:.85rem">How should your assistant communicate? Pick the traits that match your style.</div>
      </div>
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px" id="tone-tags">
      <button class="tone-tag" onclick="toggleTone(this)">Casual</button>
      <button class="tone-tag" onclick="toggleTone(this)">Professional</button>
      <button class="tone-tag" onclick="toggleTone(this)">Friendly</button>
      <button class="tone-tag" onclick="toggleTone(this)">Direct</button>
      <button class="tone-tag" onclick="toggleTone(this)">Warm</button>
      <button class="tone-tag" onclick="toggleTone(this)">Concise</button>
      <button class="tone-tag" onclick="toggleTone(this)">Detailed</button>
      <button class="tone-tag" onclick="toggleTone(this)">Encouraging</button>
      <button class="tone-tag" onclick="toggleTone(this)">Witty</button>
      <button class="tone-tag" onclick="toggleTone(this)">No-nonsense</button>
      <button class="tone-tag" onclick="toggleTone(this)">Empathetic</button>
      <button class="tone-tag" onclick="toggleTone(this)">Challenging</button>
    </div>
    <div style="font-size:.75rem;color:var(--dim)" id="tone-count">0 traits selected</div>
  </div>

  <!-- Step 3: Daily tasks -->
  <div class="demo-container" id="blueprint-step3" style="padding:1.75rem;margin-bottom:16px">
    <div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:16px">
      <div style="background:rgba(74,222,128,.12);color:var(--green);font-weight:800;font-size:.85rem;padding:6px 12px;border-radius:8px;flex-shrink:0">Step 3</div>
      <div>
        <div style="font-weight:700;font-size:1rem;margin-bottom:4px">Your top 5 daily tasks</div>
        <div style="color:var(--dim);font-size:.85rem">What do you want Claude helping with every single day? Be specific.</div>
      </div>
    </div>
    <div style="display:flex;flex-direction:column;gap:8px" id="task-inputs">
      <div style="display:flex;gap:8px;align-items:center">
        <span style="color:var(--orange);font-weight:800;font-size:.8rem;width:18px;flex-shrink:0">1.</span>
        <input type="text" class="bp-task" onkeyup="updateBlueprint()" placeholder="e.g., Draft and edit emails" style="flex:1;background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:10px 12px;color:var(--text);font-size:.9rem;font-family:inherit;outline:none">
      </div>
      <div style="display:flex;gap:8px;align-items:center">
        <span style="color:var(--orange);font-weight:800;font-size:.8rem;width:18px;flex-shrink:0">2.</span>
        <input type="text" class="bp-task" onkeyup="updateBlueprint()" placeholder="e.g., Summarize meeting notes into action items" style="flex:1;background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:10px 12px;color:var(--text);font-size:.9rem;font-family:inherit;outline:none">
      </div>
      <div style="display:flex;gap:8px;align-items:center">
        <span style="color:var(--orange);font-weight:800;font-size:.8rem;width:18px;flex-shrink:0">3.</span>
        <input type="text" class="bp-task" onkeyup="updateBlueprint()" placeholder="e.g., Research topics and create briefs" style="flex:1;background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:10px 12px;color:var(--text);font-size:.9rem;font-family:inherit;outline:none">
      </div>
      <div style="display:flex;gap:8px;align-items:center">
        <span style="color:var(--orange);font-weight:800;font-size:.8rem;width:18px;flex-shrink:0">4.</span>
        <input type="text" class="bp-task" onkeyup="updateBlueprint()" placeholder="e.g., Proofread documents before sending" style="flex:1;background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:10px 12px;color:var(--text);font-size:.9rem;font-family:inherit;outline:none">
      </div>
      <div style="display:flex;gap:8px;align-items:center">
        <span style="color:var(--orange);font-weight:800;font-size:.8rem;width:18px;flex-shrink:0">5.</span>
        <input type="text" class="bp-task" onkeyup="updateBlueprint()" placeholder="e.g., Help me prepare for meetings" style="flex:1;background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:10px 12px;color:var(--text);font-size:.9rem;font-family:inherit;outline:none">
      </div>
    </div>
  </div>

  <!-- Step 4: Context -->
  <div class="demo-container" id="blueprint-step4" style="padding:1.75rem;margin-bottom:16px">
    <div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:16px">
      <div style="background:rgba(96,165,250,.12);color:var(--blue);font-weight:800;font-size:.85rem;padding:6px 12px;border-radius:8px;flex-shrink:0">Step 4</div>
      <div>
        <div style="font-weight:700;font-size:1rem;margin-bottom:4px">Add your context</div>
        <div style="color:var(--dim);font-size:.85rem">The more Claude knows about your world, the better it performs.</div>
      </div>
    </div>
    <div style="display:flex;flex-direction:column;gap:10px">
      <div>
        <label style="font-size:.75rem;font-weight:600;color:var(--dim);display:block;margin-bottom:4px">Your industry / field</label>
        <input type="text" id="bp-industry" onkeyup="updateBlueprint()" placeholder="e.g., Healthcare, EdTech, Marketing Agency, Freelance Design" style="width:100%;background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:10px 12px;color:var(--text);font-size:.9rem;font-family:inherit;outline:none;box-sizing:border-box">
      </div>
      <div>
        <label style="font-size:.75rem;font-weight:600;color:var(--dim);display:block;margin-bottom:4px">Your role / title</label>
        <input type="text" id="bp-title" onkeyup="updateBlueprint()" placeholder="e.g., Marketing Manager, Solo Founder, Team Lead" style="width:100%;background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:10px 12px;color:var(--text);font-size:.9rem;font-family:inherit;outline:none;box-sizing:border-box">
      </div>
      <div>
        <label style="font-size:.75rem;font-weight:600;color:var(--dim);display:block;margin-bottom:4px">Tools you use daily</label>
        <input type="text" id="bp-tools" onkeyup="updateBlueprint()" placeholder="e.g., Slack, Notion, Google Docs, Figma, Jira" style="width:100%;background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:10px 12px;color:var(--text);font-size:.9rem;font-family:inherit;outline:none;box-sizing:border-box">
      </div>
    </div>
  </div>

  <!-- Step 5: Boundaries -->
  <div class="demo-container" id="blueprint-step5" style="padding:1.75rem;margin-bottom:16px">
    <div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:16px">
      <div style="background:rgba(248,113,113,.12);color:var(--red);font-weight:800;font-size:.85rem;padding:6px 12px;border-radius:8px;flex-shrink:0">Step 5</div>
      <div>
        <div style="font-weight:700;font-size:1rem;margin-bottom:4px">Set boundaries</div>
        <div style="color:var(--dim);font-size:.85rem">What should Claude NOT do? Good guardrails make a better assistant.</div>
      </div>
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px" id="boundary-tags">
      <button class="tone-tag" onclick="toggleBoundary(this)">Don't make up statistics</button>
      <button class="tone-tag" onclick="toggleBoundary(this)">Don't use corporate jargon</button>
      <button class="tone-tag" onclick="toggleBoundary(this)">Don't be overly formal</button>
      <button class="tone-tag" onclick="toggleBoundary(this)">Don't write longer than asked</button>
      <button class="tone-tag" onclick="toggleBoundary(this)">Always cite sources</button>
      <button class="tone-tag" onclick="toggleBoundary(this)">Ask before assuming</button>
      <button class="tone-tag" onclick="toggleBoundary(this)">No emojis in professional work</button>
      <button class="tone-tag" onclick="toggleBoundary(this)">Don't be sycophantic</button>
    </div>
    <textarea id="bp-boundaries" onkeyup="updateBlueprint()" placeholder="Add your own boundaries..." style="width:100%;background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:10px 12px;color:var(--text);font-size:.9rem;font-family:inherit;outline:none;min-height:50px;resize:vertical;line-height:1.6;box-sizing:border-box"></textarea>
  </div>

  <!-- Generated System Prompt -->
  <div class="demo-container" style="padding:1.75rem;border:1px solid rgba(251,146,60,.3)">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <div style="font-size:.8rem;font-weight:700;color:var(--orange);text-transform:uppercase;letter-spacing:1px">Your Generated System Prompt</div>
      <div style="font-size:.7rem;color:var(--dim)" id="bp-word-count">0 words</div>
    </div>
    <div id="generated-prompt" style="background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:16px;font-size:.88rem;color:var(--dim);line-height:1.8;white-space:pre-wrap;min-height:80px;max-height:300px;overflow-y:auto">Complete the steps above to generate your personal assistant prompt...</div>
    <button onclick="copySystemPrompt()" id="copy-system-btn" class="btn btn-primary" style="width:100%;margin-top:12px" disabled>Copy System Prompt</button>
    <div class="tip-box" style="margin-top:12px">
      <strong>Where to paste this:</strong> Go to <a href="https://claude.ai" target="_blank" style="color:var(--purple)">claude.ai</a> &rarr; click your name &rarr; Settings &rarr; Custom Instructions &rarr; paste this in. Claude will use it for every conversation.
    </div>
  </div>
</div>

<!-- ============================================= -->
<!-- SECTION 2: THE MORNING ROUTINE                -->
<!-- ============================================= -->
<div class="lesson-section">
  <span class="section-label">The Routine</span>
  <h2 class="section-title">Start every morning with Claude.</h2>
  <p class="section-text">The people who get the most from AI don't use it randomly -- they have a routine. Here's a morning workflow that takes 5 minutes and saves hours.</p>

  <div class="demo-container" style="padding:1.75rem">
    <div style="font-size:.8rem;font-weight:700;color:var(--purple);text-transform:uppercase;letter-spacing:1px;margin-bottom:16px">Morning Session Walkthrough</div>

    <!-- Morning chat simulation -->
    <div id="morning-sim" style="display:flex;flex-direction:column;gap:12px">
      <!-- User message 1 -->
      <div style="display:flex;justify-content:flex-end">
        <div style="background:rgba(251,146,60,.1);border:1px solid rgba(251,146,60,.2);border-radius:14px 14px 4px 14px;padding:12px 16px;max-width:85%;font-size:.85rem;line-height:1.6;color:var(--text)">
          Good morning! Here's my day:<br><br>
          <strong>Calendar:</strong><br>
          9:00 - Team standup<br>
          10:30 - Client presentation (Acme Corp)<br>
          1:00 - 1:1 with my manager<br>
          3:00 - Sprint planning<br><br>
          <strong>Yesterday's open items:</strong><br>
          - Q3 report draft (80% done)<br>
          - Reply to vendor about pricing<br>
          - Review 3 job applications<br><br>
          What should I prioritize?
        </div>
      </div>

      <!-- Claude response -->
      <div style="display:flex;justify-content:flex-start">
        <div style="background:rgba(192,132,252,.06);border:1px solid rgba(192,132,252,.15);border-radius:14px 14px 14px 4px;padding:12px 16px;max-width:85%;font-size:.85rem;line-height:1.7;color:var(--dim)">
          <strong style="color:var(--text)">Here's your prioritized day:</strong><br><br>
          <strong style="color:var(--orange)">Before 9:00 (30 min):</strong><br>
          1. Finish the Q3 report draft -- it's 80% done and you'll feel great crossing it off<br>
          2. Quick reply to the vendor (I can draft this for you right now)<br><br>
          <strong style="color:var(--orange)">Between meetings:</strong><br>
          3. Prep for the Acme Corp presentation -- what's your key ask?<br>
          4. Review job applications (batch these -- 15 min total)<br><br>
          <strong style="color:var(--orange)">For your 1:1:</strong><br>
          5. Bring the Q3 report as a win + flag any blockers for sprint planning<br><br>
          <em style="color:var(--purple)">Want me to draft that vendor reply now? Or help prep talking points for Acme Corp?</em>
        </div>
      </div>
    </div>
  </div>

  <div class="tip-box" style="margin-top:16px">
    <strong>The Morning Template (copy this):</strong>
  </div>

  <div class="demo-container" style="padding:1.25rem;cursor:pointer;margin-top:8px" onclick="copyText(this.querySelector('.prompt-text').textContent)">
    <div class="prompt-text" style="font-size:.85rem;color:var(--dim);line-height:1.6">Good morning! Here's my day:

Calendar: [paste today's schedule]

Yesterday's open items: [list what's still pending]

New priorities: [anything that came in overnight]

Based on my schedule and open items, give me a prioritized task list for today. Flag anything that's time-sensitive. Suggest which tasks you can help me with right now.</div>
    <div style="font-size:.7rem;color:var(--text-muted);margin-top:8px">Click to copy</div>
  </div>

  <div class="callout purple" style="margin-top:16px">
    <p><strong>Why this works:</strong> Instead of staring at your to-do list and figuring out where to start, you hand Claude the raw information and get back a clear action plan in 10 seconds. People who do this daily report saving 30+ minutes every morning on "decision overhead."</p>
  </div>
</div>

<!-- ============================================= -->
<!-- SECTION 3: PROMPT LIBRARY                     -->
<!-- ============================================= -->
<div class="lesson-section">
  <span class="section-label">Your Library</span>
  <h2 class="section-title">8 prompts you'll use every week.</h2>
  <p class="section-text">The best Claude users don't write prompts from scratch every time. They build a library. Here are 8 battle-tested prompts organized by category -- copy the ones you'll use.</p>

  <!-- Communication -->
  <div style="margin-bottom:24px">
    <div style="font-size:.7rem;font-weight:700;color:var(--orange);text-transform:uppercase;letter-spacing:1.5px;margin-bottom:10px;padding-left:4px">Communication</div>
    <div style="display:flex;flex-direction:column;gap:10px">
      <div class="demo-container prompt-card" style="padding:1.25rem">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
          <div style="font-weight:700;font-size:.9rem">Email Drafts</div>
          <button class="copy-btn-small" onclick="event.stopPropagation();copyFromCard(this)">Copy</button>
        </div>
        <div class="prompt-text" style="font-size:.85rem;color:var(--dim);line-height:1.6">I need to write an email to [recipient/role]. The purpose is [what you want to communicate]. The tone should be [professional/casual/firm/warm]. Keep it under [X] words. Here's the context: [background info]. Draft the email and suggest a subject line.</div>
      </div>
      <div class="demo-container prompt-card" style="padding:1.25rem">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
          <div style="font-weight:700;font-size:.9rem">Meeting Prep</div>
          <button class="copy-btn-small" onclick="event.stopPropagation();copyFromCard(this)">Copy</button>
        </div>
        <div class="prompt-text" style="font-size:.85rem;color:var(--dim);line-height:1.6">I have a meeting in [timeframe] with [who]. The agenda is [topic]. My goals for this meeting are [what you want to achieve]. Give me: 3 talking points, 2 questions I should ask, and 1 thing I should avoid saying. Keep each point to one sentence.</div>
      </div>
    </div>
  </div>

  <!-- Analysis -->
  <div style="margin-bottom:24px">
    <div style="font-size:.7rem;font-weight:700;color:var(--purple);text-transform:uppercase;letter-spacing:1.5px;margin-bottom:10px;padding-left:4px">Analysis</div>
    <div style="display:flex;flex-direction:column;gap:10px">
      <div class="demo-container prompt-card" style="padding:1.25rem">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
          <div style="font-weight:700;font-size:.9rem">Data Review</div>
          <button class="copy-btn-small" onclick="event.stopPropagation();copyFromCard(this)">Copy</button>
        </div>
        <div class="prompt-text" style="font-size:.85rem;color:var(--dim);line-height:1.6">Here's my data: [paste data or describe it]. I need you to: 1) Identify the top 3 trends or patterns, 2) Flag anything unusual or concerning, 3) Suggest 2 actions I should take based on this data. Explain it in plain English, no jargon.</div>
      </div>
      <div class="demo-container prompt-card" style="padding:1.25rem">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
          <div style="font-weight:700;font-size:.9rem">Decision Framework</div>
          <button class="copy-btn-small" onclick="event.stopPropagation();copyFromCard(this)">Copy</button>
        </div>
        <div class="prompt-text" style="font-size:.85rem;color:var(--dim);line-height:1.6">I'm deciding between [Option A] and [Option B]. Context: [your situation, constraints, goals]. Create a comparison table with these criteria: cost, time, risk, and long-term impact. Then give me your recommendation and the one question I should answer before deciding.</div>
      </div>
    </div>
  </div>

  <!-- Creative -->
  <div style="margin-bottom:24px">
    <div style="font-size:.7rem;font-weight:700;color:var(--green);text-transform:uppercase;letter-spacing:1.5px;margin-bottom:10px;padding-left:4px">Creative</div>
    <div style="display:flex;flex-direction:column;gap:10px">
      <div class="demo-container prompt-card" style="padding:1.25rem">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
          <div style="font-weight:700;font-size:.9rem">Brainstorming</div>
          <button class="copy-btn-small" onclick="event.stopPropagation();copyFromCard(this)">Copy</button>
        </div>
        <div class="prompt-text" style="font-size:.85rem;color:var(--dim);line-height:1.6">I'm trying to [goal/challenge]. My constraints are [budget, time, resources]. Give me 10 ideas -- 5 safe/proven and 5 wild/creative. For each idea, give me one sentence on what it is and one sentence on why it could work. Don't self-censor.</div>
      </div>
      <div class="demo-container prompt-card" style="padding:1.25rem">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
          <div style="font-weight:700;font-size:.9rem">Problem Solving</div>
          <button class="copy-btn-small" onclick="event.stopPropagation();copyFromCard(this)">Copy</button>
        </div>
        <div class="prompt-text" style="font-size:.85rem;color:var(--dim);line-height:1.6">Here's my problem: [describe it]. What I've already tried: [list attempts]. What I think the root cause might be: [your theory]. Play devil's advocate. Tell me what I might be missing, then give me 3 approaches I haven't considered. Be direct -- don't sugarcoat it.</div>
      </div>
    </div>
  </div>

  <!-- Admin -->
  <div style="margin-bottom:8px">
    <div style="font-size:.7rem;font-weight:700;color:var(--blue);text-transform:uppercase;letter-spacing:1.5px;margin-bottom:10px;padding-left:4px">Admin</div>
    <div style="display:flex;flex-direction:column;gap:10px">
      <div class="demo-container prompt-card" style="padding:1.25rem">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
          <div style="font-weight:700;font-size:.9rem">Process Documentation</div>
          <button class="copy-btn-small" onclick="event.stopPropagation();copyFromCard(this)">Copy</button>
        </div>
        <div class="prompt-text" style="font-size:.85rem;color:var(--dim);line-height:1.6">I need to document this process: [describe what you do step by step, even roughly]. Turn this into a clean SOP (Standard Operating Procedure) that someone new could follow. Include: overview, prerequisites, numbered steps, common mistakes to avoid, and who to contact if something goes wrong.</div>
      </div>
      <div class="demo-container prompt-card" style="padding:1.25rem">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
          <div style="font-weight:700;font-size:.9rem">Weekly Report</div>
          <button class="copy-btn-small" onclick="event.stopPropagation();copyFromCard(this)">Copy</button>
        </div>
        <div class="prompt-text" style="font-size:.85rem;color:var(--dim);line-height:1.6">Here's what I worked on this week: [brain dump your tasks]. Turn this into a professional weekly report with these sections: Completed, In Progress, Blocked, and Next Week's Priorities. Keep each item to one line. Tone: professional but human.</div>
      </div>
    </div>
  </div>
</div>

<!-- ============================================= -->
<!-- SECTION 4: PUTTING IT ALL TOGETHER            -->
<!-- ============================================= -->
<div class="lesson-section">
  <span class="section-label">Full Picture</span>
  <h2 class="section-title">A day with Claude, start to finish.</h2>
  <p class="section-text">Here's what a typical day looks like when Claude is your assistant. This is the workflow you've been building toward in this entire course.</p>

  <!-- Visual timeline -->
  <div class="demo-container" style="padding:1.75rem">
    <div style="position:relative;padding-left:32px">
      <!-- Timeline line -->
      <!-- Morning -->
      <div style="position:relative;margin-bottom:28px">
        <div style="font-size:.7rem;font-weight:700;color:var(--orange);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">8:30 AM - Morning Kickoff</div>
        <div style="font-size:.88rem;color:var(--text);font-weight:600;margin-bottom:2px">Paste calendar + open items. Get prioritized plan.</div>
        <div style="font-size:.8rem;color:var(--dim)">Time saved: <strong style="color:var(--green)">25 min</strong> of planning and decision-making</div>
      </div>

      <!-- Pre-meeting -->
      <div style="position:relative;margin-bottom:28px">
        <div style="font-size:.7rem;font-weight:700;color:var(--purple);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">10:00 AM - Meeting Prep</div>
        <div style="font-size:.88rem;color:var(--text);font-weight:600;margin-bottom:2px">Get talking points, anticipate questions, draft agenda.</div>
        <div style="font-size:.8rem;color:var(--dim)">Time saved: <strong style="color:var(--green)">20 min</strong> of research and prep work</div>
      </div>

      <!-- Post-meeting -->
      <div style="position:relative;margin-bottom:28px">
        <div style="font-size:.7rem;font-weight:700;color:var(--green);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">11:30 AM - Post-Meeting</div>
        <div style="font-size:.88rem;color:var(--text);font-weight:600;margin-bottom:2px">Paste meeting notes. Get action items + follow-up emails drafted.</div>
        <div style="font-size:.8rem;color:var(--dim)">Time saved: <strong style="color:var(--green)">30 min</strong> of note cleanup and email writing</div>
      </div>

      <!-- Afternoon -->
      <div style="position:relative;margin-bottom:28px">
        <div style="font-size:.7rem;font-weight:700;color:var(--blue);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">2:00 PM - Deep Work</div>
        <div style="font-size:.88rem;color:var(--text);font-weight:600;margin-bottom:2px">Research, analysis, document drafting, brainstorming.</div>
        <div style="font-size:.8rem;color:var(--dim)">Time saved: <strong style="color:var(--green)">45 min</strong> of research and first drafts</div>
      </div>

      <!-- End of day -->
      <div style="position:relative">
        <div style="font-size:.7rem;font-weight:700;color:var(--warm);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">5:00 PM - End of Day</div>
        <div style="font-size:.88rem;color:var(--text);font-weight:600;margin-bottom:2px">Summarize what you did, prep tomorrow's priorities, draft any final emails.</div>
        <div style="font-size:.8rem;color:var(--dim)">Time saved: <strong style="color:var(--green)">15 min</strong> of wrap-up and planning</div>
      </div>
    </div>

    <div style="margin-top:24px;padding:14px;background:rgba(74,222,128,.06);border:1px solid rgba(74,222,128,.15);border-radius:10px;text-align:center">
      <div style="font-size:.75rem;font-weight:700;color:var(--green);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Total Daily Time Saved</div>
      <div style="font-size:2rem;font-weight:800;color:var(--text)">2 hours 15 minutes</div>
      <div style="font-size:.82rem;color:var(--dim);margin-top:2px">That's <strong>11+ hours per week</strong> or <strong>44+ hours per month</strong></div>
    </div>
  </div>
</div>

<!-- ============================================= -->
<!-- TIME SAVINGS CALCULATOR                       -->
<!-- ============================================= -->
<div class="lesson-section">
  <span class="section-label">Your Savings</span>
  <h2 class="section-title">Calculate your personal time savings.</h2>
  <p class="section-text">Check the tasks you'd actually use Claude for. Be honest -- this isn't a sales pitch, it's your real estimate.</p>

  <div class="demo-container" style="padding:1.75rem" id="calculator">
    <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:20px" id="calc-tasks">
      <label class="calc-check" style="display:flex;gap:12px;align-items:flex-start;cursor:pointer;padding:10px 14px;border-radius:10px;border:1px solid var(--border);transition:all .2s">
        <input type="checkbox" onchange="calcTime()" data-minutes="25" style="margin-top:3px;accent-color:var(--orange)">
        <div>
          <div style="font-weight:600;font-size:.9rem">Morning planning &amp; prioritization</div>
          <div style="font-size:.78rem;color:var(--dim)">Daily priority-setting, schedule review</div>
        </div>
        <div style="margin-left:auto;color:var(--green);font-weight:700;font-size:.8rem;flex-shrink:0">25 min/day</div>
      </label>
      <label class="calc-check" style="display:flex;gap:12px;align-items:flex-start;cursor:pointer;padding:10px 14px;border-radius:10px;border:1px solid var(--border);transition:all .2s">
        <input type="checkbox" onchange="calcTime()" data-minutes="30" style="margin-top:3px;accent-color:var(--orange)">
        <div>
          <div style="font-weight:600;font-size:.9rem">Email drafting &amp; replies</div>
          <div style="font-size:.78rem;color:var(--dim)">Composing, editing, and responding to emails</div>
        </div>
        <div style="margin-left:auto;color:var(--green);font-weight:700;font-size:.8rem;flex-shrink:0">30 min/day</div>
      </label>
      <label class="calc-check" style="display:flex;gap:12px;align-items:flex-start;cursor:pointer;padding:10px 14px;border-radius:10px;border:1px solid var(--border);transition:all .2s">
        <input type="checkbox" onchange="calcTime()" data-minutes="20" style="margin-top:3px;accent-color:var(--orange)">
        <div>
          <div style="font-weight:600;font-size:.9rem">Meeting prep &amp; follow-ups</div>
          <div style="font-size:.78rem;color:var(--dim)">Talking points, agendas, post-meeting action items</div>
        </div>
        <div style="margin-left:auto;color:var(--green);font-weight:700;font-size:.8rem;flex-shrink:0">20 min/day</div>
      </label>
      <label class="calc-check" style="display:flex;gap:12px;align-items:flex-start;cursor:pointer;padding:10px 14px;border-radius:10px;border:1px solid var(--border);transition:all .2s">
        <input type="checkbox" onchange="calcTime()" data-minutes="35" style="margin-top:3px;accent-color:var(--orange)">
        <div>
          <div style="font-weight:600;font-size:.9rem">Research &amp; analysis</div>
          <div style="font-size:.78rem;color:var(--dim)">Looking things up, comparing options, reading reports</div>
        </div>
        <div style="margin-left:auto;color:var(--green);font-weight:700;font-size:.8rem;flex-shrink:0">35 min/day</div>
      </label>
      <label class="calc-check" style="display:flex;gap:12px;align-items:flex-start;cursor:pointer;padding:10px 14px;border-radius:10px;border:1px solid var(--border);transition:all .2s">
        <input type="checkbox" onchange="calcTime()" data-minutes="25" style="margin-top:3px;accent-color:var(--orange)">
        <div>
          <div style="font-weight:600;font-size:.9rem">Document writing &amp; editing</div>
          <div style="font-size:.78rem;color:var(--dim)">Reports, proposals, SOPs, blog posts</div>
        </div>
        <div style="margin-left:auto;color:var(--green);font-weight:700;font-size:.8rem;flex-shrink:0">25 min/day</div>
      </label>
      <label class="calc-check" style="display:flex;gap:12px;align-items:flex-start;cursor:pointer;padding:10px 14px;border-radius:10px;border:1px solid var(--border);transition:all .2s">
        <input type="checkbox" onchange="calcTime()" data-minutes="15" style="margin-top:3px;accent-color:var(--orange)">
        <div>
          <div style="font-weight:600;font-size:.9rem">Brainstorming &amp; problem-solving</div>
          <div style="font-size:.78rem;color:var(--dim)">Generating ideas, working through challenges</div>
        </div>
        <div style="margin-left:auto;color:var(--green);font-weight:700;font-size:.8rem;flex-shrink:0">15 min/day</div>
      </label>
      <label class="calc-check" style="display:flex;gap:12px;align-items:flex-start;cursor:pointer;padding:10px 14px;border-radius:10px;border:1px solid var(--border);transition:all .2s">
        <input type="checkbox" onchange="calcTime()" data-minutes="15" style="margin-top:3px;accent-color:var(--orange)">
        <div>
          <div style="font-weight:600;font-size:.9rem">Learning new things</div>
          <div style="font-size:.78rem;color:var(--dim)">Explaining concepts, tutorials, skill-building</div>
        </div>
        <div style="margin-left:auto;color:var(--green);font-weight:700;font-size:.8rem;flex-shrink:0">15 min/day</div>
      </label>
      <label class="calc-check" style="display:flex;gap:12px;align-items:flex-start;cursor:pointer;padding:10px 14px;border-radius:10px;border:1px solid var(--border);transition:all .2s">
        <input type="checkbox" onchange="calcTime()" data-minutes="10" style="margin-top:3px;accent-color:var(--orange)">
        <div>
          <div style="font-weight:600;font-size:.9rem">End-of-day wrap-up</div>
          <div style="font-size:.78rem;color:var(--dim)">Summarizing the day, prepping for tomorrow</div>
        </div>
        <div style="margin-left:auto;color:var(--green);font-weight:700;font-size:.8rem;flex-shrink:0">10 min/day</div>
      </label>
    </div>

    <!-- Results -->
    <div id="calc-results" style="text-align:center;padding:20px;background:var(--bg);border-radius:12px;border:1px solid var(--border);transition:all .3s">
      <div style="font-size:.75rem;font-weight:700;color:var(--dim);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Your Estimated Time Saved</div>
      <div id="calc-daily" style="font-size:2.2rem;font-weight:800;color:var(--text);transition:all .3s">0 min</div>
      <div style="font-size:.82rem;color:var(--dim);margin-bottom:16px">per day</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px">
        <div style="padding:10px;background:rgba(251,146,60,.06);border-radius:8px">
          <div id="calc-weekly" style="font-size:1.2rem;font-weight:800;color:var(--orange)">0 hrs</div>
          <div style="font-size:.7rem;color:var(--dim)">per week</div>
        </div>
        <div style="padding:10px;background:rgba(192,132,252,.06);border-radius:8px">
          <div id="calc-monthly" style="font-size:1.2rem;font-weight:800;color:var(--purple)">0 hrs</div>
          <div style="font-size:.7rem;color:var(--dim)">per month</div>
        </div>
        <div style="padding:10px;background:rgba(74,222,128,.06);border-radius:8px">
          <div id="calc-yearly" style="font-size:1.2rem;font-weight:800;color:var(--green)">0 days</div>
          <div style="font-size:.7rem;color:var(--dim)">per year</div>
        </div>
      </div>
      </div>
  </div>
</div>

<!-- KEY TAKEAWAY -->
<div class="callout purple">
  <p><strong>You just built a complete AI assistant setup.</strong> You have a custom system prompt, a morning routine, a prompt library, and proof of how much time you'll save. This isn't theory anymore -- this is your real workflow. The only thing left? Start using it tomorrow morning.</p>
</div>

<button class="complete-btn" id="completeBtn" onclick="completeLesson()">Complete Lesson 8 &#10003;</button>

</div>

<style>
/* Blueprint archetype buttons */
.archetype-btn {
  display:flex;flex-direction:column;align-items:center;gap:4px;
  background:var(--bg);border:1px solid var(--border);border-radius:12px;
  padding:14px 10px;cursor:pointer;transition:all .2s;color:var(--text);
  font-family:inherit;text-align:center;
}
.archetype-btn:hover { border-color:var(--orange);background:rgba(251,146,60,.04); }
.archetype-btn.selected { border-color:var(--orange);background:rgba(251,146,60,.1);box-shadow:0 0 0 1px var(--orange); }

/* Tone / boundary tags */
.tone-tag {
  background:var(--bg);border:1px solid var(--border);border-radius:20px;
  padding:6px 14px;font-size:.8rem;color:var(--dim);cursor:pointer;
  transition:all .2s;font-family:inherit;
}
.tone-tag:hover { border-color:var(--purple);color:var(--text); }
.tone-tag.selected { background:rgba(192,132,252,.12);border-color:var(--purple);color:var(--purple);font-weight:600; }

/* Copy buttons in prompt cards */
.copy-btn-small {
  background:rgba(251,146,60,.1);border:1px solid rgba(251,146,60,.25);border-radius:6px;
  padding:4px 12px;font-size:.72rem;font-weight:700;color:var(--orange);cursor:pointer;
  transition:all .2s;font-family:inherit;flex-shrink:0;text-transform:uppercase;letter-spacing:.5px;
}
.copy-btn-small:hover { background:var(--orange);color:#000; }

/* Calculator checkboxes */
.calc-check:has(input:checked) {
  border-color:rgba(74,222,128,.3);background:rgba(74,222,128,.04);
}

/* Tip box */
.tip-box {
  background:rgba(192,132,252,.06);border:1px solid rgba(192,132,252,.15);
  border-radius:10px;padding:12px 16px;font-size:.82rem;color:var(--dim);line-height:1.6;
}

/* Button base */
.btn { border:none;border-radius:10px;padding:12px 24px;font-family:inherit;font-weight:700;font-size:.9rem;cursor:pointer;transition:all .2s; }
.btn-primary { background:var(--orange);color:#000; }
.btn-primary:hover { opacity:.9; }
.btn-primary:disabled { opacity:.4;cursor:not-allowed; }

@media(max-width:600px){
  #archetype-grid { grid-template-columns:1fr !important; }
}
</style>

<script>
const SLUG = 'claude-for-beginners';
const LESSON_NUM = 8;

/* ---- Scroll-based complete button ---- */
window.addEventListener('scroll', function() {
  if (window.scrollY / (document.body.scrollHeight - window.innerHeight) > 0.6) {
    document.getElementById('completeBtn').classList.add('visible');
  }
});

function completeLesson() {
  const stored = localStorage.getItem('lo_progress_' + SLUG);
  const completed = stored ? JSON.parse(stored) : [];
  if (!completed.includes(LESSON_NUM)) { completed.push(LESSON_NUM); localStorage.setItem('lo_progress_' + SLUG, JSON.stringify(completed)); }
  const btn = document.getElementById('completeBtn');
  btn.innerHTML = 'Completed! &#10024;'; btn.style.background = 'var(--green)'; btn.style.pointerEvents = 'none';
}

(function() {
  const stored = localStorage.getItem('lo_progress_' + SLUG);
  const completed = stored ? JSON.parse(stored) : [];
  if (completed.includes(LESSON_NUM)) {
    const btn = document.getElementById('completeBtn');
    btn.classList.add('visible'); btn.innerHTML = 'Completed! &#10024;'; btn.style.background = 'var(--green)'; btn.style.pointerEvents = 'none';
  }
})();

/* ---- Blueprint: Archetype selection ---- */
function selectArchetype(el) {
  document.querySelectorAll('.archetype-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  document.getElementById('bp-role').value = el.dataset.role;
  updateBlueprint();
}

/* ---- Blueprint: Tone tags ---- */
const selectedTones = new Set();
function toggleTone(el) {
  const tone = el.textContent;
  if (selectedTones.has(tone)) { selectedTones.delete(tone); el.classList.remove('selected'); }
  else { selectedTones.add(tone); el.classList.add('selected'); }
  document.getElementById('tone-count').textContent = selectedTones.size + ' trait' + (selectedTones.size !== 1 ? 's' : '') + ' selected';
  updateBlueprint();
}

/* ---- Blueprint: Boundary tags ---- */
const selectedBoundaries = new Set();
function toggleBoundary(el) {
  const b = el.textContent;
  if (selectedBoundaries.has(b)) { selectedBoundaries.delete(b); el.classList.remove('selected'); }
  else { selectedBoundaries.add(b); el.classList.add('selected'); }
  updateBlueprint();
}

/* ---- Blueprint: Generate system prompt ---- */
function updateBlueprint() {
  const parts = [];
  const role = document.getElementById('bp-role').value.trim();
  if (role) parts.push('## Role\n' + role);

  if (selectedTones.size > 0) {
    parts.push('## Tone & Personality\nCommunicate in a ' + Array.from(selectedTones).join(', ').toLowerCase() + ' way.');
  }

  const tasks = Array.from(document.querySelectorAll('.bp-task')).map(t => t.value.trim()).filter(Boolean);
  if (tasks.length > 0) {
    parts.push('## Daily Tasks\nMy top priorities for you to help with:\n' + tasks.map((t, i) => (i + 1) + '. ' + t).join('\n'));
  }

  const industry = document.getElementById('bp-industry').value.trim();
  const title = document.getElementById('bp-title').value.trim();
  const tools = document.getElementById('bp-tools').value.trim();
  const contextParts = [];
  if (industry) contextParts.push('Industry: ' + industry);
  if (title) contextParts.push('My role: ' + title);
  if (tools) contextParts.push('Tools I use: ' + tools);
  if (contextParts.length > 0) {
    parts.push('## Context\n' + contextParts.join('\n'));
  }

  const customBoundaries = document.getElementById('bp-boundaries').value.trim();
  const allBoundaries = Array.from(selectedBoundaries);
  if (customBoundaries) allBoundaries.push(customBoundaries);
  if (allBoundaries.length > 0) {
    parts.push('## Boundaries\n' + allBoundaries.map(b => '- ' + b).join('\n'));
  }

  const prompt = parts.length > 0 ? parts.join('\n\n') : 'Complete the steps above to generate your personal assistant prompt...';
  document.getElementById('generated-prompt').textContent = prompt;
  document.getElementById('copy-system-btn').disabled = parts.length === 0;

  const wordCount = parts.length > 0 ? prompt.split(/\s+/).length : 0;
  document.getElementById('bp-word-count').textContent = wordCount + ' words';
}

/* ---- Copy system prompt ---- */
function copySystemPrompt() {
  const text = document.getElementById('generated-prompt').textContent;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('copy-system-btn');
    btn.textContent = 'Copied! Paste into Claude\'s Custom Instructions';
    btn.style.background = 'var(--green)';
    setTimeout(() => { btn.textContent = 'Copy System Prompt'; btn.style.background = ''; }, 2500);
  });
}

/* ---- Copy from prompt cards ---- */
function copyFromCard(btn) {
  const card = btn.closest('.prompt-card');
  const text = card.querySelector('.prompt-text').textContent;
  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = 'Copied!';
    btn.style.background = 'var(--green)';
    btn.style.color = '#000';
    btn.style.borderColor = 'var(--green)';
    setTimeout(() => {
      btn.textContent = 'Copy';
      btn.style.background = '';
      btn.style.color = '';
      btn.style.borderColor = '';
    }, 1500);
  });
}

/* ---- General copy helper ---- */
function copyText(text) {
  navigator.clipboard.writeText(text).then(() => {
    const toast = document.createElement('div');
    toast.textContent = 'Copied!';
    toast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--green);color:#000;padding:8px 20px;border-radius:8px;font-weight:700;font-size:.85rem;z-index:9999;animation:fadeUp .3s ease';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 1500);
  });
}

/* ---- Time savings calculator ---- */
function calcTime() {
  const checks = document.querySelectorAll('#calc-tasks input[type="checkbox"]');
  let totalMin = 0;
  checks.forEach(c => { if (c.checked) totalMin += parseInt(c.dataset.minutes); });

  const weeklyHrs = ((totalMin * 5) / 60).toFixed(1);
  const monthlyHrs = ((totalMin * 22) / 60).toFixed(0);
  const yearlyDays = ((totalMin * 260) / 60 / 8).toFixed(1);

  document.getElementById('calc-daily').textContent = totalMin + ' min';
  document.getElementById('calc-weekly').textContent = weeklyHrs + ' hrs';
  document.getElementById('calc-monthly').textContent = monthlyHrs + ' hrs';
  document.getElementById('calc-yearly').textContent = yearlyDays + ' days';

  const results = document.getElementById('calc-results');
  const msg = document.getElementById('calc-message');

  if (totalMin === 0) {
    results.style.borderColor = 'var(--border)';
    msg.textContent = '';
  } else if (totalMin < 60) {
    results.style.borderColor = 'rgba(251,146,60,.3)';
    msg.innerHTML = 'A solid start. Even ' + totalMin + ' minutes a day adds up to <strong>' + monthlyHrs + ' hours a month</strong> of your life back.';
  } else if (totalMin < 120) {
    results.style.borderColor = 'rgba(192,132,252,.3)';
    msg.innerHTML = 'That\'s serious. You\'d get back <strong>' + yearlyDays + ' full work days</strong> this year. That\'s like getting a whole extra month.';
  } else {
    results.style.borderColor = 'rgba(74,222,128,.3)';
    msg.innerHTML = 'You\'re going to be a completely different operator. <strong>' + yearlyDays + ' work days</strong> back per year. Claude basically becomes your most valuable team member.';
  }
}
</script>
