---
title: "Script & Story Development with AI"
course: "ai-cinema"
order: 2
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-cinema/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 2 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Script & Story <span class="accent">Development with AI.</span></h1>
  <p class="sub">From concept to shooting script using LLMs as your writers' room.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>How to use LLMs to develop loglines, treatments, and full screenplays</li>
    <li>The three-act structure adapted for AI short films (1-5 minutes)</li>
    <li>How to write scene descriptions that translate directly to video generation prompts</li>
    <li>Prompt engineering patterns for consistent narrative voice</li>
  </ul>
</div>

<div class="lesson-section">
<h2>The AI Writers' Room</h2>

Professional screenwriting follows a funnel: concept to logline to treatment to outline to screenplay. Each stage compresses or expands the story. LLMs excel at every stage when you provide the right constraints.

The key principle: **LLMs are not your writer. You are the writer. LLMs are your writers' room** -- they brainstorm, challenge, expand, and refine your ideas. The director's vision must come from you.

Start every project with a concept document. Feed this to your LLM:

```
CONCEPT BRIEF
Genre: Sci-fi noir
Duration: 3 minutes
Tone: Melancholic, contemplative
Theme: Memory is unreliable
Setting: Near-future Tokyo, perpetual rain
Protagonist: Retired memory detective
Core conflict: She discovers her own memories are fabricated
Visual reference: Blade Runner meets Lost in Translation
```

From this brief, ask the LLM to generate ten loglines. Pick the strongest and iterate. A good logline for AI cinema is under 30 words and implies visual spectacle.

<div class="tip-box">
AI short films work best with simple narratives and strong visual concepts. You have 1-5 minutes. One character, one conflict, one revelation. Complexity kills quality in AI cinema because every additional element multiplies the consistency challenges.
</div>
</div>

<div class="lesson-section">
<h2>Three-Act Structure for Short Films</h2>

The classic three-act structure compresses beautifully into short form:

**Act 1 (20% of runtime):** Establish world, character, and normal state. For a 3-minute film, this is 36 seconds. One or two shots that immediately communicate setting, mood, and protagonist.

**Act 2 (60% of runtime):** Introduce conflict, escalate tension, build toward crisis. About 108 seconds. This is where your story lives. Three to five scenes with clear visual progression.

**Act 3 (20% of runtime):** Resolution or revelation. 36 seconds. The twist, the emotional payoff, the final image that lingers.

Here is a practical scene breakdown template:

```
SCENE BREAKDOWN - "Rain Memory"
Runtime: 3:00

ACT 1 (0:00-0:36)
  Scene 1 (0:00-0:18): Establishing shot - Tokyo skyline, rain,
    neon. Slow push-in. Mood: isolation.
  Scene 2 (0:18-0:36): INT. Apartment - Keiko stares at a
    holographic photo. She touches it. It glitches.

ACT 2 (0:36-2:24)
  Scene 3 (0:36-1:00): Keiko walks rain-soaked streets.
    Voice-over: "Every memory I extracted was real. Mine weren't."
  Scene 4 (1:00-1:30): FLASHBACK - A memory of a beach.
    Colors oversaturated. Something is wrong.
  Scene 5 (1:30-2:00): Keiko at her old office. Discovers her
    case file. Her face in the "subject" photo.
  Scene 6 (2:00-2:24): She runs. Rain. Neon reflections.
    The city feels like it is watching.

ACT 3 (2:24-3:00)
  Scene 7 (2:24-2:48): Keiko stops running. Looks up.
    Rain on her face. Acceptance.
  Scene 8 (2:48-3:00): Wide shot - she is one of hundreds
    of identical figures in the rain. Pull out to black.
```

Each scene description doubles as the seed for your video generation prompt. Write scenes with visual precision from the start.
</div>

<div class="lesson-section">
<h2>Writing Prompt-Ready Scene Descriptions</h2>

Traditional screenwriting separates action lines from technical direction. In AI cinema, you merge them. Every scene description must encode:

1. **Subject**: Who/what is in frame, with specific physical details
2. **Action**: What is happening, described as motion
3. **Setting**: Where, with atmospheric details
4. **Camera**: Shot type, movement, lens characteristics
5. **Mood**: Lighting, color palette, emotional tone

Compare these approaches:

```
TRADITIONAL SCREENPLAY:
INT. APARTMENT - NIGHT
Keiko sits at her desk. Rain streams down the window.
She picks up an old photograph and studies it.

PROMPT-READY SCREENPLAY:
INT. APARTMENT - NIGHT
Medium shot, static camera. A Japanese woman in her 40s
(short black hair, dark circles under eyes, grey sweater)
sits at a cluttered desk lit by a single warm desk lamp.
Rain streaks down a floor-to-ceiling window behind her,
city lights blurred bokeh. She picks up a physical
photograph with both hands, bringing it closer to her face.
Her expression shifts from neutral to confused.
Color palette: warm amber interior vs cool blue exterior.
Aspect ratio: 2.39:1 anamorphic.
```

