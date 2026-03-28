# DIVINE PLAN: Like One Studio v2 — Cinematic Upgrade
## Written in Stone: 2026-03-28 | Research-Backed Edition

---

## THE DIAGNOSIS

Our videos have **Apple-tier visuals** but **broken audio** and **mechanical pacing**.

### Bugs Found
- **FFmpeg merge bug** — Remotion embeds silent audio track → FFmpeg grabbed it instead of TTS narration → **FIXED** (added `-map 0:v:0 -map 1:a:0`, 21 videos re-merged)

### Pacing Audit Results
| Metric | Current | Research Target | Source |
|--------|---------|----------------|--------|
| WPM | 230-302 | 140-155 | MIT edX study, ACX standards |
| Scene variation | ±0.3s (all ~7s) | 3-20s by type | 3B1B analysis, Murch |
| Breathing gaps | 0s | 0.8-2.0s | Walter Murch "In the Blink of an Eye" |
| Background music | None | -18 to -24dB below narration | Broadcast standards |
| Audio normalization | None | -14 LUFS (YouTube optimal) | EBU R128, YouTube specs |
| SFX | None | -12 to -16dB for transitions | Industry standard |
| Max static frame | Unlimited | 4s hard ceiling | Kurzgesagt analysis |
| Visual lead | 0 frames | 3 frames (100ms before audio) | Perceptual sync research |

---

## THE VISION

**Kurzgesagt's teaching clarity + Apple's visual restraint + 3B1B's progressive reveal + Fireship's energy hooks.**

Every video should:
- Narrate at 140-155 WPM with deliberate pauses
- Breathe between sections (0.8-2.0s gaps)
- Layer ambient music that ducks under narration
- Add subtle SFX at transitions
- Never hold a static frame longer than 4 seconds
- Start visuals 3 frames before audio (perceptual sync)
- Target -14 LUFS for YouTube-optimal loudness

---

## 7-SYSTEM UPGRADE ARCHITECTURE

### SYSTEM 1: PACING ENGINE
**File:** `studio/lib/pacing-engine.js`

**Core rules (from research):**

```javascript
export const PACING = {
  // Narration Speed (MIT edX: 150-160 WPM optimal for comprehension)
  WPM_SLOW: 125,        // New concepts, definitions
  WPM_NORMAL: 145,      // Standard teaching (our target)
  WPM_FAST: 165,        // Recaps, transitions
  WPM_HOOK: 180,        // Opening hook, rapid-fire lists

  // Pauses (Walter Murch breathing technique + Mayer's segmenting principle)
  PAUSE_MICRO_MS: 300,       // Between sentences
  PAUSE_SECTION_MS: 800,     // Between sections
  PAUSE_DRAMATIC_MS: 1500,   // Before key reveals (3B1B "aha" pause)
  PAUSE_CHAPTER_MS: 2000,    // Chapter breaks
  PAUSE_POST_QUESTION_MS: 1000, // After rhetorical questions
  PAUSE_POST_REVEAL_MS: 1200,   // After key insights (let it sink in)

  // Scene Durations (backed by research)
  TITLE_CARD_S: 4.0,         // Research: 3.0-4.0s optimal
  SECTION_HEADER_S: 3.0,     // Research: 2.5-3.5s
  OUTRO_S: 5.0,              // Research: 4-6s
  MIN_SCENE_S: 2.0,          // 2-second rule: below this viewers can't orient
  MAX_STATIC_S: 4.0,         // HARD CEILING. Must add motion after this.
  CONCEPT_MIN_S: 7.0,        // 7-second rule for new concept comprehension

  // Dynamic Duration Formulas
  // Narration: audio_duration + 1.5s buffer
  // Concept: 4s + (node_count * 0.8s), min 7s
  // Code: 5s + (line_count * 1.5s)
  // Quote: (word_count / 2) + 2s
  // Comparison: 6s + (max_items * 0.8s)
  // Timeline: 4s + (step_count * 1.2s)

  // Visual Lead (Kurzgesagt technique — visuals before audio for perceptual sync)
  VISUAL_LEAD_FRAMES: 3,     // 100ms at 30fps

  // Rhythm (Bunce et al. 2010 — attention cycles)
  VISUAL_PULSE_S: 4,         // Base visual change interval (flow state inducer)
  PATTERN_INTERRUPT_S: 45,   // Reset attention clock
  ENERGY_CYCLE_S: 50,        // Speed up/slow down wave period

  // Engagement (MIT edX study — 6.9M sessions)
  MAX_VIDEO_S: 360,          // 6 minutes = engagement sweet spot
  HOOK_WINDOW_S: 5,          // Must hook viewer in first 5s
  FIRST_PAYOFF_S: 30,        // Must deliver first insight by 30s
};
```

