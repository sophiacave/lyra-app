---
title: "Multi-Step Workflows"
course: "computer-use-agents"
order: 5
type: "lesson"
free: false
---

<div class="wrap">

<nav class="local-nav">
  <a href="/academy/computer-use-agents/">Computer Use & Browser Agents</a>
  <span class="lesson-badge">Lesson 5 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Multi-Step Workflows</h1>
  <p><span class="accent">One click is a trick. Twenty clicks in sequence across three pages? That is automation.</span></p>
  <p>Real-world tasks are not single actions. They are chains: log in, navigate to settings, update a field, save, confirm, export. This lesson teaches you to build visual workflows that chain reliably across multiple pages and states.</p>
</div>

<div class="learn-card">
  <h3>What you'll learn</h3>
  <ul>
    <li>How to decompose complex tasks into visual action chains</li>
    <li>State management across multiple pages and transitions</li>
    <li>Handling page loads, redirects, and dynamic content between steps</li>
    <li>Building reusable workflow templates for common patterns</li>
  </ul>
</div>

<div class="lesson-section">
  <span class="section-label">Concept</span>
  <h2 class="section-title">Task Decomposition</h2>
  <p class="section-text">Every multi-step workflow starts as a human description: "Book a flight from SFO to JFK for next Friday." But a vision agent cannot execute that as one action. It needs to break it down into atomic steps:</p>
  <p class="section-text">1. Navigate to the airline website. 2. Find the search form. 3. Enter departure city. 4. Enter destination city. 5. Select the date. 6. Click search. 7. Wait for results. 8. Compare options. 9. Select a flight. 10. Fill passenger details. 11. Enter payment. 12. Confirm booking.</p>
  <p class="section-text">Each of these is a screenshot-analyze-act cycle. The key insight is that the agent does not need to plan all 12 steps upfront. It needs to know the goal and execute one step at a time, using the current screenshot to decide the next action. This is how humans do it too -- you do not memorize every click before starting.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Architecture</span>
  <h2 class="section-title">The Workflow State Machine</h2>
  <p class="section-text">A multi-step workflow is a state machine. Each state represents what the agent sees on screen, and transitions are the actions that move between states:</p>
  <div class="prompt-box"><code>Login Page ──[enter credentials, click login]──> Dashboard
Dashboard ──[click Settings]──> Settings Page
Settings Page ──[update email, click Save]──> Confirmation Modal
Confirmation Modal ──[click Confirm]──> Settings Page (updated)

Each transition:
1. Verify current state (screenshot matches expected page)
2. Execute action (click, type, scroll)
3. Wait for transition (page load, animation)
4. Verify new state (screenshot matches expected result)</code></div>
  <p class="section-text"><strong style="color: var(--green);">State verification</strong> is the critical step most automation skips. Before acting, check that you are on the expected page. After acting, verify you arrived at the expected result. This catches navigation errors, unexpected popups, and session timeouts before they cascade.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Implementation</span>
  <h2 class="section-title">Handling Page Transitions</h2>
  <p class="section-text">The gap between clicking a link and the new page loading is where most workflow failures occur. The agent clicks, takes a screenshot immediately, and sees a blank page or loading spinner. Then it gets confused.</p>
  <p class="section-text"><strong style="color: var(--blue);">Wait for stability.</strong> After clicking a navigation link, wait 1-3 seconds before taking the next screenshot. This gives the page time to load. For slow sites, increase to 5 seconds.</p>
  <p class="section-text"><strong style="color: var(--purple);">Check for loading indicators.</strong> Take a screenshot and ask Claude: "Is this page fully loaded or still loading?" Look for spinners, progress bars, skeleton screens, or "Loading..." text. If the page is still loading, wait and retry.</p>
  <p class="section-text"><strong style="color: var(--green);">Verify arrival.</strong> After the page loads, confirm you are on the expected page. Look for page titles, headings, or unique elements that identify the page. "I expected to see the Settings page. The screenshot shows a heading that says Account Settings. Confirmed."</p>
  <p class="section-text"><strong style="color: var(--orange);">Handle redirects.</strong> Some clicks trigger redirects through multiple URLs before landing on the final page. The agent should not act during redirects -- it should wait for the final destination. Take screenshots every 2 seconds until the page stabilizes.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Practice</span>
  <h2 class="section-title">A Complete Workflow Example</h2>
  <p class="section-text">Here is a real multi-step workflow: updating your profile email on a web application. Watch how each step includes verification:</p>
  <p class="section-text"><strong style="color: var(--blue);">Step 1: Login.</strong> Navigate to the login page. Verify: do I see a login form? Enter email and password. Click login. Wait 2 seconds. Verify: am I on the dashboard? If I see a "Wrong password" error, stop and report.</p>
  <p class="section-text"><strong style="color: var(--purple);">Step 2: Navigate to settings.</strong> Find and click the Settings link (usually in a sidebar or user menu). Wait for page load. Verify: do I see account settings options?</p>
  <p class="section-text"><strong style="color: var(--green);">Step 3: Update email.</strong> Find the email field. Click it. Select all existing text (Ctrl+A). Type the new email. Verify: does the field show the new email?</p>
  <p class="section-text"><strong style="color: var(--orange);">Step 4: Save and confirm.</strong> Click the Save button. Wait for response. If a confirmation modal appears, click Confirm. Verify: does the page show a success message? Does the email field display the updated value?</p>
  <p class="section-text">Four steps, each with pre-conditions, actions, and post-conditions. This is the pattern for every multi-step workflow.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Advanced</span>
  <h2 class="section-title">Workflow Templates</h2>
  <p class="section-text">Many workflows follow common patterns. Build templates for these and reuse them:</p>
  <p class="section-text"><strong style="color: var(--blue);">Login template:</strong> Navigate to URL -> find username/email field -> type credentials -> find password field -> type password -> click login/submit -> verify dashboard/home page loads.</p>
  <p class="section-text"><strong style="color: var(--purple);">Search template:</strong> Find search input -> type query -> press Enter or click search button -> wait for results -> verify results page loaded -> extract/interact with results.</p>
  <p class="section-text"><strong style="color: var(--green);">Form submission template:</strong> Navigate to form page -> fill each field in order (top to bottom, using Tab) -> handle dropdowns and date pickers -> scroll to submit button -> click submit -> verify success confirmation.</p>
  <p class="section-text"><strong style="color: var(--orange);">Data extraction template:</strong> Navigate to data page -> identify table or list -> extract visible data -> if pagination exists, click Next -> extract next page -> repeat until all pages processed.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Anti-Patterns</span>
  <h2 class="section-title">Multi-Step Failure Modes</h2>
  <p class="section-text"><strong style="color: var(--red);">Skipping verification between steps.</strong> The agent fills a form, clicks submit, and immediately starts the next task without checking if the submission succeeded. Result: the entire downstream workflow is built on a failed step. Always verify before moving on.</p>
  <p class="section-text"><strong style="color: var(--red);">No timeout handling.</strong> The agent waits for a page to load, but the page is down or extremely slow. Without a timeout, the agent waits forever. Set maximum wait times (30 seconds is reasonable) and fail gracefully if the page does not load.</p>
  <p class="section-text"><strong style="color: var(--red);">Assuming page structure.</strong> The agent assumes the Save button is always at the bottom of the page. But on this particular page, it is in a sticky header. Always locate elements visually from the current screenshot instead of assuming positions.</p>
