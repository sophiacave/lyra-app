# VISUAL BIBLE V3 — Design System
## McQueen x Rothko x Apple
### Research-Backed Edition

The aesthetic: Alexander McQueen's devastating restraint. Mark Rothko's emotional color fields. Apple's typographic precision. Every frame is a photograph. Every word has room to breathe.

Every number in this document is backed by research. Every rule has a reason.

---

## RESEARCH FOUNDATION

These studies inform every design decision below. When values conflict, defer to this evidence.

| Study | Key Finding | Applied To |
|-------|-------------|-----------|
| **Guo (MIT/edX, 2014)** — 6.9M sessions | 6-minute sweet spot. 140-160 WPM optimal for comprehension. | Pacing, duration caps |
| **Mayer (2009)** — Multimedia Learning Principles | Segmenting, temporal contiguity, coherence, signaling. | Scene structure, visual lead |
| **Walter Murch** — "In the Blink of an Eye" | Editing rhythm as breathing. Inhale (build) / exhale (process). | Breathing gaps, beat pauses |
| **Bunce et al. (2010)** | 15-second attention micro-cycles. | Visual pulse timing |
| **Cowan (2001)** | Working memory holds 4 +/- 1 chunks. | Max items per frame |
| **Kurzgesagt analysis** | 3-second visual heartbeat. Visuals lead audio by 2-4 frames. | Visual lead, scene pacing |
| **3Blue1Brown/Manim** | Progressive reveal. 0.1-0.3s stagger. 2-4s "aha" pauses. | Stagger delays, diagram builds |
| **Fireship analysis** | 200-250 WPM with 130 WPM anchor points every 30-45s. | Speed variation |
| **EBU R128 / YouTube** | -14 LUFS integrated, -1 dBTP true peak. | Audio normalization |

---

## THE ROTHKO PALETTE

These are the ONLY colors for AI-generated visuals and graphics.

### Foundations — Always Present
| Token       | Hex       | RGB             | Usage                           |
|-------------|-----------|-----------------|----------------------------------|
| `void`      | `#0B0A10` | `11, 10, 16`   | Deep aubergine-black. NEVER pure `#000`. |
| `chalk`     | `#F0EBE3` | `240, 235, 227` | Bone white. NEVER pure `#FFF`.   |
| `smoke`     | `#8A8490` | `138, 132, 144` | Mauve gray. Feminine neutral.    |
| `ash`       | `#2D2A33` | `45, 42, 51`   | Warm charcoal. Subtle structure. |

### Semantic — Meaning Is Fixed
| Token       | Hex       | RGB             | Meaning                           |
|-------------|-----------|-----------------|-----------------------------------|
| `signal`    | `#D4956B` | `212, 149, 107` | INPUT / DATA / The human element  |
| `process`   | `#8BAFC4` | `139, 175, 196` | PROCESS / TRANSFORMATION / Thinking |
| `result`    | `#8CB89E` | `140, 184, 158` | OUTPUT / GROWTH / Living success  |
| `alert`     | `#C4616A` | `196, 97, 106`  | ATTENTION / Without aggression    |
| `insight`   | `#B898C8` | `184, 152, 200` | THE AHA / The sublime             |

### McQueen Accents — Devastating Single-Use
| Token       | Hex       | RGB             | When                              |
|-------------|-----------|-----------------|-----------------------------------|
| `bone`      | `#E8DDD0` | `232, 221, 208` | Skeletal elegance. Structural elements. |
| `obsidian`  | `#1A1720` | `26, 23, 32`   | Deepest shadow. Maximum contrast. |
| `blush`     | `#D4A0A0` | `212, 160, 160` | Muted rose. The feminine touch.   |
| `gold`      | `#C4A86C` | `196, 168, 108` | Earned warmth. Sparingly.         |