**Breathing Gap Implementation:**
```
Between every section: 0.8-1.5s breathing gap
  - Same-type sections (narration→narration): 0.8s
  - Different-type sections: 1.0s
  - After key insight/quote: 1.5s
  - Before dramatic reveal: 2.0s
Visual during gap: black with ambient particles drifting at 15% opacity
```

**Rhythm Pattern per Video (inhale/exhale):**
```
HOOK (fast, 5s) → EXPLAIN (medium, 30-60s) →
BREATHE (1.5s) → KEY POINT (slow + pause) →
BREATHE (1.0s) → EXAMPLES (medium, 30-60s) →
BREATHE (1.5s) → INSIGHT (slow + dramatic pause) →
BREATHE (1.0s) → CTA (medium, 5s)
```

---

### SYSTEM 2: AUDIO POST-PROCESSING ENGINE
**File:** `studio/lib/audio-engine.js`

**Signal chain order:** High-pass → De-ess ��� Compress → EQ → Noise Gate → Limiter → Loudnorm

**Complete TTS Processing Chain (single FFmpeg command):**
```bash
ffmpeg -i tts_raw.wav -af \
"highpass=f=80:p=2,\
afftfilt=real='if(between(frequency,5000,8000),re*0.4,re)':imag='if(between(frequency,5000,8000),im*0.4,im)',\
acompressor=threshold=-18dB:ratio=3:attack=5:release=50:makeup=2dB:knee=6dB,\
equalizer=f=200:t=q:w=1.5:g=-2,\
equalizer=f=3000:t=q:w=1.2:g=3,\
equalizer=f=5000:t=q:w=2:g=1.5,\
equalizer=f=8000:t=q:w=1:g=-1,\
agate=threshold=-35dB:attack=1:release=100:ratio=3:range=-30dB,\
alimiter=limit=0.95:level=false:attack=3:release=50" \
-ar 48000 tts_processed.wav
```

**Breakdown:**
- `highpass=f=80:p=2` — remove rumble/DC offset below 80Hz
- `afftfilt` — de-ess: attenuate 5-8kHz sibilance by ~8dB (TTS over-emphasizes S sounds)
- `acompressor` — 3:1 ratio at -18dB threshold, 5ms attack preserves transients, 50ms release prevents pumping
- `equalizer` — -2dB at 200Hz (cut mud), +3dB at 3kHz (presence/clarity), +1.5dB at 5kHz (air), -1dB at 8kHz (prevent harshness)
- `agate` — kill artifacts in silence, -35dB threshold, gentle 3:1 ratio
- `alimiter` — brick wall at -0.45dBFS, catches remaining peaks

**Two-Pass Loudness Normalization (YouTube-optimal):**
```bash
# Pass 1: Measure
ffmpeg -i input.wav -af loudnorm=I=-14:LRA=11:TP=-1:print_format=json -f null /dev/null

# Pass 2: Apply (linear mode for highest quality)
ffmpeg -i input.wav -af \
  loudnorm=I=-14:LRA=11:TP=-1:\
  measured_I=<val>:measured_LRA=<val>:measured_TP=<val>:\
  measured_thresh=<val>:linear=true \
  -ar 48000 output.wav
```

**Background Music Ducking (professional sidechain approach):**
```bash
ffmpeg -i narration.wav -i music.wav -filter_complex \
"[1:a]volume=-18dB[music];\
[0:a]asplit=2[voice][voicekey];\
[voicekey]aformat=channel_layouts=mono[key];\
[music][key]sidechaincompress=threshold=-30dB:ratio=6:attack=80:release=400:level_sc=1:mix=0.8[ducked];\
[voice][ducked]amix=inputs=2:duration=first:dropout_transition=3" \
output.wav
```

**Audio Level Targets:**
| Track | Level | Notes |
|-------|-------|-------|
| Narration | -14 LUFS (reference) | Always loudest |
| Music during speech | -32 to -38 LUFS | -18 to -24dB below voice |
| Music during pauses | -26 to -30 LUFS | Swells when voice absent |
| Transition SFX | -26 LUFS | -12dB below narration |
| Emphasis SFX | -22 LUFS | -8dB below narration |

