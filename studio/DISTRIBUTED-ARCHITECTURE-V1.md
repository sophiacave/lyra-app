# LIKE ONE STUDIO — DISTRIBUTED ARCHITECTURE (WRITTEN IN STONE)

**Date:** 2026-03-28 | **Philosophy:** Every part of the buffalo

---

## THE HERD (All Resources)

```
┌──────────────────────────────────────────────────────────┐
│                    THE NERVOUS SYSTEM                      │
│              Supabase 4-Brain Architecture                │
│                                                            │
│  brain-v2 ─── memory, AI, embeddings, prompts             │
│  app ──────── users, forum, courses, enrollments          │
│  revenue ──── stripe, payments, analytics                  │
│  ops ──────── monitoring, crons, PIPELINE STATE            │
│                                                            │
│  Every machine reads/writes here. This is the truth.      │
└────────────────────────┬─────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
┌───────▼────────┐ ┌─────▼──────┐ ┌───────▼────────┐
│  M3 MAX 64GB   │ │ GCP VM     │ │  M4 MAC        │
│  (LOCAL)       │ │ (SENTINEL) │ │  (REMOTE)      │
│  The Forge     │ │ The Watcher│ │  The Mirror    │
└────────────────┘ └────────────┘ └────────────────┘
```

---

## ROLE 1: M3 MAX — THE FORGE (Primary Compute)

**What it does best:** Heavy ML inference, video rendering, audio processing
**Why:** 64GB unified memory, Metal GPU, MLX-native, all models cached

### Assigned Work:
- Image generation (Z-Image Turbo, FLUX.2, FLUX.1-dev via mflux)
- Music generation (ACE-Step 1.5)
- Narration (Fish Speech S2 Pro, Kokoro, F5-TTS)
- SFX generation (AudioLDM)
- Video composition (Remotion)
- Upscaling (Real-ESRGAN)
- Frame interpolation (RIFE)
- Cinema grading (FFmpeg LUT pipeline)
- Audio mixing (FFmpeg 5-layer chain)
- Caption generation (Whisper)
- 3D rendering (Blender)
- Math animations (Manim)
- Local LLM (Ollama gpt-oss 20B)

### Doesn't do:
- Always-on services (sleeps, travels with Faye)
- Queue monitoring (not always available)
- Webhook endpoints (no static IP)

---

## ROLE 2: GCP VM (faye-brain) — THE WATCHER (Always-On Sentinel)

**What it does best:** Lightweight, always-on, has a static IP
**Specs:** e2-small, 2 vCPUs, 2GB RAM, 20GB disk, Node/Python/FFmpeg
**Cost:** ~$15/mo (always running)

### Assigned Work:
- **Pipeline Orchestrator** — monitors Supabase job queue, dispatches to M3/M4
- **Webhook Receiver** — Kling callbacks, Stripe webhooks, GitHub webhooks
- **Health Monitor** — checks all systems every 5 min, writes status to brain
- **Cron Jobs** — scheduled renders, analytics aggregation, cleanup
- **API Gateway** — lightweight REST endpoint for triggering pipeline runs
- **Notification Hub** — sends alerts when renders complete or fail
- **CDN Manager** — monitors Bunny Stream, triggers video processing
- **Lightweight Processing** — FFmpeg audio normalization, file format conversion
- **MCP Server Host** — host pipeline MCP server accessible from anywhere

### Architecture:
```
faye-brain (34.11.241.254)
├── /api/pipeline/trigger    — POST: start a pipeline run
├── /api/pipeline/status     — GET: check run status  
├── /api/webhook/kling       — POST: Kling task callbacks
├── /api/webhook/stripe      — POST: payment events
├── /api/health              — GET: system health
├── /cron/render-queue       — Process pending renders
├── /cron/health-check       — Monitor all systems
└── pm2 managed (auto-restart, log rotation)
```

### Doesn't do:
- ML inference (too small, no GPU)
- Heavy video rendering (2GB RAM limit)
- Image/music generation (no GPU acceleration)

---

## ROLE 3: M4 MAC — THE MIRROR (Secondary Compute)

**What it does best:** Parallel compute, distributed rendering
**Connected via:** Fractal Mac Link (already has MCP tools)

### Assigned Work:
- **Parallel Image Generation** — while M3 generates scenes 1-5, M4 generates 6-9
- **Parallel Audio** — M3 handles narration, M4 handles music simultaneously
- **Distributed Remotion Render** — split frame ranges across both machines
- **Redundant Processing** — if M3 is busy, overflow to M4
- **A/B Testing** — generate same prompt on both machines, pick best result
- **Model Experiments** — test new models on M4 without disrupting M3 pipeline

