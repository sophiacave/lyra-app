# Motion Design Knowledge Base
## PhD-Level Reference for Like One Studio's AI-Powered Educational Video System

---

# 1. THE 12 PRINCIPLES OF ANIMATION (Applied to Motion Graphics)

Originally codified by Frank Thomas and Ollie Johnston in *The Illusion of Life* (1981), these principles were designed for character animation but translate directly to motion graphics when reframed for abstract shapes, typography, data, and UI elements.

## 1.1 Squash and Stretch
**Character animation:** A bouncing ball deforms on impact.
**Motion graphics:** A button element compresses slightly on click before expanding. A bar chart value overshoots its target height then settles back. A logo landing on screen compresses vertically by 5-10% on "impact" then returns to normal over 100ms.
**Educational application:** When a key concept "lands" on screen, apply a subtle Y-scale compression (0.95) then spring back to 1.0. This gives abstract information physical weight.

## 1.2 Anticipation
**Character animation:** A character crouches before jumping.
**Motion graphics:** Before a data chart appears, the background subtly shifts or a placeholder element scales down 2-3% as if "making room." Before a title flies in, a thin line or dot appears at the entry point 200ms earlier.
**Educational application:** Before revealing a complex diagram, show its container outline or a pulsing dot where each element will appear. This primes the viewer's spatial memory for where to look.

## 1.3 Staging
**Character animation:** Positioning a character so the audience reads the action clearly.
**Motion graphics:** Dimming or blurring non-essential elements when presenting a key concept. Using contrast, scale, and negative space to make the active element unmistakable. A Kurzgesagt technique: the entire background shifts to a darker or simpler state when a key fact appears.
**Educational application:** When explaining step 3 of a 5-step process, steps 1-2 should be visually reduced (lower opacity, smaller scale, desaturated) and steps 4-5 hidden entirely. One thing at a time.

## 1.4 Straight-Ahead vs Pose-to-Pose
**Character animation:** Drawing every frame sequentially vs. drawing key poses first.
**Motion graphics:** Straight-ahead = procedural/generative animation (particle systems, noise-driven motion). Pose-to-pose = keyframe-based animation (setting start/end states, letting easing handle the between).
**Educational application:** Use pose-to-pose for structured content (diagrams, charts, step-by-step). Use straight-ahead/procedural for atmospheric elements (background particles, flowing gradients, ambient movement that keeps the screen alive).

## 1.5 Follow-Through and Overlapping Action
**Character animation:** A character's hair keeps moving after they stop.
**Motion graphics:** When a text block slides into position, the last word arrives 50-80ms after the first word (overlapping action). When a card element stops moving, its shadow continues to shift for another 100ms. A chart label "overshoots" past its target position by a few pixels then eases back.
**Educational application:** When a bullet point list appears, each item should arrive with a stagger of 60-100ms. The container arrives first, then the heading, then each point. Nothing stops all at once; everything has a cascade of settling.

## 1.6 Slow In and Slow Out (Ease In / Ease Out)
**Character animation:** A pendulum decelerates at the top of its arc.
**Motion graphics:** Every element that enters the screen should decelerate as it arrives (ease-out). Every element that leaves should accelerate away (ease-in). Nothing starts or stops at constant speed.
**Educational application:** For a concept "building" on screen, use ease-out so it arrives quickly (responsive) but settles gently (comfortable to read). For removing a previous concept, use ease-in so it starts slow (not jarring) then accelerates away (efficient).

## 1.7 Arcs
**Character animation:** Natural movement follows curved paths.
**Motion graphics:** Instead of elements moving in straight lines from point A to B, add a subtle arc. A text element sliding from left to right should follow a gentle parabolic curve, not a ruler-straight path. A data point transitioning between chart positions should arc, not teleport linearly.
**Educational application:** When transitioning between concepts (e.g., "Input" moving to become "Output"), the element should travel along a slight arc. Straight-line motion reads as mechanical; arced motion reads as intentional and organic.

## 1.8 Secondary Action
**Character animation:** A character whistles while walking.
**Motion graphics:** While a main chart animates, background grid lines subtly pulse. While a title types out, a cursor blinks. While a diagram assembles, ambient particles drift in the background. Secondary actions make scenes feel alive without competing for primary attention.
**Educational application:** While the main educational content builds, include subtle ambient motion: a gentle gradient shift in the background, soft particle drift, or a barely-perceptible breathing animation on decorative elements. Dead-still backgrounds feel like PowerPoint.

## 1.9 Timing
**Character animation:** The number of frames determines the speed and weight of an action.
**Motion graphics:** See Section 2 for exhaustive detail. The core principle: timing communicates weight, urgency, and emotion. A 150ms animation feels snappy and lightweight. A 400ms animation feels heavy and significant. A 100ms exit feels dismissive. A 300ms exit feels respectful.
**Educational application:** Key concept reveals should use 250-350ms (substantial enough to register, not so slow that it drags). Supporting detail animations should use 150-200ms (quick, subordinate). Section transitions should use 400-600ms (a breath between ideas).

## 1.10 Exaggeration
**Character animation:** Pushing expressions beyond realistic to make emotions readable.
**Motion graphics:** Scale changes should be 10-20% larger than "accurate" to be visible on screen. Color shifts should be more dramatic than subtle. A "growth" animation should overshoot by 5-15% before settling. If a number changes from 10 to 50, the counter should briefly flash to 52-55 then correct.
**Educational application:** When emphasizing a key statistic or fact, exaggerate its entrance: scale it up 120%, use a brighter color, add a brief glow or pulse. The exaggeration says "this is important" in the language of motion.

## 1.11 Solid Drawing (Solid Design)
**Character animation:** Understanding 3D form and weight.
**Motion graphics:** Consistent visual logic. If elements have depth (shadows, gradients), maintain that depth system throughout. If you establish that "important things are large and centered," never break that rule. Consistent stroke widths, corner radii, color relationships, and spatial logic.
**Educational application:** Build a design system for your educational content. Every heading behaves the same way. Every diagram uses the same color coding. Every transition follows the same spatial rules. Consistency builds trust and reduces cognitive load.

## 1.12 Appeal
**Character animation:** Making characters engaging and pleasing to watch.
**Motion graphics:** The overall visual quality, color palette, typography choices, and motion personality that makes someone WANT to keep watching. Kurzgesagt has appeal through vibrant colors and charming characters. 3Blue1Brown has appeal through elegant mathematical precision. Apple has appeal through restraint and perfection.
**Educational application:** Your visual language IS your teaching voice. Warm colors + rounded shapes + playful motion = approachable learning. Cool colors + sharp geometry + precise motion = professional authority. The aesthetic must match the audience and content.

