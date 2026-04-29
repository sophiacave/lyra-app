---
title: "Adding a Database"
course: "vibe-coding"
order: 7
type: "lesson"
free: false
---<div class="wrap">

<nav class="local-nav">
  <a href="/academy/vibe-coding/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 7 of 10</span>
</nav>

<!-- HERO -->
<div class="lesson-hero">
  <h1>Adding a <span class="accent">Database.</span></h1>
  <p class="sub">Persistent data: Supabase, SQLite, or JSON. Describing your data model in plain English so AI builds it right.</p>
</div>

<!-- LEARNING GOALS -->
<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>What a database actually is (in words anyone can understand)</li>
    <li>The three main options for storing data in vibe-coded apps</li>
    <li>How to describe your data to AI without technical jargon</li>
    <li>When you need a real database vs simple local storage</li>
  </ul>
</div>

<!-- SECTION 1: WHAT IS A DATABASE -->
<div class="lesson-section">
  <span class="section-label">The Basics</span>
  <h2 class="section-title">A database is just a filing cabinet your app can read.</h2>
  <p class="section-text">Right now, when you close your vibe-coded app and reopen it, everything you typed is probably gone. That is because the app has no memory. A database gives your app a place to remember things — user entries, settings, history, content.</p>
  <p class="section-text">Think of it like this: without a database, your app has amnesia. Every time you open it, it forgets everything. <strong>A database is the cure for amnesia.</strong> It stores information so your app can recall it later.</p>

  <div class="callout">
    <p><strong>The good news:</strong> You do not need to learn SQL, schema design, or database administration. You describe what information your app needs to remember, and AI sets up the database for you. "Remember each user's name, email, and their journal entries with dates." That is a database description.</p>
  </div>
</div>

<!-- SECTION 2: THREE OPTIONS -->
<div class="lesson-section">
  <span class="section-label">Your Options</span>
  <h2 class="section-title">Three ways to store data, from simple to powerful.</h2>

  <div class="demo-container" style="padding:1.75rem">
    <div style="display:flex;flex-direction:column;gap:16px">
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(74,222,128,.12);color:var(--green);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0;margin-top:2px">EASY</div>
        <div>
          <div style="font-weight:700;font-size:.95rem;margin-bottom:2px">Local Storage / JSON files</div>
          <div style="color:var(--dim);font-size:.85rem">Data saved in the browser or in a simple file. Works for personal tools. Limitation: data only exists on YOUR device. If you clear your browser, it is gone. Good for: prototypes, personal apps, single-user tools.</div>
        </div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(192,132,252,.12);color:var(--purple);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0;margin-top:2px">MID</div>
        <div>
          <div style="font-weight:700;font-size:.95rem;margin-bottom:2px">SQLite</div>
          <div style="color:var(--dim);font-size:.85rem">A small database that lives inside your app. No external service needed. Fast and reliable. Limitation: works best for single-server apps. Good for: personal projects, small tools, apps with one admin user.</div>
        </div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(251,146,60,.12);color:var(--orange);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0;margin-top:2px">FULL</div>
        <div>
          <div style="font-weight:700;font-size:.95rem;margin-bottom:2px">Supabase (or Firebase, PlanetScale)</div>
          <div style="color:var(--dim);font-size:.85rem">A real cloud database. Data lives on the internet, accessible from any device. Has user accounts, security, and scales. Good for: multi-user apps, anything public-facing, apps you want others to use.</div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- SECTION 3: DESCRIBING DATA -->
<div class="lesson-section">
  <span class="section-label">The Skill</span>
  <h2 class="section-title">How to describe your data in plain English.</h2>
  <p class="section-text">You do not need to know database terminology. Just answer these questions about your app, and AI will build the right database structure.</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Data description template — copy and fill in</div>
<pre style="margin:0;color:#e5e5e5"><code>My app needs to remember:

1. [Thing]: what details about each one?
   Example: Recipes — title, ingredients list,
   steps, prep time, source URL

2. [Another thing]: what details?
   Example: Users — name, email, password

3. Relationships:
   Example: Each user can have many recipes.
   Each recipe belongs to one user.

4. What needs to be searchable?
   Example: I want to search recipes by ingredient
   or by title.</code></pre>
