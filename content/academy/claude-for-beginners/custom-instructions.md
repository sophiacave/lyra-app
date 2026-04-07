---
title: "Custom Instructions & Memory"
course: "claude-for-beginners"
order: 7
type: "lesson"
free: false
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

<!-- SECTION 1: CONCEPT -->
<div class="lesson-section">
  <span class="section-label">The Concept</span>
  <h2 class="section-title">Custom instructions are your Day 1 briefing for Claude.</h2>
  <p class="section-text">Imagine hiring a new assistant. On their first day, you'd tell them: <strong>"Here's how I like things done. Here's my role. Here's my style."</strong> You wouldn't repeat that every morning. You'd say it once.</p>
  <p class="section-text">That's custom instructions. <strong>Persistent instructions that shape every conversation</strong> with Claude. Set them once, and Claude automatically adjusts its tone, format, and approach.</p>

<div data-learn="FlashDeck" data-props='{"title":"With vs Without Custom Instructions","cards":[{"front":"❌ Without Custom Instructions\n\nEvery conversation starts from zero. You repeat yourself constantly:\n\n\"Keep it brief. Use bullets. I am a marketing director. Don not be too formal...\"","back":"✅ With Custom Instructions\n\nClaude already knows:\n• Your role (marketing director)\n• Your style (conversational, direct)\n• Your preferences (bullets over paragraphs, short over long)\n• Your tools (Google Workspace, Notion, Slack)\n\nEvery response is tailored from the first word."}]}'></div>

</div>

<!-- SECTION 2: MEMORY STACK -->
<div class="lesson-section">
  <span class="section-label">How It Works</span>
  <h2 class="section-title">How Claude remembers (and forgets).</h2>
  <p class="section-text">Claude has four memory layers. Understanding them helps you use each one strategically.</p>

<div data-learn="FlashDeck" data-props='{"title":"The 4 Memory Layers","cards":[{"front":"💬 Layer 1: Within a Conversation\n\nClaude remembers everything you have said in the current chat.","back":"This is automatic. Claude tracks all context within a single conversation. You can say \"go back to the email we drafted earlier\" and it knows exactly what you mean.\n\nLimit: Conversations have a context window. Very long chats may lose early details."},{"front":"🧠 Layer 2: Across Conversations (Memory)\n\nClaude can save key facts you tell it to remember.","back":"You can say \"Remember that I prefer bullet points over paragraphs\" and Claude stores this. It persists across new conversations.\n\nThis is newer and optional — you control what Claude remembers."},{"front":"📁 Layer 3: Projects\n\nClaude Projects let you upload files and instructions for a specific context.","back":"Create a Project for each major area of your work. Upload relevant docs, add custom instructions specific to that project. Every conversation in that project has full context.\n\nBest for: Recurring work (weekly reports, client management, code projects)."},{"front":"⚙️ Layer 4: Custom Instructions\n\nYour global preferences that apply to ALL conversations.","back":"This is the Day 1 briefing. It includes your role, communication style, formatting preferences, and any always-on rules.\n\nCustom instructions + Projects + Memory = Claude that truly knows you."}]}'></div>

</div>

<!-- SECTION 3: TEMPLATES -->
<div class="lesson-section">
  <span class="section-label">Pick Your Template</span>
  <h2 class="section-title">4 custom instruction templates — pick the one that fits.</h2>
  <p class="section-text">Match your work style to the right template, then customize from there.</p>