---

# 2. EASING AND TIMING CURVES (The Physics of Feeling)

## 2.1 The Fundamental Truth
**Linear motion does not exist in nature.** Every object in the physical world accelerates and decelerates. When motion on screen is linear, the human brain flags it as artificial, robotic, or broken. Easing is not decoration; it is the minimum viable physics that makes motion feel real.

## 2.2 Core Easing Types

### Linear
- `cubic-bezier(0.0, 0.0, 1.0, 1.0)`
- Constant speed from start to finish
- Use case: ONLY for progress bars, loading indicators, or intentionally mechanical effects
- Feel: Robotic, lifeless, utilitarian

### Ease-Out (Deceleration)
- CSS: `cubic-bezier(0, 0, 0.58, 1.0)`
- Fast start, slow finish (like a ball rolling to a stop)
- **THE DEFAULT for entering elements.** Elements arrive quickly (feels responsive) and settle gently (feels natural)
- Material Design calls this the "deceleration curve"
- Use: Elements appearing, modals opening, content entering viewport
- Feel: Responsive, welcoming, confident

### Ease-In (Acceleration)
- CSS: `cubic-bezier(0.42, 0, 1.0, 1.0)`
- Slow start, fast finish (like dropping a ball)
- The default for exiting elements. Elements leave slowly at first (not jarring) then accelerate away (efficient)
- Material Design calls this the "acceleration curve"
- Use: Elements disappearing, closing dialogs, content leaving viewport
- Feel: Graceful departure, not abrupt

### Ease-In-Out
- CSS: `cubic-bezier(0.42, 0, 0.58, 1.0)`
- Slow start, fast middle, slow finish (like a car journey)
- Best for elements that start and end on screen (moving from position A to B)
- Material Design calls this the "standard curve"
- Use: Repositioning elements, morphing shapes, transitioning states
- Feel: Natural, balanced, considered

## 2.3 Premium Easing Functions (Custom Bezier Curves)

These curves produce motion that feels expensive, polished, and intentional:

| Name | Cubic-Bezier | Character |
|------|-------------|-----------|
| Apple-style | `cubic-bezier(0.25, 0.1, 0.25, 1.0)` | Crisp, precise, premium |
| Kurzgesagt-bouncy | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Playful overshoot |
| Elegant entrance | `cubic-bezier(0.16, 1, 0.3, 1)` | Fast arrival, soft landing |
| Dramatic reveal | `cubic-bezier(0.77, 0, 0.175, 1)` | Strong ease-in-out |
| Snappy feedback | `cubic-bezier(0.68, -0.55, 0.265, 1.55)` | Overshoot + settle |
| Material emphasized | `cubic-bezier(0.2, 0, 0, 1)` | Google's M3 emphasized easing |

## 2.4 Timing Duration Guide

Based on Nielsen Norman Group research and Material Design specifications:

### The Human Perception Stack
- **< 100ms**: Perceived as instant. Animations under 100ms register as "not animated" to 80%+ of viewers.
- **100ms**: Simple feedback (checkbox toggle, button press). Feels like direct manipulation.
- **150-200ms**: Small UI animations. Tooltip appearances, dropdown menus. Desktop default range.
- **200-300ms**: Standard transitions. Modal opening, card expansion, element repositioning. Mobile default range.
- **300-400ms**: Large movements. Full-screen transitions, complex choreographed sequences. Maximum for mobile.
- **400-500ms**: Dramatic reveals only. Use sparingly; users start to feel the wait.
- **> 500ms**: Danger zone. Feels cumbersome. Only for intentionally cinematic moments (video intros, major section transitions).

### Platform-Specific Multipliers (Material Design)
- **Desktop**: 150-200ms base (faster because larger screens = less distance to track)
- **Mobile**: 200-350ms base
- **Tablet**: Mobile duration x 1.3
- **Wearable**: Mobile duration x 0.7

### Key Asymmetry
Elements ENTERING should take slightly longer than elements EXITING.
- Modal appear: 300ms
- Modal disappear: 200-250ms
- Rationale: Entering requires the user to register and orient. Exiting requires only acknowledgment.

## 2.5 Timing Communicates Meaning
- **Fast (100-200ms)**: Light, unimportant, responsive, casual
- **Medium (200-350ms)**: Standard, confident, professional
- **Slow (350-500ms)**: Heavy, important, dramatic, weighty
- **Very slow (500ms+)**: Cinematic, ceremonial, or an error

## 2.6 Remotion Implementation

```typescript
// Premium ease-out (Apple-style entrance)
const opacity = interpolate(frame, [0, 20], [0, 1], {
  easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
  extrapolateRight: 'clamp',
});

// Spring physics (natural bounce)
const scale = spring({
  frame,
  fps,
  config: { damping: 200, stiffness: 100, mass: 0.5 },
});

// Staggered entrance (delay per item)
const itemDelay = index * 4; // 4 frames between each item at 30fps = ~133ms stagger
const itemOpacity = interpolate(
  frame - itemDelay,
  [0, 15],
  [0, 1],
  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
);
```

---

# 3. MOTION HIERARCHY (The Orchestra)

## 3.1 The Core Law
**The eye follows movement.** In a scene with both moving and static elements, the viewer will always look at what is moving. This is not a suggestion; it is a neurological fact rooted in survival instinct (movement = potential threat/opportunity).

**Corollary:** If everything moves at once, nothing has hierarchy. Simultaneous animation is visual noise. Sequential animation is storytelling.

## 3.2 The Hierarchy Stack (What Moves When)

In order of visual priority:
1. **Primary element**: The main thing you want the viewer to see. Moves FIRST. Largest motion. Longest duration.
2. **Secondary elements**: Supporting content that contextualizes the primary. Moves 50-150ms AFTER primary. Smaller, faster motion.
3. **Tertiary elements**: Labels, captions, decorative elements. Moves 100-200ms after secondary. Subtle, quick motion.
4. **Background/ambient**: Always-moving elements (particles, gradients, subtle pulses). Never stops. Lowest visual priority because constant motion becomes invisible.

## 3.3 Stagger Patterns

### Cascade (Most Common)
Elements enter one after another with consistent delay:
```
Item 1: 0ms
Item 2: 60ms
Item 3: 120ms
Item 4: 180ms
```
Best for: Lists, menu items, card grids, bullet points.
Stagger interval: 40-100ms per item for small groups (3-8 items), 20-40ms for large groups (8+ items to prevent total duration from becoming excessive).

