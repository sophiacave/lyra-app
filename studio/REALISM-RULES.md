# REALISM RULES — Like One Studio (Written in Stone)

## The Law
Every frame must look like it was captured by a real camera in the real world.
If a viewer pauses any frame and it looks like AI — we have failed.

## NEVER Generate
- Close-up human faces (uncanny valley trigger #1)
- Hands doing complex tasks (fingers will distort)
- Readable text in frame (will morph during animation)
- Perfect symmetry (screams CG)
- Multiple humans interacting (physics breaks)
- Fast camera movements (artifacts multiply)

## ALWAYS Generate
- Landscapes, environments, architecture (AI excels here)
- Object close-ups with rich texture (leather, wood, metal, fabric)
- Abstract concepts via visual metaphor (light, water, particles)
- Silhouettes and wide shots when humans are needed
- Nature macro (dew, plants, textures — AI's sweet spot)
- Back-of-head, over-shoulder when showing a person

## Camera Rules
- ONE movement per clip. Dolly OR pan OR tilt. Never combine.
- SLOW always. "Slow dolly forward" not "dolly forward"
- 5-second clips only. 10s loses coherence.
- Specify the camera: "shot on ARRI Alexa Mini, Cooke S7i 50mm T2.0"
- Specify the light: "natural available light" or "golden hour" or "soft window light"
- Add "180-degree shutter, natural motion blur" for movement realism

## Prompt Structure
`[subject with texture detail], [environment], [lighting], [atmosphere], [camera package from realism-templates.json]`

## Negative Prompt (always include)
`cgi, 3d render, digital art, illustration, anime, cartoon, plastic, airbrushed, smooth skin, oversaturated, hdr, stock photo watermark, artificial lighting, perfect symmetry, uncanny valley`

## Post-Processing (non-negotiable)
Every clip gets cinema-grade-v2.sh before delivery. This adds:
- Film grain (breaks AI smoothness)
- Chromatic aberration (real lens imperfection)
- Camera shake (handheld organic feel)
- Highlight rolloff (film shoulder curve)
- Vignette (lens falloff)
- Micro-contrast (texture bite)

## For Human Presence: Use the Avatar Pipeline
When a lesson needs a presenter:
1. Generate narration via Fish S2-Pro (voice clone)
2. Use Kling lip-sync with avatar headshot
3. This is CONTROLLED — the face is consistent, the lip-sync is trained
4. Never generate random human faces via text-to-image

## Quality Test
Before any clip ships:
1. Pause at 3 random frames. Does it look like a photograph?
2. Play at 1x speed. Does the motion feel organic?
3. Listen. Does the audio have room tone? Natural reverb?
4. Show someone without context. Can they tell it's AI?
If any answer is wrong — re-generate or re-grade.
