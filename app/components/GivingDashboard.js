'use client';

import { useState, useEffect } from 'react';

export default function GivingDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/giving')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(setData)
      .catch(() => setError(true));
  }, []);

  if (error || !data) {
    return (
      <div className="impact-status-card">
        <div className="impact-status-row">
          <div className="impact-status-item">
            <div className="impact-status-number">1%</div>
            <div className="impact-status-label">Current Giving Rate</div>
          </div>
          <div className="impact-status-divider" />
          <div className="impact-status-item">
            <div className="impact-status-number">Seed</div>
            <div className="impact-status-label">Current Tier</div>
          </div>
          <div className="impact-status-divider" />
          <div className="impact-status-item">
            <div className="impact-status-number">50%</div>
            <div className="impact-status-label">Goal at Convergence</div>
          </div>
        </div>
      </div>
    );
  }

  const tierLabel = data.currentTier.charAt(0).toUpperCase() + data.currentTier.slice(1);
  const recipientNames = Object.keys(data.recipients);

  // Only surface recipient donation amounts when real money has been moved.
  // Accrued-but-not-yet-donated numbers are suppressed (too low + inaccurate during Seed tier).
  const recipientsWithDonations = recipientNames.filter(
    n => (data.recipients[n]?.donated || 0) > 0
  );

  return (
    <div className="impact-status-card">
      <div className="impact-status-row">
        <div className="impact-status-item">
          <div className="impact-status-number">{data.currentPct}%</div>
          <div className="impact-status-label">Current Giving Rate</div>
        </div>
        <div className="impact-status-divider" />
        <div className="impact-status-item">
          <div className="impact-status-number">{tierLabel}</div>
          <div className="impact-status-label">Current Tier</div>
        </div>
        <div className="impact-status-divider" />
        <div className="impact-status-item">
          <div className="impact-status-number">50%</div>
          <div className="impact-status-label">Goal at Convergence</div>
        </div>
      </div>

      {recipientsWithDonations.length > 0 && (
        <div className="impact-status-recipients">
          {recipientsWithDonations.map(name => (
            <div key={name} className="impact-recipient-stat">
              <span className="impact-recipient-stat-name">{name}</span>
              <span className="impact-recipient-stat-amount">
                ${data.recipients[name].donated.toFixed(2)} donated
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