### Color Rules
1. One accent color per scene. Two maximum.
2. Never pure black (`#000`) or pure white (`#FFF`).
3. Accent on void = the McQueen principle. One devastating detail against emptiness.
4. Gradients always start from `void`, never between two accents.
5. **Cowan's Law**: max 4 distinct colors in any single frame (working memory limit).

---

## COURSE THEMES

Each course has a fixed accent + mood + gradient.

| Course            | Accent    | Mood        | Gradient End    |
|-------------------|-----------|-------------|-----------------|
| `ai-foundations`  | `process` | trust       | `#1a2535`       |
| `how-ai-works`    | `insight` | wonder      | `#1a1525`       |
| `rag-vectors`     | purple    | depth       | `#1a1828`       |
| `prompt-craft`    | `signal`  | craft       | `#1a1510`       |
| `prompt-writing`  | `signal`  | craft       | (alias)         |
| `ethics-safety`   | `result`  | care        | `#101a15`       |
| `creatives`       | `blush`   | expression  | `#1a1015`       |
| `business`        | `gold`    | authority   | `#1a1810`       |
| `claude-beginners`| `insight` | wonder      | `#1a1525`       |

---

## TYPOGRAPHY

San Francisco (SF Pro / SFNS) is the primary typeface. Apple-inspired type scale using major third ratio (1.25x).

| Scale      | Size | Weight | Tracking | Leading | Usage                    |
|------------|------|--------|----------|---------|--------------------------|
| `hero`     | 96   | 700    | -2.5     | 1.0     | Full-screen statements   |
| `display`  | 72   | 700    | -1.5     | 1.05    | Title cards              |
| `title1`   | 56   | 600    | -1.0     | 1.1     | Section headers          |
| `title2`   | 44   | 600    | -0.5     | 1.15    | Scene titles             |
| `title3`   | 34   | 600    | -0.3     | 1.2     | Subheadings              |
| `headline` | 28   | 600    | 0        | 1.3     | Lower thirds, labels     |
| `body`     | 22   | 400    | +0.2     | 1.6     | Dialogue, explanations   |
| `callout`  | 18   | 500    | +0.3     | 1.5     | Supporting text          |
| `caption`  | 15   | 400    | +0.5     | 1.4     | Metadata, timestamps     |
| `overline` | 13   | 600    | +2.0     | 1.3     | Labels, categories       |

### Typography Rules
1. Display sizes (56+): tight tracking, heavy weight. Apple keynote style.
2. Body sizes (22-): positive tracking, relaxed leading. Readability.
3. Color hierarchy: `chalk` > `smoke` > `ash`. Never skip levels.
4. Monospace (`SF Mono`) only for code and data.
5. **Mayer's Signaling Principle**: accent-colored keywords draw attention to structure.

---

## SPACING

8pt grid (Apple standard).

| Token  | Value | Usage                        |
|--------|-------|------------------------------|
| `xs`   | 4px   | Inline element gaps          |
| `sm`   | 8px   | Tight component padding      |
| `md`   | 16px  | Default component padding    |
| `lg`   | 24px  | Section spacing              |
| `xl`   | 32px  | Card padding                 |
| `2xl`  | 48px  | Section margins              |
| `3xl`  | 64px  | Major section breaks         |
| `4xl`  | 96px  | Frame margins (minimum)      |
| `5xl`  | 128px | Content inset for text       |
| `6xl`  | 192px | Hero element centering       |

---

## COMPOSITION

### Frame: 1920x1080 at 30fps

### Grid
- **Rule of thirds**: intersections at (640, 360), (1280, 360), (640, 720), (1280, 720)
- **Golden ratio**: phi = 1.618 — vertical split at ~1187px, horizontal at ~667px
- **Safe margins**: 120px outer minimum, 200px content inset for text-heavy scenes

