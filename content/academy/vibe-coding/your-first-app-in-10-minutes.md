---
title: "Your First App in 10 Minutes"
course: "vibe-coding"
order: 3
type: "lesson"
free: false
---<div class="wrap">

<nav class="local-nav">
  <a href="/academy/vibe-coding/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 3 of 10</span>
</nav>

<!-- HERO -->
<div class="lesson-hero">
  <h1>Your First App in <span class="accent">10 Minutes.</span></h1>
  <p class="sub">Walk through building a real app by describing what you want. No code knowledge needed. Just words.</p>
</div>

<!-- LEARNING GOALS -->
<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>How to describe an app to AI so it builds what you actually want</li>
    <li>The step-by-step process of going from idea to working app</li>
    <li>How to review and refine what AI builds</li>
    <li>What a real vibe coding session looks and feels like</li>
  </ul>
</div>

<!-- SECTION 1: THE PROJECT -->
<div class="lesson-section">
  <span class="section-label">The Build</span>
  <h2 class="section-title">We are building a gratitude journal app.</h2>
  <p class="section-text">Here is the plan: a simple web app where you write three things you are grateful for each day, see your past entries, and feel good scrolling through them. It is small enough to build in 10 minutes but real enough to actually use.</p>
  <p class="section-text">We are going to walk through this step by step. You will see the exact prompts, the decisions you make along the way, and how the conversation with AI unfolds. <strong>Follow along in your own AI coding tool if you want to build it live.</strong></p>
</div>

<!-- SECTION 2: STEP BY STEP -->
<div class="lesson-section">
  <span class="section-label">Step-by-Step</span>
  <h2 class="section-title">The vibe coding process, live.</h2>

  <div class="tip-box">
    <div class="tip-label">Step 1: Describe the big picture (30 seconds)</div>
    <p>Start with one clear sentence about what you are building. Do not over-explain. Just the core idea.</p>
  </div>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Your first prompt</div>
<pre style="margin:0;color:#e5e5e5"><code>Build a gratitude journal web app. Each day, the user
writes 3 things they are grateful for. They can scroll
through past entries. Clean, minimal design with a
warm color palette. Store entries in the browser's
local storage.</code></pre>
</div>

  <p class="section-text">That is it. Five lines. No technical jargon. Just a clear description of what you want. The AI takes this and generates a complete working app — HTML, CSS, JavaScript, the whole thing.</p>

  <div class="tip-box">
    <div class="tip-label">Step 2: Review what AI built (2 minutes)</div>
    <p>Look at the result. Open it in the preview. Does it look right? Does it work? Click around. Try adding an entry. <strong>You are the quality checker here.</strong> Not the coder — the user.</p>
  </div>

  <div class="tip-box">
    <div class="tip-label">Step 3: Refine with follow-up prompts (5 minutes)</div>
    <p>The first version is rarely perfect. That is normal. Now you refine. Each follow-up prompt makes it better.</p>
  </div>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Refinement prompts — send these one at a time</div>
<pre style="margin:0;color:#e5e5e5"><code>Make the text input bigger and add placeholder text
that says "What are you grateful for today?"

Add the date as a header for each day's entries.

Add a small animation when a new entry is saved —
something gentle, like a fade-in.

The background color is too bright. Use a soft cream
or warm off-white instead.</code></pre>
</div>

  <div class="tip-box">
    <div class="tip-label">Step 4: Test it like a real user (2 minutes)</div>
    <p>Add a few entries. Refresh the page — are your entries still there? Try it on your phone. Show it to someone. Does it make sense to a person who has never seen it before?</p>
  </div>
</div>

<!-- SECTION 3: THE REFINEMENT LOOP -->
<div class="lesson-section">
  <span class="section-label">The Pattern</span>
  <h2 class="section-title">The vibe coding loop: describe, review, refine.</h2>
  <p class="section-text">Every vibe coding session follows the same pattern. Once you internalize this, you can build anything.</p>

<pre style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.5rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#e5e5e5;line-height:1.7;overflow-x:auto">
  1. DESCRIBE what you want (plain English)
          |
          v
  2. AI BUILDS a first version
          |
          v
  3. YOU REVIEW the result (use it, click around)
          |
          v
  4. REFINE with specific feedback
          |
          v
  (repeat 3-4 until it is right)
          |
          v
  5. DONE - you have a working app
