---
title: "Error Recovery & Resilience"
course: "computer-use-agents"
order: 6
type: "lesson"
free: false
---

<div class="wrap">

<nav class="local-nav">
  <a href="/academy/computer-use-agents/">Computer Use & Browser Agents</a>
  <span class="lesson-badge">Lesson 6 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Error Recovery & Resilience</h1>
  <p><span class="accent">Screens change. Pages break. Popups ambush. Your agent needs to survive all of it.</span></p>
  <p>The difference between a demo and a production agent is how it handles failure. This lesson teaches retry strategies, fallback actions, visual assertions, and the patterns that keep agents running when everything goes sideways.</p>
</div>

<div class="learn-card">
  <h3>What you'll learn</h3>
  <ul>
    <li>Common failure modes in visual automation and how to detect them</li>
    <li>Retry strategies: exponential backoff, alternative paths, graceful degradation</li>
    <li>Visual assertions: verifying screen state before and after actions</li>
    <li>Building agents that recover from errors without human intervention</li>
  </ul>
</div>

<div class="lesson-section">
  <span class="section-label">Problem</span>
  <h2 class="section-title">Why Visual Agents Break</h2>
  <p class="section-text">A text-based API either works or returns an error code. Visual automation is messier. The screen is a living, changing environment. Here are the ways it breaks:</p>
  <p class="section-text"><strong style="color: var(--red);">Unexpected popups.</strong> Cookie consent banners, newsletter signup modals, chat widgets, browser notifications, system updates. Any of these can appear between your screenshot and your click, intercepting the action.</p>
  <p class="section-text"><strong style="color: var(--red);">Layout shifts.</strong> Content loading asynchronously pushes elements around. The button was at (500, 300) in the screenshot but by the time the agent clicks, an ad loaded above it and pushed it to (500, 450). The click hits empty space.</p>
  <p class="section-text"><strong style="color: var(--red);">Session expiration.</strong> The agent is mid-workflow when the website session expires. The next click redirects to a login page instead of the expected page. The entire workflow context is lost.</p>
  <p class="section-text"><strong style="color: var(--red);">CAPTCHA challenges.</strong> Anti-bot systems detect automated behavior and present CAPTCHAs. The vision agent can see the CAPTCHA but cannot reliably solve it. This is a hard blocker that requires a different strategy.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Architecture</span>
  <h2 class="section-title">The Error Recovery Framework</h2>
  <p class="section-text">Every resilient agent follows this framework when something goes wrong:</p>
  <p class="section-text"><strong style="color: var(--blue);">1. Detect.</strong> The agent takes a screenshot after every action and compares the result to what was expected. If the result does not match -- the page did not change, an error message appeared, an unexpected page loaded -- the agent knows something went wrong.</p>
  <p class="section-text"><strong style="color: var(--purple);">2. Diagnose.</strong> What kind of error is it? A popup blocking the view (dismiss it). A session timeout (re-login). A page that did not load (wait and retry). A CAPTCHA (escalate to human). The diagnosis determines the recovery strategy.</p>
  <p class="section-text"><strong style="color: var(--green);">3. Recover.</strong> Execute the appropriate recovery action. Dismiss the popup, re-authenticate, wait for the page, or escalate. Then verify recovery was successful before resuming the original workflow.</p>
  <p class="section-text"><strong style="color: var(--orange);">4. Resume.</strong> Return to the workflow at the point of failure. If the recovery changed the page state (like re-logging in), the agent may need to navigate back to where it was. Track workflow progress so resumption is possible.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Implementation</span>
  <h2 class="section-title">Retry Strategies</h2>
  <p class="section-text">Not all retries are equal. The right strategy depends on the type of failure:</p>
  <p class="section-text"><strong style="color: var(--blue);">Simple retry.</strong> The action failed for a transient reason (network hiccup, slow page load). Wait 1 second and try the exact same action again. Works for: temporary loading delays, flaky network connections.</p>
  <p class="section-text"><strong style="color: var(--purple);">Exponential backoff.</strong> If the first retry fails, wait 2 seconds. Then 4. Then 8. Cap at 30 seconds. This prevents hammering a slow or overloaded server. Works for: server errors, rate limiting, slow infrastructure.</p>
  <p class="section-text"><strong style="color: var(--green);">Alternative path.</strong> The primary approach failed, so try a different route to the same goal. Cannot click the menu item? Try the keyboard shortcut. Cannot find the Settings link? Navigate directly via URL. Works for: UI changes, hidden elements, broken navigation.</p>
  <p class="section-text"><strong style="color: var(--orange);">Graceful degradation.</strong> The full task cannot be completed, but a partial result is still valuable. Cannot fill all 10 fields because one has an unexpected dropdown? Fill the other 9 and flag the problematic field for human attention. Works for: partially broken pages, unsupported UI elements.</p>
  <div class="prompt-box"><code>// Retry with exponential backoff
