---
title: "Browser Agent Architecture"
course: "computer-use-agents"
order: 7
type: "lesson"
free: false
---

<div class="wrap">

<nav class="local-nav">
  <a href="/academy/computer-use-agents/">Computer Use & Browser Agents</a>
  <span class="lesson-badge">Lesson 7 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Browser Agent Architecture</h1>
  <p><span class="accent">The full stack: Chrome DevTools Protocol, page context, and when to use vision vs. DOM.</span></p>
  <p>Computer use gives you eyes. Browser automation gives you hands that reach inside the page. The best agents combine both. This lesson teaches you how to architect a browser agent that uses the right approach for each situation.</p>
</div>

<div class="learn-card">
  <h3>What you'll learn</h3>
  <ul>
    <li>Chrome DevTools Protocol (CDP): programmatic browser control</li>
    <li>DOM-based interaction vs. visual interaction: tradeoffs and use cases</li>
    <li>Hybrid architecture: combining screenshots with page context</li>
    <li>Building a full browser agent from scratch</li>
  </ul>
</div>

<div class="lesson-section">
  <span class="section-label">Foundation</span>
  <h2 class="section-title">Two Ways to See a Web Page</h2>
  <p class="section-text">A web page exists in two forms simultaneously. The <strong>visual form</strong> is what you see on screen -- pixels, colors, layout, text. The <strong>structural form</strong> is the DOM (Document Object Model) -- the HTML tree that describes every element, its properties, and its relationships.</p>
  <p class="section-text">Computer use interacts with the visual form: take a screenshot, identify elements, click at coordinates. This is universal -- it works on any interface, web or desktop. But it is slow (3-10 seconds per action) and approximate (coordinates are estimated).</p>
  <p class="section-text">DOM-based automation interacts with the structural form: select an element by CSS selector, read its text, click it programmatically. This is fast (milliseconds), precise (no coordinate guessing), and reliable (selectors target specific elements). But it only works for web pages, and it requires knowledge of the page structure.</p>
  <p class="section-text">A well-architected browser agent uses both. DOM for speed and precision when the page structure is known. Vision for flexibility and universality when it is not.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Architecture</span>
  <h2 class="section-title">Chrome DevTools Protocol</h2>
  <p class="section-text">Chrome DevTools Protocol (CDP) is the API that Chrome exposes for programmatic control. Tools like Puppeteer, Playwright, and Chrome extensions all use CDP under the hood. Understanding it gives you direct access to the browser's capabilities:</p>
  <p class="section-text"><strong style="color: var(--blue);">Page navigation.</strong> Load URLs, go back/forward, handle redirects. Faster than typing URLs via computer use.</p>
  <p class="section-text"><strong style="color: var(--purple);">DOM access.</strong> Query elements with CSS selectors or XPath. Read text content, attributes, computed styles. Modify the DOM directly if needed.</p>
  <p class="section-text"><strong style="color: var(--green);">JavaScript execution.</strong> Run arbitrary JavaScript in the page context. Fill forms, trigger events, extract data, or manipulate page state.</p>
  <p class="section-text"><strong style="color: var(--orange);">Network interception.</strong> Monitor HTTP requests and responses. Block ads and trackers. Modify request headers. Intercept API calls for data extraction.</p>
  <div class="prompt-box"><code>// Playwright example: DOM-based interaction
import { chromium } from 'playwright';

// Launch a browser
const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();

// Navigate (faster than typing URL via computer use)
await page.goto('https://example.com/login');

// Fill form using CSS selectors (precise, no coordinate guessing)
await page.fill('#email', 'user@example.com');    // Find by ID
await page.fill('#password', 'secure123');         // Find by ID
await page.click('button[type="submit"]');         // Find by attribute

// Wait for navigation (built-in, no manual screenshot checking)
await page.waitForURL('**/dashboard');

// Extract data (direct DOM access, no OCR needed)
const userName = await page.textContent('.user-name');
console.log(`Logged in as: ${userName}`);</code></div>
</div>

<div class="lesson-section">
  <span class="section-label">Strategy</span>
  <h2 class="section-title">When to Use Vision vs. DOM</h2>
  <p class="section-text">The decision tree is straightforward:</p>
  <p class="section-text"><strong style="color: var(--green);">Use DOM when:</strong> You know the page structure. You have CSS selectors that reliably target elements. The page is a standard web application. Speed matters. You need pixel-perfect precision.</p>
  <p class="section-text"><strong style="color: var(--blue);">Use Vision when:</strong> You do not know the page structure in advance. The page uses heavy JavaScript frameworks that make DOM querying unreliable. The interface is not web-based (desktop app, terminal). You need to verify what the user actually sees. The page changes frequently and selectors break.</p>
  <p class="section-text"><strong style="color: var(--purple);">Use both when:</strong> You want speed AND visual verification. Navigate via DOM (fast), then take a screenshot to verify the page looks correct (reliable). Fill forms via DOM, then screenshot to confirm the values display properly. This hybrid approach gives you the best of both worlds.</p>
