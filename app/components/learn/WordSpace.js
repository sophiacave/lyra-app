'use client';
import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * WordSpace — Animated Word Embedding Visualization with Step-Through Narration
 *
 * Research: Embodied Cognition (Barsalou 2008) — animated spatial relationships
 * create motor-perceptual traces that deepen understanding of abstract vector spaces.
 * Visual Learning (Mayer 2009) — step-by-step narrated animation reduces cognitive
 * load compared to presenting all information simultaneously.
 *
 * Props:
 *   onXP?:  (xp) => void — award XP after viewing all 4 steps
 */

const WORDS = [
  {word:'king',x:500,y:120,color:'#c084fc',group:'royalty'},
  {word:'queen',x:350,y:120,color:'#34d399',group:'royalty'},
  {word:'man',x:500,y:300,color:'#38bdf8',group:'people'},
  {word:'woman',x:350,y:300,color:'#fb923c',group:'people'},
  {word:'prince',x:550,y:180,color:'#c084fc',group:'royalty'},
  {word:'princess',x:300,y:180,color:'#34d399',group:'royalty'},
  {word:'boy',x:550,y:350,color:'#38bdf8',group:'people'},
  {word:'girl',x:300,y:350,color:'#fb923c',group:'people'},
  {word:'dog',x:150,y:200,color:'#fbbf24',group:'animals'},
  {word:'cat',x:120,y:250,color:'#fbbf24',group:'animals'},
  {word:'puppy',x:180,y:230,color:'#fbbf24',group:'animals'},
  {word:'kitten',x:100,y:280,color:'#fbbf24',group:'animals'},
  {word:'happy',x:650,y:400,color:'#f472b6',group:'emotion'},
  {word:'sad',x:650,y:150,color:'#f472b6',group:'emotion'},
  {word:'joyful',x:680,y:430,color:'#f472b6',group:'emotion'}
];

const ALL_WORD_NAMES = WORDS.map(w => w.word);

const STEPS = [
  {narration:"<strong>Imagine a vast coordinate space.</strong> Every word has a position that encodes its meaning. Let\u2019s place some words...",visible:['king','queen','man','woman'],arrows:[],showEquation:false},
  {narration:"<strong>Notice the pattern.</strong> Royalty at top, commoners at bottom. Male on right, female on left. The AI learned this geometry from billions of sentences.",visible:['king','queen','man','woman','prince','princess','boy','girl'],arrows:[{from:'king',to:'queen',label:'gender'},{from:'man',to:'woman',label:'gender'},{from:'man',to:'king',label:'royalty'}],showEquation:false},
  {narration:"<strong>Vector arithmetic.</strong> Take king, subtract man, add woman. You land on queen. The math captures the concept: royalty + female = queen.",visible:['king','queen','man','woman'],arrows:[{from:'king',to:'man',label:'subtract',color:'#ef4444'},{from:'man',to:'woman',label:'add',color:'#22c55e'},{from:'king',to:'queen',label:'result',color:'#c084fc',dashed:true}],showEquation:true},
  {narration:"<strong>Similar things cluster.</strong> Animals in one region. People in another. Emotions in another. This geometry IS how AI understands meaning.",visible:ALL_WORD_NAMES,arrows:[],showEquation:false}
];

function getWord(name) {
  return WORDS.find(w => w.word === name);
}

