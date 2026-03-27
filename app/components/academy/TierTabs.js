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
          style={{
            background: activeTier === tier.slug
              ? 'linear-gradient(135deg, #c084fc, #38bdf8)'
              : 'rgba(17,17,20,0.8)',
            border: activeTier === tier.slug
              ? 'none'
              : '1px solid #1e1e28',
            borderRadius: '10px',
            padding: '10px 18px',
            color: activeTier === tier.slug ? '#08080a' : '#a0a0a0',
            fontWeight: activeTier === tier.slug ? 700 : 500,
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {tier.emoji} {tier.label}
        </button>
      ))}
    </div>
  );
}
