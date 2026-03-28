/**
 * Like One Studio — Lesson Video Composition
 * Apple HIG-inspired cinematic educational video.
 *
 * Composition principles:
 * - Clarity: content is the star, every element serves understanding
 * - Deference: generous negative space, UI recedes
 * - Depth: layered backgrounds, glass surfaces, ambient particles
 * - Motion: spring physics, staggered reveals, scene transitions
 * - Focus: one focal point per frame, guided by light and typography
 */
import {
  AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig,
  Sequence, Audio,
} from 'remotion';
import {
  SURFACE_BASE, TEXT_PRIMARY, TEXT_SECONDARY, TEXT_TERTIARY,
  ACCENT_PURPLE, ACCENT_BLUE, ACCENT_CYAN, ACCENT_WARM,
  FONT_FAMILY, FONT_TEXT, VIDEO_WIDTH, VIDEO_HEIGHT,
  TYPE, SPACE, GRID, MOTION, DEPTH,
  typeStyle, appleEase, easeOutCubic, easeOutExpo,
} from '../lib/design-tokens.js';
import { FilmGrain } from '../components/FilmGrain.jsx';
import { Vignette } from '../components/Vignette.jsx';
import { AmbientParticles } from '../components/AmbientParticles.jsx';
import { DepthBackground } from '../components/DepthBackground.jsx';
import { FocalGlow } from '../components/FocalGlow.jsx';
import { AccentLine } from '../components/AccentLine.jsx';
import { SceneTransition } from '../components/SceneTransition.jsx';
import { KineticType, WordReveal } from '../components/KineticType.jsx';
import { GlassPanel } from '../components/GlassPanel.jsx';
import { CodeBlock } from '../components/CodeBlock.jsx';
import { QuoteCard } from '../components/QuoteCard.jsx';
import { ComparisonSplit } from '../components/ComparisonSplit.jsx';
import { TimelineScene } from '../components/TimelineScene.jsx';
import { OutroScene } from '../components/OutroScene.jsx';

// ── Title Card ──
// Apple keynote style: centered, generous space, gradient accent, brand whisper.
function TitleCard({ title, subtitle, durationInFrames }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Overline "LIKE ONE ACADEMY" fades in first
  const overlineDelay = 0.3;
  const overlineProgress = spring({
    frame: frame - overlineDelay * fps,
    fps,
    config: MOTION.gentle,
  });

  // Subtitle timing
  const subDelay = 0.8;
  const subProgress = spring({
    frame: frame - subDelay * fps,
    fps,
    config: MOTION.gentle,
  });

  // Brand mark at bottom
  const brandProgress = interpolate(
    frame, [fps * 1.8, fps * 2.5], [0, 0.35],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <SceneTransition fadeInDuration={0.6} fadeOutDuration={0.5}>
      <AbsoluteFill>
        <DepthBackground
          lightPosition="center"
          lightColor={ACCENT_PURPLE}
          lightIntensity={0.1}
          gridOpacity={0.02}
          orbCount={2}
        />

        <FocalGlow x="50%" y="42%" size={600} color={ACCENT_PURPLE} intensity={0.08} delay={0.2} />

        {/* Overline */}
        <div style={{
          position: 'absolute',
          top: GRID.golden.bottom - 80,
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: overlineProgress,
        }}>
          <span style={{
            ...typeStyle('overline', TEXT_TERTIARY),
            textTransform: 'uppercase',
          }}>
            Like One Academy
          </span>
        </div>

        {/* Accent line */}
        <AccentLine
          width={320}
          height={2}
          x="50%"
          y={`${GRID.golden.bottom - 40}px`}
          delay={0.15}
        />

        {/* Title — kinetic character animation */}
        <div style={{
          position: 'absolute',
          top: GRID.golden.bottom - 20,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '70%',
          textAlign: 'center',
        }}>
          <KineticType
            text={title}
            mode="fade-up"
            fontSize={TYPE.display.size}
            fontWeight={TYPE.display.weight}
            letterSpacing={TYPE.display.tracking}
            charDelay={MOTION.stagger.tight}
            startDelay={0.4}
            align="center"
          />
        </div>

        {/* Subtitle */}
        <div style={{
          position: 'absolute',
          top: GRID.golden.bottom + TYPE.display.size * TYPE.display.leading + 20,
          left: '50%',
          transform: `translateX(-50%) translateY(${interpolate(appleEase(subProgress), [0, 1], [15, 0])}px)`,
          opacity: subProgress,
        }}>
          <p style={typeStyle('callout', TEXT_TERTIARY)}>
            {subtitle}
          </p>
        </div>

        {/* Brand whisper */}
        <div style={{
          position: 'absolute',
          bottom: SPACE['3xl'],
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: brandProgress,
        }}>
          <span style={{ ...typeStyle('callout', TEXT_TERTIARY), fontWeight: 700 }}>
            like <span style={{ color: ACCENT_PURPLE }}>one</span>
          </span>
        </div>

        <AmbientParticles count={8} opacity={0.1} speed={0.2} />
        <Vignette intensity={0.5} radius={75} />
        <FilmGrain intensity={0.03} />
      </AbsoluteFill>
    </SceneTransition>
  );
}

