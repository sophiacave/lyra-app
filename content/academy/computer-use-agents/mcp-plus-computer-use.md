---
title: "MCP + Computer Use"
course: "computer-use-agents"
order: 8
type: "lesson"
free: false
---

<div class="wrap">

<nav class="local-nav">
  <a href="/academy/computer-use-agents/">Computer Use & Browser Agents</a>
  <span class="lesson-badge">Lesson 8 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>MCP + Computer Use</h1>
  <p><span class="accent">Programmatic tools meet visual agents. The best automation uses both.</span></p>
  <p>MCP (Model Context Protocol) gives AI structured, programmatic access to tools and data. Computer use gives AI visual access to any screen. Combining them creates hybrid workflows that are faster than vision-only and more flexible than API-only.</p>
</div>

<div class="learn-card">
  <h3>What you'll learn</h3>
  <ul>
    <li>How MCP servers provide structured tool access alongside computer use</li>
    <li>The decision framework: when to use MCP tools vs. computer use</li>
    <li>Building hybrid workflows that combine both approaches</li>
    <li>Architecture patterns for MCP + computer use agents</li>
  </ul>
</div>

<div class="lesson-section">
  <span class="section-label">Concept</span>
  <h2 class="section-title">Two Superpowers, One Agent</h2>
  <p class="section-text">Think of MCP and computer use as two different hands your agent can use. MCP is the precise hand -- it reaches directly into databases, APIs, and file systems with structured access. Computer use is the flexible hand -- it interacts with any visual interface, regardless of whether an API exists.</p>
  <p class="section-text">An agent with only MCP is limited to software that exposes structured APIs. An agent with only computer use is slow and expensive for tasks that could be done programmatically. An agent with both can choose the right approach for each step of a workflow.</p>
  <p class="section-text">This is not theoretical. Real production agents use MCP to read databases, send emails, and manage files -- then switch to computer use to navigate a government portal, fill an insurance form, or interact with legacy software that has no API.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Architecture</span>
  <h2 class="section-title">The Hybrid Agent Architecture</h2>
  <div class="prompt-box"><code>                    ┌─────────────────┐
                    │   Claude Agent   │
                    │   (orchestrator) │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
     ┌────────▼─────┐  ┌────▼────┐  ┌──────▼───────┐
     │  MCP Servers  │  │ Computer│  │    Brain     │
     │ (structured)  │  │   Use   │  │  (memory)    │
     │               │  │(visual) │  │              │
     │ - Database    │  │ - Click │  │ - State      │
     │ - Email       │  │ - Type  │  │ - History    │
     │ - Files       │  │ - Scroll│  │ - Directives │
     │ - Calendar    │  │ - See   │  │ - Context    │
     └──────────────┘  └─────────┘  └──────────────┘

  Fast, precise,          Slow, flexible,    Persistent
  API-dependent           universal          across sessions</code></div>
  <p class="section-text">The agent orchestrates all three. It reads the brain for context and directives. It uses MCP tools when structured access is available. It falls back to computer use when it needs to interact with a visual interface. The choice is made per-action, not per-workflow.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Strategy</span>
  <h2 class="section-title">The Decision Framework</h2>
  <p class="section-text">For each step in a workflow, the agent decides which approach to use:</p>
  <p class="section-text"><strong style="color: var(--green);">Use MCP when:</strong> An MCP server exists for the target system. The action is data-oriented (read, write, query, send). Speed matters. The API is stable and well-documented. Examples: reading email via Gmail MCP, querying a database via Supabase MCP, creating a calendar event via Google Calendar MCP.</p>
  <p class="section-text"><strong style="color: var(--blue);">Use computer use when:</strong> No API or MCP server exists. The task requires visual interaction (navigating a dashboard, filling a web form). The interface is non-standard or frequently changes. The agent needs to verify visual output. Examples: filing a government form, navigating a legacy internal tool, verifying a website looks correct.</p>
  <p class="section-text"><strong style="color: var(--purple);">Use both when:</strong> Part of the workflow has API access and part does not. MCP provides context that computer use needs. Computer use verifies what MCP reported. Example: use Gmail MCP to read an email with a link, then use computer use to navigate to that link and fill the form it leads to.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Implementation</span>
  <h2 class="section-title">Hybrid Workflow Example</h2>
  <p class="section-text">Here is a real hybrid workflow: processing a customer refund that requires both API access and a visual portal.</p>
  <p class="section-text"><strong style="color: var(--blue);">Step 1 (MCP - Email):</strong> Read the customer's refund request from email using Gmail MCP. Extract the order number, customer name, and refund amount. No screenshots needed -- this is structured data.</p>
  <p class="section-text"><strong style="color: var(--purple);">Step 2 (MCP - Database):</strong> Query the orders database using Supabase MCP to verify the order exists, check the purchase amount, and confirm the refund is valid. Again, pure data -- no visual interaction needed.</p>
  <p class="section-text"><strong style="color: var(--green);">Step 3 (Computer Use - Payment Portal):</strong> Navigate to the payment processor's admin portal (which has no API for refunds). Log in, find the transaction, click Refund, enter the amount, confirm. This requires visual interaction -- screenshots, clicks, form filling.</p>
  <p class="section-text"><strong style="color: var(--orange);">Step 4 (MCP - Email):</strong> Send a confirmation email to the customer using the email MCP. Include the refund reference number captured via computer use in Step 3. Back to structured data.</p>
  <p class="section-text">This workflow uses MCP for 3 of 4 steps (fast, reliable) and computer use for the one step that requires visual interaction (the payment portal). That is the hybrid advantage.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Advanced</span>
  <h2 class="section-title">Passing Data Between MCP and Computer Use</h2>
  <p class="section-text">The trickiest part of hybrid workflows is passing data between the two modalities. Data extracted via MCP needs to be typed into visual forms. Data seen in screenshots needs to be stored in structured systems.</p>
  <p class="section-text"><strong style="color: var(--blue);">MCP to Computer Use:</strong> Read data via MCP (email body, database record, calendar event), extract the relevant fields, then type them into a visual form using computer use. The agent carries the data in its context window -- it read the email, now it types the order number into the portal.</p>
  <p class="section-text"><strong style="color: var(--purple);">Computer Use to MCP:</strong> Read data from a screenshot (a confirmation number, a status, a table of results), extract it as text, then write it to a database or include it in an email via MCP. The agent sees the confirmation number on screen and writes it to the brain for future reference.</p>
  <p class="section-text"><strong style="color: var(--green);">Using the brain as a bridge:</strong> For multi-step workflows, write intermediate results to the brain (persistent memory). Step 1 reads email and writes the order number to memory. Step 3 reads the order number from memory and types it into the portal. The brain ensures data survives across steps, sessions, and even agent restarts.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Anti-Patterns</span>
  <h2 class="section-title">Hybrid Workflow Mistakes</h2>
  <p class="section-text"><strong style="color: var(--red);">Using computer use when MCP exists.</strong> Navigating Gmail in a browser to read email when the Gmail MCP can fetch it in milliseconds. Always check: is there an MCP server or API for this task? Use it first.</p>
  <p class="section-text"><strong style="color: var(--red);">Not carrying context between modalities.</strong> Reading a confirmation number via computer use but not storing it anywhere. When the next step needs that number, the agent has to go back and re-read the screen. Write extracted data to the brain immediately.</p>
  <p class="section-text"><strong style="color: var(--red);">Building separate pipelines.</strong> Creating one pipeline for MCP tasks and a separate pipeline for computer use tasks, then trying to connect them. Build one unified agent that can use either modality per-action. The orchestrator decides, not the pipeline.</p>
