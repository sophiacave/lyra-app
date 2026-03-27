'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * PixelQuest — 8-Bit Learning Game
 *
 * Research: Flow State (Csikszentmihalyi 1990) — challenge must match skill.
 * Embodied cognition — movement + decision-making creates stronger memory traces.
 * Gamification (Hamari et al 2014) — game IS the learning, not bolted on.
 *
 * The player navigates a grid, collecting correct answers and avoiding wrong ones.
 * GameBoy-inspired aesthetic: 160x144 logical resolution, 4-color palette.
 *
 * Props:
 *   levels: [{
 *     question: string,
 *     correct: string[],    — items to collect
 *     wrong: string[],      — items to avoid
 *     gridSize?: number,    — default 8
 *   }]
 *   onComplete?: (score, total) => void
 *   onXP?: (xp) => void
 */

// GameBoy-ish palette
const PALETTE = {
  darkest:  '#0f380f',
  dark:     '#306230',
  light:    '#8bac0f',
  lightest: '#9bbc0f',
};

const TILE = 18; // px per tile at base resolution
const PLAYER_CHAR = '☺';
const CORRECT_CHAR = '★';
const WRONG_CHAR = '✕';
const EMPTY_CHAR = '·';

function randomPos(gridSize, occupied) {
  let x, y, key;
  let attempts = 0;
  do {
    x = Math.floor(Math.random() * gridSize);
    y = Math.floor(Math.random() * gridSize);
    key = `${x},${y}`;
    attempts++;
  } while (occupied.has(key) && attempts < 100);
  occupied.add(key);
  return { x, y };
}

function buildLevel(levelData, gridSize = 8) {
  const occupied = new Set();

  // Player starts at center-ish
  const player = { x: Math.floor(gridSize / 2), y: Math.floor(gridSize / 2) };
  occupied.add(`${player.x},${player.y}`);

  // Place correct items
  const correctItems = levelData.correct.map((label) => {
    const pos = randomPos(gridSize, occupied);
    return { ...pos, label, type: 'correct' };
  });

  // Place wrong items
  const wrongItems = levelData.wrong.map((label) => {
    const pos = randomPos(gridSize, occupied);
    return { ...pos, label, type: 'wrong' };
  });

  return { player, items: [...correctItems, ...wrongItems], gridSize };
}

