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

Type is architecture. Light weights carry more authority than bold. The whisper is louder than the shout.

### Font System *(All free/open-source, cinema-grade)*
| Role | Font | Character |
|------|------|-----------|
| **Heading** | Outfit | Geometric, modern, personality — display/titles |
| **Body** | Inter | Humanist, screen-optimized — body text |
| **Code** | JetBrains Mono | Monospace — code, data, timestamps |
| **Accent** | Cormorant Garamond | Classic serif — McQueen moments, quotes, poetry |

### Alternate Fonts *(for course variety)*
| Font | Mood | Use |
|------|------|-----|
| Space Grotesk | Futuristic, tech | AI/tech themes |
| DM Sans | Clean minimal | Data viz, diagrams |
| Playfair Display | Premium editorial | Luxury titles |
| Lora | Contemporary warm | Storytelling, narrative |

### Proven Pairings *(contrast on 2+ of style/weight/size)*
| Heading → Body | Mood |
|----------------|------|
| Outfit → Inter | Modern professional |
| Playfair Display → Inter | Editorial premium |
| Space Grotesk → DM Sans | Tech futuristic |
| Cormorant Garamond → Lora | Literary dramatic |
| Outfit → Lora | Modern warm |

### Type Scale *(major third 1.25x, all sizes in px at 1920×1080)*
| Scale | Size | Weight | Tracking | Leading | Max Chars | Usage |
|-------|------|--------|----------|---------|-----------|-------|
| `mcqueen` | 96 | 200 | -0.04em | 1.05 | 15 | One word. Full screen. Devastating. |
| `hero` | 72 | 300 | -0.03em | 1.05 | 20 | Light, not bold — Apple principle |
| `section` | 48 | 400 | -0.02em | 1.1 | 25 | Section headers |
| `subtitle` | 48 | 600 | -0.01em | 1.2 | 35 | Scene titles |
| `heading` | 36 | 600 | 0 | 1.25 | 45 | Subheadings |
| `whisper` | 32 | 200 | +0.04em | 1.4 | 50 | *Italic. The most powerful line.* |
| `bodyLg` | 28 | 400 | +0.01em | 1.5 | 55 | Large body text |
| `body` | 24 | 400 | +0.015em | 1.5 | 60 | Default body |
| `label` | 24 | 400 | +0.02em | 1.3 | 60 | Labels, annotations |
| `code` | 22 | 400 | 0 | 1.4 | 70 | Code, data |
| `caption` | 20 | 400 | +0.02em | 1.4 | 65 | Metadata, timestamps |
| `small` | 18 | 400 | +0.03em | 1.3 | 70 | Fine print |
| `overline` | 14 | 700 | +0.15em | 1.2 | 25 | CATEGORY LABELS (always uppercase) |

### Typography Rules
1. **Minimum 16px** for any text at 1080p. Body minimum: 20px.
2. Color hierarchy: `chalk` > `smoke` > `ash`. Never skip levels.
3. Max **2 font families** per frame, max **3 weights** per frame.
4. All-caps max **5 words**, add **+0.10em** tracking (the most common amateur tell to skip).
5. Optimal line length: 45-75 characters (ideal: 55).
6. **Never justify text** in video. Left or center align only.
7. Hold time per word: **0.4s minimum** (1.5x average reading speed).
8. **Mayer's Signaling Principle**: accent-colored keywords draw attention to structure.

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

## COMPOSITION *(Muller-Brockmann 1961, SMPTE RP 218)*

### Frame: 1920x1080 at 30fps

### Safe Zones *(SMPTE RP 218 + modern streaming)*
| Zone | Margin | Frame % | Purpose |
|------|--------|---------|---------|
| **Action safe** | 67px | 93% | All important visual content |
| **Title safe** | 96px | 90% | All text and graphics |
| **Text comfort** | 192px | 80% | Where text is most readable |
| **Subtitle reserved** | y: 900-1026 | — | NEVER place graphics here — CC/subtitles only |

