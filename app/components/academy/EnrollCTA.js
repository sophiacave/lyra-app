'use client';
import { useState } from 'react';

const MONTHLY_LINK = 'https://buy.stripe.com/bJe28k9LygWb7qP09c3sI0p';
const ANNUAL_LINK = 'https://buy.stripe.com/28E9AM8HudJZh1p7BE3sI0q';

export default function EnrollCTA({ context = 'inline' }) {
  const [showModal, setShowModal] = useState(false);

  if (context === 'inline') {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          className="academy-enroll-trigger"
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
  return (
    <div onClick={onClose} className="glass-modal-backdrop">
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass-modal glass-animate-up enroll-modal"
      >
        {/* Close button */}
        <button onClick={onClose} className="academy-modal-close">✕</button>

        {/* Header */}
        <div className="academy-modal-header">
          <div className="academy-modal-emoji">✨</div>
          <h2 className="academy-modal-title">Academy Pro</h2>
          <p className="academy-modal-desc">
            Unlock every lesson, every course, every download.
            New courses added weekly.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="academy-pricing-stack">
          {/* Monthly */}
          <a
            href={MONTHLY_LINK}
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
                $49<span className="academy-pricing-period">/mo</span>
              </span>
            </div>
          </a>

          {/* Annual — recommended */}
          <a
            href={ANNUAL_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="academy-pricing-card recommended"
          >
            <span className="academy-pricing-save">SAVE 33%</span>
            <div>
              <div className="academy-pricing-name">Annual</div>
              <div className="academy-pricing-sub">Best value — $32.50/mo</div>
            </div>
            <div>
              <span className="academy-pricing-amount gradient">
                $390<span className="academy-pricing-period">/yr</span>
              </span>
            </div>
          </a>
        </div>

        {/* Features */}
        <div className="academy-features">
          {[
            '36 courses, 355+ lessons',
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

        {/* Footer */}
        <p className="academy-modal-footer">
          Secure payment via Stripe. Cancel anytime.
        </p>
      </div>
    </div>
  );
}
