import React from "react";
import { useCurrentFrame, interpolate, spring, AbsoluteFill } from "remotion";
import {
  COLORS,
  FONTS,
  TYPE,
  SPRING,
  BEAT_ACCENTS,
  COLORBLIND_SAFE,
  grainUrl,
  vignetteGradient,
} from "../cinema-tokens";

/**
 * DataViz — Animated bar chart / stat display for data-driven scenes
 *
 * Visual Bible aesthetic:
 * - Colorblind-safe palette (Wong 2011) for bars
 * - Bars grow from zero with spring animation
 * - Values count up with number animation
 * - Minimal axis lines in smoke color
 * - Outfit heading, Inter labels — restrained, clear
 * - Void background, film grain, subtle vignette
 *
 * Research: Cowan's Law — max 7 bars (working memory).
 * Mayer coherence — no gridlines, no chartjunk.
 */

export interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface DataVizProps {
  heading?: string;
  data?: DataPoint[];
  unit?: string;
  beat?: string;
  fps?: number;
}

export const DataViz: React.FC<DataVizProps> = ({
  heading = "Key Metrics",
  data = [
    { label: "Accuracy", value: 92 },
    { label: "Speed", value: 78 },
    { label: "Recall", value: 85 },
  ],
  unit = "%",
  beat = "core",
  fps = 30,
}) => {
  const frame = useCurrentFrame();
  const accentColor = BEAT_ACCENTS[beat] || COLORS.process;
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  // ─── Animations ────────────────────────────────────
  const headingEnter = spring({
    frame,
    fps,
    config: SPRING.smooth,
    durationInFrames: fps * 1.5,
  });

  // Axis line draws in
  const axisEnter = spring({
    frame: Math.max(0, frame - Math.round(fps * 0.3)),
    fps,
    config: SPRING.confident,
  });

  const barDelay = Math.round(fps * 0.12); // ~120ms stagger per bar
  const chartTop = heading ? 180 : 140;
  const chartBottom = 900;
  const chartLeft = 240;
  const chartRight = 1720;
  const chartHeight = chartBottom - chartTop - 60;
  const barAreaWidth = chartRight - chartLeft;
  const barCount = Math.min(data.length, 7); // Cowan's Law
  const barGap = 32;
  const barWidth = Math.min(
    120,
    (barAreaWidth - (barCount - 1) * barGap) / barCount
  );

  return (
    <AbsoluteFill>
      {/* Background — void */}
      <AbsoluteFill style={{ background: COLORS.void }} />

      {/* Subtle accent glow behind chart area */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 60%, ${accentColor}06 0%, transparent 50%)`,
        }}
      />

      {/* Heading */}
      {heading && (
        <div
          style={{
            position: "absolute",
            top: 80,
            left: chartLeft,
            fontFamily: FONTS.display,
            fontSize: TYPE.title3.size,
            fontWeight: TYPE.title3.weight,
            letterSpacing: TYPE.title3.tracking,
            color: COLORS.chalk,
            opacity: headingEnter,
            transform: `translateY(${interpolate(headingEnter, [0, 1], [15, 0])}px)`,
          }}
        >
          {heading}
        </div>
      )}

      {/* Y-axis line */}
      <div
        style={{
          position: "absolute",
          left: chartLeft - 1,
          top: chartTop,
          width: 1,
          height: chartHeight * axisEnter,
          background: `${COLORS.smoke}40`,
        }}
      />

      {/* X-axis line */}
      <div
        style={{
          position: "absolute",
          left: chartLeft,
          top: chartBottom - 60,
          width: (chartRight - chartLeft) * axisEnter,
          height: 1,
          background: `${COLORS.smoke}40`,
        }}
      />

      {/* Bars */}
      {data.slice(0, 7).map((point, i) => {
        const barEnter = spring({
          frame: Math.max(0, frame - Math.round(fps * 0.5) - i * barDelay),
          fps,
          config: SPRING.confident,
          durationInFrames: fps * 1.2,
        });

        const barColor = point.color || COLORBLIND_SAFE[i % COLORBLIND_SAFE.length];
        const barHeight = (point.value / maxValue) * (chartHeight - 80);
        const barX = chartLeft + i * (barWidth + barGap) + (barAreaWidth - barCount * (barWidth + barGap) + barGap) / 2;
        const barY = chartBottom - 60 - barHeight * barEnter;

        // Animated value counter
        const displayValue = Math.round(point.value * barEnter);

        return (
          <React.Fragment key={i}>
            {/* Bar */}
            <div
              style={{
                position: "absolute",
                left: barX,
                top: barY,
                width: barWidth,
                height: barHeight * barEnter,
                background: `linear-gradient(180deg, ${barColor} 0%, ${barColor}B0 100%)`,
                borderRadius: "4px 4px 0 0",
                boxShadow: `0 0 24px ${barColor}20`,
              }}
            />

            {/* Value above bar */}
            <div
              style={{
                position: "absolute",
                left: barX,
                top: barY - 36,
                width: barWidth,
                textAlign: "center",
                fontFamily: FONTS.display,
                fontSize: TYPE.headline.size,
                fontWeight: 600,
                color: COLORS.chalk,
                opacity: barEnter * 0.9,
              }}
            >
              {displayValue}
              <span style={{ fontSize: TYPE.caption.size, opacity: 0.6 }}>{unit}</span>
            </div>

            {/* Label below axis */}
            <div
              style={{
                position: "absolute",
                left: barX - 10,
                top: chartBottom - 48,
                width: barWidth + 20,
                textAlign: "center",
                fontFamily: FONTS.text,
                fontSize: TYPE.caption.size,
                fontWeight: TYPE.caption.weight,
                letterSpacing: TYPE.caption.tracking,
                color: COLORS.smoke,
                opacity: barEnter * 0.8,
              }}
            >
              {point.label}
            </div>
          </React.Fragment>
        );
      })}

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background: vignetteGradient(0.25),
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
