---
title: "Debugging With AI"
course: "vibe-coding"
order: 5
type: "lesson"
free: false
---<div class="wrap">

<nav class="local-nav">
  <a href="/academy/vibe-coding/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 5 of 10</span>
</nav>

<!-- HERO -->
<div class="lesson-hero">
  <h1>Debugging <span class="accent">With AI.</span></h1>
  <p class="sub">When things break (they will). How to describe bugs, read errors, and let AI fix them for you.</p>
</div>

<!-- LEARNING GOALS -->
<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>Why things break and why that is completely normal</li>
    <li>How to describe a bug so AI can fix it</li>
    <li>How to read error messages (they are less scary than they look)</li>
    <li>The copy-paste debugging workflow that solves most problems</li>
  </ul>
</div>

<!-- SECTION 1: BUGS ARE NORMAL -->
<div class="lesson-section">
  <span class="section-label">Mindset</span>
  <h2 class="section-title">Things will break. That is not failure — that is building.</h2>
  <p class="section-text">Here is a secret that professional developers do not tell you: <strong>their code breaks all the time too.</strong> Bugs are not a sign that something went wrong. They are a normal part of building software. Even code written by the best engineers in the world ships with bugs.</p>
  <p class="section-text">The difference between a frustrated builder and a confident one is not the number of bugs they encounter. It is how they respond. And with AI, responding to bugs just became dramatically easier.</p>

  <div class="callout">
    <p><strong>Reframe:</strong> A bug is not a problem. It is a conversation starter. "Hey AI, this thing is broken. Here is what is happening. Fix it." That is the whole process.</p>
  </div>
</div>

<!-- SECTION 2: DESCRIBING BUGS -->
<div class="lesson-section">
  <span class="section-label">The Skill</span>
  <h2 class="section-title">The 3-part bug report that gets instant fixes.</h2>
  <p class="section-text">When something breaks, you need to tell AI three things. This format works every single time:</p>

  <div class="demo-container" style="padding:1.75rem">
    <div style="display:flex;flex-direction:column;gap:16px">
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(251,146,60,.12);color:var(--orange);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0;margin-top:2px">1</div>
        <div>
          <div style="font-weight:700;font-size:.95rem;margin-bottom:2px">What you expected to happen</div>
          <div style="color:var(--dim);font-size:.85rem">"When I click the Save button, it should save my entry and show a confirmation message."</div>
        </div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(192,132,252,.12);color:var(--purple);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0;margin-top:2px">2</div>
        <div>
          <div style="font-weight:700;font-size:.95rem;margin-bottom:2px">What actually happened</div>
          <div style="color:var(--dim);font-size:.85rem">"Nothing happens when I click Save. The button does not respond at all. No error, no message, nothing."</div>
        </div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(74,222,128,.12);color:var(--green);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0;margin-top:2px">3</div>
        <div>
          <div style="font-weight:700;font-size:.95rem;margin-bottom:2px">Any error messages you see</div>
          <div style="color:var(--dim);font-size:.85rem">"There is a red message in the browser console that says: TypeError: Cannot read property 'push' of undefined."</div>
        </div>
      </div>
    </div>
  </div>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Bug report prompt — copy this format</div>
<pre style="margin:0;color:#e5e5e5"><code>Something is broken.

Expected: When I click "Save," my entry should save
and show a confirmation.

Actual: The Save button does nothing. No response at
all.

Error in console: TypeError: Cannot read property
'push' of undefined

Please fix this.</code></pre>
</div>
</div>

<!-- SECTION 3: READING ERROR MESSAGES -->
<div class="lesson-section">
  <span class="section-label">Demystified</span>
  <h2 class="section-title">Error messages are scary-looking but simple.</h2>
  <p class="section-text">Error messages look like gibberish, but they usually contain the answer. You do not need to understand them — you just need to copy them. But here is a quick decoder for the most common ones:</p>

<div data-learn="FlashDeck" data-props='{"title":"Error Message Decoder","cards":[{"front":"TypeError: Cannot read property X of undefined\n\nWhat does this mean in plain English?","back":"The code is trying to use something that does not exist yet. Like trying to open a drawer in a desk that has not been built. Fix: AI needs to check that the thing exists before using it."},{"front":"404 Not Found\n\nWhat does this mean in plain English?","back":"The app is looking for a page or file that does not exist at that location. Like going to Room 305 in a building that only has 3 floors. Fix: the URL or file path is wrong."},{"front":"SyntaxError: Unexpected token\n\nWhat does this mean in plain English?","back":"There is a typo in the code — a missing comma, bracket, or quote mark. Like a sentence with a random character in the middle. Fix: AI needs to find and fix the typo."},{"front":"CORS error / Access-Control-Allow-Origin\n\nWhat does this mean in plain English?","back":"Your app is trying to talk to another website that is not allowing it. Like trying to call a phone number that has blocked your number. Fix: usually a server configuration issue — tell AI about it."},{"front":"Module not found / Cannot find module\n\nWhat does this mean in plain English?","back":"The code references a library or file that is not installed or does not exist. Like a recipe calling for an ingredient you do not have. Fix: AI needs to install the missing library or fix the file path."}]}'></div>

  <div class="tip-box">
    <div class="tip-label">You do not need to understand errors</div>
    <p>Seriously. Just <strong>copy the entire error message and paste it to AI.</strong> Say "I got this error. Fix it." AI reads the error, understands it, and fixes the code. You do not need to become a decoder — that is AI's job.</p>
  </div>
