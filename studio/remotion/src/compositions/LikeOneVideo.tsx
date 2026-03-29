import { AbsoluteFill, useCurrentFrame, interpolate, Sequence, Audio } from "remotion";
import { SceneRenderer } from "../components/SceneRenderer";
import { WhipPan } from "../components/WhipPan";
import { COLORS, FONTS, COURSE_THEMES } from "../cinema-tokens";

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
  type: "broll" | "diagram" | "title" | "montage" | "outro";
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
  // Presenter overlay (triggers LowerThird on broll scenes)
  presenter?: string;
  presenterRole?: string;
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
// Course theme applied dynamically via screenplay.colorTheme
function getDesignTokens(colorTheme?: string) {
  const courseTheme = colorTheme ? COURSE_THEMES[colorTheme] : null;
  return {
    colors: {
      ...COLORS,
      // Override accent if course theme provides one
      ...(courseTheme ? { accent: courseTheme.accent } : {}),
    },
    gradient: courseTheme?.gradient ?? [COLORS.void, "#1a0a2e"] as [string, string],
    mood: courseTheme?.mood ?? "default",
  };
}

// J-cut and L-cut frame offsets (V9: offset audio/video by 0.3-0.5s)
const J_CUT_FRAMES = 10; // ~0.33s at 30fps — audio starts before visual
const L_CUT_FRAMES = 8;  // ~0.27s at 30fps — audio trails after visual

// WhipPan transition — energy bridge between high-energy beat changes
const WHIP_PAN_FRAMES = 6; // 0.2s at 30fps — fast, decisive
const WHIP_PAN_BEATS = new Set([
  "setup→core",    // entering the meat
  "core→deepen",   // intensifying
  "deepen→peak",   // building to climax
]);

export const LikeOneVideo: React.FC<{ screenplay: Screenplay | null }> = ({ screenplay }) => {
  const frame = useCurrentFrame();
  const fps = 30;
  const designTokens = getDesignTokens(screenplay?.colorTheme);

  // ═══════════════════════════════════════════════════
  // NO SCREENPLAY — SHOW PREVIEW CARD
  // ═══════════════════════════════════════════════════
  if (!screenplay) {
    return (
      <AbsoluteFill style={{
        background: `linear-gradient(135deg, ${designTokens.gradient[0]} 0%, ${designTokens.gradient[1]} 100%)`,
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

    // WhipPan detection: high-energy beat transitions or editorial hints
    const prevBeat = index > 0 ? scenes[index - 1].beat : null;
    const beatTransition = prevBeat ? `${prevBeat}→${scene.beat}` : null;
    const editorialHint = (scene.editorial || "").toLowerCase();
    const whipPan = !isFirst && (
      (beatTransition !== null && WHIP_PAN_BEATS.has(beatTransition)) ||
      /whip|rapid|energy|slam/.test(editorialHint)
    );

    return {
      ...scene,
      startFrame,
      durationFrames,
      jCut: isFirst ? 0 : J_CUT_FRAMES,
      lCut: isLast ? 0 : L_CUT_FRAMES,
      whipPan,
      whipDirection: (index % 2 === 0 ? "left" : "right") as "left" | "right",
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
          from={scene.whipPan ? scene.startFrame - WHIP_PAN_FRAMES : scene.startFrame}
          durationInFrames={scene.durationFrames + (scene.whipPan ? WHIP_PAN_FRAMES : 0)}
          name={`${scene.beat}:${scene.id}`}
        >
          {scene.whipPan ? (
            <WhipPan direction={scene.whipDirection} durationFrames={WHIP_PAN_FRAMES}>
              <SceneRenderer
                scene={scene}
                fps={fps}
                jCutFrames={scene.jCut}
                lCutFrames={scene.lCut}
                designTokens={designTokens}
              />
            </WhipPan>
          ) : (
            <SceneRenderer
              scene={scene}
              fps={fps}
              jCutFrames={scene.jCut}
              lCutFrames={scene.lCut}
              designTokens={designTokens}
            />
          )}
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
