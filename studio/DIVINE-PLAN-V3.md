# DIVINE PLAN V3: HIGH ART EDU — 10/10 Perfection
## Written in Stone: 2026-03-28 | The Cinematic Pivot

---

## THE DIAGNOSIS

V2 built a **well-engineered PowerPoint**. Good pacing theory, solid pipeline architecture.
But the frames are text-on-dark-background with dot diagrams. That's not cinema. That's not art.

### What 10/10 EDU looks like (the standard):
- **Kurzgesagt**: Every concept = visual metaphor. Duck explaining neurons. Universe as library.
- **3Blue1Brown**: Math BUILDS visually. You SEE the concept construct itself.
- **Apple keynotes**: Every frame is a photograph. Typography is the star. Negative space breathes.
- **Fireship**: Dense info + personality + speed. Never boring.

### What we have vs what we need:

| Layer | Current (5/10) | Target (10/10) |
|-------|---------------|----------------|
| Voice | Edge TTS robot | Fish S2 Pro warm human voice |
| Music | Silent | Ambient bed + sidechain duck on every video |
| SFX | Silent | Whoosh/pop/impact at every transition |
| Scenes | Text + dot diagrams | 8+ scene types with SVG illustrations |
| Color | Same purple everywhere | Per-topic color stories |
| Metaphors | None | Every concept has a visual metaphor |
| Narrative | Section→section | Hook→story→teach→aha→payoff |
| Update system | Manual batch scripts | One-command style upgrade |

---

## THE 10/10 ARCHITECTURE

### LAYER 1: VOICE (Priority: CRITICAL)
Fish Audio S2 Pro is installed with checkpoints. Need a warm reference voice.

**Strategy:**
- Find/record a 10-30s reference clip of warm, confident, educational voice
- Use S2 Pro voice cloning to generate all narration
- Fallback: Edge TTS en-US-AvaMultilingualNeural (warmer than Jenny)
- Post-process: existing 6-stage audio chain (already built)

**Acceptance:** Voice sounds human, warm, conversational. Not robotic.

### LAYER 2: SOUND DESIGN (Priority: HIGH — fastest win)
Audio engine + SFX library EXIST but aren't wired into renders.

**Wire into pipeline:**
1. Every render gets ambient-drone-01.wav music bed
2. Sidechain duck under narration (already coded in audio-engine.js)
3. SFX auto-placed: whoosh at scene transitions, pop at node appearances, impact on title cards
4. Two-pass loudnorm to -14 LUFS on final mix
5. This is ALREADY CODED. Just needs wiring into render-lesson-v2.js Phase 3.

**Acceptance:** Every video has layered audio: voice + music + SFX. No silence gaps.

### LAYER 3: VISUAL VOCABULARY EXPANSION (Priority: HIGH)
Current scenes: narration (text), concept (dots), code, quote, comparison, timeline, outro.
Need: richer scene types that SHOW concepts, not just TELL.

**New scene types to build:**
1. **IconReveal** — Large animated SVG icon (brain, shield, network, lightbulb) with label. Icon draws itself stroke-by-stroke.
2. **ProcessFlow** — Animated flowchart: boxes connected by arrows that draw sequentially. Better than dot diagrams.
3. **MetaphorScene** — Full-screen visual metaphor with layered SVG illustration. E.g., "AI is like a library" = animated bookshelves.
4. **StatReveal** — Big number animation (counts up) with context label. E.g., "86 billion neurons."
5. **SplitScreen** — Before/after or concept/reality side-by-side with animated reveal.
6. **IconGrid** — Grid of icons appearing with stagger, showing a category of items.
7. **GradientArt** — Abstract gradient backgrounds with floating topic-relevant shapes. For breathing/transition moments.
8. **ProgressiveReveal** — 3B1B style: diagram builds step by step, each step animated on narration cue.

**SVG Icon Library (code-generated):**
Build 30+ SVG icons via React components: brain, neuron, network, shield, lock, code-bracket, lightbulb, book, chat-bubble, arrow-flow, database, cloud, chart, gear, heart, scale, eye, warning, check, sparkle, pen, palette, music-note, calculator, clock, globe, rocket, puzzle, key, filter.

**Acceptance:** Each video uses 3+ different scene types. No two consecutive scenes look the same.

### LAYER 4: COLOR STORIES (Priority: MEDIUM)
Each course/topic gets its own color palette. Stored in config.

**Palettes:**
- AI Foundations: Deep indigo + electric cyan (tech, deep)
- Prompt Writing: Warm amber + soft cream (creative, inviting)  
- Ethics & Safety: Forest green + warm gold (trust, gravitas)
- Creatives: Magenta + coral + peach (expression, energy)
- Business: Navy + silver + ice blue (professional, clean)
- Personal Productivity: Teal + warm white (calm, focused)
- RAG & Vectors: Purple + neon blue (technical, modern)
- Claude for Beginners: Soft purple + lavender (friendly, approachable)

**Implementation:** Add `colorTheme` to each config JSON. DepthBackground + accents read from theme.

