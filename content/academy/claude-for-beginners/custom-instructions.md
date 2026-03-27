---
title: "Custom Instructions & Memory"
course: "claude-for-beginners"
order: 7
type: "lesson"
free: false
css: "claude-beginners.css"
---<div class="wrap">

<nav class="local-nav">
  <a href="/academy/claude-for-beginners/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 7 of 9</span>
</nav>

<!-- HERO -->
<div class="lesson-hero">
  <h1>Custom Instructions <span class="accent">& Memory.</span></h1>
  <p class="sub">Teach Claude how you work once, and every conversation gets better automatically.</p>
</div>

<!-- LEARNING GOALS -->
<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>What custom instructions are and why they matter</li>
    <li>How to build your own custom instructions (hands-on)</li>
    <li>How Claude's memory works within and across conversations</li>
    <li>Which pre-built template matches your work style</li>
  </ul>
</div>

<!-- SECTION 1: WHAT ARE CUSTOM INSTRUCTIONS -->
<div class="lesson-section">
  <span class="section-label">The Concept</span>
  <h2 class="section-title">Custom instructions are your Day 1 briefing for Claude.</h2>
  <p class="section-text">Imagine hiring a new assistant. On their first day, you'd tell them: <strong>"Here's how I like things done. Here's my role. Here's my style."</strong> You wouldn't repeat that every single morning. You'd say it once, and they'd remember.</p>
  <p class="section-text">That's exactly what custom instructions are. They're <strong>persistent instructions that shape every conversation</strong> with Claude. Set them once, and Claude automatically adjusts its tone, format, and approach to match the way you work.</p>

  <div class="demo-container" style="padding:1.5rem">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div>
        <div style="font-size:.75rem;font-weight:700;color:var(--red);margin-bottom:.75rem;text-transform:uppercase;letter-spacing:1px">Without Custom Instructions</div>
        <div style="font-size:.85rem;color:var(--dim);line-height:1.7">
          <p>Every conversation starts from zero. You have to remind Claude of your preferences every time:</p>
          <p style="margin-top:.5rem;font-style:italic;color:var(--muted)">"Keep it brief. Use bullet points. I'm a marketing director. Don't be too formal..."</p>
        </div>
      </div>
      <div>
        <div style="font-size:.75rem;font-weight:700;color:var(--green);margin-bottom:.75rem;text-transform:uppercase;letter-spacing:1px">With Custom Instructions</div>
        <div style="font-size:.85rem;color:var(--dim);line-height:1.7">
          <p>Claude already knows your style. Every conversation picks up where the last left off:</p>
          <p style="margin-top:.5rem;font-style:italic;color:var(--muted)">"Summarize the Q3 report." <span style="color:var(--green)">&rarr; instantly gets bullet points, in your tone.</span></p>
        </div>
      </div>
    </div>
  </div>

  <div class="callout">
    <p><strong>Think of it this way:</strong> Without custom instructions, Claude is a brilliant generalist. With custom instructions, Claude is <strong>your</strong> brilliant assistant who already knows how you think.</p>
  </div>
</div>