</pre>

  <p class="section-text">Most apps take 3-5 rounds of this loop. Each round gets you closer. The better you get at describing what you want, the fewer rounds you need.</p>
</div>

<!-- SECTION 4: WHAT MAKES A GOOD FIRST PROMPT -->
<div class="lesson-section">
  <span class="section-label">Level Up</span>
  <h2 class="section-title">What makes a first prompt great vs garbage.</h2>

<div data-learn="FlashDeck" data-props='{"title":"Good vs Bad First Prompts","cards":[{"front":"BAD: \"Make me an app.\"\n\nWhy this fails:","back":"AI has no idea what kind of app, what it does, who uses it, or what it looks like. You will get something random. Be specific about the WHAT."},{"front":"BAD: \"Build a React app using Next.js with Tailwind CSS, a PostgreSQL database, Prisma ORM, and deploy to Vercel with edge functions.\"\n\nWhy this fails:","back":"Too much technical specification too early. You are telling AI HOW to build before establishing WHAT to build. Let AI pick the tech stack. Focus on describing the user experience."},{"front":"GOOD: \"Build a tip calculator. The user enters the bill amount and number of people. Show the tip and per-person total. Simple, clean, mobile-friendly.\"\n\nWhy this works:","back":"Clear purpose. Clear inputs and outputs. Design direction. No unnecessary technical constraints. AI knows exactly what to build and has freedom to choose the best approach."},{"front":"GOOD: \"Build a recipe saver app. Users paste a URL, the app extracts the recipe, and saves it without all the blog nonsense. Display just ingredients and steps.\"\n\nWhy this works:","back":"Solves a real problem. Describes the user flow clearly. Has personality (\"without all the blog nonsense\"). AI understands both the function and the feeling."}]}'></div>

</div>

<!-- KEY TAKEAWAY -->
<div class="callout purple">
  <p><strong>The key insight:</strong> You do not need to get it perfect on the first prompt. <strong>Describe, review, refine.</strong> Three to five rounds and you have a working app. The magic is in the iteration, not the initial description.</p>
</div>

<!-- LESSON CHECK -->
<div class="lesson-section">
  <span class="section-label">Quick Check</span>
  <h2 class="section-title">Lock it in.</h2>

<div data-learn="QuizMC" data-props='{"questions":[{"q":"What is the vibe coding loop?","options":["Write code, compile, debug, repeat","Describe, review, refine, repeat","Research, plan, code, test, deploy","Design, prototype, develop, launch"],"correct":1,"explanation":"The vibe coding loop is: describe what you want, review what AI builds, refine with specific feedback, repeat until done."},{"q":"How should your first prompt describe an app?","options":["With as much technical detail as possible","With just one word like \"calculator\"","By describing what the user does and sees, in plain English","By specifying the programming language and framework"],"correct":2,"explanation":"Focus on the user experience: what they do, what they see, how it feels. Let AI handle the technical decisions."},{"q":"How many rounds of refinement does a typical vibe-coded app take?","options":["Zero — the first version should be perfect","3 to 5 rounds","At least 20 rounds","It depends on how much code you write manually"],"correct":1,"explanation":"Most apps take 3-5 rounds of describe-review-refine. Each round gets you closer. Getting better at describing means fewer rounds."}]}'></div>

</div>

<!-- FLASHCARDS -->
<div class="lesson-section">
  <span class="section-label">Review</span>
  <h2 class="section-title">Key concepts to remember.</h2>

<div data-learn="FlashDeck" data-props='{"title":"Building Your First App","cards":[{"front":"What should your first prompt include?","back":"What the app does, who uses it, key features, and design direction. Skip technical specifications — let AI choose the tech."},{"front":"What is the vibe coding loop?","back":"Describe what you want, review what AI builds, refine with specific feedback, repeat 3-5 times until done."},{"front":"What do you do after AI generates the first version?","back":"Review it like a user. Click around, try the features, check the design. Then give specific feedback about what to change."},{"front":"Should you specify the programming language in your first prompt?","back":"Usually no. Focus on WHAT you want the app to do. Let AI choose the best technical approach."},{"front":"How do you give good refinement feedback?","back":"Be specific: \"Make the text bigger\" not \"make it better.\" One change at a time works best."},{"front":"What is your role during vibe coding?","back":"You are the product owner and quality checker. You decide what gets built and whether it is good enough. AI handles the code."}]}'></div>

</div>

</div>