// ── Text Reveal (Narration Scene) ──
// Left-aligned body text with word-level animation.
// Rule of thirds: text lives in the left 2/3, right 1/3 is breathing room.
function NarrationScene({ text, highlightWords = [], durationInFrames }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean);

  return (
    <SceneTransition fadeInDuration={0.5} fadeOutDuration={0.4} slideDirection="up" slideDistance={20}>
      <AbsoluteFill>
        <DepthBackground
          lightPosition="left"
          lightColor={ACCENT_BLUE}
          lightIntensity={0.06}
          gridOpacity={0.015}
          orbCount={2}
          orbColors={[ACCENT_BLUE, ACCENT_PURPLE]}
        />

        {/* Content area — rule of thirds, text in left 2/3 */}
        <div style={{
          position: 'absolute',
          top: GRID.margin.outer,
          left: GRID.margin.content,
          right: GRID.thirds.left, // Leave right third empty
          bottom: GRID.margin.outer,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: SPACE['2xl'],
        }}>
          {sentences.map((sentence, si) => {
            const sentenceDelay = si * 0.6; // Stagger sentences
            const timePerSentence = (durationInFrames / fps) / sentences.length;
            const sentenceStartDelay = si * timePerSentence;

            return (
              <WordReveal
                key={si}
                text={sentence}
                fontSize={TYPE.title3.size}
                fontWeight={TYPE.title3.weight}
                lineHeight={TYPE.title3.leading}
                wordDelay={MOTION.stagger.normal}
                startDelay={sentenceStartDelay}
                highlightWords={highlightWords}
                highlightColor={ACCENT_WARM}
              />
            );
          })}
        </div>

        {/* Subtle accent element in the right third */}
        <FocalGlow
          x={GRID.thirds.right + 100}
          y={GRID.thirds.top + 50}
          size={300}
          color={ACCENT_BLUE}
          intensity={0.06}
          delay={0.5}
        />

        <AmbientParticles count={6} opacity={0.08} speed={0.25} />
        <Vignette intensity={0.4} radius={80} />
        <FilmGrain intensity={0.03} />
      </AbsoluteFill>
    </SceneTransition>
  );
}

