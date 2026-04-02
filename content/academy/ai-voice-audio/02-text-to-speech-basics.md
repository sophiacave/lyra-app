---
title: "Text-to-Speech Basics"
course: "ai-voice-audio"
order: 2
type: "lesson"
free: true
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

<div class="lesson-section">
  <span class="section-label">Deep Dive</span>
  <h2 class="section-title">TTS Platform Comparison: Cost, Quality, and Use Cases</h2>
  <p class="section-text">Choosing the right TTS platform depends on your project type, budget, and technical requirements. Here is a detailed breakdown:</p>
  <p class="section-text"><strong style="color: var(--orange);">ElevenLabs</strong> — Best for: content creators, voiceover, audiobooks. Free tier: 10,000 characters/month. Starter plan: $5/month for 30,000 characters. Strengths: emotional range, multilingual (29 languages), voice cloning built in. Weakness: can sound slightly over-processed on dry technical content.</p>
  <p class="section-text"><strong style="color: var(--purple);">OpenAI TTS</strong> — Best for: developers building apps, quick prototypes. Pricing: $15/million characters (tts-1), $30/million characters (tts-1-hd). Strengths: dead-simple API, rock-solid reliability, consistent output. Weakness: only six voices, no voice cloning, limited customization.</p>
  <p class="section-text"><strong style="color: var(--green);">Google Cloud TTS</strong> — Best for: enterprise, multilingual apps, IVR systems. Pricing: free for first 4 million characters/month (standard), $4-16/million for WaveNet/Neural2. Strengths: 220+ voices, 40+ languages, SSML support. Weakness: requires GCP account setup, more complex integration.</p>
  <p class="section-text"><strong style="color: var(--blue);">Coqui / XTTS</strong> — Best for: privacy-sensitive projects, offline use, experimentation. Cost: free (open-source). Strengths: runs locally, no data leaves your machine, full customization. Weakness: requires technical setup, quality slightly behind commercial options.</p>
  <p class="section-text"><strong style="color: var(--red);">Edge TTS</strong> — Best for: prototyping, budget projects, bulk generation. Cost: free. Strengths: surprisingly good quality for zero cost, easy Python library (edge-tts). Weakness: limited voice customization, depends on Microsoft servers.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Code Example</span>
  <h2 class="section-title">TTS API Integration in Python</h2>
  <p class="section-text">Here is how to call three different TTS APIs from Python. Each example generates speech from the same text so you can compare outputs directly:</p>
  <div class="prompt-box"><code># --- OpenAI TTS ---
from openai import OpenAI
client = OpenAI()
response = client.audio.speech.create(
    model="tts-1-hd",
    voice="nova",
    input="Writing for the ear is fundamentally different from writing for the eye."
)
response.stream_to_file("openai_output.mp3")

# --- ElevenLabs TTS ---
import requests
url = "https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM"
headers = {"xi-api-key": "YOUR_KEY", "Content-Type": "application/json"}
data = {
    "text": "Writing for the ear is fundamentally different from writing for the eye.",
    "model_id": "eleven_multilingual_v2",
    "voice_settings": {"stability": 0.5, "similarity_boost": 0.75}
}
response = requests.post(url, json=data, headers=headers)
with open("elevenlabs_output.mp3", "wb") as f:
    f.write(response.content)

# --- Edge TTS (free, no API key) ---
import edge_tts, asyncio
async def generate():
    communicate = edge_tts.Communicate(
        "Writing for the ear is fundamentally different from writing for the eye.",
        "en-US-JennyNeural"
    )
    await communicate.save("edge_output.mp3")
asyncio.run(generate())</code></div>
  <p class="section-text">Run all three scripts and compare the output files. Notice the differences in naturalness, pacing, and warmth. This comparison exercise is the fastest way to develop your ear for TTS quality and choose the right tool for each project.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Advanced Craft</span>
  <h2 class="section-title">SSML Mastery: Fine-Tuning Every Syllable</h2>
  <p class="section-text">SSML is your precision tool. While basic text input gets you 80% of the way, SSML handles the remaining 20% — the pauses that create drama, the emphasis that drives meaning, the pronunciation that prevents embarrassing errors.</p>
  <p class="section-text">Here is a complete SSML example that demonstrates the most useful tags working together:</p>
  <div class="prompt-box"><code>&lt;speak&gt;
  &lt;prosody rate="95%" pitch="+2%"&gt;
    Welcome to Signal and Noise.
  &lt;/prosody&gt;
  &lt;break time="800ms"/&gt;
  Today we are talking about
  &lt;emphasis level="strong"&gt;the future of voice.&lt;/emphasis&gt;
  &lt;break time="400ms"/&gt;
  Not the &lt;say-as interpret-as="spell-out"&gt;AI&lt;/say-as&gt; hype.
  &lt;break time="300ms"/&gt;
  The real, practical, &lt;prosody rate="slow"&gt;ship-it-tomorrow&lt;/prosody&gt; future.
  &lt;break time="600ms"/&gt;
  Let's get into it.
