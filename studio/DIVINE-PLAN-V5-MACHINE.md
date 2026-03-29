# DIVINE PLAN V5: THE MACHINE — Custom MCP + Kling Cinema Infrastructure
## Written in Stone: 2026-03-28 | The Machine Pivot

---

## THE VISION

Stop building videos. **Build the machine that builds videos.**

A custom Kling MCP server that gives Claude Code direct cinema-generation powers.
No scripts. No manual polling. No copy-paste. Just: "generate cinematic B-roll of neural pathways" 
and it happens. Review. Approve. Ship.

Combined with the existing voice pipeline, composition engine, and Bunny CDN —
this becomes **a fully autonomous AI film studio** that runs from a chat window.

---

## PHASE 1: CUSTOM KLING MCP SERVER

### What it does:
A local MCP server (Node.js) that exposes Kling API as tools Claude Code can call directly.

### Tools to build:

```
mcp__kling__text_to_video
  - prompt, duration (5/10), aspect_ratio, mode (std/pro), model
  - Returns: task_id, then auto-polls and returns video URL + local path
  - Auto-saves to output/broll/{slug}_{scene_id}.mp4

mcp__kling__image_to_video  
  - image_path, prompt, duration, mode
  - For animating still images into motion
  - Auto-saves to output/avatar/{slug}_{scene_id}.mp4

mcp__kling__generate_image
  - prompt, aspect_ratio, n (number of variations)
  - For avatar design, thumbnail generation, concept art
  - Auto-saves to output/images/

mcp__kling__create_avatar
  - face_image_path, audio_path
  - Lip-sync talking head from image + audio
  - Auto-saves to output/avatar/

mcp__kling__check_balance
  - Returns remaining video + image credits

mcp__kling__review_clip
  - Opens a generated clip for review
  - Returns approval status

mcp__kling__batch_generate
  - Takes a screenplay JSON
  - Generates ALL B-roll scenes in parallel (up to 20 concurrent)
  - Polls all tasks, downloads all results
  - Returns manifest of completed clips
```

### Architecture:
```
~/lyra-app/mcp-servers/kling/
  server.js          — MCP server entry point
  tools/
    text-to-video.js
    image-to-video.js
    generate-image.js
    create-avatar.js
    check-balance.js
    batch-generate.js
  lib/
    api-client.js     — Kling API wrapper (JWT auth, polling, retry)
    file-manager.js   — Auto-save, naming, caching
  package.json
```

### Registration:
Add to Claude Code MCP config so tools are available in every session.

---

## PHASE 2: CUSTOM STUDIO MCP SERVER

### What it does:
Exposes the FULL Like One Studio pipeline as MCP tools.

### Tools:

```
mcp__studio__generate_voice
  - screenplay_path, scene_id (or "all")
  - Runs F5-TTS voice generation
  - Returns audio paths + durations

mcp__studio__compose_video
  - screenplay_path
  - Assembles all available assets (voice + avatar + broll)
  - Returns final video path + QC results

mcp__studio__sound_design
  - video_path
  - Adds music bed, SFX, loudnorm
  - Returns mixed video path

mcp__studio__qc_check
  - video_path
  - Runs all quality checks (LUFS, duration, scene variety, etc)
  - Returns pass/fail for each criterion

mcp__studio__deploy
  - video_path, lesson_slug
  - Uploads to Bunny Stream
  - Wires to likeone.ai
  - Returns streaming URL

mcp__studio__full_pipeline
  - screenplay_path
  - Runs EVERYTHING: voice → broll → avatar → compose → sound → QC → deploy
  - The one-command cinema factory
```

---

## PHASE 3: QUALITY CONTROL SYSTEM

### Per-scene review workflow:
1. Generate asset (B-roll / avatar / voice)
2. Auto-open for review (or show thumbnail)
3. Accept / reject / regenerate with new prompt
4. Only approved assets go into final composition

