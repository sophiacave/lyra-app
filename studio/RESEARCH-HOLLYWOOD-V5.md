# Hollywood AI Video Production Research — Session 56
## Compiled 2026-03-28

## KEY INSIGHTS FOR LIKE ONE STUDIO V5

### THE GOLD STANDARD (What 10/10 Looks Like)
- **3Blue1Brown**: Manim (Python) for math animations. Every visual communicates. Dark bg, minimal palette.
- **Kurzgesagt**: After Effects + Rubberhose. Consistent art direction. Sound design = atmosphere.
- **Fireship**: 10-15 cuts/min, 200-250 WPM. Memes + code + text overlays. Never shows face.
- **Brilliant.org**: Rive for interactive animations. Learn by doing. Character-driven.

### CINEMA QUALITY FOR EDUCATION ≠ HOLLYWOOD
1. Every frame communicates — zero visual waste
2. Pacing matches cognition — info arrives at brain's absorption rate
3. Consistent visual language — typography, color, spacing are systematic
4. Sound design creates atmosphere — music/effects felt, not noticed
5. Invisible editing — cuts serve comprehension, not style

### TRANSITIONS (PRO VS AMATEUR)
- **90% hard cuts** — clean, invisible, purposeful
- **J-cut**: Audio from next scene starts before visual cut (anticipation)
- **L-cut**: Audio from current scene extends into next visual (continuity)
- **Match cut**: Compositional/thematic match between shots (most cinematic)
- **Crossfade**: SPARINGLY — max 0.5-1s, indicates time passage
- **RULE**: The best transition is the one the viewer doesn't notice

### PACING
- Average shot: 2.5-6s (educational: 4-8s for comprehension)
- Pattern interrupt every 30-45s (change style, shift energy, ask question)
- Rhythm formula: Hook(0-5s) → Setup(5-30s) → Build(30s-3min) → Payoff → Recap

### SOUND DESIGN = 50%+ OF PERCEIVED QUALITY
- Whoosh/swoosh on transitions (subtle)
- Click/tap on UI elements appearing
- Low ambient pad under explanations
- Strategic silence for emphasis
- Voice at -12 to -10 LUFS, music at -20 to -24 LUFS
- Sidechain: `sidechaincompress=threshold=0.02:ratio=6:attack=5:release=300`

### AI VIDEO STATE OF THE ART (March 2026)
- **Kling 3.0**: 4K native, 60fps, 10s clips, native audio, multi-shot sequences
- **Sora is DEAD** (shut down March 25, 2026)
- **Image-to-video** is the PRO workflow (generate key frame → animate with Kling)
- **HeyGen Avatar IV**: Best lip-sync avatars, micro-expressions, 175+ languages
- **Fish Speech 1.6**: Best value TTS, comparable to ElevenLabs, 15s voice clone

### MOTION GRAPHICS TOOLS
- **ManimCE v0.20.1**: Python, math animations, MIT licensed
- **Remotion**: React components rendered to video (complex overlays)
- **FFmpeg drawtext**: Zero deps, expression-based animation
- **FFmpeg xfade-easing**: CSS easing curves ported to FFmpeg (github.com/scriptituk/xfade-easing)
- **MoviePy 2.x**: Python composition, integrates with OpenCV/PIL

### MAYER'S MULTIMEDIA LEARNING PRINCIPLES
1. Present words AND graphics (not just one)
2. Remove ALL extraneous material
3. Highlight key material (color, size, motion)
4. Do NOT caption text that repeats spoken words exactly
5. Labels next to the thing they describe
6. Show and tell simultaneously
7. Break complex visuals into progressive reveals
8. Words as SPOKEN text (not on-screen text walls)
9. Conversational tone
10. Human-sounding voice
11. Gesturing instructor > static talking head

### MUSIC (COPYRIGHT-SAFE)
- **Soundraw** ($17/mo): AI-generated, zero copyright risk, mood-controllable
- **Beatoven.ai** (free tier): AI mood-based generation
- **ACE-Step**: Already installed locally — free, open source
- **Epidemic Sound** ($15/mo): Best human-composed, YouTube safe

### RECOMMENDED PIPELINE
```
Script → TTS Voice → AI B-Roll (image-to-video via Kling 3.0)
                                    ↓
                    FFmpeg Composition:
                    1. Base layer (B-roll or background)
                    2. Talking head overlay (PiP or full)
                    3. Text/graphics overlay (drawtext + easing)
                    4. Audio mix (voice + music + SFX with sidechain)
                    5. Color correction
                    6. Final encode (H.264, 1080p, AAC, -14 LUFS)
                    7. Bunny CDN (adaptive HLS)
```

### MCP SERVER ARCHITECTURE
- SDK: `@modelcontextprotocol/sdk` v1.28.0
- Transport: stdio (local, Claude Code spawns process)
- Long-running: Progress notifications (`sendProgress(i, 100, msg)`)
- Binary output: Return `resource_link` with file path
- Register: `claude mcp add --transport stdio --scope user`
- Zod schemas with `.describe()` for every parameter