</div>

<div class="try-it-box">
  <h3>Try It Yourself</h3>
  <p>Design a hybrid workflow for a task you do regularly:</p>
  <div class="prompt-box"><code>1. Choose a multi-step task from your work
2. For each step, decide: MCP or Computer Use?
   - Is there an API or MCP server? -> MCP
   - Is it a visual interface with no API? -> Computer Use
3. Identify data that flows between MCP and CU steps
4. Plan where to store intermediate results (brain/memory)
5. Build it: MCP steps first (fast, testable), then CU steps

Example task: "Process new job applications"
- Step 1 (MCP/Email): Read application email
- Step 2 (CU): Navigate to HR portal, enter candidate info
- Step 3 (MCP/Database): Log the application in tracking DB
- Step 4 (MCP/Email): Send acknowledgment to candidate</code></div>
</div>

<div class="lesson-section">
  <span class="section-label">Review</span>
  <h2 class="section-title">Key concepts.</h2>
  <div data-learn="FlashDeck" data-props='{"title":"MCP + Computer Use","cards":[{"front":"MCP vs. Computer Use","back":"MCP: fast, precise, structured API access. Limited to systems with MCP servers. Computer Use: slow, flexible, visual access. Works on any screen. Best agents use both, choosing per-action."},{"front":"The Decision Framework","back":"MCP when: API/MCP server exists, data-oriented task, speed matters. Computer Use when: no API, visual interaction needed, interface changes frequently. Both when: workflow spans API and non-API systems."},{"front":"Hybrid Workflow Pattern","back":"Use MCP for data steps (read email, query database, send messages). Use Computer Use for visual steps (navigate portals, fill forms, verify screens). One agent, two modalities, chosen per-action."},{"front":"Brain as Data Bridge","back":"Write intermediate results to persistent memory between steps. MCP reads email -> writes order number to brain. Computer Use reads brain -> types order number into portal. Data survives across steps and sessions."},{"front":"Anti-Pattern: CU When MCP Exists","back":"Never navigate Gmail in a browser when Gmail MCP can fetch email in milliseconds. Always check for structured access first. Computer use is the fallback, not the default."},{"front":"Unified Orchestrator","back":"One agent that decides per-action whether to use MCP or Computer Use. Not separate pipelines. The orchestrator carries context and chooses the fastest reliable approach for each step."}]}'></div>
