'use client';

export default function StreakDisplay({ current = 0, best = 0 }) {
  const flames = current >= 30 ? '💎' : current >= 7 ? '⚔️' : current >= 3 ? '🔥' : current >= 1 ? '✨' : '💤';

  return (
    <div className="streak-display liquid-card">
      <div className="streak-main">
        <span className="streak-icon">{flames}</span>
        <span className="streak-count">{current}</span>
        <span className="streak-label">day streak</span>
      </div>
      {best > current && (
        <div className="streak-best">Best: {best} days</div>
      )}
    </div>
  );
}