export default function PixelQuest({
  levels = [],
  onComplete,
  onXP,
}) {
  const canvasRef = useRef(null);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [gameState, setGameState] = useState(null); // { player, items, gridSize }
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [collected, setCollected] = useState(0);
  const [message, setMessage] = useState('');
  const [phase, setPhase] = useState('playing'); // playing | levelComplete | gameOver | allClear
  const [flash, setFlash] = useState(null); // 'correct' | 'wrong' | null

  // Initialize level
  useEffect(() => {
    if (!levels.length || currentLevel >= levels.length) return;
    const level = levels[currentLevel];
    const gridSize = level.gridSize || 8;
    const state = buildLevel(level, gridSize);
    setGameState(state);
    setCollected(0);
    setMessage(level.question);
    setPhase('playing');
  }, [currentLevel, levels]);

  // Render canvas
  useEffect(() => {
    if (!gameState || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { player, items, gridSize } = gameState;
    const tileW = canvas.width / gridSize;
    const tileH = canvas.height / gridSize;

    // Clear
    ctx.fillStyle = PALETTE.darkest;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines (subtle)
    ctx.strokeStyle = PALETTE.dark;
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= gridSize; i++) {
      ctx.beginPath();
      ctx.moveTo(i * tileW, 0);
      ctx.lineTo(i * tileW, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * tileH);
      ctx.lineTo(canvas.width, i * tileH);
      ctx.stroke();
    }

    // Items
    items.forEach((item) => {
      const cx = item.x * tileW + tileW / 2;
      const cy = item.y * tileH + tileH / 2;

      if (item.type === 'correct') {
        ctx.fillStyle = PALETTE.lightest;
        ctx.font = `${Math.floor(tileW * 0.6)}px monospace`;
      } else {
        ctx.fillStyle = PALETTE.dark;
        ctx.font = `${Math.floor(tileW * 0.5)}px monospace`;
      }
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.type === 'correct' ? CORRECT_CHAR : WRONG_CHAR, cx, cy);

      // Label below (tiny)
      ctx.fillStyle = item.type === 'correct' ? PALETTE.light : PALETTE.dark;
      ctx.font = `${Math.max(7, Math.floor(tileW * 0.22))}px monospace`;
      const truncLabel = item.label.length > 10 ? item.label.slice(0, 9) + '…' : item.label;
      ctx.fillText(truncLabel, cx, cy + tileH * 0.35);
    });

    // Player
    const px = player.x * tileW + tileW / 2;
    const py = player.y * tileH + tileH / 2;
    ctx.fillStyle = PALETTE.lightest;
    ctx.font = `bold ${Math.floor(tileW * 0.7)}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(PLAYER_CHAR, px, py);

    // Flash effect
    if (flash) {
      ctx.fillStyle = flash === 'correct'
        ? 'rgba(155, 188, 15, 0.15)'
        : 'rgba(248, 113, 113, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [gameState, flash]);

  // Move player
  const move = useCallback((dx, dy) => {
    if (phase !== 'playing' || !gameState) return;

    setGameState(prev => {
      const { player, items, gridSize } = prev;
      const nx = Math.max(0, Math.min(gridSize - 1, player.x + dx));
      const ny = Math.max(0, Math.min(gridSize - 1, player.y + dy));

      // Check collision with items
      const hitIdx = items.findIndex(i => i.x === nx && i.y === ny);

      if (hitIdx >= 0) {
        const hit = items[hitIdx];
        const newItems = items.filter((_, i) => i !== hitIdx);

        if (hit.type === 'correct') {
          setScore(s => s + 10);
          setCollected(c => {
            const next = c + 1;
            const totalCorrect = items.filter(i => i.type === 'correct').length;
            if (next >= totalCorrect) {
              // Level complete!
              setTimeout(() => {
                if (currentLevel + 1 >= levels.length) {
                  setPhase('allClear');
                  if (onComplete) onComplete(score + 10, levels.length);
                  if (onXP) onXP(30);
                } else {
                  setPhase('levelComplete');
                  setTimeout(() => setCurrentLevel(l => l + 1), 1500);
                }
              }, 300);
            }
            return next;
          });
          setFlash('correct');
          setTimeout(() => setFlash(null), 150);
        } else {
          setLives(l => {
            const next = l - 1;
            if (next <= 0) {
              setTimeout(() => setPhase('gameOver'), 300);
            }
            return next;
          });
          setFlash('wrong');
          setTimeout(() => setFlash(null), 200);
        }

        return { ...prev, player: { x: nx, y: ny }, items: newItems };
      }

      return { ...prev, player: { x: nx, y: ny } };
    });
  }, [phase, gameState, currentLevel, levels, score, onComplete, onXP]);

  // Keyboard controls
  useEffect(() => {
    const handler = (e) => {
      switch (e.key) {
        case 'ArrowUp':    case 'w': case 'W': e.preventDefault(); move(0, -1); break;
        case 'ArrowDown':  case 's': case 'S': e.preventDefault(); move(0, 1);  break;
        case 'ArrowLeft':  case 'a': case 'A': e.preventDefault(); move(-1, 0); break;
        case 'ArrowRight': case 'd': case 'D': e.preventDefault(); move(1, 0);  break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [move]);

  const restart = () => {
    setCurrentLevel(0);
    setLives(3);
    setScore(0);
    setPhase('playing');
  };

  if (!levels.length) return null;

  const totalCorrect = gameState?.items?.filter(i => i.type === 'correct').length || 0;

  return (
    <div className="lo-pixel">
      {/* Screen */}
      <div className="lo-pixel-screen">
        <canvas
          ref={canvasRef}
          className="lo-pixel-canvas"
          width={320}
          height={288}
        />
        <div className="lo-pixel-hud">
          <span>{'♥'.repeat(lives)}{'♡'.repeat(Math.max(0, 3 - lives))}</span>
          <span>LV{currentLevel + 1}</span>
          <span>★{score}</span>
        </div>

        {/* Question overlay */}
        {message && phase === 'playing' && (
          <div style={{
            position: 'absolute', bottom: 8, left: 8, right: 8,
            background: 'rgba(15, 56, 15, 0.9)',
            border: '1px solid #306230',
            borderRadius: 4,
            padding: '4px 8px',
            fontFamily: 'monospace',
            fontSize: '10px',
            color: PALETTE.lightest,
            textAlign: 'center',
            lineHeight: 1.3,
          }}>
            {message} ({collected}/{collected + totalCorrect})
          </div>
        )}

        {/* Level complete */}
        {phase === 'levelComplete' && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(15, 56, 15, 0.85)',
            fontFamily: 'monospace', color: PALETTE.lightest,
            fontSize: '14px', fontWeight: 'bold',
          }}>
            LEVEL CLEAR!
          </div>
        )}

        {/* Game over */}
        {phase === 'gameOver' && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            background: 'rgba(15, 56, 15, 0.9)',
            fontFamily: 'monospace', color: PALETTE.lightest, gap: 8,
          }}>
            <div style={{ fontSize: 14, fontWeight: 'bold' }}>GAME OVER</div>
            <div style={{ fontSize: 10 }}>Score: {score}</div>
          </div>
        )}

        {/* All clear */}
        {phase === 'allClear' && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            background: 'rgba(15, 56, 15, 0.9)',
            fontFamily: 'monospace', color: PALETTE.lightest, gap: 8,
          }}>
            <div style={{ fontSize: 16 }}>🎯</div>
            <div style={{ fontSize: 14, fontWeight: 'bold' }}>QUEST COMPLETE!</div>
            <div style={{ fontSize: 10 }}>Final Score: {score}</div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="lo-pixel-controls">
        {/* D-pad */}
        <div className="lo-pixel-dpad">
          <div />
          <button className="lo-pixel-dpad-btn" onClick={() => move(0, -1)}>↑</button>
          <div />
          <button className="lo-pixel-dpad-btn" onClick={() => move(-1, 0)}>←</button>
          <div className="lo-pixel-dpad-btn lo-pixel-dpad-center" />
          <button className="lo-pixel-dpad-btn" onClick={() => move(1, 0)}>→</button>
          <div />
          <button className="lo-pixel-dpad-btn" onClick={() => move(0, 1)}>↓</button>
          <div />
        </div>

        {/* A/B buttons */}
        <div className="lo-pixel-ab">
          {(phase === 'gameOver' || phase === 'allClear') && (
            <button className="lo-pixel-ab-btn btn-a" onClick={restart}>A</button>
          )}
          {phase === 'playing' && (
            <button
              className="lo-pixel-ab-btn btn-b"
              onClick={() => setMessage(levels[currentLevel]?.question || '')}
            >
              B
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
