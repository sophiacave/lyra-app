---
title: "Computer Use API"
course: "computer-use-agents"
order: 2
type: "lesson"
free: false
---

<div class="wrap">

<nav class="local-nav">
  <a href="/academy/computer-use-agents/">Computer Use & Browser Agents</a>
  <span class="lesson-badge">Lesson 2 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Computer Use API</h1>
  <p><span class="accent">Your AI just got a mouse, a keyboard, and a pair of eyes.</span></p>
  <p>Claude's computer use tool lets AI take screenshots, click at specific coordinates, type text, and scroll -- all through a structured API. This lesson gets you from zero to your first working computer-use session.</p>
</div>

<div class="learn-card">
  <h3>What you'll learn</h3>
  <ul>
    <li>How Claude's computer use tool works under the hood</li>
    <li>The coordinate system: how the AI maps pixels to actions</li>
    <li>Setting up your first computer-use session with the Anthropic API</li>
    <li>The screenshot-action loop in practice</li>
  </ul>
</div>

<div class="lesson-section">
  <span class="section-label">Foundation</span>
  <h2 class="section-title">The Computer Use Tool</h2>
  <p class="section-text">Claude's computer use is a special tool -- like web search or code execution, but for interacting with a graphical interface. When you enable it, Claude gains four capabilities:</p>
  <p class="section-text"><strong style="color: var(--orange);">Screenshot.</strong> Capture the current state of the screen as an image. This is the AI's vision -- it sees exactly what is displayed, pixel by pixel.</p>
  <p class="section-text"><strong style="color: var(--purple);">Click.</strong> Move the cursor to specific x,y coordinates and click (left, right, double, or middle click). This is how the AI presses buttons, selects options, and interacts with elements.</p>
  <p class="section-text"><strong style="color: var(--green);">Type.</strong> Send keystrokes to the active element. This is how the AI fills in forms, enters search queries, and writes text into any input field.</p>
  <p class="section-text"><strong style="color: var(--blue);">Scroll.</strong> Scroll up or down on the page. This is how the AI reaches content below the fold, navigates long pages, and reveals hidden elements.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Architecture</span>
  <h2 class="section-title">The Coordinate System</h2>
  <p class="section-text">When the AI sees a screenshot, it needs to know where things are so it can click accurately. The coordinate system is straightforward:</p>
  <p class="section-text"><strong style="color: var(--blue);">Origin (0,0)</strong> is the top-left corner of the screen. X increases going right. Y increases going down. If your screen is 1920x1080 pixels, the bottom-right corner is (1920, 1080).</p>
  <p class="section-text"><strong style="color: var(--purple);">Screen resolution matters.</strong> A button might be at (500, 300) on a 1920x1080 display but at (250, 150) on a 960x540 display. Always know your resolution and communicate it to the AI so coordinates are accurate.</p>
  <p class="section-text"><strong style="color: var(--green);">Center of the element.</strong> When clicking a button, aim for the center, not the edge. A 200x50 pixel button at position (400, 300) should be clicked at approximately (500, 325) -- the center point. This gives the most reliable hits.</p>
</div>

<div class="demo-container">
  <h3>Your First Computer Use Session</h3>
  <p>Here is the minimal code to start a computer-use session with Claude. Every line is commented so you understand exactly what is happening:</p>
</div>

<div class="lesson-section">
  <span class="section-label">Code</span>
  <h2 class="section-title">Setting Up the API Call</h2>
  <p class="section-text">The computer use tool is passed as part of the tools array in your API request. Here is the structure:</p>
  <div class="prompt-box"><code>// Import the Anthropic SDK
import Anthropic from '@anthropic-ai/sdk';

// Create the client with your API key
const client = new Anthropic();

