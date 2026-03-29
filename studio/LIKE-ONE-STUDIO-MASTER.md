# LIKE ONE STUDIO — THE PERFECT MACHINE (WRITTEN IN STONE)

**Date:** 2026-03-28 | **Version:** 1.0 | **Status:** DIVINE ARCHITECTURE

---

## THE VISION

Like One Studio is a sovereign AI cinema machine. It takes a screenplay
and produces a finished, cinema-grade video with zero human intervention.
Every frame is a painting. Every sound serves the story. Every cut is intentional.

It runs on:
- **M3 Max 64GB** — local compute backbone (free, unlimited)
- **4-Brain Supabase Architecture** — persistent memory, state, orchestration
- **Kling API** — I2V animation (per-credit, surgical use)
- **Custom MCP Servers** — unified tool interface for Claude
- **Remotion** — React-based video composition engine

Cost per video: ~$2-5 in Kling credits. Everything else is free.

---

## THE BRAIN ARCHITECTURE

### like-one-brain-v2 (tnsujchfrixxsdpodygu) — MEMORY & AI
- Brain context (directives, identity, session state)
- Embeddings (pgvector, semantic search)
- AI orchestration state
- Model configs and prompt templates

### like-one-app (blknphuwwgagtueqtoji) — USER-FACING
- Forum, profiles, subscriptions
- Course progress, enrollments
- Public API

### like-one-revenue (munmhzylfoiyigismbds) — STRIPE & MONEY
- Payment processing, invoices
- Revenue tracking, analytics

### like-one-ops (iairxsntsvqzzrgrvkqy) — OPERATIONS
- Monitoring, crons, analytics
- **NEW: Studio Pipeline State**
  - `studio.pipeline_runs` — track every render job
  - `studio.keyframe_library` — cached keyframes with embeddings
  - `studio.audio_library` — cached music/SFX with metadata
  - `studio.render_queue` — async job queue for long renders
  - `studio.quality_scores` — QA gate results per video

### NEW: like-one-studio (PROPOSED) — DEDICATED STUDIO BRAIN
If pipeline state outgrows ops, spin up a 5th brain:
- Pipeline orchestration
- Asset management (keyframes, audio, video clips)
- Render history and A/B test results
- Model performance tracking (which prompts → best keyframes)
- Shot library (reusable keyframe templates)

---

## THE MCP SERVER ARCHITECTURE

### MCP 1: likeone-imagegen
**Purpose:** Local image generation via mflux + MLX
```
Tools:
  imagegen_generate      — Generate keyframe (Z-Image/FLUX.2/FLUX.1)
  imagegen_variations    — N variations of same prompt
  imagegen_img2img       — Refine existing keyframe
  imagegen_upscale       — Real-ESRGAN 4x upscale
  imagegen_validate      — 7-element formula check
  imagegen_batch         — Generate all keyframes from screenplay
  imagegen_benchmark     — Test model speed on M3 Max
  
Config:
  models:
    hero: z-image-turbo          # Best quality
    explore: flux2-klein-4b      # Fastest iteration
    premium: flux1-dev           # Highest ceiling
  defaults:
    steps_hero: 8
    steps_explore: 4
    steps_premium: 30
    guidance: 3.5
    resolution: [1024, 1024]
```

### MCP 2: likeone-audiogen
**Purpose:** Local audio generation (music, narration, SFX)
```
Tools:
  audiogen_music         — ACE-Step 1.5 cinematic score
  audiogen_narrate       — Fish Speech S2 Pro narration
  audiogen_narrate_fast  — Kokoro-82M quick narration
  audiogen_clone_voice   — F5-TTS voice cloning
  audiogen_sfx           — AudioLDM text-to-SFX
  audiogen_mix           — 5-layer FFmpeg mix engine
  audiogen_normalize     — LUFS normalization
  audiogen_demucs        — Stem separation
  audiogen_batch         — Generate all audio from screenplay
  
Config:
  music_engine: ace-step-1.5
  narration_engine: fish-s2-pro
  sfx_engine: audioldm
  master_lufs: -14
  true_peak: -1
  voice_ref: ~/lyra-app/studio/voices/faye-reference.wav
```

### MCP 3: likeone-cinema
**Purpose:** Video composition, grading, and delivery
```
Tools:
  cinema_animate         — Kling O1 I2V (dual-keyframe)
  cinema_interpolate     — RIFE frame interpolation
  cinema_grade           — LUT + grain + letterbox pipeline
  cinema_compose         — Remotion render from screenplay
  cinema_qa              — Automated 24-point quality gate
  cinema_deliver         — Upload to Bunny Stream
  cinema_beat_sync       — Auto-sync cuts to audio beats
  
Config:
  i2v_provider: kling-o1
  interpolation: rife-4.6
  grade_preset: kodak-vision3-500t
  letterbox: 2.35:1
  output_fps: 30
  delivery: bunny-stream
```

