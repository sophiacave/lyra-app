---
title: "Publishing to Web, itch.io & App Stores"
course: "ai-game-dev"
order: 9
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-game-dev/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 9 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Publishing to Web, <span class="accent">itch.io & App Stores.</span></h1>
  <p class="sub">Your game isn't real until people can play it. Let's ship.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul><li>How to deploy your game to the web for free in under 5 minutes</li><li>How to publish on itch.io and reach the indie game community</li><li>The app store submission process for iOS and Android</li><li>Marketing basics that get your game noticed on launch day</li></ul>
</div>

<div class="lesson-section">
  <span class="section-label">Web Deploy</span>
  <h2 class="section-title">Free hosting, instant deploy.</h2>
  <div class="section-text">
    <p>Your HTML5 game is already a website. Hosting it is trivial and free.</p>
    <div class="callout">
      <strong>Vercel:</strong> Connect your GitHub repo. Every push auto-deploys. Free tier handles thousands of players. Takes 2 minutes to set up.
    </div>
    <div class="callout">
      <strong>Netlify:</strong> Drag and drop your game folder onto netlify.com. Instant deploy with a free URL. Zero configuration.
    </div>
    <div class="callout">
      <strong>GitHub Pages:</strong> Push to a repo, enable Pages in settings. Your game lives at yourusername.github.io/game-name. Free forever.
    </div>
    <p>All three options give you HTTPS (required for service workers/PWA), custom domain support, and global CDN distribution. Your game loads fast everywhere on the planet.</p>
    <div class="tip-box">
      <strong>Custom domain:</strong> A game at yourgame.com looks more professional than a subdomain. Domains cost around $10/year. Worth it if you're serious about your game.
    </div>
  </div>
</div>

<div class="lesson-section">
  <span class="section-label">itch.io</span>
  <h2 class="section-title">The indie game marketplace.</h2>
  <div class="section-text">
    <p>itch.io is where indie games live. It's free to publish, has a built-in audience of gamers looking for new experiences, and supports HTML5 games natively -- players play right in the browser.</p>
    <p><strong>Publishing steps:</strong></p>
    <p>1. Create an itch.io account (free). 2. Click "Upload new project." 3. Set the type to "HTML" and upload your game files as a ZIP. 4. Set your pricing (free, pay-what-you-want, or fixed price). 5. Write a compelling description and upload screenshots. 6. Publish.</p>
    <p>The itch.io community is supportive and loves experimental games. Game jams on itch.io are also incredible for visibility -- enter a jam, ship a game in 48 hours, and get hundreds of plays and feedback.</p>
    <div class="callout">
      <strong>Monetization on itch.io:</strong> "Pay what you want" with a suggested price of $2-5 performs best. Players who enjoy your game often pay voluntarily. Some indie devs make consistent side income this way.
    </div>
  </div>
</div>

<div class="lesson-section">
  <span class="section-label">App Stores</span>
  <h2 class="section-title">Going native (when it makes sense).</h2>
  <div class="section-text">
    <p>App stores give you access to billions of users but come with friction: review processes, annual fees, and platform rules.</p>
    <p><strong>Google Play (Android):</strong> One-time $25 fee. Wrap your HTML5 game with Capacitor or TWA (Trusted Web Activity). TWA is essentially a full-screen Chrome wrapper -- your web game runs natively. Review takes hours to days.</p>
    <p><strong>Apple App Store (iOS):</strong> $99/year developer fee. Use Capacitor to wrap your game. Apple's review is stricter and takes 1-3 days. They'll reject games that are "too simple" -- add enough polish and content.</p>
    <div class="tip-box">
      <strong>The smart path:</strong> Launch on web and itch.io first. Validate that people enjoy your game. Then invest in app store publishing only if you have traction. Don't pay fees for a game nobody's played yet.
    </div>
  </div>
</div>

<div class="lesson-section">
  <span class="section-label">Launch Marketing</span>
  <h2 class="section-title">Nobody finds your game by accident.</h2>
  <div class="section-text">
    <p>You built it. Now they need to come. Marketing doesn't have to be complicated, but it does have to exist.</p>
    <p><strong>Pre-launch (1 week before):</strong> Record a 30-second gameplay GIF or video. Post it to Reddit (r/indiegaming, r/webgames), Twitter/X, and relevant Discord servers. Build anticipation.</p>
    <p><strong>Launch day:</strong> Post everywhere simultaneously. Link directly to the playable game (remove all friction). Ask friends to play and share. Respond to every comment.</p>
    <p><strong>Post-launch:</strong> Track what players say. Update based on feedback. Each update is another reason to post about your game.</p>
    <div class="callout">
      <strong>The #1 marketing truth:</strong> A playable link beats every trailer, screenshot, and description. When you share your game, the call to action is always "play it now" -- not "watch this video about it."
    </div>
  </div>
</div>

<div class="lesson-section">
  <span class="section-label">Quick Check</span>
  <h2 class="section-title">Lock it in.</h2>
  <div data-learn="QuizMC" data-props='{"questions":[{"q":"What is the smartest publishing strategy for a first game?","options":["Go straight to the Apple App Store","Launch on web and itch.io first, then app stores only if you have traction","Only publish on your personal website","Wait until the game is perfect before showing anyone"],"correct":1,"explanation":"Web and itch.io are free, instant, and give you real player feedback. Only invest in app store fees after you&#39;ve validated that people enjoy your game."},{"q":"What performs best for monetization on itch.io?","options":["Fixed price of $20+","Free with no payment option","Pay-what-you-want with a suggested price of $2-5","Monthly subscription model"],"correct":2,"explanation":"Pay-what-you-want with a $2-5 suggestion works best on itch.io. Players who enjoy your game often pay voluntarily, and the low barrier drives more plays."}]}'></div>
</div>

<div class="lesson-section">
  <span class="section-label">Review</span>
  <h2 class="section-title">Key concepts to remember.</h2>
  <div data-learn="FlashDeck" data-props='{"title":"Publishing Games","cards":[{"front":"What are the three free web hosting options for games?","back":"Vercel (auto-deploy from GitHub), Netlify (drag-and-drop), and GitHub Pages (free forever). All provide HTTPS and CDN."},{"front":"What is itch.io?","back":"The indie game marketplace. Free to publish, supports HTML5 games natively, has a built-in audience, and game jams for visibility."},{"front":"What is a TWA for Android publishing?","back":"Trusted Web Activity. A full-screen Chrome wrapper that lets your HTML5 web game run as a native Android app on Google Play."},{"front":"What is the #1 marketing truth for game launches?","back":"A playable link beats every trailer and screenshot. The call to action is always &#39;play it now,&#39; not &#39;watch this video about it.&#39;"}]}'></div>
</div>
</div>
