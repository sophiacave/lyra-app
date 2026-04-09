'use client';

import { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// ── Checklist Data ─────────────────────────────────────────────────────────────

const CHECKLIST_ITEMS = [
  {
    n: 1,
    title: 'Download your current loan balance and breakdown by loan type',
    detail:
      'Log in to studentaid.gov and export your full loan summary. Include each loan type (Direct, FFEL, Perkins), interest rates, and outstanding balances. Save as PDF.',
  },
  {
    n: 2,
    title: 'Screenshot your current repayment plan details and monthly payment amount',
    detail:
      'Capture your repayment plan name (SAVE, PAYE, IBR, ICR, Standard, etc.), your current monthly payment, and any pending plan changes. Save with today\'s date in the filename.',
  },
  {
    n: 3,
    title: 'Save your IDR recertification date and last income certification',
    detail:
      'Find your next Income-Driven Repayment recertification deadline and the income documentation you last submitted. If you\'re on the SAVE plan, this is especially critical given ongoing litigation.',
  },
  {
    n: 4,
    title: 'Record your PSLF qualifying payment count (if applicable)',
    detail:
      'If you\'re pursuing Public Service Loan Forgiveness, log in to the MOHELA PSLF tracker and screenshot your qualifying and remaining payment counts. Save your Employment Certification Forms.',
  },
  {
    n: 5,
    title: 'Note your loan servicer name and account number',
    detail:
      'Write down your current servicer (MOHELA, Nelnet, Aidvantage, etc.), your account number, and their contact info. Servicer transfers during system changes can cause payment count errors.',
  },
  {
    n: 6,
    title: 'Download a copy of your Master Promissory Note',
    detail:
      'Go to studentaid.gov, navigate to "My Aid," and download your Master Promissory Note (MPN). This is your original loan contract and the legal basis for your repayment terms.',
  },
  {
    n: 7,
    title: 'Save any correspondence about plan changes, servicer transfers, or forgiveness applications',
    detail:
      'Search your email for messages from your servicer, the Department of Education, and studentaid.gov. Save anything related to repayment plan changes, account transfers, or forgiveness progress.',
  },
  {
    n: 8,
    title: 'Verify your Federal Student Aid (FSA) ID login',
    detail:
      'Go to studentaid.gov and confirm you can still log in. If your password is expired or your account is locked, reset it now. You need access to download records and monitor changes.',
  },
  {
    n: 9,
    title: 'Screenshot your payment history for the last 12 months',
    detail:
      'Download or screenshot your full payment history from your servicer\'s website. This is your proof of payments made — critical if payment counts are disputed during a system transition.',
  },
  {
    n: 10,
    title: 'Save any Borrower Defense applications with confirmation numbers',
    detail:
      'If you\'ve filed a Borrower Defense to Repayment claim, save your application, confirmation number, and any correspondence. These claims may be affected by the Department of Education restructuring.',
  },
];

const COMPLAINT_STEPS = [
  {
    title: 'FERPA Complaint (data privacy violations)',
    detail: 'Email FERPA.Complaints@ed.gov with details of unauthorized data access or sharing.',
    link: 'mailto:FERPA.Complaints@ed.gov',
    linkText: 'FERPA.Complaints@ed.gov',
  },
  {
    title: 'CFPB Complaint (servicer issues)',
    detail: 'File a complaint about your loan servicer with the Consumer Financial Protection Bureau.',
    link: 'https://www.consumerfinance.gov/complaint',
    linkText: 'consumerfinance.gov/complaint',
  },
  {
    title: 'State Attorney General (state-level protection)',
    detail: 'Search "[your state] attorney general student loan complaint" to find your state\'s filing process.',
    link: null,
    linkText: null,
  },
];

const KEY_DEADLINES = [
  {
    date: 'April 15, 2026',
    label: 'Sweet v. McMahon class member deadline',
  },
  {
    date: 'May 14, 2026',
    label: 'NAACP LDF oral argument',
  },
];

const TOTAL_ITEMS = CHECKLIST_ITEMS.length;
const PREVIEW_COUNT = 3;

// ── Component ──────────────────────────────────────────────────────────────────

export default function StudentLoanRightsChecklistPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checked, setChecked] = useState({});

  const previewItems = CHECKLIST_ITEMS.slice(0, PREVIEW_COUNT);

  async function handleUnlock(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        'https://tnsujchfrixxsdpodygu.supabase.co/functions/v1/subscribe',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, source: 'student_loan_rights_checklist' }),
        }
      );
      if (!res.ok) throw new Error('Subscribe failed');
      setUnlocked(true);
      setTimeout(() => {
        const el = document.getElementById('full-checklist');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch {
      setError('Something went wrong. Try again or email hello@likeone.ai');
      setLoading(false);
    }
  }

  function toggleCheck(n) {
    setChecked((prev) => ({ ...prev, [n]: !prev[n] }));
  }

  const totalDone = Object.values(checked).filter(Boolean).length;

  return (
    <div className="site-page">
      <Header variant="site" />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="checklist-hero">
        <div className="checklist-badge">
          Free Resource — Like One AI
        </div>

        <h1 className="checklist-title">
          Student Loan Rights Checklist:{' '}
          <span className="accent-gradient">
            Protect Your Data in the DOGE Era
          </span>
        </h1>

        <p className="checklist-desc">
          The Department of Education is transferring student loan operations to
          the Treasury Department. Your borrower data, repayment plans, and
          forgiveness progress are at risk. Document everything now — before the
          transition erases your records.
        </p>

        <div className="checklist-features">
          {[
            { icon: '🛡️', text: '10 documentation steps' },
            { icon: '📋', text: 'Complaint filing guide' },
            { icon: '⏰', text: 'Key 2026 deadlines' },
          ].map((badge) => (
            <div key={badge.text} className="checklist-feature">
              <span>{badge.icon}</span>
              <span>{badge.text}</span>
            </div>
          ))}
        </div>

        {/* Deadline callout */}
        <div className="checklist-deadlines" style={{
          marginTop: '2rem',
          padding: '1.25rem 1.5rem',
          borderRadius: '12px',
          background: 'rgba(255, 59, 48, 0.08)',
          border: '1px solid rgba(255, 59, 48, 0.2)',
        }}>
          <strong style={{ color: '#ff3b30' }}>Key Deadlines</strong>
          {KEY_DEADLINES.map((d) => (
            <div key={d.date} style={{ marginTop: '0.5rem' }}>
              <strong>{d.date}</strong> — {d.label}
            </div>
          ))}
        </div>
      </section>

      {/* ── Preview (3 items, then gate) ──────────────────────────────────── */}
      {!unlocked && (
        <section className="checklist-hero checklist-section-flush">
          <h2 className="checklist-preview-label">
            Preview — 3 of {TOTAL_ITEMS} documentation steps
          </h2>

          <div className="preview-blur">
            {previewItems.map((item) => (
              <div key={item.n} className="checklist-item">
                <div className="check-box">
                  <span className="checklist-item-number" data-color="blue">✓</span>
                </div>
                <div className="checklist-item-content">
                  <div className="checklist-item-header">
                    <span className="checklist-item-number" data-color="blue">
                      #{item.n}
                    </span>
                    {item.title}
                  </div>
                  <p className="checklist-item-detail">
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Gate card */}
          <div className="gate-card fade-up">
            <div className="checklist-gate-emoji">🔒</div>
            <h3 className="checklist-gate-title">
              Unlock all {TOTAL_ITEMS} steps + complaint filing guide — free
            </h3>
            <p className="checklist-gate-desc">
              Enter your email to get instant access to the full documentation
              checklist, complaint filing steps, and key deadlines. No spam.
              Unsubscribe anytime.
            </p>

            <form onSubmit={handleUnlock}>
              <input
                className="email-input"
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {error && (
                <p className="checklist-gate-error">
                  {error}
                </p>
              )}
              <button className="cta-btn" type="submit" disabled={loading}>
                {loading ? 'Unlocking...' : 'Get the Full Checklist →'}
              </button>
              <p className="checklist-gate-note">
                Built by{' '}
                <a href="https://likeone.ai/about">
                  Sophia Cave
                </a>{' '}
                · Like One AI · No credit card required
              </p>
            </form>
          </div>
        </section>
      )}

      {/* ── Full Checklist (post-unlock) ──────────────────────────────────── */}
      {unlocked && (
        <section
          id="full-checklist"
          className="checklist-hero fade-up checklist-section-flush-lg"
        >
          {/* Confirmation banner */}
          <div className="checklist-success-banner">
            <span className="checklist-success-icon">✅</span>
            <div>
              <div className="checklist-success-title">
                You&rsquo;re in. Your borrower rights matter.
              </div>
              <div className="checklist-success-desc">
                Check your inbox for a confirmation. Now — document everything.
              </div>
            </div>
          </div>

          {/* Progress tracker */}
          <div className="checklist-progress">
            <div className="checklist-progress-header">
              <span className="checklist-progress-label">
                Your progress
              </span>
              <span className="checklist-progress-count">
                {totalDone} / {TOTAL_ITEMS} documented
              </span>
            </div>
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{ width: `${(totalDone / TOTAL_ITEMS) * 100}%` }}
              />
            </div>
            {totalDone === TOTAL_ITEMS && (
              <p className="checklist-progress-msg">
                ✨ All documented. Your records are protected.
              </p>
            )}
          </div>

          {/* Documentation checklist items */}
          <div className="checklist-category">
            <div className="category-label" data-color="blue">
              <span>📄</span>
              <span>Documentation Steps</span>
            </div>

            {CHECKLIST_ITEMS.map((item) => {
              const done = !!checked[item.n];
              return (
                <div
                  key={item.n}
                  className={`checklist-item${done ? ' done' : ''}`}
                  onClick={() => toggleCheck(item.n)}
                  role="checkbox"
                  aria-checked={done}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === ' ' && toggleCheck(item.n)}
                >
                  <div className={`check-box${done ? ' checked' : ''}`}>
                    {done && (
                      <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                        <path
                          d="M1 5L4.5 8.5L11 1.5"
                          stroke="#000"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="checklist-item-content">
                    <div className={`checklist-item-header${done ? ' done' : ''}`}>
                      <span
                        className={`checklist-item-number${done ? ' done' : ''}`}
                        data-color="blue"
                      >
                        #{item.n}
                      </span>
                      {item.title}
                    </div>
                    <p className={`checklist-item-detail${done ? ' done' : ''}`}>
                      {item.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bonus: Complaint Filing Steps */}
          <div className="checklist-category">
            <div className="category-label" data-color="warm">
              <span>🚨</span>
              <span>Bonus: Complaint Filing Steps</span>
            </div>

            {COMPLAINT_STEPS.map((step, i) => (
              <div key={i} className="checklist-item">
                <div className="check-box">
                  <span className="checklist-item-number" data-color="warm">
                    {i + 1}
                  </span>
                </div>
                <div className="checklist-item-content">
                  <div className="checklist-item-header">
                    <span className="checklist-item-number" data-color="warm">
                      #{i + 1}
                    </span>
                    {step.title}
                  </div>
                  <p className="checklist-item-detail">
                    {step.detail}
                  </p>
                  {step.link && (
                    <a
                      href={step.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-block',
                        marginTop: '0.5rem',
                        color: 'var(--accent, #6c5ce7)',
                        fontWeight: 600,
                        textDecoration: 'underline',
                      }}
                    >
                      {step.linkText}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Key Deadlines (repeated in unlocked view for reference) */}
          <div className="checklist-category">
            <div className="category-label" data-color="green">
              <span>📅</span>
              <span>Key Deadlines</span>
            </div>

            {KEY_DEADLINES.map((d, i) => (
              <div key={i} className="checklist-item">
                <div className="check-box">
                  <span className="checklist-item-number" data-color="green">
                    ⏰
                  </span>
                </div>
                <div className="checklist-item-content">
                  <div className="checklist-item-header">
                    <span className="checklist-item-number" data-color="green">
                      {d.date}
                    </span>
                    {d.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA — link to full guide */}
          <div className="checklist-deeper">
            <div className="checklist-deeper-emoji">📖</div>
            <h3 className="checklist-deeper-title">
              Read the full guide
            </h3>
            <p className="checklist-deeper-desc">
              This checklist is based on our comprehensive guide to student loan
              borrower rights in 2026. Get the full legal context, case
              summaries, and protection strategies.
            </p>
            <a
              href="/blog/student-loan-borrower-rights-doge-era-2026/"
              className="cta-btn checklist-deeper-link"
            >
              Read the Full Guide →
            </a>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
