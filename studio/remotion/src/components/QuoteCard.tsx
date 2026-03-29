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
 * QuoteCard — Cinematic quote display for breathe/quote beats
 *
 * Visual Bible aesthetic:
 * - Cormorant Garamond italic for the quote (whisper > shout)
 * - Cosmic gradient background (void → deep purple)
 * - Ghostly quotation mark at 200pt, nearly invisible
 * - Gold accent line pulses with gentle spring
 * - Attribution in smoke, Inter body
 * - Heavy vignette (0.45) for intimate focus
 * - Film grain always present
 *
 * The McQueen principle: restraint IS the statement.
 */

export interface QuoteCardProps {
  quote?: string;
  attribution?: string;
  beat?: string;
  fps?: number;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({
  quote = "The map is not the territory.",
  attribution,
  beat = "breathe",
  fps = 30,
}) => {
  const frame = useCurrentFrame();
  const accentColor = BEAT_ACCENTS[beat] || COLORS.insight;

  // ─── Animations ────────────────────────────────────
  // Quote mark fades in first (ghostly, background element)
  const markOpacity = interpolate(frame, [0, fps * 0.8], [0, 0.06], {
    extrapolateRight: "clamp",
  });

  // Quote text enters with gentle spring (mass: 1.2 — weighty, considered)
  const quoteEnter = spring({
    frame,
    fps,
    config: SPRING.gentle,
    durationInFrames: fps * 2,
  });

  // Attribution enters with delay
  const attrEnter = spring({
    frame: Math.max(0, frame - Math.round(fps * 0.6)),
    fps,
    config: SPRING.smooth,
    durationInFrames: fps * 1.5,
  });

  // Accent line animates width
  const lineEnter = spring({
    frame: Math.max(0, frame - Math.round(fps * 0.3)),
    fps,
    config: SPRING.confident,
  });

  // Subtle glow pulse on accent line
  const glowPulse = 0.3 + Math.sin((frame / fps) * 1.2) * 0.1;

  // Word-wrap the quote (~55 chars per line)
  const words = quote.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const w of words) {
    const test = (current + " " + w).trim();
    if (test.length > 55 && current) {
      lines.push(current);
      current = w;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);

  return (
    <AbsoluteFill>
      {/* Cosmic gradient background — void → deep purple */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, #0D0221 0%, #1a0a30 40%, #260041 100%)`,
        }}
      />

      {/* Radial glow from accent color — very subtle */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 45%, ${accentColor}08 0%, transparent 60%)`,
        }}
      />

      {/* Ghostly quotation mark — massive, barely there */}
      <div
        style={{
          position: "absolute",
          left: "10%",
          top: "12%",
          fontFamily: FONTS.accent,
          fontSize: 240,
          color: COLORS.chalk,
          opacity: markOpacity,
          lineHeight: 1,
          pointerEvents: "none",
        }}
      >
        {"\u201C"}
      </div>

      {/* Quote text — centered, Cormorant Garamond */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            textAlign: "center",
            maxWidth: 1100,
            padding: "0 120px",
            transform: `translateY(${interpolate(quoteEnter, [0, 1], [30, -10])}px)`,
            opacity: quoteEnter,
          }}
        >
          {/* Quote lines */}
          {lines.map((line, i) => (
            <div
              key={i}
              style={{
                fontFamily: FONTS.accent,
                fontSize: TYPE.title2.size,
                fontWeight: 300,
                fontStyle: "italic",
                letterSpacing: TYPE.title2.tracking,
                lineHeight: 1.5,
                color: COLORS.chalk,
                opacity: 0.92,
                textShadow: `0 0 40px ${accentColor}20`,
              }}
            >
              {line}
            </div>
          ))}

          {/* Accent line — thin, golden, centered */}
          <div
            style={{
              width: interpolate(lineEnter, [0, 1], [0, 80]),
              height: 1.5,
              background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)`,
              margin: "28px auto",
              opacity: glowPulse,
              boxShadow: `0 0 16px ${COLORS.gold}40`,
            }}
          />

          {/* Attribution */}
          {attribution && (
            <div
              style={{
                fontFamily: FONTS.text,
                fontSize: TYPE.callout.size,
                fontWeight: TYPE.callout.weight,
                letterSpacing: TYPE.callout.tracking,
                color: COLORS.smoke,
                opacity: attrEnter * 0.8,
                transform: `translateY(${interpolate(attrEnter, [0, 1], [12, 0])}px)`,
                textShadow: "0 1px 3px rgba(0,0,0,0.3)",
              }}
            >
              {`\u2014 ${attribution}`}
            </div>
          )}
        </div>
      </AbsoluteFill>

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background: vignetteGradient(CINEMA_GRADE.vignette.titleCard),
          pointerEvents: "none",
        }}
      />

      {/* Film grain */}
      <AbsoluteFill
        style={{
          backgroundImage: grainUrl(frame),
          opacity: 0.04,
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      />

      {/* Letterbox bars (2.35:1) */}
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