</div>

<div class="lesson-section">
  <span class="section-label">Check Your Understanding</span>
  <h2 class="section-title">MCP + computer use quiz.</h2>
  <div data-learn="QuizMC" data-props='{"title":"MCP + Computer Use","questions":[{"q":"When should an agent use MCP instead of computer use for a task?","options":["When the task involves clicking buttons","When an MCP server or structured API exists for the target system -- it is faster, more precise, and cheaper than visual automation","When the interface uses a dark theme","When the task requires more than 5 steps"],"correct":1,"explanation":"MCP provides millisecond-speed structured access. If a Gmail MCP can read email, there is no reason to navigate Gmail visually. Computer use is for systems without structured access -- it is the flexible fallback, not the first choice."},{"q":"How should data flow between MCP and computer use steps in a hybrid workflow?","options":["Data cannot flow between the two modalities","Write intermediate results to persistent memory (brain). MCP steps write extracted data, computer use steps read it. The brain bridges the two modalities across steps and sessions.","Copy and paste manually between steps","Use a separate database for each modality"],"correct":1,"explanation":"The brain (persistent memory) is the bridge. Step 1 reads an email via MCP and writes the order number to the brain. Step 3 reads the order number from the brain and types it into a visual portal via computer use. Data flows seamlessly through shared memory."},{"q":"What is the main anti-pattern in hybrid MCP + computer use architecture?","options":["Using too many MCP servers","Using computer use for tasks where an MCP server or API already exists -- navigating Gmail visually when Gmail MCP can fetch email in milliseconds","Using the brain for intermediate storage","Combining MCP and computer use in the same workflow"],"correct":1,"explanation":"The core anti-pattern is reaching for the slow, expensive tool when the fast, precise tool is available. Always check for MCP/API access first. Computer use is the universal fallback for systems that have no programmatic interface."}]}'></div>
</div>

<nav class="lesson-nav">
  <a href="/academy/computer-use-agents/browser-agent-architecture/" class="prev">&larr; Previous: Browser Agent Architecture</a>
  <a href="/academy/computer-use-agents/testing-visual-agents/" class="next">Next: Testing Visual Agents &rarr;</a>
</nav>

</div>
