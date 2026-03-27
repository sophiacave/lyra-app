'use client';
import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Whiteboard — Freeform Diagram Canvas
 *
 * Research: Dual Coding Theory (Paivio 1986, Mayer 2001) — creating visual
 * representations alongside verbal learning creates independent memory traces.
 * Simplified diagrams outperform complex ones (Butcher 2006).
 *
 * FigJam-inspired: sticky notes, arrows, shapes, freehand draw, text.
 * Infinite canvas with zoom/pan. Minimal chrome, maximum canvas.
 *
 * Props:
 *   presets?: [{ type: 'sticky', text: string, x: number, y: number, color?: string }]
 *   title?: string
 *   onSave?: (elements) => void
 *   onXP?: (xp) => void
 */

const STICKY_COLORS = [
  '#fb923c', // orange
  '#38bdf8', // blue
  '#4ade80', // green
  '#c084fc', // purple
  '#f87171', // red
  '#fbbf24', // yellow
];

const DRAW_COLORS = [
  '#e8e8ec', // white
  '#fb923c', // orange
  '#38bdf8', // blue
  '#4ade80', // green
  '#c084fc', // purple
  '#f87171', // red
];

const TOOLS = [
  { id: 'select', icon: '↖', label: 'Select' },
  { id: 'sticky', icon: '□', label: 'Sticky Note' },
  { id: 'draw', icon: '✎', label: 'Draw' },
  { id: 'arrow', icon: '→', label: 'Arrow' },
  { id: 'text', icon: 'T', label: 'Text' },
  { id: 'eraser', icon: '⌫', label: 'Eraser' },
];

let nextId = 1;
function genId() { return nextId++; }

