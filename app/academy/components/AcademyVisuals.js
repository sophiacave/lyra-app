'use client';

import React, { useState, useEffect, useRef } from 'react';

const styles = `
  /* Global Animation Definitions */
  @keyframes float {
    0%, 100% { transform: translate(0, 0); }
    25% { transform: translate(20px, -20px); }
    50% { transform: translate(-10px, 10px); }
    75% { transform: translate(15px, 5px); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }

  @keyframes glow {
    0%, 100% { box-shadow: 0 0 20px rgba(0, 206, 201, 0.5); }
    50% { box-shadow: 0 0 40px rgba(0, 206, 201, 0.8); }
  }

  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @keyframes gridPulse {
    0%, 100% { opacity: 0.1; }
    50% { opacity: 0.3; }
  }

  @keyframes meshFlow {
    0% { background-position: 0% 0%; }
    100% { background-position: 200% 200%; }
  }

  @keyframes particleFloat {
    0% {
      opacity: 1;
      transform: translate(0, 0);
    }
    100% {
      opacity: 0;
      transform: translate(var(--tx), var(--ty));
    }
  }

  @keyframes slideIn {
    0% { transform: translateX(-100%); opacity: 0; }
    100% { transform: translateX(0); opacity: 1; }
  }

  @keyframes shine {
    0% { left: -100%; }
    100% { left: 100%; }
  }

  @keyframes liftHover {
    0% { transform: translateY(0); }
    100% { transform: translateY(-20px); }
  }

  @keyframes floatUp {
    0% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    100% {
      opacity: 0;
      transform: translateY(-100px) scale(0.5);
    }
  }

  @keyframes burst {
    0% {
      opacity: 1;
      transform: translate(0, 0) scale(1);
    }
    100% {
      opacity: 0;
      transform: translate(var(--px), var(--py)) scale(0);
    }
  }

  @keyframes flame {
    0% {
      height: 100%;
      opacity: 1;
    }
    100% {
      height: 0;
      opacity: 0;
    }
  }

  @keyframes flameDance {
    0%, 100% { transform: scaleX(1) scaleY(1); }
    25% { transform: scaleX(1.1) scaleY(0.95); }
    50% { transform: scaleX(0.9) scaleY(1.05); }
    75% { transform: scaleX(1.05) scaleY(0.9); }
  }

  @keyframes firePulse {
    0%, 100% { box-shadow: 0 0 10px rgba(255, 107, 0, 0.4); }
    50% { box-shadow: 0 0 30px rgba(255, 107, 0, 0.8); }
  }

  @keyframes counterIncrement {
    0% { transform: scale(0.5); opacity: 0; }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); opacity: 1; }
  }

  @keyframes confetti {
    0% {
      opacity: 1;
      transform: translate(0, 0) rotateZ(0deg);
    }
    100% {
      opacity: 0;
      transform: translate(var(--cx), var(--cy)) rotateZ(720deg);
    }
  }

  @keyframes levelUpScale {
    0% { transform: scale(0) translateY(100px); opacity: 0; }
    50% { transform: scale(1.15); }
    100% { transform: scale(1); opacity: 1; }
  }

  @keyframes levelUpGlow {
    0%, 100% { text-shadow: 0 0 20px rgba(0, 206, 201, 0.5), 0 0 40px rgba(232, 67, 147, 0.3); }
    50% { text-shadow: 0 0 40px rgba(0, 206, 201, 0.8), 0 0 60px rgba(232, 67, 147, 0.6); }
  }

  @keyframes ringFill {
    from { stroke-dashoffset: var(--circumference); }
    to { stroke-dashoffset: 0; }
  }

  @keyframes unlock {
    0% { transform: scale(0) rotate(-180deg); opacity: 0; }
    50% { transform: scale(1.15) rotate(10deg); }
    100% { transform: scale(1) rotate(0deg); opacity: 1; }
  }

  @keyframes unlockGlow {
    0% { box-shadow: 0 0 0 rgba(255, 215, 0, 0); }
    50% { box-shadow: 0 0 30px rgba(255, 215, 0, 0.8); }
    100% { box-shadow: 0 0 0 rgba(255, 215, 0, 0); }
  }

  @keyframes pulseGray {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.7; }
  }

  @keyframes playPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.15); }
  }

  @keyframes waveRing {
    0% {
      opacity: 1;
      transform: scale(0.5);
    }
    100% {
      opacity: 0;
      transform: scale(2);
    }
  }

  @keyframes cursorBlink {
    0%, 49%, 100% { opacity: 1; }
    50%, 99% { opacity: 0; }
  }

  @keyframes questionRotate {
    0%, 100% { transform: rotateZ(-10deg); }
    50% { transform: rotateZ(10deg); }
  }

  @keyframes cardSwap {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(40px); }
  }

  @keyframes cardSwapReturn {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(-40px); }
  }

  @keyframes gearSpin {
    0% { transform: rotateZ(0deg); }
    100% { transform: rotateZ(360deg); }
  }

  @keyframes orbitRotate {
    0% { transform: rotateZ(0deg); }
    100% { transform: rotateZ(360deg); }
  }

  @keyframes orbitDot1 {
    0% { transform: translate(20px, 0) rotateZ(0deg); }
    100% { transform: translate(20px, 0) rotateZ(360deg); }
  }

  /* Component Styles */
  .academy-hero-bg {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #0a0a0f;
    overflow: hidden;
  }

  .grid-lines {
    position: absolute;
    width: 100%;
    height: 100%;
    background-image:
      linear-gradient(0deg, rgba(0, 206, 201, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 206, 201, 0.1) 1px, transparent 1px);
    background-size: 50px 50px;
    animation: gridPulse 4s ease-in-out infinite;
  }

  .mesh-gradient {
    position: absolute;
    width: 200%;
    height: 200%;
    background: 
      radial-gradient(circle at 20% 30%, rgba(0, 206, 201, 0.2) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(232, 67, 147, 0.2) 0%, transparent 50%);
    animation: meshFlow 15s ease-in-out infinite;
  }

  .particles-container {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .particle {
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    pointer-events: none;
  }

  .particle.teal {
    background: #00cec9;
    box-shadow: 0 0 10px rgba(0, 206, 201, 0.8);
  }

  .particle.pink {
    background: #e84393;
    box-shadow: 0 0 10px rgba(232, 67, 147, 0.8);
  }

  .course-card {
    position: relative;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(0, 206, 201, 0.2);
    border-radius: 12px;
    padding: 24px;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    overflow: hidden;
  }

  .course-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(0, 206, 201, 0), rgba(0, 206, 201, 0.1), rgba(232, 67, 147, 0.1), rgba(0, 206, 201, 0));
    background-size: 200% 200%;
    animation: gradientShift 3s ease infinite;
    pointer-events: none;
  }

  .course-card:hover {
    transform: translateY(-20px);
    border-color: rgba(0, 206, 201, 0.5);
    backdrop-filter: blur(20px);
    background: rgba(255, 255, 255, 0.08);
  }

  .course-card:hover .card-glow {
    opacity: 1;
  }

  .course-card:hover .shine-effect {
    animation: shine 0.6s ease-in-out;
  }

  .card-glow {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, rgba(0, 206, 201, 0.2), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
    border-radius: 12px;
    pointer-events: none;
  }

  .shine-effect {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    pointer-events: none;
  }

  .card-content {
    position: relative;
    z-index: 2;
  }

  .xp-burst-container {
    position: fixed;
    pointer-events: none;
  }

  .xp-text {
    font-size: 32px;
    font-weight: bold;
    color: #00cec9;
    text-shadow: 0 0 20px rgba(0, 206, 201, 0.8);
    animation: floatUp 2s ease-out forwards;
  }

  .xp-particle {
    position: absolute;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    pointer-events: none;
  }

  .xp-particle.teal {
    background: #00cec9;
    box-shadow: 0 0 8px rgba(0, 206, 201, 0.8);
  }

  .xp-particle.pink {
    background: #e84393;
    box-shadow: 0 0 8px rgba(232, 67, 147, 0.8);
  }

  .streak-counter {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(0, 206, 201, 0.2);
    border-radius: 8px;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
  }

  .streak-counter.active {
    border-color: rgba(255, 107, 0, 0.5);
    background: rgba(255, 107, 0, 0.05);
  }

  .flame-container {
    position: relative;
    width: 32px;
    height: 40px;
    overflow: hidden;
  }

  .flame {
    position: absolute;
    width: 100%;
    height: 100%;
    animation: flameDance 0.8s ease-in-out infinite;
  }

  .flame-layer-1 {
    background: linear-gradient(180deg, rgba(255, 107, 0, 0.8), rgba(255, 150, 0, 0.5), transparent);
    border-radius: 50% 50% 50% 20%;
    transform: rotate(-45deg);
  }

  .flame-layer-2 {
    background: linear-gradient(180deg, rgba(255, 200, 0, 0.6), rgba(255, 107, 0, 0.3), transparent);
    border-radius: 50% 50% 30% 50%;
    transform: rotate(45deg) scaleX(0.8);
  }

  .flame-layer-3 {
    background: linear-gradient(180deg, rgba(255, 150, 0, 0.4), transparent);
    border-radius: 50%;
    filter: blur(4px);
  }

  .streak-counter.active .flame {
    animation: flameDance 0.6s ease-in-out infinite;
  }

  .streak-counter.active .flame-glow {
    animation: firePulse 1s ease-in-out infinite;
  }

  .flame-glow {
    position: absolute;
    inset: -10px;
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(255, 107, 0, 0.4);
    pointer-events: none;
  }

  .streak-number {
    font-size: 24px;
    font-weight: bold;
    color: #ffffff;
    animation: counterIncrement 0.5s ease-out;
  }

  .streak-counter.dormant .streak-number {
    color: rgba(255, 255, 255, 0.4);
  }

  .level-up-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    pointer-events: none;
  }

  .level-up-content {
    text-align: center;
  }

  .level-up-text {
    font-size: 72px;
    font-weight: bold;
    color: #00cec9;
    animation: levelUpScale 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards, levelUpGlow 2s ease-in-out infinite;
    text-transform: uppercase;
    letter-spacing: 4px;
    margin-bottom: 20px;
  }

  .level-number {
    font-size: 48px;
    color: #e84393;
    font-weight: bold;
    animation: levelUpScale 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s forwards;
  }

  .confetti {
    position: absolute;
    width: 10px;
    height: 10px;
    pointer-events: none;
  }

  .confetti-piece {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  .confetti-piece.teal {
    background: #00cec9;
  }

  .confetti-piece.pink {
    background: #e84393;
  }

  .progress-ring-container {
    position: relative;
    width: 200px;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .progress-ring {
    transform: rotate(-90deg);
  }

  .progress-ring-circle {
    transition: stroke-dashoffset 0.5s ease;
    stroke-linecap: round;
  }

  .progress-text {
    position: absolute;
    font-size: 28px;
    font-weight: bold;
    color: #00cec9;
    text-shadow: 0 0 10px rgba(0, 206, 201, 0.5);
  }

  .achievement-badge {
    position: relative;
    width: 120px;
    height: 120px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
  }

  .achievement-badge.locked {
    border: 2px solid rgba(255, 255, 255, 0.1);
    filter: grayscale(100%);
    animation: pulseGray 2s ease-in-out infinite;
  }

  .achievement-badge.unlocked {
    border: 2px solid rgba(255, 215, 0, 0.6);
    animation: unlock 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards, unlockGlow 0.8s ease-out;
  }

  .badge-icon {
    font-size: 48px;
  }

  .badge-info {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: #fff;
    z-index: 10;
  }

  .badge-title {
    font-size: 12px;
    font-weight: bold;
    margin-top: 8px;
  }

  .lesson-type-icon {
    position: relative;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon-play {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .play-triangle {
    width: 0;
    height: 0;
    border-left: 12px solid transparent;
    border-right: 0px solid transparent;
    border-bottom: 20px solid #00cec9;
    animation: playPulse 0.8s ease-in-out infinite;
    filter: drop-shadow(0 0 8px rgba(0, 206, 201, 0.6));
  }

  .wave-ring {
    position: absolute;
    inset: 0;
    border: 2px solid rgba(0, 206, 201, 0.6);
    border-radius: 50%;
    animation: waveRing 1.2s ease-out infinite;
    pointer-events: none;
  }

  .wave-ring:nth-child(2) {
    animation-delay: 0.3s;
  }

  .wave-ring:nth-child(3) {
    animation-delay: 0.6s;
  }

  .icon-code {
    width: 24px;
    height: 24px;
    border: 2px solid #00cec9;
    border-radius: 4px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .code-cursor {
    width: 2px;
    height: 12px;
    background: #00cec9;
    animation: cursorBlink 1s step-end infinite;
  }

  .icon-question {
    font-size: 32px;
    color: #00cec9;
    animation: questionRotate 2s ease-in-out infinite;
    filter: drop-shadow(0 0 8px rgba(0, 206, 201, 0.5));
  }

  .icon-cards {
    display: flex;
    gap: 6px;
    align-items: center;
    justify-content: center;
  }

  .card-1 {
    width: 16px;
    height: 20px;
    background: #00cec9;
    border-radius: 3px;
    animation: cardSwap 1.5s ease-in-out infinite;
  }

  .card-2 {
    width: 16px;
    height: 20px;
    background: #e84393;
    border-radius: 3px;
    animation: cardSwapReturn 1.5s ease-in-out infinite;
  }

  .icon-gear {
    position: relative;
    width: 24px;
    height: 24px;
  }

  .gear {
    width: 24px;
    height: 24px;
    fill: none;
    stroke: #00cec9;
    stroke-width: 2;
    animation: gearSpin 3s linear infinite;
    filter: drop-shadow(0 0 6px rgba(0, 206, 201, 0.5));
  }

  .orbit-container {
    position: absolute;
    inset: 0;
  }

  .orbit-dot {
    position: absolute;
    width: 4px;
    height: 4px;
    background: #e84393;
    border-radius: 50%;
    filter: drop-shadow(0 0 4px rgba(232, 67, 147, 0.8));
    animation: orbitRotate 3s linear infinite;
  }

  .orbit-dot:nth-child(1) {
    animation-delay: 0s;
    top: 50%;
    left: 50%;
    margin: -2px 0 0 10px;
  }

  .orbit-dot:nth-child(2) {
    animation-delay: -1s;
    top: 50%;
    left: 50%;
    margin: -2px 0 0 10px;
  }

  .orbit-dot:nth-child(3) {
    animation-delay: -2s;
    top: 50%;
    left: 50%;
    margin: -2px 0 0 10px;
  }
`;

