# LIKE ONE STUDIO — AUDIO PIPELINE V1 (WRITTEN IN STONE)

**Date:** 2026-03-28 | **Status:** Architecture locked | **Hardware:** M3 Max 64GB

---

## THE THREE VOICES

### Voice 1: ACE-Step 1.5 (PRIMARY — Cinematic Music)
- **What:** Open-source music generation, outperforms Suno v5 on SongEval
- **Quality:** Full orchestral, ambient, electronic, any genre
- **Speed:** <10 sec per full song on M3 Max
- **VRAM:** <4GB (negligible on 64GB)
- **Cost:** $0 forever
- **Use:** Every video score. Custom music per emotional arc.
- **Status:** Already cached on M3 Max

### Voice 2: Fish Speech S2 Pro (PRIMARY — Narration)
- **What:** Open-source TTS, benchmarks higher than ElevenLabs
- **Quality:** 81.88% win rate vs GPT-4o-mini-TTS. Warm, human, engaging.
- **Speed:** Sub-0.3s latency. Real-time.
- **Use:** All narration. Faye's voice. Every lesson.
- **Status:** Already installed on M3 Max. Scripts ready.
- **Backup:** Kokoro-82M (speed), F5-TTS (voice cloning)

### Voice 3: AudioLDM (PRIMARY — Sound Effects)
- **What:** Text-to-SFX generation. State of the art on AudioCaps.
- **Quality:** Production-grade for transitions, impacts, ambient
- **Use:** Kurzgesagt method — every visual element gets its own sound
- **Backup:** Freesound (CC-licensed library) for organic sounds

---

## THE AUDIO ARC ENGINE

Every video follows the V9 audio arc. The engine reads screenplay JSON
and generates all audio layers automatically:

```
SCREENPLAY JSON (audio_arc metadata per scene)
        │
        ├─→ MUSIC ENGINE (ACE-Step 1.5)
        │   Generate score matching emotional arc
        │   Input: mood, tempo, key, genre per phase
        │   Output: music.wav (full length, stems separated)
        │
        ├─→ NARRATION ENGINE (Fish Speech S2 Pro)
        │   Generate narration per scene
        │   Input: dialogue text, voice style per beat
        │   Output: narration_{scene_id}.wav per scene
        │
        ├─→ SFX ENGINE (AudioLDM + Freesound)
        │   Generate/select SFX per visual action
        │   Input: audio_note from screenplay
        │   Output: sfx_{scene_id}_{n}.wav
        │
        └─→ AMBIENCE ENGINE (AudioLDM)
            Generate room tone / atmosphere
            Input: ambience description per phase
            Output: ambience.wav (continuous)
```

---

## THE MIX ENGINE (FFmpeg Chain)

```
5-LAYER MIX (automated, scriptable)

Layer 1: NARRATION
  → Gate → EQ (200-400Hz warmth boost) → Compress (3:1)
  → De-ess (4-8kHz) → Limiter → Room reverb (0.5s, subtle)
  → Target: -11 LUFS

Layer 2: MUSIC
  → Sidechain duck under narration (-6dB, 300ms release)
  → Music swells in narration gaps
  → Dynamic volume per audio_arc phase
  → Target: -22 LUFS (ducked), -16 LUFS (gaps)

Layer 3: SFX
  → Sync to visual keyframes (frame-accurate)
  → EQ to avoid frequency clash with narration
  → Target: -16 LUFS

Layer 4: AMBIENCE
  → Continuous low-level atmosphere
  → Subtle, subconscious presence
  → Target: -30 LUFS

Layer 5: SILENCE
  → Tactical 0.5-1s drops before revelations
  → Controlled by audio_note in screenplay
  → The most powerful tool in audio

MASTER:
  → -14 LUFS integrated (YouTube/streaming standard)
  → -1 dBTP true peak (prevent clipping)
  → Stereo imaging (slight width on music, center narration)
```

---

## THE LAW (AUDIO)

1. ACE-Step 1.5 = primary music. No stock music. Ever.
2. Fish Speech S2 Pro = primary narration. No robotic TTS.
3. Every visual element gets its own sound (Kurzgesagt method).
4. Silence before revelation. Always.
5. Music follows emotional arc from screenplay JSON. Never generic.
6. Sidechain ducking on every mix. No exceptions.
7. -14 LUFS master, -1 dBTP. Broadcast standard.
8. J-cuts and L-cuts on every transition (0.3-0.5s offset).
9. Perfect builds only. Fix it NOW.