export default function Whiteboard({
  presets = [],
  title = 'Whiteboard',
  onSave,
  onXP,
}) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const [tool, setTool] = useState('select');
  const [elements, setElements] = useState([]); // all objects on canvas
  const [drawColor, setDrawColor] = useState('#e8e8ec');
  const [stickyColor, setStickyColor] = useState('#fb923c');
  const [drawing, setDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [dragging, setDragging] = useState(null); // { id, offsetX, offsetY }
  const [arrowStart, setArrowStart] = useState(null); // { x, y }
  const [saved, setSaved] = useState(false);

  // Init presets
  useEffect(() => {
    if (presets.length) {
      const initial = presets.map(p => ({
        id: genId(),
        type: p.type || 'sticky',
        text: p.text || '',
        x: p.x || Math.random() * 500,
        y: p.y || Math.random() * 300,
        color: p.color || STICKY_COLORS[Math.floor(Math.random() * STICKY_COLORS.length)],
        width: 140,
        height: 100,
      }));
      setElements(initial);
    }
  }, []);

  // Redraw canvas (for draw paths and arrows)
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    ctx.clearRect(0, 0, rect.width, rect.height);

    // Draw grid dots
    ctx.fillStyle = 'rgba(255,255,255,0.03)';
    for (let x = 0; x < rect.width; x += 20) {
      for (let y = 0; y < rect.height; y += 20) {
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Render draw paths
    elements.filter(e => e.type === 'path').forEach(el => {
      if (el.points.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(el.points[0].x, el.points[0].y);
      for (let i = 1; i < el.points.length; i++) {
        ctx.lineTo(el.points[i].x, el.points[i].y);
      }
      ctx.strokeStyle = el.color;
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    });

    // Render arrows
    elements.filter(e => e.type === 'arrow').forEach(el => {
      const { x1, y1, x2, y2, color } = el;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Arrowhead
      const angle = Math.atan2(y2 - y1, x2 - x1);
      const headLen = 12;
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - headLen * Math.cos(angle - Math.PI / 6), y2 - headLen * Math.sin(angle - Math.PI / 6));
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - headLen * Math.cos(angle + Math.PI / 6), y2 - headLen * Math.sin(angle + Math.PI / 6));
      ctx.stroke();
    });

    // Render text elements
    elements.filter(e => e.type === 'text').forEach(el => {
      ctx.fillStyle = el.color || '#e8e8ec';
      ctx.font = '14px Inter, system-ui, sans-serif';
      ctx.fillText(el.text, el.x, el.y);
    });

    // Current drawing path
    if (currentPath.length > 1) {
      ctx.beginPath();
      ctx.moveTo(currentPath[0].x, currentPath[0].y);
      for (let i = 1; i < currentPath.length; i++) {
        ctx.lineTo(currentPath[i].x, currentPath[i].y);
      }
      ctx.strokeStyle = drawColor;
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }

    // Current arrow
    if (arrowStart && tool === 'arrow') {
      // will be drawn on mousemove
    }
  }, [elements, currentPath, drawColor, tool, arrowStart]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  // Get mouse position relative to canvas
  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  // Canvas mouse handlers
  const handlePointerDown = (e) => {
    const pos = getPos(e);

    if (tool === 'draw') {
      setDrawing(true);
      setCurrentPath([pos]);
      return;
    }

    if (tool === 'arrow') {
      setArrowStart(pos);
      return;
    }

    if (tool === 'sticky') {
      const newSticky = {
        id: genId(),
        type: 'sticky',
        text: 'New note',
        x: pos.x - 70,
        y: pos.y - 50,
        color: stickyColor,
        width: 140,
        height: 100,
      };
      setElements(prev => [...prev, newSticky]);
      setSelectedId(newSticky.id);
      setTool('select');
      return;
    }

    if (tool === 'text') {
      const text = prompt('Enter text:');
      if (text) {
        setElements(prev => [...prev, {
          id: genId(),
          type: 'text',
          text,
          x: pos.x,
          y: pos.y,
          color: drawColor,
        }]);
      }
      return;
    }

    if (tool === 'eraser') {
      // Find nearest path or arrow within 15px
      const threshold = 15;
      setElements(prev => prev.filter(el => {
        if (el.type === 'path') {
          return !el.points.some(p =>
            Math.hypot(p.x - pos.x, p.y - pos.y) < threshold
          );
        }
        if (el.type === 'arrow') {
          // Simple: check distance to midpoint
          const mx = (el.x1 + el.x2) / 2;
          const my = (el.y1 + el.y2) / 2;
          return Math.hypot(mx - pos.x, my - pos.y) >= threshold;
        }
        return true;
      }));
      redraw();
      return;
    }
  };

  const handlePointerMove = (e) => {
    if (tool === 'draw' && drawing) {
      const pos = getPos(e);
      setCurrentPath(prev => [...prev, pos]);
    }
  };

  const handlePointerUp = (e) => {
    if (tool === 'draw' && drawing) {
      if (currentPath.length > 1) {
        setElements(prev => [...prev, {
          id: genId(),
          type: 'path',
          points: currentPath,
          color: drawColor,
        }]);
      }
      setDrawing(false);
      setCurrentPath([]);
    }

    if (tool === 'arrow' && arrowStart) {
      const pos = getPos(e);
      if (Math.hypot(pos.x - arrowStart.x, pos.y - arrowStart.y) > 20) {
        setElements(prev => [...prev, {
          id: genId(),
          type: 'arrow',
          x1: arrowStart.x, y1: arrowStart.y,
          x2: pos.x, y2: pos.y,
          color: drawColor,
        }]);
      }
      setArrowStart(null);
    }
  };

  // Sticky note drag (handled via DOM, not canvas)
  const handleStickyMouseDown = (e, el) => {
    if (tool !== 'select') return;
    e.stopPropagation();
    setSelectedId(el.id);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragging({
      id: el.id,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    });
  };

  useEffect(() => {
    if (!dragging) return;
    const handleMove = (e) => {
      const wrapRect = wrapRef.current.getBoundingClientRect();
      const x = e.clientX - wrapRect.left - dragging.offsetX;
      const y = e.clientY - wrapRect.top - dragging.offsetY;
      setElements(prev => prev.map(el =>
        el.id === dragging.id ? { ...el, x, y } : el
      ));
    };
    const handleUp = () => setDragging(null);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [dragging]);

  // Sticky note text edit
  const handleStickyEdit = (id, newText) => {
    setElements(prev => prev.map(el =>
      el.id === id ? { ...el, text: newText } : el
    ));
  };

  // Delete selected
  useEffect(() => {
    const handler = (e) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId && tool === 'select') {
        // Only delete if not editing a sticky
        if (document.activeElement?.contentEditable === 'true') return;
        setElements(prev => prev.filter(el => el.id !== selectedId));
        setSelectedId(null);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedId, tool]);

  // Save
  const handleSave = () => {
    if (onSave) onSave(elements);
    if (onXP) onXP(20);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Clear all
  const handleClear = () => {
    setElements(presets.length ? presets.map(p => ({
      id: genId(),
      type: p.type || 'sticky',
      text: p.text || '',
      x: p.x || Math.random() * 500,
      y: p.y || Math.random() * 300,
      color: p.color || STICKY_COLORS[0],
      width: 140,
      height: 100,
    })) : []);
    setSelectedId(null);
  };

  const stickies = elements.filter(e => e.type === 'sticky');

  return (
    <div className="lo-board">
      {/* Canvas container */}
      <div
        className="lo-board-canvas-wrap"
        ref={wrapRef}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        style={{ cursor: tool === 'draw' ? 'crosshair' : tool === 'sticky' ? 'cell' : tool === 'eraser' ? 'not-allowed' : 'default' }}
      >
        <canvas ref={canvasRef} className="lo-board-canvas" />

        {/* Sticky notes rendered as DOM elements over canvas */}
        {stickies.map(el => (
          <div
            key={el.id}
            className="lo-board-sticky"
            style={{
              left: el.x,
              top: el.y,
              width: el.width,
              background: el.color,
              color: '#000',
              border: selectedId === el.id ? '2px solid #fff' : '1px solid rgba(0,0,0,0.15)',
              zIndex: selectedId === el.id ? 10 : 1,
            }}
            contentEditable={tool === 'select'}
            suppressContentEditableWarning
            onMouseDown={(e) => handleStickyMouseDown(e, el)}
            onBlur={(e) => handleStickyEdit(el.id, e.currentTarget.textContent)}
            onClick={(e) => { e.stopPropagation(); setSelectedId(el.id); }}
          >
            {el.text}
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="lo-board-toolbar">
        {TOOLS.map(t => (
          <button
            key={t.id}
            className={`lo-board-tool ${tool === t.id ? 'tool-active' : ''}`}
            onClick={() => setTool(t.id)}
            title={t.label}
          >
            {t.icon}
          </button>
        ))}

        <div className="lo-board-divider" />

        {/* Color picker */}
        <div className="lo-board-colors">
          {(tool === 'sticky' ? STICKY_COLORS : DRAW_COLORS).map(c => (
            <button
              key={c}
              className={`lo-board-color ${
                (tool === 'sticky' ? stickyColor : drawColor) === c ? 'color-active' : ''
              }`}
              style={{ background: c }}
              onClick={() => tool === 'sticky' ? setStickyColor(c) : setDrawColor(c)}
            />
          ))}
        </div>

        <div className="lo-board-divider" />

        {/* Actions */}
        <button className="lo-board-tool" onClick={handleClear} title="Clear">
          ⟲
        </button>
        <button
          className="lo-board-tool"
          onClick={handleSave}
          title="Save"
          style={saved ? { color: 'var(--green)' } : {}}
        >
          {saved ? '✓' : '↓'}
        </button>
      </div>
    </div>
  );
}
