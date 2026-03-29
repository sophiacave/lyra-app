import React from "react";
import { useCurrentFrame, interpolate, spring, AbsoluteFill, Img, Video } from "remotion";
import {
  COLORS,
  FONTS,
  TYPE,
  SPRING,
  BEAT_ACCENTS,
  grainUrl,
  vignetteGradient,
} from "../cinema-tokens";

/**
 * MontageScene — Rapid-cut sequence of multiple shots
 *
 * Used for "montage" scene type: high-energy, multiple visual beats
 * within a single scene. Each shot gets a portion of the total duration
 * with hard-cut transitions between them.
 *
 * Visual pattern:
 * - Rapid cuts between provided media (images/video stills)
 * - Beat-accent color flash between cuts (2 frames)
 * - Subtle Ken Burns drift on each shot
 * - Optional kinetic text overlay pulsing with each cut
 * - Film grain + vignette for cinema feel
 *
 * If no media provided, renders animated gradient panels with dialogue fragments
 */

export interface MontageShot {
  src?: string;
  type?: "image" | "video";
  label?: string;
}

export interface MontageSceneProps {
  /** Array of shots to cycle through */
  shots?: MontageShot[];
  /** Dialogue fragments to display as kinetic text */
  fragments?: string[];
  /** Scene beat for accent coloring */
  beat?: string;
  fps?: number;
  /** Total duration in seconds (used to calculate per-shot timing) */
  durationS?: number;
}

export const MontageScene: React.FC<MontageSceneProps> = ({
  shots,
  fragments,
  beat = "core",
  fps = 30,
  durationS = 8,
}) => {
  const frame = useCurrentFrame();
  const accentColor = BEAT_ACCENTS[beat] || COLORS.process;
  const totalFrames = Math.round(durationS * fps);

  // Build display items from shots or fragments
  const items: { label: string; src?: string; type?: string }[] = [];
  if (shots && shots.length > 0) {
    for (const s of shots) {
      items.push({ label: s.label || "", src: s.src, type: s.type });
    }
  } else if (fragments && fragments.length > 0) {
    for (const f of fragments) {
      items.push({ label: f });
    }
  } else {
    // Fallback: 4 abstract panels
    items.push({ label: "..." }, { label: "..." }, { label: "..." }, { label: "..." });
  }

  const count = items.length;
  const framesPerShot = Math.floor(totalFrames / Math.max(count, 1));
  const currentIndex = Math.min(Math.floor(frame / Math.max(framesPerShot, 1)), count - 1);
  const frameInShot = frame - currentIndex * framesPerShot;
  const item = items[currentIndex];

  // Ken Burns drift per shot (alternate direction)
  const driftX = interpolate(frameInShot, [0, framesPerShot], [0, currentIndex % 2 === 0 ? 15 : -15], {
    extrapolateRight: "clamp",
  });
  const driftScale = interpolate(frameInShot, [0, framesPerShot], [1.03, 1.06], {
    extrapolateRight: "clamp",
  });

  // Cut flash — 2-frame accent color flash at the start of each shot
  const isFlash = frameInShot < 2 && currentIndex > 0;

  // Shot entrance (fast fade-in over 3 frames)
  const shotOpacity = interpolate(frameInShot, [0, 3], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Overall scene fade in/out
  const sceneOpacity = interpolate(
    frame,
    [0, 8, totalFrames - 6, totalFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Text label spring (per shot)
  const labelEnter = spring({
    frame: Math.max(0, frameInShot - 4),
    fps,
    config: SPRING.confident,
  });

  // Progress indicator
  const progress = (currentIndex + 1) / count;

  // Gradient backgrounds for shots without media
  const gradientAngles = [135, 180, 225, 160, 200, 145];
  const gradientAngle = gradientAngles[currentIndex % gradientAngles.length];

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity }}>
      {/* Cut flash overlay */}
      {isFlash && (
        <AbsoluteFill
          style={{
            background: accentColor,
            opacity: 0.3,
            zIndex: 10,
          }}
        />
      )}

      {/* Current shot */}
      <AbsoluteFill style={{ opacity: shotOpacity }}>
        {item.src && item.type === "video" ? (
          <AbsoluteFill
            style={{
              transform: `scale(${driftScale}) translateX(${driftX}px)`,
            }}
          >
            <Video
              src={item.src}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </AbsoluteFill>
        ) : item.src ? (
          <AbsoluteFill
            style={{
              transform: `scale(${driftScale}) translateX(${driftX}px)`,
            }}
          >
            <Img
              src={item.src}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </AbsoluteFill>
        ) : (
          /* Abstract gradient panel */
          <AbsoluteFill
            style={{
              background: `linear-gradient(${gradientAngle}deg, ${COLORS.void} 0%, ${accentColor}15 50%, ${COLORS.obsidian} 100%)`,
              transform: `scale(${driftScale})`,
            }}
          />
        )}
      </AbsoluteFill>

      {/* Label overlay */}
      {item.label && item.label !== "..." && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              fontFamily: FONTS.display,
              fontSize: TYPE.headline.size,
              fontWeight: TYPE.headline.weight,
              letterSpacing: TYPE.headline.tracking,
              color: COLORS.chalk,
              opacity: labelEnter * 0.9,
              transform: `translateY(${interpolate(labelEnter, [0, 1], [20, 0])}px)`,
              textShadow: `0 2px 20px ${COLORS.void}CC`,
              textAlign: "center",
              maxWidth: 800,
              padding: "0 120px",
            }}
          >
            {item.label}
          </div>
        </AbsoluteFill>
      )}

      {/* Progress bar (thin line at bottom, above subtitle zone) */}
      <div
        style={{
          position: "absolute",
          bottom: 140,
          left: 120,
          right: 120,
          height: 2,
          background: `${COLORS.ash}60`,
          borderRadius: 1,
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: "100%",
            background: `${accentColor}AA`,
            borderRadius: 1,
            transition: "width 0.1s",
          }}
        />
      </div>

      {/* Shot counter */}
      <div
        style={{
          position: "absolute",
          top: 60,
          right: 80,
          fontFamily: FONTS.mono,
          fontSize: TYPE.caption.size,
          fontWeight: TYPE.caption.weight,
          color: `${COLORS.smoke}80`,
          letterSpacing: 2,
        }}
      >
        {String(currentIndex + 1).padStart(2, "0")}/{String(count).padStart(2, "0")}
      </div>

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background: vignetteGradient(0.35),
          pointerEvents: "none",
        }}
      />

      {/* Film grain */}
      <AbsoluteFill
        style={{
          backgroundImage: grainUrl(frame),
          opacity: 0.025,
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
