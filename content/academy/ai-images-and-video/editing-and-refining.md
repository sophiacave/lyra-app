---
title: "Editing and Refining"
course: "ai-images-and-video"
order: 5
type: "lesson"
free: false
---

<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-images-and-video/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 5 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Editing and <span class="accent">Refining.</span></h1>
  <p class="sub">Inpainting, outpainting, upscaling, and variations — making good images great.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>What inpainting is and how to fix specific parts of an image without regenerating</li>
    <li>How outpainting extends your image beyond its original borders</li>
    <li>When and how to upscale images for print or large display</li>
    <li>How to use variations to explore different directions from one starting point</li>
  </ul>
</div>

<div class="lesson-section">
  <span class="section-label">Why Editing Matters</span>
  <h2 class="section-title">The best AI images are almost never the first generation.</h2>
  <p class="section-text">You have learned how to write great prompts. But even the best prompt sometimes gives you an image that is 90% perfect with one element that is off — a weird hand, a background detail you do not want, or a color that does not match your brand. This is where editing tools come in. They let you fix the 10% without losing the 90% you love.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Inpainting</span>
  <h2 class="section-title">Fix one part of an image while keeping everything else exactly the same.</h2>
  <p class="section-text">Inpainting lets you select a specific area of your image and regenerate just that section. Got a portrait where the eyes look slightly off? Select the eye area, describe what you want, and the AI redraws only that part while keeping the rest of the image untouched.</p>
  <p class="section-text"><strong>Where to use it:</strong> ChatGPT lets you click on an image and highlight areas to edit. DALL-E's editor has a brush tool for selecting regions. In Stable Diffusion, inpainting is a dedicated mode with precise mask controls. Adobe Firefly's Generative Fill in Photoshop is another excellent option.</p>
  <p class="section-text"><strong>Pro tip:</strong> When inpainting, make your selection slightly larger than the area you want to change. This gives the AI more context to blend the new content seamlessly with the surrounding image.</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Prompt — inpainting edit to fix a sky in a landscape image</div>
<pre style="margin:0;color:#e5e5e5"><code>Replace the selected sky area with a dramatic sunset,
deep orange and purple clouds, golden light spilling
across the horizon, matching the warm tones of the
existing landscape below, seamless blend at the edges</code></pre>
</div>
</div>

<div class="lesson-section">
  <span class="section-label">Outpainting</span>
  <h2 class="section-title">Extend your image beyond its borders.</h2>
  <p class="section-text">Outpainting is the opposite of inpainting. Instead of fixing something inside the image, you expand the canvas and let the AI fill in what logically should be there. Have a beautiful portrait but need more space above for a social media header? Outpaint upward and the AI will extend the background naturally.</p>
  <p class="section-text">This is incredibly useful for adapting images to different aspect ratios. You created a square image but need it in landscape for a presentation slide? Outpaint the sides. Need a vertical version for Instagram Stories? Outpaint top and bottom. The AI maintains the style and context of the original while expanding the scene.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Upscaling</span>
  <h2 class="section-title">Make your images bigger without making them blurry.</h2>
  <p class="section-text">AI-generated images often come out at moderate resolution — fine for social media, but too small for prints, posters, or large displays. Upscaling uses AI to increase the resolution while adding genuine detail rather than just stretching pixels.</p>
  <p class="section-text"><strong>Free tools:</strong> Upscayl (open source, runs on your computer), Bigjpg, Let's Enhance<br>
  <strong>Built-in options:</strong> Midjourney has upscale buttons right on each generation. Stable Diffusion has upscaling workflows built into many interfaces.<br>
  <strong>Professional:</strong> Topaz Gigapixel AI is the gold standard for upscaling if you need maximum quality.</p>
  <p class="section-text">A good rule of thumb: generate your image at the best quality your tool allows, then upscale 2-4x if you need it larger. Going beyond 4x can introduce artifacts.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Variations</span>
  <h2 class="section-title">Explore different directions without starting from scratch.</h2>
  <p class="section-text">When you have an image you like but want to see alternative versions, variations are your friend. In Midjourney, you can click the "V" buttons to generate variations of any image. In ChatGPT, you can say "generate a variation of this with warmer colors" or "try a different angle."</p>
  <p class="section-text">Variations let you rapidly explore a creative space. Think of it like trying on outfits — same person, different looks. Generate 4-6 variations, pick your favorite elements from each, then combine those insights into a refined prompt for your final image.</p>