---

### SYSTEM 3: SOUND DESIGN
**Directory:** `studio/assets/audio/`

**SFX Library (FFmpeg-synthesized, zero external deps):**

```bash
# Whoosh — filtered noise burst for scene transitions
ffmpeg -f lavfi -i "anoisesrc=d=0.4:c=pink:a=0.3" \
  -af "afade=t=in:d=0.08,afade=t=out:st=0.2:d=0.2,highpass=f=1500,lowpass=f=6000,volume=-12dB" \
  studio/assets/audio/sfx-whoosh.wav

# Pop — soft click for diagram node appearance
ffmpeg -f lavfi -i "sine=f=800:d=0.08" \
  -af "afade=t=out:d=0.06,volume=-20dB" \
  studio/assets/audio/sfx-pop.wav

# Impact — sub-bass thud for title card / key reveal
ffmpeg -f lavfi -i "sine=f=60:d=0.5" \
  -af "afade=t=out:d=0.4,acompressor=threshold=-10dB:ratio=4,volume=-8dB" \
  studio/assets/audio/sfx-impact.wav

# Chime — sparkle for "aha" moments
ffmpeg -f lavfi -i "sine=f=2000:d=0.3" -f lavfi -i "sine=f=3000:d=0.25" \
  -filter_complex "[0]afade=t=out:d=0.25[a];[1]afade=t=out:d=0.2,adelay=80[b];[a][b]amix=2,volume=-16dB" \
  studio/assets/audio/sfx-chime.wav

# Swell — rising tone for building anticipation
ffmpeg -f lavfi -i "sine=f=200:d=1.5" \
  -af "asetrate=44100*1.5,aresample=44100,afade=t=in:d=1.2,afade=t=out:st=1.0:d=0.5,volume=-18dB" \
  studio/assets/audio/sfx-swell.wav
```

**SFX Placement Rules:**
- Scene transition → whoosh (-12dB)
- Diagram node appear → pop (-20dB)
- Title card landing → impact (-8dB)
- Quote card reveal → swell (-18dB)
- Key insight moment → chime (-16dB)
- Code line highlight → keyboard tick (-22dB)

**Music Sources (royalty-free):**
- Pixabay Music — free, no attribution
- Incompetech (Kevin MacLeod) — CC-BY
- Mixkit — free, no attribution
- YouTube Audio Library — free for YouTube
- Search terms: "ambient bed," "lo-fi instrumental," "documentary underscore"
- Target tempo: 70-100 BPM for teaching, 100-120 BPM for energetic sections

---

### SYSTEM 4: DYNAMIC SCENE DURATION
**Updated in:** `studio/compositions/LessonVideo.jsx`

**Duration calculator (research-backed):**
```javascript
function calculateDuration(section, fps) {
  switch (section.type) {
    case 'narration':
      // Audio drives duration + 1.5s buffer for text to settle
      return Math.ceil(section.audioDuration * fps) + fps * 1.5;
    case 'concept':
      // 7-second rule: min 7s for comprehension + 0.8s per node
      return fps * Math.max(7, 4 + section.nodes.length * 0.8);
    case 'code':
      // 1.5s per line for reading + 5s base
      return fps * (5 + section.code.split('\n').length * 1.5);
    case 'quote':
      // (word_count / 2) + 2s = time to read + absorb
      return fps * (section.quote.split(' ').length / 2 + 2);
    case 'comparison':
      // 6s + items × 0.8s
      return fps * (6 + Math.max(section.leftItems.length, section.rightItems.length) * 0.8);
    case 'timeline':
      return fps * (4 + section.steps.length * 1.2);
    case 'outro':
      return fps * 5;
  }
}
```

**Breathing gaps inserted between every section:**
```javascript
function calculateGap(prevSection, nextSection, fps) {
  if (!prevSection) return 0;
  if (prevSection.type === 'quote' || prevSection.type === 'concept') return fps * 1.5;
  if (prevSection.type === nextSection.type) return fps * 0.8;
  return fps * 1.0;
}
```

---

### SYSTEM 5: VISUAL PACING UPGRADES
**Updated in:** multiple components