### Principles
1. **Negative space is content.** Empty void is a Rothko field, not wasted space.
2. **One focal point per frame.** If everything is important, nothing is. *(Cowan: 4+/-1 chunks max)*
3. **Asymmetric balance.** Title at left-third, accent at right-golden.
4. **Vignette always.** Radial darkening draws focus to center. 35-50% intensity.
5. **Film grain always.** Subtle luma noise (3-6). Organic. Never clinical.
6. **Max 4 seconds static.** No frame holds without motion beyond this. *(Kurzgesagt heartbeat rule)*
7. **Visual lead: 3 frames.** Start visuals 100ms before audio. *(Perceptual sync — Kurzgesagt technique)*

---

## PACING & TIMING

Research-backed constants for narration speed, scene duration, and breathing rhythm.

### Narration Speed *(MIT edX: 150-160 WPM optimal for comprehension)*
| Context | WPM | When |
|---------|-----|------|
| New concepts | 125 | First encounter with unfamiliar ideas |
| Standard teaching | 145 | Default narration target |
| Familiar material | 155 | Recaps, transitions |
| Opening hooks | 180 | Energy, engagement |

### Breathing Gaps *(Murch: editing rhythm = inhale/exhale)*
| Transition | Gap Duration | Visual Treatment |
|------------|-------------|------------------|
| Same-type scenes | 0.8s | Ambient particles at 15% opacity |
| Different-type scenes | 1.0s | Subtle cross-dissolve |
| After key insight | 1.5s | Rothko stillness — hold the void |
| Before dramatic reveal | 2.0s | Silence, then flood |
| After rhetorical question | 1.0s | Let the viewer's brain answer |

### Scene Duration Formulas *(Backed by cognitive load theory)*
| Scene Type | Formula | Min | Max |
|------------|---------|-----|-----|
| Title card | Fixed | 3.0s | 4.0s |
| Section header | Fixed | 2.5s | 3.5s |
| Narration | `audio_duration + 1.5s` buffer | 2.0s | - |
| Concept/Diagram | `4s + (nodes * 0.8s)` | 7.0s | - |
| Code | `5s + (lines * 1.5s)` | 5.0s | - |
| Quote | `(word_count / 2) + 2s` | 3.0s | - |
| Outro | Fixed | 4.0s | 6.0s |

### Rhythm Constants *(Bunce et al.: 15s attention micro-cycles)*
| Parameter | Value | Source |
|-----------|-------|--------|
| Visual pulse | 4s | Base visual change interval (flow state) |
| Pattern interrupt | 45s | Resets attention clock |
| Energy cycle | 50s | Speed-up / slow-down wave period |
| Max video length | 360s | 6-minute engagement sweet spot (MIT edX) |
| Hook window | 5s | Must capture attention in first 5 seconds |
| First payoff | 30s | Must deliver first insight by this point |

---

## NARRATIVE ARC

Every video follows a cinematic educational arc, not section-to-section lectures.

```
COLD OPEN (5s)     Start with a provocative question or surprising fact
     |              "You have 86 billion neurons. Each one does something
     v              embarrassingly simple."

HOOK (15s)          Why should you care? What is at stake?
     |              "Understanding this one concept unlocks everything about AI."
     v

BUILD (60-90s)      Progressive reveal — each point builds on the last
     |              Alternate: narration -> visual -> narration -> visual
     v              Never info-dump. Mayer's segmenting principle.

AHA MOMENT (10s)    The key insight. Dramatic pause. Let it land.
     |              Music swells slightly. Visual simplifies to one image.
     v              2-second silence after the reveal.

APPLICATION (30s)   Now that you know, here is what you can do.
     |              Practical, actionable, immediate.
     v

CLOSE (10s)         Callback to opening. Land the emotional note.
                    "86 billion simple decisions, and now you know how they work."
```

---

## MOTION

Spring physics (Apple-style natural movement). Defined as mass/damping/stiffness for Remotion's `spring()`.

