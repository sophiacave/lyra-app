---
title: "Thinking in Features, Not Code"
course: "vibe-coding"
order: 4
type: "lesson"
free: false
---<div class="wrap">

<nav class="local-nav">
  <a href="/academy/vibe-coding/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 4 of 10</span>
</nav>

<!-- HERO -->
<div class="lesson-hero">
  <h1>Thinking in <span class="accent">Features.</span></h1>
  <p class="sub">How to describe what you want: user stories, feature descriptions, and screen-by-screen thinking.</p>
</div>

<!-- LEARNING GOALS -->
<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>How to break any app idea into describable features</li>
    <li>The user story format that AI understands best</li>
    <li>How to think screen-by-screen instead of code-by-code</li>
    <li>How to prioritize what to build first</li>
  </ul>
</div>

<!-- SECTION 1: THE MINDSET SHIFT -->
<div class="lesson-section">
  <span class="section-label">The Shift</span>
  <h2 class="section-title">Stop thinking about code. Start thinking about people.</h2>
  <p class="section-text">The biggest mistake new vibe coders make is trying to think like a programmer. They worry about databases, functions, and file structures. That is AI's job now.</p>
  <p class="section-text"><strong>Your job is to think like a product designer.</strong> What does the user see? What can they click? What happens when they click it? What information do they need? What is the flow from one screen to the next?</p>
  <p class="section-text">This is actually a skill most people already have. Every time you have said "this app should let me..." or "it would be nice if I could..." you were thinking in features. We are just going to make that thinking more structured.</p>
</div>

<!-- SECTION 2: USER STORIES -->
<div class="lesson-section">
  <span class="section-label">The Format</span>
  <h2 class="section-title">User stories: the simplest way to describe a feature.</h2>
  <p class="section-text">Professional product teams use something called a "user story" to describe features. It sounds fancy, but it is just a sentence with a specific format:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">The user story formula</div>
<pre style="margin:0;color:#e5e5e5"><code>As a [type of user],
I want to [do something],
so that [I get this benefit].</code></pre>
</div>

  <p class="section-text">That is it. Three parts: who, what, why. Here are real examples:</p>

  <div class="demo-container" style="padding:1.75rem">
    <div style="display:flex;flex-direction:column;gap:16px">
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(74,222,128,.12);color:var(--green);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0;margin-top:2px">1</div>
        <div>
          <div style="font-weight:700;font-size:.95rem;margin-bottom:2px">"As a busy parent, I want to save recipes from websites without all the blog content, so I can quickly see just the ingredients and steps while cooking."</div>
        </div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(192,132,252,.12);color:var(--purple);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0;margin-top:2px">2</div>
        <div>
          <div style="font-weight:700;font-size:.95rem;margin-bottom:2px">"As a freelancer, I want to track which invoices are paid and which are overdue, so I can follow up on late payments without checking my email."</div>
        </div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(251,146,60,.12);color:var(--orange);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0;margin-top:2px">3</div>
        <div>
          <div style="font-weight:700;font-size:.95rem;margin-bottom:2px">"As a dog walker, I want to log each walk with a time, duration, and notes, so I can show my clients what happened during their dog's walk."</div>
        </div>
      </div>
    </div>
  </div>

  <p class="section-text">Notice: no mention of code, databases, or technology. Just people and their needs. <strong>AI turns these into code. You just describe the people.</strong></p>
</div>

<!-- SECTION 3: SCREEN-BY-SCREEN THINKING -->
<div class="lesson-section">
  <span class="section-label">The Method</span>
  <h2 class="section-title">Think screen by screen.</h2>
  <p class="section-text">Another powerful way to describe an app is to walk through it screen by screen, like you are giving a tour of a house before it is built.</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Screen-by-screen description for an invoice tracker</div>
<pre style="margin:0;color:#e5e5e5"><code>Screen 1: Dashboard
- Shows total outstanding, total paid this month
- List of recent invoices with status (paid/overdue/pending)
- Big "Create Invoice" button at the top

Screen 2: Create Invoice
- Form: client name, amount, due date, description
- "Save as Draft" and "Send" buttons
- Preview of what the invoice looks like

Screen 3: Invoice Detail
- Full invoice with all details
- Status badge (paid, overdue, pending)
- "Mark as Paid" button
- Payment history if partially paid</code></pre>
</div>

  <p class="section-text">This format is incredibly effective for AI coding tools because it describes the exact user interface you want. AI can turn this into a working app with minimal ambiguity.</p>
