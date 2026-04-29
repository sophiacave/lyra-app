'use client';

const TIERS = [
  { slug: 'all', label: 'All' },
  { slug: 'beginner', label: 'Beginner' },
  { slug: 'intermediate', label: 'Intermediate' },
  { slug: 'advanced', label: 'Advanced' },
];

export default function TierTabs({ activeTier, onTierChange }) {
  return (
    <div className="liquid-segmented" role="tablist" aria-label="Filter courses by tier">
      {TIERS.map(tier => (
        <button
          key={tier.slug}
          id={`tab-${tier.slug}`}
          onClick={() => onTierChange(tier.slug)}
          className={`liquid-segmented-item ${activeTier === tier.slug ? 'active' : ''}`}
          role="tab"
          aria-selected={activeTier === tier.slug}
          aria-controls="course-grid"
          tabIndex={activeTier === tier.slug ? 0 : -1}
        >
          {tier.label}
        </button>
      ))}
    </div>
  );
}