### Composition Grids
| Grid | Lines | Power Points |
|------|-------|-------------|
| **Rule of thirds** | V: 640, 1280 / H: 360, 720 | (640,360) (1280,360) (640,720) (1280,720) |
| **Golden ratio** | V: 734, 1186 / H: 413, 667 | Golden rect: 367×207 → 1186×667 |
| **12-column** | 128px cols, 32px gutters, 96px margins | Spans: full(12), ¾(9), ⅔(8), ½(6), ⅓(4), ¼(3) |
| **8-column** | 192px cols, 48px gutters, 96px margins | For simpler layouts |
| **Z-pattern** | (320,270) → (1600,270) → (320,810) → (1600,810) | Eye scan path |

### Layout Patterns
| Pattern | Main Zone | Use |
|---------|-----------|-----|
| **Center-weighted** | 480-1440 × 216-864 (text max 1200px) | Title cards, quotes |
| **Left-heavy** | Main: 96-1146 / Sidebar: 1200-1824 | Diagrams + labels |
| **Right-heavy** | Sidebar: 96-720 / Main: 774-1824 | Reversed layouts |

### Layout Constants
| Token | Value | Purpose |
|-------|-------|---------|
| Safe margin | 96px | More breathing room than standard |
| Element gap | 48px | Minimum between text elements |
| Object gap | 72px | Minimum between visual objects — luxury spacing |
| Label anchor max | 36px | Max distance between label and target |
| Grid unit | 8px | All positioning snaps to 8px |
| Negative space target | **50%** | Half the frame should be EMPTY — Rothko's lesson |

### Cinematic Letterbox *(2.39:1)*
Output: 1920×804 with 138px bars top/bottom. Use for title cards, quotes, reveals.

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

**Breathing ratio target: 15-25%** (sum of all head pads + beat pauses ÷ total duration).

| Transition | Gap Duration | Visual Treatment |
|------------|-------------|------------------|
| Same-type scenes | 1.0s | Ambient particles at 15% opacity |
| Different-type scenes | 1.2s | Subtle cross-dissolve |
| After key insight | 1.8s | Rothko stillness — hold the void |
| Before dramatic reveal | 2.3s | Silence, then flood |
| After rhetorical question | 1.2s | Let the viewer's brain answer |

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

Every animation has MEANING. Nothing moves for show. *(Apple + Disney 12 Principles)*

### Easing Library *(Visual Bible core + PhD research)*
| Name | Cubic Bezier | Use |
|------|-------------|-----|
| `appear` | (0.25, 0.1, 0.25, 1.0) | Gentle arrival — like a breath |
| `exit` | (0.55, 0.0, 1.0, 0.45) | Quiet departure |
| `transform` | (0.4, 0, 0.2, 1) | Apple standard ease |
| `dramatic` | (0.16, 1, 0.3, 1) | McQueen reveal — explosive then precise |
| `easeOutExpo` | (0.16, 1, 0.3, 1) | **RECOMMENDED DEFAULT** — snappy entrances |
| `easeOutBack` | (0.34, 1.56, 0.64, 1) | Playful overshoot, attention grab |
| `easeOutQuint` | (0.22, 1, 0.36, 1) | Smooth slides, page transitions |
| `easeInOutQuart` | (0.76, 0, 0.24, 1) | Morphs, scale transitions |
| `springy` | (0.175, 0.885, 0.32, 1.275) | Kurzgesagt-style bounce |
| `dramaticSlow` | (0.6, 0, 0.1, 1) | Cinematic reveals, slow zooms |
| `stillness` | (0, 0, 1, 1) | Linear — for things that simply ARE |

### Spring Physics *(Apple-style natural movement, Remotion `spring()`)*

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

### Speed Ramping *(Dramatic Effect)*
| Preset | Speed | Use |
|--------|-------|-----|
| Slow motion | 0.25x | Key moment emphasis |
| Slight slow | 0.5x | Important transitions |
| Normal | 1.0x | Default |
| Slight fast | 1.5x | Montage, quick recap |
| Fast forward | 3.0x | Time lapse |
| Snap | 10.0x | Instantaneous emphasis |

Ramp easing: `easeInOutQuart`, 300ms transition between speeds.

### Frame Rate Guide
| Rate | Use |
|------|-----|
| 24fps | Cinematic, dreamy, filmic |
| 25fps | PAL broadcast |
| **30fps** | **YouTube/online — DEFAULT** |
| 60fps | Screen recordings, UI tutorials |

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