async function retryWithBackoff(action, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const result = await action();
    if (result.success) return result;

    // Wait with exponential backoff: 1s, 2s, 4s
    const waitTime = Math.pow(2, attempt) * 1000;
    console.log(`Attempt ${attempt + 1} failed. Waiting ${waitTime}ms...`);
    await wait(waitTime);
  }
  // All retries exhausted -- escalate or degrade gracefully
  return { success: false, error: 'Max retries exceeded' };
}</code></div>
</div>

<div class="lesson-section">
  <span class="section-label">Advanced</span>
  <h2 class="section-title">Visual Assertions</h2>
  <p class="section-text">Visual assertions are the test suite for your vision agent. They verify that the screen looks the way it should before and after actions:</p>
  <p class="section-text"><strong style="color: var(--blue);">Pre-condition assertion.</strong> Before acting: "Is the login form visible? Does the page title say Account Settings? Is the Submit button enabled?" If the pre-condition fails, do not act -- diagnose why the expected state is not present.</p>
  <p class="section-text"><strong style="color: var(--purple);">Post-condition assertion.</strong> After acting: "Did a success message appear? Did the page navigate to the expected URL? Does the updated field show the new value?" If the post-condition fails, the action did not work as expected.</p>
  <p class="section-text"><strong style="color: var(--green);">Negative assertion.</strong> Verify that something bad did NOT happen: "Is there an error message visible? Has the page redirected to a 404? Is there a CAPTCHA challenge?" Negative assertions catch problems that post-condition checks might miss.</p>
  <div class="prompt-box"><code>// Visual assertion prompt pattern
"Look at this screenshot and answer these questions:
1. Is the page title 'Account Settings'? (pre-condition)
2. Is there an error message visible anywhere? (negative assertion)
3. Is the email field showing 'newemail@example.com'? (post-condition)

Answer each with YES or NO and a brief explanation."</code></div>
</div>

<div class="lesson-section">
  <span class="section-label">Strategy</span>
  <h2 class="section-title">Handling Common Blockers</h2>
  <p class="section-text"><strong style="color: var(--orange);">Cookie consent banners.</strong> These appear on almost every website. Build a standard handler: look for common button text ("Accept", "Accept All", "I Agree", "Got It"), click it, verify the banner disappeared. Run this handler after every initial page load.</p>
  <p class="section-text"><strong style="color: var(--purple);">Session timeouts.</strong> Store the login URL and credentials in the workflow context. When a redirect to the login page is detected, re-authenticate and navigate back to the workflow's last known good state. Bookmark the workflow position before every major action.</p>
  <p class="section-text"><strong style="color: var(--green);">CAPTCHAs.</strong> These are designed to block automation. Options: use authenticated sessions that skip CAPTCHAs, use API endpoints where available, or escalate to human for solving. Do not try to solve CAPTCHAs with AI -- it is unreliable and often violates terms of service.</p>
  <p class="section-text"><strong style="color: var(--blue);">Rate limiting.</strong> If the site starts returning 429 errors or slow responses, implement backoff. Reduce the action frequency. For recurring tasks, spread them across a longer time window instead of bursting.</p>
</div>

<div class="try-it-box">
  <h3>Try It Yourself</h3>
  <p>Build an error-resilient workflow:</p>
  <div class="prompt-box"><code>1. Take any workflow from Lesson 5
