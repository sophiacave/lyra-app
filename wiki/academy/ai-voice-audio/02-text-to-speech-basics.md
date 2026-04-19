# Text-to-Speech Basics

**Course:** AI Voice & Audio Engineering
**Order:** 2
**Type:** lesson
**Access:** Free

---
[← AI Voice & Audio](/academy/ai-voice-audio/)
  Lesson 2 of 10


  # Text-to-Speech Basics

  The words are yours. The voice is AI. The craft is knowing which knobs to turn.


  ### What You'll Learn


    - How modern TTS engines actually work under the hood

    - The top TTS platforms and when to use each one

    - How to write text that sounds natural when spoken

    - SSML and prosody controls for fine-tuning delivery




  Foundation
  ## How TTS Went From Robot to Real

  Old TTS was concatenative — it stitched together tiny chunks of recorded speech. It sounded mechanical because it was mechanical. Modern TTS is neural. It learns the patterns of human speech from thousands of hours of recordings and generates audio from scratch, one waveform at a time.
  The breakthrough models — Tacotron, VITS, VALL-E, and their descendants — don't just read words. They understand emphasis, rhythm, and the subtle musicality of natural conversation. The result is speech that can fool most listeners most of the time.


  Tools
  ## The TTS Landscape

  **ElevenLabs:** The current quality leader. Exceptional emotional range, multilingual support, and the best voice cloning integration. Free tier is generous. Pro plans start at $5/month.
  **OpenAI TTS:** Built into the API. Six voices, simple to use, great for developers building apps. Less customization than ElevenLabs but rock-solid reliability.
  **Google Cloud TTS:** Enterprise-grade. Hundreds of voices across 40+ languages. WaveNet and Neural2 voices are excellent. Pay-per-character pricing keeps costs predictable.
  **Coqui / XTTS:** Open-source option. Run it locally, no API costs, full control. Quality is slightly behind the commercial options but improving fast.
  **Edge TTS:** Microsoft's free option via the Edge browser engine. Surprisingly good quality for zero cost. Great for prototyping.


  Craft
  ## Writing for the Ear

  Text written for reading and text written for speaking are fundamentally different. Your eyes can re-read a complex sentence. Your ears get one shot. Good TTS input follows these principles:
  Keep sentences short. Use contractions — "don't" sounds natural, "do not" sounds formal. Break long thoughts with punctuation. Use ellipses for pauses... and dashes for — emphasis shifts. Spell out numbers and abbreviations when you want consistent pronunciation.
  SSML (Speech Synthesis Markup Language) gives you fine control. You can adjust rate, pitch, volume, add breaks, and specify pronunciation. Not every platform supports it, but when it's available, it's your best friend for polishing output.


  Deep Dive
  ## TTS Platform Comparison: Cost, Quality, and Use Cases

  Choosing the right TTS platform depends on your project type, budget, and technical requirements. Here is a detailed breakdown:
  **ElevenLabs** — Best for: content creators, voiceover, audiobooks. Free tier: 10,000 characters/month. Starter plan: $5/month for 30,000 characters. Strengths: emotional range, multilingual (29 languages), voice cloning built in. Weakness: can sound slightly over-processed on dry technical content.
  **OpenAI TTS** — Best for: developers building apps, quick prototypes. Pricing: $15/million characters (tts-1), $30/million characters (tts-1-hd). Strengths: dead-simple API, rock-solid reliability, consistent output. Weakness: only six voices, no voice cloning, limited customization.
  **Google Cloud TTS** — Best for: enterprise, multilingual apps, IVR systems. Pricing: free for first 4 million characters/month (standard), $4-16/million for WaveNet/Neural2. Strengths: 220+ voices, 40+ languages, SSML support. Weakness: requires GCP account setup, more complex integration.
  **Coqui / XTTS** — Best for: privacy-sensitive projects, offline use, experimentation. Cost: free (open-source). Strengths: runs locally, no data leaves your machine, full customization. Weakness: requires technical setup, quality slightly behind commercial options.
  **Edge TTS** — Best for: prototyping, budget projects, bulk generation. Cost: free. Strengths: surprisingly good quality for zero cost, easy Python library (edge-tts). Weakness: limited voice customization, depends on Microsoft servers.


  Code Example
  ## TTS API Integration in Python

  Here is how to call three different TTS APIs from Python. Each example generates speech from the same text so you can compare outputs directly:
  `# --- OpenAI TTS ---
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
asyncio.run(generate())`
  Run all three scripts and compare the output files. Notice the differences in naturalness, pacing, and warmth. This comparison exercise is the fastest way to develop your ear for TTS quality and choose the right tool for each project.


  Advanced Craft
  ## SSML Mastery: Fine-Tuning Every Syllable

  SSML is your precision tool. While basic text input gets you 80% of the way, SSML handles the remaining 20% — the pauses that create drama, the emphasis that drives meaning, the pronunciation that prevents embarrassing errors.
  Here is a complete SSML example that demonstrates the most useful tags working together:
  `

    Welcome to Signal and Noise.


  Today we are talking about
  the future of voice.

  Not the AI hype.

  The real, practical, ship-it-tomorrow future.

  Let's get into it.
`
  **Pro tips for SSML:** Use `` tags generously — they create the breathing room that makes AI speech feel human. The `` tag's rate attribute accepts percentages (90% for slower, 110% for faster) or keywords (slow, medium, fast). The `` tag prevents the AI from mangling dates, acronyms, and phone numbers.
  **Platform support:** Google Cloud TTS has the most complete SSML implementation. Amazon Polly is a close second. ElevenLabs supports a subset and uses its own style tags for emotion. OpenAI TTS does not support SSML — it relies on punctuation and natural language cues instead.


  Production Tips
  ## Common TTS Mistakes and How to Fix Them

  Even the best TTS engines produce flawed output if you feed them poorly prepared text. Here are the most common mistakes and their fixes:
  **Mistake: Long, complex sentences.** Fix: Break sentences at natural breath points. If a sentence has more than one comma, split it into two sentences. TTS handles short, punchy sentences dramatically better than long compound ones.
  **Mistake: Ambiguous abbreviations.** Fix: Spell out "Dr." as "Doctor," "St." as "Street" or "Saint" depending on context, "Mr." as "Mister." TTS engines guess, and they guess wrong more often than you'd expect.
  **Mistake: Numbers without context.** Fix: Write "fifteen dollars" not "$15." Write "March twenty-seventh" not "3/27." Write "two point five million" not "2.5M." Control exactly how numbers are spoken.
  **Mistake: Missing emotional cues.** Fix: Use exclamation points for energy, ellipses for thoughtful pauses, em dashes for dramatic shifts. TTS engines read punctuation as performance cues — give them more to work with.
  **Mistake: Ignoring the first and last sentences.** Fix: The opening sentence sets the voice's tone for the entire piece. The closing sentence is what the listener remembers. Write these two sentences with extra care — they carry disproportionate weight in audio.
  **Mistake: Not testing with headphones.** Fix: Laptop speakers hide artifacts that headphones reveal — mouth clicks, background hum, sibilance, and unnatural pauses. Always do your quality check on headphones. What sounds fine on speakers can sound terrible in earbuds, and earbuds are how most people consume audio content.


  Use Cases
  ## Real-World TTS Applications

  TTS is not just for podcasts and audiobooks. Here are the highest-value applications across industries:
  **E-learning and courses:** Convert written course materials into narrated audio. Students can listen during commutes, workouts, or chores. AI narration makes it economically viable to offer audio versions of every lesson without hiring voice talent.
  **Accessibility:** Screen readers powered by natural-sounding TTS transform the web experience for visually impaired users. The gap between robotic screen reader voices and natural speech has always been a barrier to comfortable, extended use. Neural TTS closes that gap.
  **Customer support:** Interactive voice response (IVR) systems powered by neural TTS sound dramatically better than the robotic menus everyone hates. Natural-sounding voices reduce caller frustration and abandonment rates.
  **Content localization:** Translate your content into 30+ languages and generate native-sounding narration for each. What used to require hiring voice actors in each market now requires a single API call per language. Global reach at local production cost.
  **Internal communications:** Convert company newsletters, policy updates, and training materials into audio. Employees can listen during their commute instead of reading yet another email. Engagement with audio versions is typically 2-3x higher than text.


  ### SSML Quick Reference

  `` — Insert a pause
  `word` — Add emphasis
  `text` — Adjust speaking speed
  `2026-03-27` — Format interpretation


  Workflow
  ## Building a TTS Production Workflow

  Professional TTS output requires a systematic workflow, not just a single generation pass. Here is the pipeline used by studios and content teams producing at scale:
  **Step 1 — Script preparation:** Write or edit your text specifically for spoken delivery. Read it aloud yourself first. Every sentence that trips your tongue will trip the AI too. Mark pronunciation guides for unusual words. Add punctuation cues for pacing.
  **Step 2 — Voice selection:** Generate the first paragraph with 3-5 different voices. Listen back-to-back. Choose the voice that matches your content's personality — warm for memoir, clear for tutorials, energetic for marketing. This five-minute audition saves hours of rework later.
  **Step 3 — Generation in segments:** Generate content in chunks of 2-3 paragraphs rather than all at once. This prevents the AI voice from drifting in tone or energy over long passages. It also gives you natural edit points if you need to regenerate a section.
  **Step 4 — Quality review:** Listen to every generated segment with headphones. Check for mispronunciations, unnatural pauses, odd inflections, and energy drops. Regenerate any segment that does not meet your standard — it costs pennies and saves your reputation.
  **Step 5 — Post-processing:** Run the final audio through Auphonic or your mastering chain. Normalize loudness to your platform's standard. Add room tone, intro/outro, and any music beds. Export in the required format.


  ### Try It: The Same Text, Three Ways

  Take this paragraph and generate it on **three different TTS platforms**. Compare the results:
  `I didn't expect it to work. But when I pressed play and heard my own words come back to me in a voice that wasn't mine — a voice that somehow understood where to pause, where to push — I realized the game had changed.`
  Notice how each platform handles the em-dash, the emotional arc, and the final phrase. These differences define your tool choice for real projects.


  Quick Review
  ## TTS Platform Strengths


  Key Terms
  ## TTS Vocabulary