### Text Animation Presets *(PhD Research)*
| Preset | Duration | Mood | Use |
|--------|----------|------|-----|
| `fadeIn` | 600ms, `appear` easing | Elegant, simple | Default text entry |
| `fadeUp` | 500ms, `dramatic` easing, +30px Y | Modern, confident | Titles, headings |
| `slideLeft` | 400ms, `easeOutQuint`, -60px X | Dynamic, informational | Lists, labels |
| `typewriter` | 40ms/char, cursor blink 530ms | Technical, AI | Code, terminal |
| `revealMask` | 800ms, `easeInOutQuart`, L→R mask | Premium, cinematic | Hero titles |
| `wordByWord` | 120ms/word, 200ms fade | Educational, emphasis | Quotes, key phrases |
| `scalePop` | 350ms, `easeOutBack`, 0.8→1.0 | Playful, attention | Callouts, numbers |
| `kineticZoom` | 600ms, `dramatic`, 3.0→1.0 + blur | Dramatic, impactful | Reveals |

---

## BEAT -> VISUAL MAPPING

Each screenplay beat type has specific visual treatment. Head/tail pauses create the Murch breathing rhythm.

**Target breathing ratio: 15-25%** of total video duration. Below 15% feels rushed; above 25% feels sluggish.

| Beat      | Head Pad | Tail Pause | Accent    | Visual Treatment               |
|-----------|----------|------------|-----------|--------------------------------|
| `hook`    | 0.20s    | 1.0s       | `signal`  | Immediate. Tight. One image.   |
| `setup`   | 0.30s    | 0.7s       | `process` | Building. Context. Scale.      |
| `core`    | 0.25s    | 0.6s       | `process` | Teaching. Diagrams. Clear.     |
| `breathe` | 0.50s    | 1.8s       | `insight` | Rothko stillness. Let it land. |
| `deepen`  | 0.35s    | 0.8s       | `process` | Layering. Complexity. Build.   |
| `peak`    | 0.70s    | 2.3s       | `gold`    | McQueen reveal. HOLD.          |
| `close`   | 0.50s    | 1.8s       | `insight` | The exhale. Warm. Fade.        |

*V3 tuning (2026-03-29): increased all pauses to achieve 15-25% target. Validated across 3 screenplays: 15.8-16.7% range.*

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

## LIGHTING *(Caravaggio meets McQueen)*

Five key lighting styles for AI-generated visuals and scene design. Each controls shadow depth and emotional register.

### Key Styles
| Style | Azimuth | Elevation | Key:Fill Ratio | Shadow Opacity | Mood | Use |
|-------|---------|-----------|----------------|----------------|------|-----|
| **Rembrandt** | 45° | 45° | 4:1 | 0.60 | Dramatic, authoritative | Expert moments, dramatic reveals |
| **Butterfly** | 0° | 60° | 2:1 | 0.30 | Glamorous, clean | Product shots, title cards |
| **Loop** | 25° | 35° | 3:1 | 0.40 | Approachable, warm | Default, interviews |
| **Split** | 90° | 30° | 8:1 | 0.75 | Mysterious, duality | Conflict, before/after |
| **Rim only** | 180° | 20° | 1:1 (rim) | 0.85 | Epic, spiritual | Dramatic intros, silhouettes |

### Chiaroscuro *(McQueen Drama)*
- Background luminance: 0.05, highlight luminance: 0.95
- Exponential falloff, vignette strength 0.7, radius 0.6
- Use for: key revelations, aha moments

### Color Temperature
| Preset | Kelvin | Mood |
|--------|--------|------|
| Candle | 1900K | Intimate, archaic |
| Warm tungsten | 2700K | Domestic, familiar |
| Warm white | 3200K | Standard warm |
| Neutral | 4100K | Clean, factual |
| Daylight | 5600K | Open, objective |
| Overcast | 6500K | Cool, contemplative |
| **Cinematic** | Shadows 3200K / Highlights 6500K | Orange & teal — the standard |

---

## CINEMATOGRAPHY *(Camera Psychology)*

Focal length and camera movement carry emotional weight independent of content.

### Focal Length
| Lens | mm | FoV | Emotion | Use |
|------|----|-----|---------|-----|
| Ultra-wide | 14-24 | 84° | Epic, vast | Establishing shots, landscapes |
| Wide | 28-35 | 63° | Context, documentary | Scene setting |
| Normal | 50 | 47° | Natural, honest | Default, interviews |
| Short tele | 85 | 28° | Intimate, focused | Emotional moments, portraits |
| Telephoto | 135-200 | 15° | Isolated, compressed | Detail, abstract |

