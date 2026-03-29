import { AbsoluteFill, useCurrentFrame, interpolate, Video, Img } from "remotion";

interface LivingFrameProps {
  /** Main content — video or image path */
  src: string;
  type: "video" | "image";
  /** Enable camera micro-float (subtle organic drift) */
  microFloat?: boolean;
  /** Film grain intensity (0-1) */
  grainIntensity?: number;
  /** Subtle color temperature shift over time */
  colorShift?: boolean;
  /** Letterbox to 2.35:1 cinematic aspect */
  letterbox?: boolean;
  /** Vignette intensity (0-1) */
  vignette?: number;
  children?: React.ReactNode;
}

/**
 * Living Frame — makes every frame feel alive
 * 
 * Applies the "camera never stops" philosophy:
 * - Micro-float: subtle sinusoidal drift (2-5px), different frequencies for X/Y
 * - Film grain: CSS noise overlay that changes per frame
 * - Color temperature micro-shift: barely perceptible warm/cool oscillation
 * - Letterbox: 2.35:1 cinematic crop
 * - Vignette: subtle edge darkening
 * 
 * These are the hair-thin details that separate cinema from PowerPoint.
 */
export const LivingFrame: React.FC<LivingFrameProps> = ({
  src,
  type,
  microFloat = true,
  grainIntensity = 0.03,
  colorShift = true,
  letterbox = true,
  vignette = 0.3,
  children,
}) => {
  const frame = useCurrentFrame();
  const t = frame / 30; // time in seconds

  // Micro-float: different frequencies for X and Y create organic, non-repeating drift
  const floatX = microFloat ? Math.sin(t * 0.8) * 3 + Math.sin(t * 1.3) * 1.5 : 0;
  const floatY = microFloat ? Math.sin(t * 0.6 + 1.2) * 2 + Math.sin(t * 1.1 + 0.7) * 1 : 0;

  // Imperceptible zoom: 0.5% over entire duration (subliminal, NOT Ken Burns)
  const microZoom = 1 + (frame / 5400) * 0.005;

  // Color temperature micro-shift
  const warmShift = colorShift ? Math.sin(t * 0.15) * 0.01 : 0;

  // Letterbox bars (2.35:1 from 16:9 = ~12.8% top and bottom)
  const letterboxHeight = letterbox ? "12.8%" : "0%";

  return (
    <AbsoluteFill>
      {/* Main content with micro-float and zoom */}
      <div
        style={{
          position: "absolute",
          inset: -10, // slight overscan to allow float without revealing edges
          transform: `translate(${floatX}px, ${floatY}px) scale(${microZoom})`,
          filter: colorShift
            ? `sepia(${warmShift}) saturate(${1 + warmShift * 2})`
            : undefined,
        }}
      >
        {type === "video" ? (
          <Video src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        )}
      </div>

      {/* Overlay children (motion graphics, text, particles) */}
      {children}

      {/* Film grain overlay — noise that changes per frame */}
      {grainIntensity > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' seed='${frame}' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            opacity: grainIntensity,
            mixBlendMode: "overlay",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Vignette */}
      {vignette > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,${vignette}) 100%)`,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Letterbox bars */}
      {letterbox && (
        <>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: letterboxHeight, background: "#000" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: letterboxHeight, background: "#000" }} />
        </>
      )}
    </AbsoluteFill>
  );
};