// Animated Hero Background Component
export function AnimatedHeroBackground() {
  const [particles, setParticles] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const particleCount = 40;
    const newParticles = Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      type: Math.random() > 0.5 ? 'teal' : 'pink',
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 2,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="academy-hero-bg">
      <style>{styles}</style>
      <div className="mesh-gradient" />
      <div className="grid-lines" />
      <div className="particles-container" ref={containerRef}>
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={`particle ${particle.type}`}
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animation: `float ${particle.duration}s infinite ease-in-out`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Course Card with Glow Component
export function CourseCardGlow({ title, children, onClick }) {
  return (
    <div className="course-card" onClick={onClick}>
      <style>{styles}</style>
      <div className="card-glow" />
      <div className="shine-effect" />
      <div className="card-content">
        <h3 style={{ color: '#ffffff', marginTop: 0 }}>{title}</h3>
        {children}
      </div>
    </div>
  );
}

// XP Burst Animation Component
export function XPBurst({ xp = 50, x = 0, y = 0, onAnimate }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    onAnimate?.();

    const burstParticles = Array.from({ length: 12 }).map((_, i) => {
      const angle = (i / 12) * Math.PI * 2;
      const distance = 60 + Math.random() * 40;
      return {
        id: i,
        angle,
        distance,
        type: i % 2 === 0 ? 'teal' : 'pink',
        duration: 1.5 + Math.random() * 0.5,
      };
    });

    setParticles(burstParticles);
  }, [xp, onAnimate]);

  return (
    <div className="xp-burst-container" style={{ left: x, top: y }}>
      <style>{styles}</style>
      <div className="xp-text">+{xp} XP</div>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`xp-particle ${particle.type}`}
          style={{
            '--px': `${Math.cos(particle.angle) * particle.distance}px`,
            '--py': `${Math.sin(particle.angle) * particle.distance}px`,
            left: 0,
            top: 0,
            animation: `burst ${particle.duration}s ease-out forwards`,
          }}
        />
      ))}
    </div>
  );
}

