import { AbsoluteFill, useCurrentFrame, interpolate, Audio, Video, Img, Sequence, spring } from "remotion";
import { LivingFrame } from "./LivingFrame";
import { KineticText } from "./KineticText";

/**
 * Scene types from V9 architecture:
 * - broll: AI-generated video/image with LivingFrame treatment
 * - diagram: Motion graphic (Manim/Remotion animated diagrams)
 * - title: End cards, chapter breaks
 * - montage: Rapid-cut sequence (multiple shots)
 */

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
  // Runtime paths (populated by pipeline before render)
  videoPath?: string;
  imagePath?: string;
  narrationPath?: string;
  musicPath?: string;
  sfxPaths?: string[];
}

interface SceneRendererProps {
  scene: SceneData;
  fps: number;
  /** J-cut: start audio N frames before visual */
  jCutFrames?: number;
  /** L-cut: extend audio N frames after visual ends */
  lCutFrames?: number;
  designTokens: any;
}

// Beat → visual treatment mapping
const BEAT_STYLES: Record<string, { grainIntensity: number; vignette: number; colorShift: boolean }> = {
  hook:    { grainIntensity: 0.02, vignette: 0.25, colorShift: false },
  setup:   { grainIntensity: 0.03, vignette: 0.30, colorShift: true },
  core:    { grainIntensity: 0.02, vignette: 0.20, colorShift: false },
  breathe: { grainIntensity: 0.04, vignette: 0.35, colorShift: true },
  deepen:  { grainIntensity: 0.03, vignette: 0.25, colorShift: true },
  peak:    { grainIntensity: 0.02, vignette: 0.15, colorShift: false },
  close:   { grainIntensity: 0.04, vignette: 0.40, colorShift: true },
};

export const SceneRenderer: React.FC<SceneRendererProps> = ({
  scene,
  fps,
  jCutFrames = 0,
  lCutFrames = 0,
  designTokens,
}) => {
  const frame = useCurrentFrame();
  const durationFrames = Math.round(scene.duration_s * fps);
  const beatStyle = BEAT_STYLES[scene.beat] || BEAT_STYLES.core;

  // Fade in (first 15 frames) and fade out (last 10 frames) for smooth cuts
  const opacity = interpolate(
    frame,
    [0, 8, durationFrames - 6, durationFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  if (scene.type === "broll") {
    return (
      <AbsoluteFill style={{ opacity }}>
        {/* Visual layer */}
        {scene.videoPath ? (
          <LivingFrame
            src={scene.videoPath}
            type="video"
            grainIntensity={beatStyle.grainIntensity}
            vignette={beatStyle.vignette}
            colorShift={beatStyle.colorShift}
            letterbox={true}
          />
        ) : scene.imagePath ? (
          <LivingFrame
            src={scene.imagePath}
            type="image"
            grainIntensity={beatStyle.grainIntensity}
            vignette={beatStyle.vignette}
            colorShift={beatStyle.colorShift}
            letterbox={true}
          />
        ) : (
          /* Placeholder — dark gradient with scene ID for pre-production preview */
          <AbsoluteFill style={{
            background: `linear-gradient(135deg, ${designTokens?.colors?.void || '#08080D'} 0%, #1a0a2e 100%)`,
            justifyContent: "center",
            alignItems: "center",
          }}>
            <div style={{
              color: designTokens?.colors?.smoke || '#6B6B73',
              fontSize: 24,
              fontFamily: "General Sans, Inter, system-ui",
              textAlign: "center",
            }}>
              <div style={{ fontSize: 14, opacity: 0.5, marginBottom: 8 }}>{scene.beat.toUpperCase()}</div>
              <div>{scene.id}</div>
              <div style={{ fontSize: 16, opacity: 0.4, marginTop: 12, maxWidth: 600, lineHeight: 1.4 }}>
                {scene.dialogue}
              </div>
            </div>
          </AbsoluteFill>
        )}

        {/* Text overlay (kinetic typography) */}
        {scene.text_overlay && (
          <AbsoluteFill style={{
            justifyContent: "flex-end",
            alignItems: "center",
            paddingBottom: 180,
          }}>
            <KineticText
              words={scene.text_overlay.text.split(/\s*→\s*/)}
              fontSize={42}
              color={designTokens?.colors?.chalk || '#EDE9E3'}
              staggerFrames={Math.round(fps * 0.4)}
            />
          </AbsoluteFill>
        )}

        {/* Narration audio (with J-cut offset handled by parent Sequence) */}
        {scene.narrationPath && (
          <Audio src={scene.narrationPath} volume={1} />
        )}
      </AbsoluteFill>
    );
  }

  if (scene.type === "diagram") {
    return (
      <AbsoluteFill style={{
        opacity,
        background: designTokens?.colors?.void || '#08080D',
        justifyContent: "center",
        alignItems: "center",
      }}>
        {/* Diagram scenes use pre-rendered motion graphic video from Manim/Remotion */}
        {scene.videoPath ? (
          <Video src={scene.videoPath} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        ) : (
          /* Placeholder with diagram description */
          <div style={{
            color: designTokens?.colors?.process || '#7EB8DA',
            fontSize: 20,
            fontFamily: "JetBrains Mono, monospace",
            textAlign: "center",
            maxWidth: 800,
            lineHeight: 1.6,
            padding: 40,
            border: `1px solid ${designTokens?.colors?.ash || '#2A2A32'}`,
            borderRadius: 8,
          }}>
            <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 12 }}>DIAGRAM — {scene.id}</div>
            {scene.motion_graphic || scene.visual || "Motion graphic placeholder"}
          </div>
        )}

        {scene.narrationPath && <Audio src={scene.narrationPath} volume={1} />}
      </AbsoluteFill>
    );
  }

  if (scene.type === "title") {
    const enterProgress = spring({
      frame,
      fps,
      config: { damping: 14, stiffness: 100, mass: 1 },
    });

    return (
      <AbsoluteFill style={{
        opacity,
        background: `linear-gradient(180deg, ${designTokens?.colors?.void || '#08080D'} 0%, #0a0a1a 100%)`,
        justifyContent: "center",
        alignItems: "center",
      }}>
        <div style={{
          transform: `translateY(${interpolate(enterProgress, [0, 1], [30, 0])}px)`,
          opacity: enterProgress,
          textAlign: "center",
        }}>
          {scene.dialogue && (
            <div style={{
              color: designTokens?.colors?.chalk || '#EDE9E3',
              fontSize: 36,
              fontFamily: "General Sans, Inter, system-ui",
              fontWeight: 300,
              letterSpacing: -0.5,
              marginBottom: 16,
            }}>
              {scene.dialogue}
            </div>
          )}
          {scene.motion_graphic && (
            <div style={{
              color: designTokens?.colors?.smoke || '#6B6B73',
              fontSize: 18,
              fontFamily: "General Sans, Inter, system-ui",
            }}>
              {/* Motion graphic description — replaced with actual component at render time */}
            </div>
          )}
        </div>
      </AbsoluteFill>
    );
  }

  // Fallback
  return (
    <AbsoluteFill style={{ background: "#000", opacity }}>
      <div style={{ color: "#fff", fontSize: 16, padding: 40 }}>
        Unknown scene type: {scene.type} ({scene.id})
      </div>
    </AbsoluteFill>
  );
};
