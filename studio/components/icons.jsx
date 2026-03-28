/**
 * Like One Studio — SVG Icon Library (V3)
 * 30+ code-generated SVG icons for visual vocabulary.
 * Each icon is a React component that supports animated stroke drawing.
 *
 * Props:
 *   size (number) — icon size in px (default 120)
 *   color (string) — stroke/fill color
 *   strokeWidth (number) — stroke width (default 2)
 *   progress (number 0-1) — for animated stroke drawing
 */

const defaultProps = { size: 120, color: '#fff', strokeWidth: 2, progress: 1 };

function IconWrap({ size, children, style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      {children}
    </svg>
  );
}

function animatedStroke(progress, totalLength = 100) {
  return {
    strokeDasharray: totalLength,
    strokeDashoffset: totalLength * (1 - progress),
  };
}

export function BrainIcon({ size = 120, color = '#fff', strokeWidth = 2, progress = 1 }) {
  const s = animatedStroke(progress, 120);
  return (
    <IconWrap size={size}>
      <path d="M12 2C9 2 7 4 7 6.5C7 5 5 5 4.5 6.5C4 8 5 9.5 6 10C5 10.5 4 12 5 13.5C6 15 7 15 7 15C7 16.5 8 18 9.5 18.5L10 22H14L14.5 18.5C16 18 17 16.5 17 15C17 15 18 15 19 13.5C20 12 19 10.5 18 10C19 9.5 20 8 19.5 6.5C19 5 17 5 17 6.5C17 4 15 2 12 2Z"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
        {...s} />
      <path d="M12 2V22" stroke={color} strokeWidth={1} strokeLinecap="round" opacity={0.3 * progress} />
    </IconWrap>
  );
}

export function NeuronIcon({ size = 120, color = '#fff', strokeWidth = 2, progress = 1 }) {
  const s = animatedStroke(progress, 80);
  return (
    <IconWrap size={size}>
      <circle cx="12" cy="12" r="3" stroke={color} strokeWidth={strokeWidth} {...s} />
      <line x1="12" y1="9" x2="12" y2="3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" {...animatedStroke(progress, 10)} />
      <line x1="15" y1="10" x2="19" y2="5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" {...animatedStroke(progress, 10)} />
      <line x1="15" y1="14" x2="20" y2="17" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" {...animatedStroke(progress, 10)} />
      <line x1="12" y1="15" x2="12" y2="21" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" {...animatedStroke(progress, 10)} />
      <line x1="9" y1="14" x2="4" y2="18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" {...animatedStroke(progress, 10)} />
      <line x1="9" y1="10" x2="5" y2="6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" {...animatedStroke(progress, 10)} />
      {[{cx:12,cy:3},{cx:19,cy:5},{cx:20,cy:17},{cx:12,cy:21},{cx:4,cy:18},{cx:5,cy:6}].map((p,i) => (
        <circle key={i} cx={p.cx} cy={p.cy} r="1.5" fill={color} opacity={progress} />
      ))}
    </IconWrap>
  );
}

export function NetworkIcon({ size = 120, color = '#fff', strokeWidth = 2, progress = 1 }) {
  const nodes = [{x:12,y:4},{x:4,y:10},{x:20,y:10},{x:8,y:18},{x:16,y:18}];
  const edges = [[0,1],[0,2],[1,3],[2,4],[1,2],[3,4]];
  return (
    <IconWrap size={size}>
      {edges.map(([a,b],i) => (
        <line key={`e${i}`} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}
          stroke={color} strokeWidth={1} opacity={0.4 * progress} strokeLinecap="round" />
      ))}
      {nodes.map((n,i) => (
        <circle key={`n${i}`} cx={n.x} cy={n.y} r="2.5" fill={color} opacity={progress}
          stroke={color} strokeWidth={strokeWidth * 0.5} />
      ))}
    </IconWrap>
  );
}