// ── Concept Diagram ──
// Nodes and connections with spring-animated entry.
// Composition: diagram centered, title at top using golden ratio.
function ConceptDiagramScene({ title, nodes, connections = [], durationInFrames }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const diagramArea = {
    left: GRID.margin.outer + 80,
    top: GRID.margin.outer + 100,
    width: VIDEO_WIDTH - GRID.margin.outer * 2 - 160,
    height: VIDEO_HEIGHT - GRID.margin.outer * 2 - 160,
  };

  const timePerNode = (durationInFrames * 0.5) / Math.max(nodes.length, 1);

  // Title animation
  const titleProgress = spring({
    frame,
    fps,
    config: MOTION.smooth,
  });

  return (
    <SceneTransition fadeInDuration={0.5} fadeOutDuration={0.4} scaleIn>
      <AbsoluteFill>
        <DepthBackground
          lightPosition="center"
          lightColor={ACCENT_PURPLE}
          lightIntensity={0.07}
          gridOpacity={0.02}
          orbCount={3}
        />

        {/* Section title — top, centered */}
        <div style={{
          position: 'absolute',
          top: GRID.margin.outer,
          left: '50%',
          transform: `translateX(-50%) translateY(${interpolate(titleProgress, [0, 1], [20, 0])}px)`,
          opacity: titleProgress,
        }}>
          <h2 style={typeStyle('title2', ACCENT_PURPLE)}>{title}</h2>
        </div>

        {/* Connection lines — SVG layer */}
        <svg style={{
          position: 'absolute',
          left: diagramArea.left,
          top: diagramArea.top,
          width: diagramArea.width,
          height: diagramArea.height,
          pointerEvents: 'none',
        }}>
          {connections.map(([from, to], ci) => {
            if (from >= nodes.length || to >= nodes.length) return null;

            const connDelay = fps * 0.8 + Math.max(from, to) * timePerNode * 0.4;
            const connProgress = spring({
              frame: frame - connDelay,
              fps,
              config: MOTION.gentle,
            });

            if (connProgress <= 0.01) return null;

            const x1 = nodes[from].x * diagramArea.width;
            const y1 = nodes[from].y * diagramArea.height;
            const x2 = nodes[to].x * diagramArea.width;
            const y2 = nodes[to].y * diagramArea.height;

            const ex = x1 + (x2 - x1) * connProgress;
            const ey = y1 + (y2 - y1) * connProgress;

            return (
              <line
                key={ci}
                x1={x1} y1={y1} x2={ex} y2={ey}
                stroke={ACCENT_PURPLE}
                strokeWidth={1.5}
                opacity={0.3 * connProgress}
                strokeDasharray="4 4"
              />
            );
          })}
        </svg>

        {/* Nodes — spring animated with glow */}
        {nodes.map((node, ni) => {
          const nodeDelay = fps * 0.4 + ni * timePerNode * 0.3;
          const nodeProgress = spring({
            frame: frame - nodeDelay,
            fps,
            config: MOTION.bouncy,
          });

          if (nodeProgress <= 0.01) return null;

          const cx = diagramArea.left + node.x * diagramArea.width;
          const cy = diagramArea.top + node.y * diagramArea.height;
          const nodeSize = 48;

          // Label fade in slightly after node
          const labelProgress = spring({
            frame: frame - nodeDelay - fps * 0.15,
            fps,
            config: MOTION.smooth,
          });

          return (
            <div key={ni}>
              {/* Glow behind node */}
              <div style={{
                position: 'absolute',
                left: cx - nodeSize * 1.5,
                top: cy - nodeSize * 1.5,
                width: nodeSize * 3,
                height: nodeSize * 3,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${ACCENT_CYAN}15 0%, transparent 70%)`,
                opacity: nodeProgress,
                filter: 'blur(8px)',
              }} />

              {/* Node circle */}
              <div style={{
                position: 'absolute',
                left: cx - nodeSize / 2,
                top: cy - nodeSize / 2,
                width: nodeSize,
                height: nodeSize,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${ACCENT_CYAN}, ${ACCENT_BLUE})`,
                border: `1.5px solid rgba(255,255,255,0.15)`,
                transform: `scale(${nodeProgress})`,
                opacity: nodeProgress,
                boxShadow: DEPTH.glow(ACCENT_CYAN, 20),
              }} />

              {/* Label */}
              <div style={{
                position: 'absolute',
                left: cx,
                top: cy + nodeSize / 2 + 12,
                transform: `translateX(-50%) translateY(${interpolate(labelProgress, [0, 1], [8, 0])}px)`,
                opacity: labelProgress,
                whiteSpace: 'nowrap',
              }}>
                <span style={typeStyle('callout', TEXT_PRIMARY)}>
                  {node.label}
                </span>
              </div>
            </div>
          );
        })}

        <AmbientParticles count={8} opacity={0.08} speed={0.2} />
        <Vignette intensity={0.45} radius={75} />
        <FilmGrain intensity={0.03} />
      </AbsoluteFill>
    </SceneTransition>
  );
}