### LAYER 5: NARRATIVE STRUCTURE (Priority: MEDIUM)
Every video follows a cinematic arc, not just section→section.

**The Like One Narrative Arc:**
```
COLD OPEN (5s): Start with a provocative question or surprising fact
  → "You have 86 billion neurons. Each one does something embarrassingly simple."

HOOK (15s): Why should you care? What's at stake?
  → "Understanding this one concept unlocks everything about AI."

BUILD (60-90s): Progressive reveal of the concept
  → Each point builds on the last. Never info-dump.
  → Alternate: narration → visual → narration → visual

AHA MOMENT (10s): The key insight. Dramatic pause. Let it land.
  → Music swells slightly. Visual simplifies to one image.
  → 2-second silence after the reveal.

APPLICATION (30s): Now that you know, here's what you can do.
  → Practical, actionable, immediate.

CLOSE (10s): Callback to opening. Land the emotional note.
  → "86 billion simple decisions, and now you know how they work."
```

### LAYER 6: EFFORTLESS UPDATE SYSTEM (Priority: HIGH)
One command upgrades all videos when style improves.

**`node studio/upgrade-all.js`:**
1. Reads all configs in content/configs/
2. For each: generates TTS (if no audio or --regenerate-audio)
3. Applies full audio chain (post-process + music + SFX + loudnorm)
4. Renders Remotion video with latest components
5. Merges audio + video
6. Runs quality check (LUFS, WPM, duration, scene variety)
7. Uploads to Bunny Stream (replaces existing by slug)
8. Updates videoIds in lesson frontmatter
9. Git commit + push (auto-deploy to Vercel)

**Style versioning:** Each render embeds style version in metadata.
When components change, `--force-style-upgrade` re-renders only videos with older style version.

**Config format upgrade:**
```json
{
  "version": "3.0",
  "title": "What Is a Neuron?",
  "colorTheme": "ai-foundations",
  "narrative": "progressive",
  "voice": "s2pro-warm",
  "sections": [
    { "type": "cold-open", "text": "...", "visual": "stat-reveal", "stat": "86 billion" },
    { "type": "hook", "text": "...", "visual": "icon-reveal", "icon": "brain" },
    { "type": "build", "text": "...", "visual": "progressive-reveal", "steps": [...] },
    { "type": "aha", "text": "...", "visual": "metaphor", "metaphor": "switches" },
    { "type": "apply", "text": "...", "visual": "process-flow", "flow": [...] },
    { "type": "close", "text": "...", "visual": "gradient-art" }
  ]
}
```

---

## IMPLEMENTATION ORDER (Session 53+)

### Phase 1: SOUND (This session — 30min)
Wire existing audio engine into every render. Instant quality leap.
1. Update render-lesson-v2.js to apply: TTS post-process → music mix → SFX → loudnorm
2. Test on one video
3. Re-render one video with full audio chain
4. Verify: music ducks under voice, SFX at transitions, -14 LUFS

### Phase 2: VOICE (This session — 30min)
Get Fish S2 Pro producing warm narration.
1. Test S2 Pro with fish-speech-1.5 checkpoint
2. Find/create reference voice clip
3. Generate test narration, compare to Edge TTS
4. If better: set as default TTS engine

### Phase 3: VISUAL VOCABULARY (Next session — 2hr)
Build new scene types + SVG icon library.
1. Build SVG icon components (30 icons, code-generated)
2. Build IconReveal scene type
3. Build ProcessFlow scene type
4. Build StatReveal scene type
5. Build ProgressiveReveal scene type
6. Build color theme system

### Phase 4: CONFIG V3 + NARRATIVE (Next session — 1hr)
Upgrade configs to v3 format with narrative arcs.
1. Design config v3 schema
2. Rewrite "What Is a Neuron?" as v3 config (pilot)
3. Build narrative arc renderer in LessonVideo.jsx
4. Test end-to-end

### Phase 5: UPGRADE SYSTEM (Next session — 1hr)
Build upgrade-all.js for effortless re-renders.
1. Build the one-command pipeline
2. Bunny upload integration (already exists)
3. VideoId auto-wiring (already exists)
4. Git auto-commit + push

### Phase 6: FULL RE-RENDER (After all above)
Nuke all v2 videos. Re-render everything as v3.
Upload to Bunny. Wire. Deploy. Ship.

---

## THE LAW (V3)

No video ships without ALL of these:
1. ✅ Human-quality voice (S2 Pro or equivalent)
2. ✅ Ambient music bed ducked under narration
3. ✅ SFX at scene transitions
4. ✅ 3+ different scene types per video
5. ✅ Per-topic color theme
6. ✅ At least one visual metaphor per video
7. ✅ Narrative arc (cold open → hook → build → aha → apply → close)
8. ✅ Audio normalized to -14 LUFS ±0.5
9. ✅ WPM between 130-165
10. ✅ Quality check pass confirming all metrics

**This is Like One Studio v3. High Art EDU. Every frame earns its place. Every sound has purpose.**