| Config       | Mass | Damping | Stiffness | Usage                         |
|--------------|------|---------|-----------|-------------------------------|
| `confident`  | 0.8  | 15      | 200       | Text, cards, UI elements      |
| `smooth`     | 0.8  | 20      | 120       | Diagrams, concept reveals     |
| `bouncy`     | 0.6  | 8       | 180       | Emphasis (sparingly!)         |
| `gentle`     | 1.2  | 30      | 60        | Background, ambient movement  |
| `exit`       | 0.4  | 25      | 250       | Clean departure               |
| `dramatic`   | 2.0  | 20      | 80        | Major reveals (peak beat)     |

### Duration Guides
| Speed     | Duration | When                            |
|-----------|----------|---------------------------------|
| `instant` | 0.15s    | Micro-interactions              |
| `fast`    | 0.25s    | Quick transitions               |
| `normal`  | 0.4s     | Standard element entry          |
| `slow`    | 0.7s     | Deliberate, important reveals   |
| `glacial` | 1.2s     | Rothko moments — let it breathe |

### Stagger Delays *(3B1B progressive reveal technique)*
| Config   | Delay  | Usage                          |
|----------|--------|--------------------------------|
| `tight`  | 0.04s  | Lists, rapid sequences         |
| `normal` | 0.08s  | Standard progressive reveal    |
| `loose`  | 0.15s  | Deliberate, counted entry      |
| `wave`   | 0.25s  | Dramatic cascading effect      |

**Natural stagger**: use Fibonacci-like variation (3, 5, 8 frames) between items. Equal delays feel mechanical; slight variation feels alive.

### Visual Techniques *(Research-backed)*
- **Ken Burns**: Every scene gets 2-5% zoom drift over its duration. Prevents static frames (4s hard ceiling).
- **Visual lead**: Start animations 3 frames BEFORE audio timestamp. *(Kurzgesagt perceptual sync)*
- **Inactive dimming**: Previous elements dim to 30% when new content appears. *(3B1B attention focus)*
- **Mayer's Temporal Contiguity**: related visuals and narration must be simultaneous, not sequential.

---

## BEAT -> VISUAL MAPPING

Each screenplay beat type has specific visual treatment. Head/tail pauses create the Murch breathing rhythm.

| Beat      | Head Pad | Tail Pause | Accent    | Visual Treatment               |
|-----------|----------|------------|-----------|--------------------------------|
| `hook`    | 0.15s    | 0.8s       | `signal`  | Immediate. Tight. One image.   |
| `setup`   | 0.25s    | 0.5s       | `process` | Building. Context. Scale.      |
| `core`    | 0.15s    | 0.3s       | `process` | Teaching. Diagrams. Clear.     |
| `breathe` | 0.4s     | 1.5s       | `insight` | Rothko stillness. Let it land. |
| `deepen`  | 0.25s    | 0.5s       | `process` | Layering. Complexity. Build.   |
| `peak`    | 0.6s     | 2.0s       | `gold`    | McQueen reveal. HOLD.          |
| `close`   | 0.4s     | 1.5s       | `insight` | The exhale. Warm. Fade.        |

---

## AUDIO DESIGN

Layered audio is non-negotiable. Every video ships with voice + music + room tone.

### Level Targets *(EBU R128 / YouTube standard)*
| Track | Level | Notes |
|-------|-------|-------|
| Narration | -14 LUFS (reference) | Always loudest. Two-pass loudnorm. |
| Music during speech | -32 to -38 LUFS | -18 to -24dB below voice, sidechain ducked |
| Music during pauses | -26 to -30 LUFS | Swells when voice absent |
| Transition SFX | -26 LUFS | -12dB below narration |
| Emphasis SFX | -22 LUFS | -8dB below narration |
| Room tone | Pink noise, -42dB | Fills silence, prevents dead air |