### MCP 4: likeone-pipeline (ORCHESTRATOR)
**Purpose:** End-to-end pipeline orchestration
```
Tools:
  pipeline_produce       — Full video from screenplay JSON
  pipeline_status        — Check pipeline run status
  pipeline_retry         — Retry failed stage
  pipeline_preview       — Quick preview render (placeholders)
  pipeline_publish       — Deploy to likeone.ai
  
Workflow:
  screenplay.json
    → validate prompts (likeone-imagegen)
    → generate keyframes (likeone-imagegen)
    → review gate (human eye on keyframes)
    → generate start+end frames per scene
    → animate via I2V (likeone-cinema)
    → generate music (likeone-audiogen)
    → generate narration (likeone-audiogen)
    → generate SFX (likeone-audiogen)
    → 5-layer audio mix (likeone-audiogen)
    → compose in Remotion (likeone-cinema)
    → cinema grade (likeone-cinema)
    → QA gate (likeone-cinema)
    → deliver to Bunny Stream (likeone-cinema)
```

---

## THE COMPLETE PIPELINE (ONE COMMAND)

```
Input:  screenplay.json (V9 format with 7-element prompts)
Output: Cinema-grade video on Bunny Stream CDN

┌─────────────────────────────────────────────────────────┐
│                 PHASE 1: VALIDATE                        │
│  Prompt validator checks all 7 elements per scene        │
│  Reject weak prompts before spending any compute         │
│  Time: <1 second                                         │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│                 PHASE 2: KEYFRAMES (parallel)            │
│                                                          │
│  ┌─────────────────┐    ┌─────────────────┐             │
│  │ START KEYFRAMES  │    │ END KEYFRAMES    │             │
│  │ Z-Image Turbo    │    │ Z-Image Turbo    │             │
│  │ via mflux        │    │ via mflux        │             │
│  │ 8-10 sec each    │    │ 8-10 sec each    │             │
│  └────────┬─────────┘    └────────┬─────────┘             │
│           │                       │                       │
│  ┌────────▼───────────────────────▼─────────┐            │
│  │ UPSCALE (Real-ESRGAN 4x → 4K)            │            │
│  └──────────────────────────────────────────┘            │
│  Time: ~2-3 minutes for 9 scene pairs                    │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│                 PHASE 3: ANIMATE (parallel with audio)   │
│                                                          │
│  Kling O1 I2V — start frame + end frame per scene        │
│  Motion prompt describes ONLY movement                   │
│  5-10 sec video output per scene                         │
│  Time: ~5 minutes (API, parallel submissions)            │
│                                                          │
│  ── SIMULTANEOUSLY ──                                    │
│                                                          │
│  PHASE 3B: AUDIO (parallel with animation)               │
│  ┌─────────────┐ ┌──────────────┐ ┌──────────┐         │
│  │ ACE-Step 1.5│ │Fish Speech S2│ │ AudioLDM │         │
│  │ Music score │ │ Narration    │ │ SFX      │         │
│  │ ~10 sec     │ │ ~30 sec      │ │ ~2 min   │         │
│  └──────┬──────┘ └──────┬───────┘ └────┬─────┘         │
│         └───────────────┼──────────────┘                 │
│                         │                                │
│  ┌──────────────────────▼────────────────────┐          │
│  │ 5-LAYER MIX (FFmpeg)                       │          │
│  │ Narration + Music + SFX + Ambience + Silence│         │
│  │ Sidechain ducking, LUFS normalization       │          │
│  │ J-cuts and L-cuts                           │          │
│  │ Time: ~1 minute                             │          │
│  └───────────────────────────────────────────┘          │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│                 PHASE 4: COMPOSE                         │
│                                                          │
│  Remotion assembles all layers:                          │
│  • AI video backgrounds (from Kling I2V)                │
│  • Motion graphic overlays (diagrams, kinetic text)     │
│  • Audio layers (narration, music, SFX, ambience)       │
│  • Text overlays, lower thirds                          │
│  • J-cuts, L-cuts, hard cuts, whip pans                 │
│  Time: ~3-5 minutes                                      │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│                 PHASE 5: CINEMA GRADE                    │
│                                                          │
│  FFmpeg LUT pipeline:                                    │
│  • Film emulation (Kodak Vision3 500T / ARRI LogC)      │
│  • Film grain overlay (temporal, per-frame)             │
│  • Letterbox 2.35:1                                     │
│  • Color arc enforcement (warm→neutral→cool→warm)       │
│  • Lifted blacks, subtle vignette                       │
│  Time: ~2 minutes                                        │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│                 PHASE 6: QA GATE                         │
│                                                          │
│  24-point automated checklist:                           │
│  • Audio: LUFS check, ducking verify, SFX sync          │
│  • Visual: color consistency, no jump cuts              │
│  • Pacing: shot duration vs target curve                │
│  • Accessibility: captions (Whisper), contrast          │
│  • DOES NOT SHIP until QA passes                        │
│  Time: ~1 minute                                         │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│                 PHASE 7: DELIVER                         │
│                                                          │
│  Upload to Bunny Stream CDN                              │
│  Adaptive HLS, 8-region global CDN                      │
│  Auto-generate thumbnail from peak frame                │
│  Update course database with video URL                  │
│  Time: ~1 minute                                         │
└──────────────────────────────────────────────────────────┘

TOTAL TIME: ~15-20 minutes compute for a 3-minute cinema-grade video
TOTAL COST: ~$2-5 in Kling credits. Everything else: $0.
```

