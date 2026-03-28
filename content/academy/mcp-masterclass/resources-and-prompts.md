---
title: "Resources and Prompts"
course: "mcp-masterclass"
order: 6
type: "lesson"
free: false
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>

</nav>

<div class="lesson-container">
  <div class="lesson-badge">Module 2 &middot; Lesson 6</div>
  <h1>Resources &amp; Prompts</h1>
  <p class="subtitle">MCP has three primitives: Tools, Resources, and Prompts. Each serves a different purpose in connecting AI to the world.</p>

  <div class="section">
    <h2>The Three MCP Primitives</h2>
    <p>Click each primitive to explore how it works, see examples, and understand the data flow:</p>

    <div class="primitives">
      <div class="primitive-card tools-card active" onclick="showPrimitive('tools')">
        <div class="icon">&#x2699;&#xFE0F;</div>
        <h3>Tools</h3>
        <p>Actions the AI can take</p>
      </div>
      <div class="primitive-card resources-card" onclick="showPrimitive('resources')">
        <div class="icon">&#x1F4C4;</div>
        <h3>Resources</h3>
        <p>Data the AI can read</p>
      </div>
      <div class="primitive-card prompts-card" onclick="showPrimitive('prompts')">
        <div class="icon">&#x1F4DD;</div>
        <h3>Prompts</h3>
        <p>Templates the AI can use</p>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Side-by-Side Comparison</h2>
    <table class="comparison-table">
      <thead>
        <tr><th>Aspect</th><th style="color:#8b5cf6">Tools</th><th style="color:#34d399">Resources</th><th style="color:#fb923c">Prompts</th></tr>
      </thead>
      <tbody>
        <tr><td><strong>Direction</strong></td><td>AI &rarr; World</td><td>World &rarr; AI</td><td>User &rarr; AI</td></tr>
        <tr><td><strong>Triggered by</strong></td><td>AI model decides</td><td>Client/user requests</td><td>User selects</td></tr>
        <tr><td><strong>Purpose</strong></td><td>Execute actions</td><td>Provide context</td><td>Structure interactions</td></tr>
        <tr><td><strong>Example</strong></td><td>Write a file</td><td>Read config data</td><td>Code review template</td></tr>
        <tr><td><strong>State change</strong></td><td>Yes (side effects)</td><td>No (read-only)</td><td>No (templates only)</td></tr>
        <tr><td><strong>Discovery</strong></td><td>tools/list</td><td>resources/list</td><td>prompts/list</td></tr>
      </tbody>
    </table>
  </div>

  <div data-learn="FlashDeck" data-props='{"title":"MCP Primitives","cards":[{"front":"Tools","back":"Actions the AI invokes autonomously. Direction: AI to World. They cause side effects — writing files, sending emails, querying databases."},{"front":"Resources","back":"Read-only data the client or user requests. Direction: World to AI. No side effects — just providing context like files or config data."},{"front":"Prompts","back":"Reusable templates the user selects. Direction: User to AI. They structure interactions without changing state."},{"front":"tools/list","back":"The MCP method Claude calls to discover all available tools on a connected server. Returns names, descriptions, and input schemas."},{"front":"resources/read","back":"The MCP method used to fetch a specific resource by URI. Returns the resource content for the AI to use as context."}]}'></div>

  <div data-learn="QuizMC" data-props='{"title":"Primitives Quiz","questions":[{"q":"Which MCP primitive would you use to give Claude read-only access to your project README without executing any code?","options":["A Tool that reads the file","A Resource that exposes the file","A Prompt with the content embedded","A Server with full filesystem access"],"correct":1,"explanation":"Resources are read-only data exposed through MCP. A resource like file://project/README.md gives the AI the content without any action or side effects — the safest choice for read-only data."},{"q":"Which primitive is triggered by the AI model deciding on its own — NOT by the user selecting it?","options":["Resources","Prompts","Tools","Discovery"],"correct":2,"explanation":"Tools are invoked autonomously by the AI model when it decides an action is needed. Resources are requested by the client or user. Prompts are selected by the user."}]}'></div>

  <div data-learn="MatchConnect" data-props='{"title":"Match Primitive to Description","instruction":"Tap one on the left, then its match on the right","pairs":[{"left":"Tools","right":"Actions the AI invokes autonomously — AI to World"},{"left":"Resources","right":"Read-only data the client or user requests — World to AI"},{"left":"Prompts","right":"Reusable templates the user selects — User to AI"},{"left":"tools/list","right":"The MCP method Claude calls to discover available tools"}]}'></div>

  <div data-learn="SortStack" data-props='{"title":"Resource Data Flow — Put in Order","instruction":"Arrange the steps for how a Resource flows to the AI","items":["Client sends resources/list to discover available resources","User or app selects a resource","Client sends resources/read request","Server returns the resource data","Data is added to AI context"]}'></div>

</div>
