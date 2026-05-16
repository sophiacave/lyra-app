'use client';

export default function ToolsError({ error, reset }) {
  return (
    <div className="site-page">
      <div className="lo-skeleton-page" style={{ textAlign: 'center' }}>
        <div className="lo-card lo-card--glass lo-card--pad-lg">
          <h2 style={{ fontSize: 'var(--font-xl)', marginBottom: 'var(--space-3)' }}>
            Something went wrong
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
            {error?.message || 'An unexpected error occurred.'}
          </p>
          <button onClick={reset} className="lo-btn lo-btn--accent lo-btn--md">
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
