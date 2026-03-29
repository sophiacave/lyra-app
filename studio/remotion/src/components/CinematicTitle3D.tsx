import React, { useRef, useMemo } from "react";
import { useCurrentFrame, interpolate, spring, AbsoluteFill } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Cinematic Title Card — Three.js depth + atmosphere
 *
 * Replaces flat 2D title cards with a 3D scene featuring:
 * - Slow camera dolly (push forward)
 * - Floating crystalline shapes with design-system colors
 * - Volumetric fog for depth layering
 * - Dramatic multi-point lighting
 * - Bokeh-like particle dust motes
 * - Title text as crisp HTML overlay (reliable across all renderers)
 *
 * Design tokens come from Visual Bible V2 Rothko palette.
 */

// ─── Design Tokens (V2 Rothko Palette) ─────────────────────────
const COLORS = {
  void:     "#0B0A10",
  chalk:    "#F0EBE3",
  smoke:    "#8A8490",
  ash:      "#2D2A33",
  signal:   "#D4956B",
  process:  "#8BAFC4",
  result:   "#8CB89E",
  alert:    "#C4616A",
  insight:  "#B898C8",
  bone:     "#E8DDD0",
  obsidian: "#1A1720",
  blush:    "#D4A0A0",
  gold:     "#C4A86C",
};

// Beat → accent color mapping
const BEAT_ACCENTS: Record<string, string> = {
  hook:    COLORS.signal,
  setup:   COLORS.process,
  core:    COLORS.result,
  breathe: COLORS.insight,
  deepen:  COLORS.process,
  peak:    COLORS.gold,
  close:   COLORS.blush,
};

// ─── Floating Geometry ──────────────────────────────────────────
interface FloatingShapeProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  color: string;
  speed: number;
  shape: "octahedron" | "icosahedron" | "torus";
  opacity: number;
}

const FloatingShape: React.FC<FloatingShapeProps> = ({
  position,
  rotation,
  scale,
  color,
  speed,
  shape,
  opacity,
}) => {
  const frame = useCurrentFrame();
  const meshRef = useRef<THREE.Mesh>(null);
  const t = frame / 30;

  // Organic floating motion
  const floatY = Math.sin(t * speed * 0.5) * 0.3;
  const floatX = Math.sin(t * speed * 0.3 + 1.5) * 0.15;
  const rotY = t * speed * 0.2;
  const rotX = t * speed * 0.15;

  const geometry = useMemo(() => {
    switch (shape) {
      case "octahedron":
        return <octahedronGeometry args={[scale, 0]} />;
      case "icosahedron":
        return <icosahedronGeometry args={[scale, 0]} />;
      case "torus":
        return <torusGeometry args={[scale, scale * 0.3, 8, 24]} />;
    }
  }, [shape, scale]);

  return (
    <mesh
      ref={meshRef}
      position={[
        position[0] + floatX,
        position[1] + floatY,
        position[2],
      ]}
      rotation={[
        rotation[0] + rotX,
        rotation[1] + rotY,
        rotation[2],
      ]}
    >
      {geometry}
      <meshStandardMaterial
        color={color}
        transparent
        opacity={opacity}
        wireframe
        emissive={color}
        emissiveIntensity={0.3}
      />
    </mesh>
  );
};

// ─── Particle Dust Motes ────────────────────────────────────────
const DustParticles: React.FC<{ count: number; color: string }> = ({
  count,
  color,
}) => {
  const frame = useCurrentFrame();
  const t = frame / 30;

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Seeded pseudo-random for deterministic rendering
      const seed = i * 1337;
      positions[i * 3] = ((seed * 7919) % 1000) / 100 - 5;
      positions[i * 3 + 1] = ((seed * 6271) % 1000) / 100 - 5;
      positions[i * 3 + 2] = ((seed * 4217) % 1000) / 100 - 8;
      speeds[i] = 0.2 + ((seed * 3571) % 100) / 200;
    }
    return { positions, speeds };
  }, [count]);

  // Animate particles
  const animatedPositions = useMemo(() => {
    const pos = new Float32Array(particles.positions);
    for (let i = 0; i < count; i++) {
      const speed = particles.speeds[i];
      pos[i * 3 + 1] += Math.sin(t * speed + i) * 0.5; // gentle float
      pos[i * 3] += Math.sin(t * speed * 0.7 + i * 2) * 0.2;
    }
    return pos;
  }, [particles, count, t]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[animatedPositions, 3]}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.04}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

// ─── Camera Controller ──────────────────────────────────────────
const CameraDolly: React.FC<{ fps: number }> = ({ fps }) => {
  const frame = useCurrentFrame();
  const { camera } = useThree();
  const t = frame / fps;

  // Slow dolly: camera pushes from z=6 → z=4 over ~4 seconds
  const dollyZ = interpolate(frame, [0, fps * 4], [6, 4.2], {
    extrapolateRight: "clamp",
  });

  // Subtle drift
  const driftX = Math.sin(t * 0.3) * 0.15;
  const driftY = Math.sin(t * 0.2 + 1) * 0.08;

  camera.position.set(driftX, driftY, dollyZ);
  camera.lookAt(0, 0, 0);

  return null;
};

// ─── 3D Scene ───────────────────────────────────────────────────
interface SceneProps {
  accentColor: string;
  fps: number;
}