</div>

<div class="demo-container" style="border-left: 3px solid var(--blue); padding: 1.2rem; margin: 2rem 0; background: var(--bg);">
  <h3 style="color: var(--blue);">The editing workflow in practice</h3>
  <ol>
    <li><strong>Generate</strong> your initial image with a detailed prompt</li>
    <li><strong>Evaluate</strong> — what works, what does not?</li>
    <li><strong>Vary</strong> — if the overall direction is off, generate variations</li>
    <li><strong>Inpaint</strong> — if specific areas need fixing, edit them directly</li>
    <li><strong>Outpaint</strong> — if you need different dimensions, extend the canvas</li>
    <li><strong>Upscale</strong> — once you are happy, increase resolution for final use</li>
  </ol>
</div>

<div class="try-it-box" style="border: 2px solid var(--green); border-radius: 8px; padding: 1.5rem; margin: 2rem 0; background: var(--bg);">
  <h3 style="color: var(--green);">Try it now</h3>
  <p>Generate an image in ChatGPT, then click on it and use the editing feature to change one element. Try something like generating a landscape, then editing just the sky to make it more dramatic. Notice how the rest of the image stays consistent while the edited area transforms. That is inpainting in action, and it is one of the most powerful tools in your visual AI toolkit.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Advanced Inpainting Techniques</span>
  <h2 class="section-title">Master inpainting and you will never need to start over.</h2>
  <p class="section-text">Beyond simple fixes, inpainting unlocks powerful creative possibilities:</p>
  <p class="section-text"><strong>Object replacement:</strong> Select any object in your image and replace it with something entirely different. A vase of flowers can become a stack of books. A cat can become a dog. The surrounding scene stays perfectly intact because the AI only regenerates the selected area.</p>
  <p class="section-text"><strong>Style blending:</strong> Generate an image in one style, then inpaint specific regions with different style descriptions. This creates unique hybrid aesthetics that would be extremely difficult to achieve with a single prompt.</p>
  <p class="section-text"><strong>Face and expression correction:</strong> AI-generated faces sometimes have subtle issues — asymmetry, uncanny valley expressions, or slightly off proportions. Select the face region and describe the expression you want: "natural relaxed smile, warm eyes, symmetrical features." This is one of the most common professional uses of inpainting.</p>
  <p class="section-text"><strong>Background swap:</strong> Keep a perfect foreground subject and completely change the background. You generated a great portrait but the background is generic? Inpaint the background with "a cozy bookshelf-lined study with warm lamp light" and the person stays exactly the same while the world behind them transforms.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Outpainting Deep Dive</span>
  <h2 class="section-title">Extend any image in any direction with intention.</h2>
  <p class="section-text">Outpainting is not just about making images bigger — it is about reimagining the canvas. Here are techniques that produce the best results:</p>
  <p class="section-text"><strong>Directional extension:</strong> Think about what logically exists beyond each edge of your image. Extending a portrait upward might reveal a ceiling or sky. Extending left or right might show more of the environment. The AI uses visual context from the existing image to predict what should be there.</p>
  <p class="section-text"><strong>Aspect ratio conversion:</strong> This is outpainting's most practical use. You have a square image but need a 16:9 landscape for a presentation? Outpaint the sides. Need a 9:16 vertical for Instagram Stories? Outpaint top and bottom. The style and content remain coherent with the original.</p>
  <p class="section-text"><strong>Scene expansion for storytelling:</strong> Start with a tight close-up and progressively outpaint to reveal more of the scene. This technique is powerful for creating a sense of scale and discovery — like slowly zooming out to reveal a grand vista from a small starting detail.</p>
  <p class="section-text"><strong>Guided outpainting:</strong> When outpainting, add a text description of what you want in the extended area. "Extend the left side to show a window with rain outside" gives the AI specific guidance rather than letting it guess. Tools with text-guided outpainting produce significantly better results than fully automatic extension.</p>
