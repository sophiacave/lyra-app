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
 * StepByStep — Progressive reveal of numbered steps (1 → 2 → 3)
 *
 * Visual Bible aesthetic:
 * - Large ghostly step numbers (hero weight 300) in accent color
 * - Step text in Outfit — clean, architectural
 * - Each step reveals sequentially with spring animation
 * - Active step glows, previous steps dim (Mayer signaling)
 * - Connecting line between steps grows progressively
 * - Void background, film grain, subtle vignette
 *
 * Research: 3Blue1Brown progressive reveal (0.1-0.3s stagger).
 * Mayer segmenting — break process into digestible steps.
 * Cowan's Law — max 5 steps per frame.
 */

export interface StepByStepProps {
  heading?: string;
  steps?: string[];
  beat?: string;
  activeStep?: number; // -1 = animate all in sequence
  fps?: number;
}

export const StepByStep: React.FC<StepByStepProps> = ({
  heading = "How It Works",
  steps = ["Step one", "Step two", "Step three"],
  beat = "core",
  activeStep = -1,
  fps = 30,
}) => {
  const frame = useCurrentFrame();
  const accentColor = BEAT_ACCENTS[beat] || COLORS.process;
  const stepCount = Math.min(steps.length, 5); // Cowan's Law
  const stepsToRender = steps.slice(0, stepCount);

  // ─── Layout ────────────────────────────────────────
  const startY = heading ? 200 : 150;
  const stepSpacing = Math.min(150, (780 - startY) / stepCount);
  const numberX = 200;
  const textX = 300;
  const lineX = numberX + 24;

  // ─── Animations ────────────────────────────────────
  const headingEnter = spring({
    frame,
    fps,
    config: SPRING.smooth,
    durationInFrames: fps * 1.5,
  });

  const stepDelay = Math.round(fps * 0.6); // 600ms between steps — dramatic pacing

  // Determine which step is "active" based on frame (if auto-animating)
  const autoActiveIndex =
    activeStep >= 0
      ? activeStep
      : Math.min(
          stepCount - 1,
          Math.floor(Math.max(0, frame - fps * 0.8) / stepDelay)
        );

  return (
    <AbsoluteFill>
      {/* Background — void with subtle gradient toward accent */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(135deg, ${COLORS.void} 0%, #0E0C14 60%, ${accentColor}08 100%)`,
        }}
      />

      {/* Heading */}
      {heading && (
        <div
          style={{
            position: "absolute",
            top: 80,
            left: numberX,
            right: 200,
            fontFamily: FONTS.display,
            fontSize: TYPE.title2.size,
            fontWeight: TYPE.title2.weight,
            letterSpacing: TYPE.title2.tracking,
            color: COLORS.chalk,
            opacity: headingEnter,
            transform: `translateY(${interpolate(headingEnter, [0, 1], [15, 0])}px)`,
          }}
        >
          {heading}
        </div>
      )}

      {/* Connecting line between steps */}
      {stepsToRender.map((_, i) => {
        if (i === stepCount - 1) return null; // No line after last step
        const lineEnter = spring({
          frame: Math.max(0, frame - Math.round(fps * 0.8) - i * stepDelay - Math.round(fps * 0.3)),
          fps,
          config: SPRING.smooth,
          durationInFrames: fps,
        });
        return (
          <div
            key={`line-${i}`}
            style={{
              position: "absolute",
              left: lineX,
              top: startY + i * stepSpacing + 44,
              width: 1.5,
              height: (stepSpacing - 48) * lineEnter,
              background: `linear-gradient(180deg, ${accentColor}50, ${accentColor}20)`,
            }}
          />
        );
      })}

      {/* Steps */}
      {stepsToRender.map((step, i) => {
        const stepEnter = spring({
          frame: Math.max(0, frame - Math.round(fps * 0.8) - i * stepDelay),
          fps,
          config: SPRING.confident,
          durationInFrames: fps * 1.2,
        });

        const isActive = i === autoActiveIndex;
        const isPast = i < autoActiveIndex;
        const dimFactor = isPast ? 0.45 : isActive ? 1 : 0.3;

        // Active step glow pulse
        const glowOpacity = isActive ? 0.15 + Math.sin((frame / fps) * 2) * 0.05 : 0;

        return (
          <React.Fragment key={i}>
            {/* Step number — large, ghostly */}
            <div
              style={{
                position: "absolute",
                left: numberX - 20,
                top: startY + i * stepSpacing - 8,
                width: 48,
                textAlign: "center",
                fontFamily: FONTS.display,
                fontSize: TYPE.hero.size * 0.7,
                fontWeight: TYPE.hero.weight,
                color: isActive ? accentColor : COLORS.smoke,
                opacity: stepEnter * dimFactor,
                transform: `translateY(${interpolate(stepEnter, [0, 1], [20, 0])}px)`,
                textShadow: isActive
                  ? `0 0 30px ${accentColor}40`
                  : "none",
                transition: "color 0.3s",
              }}
            >
              {i + 1}
            </div>

            {/* Active step glow circle */}
            {isActive && (
              <div
                style={{
                  position: "absolute",
                  left: numberX - 16,
                  top: startY + i * stepSpacing,
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${accentColor}${Math.round(glowOpacity * 255).toString(16).padStart(2, "0")} 0%, transparent 70%)`,
                  pointerEvents: "none",
                }}
              />
            )}

            {/* Step text */}
            <div
              style={{
                position: "absolute",
                left: textX,
                top: startY + i * stepSpacing,
                right: 200,
                fontFamily: FONTS.text,
                fontSize: isActive ? TYPE.headline.size : TYPE.body.size,
                fontWeight: isActive ? TYPE.headline.weight : TYPE.body.weight,
                letterSpacing: TYPE.body.tracking,
                lineHeight: TYPE.body.leading,
                color: isActive ? COLORS.chalk : COLORS.smoke,
                opacity: stepEnter * dimFactor,
                transform: `translateX(${interpolate(stepEnter, [0, 1], [30, 0])}px)`,
              }}
            >
              {step}
            </div>

            {/* Active step accent underline */}
            {isActive && (
              <div
                style={{
                  position: "absolute",
                  left: textX,
                  top: startY + i * stepSpacing + (isActive ? 38 : 34),
                  width: interpolate(stepEnter, [0, 1], [0, 60]),
                  height: 2,
                  background: `linear-gradient(90deg, ${accentColor}, transparent)`,
                  opacity: stepEnter * 0.6,
                }}
              />
            )}
          </React.Fragment>
        );
      })}

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