// Send a message with computer use enabled
const response = await client.messages.create({
  model: 'claude-sonnet-4-20250514',           // Model with vision capabilities
  max_tokens: 4096,                    // Room for the AI to think and act
  tools: [{
    type: 'computer_20250124',         // The computer use tool type
    name: 'computer',                  // Tool name
    display_width_px: 1920,            // Your screen width in pixels
    display_height_px: 1080,           // Your screen height in pixels
    display_number: 0                  // Which display (0 = primary)
  }],
  messages: [{
    role: 'user',
    content: 'Take a screenshot and tell me what you see.'
  }]
});</code></div>
  <p class="section-text">When Claude responds, it will request a tool use action -- either taking a screenshot first, or if you provide one, immediately suggesting a click/type/scroll action. You then execute that action on the actual screen and send back the result.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Implementation</span>
  <h2 class="section-title">The Execution Loop</h2>
  <p class="section-text">Computer use is a conversation, not a single call. The pattern looks like this:</p>
  <p class="section-text"><strong style="color: var(--orange);">Step 1:</strong> You send a task to Claude with the computer use tool enabled. Claude responds with a tool_use block requesting a screenshot.</p>
  <p class="section-text"><strong style="color: var(--purple);">Step 2:</strong> You capture a screenshot of the actual screen, encode it as base64, and send it back as a tool_result.</p>
  <p class="section-text"><strong style="color: var(--green);">Step 3:</strong> Claude analyzes the screenshot and responds with the next action -- click at (x, y), type "hello", or scroll down. You execute that action on the real screen.</p>
  <p class="section-text"><strong style="color: var(--blue);">Step 4:</strong> You take another screenshot showing the result of the action and send it back. Claude decides the next step. The loop continues until the task is complete.</p>
  <div class="prompt-box"><code>// The execution loop (simplified pseudocode)
while (task_not_complete) {
  // 1. Get Claude's next action
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    tools: [computerTool],
    messages: conversationHistory
  });

  // 2. Extract the tool use from the response
  const toolUse = response.content.find(b => b.type === 'tool_use');

  if (toolUse.input.action === 'screenshot') {
    // 3a. Capture screenshot, encode as base64
    const screenshot = await captureScreen();
    conversationHistory.push({
      role: 'tool',
      content: [{ type: 'image', source: { data: screenshot } }]
    });
  } else if (toolUse.input.action === 'click') {
    // 3b. Click at the specified coordinates
    await clickAt(toolUse.input.coordinate[0], toolUse.input.coordinate[1]);
    // Take a screenshot to show the result
    const screenshot = await captureScreen();
    conversationHistory.push({
      role: 'tool',
      content: [{ type: 'image', source: { data: screenshot } }]
    });
  } else if (toolUse.input.action === 'type') {
    // 3c. Type the specified text
    await typeText(toolUse.input.text);
    const screenshot = await captureScreen();
    conversationHistory.push({
      role: 'tool',
      content: [{ type: 'image', source: { data: screenshot } }]
    });
  }
}</code></div>
</div>

<div class="lesson-section">
  <span class="section-label">Practice</span>
  <h2 class="section-title">Understanding the computer use flow.</h2>
</div>

<div class="lesson-section">
  <span class="section-label">Environment</span>
  <h2 class="section-title">Running Computer Use Safely</h2>
  <p class="section-text">Computer use gives AI control of your mouse and keyboard. Safety is not optional. Here are the rules:</p>
  <p class="section-text"><strong style="color: var(--red);">Use a sandboxed environment.</strong> Never run computer use on your primary desktop. Use a virtual machine (VM), a Docker container with a virtual display, or a cloud instance. If the AI clicks something wrong, it affects the sandbox, not your real machine.</p>
  <p class="section-text"><strong style="color: var(--orange);">Start with observation only.</strong> Before letting the agent click or type, have it take screenshots and describe what it sees. Verify that its understanding matches reality. Then enable actions one at a time.</p>
  <p class="section-text"><strong style="color: var(--green);">Set action limits.</strong> Cap the number of actions per session -- start with 20. An agent in a confused loop can click thousands of times. Action limits prevent runaway behavior.</p>
  <p class="section-text"><strong style="color: var(--blue);">Log everything.</strong> Record every screenshot and every action. This creates an audit trail for debugging and a training dataset for improvement. You will learn how to build GIF-based audit trails in Lesson 9.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Anti-Patterns</span>
  <h2 class="section-title">Common Setup Mistakes</h2>
  <p class="section-text"><strong style="color: var(--red);">Wrong resolution.</strong> Telling the API your screen is 1920x1080 when it is actually 2560x1440. Every click will miss its target by a wide margin. Always measure and report the actual resolution of your virtual display.</p>
  <p class="section-text"><strong style="color: var(--red);">No screenshot after action.</strong> Clicking a button but not sending a screenshot of the result. The AI has no idea what happened. Always capture and send a screenshot after every action so the AI can verify the result and plan the next step.</p>
  <p class="section-text"><strong style="color: var(--red);">Running on the main desktop.</strong> Giving the AI control of your actual computer. One wrong click could open your email, send a message, or delete files. Always use a sandbox. This is non-negotiable.</p>
