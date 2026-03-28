/**
 * SceneTransition — Crossfade + optional slide between scenes.
 * Apple never hard-cuts. Scenes breathe into each other.
 *
 * Wrap each scene's content in this component.
 * It handles fade-in at the start and fade-out at the end of the Sequence.
 */
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { appleEase } from '../lib/design-tokens.js';

export function SceneTransition({
  children,
  fadeInDuration = 0.5,   // seconds
  fadeOutDuration = 0.4,  // seconds
  slideDirection = null,  // 'up' | 'down' | 'left' | 'right' | null
  slideDistance = 40,
  scaleIn = false,
  kenBurns = true,        // Subtle 2-3% zoom drift — prevents static frames (4s ceiling rule)
  kenBurnsScale = 1.03,   // End scale (Kurzgesagt: 2-5% drift over scene duration)
  kenBurnsDriftX = -8,    // Subtle horizontal pan in pixels
}) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const fadeInFrames = fadeInDuration * fps;
  const fadeOutFrames = fadeOutDuration * fps;

  // Fade in
  const fadeInProgress = interpolate(
    frame,
    [0, fadeInFrames],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Fade out
  const fadeOutProgress = interpolate(
    frame,
    [durationInFrames - fadeOutFrames, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const opacity = appleEase(fadeInProgress) * appleEase(fadeOutProgress);

  // Slide
  let transform = '';
  if (slideDirection) {
    const slideProgress = appleEase(fadeInProgress);
    const offset = interpolate(slideProgress, [0, 1], [slideDistance, 0]);
    switch (slideDirection) {
      case 'up':    transform = `translateY(${offset}px)`; break;
      case 'down':  transform = `translateY(${-offset}px)`; break;
      case 'left':  transform = `translateX(${offset}px)`; break;
      case 'right': transform = `translateX(${-offset}px)`; break;
    }
  }

  // Scale (explicit scaleIn for entry animation)
  if (scaleIn) {
    const scaleProgress = appleEase(fadeInProgress);
    const scale = interpolate(scaleProgress, [0, 1], [0.96, 1]);
    transform += ` scale(${scale})`;
  }

  // Ken Burns — subtle zoom drift over full scene duration.
  // Prevents any frame from being truly static (4-second hard ceiling rule).
  // Inner wrapper so it doesn't conflict with entry animations.
  let kenBurnsTransform = undefined;
  if (kenBurns && !scaleIn) {
    const kbProgress = interpolate(frame, [0, durationInFrames], [0, 1], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });
    const kbScale = interpolate(kbProgress, [0, 1], [1.0, kenBurnsScale]);
    const kbX = interpolate(kbProgress, [0, 1], [0, kenBurnsDriftX]);
    kenBurnsTransform = `scale(${kbScale}) translateX(${kbX}px)`;
  }

  return (
    <AbsoluteFill style={{ opacity, transform: transform || undefined }}>
      {kenBurnsTransform ? (
        <AbsoluteFill style={{ transform: kenBurnsTransform, transformOrigin: 'center center' }}>
          {children}
        </AbsoluteFill>
      ) : children}
    </AbsoluteFill>
  );
}
