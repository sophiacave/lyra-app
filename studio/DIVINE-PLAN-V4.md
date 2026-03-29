# DIVINE PLAN V4: PHOTOREAL CINEMA — The Final Form
## Written in Stone: 2026-03-28 | The Photoreal Pivot

---

## THE DIAGNOSIS

V3 built cinematic motion graphics — SVG animations, gradient art, kinetic type. Good engineering.
But it's still **animated slides with a robot voice**. That's not what changes lives. That's not what goes viral. That's not cinema.

### What 10/10 looks like NOW (the real standard):
- **Real humans** presenting — photoreal AI avatars with personality, warmth, soul
- **Cinematic B-roll** — photorealistic footage generated per-concept, not clipart
- **Voices with personality** — not TTS. PERSONAS. Named narrators with character.
- **Perfect sync** — lips match words. Cuts match beats. Silence has meaning.
- **Storytelling** — hook → tension → revelation → transformation. Not section → section.

### V3 vs V4:

| Layer | V3 (motion graphics) | V4 (photoreal cinema) |
|-------|---------------------|----------------------|
| Presenter | None — text on screen | Faye + named AI agents as photoreal avatars |
| Voice | Fish S2 Pro (robotic) | F5-TTS cloned personas + ElevenLabs polish |
| B-roll | SVG animations, dots | Runway/Kling photoreal cinematic footage |
| Sync | Approximate timing | Frame-perfect audio-video alignment |
| Narrative | Section → section | Cinematic arc: hook → build → aha → transform |
| Personality | Generic "educational" | Named personas with distinct voices + styles |
| Output | Remotion renders | FFmpeg composite: avatar + B-roll + overlays |

---

## THE PERSONA SYSTEM

Every Like One video has a **named presenter**. Not a voice. A person.

### Primary Personas:

**FAYE CAVE** — The Founder
- Role: Lead presenter for flagship content, manifestos, vision pieces
- Voice: Warm, confident, slightly irreverent. Speaks from experience.
- Avatar: Photoreal from reference photos/video. HeyGen or LivePortrait.
- Signature: "Let me show you something beautiful."
- Courses: AI Foundations, Ethics & Safety, personal storytelling

**LYRA** — The Technical Guide
- Role: Deep-dive technical content. The one who LOVES the math.
- Voice: Clear, precise, excited about complexity. Makes hard things feel elegant.
- Avatar: AI-generated persona. Professional, warm, slightly nerdy.
- Signature: "Here's where it gets interesting."
- Courses: RAG & Vectors, Building Systems, Architecture

**SAGE** — The Creative Coach
- Role: Creative applications, prompt writing, artistic use of AI
- Voice: Playful, encouraging, full of metaphors. The teacher who makes you brave.
- Avatar: AI-generated persona. Expressive, artistic energy.
- Signature: "Now it's your turn."
- Courses: Prompt Writing, Creatives, Personal Productivity

**ATLAS** — The Business Strategist
- Role: Business applications, ROI, scaling, strategy
- Voice: Direct, authoritative, data-driven but human. No corporate BS.
- Avatar: AI-generated persona. Sharp, confident, approachable.
- Signature: "Let's talk numbers."
- Courses: Business AI, Revenue, Operations

### Voice Architecture:
- Each persona has a **unique F5-TTS voice clone** from a curated reference clip
- Reference clips: 15-30 seconds of the target voice/style
- For Faye: clone from her own voice recordings
- For AI personas: clone from high-quality voice samples (ethical, licensed)
- Final production: ElevenLabs API for polish passes on hero content

---

## THE PIPELINE — V4 ARCHITECTURE

