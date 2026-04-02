'use client';
import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * EmbedExplorer — 2D Embedding Space Visualization
 *
 * Research: Dual Coding Theory (Paivio 1971) — presenting word vectors as both
 * spatial positions and numeric coordinates creates dual verbal-visual encoding.
 * Spatial Reasoning (Newcombe 2010) — manipulating geometric relationships between
 * vectors builds intuitive understanding of cosine similarity and analogy arithmetic.
 *
 * Props:
 *   onXP?:  (xp) => void — award XP after exploring 3 word pairs
 */

const EMB_WORDS = {
  king:{x:3.8,y:3.5,color:'#c084fc'}, queen:{x:3.2,y:4.2,color:'#c084fc'},
  prince:{x:4.2,y:3.0,color:'#c084fc'}, princess:{x:3.6,y:3.8,color:'#c084fc'},
  man:{x:1.5,y:1.2,color:'#fb923c'}, woman:{x:0.9,y:1.9,color:'#fb923c'},
  boy:{x:1.9,y:0.7,color:'#fb923c'}, girl:{x:1.3,y:1.4,color:'#fb923c'},
  cat:{x:-2.0,y:1.5,color:'#34d399'}, dog:{x:-1.5,y:1.0,color:'#34d399'},
  puppy:{x:-1.2,y:0.6,color:'#34d399'}, kitten:{x:-1.7,y:1.8,color:'#34d399'},
  apple:{x:-1.0,y:-2.5,color:'#f472b6'}, banana:{x:-0.5,y:-2.8,color:'#f472b6'},
  pizza:{x:0.8,y:-2.2,color:'#f472b6'}, sushi:{x:1.2,y:-2.6,color:'#f472b6'},
  computer:{x:3.0,y:-1.5,color:'#38bdf8'}, robot:{x:3.5,y:-0.8,color:'#38bdf8'},
  code:{x:2.5,y:-1.8,color:'#38bdf8'}, AI:{x:3.2,y:-1.0,color:'#38bdf8'}
};

const WORD_NAMES = Object.keys(EMB_WORDS);
const RANGE = 5.5;

function cosineSim(a, b) {
  const dot = a.x * b.x + a.y * b.y;
  const magA = Math.sqrt(a.x * a.x + a.y * a.y);
  const magB = Math.sqrt(b.x * b.x + b.y * b.y);
  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
}

function angleBetween(a, b) {
  const cs = cosineSim(a, b);
  return Math.acos(Math.max(-1, Math.min(1, cs)));
}

