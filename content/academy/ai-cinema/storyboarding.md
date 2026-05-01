---
title: "AI Storyboarding & Shot Planning"
course: "ai-cinema"
order: 3
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-cinema/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 3 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>AI Storyboarding & <span class="accent">Shot Planning.</span></h1>
  <p class="sub">Lock your visual language before spending a single video generation credit.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>How to generate production-quality storyboards with image AI</li>
    <li>Shot types, camera movements, and lens choices that AI video generators handle well</li>
    <li>How to build character reference sheets for cross-scene consistency</li>
    <li>The shot list format that feeds directly into video generation</li>
  </ul>
</div>

<div class="lesson-section">
<h2>Why Storyboarding Saves Money</h2>

Video generation credits are the most expensive part of the AI cinema pipeline. Kling Pro costs roughly $0.10-0.30 per 10-second clip. If you generate blindly, you will burn through $20-50 in failed attempts before landing on the right look.

Storyboarding with image generation costs 1/10th as much. A single Midjourney or Flux image costs $0.01-0.03. You can iterate 50 times on a single frame for less than the cost of one video generation attempt.

The workflow: generate storyboard frames until every shot looks exactly right, then use those frames as image-to-video inputs. This locks your visual language -- color palette, composition, character design, lighting -- before you ever touch the video pipeline.

```
COST COMPARISON: 8-scene short film
Without storyboards: ~40 video generations x $0.20 = $8.00
With storyboards:    ~80 images x $0.02 + 12 videos x $0.20 = $4.00

Savings: 50% fewer video credits, 3x faster production
```

<div class="tip-box">
Think of storyboards as your visual contract with yourself. Once approved, they become the ground truth. Every video generation attempt is measured against the storyboard frame. If it does not match, regenerate. No scope creep.
</div>
</div>

<div class="lesson-section">
<h2>Cinematography for AI: What Works</h2>

Not all traditional camera techniques translate well to AI video generators. Here is what current models handle reliably versus what they struggle with:

**Reliable (use freely):**
- Static wide shots and establishing shots
- Slow dolly forward/backward
- Slow pan left/right
- Medium shots of single characters
- Atmospheric shots (rain, fog, light shafts)
- Rack focus (foreground to background)

**Unreliable (use carefully):**
- Fast camera movements (whip pan, crash zoom)
- Tracking shots following walking characters
- Handheld/shaky cam simulation
- Complex multi-character blocking
- POV shots with hands in frame
- Continuous shots longer than 5 seconds

**Avoid entirely (for now):**
- Steadicam orbits around subjects
- Crane shots with vertical movement
- Split-screen or multi-angle composites
- Shots requiring precise physical interactions (handshakes, fighting)

Build your shot list using the reliable column. When you need an unreliable technique, plan for 3-5x more generation attempts and budget accordingly.

```
SHOT LIST FORMAT:
Scene | Shot | Type    | Movement      | Duration | Notes
1     | 1A   | Wide    | Static        | 4s       | Establishing, rainy city
1     | 1B   | Med     | Slow push-in  | 6s       | Character reveal
2     | 2A   | Close   | Static        | 3s       | Hands on photograph
2     | 2B   | Med-W   | Slow pan R    | 5s       | Room reveal
```
</div>

<div class="lesson-section">
<h2>Building Character Reference Sheets</h2>

Character consistency is the hardest challenge in AI cinema. The solution starts here in pre-production with comprehensive character reference sheets.

For each character, generate a reference grid: 4-8 images showing the character from different angles, in different lighting, with consistent features. Use a single image generator with a locked seed or style reference.

**Midjourney character sheet prompt:**
```
Character reference sheet for a Japanese woman in her 40s,
short black hair with grey streaks, dark circles under eyes,
angular face, wearing a grey wool sweater and navy trench coat.
Four views: front, 3/4 left, 3/4 right, profile.
Neutral expression. Studio lighting on grey background.
Cinematic photography style. --ar 16:9 --style raw
```

**Flux character sheet prompt:**
```
A professional character reference sheet showing four views
of the same person: a 40-year-old Japanese woman with short
black hair streaked with grey, angular face with prominent
cheekbones, wearing a grey sweater under a navy trench coat.
Views: front facing, left three-quarter, right three-quarter,
and left profile. Neutral expression, studio lighting,
grey backdrop. Photorealistic cinematic style.
```