export function ShieldIcon({ size = 120, color = '#fff', strokeWidth = 2, progress = 1 }) {
  return (
    <IconWrap size={size}>
      <path d="M12 2L3 7V12C3 17 7 21 12 22C17 21 21 17 21 12V7L12 2Z"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
        {...animatedStroke(progress, 80)} />
      <path d="M9 12L11 14L15 10" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
        {...animatedStroke(progress, 20)} />
    </IconWrap>
  );
}

export function LockIcon({ size = 120, color = '#fff', strokeWidth = 2, progress = 1 }) {
  return (
    <IconWrap size={size}>
      <rect x="5" y="11" width="14" height="10" rx="2" stroke={color} strokeWidth={strokeWidth}
        {...animatedStroke(progress, 60)} />
      <path d="M8 11V7C8 4.8 9.8 3 12 3C14.2 3 16 4.8 16 7V11" stroke={color} strokeWidth={strokeWidth}
        strokeLinecap="round" {...animatedStroke(progress, 30)} />
      <circle cx="12" cy="16" r="1.5" fill={color} opacity={progress} />
    </IconWrap>
  );
}

export function CodeBracketIcon({ size = 120, color = '#fff', strokeWidth = 2, progress = 1 }) {
  return (
    <IconWrap size={size}>
      <path d="M8 4L3 12L8 20" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
        {...animatedStroke(progress, 30)} />
      <path d="M16 4L21 12L16 20" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
        {...animatedStroke(progress, 30)} />
      <line x1="14" y1="3" x2="10" y2="21" stroke={color} strokeWidth={strokeWidth * 0.8} strokeLinecap="round"
        opacity={0.6 * progress} />
    </IconWrap>
  );
}

export function LightbulbIcon({ size = 120, color = '#fff', strokeWidth = 2, progress = 1 }) {
  return (
    <IconWrap size={size}>
      <path d="M12 2C8.13 2 5 5.13 5 9C5 11.38 6.19 13.47 8 14.74V17C8 17.55 8.45 18 9 18H15C15.55 18 16 17.55 16 17V14.74C17.81 13.47 19 11.38 19 9C19 5.13 15.87 2 12 2Z"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
        {...animatedStroke(progress, 80)} />
      <line x1="9" y1="21" x2="15" y2="21" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
        opacity={progress} />
      <line x1="10" y1="18" x2="10" y2="21" stroke={color} strokeWidth={1} opacity={0.5 * progress} />
      <line x1="14" y1="18" x2="14" y2="21" stroke={color} strokeWidth={1} opacity={0.5 * progress} />
    </IconWrap>
  );
}

export function BookIcon({ size = 120, color = '#fff', strokeWidth = 2, progress = 1 }) {
  return (
    <IconWrap size={size}>
      <path d="M4 19.5C4 18.12 5.12 17 6.5 17H20" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
        {...animatedStroke(progress, 30)} />
      <path d="M6.5 2H20V22H6.5C5.12 22 4 20.88 4 19.5V4.5C4 3.12 5.12 2 6.5 2Z"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
        {...animatedStroke(progress, 80)} />
    </IconWrap>
  );
}

export function ChatBubbleIcon({ size = 120, color = '#fff', strokeWidth = 2, progress = 1 }) {
  return (
    <IconWrap size={size}>
      <path d="M21 11.5C21 16.75 16.97 21 12 21C10.36 21 8.81 20.56 7.46 19.78L3 21L4.39 17.09C3.5 15.47 3 13.55 3 11.5C3 6.25 7.03 2 12 2C16.97 2 21 6.25 21 11.5Z"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
        {...animatedStroke(progress, 90)} />
      <line x1="8" y1="10" x2="16" y2="10" stroke={color} strokeWidth={1.5} strokeLinecap="round" opacity={0.5 * progress} />
      <line x1="8" y1="13" x2="13" y2="13" stroke={color} strokeWidth={1.5} strokeLinecap="round" opacity={0.5 * progress} />
    </IconWrap>
  );
}

