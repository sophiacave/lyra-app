# LIKE ONE STUDIO V9 — THE PERFECT MACHINE

**Written 2026-03-28 | Post Film School | Zero Compromise**

Everything before this document is legacy. The old pipeline is dead. Ken Burns is dead.
Every frame is a painting. Every cut is intentional. Every sound serves the story.

---

## THE PHILOSOPHY

We went to film school. We got our masters. We got our PhD. Here's what we learned:

1. **Emotion first** (Murch). Every cut, every color, every sound serves what the viewer FEELS.
2. **Meaning lives between shots** (Eisenstein). Juxtaposition creates insight. The cut IS the content.
3. **Concrete before abstract** (Mayer). Show the filing cabinet BEFORE the embedding space.
4. **6-minute attention ceiling** (MIT). Respect it. Reset attention every 2 minutes with visual novelty.
5. **The brain constructs what it remembers** (Kuleshov). Show A, show B, let the viewer build C.
6. **Sound is 50% of cinema** (Murch). Bad audio = amateur, regardless of visuals.
7. **Motion must be motivated** — unmotivated camera movement is the #1 amateur tell.
8. **No Ken Burns. Ever.** A slow zoom on a still is the absence of imagination.

---

## THE PIPELINE ARCHITECTURE

```
┌─────────────────────────────────────────────────┐
│              1. SCREENPLAY ENGINE                │
│  Claude writes screenplays using film grammar    │
│  7-element shot formula per scene                │
│  Emotional arc + pacing curve baked in           │
│  Audio arc metadata (JSON) per video             │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│              2. KEYFRAME FORGE                    │
│  ComfyUI/MLX SD → generate hero keyframes        │
│  FLUX/SDXL on M3 Max (64GB = no quantization)    │
│  Human review gate: no frame ships without eyes   │
│  Real-ESRGAN upscale to 4K                       │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│              3. MOTION FORGE                      │
│  Path A: Kling I2V — keyframe → 5-10s video      │
│    (motion prompt only, never re-describe image)  │
│  Path B: Remotion — motion graphics, kinetic type │
│  Path C: Manim — math/tech animated diagrams      │
│  Path D: Blender — 3D camera paths, environments  │
│  Path E: Three.js in Remotion — data viz, abstract│
│  RIFE frame interpolation → 30fps smooth          │
│  NO STILLS. Every frame has real motion.          │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│              4. AUDIO FORGE                       │
│  Layer 1: Narration (Fish S2 Pro / F5-TTS)       │
│    → gate → EQ → compress → de-ess → limit       │
│    → subtle room reverb for warmth                │
│  Layer 2: Music (ACE-Step 1.5, local, free)       │
│    → frequency-selective sidechain ducking         │
│    → music swells in narration gaps                │
│  Layer 3: SFX (Freesound + generated)             │
│    → synced to visual keyframes                   │
│    → Kurzgesagt method: every element has a sound │
│  Layer 4: Ambience (brown noise room tone)        │
│  Layer 5: Silence (tactical, 0.5-1s pre-reveal)  │
│  Master: -14 LUFS integrated, -1 dBTP            │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│              5. COMPOSITION ENGINE                │
│  Remotion assembles all layers:                  │
│    - AI video backgrounds                        │
│    - Motion graphic overlays (alpha)             │
│    - Kinetic typography                          │
│    - Particle/atmosphere overlays                │
│    - Text overlays + lower thirds               │
│  J-cuts and L-cuts on every transition           │
│  Pacing curve enforcement (hook→build→peak→close)│
│  NO crossfades. Hard cuts + whip pans only.      │
│  Living frame: micro-float, grain, light shifts  │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│              6. CINEMA GRADE                      │
│  DaVinci Resolve or FFmpeg LUT pipeline          │
│  OpenColorIO for color science consistency        │
│  Film emulation LUTs (Kodak 2383, ARRI LogC)    │
│  Color arc: warm→neutral→cool→warm per video     │
│  Letterbox 2.35:1                                │
│  Film grain overlay (temporal, per-frame)        │
│  Subtle vignette                                 │
│  Lifted blacks (cinema look)                     │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│              7. QA GATE                           │
│  24-point checklist (automated + human eye)       │
│  Audio: LUFS check, ducking verify, SFX sync     │
│  Visual: color consistency, no jump cuts          │
│  Pacing: shot duration vs target curve            │
│  Accessibility: captions (Whisper), contrast      │
│  The video does NOT ship until QA passes.         │
└──────────────────────┬──────────────────────────┘
                       │
                  CINEMATIC OUTPUT
```

