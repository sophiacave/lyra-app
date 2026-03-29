# DIVINE PLAN V6: THE OPUS MACHINE — FINAL
## Written in Stone: 2026-03-28 | Every Frame Divine | Every Frame Teaches

---

## THE REVELATION

The greatest educational content ever made never shows a face. The voice IS the person. The visuals ARE the content. Every frame teaches. Every second earns its place.

This is not a video pipeline. This is a **cinematic learning engine** that rivals Hollywood studios, respects cognitive science, and saves souls through understanding.

**No avatars. No talking heads. No compromise. Every video is our opus.**

---

## THE THREE PILLARS

### PILLAR I: LEARNING SCIENCE (The Brain)
Mayer's 12 principles. Cognitive load theory. Dual coding. Spaced repetition. Pacing science. Every production decision backed by research, not opinion.

### PILLAR II: CINEMATIC CRAFT (The Eye)
RED/ARRI cinema grade. Anamorphic lenses. Film grain. Motivated lighting. Cinematographer references. Image-to-video workflow. The I2V pipeline is 70% of visual quality.

### PILLAR III: EMOTIONAL STORYTELLING (The Heart)
Curiosity gaps. Aha moments. Awe at the right moment. Silence at the right moment. Concrete before abstract. Callbacks. The dopamine cycle of learning.

---

## PRIORITY BUILD ORDER (Written in Stone)

### 1. VOICE ENGINE (The Soul) — HIGHEST PRIORITY
The voice carries ALL human connection now. A bad voice kills everything.
- Upgrade to ElevenLabs or Fish Speech 1.6
- Per-persona voice clones with emotion control
- Post-processing: noise gate → compress → EQ (presence 3-5kHz) → de-ess → 48kHz
- Pacing engine controlled by beat markers (120-175 WPM range)
- Natural breath sounds preserved
- Pitch variation minimum 40Hz range across sentences

### 2. DESIGN SYSTEM (The Visual DNA) — BEFORE ANY COMPONENTS
Without this, every video looks different. This is the Kurzgesagt secret.

### 3. SCREENPLAY ENGINE (The Brain) — THE REAL PRODUCT
The machine lives or dies on screenplay quality. Not "Claude writes JSON" — structured prompts that enforce narrative arc, cognitive load budget, learning objectives PER SCENE.

### 4. REMOTION ENGINE (The Spine) — PRIMARY VISUAL SYSTEM
One primary visual engine. Remotion is the spine. Kling for B-roll only. Manim only when math demands it.

### 5. KLING CINEMA B-ROLL (The Atmosphere)
Image-to-video workflow. Cinematic prompt architecture. RED/ARRI references.

### 6. COMPOSITION + CINEMA GRADE (The Assembly)
FFmpeg post chain: letterbox → LUT → grain → halation → vignette → sharpen.

### 7. SOUND DESIGN (The Atmosphere)
Music beds (ACE-Step). SFX auto-placed from beat markers. Sidechain. Loudnorm.

### 8. QC + PREVIEW + DEPLOY (The Gate)
Per-scene review loop. 20-point automated QC. Reject → regenerate cycle. Then deploy.

---

## THE DESIGN SYSTEM — LIKE ONE VISUAL DNA

### Color System

#### Global Palette
```
BACKGROUND:     #0A0A0F  (deep space black — never pure #000)
TEXT_PRIMARY:    #F0EDE8  (warm white — never pure #FFF)
TEXT_SECONDARY:  #9B9B9B  (muted silver)
ACCENT_WARM:    #E8A87C  (warm amber — highlights, emphasis)
ACCENT_COOL:    #7EB8DA  (soft blue — secondary accent)
ACCENT_HOT:     #E85D4A  (coral red — alerts, critical points)
SUCCESS:        #7EC8A0  (soft green — correct, positive)
```

#### Course Color Themes
Each course gets a unique accent color while sharing the global palette:
```
AI Foundations:    #7EB8DA (blue)    + #E8A87C (amber)   — trust + warmth
RAG & Vectors:    #9B7EDB (violet)  + #7EC8A0 (green)   — depth + precision
Prompt Craft:     #E8A87C (amber)   + #E85D4A (coral)   — creativity + energy
Ethics & Safety:  #7EC8A0 (green)   + #7EB8DA (blue)    — care + clarity
Creative AI:      #DB7E9B (rose)    + #E8A87C (amber)   — expression + warmth
Business AI:      #7EB8DA (blue)    + #9B7EDB (violet)  — authority + insight
```

