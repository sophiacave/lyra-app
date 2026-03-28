/**
 * BreathingGap — Visual pause between sections.
 * Walter Murch: "Editing rhythm is like breathing. Inhale = build. Exhale = process."
 *
 * 0.8-1.5s of dark space with ambient particles.
 * Gives the viewer's brain time to absorb the previous concept.
 */
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { SURFACE_BASE, ACCENT_PURPLE, appleEase } from '../lib/design-tokens.js';
import { AmbientParticles } from './AmbientParticles.jsx';

export function BreathingGap({ intensity = 'normal' }) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Fade in from previous scene
  const fadeIn = interpolate(
    frame,
    [0, Math.min(fps * 0.3, durationInFrames * 0.3)],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  // Fade out to next scene
  const fadeOut = interpolate(
    frame,
    [durationInFrames - fps * 0.3, durationInFrames],
    [1, 0],
    { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
  );

  const opacity = appleEase(fadeIn) * appleEase(fadeOut);

  // Subtle brand accent pulse
  const pulseOpacity = interpolate(
    frame,
    [0, durationInFrames],
    [0, 0.03],
    { extrapolateRight: 'clamp' }
  );

  const particleCount = intensity === 'dramatic' ? 8 : 4;

  return (
    <AbsoluteFill style={{
      backgroundColor: SURFACE_BASE,
      opacity,
    }}>
      {/* Subtle center glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 400,
        height: 400,
        transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${ACCENT_PURPLE}${Math.round(pulseOpacity * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
        filter: 'blur(40px)',
      }} />

      <AmbientParticles count={particleCount} opacity={0.08} speed={0.1} />
    </AbsoluteFill>
  );
}