// Streak Fire Component
export function StreakFire({ count = 0, isActive = false }) {
  const [displayCount, setDisplayCount] = useState(count);

  useEffect(() => {
    setDisplayCount(count);
  }, [count]);

  return (
    <div className={`streak-counter ${isActive ? 'active' : 'dormant'}`}>
      <style>{styles}</style>
      <div className="flame-container">
        <div className="flame-glow" />
        <div className="flame flame-layer-1" />
        <div className="flame flame-layer-2" />
        <div className="flame flame-layer-3" />
      </div>
      <div className="streak-number">{displayCount}</div>
    </div>
  );
}

// Level Up Celebration Component
export function LevelUpCelebration({ level = 5, onComplete }) {
  const [confetti, setConfetti] = useState([]);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const confettiPieces = Array.from({ length: 50 }).map((_, i) => {
      const angle = (Math.random() * Math.PI * 2);
      const velocity = 200 + Math.random() * 400;
      return {
        id: i,
        cx: Math.cos(angle) * velocity,
        cy: Math.sin(angle) * velocity - 200,
        type: Math.random() > 0.5 ? 'teal' : 'pink',
        duration: 2.5 + Math.random() * 0.5,
        delay: Math.random() * 0.2,
      };
    });

    setConfetti(confettiPieces);

    timeoutRef.current = setTimeout(() => {
      onComplete?.();
    }, 3000);

    return () => clearTimeout(timeoutRef.current);
  }, [onComplete]);

  return (
    <div className="level-up-overlay">
      <style>{styles}</style>
      <div className="level-up-content">
        <div className="level-up-text">LEVEL UP!</div>
        <div className="level-number">Level {level}</div>
      </div>
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="confetti"
          style={{
            left: '50%',
            top: '50%',
            '--cx': `${piece.cx}px`,
            '--cy': `${piece.cy}px`,
            animation: `confetti ${piece.duration}s ease-out forwards`,
            animationDelay: `${piece.delay}s`,
          }}
        >
          <div className={`confetti-piece ${piece.type}`} />
        </div>
      ))}
    </div>
  );
}

