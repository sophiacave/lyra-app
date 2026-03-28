/**
 * Like One Studio — Remotion Entry Point
 * Registers all video compositions for rendering.
 * Duration is computed dynamically from props via calculateMetadata.
 */
import { registerRoot } from 'remotion';
import { Composition } from 'remotion';
import { LessonVideo } from './compositions/LessonVideo.jsx';
import { VIDEO_WIDTH, VIDEO_HEIGHT, VIDEO_FPS } from './lib/design-tokens.js';
import { buildTimingMap } from './lib/pacing-engine.js';

// Sample lesson data for preview
const SAMPLE_LESSON = {
  title: 'What Are Embeddings?',
  subtitle: 'RAG & Vector Search — Like One Academy',
  sections: [
    {
      type: 'narration',
      text: 'An embedding is a list of numbers that represents the meaning of text. Think of it as giving every word a unique address in mathematical space.',
      highlightWords: ['embedding', 'numbers', 'meaning', 'address'],
      durationS: 9,
    },
    {
      type: 'concept',
      label: 'Embedding Space',
      nodes: [
        { x: 0.2, y: 0.3, label: 'happy' },
        { x: 0.25, y: 0.5, label: 'joyful' },
        { x: 0.15, y: 0.45, label: 'delighted' },
        { x: 0.7, y: 0.3, label: 'sad' },
        { x: 0.75, y: 0.5, label: 'melancholy' },
        { x: 0.5, y: 0.8, label: 'neutral' },
      ],
      connections: [[0, 1], [0, 2], [1, 2], [3, 4]],
      durationS: 5,
    },
    {
      type: 'narration',
      text: 'Words with similar meanings end up close together. Happy lives near joyful and delighted, but far from sad. This is how your AI brain finds related memories.',
      highlightWords: ['similar', 'close', 'brain', 'memories'],
      durationS: 11,
    },
  ],
};

function calculateDuration(props) {
  // Use pacing engine for research-backed durations + breathing gaps
  const { totalFrames } = buildTimingMap(props, VIDEO_FPS);
  return totalFrames;
}

function Root() {
  return (
    <>
      <Composition
        id="LessonVideo"
        component={LessonVideo}
        durationInFrames={calculateDuration(SAMPLE_LESSON)}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        defaultProps={SAMPLE_LESSON}
        calculateMetadata={({ props }) => {
          return {
            durationInFrames: calculateDuration(props),
          };
        }}
      />
    </>
  );
}

registerRoot(Root);