### Wave
Elements enter with a sinusoidal timing pattern:
```
Item 1: 0ms
Item 2: 40ms
Item 3: 100ms  (longer gap)
Item 4: 140ms
Item 5: 200ms  (longer gap)
```
Best for: Organic, flowing content. Less mechanical than pure cascade.

### Burst
All elements enter simultaneously but from different directions/distances:
```
Center item: 0ms, from scale 0
Top items: 0ms, from above
Bottom items: 0ms, from below
Side items: 0ms, from sides
```
Best for: Dashboard reveals, data visualizations appearing "all at once" but with spatial logic.

## 3.4 Choreography Rules

1. **Proximity cascade**: Elements closer together enter closer in time. A card and its label enter together; a distant icon enters separately.
2. **Importance cascade**: The most important element enters first, regardless of position.
3. **Reading-order cascade**: For text-heavy content, follow the reading direction (left-to-right, top-to-bottom for English).
4. **Center-out cascade**: For radial layouts, the center element enters first and others ripple outward.
5. **Never exceed 500ms total stagger duration**: If your cascade of 10 items at 80ms each = 800ms total, that is too long. Reduce to 40ms each = 400ms total.

---

# 4. SPATIAL RELATIONSHIPS IN MOTION (Where Things Come From Means Something)

## 4.1 The Spatial Language

Motion direction is not arbitrary. Decades of interface design, cinema, and cultural convention have created a shared spatial vocabulary:

| Direction | Meaning | Example |
|-----------|---------|---------|
| Left to Right | Progress, forward, next, advancement | Next step, new information, future |
| Right to Left | Return, back, previous, regression | Going back, undo, history |
| Top to Bottom | Hierarchy, gravity, descent, natural flow | New content arriving, dropdown menus |
| Bottom to Top | Elevation, importance, emergence, effort | Notifications rising, modals appearing, achievement |
| Scale Up (zoom in) | Focus, importance, detail, intimacy | Selecting an item, drilling into detail |
| Scale Down (zoom out) | Context, overview, zooming out, summary | Returning to overview, showing big picture |
| Toward viewer (Z+) | Urgency, importance, demand for attention | Alerts, critical actions, modal dialogs |
| Away from viewer (Z-) | Dismissal, completion, de-emphasis | Closing, completing, archiving |
| Fade in | Soft appearance, ambient, non-disruptive | Background changes, ambient elements |
| Slide in | Intentional arrival, has a source/origin | Navigation content, related information |

## 4.2 How the Best Studios Use Spatial Logic

### Kurzgesagt
- New concepts enter from the RIGHT (moving forward through explanation)
- When zooming into a concept, the current view scales up and the detail view emerges FROM the scaled element (maintaining spatial continuity)
- Cosmic scale uses Z-axis zoom: camera pushes THROUGH layers of scale (universe > galaxy > star > planet > cell > atom)
- Color-coded regions: warm colors (left/center) for the subject, cool colors (right/background) for context

### Apple
- Products enter from BELOW (rising, elevated, premium)
- Text enters from the RIGHT (progress, new information)
- Transitions use Z-axis depth: old content recedes while new content advances
- Everything feels like it exists in a coherent 3D space, even when 2D
- Generous negative space gives motion room to breathe

### Google Material Design
- "Shared axis" pattern: content moving along the same axis maintains spatial relationship
- "Container transform": an element morphs from its position into a new state (spatial continuity)
- "Fade through": cross-fade between unrelated content (signals no spatial relationship)
- Elevation changes (shadow) signal importance on Z-axis without literal Z-movement

### 3Blue1Brown
- Mathematical objects morph in place (transformation = same concept evolving)
- Camera pans to reveal adjacent concepts (spatial proximity = conceptual proximity)
- New coordinate systems unfold FROM existing ones (building on prior knowledge)
- Color shifts happen across the entire mathematical space simultaneously (global property changes)

## 4.3 Spatial Rules for Educational Content

1. **New information enters from the right** (or bottom-right). This aligns with the progress metaphor.
2. **Completed/reviewed information exits to the left** (or top-left). This aligns with "that is now in the past."
3. **Deep-dive detail scales UP from the element being examined.** Maintain the visual link between overview and detail.
4. **Return to overview scales DOWN to the original element.** The viewer should feel they can trace the path back.
5. **Errors/corrections enter from below with a bounce.** Signals "stop and pay attention."
6. **Summaries/conclusions descend from above.** The high-level view descends to encompass everything below it.

---

# 5. THE SCHOOL OF MOTION CURRICULUM (Professional Skill Tree)

## 5.1 Learning Path (Recommended Order)

### Foundation Layer (Months 1-3)
1. **The Path to MoGraph** (Free, 2+ hrs) -- Industry overview, career paths, what motion design IS
2. **Photoshop + Illustrator Unleashed** (18+ hrs) -- Creating original artwork, vector illustration, photo manipulation
3. **After Effects Kickstart** (16+ hrs) -- Animation fundamentals, keyframes, layer management, basic expressions

### Core Skills Layer (Months 3-6)
4. **Animation Bootcamp** (18+ hrs) -- The 12 principles applied to After Effects. This is where motion becomes MOTION.
5. **Design Kickstart** (21+ hrs) -- Design fundamentals: layout, typography, color theory, "motion-ready storyboards"
6. **Design Bootcamp** (27+ hrs) -- Professional design through real projects: typography, composition, color theory at production level

### Specialization Layer (Months 6-12)
7. **Illustration for Motion** (21+ hrs) -- Drawing and illustration specifically designed to be animated
8. **Character Animation Bootcamp** (18+ hrs) -- Character rigs, lip sync, acting through characters
9. **VFX for Motion** (23+ hrs) -- Keying, rotoscoping, tracking, matchmoving, compositing live-action + motion graphics
10. **Cinema 4D Basecamp** (intro 3D) -- 3D modeling, lighting, animation, texturing

### Mastery Layer (Month 12+)
11. **Advanced Motion Methods** (33+ hrs) -- Geometric proportions, complex transitions, expression scripting, professional workflow optimization

## 5.2 The Complete Skill Tree