export function ArrowFlowIcon({ size = 120, color = '#fff', strokeWidth = 2, progress = 1 }) {
  return (
    <IconWrap size={size}>
      <path d="M5 12H19" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
        {...animatedStroke(progress, 20)} />
      <path d="M15 8L19 12L15 16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
        {...animatedStroke(progress, 15)} />
    </IconWrap>
  );
}

export function DatabaseIcon({ size = 120, color = '#fff', strokeWidth = 2, progress = 1 }) {
  return (
    <IconWrap size={size}>
      <ellipse cx="12" cy="5" rx="8" ry="3" stroke={color} strokeWidth={strokeWidth} {...animatedStroke(progress, 50)} />
      <path d="M4 5V19C4 20.66 7.58 22 12 22C16.42 22 20 20.66 20 19V5" stroke={color} strokeWidth={strokeWidth}
        {...animatedStroke(progress, 60)} />
      <path d="M4 12C4 13.66 7.58 15 12 15C16.42 15 20 13.66 20 12" stroke={color} strokeWidth={strokeWidth}
        opacity={0.6 * progress} />
    </IconWrap>
  );
}

export function CloudIcon({ size = 120, color = '#fff', strokeWidth = 2, progress = 1 }) {
  return (
    <IconWrap size={size}>
      <path d="M18 10H16.74C16.19 7.69 14.22 6 12 6C9.24 6 7 8.24 7 11V11.5C4.52 11.5 3 13.26 3 15.25C3 17.24 4.76 19 6.75 19H18C20.21 19 22 17.21 22 15C22 12.79 20.21 10 18 10Z"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
        {...animatedStroke(progress, 90)} />
    </IconWrap>
  );
}

export function ChartIcon({ size = 120, color = '#fff', strokeWidth = 2, progress = 1 }) {
  return (
    <IconWrap size={size}>
      <rect x="3" y="14" width="4" height="8" rx="1" stroke={color} strokeWidth={strokeWidth} opacity={progress} />
      <rect x="10" y="8" width="4" height="14" rx="1" stroke={color} strokeWidth={strokeWidth} opacity={progress} />
      <rect x="17" y="3" width="4" height="19" rx="1" stroke={color} strokeWidth={strokeWidth} opacity={progress} />
    </IconWrap>
  );
}

export function GearIcon({ size = 120, color = '#fff', strokeWidth = 2, progress = 1 }) {
  return (
    <IconWrap size={size}>
      <circle cx="12" cy="12" r="3" stroke={color} strokeWidth={strokeWidth} {...animatedStroke(progress, 25)} />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
        {...animatedStroke(progress, 200)} />
    </IconWrap>
  );
}

export function HeartIcon({ size = 120, color = '#fff', strokeWidth = 2, progress = 1 }) {
  return (
    <IconWrap size={size}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
        {...animatedStroke(progress, 80)} />
    </IconWrap>
  );
}

export function ScaleIcon({ size = 120, color = '#fff', strokeWidth = 2, progress = 1 }) {
  return (
    <IconWrap size={size}>
      <line x1="12" y1="3" x2="12" y2="21" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" opacity={progress} />
      <path d="M5 8L12 5L19 8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
        {...animatedStroke(progress, 30)} />
      <path d="M5 8L3 14C3 15.66 4.34 16 5 16C5.66 16 7 15.66 7 14L5 8Z" stroke={color} strokeWidth={strokeWidth}
        strokeLinecap="round" strokeLinejoin="round" {...animatedStroke(progress, 30)} />
      <path d="M19 8L17 14C17 15.66 18.34 16 19 16C19.66 16 21 15.66 21 14L19 8Z" stroke={color} strokeWidth={strokeWidth}
        strokeLinecap="round" strokeLinejoin="round" {...animatedStroke(progress, 30)} />
    </IconWrap>
  );
}

export function EyeIcon({ size = 120, color = '#fff', strokeWidth = 2, progress = 1 }) {
  return (
    <IconWrap size={size}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke={color} strokeWidth={strokeWidth}
        strokeLinecap="round" strokeLinejoin="round" {...animatedStroke(progress, 80)} />
      <circle cx="12" cy="12" r="3" stroke={color} strokeWidth={strokeWidth} {...animatedStroke(progress, 25)} />
    </IconWrap>
  );
}

