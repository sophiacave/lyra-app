---
title: "Build a Team"
course: "the-automation-lab"
order: 7
type: "builder"
free: false
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>
</nav>

<div class="lesson-container">
  <div class="lesson-badge">Module 2 &middot; Lesson 7</div>
  <h1>Build a Team</h1>
  <p class="subtitle">A single agent hits its limits fast. Real systems need teams — agents with distinct roles that complement each other. This lesson teaches you how to compose agent teams, which roles are essential for common use cases, and what happens when you pick the wrong team.</p>

  <div class="section">
    <h2>Why Teams, Not Solo Agents?</h2>
    <p>A single agent with 30 tools, 10 goals, and 5 different responsibilities will underperform a team of 3 specialized agents every time. Why?</p>

    <div style="display:flex;flex-direction:column;gap:.75rem;margin:1rem 0">
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <strong style="color:#8b5cf6">Focus</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">LLMs perform better with fewer tools and a clear role. A "content writer" agent with 5 writing tools will produce better output than a "do-everything" agent with 30 tools that happens to also write content.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399">Separation of concerns</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">The agent that writes content should not also be the one that publishes it. If the writer crashes, the publisher keeps working on queued content. Each agent can fail independently without bringing down the whole system.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <strong style="color:#fb923c">Checks and balances</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">An editor agent reviewing a writer agent's output catches errors the writer would never catch on its own. An agent checking its own work is like a student grading their own exam — a separate reviewer is always better.</p>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>The Eight Core Roles</h2>
    <p>Most agent teams draw from these eight archetypes. Not every team needs all eight — the art is choosing the right subset for your use case:</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin:1rem 0">
      <div style="padding:1rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <strong style="color:#8b5cf6;font-size:.85rem">&#9997;&#65039; Writer</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0">Creates content — blog posts, emails, reports, social copy. The producer.</p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399;font-size:.85rem">&#128270; Editor</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0">Reviews, fact-checks, and improves. Quality gate that prevents errors from reaching production.</p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <strong style="color:#fb923c;font-size:.85rem">&#128640; Publisher</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0">Deploys content to websites and platforms. Without it, content sits in drafts forever.</p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444;font-size:.85rem">&#128200; Monitor</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0">Watches systems for errors. The first to know when something breaks. Essential for reliability.</p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(168,85,247,.04);border:1px solid rgba(168,85,247,.1)">
        <strong style="color:#a855f7;font-size:.85rem">&#128721; Guardian</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0">Enforces rules, checks compliance, validates actions. The safety net for the whole system.</p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(56,189,248,.04);border:1px solid rgba(56,189,248,.1)">
        <strong style="color:#38bdf8;font-size:.85rem">&#128276; Notifier</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0">Sends alerts via email, Slack, or SMS. Keeps humans in the loop when agents act.</p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(250,204,21,.04);border:1px solid rgba(250,204,21,.1)">
        <strong style="color:#facc15;font-size:.85rem">&#9200; Scheduler</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0">Manages timing, cron jobs, and queues. Ensures tasks run at the right time in the right order.</p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(244,114,182,.04);border:1px solid rgba(244,114,182,.1)">
        <strong style="color:#f472b6;font-size:.85rem">&#128202; Analyst</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0">Analyzes metrics and generates insights. Turns raw data into actionable intelligence.</p>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Team Recipes</h2>
    <p>Three proven team compositions for common use cases:</p>

    <div style="display:flex;flex-direction:column;gap:.75rem;margin:1rem 0;font-size:.85rem;color:#a1a1aa;line-height:1.7">
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399">Content Pipeline:</strong> Writer &rarr; Editor &rarr; Publisher + Notifier<br>
        <span style="color:#71717a">Writer creates, Editor quality-gates, Publisher deploys, Notifier confirms. Pipeline orchestration (Lesson 5).</span>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <strong style="color:#fb923c">Self-Healing Infra:</strong> Monitor + Guardian + Notifier + Scheduler<br>
        <span style="color:#71717a">Monitor detects problems. Guardian validates fix actions. Scheduler handles timing. Notifier alerts humans. Supervisor orchestration.</span>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <strong style="color:#8b5cf6">Data Pipeline:</strong> Analyst + Monitor + Notifier + Scheduler<br>
        <span style="color:#71717a">Scheduler triggers on cron. Analyst processes data. Monitor watches health. Notifier reports results. Pipeline + supervisor hybrid.</span>
      </div>
    </div>
  </div>

  <div data-learn="QuizMC" data-props='{"title":"Team Composition Quiz","questions":[{"q":"You are building a content pipeline. Which three agents are essential?","options":["Writer, Scheduler, Monitor","Writer, Editor, Publisher","Analyst, Notifier, Guardian","Scheduler, Monitor, Guardian"],"correct":1,"explanation":"A content pipeline needs: Writer (creates content), Editor (quality control), Publisher (deploys it). Without any one of these, the pipeline has a gap."},{"q":"You are building a self-healing server monitor. Which agent enforces safety rules before allowing restarts?","options":["Notifier","Monitor","Scheduler","Guardian"],"correct":3,"explanation":"The Guardian agent checks compliance rules before allowing potentially dangerous actions like server restarts."},{"q":"Your analytics pipeline runs on a schedule but nobody knows when it breaks. Which missing agent fixes this?","options":["Writer","Editor","Monitor","Publisher"],"correct":2,"explanation":"A Monitor agent watches the pipeline health. Without it, failures go undetected until someone notices the missing report."},{"q":"Why is a team of 3 specialized agents better than 1 agent with 30 tools?","options":["It uses less memory","Specialized agents focus better, fail independently, and check each other\u0027s work","More agents always means better results","It is easier to debug"],"correct":1,"explanation":"Focus (fewer tools = better decisions), separation of concerns (independent failure), and checks and balances (agents reviewing each other) all improve with specialization."},{"q":"An agent team has a Writer and Publisher but no Editor. What is the risk?","options":["No risk \u2014 the Writer checks its own work","Content with errors reaches production unchecked","The Publisher will refuse to deploy","The team will deadlock"],"correct":1,"explanation":"Without an Editor, there is no quality gate. The Writer checking its own work is unreliable \u2014 a separate reviewer catches errors the creator misses."}]}'></div>

  <div data-learn="FlashDeck" data-props='{"title":"Agent Roles","cards":[{"front":"Content Writer agent","back":"Generates blog posts, emails, and social copy. Essential for any content pipeline. Keep its tools focused on writing \u2014 not publishing."},{"front":"Editor agent","back":"Reviews, fact-checks, and improves content. The quality gate. An agent checking its own work is unreliable \u2014 always use a separate editor."},{"front":"Publisher agent","back":"Deploys content to websites and platforms. Without it, content sits in drafts forever. Connects to CMS, social APIs, email services."},{"front":"Monitor agent","back":"Watches systems for errors and anomalies. First to know when something breaks. Essential for any production system."},{"front":"Guardian agent","back":"Enforces rules, checks compliance, validates actions. Safety net for the whole system. Guardrails with teeth."},{"front":"Why teams over solo agents?","back":"Focus (fewer tools = better decisions), separation of concerns (independent failure), checks and balances (agents reviewing each other). Three specialists beat one generalist."}]}'></div>

</div>
