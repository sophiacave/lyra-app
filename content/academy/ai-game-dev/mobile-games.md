---
title: "Building Mobile Games"
course: "ai-game-dev"
order: 8
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-game-dev/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 8 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Building <span class="accent">Mobile Games.</span></h1>
  <p class="sub">Your browser game is already 90% of the way to mobile. Let's close the gap.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul><li>How to make browser games feel native on phones and tablets</li><li>Touch controls that don't frustrate players</li><li>Performance optimization for mobile devices</li><li>How to wrap browser games as installable apps with PWA</li></ul>
</div>

<div class="lesson-section">
  <span class="section-label">Mobile First</span>
  <h2 class="section-title">70% of casual gamers play on phones.</h2>
  <div class="section-text">
    <p>If your game doesn't work on mobile, you're ignoring most of your potential audience. The good news: HTML5 Canvas games already run in mobile browsers. You just need to optimize the experience.</p>
    <p>Three things that break games on mobile: the canvas doesn't resize, touch controls feel wrong, and performance tanks on older phones.</p>
    <div class="tip-box">
      <strong>Test on your phone early.</strong> Don't wait until the game is "done." Open your local dev server on your phone (same WiFi network) and play-test every feature as you build it.
    </div>
    <p>Ask AI to add responsive canvas sizing from the start. The canvas should fill the screen, maintain aspect ratio, and handle orientation changes.</p>
  </div>
</div>

<div class="lesson-section">
  <span class="section-label">Touch Controls</span>
  <h2 class="section-title">Thumbs are not mice.</h2>
  <div class="section-text">
    <p>The biggest mobile game mistake: assuming touch works like clicking. It doesn't. Thumbs are big, imprecise, and cover the screen.</p>
    <p>Design patterns that work on mobile:</p>
    <div class="callout">
      <strong>Tap games:</strong> Tap anywhere to jump, shoot, or interact. No on-screen buttons needed. The entire screen is the button.
    </div>
    <div class="callout">
      <strong>Swipe games:</strong> Swipe direction controls movement. Think Fruit Ninja or gesture-based puzzles. Natural and intuitive.
    </div>
    <div class="callout">
      <strong>Virtual joystick:</strong> On-screen analog stick for movement games. Only use this for games that truly need directional control. It's the least intuitive option.
    </div>
    <div class="demo-container">
      <p><em>"Add mobile touch controls to my platformer. Left side of screen = virtual joystick for movement. Right side of screen = tap to jump. Make the joystick appear where the thumb touches (not fixed position). Add haptic feedback on jump using navigator.vibrate(50)."</em></p>
    </div>
  </div>
</div>

<div class="lesson-section">
  <span class="section-label">Performance</span>
  <h2 class="section-title">Make it run smooth on a 2020 phone.</h2>
  <div class="section-text">
    <p>Mobile devices have less processing power than desktops. Your game needs to hit 60fps on hardware from three years ago. Here's how:</p>
    <p><strong>Reduce draw calls:</strong> Draw fewer things. Cull objects that are off-screen. Use sprite sheets instead of individual images.</p>
    <p><strong>Object pooling:</strong> Don't create and destroy objects constantly. Reuse them. A bullet that goes off-screen gets repositioned and reused instead of deleted and recreated.</p>
    <p><strong>Simplify particles:</strong> Desktop can handle 500 particles. Mobile chokes at 100. Scale your particle count based on device capability.</p>
    <div class="tip-box">
      <strong>Quick performance prompt:</strong> "Audit my game code for mobile performance. Add object pooling for bullets and particles, off-screen culling, and a performance mode that reduces particle count to 50% on devices below 45fps."
    </div>
  </div>
</div>

<div class="lesson-section">
  <span class="section-label">PWA</span>
  <h2 class="section-title">Install your game like a real app.</h2>
  <div class="section-text">
    <p>Progressive Web Apps let users "install" your browser game on their home screen. It launches fullscreen, works offline, and feels like a native app. No app store required.</p>
    <p>You need two things: a <code>manifest.json</code> file (app name, icon, colors) and a service worker (caching for offline play). Ask AI to generate both.</p>
    <div class="callout">
      <strong>PWA prompt:</strong> "Convert my HTML5 game into a PWA. Create a manifest.json with app name, 192x192 and 512x512 icons, theme color, and fullscreen display mode. Add a service worker that caches all game assets for offline play. Add an install prompt that appears after 30 seconds of gameplay."
    </div>
    <p>Now your browser game lives on the home screen, launches instantly, and works without internet. That's the power of PWA.</p>
  </div>
</div>

<div class="lesson-section">
  <span class="section-label">Quick Check</span>
  <h2 class="section-title">Lock it in.</h2>
  <div data-learn="QuizMC" data-props='{"questions":[{"q":"What is the best touch control pattern for simple action games?","options":["Virtual joystick for everything","Tap anywhere on screen to perform the primary action","Small buttons in the corner","Keyboard simulation on screen"],"correct":1,"explanation":"Tap-anywhere is the most intuitive mobile control. The entire screen becomes the button. It works for jumping, shooting, and most primary actions."},{"q":"What does a Progressive Web App (PWA) require?","options":["An App Store account and review process","A manifest.json file and a service worker","A native code compiler","A monthly subscription to a hosting service"],"correct":1,"explanation":"A PWA needs a manifest.json (app metadata and icons) and a service worker (asset caching for offline play). No app store required."}]}'></div>
</div>

<div class="lesson-section">
  <span class="section-label">Review</span>
  <h2 class="section-title">Key concepts to remember.</h2>
  <div data-learn="FlashDeck" data-props='{"title":"Mobile Games","cards":[{"front":"What percentage of casual gamers play on mobile?","back":"About 70%. If your game doesn't work on phones, you're missing most of your potential audience."},{"front":"What are the three mobile touch control patterns?","back":"Tap (entire screen is a button), Swipe (direction-based), and Virtual Joystick (on-screen analog stick -- use as last resort)."},{"front":"What is object pooling?","back":"Reusing game objects instead of creating and destroying them. A bullet that goes off-screen gets repositioned and reused, saving memory and CPU."},{"front":"What is a PWA and why use it for games?","back":"Progressive Web App. It lets users install your browser game on their home screen, launch it fullscreen, and play offline. No app store needed."}]}'></div>
</div>
</div>