```
MOTION DESIGN MASTERY
|
+-- DESIGN FUNDAMENTALS
|   +-- Color Theory (HSB color space, palette generation, emotional color)
|   +-- Typography (type hierarchy, pairing, kerning, leading)
|   +-- Composition (rule of thirds, golden ratio, visual weight, negative space)
|   +-- Layout (grid systems, visual flow, responsive design)
|
+-- ANIMATION PRINCIPLES
|   +-- 12 Principles (squash/stretch through appeal)
|   +-- Timing & Spacing (frame-by-frame control)
|   +-- Easing & Curves (bezier mastery)
|   +-- Physics-Based Motion (gravity, friction, spring, inertia)
|
+-- TOOLS & SOFTWARE
|   +-- After Effects (industry standard for 2D motion)
|   +-- Cinema 4D (industry standard for 3D motion)
|   +-- Illustrator (vector artwork for animation)
|   +-- Photoshop (raster artwork, textures)
|   +-- Figma/Sketch (UI/UX motion prototyping)
|   +-- Blender (free 3D alternative)
|   +-- Remotion (code-based video for programmatic workflows)
|   +-- Manim (mathematical visualization)
|
+-- SCRIPTING & EXPRESSIONS
|   +-- After Effects Expressions (JavaScript-based)
|   +-- Python (for Manim, Blender scripting)
|   +-- TypeScript/React (for Remotion)
|   +-- GLSL Shaders (for real-time generative effects)
|
+-- STORYTELLING & NARRATIVE
|   +-- Storyboarding (visual narrative planning)
|   +-- Style Frames (aesthetic direction setting)
|   +-- Sound Design (audio-visual synchronization)
|   +-- Pacing & Rhythm (editorial timing)
```

## 5.3 Highest Quality-Per-Hour Tools

| Tool | Best For | Quality Ceiling | Speed |
|------|----------|----------------|-------|
| After Effects | 2D motion, compositing | Very High | Medium |
| Cinema 4D | 3D motion, product vis | Very High | Slow |
| Remotion | Programmatic video, templates | High | Very Fast |
| Manim | Mathematical visualization | High | Fast (if you know Python) |
| Rive/Lottie | Interactive web animation | Medium-High | Fast |
| Three.js/WebGL | Generative 3D, particles | Very High | Slow (setup), Fast (iteration) |
| Figma + Protopie | UI animation prototyping | Medium | Very Fast |
| FFmpeg + code | Batch processing, automation | Depends | Very Fast at scale |

---

# 6. TYPOGRAPHY IN MOTION (When Text Becomes Cinema)

## 6.1 The Spectrum: From Appearing to Performing

**Level 0 -- Static cut:** Text appears instantaneously. No animation. PowerPoint default. Feels cheap.

**Level 1 -- Fade in:** Text fades from 0% to 100% opacity. 200-300ms. Minimal effort but infinitely better than Level 0. Feels soft, professional baseline.

**Level 2 -- Slide + fade:** Text slides 20-40px from a direction while fading in. 250-350ms with ease-out. The standard for professional motion graphics. Feels intentional.

**Level 3 -- Character-level animation:** Each character animates individually with a 20-40ms stagger. Characters can fade, scale, rotate, or slide independently. Used by Apple keynotes. Feels premium.

**Level 4 -- Kinetic typography:** Text IS the visual. Words change size, weight, color, position, and speed to convey meaning. "MASSIVE" appears in giant type. "whisper" appears in small, fading type. Text interacts with other elements. Used by Vox, Apple, Nike. Feels cinematic.

**Level 5 -- Typographic choreography:** Multiple text elements perform a coordinated dance. Words split, reform, morph into new words. Typography drives the entire visual narrative without supporting imagery. The Saul Bass school. Feels transcendent.

## 6.2 Typography Properties as Meaning Tools

| Property | Static Meaning | Motion Meaning |
|----------|---------------|----------------|
| **Font weight** | Visual hierarchy | Transitioning from light to bold = emphasis growing |
| **Tracking (letter-spacing)** | Elegance/density | Expanding tracking = breathing out, relaxing, opening |
| **Scale** | Importance | Growing = increasing importance in real-time |
| **Color** | Category/emotion | Color transitioning = meaning shifting, emotion changing |
| **Position** | Spatial relationship | Moving text = recontextualizing, creating relationships |
| **Rotation** | (rare static use) | Rotating text = instability, transformation, energy |
| **Opacity** | (not applicable) | Fading = entering/exiting, varying importance |
| **Blur** | (not applicable) | Blurring = defocusing, backgrounding, dreaming |

## 6.3 Techniques from the Masters

### Apple Keynotes
- Words appear one at a time, each with a crisp fade + subtle upward slide
- Key product names use character-level animation with a metallic/gradient reveal
- Numbers animate by COUNTING up (not appearing) -- "1 billion" counts up from 0 in 1.5 seconds
- Massive scale contrast: a single word fills the entire screen, then shrinks to context

### Vox / Explainer Documentaries
- Bold statements in large sans-serif type, appearing word-by-word synced to narration
- Color-coded keywords: the key term in a sentence appears in the brand color while other words are white/gray
- Text appears ON TOP of footage, using blend modes or backing plates for legibility
- Citations and sources appear as smaller, subtler type in the corners -- still animated, but clearly subordinate

### Saul Bass / Title Design
- Text as architecture: words form structures, boundaries, paths
- Typography interacts with graphic elements (text slides along a line, wraps around a shape)
- Movement serves the emotional tone of the film: sharp cuts for thriller, flowing curves for romance

## 6.4 Implementation Principles

1. **Sync to narration.** If your video has voiceover, text should appear within 100ms of the corresponding spoken word.
2. **One idea per screen.** Never animate two competing text concepts simultaneously.
3. **Contrast creates hierarchy.** The most important word should be the largest AND the most animated.
4. **Whitespace is a frame.** Give text generous margins. Crowded text cannot perform.
5. **Font pairing matters.** Use a display face for emphasis and a clean sans-serif for body. Never more than 2 typefaces.

---

# 7. DATA VISUALIZATION ANIMATION (Making Numbers Feel)

## 7.1 The "Build" Technique

The most fundamental data animation technique: data appears PROGRESSIVELY rather than all at once.

### Bar Charts
- Bars grow from the baseline (y=0) to their final height
- Each bar can grow simultaneously (for comparison) or sequentially (for narrative)
- Duration: 400-800ms per bar. Ease-out for natural deceleration.
- Labels appear AFTER bars finish growing (50ms delay)
- Value callouts count up to their final number

### Line Charts
- The line "draws" from left to right, following the data path
- Duration: 800-1500ms for the full draw
- Data points pop in as the line passes through them
- Area fills can wipe in behind the line with a slight delay

