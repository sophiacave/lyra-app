# VISUAL BIBLE V2 — Design System
## McQueen × Rothko × Apple

The aesthetic: Alexander McQueen's devastating restraint. Mark Rothko's emotional color fields. Apple's typographic precision. Every frame is a photograph. Every word has room to breathe.

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

### Rules
1. One accent color per scene. Two maximum.
2. Never pure black (`#000`) or pure white (`#FFF`).
3. Accent on void = the McQueen principle. One devastating detail against emptiness.
4. Gradients always start from `void`, never between two accents.

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

San Francisco (SF Pro / SFNS) is the primary typeface. Apple-inspired type scale using major third ratio (1.25×).

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

### Rules
1. Display sizes (56+): tight tracking, heavy weight. Apple keynote style.
2. Body sizes (22-): positive tracking, relaxed leading. Readability.
3. Color hierarchy: `chalk` → `smoke` → `ash`. Never skip levels.
4. Monospace (`SF Mono`) only for code and data.

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

### Frame: 1920×1080 at 30fps

### Grid
- **Rule of thirds**: intersections at (640, 360), (1280, 360), (640, 720), (1280, 720)
- **Golden ratio**: φ = 1.618 — vertical split at ~1187px, horizontal at ~667px
- **Safe margins**: 120px outer minimum, 200px content inset for text-heavy scenes

### Principles
1. **Negative space is content.** Empty void is a Rothko field, not wasted space.
2. **One focal point per frame.** If everything is important, nothing is.
3. **Asymmetric balance.** Title at left-third, accent at right-golden.
4. **Vignette always.** Radial darkening draws focus to center. 35-50% intensity.
5. **Film grain always.** Subtle luma noise (3-6). Organic. Never clinical.

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

### Stagger Delays
| Config   | Delay  | Usage                          |
|----------|--------|--------------------------------|
| `tight`  | 0.04s  | Lists, rapid sequences         |
| `normal` | 0.08s  | Standard progressive reveal    |
| `loose`  | 0.15s  | Deliberate, counted entry      |
| `wave`   | 0.25s  | Dramatic cascading effect      |

---

## BEAT → VISUAL MAPPING

Each screenplay beat type has specific visual treatment.

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

## IMPLEMENTATION

- **Code source of truth**: `studio/lib/design-tokens.js`
- **Graphics engine**: `studio/graphics-engine.py` (Pillow renderer)
- **Composition engine**: `studio/compose-v4.js`
- **Editing engine**: `studio/lib/editing-engine.js` (beat pauses, crossfades)
- **Remotion components**: `studio/remotion/` (Three.js title cards, motion graphics)
