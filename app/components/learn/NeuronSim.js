'use client';
import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * NeuronSim — Interactive Neural Network Neuron Simulator
 *
 * Research: Embodied Cognition (Barsalou 2008) — interacting with sliders
 * creates physical-conceptual binding that deepens understanding of abstract
 * mathematical operations. Active manipulation > passive reading.
 *
 * Props:
 *   inputs?:  number (default 3) — number of input nodes
 *   onXP?:    (xp) => void — award XP on interaction
 */

const ACTIVATIONS = [
  { key: 'step', label: 'Step (Historical)' },
  { key: 'relu', label: 'ReLU (Modern Standard)' },
  { key: 'sigmoid', label: 'Sigmoid (Probabilities)' },
];

function activate(fn, z) {
  switch (fn) {
    case 'step': return z >= 0 ? 1 : 0;
    case 'relu': return Math.max(0, z);
    case 'sigmoid': return 1 / (1 + Math.exp(-z));
    default: return 0;
  }
}

function activationLabel(fn, z) {
  const out = activate(fn, z);
  switch (fn) {
    case 'step': return `step(${z.toFixed(3)}) = ${z >= 0 ? '1' : '0'}`;
    case 'relu': return `ReLU(${z.toFixed(3)}) = max(0, ${z.toFixed(3)}) = ${Math.max(0, z).toFixed(3)}`;
    case 'sigmoid': return `sigmoid(${z.toFixed(3)}) = ${out.toFixed(4)}`;
    default: return '';
  }
}