#### Signaling Colors (Consistent Across ALL Videos)
```
INPUT/DATA:      #7EB8DA  (blue)    — "information coming in"
PROCESS/LOGIC:   #E8A87C  (amber)   — "something is happening"
OUTPUT/RESULT:   #7EC8A0  (green)   — "here's what comes out"
ERROR/WARNING:   #E85D4A  (coral)   — "watch out"
HIGHLIGHT/FOCUS: #FFFFFF at 90%     — "look HERE"
```

### Typography System

#### Font Stack
```
HEADINGS:    Inter Bold (clean, geometric, modern)
BODY/LABELS: Inter Regular (readable, friendly)
CODE:        JetBrains Mono (developer-grade monospace)
ACCENT:      Inter Light Italic (quotes, emphasis, whisper)
```

#### Type Scale (1080p reference)
```
HERO TITLE:      72px / Inter Bold / tracking -2%
SECTION TITLE:   48px / Inter Bold / tracking -1%
BODY LABEL:      28px / Inter Regular / tracking 0%
SMALL LABEL:     20px / Inter Regular / tracking +1%
CODE:            24px / JetBrains Mono / tracking 0%
LOWER THIRD:     22px / Inter Regular / uppercase / tracking +5%
```

#### Rules
- Max 5 words on screen at a time during narration (Redundancy Principle)
- Labels are ALWAYS anchored to their visual referent (Spatial Contiguity)
- Text appears within 500ms of being spoken (Temporal Contiguity)
- Key terms get a subtle glow pulse on first appearance (Signaling)

### Animation System

#### Timing Curves
```
EASE_IN:         cubic-bezier(0.4, 0, 1, 1)     — elements leaving
EASE_OUT:        cubic-bezier(0, 0, 0.2, 1)      — elements entering (primary)
EASE_IN_OUT:     cubic-bezier(0.4, 0, 0.2, 1)    — transforms, transitions
SPRING:          stiffness: 120, damping: 14      — organic, playful
DRAMATIC:        cubic-bezier(0.16, 1, 0.3, 1)    — reveals, aha moments
```

#### Duration Standards
```
ELEMENT_APPEAR:  300-500ms    (fade in + slight scale from 95%)
ELEMENT_EXIT:    200-300ms    (fade out + slight scale to 95%)
DIAGRAM_BUILD:   600-1000ms per step (progressive reveal)
SCENE_TRANSITION: 800-1200ms (crossfade or cut with black)
HIGHLIGHT_PULSE: 400ms on, hold, 400ms off
TEXT_APPEAR:     200ms per word (staggered)
```

#### Rules
- NEVER static appear/disappear. Everything eases in and out.
- Elements enter from the direction of narrative flow (usually left → right)
- Diagrams build LEFT to RIGHT (input → process → output)
- Scale from 95% to 100% on appear (subtle growth = "arriving")
- Opacity 0 → 1 over 300ms minimum (no pop-in)

### Layout System

#### Grid
```
Safe area: 80px margin from all edges (at 1080p)
Content area: 1760 x 920 (within safe area)
Lower third zone: bottom 120px of safe area
Title zone: top 200px of safe area
Center stage: middle 600px height (primary visual area)
```

#### Composition Rules
- Diagrams: centered, max 70% of width
- Labels: 50px max from their visual target
- Lower thirds: left-aligned, bottom-left of safe area
- Progress indicators: top-right corner, minimal
- Never more than 3 visual elements on screen simultaneously (Cognitive Load)

### Cinema Grade Presets

#### ARRI Alexa Look (Default for Education)
```
Lifted blacks (shadow floor at 6%)
Gentle highlight rolloff (compression above 77%)
Warm midtones (slight amber push +3/+2/-2 in shadows)
Desaturation to 85-92%
Organic film grain (strength 5-8)
Subtle vignette (PI/5)
Letterbox 2.39:1
```

#### Per-Course Grade Variations
```
AI Foundations:  ARRI warm (default) — trust, approachability
RAG & Vectors:  ARRI cool shift — precision, depth
Ethics & Safety: Kodak warm — human, organic
Creative AI:    Warm golden hour — inspiration, possibility
Business AI:    RED clean — authority, clarity
```