&lt;/speak&gt;</code></div>
  <p class="section-text"><strong>Pro tips for SSML:</strong> Use <code>&lt;break&gt;</code> tags generously — they create the breathing room that makes AI speech feel human. The <code>&lt;prosody&gt;</code> tag's rate attribute accepts percentages (90% for slower, 110% for faster) or keywords (slow, medium, fast). The <code>&lt;say-as&gt;</code> tag prevents the AI from mangling dates, acronyms, and phone numbers.</p>
  <p class="section-text"><strong>Platform support:</strong> Google Cloud TTS has the most complete SSML implementation. Amazon Polly is a close second. ElevenLabs supports a subset and uses its own style tags for emotion. OpenAI TTS does not support SSML — it relies on punctuation and natural language cues instead.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Production Tips</span>
  <h2 class="section-title">Common TTS Mistakes and How to Fix Them</h2>
  <p class="section-text">Even the best TTS engines produce flawed output if you feed them poorly prepared text. Here are the most common mistakes and their fixes:</p>
  <p class="section-text"><strong>Mistake: Long, complex sentences.</strong> Fix: Break sentences at natural breath points. If a sentence has more than one comma, split it into two sentences. TTS handles short, punchy sentences dramatically better than long compound ones.</p>
  <p class="section-text"><strong>Mistake: Ambiguous abbreviations.</strong> Fix: Spell out "Dr." as "Doctor," "St." as "Street" or "Saint" depending on context, "Mr." as "Mister." TTS engines guess, and they guess wrong more often than you'd expect.</p>
  <p class="section-text"><strong>Mistake: Numbers without context.</strong> Fix: Write "fifteen dollars" not "$15." Write "March twenty-seventh" not "3/27." Write "two point five million" not "2.5M." Control exactly how numbers are spoken.</p>
  <p class="section-text"><strong>Mistake: Missing emotional cues.</strong> Fix: Use exclamation points for energy, ellipses for thoughtful pauses, em dashes for dramatic shifts. TTS engines read punctuation as performance cues — give them more to work with.</p>
  <p class="section-text"><strong>Mistake: Ignoring the first and last sentences.</strong> Fix: The opening sentence sets the voice's tone for the entire piece. The closing sentence is what the listener remembers. Write these two sentences with extra care — they carry disproportionate weight in audio.</p>
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

<div class="lesson-section">
  <span class="section-label">Quick Review</span>
  <h2 class="section-title">TTS Platform Strengths</h2>
</div>

<div class="lesson-section">
  <span class="section-label">Key Terms</span>
  <h2 class="section-title">TTS Vocabulary</h2>
  <div data-learn="FlashDeck" data-props='{"title":"Text-to-Speech Key Concepts","cards":[{"front":"Concatenative TTS","back":"The old approach — stitching together tiny pre-recorded chunks of speech — which is why it sounded mechanical and robotic"},{"front":"Neural TTS","back":"Modern approach that learns speech patterns from thousands of hours of recordings and generates audio from scratch, one waveform at a time"},{"front":"SSML","back":"Speech Synthesis Markup Language — gives fine control over delivery including pauses, emphasis, speaking rate, pitch, and pronunciation"},{"front":"Prosody","back":"The rhythm, stress, and intonation of speech — what makes the difference between a flat reading and natural conversation"},{"front":"Writing for the ear","back":"Short sentences, contractions, punctuation for pauses, spelled-out numbers — text written for listening, not reading, because ears only get one shot"}]}'></div>
</div>

<div class="lesson-section">
  <span class="section-label">Check Your Understanding</span>
  <h2 class="section-title">Lesson 2 Quiz</h2>
  <div data-learn="QuizMC" data-props='{"title":"Text-to-Speech Basics","questions":[{"q":"What is the fundamental difference between old concatenative TTS and modern neural TTS?","options":["Old TTS was faster","Old TTS stitched together recorded chunks — modern TTS generates audio from scratch using learned speech patterns","Neural TTS only works in English","Modern TTS requires more computing power but sounds the same"],"correct":1,"explanation":"Old TTS mechanically stitched together pre-recorded speech fragments — which is why it sounded robotic. Neural TTS learns patterns from thousands of hours of recordings and generates waveforms from scratch, producing natural-sounding results."},{"q":"What is the key writing principle for text that will be converted to speech?","options":["Use complex, sophisticated vocabulary","Write the same way you would for a printed document","Keep sentences short, use contractions, and use punctuation to create natural pauses","Always spell out every number in full"],"correct":2,"explanation":"Your ears get one shot at audio — unlike eyes that can re-read. Short sentences, contractions like don&#39;t instead of do not, and ellipses or dashes for pauses help TTS output sound natural."},{"q":"What does SSML stand for and what is it used for?","options":["Simple Speech Markup Layer — for adding sound effects","Speech Synthesis Markup Language — for fine-tuning delivery rate, pitch, volume, breaks, and pronunciation","Streaming Speech Memory Language — for real-time audio","Standard Sound Module Language — for equalizer settings"],"correct":1,"explanation":"SSML is Speech Synthesis Markup Language — it gives you fine control over how TTS reads your text, including pauses, emphasis, speaking speed, and specific pronunciation of words."}]}'></div>
</div>

<nav class="lesson-nav">
  <a href="/academy/ai-voice-audio/the-voice-revolution/" class="prev">← The Voice Revolution</a>
  <a href="/academy/ai-voice-audio/voice-cloning-and-custom-voices/" class="next">Next: Voice Cloning & Custom Voices →</a>
</nav>

</div>