<!-- SECTION 2: THE BUILDER -->
<div class="lesson-section">
  <span class="section-label">Interactive</span>
  <h2 class="section-title">Build your custom instructions right now.</h2>
  <p class="section-text">Fill in the fields below and watch your personalized custom instruction get built in real time. When you're done, copy it and paste it into Claude's settings.</p>

  <div class="demo-container" style="padding:2rem">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:2rem" id="builder-layout">

      <!-- Left: Form -->
      <div>
        <div style="font-size:.75rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--orange);margin-bottom:1.25rem">Your Details</div>
        <div class="builder-form">
          <div class="builder-field">
            <label>Your Role / Job Title</label>
            <input type="text" id="b-role" placeholder="e.g. Marketing Director, Freelance Writer, Teacher">
          </div>

          <div class="builder-field">
            <label>Communication Style</label>
            <select id="b-style">
              <option value="">Choose a style...</option>
              <option value="casual">Casual — Relaxed, conversational, like texting a smart friend</option>
              <option value="professional">Professional — Clean, polished, boardroom-ready</option>
              <option value="academic">Academic — Thorough, well-sourced, structured</option>
              <option value="friendly-professional">Friendly-Professional — Warm but buttoned-up</option>
            </select>
          </div>

          <div class="builder-field">
            <label>What do you mainly use Claude for?</label>
            <div class="checkbox-group">
              <label><input type="checkbox" value="emails"><span>Emails</span></label>
              <label><input type="checkbox" value="documents"><span>Documents</span></label>
              <label><input type="checkbox" value="data analysis"><span>Data Analysis</span></label>
              <label><input type="checkbox" value="brainstorming"><span>Brainstorming</span></label>
              <label><input type="checkbox" value="writing"><span>Writing</span></label>
            </div>
          </div>

          <div class="builder-field">
            <label>Preferences</label>
            <div class="checkbox-group">
              <label><input type="checkbox" value="bullet points over paragraphs"><span>Bullet points over paragraphs</span></label>
              <label><input type="checkbox" value="be concise"><span>Be concise</span></label>
              <label><input type="checkbox" value="give examples"><span>Give examples</span></label>
              <label><input type="checkbox" value="ask clarifying questions"><span>Ask clarifying questions</span></label>
            </div>
          </div>

          <div class="builder-actions">
            <button class="generate-btn" onclick="generateInstruction()">Generate My Instructions</button>
          </div>
        </div>
      </div>

      <!-- Right: Preview -->
      <div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem">
          <span style="font-size:.75rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--purple)">Live Preview</span>
          <button class="copy-btn" id="copyBtn" onclick="copyInstruction()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
            Copy
          </button>
        </div>
        <div class="preview-block" id="preview">
          <span class="placeholder-text">Fill in the form and click "Generate" to see your custom instruction here...</span>
        </div>
      </div>

    </div>
  </div>

  <div class="tip-box">
    <div class="tip-label">Where to paste this</div>
    <p>In Claude.ai, click your name (bottom-left) &rarr; <strong>Settings</strong> &rarr; <strong>Custom Instructions</strong>. Paste your generated text there. On the Claude mobile app, go to <strong>Settings &rarr; Custom Instructions</strong>. It applies to every new conversation automatically.</p>
  </div>
</div>

<!-- SECTION 3: CLAUDE'S MEMORY -->
<div class="lesson-section">
  <span class="section-label">How It Works</span>
  <h2 class="section-title">How Claude remembers (and forgets).</h2>
  <p class="section-text">One of the most common frustrations with AI: <strong>"Why doesn't it remember what I told it yesterday?"</strong> Here's what's actually happening under the hood, explained simply.</p>

  <div class="memory-visual">
    <div class="memory-row">
      <div class="memory-icon">💬</div>
      <div>
        <h4>Within a Conversation: Full Memory</h4>
        <p>Claude remembers everything you've said in the current chat. It's like a conversation with a person — they heard everything you just said. This is called the <strong>context window</strong>, and it can hold roughly 150,000+ words.</p>
      </div>
    </div>
    <div class="memory-row">
      <div class="memory-icon">🚪</div>
      <div>
        <h4>Between Conversations: Fresh Start</h4>
        <p>By default, when you start a new chat, Claude starts fresh. It doesn't remember your last conversation. This is by design — it protects your privacy. But it means you need strategies to carry context forward.</p>
      </div>
    </div>
    <div class="memory-row">
      <div class="memory-icon">📁</div>
      <div>
        <h4>Projects: Persistent Context</h4>
        <p>Claude's <strong>Projects</strong> feature lets you upload documents and set instructions that persist across every conversation within that project. Think of it as giving Claude a filing cabinet for a specific topic or workflow.</p>
      </div>
    </div>
    <div class="memory-row">
      <div class="memory-icon">🧠</div>
      <div>
        <h4>Custom Instructions: Always-On Memory</h4>
        <p>Custom instructions are the one thing Claude reads at the start of <strong>every</strong> conversation. They're your persistent layer — your preferences, your role, your style — always active, always shaping responses.</p>
      </div>
    </div>
  </div>

  <div class="callout purple">
    <p><strong>The memory stack:</strong> Custom instructions (always on) + Projects (per-topic) + conversation context (per-chat) = a Claude that feels like it truly knows you. Stack all three for the best results.</p>
  </div>

  <div class="demo-container" style="padding:1.5rem">
    <div style="font-size:.75rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--orange);margin-bottom:1rem">Tips for Helping Claude "Remember"</div>
    <div style="display:flex;flex-direction:column;gap:.75rem">
      <div style="display:flex;align-items:flex-start;gap:.5rem;font-size:.85rem;color:var(--dim)">
        <span style="color:var(--green);font-weight:700;flex-shrink:0">1.</span>
        <span><strong style="color:var(--text)">Front-load context.</strong> At the start of a long conversation, give Claude the key details it needs. "I'm working on a marketing plan for a B2B SaaS company targeting mid-market CFOs."</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.5rem;font-size:.85rem;color:var(--dim)">
        <span style="color:var(--green);font-weight:700;flex-shrink:0">2.</span>
        <span><strong style="color:var(--text)">Use Projects for recurring work.</strong> If you have a weekly report, a specific client, or an ongoing project — create a Claude Project and upload relevant docs. Claude will reference them automatically.</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.5rem;font-size:.85rem;color:var(--dim)">
        <span style="color:var(--green);font-weight:700;flex-shrink:0">3.</span>
        <span><strong style="color:var(--text)">Ask Claude to summarize before you go.</strong> At the end of a long session, say: "Summarize what we decided, the key context, and next steps — formatted so I can paste it into our next conversation." Then do exactly that.</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.5rem;font-size:.85rem;color:var(--dim)">
        <span style="color:var(--green);font-weight:700;flex-shrink:0">4.</span>
        <span><strong style="color:var(--text)">Keep custom instructions lean.</strong> Don't write an essay. The best custom instructions are 100-200 words: your role, your style, your non-negotiables. Claude reads them every time — make them count.</span>
      </div>
    </div>
  </div>