</div>

<div class="lesson-section">
  <span class="section-label">The Refinement Mindset</span>
  <h2 class="section-title">Professional results come from professional refinement habits.</h2>
  <p class="section-text">The difference between amateur and professional AI image work is almost entirely in the refinement stage. Here are the habits that separate good from great:</p>
  <p class="section-text"><strong>The 90% rule:</strong> If an image is 90% perfect, do not regenerate — refine. Regenerating throws away the 90% you love. Inpainting fixes the 10% you don't. This mindset saves enormous time and produces better results.</p>
  <p class="section-text"><strong>Multiple refinement passes:</strong> Professional creators often make 3-5 refinement passes on a single image. First pass fixes obvious issues. Second pass improves composition details. Third pass adjusts color and mood. Each pass brings the image closer to the vision.</p>
  <p class="section-text"><strong>Reference comparison:</strong> Keep reference images handy — photos or artworks that capture the mood, lighting, or composition you want. Compare your AI output to these references and use the gap to guide your refinement. "The lighting in my image is flatter than my reference — let me inpaint the lighting to add more contrast."</p>
  <p class="section-text"><strong>Know when to stop:</strong> There is a point of diminishing returns where further refinement does not meaningfully improve the image. Recognizing this point is itself a skill. If you have been editing the same image for more than 15 minutes, step back and evaluate whether it is "good enough" for its intended use.</p>
</div>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Prompt — inpainting to replace a background while keeping the subject</div>
<pre style="margin:0;color:#e5e5e5"><code>Replace the selected background with a cozy library
interior, warm wood bookshelves filled with leather-bound
books, soft amber reading lamp light, slight bokeh in
the background, matching the warm color temperature of
the existing subject lighting, seamless natural blend</code></pre>
</div>

<div class="lesson-section">
  <span class="section-label">Quick Review</span>
  <h2 class="section-title">Editing Techniques</h2>
</div>

