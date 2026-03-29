import React from "react";
import { useCurrentFrame, interpolate, spring, AbsoluteFill } from "remotion";
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
 * ComparisonSplit — Side-by-side comparison for before/after, pros/cons, X vs Y
 *
 * Visual Bible aesthetic:
 * - Clean vertical divider with accent glow
 * - Left panel slides in from left, right from right
 * - Labels in overline caps above each panel
 * - Outfit headings, Inter body — restrained, clear
 * - Void background with subtle gradient per side
 * - Film grain + vignette for cinema feel
 *
 * Research: Cowan's Law — max 4 items per side (working memory).
 * Mayer spatial contiguity — related items adjacent.
 */

export interface ComparisonSplitProps {
  leftLabel?: string;
  rightLabel?: string;
  leftItems?: string[];
  rightItems?: string[];
  heading?: string;
  beat?: string;
  leftAccent?: string;
  rightAccent?: string;
  fps?: number;
}

export const ComparisonSplit: React.FC<ComparisonSplitProps> = ({
  leftLabel = "Before",
  rightLabel = "After",
  leftItems = ["Item 1", "Item 2"],
  rightItems = ["Item 1", "Item 2"],
  heading,
  beat = "core",
  leftAccent,
  rightAccent,
  fps = 30,
}) => {
  const frame = useCurrentFrame();
  const accentColor = BEAT_ACCENTS[beat] || COLORS.process;
  const leftColor = leftAccent || COLORS.alert;
  const rightColor = rightAccent || COLORS.result;

  // ─── Animations ────────────────────────────────────
  // Heading drops in first
  const headingEnter = spring({
    frame,
    fps,
    config: SPRING.smooth,
    durationInFrames: fps * 1.5,
  });

  // Divider line grows from center
  const dividerEnter = spring({
    frame: Math.max(0, frame - Math.round(fps * 0.3)),
    fps,
    config: SPRING.confident,
  });

  // Left panel slides in
  const leftEnter = spring({
    frame: Math.max(0, frame - Math.round(fps * 0.5)),
    fps,
    config: SPRING.confident,
    durationInFrames: fps * 1.5,
  });

  // Right panel slides in with slight delay
  const rightEnter = spring({
    frame: Math.max(0, frame - Math.round(fps * 0.7)),
    fps,
    config: SPRING.confident,
    durationInFrames: fps * 1.5,
  });

  // Stagger items within each panel
  const itemDelay = Math.round(fps * 0.15); // ~150ms per item

  return (
    <AbsoluteFill>
      {/* Background — void with subtle split gradient */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(90deg, ${COLORS.void} 0%, #0F0D15 48%, #0F0D15 52%, ${COLORS.void} 100%)`,
        }}
      />

      {/* Heading (optional) */}
      {heading && (
        <div
          style={{
            position: "absolute",
            top: 80,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: FONTS.display,
            fontSize: TYPE.title3.size,
            fontWeight: TYPE.title3.weight,
            letterSpacing: TYPE.title3.tracking,
            color: COLORS.chalk,
            opacity: headingEnter,
            transform: `translateY(${interpolate(headingEnter, [0, 1], [20, 0])}px)`,
          }}
        >
          {heading}
        </div>
      )}

      {/* Center divider line */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: heading ? 160 : 120,
          bottom: 120,
          width: 1.5,
          background: `linear-gradient(180deg, transparent, ${accentColor}80, ${accentColor}, ${accentColor}80, transparent)`,
          transform: `scaleY(${dividerEnter})`,
          transformOrigin: "top center",
          boxShadow: `0 0 20px ${accentColor}30`,
        }}
      />

      {/* Left panel */}
      <div
        style={{
          position: "absolute",
          left: 120,
          top: heading ? 180 : 140,
          width: "calc(50% - 180px)",
          opacity: leftEnter,
          transform: `translateX(${interpolate(leftEnter, [0, 1], [-40, 0])}px)`,
        }}
      >
        {/* Left label */}
        <div
          style={{
            fontFamily: FONTS.text,
            fontSize: TYPE.overline.size,
            fontWeight: TYPE.overline.weight,
            letterSpacing: TYPE.overline.tracking,
            textTransform: "uppercase",
            color: leftColor,
            marginBottom: 28,
            opacity: 0.9,
          }}
        >
          {leftLabel}
        </div>

        {/* Left items */}
        {leftItems.slice(0, 4).map((item, i) => {
          const itemEnter = spring({
            frame: Math.max(0, frame - Math.round(fps * 0.6) - i * itemDelay),
            fps,
            config: SPRING.smooth,
            durationInFrames: fps,
          });
          return (
            <div
              key={i}
              style={{
                fontFamily: FONTS.text,
                fontSize: TYPE.body.size,
                fontWeight: TYPE.body.weight,
                letterSpacing: TYPE.body.tracking,
                lineHeight: TYPE.body.leading,
                color: COLORS.chalk,
                opacity: itemEnter * 0.88,
                transform: `translateX(${interpolate(itemEnter, [0, 1], [-20, 0])}px)`,
                marginBottom: 20,
                paddingLeft: 16,
                borderLeft: `2px solid ${leftColor}40`,
              }}
            >
              {item}
            </div>
          );
        })}
      </div>

      {/* Right panel */}
      <div
        style={{
          position: "absolute",
          right: 120,
          top: heading ? 180 : 140,
          width: "calc(50% - 180px)",
          opacity: rightEnter,
          transform: `translateX(${interpolate(rightEnter, [0, 1], [40, 0])}px)`,
        }}
      >
        {/* Right label */}
        <div
          style={{
            fontFamily: FONTS.text,
            fontSize: TYPE.overline.size,
            fontWeight: TYPE.overline.weight,
            letterSpacing: TYPE.overline.tracking,
            textTransform: "uppercase",
            color: rightColor,
            marginBottom: 28,
            opacity: 0.9,
          }}
        >
          {rightLabel}
        </div>

        {/* Right items */}
        {rightItems.slice(0, 4).map((item, i) => {
          const itemEnter = spring({
            frame: Math.max(0, frame - Math.round(fps * 0.8) - i * itemDelay),
            fps,
            config: SPRING.smooth,
            durationInFrames: fps,
          });
          return (
            <div
              key={i}
              style={{
                fontFamily: FONTS.text,
                fontSize: TYPE.body.size,
                fontWeight: TYPE.body.weight,
                letterSpacing: TYPE.body.tracking,
                lineHeight: TYPE.body.leading,
                color: COLORS.chalk,
                opacity: itemEnter * 0.88,
                transform: `translateX(${interpolate(itemEnter, [0, 1], [20, 0])}px)`,
                marginBottom: 20,
                paddingLeft: 16,
                borderLeft: `2px solid ${rightColor}40`,
              }}
            >
              {item}
            </div>
          );
        })}
      </div>

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background: vignetteGradient(0.30),
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
    </AbsoluteFill>
  );
};