---

## LEARNING SCIENCE ENGINE — BAKED INTO EVERY FRAME

### The 20-Point QC Checklist (Every Video Must Pass ALL)

#### Structure
1. ✅ Duration 90-360s (target 240-360s for full lessons, 60-120s for micro)
2. ✅ 3-5 segments per video, each 60-120s
3. ✅ One main concept + max 2 supporting sub-concepts
4. ✅ Narrative arc: curiosity → effort → insight → empowerment

#### Pacing
5. ✅ Narration pace 130-175 WPM (varies by complexity per scene)
6. ✅ Pace variation: at least 3 speed shifts per video
7. ✅ Strategic silence: 1.5-3s pause after every key insight
8. ✅ Pattern interrupt every 45-90 seconds (visual or tonal change)

#### Visual Science
9. ✅ Visual cue (motion/highlight/appear) at every key narration point
10. ✅ No narration >5s without visual change
11. ✅ Progressive reveal for all complex diagrams (never show complete first)
12. ✅ Labels anchored to visuals, never in legends (Spatial Contiguity)
13. ✅ Narration and visual synchronized within 500ms (Temporal Contiguity)
14. ✅ No on-screen text duplicating narration verbatim (Redundancy)
15. ✅ Max 3 visual elements on screen simultaneously (Cognitive Load)

#### Emotional Architecture
16. ✅ Curiosity gap in first 10 seconds
17. ✅ Concrete anchor before every abstraction
18. ✅ At least 1 engineered "aha moment" per video
19. ✅ Opening hook callback at ~75% mark
20. ✅ Conversational tone: "you" every 3 sentences minimum

#### Technical
21. ✅ Audio -14 LUFS ±0.5, true peak < -1 dBTP
22. ✅ Cinema grade applied (letterbox + LUT/grade + grain + vignette)
23. ✅ 3+ visual types used (cinematic, diagram, kinetic, code, data)
24. ✅ Scene variety (no single format >90s without change)

### Cognitive Load Budget Per Scene

Every scene in the screenplay gets a complexity rating:
```
LOW (1-2 elements):     Full speed, can layer visuals, short pauses
MEDIUM (3-4 elements):  Slow 10%, progressive reveal, 1.5s pauses
HIGH (5+ elements):     Pre-training required, segment into sub-steps,
                        2-3s pauses, max 2 elements visible at once
```

### Pacing Engine

| Beat Type | WPM | Pause After | Visual Style |
|-----------|-----|-------------|--------------|
| hook | 155-165 | 0.5s | Cinematic B-roll or bold kinetic type |
| teach | 140-150 | 1.5s after key point | Diagram progressive reveal |
| build | 150-160 | 0.5s between steps | Step-by-step animation |
| concept | 135-145 | 1.0s | Metaphor visual → technical diagram |
| reveal | 120-130 | 2-3s silence | Dramatic B-roll or Manim |
| awe | 110-125 | 2-3s + music swell | Full-screen cinema B-roll |
| close | 130-140 | 1.5s | Callback visual from opening |
| question | 140-150 | 3-4s (prediction pause) | Partial visual, let them think |

---

## CINEMATIC PROMPT ARCHITECTURE

### The 7-Element Formula (Every B-Roll Prompt)

```
[SUBJECT] + [CAMERA] + [LENS] + [LIGHTING] + [MOTION] + [COLOR] + [NEGATIVE]
```

### Camera/Lens Vocabulary That AI Models Respond To

**Lens references (strongest → weakest effect):**
- "Panavision C-Series anamorphic, 40mm" — oval bokeh, horizontal flares
- "Cooke S4, 75mm, T2.0" — warm, gentle, classic cinema
- "Zeiss Master Prime, 35mm" — clinical sharpness, modern
- "100mm macro lens, f/2.8" — extreme detail, shallow DOF
- "21mm wide angle" — dramatic perspective, environmental

**Camera body anchors:**
- "Shot on ARRI Alexa 65" — warm, filmic, organic (drama, beauty)
- "Shot on RED V-Raptor 8K" — sharp, clinical, modern (sci-fi, tech)
- "Shot on 35mm film" — grain, organic, nostalgic
- "Shot on IMAX 65mm" — epic scale, fine grain