<div class="lesson-section">
  <span class="section-label">Tool-Specific Editing Features</span>
  <h2 class="section-title">Each platform has unique editing strengths worth knowing.</h2>
  <p class="section-text">Different tools offer different editing capabilities. Knowing which tool excels at what saves you time and produces better results:</p>
  <p class="section-text"><strong>ChatGPT (DALL-E):</strong> Click any generated image and highlight the area you want to change. Describe the edit in natural language. This is the most intuitive inpainting interface — you literally have a conversation about what to fix. Best for quick edits and iterative refinement through dialogue.</p>
  <p class="section-text"><strong>Adobe Photoshop (Generative Fill):</strong> Select any area with Photoshop's precision tools (lasso, magic wand, pen tool) and use Generative Fill to replace it. This gives you pixel-perfect selection control combined with AI generation. Best for professional work where precision matters.</p>
  <p class="section-text"><strong>Stable Diffusion (inpainting mode):</strong> Paint a mask over the area to change, set the denoising strength (how much to change), and generate. Lower denoising strength preserves more of the original. Higher strength allows more radical changes. Best for users who want fine control over the generation parameters.</p>
  <p class="section-text"><strong>Midjourney (vary region):</strong> Use the vary region feature to select and regenerate portions of an image while maintaining Midjourney's signature aesthetic quality. Best for maintaining that distinctive Midjourney look in edited images.</p>
  <p class="section-text"><strong>Canva (Magic Edit):</strong> Brush over an area and describe what you want. Simple and accessible. Best for non-technical users who want quick edits integrated into their design workflow.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Building an Editing Checklist</span>
  <h2 class="section-title">A systematic checklist catches issues before you publish.</h2>
  <p class="section-text">Before declaring any AI image "finished," run through this quality checklist:</p>
  <p class="section-text"><strong>Anatomy check:</strong> Count fingers on all visible hands. Check that faces are symmetrical and natural. Look at eyes — are they aligned and focused correctly? These are the most common AI generation artifacts.</p>
  <p class="section-text"><strong>Text check:</strong> Is there any unintended text or writing in the image? AI sometimes generates gibberish text on signs, books, or clothing. If you see it, inpaint it out or regenerate that area.</p>
  <p class="section-text"><strong>Edge check:</strong> Look at the edges of objects and subjects. Are there any strange blending artifacts where two elements meet? Zoom in on boundaries between foreground and background.</p>
  <p class="section-text"><strong>Consistency check:</strong> Does the lighting direction make sense across the whole image? Are shadows falling in the same direction? Is the color temperature consistent? These subtle issues are what make images feel "off" even when you cannot immediately say why.</p>
  <p class="section-text"><strong>Resolution check:</strong> Is the image large enough for its intended use? Social media may be fine at standard resolution, but print needs upscaling. Check before you deliver.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Key Terms</span>
  <h2 class="section-title">Editing Vocabulary</h2>
  <div data-learn="FlashDeck" data-props='{"title":"AI Image Editing Terms","cards":[{"front":"Inpainting","back":"Selecting a specific area of an image and regenerating just that section while keeping everything else untouched — perfect for fixing one detail without losing the whole image"},{"front":"Outpainting","back":"Expanding the canvas beyond the original image borders and letting AI fill in what should logically be there — great for adapting images to different aspect ratios"},{"front":"Upscaling","back":"Using AI to increase image resolution while adding genuine detail rather than just stretching pixels — essential for print and large display use"},{"front":"Variations","back":"Generating alternative versions from one starting image to explore different directions — like trying on outfits, same person, different looks"},{"front":"Selection context tip","back":"When inpainting, make your selection slightly larger than the problem area — this gives the AI more surrounding context for seamless blending"}]}'></div>
</div>

<div class="lesson-section">
  <span class="section-label">Check Your Understanding</span>
  <h2 class="section-title">Lesson 5 Quiz</h2>
  <div data-learn="QuizMC" data-props='{"title":"Editing and Refining","questions":[{"q":"What is the correct order of the AI editing workflow?","options":["Upscale, then generate, then inpaint","Generate, evaluate, vary, inpaint, outpaint, upscale","Upscale first, then generate variations","Generate once and accept the result"],"correct":1,"explanation":"Generate your initial image, evaluate what works, use variations if the direction is off, inpaint specific problem areas, outpaint if you need different dimensions, then upscale once you are happy."},{"q":"What is the pro tip for getting the best inpainting results?","options":["Make your selection as small as possible","Select exactly the pixels you want to change, nothing more","Make your selection slightly larger than the area you want to change to give context for seamless blending","Only inpaint on portrait images"],"correct":2,"explanation":"A slightly larger selection gives the AI more surrounding context, which helps it blend the regenerated area seamlessly with the rest of the image."},{"q":"What is upscaling used for?","options":["Changing the style of an image","Making small images larger with added detail for print or large display use","Cropping images to different aspect ratios","Removing backgrounds from images"],"correct":1,"explanation":"AI upscaling increases resolution while adding genuine detail — not just stretching pixels. This is essential when you need an image for print, posters, or large displays that require higher resolution than standard AI output."}]}'></div>
</div>

<nav class="lesson-nav">
  <a href="/academy/ai-images-and-video/prompt-craft-for-images">&larr; Previous: Prompt Craft for Images</a>
  <a href="/academy/ai-images-and-video/ai-for-social-media-visuals">Next: AI for Social Media Visuals &rarr;</a>
</nav>

</div>