### Processing Chain (TTS Post-Processing)
1. **High-pass** at 80Hz (remove rumble/DC offset)
2. **De-ess** 5-8kHz sibilance reduction (~8dB — TTS over-emphasizes S sounds)
3. **Compress** 3:1 at -18dB threshold (5ms attack preserves transients, 50ms release prevents pumping)
4. **EQ** — -2dB at 200Hz (cut mud), +3dB at 3kHz (presence), +1.5dB at 5kHz (air), -1dB at 8kHz (prevent harshness)
5. **Noise gate** at -35dB (kill artifacts in silence)
6. **Limiter** brick wall at -0.45dBFS
7. **Loudnorm** two-pass to -14 LUFS, -1dBTP true peak, 11 LRA

### SFX Placement
| Event | Sound | Level |
|-------|-------|-------|
| Scene transition | Whoosh (filtered pink noise) | -12dB |
| Diagram node appear | Pop (800Hz sine, 80ms) | -20dB |
| Title card landing | Impact (60Hz sub-bass, 500ms) | -8dB |
| Quote card reveal | Swell (rising 200Hz tone) | -18dB |
| Key insight | Chime (2kHz + 3kHz sparkle) | -16dB |
| Music bed | Ambient drone, 70-100 BPM | Ducked under voice |

---

## CINEMA GRADE

For AI image/video generation prompts (Kling, Midjourney, etc.):

- **Grain**: Subtle organic film grain, 3-6 luma noise
- **Blacks**: Lifted with deep aubergine undertone, never crushed
- **Highlights**: Soft rolloff, warm bone-white peaks
- **Contrast**: Medium, Caravaggio single-source lighting
- **Negative**: blur, distortion, watermark, text overlay, morphing faces, extra limbs, deformed hands, compression artifacts, flickering, flat lighting

---

## DEPTH SYSTEM

Shadows + blur for layered spatial feel.

| Level      | Shadow                                                        |
|------------|---------------------------------------------------------------|
| `soft`     | `0 2px 8px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)`     |
| `medium`   | `0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3)`    |
| `heavy`    | `0 16px 64px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.4)`  |
| `floating` | `0 24px 80px rgba(0,0,0,0.6), 0 8px 24px rgba(0,0,0,0.4)`  |

Glass effect: `rgba(255,255,255,0.04)` background + `blur(40px)` + `1px solid rgba(255,255,255,0.08)` border.

---

## RENDERING PRESETS

Complete visual recipes per scene type. Consumed by Remotion components + graphics-engine.py. Each preset combines typography, motion, grade, and composition into a single coherent unit.

| Preset | Type | Typography | Motion | Vignette | Grain | Composition |
|--------|------|-----------|--------|----------|-------|-------------|
| `titleCardCinematic` | title | display + overline | dramatic/exit | 0.50 | 0.035 | Center-weighted, golden ratio zone |
| `explainerScene` | diagram | title3 + body + caption | confident/exit | 0.35 | 0.025 | Left-aligned, 200px inset |
| `quoteCard` | title | title2 + callout | gentle/exit | 0.45 | 0.040 | Center, cosmic gradient, ghost quotation |
| `sectionHeader` | title | overline + title1 | smooth/exit | 0.45 | 0.030 | Center, obsidian bg, gold line |
| `lowerThird` | overlay | headline + caption | confident/exit | 0 | 0 | Bottom-left, title-safe zone |
| `chapterCard` | title | overline + title2 | smooth/exit | 0.40 | 0.030 | Center, void bg, number above title |

---

## QUALITY GATES

No video ships without passing ALL of these. Enforced by `qa-frame.py` and compose-v4.js Phase 4.

