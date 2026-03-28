---
title: "Security and Best Practices"
course: "mcp-masterclass"
order: 9
type: "lesson"
free: false
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>

</nav>

<div class="lesson-container">
  <div class="lesson-badge">Module 3 &middot; Lesson 9</div>
  <h1>Security &amp; Best Practices</h1>
  <p class="subtitle">MCP gives AI real-world power. With great power comes great responsibility. Master these 10 security practices before deploying to production.</p>

  <div class="checklist-progress">
    <div class="progress-bar-wrap"><div class="progress-fill" id="progressFill"></div></div>
    <div class="progress-text" id="progressText">0 / 10</div>
  </div>

  <div id="checklist"></div>

  <div data-learn="FlashDeck" data-props='{"title":"MCP Security Practices","cards":[{"front":"Principle of Least Privilege","back":"Connect with minimal permissions. A read-only DB user prevents destructive queries even if a prompt injection gets through."},{"front":"Input Validation","back":"Sanitize and validate all tool inputs before execution. Directory whitelists prevent path traversal attacks to sensitive files."},{"front":"Rate Limiting","back":"Cap the number of tool calls per minute to prevent an AI loop from calling a tool thousands of times and overwhelming your systems."},{"front":"Error Sanitization","back":"Strip internal details like stack traces, file paths, and passwords from error messages before returning them to the AI."},{"front":"Human-in-the-Loop","back":"Require explicit human approval before destructive actions like deleting data, sending emails, or modifying production resources."}]}'></div>

  <div data-learn="QuizMC" data-props='{"title":"Security Quiz","questions":[{"q":"Which security practice specifically prevents a prompt injection from executing DROP TABLE on your database?","options":["Rate limiting","Audit logging","Principle of least privilege","Transport security"],"correct":2,"explanation":"Principle of least privilege means connecting with minimal permissions — e.g. a read-only DB user. Even if a prompt injection gets through, destructive queries are impossible because the server does not have permission to execute them."},{"q":"What should your MCP server return when a tool call fails internally?","options":["The full stack trace so Claude can debug it","A sanitized error message with no internal details","An empty response with HTTP 500","The raw exception object"],"correct":1,"explanation":"Error handling and information leakage prevention: always catch errors and strip internal details (passwords, paths, IPs, stack traces) before returning to the AI. Only safe, user-friendly error messages should leave your server."}]}'></div>

  <div data-learn="MatchConnect" data-props='{"title":"Match Attack to Defense","instruction":"Tap one on the left, then its match on the right","pairs":[{"left":"Prompt injection runs DROP TABLE","right":"Principle of least privilege (read-only DB user)"},{"left":"AI loops calls 10,000 times","right":"Rate limiting with per-minute caps"},{"left":"Path traversal to /etc/passwd","right":"Input validation and directory whitelist"},{"left":"Stack trace leaks DB password","right":"Error sanitization before returning to AI"}]}'></div>

  <div data-learn="SortStack" data-props='{"title":"Security Priority Order","instruction":"Arrange from most foundational to most specialized","items":["Authentication and Authorization","Principle of Least Privilege","Input Validation and Sanitization","Audit Logging","Human-in-the-Loop for Destructive Actions"]}'></div>

</div>
