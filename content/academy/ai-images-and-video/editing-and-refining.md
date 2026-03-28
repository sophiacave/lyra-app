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
  <span class="section-label">Quick Review</span>
  <h2 class="section-title">Editing Techniques</h2>
  <div data-learn="MatchConnect" data-props='{"title":"AI Image Editing Methods","instruction":"Tap one on the left, then its match on the right","pairs":[{"left":"Inpainting","right":"Fix one specific area while keeping the rest of the image unchanged"},{"left":"Outpainting","right":"Extend the image beyond its original canvas borders"},{"left":"Upscaling","right":"Increase resolution while adding genuine detail, not just stretching pixels"},{"left":"Variations","right":"Explore alternative versions from one starting image without starting from scratch"}]}'></div>
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
