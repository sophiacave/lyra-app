import React from "react";
import { useCurrentFrame, interpolate, spring, AbsoluteFill } from "remotion";
import {
  COLORS,
  FONTS,
  TYPE,
  SPRING,
  BEAT_ACCENTS,
  CINEMA_GRADE,
  grainUrl,
  vignetteGradient,
} from "../cinema-tokens";

/**
 * SectionHeader — Chapter/section transition card
 *
 * Visual Bible V3 pattern:
 * - Overline: chapter number in smoke (14pt uppercase, wide tracking)
 * - Title: Outfit display at 56pt, chalk on obsidian
 * - Gold accent line above title (thin, restrained — McQueen)
 * - Obsidian background (not void — subtle elevation)
 * - Staggered entrance: line → overline → title
 * - Vignette at 0.45 for section weight
 *
 * "The McQueen moment: one word, devastating."
 */

export interface SectionHeaderProps {
  /** Chapter/section label (e.g., "Chapter 1", "Part II") */
  overline?: string;
  /** Section title */
  title?: string;
  /** Scene beat for accent coloring */
  beat?: string;
  fps?: number;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  overline = "Chapter 1",
  title = "The Artificial Neuron",
  beat = "setup",
  fps = 30,
}) => {
  const frame = useCurrentFrame();
  const accentColor = BEAT_ACCENTS[beat] || COLORS.gold;

  // ─── Staggered Entrance ────────────────────────────
  // Gold accent line enters first (from center, expands outward)
  const lineEnter = spring({
    frame,
    fps,
    config: SPRING.smooth,
  });

  // Overline enters second (fade up from below)
  const overlineEnter = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: SPRING.confident,
  });

  // Title enters last (fade up, weightier spring)
  const titleEnter = spring({
    frame: Math.max(0, frame - 14),
    fps,
    config: { ...SPRING.dramatic, mass: 1.4, damping: 18 },
  });

  // Subtle ambient pulse on the accent line
  const linePulse = 0.5 + Math.sin((frame / fps) * 1.8) * 0.1;

  return (
    <AbsoluteFill>
      {/* Obsidian background (not void — elevated layer) */}
      <AbsoluteFill style={{ background: COLORS.obsidian }} />

      {/* Subtle radial glow from accent — very faint */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${accentColor}06 0%, transparent 50%)`,
        }}
      />

      {/* Centered content */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        <div style={{ textAlign: "center" }}>
          {/* Gold accent line — thin, restrained, above overline */}
          <div
            style={{
              width: interpolate(lineEnter, [0, 1], [0, Math.min(title.length * 8, 400)]),
              height: 2,
              background: `linear-gradient(90deg, transparent, ${COLORS.gold}${Math.round(linePulse * 255).toString(16).padStart(2, "0")}, transparent)`,
              margin: "0 auto 28px",
              boxShadow: `0 0 12px ${COLORS.gold}30`,
            }}
          />

          {/* Overline — chapter number, uppercase, tracked */}
          <div
            style={{
              fontFamily: FONTS.text,
              fontSize: TYPE.overline.size + 3,
              fontWeight: TYPE.overline.weight,
              letterSpacing: TYPE.overline.tracking + 1,
              lineHeight: TYPE.overline.leading,
              color: COLORS.smoke,
              textTransform: "uppercase",
              opacity: overlineEnter * 0.7,
              transform: `translateY(${interpolate(overlineEnter, [0, 1], [12, 0])}px)`,
              marginBottom: 20,
            }}
          >
            {overline}
          </div>

          {/* Title — display weight, chalk */}
          <div
            style={{
              fontFamily: FONTS.display,
              fontSize: TYPE.title1.size,
              fontWeight: TYPE.title1.weight,
              letterSpacing: TYPE.title1.tracking,
              lineHeight: TYPE.title1.leading,
              color: COLORS.chalk,
              opacity: titleEnter * 0.95,
              transform: `translateY(${interpolate(titleEnter, [0, 1], [20, 0])}px)`,
              maxWidth: 1000,
              textShadow: `0 0 40px ${accentColor}15`,
            }}
          >
            {title}
          </div>
        </div>
      </AbsoluteFill>

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background: vignetteGradient(CINEMA_GRADE.vignette.sectionHeader),
          pointerEvents: "none",
        }}
      />

      {/* Film grain */}
      <AbsoluteFill
        style={{
          backgroundImage: grainUrl(frame),
          opacity: 0.03,
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