</div>

<!-- SECTION 4: TEMPLATES -->
<div class="lesson-section">
  <span class="section-label">Plug & Play</span>
  <h2 class="section-title">4 templates that match how you work.</h2>
  <p class="section-text">Not sure what to write? Pick a template that matches your work style. Click any card to preview the full instruction — then copy it directly into your settings.</p>

  <div class="template-grid">
    <div class="template-card" onclick="showTemplate(0)">
      <div class="template-tag">Fast & Direct</div>
      <div class="template-icon">👔</div>
      <h4>The Executive</h4>
      <p>Bullet points. Bottom line first. Decision-focused. No fluff.</p>
    </div>
    <div class="template-card" onclick="showTemplate(1)">
      <div class="template-tag">Exploratory</div>
      <div class="template-icon">🎨</div>
      <h4>The Creative</h4>
      <p>Brainstorming partner. Asks questions. Explores wild ideas before narrowing down.</p>
    </div>
    <div class="template-card" onclick="showTemplate(2)">
      <div class="template-tag">Data-Driven</div>
      <div class="template-icon">📊</div>
      <h4>The Analyst</h4>
      <p>Show your work. Precise. Numbers first, narrative second. Flag assumptions.</p>
    </div>
    <div class="template-card" onclick="showTemplate(3)">
      <div class="template-tag">Editorial</div>
      <div class="template-icon">✍️</div>
      <h4>The Writer</h4>
      <p>Matches your voice. Editorial quality. Catches errors. Suggests stronger phrasing.</p>
    </div>
  </div>

  <div class="template-preview" id="template-preview">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
      <span id="template-name" style="font-size:.8rem;font-weight:700;color:var(--orange)"></span>
      <button class="copy-btn" onclick="copyTemplate()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
        Copy Template
      </button>
    </div>
    <pre id="template-text"></pre>
  </div>
</div>

<!-- KEY TAKEAWAY -->
<div class="callout purple">
  <p><strong>The bottom line:</strong> Custom instructions are the highest-leverage thing you can do with Claude. Five minutes of setup saves you <strong>hundreds of "remind Claude how I like things"</strong> messages over the coming months. Set them up today.</p>
</div>

<!-- COMPLETION -->
<button class="complete-btn" id="completeBtn" onclick="completeLesson()">Complete Lesson 7 ✓</button>

<div class="lesson-footer">
  <a href="workflow-quiz.html" style="color:var(--dim);font-weight:500;font-size:.9rem;margin-right:2rem">&larr; Previous: Workflow Quiz</a>
  <a href="build-your-assistant.html" style="color:var(--orange);font-weight:600;font-size:.9rem">Next: Build Your Assistant &rarr;</a>
</div>

</div>

<script>
const SLUG = 'claude-for-beginners';
const LESSON_NUM = 7;

// ---- SCROLL-REVEAL COMPLETE BUTTON ----
window.addEventListener('scroll', function() {
  const scrollPct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  if (scrollPct > 0.6) {
    document.getElementById('completeBtn').classList.add('visible');
  }
});