</div>

<div class="try-it-box">
  <h3>Try It Yourself</h3>
  <p>Build a multi-step workflow for a real task:</p>
  <div class="prompt-box"><code>Choose one of these tasks:
1. Log into a test account and update the profile name
2. Search for a product on an e-commerce site and add it to cart
3. Navigate a multi-page form (like a job application)

For your chosen task:
- Write out every step as a state machine
- Define the verification check for each step
- Identify where page transitions occur
- Run the workflow and note where it fails
- Fix the failures with wait times and better verification</code></div>
</div>

<div class="lesson-section">
  <span class="section-label">Review</span>
  <h2 class="section-title">Key concepts.</h2>
  <div data-learn="FlashDeck" data-props='{"title":"Multi-Step Workflows","cards":[{"front":"Task Decomposition","back":"Break complex tasks into atomic screenshot-analyze-act cycles. The agent does not need to plan every step upfront -- it uses the current screenshot to decide the next action, one step at a time."},{"front":"State Machine Pattern","back":"Each workflow state = what the agent sees on screen. Transitions = actions that change the state. Every transition includes: verify current state, execute action, wait for transition, verify new state."},{"front":"Page Transition Handling","back":"After clicking a navigation link: wait 1-3 seconds, check for loading indicators, verify arrival at expected page. Do not take action screenshots immediately after navigation clicks."},{"front":"Workflow Templates","back":"Common reusable patterns: Login (credentials -> verify dashboard), Search (query -> verify results), Form submission (fill fields -> submit -> verify success), Data extraction (read -> paginate -> repeat)."},{"front":"The Verification Rule","back":"Never proceed to the next step without verifying the current step succeeded. A form submission that failed silently will cascade errors through every downstream step."}]}'></div>
</div>

<div class="lesson-section">
  <span class="section-label">Check Your Understanding</span>
  <h2 class="section-title">Multi-step workflows quiz.</h2>
  <div data-learn="QuizMC" data-props='{"title":"Multi-Step Workflows","questions":[{"q":"Why is state verification between steps critical in multi-step workflows?","options":["It makes the workflow run faster","Without verification, a failed step cascades errors through every downstream step -- the agent builds on a broken foundation without knowing it","State verification is only needed for the final step","It reduces API token costs"],"correct":1,"explanation":"If Step 3 fails silently and the agent proceeds to Step 4, every subsequent action is based on a false assumption. Verification catches failures at the point they occur, not 10 steps later when the damage is impossible to trace."},{"q":"How should a vision agent handle page transitions?","options":["Take a screenshot immediately after clicking and act on whatever appears","Wait 1-3 seconds for the page to load, check for loading indicators, verify arrival at the expected page before taking any action","Skip to the next step and assume the page loaded correctly","Refresh the page if the first screenshot looks wrong"],"correct":1,"explanation":"The gap between clicking and page load is where most failures occur. Waiting for stability, checking for spinners, and verifying the expected page title or heading prevents the agent from acting on a half-loaded or still-loading page."},{"q":"What is the advantage of using workflow templates?","options":["Templates eliminate the need for screenshots","Templates are required by the computer use API","Templates provide reusable patterns (login, search, form fill, data extraction) so you do not rebuild common interaction sequences from scratch for every task","Templates make workflows run in parallel"],"correct":2,"explanation":"Login flows, search interactions, form submissions, and data extraction follow predictable patterns across most websites. Building reusable templates for these saves development time and improves reliability through battle-tested interaction sequences."}]}'></div>
</div>

<nav class="lesson-nav">
  <a href="/academy/computer-use-agents/click-type-navigate/" class="prev">&larr; Previous: Click, Type & Navigate</a>
  <a href="/academy/computer-use-agents/error-recovery-resilience/" class="next">Next: Error Recovery & Resilience &rarr;</a>
</nav>

</div>