</div>

<div class="try-it-box">
  <h3>Try It Yourself</h3>
  <p>Set up your first computer use environment:</p>
  <div class="prompt-box"><code>Option 1 (Docker): Use Anthropic's reference container
  docker run -p 5900:5900 ghcr.io/anthropics/anthropic-quickstarts:computer-use

Option 2 (Local VM): Use VirtualBox or UTM with a Linux desktop
  Set the display to 1920x1080 for consistent coordinates

Option 3 (Cloud): Spin up a GCP/AWS instance with a desktop environment
  Use VNC or noVNC for remote access to the virtual display

Once running, send your first screenshot-only request to Claude.
Verify: does the AI correctly describe what is on screen?</code></div>
</div>

<div class="lesson-section">
  <span class="section-label">Review</span>
  <h2 class="section-title">Key concepts.</h2>
  <div data-learn="FlashDeck" data-props='{"title":"Computer Use API","cards":[{"front":"The Four Computer Use Actions","back":"Screenshot (capture the screen), Click (move cursor and click at x,y coordinates), Type (send keystrokes to active element), Scroll (scroll up or down on the page)."},{"front":"The Coordinate System","back":"Origin (0,0) is the top-left corner. X increases rightward, Y increases downward. Always report actual screen resolution to the API for accurate targeting."},{"front":"The Execution Loop","back":"Send task -> Claude requests screenshot -> You capture and send it -> Claude suggests action -> You execute and send new screenshot -> Repeat until task complete."},{"front":"Sandbox Rule","back":"NEVER run computer use on your primary desktop. Always use a VM, Docker container, or cloud instance. One wrong click on your real machine can cause real damage."},{"front":"Screenshot After Every Action","back":"Always capture and send a screenshot after every click, type, or scroll action. Without it, the AI has no way to verify what happened and cannot plan the next step."},{"front":"Action Limits","back":"Cap the number of actions per session (start with 20). Prevents runaway behavior if the agent enters a confused loop. Increase gradually as you build confidence."}]}'></div>
</div>

<div class="lesson-section">
  <span class="section-label">Check Your Understanding</span>
  <h2 class="section-title">Computer use API quiz.</h2>
  <div data-learn="QuizMC" data-props='{"title":"Computer Use API","questions":[{"q":"What are the four actions available through Claude computer use?","options":["Read, Write, Delete, Update","Screenshot, Click, Type, Scroll","Open, Close, Minimize, Maximize","Select, Copy, Paste, Undo"],"correct":1,"explanation":"The computer use tool provides exactly four action types: Screenshot (capture the screen), Click (at specific coordinates), Type (send keystrokes), and Scroll (up or down). These four actions can replicate any human interaction with a screen."},{"q":"Why must you always send a screenshot after executing an action?","options":["Screenshots reduce API costs","The AI needs to verify the result of its action and plan the next step -- without seeing the outcome, it is operating blind","Screenshots are required by the API protocol","Screenshots help with debugging only"],"correct":1,"explanation":"Computer use is a visual feedback loop. The AI acts, then needs to SEE what happened. Did the button click work? Did the page load? Did an error appear? Without a post-action screenshot, the AI cannot verify or adapt."},{"q":"Why should you never run computer use on your primary desktop?","options":["It runs slower on primary desktops","The API does not support primary desktops","One wrong click from the AI could open your email, send messages, or delete files -- a sandbox isolates the damage","Primary desktops have resolution issues"],"correct":2,"explanation":"Computer use gives AI control of the mouse and keyboard. A confused agent can click anything visible on screen. In a sandbox (VM, Docker, cloud instance), the blast radius is contained. On your real desktop, the consequences are real."}]}'></div>
</div>

<nav class="lesson-nav">
  <a href="/academy/computer-use-agents/the-vision-agent/" class="prev">&larr; Previous: The Vision Agent</a>
  <a href="/academy/computer-use-agents/screenshot-analysis/" class="next">Next: Screenshot Analysis &rarr;</a>
</nav>

</div>
