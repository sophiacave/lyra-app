'use client';
import { useState } from 'react';
import { pricing } from '@/lib/pricing';

export default function EnrollCTA({ context = 'inline' }) {
  const [showModal, setShowModal] = useState(false);

  if (context === 'inline') {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          className="academy-enroll-trigger lo-hide-pro"
        >
          <span className="academy-enroll-emoji">✨</span>
          <span>Unlock All Lessons — Academy Pro</span>
        </button>

        {showModal && <EnrollModal onClose={() => setShowModal(false)} />}
      </>
    );
  }

  return null;
}

function EnrollModal({ onClose }) {
  const { monthly, annual } = pricing.pro;

  return (
    <div onClick={onClose} className="glass-modal-backdrop">
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass-modal glass-animate-up enroll-modal"
      >
        <button onClick={onClose} className="academy-modal-close">✕</button>

        <div className="academy-modal-header">
          <div className="academy-modal-emoji">✨</div>
          <h2 className="academy-modal-title">Academy Pro</h2>
          <p className="academy-modal-desc">
            Unlock every lesson, every course, every download.
            New courses added weekly.
          </p>
        </div>

        <div className="academy-pricing-stack">
          <a
            href={monthly.checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="academy-pricing-card"
          >
            <div>
              <div className="academy-pricing-name">Monthly</div>
              <div className="academy-pricing-sub">Cancel anytime</div>
            </div>
            <div>
              <span className="academy-pricing-amount">
                ${monthly.amount}<span className="academy-pricing-period">/mo</span>
              </span>
            </div>
          </a>

          <a
            href={annual.checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="academy-pricing-card recommended"
          >
            <span className="academy-pricing-save">SAVE {annual.savePct}%</span>
            <div>
              <div className="academy-pricing-name">Annual</div>
              <div className="academy-pricing-sub">Best value — {annual.monthlyEquiv}</div>
            </div>
            <div>
              <span className="academy-pricing-amount gradient">
                ${annual.amount}<span className="academy-pricing-period">/yr</span>
              </span>
            </div>
          </a>
        </div>

        <div className="academy-features">
          {[
            '52 courses, 520+ lessons',
            'New course every week',
            'Quizzes, labs & builder projects',
            'Downloadable resources',
            'Community access',
          ].map(f => (
            <div key={f} className="academy-feature-row">
              <span className="academy-feature-check">✓</span>
              <span>{f}</span>
            </div>
          ))}
        </div>

        <p className="academy-modal-footer">
          Secure payment via Stripe. Cancel anytime.
        </p>
      </div>
    </div>
  );
}