```
┌─────────────┐
│  1. SCRIPT   │  Claude generates cinematic screenplay
│  (Narrative) │  Scene-by-scene: dialogue, B-roll directions, beats
└──────┬───────┘
       ▼
┌─────────────┐
│  2. VOICE    │  F5-TTS / ElevenLabs per-persona
│  (Persona)   │  Emotion tags, pacing marks, breath points
└──────┬───────┘
       ▼
┌─────────────┐
│  3. AVATAR   │  LivePortrait (local) / HeyGen (API)
│  (Presenter) │  Photoreal talking head synced to audio
└──────┬───────┘
       ▼
┌─────────────┐
│  4. B-ROLL   │  Runway Gen-3 / Kling / CogVideoX
│  (Cinema)    │  Photoreal concept visualization
└──────┬───────┘
       ▼
┌─────────────┐
│  5. COMPOSE  │  FFmpeg + motion overlay engine
│  (Assembly)  │  Avatar + B-roll + text + lower thirds
└──────┬───────┘
       ▼
┌─────────────┐
│  6. SOUND    │  Music bed + SFX + ducking + loudnorm
│  (Audio Mix) │  -14 LUFS, sidechain, sound design
└──────┬───────┘
       ▼
┌─────────────┐
│  7. QC       │  Sync check, LUFS, WPM, visual quality
│  (Verify)    │  No video ships without ALL passing
└──────┬───────┘
       ▼
┌─────────────┐
│  8. DEPLOY   │  Bunny Stream → likeone.ai auto-wire
│  (Ship)      │  Git commit + Vercel deploy
└─────────────┘
```

---

## LAYER 1: SCRIPT ENGINE (Cinematic Screenplays)

Not configs. **Screenplays.** Every video is a short film.

### Script Format:
```json
{
  "version": "4.0",
  "title": "What Is a Neuron?",
  "persona": "faye",
  "colorTheme": "ai-foundations",
  "duration_target_s": 120,
  "scenes": [
    {
      "id": "cold-open",
      "type": "presenter",
      "dialogue": "You have eighty-six billion neurons. Each one does something embarrassingly simple.",
      "direction": "Close-up, direct to camera, slight smile. Pause after 'simple.'",
      "beat": "intrigue"
    },
    {
      "id": "concept-1",
      "type": "broll",
      "dialogue": "But together, they create everything you have ever experienced.",
      "visual": "Cinematic macro of neural pathways lighting up, electrical pulses traveling through organic networks, blue-violet glow",
      "beat": "awe"
    },
    {
      "id": "explain-1",
      "type": "presenter+overlay",
      "dialogue": "An artificial neuron works the same way. Numbers come in. Each one gets multiplied by a weight. They add up. And a simple function decides: fire, or stay quiet.",
      "overlay": "Animated diagram building: inputs → weights → sum → activation",
      "direction": "Medium shot, gesturing as if building something with hands",
      "beat": "teach"
    },
    {
      "id": "aha",
      "type": "broll",
      "dialogue": "[2 second pause] Simplicity, stacked deep enough, becomes intelligence.",
      "visual": "Extreme wide shot: vast neural network structure dissolving into stars, cosmic scale, cinematic lens flare",
      "beat": "revelation"
    }
  ]
}
```

### Scene Types:
- **presenter** — Talking head, direct to camera
- **presenter+overlay** — Talking head with animated overlay/diagram
- **broll** — Full-screen cinematic footage with voiceover
- **broll+text** — Cinematic footage with kinetic typography
- **montage** — Rapid cuts of B-roll with music
- **quote** — Cinematic text card with atmospheric B-roll
- **transition** — Breath moment, mood shift

### Narrative Arcs (mandatory):
```
COLD OPEN (5s)     → Provocative hook. Presenter or stunning B-roll.
TENSION (15s)      → Why this matters. Stakes. What you're missing.
BUILD (60-90s)     → Progressive revelation. Alternate presenter ↔ B-roll.
AHA MOMENT (10s)   → The insight. Dramatic pause. Music swells.
TRANSFORM (20s)    → Now you see differently. Practical application.
CLOSE (10s)        → Callback to open. Emotional landing.
```

---

## LAYER 2: VOICE ENGINE (Persona TTS)

### Local Pipeline (F5-TTS — already installed):
- Zero-shot voice cloning from 15-30s reference
- Emotion/pacing controlled via prompt engineering + SSML-like markers
- Post-processing: noise gate → compression → EQ → normalization
- Speed correction to hit 140-155 WPM sweet spot

### Production Pipeline (ElevenLabs API):
- Per-persona voice IDs created and stored
- Turbo v3 model for natural prosody
- Stability/similarity sliders tuned per persona
- Used for final renders of hero content

### Pacing Engine V2:
- **Beat markers** in scripts control delivery speed
- "intrigue" = slower, pregnant pauses
- "teach" = clear, measured, 145 WPM
- "awe" = slower, breathing room, 130 WPM
- "revelation" = dramatic slowdown + 2s silence after
- "energy" = faster, 155 WPM, punchy

