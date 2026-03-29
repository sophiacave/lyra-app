import React from "react";
import { useCurrentFrame, interpolate, spring, AbsoluteFill } from "remotion";
import {
  COLORS,
  FONTS,
  TYPE,
  SPRING,
  STAGGER,
  BEAT_ACCENTS,
  GRID,
  CINEMA_GRADE,
  grainUrl,
  vignetteGradient,
} from "../cinema-tokens";

/**
 * ExplainerScene — Teaching content with animated key points
 *
 * The workhorse component for core/setup/deepen beats.
 * Renders a heading + staggered bullet points with spring entrance.
 *
 * Visual Bible V3 rules:
 * - Void background with subtle accent glow
 * - Heading at title3 scale, chalk color
 * - Key points enter one-by-one with stagger (0.08s per item)
 * - Each point has a small accent dot (semantic color from beat)
 * - Content respects GRID.margin.content (200px inset)
 * - No letterbox (full 16:9 for maximum teaching space)
 * - Light vignette (0.35) to keep focus centered
 *
 * Composition: heading at top-third, points build below.
 */

export interface ExplainerSceneProps {
  /** Main heading text */
  heading?: string;
  /** Key points to animate in sequentially */
  points?: string[];
  /** Scene beat for accent coloring */
  beat?: string;
  /** Optional label above heading (e.g., "KEY CONCEPT") */
  label?: string;
  fps?: number;
}

export const ExplainerScene: React.FC<ExplainerSceneProps> = ({
  heading = "How Neural Networks Learn",
  points = [
    "Forward pass: input flows through weighted connections",
    "Loss function: measures how wrong the prediction was",
    "Backpropagation: adjusts weights to reduce error",
    "Iteration: repeat thousands of times until accurate",
  ],
  beat = "core",
  label,
  fps = 30,
}) => {
  const frame = useCurrentFrame();
  const accentColor = BEAT_ACCENTS[beat] || COLORS.process;

  // ─── Heading Animation ─────────────────────────────
  const headingEnter = spring({
    frame,
    fps,
    config: SPRING.confident,
  });

  // ─── Label Animation (if present) ──────────────────
  const labelEnter = spring({
    frame: Math.max(0, frame - 4),
    fps,
    config: SPRING.smooth,
  });

  // ─── Point Stagger ─────────────────────────────────
  // Each point enters with STAGGER.normal delay after previous
  const staggerFrames = Math.round(STAGGER.normal * fps);
  const headingDelayFrames = Math.round(fps * 0.5); // Points start after heading settles

  return (
    <AbsoluteFill>
      {/* Void background */}
      <AbsoluteFill style={{ background: COLORS.void }} />

      {/* Accent glow — subtle radial from top-center */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 25%, ${accentColor}0a 0%, transparent 55%)`,
        }}
      />

      {/* Content area — respects content margins */}
      <div
        style={{
          position: "absolute",
          left: GRID.margin.content,
          right: GRID.margin.content,
          top: GRID.margin.outer,
          bottom: GRID.margin.outer,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {/* Label (optional) */}
        {label && (
          <div
            style={{
              fontFamily: FONTS.text,
              fontSize: TYPE.overline.size,
              fontWeight: TYPE.overline.weight,
              letterSpacing: TYPE.overline.tracking + 1,
              lineHeight: TYPE.overline.leading,
              color: accentColor,
              textTransform: "uppercase",
              opacity: labelEnter * 0.7,
              transform: `translateY(${interpolate(labelEnter, [0, 1], [8, 0])}px)`,
              marginBottom: 16,
            }}
          >
            {label}
          </div>
        )}

        {/* Heading */}
        <div
          style={{
            fontFamily: FONTS.display,
            fontSize: TYPE.title3.size,
            fontWeight: TYPE.title3.weight,
            letterSpacing: TYPE.title3.tracking,
            lineHeight: TYPE.title3.leading,
            color: COLORS.chalk,
            opacity: headingEnter,
            transform: `translateY(${interpolate(headingEnter, [0, 1], [16, 0])}px)`,
            marginBottom: 48,
          }}
        >
          {heading}
        </div>

        {/* Key points — staggered entrance */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {points.map((point, i) => {
            const pointFrame = Math.max(
              0,
              frame - headingDelayFrames - i * staggerFrames
            );
            const pointEnter = spring({
              frame: pointFrame,
              fps,
              config: SPRING.confident,
            });

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 20,
                  opacity: pointEnter,
                  transform: `translateX(${interpolate(pointEnter, [0, 1], [24, 0])}px)`,
                }}
              >
                {/* Accent dot */}
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: accentColor,
                    marginTop: 10,
                    flexShrink: 0,
                    boxShadow: `0 0 8px ${accentColor}40`,
                    opacity: 0.8,
                  }}
                />

                {/* Point text */}
                <div
                  style={{
                    fontFamily: FONTS.text,
                    fontSize: TYPE.body.size,
                    fontWeight: TYPE.body.weight,
                    letterSpacing: TYPE.body.tracking,
                    lineHeight: TYPE.body.leading,
                    color: COLORS.bone,
                    maxWidth: 1000,
                  }}
                >
                  {point}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subtle accent line at left edge — structural, McQueen */}
      <div
        style={{
          position: "absolute",
          left: GRID.margin.content - 40,
          top: GRID.margin.outer + 10,
          width: 2,
          height: interpolate(headingEnter, [0, 1], [0, 200]),
          background: `linear-gradient(180deg, ${accentColor}60, transparent)`,
        }}
      />

      {/* Vignette — lighter for teaching content */}
      <AbsoluteFill
        style={{
          background: vignetteGradient(CINEMA_GRADE.vignette.diagram),
          pointerEvents: "none",
        }}
      />

      {/* Film grain — subtle */}
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