export default function WordSpace({ onXP }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const timeRef = useRef(0);
  const xpAwarded = useRef(false);
  const visitedSteps = useRef(new Set([0]));

  const [step, setStep] = useState(0);

  const currentStep = STEPS[step];

  const drawArrow = useCallback((ctx, x1, y1, x2, y2, color, dashed = false) => {
    const headLen = 12;
    const angle = Math.atan2(y2 - y1, x2 - x1);
    // Shorten to not overlap dots
    const shortenBy = 18;
    const dx = Math.cos(angle) * shortenBy;
    const dy = Math.sin(angle) * shortenBy;
    const sx = x1 + dx;
    const sy = y1 + dy;
    const ex = x2 - dx;
    const ey = y2 - dy;

    ctx.save();
    ctx.beginPath();
    if (dashed) ctx.setLineDash([6, 4]);
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.moveTo(ex, ey);
    ctx.lineTo(ex - headLen * Math.cos(angle - Math.PI / 6), ey - headLen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(ex - headLen * Math.cos(angle + Math.PI / 6), ey - headLen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  }, []);

  const draw = useCallback((time) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const logW = 800;
    const logH = 500;
    const scaleX = rect.width / logW;
    const scaleY = rect.height / logH;

    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Dot grid background
    ctx.fillStyle = 'rgba(255,255,255,0.04)';
    for (let gx = 0; gx < rect.width; gx += 30) {
      for (let gy = 0; gy < rect.height; gy += 30) {
        ctx.beginPath();
        ctx.arc(gx, gy, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const visibleSet = new Set(currentStep.visible);

    // Arrows
    for (const arrow of currentStep.arrows) {
      const fromW = getWord(arrow.from);
      const toW = getWord(arrow.to);
      if (!fromW || !toW) continue;

      const fIdx = WORDS.indexOf(fromW);
      const tIdx = WORDS.indexOf(toW);
      const fy = fromW.y + Math.sin(time * 0.002 + fIdx) * 3;
      const ty = toW.y + Math.sin(time * 0.002 + tIdx) * 3;
      const color = arrow.color || 'rgba(255,255,255,0.3)';

      drawArrow(ctx, fromW.x * scaleX, fy * scaleY, toW.x * scaleX, ty * scaleY, color, arrow.dashed || false);

      // Arrow label
      const mx = ((fromW.x + toW.x) / 2) * scaleX;
      const my = ((fy + ty) / 2) * scaleY - 10;
      ctx.font = '11px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = color;
      ctx.fillText(arrow.label, mx, my);
    }

    // Words
    WORDS.forEach((w, i) => {
      if (!visibleSet.has(w.word)) return;
      const bobY = w.y + Math.sin(time * 0.002 + i) * 3;
      const px = w.x * scaleX;
      const py = bobY * scaleY;

      // Glow
      ctx.beginPath();
      ctx.arc(px, py, 14, 0, Math.PI * 2);
      ctx.fillStyle = w.color + '20';
      ctx.fill();

      // Dot
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fillStyle = w.color;
      ctx.fill();

      // Label
      ctx.font = 'bold 13px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#e2e8f0';
      ctx.fillText(w.word, px, py - 14);
    });

    ctx.restore();

    animRef.current = requestAnimationFrame(draw);
  }, [currentStep, drawArrow]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [draw]);

  const goStep = useCallback((newStep) => {
    if (newStep < 0 || newStep >= STEPS.length) return;
    setStep(newStep);
    visitedSteps.current.add(newStep);
    if (visitedSteps.current.size >= STEPS.length && !xpAwarded.current && onXP) {
      xpAwarded.current = true;
      onXP(15);
    }
  }, [onXP]);

  const btnBase = {
    padding: '8px 20px',
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.15)',
    background: 'rgba(255,255,255,0.08)',
    color: '#e2e8f0',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.15s'
  };

  return (
    <div style={{ width: '100%', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Narration */}
      <div style={{
        background: 'rgba(255,255,255,0.04)',
        borderRadius: 10,
        padding: '14px 18px',
        marginBottom: 12,
        border: '1px solid rgba(255,255,255,0.08)',
        color: '#e2e8f0',
        fontSize: 15,
        lineHeight: 1.6
      }} dangerouslySetInnerHTML={{ __html: currentStep.narration }} />

      {/* Canvas */}
      <div style={{ position: 'relative' }}>
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: 500,
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'block'
          }}
        />

        {/* Equation overlay */}
        {currentStep.showEquation && (
          <div style={{
            position: 'absolute',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.85)',
            borderRadius: 10,
            padding: '12px 24px',
            border: '1px solid rgba(255,255,255,0.15)',
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
            fontSize: 18,
            fontWeight: 700,
            whiteSpace: 'nowrap',
            backdropFilter: 'blur(8px)'
          }}>
            <span style={{ color: '#c084fc' }}>king</span>
            <span style={{ color: '#ef4444' }}> \u2212 </span>
            <span style={{ color: '#38bdf8' }}>man</span>
            <span style={{ color: '#22c55e' }}> + </span>
            <span style={{ color: '#fb923c' }}>woman</span>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}> = </span>
            <span style={{ color: '#34d399' }}>queen</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        marginTop: 16
      }}>
        <button
          onClick={() => goStep(step - 1)}
          disabled={step === 0}
          style={{
            ...btnBase,
            opacity: step === 0 ? 0.3 : 1,
            cursor: step === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          \u2190 Prev
        </button>

        {/* Step dots */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => goStep(i)}
              style={{
                width: i === step ? 12 : 8,
                height: i === step ? 12 : 8,
                borderRadius: '50%',
                border: 'none',
                background: i === step ? '#c084fc' : visitedSteps.current.has(i) ? 'rgba(192,132,252,0.4)' : 'rgba(255,255,255,0.15)',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.2s'
              }}
              aria-label={`Step ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => goStep(step + 1)}
          disabled={step === STEPS.length - 1}
          style={{
            ...btnBase,
            opacity: step === STEPS.length - 1 ? 0.3 : 1,
            cursor: step === STEPS.length - 1 ? 'not-allowed' : 'pointer'
          }}
        >
          Next \u2192
        </button>
      </div>

      {/* Step counter */}
      <div style={{
        textAlign: 'center',
        color: 'rgba(255,255,255,0.35)',
        fontSize: 12,
        marginTop: 8
      }}>
        Step {step + 1} of {STEPS.length}
      </div>
    </div>
  );
}