</div>

<div class="demo-container">
  <h3>The Hybrid Architecture</h3>
  <p>The most powerful browser agents layer three capabilities:</p>
  <p><strong style="color: var(--blue);">Layer 1: DOM (fast lane).</strong> For known pages with stable selectors: navigate, fill forms, click buttons, extract data. Millisecond execution. No screenshots needed.</p>
  <p><strong style="color: var(--purple);">Layer 2: Vision (fallback).</strong> When DOM interactions fail or the page is unknown: take a screenshot, ask Claude what is on screen, get coordinates, act visually. Slower but universal.</p>
  <p><strong style="color: var(--green);">Layer 3: Page context (intelligence).</strong> Read the full HTML, pass it to Claude alongside a screenshot, and let the AI understand both the visual appearance AND the underlying structure. This gives the richest understanding for complex decisions.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Implementation</span>
  <h2 class="section-title">Building the Agent Controller</h2>
  <p class="section-text">A browser agent controller orchestrates DOM and vision capabilities. Here is the architecture:</p>
  <div class="prompt-box"><code>class BrowserAgent {
  constructor(page, claude) {
    this.page = page;       // Playwright page instance
    this.claude = claude;   // Claude API client
  }

  // Fast path: DOM interaction
  async domClick(selector) {
    try {
      await this.page.click(selector, { timeout: 5000 });
      return { success: true, method: 'dom' };
    } catch (e) {
      // Selector not found -- fall back to vision
      return this.visionClick(selector);
    }
  }

  // Slow path: Vision interaction
  async visionClick(description) {
    // 1. Take screenshot
    const screenshot = await this.page.screenshot({ encoding: 'base64' });

    // 2. Ask Claude to find the element
    const response = await this.claude.analyze(screenshot,
      `Find the element matching "${description}".
       Return its center coordinates as [x, y].`
    );

    // 3. Click at the identified coordinates
    await this.page.mouse.click(response.x, response.y);
    return { success: true, method: 'vision' };
  }

  // Hybrid: DOM action + visual verification
  async verifiedAction(selector, action, expectedResult) {
    // Execute via DOM (fast)
    await action(selector);

    // Verify via vision (reliable)
    const screenshot = await this.page.screenshot({ encoding: 'base64' });
    const verified = await this.claude.analyze(screenshot,
      `Verify: ${expectedResult}. Answer YES or NO.`
    );
    return verified;
  }
}</code></div>
</div>

<div class="lesson-section">
  <span class="section-label">Advanced</span>
  <h2 class="section-title">Page Context Extraction</h2>
  <p class="section-text">Sometimes a screenshot is not enough and DOM selectors are not reliable enough. Extracting the page context -- a simplified version of the HTML -- gives Claude the richest understanding:</p>
  <p class="section-text"><strong style="color: var(--blue);">Accessibility tree.</strong> Browsers build an accessibility tree that describes every interactive element with its role, name, and state. This is more useful to the AI than raw HTML because it filters out visual noise and focuses on actionable elements.</p>
  <p class="section-text"><strong style="color: var(--purple);">Simplified HTML.</strong> Strip the page HTML down to just interactive elements: buttons, inputs, links, forms. Remove styling, scripts, and non-interactive elements. This gives Claude a manageable, focused view of what is on the page.</p>
  <p class="section-text"><strong style="color: var(--green);">Combined context.</strong> Send both the screenshot AND the simplified HTML. The screenshot shows what the page looks like. The HTML shows what elements exist and their properties. Claude can cross-reference both for the most accurate understanding.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Anti-Patterns</span>
  <h2 class="section-title">Architecture Mistakes</h2>
  <p class="section-text"><strong style="color: var(--red);">Vision-only for everything.</strong> Using screenshots and coordinate clicking even when simple CSS selectors would work. This is 100x slower and less reliable for known page structures. Use DOM when you can, vision when you must.</p>
  <p class="section-text"><strong style="color: var(--red);">Fragile selectors.</strong> Using selectors like <code>div:nth-child(3) > div:nth-child(2) > button</code> that break when any parent element changes. Prefer stable selectors: IDs, data-testid attributes, ARIA labels, or unique text content.</p>
  <p class="section-text"><strong style="color: var(--red);">No fallback chain.</strong> Using DOM only with no vision fallback. When a selector breaks, the entire workflow fails. Always have a fallback: try DOM first, fall back to vision if DOM fails.</p>