The second version can be fed almost directly to Kling or Runway with minor formatting changes. This is the core skill: writing prose that is simultaneously a screenplay and a generation prompt.

<div class="callout">
<strong>Pro technique:</strong> Maintain a character reference document alongside your script. List every physical detail, wardrobe item, and distinguishing feature. You will reference this document for every scene to maintain character consistency across shots.
</div>
</div>

<div class="lesson-section">
<h2>LLM Prompt Patterns for Screenwriting</h2>

Use these proven prompt patterns to get professional-quality output from any LLM:

**The Genre Expert Pattern:**
```
You are a screenwriter who specializes in [genre].
Your influences are [Director A], [Director B], and [Director C].
Write in a style that combines [quality A] with [quality B].
```

**The Constraint Pattern:**
```
Write a scene with these constraints:
- Maximum 3 characters
- Single location
- Must convey [emotion] without dialogue
- Visual storytelling only
- Under 45 seconds of screen time
```

**The Iteration Pattern:**
```
Here is my scene. Rewrite it three ways:
1. More visually specific (add camera, lighting, color details)
2. More emotionally resonant (deepen the subtext)
3. More producible (simplify for AI video generation)
```

**The Dialogue Pattern (for voice-over):**
```
Write voice-over narration for this scene.
Rules: Under 30 words. Present tense. First person.
Tone: [specific adjective]. The character is [emotional state].
The narration must contrast with what we see on screen.
```

Chain these patterns: generate with the Genre Expert, refine with the Constraint Pattern, polish with the Iteration Pattern, add voice-over with the Dialogue Pattern.
</div>

<div class="lesson-section">
<h2>Building Your Script Package</h2>

Before moving to storyboarding (Lesson 3), your script package should contain:

1. **Logline** (1 sentence)
2. **Treatment** (1 paragraph summary)
3. **Scene breakdown** (numbered scenes with timestamps)
4. **Prompt-ready scene descriptions** (all five encoding elements)
5. **Character reference sheet** (physical details, wardrobe, mannerisms)
6. **Voice-over script** (if applicable, timed to scenes)
7. **Visual reference list** (films, photographers, color palettes)

Store everything in a single markdown file. This becomes your production bible -- every subsequent step references it.

<div class="demo-container">
<h4>Exercise: Write a 3-Minute Script Package</h4>
Using the patterns above, create a complete script package for a 3-minute short film in any genre. Include all seven components. Use an LLM as your writers' room, but make every creative decision yourself. Time yourself: this should take 30-45 minutes with AI assistance. Without AI, the same work takes professional screenwriters 2-3 days.
</div>
</div>

<QuizMC>
<Question text="What is the recommended role of LLMs in the AI cinema screenwriting process?">
<Option text="LLMs should write the entire screenplay autonomously" />
<Option correct text="LLMs serve as a writers' room -- they brainstorm and refine while you make creative decisions" />
<Option text="LLMs should only be used for spell-checking and formatting" />
<Option text="LLMs replace the need for any narrative structure" />
</Question>
<Question text="Why should scene descriptions encode camera, lighting, and color details directly in the script?">
<Option text="It makes the script look more professional for film festivals" />
<Option text="Traditional screenplay format requires it" />
<Option correct text="The scene descriptions double as video generation prompts, reducing translation work" />
<Option text="AI video generators cannot work without color palette information" />
</Question>
</QuizMC>

<FlashDeck>
<Card front="What are the five elements every prompt-ready scene description must encode?" back="1. Subject (who/what with physical details), 2. Action (motion), 3. Setting (location + atmosphere), 4. Camera (shot type, movement, lens), 5. Mood (lighting, color, emotion)" />
<Card front="What is the three-act time split for a 3-minute short film?" back="Act 1: 36 seconds (20%) - establish world. Act 2: 108 seconds (60%) - conflict and escalation. Act 3: 36 seconds (20%) - resolution/revelation." />
<Card front="What seven components make up a complete AI cinema script package?" back="1. Logline, 2. Treatment, 3. Scene breakdown with timestamps, 4. Prompt-ready scene descriptions, 5. Character reference sheet, 6. Voice-over script, 7. Visual reference list" />
<Card front="What is the Iteration Pattern for LLM screenwriting?" back="Rewrite a scene three ways: 1. More visually specific (camera/lighting/color), 2. More emotionally resonant (deeper subtext), 3. More producible (simplified for AI video generation)" />
</FlashDeck>

</div>