</div>

  <p class="section-text">Here is a real example of describing data for a dog walking app:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Real example — dog walking app</div>
<pre style="margin:0;color:#e5e5e5"><code>My app needs to remember:

1. Dogs — name, breed, owner name, owner phone,
   special notes (like "afraid of squirrels")

2. Walks — which dog, date, start time, end time,
   distance, notes about the walk, poop count

3. Each dog can have many walks.
   I want to see all walks for one dog on their page.

4. I want to search by dog name or by date.</code></pre>
</div>

</div>

<!-- SECTION 4: WHEN TO LEVEL UP -->
<div class="lesson-section">
  <span class="section-label">Decision Guide</span>
  <h2 class="section-title">How to know when you need a real database.</h2>

<div data-learn="FlashDeck" data-props='{"title":"Do I Need a Database?","cards":[{"front":"My app is just for me.\nNo login. No other users.\nI just want my data saved.","back":"Use Local Storage or a JSON file.\n\nSimplest option. Tell AI: \"Save all data to the browser local storage\" or \"Save data to a JSON file.\" Perfect for personal tools and prototypes."},{"front":"I want multiple people to use my app.\nThey each need their own account.\nData needs to be secure.","back":"Use Supabase (recommended for beginners).\n\nTell AI: \"Add Supabase for the database and user authentication. Users should only see their own data.\" Supabase has a generous free tier."},{"front":"I want data to persist but I do not\nneed user accounts. It is a simple\nsingle-user tool.","back":"Use SQLite.\n\nTell AI: \"Use SQLite to store the data. No user accounts needed.\" SQLite is fast, simple, and requires no external services."},{"front":"I am not sure yet.\nI just want to prototype.\nI will figure out the database later.","back":"Start with Local Storage.\n\nGet the app working first. You can always upgrade to a real database later. Tell AI: \"For now, save everything to local storage. We will add a database later.\""}]}'></div>

</div>

<!-- KEY TAKEAWAY -->
<div class="callout purple">
  <p><strong>The key insight:</strong> You do not need to learn database technology. You need to answer one question: <strong>what does my app need to remember?</strong> Describe that in plain English, and AI builds the database. Start with local storage, upgrade when you need to.</p>
</div>

<!-- LESSON CHECK -->
<div class="lesson-section">
  <span class="section-label">Quick Check</span>
  <h2 class="section-title">Lock it in.</h2>

<div data-learn="QuizMC" data-props='{"questions":[{"q":"What is a database, in simple terms?","options":["A special programming language","A filing cabinet your app can read and write to","A type of website","An AI model that stores code"],"correct":1,"explanation":"A database is just a place for your app to remember things — like a filing cabinet it can read from and write to. Without one, your app forgets everything when you close it."},{"q":"If you are building a personal tool just for yourself, which storage option is simplest?","options":["Supabase cloud database","A SQL server you manage yourself","Local Storage in the browser","A custom API with authentication"],"correct":2,"explanation":"Local Storage saves data right in your browser. It is the simplest option for personal tools. No setup, no external service, just tell AI to use it."}]}'></div>

</div>

<!-- FLASHCARDS -->
<div class="lesson-section">
  <span class="section-label">Review</span>
  <h2 class="section-title">Key concepts to remember.</h2>

<div data-learn="FlashDeck" data-props='{"title":"Database Basics","cards":[{"front":"What is Local Storage?","back":"Data saved in your browser. Simplest option. Works for personal tools. Disappears if you clear your browser data."},{"front":"What is SQLite?","back":"A small database that lives inside your app. No external service needed. Good for single-user tools and small projects."},{"front":"What is Supabase?","back":"A cloud database service with user authentication. Data lives on the internet, accessible from any device. Free tier available. Best for multi-user apps."},{"front":"How do you describe data to AI?","back":"List what your app needs to remember, what details about each thing, and how things relate to each other. Use plain English, no technical terms needed."},{"front":"When should you upgrade from Local Storage to a real database?","back":"When you need multiple users, data accessible from different devices, or user accounts with security."},{"front":"What question should you answer first about databases?","back":"What does my app need to remember? Answer that in plain English and AI builds the right database."}]}'></div>

</div>

</div>