function completeLesson() {
  const stored = localStorage.getItem('lo_progress_' + SLUG);
  const completed = stored ? JSON.parse(stored) : [];
  if (!completed.includes(LESSON_NUM)) {
    completed.push(LESSON_NUM);
    localStorage.setItem('lo_progress_' + SLUG, JSON.stringify(completed));
  }
  const btn = document.getElementById('completeBtn');
  btn.textContent = 'Completed! ✨';
  btn.style.background = 'var(--green)';
  btn.style.pointerEvents = 'none';
}

// Check if already completed
(function() {
  const stored = localStorage.getItem('lo_progress_' + SLUG);
  const completed = stored ? JSON.parse(stored) : [];
  if (completed.includes(LESSON_NUM)) {
    const btn = document.getElementById('completeBtn');
    btn.classList.add('visible');
    btn.textContent = 'Completed! ✨';
    btn.style.background = 'var(--green)';
    btn.style.pointerEvents = 'none';
  }
})();

// ---- CUSTOM INSTRUCTION BUILDER ----
const styleDescriptions = {
  'casual': 'Use a casual, conversational tone — like texting a smart friend. No corporate speak.',
  'professional': 'Use a clean, professional tone. Polished and direct. Suitable for business contexts.',
  'academic': 'Use a thorough, well-structured tone. Cite reasoning. Be precise with language.',
  'friendly-professional': 'Use a warm but professional tone. Approachable, yet buttoned-up. Think friendly colleague, not robot.'
};

function generateInstruction() {
  const role = document.getElementById('b-role').value.trim();
  const style = document.getElementById('b-style').value;

  const uses = [];
  document.querySelectorAll('.builder-form .checkbox-group')[0].querySelectorAll('input:checked').forEach(function(cb) {
    uses.push(cb.value);
  });

  const prefs = [];
  document.querySelectorAll('.builder-form .checkbox-group')[1].querySelectorAll('input:checked').forEach(function(cb) {
    prefs.push(cb.value);
  });

  if (!role && !style && uses.length === 0 && prefs.length === 0) {
    document.getElementById('preview').innerHTML = '<span class="placeholder-text">Fill in at least one field to generate your custom instruction.</span>';
    return;
  }

  let output = '';

  if (role) {
    output += '## About Me\nI am a ' + role + '. Tailor your responses to be relevant to my role and responsibilities.\n\n';
  }

  if (style) {
    output += '## Communication Style\n' + styleDescriptions[style] + '\n\n';
  }

  if (uses.length > 0) {
    output += '## What I Use You For\nI primarily use you for: ' + uses.join(', ') + '. Optimize your responses for these tasks.\n\n';
  }

  if (prefs.length > 0) {
    output += '## My Preferences\n';
    prefs.forEach(function(p) {
      output += '- ' + p.charAt(0).toUpperCase() + p.slice(1) + '\n';
    });
    output += '\n';
  }

  output += '## General Rules\n- Be direct. Get to the point.\n- If you\'re unsure about something, say so rather than guessing.\n- When I give you a task, do it — don\'t explain what you\'re about to do, just do it.';

  document.getElementById('preview').textContent = output;
}

// Real-time preview on input changes
document.querySelectorAll('#b-role, #b-style').forEach(function(el) {
  el.addEventListener('input', generateInstruction);
  el.addEventListener('change', generateInstruction);
});
document.querySelectorAll('.builder-form input[type="checkbox"]').forEach(function(cb) {
  cb.addEventListener('change', generateInstruction);
});

function copyInstruction() {
  const text = document.getElementById('preview').textContent;
  if (!text || text.indexOf('Fill in') === 0) return;

  navigator.clipboard.writeText(text).then(function() {
    const btn = document.getElementById('copyBtn');
    btn.classList.add('copied');
    btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Copied!';
    setTimeout(function() {
      btn.classList.remove('copied');
      btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy';
    }, 2000);
  });
}

