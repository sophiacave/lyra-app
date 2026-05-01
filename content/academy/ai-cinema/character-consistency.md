---
title: "Character Consistency Across Scenes"
course: "ai-cinema"
order: 5
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-cinema/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 5 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Character Consistency <span class="accent">Across Scenes.</span></h1>
  <p class="sub">The hardest problem in AI cinema -- and the techniques that solve it.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>Why character consistency fails and the technical reasons behind it</li>
    <li>The reference sheet workflow for maintaining identity across shots</li>
    <li>Platform-specific consistency tools (Kling character lock, Runway style ref)</li>
    <li>Editing techniques that hide remaining inconsistencies</li>
  </ul>
</div>

<div class="lesson-section">
<h2>Why Consistency Is Hard</h2>

Every video generation is independent. The model has no memory of previous generations. When you generate Shot A and Shot B separately, the model does not know they feature the same character. It samples from its probability distribution independently each time, producing subtle variations in facial structure, skin tone, hair, and proportions.

This is fundamentally different from traditional filmmaking where the same actor physically appears in every shot. In AI cinema, you are effectively casting a new actor for every cut.

The consistency gap manifests as:
- **Facial drift**: Cheekbone height, nose width, eye spacing change between shots
- **Color drift**: Skin tone, hair color shift across lighting conditions
- **Wardrobe drift**: Clothing details, texture, and fit change subtly
- **Proportion drift**: Body proportions shift between wide and close-up shots

The human visual system is extraordinarily sensitive to face recognition. Your audience will notice inconsistencies you might miss. The uncanny valley effect is compounded when a face keeps changing.

<div class="tip-box">
The goal is not pixel-perfect consistency -- that is impossible with current technology. The goal is consistency within the threshold of human tolerance. Small variations in lighting and angle are expected and natural. Changes in bone structure or eye color are not.
</div>
</div>

<div class="lesson-section">
<h2>The Multi-Anchor Workflow</h2>

The most reliable consistency technique uses multiple anchors to constrain each generation:

**Anchor 1 - Character Reference Sheet**: The canonical images of your character from Lesson 3. Upload as reference for every generation.

**Anchor 2 - Previous Shot**: Use the last frame of the previous shot as a reference for the next shot. This creates a chain of visual continuity.

**Anchor 3 - Text Description**: Include a frozen character description in every prompt. Never paraphrase -- copy and paste the exact same description every time.

```
FROZEN CHARACTER BLOCK (copy-paste into every prompt):
"A 40-year-old Japanese woman with short black hair streaked
with grey, angular face with prominent cheekbones, dark circles
under deep-set brown eyes, slim build. Wearing a heather grey
wool crew-neck sweater under a navy blue double-breasted trench
coat with brass buttons. Silver stud earrings."
```

**Anchor 4 - Negative Prompts**: Explicitly exclude inconsistency:
```
Negative: "different face, different person, changing appearance,
morphing features, inconsistent clothing, wrong hair color"
```

Using all four anchors simultaneously gives you the best chance at consistency. Drop any one and drift increases.
</div>

<div class="lesson-section">
<h2>Platform-Specific Consistency Tools</h2>

Each platform has evolved its own consistency features. Use them all:

**Kling 2.0 - Character Lock:**
Kling offers a character reference feature where you upload a face image and the model attempts to preserve that face across generations. Best practices:
```
1. Upload a clear, well-lit, front-facing reference photo
2. Use the "high fidelity" face mode
3. Keep the character at similar scale across shots
4. Avoid extreme angles that the reference does not cover
5. Combine with image-to-video for maximum control
```

**Runway Gen-4 - Style Reference + Director Mode:**
Runway's style reference feature lets you lock the visual style across shots. Combined with Director Mode for camera control:
```
1. Upload your storyboard frame as the primary input
2. Upload the character reference as style reference
3. Set style reference strength to 70-85%
4. Use Director Mode to control camera separately from content
5. Lock the seed when making minor prompt adjustments
```

**Pika 2.0 - Modify Region:**
Pika allows you to mask and regenerate specific regions of a video. Useful for fixing face inconsistencies:
```
1. Generate the full shot normally
2. If the face drifts, use Modify Region on just the face area
3. Upload the character reference as guidance
4. Regenerate only the masked area
5. This preserves body movement while fixing facial identity
```

**Veo 3 - Detailed Subject Descriptions:**
Veo responds well to extremely detailed subject descriptions. Front-load your prompt with character details:
```
1. First 40% of prompt = character description (frozen block)
2. Next 30% = scene and setting
3. Final 30% = camera and motion direction
4. Use the same structure for every shot of the same character
```

