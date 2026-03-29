# LIKE ONE STUDIO — VISUAL PIPELINE V1 (WRITTEN IN STONE)

**Date:** 2026-03-28 | **Status:** Architecture locked | **Hardware:** M3 Max 64GB

---

## THE THREE ENGINES

### Engine 1: Z-Image Turbo (PRIMARY — Hero Keyframes)
- **Model:** Tongyi-MAI/Z-Image-Turbo (6B params)
- **Backend:** mflux 0.17.4 (MLX-native, Apple Silicon optimized)
- **Quality:** Ranked #1 open-source on Artificial Analysis
- **Speed:** ~8-10 sec per frame on M3 Max
- **Strengths:** Best photorealism, skin texture, materials, lighting
- **Use:** Final keyframes for I2V, hero shots, cinematic stills
- **Supports:** img2img (strength 0-1), text-to-image
- **No negative prompts** — use positive descriptions only
- **Steps:** 8 NFEs optimal
- **Resolution:** 1024x1024 native, upscale to 4K post-gen

### Engine 2: FLUX.2 Klein 4B (FAST — Exploration)
- **Model:** black-forest-labs/FLUX.2-klein-4B (Apache 2.0)
- **Backend:** mflux 0.17.4 (MLX-native)
- **Speed:** ~2-4 sec per frame on M3 Max
- **Strengths:** Sub-second iteration, rapid concept proofing
- **Use:** Exploration, variations, concept testing, style iteration
- **Steps:** 4 (distilled model)
- **Guidance:** 3.5-4.0 (no negative prompts)
- **Resolution:** 1024x1024 native

### Engine 3: FLUX.1-dev (PREMIUM — Highest Ceiling)
- **Model:** black-forest-labs/FLUX.1-dev (gated, non-commercial)
- **Backend:** mflux 0.17.4 (MLX-native, unquantized on 64GB)
- **Speed:** ~40-60 sec per frame on M3 Max
- **Strengths:** Highest photorealism ceiling, prompt fidelity
- **Use:** Final renders when Z-Image isn't enough
- **Steps:** 25-50
- **Status:** Requires license acceptance on HuggingFace

---

## THE I2V WORKFLOW (DUAL-KEYFRAME)

```
┌─────────────────────────────────┐
│ 1. GENERATE START KEYFRAME      │
│    Z-Image Turbo via mflux      │
│    7-element prompt (V9 formula)│
│    1024x1024 → upscale to 4K   │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│ 2. GENERATE END KEYFRAME        │
│    Same model, same style       │
│    End-state of the motion      │
│    Must match color/lighting    │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│ 3. UPSCALE BOTH (Real-ESRGAN)   │
│    4x upscale to 4K             │
│    Preserves fine detail        │
│    De-noise pass if needed      │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│ 4. KLING O1 I2V (API)           │
│    Start frame + End frame      │
│    Motion prompt (movement only)│
│    5-10s video output           │
│    Total control over arc       │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│ 5. RIFE INTERPOLATION           │
│    Generate at native fps       │
│    Interpolate to 30fps         │
│    Smooth motion, hide shimmer  │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│ 6. CINEMA GRADE                  │
│    LUT pipeline (Kodak/ARRI)    │
│    Film grain overlay           │
│    Letterbox 2.35:1             │
│    Color arc enforcement        │
└──────────────┬──────────────────┘
               │
           FINAL CLIP
```

---

## THE MCP ARCHITECTURE

### likeone-imagegen (Custom MCP Server)
```
Tools:
  generate_keyframe    — Z-Image/FLUX.2/FLUX.1 via mflux
  generate_variations  — N variations of same prompt
  img2img_refine       — Refine existing keyframe
  upscale              — Real-ESRGAN 4x
  validate_prompt      — 7-element formula check
  batch_screenplay     — Generate all keyframes from screenplay JSON
```

### likeone-cinema (Custom MCP Server)
```
Tools:
  animate_scene        — Start+end frame → Kling O1 I2V
  interpolate          — RIFE frame interpolation
  cinema_grade         — LUT + grain + letterbox pipeline
  compose_video        — Remotion render from screenplay
  qa_check             — Automated quality gate
```

### likeone-kling (Existing MCP — Enhanced)
```
Tools (existing):
  generate_image       — Kling image gen (backup)
  image_to_video       — Kling I2V
  check_task           — Poll/download
Tools (add):
  dual_keyframe_i2v    — Start+end frame I2V
```

---

## PROMPT RULES (FLUX.2 / Z-IMAGE)

1. NO negative prompts — these models don't support them
2. Use positive descriptions: "sharp detailed hands" not "no blurry hands"
3. 50-150 words optimal prompt length
4. Camera/lens/lighting details improve output dramatically
5. Film stock references work (Kodak Vision3, ARRI LogC)
6. Guidance scale: 3.5-4.0 (higher = artifacts)

---

## THE LAW (UPDATED FOR V1)

1. Z-Image Turbo = primary. FLUX.2 Klein = exploration. FLUX.1-dev = premium.
2. Every hero shot uses dual-keyframe I2V (start + end frame).
3. No text-to-video for hero shots. I2V only.
4. No Ken Burns. Ever.
5. Upscale before I2V. Always.
6. Cinema grade on everything. No ungraded footage ships.
7. All generation via mflux (MLX-native). No PyTorch fallbacks.
8. Perfect builds only. Fix it NOW or don't build it.