</div>

<!-- SECTION 4: PRIORITIZATION -->
<div class="lesson-section">
  <span class="section-label">Strategy</span>
  <h2 class="section-title">Build the smallest useful version first.</h2>
  <p class="section-text">The temptation is to describe every feature you can imagine. Resist this. Build the smallest version that is actually useful, then add features one at a time.</p>

  <div class="callout">
    <p><strong>The MVP rule:</strong> What is the absolute minimum your app needs to be useful to one person? Build that first. You can always add features later. But you cannot add features to something that does not exist yet.</p>
  </div>

  <p class="section-text">For the invoice tracker example, the MVP might just be: "A page where I can list invoices with a status, and a button to mark them as paid." No create form, no dashboard, no email sending. Just the core thing. Once that works, you add features one by one.</p>
</div>

<!-- SECTION 5: COMMON PITFALLS -->
<div class="lesson-section">
  <span class="section-label">Avoid These</span>
  <h2 class="section-title">Feature description mistakes that trip people up.</h2>

  <div class="tip-box">
    <div class="tip-label">Mistake: Describing implementation instead of experience</div>
    <p><strong>Bad:</strong> "Use a SQL database with a users table and an invoices table with a foreign key." <strong>Good:</strong> "Users can create invoices and see all their past invoices." Let AI decide the technical implementation.</p>
  </div>

  <div class="tip-box">
    <div class="tip-label">Mistake: Trying to build everything at once</div>
    <p><strong>Bad:</strong> "Build a complete project management tool with tasks, teams, timelines, budgets, reports, and integrations." <strong>Good:</strong> "Build a task list where I can add tasks, mark them done, and organize them by project." Start small, expand later.</p>
  </div>

  <div class="tip-box">
    <div class="tip-label">Mistake: Being vague about what success looks like</div>
    <p><strong>Bad:</strong> "Make it look nice." <strong>Good:</strong> "Clean, minimal design. Lots of white space. Rounded corners. A warm color palette — soft yellows and creams." Specific design language gives AI something to work with.</p>
  </div>
</div>

<!-- KEY TAKEAWAY -->
<div class="callout purple">
  <p><strong>The key insight:</strong> The best vibe coders are not the most technical. They are the best at <strong>describing what people need.</strong> User stories and screen-by-screen thinking are your superpowers. Master those, and AI handles the rest.</p>
</div>

<!-- LESSON CHECK -->
<div class="lesson-section">
  <span class="section-label">Quick Check</span>
  <h2 class="section-title">Lock it in.</h2>

<div data-learn="QuizMC" data-props='{"questions":[{"q":"What is the user story format?","options":["As a developer, I want to use React, so that the code is clean","As a [user], I want to [action], so that [benefit]","First do this, then do that, then deploy","Feature: name, Description: text, Priority: high"],"correct":1,"explanation":"The user story format is: As a [type of user], I want to [do something], so that [I get this benefit]. It focuses on people and outcomes, not technology."},{"q":"What should you build first?","options":["Every feature you can think of","The most impressive feature to show off","The smallest useful version (MVP)","The database and backend first"],"correct":2,"explanation":"Build the smallest version that is actually useful to one person. You can always add features later, but you cannot add features to something that does not exist."}]}'></div>

</div>

<!-- FLASHCARDS -->
<div class="lesson-section">
  <span class="section-label">Review</span>
  <h2 class="section-title">Key concepts to remember.</h2>

<div data-learn="FlashDeck" data-props='{"title":"Feature Thinking","cards":[{"front":"What is a user story?","back":"A simple sentence: As a [type of user], I want to [do something], so that [I get this benefit]. It describes features from the user perspective, not the code perspective."},{"front":"What is screen-by-screen thinking?","back":"Describing your app by walking through each screen — what the user sees, what they can click, and what happens next. Like giving a tour of a house before it is built."},{"front":"What is an MVP?","back":"Minimum Viable Product. The smallest version of your app that is actually useful to one person. Build this first, then add features."},{"front":"Should you tell AI which database to use?","back":"Usually no. Describe WHAT data needs to be saved, not HOW. Let AI choose the technical implementation."},{"front":"What makes a good feature description?","back":"Focus on what the user does and sees, not on technical implementation. Be specific about design, but let AI choose the code."},{"front":"What is the biggest feature description mistake?","back":"Trying to build everything at once. Start with the core feature, get it working, then add one feature at a time."}]}'></div>

</div>

</div>
