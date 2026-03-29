import { useCurrentFrame, spring, interpolate } from "remotion";

interface KineticTextProps {
  words: string[];
  fontSize?: number;
  color?: string;
  staggerFrames?: number;
  style?: React.CSSProperties;
}

/**
 * Kinetic Typography — words animate in with spring physics
 * 
 * Motion design principles applied:
 * - Staggered entrance (motion hierarchy)
 * - Spring easing (natural deceleration, follow-through)
 * - Translate Y + opacity (spatial meaning: rising = appearing)
 * - Configurable stagger for different energy levels
 */
export const KineticText: React.FC<KineticTextProps> = ({
  words,
  fontSize = 48,
  color = "#ffffff",
  staggerFrames = 4,
  style = {},
}) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: fontSize * 0.25,
        justifyContent: "center",
        ...style,
      }}
    >
      {words.map((word, i) => {
        const enter = spring({
          frame: frame - i * staggerFrames,
          fps: 30,
          config: {
            damping: 12,
            stiffness: 120,
            mass: 0.8,
          },
        });

        const opacity = interpolate(enter, [0, 1], [0, 1]);
        const y = interpolate(enter, [0, 1], [24, 0]);

        return (
          <span
            key={i}
            style={{
              opacity,
              transform: `translateY(${y}px)`,
              fontSize,
              fontWeight: 600,
              color,
              fontFamily: "General Sans, Inter, system-ui, sans-serif",
              letterSpacing: -0.5,
              display: "inline-block",
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