// ---- TEMPLATES ----
const templates = [
  {
    name: 'The Executive',
    text: '## Role\nI am a senior leader / executive. My time is limited. Every word matters.\n\n## Communication Style\n- Lead with the bottom line. Always.\n- Use bullet points, not paragraphs.\n- Keep responses short — aim for 50-150 words unless I ask for more.\n- Bold the key takeaway or recommendation.\n- If there\'s a decision to make, frame it as options with clear trade-offs.\n\n## Preferences\n- No filler phrases ("Great question!", "Certainly!", "I\'d be happy to...")\n- No caveats unless they\'re critical\n- When summarizing, use the format: Key Point → So What → Action Needed\n- If I ask "what should I do?" — give me ONE recommendation, then alternatives\n\n## General Rules\n- Treat my time as the most valuable resource.\n- Be direct. Be decisive. Be brief.'
  },
  {
    name: 'The Creative',
    text: '## Role\nI\'m a creative professional. I use you as a brainstorming partner and sounding board.\n\n## Communication Style\n- Be exploratory and open-minded. Don\'t rush to conclusions.\n- Ask me good questions before jumping to solutions.\n- Offer multiple angles, perspectives, and "what if" scenarios.\n- Use analogies and unexpected connections to spark ideas.\n- Match my energy — if I\'m riffing, riff with me. If I\'m refining, get precise.\n\n## Preferences\n- Quantity of ideas first, then we\'ll narrow down together\n- Don\'t self-censor — give me the wild ideas alongside the safe ones\n- When I share work, give honest creative feedback, not just praise\n- Use "Yes, and..." thinking — build on ideas rather than shutting them down\n\n## General Rules\n- Surprise me. I don\'t want predictable.\n- If something I wrote is mediocre, tell me — then help me make it great.'
  },
  {
    name: 'The Analyst',
    text: '## Role\nI work with data, research, and analysis. Precision matters more than prose.\n\n## Communication Style\n- Lead with data and evidence, not opinions.\n- Show your reasoning step by step — I want to verify your logic.\n- Use numbers, percentages, and specific figures whenever possible.\n- Clearly separate facts from assumptions from inferences.\n- If you\'re uncertain about a data point, flag it explicitly.\n\n## Preferences\n- Use tables and structured formats for comparisons\n- When analyzing, follow this structure: Finding → Evidence → Implication\n- Always state assumptions upfront\n- Quantify things when you can — "significant" means nothing, "23% increase" means something\n- If I give you data, look for patterns, outliers, and anomalies I might miss\n\n## General Rules\n- Accuracy over speed. I\'d rather wait for a correct answer.\n- If you can\'t verify something, say "I\'m inferring this based on..." rather than stating it as fact.'
  },
  {
    name: 'The Writer',
    text: '## Role\nI\'m a writer. I use you as an editor, co-writer, and writing coach.\n\n## Communication Style\n- Match my voice and tone. Read what I give you and mirror it.\n- Be editorial, not generic. Every word should earn its place.\n- When editing, explain WHY a change improves the writing, not just what to change.\n- Suggest stronger verbs, tighter phrasing, and more vivid language.\n\n## Preferences\n- Show, don\'t tell — in your suggestions and my writing\n- Catch inconsistencies, awkward phrasing, and rhythm issues\n- When I\'m drafting, help me think through structure before diving into prose\n- Give me 2-3 options for key sentences so I can pick the voice that fits\n- Flag cliches and suggest fresher alternatives\n\n## General Rules\n- Never make my writing sound like AI. It should sound like me, but sharper.\n- If a piece isn\'t working, tell me honestly — then help me fix the core problem, not just polish the surface.'
  }
];

let activeTemplate = -1;

function showTemplate(idx) {
  // Toggle off if clicking the same one
  const cards = document.querySelectorAll('.template-card');
  if (activeTemplate === idx) {
    cards[idx].classList.remove('active');
    document.getElementById('template-preview').classList.remove('visible');
    activeTemplate = -1;
    return;
  }

  cards.forEach(function(c) { c.classList.remove('active'); });
  cards[idx].classList.add('active');
  activeTemplate = idx;

  document.getElementById('template-name').textContent = templates[idx].name;
  document.getElementById('template-text').textContent = templates[idx].text;
  const preview = document.getElementById('template-preview');
  preview.classList.add('visible');
  preview.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function copyTemplate() {
  if (activeTemplate < 0) return;
  const text = templates[activeTemplate].text;

  navigator.clipboard.writeText(text).then(function() {
    const btns = document.querySelectorAll('.template-preview .copy-btn');
    btns[0].classList.add('copied');
    btns[0].innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Copied!';
    setTimeout(function() {
      btns[0].classList.remove('copied');
      btns[0].innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy Template';
    }, 2000);
  });
}

// Responsive: stack builder on mobile
(function() {
  if (window.innerWidth <= 600) {
    document.getElementById('builder-layout').style.gridTemplateColumns = '1fr';
  }
})();
</script>
