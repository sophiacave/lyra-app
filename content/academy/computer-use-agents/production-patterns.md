---
title: "Production Patterns"
course: "computer-use-agents"
order: 10
type: "lesson"
free: false
---

<div class="wrap">

<nav class="local-nav">
  <a href="/academy/computer-use-agents/">Computer Use & Browser Agents</a>
  <span class="lesson-badge">Lesson 10 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Production Patterns</h1>
  <p><span class="accent">From prototype to production: headless browsers, cloud execution, cost management, and security.</span></p>
  <p>A vision agent that works on your laptop is a demo. A vision agent that runs reliably in production, handles thousands of tasks, stays within budget, and operates within security boundaries -- that is a product. This lesson teaches the patterns that make it real.</p>
</div>

<div class="learn-card">
  <h3>What you'll learn</h3>
  <ul>
    <li>Headless browser execution: running agents without a visible display</li>
    <li>Cloud deployment: spinning up visual agents on demand</li>
    <li>Cost management: reducing API spend per task by 80%+</li>
    <li>Security boundaries: containing visual agents safely</li>
  </ul>
</div>

<div class="lesson-section">
  <span class="section-label">Architecture</span>
  <h2 class="section-title">Headless Browser Execution</h2>
  <p class="section-text">In production, you do not want a visible browser window. Headless browsers run without a display, executing everything in memory. The screenshots are still captured -- they are just never shown on a physical screen.</p>
  <p class="section-text"><strong style="color: var(--blue);">Xvfb (X Virtual Frame Buffer).</strong> Creates a virtual display in memory. Applications think they have a screen, but the pixels are only in RAM. This is the standard approach for Linux servers. Run your browser against Xvfb and capture screenshots from the virtual display.</p>
  <p class="section-text"><strong style="color: var(--purple);">Playwright headless mode.</strong> Playwright can run Chromium in headless mode -- no virtual display needed. Screenshots are captured directly from the browser's rendering engine. Simpler setup, but some websites detect headless browsers and block them.</p>
  <p class="section-text"><strong style="color: var(--green);">Docker containers.</strong> Package your agent, browser, and virtual display into a Docker container. Each task gets a fresh container with a clean browser profile. Containers are isolated, reproducible, and disposable -- perfect for production agents.</p>
  <div class="prompt-box"><code># Dockerfile for a production vision agent
FROM node:20-slim

