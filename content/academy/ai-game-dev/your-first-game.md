---
title: "Your First Game in 10 Minutes"
course: "ai-game-dev"
order: 2
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-game-dev/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 2 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Your First Game <span class="accent">in 10 Minutes.</span></h1>
  <p class="sub">Build a real, playable game right now. No experience needed.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul><li>How to set up a game development environment in under 2 minutes</li><li>How to prompt AI to generate a complete game</li><li>The HTML5 Canvas basics that power browser games</li><li>How to iterate on your game with AI feedback loops</li></ul>
</div>

<div class="lesson-section">
  <span class="section-label">Setup</span>
  <h2 class="section-title">Your dev environment in 90 seconds.</h2>
  <div class="section-text">
    <p>You need exactly three things: a browser, a text editor, and an AI assistant. That's it. No downloads, no installs, no configuration nightmares.</p>
    <p>Open VS Code (or even Notepad). Create a folder called <code>my-first-game</code>. Inside it, create one file: <code>index.html</code>. This single file will contain your entire game.</p>
    <div class="tip-box">
      <strong>Pro move:</strong> Use VS Code with the Live Server extension. Every time you save, your browser auto-refreshes. Instant feedback loop.
    </div>
    <p>Browser games using HTML5 Canvas run everywhere -- desktop, mobile, tablet. No app store approval needed. Your game is a URL.</p>
  </div>
</div>

<div class="lesson-section">
  <span class="section-label">The Build</span>
  <h2 class="section-title">Prompting your first game into existence.</h2>
  <div class="section-text">
    <p>Here's the prompt that changes everything. Open Claude or ChatGPT and type:</p>
    <div class="demo-container">
      <p><em>"Build me a simple browser game using HTML5 Canvas and vanilla JavaScript. Make it a click-to-catch game where colorful circles fall from the top of the screen and the player clicks them to score points. Include a score counter, a timer counting down from 30 seconds, and a game-over screen with a restart button. Make it mobile-friendly with touch events. Put everything in a single HTML file."</em></p>
    </div>
    <p>That's it. Paste the response into your <code>index.html</code>, save, and open it in your browser. You have a playable game.</p>
    <p>The key is specificity. Notice we didn't say "make a game." We specified the mechanic (click to catch), the elements (circles, score, timer), and the constraints (single HTML file, mobile-friendly). Better prompts = better games.</p>
  </div>
</div>

<div class="lesson-section">
  <span class="section-label">Iteration</span>
  <h2 class="section-title">The AI feedback loop.</h2>
  <div class="section-text">
    <p>Your first version works, but it's basic. Here's where AI game dev gets fun -- iteration is nearly instant.</p>
    <p>Try these follow-up prompts:</p>
    <div class="callout">
      <strong>"Add particle effects when I click a circle."</strong> Suddenly your game has juice -- those satisfying visual pops that make clicking feel rewarding.
    </div>
    <div class="callout">
      <strong>"Make circles speed up every 5 seconds."</strong> Now you have a difficulty curve. The game gets harder as time runs out.
    </div>
    <div class="callout">
      <strong>"Add a combo system -- clicking 3 circles within 1 second gives bonus points."</strong> Depth. Strategy. Replayability. Three words in a prompt.
    </div>
    <p>Each iteration takes seconds. You're not debugging for hours -- you're designing, and AI is implementing. This is the loop you'll use for the rest of the course.</p>
  </div>
</div>

<div class="lesson-section">
  <span class="section-label">Under the Hood</span>
  <h2 class="section-title">What just happened, technically.</h2>
  <div class="section-text">
    <p>Even though AI wrote the code, understanding the basics helps you prompt better. Your game uses three core concepts:</p>
    <p><strong>The Game Loop:</strong> A function that runs 60 times per second, updating positions and redrawing everything. This is the heartbeat of every game.</p>
    <p><strong>The Canvas:</strong> An HTML element that lets you draw shapes, images, and text with JavaScript. Think of it as a digital whiteboard that refreshes 60 times a second.</p>
    <p><strong>Event Listeners:</strong> Code that listens for clicks, touches, and keyboard inputs. This is how your game responds to the player.</p>
    <div class="tip-box">
      <strong>You don't need to memorize this.</strong> But knowing these three concepts lets you ask AI smarter questions. "Adjust the game loop timing" is a better prompt than "make it faster somehow."
    </div>
  </div>
</div>

<div class="lesson-section">
  <span class="section-label">Quick Check</span>
  <h2 class="section-title">Lock it in.</h2>
  <div data-learn="QuizMC" data-props='{"questions":[{"q":"What makes a good AI game prompt?","options":["Keep it vague so AI has creative freedom","Be as specific as possible about mechanics, elements, and constraints","Always ask for 3D graphics","Only use one-word descriptions"],"correct":1,"explanation":"Specificity is key. Describing the exact mechanic, visual elements, and technical constraints gives AI everything it needs to generate a working game."},{"q":"What is the game loop?","options":["A type of for-loop in JavaScript","A function that runs 60 times per second updating and redrawing the game","The process of publishing a game","A marketing strategy for games"],"correct":1,"explanation":"The game loop is the heartbeat of every game -- a function running ~60fps that updates game state and redraws the screen each frame."}]}'></div>
</div>

<div class="lesson-section">
  <span class="section-label">Review</span>
  <h2 class="section-title">Key concepts to remember.</h2>
  <div data-learn="FlashDeck" data-props='{"title":"Your First Game","cards":[{"front":"What do you need to start building browser games?","back":"A browser, a text editor (VS Code recommended), and an AI assistant. No installs or frameworks required."},{"front":"What is HTML5 Canvas?","back":"An HTML element that lets you draw shapes, images, and text with JavaScript -- like a digital whiteboard refreshing 60 times per second."},{"front":"What is the AI iteration loop?","back":"Prompt AI for a game, test it, then prompt for improvements. Each cycle takes seconds instead of hours."},{"front":"What three concepts power every browser game?","back":"The game loop (60fps updates), the Canvas (drawing surface), and event listeners (player input handling)."}]}'></div>
</div>
</div>
