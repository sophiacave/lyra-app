'use client';

const BADGE_STYLES = {
  earned: {
    container: 'badge-earned',
    glow: true,
  },
  locked: {
    container: 'badge-locked',
    glow: false,
  },
};

export default function AchievementBadge({ emoji, name, desc, earned = false, rare = false }) {
  const style = earned ? BADGE_STYLES.earned : BADGE_STYLES.locked;

  return (
    <div className={`achievement-badge ${style.container} ${rare ? 'badge-rare' : ''} liquid-card`}>
      <div className="badge-emoji">{earned ? emoji : '🔒'}</div>
      <div className="badge-name">{name}</div>
      {earned && <div className="badge-desc">{desc}</div>}
      {rare && earned && <div className="badge-rare-tag">RARE</div>}
    </div>
  );
}
