---
title: "Accessible by Default"
course: "vibe-coding"
order: 9
type: "lesson"
free: false
---<div class="wrap">

<nav class="local-nav">
  <a href="/academy/vibe-coding/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 9 of 10</span>
</nav>

<!-- HERO -->
<div class="lesson-hero">
  <h1>Accessible <span class="accent">by Default.</span><span class="pro-badge">PRO</span></h1>
  <p class="sub">Building for everyone: screen readers, keyboard navigation, color contrast. AI makes accessibility easier, not harder.</p>
</div>

<!-- LEARNING GOALS -->
<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>What web accessibility actually means and who it helps</li>
    <li>The 5 accessibility rules that cover 90% of issues</li>
    <li>How to tell AI to build accessible apps from the start</li>
    <li>How to test your app for basic accessibility</li>
  </ul>
</div>

<!-- SECTION 1: WHY ACCESSIBILITY MATTERS -->
<div class="lesson-section">
  <span class="section-label">Why This Matters</span>
  <h2 class="section-title">One in four adults has a disability. Build for them too.</h2>
  <p class="section-text">Accessibility means making your app usable by everyone — including people who are blind and use screen readers, people with limited hand mobility who navigate with keyboards, people who are colorblind, people with low vision, and people with cognitive disabilities.</p>
  <p class="section-text">This is not charity. This is good design. The curb cut on a sidewalk was designed for wheelchairs, but it helps everyone — parents with strollers, travelers with luggage, delivery workers with carts. <strong>Accessible design makes apps better for all users.</strong></p>
  <p class="section-text">And here is the thing about vibe coding: <strong>it is actually easier to build accessible apps with AI than without it.</strong> AI knows the accessibility rules. You just have to ask.</p>
</div>

<!-- SECTION 2: THE 5 RULES -->
<div class="lesson-section">
  <span class="section-label">The Rules</span>
  <h2 class="section-title">5 accessibility rules that cover 90% of issues.</h2>

  <div class="tip-box">
    <div class="tip-label">Rule 1: All images need alt text</div>
    <p>Every image should have a text description that a screen reader can read aloud. Tell AI: "Add descriptive alt text to all images." Instead of alt="image1" use alt="A golden retriever running through a park."</p>
  </div>

  <div class="tip-box">
    <div class="tip-label">Rule 2: Everything must work with just a keyboard</div>
    <p>Some people cannot use a mouse. They navigate with Tab, Enter, and arrow keys. Tell AI: "Make sure all interactive elements are keyboard accessible with visible focus indicators." Then test by pressing Tab through your entire app.</p>
  </div>

  <div class="tip-box">
    <div class="tip-label">Rule 3: Color is not the only way to convey information</div>
    <p>If a field turns red to show an error, also add a text message like "This field is required." Colorblind users cannot see the red. Tell AI: "Never rely on color alone to communicate information. Always pair color with text or icons."</p>
  </div>

  <div class="tip-box">
    <div class="tip-label">Rule 4: Text needs enough contrast</div>
    <p>Light gray text on a white background is hard to read for everyone, impossible for people with low vision. Tell AI: "Ensure all text meets WCAG AA contrast ratio of at least 4.5:1." AI knows the math — you just need to ask.</p>
  </div>

  <div class="tip-box">
    <div class="tip-label">Rule 5: Forms need proper labels</div>
    <p>Every input field needs a label that tells screen readers what the field is for. Placeholder text is not enough. Tell AI: "Add proper HTML labels to all form inputs, not just placeholder text."</p>
  </div>
</div>

<!-- SECTION 3: THE ACCESSIBILITY PROMPT -->
<div class="lesson-section">
  <span class="section-label">Copy This</span>
  <h2 class="section-title">The one prompt that makes your app accessible.</h2>
  <p class="section-text">Add this to your initial app description or send it after your first build. AI will audit and fix your app for accessibility.</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">The accessibility audit prompt</div>
<pre style="margin:0;color:#e5e5e5"><code>Audit this app for accessibility and fix any issues:

1. Add alt text to all images
2. Make all interactive elements keyboard accessible
   with visible focus indicators
3. Ensure color contrast meets WCAG AA (4.5:1 ratio)
4. Add proper labels to all form inputs
5. Never rely on color alone — pair with text or icons
6. Add ARIA labels where needed for screen readers
7. Make sure the page has a logical heading structure
   (h1, h2, h3 in order)