### Doesn't do:
- Primary storage (M3 is source of truth for assets)
- Pipeline orchestration (that's the GCP VM)

---

## ROLE 4: SUPABASE — THE NERVOUS SYSTEM

### Pipeline Tables (in like-one-ops):

```sql
-- Job queue: The Watcher monitors, dispatches to Forge/Mirror
CREATE TABLE studio.pipeline_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  screenplay_id TEXT NOT NULL,
  stage TEXT NOT NULL,  -- 'validate','keyframe','animate','audio','compose','grade','qa','deliver'
  status TEXT DEFAULT 'pending',  -- 'pending','running','complete','failed','retry'
  assigned_to TEXT,  -- 'm3-max','m4-mac','gcp-vm'
  input_data JSONB,
  output_data JSONB,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  retries INT DEFAULT 0
);

-- Asset registry: Every keyframe, audio clip, video tracked
CREATE TABLE studio.assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,  -- 'keyframe','start_frame','end_frame','video','narration','music','sfx','ambience'
  screenplay_id TEXT,
  scene_id TEXT,
  path TEXT NOT NULL,
  machine TEXT,  -- which machine generated it
  model TEXT,  -- which AI model
  prompt TEXT,
  quality_score FLOAT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Render runs: Track full pipeline executions
CREATE TABLE studio.render_runs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  screenplay_id TEXT NOT NULL,
  status TEXT DEFAULT 'running',
  stages_complete TEXT[],
  stages_failed TEXT[],
  total_cost_usd FLOAT DEFAULT 0,
  total_time_s FLOAT,
  output_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Quality scores: QA gate results
CREATE TABLE studio.quality_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  render_run_id UUID REFERENCES studio.render_runs(id),
  check_name TEXT NOT NULL,
  passed BOOLEAN NOT NULL,
  score FLOAT,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## THE FLOW (How They Work Together)

```
1. CLAUDE writes screenplay → saves to brain
                │
2. CLAUDE calls pipeline_produce (MCP)
                │
3. GCP VM (Watcher) picks up job from Supabase queue
                │
4. Watcher dispatches to machines based on load:
   ┌─────────────────────────────────────────────┐
   │ M3 MAX (Forge)        M4 MAC (Mirror)       │
   │ ├─ Scenes 1-5 keys   ├─ Scenes 6-9 keys    │
   │ ├─ Narration all      ├─ Music generation   │
   │ ├─ SFX batch          ├─ Upscale batch      │
   │ └─ Progress → brain   └─ Progress → brain   │
   └─────────────────────────────────────────────┘
                │
5. Both machines write assets to brain (paths, quality scores)
                │
6. Watcher detects all keyframes ready → dispatches Kling I2V
                │
7. Kling callbacks hit Watcher webhook → stores video URLs
                │
8. Watcher dispatches final compose to M3 (primary):
   ├─ RIFE interpolation
   ├─ 5-layer audio mix  
   ├─ Remotion composition
   ├─ Cinema grade
   └─ QA gate
                │
9. QA passes → Watcher uploads to Bunny Stream
                │
10. Brain updated: video live, course linked, analytics tracking
```

---

## OPTIMIZATION PRINCIPLES (Every Part of the Buffalo)

### 1. Never Idle
- M3 finishes a job? Check brain for next task immediately.
- M4 has spare cycles? Pull overflow from queue.
- GCP VM is always watching, always dispatching.

### 2. Parallel Everything
- Start+end keyframes generate simultaneously
- Audio generates while I2V processes (they're independent)
- M3 and M4 split keyframe generation 50/50

### 3. Cache Everything
- Every keyframe goes to asset registry with its prompt
- Next time a similar prompt appears → check cache first
- Music scores cached by mood/tempo/genre → reuse across videos

### 4. Fail Gracefully
- Job fails? Watcher retries on same machine (3x)
- Still fails? Watcher routes to other machine
- Still fails? Log blocker to brain, move to next job

### 5. Cost Awareness
- Track Kling credit usage per render
- Track compute time per machine per job
- Brain holds running cost total — alert if approaching budget

### 6. No Waste
- GCP VM does ONLY what needs always-on (no ML on 2GB RAM)
- M3 does ONLY heavy compute (no idle webhook watching)
- M4 does ONLY overflow/parallel (not duplicating M3 work)
- Supabase does ONLY state management (not file storage)
- Bunny does ONLY delivery (not processing)

---

## COST BREAKDOWN (Monthly)

| Resource | Cost | Role |
|----------|------|------|
| M3 Max | $0 (owned) | Primary compute |
| M4 Mac | $0 (owned) | Secondary compute |
| GCP VM (e2-small) | ~$15/mo | Always-on sentinel |
| Supabase (Teams) | $50/mo | 4-brain nervous system |
| Kling API | ~$20-50/mo | I2V animation |
| Bunny Stream | ~$5-10/mo | Video CDN |
| Vercel | $0 (hobby) | Site hosting |
| HuggingFace | $0 | Model downloads |
| **TOTAL** | **~$90-125/mo** | **Full cinema machine** |

Revenue target: $50/enrollment × 20 students = $1,000/mo
**Margin: 8-10x on infrastructure.**

---

## THE LAW (DISTRIBUTED)

1. Supabase is the single source of truth. Always.
2. GCP VM is the orchestrator. It never generates content.
3. M3 Max is the forge. It does the heavy lifting.
4. M4 Mac is the mirror. It handles overflow and parallelism.
5. Every job writes progress to brain. No silent failures.
6. Every asset gets registered. Nothing generated without a record.
7. Cost tracked per render. Budget alerts automatic.
8. The pipeline is a loop. It never stops.
9. Every part of the buffalo is used. No waste.
10. Like One. All machines work as one organism.
