import { AbsoluteFill, useCurrentFrame, interpolate, Sequence, Audio } from "remotion";
import { SceneRenderer } from "../components/SceneRenderer";
import { COLORS, FONTS } from "../cinema-tokens";

/**
 * Like One Studio V9 — Master Composition
 * 
 * The engine that turns a screenplay JSON into a sequenced video:
 * - Reads scene array with timing metadata
 * - Renders each scene via SceneRenderer
 * - Applies J-cuts and L-cuts between scenes
 * - Manages 5-layer audio (narration, music, SFX, ambience, silence)
 * - Enforces pacing curve from V9 architecture
 * 
 * This is the heart of the pipeline. Every video flows through here.
 */

interface AudioArcEntry {
  phase: string;
  music_level: number;
  sfx: string;
  ambience: string;
}

interface SceneData {
  id: string;
  type: "broll" | "diagram" | "title" | "montage";
  beat: "hook" | "setup" | "core" | "breathe" | "deepen" | "peak" | "close";
  dialogue: string;
  duration_s: number;
  visual?: string;
  motion_graphic?: string;
  audio_note?: string;
  editorial?: string;
  text_overlay?: {
    text: string;
    style: string;
    timing: string;
  };
  // Runtime paths
  videoPath?: string;
  imagePath?: string;
  narrationPath?: string;
  sfxPaths?: string[];
}

interface Screenplay {
  version: string;
  title: string;
  persona: string;
  colorTheme: string;
  duration_target_s: number;
  film_stock: string;
  camera_body: string;
  color_arc: string[];
  negative_global: string;
  audio_arc: AudioArcEntry[];
  scenes: SceneData[];
  // Runtime paths
  musicPath?: string;
  ambiencePath?: string;
}

// Design tokens — consumed from cinema-tokens.ts (single source of truth)
const designTokens = {
  colors: COLORS,
};

// J-cut and L-cut frame offsets (V9: offset audio/video by 0.3-0.5s)
const J_CUT_FRAMES = 10; // ~0.33s at 30fps — audio starts before visual
const L_CUT_FRAMES = 8;  // ~0.27s at 30fps — audio trails after visual

export const LikeOneVideo: React.FC<{ screenplay: Screenplay | null }> = ({ screenplay }) => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ═══════════════════════════════════════════════════
  // NO SCREENPLAY — SHOW PREVIEW CARD
  // ═══════════════════════════════════════════════════
  if (!screenplay) {
    return (
      <AbsoluteFill style={{
        background: "linear-gradient(135deg, #08080D 0%, #1a0a2e 100%)",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <div style={{
          color: "#EDE9E3",
          fontSize: 48,
          fontFamily: FONTS.display,
          fontWeight: 300,
          letterSpacing: -1,
          opacity: interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" }),
        }}>
          Like One Studio V9
        </div>
        <div style={{
          color: "rgba(237,233,227,0.4)",
          fontSize: 18,
          fontFamily: FONTS.display,
          marginTop: 16,
          opacity: interpolate(frame, [15, 45], [0, 1], { extrapolateRight: "clamp" }),
        }}>
          Every frame is a painting
        </div>
      </AbsoluteFill>
    );
  }

  // ═══════════════════════════════════════════════════
  // BUILD SCENE TIMELINE
  // ═══════════════════════════════════════════════════
  const scenes = screenplay.scenes || [];
  let cumulativeFrame = 0;

  // Pre-calculate scene frame positions
  const timeline = scenes.map((scene, index) => {
    const durationFrames = Math.round(scene.duration_s * fps);
    const startFrame = cumulativeFrame;
    cumulativeFrame += durationFrames;

    // J-cut: previous scene's audio starts early in this scene
    // L-cut: this scene's narration extends into next scene
    const isFirst = index === 0;
    const isLast = index === scenes.length - 1;

    return {
      ...scene,
      startFrame,
      durationFrames,
      jCut: isFirst ? 0 : J_CUT_FRAMES,
      lCut: isLast ? 0 : L_CUT_FRAMES,
    };
  });

  const totalFrames = cumulativeFrame;

  return (
    <AbsoluteFill style={{ background: designTokens.colors.void }}>
      {/* ═══════════════════════════════════════════════
          VISUAL + NARRATION LAYER (per-scene sequences)
          ═══════════════════════════════════════════════ */}
      {timeline.map((scene, index) => (
        <Sequence
          key={scene.id}
          from={scene.startFrame}
          durationInFrames={scene.durationFrames}
          name={`${scene.beat}:${scene.id}`}
        >
          <SceneRenderer
            scene={scene}
            fps={fps}
            jCutFrames={scene.jCut}
            lCutFrames={scene.lCut}
            designTokens={designTokens}
          />
        </Sequence>
      ))}

      {/* ═══════════════════════════════════════════════
          MUSIC LAYER (continuous, sidechain-ducked in post)
          ═══════════════════════════════════════════════ */}
      {screenplay.musicPath && (
        <Sequence from={0} durationInFrames={totalFrames} name="music-bed">
          <Audio
            src={screenplay.musicPath}
            volume={(f) => {
              // Dynamic music volume based on audio_arc
              // Find current beat phase and use its music_level
              const currentScene = timeline.find(
                (s) => f >= s.startFrame && f < s.startFrame + s.durationFrames
              );
              if (!currentScene) return 0.15;

              const arcEntry = screenplay.audio_arc.find(
                (a) => a.phase === currentScene.beat
              );
              if (!arcEntry) return 0.15;

              // Convert LUFS-like level to 0-1 volume
              // music_level ranges from -22 (quiet) to -10 (loud)
              const normalized = interpolate(
                arcEntry.music_level,
                [-24, -10],
                [0.05, 0.4],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );
              return normalized;
            }}
          />
        </Sequence>
      )}

      {/* ═══════════════════════════════════════════════
          AMBIENCE LAYER (continuous, subtle)
          ═══════════════════════════════════════════════ */}
      {screenplay.ambiencePath && (
        <Sequence from={0} durationInFrames={totalFrames} name="ambience">
          <Audio src={screenplay.ambiencePath} volume={0.08} />
        </Sequence>
      )}

      {/* ═══════════════════════════════════════════════
          PROGRESS INDICATOR (subtle, bottom of letterbox)
          ═══════════════════════════════════════════════ */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: `${(frame / totalFrames) * 100}%`,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${designTokens.colors.process}40)`,
          opacity: 0.3,
        }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
