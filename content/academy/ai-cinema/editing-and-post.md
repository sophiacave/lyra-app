---
title: "Editing & Post-Production"
course: "ai-cinema"
order: 7
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-cinema/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 7 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Editing & <span class="accent">Post-Production.</span></h1>
  <p class="sub">Where raw AI generations become cinema through cut, pace, and color.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>How to assemble AI-generated clips into a cohesive narrative in DaVinci Resolve</li>
    <li>Editing rhythms and cut patterns that mask AI video artifacts</li>
    <li>Color grading workflows that unify visually disparate AI shots</li>
    <li>Upscaling, frame interpolation, and quality enhancement techniques</li>
  </ul>
</div>

<div class="lesson-section">
<h2>DaVinci Resolve: The Free Powerhouse</h2>

DaVinci Resolve (free edition) is the industry-standard tool for AI cinema post-production. It provides professional editing, color grading, audio mixing (Fairlight), and compositing (Fusion) in a single application.

Project setup for AI cinema:

```
Project Settings:
  Timeline resolution: 1920x1080 (or 3840x2160 if upscaling)
  Timeline frame rate: 24fps (cinematic standard)
  Color science: DaVinci YRGB Color Managed
  Working color space: DaVinci Wide Gamut
  Timeline color space: Rec.709 (for web delivery)

Media import:
  Create bins for: Raw Generations / Approved Takes / Audio /
    Storyboards / Character References / VFX Elements
  Import all generated clips into Raw Generations
  Rate clips (1-5 stars) based on quality evaluation
  Move 4-5 star clips to Approved Takes
```

Organize your timeline with these track layers:

```
V4: Titles and text overlays
V3: VFX and compositing layers
V2: B-roll, cutaways, inserts
V1: Primary narrative footage
A1: Dialogue / Voice-over
A2: Music score
A3: Ambience / room tone
A4: Sound effects / foley
```

<div class="tip-box">
Always work non-destructively. Never modify your original generated files. Apply all changes as timeline effects, color nodes, or Fusion compositions. This lets you swap any clip at any time without losing your edit.
</div>
</div>

<div class="lesson-section">
<h2>Editing Rhythms for AI Cinema</h2>

AI-generated clips have a natural cadence problem: they tend to start strong and degrade over time. The first 2-3 seconds are usually the highest quality, with artifacts accumulating toward the end of longer clips.

This shapes your editing strategy:

**The 3-Second Rule:** Default to 2-4 second shots. This keeps you in the high-quality window of most generated clips. Longer shots should be reserved for establishing shots and moments of stillness where motion artifacts are minimal.

**Cut patterns that hide artifacts:**

```
1. Cut on motion: Trim to the moment before artifacts appear.
   If a character's hand starts morphing at 4.2 seconds,
   cut at 4.0 seconds to a different angle.

2. Match cuts: Cut between similar compositions to create
   continuity. A close-up of hands in one shot cuts to
   a close-up of hands in the next -- different generations
   but same visual rhythm.

3. L-cuts and J-cuts: Let audio from the next scene begin
   before the visual cut (J-cut) or let audio from the
   current scene continue into the next visual (L-cut).
   This smooths transitions and distracts from visual
   inconsistencies.

4. Reaction cuts: Instead of showing continuous action,
   cut to a "reaction" -- rain, a reflection, an object.
   Then return to the character. The interruption resets
   the viewer's consistency expectations.
```

**Pacing guide by genre:**
```
Atmospheric / contemplative: 4-8 second average shot length
Drama / dialogue: 3-5 seconds
Thriller / tension: 2-4 seconds
Action / montage: 1-3 seconds
```
</div>

<div class="lesson-section">
<h2>Color Grading for Unity</h2>

Color grading is where disparate AI-generated shots become a unified film. Since each generation has slightly different color characteristics, grading is essential rather than optional.

**Step 1 - Primary correction (per shot):**
Normalize every clip to a consistent baseline. Match exposure, white balance, and contrast across all shots.

```
DaVinci Resolve Color Page:
Node 1: Exposure correction (lift/gamma/gain)
  - Match mid-grey levels across all shots
  - Ensure skin tones fall on the skin tone line (vectorscope)
Node 2: White balance
  - Match color temperature across shots
  - Use the eyedropper on a known neutral (white or grey element)
```

**Step 2 - Secondary correction (selective):**
Isolate and adjust specific elements. Most commonly: fix skin tones that shifted between generations.

```
Node 3: Skin tone qualifier
  - Use the HSL qualifier to isolate skin
  - Normalize hue toward consistent target
  - Reduce saturation slightly for cinematic look
Node 4: Sky/background qualifier (if needed)
  - Match background color across shots
```

**Step 3 - Creative grade (whole film):**
Apply a unified look across the entire timeline. Use a LUT (Look-Up Table) or manual grade on an adjustment clip.

