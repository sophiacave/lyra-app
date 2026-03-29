import { Composition } from "remotion";
import { LikeOneVideo } from "./compositions/LikeOneVideo";
import { CinematicTitle3D } from "./components/CinematicTitle3D";
import { QuoteCard } from "./components/QuoteCard";
import { SectionHeader } from "./components/SectionHeader";
import { ExplainerScene } from "./components/ExplainerScene";
import { LowerThird } from "./components/LowerThird";

/**
 * Like One Studio V9 — Remotion Root
 *
 * Registers all compositions. The screenplay JSON is passed as defaultProps.
 * In production: the render script loads the screenplay and injects it.
 * In preview: shows the placeholder card or loads from file.
 *
 * Components consume design tokens from cinema-tokens.ts (single source of truth).
 */

// Try to load screenplay from environment or default to null
const loadScreenplay = () => {
  try {
    // In CLI render mode, screenplay is passed via inputProps
    return null; // Will be overridden by inputProps at render time
  } catch {
    return null;
  }
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Main video composition — 3 minutes at 30fps */}
      <Composition
        id="LikeOneVideo"
        component={LikeOneVideo}
        durationInFrames={30 * 180}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          screenplay: loadScreenplay(),
        }}
      />

      {/* Preview composition — shorter for quick iteration */}
      <Composition
        id="LikeOnePreview"
        component={LikeOneVideo}
        durationInFrames={30 * 30}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          screenplay: loadScreenplay(),
        }}
      />

      {/* Cinematic 3D Title Card — standalone for testing & reuse */}
      <Composition
        id="CinematicTitle"
        component={CinematicTitle3D}
        durationInFrames={30 * 5}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: "What Is a Neuron?",
          subtitle: "Like One • Season 1",
          beat: "hook",
          fps: 30,
        }}
      />

      {/* Quote Card — breathe/quote beats with Cormorant Garamond */}
      <Composition
        id="QuoteCard"
        component={QuoteCard}
        durationInFrames={30 * 6}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          quote: "The map is not the territory.",
          attribution: "Alfred Korzybski",
          beat: "breathe",
          fps: 30,
        }}
      />

      {/* Section Header — chapter/section transitions */}
      <Composition
        id="SectionHeader"
        component={SectionHeader}
        durationInFrames={30 * 4}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          overline: "Chapter 1",
          title: "The Artificial Neuron",
          beat: "setup",
          fps: 30,
        }}
      />

      {/* Explainer Scene — teaching content with animated key points */}
      <Composition
        id="ExplainerScene"
        component={ExplainerScene}
        durationInFrames={30 * 8}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          heading: "How Neural Networks Learn",
          points: [
            "Forward pass: input flows through weighted connections",
            "Loss function: measures how wrong the prediction was",
            "Backpropagation: adjusts weights to reduce error",
            "Iteration: repeat thousands of times until accurate",
          ],
          beat: "core",
          label: "KEY CONCEPT",
          fps: 30,
        }}
      />

      {/* Lower Third — name/label overlay (transparent bg) */}
      <Composition
        id="LowerThird"
        component={LowerThird}
        durationInFrames={30 * 3}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          name: "Dr. Faye Mitchell",
          role: "AI Research Lead",
          beat: "setup",
          durationFrames: 90,
          fps: 30,
        }}
      />
    </>
  );
};
