'use client';

export default function AccountError({ error, reset }) {
  return (
    <div className="site-page">
      <div className="lo-error-page">
        <div className="lo-card lo-card--glass lo-card--pad-lg">
          <h2 className="lo-error-title">Something went wrong</h2>
          <p className="lo-error-desc">
            {error?.message || 'Could not load your account. Please try again.'}
          </p>
          <button onClick={reset} className="lo-btn lo-btn--accent lo-btn--md">
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
