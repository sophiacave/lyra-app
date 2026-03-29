import { Composition } from "remotion";
import { LikeOneVideo } from "./compositions/LikeOneVideo";

/**
 * Like One Studio V9 — Remotion Root
 * 
 * Registers all compositions. The screenplay JSON is passed as defaultProps.
 * In production: the render script loads the screenplay and injects it.
 * In preview: shows the placeholder card or loads from file.
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
    </>
  );
};
