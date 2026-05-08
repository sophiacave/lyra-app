'use client';

const LEVELS = [
  { level: 1, xp: 0, name: 'Novice', emoji: '🌱' },
  { level: 2, xp: 100, name: 'Explorer', emoji: '🔭' },
  { level: 3, xp: 300, name: 'Practitioner', emoji: '⚡' },
  { level: 4, xp: 600, name: 'Builder', emoji: '🔧' },
  { level: 5, xp: 1000, name: 'Architect', emoji: '🏗️' },
  { level: 6, xp: 1500, name: 'Master', emoji: '🎯' },
  { level: 7, xp: 2500, name: 'Visionary', emoji: '🔮' },
  { level: 8, xp: 4000, name: 'Sage', emoji: '🧠' },
  { level: 9, xp: 6000, name: 'Legend', emoji: '⭐' },
  { level: 10, xp: 10000, name: 'Transcendent', emoji: '✦' },
];

function getLevel(xp) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xp) return LEVELS[i];
  }
  return LEVELS[0];
}

function getNextLevel(xp) {
  for (const level of LEVELS) {
    if (xp < level.xp) return level;
  }
  return null;
}

export default function LevelProgress({ xp = 0 }) {
  const current = getLevel(xp);
  const next = getNextLevel(xp);
  const progress = next
    ? ((xp - current.xp) / (next.xp - current.xp)) * 100
    : 100;

  return (
    <div className="level-progress liquid-card">
      <div className="level-header">
        <span className="level-emoji">{current.emoji}</span>
        <span className="level-name">Level {current.level}: {current.name}</span>
        <span className="level-xp">{xp.toLocaleString()} XP</span>
      </div>
      <div className="level-bar">
        <div className="level-bar-fill" style={{ width: `${progress}%` }} />
      </div>
      {next && (
        <div className="level-next">
          {next.xp - xp} XP to {next.name} {next.emoji}
        </div>
      )}
    </div>
  );
}