</div>

<div class="try-it-box">
  <h3>Try It Yourself</h3>
  <p>Build a hybrid browser agent:</p>
  <div class="prompt-box"><code>1. Set up Playwright with a headed browser (so you can watch)
2. Navigate to a login page
3. Try DOM-first interaction:
   - page.fill('#email', '...')
   - page.click('button[type="submit"]')
4. Add vision fallback:
   - If DOM fails, screenshot + Claude analysis + coordinate click
5. Add visual verification:
   - After login, screenshot the dashboard
   - Ask Claude: "Is this a dashboard page? Is the user logged in?"
6. Compare: how much faster is DOM vs. vision for the same task?</code></div>
</div>

<div class="lesson-section">
  <span class="section-label">Review</span>
  <h2 class="section-title">Key concepts.</h2>
  <div data-learn="FlashDeck" data-props='{"title":"Browser Agent Architecture","cards":[{"front":"DOM vs. Vision Interaction","back":"DOM: fast (milliseconds), precise, reliable selectors. Only works for web pages with known structure. Vision: slower (seconds), approximate coordinates, universal -- works on any interface. Best agents use both."},{"front":"Chrome DevTools Protocol","back":"The API Chrome exposes for programmatic control: page navigation, DOM access, JavaScript execution, network interception. Tools like Playwright and Puppeteer are built on CDP."},{"front":"The Hybrid Architecture","back":"Layer 1: DOM for fast, known interactions. Layer 2: Vision as fallback for unknown pages. Layer 3: Combined page context (screenshot + simplified HTML) for complex decisions."},{"front":"Stable Selectors","back":"Prefer IDs, data-testid attributes, ARIA labels, and unique text content. Avoid fragile positional selectors like div:nth-child(3) that break when page structure changes."},{"front":"DOM-First, Vision-Fallback","back":"Try DOM interaction first (fast, precise). If the selector is not found or the action fails, fall back to vision (screenshot, AI analysis, coordinate click). This gives speed when possible and flexibility when needed."},{"front":"Page Context Extraction","back":"Send Claude both a screenshot AND simplified HTML for the richest understanding. The screenshot shows appearance, the HTML shows structure and properties. Cross-referencing both improves accuracy."}]}'></div>
</div>

<div class="lesson-section">
  <span class="section-label">Check Your Understanding</span>
  <h2 class="section-title">Browser agent architecture quiz.</h2>
  <div data-learn="QuizMC" data-props='{"title":"Browser Agent Architecture","questions":[{"q":"When should a browser agent use vision-based interaction instead of DOM-based?","options":["Always -- vision is more reliable","When you do not know the page structure, when JavaScript frameworks make DOM querying unreliable, or when the interface is not web-based","Only when the page has no CSS","Never -- DOM is always better"],"correct":1,"explanation":"Vision is the universal fallback. It works on any interface -- web, desktop, mobile emulator -- regardless of whether the page structure is known. DOM is faster and more precise but requires knowledge of selectors and only works for web pages."},{"q":"What is the advantage of the DOM-first, vision-fallback pattern?","options":["It eliminates the need for screenshots entirely","It provides speed when page structure is known (DOM) and flexibility when it is not (vision) -- combining the best of both approaches","It reduces API costs to zero","It works without any browser automation library"],"correct":1,"explanation":"DOM interaction is fast (milliseconds) and precise but requires known selectors. Vision is slower (seconds) but universal. By trying DOM first and falling back to vision, the agent is fast when possible and flexible when needed."},{"q":"Why should you avoid fragile CSS selectors like div:nth-child(3) > button?","options":["They are slower to execute than stable selectors","They break when any parent element changes, causing the entire workflow to fail -- prefer IDs, data-testid, or ARIA labels that remain stable","They consume more browser memory","They are not supported by all browsers"],"correct":1,"explanation":"Positional selectors depend on the exact page structure. Adding a new div, reordering elements, or inserting an ad can change nth-child positions and break the selector. Stable selectors (IDs, data-testid, ARIA labels) reference specific elements regardless of their position in the DOM tree."}]}'></div>
</div>

<nav class="lesson-nav">
  <a href="/academy/computer-use-agents/error-recovery-resilience/" class="prev">&larr; Previous: Error Recovery & Resilience</a>
  <a href="/academy/computer-use-agents/mcp-plus-computer-use/" class="next">Next: MCP + Computer Use &rarr;</a>
</nav>

</div>