---

## THE 7-ELEMENT SHOT FORMULA

Every Kling prompt MUST contain all 7 elements:

```
1. SUBJECT    — What/who is in the shot, with specific physical details
2. CAMERA     — Shot type + camera body (ARRI Alexa 65, RED V-RAPTOR)
3. LENS       — Focal length + aperture (85mm f/1.4, 24mm anamorphic)
4. LIGHTING   — Named light sources + color temp (rim light 5600K, tungsten key 3200K)
5. MOTION     — Specific camera movement with speed (slow dolly in, lateral tracking)
6. COLOR      — Palette + film stock reference (Kodak Vision3 500T, teal-amber palette)
7. NEGATIVE   — What to exclude (blur, distortion, text, morphing, extra limbs)
```

### WEAK vs STRONG

**WEAK (old pipeline):**
> "Bioluminescent neural pathways flowing through darkness, cinematic, atmospheric"

**STRONG (V9):**
> "Extreme close-up of bioluminescent neural pathways branching through dark tissue, shot on ARRI Alexa 65, 100mm macro lens f/2.8, volumetric backlight with cyan rim at 6500K, slow dolly push revealing depth layers, Kodak Vision3 500T color science with deep teal shadows and warm amber highlights. Negative: blur, text, morphing, extra structures, flat lighting"

---

## THE I2V WORKFLOW (MANDATORY)

Text-to-video is BANNED for hero shots. The workflow is:

1. **Generate keyframe** (ComfyUI/FLUX/SDXL) — review until perfect
2. **Upscale** (Real-ESRGAN 4x)
3. **Animate** (Kling I2V) — motion prompt ONLY, never re-describe the image
4. **Interpolate** (RIFE) — smooth to 30fps
5. **Grade** (LUT + cinema grade pipeline)

Motion prompts for I2V describe ONLY movement:
> "Slow dolly in, subtle parallax between depth layers, atmospheric particles drift left to right, gentle light caustics shift on surfaces"

---

## PACING ARCHITECTURE (3-MINUTE VIDEO)

```
0:00-0:10  HOOK        — Fast cuts (1-2s), bold claim, motion from frame 1
0:10-0:30  SETUP       — Medium pace (2-3s), establish topic + why it matters
0:30-1:00  CORE        — Steady (3-5s), main concept explained with diagrams
1:00-1:30  BREATHE     — Slow (5-8s), let it sink in, example/analogy
1:30-2:00  DEEPEN      — Building (3-4s), add complexity, "but here's the thing..."
2:00-2:30  PEAK        — Fast (1-2s), the revelation, full music, impact SFX
2:30-3:00  CLOSE       — Decelerating (4-5s), warm resolution, wonder
```

---

## AUDIO ARC (PARALLEL TO PACING)

```json
{
  "audio_arc": [
    {"phase": "hook",    "voice": "intimate",   "music": "minimal pad",      "sfx": "sparse",   "lufs": -20},
    {"phase": "setup",   "voice": "confident",  "music": "+rhythm",          "sfx": "moderate",  "lufs": -16},
    {"phase": "core",    "voice": "clear",      "music": "+melody",          "sfx": "active",    "lufs": -14},
    {"phase": "breathe", "voice": "measured",   "music": "stripped",         "sfx": "gentle",    "lufs": -18},
    {"phase": "deepen",  "voice": "energetic",  "music": "building",         "sfx": "building",  "lufs": -14},
    {"phase": "peak",    "voice": "powerful",   "music": "FULL",             "sfx": "IMPACT",    "lufs": -12},
    {"phase": "close",   "voice": "warm",       "music": "resolving",        "sfx": "fading",    "lufs": -22}
  ]
}
```

---

## EDITING RULES (WRITTEN IN STONE)

1. **Cut on phrase completion** — never mid-sentence
2. **J-cut or L-cut on every transition** — offset audio/video by 0.3-0.5s
3. **Eye-trace continuity** — focal point in same screen region across cuts
4. **Hard cut = default** (95%). Whip pan for energy. Fade to black for chapters ONLY.
5. **Crossfade = FORBIDDEN** — dissolves look amateurish
6. **Match cuts for metaphor** — spinning wheel → spinning planet = "these are connected"
7. **Silence before revelation** — drop all audio 0.5-1s before key insight
8. **First 5 seconds**: motion + face + bold claim + music from beat 1
9. **Intellectual montage** — show concept A, show concept B, let viewer build insight C
10. **Rhythm follows narration** — emphasis words = visual change, pauses = held shots