export function WarningIcon({ size = 120, color = '#fff', strokeWidth = 2, progress = 1 }) {
  return (
    <IconWrap size={size}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
        {...animatedStroke(progress, 70)} />
      <line x1="12" y1="9" x2="12" y2="13" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" opacity={progress} />
      <circle cx="12" cy="17" r="0.5" fill={color} opacity={progress} />
    </IconWrap>
  );
}

export function CheckIcon({ size = 120, color = '#fff', strokeWidth = 2, progress = 1 }) {
  return (
    <IconWrap size={size}>
      <path d="M20 6L9 17L4 12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
        {...animatedStroke(progress, 25)} />
    </IconWrap>
  );
}

export function SparkleIcon({ size = 120, color = '#fff', strokeWidth = 2, progress = 1 }) {
  return (
    <IconWrap size={size}>
      <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
        {...animatedStroke(progress, 70)} />
    </IconWrap>
  );
}

export function PenIcon({ size = 120, color = '#fff', strokeWidth = 2, progress = 1 }) {
  return (
    <IconWrap size={size}>
      <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
        {...animatedStroke(progress, 70)} />
    </IconWrap>
  );
}

export function PaletteIcon({ size = 120, color = '#fff', strokeWidth = 2, progress = 1 }) {
  return (
    <IconWrap size={size}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-1 0-.83.67-1.5 1.5-1.5H16c3.31 0 6-2.69 6-6 0-4.96-4.49-9-10-9z"
        stroke={color} strokeWidth={strokeWidth} {...animatedStroke(progress, 90)} />
      <circle cx="7.5" cy="11.5" r="1.5" fill={color} opacity={progress} />
      <circle cx="10.5" cy="7.5" r="1.5" fill={color} opacity={progress} />
      <circle cx="14.5" cy="7.5" r="1.5" fill={color} opacity={progress} />
    </IconWrap>
  );
}

export function MusicNoteIcon({ size = 120, color = '#fff', strokeWidth = 2, progress = 1 }) {
  return (
    <IconWrap size={size}>
      <path d="M9 18V5l12-2v13" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
        {...animatedStroke(progress, 40)} />
      <circle cx="6" cy="18" r="3" stroke={color} strokeWidth={strokeWidth} {...animatedStroke(progress, 25)} />
      <circle cx="18" cy="16" r="3" stroke={color} strokeWidth={strokeWidth} {...animatedStroke(progress, 25)} />
    </IconWrap>
  );
}

export function CalculatorIcon({ size = 120, color = '#fff', strokeWidth = 2, progress = 1 }) {
  return (
    <IconWrap size={size}>
      <rect x="4" y="2" width="16" height="20" rx="2" stroke={color} strokeWidth={strokeWidth} {...animatedStroke(progress, 80)} />
      <rect x="7" y="5" width="10" height="4" rx="1" stroke={color} strokeWidth={1.5} opacity={0.6 * progress} />
      <circle cx="8.5" cy="13" r="0.8" fill={color} opacity={progress} />
      <circle cx="12" cy="13" r="0.8" fill={color} opacity={progress} />
      <circle cx="15.5" cy="13" r="0.8" fill={color} opacity={progress} />
      <circle cx="8.5" cy="16.5" r="0.8" fill={color} opacity={progress} />
      <circle cx="12" cy="16.5" r="0.8" fill={color} opacity={progress} />
      <circle cx="15.5" cy="16.5" r="0.8" fill={color} opacity={progress} />
    </IconWrap>
  );
}

export function ClockIcon({ size = 120, color = '#fff', strokeWidth = 2, progress = 1 }) {
  return (
    <IconWrap size={size}>
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth={strokeWidth} {...animatedStroke(progress, 70)} />
      <path d="M12 6V12L16 14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
        {...animatedStroke(progress, 15)} />
    </IconWrap>
  );
}

