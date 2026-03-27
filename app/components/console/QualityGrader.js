'use client';
import { QUALITY_DIMENSIONS } from '../../../lib/exercise-engine';

export default function QualityGrader({ result }) {
  if (!result || result.overall === 0) return null;

  const gradeColor = {
    A: 'var(--status-success)',
    B: 'var(--accent-blue)',
    C: 'var(--status-warning)',
    D: 'var(--accent-warm)',
    F: 'var(--status-error)',
  }[result.grade] || 'var(--text-tertiary)';

  return (
    <div className="lo-grader">
      <div className="lo-grader-header">
        <span className="lo-grader-label">Prompt Quality</span>
        <span className="lo-grader-grade" style={{ color: gradeColor }}>
          {result.grade}
        </span>
        <span className="lo-grader-score">{result.overall}/100</span>
      </div>

      <div className="lo-grader-bars">
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
                    background: val >= 75 ? 'var(--status-success)' : val >= 40 ? 'var(--accent-blue)' : 'var(--status-error)',
                  }}
                />
              </div>
              <span className="lo-grader-dim-val">{val}</span>
            </div>
          );
        })}
      </div>

      {result.feedback && (
        <div className="lo-grader-tip">
          <span className="lo-grader-tip-icon">💡</span>
          {result.feedback}
        </div>
      )}
    </div>
  );
}
