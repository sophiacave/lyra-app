---
title: "Text-to-Speech Basics"
course: "ai-voice-audio"
order: 2
type: "lesson"
---

<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-voice-audio/">← AI Voice & Audio</a>
  <span class="lesson-badge">Lesson 2 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Text-to-Speech <span class="accent">Basics</span></h1>
  <p class="hero-sub">The words are yours. The voice is AI. The craft is knowing which knobs to turn.</p>
</div>

<div class="learn-card">
  <h3>What You'll Learn</h3>
  <ul>
    <li>How modern TTS engines actually work under the hood</li>
    <li>The top TTS platforms and when to use each one</li>
    <li>How to write text that sounds natural when spoken</li>
    <li>SSML and prosody controls for fine-tuning delivery</li>
  </ul>
</div>

<div class="lesson-section">
  <span class="section-label">Foundation</span>
  <h2 class="section-title">How TTS Went From Robot to Real</h2>
  <p class="section-text">Old TTS was concatenative — it stitched together tiny chunks of recorded speech. It sounded mechanical because it was mechanical. Modern TTS is neural. It learns the patterns of human speech from thousands of hours of recordings and generates audio from scratch, one waveform at a time.</p>
  <p class="section-text">The breakthrough models — Tacotron, VITS, VALL-E, and their descendants — don't just read words. They understand emphasis, rhythm, and the subtle musicality of natural conversation. The result is speech that can fool most listeners most of the time.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Tools</span>
  <h2 class="section-title">The TTS Landscape</h2>
  <p class="section-text"><strong style="color: var(--orange);">ElevenLabs:</strong> The current quality leader. Exceptional emotional range, multilingual support, and the best voice cloning integration. Free tier is generous. Pro plans start at $5/month.</p>
  <p class="section-text"><strong style="color: var(--purple);">OpenAI TTS:</strong> Built into the API. Six voices, simple to use, great for developers building apps. Less customization than ElevenLabs but rock-solid reliability.</p>
  <p class="section-text"><strong style="color: var(--green);">Google Cloud TTS:</strong> Enterprise-grade. Hundreds of voices across 40+ languages. WaveNet and Neural2 voices are excellent. Pay-per-character pricing keeps costs predictable.</p>
  <p class="section-text"><strong style="color: var(--blue);">Coqui / XTTS:</strong> Open-source option. Run it locally, no API costs, full control. Quality is slightly behind the commercial options but improving fast.</p>
  <p class="section-text"><strong style="color: var(--red);">Edge TTS:</strong> Microsoft's free option via the Edge browser engine. Surprisingly good quality for zero cost. Great for prototyping.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Craft</span>
  <h2 class="section-title">Writing for the Ear</h2>
  <p class="section-text">Text written for reading and text written for speaking are fundamentally different. Your eyes can re-read a complex sentence. Your ears get one shot. Good TTS input follows these principles:</p>
  <p class="section-text">Keep sentences short. Use contractions — "don't" sounds natural, "do not" sounds formal. Break long thoughts with punctuation. Use ellipses for pauses... and dashes for — emphasis shifts. Spell out numbers and abbreviations when you want consistent pronunciation.</p>
  <p class="section-text">SSML (Speech Synthesis Markup Language) gives you fine control. You can adjust rate, pitch, volume, add breaks, and specify pronunciation. Not every platform supports it, but when it's available, it's your best friend for polishing output.</p>
</div>

<div class="demo-container">
  <h3>SSML Quick Reference</h3>
  <p><code>&lt;break time="500ms"/&gt;</code> — Insert a pause</p>
  <p><code>&lt;emphasis level="strong"&gt;word&lt;/emphasis&gt;</code> — Add emphasis</p>
  <p><code>&lt;prosody rate="slow"&gt;text&lt;/prosody&gt;</code> — Adjust speaking speed</p>
  <p><code>&lt;say-as interpret-as="date"&gt;2026-03-27&lt;/say-as&gt;</code> — Format interpretation</p>
</div>

<div class="try-it-box">
  <h3>Try It: The Same Text, Three Ways</h3>
  <p>Take this paragraph and generate it on <strong>three different TTS platforms</strong>. Compare the results:</p>
  <div class="prompt-box"><code>I didn't expect it to work. But when I pressed play and heard my own words come back to me in a voice that wasn't mine — a voice that somehow understood where to pause, where to push — I realized the game had changed.</code></div>
  <p>Notice how each platform handles the em-dash, the emotional arc, and the final phrase. These differences define your tool choice for real projects.</p>
</div>

<nav class="lesson-nav">
  <a href="/academy/ai-voice-audio/the-voice-revolution/" class="prev">← The Voice Revolution</a>
  <a href="/academy/ai-voice-audio/voice-cloning-and-custom-voices/" class="next">Next: Voice Cloning & Custom Voices →</a>
</nav>

</div>