### Pie/Donut Charts
- Segments grow clockwise from 12 o'clock
- Each segment's arc animates from 0 degrees to its final angle
- Stagger: 100-200ms between segments
- Labels appear after their segment finishes

### Scatter Plots
- Points fade in or scale up from 0
- Can be staggered by data category (all "Category A" points first, then "Category B")
- Connection lines draw after points appear

## 7.2 Morphing Between Visualization Types

A powerful storytelling technique: the same data transforms from one chart type to another. This shows the viewer that it is the same data viewed differently.

- Bar chart morphs to treemap: bars reshape into rectangles
- Scatter plot morphs to line chart: points connect sequentially
- Table morphs to bar chart: numbers become proportional bars
- Map choropleth morphs to bar chart: regions reshape into bars sorted by value

Implementation approach: each data point is an element with starting position/shape and ending position/shape. Interpolate all properties (x, y, width, height, color, opacity) between states using ease-in-out over 600-1000ms.

## 7.3 The 3Blue1Brown Method (Manim)

Grant Sanderson's approach to mathematical visualization:

**Core philosophy:** Mathematical objects ARE the animation. You do not illustrate math; you animate math. An equation does not appear next to a graph; the equation BECOMES the graph.

**Key techniques:**
- **Transform**: Object A morphs into Object B. A circle transforms into a sine wave. An equation rearranges itself.
- **MoveToTarget**: Objects reposition themselves with physical motion (arcs, easing).
- **ReplacementTransform**: Object A is smoothly replaced by Object B (one dissolves as the other forms).
- **FadeIn/FadeOut with directional shift**: Objects enter/exit with a directional bias indicating where they "come from" conceptually.
- **Color mapping**: Entire mathematical spaces change color to show a property (e.g., positive values turn blue, negative turn red, animated continuously as a function changes).

**Manim objects available:** Circle, Square, Line, Arrow, NumberLine, Axes, Graph, MathTex (LaTeX equations), Text, Dot, Vector, Matrix, NumberPlane, ParametricCurve, and more.

**Python example:**
```python
class DataBuild(Scene):
    def construct(self):
        axes = Axes(x_range=[0, 5], y_range=[0, 10])
        graph = axes.plot(lambda x: x**2, color=BLUE)
        self.play(Create(axes), run_time=1)
        self.play(Create(graph), run_time=2)
        label = axes.get_graph_label(graph, label="x^2")
        self.play(Write(label))
```

## 7.4 The Hans Rosling / Gapminder Method

**Key innovation:** Making data emotional through MOTION OVER TIME. The animated scatter plot where:
- X-axis = income per person
- Y-axis = life expectancy
- Bubble size = population
- Bubble color = continent
- TIME is the animation dimension (year scrubbing from 1800 to present)

**Why it works emotionally:**
1. Bubbles are characters. Each country is a "being" that grows, shrinks, rises, falls.
2. Time creates narrative. You watch countries "struggle" and "succeed" over decades.
3. Collision and divergence create drama. Countries that were together separate. Countries that were apart converge.
4. The presenter narrates the motion like a sports commentator: "Look at China GO!"

**Implementation:** Gapminder was originally built with Trendalyzer (Flash-based), now reproducible with D3.js, R/gganimate, Python/matplotlib animation, or Remotion.

---

# 8. PARTICLE SYSTEMS AND GENERATIVE MOTION (The Living Background)

## 8.1 What Particles Do for Educational Video

Particles transform a static educational frame into a living environment. They signal:
- **Scale** (cosmic particles for space, cellular particles for biology)
- **Energy** (fast particles for exciting concepts, slow particles for calm)
- **Atmosphere** (warm glowing particles for positive topics, cold sharp particles for challenges)
- **Continuity** (ambient motion that persists across cuts, creating visual cohesion)

## 8.2 Core Generative Techniques

### Perlin Noise Flow Fields
**What:** A 2D or 3D grid of force vectors, each derived from Perlin noise, that guide particles along organic paths.

**Algorithm:**
1. Divide canvas into grid cells (e.g., 10x10px)
2. For each cell, sample Perlin noise at (x/scale, y/scale, time)
3. Map noise value (0-1) to angle (0-2PI) to create a direction vector
4. Each frame, each particle reads the vector at its current position and applies it as a force
5. Increment the time dimension each frame to animate the field

**Result:** Organic, flowing, wind-like motion that looks natural and never repeats.

**p5.js implementation:**
```javascript
function draw() {
  for (let particle of particles) {
    let x = floor(particle.pos.x / cellSize);
    let y = floor(particle.pos.y / cellSize);
    let angle = noise(x * 0.1, y * 0.1, frameCount * 0.005) * TWO_PI;
    let force = p5.Vector.fromAngle(angle);
    particle.applyForce(force);
    particle.update();
    particle.show();
  }
}
```

### Attractor Systems
**What:** One or more points that pull particles toward them, creating orbital, spiraling, or converging motion.

**Types:**
- **Point attractor**: Particles orbit or spiral toward a single point (good for "convergence" concepts)
- **Line attractor**: Particles flow along a path (good for showing flow, connection)
- **Lorenz attractor**: Chaotic but deterministic motion (good for complexity, emergent behavior)
- **Strange attractors**: Mathematical functions that create infinitely complex, never-repeating patterns

### Fluid Simulation
**What:** Particles that interact with each other through simulated fluid dynamics (viscosity, pressure, velocity diffusion).

**Complexity:** High. Requires Navier-Stokes approximation or lattice Boltzmann method. Libraries like Three.js + gpu.js or dedicated WebGL shaders.

### Reaction-Diffusion
**What:** Two chemicals that spread and interact, creating organic patterns (spots, stripes, labyrinthine structures).

**Use in educational content:** Visualizing biological growth, pattern formation, complexity emerging from simple rules.

## 8.3 How Kurzgesagt Uses Particles

- **Cosmic scale**: Dense star fields with parallax layers (close stars move fast, far stars move slow). Nebula rendered as thousands of colored particles with varying opacity. Used for space, physics, and cosmology videos.
- **Cellular scale**: Organic particles in warm colors, drifting slowly with Brownian-like motion. Cell membranes rendered as dense particle boundaries. Used for biology and health videos.
- **Abstract concepts**: Glowing particles that coalesce into shapes representing ideas. Particle explosions when concepts "collide" or "react."
- **Atmospheric**: Every Kurzgesagt frame has ambient particle motion, even in simple scenes. Dust motes, light rays, floating elements. Nothing is ever completely still.