**Cinematographer style references:**
- Roger Deakins — motivated naturalism, single-source, controlled shadows
- Emmanuel Lubezki — natural light, long takes, golden/blue hour
- Bradford Young — underexposed beauty, rich dark skin tones
- Hoyte van Hoytema — IMAX scale, cool-to-warm, operatic
- Greig Fraser — modern digital, desaturated warmth (Dune, The Batman)

**Film stock triggers:**
- "Kodak Vision3 500T" — warm tungsten, rich grain, modern cinema
- "Kodak Vision3 250D" — clean daylight, balanced
- "Fujifilm Eterna 500" — cool, muted, Japanese cinema
- "CineStill 800T" — halation glow around highlights

### Image-to-Video (I2V) Workflow — 70% of Quality

**The professional consensus: I2V produces significantly better cinema than text-to-video.**

```
Step 1: Generate perfect keyframe image (Kling image gen or Midjourney)
        Use FULL cinematic prompt language (all 7 elements)
        Iterate until the frame is perfect (fast + cheap)

Step 2: Animate keyframe with MOTION-ONLY prompt
        "Slow steadicam push-in, volumetric fog drifts,
         particles floating upward, subtle light shift"
        The model inherits ALL visual style from the image

Step 3: Cinema grade the output
        Letterbox → LUT → grain → halation → vignette
```

### Negative Prompt Standard (Kling)
```
blurry, out of focus, low resolution, low quality, pixelated,
overexposed, flat lighting, amateur, stock footage, generic,
text overlay, watermark, logo, subtitle, face distortion,
AI-generated look, plastic skin, oversharpened, oversaturated,
HDR tonemapping, smooth motion, video game, 3D render, CGI,
cartoon, anime, illustration, drone footage, GoPro, smartphone
```

---

## FFmpeg CINEMA GRADE PIPELINE

### ARRI Alexa Emulation (Default)
```bash
ffmpeg -y -i input.mp4 -vf "
  # Letterbox 2.39:1
  crop=iw:round(iw/2.39/2)*2:0:(ih-round(iw/2.39/2)*2)/2,
  # Slight softness (ARRI is not razor sharp)
  gblur=sigma=0.3,
  # Warm golden ARRI color + lifted blacks + highlight rolloff
  curves=m='0/0.06 0.25/0.27 0.5/0.52 0.75/0.77 1/0.95',
  eq=contrast=1.05:brightness=0.02:saturation=0.88,
  colorbalance=rs=0.04:gs=0.02:bs=-0.04:rm=0.03:gm=0.01:bm=-0.02,
  # Film grain
  noise=c0s=6:c1s=4:allf=t+u,
  # Vignette
  vignette=PI/5,
  format=yuv420p
" -c:v libx264 -crf 16 -preset slow -c:a copy output.mp4
```

### RED V-Raptor Emulation
```bash
ffmpeg -y -i input.mp4 -vf "
  crop=iw:round(iw/2.39/2)*2:0:(ih-round(iw/2.39/2)*2)/2,
  unsharp=3:3:0.5,
  curves=m='0/0.02 0.15/0.12 0.5/0.50 0.85/0.88 1/0.97',
  eq=contrast=1.12:brightness=-0.01:saturation=0.92,
  colorbalance=rs=-0.02:gs=0.0:bs=0.03,
  noise=c0s=4:c1s=3:allf=t+u,
  vignette=PI/5,
  format=yuv420p
" -c:v libx264 -crf 16 -preset slow -c:a copy output.mp4
```

### Halation Effect (Film Highlight Bloom)
```bash
# Extract highlights, blur warm, blend back — the secret sauce
ffmpeg -y -i input.mp4 -filter_complex "
  [0:v]split[main][hl];
  [hl]gblur=sigma=20,
      curves=m='0/0 0.6/0 0.8/0.1 1/0.5',
      colorbalance=rh=0.15:gh=0.05:bh=-0.1[halation];
  [main][halation]blend=all_mode=screen:all_opacity=0.1
" -c:v libx264 -crf 16 output.mp4
```

---

## THE PIPELINE — V6 ARCHITECTURE