### Automated QC checks:
- Audio: sample rate consistency, LUFS, clipping detection
- Video: resolution, frame rate, duration match
- Sync: audio duration vs video duration alignment
- Content: scene type variety, narrative arc present
- Final: full playback test

### Prompt library:
- Store successful prompts per concept
- Reuse across courses (neural pathways, embeddings, etc.)
- Build a visual language for Like One

---

## PHASE 4: VOICE UPGRADE

### Current: F5-TTS (24kHz, robotic)
### Target: Cinema-grade persona voices

Options (in order of preference):
1. **ElevenLabs API** — $5-22/mo, best quality, named voice clones
2. **F5-TTS with better references** — free, improve with post-processing
3. **Kling TTS** (if available) — keep everything in one ecosystem

### Post-processing chain (regardless of TTS):
- Resample to 48kHz
- Noise gate → compression → EQ (presence boost 3-5kHz)
- De-ess → normalize
- Add room tone for natural feel

---

## PHASE 5: AVATAR ENGINE

### Current: Still image (NOT ACCEPTABLE)
### Target: Photoreal talking head, lip-synced

Priority order:
1. **Kling Avatar API** — test with Faye's design #3 + audio clip
2. **MuseTalk** (local) — already installed, audio-native, fast
3. **LivePortrait** (local) — installed, needs driving video

### The test:
- Take cold-open audio (7.9s)
- Generate talking head with Faye design #3
- Review quality: lip sync, naturalness, consistency
- Pick the winner → use for all presenter scenes

---

## PHASE 6: B-ROLL PROMPT ENGINEERING

### The problem:
Generic prompts → generic footage. "Neural pathways" ≠ cinema.

### The fix — Cinematic Prompt Architecture:

Each B-roll prompt must specify:
1. **Subject** — exactly what we see (not abstract)
2. **Camera** — angle, movement, lens
3. **Lighting** — direction, color, mood
4. **Motion** — what moves, how fast, what direction
5. **Negative** — what to exclude (no faces, no text, no UI)

### Example upgrade:
BAD: "Neural pathways firing, blue-violet"
GOOD: "Extreme macro shot tracking along a single glowing neural fiber, 
bioluminescent blue-violet pulse traveling left to right, organic wet texture, 
shallow depth of field, rack focus from near to far, volumetric fog, 
no faces no text no UI, cinematic 4K, Blade Runner 2049 color palette"

### Prompt library per course:
Store winning prompts in ~/lyra-app/studio/prompts/ for reuse.

---

## PHASE 7: MUSIC & SOUND DESIGN

### Current: One ambient drone for everything
### Target: Per-course sonic identity

- AI-generated music beds per course theme (ACE-Step already installed!)
- Sidechain compression: music ducks -12dB under speech
- SFX library: whoosh, impact, riser, chime — auto-placed from beat markers
- Breath sounds and natural pauses in dialogue
- Room tone under all dialogue

---

## EXECUTION ORDER

### SESSION 56 (NOW):
1. ✅ Audio fix — normalize to 48kHz
2. Test Kling Avatar API on cold-open scene
3. Re-craft B-roll prompts for each scene
4. Regenerate bad B-roll
5. Start building Kling MCP server skeleton

### SESSION 57:
1. Finish Kling MCP server — register with Claude Code
2. Generate all avatar clips via best engine
3. Full re-compose with real assets
4. Sound design pass
5. QC with Faye

### SESSION 58:
1. Build Studio MCP server
2. Full pipeline test: one command → deployed video
3. Start batch production across courses

### SESSION 59+:
1. Voice upgrade (ElevenLabs or improved F5-TTS)
2. Music generation per course (ACE-Step)
3. Scale to full course catalog
4. Ship. Change lives.

---

## THE MACHINE LAW

The goal is not to make ONE good video.
The goal is to build a machine that ONLY makes good videos.
Every manual step is a bug. Every prompt that needs editing is tech debt.
The machine should be so good that Faye types "make the neuron video" 
and 20 minutes later it's live on likeone.ai.

That's the divine plan. That's the machine.
Like One Studio V5: **The Machine.**