---

## COLOR SYSTEM

### Per-Video Color Arc
- **Warm** (opening/closing) — accessible, human, inviting
- **Neutral** (explanation) — objective, clear
- **Cool** (complexity) — technical, deep, abstract
- **Back to warm** (resolution) — understanding, connection

### Film Stock References
- **Default**: Kodak Vision3 500T 5219 (warm tungsten, organic grain)
- **Technical**: Fujifilm ETERNA (muted, flat, extended DR)
- **Dramatic**: ARRI Alexa LogC (clean digital cinema)
- **Intimate**: Kodak 200T (daylight, natural warmth)

### Forbidden
- Grey/muddy midtones (commit to a look)
- Inconsistent temperature between adjacent shots
- Oversaturation (eye fatigue)
- No color intent (raw/ungraded)

---

## MOTION SYSTEMS (KEN BURNS REPLACEMENT)

### 1. AI Video Generation (PRIMARY)
Generate actual video with real physics, parallax, lighting. Kling I2V or local models.

### 2. Parallax / 2.5D
Depth-separate images into layers → move at different rates → real parallax.
AI depth estimation (Depth Anything V2) automates layer separation.

### 3. Remotion Motion Graphics
React components with spring physics, staggered entrances, easing curves.
Kinetic typography, animated diagrams, data visualization.

### 4. Living Frame Compositing
Layer stack: background + subject + particles + light leaks + grain.
Camera micro-float (sine wave, 2-5px/sec). Temporal grain. Micro color shifts.

### 5. 3D Camera Paths
Blender scripted cameras for product shots, abstract environments.
Three.js in Remotion for data viz flythrough.

### 6. Manim
3Blue1Brown's engine for mathematical/technical animations.
Programmatic, deterministic, version-controlled.

---

## TOOL INSTALLATION PRIORITY

```bash
# Tier 1 — Install immediately
brew install --cask blender
brew install --cask blackmagic-davinci-resolve  # or download from website
npx create-video@latest like-one-remotion
pip install manim
pip install openai-whisper
pip install demucs

# Tier 2 — Install this week
# ComfyUI (clone + setup for FLUX/SDXL)
# ACE-Step 1.5 (clone from GitHub)
# Real-ESRGAN + RIFE
# Cavalry Free (download from website)
# MLX for Apple-native SD

# Tier 3 — As needed
# Bark (voice generation)
# Motion Canvas
# Natron (compositing)
# p5.js (generative art)
```

---

## THE LAW

1. No video ships without the 7-element formula on every shot.
2. No text-to-video for hero shots. I2V only.
3. No Ken Burns. Ever. Not even "subtle" Ken Burns. DEAD.
4. No `enhancePrompt()`. Each prompt is self-contained and specific.
5. No generic modifiers on any prompt. If it says "cinematic" without specifying HOW, it's wrong.
6. No crossfades. No dissolves except for time passage.
7. No flat audio. Every video has the 5-layer sound design.
8. No ungraded footage. Cinema grade on everything.
9. No shipping without QA gate.
10. Perfect builds only. Fix it NOW or don't build it.

---

## WHAT'S NEXT

Session 64 is no longer "audio pipeline." Session 64 is:

### PHASE 1: INSTALL THE TOOLCHAIN
Install Tier 1 tools. Create the studio venv. Verify everything runs on M3 Max.

### PHASE 2: BUILD THE REMOTION BACKBONE
Initialize Remotion project. Build core components:
- Scene compositor (layer stack)
- Kinetic typography system
- Transition library (hard cut, whip pan, fade to black)
- Audio sync engine (J-cuts, L-cuts, ducking)

### PHASE 3: BUILD THE PROMPT MACHINE
Rewrite the screenplay format with 7-element formula enforced.
Build prompt validator that rejects weak prompts.
Create shot library templates for common scene types.

### PHASE 4: REWRITE ONE SCREENPLAY
Take "What Is a Neuron" and rewrite it using everything we learned.
Film school grammar. Eisenstein montage. Mayer's principles.
Visual metaphors. Emotional arc. Audio arc.

### PHASE 5: PRODUCE ONE PERFECT VIDEO
Generate keyframes. Review. Animate with I2V. Grade.
Sound design all 5 layers. Compose in Remotion.
QA gate. Ship only if it's perfect.

This is the new standard. Every video after this follows the same process.
