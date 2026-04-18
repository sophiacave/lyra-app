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
          <div className="impact-status-number">${data.totalAccrued.toFixed(2)}</div>
          <div className="impact-status-label">Total Accrued for Research</div>
        </div>
      </div>

      {recipientNames.length > 0 && (
        <div className="impact-status-recipients">
          {recipientNames.map(name => (
            <div key={name} className="impact-recipient-stat">
              <span className="impact-recipient-stat-name">{name}</span>
              <span className="impact-recipient-stat-amount">
                ${data.recipients[name].accrued?.toFixed(2) || '0.00'} accrued
                {data.recipients[name].donated > 0 && ` / $${data.recipients[name].donated.toFixed(2)} donated`}
              </span>
            </div>
          ))}
        </div>
      )}

      {data.ledgerRows > 0 && (
        <div className="impact-status-meta">
          {data.ledgerRows} transactions tracked
          {data.lastSync && ` \u00B7 Last updated ${new Date(data.lastSync).toLocaleDateString()}`}
        </div>
      )}
    </div>
  );
}