```
Node 5 (applied to all clips via adjustment clip):
  - Apply cinematic LUT (teal-orange, film emulation, etc.)
  - Subtle vignette (darken edges 10-15%)
  - Film grain overlay (0.5-1.0 strength)
  - Slight halation on highlights (bloom)
```

<div class="callout">
<strong>The single most impactful technique:</strong> Apply the same LUT and film grain to every shot. This visual unity makes the audience's brain believe all shots came from the same camera, even when they came from different AI platforms with different characteristics.
</div>
</div>

<div class="lesson-section">
<h2>Upscaling and Enhancement</h2>

Most AI video generators output 1080p. For larger screens or future-proofing, upscale in post-production.

**DaVinci Resolve Super Scale:**
```
Project Settings → Master Settings → Enable Super Scale
Options: 2x (to 4K), 3x (to 6K), 4x (to 8K)
Enhancement: Sharpening (medium), Noise reduction (low)
Note: Free edition limits output to 4K. Studio required for 8K.
```

**Frame interpolation for smoothness:**
AI-generated clips sometimes have inconsistent frame timing. DaVinci Resolve's Optical Flow retime can smooth this:

```
Right-click clip → Retime Controls
Set speed to 100% (no change)
Retime Process: Optical Flow (best quality)
Motion estimation: Speed Warp (Studio) or Enhanced (Free)
```

**Topaz Video AI (external, optional):**
For maximum upscaling quality, export individual clips and process through Topaz Video AI. This adds cost ($199 one-time license) but produces noticeably sharper results than built-in upscaling.

```
Topaz settings for AI cinema:
Model: Proteus (best for AI-generated content)
Output: 4K (3840x2160)
Frame rate: Match source (24fps)
Grain: Remove (you will add your own in Resolve)
Compression: ProRes 422 or DNxHR HQ
```
</div>

<div class="lesson-section">
<h2>Export and Delivery</h2>

Final export settings depend on your distribution target:

```
YouTube / Web:
  Codec: H.264 or H.265
  Resolution: 3840x2160 (upload 4K even for 1080p source)
  Bitrate: 40-60 Mbps (YouTube re-encodes, start high)
  Audio: AAC 256kbps stereo
  Frame rate: 24fps

Film Festival (DCP):
  Codec: JPEG2000
  Resolution: 2048x858 (Scope) or 1998x1080 (Flat)
  Bitrate: 250 Mbps
  Audio: WAV 48kHz/24-bit, 5.1 surround
  Use DCP-o-matic (free) for DCP creation

Archive Master:
  Codec: ProRes 422 HQ or DNxHR HQ
  Resolution: Maximum available
  Audio: WAV 48kHz/24-bit
  Keep all project files for future re-export
```

<div class="demo-container">
<h4>Exercise: Assemble a 60-Second Edit</h4>
Take 4-6 of your generated clips from previous exercises. Import them into DaVinci Resolve. Apply the editing rhythms from this lesson: use L-cuts, cut on motion, and insert at least one reaction cutaway. Apply a primary color correction to normalize all clips, then apply a single LUT across the timeline. Export as H.264 1080p. Total time: 45-60 minutes.
</div>
</div>

<QuizMC>
<Question text="What is the '3-Second Rule' in AI cinema editing?">
<Option text="No shot should be shorter than 3 seconds" />
<Option correct text="Default to 2-4 second shots because AI clips start strong and artifacts accumulate after 2-3 seconds" />
<Option text="Wait 3 seconds between each cut for dramatic effect" />
<Option text="Generate clips in 3-second increments for consistency" />
</Question>
<Question text="What is the most impactful single technique for unifying AI-generated shots in color grading?">
<Option text="Adjusting white balance on each shot individually" />
<Option text="Using the most expensive LUT available" />
<Option correct text="Applying the same LUT and film grain to every shot to simulate a single camera" />
<Option text="Converting all footage to black and white" />
</Question>
</QuizMC>

<FlashDeck>
<Card front="What are the four recommended video timeline tracks in DaVinci Resolve?" back="V1: Primary narrative footage, V2: B-roll/cutaways/inserts, V3: VFX and compositing layers, V4: Titles and text overlays" />
<Card front="What is an L-cut and how does it help in AI cinema?" back="An L-cut lets audio from the current scene continue into the next visual. It smooths transitions between shots and distracts from visual inconsistencies at cut points." />
<Card front="What are the three steps of color grading for AI cinema?" back="1. Primary correction (normalize exposure, white balance, contrast per shot), 2. Secondary correction (fix skin tones, match backgrounds), 3. Creative grade (unified LUT, vignette, film grain across entire film)" />
<Card front="Why upload 4K to YouTube even from 1080p source material?" back="YouTube allocates higher bitrate to 4K uploads during re-encoding, resulting in better visual quality even for viewers watching at 1080p." />
</FlashDeck>

</div>