---

## THE POWER WE WIELD

### Local (M3 Max 64GB — unlimited, free)
- Z-Image Turbo — #1 open-source image model
- FLUX.2 Klein 4B — sub-second image iteration
- FLUX.1-dev — highest quality ceiling
- ACE-Step 1.5 — music rivaling Suno v5
- Fish Speech S2 Pro — narration rivaling ElevenLabs
- Kokoro-82M — real-time TTS
- F5-TTS — instant voice cloning
- AudioLDM — text-to-SFX
- Demucs — stem separation
- Real-ESRGAN — 4K upscaling
- RIFE — frame interpolation
- Whisper — auto-captions
- FFmpeg — audio/video processing
- Remotion — React video composition
- Blender — 3D environments
- Manim — mathematical animations
- mflux — MLX-native inference
- Ollama — local LLM (gpt-oss 20B)

### Cloud (API — surgical, per-credit)
- Kling O1 — I2V animation (start+end frame)
- Claude — screenplay writing, orchestration
- Bunny Stream — video delivery CDN
- Supabase — 4-brain persistent memory

### Infrastructure
- Vercel — likeone.ai auto-deploy
- GitHub — version control
- Namecheap — DNS
- Stripe — payments

---

## HOW IT ALL FITS TOGETHER

```
                    ┌──────────────────────┐
                    │    CLAUDE (BRAIN)     │
                    │  Screenplay writer    │
                    │  Pipeline orchestrator│
                    │  Quality judge        │
                    └──────────┬───────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
    ┌─────────▼──────┐ ┌──────▼───────┐ ┌──────▼──────┐
    │ likeone-       │ │ likeone-     │ │ likeone-    │
    │ imagegen (MCP) │ │ audiogen(MCP)│ │ cinema(MCP) │
    │                │ │              │ │             │
    │ Z-Image Turbo  │ │ ACE-Step 1.5 │ │ Kling O1    │
    │ FLUX.2 Klein   │ │ Fish S2 Pro  │ │ RIFE        │
    │ FLUX.1-dev     │ │ AudioLDM     │ │ Remotion    │
    │ Real-ESRGAN    │ │ Demucs       │ │ FFmpeg LUT  │
    │ mflux (MLX)    │ │ FFmpeg mix   │ │ Bunny CDN   │
    └────────────────┘ └──────────────┘ └─────────────┘
              │                │                │
              └────────────────┼────────────────┘
                               │
                    ┌──────────▼───────────┐
                    │   SUPABASE 4-BRAIN   │
                    │  Memory │ App │ Rev  │
                    │  Ops (pipeline state) │
                    └──────────────────────┘
                               │
                    ┌──────────▼───────────┐
                    │   BUNNY STREAM CDN   │
                    │  HLS adaptive, 8 PoPs│
                    │  likeone.ai delivery │
                    └──────────────────────┘
```

---

## THE LAW (ABSOLUTE)

1. One command produces a finished video. No manual steps.
2. Every tool is an MCP server. Claude orchestrates everything.
3. Local first. API only when local can't do it (I2V animation).
4. Brain tracks every run, every keyframe, every score.
5. No generic anything. Every prompt is specific. Every sound is intentional.
6. Perfect builds only. Fix it NOW or don't build it.
7. The pipeline never stops. It loops. It improves. It learns.
8. Cost ceiling: $5/video. Revenue target: $50/enrollment. 10x margin.
9. Like One. Everything fits together with love and serenity.
10. This machine bends reality itself.