### Camera Movements
| Movement | Speed | Emotion |
|----------|-------|---------|
| Static | — | Stable, contemplative (info delivery, title cards) |
| Slow push-in | 1.5%/s for 4s | Tension, intimacy |
| Slow pull-out | 1.5%/s for 4s | Context reveal, conclusion |
| Dolly | 30 px/s | Progression, exploration |
| Pan | 15°/s | Following, revealing |
| Tilt up | 10°/s | Awe, grandeur |
| Crane up | 40 px/s | Freedom, triumph |
| Drift | 5 px/s | Ambient, dreamy (Kurzgesagt style) |

### Depth of Field
| Level | Aperture | Blur | Use |
|-------|----------|------|-----|
| Deep | f/11-f/16 | 0 | Diagrams, text-heavy |
| Medium | f/4-f/5.6 | 4px | Default |
| Shallow | f/1.4-f/2.8 | 12px | Emotional, detail |
| Extreme | f/1.2 | 24px | Bokeh, abstract |

---

## CINEMA GRADE PRESETS

Three film stock emulations tuned for the Rothko palette. Each course maps to a grade.

### Film Stocks
| Preset | Contrast | Saturation | Grain (L/C) | Character |
|--------|----------|------------|-------------|-----------|
| **ARRI Alexa — McQueen Edit** | 1.04 | 0.85 | 4/3 | Soft contrast, desaturated — let the palette work |
| **RED V-Raptor — Architectural** | 1.08 | 0.90 | 3/2 | Sharp, precise — technical content |
| **Kodak Vision3 — Warm Memory** | 1.03 | 0.82 | 6/4 | Dreamy, desaturated — storytelling warmth |

### Course → Grade Mapping
| Course | Grade | Rationale |
|--------|-------|-----------|
| ai-foundations | ARRI | Trust, clarity |
| how-ai-works | ARRI | Wonder with precision |
| rag-vectors | ARRI | Technical depth |
| prompt-craft | Kodak | Creative warmth |
| ethics-safety | Kodak | Human warmth |
| creative-ai | Kodak | Expressive storytelling |
| business-ai | RED | Sharp authority |

### Prompt Directives *(for Kling, Midjourney, etc.)*
- **Grain**: Subtle organic film grain, 3-6 luma noise
- **Blacks**: Lifted with deep aubergine undertone, never crushed
- **Highlights**: Soft rolloff, warm bone-white peaks
- **Contrast**: Medium, Caravaggio single-source lighting
- **Negative**: blur, distortion, watermark, text overlay, morphing faces, extra limbs, deformed hands, compression artifacts, flickering, flat lighting

---

## TRANSITIONS *(McQueen Reveals)*

Every transition has emotional weight. Hard cuts are confident; dissolves are contemplative.

| Transition | Type | Duration | Emotion |
|------------|------|----------|---------|
| Hard cut | cut | 0ms | Confident, decisive |
| J-cut | audio leads | 1000ms | Anticipation |
| L-cut | audio trails | 1000ms | Reflection |
| Fade black | fade | 600+400+600ms | Breath, chapter break |
| Segment breath | breath | 600+1500+600ms | Major rest (Murch exhale) |
| Dissolve | dissolve | 500-2000ms | Contemplation, connection |
| Zoom through | zoom | 600-1000ms | Energy, passage |
| Morph | morph | 600-1200ms | Transformation (Kurzgesagt) |

---

## PARTICLE SYSTEMS *(Atmosphere, Not Decoration)*

Particles add cinematic depth. They are atmosphere, never the subject.