const TitleScene: React.FC<SceneProps> = ({ accentColor, fps }) => {
  const frame = useCurrentFrame();

  // Scene entrance: fade in lights over first 20 frames
  const lightIntensity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <>
      <CameraDolly fps={fps} />

      {/* Fog for depth */}
      <fog attach="fog" args={[COLORS.void, 3, 12]} />

      {/* Ambient — low, moody */}
      <ambientLight intensity={0.08 * lightIntensity} color={COLORS.bone} />

      {/* Key light — warm, above-right */}
      <pointLight
        position={[3, 4, 2]}
        intensity={1.5 * lightIntensity}
        color={COLORS.signal}
        distance={15}
        decay={2}
      />

      {/* Fill light — cool, left */}
      <pointLight
        position={[-3, 1, 3]}
        intensity={0.8 * lightIntensity}
        color={COLORS.process}
        distance={12}
        decay={2}
      />

      {/* Accent light — dynamic, from accent color */}
      <pointLight
        position={[0, -2, 4]}
        intensity={0.6 * lightIntensity}
        color={accentColor}
        distance={10}
        decay={2}
      />

      {/* Rim light — subtle, behind */}
      <pointLight
        position={[0, 2, -3]}
        intensity={0.4 * lightIntensity}
        color={COLORS.insight}
        distance={8}
        decay={2}
      />

      {/* Floating geometric shapes */}
      <FloatingShape
        position={[-2.5, 1.2, -2]}
        rotation={[0.3, 0.5, 0]}
        scale={0.6}
        color={COLORS.process}
        speed={0.8}
        shape="octahedron"
        opacity={0.25}
      />
      <FloatingShape
        position={[2.8, -0.8, -3]}
        rotation={[0.7, 0.2, 0.4]}
        scale={0.45}
        color={accentColor}
        speed={1.1}
        shape="icosahedron"
        opacity={0.2}
      />
      <FloatingShape
        position={[-1.5, -1.5, -4]}
        rotation={[0, 0.8, 0.3]}
        scale={0.8}
        color={COLORS.insight}
        speed={0.6}
        shape="torus"
        opacity={0.15}
      />
      <FloatingShape
        position={[1.2, 2, -5]}
        rotation={[0.5, 0, 0.6]}
        scale={0.35}
        color={COLORS.result}
        speed={1.3}
        shape="octahedron"
        opacity={0.18}
      />
      <FloatingShape
        position={[3.5, 0.5, -6]}
        rotation={[0.2, 0.4, 0]}
        scale={0.5}
        color={COLORS.blush}
        speed={0.9}
        shape="icosahedron"
        opacity={0.12}
      />

      {/* Dust particles */}
      <DustParticles count={80} color={COLORS.bone} />
    </>
  );
};

// ─── Exported Component ─────────────────────────────────────────
export interface CinematicTitle3DProps {
  /** Main title text */
  title?: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Scene beat — determines accent lighting */
  beat?: string;
  /** Frames per second */
  fps?: number;
}

export const CinematicTitle3D: React.FC<CinematicTitle3DProps> = ({
  title = "Untitled",
  subtitle,
  beat = "hook",
  fps = 30,
}) => {
  const frame = useCurrentFrame();
  const accentColor = BEAT_ACCENTS[beat] || COLORS.signal;

  // Title entrance animation
  const titleEnter = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 80, mass: 1.2 },
  });

  const subtitleEnter = spring({
    frame: Math.max(0, frame - 12),
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  // Subtle glow pulse on the accent underline
  const glowPulse = 0.4 + Math.sin((frame / fps) * 1.5) * 0.15;

  return (
    <AbsoluteFill>
      {/* 3D Background Scene */}
      <ThreeCanvas
        width={1920}
        height={1080}
        camera={{ fov: 50, near: 0.1, far: 20, position: [0, 0, 6] }}
        style={{ background: COLORS.void }}
      >
        <TitleScene accentColor={accentColor} fps={fps} />
      </ThreeCanvas>

      {/* Vignette overlay */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at center, transparent 40%, ${COLORS.void}cc 100%)`,
          pointerEvents: "none",
        }}
      />

      {/* HTML title text overlay — crisp at any resolution */}
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
            transform: `translateY(${interpolate(titleEnter, [0, 1], [40, 0])}px)`,
            opacity: titleEnter,
          }}
        >
          {/* Title */}
          <div
            style={{
              color: COLORS.chalk,
              fontSize: 64,
              fontFamily: "'General Sans', 'Inter', system-ui, sans-serif",
              fontWeight: 300,
              letterSpacing: -1.5,
              lineHeight: 1.15,
              maxWidth: 1200,
              textShadow: `0 0 60px ${accentColor}40, 0 2px 4px rgba(0,0,0,0.5)`,
            }}
          >
            {title}
          </div>

          {/* Accent underline */}
          <div
            style={{
              width: interpolate(titleEnter, [0, 1], [0, 120]),
              height: 2,
              background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
              margin: "20px auto",
              opacity: glowPulse,
              boxShadow: `0 0 20px ${accentColor}60`,
            }}
          />

          {/* Subtitle */}
          {subtitle && (
            <div
              style={{
                color: COLORS.smoke,
                fontSize: 24,
                fontFamily: "'General Sans', 'Inter', system-ui, sans-serif",
                fontWeight: 400,
                letterSpacing: 2,
                textTransform: "uppercase",
                opacity: subtitleEnter,
                transform: `translateY(${interpolate(subtitleEnter, [0, 1], [15, 0])}px)`,
                textShadow: "0 1px 3px rgba(0,0,0,0.4)",
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
      </AbsoluteFill>

      {/* Film grain overlay */}
      <AbsoluteFill
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' seed='${frame}' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          opacity: 0.035,
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