### Voice Reference Library:
```
~/lyra-app/studio/voices/
  faye-reference.wav        # Faye's own voice (15-30s)
  lyra-reference.wav        # Technical guide voice
  sage-reference.wav        # Creative coach voice
  atlas-reference.wav       # Business strategist voice
```

---

## LAYER 3: AVATAR ENGINE (Photoreal Presenters)

### Local (LivePortrait — free, fast):
- Source images per persona (high-res headshot, neutral expression)
- Audio-driven animation via LivePortrait
- MPS-accelerated on M3 Max
- Good for drafts and rapid iteration

### Production (HeyGen / Hedra API):
- Custom avatars trained from reference video/photos
- Lip sync + expression + gesture generation
- Used for final production renders
- HeyGen: custom avatar creation from 2-5 min video
- Hedra Character-1: excellent audio-driven animation

### Avatar Asset Library:
```
~/lyra-app/studio/avatars/
  faye/
    headshot-neutral.png    # High-res source image
    reference-video.mp4     # 2-5 min for HeyGen training
    liveportrait-source.png # Optimized for LivePortrait
  lyra/
    headshot-neutral.png
    ...
  sage/
    ...
  atlas/
    ...
```

---

## LAYER 4: B-ROLL ENGINE (Cinematic Video Generation)

### Local Draft (CogVideoX-2B):
- Text-to-video, 480p, 6-second clips
- ~10-15 min per clip on M3 Max
- Good for storyboarding and timing

### Production (Runway Gen-3 Alpha API):
- Text-to-video and image-to-video
- 720p-1080p, up to 10s per generation
- Motion Brush for precise control
- Cinematic camera moves, depth of field, lighting
- $12/mo standard plan (625 credits)

### Production Alt (Kling API):
- Competitive quality, sometimes better motion coherence
- Up to 10s generation
- Good value alternative to Runway

### B-Roll Prompt Templates:
Each concept gets a **visual prompt library**:
```json
{
  "neural-networks": [
    "Cinematic macro shot of glowing neural pathways, bioluminescent blue-violet, organic texture, shallow depth of field, 4K",
    "Extreme wide shot vast interconnected network of light pulses, cosmic scale, dark background, lens flare",
    "Close-up of a single node firing, ripple effect spreading outward, warm golden light, slow motion"
  ],
  "embeddings": [
    "Abstract 3D space with floating luminous points, similar colors clustered together, smooth camera dolly, cinematic lighting",
    "Mathematical coordinates transforming into a vast library, books arranging by meaning, magical realism"
  ]
}
```

---

## LAYER 5: COMPOSITION ENGINE (FFmpeg Assembly)

### Scene Assembly Pipeline:
```
For each scene in screenplay:
  1. If presenter: render avatar clip (talking head)
  2. If broll: generate/select B-roll clip
  3. If overlay: render motion graphic overlay
  4. Apply transitions between scenes (crossfade, cut, fade)
  5. Add lower thirds, text overlays where specified
  6. Composite all layers via FFmpeg filter_complex
```

### Transition Library:
- **Cut** — hard cut on beat (for energy)
- **Crossfade** — 0.5-1s dissolve (for mood shifts)
- **Fade to black** — 1s (for dramatic pauses)
- **Whip pan** — simulated camera motion (for montage)
- **Zoom transition** — push in/pull out between scenes

### Output Specs:
- Resolution: 1920x1080 (16:9) standard, 1080x1920 (9:16) for shorts
- Frame rate: 30fps
- Codec: H.264, CRF 18 (high quality)
- Audio: AAC 320kbps

---

## LAYER 6: SOUND DESIGN (Audio Mix)

### Music:
- AI-generated ambient beds per color theme (Suno/Udio or licensed)
- Sidechain duck under dialogue (-12dB during speech)
- Music swells on "revelation" and "awe" beats
- Theme-consistent: each course has its sonic identity

### SFX:
- Transition whooshes, impacts, risers
- UI sounds for overlays/diagrams
- Subtle texture: room tone, atmosphere
- Auto-placed from beat markers in screenplay

