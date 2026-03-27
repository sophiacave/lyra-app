'use client';
import { useState, useEffect } from 'react';

/**
 * CSS-only celebration effects. No heavy libraries.
 * Shows particles + glow on exercise/course completion.
 */
export default function CelebrationEffects({ trigger, type = 'exercise' }) {
  const [active, setActive] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!trigger) return;
    setActive(true);

    // Generate particles
    const count = type === 'course' ? 30 : 12;
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: 40 + Math.random() * 20,     // start near center
      y: 50,
      dx: (Math.random() - 0.5) * 120, // spread horizontally
      dy: -30 - Math.random() * 60,     // go up
      size: 3 + Math.random() * 5,
      color: ['#c084fc', '#38bdf8', '#e879f9', '#4ade80', '#fb923c'][Math.floor(Math.random() * 5)],
      delay: Math.random() * 0.3,
      duration: 0.8 + Math.random() * 0.6,
    }));
    setParticles(newParticles);

    const timer = setTimeout(() => {
      setActive(false);
      setParticles([]);
    }, type === 'course' ? 2500 : 1500);

    return () => clearTimeout(timer);
  }, [trigger, type]);

  if (!active) return null;

  return (
    <div className="lo-celebration" aria-hidden="true">
      {/* Center glow */}
      <div className={`lo-celebration-glow ${type === 'course' ? 'lo-celebration-glow-big' : ''}`} />

      {/* Particles */}
      {particles.map(p => (
        <div
          key={p.id}
          className="lo-celebration-particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            '--dx': `${p.dx}px`,
            '--dy': `${p.dy}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}

      {/* Star burst for course completion */}
      {type === 'course' && (
        <div className="lo-celebration-star">✦</div>
      )}
    </div>
  );
}
