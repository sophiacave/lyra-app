import React from "react";
import { useCurrentFrame, interpolate, spring, AbsoluteFill } from "remotion";
import {
  COLORS,
  FONTS,
  TYPE,
  SPRING,
  BEAT_ACCENTS,
  PRESETS,
  grainUrl,
  vignetteGradient,
} from "../cinema-tokens";

/**
 * ChapterCard — Numbered chapter transition
 *
 * Distinct from SectionHeader: ChapterCard leads with a large number
 * and uses a different entrance sequence for numbered chapters.
 *
 * Visual pattern:
 * - Large chapter number (overline style, wide tracking, smoke)
 * - Title beneath at title2 scale, chalk
 * - Void background with beat-accent radial glow
 * - Staggered entrance: number → thin line → title
 * - Letterbox bars for cinematic framing
 */

export interface ChapterCardProps {
  /** Chapter number or label (e.g., "01", "Chapter 3") */
  number?: string;
  /** Chapter title */
  title?: string;
  /** Scene beat for accent coloring */
  beat?: string;
  fps?: number;
}

export const ChapterCard: React.FC<ChapterCardProps> = ({
  number = "01",
  title = "Introduction",
  beat = "setup",
  fps = 30,
}) => {
  const frame = useCurrentFrame();
  const accentColor = BEAT_ACCENTS[beat] || COLORS.gold;
  const preset = PRESETS.chapterCard;

  // Number enters first (scale from 0.8 → 1.0, fade in)
  const numberEnter = spring({
    frame,
    fps,
    config: SPRING.smooth,
  });

  // Thin accent line enters second (expand from center)
  const lineEnter = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: SPRING.confident,
  });

  // Title enters last (fade up)
  const titleEnter = spring({
    frame: Math.max(0, frame - 18),
    fps,
    config: SPRING.gentle,
  });

  return (
    <AbsoluteFill>
      {/* Void background */}
      <AbsoluteFill style={{ background: COLORS.void }} />

      {/* Beat-accent radial glow */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 45%, ${accentColor}08 0%, transparent 55%)`,
        }}
      />

      {/* Centered content stack */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        <div style={{ textAlign: "center" }}>
          {/* Chapter number — large, tracked, smoke */}
          <div
            style={{
              fontFamily: FONTS.text,
              fontSize: TYPE.overline.size + 4,
              fontWeight: TYPE.overline.weight,
              letterSpacing: TYPE.overline.tracking + 2,
              lineHeight: TYPE.overline.leading,
              color: COLORS.smoke,
              textTransform: "uppercase",
              opacity: numberEnter * 0.7,
              transform: `scale(${interpolate(numberEnter, [0, 1], [0.85, 1.0])})`,
              marginBottom: 24,
            }}
          >
            {number}
          </div>

          {/* Thin accent line — expands from center */}
          <div
            style={{
              width: interpolate(lineEnter, [0, 1], [0, 120]),
              height: 1.5,
              background: `linear-gradient(90deg, transparent, ${accentColor}AA, transparent)`,
              margin: "0 auto 24px",
              boxShadow: `0 0 8px ${accentColor}20`,
            }}
          />

          {/* Title — title2 scale, chalk */}
          <div
            style={{
              fontFamily: FONTS.display,
              fontSize: TYPE.title2.size,
              fontWeight: TYPE.title2.weight,
              letterSpacing: TYPE.title2.tracking,
              lineHeight: TYPE.title2.leading,
              color: COLORS.chalk,
              opacity: titleEnter * 0.92,
              transform: `translateY(${interpolate(titleEnter, [0, 1], [16, 0])}px)`,
              maxWidth: 900,
              textShadow: `0 0 30px ${accentColor}10`,
            }}
          >
            {title}
          </div>
        </div>
      </AbsoluteFill>

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background: vignetteGradient(preset.vignette),
          pointerEvents: "none",
        }}
      />

      {/* Film grain */}
      <AbsoluteFill
        style={{
          backgroundImage: grainUrl(frame),
          opacity: preset.grain,
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      />

      {/* Letterbox bars */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "12.8%",
          background: "#000",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "12.8%",
          background: "#000",
        }}
      />
    </AbsoluteFill>
  );
};