## 8.4 Programmatic Tools

| Tool | Dimension | Performance | Learning Curve | Best For |
|------|-----------|-------------|---------------|----------|
| **p5.js** | 2D | Medium | Low | Quick sketches, flow fields, simple particles |
| **Three.js** | 3D | High (WebGL) | Medium | Complex 3D particles, GPU-accelerated |
| **Processing** | 2D/3D | High (Java) | Low-Medium | Prototyping, print-quality output |
| **TouchDesigner** | 2D/3D | Very High | High | Real-time installation, live performance |
| **Houdini** | 3D | Very High | Very High | Film-quality simulations |
| **Remotion + Canvas** | 2D | Medium | Medium | Code-driven video particles |
| **GLSL Shaders** | 2D/3D | Highest | High | Maximum performance, pure GPU |

---

# 9. MICRO-INTERACTIONS AND POLISH (Amateur vs Professional)

## 9.1 The Polish Gap

The difference between amateur and professional motion design is not in the big animations. It is in the HUNDREDS of tiny details that most viewers never consciously notice but subconsciously feel.

Amateur work:
- Elements appear and disappear
- Hover does nothing
- Loading has no indicator
- Transitions are cuts
- Dead pixels, dead frames, dead moments

Professional work:
- Everything has an entrance and exit
- Hover triggers a subtle response (scale 1.02, shadow increase, slight color shift)
- Loading has a graceful skeleton or spinner
- Transitions have choreographed motion
- Every moment has life (ambient motion, breathing elements, subtle pulses)

## 9.2 Catalog of Micro-Interactions

### Hover States (for interactive/web content)
- Scale up 2-5% with 150ms ease-out
- Subtle shadow increase (elevation change)
- Color brightness shift (+5-10% lightness)
- Border or outline appearance
- Cursor change + tooltip with fade

### Loading / Processing
- Skeleton screens: gray placeholder shapes that pulse with a shimmer animation
- Progress bar with ease-out (never linear -- perceived progress should front-load)
- Spinner with non-uniform rotation speed (ease-in-out per revolution)
- Content placeholder that morphs into real content when loaded

### Button / Interactive Feedback
- Press: scale to 0.95 over 100ms (feels like physical depression)
- Release: scale to 1.0 with slight overshoot (1.02) then settle, 200ms total
- Success: brief green flash or checkmark that draws itself, 300ms
- Error: brief red flash + subtle horizontal shake (3 oscillations, 300ms total)

### Breathing / Ambient
- Opacity oscillation: 0.85 to 1.0 over 2-4 seconds, sinusoidal
- Scale oscillation: 0.98 to 1.02 over 3-5 seconds
- Gradient shift: hue rotation of 5-15 degrees over 10-20 seconds
- Particle drift: very slow (0.5-2px per second), random direction

### Transitions Between Content (for video)
- Cross-dissolve: 200-400ms, simple but effective
- Shared element transition: an element from scene A morphs into its equivalent in scene B
- Wipe: directional reveal (left-to-right for progress, top-to-bottom for hierarchy)
- Scale transition: scene A scales down and recedes while scene B scales up from behind

## 9.3 The 3-Second Rule
If the total animation time on any page or screen exceeds 3 seconds before the user can interact with content, the animation is too long. Motion serves the content; content does not wait for motion.

---

# 10. MOTION DESIGN FOR EDUCATION (The Science)

## 10.1 Research Findings

### When Animation HELPS Learning
- **Complex dynamic processes**: Animations showing how a machine works, how blood flows, how tectonic plates shift -- processes that inherently involve motion. Static diagrams force the learner to mentally animate, which consumes cognitive resources.
- **Spatial relationships**: 3D structures (molecules, architecture, anatomy) benefit from rotation and exploded-view animations that static images cannot provide.
- **Sequential processes**: Step-by-step procedures animated in order are learned faster than static numbered lists.
- **Abstract concepts**: Mathematical transformations, data flows, algorithmic processes -- things that have no physical form benefit enormously from visual metaphor through motion.

### When Animation HURTS Learning
- **Transient information effect**: Animation disappears. Unlike text or static diagrams, animated information cannot be re-inspected at the learner's pace. Mitigation: provide pause/replay controls, or use the "build and hold" technique where animated elements REMAIN on screen after animating.
- **Split attention**: When the learner must simultaneously watch an animation AND read separate text, cognitive load increases. Mitigation: integrate text INTO the animation (labels that appear with their corresponding element, not in a separate caption).
- **Seductive details**: Beautiful but irrelevant animation distracts from learning. A gorgeous particle background that has nothing to do with the lesson content actively harms comprehension. Every motion must serve the content.
- **Excessive speed**: Animations that move faster than the learner can process create anxiety and disengagement. The research suggests 2-3 seconds per conceptual "beat."

## 10.2 Five Principles for Educational Animation

Based on cognitive load theory (Sweller), multimedia learning theory (Mayer), and the 2024 research on motion design for accessible learning:

### Principle 1: Illustrate, Don't Decorate
Every animation must directly represent or support the concept being taught. A bar growing to show a value increasing = illustration. A bar doing a backflip to show a value increasing = decoration.

### Principle 2: Guide Attention Sequentially
Use overlays, highlights, zooms, and animation timing to lead the viewer's eye through a visual explanation in the correct order. Never leave the viewer wondering "where should I look?"

### Principle 3: Synchronize Audio and Visual
When narration says "the temperature rises," the thermometer animation should begin within 100ms of those words. Asynchrony between audio and visual forces the learner to reconcile two timelines, wasting cognitive resources.

### Principle 4: Segment and Pace
Break complex animations into discrete segments with brief holds (500ms-1s) between them. This gives the learner's working memory time to encode the previous segment before the next arrives. The "build" technique is inherently segmented.

### Principle 5: Build and Hold
After an element animates into position, it should REMAIN visible for the duration of its relevance. Do not animate something in, then animate it out 2 seconds later unless it is truly no longer relevant. Educational animation should accumulate, not cycle.

## 10.3 The Progressive Disclosure Pattern

The most powerful technique for educational animation: **reveal complexity incrementally.**

Stage 1: Show the simplest version of the concept (a single element, a basic shape)
Stage 2: Add one layer of complexity (labels, connections, a second element)
Stage 3: Add another layer (data, color coding, relationships)
Stage 4: Show the full picture (everything visible, fully annotated)

Each stage builds ON the previous one. The viewer never sees anything "all at once." They watch the concept ASSEMBLE, which mirrors how understanding assembles in the mind.

