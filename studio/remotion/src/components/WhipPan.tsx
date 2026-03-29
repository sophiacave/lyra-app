import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

interface WhipPanProps {
  direction?: "left" | "right";
  durationFrames?: number;
  children: React.ReactNode;
}

/**
 * Whip Pan Transition — energy bridge between shots
 * 
 * Creates a directional motion blur effect for high-energy transitions.
 * Use instead of crossfades. Hard cuts are default; whip pans are for ENERGY.
 */
export const WhipPan: React.FC<WhipPanProps> = ({
  direction = "left",
  durationFrames = 6,
  children,
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame, [0, durationFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const translateX = direction === "left"
    ? interpolate(progress, [0, 0.5, 1], [0, -1920, 0])
    : interpolate(progress, [0, 0.5, 1], [0, 1920, 0]);

  const blur = interpolate(progress, [0, 0.3, 0.5, 0.7, 1], [0, 20, 40, 20, 0]);

  return (
    <AbsoluteFill
      style={{
        transform: `translateX(${translateX}px)`,
        filter: `blur(${blur}px)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