**A. Scene-Type Transitions (update SceneTransition.jsx):**
```
Title Card:    fadeIn=1.0s, fadeOut=0.7s  (slower, cinematic)
Narration:     fadeIn=0.5s, fadeOut=0.4s  (standard)
Concept:       fadeIn=0.6s, fadeOut=0.5s, scaleIn=true
Quote:         fadeIn=0.8s, fadeOut=0.6s  (dramatic, slow)
Code:          slideIn='right', 0.5s
Outro:         fadeIn=0.7s, fadeOut=0.5s
```

**B. Ken Burns Subtle Zoom (NEW component):**
```javascript
// Every scene gets 2-5% zoom drift over its duration
// Prevents static frames (4s hard ceiling rule)
const scale = interpolate(frame, [0, durationInFrames], [1.0, 1.03]);
const translateX = interpolate(frame, [0, durationInFrames], [0, -8]);
```

**C. Visual Lead (Kurzgesagt technique):**
```javascript
// Start visual animations 3 frames BEFORE audio timestamp
const VISUAL_LEAD_FRAMES = 3; // 100ms at 30fps
const visualStart = audioMsToFrame(sentence.offset_ms, fps) - VISUAL_LEAD_FRAMES;
```

**D. Inactive Element Dimming (3B1B technique):**
```javascript
// Previous elements dim to 30% when new content appears
// Focuses attention on current concept
const isActive = frame >= seg.startFrame && frame < seg.endFrame;
const opacity = isActive ? 1.0 : 0.3;
```

**E. Spring Presets (research-tuned):**
```javascript
export const SPRINGS = {
  confident: { mass: 0.8, damping: 15, stiffness: 200 },  // Text, cards, UI
  smooth:    { mass: 0.8, damping: 20, stiffness: 120 },  // Diagrams, concepts
  bouncy:    { mass: 0.6, damping: 8,  stiffness: 180 },  // Emphasis (sparingly!)
  gentle:    { mass: 1.2, damping: 30, stiffness: 60  },  // Background, ambient
  exit:      { mass: 0.4, damping: 25, stiffness: 250 },  // Clean departure
  dramatic:  { mass: 2.0, damping: 20, stiffness: 80  },  // Major reveals
};
```

**F. Stagger Patterns (natural, not mechanical):**
- Between items: 5-frame base delay with Fibonacci-like variation (3, 5, 8 frames)
- Mechanical = exact equal delays → feels robotic
- Natural = slight variation → feels alive

---

### SYSTEM 6: TTS PACING CONTROL
**Updated in:** `studio/tts/generate-s2.py` + `studio/render-lesson.js`

**Speed control by section type:**
```
intro/hook: speed=1.1 (170 WPM — energy)
concept_new: speed=0.85 (125 WPM — slow for comprehension)
concept_familiar: speed=1.05 (155 WPM — comfortable)
example: speed=0.95 (140 WPM — standard)
recap: speed=1.1 (165 WPM — familiar material)
```

**Post-TTS WPM verification:**
```javascript
function measureWPM(text, audioDurationSeconds) {
  const words = text.split(/\s+/).length;
  return (words / audioDurationSeconds) * 60;
}
// If WPM > 160: apply ffmpeg atempo=0.95
// If WPM < 130: apply ffmpeg atempo=1.05
```

**Silence insertion between sentences:**
```
Between sentences: 300ms silence
Between sections: 800ms silence
After key insight: 1500ms silence
Before dramatic reveal: 2000ms silence
```

---

### SYSTEM 7: MASTER RENDER PIPELINE v2
**File:** `studio/render-lesson-v2.js`