Save these reference images. They will serve as:
1. **Image-to-video input** for video generation
2. **Style reference** for scene storyboards
3. **Consistency check** for every generated shot

<div class="callout">
<strong>Critical:</strong> Generate your character references BEFORE your storyboards. Use the approved character reference as a style anchor for all subsequent storyboard frames. This creates visual consistency from the first frame to the last.
</div>
</div>

<div class="lesson-section">
<h2>Storyboard Generation Workflow</h2>

Follow this sequence for each scene in your script:

**Step 1 - Mood frame:** Generate a single image that captures the overall mood, lighting, and color palette of the scene. This is your atmospheric reference.

**Step 2 - Composition frame:** Using the mood frame as style reference and your character sheet as character reference, generate the actual composition -- character placement, camera angle, framing.

**Step 3 - Action frames:** For scenes with movement, generate 2-3 frames showing the progression. Frame A is the start position, Frame B is mid-action, Frame C is end position. These become your image-to-video keyframes.

**Step 4 - Annotate:** Add text overlays noting camera movement, duration, audio cues, and transition type. Tools: Figma (free), Canva, or even Preview on macOS.

```
ANNOTATION FORMAT (add to each storyboard frame):
[SCENE 3 | SHOT 3A | MED CLOSE-UP | PUSH IN 2s]
Audio: Rain ambience + synth pad
Transition: Dissolve from 2B
VFX: Subtle lens flare, rain droplets on lens
Character: Keiko - reference sheet v2, grey sweater
```

A complete storyboard for an 8-scene short takes 30-60 minutes with AI tools. The same work takes a traditional storyboard artist 2-3 days.
</div>

<div class="lesson-section">
<h2>From Storyboard to Production Bible</h2>

Your final storyboard package becomes the production bible for video generation:

1. **Master shot list** (spreadsheet or table with all shots)
2. **Character reference sheets** (per character)
3. **Annotated storyboard frames** (per shot)
4. **Color palette document** (hex codes pulled from approved frames)
5. **Camera movement notes** (per shot)
6. **Audio direction** (per scene)

Organize this in a single folder with clear naming:

```
project-rain-memory/
  characters/
    keiko-reference-v2.png
    keiko-wardrobe-alt.png
  storyboards/
    scene01-shot1a-wide-establishing.png
    scene01-shot1b-med-character-reveal.png
    scene02-shot2a-close-hands.png
  shot-list.md
  script.md
  color-palette.png
```

<div class="demo-container">
<h4>Exercise: Build a 4-Shot Storyboard</h4>
Take the first scene from your script package (Lesson 2 exercise). Generate: 1 character reference sheet, 1 mood frame, and 4 storyboard frames covering the first scene. Annotate each frame with shot type, camera movement, and duration. Total cost should be under $0.50 in image generation credits.
</div>
</div>

<QuizMC>
<Question text="Why is storyboarding with image AI more cost-effective than iterating directly with video generation?">
<Option text="Image generation produces higher quality results" />
<Option correct text="Image generation costs 1/10th as much, allowing more iterations before committing to video" />
<Option text="Video generators require storyboards as mandatory input" />
<Option text="Storyboards are needed for copyright protection" />
</Question>
<Question text="Which camera technique is generally RELIABLE in current AI video generators?">
<Option text="Steadicam orbit around a subject" />
<Option text="Fast whip pan" />
<Option correct text="Slow dolly forward" />
<Option text="Complex multi-character blocking" />
</Question>
</QuizMC>

<FlashDeck>
<Card front="What are the four steps in the storyboard generation workflow?" back="1. Mood frame (atmosphere/lighting/color), 2. Composition frame (character placement, camera angle), 3. Action frames (2-3 progression keyframes), 4. Annotate (camera movement, duration, audio, transitions)" />
<Card front="Why must character reference sheets be generated BEFORE storyboards?" back="The character reference serves as a style anchor for all subsequent storyboard frames, creating visual consistency from the first frame to the last." />
<Card front="What six components make up the production bible?" back="1. Master shot list, 2. Character reference sheets, 3. Annotated storyboard frames, 4. Color palette document, 5. Camera movement notes, 6. Audio direction" />
<Card front="What three purposes do character reference sheets serve in AI cinema?" back="1. Image-to-video input for generation, 2. Style reference for storyboard frames, 3. Consistency check for every generated shot" />
</FlashDeck>

</div>