**Duration per stage:** 2-5 seconds (including animation time + hold time for comprehension)
**Transition between stages:** 300-500ms

## 10.4 Animated vs Static Diagrams: The Research

A meta-analysis across multiple studies shows:
- Animated diagrams outperform static diagrams for **procedural knowledge** (how things work in sequence)
- Static diagrams match or outperform animations for **declarative knowledge** (what things are)
- The advantage of animation INCREASES with concept complexity
- The advantage of animation DECREASES when learners can control pacing (because they effectively create their own "animation" by scanning a static diagram in order)
- Learner-controlled animated diagrams (with pause/replay) consistently outperform both uncontrolled animation and static diagrams

---

# 11. STYLE FRAMES AND MOTION DESIGN SYSTEMS

## 11.1 Style Frames: The Keyframes of Design

A style frame is a single, finished-quality still image that represents a key moment in an animation. If storyboards are the script, style frames are the cinematography.

### What a Style Frame Must Communicate
- **Color palette**: The exact colors that will be used, applied to real content
- **Typography**: The actual fonts at actual sizes in actual layouts
- **Illustration style**: The level of detail, the line quality, the rendering approach
- **Composition**: Where elements sit, how space is used, what the visual hierarchy is
- **Mood/tone**: The emotional register of the piece -- serious, playful, urgent, calm
- **Motion cues**: Arrows, blur trails, ghost positions, or annotations that hint at how things will move

### How Many Style Frames
- **Simple project (30-60 seconds)**: 3-5 style frames
- **Medium project (1-3 minutes)**: 5-10 style frames
- **Complex project (3+ minutes)**: 10-20 style frames
- Each frame should represent a visually distinct moment. If two scenes look similar, one frame can represent both.

### Style Frame Workflow
1. **Research + references**: Collect visual inspiration (Pinterest, Dribbble, Behance, competitor analysis)
2. **Mood board**: Organize references into emotional/aesthetic clusters
3. **Rough sketches**: Pencil/digital sketches of key moments (5-10 minutes each)
4. **Style exploration**: Create 2-3 different aesthetic approaches for the first key moment
5. **Client/stakeholder review**: Select direction
6. **Full style frames**: Polish the selected direction across all key moments
7. **Animation direction notes**: Annotate frames with motion intent

## 11.2 Motion Design Systems (Animation Design Systems)

Just as a visual design system defines colors, typography, spacing, and components, a motion design system defines how things MOVE.

### Components of a Motion Design System

**1. Duration Tokens**
```
--motion-duration-instant: 100ms
--motion-duration-fast: 200ms
--motion-duration-normal: 300ms
--motion-duration-slow: 400ms
--motion-duration-dramatic: 600ms
```

**2. Easing Tokens**
```
--motion-ease-enter: cubic-bezier(0, 0, 0.58, 1)       /* ease-out */
--motion-ease-exit: cubic-bezier(0.42, 0, 1, 1)         /* ease-in */
--motion-ease-move: cubic-bezier(0.42, 0, 0.58, 1)      /* ease-in-out */
--motion-ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1) /* overshoot */
--motion-ease-spring: cubic-bezier(0.25, 0.1, 0.25, 1)  /* Apple-like */
```

**3. Animation Behaviors (Entrance)**
```
fade-in:        opacity 0 → 1, duration-fast, ease-enter
slide-up:       translateY(20px → 0) + fade-in, duration-normal, ease-enter
slide-right:    translateX(-20px → 0) + fade-in, duration-normal, ease-enter
scale-up:       scale(0.95 → 1) + fade-in, duration-normal, ease-enter
pop:            scale(0 → 1.05 → 1), duration-normal, ease-bounce
```

**4. Animation Behaviors (Exit)**
```
fade-out:       opacity 1 → 0, duration-fast, ease-exit
slide-down:     translateY(0 → 20px) + fade-out, duration-fast, ease-exit
slide-left:     translateX(0 → -20px) + fade-out, duration-fast, ease-exit
scale-down:     scale(1 → 0.95) + fade-out, duration-fast, ease-exit
```

**5. Choreography Rules**
- Stagger delay: 60ms between sequential siblings
- Maximum total stagger: 500ms
- Parent containers animate before children
- Enter behaviors are 30% longer than exit behaviors
- Only one "hero" animation per view transition

**6. Contextual Motion**
- Navigation transitions: slide along the axis of navigation (horizontal for sibling, vertical for parent/child)
- State changes: morphing in-place with ease-move
- Feedback: instant (100ms) with ease-enter
- Ambient: continuous, slow, sinusoidal

### Naming Convention for Motion Tokens
```
[system]-[property]-[variant]

Example:
motion-duration-fast
motion-ease-enter
motion-behavior-slideUp
motion-stagger-default
```

---

# 12. THE MASTERS: BUCK, GUNNER, AND THE TRANSCENDENT SCHOOL

## 12.1 What Makes Motion Design Transcendent

The gap between "good" and "transcendent" motion design is not technical skill. It is:

### Texture
- Grain, noise, imperfection layered on top of clean geometry
- Digital elements that feel tactile and physical
- Light leaks, chromatic aberration, film grain, paper texture
- Buck excels here: their work feels like you could reach out and touch it

### Craft
- Every single frame is considered. Pause at any point and it looks like a poster.
- Easing curves are custom per element, not globally applied defaults
- Color shifts are precise: not "this gets brighter" but "this shifts from #3A7BD5 to #57B7FF at exactly frame 47"
- Transitions are invented for each project, not pulled from presets

### Surprise
- Motion that does something you did not expect but immediately makes sense
- An element that exits in an unexpected direction, revealing new content behind it
- A morph that connects two seemingly unrelated concepts
- Timing that breaks the pattern: three elements enter at consistent intervals, then the fourth enters with a different rhythm, drawing extra attention

### Emotional Resonance
- Motion that makes you FEEL something: wonder, urgency, calm, excitement
- This comes from the combination of all other qualities, plus music/sound design
- A growing shape paired with a rising orchestral swell = hope
- A disintegrating shape paired with a descending tone = loss
- The motion itself carries emotional weight through speed, scale, direction, and timing

## 12.2 Studio Profiles

### Buck (founded 2004, LA/NYC/Sydney/Amsterdam/London)
**Signature:** Seamless integration of 2D and 3D. Photorealistic textures on stylized forms. Emotional storytelling through brand content.
**Notable clients:** Apple, Google, Nike, Airbnb, Dropbox, Meta
**What to study:** Their transitions. Elements transform, morph, and flow between scenes as if the entire piece exists in a single continuous space. Their color work. Every palette is intentional and emotionally calibrated.
**Key lesson:** Technology serves story, never the reverse. Buck will use 2D, 3D, stop-motion, live-action, or any combination -- whatever best serves the emotional core of the piece.

