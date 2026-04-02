'use client';
import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * NetworkBuilder — Drag-and-Drop Neural Network Construction Kit
 *
 * Research: Constructionism (Papert 1991) — learners build deeper understanding
 * by actively constructing external artifacts. Assembling a neural network by
 * hand — placing neurons, wiring connections, running training — creates a
 * tangible mental model that passive diagrams cannot achieve.
 *
 * Props:
 *   onXP?:  (xp) => void — award XP when all 5 challenge items are complete
 */

const NEURON_TYPES = [
  { type: 'input',  label: 'Input Neuron',  short: 'IN',  color: '#38bdf8' },
  { type: 'hidden', label: 'Hidden Neuron', short: 'H',   color: '#c084fc' },
  { type: 'output', label: 'Output Neuron', short: 'OUT', color: '#34d399' },
];

const TYPE_COLOR = { input: '#38bdf8', hidden: '#c084fc', output: '#34d399' };
const NEURON_SIZE = 48;

export default function NetworkBuilder({ onXP }) {
  const [neurons, setNeurons] = useState([]);
  const [connections, setConnections] = useState([]);
  const [connectMode, setConnectMode] = useState(false);
  const [connectFrom, setConnectFrom] = useState(null);
  const [trained, setTrained] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Drag neurons from the palette into the workspace.');
  const [animating, setAnimating] = useState(false);

  const neuronIdCounter = useRef(0);
  const canvasRef = useRef(null);
  const workspaceRef = useRef(null);
  const xpAwarded = useRef(false);
  const animFrameRef = useRef(null);
  const dragRef = useRef(null);

  // --- Challenge checks ---
  const inputCount = neurons.filter(n => n.type === 'input').length;
  const hiddenCount = neurons.filter(n => n.type === 'hidden').length;
  const outputCount = neurons.filter(n => n.type === 'output').length;

  const checks = [
    { label: 'Place at least 2 input neurons', done: inputCount >= 2 },
    { label: 'Add 2+ hidden neurons', done: hiddenCount >= 2 },
    { label: 'Place 2 output neurons', done: outputCount >= 2 },
    { label: 'Connect all layers', done: connections.length >= inputCount + hiddenCount && connections.length > 0 },
    { label: 'Run training', done: trained },
  ];

  const allComplete = checks.every(c => c.done);

  // --- XP award ---
  useEffect(() => {
    if (allComplete && !xpAwarded.current) {
      xpAwarded.current = true;
      if (onXP) onXP(20);
    }
  }, [allComplete, onXP]);

  // --- Canvas sizing with DPR ---
  const syncCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const workspace = workspaceRef.current;
    if (!canvas || !workspace) return;
    const rect = workspace.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }, []);

  useEffect(() => {
    syncCanvas();
    const ro = new ResizeObserver(syncCanvas);
    if (workspaceRef.current) ro.observe(workspaceRef.current);
    window.addEventListener('resize', syncCanvas);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', syncCanvas);
    };
  }, [syncCanvas]);

  // --- Draw connections ---
  const drawConnections = useCallback((pulsePositions) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

    const half = NEURON_SIZE / 2;

    connections.forEach((conn, i) => {
      const fromN = neurons.find(n => n.id === conn.from);
      const toN = neurons.find(n => n.id === conn.to);
      if (!fromN || !toN) return;

      const x1 = fromN.x + half;
      const y1 = fromN.y + half;
      const x2 = toN.x + half;
      const y2 = toN.y + half;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = 'rgba(255,255,255,0.18)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Pulse dots during animation
      if (pulsePositions && pulsePositions[i] !== undefined) {
        const t = pulsePositions[i];
        const px = x1 + (x2 - x1) * t;
        const py = y1 + (y2 - y1) * t;
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#34d399';
        ctx.fill();
      }
    });
  }, [connections, neurons]);

  // Redraw on neuron/connection changes
  useEffect(() => {
    if (!animating) drawConnections(null);
  }, [neurons, connections, animating, drawConnections]);

  // --- Status updates ---
  useEffect(() => {
    if (trained) return;
    if (neurons.length === 0) {
      setStatusMessage('Drag neurons from the palette into the workspace.');
    } else if (connections.length === 0) {
      setStatusMessage(`${neurons.length} neuron${neurons.length > 1 ? 's' : ''} placed. Enable Connect Mode to wire them.`);
    } else {
      setStatusMessage(`${neurons.length} neurons, ${connections.length} connection${connections.length > 1 ? 's' : ''}. Ready to train!`);
    }
  }, [neurons.length, connections.length, trained]);

  // --- Palette drag start ---
  const handleDragStart = useCallback((e, type) => {
    e.dataTransfer.setData('neuron-type', type);
    e.dataTransfer.effectAllowed = 'copy';
  }, []);

  // --- Workspace drop ---
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('neuron-type');
    if (!type) return;

    const rect = workspaceRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - NEURON_SIZE / 2;
    const y = e.clientY - rect.top - NEURON_SIZE / 2;

    const clampedX = Math.max(0, Math.min(x, rect.width - NEURON_SIZE));
    const clampedY = Math.max(0, Math.min(y, rect.height - NEURON_SIZE));

    const id = `n-${neuronIdCounter.current++}`;
    setNeurons(prev => [...prev, { id, type, x: clampedX, y: clampedY }]);
    setTrained(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  // --- Neuron click (connect mode) ---
  const handleNeuronClick = useCallback((id) => {
    if (!connectMode) return;
    if (!connectFrom) {
      setConnectFrom(id);
      setStatusMessage('Select a second neuron to complete the connection.');
    } else {
      if (connectFrom !== id) {
        const exists = connections.some(
          c => (c.from === connectFrom && c.to === id) || (c.from === id && c.to === connectFrom)
        );
        if (!exists) {
          setConnections(prev => [...prev, { from: connectFrom, to: id }]);
          setTrained(false);
        }
      }
      setConnectFrom(null);
    }
  }, [connectMode, connectFrom, connections]);

  // --- Neuron repositioning via mouse ---
  const handleNeuronMouseDown = useCallback((e, id) => {
    if (connectMode) return;
    e.preventDefault();
    const rect = workspaceRef.current.getBoundingClientRect();
    const neuron = neurons.find(n => n.id === id);
    if (!neuron) return;

    const offsetX = e.clientX - rect.left - neuron.x;
    const offsetY = e.clientY - rect.top - neuron.y;

    dragRef.current = { id, offsetX, offsetY };

    const handleMouseMove = (me) => {
      if (!dragRef.current) return;
      const wsRect = workspaceRef.current.getBoundingClientRect();
      const nx = me.clientX - wsRect.left - dragRef.current.offsetX;
      const ny = me.clientY - wsRect.top - dragRef.current.offsetY;
      const cx = Math.max(0, Math.min(nx, wsRect.width - NEURON_SIZE));
      const cy = Math.max(0, Math.min(ny, wsRect.height - NEURON_SIZE));
      setNeurons(prev => prev.map(n => n.id === dragRef.current.id ? { ...n, x: cx, y: cy } : n));
    };

    const handleMouseUp = () => {
      dragRef.current = null;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [connectMode, neurons]);

  // --- Train animation ---
  const handleTrain = useCallback(() => {
    if (connections.length === 0 || neurons.length === 0) {
      setStatusMessage('Add neurons and connections before training.');
      return;
    }

    setAnimating(true);
    setStatusMessage('Training... pulses propagating through the network.');

    const duration = 1800;
    const start = performance.now();

    const animate = (now) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);

      const pulsePositions = connections.map((_, i) => {
        const offset = (i * 0.12) % 1;
        const raw = (t * 1.5 - offset);
        return Math.max(0, Math.min(raw, 1));
      });

      drawConnections(pulsePositions);

      if (t < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setAnimating(false);
        setTrained(true);
        setStatusMessage('Training complete! Output neurons activated.');
        drawConnections(null);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
  }, [connections, neurons, drawConnections]);

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // --- Clear all ---
  const handleClear = useCallback(() => {
    setNeurons([]);
    setConnections([]);
    setConnectMode(false);
    setConnectFrom(null);
    setTrained(false);
    setAnimating(false);
    xpAwarded.current = false;
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setStatusMessage('Drag neurons from the palette into the workspace.');
  }, []);

  // --- Styles ---
  const styles = {
    wrapper: {
      fontFamily: 'inherit',
      color: '#e2e8f0',
      maxWidth: 720,
      margin: '0 auto',
    },
    palette: {
      display: 'flex',
      gap: 10,
      marginBottom: 12,
      flexWrap: 'wrap',
    },
    pill: (color) => ({
      padding: '6px 16px',
      background: `${color}22`,
      border: `1px solid ${color}`,
      borderRadius: 20,
      color,
      fontSize: 13,
      fontWeight: 600,
      cursor: 'grab',
      userSelect: 'none',
    }),
    workspace: {
      position: 'relative',
      minHeight: 350,
      background: 'rgba(255,255,255,.02)',
      border: '1px dashed rgba(255,255,255,.1)',
      borderRadius: 12,
      overflow: 'hidden',
    },
    canvas: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
    },
    neuron: (n) => ({
      position: 'absolute',
      left: n.x,
      top: n.y,
      width: NEURON_SIZE,
      height: NEURON_SIZE,
      borderRadius: '50%',
      background: `${TYPE_COLOR[n.type]}22`,
      border: `2px solid ${TYPE_COLOR[n.type]}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: connectMode ? 'crosshair' : 'grab',
      fontSize: 11,
      fontWeight: 700,
      color: TYPE_COLOR[n.type],
      userSelect: 'none',
      zIndex: 2,
      boxShadow: (connectFrom === n.id)
        ? `0 0 12px ${TYPE_COLOR[n.type]}`
        : (trained && n.type === 'output')
          ? `0 0 16px ${TYPE_COLOR[n.type]}`
          : 'none',
      transition: 'box-shadow 0.3s',
    }),
    controls: {
      display: 'flex',
      gap: 8,
      marginTop: 12,
      flexWrap: 'wrap',
    },
    btn: (active) => ({
      padding: '7px 18px',
      background: active ? 'rgba(192,132,252,0.25)' : 'rgba(255,255,255,0.06)',
      border: active ? '1px solid #c084fc' : '1px solid rgba(255,255,255,0.12)',
      borderRadius: 8,
      color: active ? '#c084fc' : '#94a3b8',
      fontSize: 13,
      fontWeight: 600,
      cursor: 'pointer',
    }),
    status: {
      marginTop: 10,
      padding: '8px 14px',
      background: 'rgba(255,255,255,0.03)',
      borderRadius: 8,
      fontSize: 13,
      color: '#94a3b8',
      minHeight: 20,
    },
    checklist: {
      marginTop: 16,
    },
    checkItem: (done) => ({
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '4px 0',
      fontSize: 13,
      color: done ? '#34d399' : '#64748b',
    }),
    checkIcon: (done) => ({
      width: 18,
      textAlign: 'center',
      fontSize: 14,
      fontWeight: 700,
    }),
  };

  return (
    <div style={styles.wrapper}>
      {/* Palette */}
      <div style={styles.palette}>
        {NEURON_TYPES.map(nt => (
          <div
            key={nt.type}
            style={styles.pill(nt.color)}
            draggable
            onDragStart={(e) => handleDragStart(e, nt.type)}
          >
            {nt.label}
          </div>
        ))}
      </div>

      {/* Workspace */}
      <div
        ref={workspaceRef}
        style={styles.workspace}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <canvas ref={canvasRef} style={styles.canvas} />

        {neurons.map(n => {
          const info = NEURON_TYPES.find(t => t.type === n.type);
          return (
            <div
              key={n.id}
              style={styles.neuron(n)}
              onMouseDown={(e) => handleNeuronMouseDown(e, n.id)}
              onClick={() => handleNeuronClick(n.id)}
            >
              {info.short}
            </div>
          );
        })}

        {neurons.length === 0 && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#475569',
            fontSize: 14,
            pointerEvents: 'none',
          }}>
            Drop neurons here
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={styles.controls}>
        <button
          style={styles.btn(connectMode)}
          onClick={() => { setConnectMode(m => !m); setConnectFrom(null); }}
        >
          {connectMode ? 'Connect Mode ON' : 'Connect Mode'}
        </button>
        <button
          style={styles.btn(false)}
          onClick={handleTrain}
          disabled={animating}
        >
          Train Network
        </button>
        <button
          style={styles.btn(false)}
          onClick={handleClear}
        >
          Clear All
        </button>
      </div>

      {/* Status */}
      <div style={styles.status}>{statusMessage}</div>

      {/* Challenge Checklist */}
      <div style={styles.checklist}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0', marginBottom: 6 }}>
          Challenge {allComplete ? '(Complete!)' : ''}
        </div>
        {checks.map((c, i) => (
          <div key={i} style={styles.checkItem(c.done)}>
            <span style={styles.checkIcon(c.done)}>{c.done ? '\u2713' : '\u25CB'}</span>
            <span>{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