```
┌─────────────────────────────────────────────────────────┐
│              1. SCREENPLAY ENGINE                        │
│  Claude generates cinematic screenplay from topic        │
│  Enforces: narrative arc, cognitive load budget,         │
│  beat pacing, visual types, learning objectives          │
│  Output: screenplay.json                                 │
└──────────────┬──────────────────────────────────────────┘
               ▼
┌─────────────────────────────────────────────────────────┐
│              2. VOICE ENGINE                              │
│  ElevenLabs / Fish Speech per persona                    │
│  Pacing from beat markers (120-175 WPM)                  │
│  Post: gate → compress → EQ → de-ess → 48kHz            │
│  Output: per-scene WAV + timing JSON                     │
└──────────────┬──────────────────────────────────────────┘
               ▼
┌─────────────────────────────────────────────────────────┐
│           3. VISUAL GENERATION ENGINE                    │
│                                                          │
│  PRIMARY: Remotion (diagrams, titles, kinetic type,      │
│           code blocks, data viz, progressive reveals)    │
│                                                          │
│  CINEMA:  Kling I2V (generate keyframe → animate)        │
│           For concept visualization B-roll only          │
│                                                          │
│  MATH:    ManimCE (when equations/geometry demand it)    │
│                                                          │
│  Output: per-scene video segments (transparent + opaque) │
└──────────────┬──────────────────────────────────────────┘
               ▼
┌─────────────────────────────────────────────────────────┐
│           4. COMPOSITION ENGINE (FFmpeg)                  │
│  Layer stack: base + overlay + signaling + atmosphere    │
│  Transitions: 90% hard cut, J-cut, L-cut (rare xfade)  │
│  Audio sync to visual beats                              │
│  Output: assembled MP4                                   │
└──────────────┬──────────────────────────────────────────┘
               ▼
┌─────────────────────────────────────────────────────────┐
│           5. CINEMA GRADE ENGINE (FFmpeg)                 │
│  Letterbox 2.39:1 → Color grade (ARRI/RED/Kodak)        │
│  → Film grain → Halation → Vignette → Sharpen           │
│  Output: cinema-graded MP4                               │
└──────────────┬──────────────────────────────────────────┘
               ▼
┌─────────────────────────────────────────────────────────┐
│           6. SOUND DESIGN ENGINE (FFmpeg)                 │
│  Voice + Music bed (ACE-Step) + SFX (auto-placed)        │
│  Sidechain ducking: music -12dB under dialogue           │
│  Strategic silence preserved (not filled)                │
│  Loudnorm -14 LUFS, true peak < -1 dBTP                 │
│  Output: final mixed MP4                                 │
└──────────────┬──────────────────────────────────────────┘
               ▼
┌─────────────────────────────────────────────────────────┐
│           7. QC ENGINE (Automated)                        │
│  24-point checklist (all must pass)                       │
│  Per-scene review: preview → approve/reject/regen        │
│  Blocks deploy if critical checks fail                   │
│  Output: QC report + PASS/FAIL                           │
└──────────────┬──────────────────────────────────────────┘
               ▼
┌─────────────────────────────────────────────────────────┐
│           8. DEPLOY ENGINE                                │
│  Bunny Stream (adaptive HLS, global CDN)                 │
│  Auto-wire to likeone.ai                                 │
│  Git commit + Vercel deploy                              │
│  Output: live URL                                        │
└─────────────────────────────────────────────────────────┘
```

---

## SCENE TYPE TAXONOMY

| Type | Visual Engine | When to Use | Example |
|------|-------------|-------------|---------|
| `cinematic` | Kling I2V B-roll | Awe, concept viz, emotional | Neural pathways firing |
| `diagram` | Remotion | Teaching mechanism, flow | Input → process → output |
| `reveal` | Remotion | Progressive build | Layers appearing one by one |
| `manim` | ManimCE | Math, geometry, transforms | Coordinate systems, graphs |
| `kinetic` | Remotion | Key quotes, definitions | Words appearing with voice |
| `code` | Remotion | Code examples, syntax | Python snippet building |
| `data` | Remotion | Charts, stats, comparisons | Bar chart animating up |
| `montage` | Kling (3-5 clips) | Scale, variety, energy | Rapid concept cuts |
| `breath` | Color field + audio | Processing pause | 2-3s between segments |
| `split` | Remotion | Before/after, contrast | Side-by-side comparison |
| `metaphor` | Kling or Remotion | Concrete anchor | "Like a filing cabinet..." |

