import { AbsoluteFill, useCurrentFrame, interpolate, Audio, Video, Img, Sequence, spring } from "remotion";
import { LivingFrame } from "./LivingFrame";
import { KineticText } from "./KineticText";
import { CinematicTitle3D } from "./CinematicTitle3D";
import { QuoteCard } from "./QuoteCard";
import { SectionHeader } from "./SectionHeader";
import { ExplainerScene } from "./ExplainerScene";
import { LowerThird } from "./LowerThird";
import { COLORS, BEAT_STYLES } from "../cinema-tokens";

/**
 * Scene types from V9 architecture:
 * - broll: AI-generated video/image with LivingFrame treatment
 * - diagram: Motion graphic (Manim/Remotion animated diagrams)
 * - title: End cards, chapter breaks (CinematicTitle3D or QuoteCard)
 * - montage: Rapid-cut sequence (multiple shots)
 *
 * Beat-specific rendering:
 * - breathe + title → QuoteCard (gentle, contemplative)
 * - setup + title → SectionHeader (chapter transition)
 * - diagram (no video) → ExplainerScene (animated key points)
 * - All scenes can overlay LowerThird for presenter identification
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
        background: COLORS.void,
        justifyContent: "center",
        alignItems: "center",
      }}>
        {/* Diagram scenes use pre-rendered motion graphic video from Manim/Remotion */}
        {scene.videoPath ? (
          <Video src={scene.videoPath} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        ) : (
          /* ExplainerScene fallback — animated key points from dialogue */
          <ExplainerScene
            heading={scene.motion_graphic || scene.visual || scene.id}
            points={scene.dialogue
              ? scene.dialogue.split(/[.!?]+/).filter(s => s.trim().length > 5).map(s => s.trim())
              : ["Content loading..."]}
            beat={scene.beat}
            label={scene.id.toUpperCase().replace(/-/g, " ")}
            fps={fps}
          />
        )}

        {scene.narrationPath && <Audio src={scene.narrationPath} volume={1} />}
      </AbsoluteFill>
    );
  }

  if (scene.type === "title") {
    // Beat-specific title rendering:
    // - breathe/close → QuoteCard (contemplative, Cormorant Garamond)
    // - setup with "chapter" in ID → SectionHeader (chapter transition)
    // - everything else → CinematicTitle3D (dramatic 3D scene)
    const isQuote = scene.beat === "breathe" || scene.beat === "close";
    const isSection = scene.beat === "setup" && /chapter|section|part/i.test(scene.id);

    if (isQuote) {
      return (
        <AbsoluteFill style={{ opacity }}>
          <QuoteCard
            quote={scene.dialogue || scene.id}
            attribution={scene.text_overlay?.text}
            beat={scene.beat}
            fps={fps}
          />
          {scene.narrationPath && <Audio src={scene.narrationPath} volume={1} />}
        </AbsoluteFill>
      );
    }

    if (isSection) {
      // Extract chapter number from ID (e.g., "chapter-1" → "Chapter 1")
      const overline = scene.text_overlay?.text || scene.id.replace(/-/g, " ");
      return (
        <AbsoluteFill style={{ opacity }}>
          <SectionHeader
            overline={overline}
            title={scene.dialogue || scene.id}
            beat={scene.beat}
            fps={fps}
          />
          {scene.narrationPath && <Audio src={scene.narrationPath} volume={1} />}
        </AbsoluteFill>
      );
    }

    return (
      <AbsoluteFill style={{ opacity }}>
        <CinematicTitle3D
          title={scene.dialogue || scene.id}
          subtitle={scene.text_overlay?.text}
          beat={scene.beat}
          fps={fps}
        />
        {scene.narrationPath && <Audio src={scene.narrationPath} volume={1} />}
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