### Text-to-Speech Key Concepts

**Card 1:**
Front: Concatenative TTS
Back: The old approach — stitching together tiny pre-recorded chunks of speech — which is why it sounded mechanical and robotic

**Card 2:**
Front: Neural TTS
Back: Modern approach that learns speech patterns from thousands of hours of recordings and generates audio from scratch, one waveform at a time

**Card 3:**
Front: SSML
Back: Speech Synthesis Markup Language — gives fine control over delivery including pauses, emphasis, speaking rate, pitch, and pronunciation

**Card 4:**
Front: Prosody
Back: The rhythm, stress, and intonation of speech — what makes the difference between a flat reading and natural conversation

**Card 5:**
Front: Writing for the ear
Back: Short sentences, contractions, punctuation for pauses, spelled-out numbers — text written for listening, not reading, because ears only get one shot


  Check Your Understanding
  ## Lesson 2 Quiz


### Quiz

**Q1: What is the fundamental difference between old concatenative TTS and modern neural TTS?**
    A. Old TTS was faster
  ✓ B. Old TTS stitched together recorded chunks — modern TTS generates audio from scratch using learned speech patterns
    C. Neural TTS only works in English
    D. Modern TTS requires more computing power but sounds the same
  *Old TTS mechanically stitched together pre-recorded speech fragments — which is why it sounded robotic. Neural TTS learns patterns from thousands of hours of recordings and generates waveforms from scratch, producing natural-sounding results.*

**Q2: What is the key writing principle for text that will be converted to speech?**
    A. Use complex, sophisticated vocabulary
    B. Write the same way you would for a printed document
  ✓ C. Keep sentences short, use contractions, and use punctuation to create natural pauses
    D. Always spell out every number in full
  *Your ears get one shot at audio — unlike eyes that can re-read. Short sentences, contractions like don't instead of do not, and ellipses or dashes for pauses help TTS output sound natural.*

**Q3: What does SSML stand for and what is it used for?**
    A. Simple Speech Markup Layer — for adding sound effects
  ✓ B. Speech Synthesis Markup Language — for fine-tuning delivery rate, pitch, volume, breaks, and pronunciation
    C. Streaming Speech Memory Language — for real-time audio
    D. Standard Sound Module Language — for equalizer settings
  *SSML is Speech Synthesis Markup Language — it gives you fine control over how TTS reads your text, including pauses, emphasis, speaking speed, and specific pronunciation of words.*


  [← The Voice Revolution](/academy/ai-voice-audio/the-voice-revolution/)
  [Next: Voice Cloning & Custom Voices →](/academy/ai-voice-audio/voice-cloning-and-custom-voices/)