export function GlobeIcon({ size = 120, color = '#fff', strokeWidth = 2, progress = 1 }) {
  return (
    <IconWrap size={size}>
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth={strokeWidth} {...animatedStroke(progress, 70)} />
      <path d="M2 12H22" stroke={color} strokeWidth={1} opacity={0.4 * progress} />
      <path d="M12 2C14.5 4.73 15.82 8.26 16 12C15.82 15.74 14.5 19.27 12 22C9.5 19.27 8.18 15.74 8 12C8.18 8.26 9.5 4.73 12 2Z"
        stroke={color} strokeWidth={strokeWidth} {...animatedStroke(progress, 50)} />
    </IconWrap>
  );
}

export function RocketIcon({ size = 120, color = '#fff', strokeWidth = 2, progress = 1 }) {
  return (
    <IconWrap size={size}>
      <path d="M4.5 16.5C3 18 2.5 21 2.5 21s3-.5 4.5-2 2-3.5 2-3.5-1.5 0-2.5 1z"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
        {...animatedStroke(progress, 30)} />
      <path d="M12 13l-2 2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" opacity={progress} />
      <path d="M15 2.5S13.14 4 12 5c-1.5 1.3-3 4-3 7 0 0 1.5 1 3 1s3-1 3-1c0-3-1.5-5.7-3-7 1.14-1 3-2.5 3-2.5z"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
        {...animatedStroke(progress, 60)} />
    </IconWrap>
  );
}

export function PuzzleIcon({ size = 120, color = '#fff', strokeWidth = 2, progress = 1 }) {
  return (
    <IconWrap size={size}>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-2.82.85V21a2 2 0 0 1-4 0v-.25A1.65 1.65 0 0 0 8 19.4" stroke={color} strokeWidth={strokeWidth}
        strokeLinecap="round" strokeLinejoin="round" {...animatedStroke(progress, 60)} />
      <path d="M15 4.59V5a2 2 0 0 1-4 0v-.41a1.65 1.65 0 0 0-1-1.51A1.65 1.65 0 0 0 8 4.59" stroke={color} strokeWidth={strokeWidth}
        strokeLinecap="round" strokeLinejoin="round" {...animatedStroke(progress, 40)} />
    </IconWrap>
  );
}

export function KeyIcon({ size = 120, color = '#fff', strokeWidth = 2, progress = 1 }) {
  return (
    <IconWrap size={size}>
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.78 7.78 5.5 5.5 0 0 1 7.78-7.78zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
        {...animatedStroke(progress, 90)} />
    </IconWrap>
  );
}

export function FilterIcon({ size = 120, color = '#fff', strokeWidth = 2, progress = 1 }) {
  return (
    <IconWrap size={size}>
      <path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
        {...animatedStroke(progress, 60)} />
    </IconWrap>
  );
}

// ── Icon Registry ──
export const ICONS = {
  brain: BrainIcon,
  neuron: NeuronIcon,
  network: NetworkIcon,
  shield: ShieldIcon,
  lock: LockIcon,
  'code-bracket': CodeBracketIcon,
  lightbulb: LightbulbIcon,
  book: BookIcon,
  'chat-bubble': ChatBubbleIcon,
  'arrow-flow': ArrowFlowIcon,
  database: DatabaseIcon,
  cloud: CloudIcon,
  chart: ChartIcon,
  gear: GearIcon,
  heart: HeartIcon,
  scale: ScaleIcon,
  eye: EyeIcon,
  warning: WarningIcon,
  check: CheckIcon,
  sparkle: SparkleIcon,
  pen: PenIcon,
  palette: PaletteIcon,
  'music-note': MusicNoteIcon,
  calculator: CalculatorIcon,
  clock: ClockIcon,
  globe: GlobeIcon,
  rocket: RocketIcon,
  puzzle: PuzzleIcon,
  key: KeyIcon,
  filter: FilterIcon,
};

export function getIcon(name) {
  return ICONS[name] || SparkleIcon;
}