```
PHASE 1: CONTENT ANALYSIS
  ├�� Parse lesson config
  ├─ Calculate WPM, complexity score
  ├─ Auto-select pacing profile (calm/medium/energetic)
  └─ Validate: max 6 minutes, min 3 sections

PHASE 2: TTS GENERATION
  ├─ Generate per-section audio (Fish Audio S2 Pro)
  ├─ Extract sentence-level timing
  ├─ Measure WPM per segment → auto-adjust speed
  └�� Output: WAV + timing JSON per section

PHASE 3: AUDIO POST-PROCESSING (NEW)
  ├─ Run 6-stage FFmpeg chain on each segment
  ├─ Insert silence gaps at section boundaries
  ├─ Concatenate into master narration track
  ├─ Select + loop ambient music bed to match duration
  ├─ Apply sidechain ducking (music under voice)
  ├─ Place SFX at transition timestamps
  ├─ Mix all audio tracks
  └─ Two-pass loudnorm to -14 LUFS

PHASE 4: PACING CALCULATION (NEW)
  ├─ Build TimingMap from audio durations + gaps
  ├─ Insert BreathingGap sequences
  ├─ Calculate total composition duration
  ├─ Apply visual lead (3 frames before audio)
  └─ Output: frame-accurate timing manifest

PHASE 5: REMOTION RENDER
  ├─ Pass TimingMap + audio manifest as props
  ├─ Use Series with offset for gaps
  ├─ Ken Burns on all scenes (2-3% drift)
  ├─ Scene-specific transitions
  ├─ Spring presets per element type
  └─ Render: 1920×1080, 30fps, CRF 15

PHASE 6: FINAL MERGE
  ├─ Merge video + master audio
  ├─ -map 0:v:0 -map 1:a:0 (CRITICAL)
  ├─ movflags +faststart (web streaming)
  └─ Hardware acceleration: --hardware-acceleration if-possible (M3 Max)

PHASE 7: QUALITY CHECK (NEW)
  ├─ Verify audio: -14 LUFS ±0.5, true peak ≤ -1dBTP
  ├─ Verify: no scene < 2s, no static frame > 4s
  ├─ Verify: WPM between 130-165
  ├─ Verify: breathing gaps present
  ├─ Generate thumbnail at golden ratio frame
  └─ Log results to brain
```

---

## IMPLEMENTATION ORDER

### Phase 1: Audio Foundation (THIS SESSION)
1. ✅ Fix FFmpeg merge bug (DONE)
2. ✅ Re-merge 21 videos with real narration (DONE)
3. Build `audio-engine.js` with TTS processing chain
4. Generate SFX library (FFmpeg synthesis)
5. Source 3-5 ambient music beds
6. Test full audio chain on one video

### Phase 2: Pacing Engine
7. Build `pacing-engine.js` with all constants
8. Build `BreathingGap.jsx` component
9. Update `LessonVideo.jsx` to use `<Series>` with gaps
10. Update duration calculator with research-backed formulas

### Phase 3: Visual Polish
11. Add Ken Burns subtle zoom wrapper
12. Scene-type-specific transition timing
13. Visual lead (3 frames before audio)
14. Inactive element dimming
15. Updated spring presets

### Phase 4: TTS Pacing
16. Add speed parameter by section type
17. WPM measurement and auto-correction
18. Silence insertion between sentences/sections

### Phase 5: Pipeline v2
19. Build `render-lesson-v2.js` with full 7-phase pipeline
20. Build automated quality checker
21. Test end-to-end on one lesson

### Phase 6: Re-render Everything
22. Re-render all 21 existing videos with v2 pipeline
23. Upload to Bunny Stream (need API key)
24. Wire videoIds into lesson frontmatter
25. Render new course videos

---

## KEY RESEARCH CITATIONS

- **MIT/edX Study** (Guo, 2014): 6.9M video sessions. 6-minute sweet spot. 140-160 WPM optimal.
- **Mayer's Multimedia Learning Principles** (2009): Segmenting, temporal contiguity, coherence, signaling.
- **Walter Murch** "In the Blink of an Eye": Editing rhythm as breathing. Inhale (build) → exhale (process).
- **Bunce et al.** (2010): 15-second attention micro-cycles.
- **Cowan** (2001): Working memory holds 4±1 chunks.
- **Kurzgesagt analysis**: 3-second visual heartbeat, visuals lead audio by 2-4 frames.
- **3Blue1Brown/Manim**: Progressive reveal, 0.1-0.3s stagger, 2-4s "aha" pauses.
- **Fireship analysis**: 200-250 WPM with 130 WPM anchor points every 30-45s.
- **EBU R128 / YouTube**: -14 LUFS integrated, -1 dBTP true peak.

---

## THE LAW

No video ships without ALL of these:
1. ✅ Narration at 130-165 WPM (target 145)
2. ✅ Audio normalized to -14 LUFS ±0.5
3. ✅ Breathing gaps between every section
4. ✅ Background ambient bed (ducked under narration)
5. ✅ At least 3 different scene durations per video
6. ✅ No static frame longer than 4 seconds
7. ✅ Visual lead: 3 frames before audio
8. ✅ TTS post-processed (EQ, compression, limiting)
9. ✅ Quality check pass confirming all metrics
10. ✅ Total duration ≤ 6 minutes

**This is Like One Studio v2. Research-backed. Every number proven. Every build perfect.**