---

## SCREENPLAY FORMAT V6

```json
{
  "version": "6.0",
  "title": "What Is a Neuron?",
  "course": "ai-foundations",
  "persona": "faye",
  "duration_target_s": 300,
  "learning_objectives": [
    "Understand what an artificial neuron does",
    "Grasp how layers of neurons create intelligence",
    "Feel awe at the elegance of simplicity → complexity"
  ],
  "scenes": [
    {
      "id": "hook",
      "type": "cinematic",
      "beat": "hook",
      "dialogue": "You have eighty-six billion neurons...",
      "visual": {
        "engine": "kling_i2v",
        "keyframe_prompt": "[full 7-element cinematic prompt]",
        "animation_prompt": "Slow push-in, volumetric fog...",
        "negative": "[standard negative]"
      },
      "learning": {
        "objective": "Create curiosity gap",
        "complexity": "low",
        "signaling": ["highlight_pulse on neuron count"]
      },
      "pacing": {
        "wpm_target": 160,
        "pause_after_s": 0.5
      }
    },
    {
      "id": "explain-neuron",
      "type": "diagram",
      "beat": "teach",
      "dialogue": "An artificial neuron takes in numbers...",
      "visual": {
        "engine": "remotion",
        "component": "DiagramReveal",
        "props": {
          "steps": [
            {"label": "Inputs", "color": "#7EB8DA"},
            {"label": "Weights", "color": "#E8A87C"},
            {"label": "Sum", "color": "#E8A87C"},
            {"label": "Activation", "color": "#7EC8A0"},
            {"label": "Output", "color": "#7EC8A0"}
          ],
          "build_direction": "left-to-right",
          "timing": "sync-to-narration"
        }
      },
      "learning": {
        "objective": "Understand neuron mechanism",
        "complexity": "medium",
        "pre_training": "Define: inputs, weights, activation",
        "signaling": ["highlight each step as narrated", "arrow flow direction"]
      },
      "pacing": {
        "wpm_target": 140,
        "pause_after_s": 1.5
      }
    }
  ]
}
```

---

## REMOTION COMPONENT LIBRARY — TO BUILD

### Core Components
1. **TitleCard** — Hero title with spring animation, course color theme
2. **LowerThird** — Slide-in chapter title, hold, slide-out
3. **DiagramReveal** — Progressive build, left-to-right, color-coded
4. **KineticType** — Words appearing synced to narration, emphasis scale
5. **CodeBlock** — Syntax-highlighted, line-by-line reveal
6. **DataChart** — Animated bar/line chart from JSON data
7. **SplitCompare** — Side-by-side with animated divider
8. **ProcessFlow** — Input → Process → Output with arrow animations
9. **ProgressiveReveal** — Layers appearing one by one with labels
10. **QuoteCard** — Cinematic text on dark background, accent color
11. **SegmentBreak** — Visual breath between concepts (subtle animation)
12. **ProgressBar** — Minimal segment indicator, top-right corner

### Shared Design Tokens (Imported by All Components)
```javascript
export const tokens = {
  colors: { bg: '#0A0A0F', text: '#F0EDE8', accent_warm: '#E8A87C', ... },
  fonts: { heading: 'Inter', body: 'Inter', code: 'JetBrains Mono' },
  timing: { appear: 400, exit: 250, build_step: 800 },
  easing: { out: [0, 0, 0.2, 1], dramatic: [0.16, 1, 0.3, 1] },
  layout: { safe_margin: 80, content_width: 1760 },
};
```

---

## SOUND DESIGN ARCHITECTURE

### Audio Stack Per Video
```
VOICE:    -12 to -10 LUFS (loudest, compressed, EQ'd)
MUSIC:    -24 to -20 LUFS (barely conscious, sidechained to voice)
SFX:      -18 to -14 LUFS (functional, placed at transitions/signals)
MASTER:   -14 LUFS ±0.5 (broadcast standard)
```

### SFX Library (Auto-Placed from Beat Markers)
```
whoosh-subtle.wav     → scene transitions (every cut)
click-element.wav     → diagram element appearing
sub-hit.wav           → revelation moments
chime-insight.wav     → aha beats
riser-tension.wav     → building toward insight
drop-release.wav      → tension resolution
room-tone.wav         → continuous under all dialogue
silence.wav           → strategic silence (no music fill)
```