<div class="callout">
<strong>Emerging technique:</strong> Some filmmakers train a LoRA (Lesson 3 of the Fine-Tuning course) on their character reference images and use it to generate all video frames. This produces the best consistency but requires technical knowledge of model fine-tuning.
</div>
</div>

<div class="lesson-section">
<h2>Editing Tricks That Hide Inconsistencies</h2>

Even with all anchors and platform tools, some shots will have visible inconsistency. Editing techniques can mask these gaps:

**1. Avoid direct cuts between close-ups.** Insert a cutaway (rain, hands, objects) between two close-up shots of the same character. The cutaway resets the viewer's facial memory.

```
Instead of:  CLOSE-UP face → CLOSE-UP face (inconsistency visible)
Do this:     CLOSE-UP face → INSERT rain/hands → CLOSE-UP face
```

**2. Use consistent color grading.** Apply the same LUT (Look-Up Table) to all shots in DaVinci Resolve. Unified color makes faces look more consistent even when geometry varies slightly.

**3. Vary shot scale strategically.** Cut from wide to close-up, not from close-up to close-up. The scale change makes the audience expect to see different detail levels.

**4. Leverage motion blur.** Shots with character movement have natural motion blur that masks facial detail. Place your most inconsistent shots during movement rather than stillness.

**5. Use voice-over to maintain identity.** A consistent voice (same ElevenLabs voice clone across all shots) anchors character identity even when visuals drift. The audience trusts their ears.

<div class="demo-container">
<h4>Exercise: Consistency Test</h4>
Generate three shots of the same character: a wide establishing shot, a medium dialogue shot, and a close-up reaction shot. Use the multi-anchor workflow (all four anchors). Evaluate the consistency across the three shots. Apply two editing tricks to improve perceived consistency. Compare before and after.
</div>
</div>

<div class="lesson-section">
<h2>The Consistency Spectrum</h2>

Accept that AI cinema consistency exists on a spectrum:

| Level | Description | Audience Reaction |
|-------|------------|-------------------|
| A | Same person, no visible differences | "Professional quality" |
| B | Same person, minor lighting/angle variations | "Acceptable" |
| C | Same type of person, subtle feature drift | "Noticeable but tolerable" |
| D | Visibly different person between shots | "Immersion broken" |
| F | Completely different person | "Unwatchable" |

Target level B for every shot. Celebrate level A when it happens. Never ship level D. Use editing tricks to promote level C shots to perceived level B.

As models improve, the floor rises. Techniques that achieve level C today will achieve level B with the next model generation. Build your workflow now so you benefit automatically from model improvements.
</div>

<div data-learn="QuizMC" data-props='{"questions": [{"q": "What are the four anchors in the multi-anchor consistency workflow?", "options": ["Seed lock, negative prompt, style reference, and high resolution", "Character reference sheet, previous shot reference, frozen text description, and negative prompts", "Face lock, body lock, wardrobe lock, and color lock", "Platform presets, user uploads, text prompts, and post-processing"], "correct": 1, "explanation": "The correct answer is: Character reference sheet, previous shot reference, frozen text description, and negative prompts"}, {"q": "Why should you avoid cutting directly between two close-up shots of the same AI-generated character?", "options": ["Close-ups use too many generation credits", "The resolution drops in close-up shots", "Direct cuts between close-ups make facial inconsistencies highly visible to viewers", "AI models cannot generate close-up shots reliably"], "correct": 2, "explanation": "The correct answer is: Direct cuts between close-ups make facial inconsistencies highly visible to viewers"}]}'></div>

<div data-learn="FlashDeck" data-props='{"cards": [{"front": "What are the four types of character consistency drift?", "back": "1. Facial drift (bone structure changes), 2. Color drift (skin/hair tone shifts), 3. Wardrobe drift (clothing details change), 4. Proportion drift (body proportions shift)"}, {"front": "What is a &#39;frozen character block&#39; and why is it important?", "back": "A copy-pasted character description used verbatim in every prompt. Never paraphrasing ensures the text anchor remains constant, reducing drift between generations."}, {"front": "What is the target consistency level for AI cinema?", "back": "Level B: same person with minor lighting/angle variations. Level A (no visible differences) is ideal but rare. Level C can be promoted to perceived B through editing tricks."}, {"front": "How does voice-over help with character consistency?", "back": "A consistent voice (same ElevenLabs voice clone across all shots) anchors character identity aurally, even when visual features drift slightly. The audience trusts their ears."}, {"front": "What is the cutaway technique for hiding inconsistencies?", "back": "Insert a non-face shot (rain, hands, objects) between two close-ups of the same character. The cutaway resets the viewer&#39;s facial memory, making subsequent variations less noticeable."}]}'></div>

</div>