export default function NeuronSim({ inputs: inputCount = 3, onXP }) {
  const canvasRef = useRef(null);
  const xpAwarded = useRef(false);
  const interactionCount = useRef(0);

  const [activationFn, setActivationFn] = useState('step');
  const [sliders, setSliders] = useState({
    x1: 50, x2: 30, x3: 70,
    w1: 80, w2: -40, w3: 60,
    bias: 10,
  });

  const setSlider = useCallback((id, raw) => {
    setSliders(prev => ({ ...prev, [id]: Number(raw) }));
    interactionCount.current++;
    if (interactionCount.current >= 5 && !xpAwarded.current && onXP) {
      xpAwarded.current = true;
      onXP(15);
    }
  }, [onXP]);

  // Derived values
  const x1 = sliders.x1 / 100, x2 = sliders.x2 / 100, x3 = sliders.x3 / 100;
  const w1 = (sliders.w1 / 100) * 2, w2 = (sliders.w2 / 100) * 2, w3 = (sliders.w3 / 100) * 2;
  const bias = (sliders.bias / 100) * 2;
  const z = w1 * x1 + w2 * x2 + w3 * x3 + bias;
  const out = activate(activationFn, z);

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const W = rect.width;
    const H = 420;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    function drawNode(nx, ny, r, fill, stroke) {
      ctx.beginPath();
      ctx.arc(nx, ny, r, 0, Math.PI * 2);
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    ctx.clearRect(0, 0, W, H);
    const inputX = W * 0.12, sumX = W * 0.50, actX = W * 0.68, outX = W * 0.88;
    const inputYs = [H * 0.18, H * 0.42, H * 0.66];
    const biasY = H * 0.88, centerY = H * 0.42;
    const inputs = [x1, x2, x3];
    const weights = [w1, w2, w3];
    const labels = ['x1', 'x2', 'x3'];

    // Draw connection lines
    for (let i = 0; i < 3; i++) {
      const s = Math.abs(weights[i]) / 2;
      const a = 0.2 + s * 0.6;
      const lw = 1 + s * 3;
      ctx.strokeStyle = weights[i] >= 0
        ? `rgba(192,132,252,${a})`
        : `rgba(251,146,60,${a})`;
      ctx.lineWidth = lw;
      ctx.beginPath();
      ctx.moveTo(inputX + 28, inputYs[i]);
      ctx.bezierCurveTo(inputX + 80, inputYs[i], sumX - 80, centerY, sumX - 28, centerY);
      ctx.stroke();
      const mx = (inputX + sumX) / 2;
      const my = (inputYs[i] + centerY) / 2;
      ctx.fillStyle = weights[i] >= 0 ? '#c084fc' : '#fb923c';
      ctx.font = '600 11px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(`w${i + 1}=${weights[i].toFixed(1)}`, mx, my - 8);
    }

    // Bias line
    ctx.strokeStyle = 'rgba(56,189,248,0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(W * 0.30, biasY - 20);
    ctx.bezierCurveTo(W * 0.30, centerY + 60, sumX - 40, centerY + 40, sumX - 28, centerY + 4);
    ctx.stroke();

    // Sum → Activation line
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(sumX + 28, centerY);
    ctx.lineTo(actX - 32, centerY);
    ctx.stroke();

    // Activation → Output line
    const os = Math.min(Math.abs(out), 1);
    ctx.strokeStyle = `rgba(52,211,153,${0.3 + os * 0.5})`;
    ctx.lineWidth = 2 + os * 3;
    ctx.beginPath();
    ctx.moveTo(actX + 32, centerY);
    ctx.lineTo(outX - 28, centerY);
    ctx.stroke();

    // Input nodes
    for (let j = 0; j < 3; j++) {
      drawNode(inputX, inputYs[j], 22,
        `rgba(192,132,252,${0.15 + Math.abs(inputs[j]) * 0.3})`, '#c084fc');
      ctx.fillStyle = '#e5e5e5';
      ctx.font = '700 13px Inter';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(labels[j], inputX, inputYs[j] - 1);
      ctx.fillStyle = '#a1a1aa';
      ctx.font = '600 10px Inter';
      ctx.fillText(inputs[j].toFixed(2), inputX, inputYs[j] + 14);
    }

    // Bias node
    drawNode(W * 0.30, biasY, 18, 'rgba(56,189,248,0.15)', '#38bdf8');
    ctx.fillStyle = '#38bdf8';
    ctx.font = '700 10px Inter';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('bias', W * 0.30, biasY - 1);
    ctx.fillStyle = '#a1a1aa';
    ctx.font = '600 9px Inter';
    ctx.fillText(bias.toFixed(2), W * 0.30, biasY + 12);

    // Sum node
    drawNode(sumX, centerY, 26, 'rgba(255,255,255,0.06)', '#71717a');
    ctx.fillStyle = '#e5e5e5';
    ctx.font = '700 18px Inter';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('\u03A3', sumX, centerY);
    ctx.fillStyle = '#71717a';
    ctx.font = '600 10px Inter';
    ctx.fillText(`z=${z.toFixed(2)}`, sumX, centerY + 36);

    // Activation node
    const actLabel = activationFn === 'step' ? 'step' : activationFn === 'relu' ? 'ReLU' : '\u03C3';
    drawNode(actX, centerY, 28, 'rgba(251,146,60,0.12)', '#fb923c');
    ctx.fillStyle = '#fb923c';
    ctx.font = '700 12px Inter';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(actLabel, actX, centerY);

    // Output node
    const outColor = out > 0.5 ? '#34d399' : '#71717a';
    drawNode(outX, centerY, 24, `rgba(52,211,153,${0.1 + os * 0.2})`, outColor);
    ctx.fillStyle = '#e5e5e5';
    ctx.font = '800 14px Inter';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(out.toFixed(3), outX, centerY);
    ctx.fillStyle = '#71717a';
    ctx.font = '600 10px Inter';
    ctx.fillText('output', outX, centerY + 34);

    // Labels
    ctx.fillStyle = '#52525b';
    ctx.font = '600 10px Inter';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('INPUTS', inputX, 26);
    ctx.fillText('WEIGHTED SUM', sumX, 26);
    ctx.fillText('ACTIVATION', actX, 26);
    ctx.fillText('OUTPUT', outX, 26);
  }, [x1, x2, x3, w1, w2, w3, bias, z, out, activationFn]);

  const sliderDefs = [
    { id: 'x1', label: 'Input x1', min: -100, max: 100, display: x1.toFixed(2) },
    { id: 'w1', label: 'Weight w1', min: -200, max: 200, display: w1.toFixed(2) },
    { id: 'x2', label: 'Input x2', min: -100, max: 100, display: x2.toFixed(2) },
    { id: 'w2', label: 'Weight w2', min: -200, max: 200, display: w2.toFixed(2) },
    { id: 'x3', label: 'Input x3', min: -100, max: 100, display: x3.toFixed(2) },
    { id: 'w3', label: 'Weight w3', min: -200, max: 200, display: w3.toFixed(2) },
  ];

  return (
    <div className="neuron-sim">
      <div className="neuron-sim-hint">
        Try this: Set w1 to a large positive number and w2 to a large negative number.
        Watch how they compete. What happens to the output?
      </div>

      <canvas ref={canvasRef} className="neuron-canvas" height="420" />

      <div className="neuron-activation-toggle">
        <span>Activation Function:</span>
        {ACTIVATIONS.map(a => (
          <button
            key={a.key}
            className={activationFn === a.key ? 'active' : ''}
            onClick={() => setActivationFn(a.key)}
          >
            {a.label}
          </button>
        ))}
      </div>

      <div className="neuron-controls">
        {[0, 1, 2].map(i => (
          <div key={i} className="neuron-control-group">
            <label>{sliderDefs[i * 2].label}</label>
            <div className="neuron-slider-row">
              <input
                type="range"
                min={sliderDefs[i * 2].min}
                max={sliderDefs[i * 2].max}
                value={sliders[sliderDefs[i * 2].id]}
                onChange={e => setSlider(sliderDefs[i * 2].id, e.target.value)}
              />
              <span className="neuron-slider-val">{sliderDefs[i * 2].display}</span>
            </div>
            <label style={{ marginTop: '.75rem' }}>{sliderDefs[i * 2 + 1].label}</label>
            <div className="neuron-slider-row">
              <input
                type="range"
                min={sliderDefs[i * 2 + 1].min}
                max={sliderDefs[i * 2 + 1].max}
                value={sliders[sliderDefs[i * 2 + 1].id]}
                onChange={e => setSlider(sliderDefs[i * 2 + 1].id, e.target.value)}
              />
              <span className="neuron-slider-val">{sliderDefs[i * 2 + 1].display}</span>
            </div>
          </div>
        ))}
        <div className="neuron-control-group">
          <label>Bias</label>
          <div className="neuron-slider-row">
            <input
              type="range"
              min={-200}
              max={200}
              value={sliders.bias}
              onChange={e => setSlider('bias', e.target.value)}
            />
            <span className="neuron-slider-val">{bias.toFixed(2)}</span>
          </div>
          <p className="neuron-bias-hint">The bias shifts the activation threshold.</p>
        </div>
      </div>

      <div className="neuron-math">
        <span className="neuron-math-label">Live Computation</span>
        <div className="neuron-formula">
          z = ({w1.toFixed(2)} × {x1.toFixed(2)}) + ({w2.toFixed(2)} × {x2.toFixed(2)}) + ({w3.toFixed(2)} × {x3.toFixed(2)}) + {bias.toFixed(2)}
        </div>
        <div className="neuron-formula">
          z = {(w1 * x1).toFixed(3)} + {(w2 * x2).toFixed(3)} + {(w3 * x3).toFixed(3)} + {bias.toFixed(2)} = <span className="neuron-result">{z.toFixed(3)}</span>
        </div>
        <div className="neuron-formula">
          output = {activationLabel(activationFn, z)} = <span className="neuron-result">{out.toFixed(4)}</span>
        </div>
      </div>

      <style jsx>{`
        .neuron-sim {
          background: var(--surface-base, #0a0a0c);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px;
          padding: 1.5rem;
          margin: 1.5rem 0;
        }
        .neuron-sim-hint {
          background: rgba(251,146,60,.06);
          border: 1px solid rgba(251,146,60,.12);
          border-radius: 10px;
          padding: .75rem 1rem;
          margin-bottom: 1rem;
          font-size: .85rem;
          color: #fb923c;
          font-weight: 600;
        }
        .neuron-canvas {
          width: 100%;
          border-radius: 10px;
          background: rgba(0,0,0,.3);
          margin-bottom: 1rem;
        }
        .neuron-activation-toggle {
          display: flex;
          align-items: center;
          gap: .5rem;
          flex-wrap: wrap;
          margin-bottom: 1.25rem;
          font-size: .82rem;
          color: #a1a1aa;
        }
        .neuron-activation-toggle button {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: #a1a1aa;
          padding: .4rem .75rem;
          border-radius: 8px;
          font-size: .78rem;
          cursor: pointer;
          transition: all .15s;
        }
        .neuron-activation-toggle button:hover {
          background: rgba(255,255,255,0.08);
          color: #e5e5e5;
        }
        .neuron-activation-toggle button.active {
          background: rgba(251,146,60,0.12);
          border-color: #fb923c;
          color: #fb923c;
        }
        .neuron-controls {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1rem;
          margin-bottom: 1.25rem;
        }
        .neuron-control-group label {
          display: block;
          font-size: .78rem;
          color: #71717a;
          font-weight: 600;
          margin-bottom: .25rem;
        }
        .neuron-slider-row {
          display: flex;
          align-items: center;
          gap: .5rem;
        }
        .neuron-slider-row input[type="range"] {
          flex: 1;
          accent-color: #c084fc;
        }
        .neuron-slider-val {
          font-family: 'JetBrains Mono', monospace;
          font-size: .8rem;
          color: #e5e5e5;
          min-width: 3.5rem;
          text-align: right;
        }
        .neuron-bias-hint {
          font-size: .75rem;
          color: #71717a;
          margin-top: .5rem;
          line-height: 1.4;
        }
        .neuron-math {
          background: rgba(0,0,0,.4);
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: 10px;
          padding: 1rem 1.25rem;
        }
        .neuron-math-label {
          display: block;
          font-size: .7rem;
          color: #71717a;
          text-transform: uppercase;
          letter-spacing: .05em;
          margin-bottom: .5rem;
        }
        .neuron-formula {
          font-family: 'JetBrains Mono', monospace;
          font-size: .82rem;
          color: #a1a1aa;
          line-height: 1.8;
        }
        .neuron-result {
          color: #34d399;
          font-weight: 700;
          font-size: .95rem;
        }
      `}</style>
    </div>
  );
}
