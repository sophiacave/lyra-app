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