function magnitude(v) {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

function dotProduct(a, b) {
  return a.x * b.x + a.y * b.y;
}

function distance(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export default function EmbedExplorer({ onXP }) {
  const canvasRef = useRef(null);
  const xpAwarded = useRef(false);
  const pairsExplored = useRef(new Set());

  const [selectedA, setSelectedA] = useState(null);
  const [selectedB, setSelectedB] = useState(null);
  const [analogyA, setAnalogyA] = useState('king');
  const [analogyB, setAnalogyB] = useState('man');
  const [analogyC, setAnalogyC] = useState('woman');

  const toCanvas = useCallback((wx, wy, cw, ch) => {
    const cx = ((wx + RANGE) / (2 * RANGE)) * cw;
    const cy = (1 - (wy + RANGE) / (2 * RANGE)) * ch;
    return { cx, cy };
  }, []);

  const fromCanvas = useCallback((cx, cy, cw, ch) => {
    const wx = (cx / cw) * (2 * RANGE) - RANGE;
    const wy = -((cy / ch) * (2 * RANGE) - RANGE);
    return { wx, wy };
  }, []);

  const drawArrowLine = useCallback((ctx, x1, y1, x2, y2, color, lineWidth = 2) => {
    const headLen = 10;
    const angle = Math.atan2(y2 - y1, x2 - x1);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - headLen * Math.cos(angle - Math.PI / 6), y2 - headLen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(x2 - headLen * Math.cos(angle + Math.PI / 6), y2 - headLen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const cw = rect.width;
    const ch = 480;

    if (canvas.width !== cw * dpr || canvas.height !== ch * dpr) {
      canvas.width = cw * dpr;
      canvas.height = ch * dpr;
      canvas.style.height = ch + 'px';
      ctx.scale(dpr, dpr);
    }

    ctx.clearRect(0, 0, cw, ch);

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    for (let i = -5; i <= 5; i++) {
      const { cx: gx } = toCanvas(i, 0, cw, ch);
      ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, ch); ctx.stroke();
      const { cy: gy } = toCanvas(0, i, cw, ch);
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(cw, gy); ctx.stroke();
    }

    // Axes
    const origin = toCanvas(0, 0, cw, ch);
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, origin.cy); ctx.lineTo(cw, origin.cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(origin.cx, 0); ctx.lineTo(origin.cx, ch); ctx.stroke();

    // Axis labels
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '11px system-ui, sans-serif';
    ctx.textAlign = 'center';
    for (let i = -5; i <= 5; i++) {
      if (i === 0) continue;
      const { cx: lx } = toCanvas(i, 0, cw, ch);
      ctx.fillText(String(i), lx, origin.cy + 14);
      const { cy: ly } = toCanvas(0, i, cw, ch);
      ctx.textAlign = 'right';
      ctx.fillText(String(i), origin.cx - 6, ly + 4);
      ctx.textAlign = 'center';
    }

    // Vector arrows when selected
    if (selectedA) {
      const a = EMB_WORDS[selectedA];
      const pa = toCanvas(a.x, a.y, cw, ch);
      drawArrowLine(ctx, origin.cx, origin.cy, pa.cx, pa.cy, a.color, 2.5);
    }
    if (selectedB) {
      const b = EMB_WORDS[selectedB];
      const pb = toCanvas(b.x, b.y, cw, ch);
      drawArrowLine(ctx, origin.cx, origin.cy, pb.cx, pb.cy, b.color, 2.5);
    }

    // Angle arc when both selected
    if (selectedA && selectedB) {
      const a = EMB_WORDS[selectedA];
      const b = EMB_WORDS[selectedB];
      const angleA = Math.atan2(a.y, a.x);
      const angleB = Math.atan2(b.y, b.x);
      // Convert to canvas angles (y-flipped)
      const canvasAngleA = -angleA;
      const canvasAngleB = -angleB;
      ctx.beginPath();
      ctx.arc(origin.cx, origin.cy, 40, Math.min(canvasAngleA, canvasAngleB), Math.max(canvasAngleA, canvasAngleB));
      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Label the angle
      const midAngle = (canvasAngleA + canvasAngleB) / 2;
      const deg = (angleBetween(a, b) * 180 / Math.PI).toFixed(1);
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.font = '11px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(deg + '\u00B0', origin.cx + 55 * Math.cos(midAngle), origin.cy + 55 * Math.sin(midAngle));
    }

    // Word dots and labels
    for (const [word, data] of Object.entries(EMB_WORDS)) {
      const { cx: px, cy: py } = toCanvas(data.x, data.y, cw, ch);
      const isSelected = word === selectedA || word === selectedB;
      const radius = isSelected ? 7 : 5;

      ctx.beginPath();
      ctx.arc(px, py, radius, 0, Math.PI * 2);
      ctx.fillStyle = data.color;
      ctx.fill();
      if (isSelected) {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      ctx.fillStyle = isSelected ? '#fff' : 'rgba(255,255,255,0.85)';
      ctx.font = isSelected ? 'bold 13px system-ui, sans-serif' : '12px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(word, px, py - radius - 4);
    }
  }, [selectedA, selectedB, toCanvas, drawArrowLine]);

  useEffect(() => {
    draw();
    const handleResize = () => draw();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [draw]);

  const handleCanvasClick = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const cw = rect.width;
    const ch = 480;

    let closest = null;
    let closestDist = Infinity;
    for (const [word, data] of Object.entries(EMB_WORDS)) {
      const { cx: px, cy: py } = toCanvas(data.x, data.y, cw, ch);
      const d = Math.sqrt((mx - px) ** 2 + (my - py) ** 2);
      if (d < 20 && d < closestDist) {
        closest = word;
        closestDist = d;
      }
    }

    if (!closest) return;

    if (!selectedA || (selectedA && selectedB)) {
      setSelectedA(closest);
      setSelectedB(null);
    } else {
      if (closest === selectedA) return;
      setSelectedB(closest);
      const pairKey = [selectedA, closest].sort().join('-');
      pairsExplored.current.add(pairKey);
      if (pairsExplored.current.size >= 3 && !xpAwarded.current && onXP) {
        xpAwarded.current = true;
        onXP(15);
      }
    }
  }, [selectedA, selectedB, toCanvas, onXP]);

  // Analogy computation
  const analogyResult = (() => {
    const a = EMB_WORDS[analogyA];
    const b = EMB_WORDS[analogyB];
    const c = EMB_WORDS[analogyC];
    if (!a || !b || !c) return null;
    const rx = a.x - b.x + c.x;
    const ry = a.y - b.y + c.y;
    let nearest = null;
    let nearestDist = Infinity;
    for (const [word, data] of Object.entries(EMB_WORDS)) {
      if (word === analogyA || word === analogyB || word === analogyC) continue;
      const d = distance({ x: rx, y: ry }, data);
      if (d < nearestDist) {
        nearest = word;
        nearestDist = d;
      }
    }
    return { x: rx, y: ry, nearest, distance: nearestDist };
  })();

  const simData = selectedA && selectedB ? (() => {
    const a = EMB_WORDS[selectedA];
    const b = EMB_WORDS[selectedB];
    const dot = dotProduct(a, b);
    const magA = magnitude(a);
    const magB = magnitude(b);
    const sim = cosineSim(a, b);
    const angle = angleBetween(a, b) * 180 / Math.PI;
    return { dot, magA, magB, sim, angle };
  })() : null;

  const selectStyle = {
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 6,
    color: '#e2e8f0',
    padding: '6px 10px',
    fontSize: 14,
    outline: 'none',
    cursor: 'pointer',
    minWidth: 90
  };

  return (
    <div style={{ width: '100%', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        style={{
          width: '100%',
          height: 480,
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.1)',
          cursor: 'crosshair',
          display: 'block'
        }}
      />

      {/* Hint */}
      <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.45)', fontSize: 13, marginTop: 8 }}>
        Click a word to select it. Click another to compare vectors.
      </div>

      {/* Info Panel */}
      <div style={{ display: 'flex', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
        {/* Vector A */}
        <div style={{
          flex: '1 1 180px',
          background: 'rgba(255,255,255,0.04)',
          borderRadius: 10,
          padding: '12px 16px',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
            Vector A
          </div>
          {selectedA ? (
            <div style={{ color: EMB_WORDS[selectedA].color, fontSize: 16, fontWeight: 600 }}>
              {selectedA}{' '}
              <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 400, fontSize: 14 }}>
                = [{EMB_WORDS[selectedA].x.toFixed(1)}, {EMB_WORDS[selectedA].y.toFixed(1)}]
              </span>
            </div>
          ) : (
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>Click a word</div>
          )}
        </div>

        {/* Vector B */}
        <div style={{
          flex: '1 1 180px',
          background: 'rgba(255,255,255,0.04)',
          borderRadius: 10,
          padding: '12px 16px',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
            Vector B
          </div>
          {selectedB ? (
            <div style={{ color: EMB_WORDS[selectedB].color, fontSize: 16, fontWeight: 600 }}>
              {selectedB}{' '}
              <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 400, fontSize: 14 }}>
                = [{EMB_WORDS[selectedB].x.toFixed(1)}, {EMB_WORDS[selectedB].y.toFixed(1)}]
              </span>
            </div>
          ) : (
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>Click another word</div>
          )}
        </div>
      </div>

      {/* Formula Box */}
      {simData && (
        <div style={{
          marginTop: 16,
          background: 'rgba(255,255,255,0.04)',
          borderRadius: 10,
          padding: '16px 20px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
            Cosine Similarity
          </div>
          <div style={{ fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace', fontSize: 14, color: '#e2e8f0', lineHeight: 2 }}>
            <div>
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>cos(\u03B8) = </span>
              <span style={{ color: '#c084fc' }}>A\u00B7B</span>
              <span style={{ color: 'rgba(255,255,255,0.5)' }}> / (</span>
              <span style={{ color: '#38bdf8' }}>|A|</span>
              <span style={{ color: 'rgba(255,255,255,0.5)' }}> \u00D7 </span>
              <span style={{ color: '#fb923c' }}>|B|</span>
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>)</span>
            </div>
            <div>
              <span style={{ color: '#c084fc' }}>A\u00B7B</span>
              <span style={{ color: 'rgba(255,255,255,0.4)' }}> = </span>
              <span style={{ color: '#e2e8f0' }}>{simData.dot.toFixed(3)}</span>
            </div>
            <div>
              <span style={{ color: '#38bdf8' }}>|A|</span>
              <span style={{ color: 'rgba(255,255,255,0.4)' }}> = </span>
              <span style={{ color: '#e2e8f0' }}>{simData.magA.toFixed(3)}</span>
              <span style={{ color: 'rgba(255,255,255,0.2)', margin: '0 12px' }}>|</span>
              <span style={{ color: '#fb923c' }}>|B|</span>
              <span style={{ color: 'rgba(255,255,255,0.4)' }}> = </span>
              <span style={{ color: '#e2e8f0' }}>{simData.magB.toFixed(3)}</span>
            </div>
            <div style={{ marginTop: 6, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>Similarity: </span>
              <span style={{ color: '#34d399', fontWeight: 700, fontSize: 18 }}>{simData.sim.toFixed(4)}</span>
              <span style={{ color: 'rgba(255,255,255,0.2)', margin: '0 12px' }}>|</span>
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>Angle: </span>
              <span style={{ color: '#fbbf24', fontWeight: 700, fontSize: 18 }}>{simData.angle.toFixed(1)}\u00B0</span>
            </div>
          </div>
        </div>
      )}

      {/* Analogy Calculator */}
      <div style={{
        marginTop: 20,
        background: 'rgba(255,255,255,0.04)',
        borderRadius: 10,
        padding: '16px 20px',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
          Word Analogy Calculator
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <select value={analogyA} onChange={e => setAnalogyA(e.target.value)} style={selectStyle}>
            {WORD_NAMES.map(w => <option key={w} value={w}>{w}</option>)}
          </select>
          <span style={{ color: '#ef4444', fontWeight: 700, fontSize: 18 }}>\u2212</span>
          <select value={analogyB} onChange={e => setAnalogyB(e.target.value)} style={selectStyle}>
            {WORD_NAMES.map(w => <option key={w} value={w}>{w}</option>)}
          </select>
          <span style={{ color: '#22c55e', fontWeight: 700, fontSize: 18 }}>+</span>
          <select value={analogyC} onChange={e => setAnalogyC(e.target.value)} style={selectStyle}>
            {WORD_NAMES.map(w => <option key={w} value={w}>{w}</option>)}
          </select>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 700, fontSize: 18 }}>=</span>
          <span style={{ color: '#fbbf24', fontWeight: 700, fontSize: 16 }}>?</span>
        </div>

        {analogyResult && (
          <div style={{
            marginTop: 14,
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
            fontSize: 14,
            color: '#e2e8f0',
            lineHeight: 1.8
          }}>
            <div>
              <span style={{ color: EMB_WORDS[analogyA].color }}>[{EMB_WORDS[analogyA].x.toFixed(1)}, {EMB_WORDS[analogyA].y.toFixed(1)}]</span>
              <span style={{ color: '#ef4444' }}> \u2212 </span>
              <span style={{ color: EMB_WORDS[analogyB].color }}>[{EMB_WORDS[analogyB].x.toFixed(1)}, {EMB_WORDS[analogyB].y.toFixed(1)}]</span>
              <span style={{ color: '#22c55e' }}> + </span>
              <span style={{ color: EMB_WORDS[analogyC].color }}>[{EMB_WORDS[analogyC].x.toFixed(1)}, {EMB_WORDS[analogyC].y.toFixed(1)}]</span>
              <span style={{ color: 'rgba(255,255,255,0.4)' }}> = </span>
              <span style={{ color: '#fbbf24' }}>[{analogyResult.x.toFixed(1)}, {analogyResult.y.toFixed(1)}]</span>
            </div>
            <div style={{ marginTop: 4 }}>
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>Nearest: </span>
              <span style={{ color: '#34d399', fontWeight: 700, fontSize: 16 }}>{analogyResult.nearest}</span>
              <span style={{ color: 'rgba(255,255,255,0.35)', marginLeft: 8, fontSize: 13 }}>
                (distance: {analogyResult.distance.toFixed(3)})
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
