---
title: "Real-World Servers"
course: "mcp-masterclass"
order: 8
type: "lesson"
free: false
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>

</nav>

<div class="lesson-container">
  <div class="lesson-badge">Module 3 &middot; Lesson 8</div>
  <h1>Real-World Servers</h1>
  <p class="subtitle">Explore six production MCP server patterns that developers use every day — from database queries to browser automation.</p>

  <div class="section">
    <h2>Server Gallery</h2>
    <p>Click each server to see its architecture, exposed tools, and real-world use cases:</p>

    <div class="gallery">
      <div class="gallery-card" style="--c:#38bdf8" onclick="showServer(0)" id="gc0">
        <div class="icon">&#x1F4BE;</div>
        <h3>Database</h3>
        <p>Query any DB from Claude</p>
      </div>
      <div class="gallery-card" style="--c:#8b5cf6" onclick="showServer(1)" id="gc1">
        <div class="icon">&#x1F4BB;</div>
        <h3>GitHub</h3>
        <p>Manage repos, PRs, issues</p>
      </div>
      <div class="gallery-card" style="--c:#fb923c" onclick="showServer(2)" id="gc2">
        <div class="icon">&#x1F4AC;</div>
        <h3>Slack</h3>
        <p>Read and send messages</p>
      </div>
      <div class="gallery-card" style="--c:#f472b6" onclick="showServer(3)" id="gc3">
        <div class="icon">&#x1F310;</div>
        <h3>Browser</h3>
        <p>Navigate and interact with web</p>
      </div>
      <div class="gallery-card" style="--c:#a78bfa" onclick="showServer(4)" id="gc4">
        <div class="icon">&#x1F9E0;</div>
        <h3>Memory</h3>
        <p>Persistent knowledge recall</p>
      </div>
      <div class="gallery-card" style="--c:#34d399" onclick="showServer(5)" id="gc5">
        <div class="icon">&#x2699;&#xFE0F;</div>
        <h3>Custom API</h3>
        <p>Wrap any API as MCP</p>
      </div>
    </div>
  </div>

  <div data-learn="QuizMC" data-props='{"title":"Real-World Servers Quiz","questions":[{"q":"The GitHub MCP server uses which authentication mechanism for secure access?","options":["Username and password stored in config","Fine-grained personal access tokens","SSH keys embedded in the server binary","No authentication — GitHub API is public"],"correct":1,"explanation":"The GitHub MCP server uses fine-grained personal access tokens (PATs). These allow scoped permissions so Claude only has access to the repositories and actions you explicitly grant."},{"q":"Which MCP server pattern is most appropriate for connecting Claude to your company\u0027s internal REST API?","options":["Database Server","Memory Server","Custom API Server","Browser Server"],"correct":2,"explanation":"The Custom API Server pattern is designed exactly for this: wrap any REST or GraphQL API as MCP tools, controlling auth, rate limits, and data filtering. Your internal tools become AI-accessible through a standard interface."}]}'></div>


  <div data-learn="FlashDeck" data-props='{"title":"Production Server Patterns","cards":[{"front":"Database Server — key capability","back":"Maintains a persistent connection pool. Claude can query, insert, update, and analyze data through natural language without reconnecting on each call."},{"front":"GitHub Server — authentication","back":"Uses fine-grained personal access tokens (PATs) with scoped permissions. You control exactly which repos and actions Claude can access."},{"front":"Slack Server — authentication","back":"Uses Slack Bot tokens with scoped permissions. The bot must be invited to channels it needs to read or post in."},{"front":"Browser Server — underlying technology","back":"Puppeteer or Playwright running a headless Chromium browser. Gives Claude full web automation: navigate, click, type, screenshot, extract content."},{"front":"Custom API Server — primary advantage","back":"Wrap ANY REST or GraphQL API as MCP. You control auth, rate limiting, and data filtering. Internal tools, CRMs, monitoring systems all become Claude-accessible."}]}'></div>

</div>
