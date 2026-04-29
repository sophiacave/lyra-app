'use client';

const TIERS = [
  { slug: 'all', label: 'All Courses', emoji: '📚' },
  { slug: 'beginner', label: 'Beginner', emoji: '🌱' },
  { slug: 'intermediate', label: 'Intermediate', emoji: '🔧' },
  { slug: 'advanced', label: 'Advanced', emoji: '🚀' },
];

export default function TierTabs({ activeTier, onTierChange }) {
  return (
    <div className="liquid-tabs" role="tablist" aria-label="Filter courses by tier">
      {TIERS.map(tier => (
        <button
          key={tier.slug}
          id={`tab-${tier.slug}`}
          onClick={() => onTierChange(tier.slug)}
          className={`liquid-btn ${activeTier === tier.slug ? 'active' : ''}`}
          role="tab"
          aria-selected={activeTier === tier.slug}
          aria-controls="course-grid"
          tabIndex={activeTier === tier.slug ? 0 : -1}
        >
          {tier.emoji} {tier.label}
        </button>
      ))}
    </div>
  );
}