</div>

<!-- SECTION 4: THE COPY-PASTE DEBUGGING WORKFLOW -->
<div class="lesson-section">
  <span class="section-label">The Workflow</span>
  <h2 class="section-title">The 60-second debugging workflow.</h2>
  <p class="section-text">Here is the process that fixes 90% of bugs. It takes about 60 seconds.</p>

  <div class="tip-box">
    <div class="tip-label">Step 1: Find the error</div>
    <p>Right-click your page, click "Inspect," then click the "Console" tab. Red text = errors. If you are using Claude Code or Cursor, the error often shows up directly in the terminal.</p>
  </div>

  <div class="tip-box">
    <div class="tip-label">Step 2: Copy the error</div>
    <p>Select the entire red error message and copy it. Do not try to interpret it. Just copy the whole thing.</p>
  </div>

  <div class="tip-box">
    <div class="tip-label">Step 3: Paste it to AI with context</div>
    <p>Paste the error into your AI tool. Add what you were doing when it happened. Say "fix this." AI will identify the problem and update the code.</p>
  </div>

  <div class="tip-box">
    <div class="tip-label">Step 4: Refresh and check</div>
    <p>After AI makes the fix, refresh your app and try the same action again. Fixed? Great, move on. Still broken? Repeat from Step 1 with the new error.</p>
  </div>
</div>

<!-- SECTION 5: WHEN AI CAN'T FIX IT -->
<div class="lesson-section">
  <span class="section-label">Tough Cases</span>
  <h2 class="section-title">When the fix does not work: the nuclear option.</h2>
  <p class="section-text">Sometimes AI keeps going in circles trying to fix something. When that happens, you have a powerful option: <strong>start that feature over.</strong></p>
  <p class="section-text">Tell AI: "This approach is not working. Let us try a completely different way to implement [feature]. Start fresh on just this part." AI will rethink the approach from scratch, often finding a simpler solution.</p>
  <p class="section-text">This is not giving up — it is a professional technique. Real developers do this all the time. Sometimes the fastest path forward is a fresh start on the broken piece.</p>
</div>

<!-- KEY TAKEAWAY -->
<div class="callout purple">
  <p><strong>The key insight:</strong> Debugging is not about understanding code. It is about <strong>describing what went wrong and letting AI fix it.</strong> Copy the error, explain what happened, and say "fix this." That is the whole skill.</p>
</div>

<!-- LESSON CHECK -->
<div class="lesson-section">
  <span class="section-label">Quick Check</span>
  <h2 class="section-title">Lock it in.</h2>

<div data-learn="QuizMC" data-props='{"questions":[{"q":"What are the three parts of a good bug report for AI?","options":["Code file, line number, stack trace","What you expected, what actually happened, any error messages","Screenshot, video recording, device model","Bug title, severity rating, assigned developer"],"correct":1,"explanation":"Tell AI what you expected to happen, what actually happened, and any error messages you see. That gives AI everything it needs to fix the problem."},{"q":"What should you do with an error message you do not understand?","options":["Google it and read Stack Overflow for 30 minutes","Try to fix the code yourself","Copy the entire message and paste it to AI","Delete the code and start over"],"correct":2,"explanation":"You do not need to understand error messages. Just copy the whole thing and paste it to AI with context about what you were doing. AI reads and fixes it."}]}'></div>

</div>

<!-- FLASHCARDS -->
<div class="lesson-section">
  <span class="section-label">Review</span>
  <h2 class="section-title">Key concepts to remember.</h2>

<div data-learn="FlashDeck" data-props='{"title":"Debugging Basics","cards":[{"front":"Are bugs a sign of failure?","back":"No. Bugs are a normal part of building software. Even the best professional developers deal with bugs constantly. It is part of the process."},{"front":"What is the 3-part bug report format?","back":"1. What you expected to happen. 2. What actually happened. 3. Any error messages you see."},{"front":"Where do you find error messages in a browser?","back":"Right-click the page, click Inspect, then click the Console tab. Red text = errors."},{"front":"What is a 404 error?","back":"The app is looking for a page or file that does not exist at that location. Like going to Room 305 in a building with only 3 floors."},{"front":"What should you do when AI keeps going in circles?","back":"Tell AI to start that feature over with a completely different approach. Sometimes a fresh start on the broken piece is the fastest fix."},{"front":"Do you need to understand error messages?","back":"No. Copy the entire error and paste it to AI. AI understands it and fixes the code. Your job is describing the problem, not decoding the error."}]}'></div>

</div>

</div>