### Gunner (Brooklyn)
**Signature:** Bold, graphic, high-energy. Strong shape language with punchy color palettes. Work that feels like it is MOVING even in still frames.
**What to study:** Their use of scale and contrast. Elements go from tiny to MASSIVE in a single transition. Their timing: fast, rhythmic, musical.
**Key lesson:** Confidence in simplicity. Gunner proves that strong shapes + bold color + precise timing can be more powerful than complex 3D or elaborate illustration.

### Giant Ant (Vancouver)
**Signature:** Warm, human, story-driven. Character animation that feels genuine and relatable.
**What to study:** Their pacing. They let moments breathe. Not every second is packed with motion; some of the most powerful moments are a character simply pausing.
**Key lesson:** Restraint is a superpower. The absence of motion is as powerful as its presence.

### Ordinary Folk (Vancouver)
**Signature:** Playful, colorful, inventive transitions. Each project has a unique visual system that feels cohesive throughout.
**What to study:** Their visual systems. Every project has a "rule set" that governs how elements behave, and that consistency creates a world the viewer can trust and inhabit.
**Key lesson:** Design the SYSTEM, not just the scenes. When your motion has rules, the viewer learns those rules and can anticipate and enjoy the rhythm.

### Tendril (Toronto)
**Signature:** Dark, cinematic, texture-heavy. 3D work that feels filmic rather than digital.
**What to study:** Their lighting and atmosphere. Scenes feel like they exist in real space with real physics.
**Key lesson:** Mood is a design material. The emotional atmosphere of a piece is as important as the shapes and colors.

## 12.3 The Emotional Spectrum of Motion

| Motion Quality | Emotional Effect | How to Achieve |
|---------------|-----------------|----------------|
| **Slow + smooth** | Calm, trust, luxury | Long durations, gentle ease-in-out, minimal overshoot |
| **Fast + snappy** | Energy, excitement, urgency | Short durations, strong ease-out, quick cuts |
| **Bouncy** | Playful, fun, accessible | Spring physics, overshoot, rounded easing |
| **Heavy + deliberate** | Serious, important, weighty | Slow ease-in, long settle time, no bounce |
| **Organic + flowing** | Natural, human, warm | Noise-driven paths, arcs, overlapping action |
| **Geometric + precise** | Technical, smart, reliable | Linear paths, grid alignment, synchronized timing |
| **Chaotic + unpredictable** | Tension, danger, excitement | Variable timing, random directions, rapid changes |
| **Rhythmic + musical** | Engaging, memorable, fun | Motion synced to beat, consistent interval patterns |

---

# 13. IMPLEMENTATION ARCHITECTURE (For Like One Studio)

## 13.1 Recommended Tech Stack

```
VIDEO RENDERING ENGINE
  Remotion (React + TypeScript)
  |-- Spring animations for natural motion
  |-- Interpolation for eased transitions
  |-- Sequence component for scene management
  |-- useCurrentFrame() for frame-precise control
  |
  +-- Three.js (via @react-three/fiber)
  |   |-- 3D particle systems
  |   |-- Generative backgrounds
  |   |-- Depth-based motion
  |
  +-- Manim (Python, for mathematical content)
  |   |-- Mathematical object animation
  |   |-- LaTeX equation rendering
  |   |-- Transform/morph between mathematical forms
  |
  +-- FFmpeg (post-processing)
      |-- Concatenation
      |-- Audio mixing
      |-- Format conversion
      |-- Batch rendering

DESIGN SYSTEM
  Motion tokens (CSS custom properties or TypeScript constants)
  |-- Duration scale
  |-- Easing functions
  |-- Stagger intervals
  |-- Color palette
  |-- Typography scale

ASSET PIPELINE
  SVG illustrations (Illustrator/Figma export)
  Audio (narration + music + SFX)
  Fonts (self-hosted, subset for video)
  Data (JSON/API for dynamic content)
```

## 13.2 Motion Design Checklist (Per Video)

Pre-production:
- [ ] Style frames created (3-5 minimum)
- [ ] Motion design system tokens defined
- [ ] Storyboard with timing annotations
- [ ] Audio narration recorded and timestamped

Production:
- [ ] Every element has an entrance animation
- [ ] Every element has an exit animation (or remains on screen intentionally)
- [ ] No linear easing (unless intentionally mechanical)
- [ ] Stagger applied to grouped elements
- [ ] Primary/secondary/tertiary motion hierarchy established
- [ ] Spatial logic consistent (new content = right/bottom, old content = left/top)
- [ ] Typography animated at minimum Level 2 (slide + fade)
- [ ] Data visualizations use the "build" technique
- [ ] Ambient motion present in every scene (particles, gradient shifts, breathing)

Polish:
- [ ] Every frame passes the "pause test" (looks good as a still)
- [ ] Audio synced within 100ms of corresponding visuals
- [ ] No dead frames (frames with zero motion and no intentional hold)
- [ ] Total animation duration per scene < 3 seconds before content is readable
- [ ] Accessibility: reduced-motion alternative available

---

# SOURCES AND REFERENCES

## Academic
- Thomas, F. & Johnston, O. (1981). *The Illusion of Life: Disney Animation*
- Sweller, J. (1988). Cognitive Load Theory and instructional design
- Mayer, R. (2009). *Multimedia Learning*
- Motion Design Principles for Accessible Video-based Learning (2024), arXiv:2410.00196

## Industry
- School of Motion (schoolofmotion.com) -- professional curriculum
- Material Design 3 Motion Guidelines (m3.material.io)
- Nielsen Norman Group -- Animation Duration research (nngroup.com)
- Carbon Design System -- Motion tokens (carbondesignsystem.com)

## Tools
- Remotion (remotion.dev) -- React-based programmatic video
- Manim (github.com/3b1b/manim) -- Mathematical animation engine
- Three.js (threejs.org) -- 3D WebGL library
- p5.js (p5js.org) -- Creative coding library
- Easings.net -- Easing function reference

## Studios
- Buck (buck.co)
- Gunner (gunner.work)
- Giant Ant (giantant.ca)
- Ordinary Folk (ordinaryfolk.co)
- Tendril (tendril.ca)
- Kurzgesagt (kurzgesagt.org)