# Install Chrome and virtual display
RUN apt-get update && apt-get install -y \
  chromium xvfb fonts-liberation \
  && rm -rf /var/lib/apt/lists/*

# Set up virtual display
ENV DISPLAY=:99
RUN Xvfb :99 -screen 0 1920x1080x24 &

# Install agent dependencies
COPY package.json ./
RUN npm install
COPY . .

# Run the agent
CMD ["node", "agent.js"]</code></div>
</div>

<div class="lesson-section">
  <span class="section-label">Strategy</span>
  <h2 class="section-title">Cloud Deployment Patterns</h2>
  <p class="section-text">Running visual agents in the cloud enables scale and reliability. Here are the production patterns:</p>
  <p class="section-text"><strong style="color: var(--blue);">On-demand containers.</strong> Spin up a container for each task, run the workflow, save the results, destroy the container. No persistent state on the machine. Clean environment every time. Services like AWS Fargate, Google Cloud Run, or Azure Container Instances support this pattern.</p>
  <p class="section-text"><strong style="color: var(--purple);">Queue-based execution.</strong> Tasks go into a queue (SQS, Cloud Tasks, Redis queue). Worker containers pull tasks, execute them, report results. If a worker crashes, the task goes back in the queue for another worker. This pattern handles load spikes and failures gracefully.</p>
  <p class="section-text"><strong style="color: var(--green);">Scheduled execution.</strong> For recurring tasks (daily reports, weekly form submissions), use cron jobs or cloud schedulers. Trigger the container at the scheduled time, run the workflow, store results. No always-running infrastructure -- you pay only for execution time.</p>
  <p class="section-text"><strong style="color: var(--orange);">Result storage.</strong> Save screenshots, GIF recordings, and JSON logs to cloud storage (S3, GCS, R2). Tag with the task ID, timestamp, and outcome. This creates a searchable archive for debugging and compliance.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Implementation</span>
  <h2 class="section-title">Cost Management</h2>
  <p class="section-text">Computer use costs compound fast in production. Each screenshot sent to Claude consumes image tokens. A 10-step workflow might cost $0.10-0.50. Run 1,000 workflows per day and you are spending $100-500 daily on API calls alone. Here is how to cut that by 80%+:</p>
  <p class="section-text"><strong style="color: var(--blue);">Minimize screenshots.</strong> Do not screenshot after every tiny action. Group related actions: type the email, Tab to password, type the password, THEN screenshot to verify both fields. One screenshot instead of three.</p>
  <p class="section-text"><strong style="color: var(--purple);">Reduce resolution.</strong> For pages where you only need to read large text and find big buttons, 1280x720 or even 960x540 is sufficient. Lower resolution = fewer image tokens = lower cost. Use 1920x1080 only when you need to read small text or dense UI.</p>
  <p class="section-text"><strong style="color: var(--green);">Use DOM when possible.</strong> The hybrid approach from Lesson 7 is also a cost strategy. Every step done via DOM instead of vision saves a screenshot round-trip. If the login page always has the same selectors, use DOM for login and save vision for the unpredictable parts.</p>
  <p class="section-text"><strong style="color: var(--orange);">Cache page analysis.</strong> If the same page is visited repeatedly (a login page, a dashboard), cache the element locations from the first analysis. Subsequent visits skip the "analyze screenshot" step and go directly to action using cached coordinates. Invalidate the cache if the page changes.</p>
  <p class="section-text"><strong style="color: var(--accent);">Use smaller models for simple tasks.</strong> Not every screenshot needs the most powerful model. Simple tasks (is this a login page? where is the Submit button?) can use cheaper, faster models. Reserve the expensive model for complex decisions.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Security</span>
  <h2 class="section-title">Security Boundaries</h2>
  <p class="section-text">A visual agent with browser access can potentially reach any website, fill any form, and interact with any service. Security boundaries prevent accidents and contain damage:</p>
  <p class="section-text"><strong style="color: var(--red);">URL allowlisting.</strong> The agent can only navigate to pre-approved domains. If it tries to navigate elsewhere, the action is blocked. This prevents the agent from being tricked into visiting malicious sites or interacting with unintended services.</p>
  <p class="section-text"><strong style="color: var(--orange);">Credential isolation.</strong> Store credentials in a secure vault (environment variables, secret manager), not in the agent's prompt or code. The agent receives credentials only when needed and only for the current task. Credentials are never written to logs or screenshots.</p>
  <p class="section-text"><strong style="color: var(--blue);">Action logging.</strong> Log every action the agent takes -- every URL visited, every field filled, every button clicked. These logs are your security audit trail. Review them regularly for unexpected behavior.</p>
  <p class="section-text"><strong style="color: var(--green);">Network isolation.</strong> Run the agent container in a network that can only reach the allowed domains. Block all other outbound traffic. Even if the agent tries to navigate somewhere unexpected, the network firewall prevents it.</p>
  <p class="section-text"><strong style="color: var(--purple);">Session management.</strong> Each task gets a fresh browser profile. No cookies, no saved passwords, no history carry over from previous tasks. This prevents credential leakage between tasks and ensures each run starts clean.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Advanced</span>
  <h2 class="section-title">Scaling Patterns</h2>
  <p class="section-text"><strong style="color: var(--blue);">Horizontal scaling.</strong> Run multiple agent containers in parallel. Each handles one task at a time. Add more containers for more throughput. 10 containers = 10 simultaneous workflows. Cloud auto-scaling adjusts container count based on queue depth.</p>
  <p class="section-text"><strong style="color: var(--purple);">Priority queues.</strong> Not all tasks are equal. Urgent tasks (customer-facing, time-sensitive) go to a high-priority queue. Routine tasks (data entry, report generation) go to a low-priority queue. High-priority workers process urgent tasks first.</p>
  <p class="section-text"><strong style="color: var(--green);">Circuit breakers.</strong> If a target website goes down, stop sending tasks to it. A circuit breaker detects repeated failures and pauses the queue for that domain. Resume when the site comes back up. This prevents wasting API tokens on tasks that will fail.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Anti-Patterns</span>
  <h2 class="section-title">Production Mistakes</h2>
  <p class="section-text"><strong style="color: var(--red);">No cost ceiling.</strong> Running agents without a daily spending limit. One runaway loop or spike in tasks can burn through your entire API budget overnight. Set hard daily limits in your API configuration and monitoring.</p>
  <p class="section-text"><strong style="color: var(--red);">Shared browser profiles.</strong> Reusing the same browser profile across tasks. Cookies from Task A leak into Task B. Saved passwords cross boundaries. One task's logged-in session persists into another. Always use fresh profiles.</p>
  <p class="section-text"><strong style="color: var(--red);">No monitoring.</strong> Running agents in production without visibility into success rates, failure modes, and costs per task. Build a dashboard that shows: tasks processed, success rate, average cost, common failure reasons, and current queue depth.</p>
</div>

<div class="try-it-box">
  <h3>Try It Yourself</h3>
  <p>Deploy your first production vision agent:</p>
  <div class="prompt-box"><code>1. Containerize your agent (Docker)
   - Include Chrome, virtual display, and agent code
   - Test locally: docker build && docker run
2. Add cost controls
   - Set max screenshots per task (e.g., 30)
   - Set max daily spend ($10 to start)
   - Use lower resolution where possible
3. Add security boundaries
   - Allowlist only the domains you need
   - Use fresh browser profiles per task
   - Store credentials in environment variables
4. Deploy to cloud
   - Push container to a registry (Docker Hub, GCR, ECR)
   - Set up a task queue and worker
   - Monitor: success rate, cost per task, failure reasons
5. Run 10 tasks. Review GIF recordings. Calculate cost per task.</code></div>
</div>

<div class="lesson-section">
  <span class="section-label">Review</span>
  <h2 class="section-title">Key concepts.</h2>
  <div data-learn="FlashDeck" data-props='{"title":"Production Patterns","cards":[{"front":"Headless Browser Execution","back":"Browsers run without a visible display using Xvfb (virtual framebuffer) or Playwright headless mode. Screenshots are captured from memory. Docker containers package the agent, browser, and virtual display together."},{"front":"Cost Reduction Strategies","back":"Minimize screenshots (batch actions), reduce resolution (960-1280 for simple pages), use DOM when possible, cache page analysis, use cheaper models for simple tasks. Can reduce costs by 80%+."},{"front":"URL Allowlisting","back":"The agent can only navigate to pre-approved domains. Prevents the agent from being tricked into visiting malicious sites or interacting with unintended services. Block all non-approved navigation."},{"front":"Queue-Based Execution","back":"Tasks go into a queue. Worker containers pull tasks, execute, report results. If a worker crashes, the task goes back to the queue. Handles load spikes and failures gracefully."},{"front":"Fresh Browser Profiles","back":"Each task gets a clean browser -- no cookies, passwords, or history from previous tasks. Prevents credential leakage between tasks. Essential for security and isolation."},{"front":"Circuit Breaker Pattern","back":"If a target website goes down, pause tasks for that domain. Detect repeated failures and stop sending tasks. Resume when the site recovers. Prevents wasting API tokens on guaranteed failures."}]}'></div>
</div>

<div class="lesson-section">
  <span class="section-label">Check Your Understanding</span>
  <h2 class="section-title">Production patterns quiz.</h2>
  <div data-learn="QuizMC" data-props='{"title":"Production Patterns","questions":[{"q":"What is the primary cost reduction strategy for production vision agents?","options":["Use the most expensive model for every screenshot","Minimize the number of screenshots by batching related actions (type email, Tab, type password, THEN screenshot) and use DOM interaction for known pages instead of vision","Run agents only during off-peak hours","Use larger screenshots for more detail"],"correct":1,"explanation":"Every screenshot costs tokens. Batching related actions into fewer screenshots and using DOM interaction (which costs zero image tokens) for known page structures can reduce costs by 80% or more. Reserve vision for pages without known selectors."},{"q":"Why should each task get a fresh browser profile in production?","options":["Fresh profiles load pages faster","To prevent cookies, saved passwords, and session state from one task leaking into another -- essential for security and isolation between tasks","Fresh profiles use less memory","Browser profiles expire after one use anyway"],"correct":1,"explanation":"Shared browser profiles create security risks. Task A logs into Service X, and Task B inherits those cookies and has unauthorized access. Fresh profiles ensure each task starts clean with no carry-over state."},{"q":"What is a circuit breaker pattern and why is it important for production agents?","options":["It physically disconnects the server to prevent damage","It detects repeated failures against a target site and pauses tasks for that domain, preventing wasted API tokens on tasks guaranteed to fail until the site recovers","It limits the number of browser tabs the agent can open","It automatically fixes broken CSS selectors"],"correct":1,"explanation":"If a target website goes down and you keep sending tasks, every task fails and burns API tokens on screenshots of error pages. A circuit breaker detects the pattern (3 failures in a row), pauses tasks for that domain, and resumes when the site is back."}]}'></div>
</div>

<div class="lesson-section">
  <span class="section-label">Conclusion</span>
  <h2 class="section-title">Course Complete</h2>
  <p class="section-text">You have traveled from understanding what vision agents are to deploying them in production. Here is what you now know:</p>
  <p class="section-text"><strong style="color: var(--blue);">The foundation:</strong> Computer use bridges the gap between AI and the 80% of software that has no API. Screenshots, clicks, types, and scrolls -- the four primitives that make any screen automatable.</p>
  <p class="section-text"><strong style="color: var(--purple);">The skills:</strong> Screenshot analysis, reliable interaction patterns, multi-step workflows, error recovery, and hybrid browser architecture combining DOM and vision for maximum speed and flexibility.</p>
  <p class="section-text"><strong style="color: var(--green);">The production readiness:</strong> MCP integration, testing and audit trails, headless deployment, cost management, and security boundaries. Everything you need to run vision agents at scale.</p>
  <p class="section-text">The visual interface was the last frontier AI could not reach. Now it can. Any software with a screen is automatable. What you build with that power is up to you.</p>
</div>

<nav class="lesson-nav">
  <a href="/academy/computer-use-agents/testing-visual-agents/" class="prev">&larr; Previous: Testing Visual Agents</a>
  <a href="/academy/computer-use-agents/" class="next">Back to Course &rarr;</a>
</nav>

</div>