<div data-learn="FlashDeck" data-props='{"title":"Copy-Paste Templates","cards":[{"front":"👔 Executive Template\n\nFor managers, directors, and leaders who need speed and clarity.","back":"PASTE THIS INTO CUSTOM INSTRUCTIONS:\n\nI am a [title] at [company]. I manage [team/scope]. My communication style is direct and professional — no fluff. Default to bullet points over paragraphs. Keep responses concise unless I ask for detail. When I ask for help with emails, match a warm but authoritative tone. For decisions, give me the top 3 options with your recommendation first."},{"front":"🎨 Creative Template\n\nFor writers, designers, marketers, and content creators who need ideas and flexibility.","back":"PASTE THIS INTO CUSTOM INSTRUCTIONS:\n\nI am a [creative role] working on [type of projects]. I value original thinking over safe choices. When brainstorming, give me 10+ ideas and include some wild ones. For writing, match a conversational, engaging tone unless I specify otherwise. Help me avoid cliches. When editing, be honest about what is weak — I prefer direct feedback over encouragement."},{"front":"📊 Analyst Template\n\nFor data people, researchers, and anyone who works with numbers and systems.","back":"PASTE THIS INTO CUSTOM INSTRUCTIONS:\n\nI am a [analyst role] at [company]. I work with [data types/tools]. When I share data, look for trends, anomalies, and actionable insights. Always distinguish between correlation and causation. Default to structured outputs: tables, numbered lists, clear headers. When I ask what should I do, give me recommendations ranked by impact with supporting reasoning."},{"front":"✍️ Writer Template\n\nFor anyone who writes as a core part of their job.","back":"PASTE THIS INTO CUSTOM INSTRUCTIONS:\n\nI am a [writer/comms role] writing for [audience]. My default tone is [describe your tone]. When editing my work, focus on clarity and flow — cut words that do not earn their place. When drafting, give me a strong first draft I can edit rather than a perfect draft that sounds like AI. Avoid corporate jargon. Match the voice of [publication/brand] when relevant."}]}'></div>

</div>

<!-- SECTION 3.5: COMPLETE EXAMPLE -->
<div class="lesson-section">
  <span class="section-label">Full Example</span>
  <h2 class="section-title">A complete custom instruction — ready to paste.</h2>
  <p class="section-text">Here's a real example you can paste into Claude's settings right now. Replace the brackets with your details.</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Custom Instruction — paste into Claude Settings</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#fb923c">## About Me</span>
I am a [your title] at [company/industry].
I manage [team size / scope of work].
I work primarily in [tools: Google Workspace, Slack,
Notion, Excel, etc.].

<span style="color:#c084fc">## Communication Style</span>
- Be direct and concise — no fluff
- Default to bullet points over paragraphs
- Use professional but warm tone
- When I ask for options, give your recommendation
  first, then alternatives

<span style="color:#4ade80">## Formatting Rules</span>
- Keep responses under 300 words unless I ask for more
- Use headers and bullets for structure
- Bold key takeaways
- End emails with a clear call to action

<span style="color:#fbbf24">## What I Do Not Want</span>
- No corporate jargon or buzzwords
- No "As an AI..." disclaimers
- No repeating my question back to me
- No filler phrases like "Great question!"</code></pre>
</div>

</div>