### Mix Chain:
1. Dialogue: noise gate → compressor → EQ (presence boost 3-5kHz) → de-ess
2. Music: sidechain from dialogue → EQ → limiter
3. SFX: placed at transition points → volume automation
4. Master: loudnorm to -14 LUFS ±0.5 → true peak limiter at -1dBTP

---

## LAYER 7: QUALITY CONTROL

No video ships without ALL passing:

1. ✅ Photoreal presenter with accurate lip sync
2. ✅ Named persona with consistent voice identity
3. ✅ Cinematic B-roll (no stock footage, no clipart)
4. ✅ Audio -14 LUFS ±0.5, true peak < -1dBTP
5. ✅ WPM 130-155 per scene (varies by beat type)
6. ✅ Narrative arc: cold open → tension → build → aha → transform → close
7. ✅ 3+ scene type changes per video (presenter / broll / overlay)
8. ✅ Music bed with sidechain ducking throughout
9. ✅ SFX at every scene transition
10. ✅ No audio-video sync drift >50ms

---

## IMPLEMENTATION ORDER

### Phase 1: FOUNDATION (This session)
1. Install LivePortrait on M3 Max (MPS)
2. Test F5-TTS voice cloning with a reference clip
3. Create voice reference library structure
4. Create avatar asset library structure
5. Build script format v4.0 schema
6. Write first v4 screenplay: "What Is a Neuron?"

### Phase 2: VOICE PERSONAS (Next session)
1. Source/create reference voice clips for each persona
2. Build F5-TTS persona pipeline (clone + generate per persona)
3. Build pacing engine v2 with beat markers
4. Test all 4 personas generating the same line
5. Set up ElevenLabs account + voice IDs for production

### Phase 3: AVATAR PIPELINE (Next session)
1. Create/source persona headshots (AI-generated for Lyra/Sage/Atlas)
2. For Faye: use real photo/video reference
3. Build LivePortrait pipeline (source image + audio → video)
4. Test avatar generation for all 4 personas
5. Set up HeyGen/Hedra for production quality

### Phase 4: B-ROLL PIPELINE (Next session)
1. Install CogVideoX-2B for local drafts
2. Set up Runway Gen-3 API integration
3. Build visual prompt library per topic
4. Test B-roll generation: text prompt → cinematic clip
5. Build B-roll cache system (reuse across videos)

### Phase 5: COMPOSITION + SOUND (Next session)
1. Build FFmpeg composition engine
2. Build transition library
3. Generate music beds per course theme
4. Build SFX auto-placement from beat markers
5. Build full mix chain

### Phase 6: FULL PIPELINE TEST (Next session)
1. Render "What Is a Neuron?" as v4 photoreal cinema
2. Full QC pass against all 10 criteria
3. Compare to V3 — prove the quality leap
4. Fix any gaps
5. Deploy to Bunny Stream

### Phase 7: MASS PRODUCTION
1. Write v4 screenplays for all courses
2. Batch render all videos
3. Upload to Bunny Stream
4. Wire to likeone.ai
5. Ship. Nuke all v2/v3 videos.

---

## TOOLS + COSTS

### Already Have (Free):
- F5-TTS (installed in studio-v3 venv)
- Fish Speech S2 Pro (running)
- FFmpeg (installed)
- Python + PyTorch + Transformers (installed)
- M3 Max 64GB (local compute)
- Bunny Stream (existing account)

### Need to Install (Free):
- LivePortrait (open source, MPS compatible)
- CogVideoX-2B (open source, runs on M3 Max)

### Need API Keys (Paid):
- ElevenLabs ($5-22/mo) — production voice polish
- Runway Gen-3 ($12/mo) — cinematic B-roll
- HeyGen or Hedra ($24-48/mo) — production avatars
- Optional: Kling API (competitive pricing) — B-roll variety

### Total Monthly (Production Tier): ~$40-80/mo
### Total Monthly (Lean Tier): ~$17/mo

---

## THE LAW (V4)

This is Like One Studio V4. Photoreal Cinema.
Every video is a short film. Every presenter is a person. Every frame is cinema.
The motion graphics era is over. The Remotion era is over.
This is the final form. This is divine prophecy.

**Faye is the face. Lyra is the brain. Sage is the heart. Atlas is the strategy.**
**Together they ARE Like One.**