// Progress Ring Component
export function ProgressRing({ value = 65, max = 100 }) {
  const radius = 45;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / max) * circumference;

  return (
    <div className="progress-ring-container">
      <style>{styles}</style>
      <svg className="progress-ring" width="200" height="200">
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00cec9" />
            <stop offset="100%" stopColor="#e84393" />
          </linearGradient>
        </defs>
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="6"
        />
        <circle
          className="progress-ring-circle"
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="url(#ringGradient)"
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ '--circumference': circumference }}
        />
      </svg>
      <div className="progress-text">{value}%</div>
    </div>
  );
}

// Achievement Badge Component
export function AchievementBadge({ icon = '⭐', title = 'Achievement', isUnlocked = false }) {
  return (
    <div className={`achievement-badge ${isUnlocked ? 'unlocked' : 'locked'}`}>
      <style>{styles}</style>
      <div className="badge-icon">{icon}</div>
      {isUnlocked && <div className="badge-info"><div className="badge-title">{title}</div></div>}
    </div>
  );
}

// Lesson Type Icon Components
export function LessonTypeIcon({ type = 'animated' }) {
  return (
    <div className="lesson-type-icon">
      <style>{styles}</style>
      {type === 'animated' && (
        <div className="icon-play">
          <div className="play-triangle" />
          <div className="wave-ring" />
          <div className="wave-ring" />
          <div className="wave-ring" />
        </div>
      )}
      {type === 'interactive_code' && (
        <div className="icon-code">
          <div className="code-cursor" />
        </div>
      )}
      {type === 'quiz' && (
        <div className="icon-question">?</div>
      )}
      {type === 'drag_drop' && (
        <div className="icon-cards">
          <div className="card-1" />
          <div className="card-2" />
        </div>
      )}
      {type === 'simulation' && (
        <div className="icon-gear">
          <svg className="gear" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1 L14 8 L21 10 L16 15 L17 22 L12 19 L7 22 L8 15 L3 10 L10 8 Z" />
          </svg>
          <div className="orbit-container">
            <div className="orbit-dot" />
            <div className="orbit-dot" />
            <div className="orbit-dot" />
          </div>
        </div>
      )}
    </div>
  );
}

// Default export for convenience
export default {
  AnimatedHeroBackground,
  CourseCardGlow,
  XPBurst,
  StreakFire,
  LevelUpCelebration,
  ProgressRing,
  AchievementBadge,
  LessonTypeIcon,
};
