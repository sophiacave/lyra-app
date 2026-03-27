'use client';
import { useState } from 'react';
import { QUALITY_DIMENSIONS } from '../../../lib/exercise-engine';

/**
 * QualityGrader v2 — Encouraging, collapsible prompt quality feedback.
 *
 * Changes from v1:
 * - Emoji tiers instead of letter grades (🌟 ⚡ 👍 🌱 →)
 * - Collapsible by default — shows tip only, expand for details
 * - Softer language throughout
 * - Celebrates attempts, not just high scores
 */

const TIER_LABELS = {
  '🌟': 'Excellent',
  '⚡': 'Great',
  '👍': 'Good',
  '🌱': 'Growing',
  '→': 'Keep going',
};

export default function QualityGrader({ result }) {
  const [expanded, setExpanded] = useState(false);

  if (!result || result.overall === 0) return null;

  const tierLabel = TIER_LABELS[result.grade] || 'Keep going';

  return (
    <div className="lo-grader">
      {/* Collapsed: just the tip + tier */}
      <button
        className="lo-grader-header"
        onClick={() => setExpanded(!expanded)}
        style={{ cursor: 'pointer', width: '100%', background: 'none', border: 'none', padding: 0 }}
      >
        <span className="lo-grader-grade" style={{ fontSize: '1.1rem' }}>
          {result.grade}
        </span>
        <span className="lo-grader-label">{tierLabel}</span>
        <span className="lo-grader-score" style={{ opacity: 0.5, fontSize: '0.75rem' }}>
          {result.overall}/100
        </span>
        <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--dim)' }}>
          {expanded ? '▾' : '▸'}
        </span>
      </button>

      {/* Expanded: dimension bars */}
      {expanded && (
        <div className="lo-grader-bars" style={{ marginTop: '0.5rem' }}>
          {QUALITY_DIMENSIONS.map(dim => {
            const val = result.dimensions[dim.key] || 0;
            return (
              <div key={dim.key} className="lo-grader-row">
                <span className="lo-grader-dim-label">{dim.label}</span>
                <div className="lo-grader-bar-track">
                  <div
                    className="lo-grader-bar-fill"
                    style={{
                      width: `${val}%`,
                      background: val >= 75 ? 'var(--status-success)' : val >= 40 ? 'var(--accent-blue)' : 'var(--accent-warm)',
                    }}
                  />
                </div>
                <span className="lo-grader-dim-val">{val}</span>
              </div>
            );
          })}
        </div>
      )}

      {result.feedback && (
        <div className="lo-grader-tip">
          <span className="lo-grader-tip-icon">💡</span>
          {result.feedback}
        </div>
      )}
    </div>
  );
}