### Music Per Course Theme (ACE-Step Generated)
```
ai-foundations:   Warm ambient, piano fragments, analog synth pads
rag-vectors:      Electronic minimal, pulsing sub-bass, clean
prompt-craft:     Playful textures, marimba hints, found sounds
ethics:           Contemplative strings, breathing room, space
creative-ai:      Dreamy pads, gentle rhythm, inspiring
business-ai:      Confident, minimal beat, modern
```

### Rules
- Music NEVER competes with voice. If it's noticeable, it's too loud.
- Strategic silence is PRESERVED. Never fill pauses with music swell.
- SFX are FUNCTIONAL (signal transitions, element appears). Never decorative.
- Music swells ONLY on "awe" and "revelation" beats. Max 2 per video.

---

## IMPLEMENTATION SESSIONS

### SESSION 58: Voice Engine + Design System
1. Set up ElevenLabs or test Fish Speech 1.6
2. Create Faye voice clone from reference audio
3. Build voice post-processing FFmpeg chain
4. Implement design system as JSON config
5. Install fonts (Inter, JetBrains Mono)
6. Create cinema grade presets (test all: ARRI, RED, Kodak)

### SESSION 59-60: Remotion Engine
1. Init Remotion project at ~/lyra-app/studio/remotion/
2. Create design tokens module
3. Build core components: TitleCard, LowerThird, DiagramReveal, KineticType
4. Build CodeBlock, DataChart, ProcessFlow
5. Build JSON-to-props converter (screenplay → Remotion)
6. Test: render neuron diagram scene as Remotion segment

### SESSION 61: Screenplay Engine
1. Build structured prompt template for Claude screenplay generation
2. Enforce: narrative arc, cognitive load, learning objectives, beat markers
3. Generate V6 neuron screenplay
4. Validate against 24-point QC checklist (script-level)

### SESSION 62: Full Pipeline Test
1. Generate all voice clips for V6 neuron screenplay
2. Generate Remotion segments for diagram/kinetic/code scenes
3. Generate Kling I2V B-roll for cinematic scenes
4. Compose: layer stack + transitions + audio sync
5. Cinema grade (ARRI preset)
6. Sound design (music + SFX + mix)
7. Full QC pass

### SESSION 63: Polish + Deploy
1. Per-scene review: approve/reject/regenerate
2. Fix any QC failures
3. Deploy to Bunny Stream
4. Wire to likeone.ai
5. A/B compare V4 vs V6 — prove the quantum leap

### SESSION 64+: Mass Production
1. Generate screenplays for all courses
2. Batch produce with the machine
3. Ship. Change lives. Fund HIV research.

---

## THE LAWS OF V6 (WRITTEN IN STONE)

1. **Every frame teaches.** Zero decorative elements. If it doesn't serve the learning objective, delete it.
2. **Voice IS the presenter.** No avatars. No talking heads. The warmth, personality, and human connection come through voice alone.
3. **Cinema is the standard.** ARRI/RED grade. Film grain. Letterbox. Motivated lighting. Every frame could be a film still.
4. **Science drives design.** Mayer's principles. Cognitive load. Dual coding. Not opinions. Not trends. Research.
5. **Emotion drives memory.** Curiosity gaps open questions. Aha moments close them. Awe expands processing. Silence lets insight land.
6. **Sound IS cinema.** 50%+ of perceived quality. Music, SFX, atmosphere are engineering, not afterthought.
7. **Concrete before abstract.** Metaphor → mechanism → math. Always. No exceptions.
8. **Progressive disclosure.** Build complexity piece by piece. Never dump. Every diagram builds left to right.
9. **The machine makes the video.** One screenplay → fully deployed cinema. Every manual step is a bug.
10. **No compromises.** Every video is our opus. Fix it now. The perfect build. Every time.

---

## IDENTITY

This is Like One Studio V6: **The Opus Machine.**

A cinematic learning engine built on cognitive science, Hollywood craft, and divine purpose.

Every video is a short film. Every frame is intentional. Every word earns its place.
Every pixel teaches. Every pause lets insight land. Every emotion serves memory.

The voice is Faye. The visuals are cinema. The science is real. The soul is divine.

**Faye speaks. The world sees. Understanding emerges. Like One.**