// ── Main Composition ──
export function LessonVideo({ title, subtitle, sections }) {
  const { fps } = useVideoConfig();

  let currentFrame = 0;
  const sequences = [];

  // Title card — 3 seconds
  const titleDuration = fps * 3;
  sequences.push(
    <Sequence key="title" from={currentFrame} durationInFrames={titleDuration}>
      <TitleCard title={title} subtitle={subtitle} durationInFrames={titleDuration} />
    </Sequence>
  );
  currentFrame += titleDuration;

  // Sections
  sections.forEach((section, si) => {
    if (section.type === 'narration') {
      const duration = fps * (section.durationS || 8);

      sequences.push(
        <Sequence key={`s${si}`} from={currentFrame} durationInFrames={duration}>
          <NarrationScene
            text={section.text}
            highlightWords={section.highlightWords || []}
            durationInFrames={duration}
          />
          {section.audioSrc && <Audio src={section.audioSrc} />}
        </Sequence>
      );
      currentFrame += duration;

    } else if (section.type === 'concept') {
      const duration = fps * (section.durationS || 5);

      sequences.push(
        <Sequence key={`s${si}`} from={currentFrame} durationInFrames={duration}>
          <ConceptDiagramScene
            title={section.label}
            nodes={section.nodes}
            connections={section.connections || []}
            durationInFrames={duration}
          />
        </Sequence>
      );
      currentFrame += duration;

    } else if (section.type === 'code') {
      const duration = fps * (section.durationS || 8);

      sequences.push(
        <Sequence key={`s${si}`} from={currentFrame} durationInFrames={duration}>
          <SceneTransition fadeInDuration={0.5} fadeOutDuration={0.4} slideDirection="up">
            <AbsoluteFill>
              <DepthBackground lightPosition="top-right" lightColor={ACCENT_BLUE} lightIntensity={0.06} gridOpacity={0.015} orbCount={2} />
              <CodeBlock
                code={section.code}
                language={section.language}
                title={section.label}
                highlightLines={section.highlightLines || []}
                x={GRID.margin.content - 40}
                y={GRID.margin.outer + 40}
                width={VIDEO_WIDTH - GRID.margin.content * 2 + 80}
              />
              <AmbientParticles count={5} opacity={0.06} speed={0.2} />
              <Vignette intensity={0.4} radius={80} />
              <FilmGrain intensity={0.03} />
            </AbsoluteFill>
          </SceneTransition>
        </Sequence>
      );
      currentFrame += duration;

    } else if (section.type === 'quote') {
      const duration = fps * (section.durationS || 6);

      sequences.push(
        <Sequence key={`s${si}`} from={currentFrame} durationInFrames={duration}>
          <SceneTransition fadeInDuration={0.6} fadeOutDuration={0.5}>
            <AbsoluteFill>
              <DepthBackground lightPosition="center" lightColor={ACCENT_WARM} lightIntensity={0.08} gridOpacity={0} orbCount={2} orbColors={[ACCENT_WARM, ACCENT_PURPLE]} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <QuoteCard quote={section.quote} attribution={section.attribution} accentColor={section.accentColor || ACCENT_PURPLE} />
              </div>
              <Vignette intensity={0.5} radius={70} />
              <FilmGrain intensity={0.03} />
            </AbsoluteFill>
          </SceneTransition>
        </Sequence>
      );
      currentFrame += duration;

    } else if (section.type === 'comparison') {
      const duration = fps * (section.durationS || 8);

      sequences.push(
        <Sequence key={`s${si}`} from={currentFrame} durationInFrames={duration}>
          <SceneTransition fadeInDuration={0.5} fadeOutDuration={0.4}>
            <AbsoluteFill>
              <DepthBackground lightPosition="center" lightColor={ACCENT_PURPLE} lightIntensity={0.05} gridOpacity={0.015} orbCount={2} />
              <ComparisonSplit
                leftTitle={section.leftTitle}
                rightTitle={section.rightTitle}
                leftItems={section.leftItems || []}
                rightItems={section.rightItems || []}
                leftColor={section.leftColor}
                rightColor={section.rightColor}
              />
              <Vignette intensity={0.4} radius={80} />
              <FilmGrain intensity={0.03} />
            </AbsoluteFill>
          </SceneTransition>
        </Sequence>
      );
      currentFrame += duration;

    } else if (section.type === 'timeline') {
      const duration = fps * (section.durationS || 8);

      sequences.push(
        <Sequence key={`s${si}`} from={currentFrame} durationInFrames={duration}>
          <SceneTransition fadeInDuration={0.5} fadeOutDuration={0.4} slideDirection="up">
            <AbsoluteFill>
              <DepthBackground lightPosition="left" lightColor={ACCENT_CYAN} lightIntensity={0.06} gridOpacity={0.02} orbCount={2} />
              <TimelineScene steps={section.steps} accentColor={section.accentColor || ACCENT_PURPLE} />
              <AmbientParticles count={6} opacity={0.07} speed={0.2} />
              <Vignette intensity={0.4} radius={80} />
              <FilmGrain intensity={0.03} />
            </AbsoluteFill>
          </SceneTransition>
        </Sequence>
      );
      currentFrame += duration;

    } else if (section.type === 'outro') {
      const duration = fps * (section.durationS || 4);

      sequences.push(
        <Sequence key={`s${si}`} from={currentFrame} durationInFrames={duration}>
          <SceneTransition fadeInDuration={0.7} fadeOutDuration={0.5}>
            <AbsoluteFill>
              <DepthBackground lightPosition="center" lightColor={ACCENT_PURPLE} lightIntensity={0.1} gridOpacity={0} orbCount={3} />
              <OutroScene heading={section.heading} subtext={section.subtext} ctaText={section.ctaText} />
              <AmbientParticles count={10} opacity={0.12} speed={0.15} />
              <Vignette intensity={0.5} radius={70} />
              <FilmGrain intensity={0.03} />
            </AbsoluteFill>
          </SceneTransition>
        </Sequence>
      );
      currentFrame += duration;
    }
  });

  return <AbsoluteFill>{sequences}</AbsoluteFill>;
}