Fix all issues you find.</code></pre>
</div>
</div>

<!-- SECTION 4: TESTING -->
<div class="lesson-section">
  <span class="section-label">Test It</span>
  <h2 class="section-title">How to test accessibility in 2 minutes.</h2>

  <div class="demo-container" style="padding:1.75rem">
    <div style="display:flex;flex-direction:column;gap:16px">
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(74,222,128,.12);color:var(--green);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0;margin-top:2px">1</div>
        <div>
          <div style="font-weight:700;font-size:.95rem;margin-bottom:2px">Tab test (30 seconds)</div>
          <div style="color:var(--dim);font-size:.85rem">Put your mouse aside. Press Tab to navigate through your entire app. Can you reach every button, link, and form field? Can you see which element is focused? If not, tell AI to fix keyboard navigation.</div>
        </div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(192,132,252,.12);color:var(--purple);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0;margin-top:2px">2</div>
        <div>
          <div style="font-weight:700;font-size:.95rem;margin-bottom:2px">Squint test (15 seconds)</div>
          <div style="color:var(--dim);font-size:.85rem">Squint at your screen. Can you still read the text? If any text disappears when you squint, it does not have enough contrast. Tell AI to increase the contrast.</div>
        </div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(251,146,60,.12);color:var(--orange);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0;margin-top:2px">3</div>
        <div>
          <div style="font-weight:700;font-size:.95rem;margin-bottom:2px">Lighthouse audit (1 minute)</div>
          <div style="color:var(--dim);font-size:.85rem">In Chrome, right-click your page, click Inspect, go to the Lighthouse tab, check "Accessibility," and click "Analyze." It gives you a score out of 100 and tells you exactly what to fix. Paste the results to AI.</div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- KEY TAKEAWAY -->
<div class="callout purple">
  <p><strong>The key insight:</strong> Accessibility is not extra work — it is <strong>good work.</strong> AI knows the rules better than most human developers. One prompt makes your app accessible. There is no excuse for excluding a quarter of your potential users.</p>
</div>

<!-- LESSON CHECK -->
<div class="lesson-section">
  <span class="section-label">Quick Check</span>
  <h2 class="section-title">Lock it in.</h2>

<div data-learn="QuizMC" data-props='{"questions":[{"q":"Why should you not rely on color alone to show errors?","options":["Colors look different on every screen","Colorblind users cannot distinguish the color change","Colors slow down the app","Red is considered rude in some cultures"],"correct":1,"explanation":"About 8% of men are colorblind. If your only error indicator is a red border, they will not see it. Always pair color with text or icons."},{"q":"What is the fastest way to test keyboard accessibility?","options":["Install a special testing tool","Read through all the code","Put your mouse aside and press Tab through the whole app","Ask a screen reader user to test it"],"correct":2,"explanation":"The Tab test takes 30 seconds. Navigate your entire app using only the Tab key. If you cannot reach everything or cannot see what is focused, you have accessibility issues to fix."}]}'></div>

</div>

<!-- FLASHCARDS -->
<div class="lesson-section">
  <span class="section-label">Review</span>
  <h2 class="section-title">Key concepts to remember.</h2>

<div data-learn="FlashDeck" data-props='{"title":"Accessibility Essentials","cards":[{"front":"What percentage of adults has a disability?","back":"One in four (25%). Building accessible apps is not a niche concern — it affects a quarter of your potential users."},{"front":"What is alt text?","back":"A text description of an image that screen readers read aloud. Every image needs descriptive alt text."},{"front":"What is the WCAG AA contrast ratio?","back":"At least 4.5:1 for normal text. This ensures text is readable for people with low vision. AI can check and fix this for you."},{"front":"What is the Tab test?","back":"Navigate your entire app using only the Tab key. If you cannot reach every interactive element or see what is focused, your keyboard accessibility needs work."},{"front":"What is the curb cut effect?","back":"Features designed for disabled people that benefit everyone. Like curb cuts on sidewalks — designed for wheelchairs, used by everyone with strollers, luggage, or carts."},{"front":"How do you make a vibe-coded app accessible?","back":"Add one prompt: ask AI to audit for alt text, keyboard navigation, color contrast, form labels, and heading structure. AI knows the rules — you just need to ask."}]}'></div>

</div>

</div>