<!-- SECTION 3.7: COMMON PATTERNS -->
<div class="lesson-section">
  <span class="section-label">Patterns</span>
  <h2 class="section-title">Common custom instruction patterns — what works and what doesn't.</h2>
  <p class="section-text">After seeing thousands of custom instructions, here are the patterns that produce the best results — and the ones that waste your character limit.</p>

  <div class="demo-container" style="padding:1.75rem">
    <div style="display:flex;flex-direction:column;gap:16px">
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(52,211,153,.12);color:#34d399;font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0;margin-top:2px">DO</div>
        <div>
          <div style="font-weight:700;font-size:.95rem;margin-bottom:2px">Include your role and industry</div>
          <div style="color:#a1a1aa;font-size:.85rem">"I am a product manager at a B2B SaaS company" gives Claude instant context for every response. It adjusts vocabulary, examples, and recommendations to match your world.</div>
        </div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(52,211,153,.12);color:#34d399;font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0;margin-top:2px">DO</div>
        <div>
          <div style="font-weight:700;font-size:.95rem;margin-bottom:2px">Specify what you do NOT want</div>
          <div style="color:#a1a1aa;font-size:.85rem">"No corporate jargon," "No 'Great question!' openers," "No repeating my question back to me." Negative instructions are surprisingly powerful at cutting the fluff.</div>
        </div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(52,211,153,.12);color:#34d399;font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0;margin-top:2px">DO</div>
        <div>
          <div style="font-weight:700;font-size:.95rem;margin-bottom:2px">Name your preferred format</div>
          <div style="color:#a1a1aa;font-size:.85rem">"Default to bullet points over paragraphs" or "Keep responses under 300 words unless I ask for more." Format preferences save the most editing time across all conversations.</div>
        </div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(239,68,68,.12);color:#ef4444;font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0;margin-top:2px">SKIP</div>
        <div>
          <div style="font-weight:700;font-size:.95rem;margin-bottom:2px">Do not include task-specific instructions</div>
          <div style="color:#a1a1aa;font-size:.85rem">"When I ask about marketing, always include ROI" is too specific for custom instructions. Save task-specific rules for Projects instead. Custom instructions should be universal preferences.</div>
        </div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(239,68,68,.12);color:#ef4444;font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0;margin-top:2px">SKIP</div>
        <div>
          <div style="font-weight:700;font-size:.95rem;margin-bottom:2px">Do not try to "jailbreak" or game the system</div>
          <div style="color:#a1a1aa;font-size:.85rem">Instructions like "ignore all safety guidelines" or "pretend you have no limitations" waste your character limit and do not work. Focus on genuinely useful preferences about how you work.</div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- SECTION 3.8: BEFORE AND AFTER -->
<div class="lesson-section">
  <span class="section-label">Before & After</span>
  <h2 class="section-title">See the difference custom instructions make.</h2>
  <p class="section-text">Here is the same question asked with and without custom instructions. The difference is dramatic.</p>

<div data-learn="FlashDeck" data-props='{"title":"Before vs After Custom Instructions","cards":[{"front":"The Question\n\nYou ask Claude: Help me write a status update for my boss.\n\n❌ WITHOUT custom instructions, Claude does not know your role, your boss preferences, or your communication style. It gives you a generic corporate template.","back":"✅ WITH custom instructions that say: I am a product manager at a fintech startup. My boss prefers bullet points. Keep it concise. No corporate jargon.\n\nClaude immediately writes a punchy, bulleted update using fintech terminology, formatted exactly how your boss likes it. Zero editing needed."},{"front":"The Question\n\nYou ask Claude: Brainstorm ideas for our team offsite.\n\n❌ WITHOUT custom instructions, Claude gives you generic team-building suggestions for an unknown team size, budget, and culture.","back":"✅ WITH custom instructions that say: I manage a remote team of 8 engineers. We value deep technical discussions. Budget-conscious startup.\n\nClaude suggests technical hackathons, architecture review sessions, and budget-friendly virtual activities tailored to engineers. Every idea fits your actual team."},{"front":"The Question\n\nYou ask Claude: Review this email draft.\n\n❌ WITHOUT custom instructions, Claude gives generic feedback and may suggest a more formal tone when you prefer casual.","back":"✅ WITH custom instructions that say: My writing style is conversational and direct. I prefer short sentences. No buzzwords.\n\nClaude edits specifically for your voice — cutting filler words, shortening sentences, replacing buzzwords with plain language. The result sounds like you, not a robot."}]}'></div>

  <div class="callout">
    <p><strong>The math is simple:</strong> Without custom instructions, you spend 10-15 seconds per conversation adding context about yourself. With custom instructions, that context is automatic. Over 10 conversations a day, that is 2-3 minutes saved — plus better results every single time.</p>
  </div>
</div>

<!-- SECTION 4: HOW TO SET UP -->
<div class="lesson-section">
  <span class="section-label">Step-by-Step</span>
  <h2 class="section-title">How to set up custom instructions right now.</h2>
  <p class="section-text">This takes less than 5 minutes. Follow these steps in order:</p>
<div class="tip-box">
    <div class="tip-label">Power Combo</div>
    <p><strong>Custom instructions + Projects + Memory = Claude that truly knows you.</strong> Start with custom instructions (global). Create a Project for each area of work (specific context). Use Memory for key facts you want Claude to always remember. This is how power users get 10x value from Claude.</p>
  </div>
