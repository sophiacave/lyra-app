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
 * OutroScene — End card with brand + CTA
 *
 * Clean, centered, brand-forward. Like Apple's "shot on iPhone" end cards.
 * Consumes V3 cinema-tokens for full design system compliance.
 *
 * Visual pattern:
 * - Void background with subtle accent glow
 * - Brand mark (like one) fades in first
 * - Thin accent line expands from center
 * - Heading fades up
 * - Subtext/URL fades in last
 * - Optional CTA button with gradient
 * - Letterbox bars for cinematic framing
 * - Film grain + vignette
 */

export interface OutroSceneProps {
  /** Main heading (e.g., "Keep learning.") */
  heading?: string;
  /** Subtext/URL (e.g., "likeone.ai") */
  subtext?: string;
  /** Optional CTA text */
  ctaText?: string;
  /** Scene beat for accent coloring */
  beat?: string;
  fps?: number;
}

export const OutroScene: React.FC<OutroSceneProps> = ({
  heading = "Keep learning.",
  subtext = "likeone.ai",
  ctaText,
  beat = "close",
  fps = 30,
}) => {
  const frame = useCurrentFrame();
  const accentColor = BEAT_ACCENTS[beat] || COLORS.blush;

  // Staggered entrance sequence
  const brandEnter = spring({
    frame,
    fps,
    config: SPRING.gentle,
  });

  const lineEnter = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: SPRING.confident,
  });

  const headingEnter = spring({
    frame: Math.max(0, frame - 14),
    fps,
    config: SPRING.smooth,
  });

  const subtextEnter = spring({
    frame: Math.max(0, frame - 22),
    fps,
    config: SPRING.smooth,
  });

  const ctaEnter = spring({
    frame: Math.max(0, frame - 30),
    fps,
    config: SPRING.smooth,
  });

  return (
    <AbsoluteFill>
      {/* Void background */}
      <AbsoluteFill style={{ background: COLORS.void }} />

      {/* Accent radial glow */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 45%, ${accentColor}0A 0%, transparent 60%)`,
        }}
      />

      {/* Content stack */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
          {/* Brand mark */}
          <div
            style={{
              fontFamily: FONTS.text,
              fontSize: TYPE.title3.size,
              fontWeight: 700,
              letterSpacing: TYPE.title3.tracking,
              color: COLORS.smoke,
              opacity: brandEnter * 0.7,
              transform: `scale(${interpolate(brandEnter, [0, 1], [0.9, 1])})`,
            }}
          >
            like{" "}
            <span style={{ color: COLORS.insight }}>one</span>
          </div>

          {/* Thin accent line — expands from center */}
          <div
            style={{
              width: interpolate(lineEnter, [0, 1], [0, 200]),
              height: 1.5,
              background: `linear-gradient(90deg, transparent, ${accentColor}AA, transparent)`,
              boxShadow: `0 0 12px ${accentColor}20`,
            }}
          />

          {/* Heading */}
          <div
            style={{
              fontFamily: FONTS.display,
              fontSize: TYPE.title1.size,
              fontWeight: TYPE.title1.weight,
              letterSpacing: TYPE.title1.tracking,
              lineHeight: TYPE.title1.leading,
              color: COLORS.chalk,
              opacity: headingEnter * 0.92,
              transform: `translateY(${interpolate(headingEnter, [0, 1], [20, 0])}px)`,
              maxWidth: 900,
            }}
          >
            {heading}
          </div>

          {/* Subtext / URL */}
          <div
            style={{
              fontFamily: FONTS.text,
              fontSize: TYPE.callout.size,
              fontWeight: TYPE.callout.weight,
              letterSpacing: TYPE.callout.tracking,
              color: COLORS.smoke,
              opacity: subtextEnter * 0.6,
              transform: `translateY(${interpolate(subtextEnter, [0, 1], [10, 0])}px)`,
            }}
          >
            {subtext}
          </div>

          {/* CTA button (optional) */}
          {ctaText && (
            <div
              style={{
                marginTop: 16,
                padding: "14px 36px",
                background: `linear-gradient(135deg, ${COLORS.insight}, ${COLORS.process})`,
                borderRadius: 12,
                opacity: ctaEnter,
                transform: `translateY(${interpolate(ctaEnter, [0, 1], [10, 0])}px)`,
              }}
            >
              <span
                style={{
                  fontFamily: FONTS.text,
                  fontSize: TYPE.callout.size,
                  fontWeight: 600,
                  color: COLORS.chalk,
                }}
              >
                {ctaText}
              </span>
            </div>
          )}
        </div>
      </AbsoluteFill>

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background: vignetteGradient(0.45),
          pointerEvents: "none",
        }}
      />

      {/* Film grain */}
      <AbsoluteFill
        style={{
          backgroundImage: grainUrl(frame),
          opacity: 0.035,
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
