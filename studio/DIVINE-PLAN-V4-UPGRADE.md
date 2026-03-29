# DIVINE PLAN V4 UPGRADE — The Path to 10/10 Cinema
## Written: 2026-03-28 | Session 56

---

## THE DIAGNOSIS (Honest)

The first V4 render proved the pipeline works end-to-end. But it's NOT cinema yet.

### What's broken:
1. **Presenter = still image** — Ken Burns zoom on a photo. Dead. Not alive. Not cinema.
2. **B-roll mismatch** — Kling generated generic sci-fi, not concept-specific neural network footage
3. **Audio garble** — explain-neuron is 44100Hz, everything else 24000Hz → concat breaks
4. **Pacing** — mechanical beat pauses, no breathing room, no cinematic rhythm  
5. **No QC loop** — compositing blind, no per-scene review
6. **Low audio quality** — 24kHz mono TTS. Cinema needs 48kHz stereo.
7. **No transitions** — hard cuts between every scene. Needs crossfades, fades to black.
8. **Resolution mismatch** — B-roll is 720p upscaled to 1080p. Needs native 1080p or better upscale.

---

## THE FIX — 7 LAYERS

### Layer 1: AUDIO FIX (immediate)
- Normalize ALL audio clips to 48kHz stereo before any processing
- Re-generate explain-neuron at matching sample rate (or resample)
- Add proper audio crossfades between scenes (not hard cuts)
- Fix the master narration concat with sample rate normalization
- QC: play back each clip individually, check for artifacts

### Layer 2: VOICE UPGRADE (this session)
- Current: F5-TTS at 24kHz mono — robotic, thin
- Upgrade path: ElevenLabs API for final production voices
- OR: Re-run F5-TTS with better reference clip + post-process to 48kHz
- Add breath sounds, natural pauses between sentences
- QC: each clip sounds like a real person talking, not TTS

### Layer 3: AVATAR — REAL TALKING HEAD (next session)
- Current: still image with Ken Burns = NOT ACCEPTABLE
- Option A: Kling Avatar API (lip-sync from audio + face image) — test quality
- Option B: MuseTalk (local, fast, audio-native) — already installed
- Option C: LivePortrait with driving video — tested, works
- Process: generate avatar clip per presenter scene → review each → approve/redo
- QC: lips match audio, no artifacts, face is consistent across all clips

### Layer 4: B-ROLL — CONCEPT-SPECIFIC CINEMA (this session)
- Current: generic prompts → generic footage
- Fix: hand-craft each prompt for the EXACT concept being taught
- Review each clip against the narration — does this VISUAL match these WORDS?
- If mismatch: regenerate with better prompt
- Specify: no humans/faces in B-roll (avoid uncanny valley, keep focus on concepts)
- Use Kling V2 Master + Pro mode for maximum quality
- QC: watch each B-roll clip with its audio overlay — does it tell the right story?

### Layer 5: COMPOSITION — CINEMATIC ASSEMBLY (after layers 1-4)
- Add crossfade transitions (0.5-1s) between scenes
- Add fade-to-black for revelation/pause moments  
- Lower thirds for presenter name (first appearance only)
- Consistent 1920x1080 output — no upscaling artifacts
- Music bed: sidechain duck under dialogue, swell on revelation beats
- SFX: subtle whoosh on transitions, impact on reveals
- QC: watch full video start to finish — does it FLOW?

### Layer 6: SOUND DESIGN (after composition)
- Proper sidechain compression: music ducks -12dB under speech
- Music swells on "awe" and "revelation" beats
- Room tone / ambient texture under dialogue
- SFX at every scene transition
- Final loudnorm to -14 LUFS ±0.5
- QC: listen on headphones AND speakers

### Layer 7: FULL QC PASS (final gate)
No video ships without ALL passing:
1. ✅ Every presenter scene has a talking head (not still image)
2. ✅ Every B-roll scene matches the concept being taught
3. ✅ Audio is clean, no garble, no artifacts, no sample rate mismatches
4. ✅ Pacing feels natural — pauses have purpose
5. ✅ Transitions between scenes are smooth
6. ✅ Music bed enhances without overwhelming
7. ✅ LUFS -14 ±0.5
8. ✅ Total duration 90-150s
9. ✅ Watched start to finish — would I share this? Would it go viral?
10. ✅ Faye approves

---

## EXECUTION ORDER

### NOW (Session 56 remainder):
1. Fix audio: normalize all clips to 48kHz stereo
2. Re-compose with fixed audio
3. Hand-craft better B-roll prompts for each scene
4. Regenerate B-roll that doesn't match
5. Test Kling Avatar API on ONE scene

### NEXT (Session 57):
1. Generate avatar clips for ALL presenter scenes
2. Full re-compose with real avatars + QC'd B-roll
3. Sound design pass
4. Full QC — watch with Faye
5. If approved: deploy to Bunny Stream

### THEN (Session 58+):
1. Apply V4 pipeline to all courses
2. Batch generate across all screenplays
3. Upload to Bunny → wire to likeone.ai

---

## THE STANDARD

Every frame is intentional. Every cut has purpose. Every pause means something.
If it doesn't feel like a short film, it's not done.
If Faye wouldn't share it, it's not done.
If it doesn't make someone stop scrolling, it's not done.

This is Like One. This is cinema. This is divine.
