'use client';

const TIERS = [
  { slug: 'all', label: 'All Courses', emoji: '📚' },
  { slug: 'beginner', label: 'Beginner', emoji: '🌱' },
  { slug: 'intermediate', label: 'Intermediate', emoji: '🔧' },
  { slug: 'advanced', label: 'Advanced', emoji: '🚀' },
];

export default function TierTabs({ activeTier, onTierChange }) {
  return (
    <div style={{
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
      marginBottom: '32px',
    }}>
      {TIERS.map(tier => (
        <button
          key={tier.slug}
          onClick={() => onTierChange(tier.slug)}
          className={`glass-btn ${activeTier === tier.slug ? 'active' : ''}`}
        >
          {tier.emoji} {tier.label}
        </button>
      ))}
    </div>
  );
}
