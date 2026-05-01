---
title: "Audio, Music & Soundtrack Production"
course: "ai-cinema"
order: 6
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-cinema/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 6 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Audio, Music & <span class="accent">Soundtrack Production.</span></h1>
  <p class="sub">Sound is half the experience. AI gives you a full studio for pennies.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>How to produce original soundtracks with Suno, Udio, and Timbre</li>
    <li>Voice acting and narration with ElevenLabs voice synthesis</li>
    <li>Sound design: ambient layers, foley, and spatial audio</li>
    <li>How to mix and master audio for cinematic delivery</li>
  </ul>
</div>

<div class="lesson-section">
<h2>The Audio Stack</h2>

AI cinema audio has four layers. Each layer uses different tools and techniques:

| Layer | Purpose | Tools | Cost |
|-------|---------|-------|------|
| Dialogue/VO | Character speech, narration | ElevenLabs, Parler TTS | $0.05-0.20/min |
| Music | Soundtrack, score | Suno, Udio | $0.02-0.10/track |
| Sound Design | Ambient, foley, SFX | ElevenLabs SFX, Freesound.org | $0.00-0.05 |
| Mix/Master | Final audio assembly | DaVinci Resolve, Timbre | $0.00-0.10 |

Total audio budget for a 3-minute short: $0.15-0.50. Traditional equivalent: $500-3,000.

The layers are produced independently and mixed together in post-production. This separation gives you full control over the balance between dialogue, music, and ambient sound.

<div class="tip-box">
Audio quality is where amateur AI films fail most visibly. The audience will forgive visual artifacts far more readily than bad audio. Invest time in your audio layers -- they carry emotional weight that video alone cannot.
</div>
</div>

<div class="lesson-section">
<h2>AI Music Production</h2>

Suno and Udio generate full-length songs and instrumental tracks from text prompts. For cinema, you need instrumental scores that serve the narrative without competing for attention.

**Suno prompt for cinematic score:**
```
Style: ambient cinematic score
Mood: melancholic, contemplative, building tension
Instruments: synthesizer pads, muted piano, distant strings,
  subtle electronic percussion
Tempo: 72 BPM
Duration: 3 minutes
Structure: slow build from minimal to full arrangement,
  climax at 2:00, resolve to quiet ending
Reference: Blade Runner 2049 soundtrack meets Radiohead
No vocals. No lyrics.
```

**Key principles for film scoring with AI:**

1. **Generate long, then cut.** Produce a 3-5 minute track and edit it to fit your scenes. Do not generate a separate track per scene -- musical continuity matters.

2. **Stem separation.** Use Timbre to separate your generated track into stems (drums, bass, synth, strings). This lets you duck music under dialogue and bring it up during visual-only moments.

```bash
# Timbre stem separation
timbre separate --input score.mp3 --stems vocals,drums,bass,other
# Output: score_drums.wav, score_bass.wav, score_other.wav
```

3. **Layer and loop.** Take the best 30-second section of a longer track and loop it as your foundation. Layer other generated elements on top for variation.

4. **Match tempo to edit.** If your cut rhythm is slow and contemplative, your music should be 60-80 BPM. Action sequences need 100-140 BPM. Tempo mismatch is immediately noticeable.

<div class="callout">
<strong>Licensing note:</strong> Suno and Udio tracks generated on paid plans are licensed for commercial use. Verify the current terms of service. Free tier generations may have restrictions on commercial distribution.
</div>
</div>

<div class="lesson-section">
<h2>Voice Acting with AI</h2>

ElevenLabs provides studio-quality voice synthesis with emotional control. For AI cinema, you need two types of voice output:

**Narration/Voice-over:**
```
1. Choose or clone a voice that matches your character
2. Write narration in short segments (1-2 sentences each)
3. Generate each segment separately for quality control
4. Settings: Stability 60-70%, Clarity 75-85%, Style 30-50%
5. Export as WAV (not MP3) for editing quality
```

**Character Dialogue:**
```
1. Create a separate voice for each character
2. Add emotional direction in brackets: [whispered], [urgent]
3. Use SSML tags for pacing: <break time="500ms"/>
4. Generate alternative takes (3-4 per line)
5. Pick the best take for each line
```

**Voice direction example:**
```
Text: "Every memory I extracted from them was real."
Voice: Keiko_v2 (custom clone)
Style: [quiet, tired, realization dawning]
Stability: 55% (more emotional variation)
Clarity: 80%
Pace: slow, with a pause before "real"

Alternative text with SSML:
"Every memory I extracted from them<break time="400ms"/>
was real."
```

For maximum quality, generate dialogue dry (no reverb or effects). Add room tone, reverb, and spatial positioning in the mix stage. This gives you full control over how the voice sits in the space.
</div>