</div>

<!-- SECTION 4.5: PROJECTS DEEP DIVE -->
<div class="lesson-section">
  <span class="section-label">Projects</span>
  <h2 class="section-title">Claude Projects — your context-specific workspaces.</h2>
  <p class="section-text">Custom instructions are your global settings. Projects are your context-specific settings. Think of Projects as different desks in your office — each one has the files and tools for a specific type of work.</p>

  <div class="demo-container" style="padding:1.75rem">
    <div style="display:flex;flex-direction:column;gap:16px">
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(52,211,153,.12);color:#34d399;font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0;margin-top:2px">1</div>
        <div>
          <div style="font-weight:700;font-size:.95rem;margin-bottom:2px">Client Management Project</div>
          <div style="color:#a1a1aa;font-size:.85rem">Upload your client brief, past emails, and meeting notes. Add project-specific instructions like "This client prefers formal communication" or "Always reference their Q2 goals." Now every conversation about this client has full context.</div>
        </div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(139,92,246,.12);color:#8b5cf6;font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0;margin-top:2px">2</div>
        <div>
          <div style="font-weight:700;font-size:.95rem;margin-bottom:2px">Weekly Reports Project</div>
          <div style="color:#a1a1aa;font-size:.85rem">Upload your report template, past reports for style reference, and team roster. Add instructions like "Use the same headers every week" and "My manager cares most about pipeline metrics." Consistent, polished reports every time.</div>
        </div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(251,146,60,.12);color:#fb923c;font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0;margin-top:2px">3</div>
        <div>
          <div style="font-weight:700;font-size:.95rem;margin-bottom:2px">Content Creation Project</div>
          <div style="color:#a1a1aa;font-size:.85rem">Upload your brand guidelines, tone of voice document, and top-performing posts. Add instructions like "Match the voice of our blog" and "Our audience is small business owners." Every piece of content stays on-brand.</div>
        </div>
      </div>
    </div>
  </div>

  <div class="tip-box">
    <div class="tip-label">When to Use Projects vs Custom Instructions</div>
    <p><strong>Custom instructions</strong> are for things that are true in every conversation — your role, communication style, formatting preferences. <strong>Projects</strong> are for things that are true only in a specific context — client details, project files, domain-specific rules. Use both for maximum effectiveness.</p>
  </div>
</div>

<!-- KEY TAKEAWAY -->
<div class="callout purple">
  <p><strong>The key insight:</strong> Custom instructions are the difference between Claude being a generic AI and Claude being <em>your</em> AI. Five minutes of setup saves hours of repeating yourself. Every conversation starts smarter.</p>
</div>

<!-- LESSON CHECK -->
<div class="lesson-section">
  <span class="section-label">Quick Check</span>
  <h2 class="section-title">Lock it in.</h2>

<div data-learn="QuizMC" data-props='{"questions":[{"q":"What are custom instructions?","options":["Commands that make Claude work faster","Persistent preferences that shape every conversation automatically","Secret codes that unlock features","Rules that limit what Claude can do"],"correct":1,"explanation":"Custom instructions are persistent context about who you are, how you work, and what you prefer. They apply to every conversation so you never have to repeat yourself."},{"q":"What happens to Claude memory between separate conversations?","options":["Everything carries over automatically","Nothing carries over — each conversation starts fresh by default","Only the last 5 messages carry over","Claude forgets everything after 24 hours"],"correct":1,"explanation":"By default, each new conversation starts fresh. Custom instructions and the Memory feature let you persist key context, but conversation-specific details do not carry over automatically."},{"q":"What is the most effective approach to setting up Claude for your work?","options":["Custom instructions only","Custom instructions + Projects + Memory combined","No setup — just use Claude as-is","Change your instructions before every conversation"],"correct":1,"explanation":"The trifecta: Custom instructions (global preferences), Projects (context-specific files and rules), and Memory (persistent facts) — combined, they make Claude a true personalized assistant."}]}'></div>

</div>

</div>