2. Deliberately introduce failures:
   - Open a popup while the agent is working
   - Make the page load slowly (throttle network in DevTools)
   - Navigate away mid-workflow (simulate session loss)
3. Observe how the agent fails
4. Add recovery handlers for each failure mode:
   - Popup dismissal
   - Wait-and-retry for slow loads
   - Re-login and resume for session loss
5. Re-run the workflow with failures. Does it recover?</code></div>
</div>

<div class="lesson-section">
  <span class="section-label">Review</span>
  <h2 class="section-title">Key concepts.</h2>
  <div data-learn="FlashDeck" data-props='{"title":"Error Recovery & Resilience","cards":[{"front":"The Error Recovery Framework","back":"Detect (screenshot does not match expected), Diagnose (what kind of error?), Recover (dismiss popup, re-login, retry, escalate), Resume (return to workflow at the point of failure)."},{"front":"Exponential Backoff","back":"Retry with increasing wait times: 1s, 2s, 4s, 8s, capped at 30s. Prevents hammering overloaded servers. Appropriate for transient failures like slow page loads and rate limiting."},{"front":"Alternative Path Strategy","back":"When the primary approach fails, try a different route to the same goal. Cannot click the menu? Try the keyboard shortcut. Cannot find the link? Navigate via URL directly."},{"front":"Visual Assertions","back":"Pre-condition (is the expected page visible?), Post-condition (did the expected change occur?), Negative (did an error or unexpected state NOT appear?). The test suite for visual agents."},{"front":"Cookie Banner Handler","back":"Standard pattern: look for Accept/Accept All/I Agree/Got It buttons, click the first one found, verify the banner disappeared. Run after every initial page load."},{"front":"CAPTCHA Strategy","back":"Do not try to solve CAPTCHAs with AI. Use authenticated sessions that skip them, use API endpoints where available, or escalate to human. Attempting to solve them is unreliable and often violates ToS."}]}'></div>
</div>

<div class="lesson-section">
  <span class="section-label">Check Your Understanding</span>
  <h2 class="section-title">Error recovery quiz.</h2>
  <div data-learn="QuizMC" data-props='{"title":"Error Recovery & Resilience","questions":[{"q":"What are the four steps of the error recovery framework?","options":["Retry, Restart, Report, Resume","Detect (screenshot mismatch), Diagnose (classify the error), Recover (take corrective action), Resume (return to workflow)","Log, Alert, Retry, Abort","Screenshot, Analyze, Fix, Continue"],"correct":1,"explanation":"The framework is systematic: first detect that something went wrong (the screen does not match expectations), then diagnose what kind of error it is, then execute the appropriate recovery action, then resume the original workflow from the point of failure."},{"q":"When should you use an alternative path strategy instead of a simple retry?","options":["Always -- retries are wasteful","When the primary approach fails for a structural reason (element moved, navigation broken) rather than a transient reason (slow load, network hiccup)","Only when the page returns a 404 error","Never -- simple retries always work eventually"],"correct":1,"explanation":"Simple retries work for transient issues -- the page was slow, the network hiccupped. But if the button is genuinely missing or the menu structure changed, retrying the same approach will fail every time. An alternative path (keyboard shortcut, direct URL, different navigation) routes around the structural problem."},{"q":"How should a vision agent handle CAPTCHAs?","options":["Use OCR to read and solve the CAPTCHA automatically","Use authenticated sessions that skip CAPTCHAs, use API endpoints where available, or escalate to a human -- do not try to solve them with AI","Refresh the page until the CAPTCHA disappears","Click randomly until the CAPTCHA is solved"],"correct":1,"explanation":"CAPTCHAs are designed to block automation. AI solving is unreliable and often violates terms of service. The smart strategies are: avoid CAPTCHAs entirely (authenticated sessions, API access) or escalate to a human when one appears."}]}'></div>
</div>

<nav class="lesson-nav">
  <a href="/academy/computer-use-agents/multi-step-workflows/" class="prev">&larr; Previous: Multi-Step Workflows</a>
  <a href="/academy/computer-use-agents/browser-agent-architecture/" class="next">Next: Browser Agent Architecture &rarr;</a>
</nav>

</div>
