import React from "react";
import { useCurrentFrame, interpolate, spring, AbsoluteFill } from "remotion";
import {
  COLORS,
  FONTS,
  TYPE,
  SPRING,
  GRID,
  BEAT_ACCENTS,
} from "../cinema-tokens";

/**
 * LowerThird — Animated name/label overlay (transparent background)
 *
 * Netflix-style minimal lower third:
 * - Transparent bg — composites over b-roll or presenter footage
 * - Name in bone/chalk at headline weight
 * - Optional role/label in smoke at caption
 * - Thin accent underline expands from left
 * - Positioned at bottom-left, title-safe zone
 * - No vignette, no grain (those come from the underlying scene)
 *
 * Entrance: slide from left + fade. Exit: slide left + fade out.
 */

export interface LowerThirdProps {
  /** Primary name or label */
  name?: string;
  /** Secondary role/title line */
  role?: string;
  /** Scene beat for accent line color */
  beat?: string;
  /** Total duration in frames */
  durationFrames?: number;
  fps?: number;
}

export const LowerThird: React.FC<LowerThirdProps> = ({
  name = "Dr. Faye Mitchell",
  role,
  beat = "setup",
  durationFrames = 90,
  fps = 30,
}) => {
  const frame = useCurrentFrame();
  const accentColor = BEAT_ACCENTS[beat] || COLORS.process;

  // ─── Entrance (first 0.5s) ─────────────────────────
  const enterProgress = spring({
    frame,
    fps,
    config: SPRING.confident,
  });

  // ─── Exit (last 0.4s) ─────────────────────────────
  const exitStart = durationFrames - Math.round(fps * 0.4);
  const exitProgress =
    frame >= exitStart
      ? interpolate(frame, [exitStart, durationFrames], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

  const combinedOpacity = enterProgress * exitProgress;
  const slideX = interpolate(enterProgress, [0, 1], [-40, 0]);
  const exitSlideX = frame >= exitStart ? interpolate(exitProgress, [1, 0], [0, -20]) : 0;

  // Underline expands after text enters
  const lineEnter = spring({
    frame: Math.max(0, frame - 6),
    fps,
    config: SPRING.smooth,
  });

  // Role text enters slightly after name
  const roleEnter = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: SPRING.confident,
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: GRID.margin.outer,
          bottom: 160,
          opacity: combinedOpacity,
          transform: `translateX(${slideX + exitSlideX}px)`,
        }}
      >
        {/* Name */}
        <div
          style={{
            fontFamily: FONTS.text,
            fontSize: TYPE.headline.size,
            fontWeight: TYPE.headline.weight,
            letterSpacing: TYPE.headline.tracking,
            lineHeight: TYPE.headline.leading,
            color: COLORS.bone,
            textShadow: "0 2px 8px rgba(0,0,0,0.5), 0 0 20px rgba(0,0,0,0.3)",
          }}
        >
          {name}
        </div>

        {/* Accent underline — expands from left */}
        <div
          style={{
            width: interpolate(lineEnter * exitProgress, [0, 1], [0, Math.min(name.length * 12, 300)]),
            height: 2,
            background: `linear-gradient(90deg, ${accentColor}, ${accentColor}40)`,
            marginTop: 8,
            marginBottom: role ? 10 : 0,
            boxShadow: `0 0 6px ${accentColor}30`,
          }}
        />

        {/* Role (optional) */}
        {role && (
          <div
            style={{
              fontFamily: FONTS.text,
              fontSize: TYPE.caption.size,
              fontWeight: TYPE.caption.weight,
              letterSpacing: TYPE.caption.tracking + 0.5,
              lineHeight: TYPE.caption.leading,
              color: COLORS.smoke,
              opacity: roleEnter * exitProgress * 0.75,
              textShadow: "0 1px 4px rgba(0,0,0,0.4)",
            }}
          >
            {role}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