| System | Count | Size | Opacity | Use |
|--------|-------|------|---------|-----|
| **Ambient dust** | 20-60 | 1-4px | 0.1-0.3 | Atmosphere, depth, cinematic feel |
| **Sparkle** | 5-20 | 2-8px | Pulsing | Highlights, achievement, magic |
| **Data flow** | 30-100 | 2-3px | 0.3-0.7 | Technology, networks, info flow |

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
- **Banned colors**: <1% pixels within distance 8 of pure black/white
- **Palette compliance**: >70% of visible pixels within tolerance 35 of approved palette
- **Negative space**: >=30% dark pixels (target 50% — Rothko). Skipped for RGBA overlays.
- **Color count**: <=4 dominant colors per frame (Cowan's working memory limit)
- **Contrast ratio**: WCAG AA minimum (4.5:1), AAA preferred (7.0:1)
- **Void warmth**: Darkest pixels must be warm aubergine, not neutral black

### RGBA Overlay Handling (V3 fix)
- Transparent pixels (alpha < 10) excluded from all pixel checks
- Prevents false positives when overlay PNGs become pure black on RGB conversion
- Negative space check skipped entirely for overlays (background provides the space)
- Fully transparent images auto-pass (nothing to validate)

### Void Floor (V3 fix — graphics-engine.py)
- Vignette: floor clamped at 0.25 — corners never darken below `void * 0.25 = (3,3,4)`
- Noise: dark pixels clamped to minimum `(6,5,8)` — distance 11 from black, above banned threshold
- Combined: vignette + noise never produces pure black, even at extreme corners

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
3. Breathing ratio 15-25% (head pads + beat pauses ÷ total duration)
4. Background ambient bed ducked under narration
5. 3+ different scene types per video
6. No static frame longer than 4 seconds
7. Visual lead: 3 frames before audio
8. Peak scenes: ≥2.5s total breathing (head + tail)
8. TTS post-processed (EQ, compression, limiting)
9. Narrative arc (cold open -> hook -> build -> aha -> apply -> close)
10. Quality check pass confirming all metrics

---

## EDUCATION SCIENCE *(Guo 2014, Mayer 2009, Sweller 1988, Brame 2016, Pekrun 2014)*

### Core Cognitive Principles

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

### Mayer's 12 Multimedia Principles — Production Rules

| # | Principle | Rule |
|---|-----------|------|
| 1 | **Coherence** | Remove ALL extraneous material. Every element serves learning. |
| 2 | **Signaling** | Highlight key terms with color. Arrows direct attention. Number steps. |
| 3 | **Redundancy** | NEVER show full narration as on-screen text. Key words only. |
| 4 | **Spatial contiguity** | Labels within 120px of referent. Use leader lines if tight. |
| 5 | **Temporal contiguity** | Narration and animation sync within 500ms. Build as you explain. |
| 6 | **Segmenting** | Chapter markers every 2-4 minutes. Visual separator between segments. |
| 7 | **Pretraining** | Define vocabulary in first 30 seconds. Overview before details. |
| 8 | **Modality** | Prefer voiceover + graphics over text + graphics. |
| 9 | **Multimedia** | Never text-only slides for >5 seconds. Always pair with visuals. |
| 10 | **Personalization** | Conversational tone. Use "I" and "you." Contractions OK. |
| 11 | **Voice** | Human voice > machine voice. Enthusiastic but not manic. |
| 12 | **Image** | Talking head optional. If used, small corner overlay (20% width). |

### Video Length & Pacing *(Guo 2014: 6.9M edX sessions)*
| Parameter | Value | Source |
|-----------|-------|--------|
| Optimal segment length | 4-9 minutes | Guo 2014 |
| Absolute max | 12 minutes | Hard ceiling |
| Visual change interval | 3-10s (optimal: 5s) | Bunce/Wolfe |
| Pattern interrupt | 20-45s (optimal: 30s) | Bunce 2010 |
| Max new concepts/minute | 2 | Sweller 1988 |
| Pause after new concept | 2.0s | Cognitive load |

### Engagement Drop Points *(Where learners leave)*
| Timestamp | Risk | Countermeasure |
|-----------|------|----------------|
| First 15s | **Critical** — hook or lose them | Provocative question, surprising fact |
| 2 minutes | First major drop-off | Pattern interrupt, story element |
| 6 minutes | Second drop-off | Section break, change of pace |
| 10 minutes | Third drop-off | End or major narrative shift |

### Spaced Repetition in Video *(Ebbinghaus/Cepeda 2006)*
| Review | Delay | Method |
|--------|-------|--------|
| 1st | +1 minute | Brief visual callback |
| 2nd | +3 minutes | Restate in new context |
| 3rd | +7 minutes | Quiz or application |

### Emotional Triggers *(Pekrun 2014)*
| Emotion | Trigger | When |
|---------|---------|------|
| **Awe** | Vast scale, beautiful visualization | Opening, revelations |
| **Curiosity** | Open question, mystery, partial reveal | Before explanation |
| **Surprise** | Counterintuitive fact, unexpected visual | Every 2-3 minutes |
| **Satisfaction** | Completed explanation, aha moment | End of segment |

---

## ACCESSIBILITY *(Universal Design)*

Non-negotiable rules for inclusive content. Education is for everyone.

### Visual Safety *(WCAG 2.3.1)*
| Rule | Value | Reason |
|------|-------|--------|
| Max flashes per second | 3 | Prevent seizures |
| Flash area max | 25% of frame | Large flashes trigger photosensitive epilepsy |
| No red flash | Always | Red flashing is highest seizure risk |
| Reduce-motion alternative | Always provide | Vestibular disorders affect 35% of adults over 40 |

### Contrast *(WCAG 2.1)*
| Context | Minimum | Preferred |
|---------|---------|-----------|
| Normal text on background | 4.5:1 (AA) | 7.0:1 (AAA) — preferred for education |
| Large text (>24px) | 3.0:1 | 4.5:1 |
| Non-text UI (icons, borders) | 3.0:1 | — |

### Color Independence
**Never use color alone** to convey information. Always pair with shape, text, or pattern. This serves:
- 8% of males with color vision deficiency
- Screen readers and audio description users
- Low-contrast viewing conditions (sunlit rooms, projectors)

Colorblind-safe palette (Wong 2011) for data viz: `#000000, #E69F00, #56B4E9, #009E73, #F0E442, #0072B2, #D55E00, #CC79A7`. All V3 semantic tokens tested for deuteranopia, protanopia, and tritanopia distinguishability.

### Audio Accessibility
| Parameter | Value | Reason |
|-----------|-------|--------|
| Min SNR (speech vs. background) | 20 dB | Hearing difficulty threshold |
| Preferred SNR | 30 dB | Comfortable for all listeners |
| Narration always loudest | -14 LUFS reference | Never buried under music |

### Captions & Subtitles
| Rule | Value |
|------|-------|
| Max characters per line | 42 |
| Max lines | 2 |
| Display WPM | 180 |
| Sync tolerance | 200ms |
| Subtitle zone | y: 900-1026 — **never** place graphics here |

---

## SIGNALING *(Subtle, Never Loud)*

Attention direction through restrained visual cues. Apple principle: guide the eye, don't shout.

| Technique | Parameters | Use |
|-----------|-----------|-----|
| **Highlight glow** | `focus` color, 10% opacity, 24px radius, 500ms fade | Barely there — candle, not spotlight |
| **Color activation** | From `smoke` → accent, 600ms | Slow color bloom on key elements |
| **Scale pulse** | 1.03x (3%, not 5%), 400ms | Restrained emphasis |
| **Arrow draw** | 1.5px stroke, `bone` color, 500ms | Thinner = more elegant |
| **Dim/defocus** | Target 25% opacity, 400ms | Inactive elements fade to background |
| **Zoom focus** | 1200ms, dim background to 25% | Isolate important element |

---

## VISUAL HIERARCHY *(Gestalt + Research)*

Hierarchy weights determine what the eye sees first. Higher weight = more attention.

| Factor | Weight | Notes |
|--------|--------|-------|
| Size (large) | 10 | Biggest element wins |
| Motion (animated) | 9 | Movement captures attention reflexively |
| Color (saturated) | 8 | Accent on void is devastating |
| Contrast (high) | 8 | Light on dark, sharp edges |
| Position (top-left) | 7 | Western reading pattern bias |
| Isolation | 7 | Space around = importance |
| Weight (bold) | 6 | Typographic gravity |
| Proximity (grouped) | 5 | Gestalt: near things belong together |
| Texture (detail) | 4 | Complexity draws slower inspection |

### Whitespace Rules
| Level | Spacing | Use |
|-------|---------|-----|
| Minimum element spacing | 16px | Tightest acceptable |
| Comfort spacing | 32px | Default between related elements |
| Generous spacing | 64px | Between distinct groups |
| Section spacing | 96px | Major breaks |
| Breathing room target | **30%** | Of any composition area should be empty |

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