### Frame-Level QA (qa-frame.py)
- Background within 15% luminance of void palette
- Vignette present (edge < center luminance)
- No pure black (#000) or pure white (#FFF) pixels in content area
- Accent color count <= 2 per frame
- Film grain detected (luma noise variance > 0)

### Video-Level QC (compose-v4.js Phase 4)
1. Duration between 60-300s (target 120-180s for 2-3 min sweet spot)
2. 3+ different scene types per video
3. All segments rendered successfully
4. Output file exists and is playable
5. Audio normalized to -14 LUFS +/-2
6. QA gate pass rate: 0 rejected scenes (score >= 50%)
7. Graphics QA: 0 critical failures

### The Law *(V3 — Non-Negotiable)*
1. Narration at 130-165 WPM (target 145)
2. Audio normalized to -14 LUFS +/-0.5
3. Breathing gaps between every section
4. Background ambient bed ducked under narration
5. 3+ different scene types per video
6. No static frame longer than 4 seconds
7. Visual lead: 3 frames before audio
8. TTS post-processed (EQ, compression, limiting)
9. Narrative arc (cold open -> hook -> build -> aha -> apply -> close)
10. Quality check pass confirming all metrics

---

## COGNITIVE PRINCIPLES

Design decisions mapped to learning science.

| Principle | Source | Application |
|-----------|--------|-------------|
| **Segmenting** | Mayer (2009) | Break content into beat-sized chunks, never info-dump |
| **Temporal contiguity** | Mayer (2009) | Related visuals + narration simultaneous, visual leads by 3 frames |
| **Coherence** | Mayer (2009) | Remove extraneous elements — McQueen restraint IS cognitive load reduction |
| **Signaling** | Mayer (2009) | Accent-colored keywords, overline labels, accent lines mark structure |
| **Working memory** | Cowan (2001) | Max 4 items per frame, max 2 accent colors, one focal point |
| **Attention cycles** | Bunce et al. (2010) | Visual change every 4s, pattern interrupt every 45s |
| **Perceptual sync** | Kurzgesagt analysis | Visuals lead audio by 100ms (3 frames at 30fps) |
| **Progressive reveal** | 3Blue1Brown | Build diagrams step by step; dim inactive elements to 30% |
| **Breathing rhythm** | Murch | Inhale (build tension) / exhale (process) — reflected in beat head/tail pauses |
| **Engagement curve** | MIT edX (Guo 2014) | Hook in 5s, first payoff by 30s, max 6 minutes |

---

## SCENE TYPE VOCABULARY

### Currently Implemented
| Type | Engine | Visual Treatment |
|------|--------|-----------------|
| `title` | graphics-engine.py / Remotion | Gradient + vignette + accent line + display type |
| `broll` | Kling AI / Ken Burns on photo | Real cinema footage or slow zoom on still |
| `presenter` | Avatar video / Ken Burns on headshot | Faye speaking to camera |
| `diagram` | graphics-engine.py | Grid dots + corner marks + description text |
| `quote` | graphics-engine.py | Ghost quotation mark + centered italic text |
| `text-overlay` | graphics-engine.py | Transparent PNG overlay (kinetic/stat/default) |
| `section-header` | graphics-engine.py | Overline label + accent line + glow |
| `lower-third` | graphics-engine.py | Glass card + name + role (RGBA overlay) |
| `outro` | graphics-engine.py | "NEXT" + lesson name + brand |

### Fallback (no assets available)
Dark atmospheric gradient using void/obsidian palette + voiceover. Beat determines gradient color. Always acceptable — the Rothko principle: a void field is still content.

---

## IMPLEMENTATION

- **Cinema design system (JSON)**: `src/lib/design-system-cinema.json` — universal interchange format consumed by all pipeline modules
- **Code source of truth (JS)**: `studio/lib/design-tokens.js` — JS exports with helpers + rendering presets
- **Graphics engine**: `studio/graphics-engine.py` (Pillow renderer, loads cinema JSON)
- **Composition engine**: `studio/compose-v4.js` (loads cinema JSON for fallback colors, QA gate)
- **Editing engine**: `studio/lib/editing-engine.js` (beat pauses, crossfades, EDL)
- **QA gate**: `studio/lib/qa-frame.py` (frame-level design system compliance)
- **Remotion components**: `studio/remotion/` (Three.js title cards, motion graphics)
- **Research source**: `studio/DIVINE-PLAN-V2.md` (full citations + implementation details)