<div class="lesson-section">
<h2>Sound Design: Building the World</h2>

AI-generated video is silent. Every sound must be deliberately placed. This is actually an advantage -- you control every element of the sonic environment.

Build your soundscape in three layers:

**Layer 1 - Room Tone / Ambience (continuous):**
The background sound that establishes location. City hum, rain, wind, indoor silence (which is never actually silent). This layer runs continuously under everything else.

```
Sources:
- Freesound.org (free, Creative Commons)
- ElevenLabs Sound Effects (AI-generated)
- Record your own with a phone (authenticity matters)

For "Rain Memory": City rain ambience loop, distant traffic,
  indoor room tone with rain audible through glass.
```

**Layer 2 - Foley / SFX (synchronous):**
Sounds synchronized to on-screen actions. Footsteps, door sounds, paper rustling, glass clinking. These must be timed precisely to the video.

```
Common foley needs in AI cinema:
- Footsteps (match surface: concrete, wet asphalt, wood)
- Fabric movement (character actions)
- Environmental interactions (doors, switches, objects)
- Weather-specific (rain on surfaces, thunder)
```

**Layer 3 - Design Elements (emotional):**
Non-literal sounds that enhance mood. Low drones for tension, reversed sounds for unease, high-frequency tones for alertness. These are the sounds the audience feels more than hears.

```
Tension drone: Low sine wave (40-80Hz) with slow LFO modulation
Unease: Reversed cymbal swell, gradually increasing
Revelation: High crystalline tone (2-4kHz) fading in
Heartbeat: Sub-bass pulse at 60-80 BPM for intimate moments
```

<div class="demo-container">
<h4>Exercise: Build a 30-Second Soundscape</h4>
Take one scene from your project. Generate: one ambient loop (rain or room tone), one music track (30 seconds via Suno), and one voice-over line (via ElevenLabs or any TTS). Layer them in DaVinci Resolve or any editor. Adjust levels so dialogue is clear, music supports but does not overpower, and ambience feels continuous.
</div>
</div>

<div class="lesson-section">
<h2>The Final Mix</h2>

Mixing is the process of balancing all audio layers for clarity and emotional impact. Standard cinematic mixing levels:

```
Dialogue/VO:    -12 to -6 dB  (loudest element)
Music:          -18 to -12 dB (support, not compete)
Ambience:       -24 to -18 dB (felt, not heard consciously)
Sound effects:  -15 to -9 dB  (momentary peaks for impact)
Master output:  -3 to -1 dB   (headroom for platforms)
```

In DaVinci Resolve's Fairlight page, create separate tracks for each layer. Use automation to duck music under dialogue and bring it up during visual-only moments. Apply a gentle compressor on the master bus to even out dynamics.

Export your final mix as:
- WAV 48kHz/24-bit for archival
- AAC 256kbps for YouTube
- Stereo for standard delivery
- 5.1 only if targeting film festival theatrical screenings
</div>

<QuizMC>
<Question text="Why should you generate voice-over 'dry' (without reverb or effects)?">
<Option text="AI voice synthesis cannot add reverb" />
<Option correct text="Dry recording gives full control over spatial positioning and room tone in the mix stage" />
<Option text="Reverb increases file size unnecessarily" />
<Option text="Film festivals require dry audio submissions" />
</Question>
<Question text="What are the three layers of a film soundscape?">
<Option text="Dialogue, music, and silence" />
<Option text="Foreground, midground, and background" />
<Option correct text="Room tone/ambience (continuous), foley/SFX (synchronous), and design elements (emotional)" />
<Option text="Bass, midrange, and treble frequencies" />
</Question>
</QuizMC>

<FlashDeck>
<Card front="What are the standard mixing levels for dialogue vs music in cinema?" back="Dialogue: -12 to -6 dB (loudest). Music: -18 to -12 dB (supporting). Ambience: -24 to -18 dB. Master output: -3 to -1 dB for platform headroom." />
<Card front="Why use stem separation on AI-generated music?" back="Separating into stems (drums, bass, synth, strings) lets you duck individual elements under dialogue and bring them up during visual-only moments, giving precise mix control." />
<Card front="What ElevenLabs settings produce the most emotional voice performance?" back="Lower stability (55-65%) allows more emotional variation. Clarity at 75-85%. Style at 30-50%. Generate multiple takes and pick the best per line." />
<Card front="What is the total audio budget for a 3-minute AI short film?" back="$0.15-0.50 total across voice ($0.05-0.20), music ($0.02-0.10), sound design ($0.00-0.05), and mixing ($0.00-0.10)." />
</FlashDeck>

</div>