'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const SUPABASE_URL = 'https://vpaynwebgmmnwttqkwmh.supabase.co';

// ─── Animated Counter ───
function AnimatedNumber({ value, prefix = '', suffix = '', duration = 1200 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    let start = 0;
    const end = value;
    const startTime = performance.now();
    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + (end - start) * eased));
      if (progress < 1) ref.current = requestAnimationFrame(tick);
    }
    ref.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(ref.current);
  }, [value, duration]);

  return <>{prefix}{display.toLocaleString()}{suffix}</>;
}

// ─── Bar Chart ───
function SavingsChart({ monthlyData }) {
  const max = Math.max(...monthlyData.map(d => d.cumulative), 1);
  return (
    <div className="calc-chart">
      {monthlyData.map((d, i) => {
        const h = (d.cumulative / max) * 180;
        return (
          <div key={i} className="calc-chart-col">
            <div
              className="calc-chart-bar"
              style={{
                height: `${h}px`,
                transitionDelay: `${i * 60}ms`,
                opacity: h > 0 ? 1 : 0,
                minHeight: h > 0 ? '4px' : '0',
              }}
            />
            <span className="calc-chart-label">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Slider Input ───
function SliderInput({ label, value, onChange, min, max, step = 1, prefix = '', suffix = '', description }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="calc-slider">
      <div className="calc-slider-header">
        <label className="calc-slider-label">{label}</label>
        <span className="calc-slider-value">
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
        </span>
      </div>
      {description && <p className="calc-slider-desc">{description}</p>}
      <div className="calc-slider-track">
        <div className="calc-slider-fill" style={{ width: `${pct}%` }} />
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="calc-slider-input"
      />
    </div>
  );
}

// ─── Main Page ───
export default function CalculatorPage() {
  const [step, setStep] = useState('calculator');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [teamSize, setTeamSize] = useState(5);
  const [avgHourlyRate, setAvgHourlyRate] = useState(50);
  const [hoursPerWeek, setHoursPerWeek] = useState(15);
  const [automationPct, setAutomationPct] = useState(60);

  const weeklyHoursSaved = (hoursPerWeek * teamSize * automationPct) / 100;
  const monthlyHoursSaved = weeklyHoursSaved * 4.33;
  const annualHoursSaved = weeklyHoursSaved * 52;
  const monthlyCostSaved = monthlyHoursSaved * avgHourlyRate;
  const annualCostSaved = annualHoursSaved * avgHourlyRate;
  const implementationCost = 2500;
  const roi = Math.round(((annualCostSaved - implementationCost) / implementationCost) * 100);
  const paybackDays = Math.round((implementationCost / (annualCostSaved / 365)));
  const fteEquivalent = (annualHoursSaved / 2080).toFixed(1);

  const monthlyData = Array.from({ length: 12 }, (_, i) => ({
    label: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i],
    cumulative: Math.round(monthlyCostSaved * (i + 1)),
  }));

  async function handleSendCode(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/calculator-auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', email }),
      });
      const data = await res.json();
      if (data.success) setStep('code');
      else setError('Failed to send code. Please try again.');
    } catch {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  }

  async function handleVerifyCode(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/calculator-auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', email, code }),
      });
      const data = await res.json();
      if (data.success) setStep('calculator');
      else setError('Invalid or expired code. Please check and try again.');
    } catch {
      setError('Verification failed. Please try again.');
    }
    setLoading(false);
  }

  // ─── EMAIL STEP ───
  if (step === 'email') {
    return (
      <div className="site-page calc-auth-shell">
        <div className="calc-auth-card">
          <div className="calc-auth-brand">
            <Link href="/" className="site-gradient-text calc-brand-link">Like One</Link>
          </div>
          <div className="calc-auth-icon" data-color="purple">📊</div>
          <h1 className="calc-auth-title">AI ROI Calculator</h1>
          <p className="calc-auth-desc">
            Discover how much time and money AI automation can save your business — in under 2 minutes.
          </p>
          <form onSubmit={handleSendCode}>
            <label className="calc-form-label">Work email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@company.com" className="calc-form-input" />
            <button type="submit" disabled={loading} className="site-btn-primary calc-form-submit">
              {loading ? 'Sending code...' : 'Get Access Code →'}
            </button>
          </form>
          {error && <p className="calc-error">{error}</p>}
          <p className="calc-auth-note">We'll send a 6-digit code to verify your email. No spam, ever.</p>
        </div>
      </div>
    );
  }

  // ─── CODE VERIFICATION STEP ───
  if (step === 'code') {
    return (
      <div className="site-page calc-auth-shell">
        <div className="calc-auth-card">
          <div className="calc-auth-brand">
            <Link href="/" className="site-gradient-text calc-brand-link">Like One</Link>
          </div>
          <div className="calc-auth-icon" data-color="teal">✉️</div>
          <h2 className="calc-auth-title">Check your email</h2>
          <p className="calc-auth-desc">We sent a 6-digit code to</p>
          <p className="calc-email-highlight">{email}</p>
          <form onSubmit={handleVerifyCode}>
            <div className="calc-code-wrap">
              <input type="text" required maxLength={6} value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000" className="calc-code-input" />
            </div>
            <button type="submit" disabled={loading || code.length < 6}
              className="site-btn-primary calc-form-submit">
              {loading ? 'Verifying...' : 'Verify & Launch Calculator'}
            </button>
          </form>
          {error && <p className="calc-error">{error}</p>}
          <button onClick={() => { setStep('email'); setCode(''); setError(''); }}
            className="calc-back-btn">← Use a different email</button>
        </div>
      </div>
    );
  }

  // ─── CALCULATOR STEP ───
  if (step === 'calculator') {
    return (
      <div className="site-page">
        <header className="calc-header">
          <div className="calc-header-inner">
            <Link href="/" className="site-gradient-text calc-brand-link">Like One</Link>
            <span className="calc-header-label">AI ROI Calculator</span>
          </div>
        </header>

        <div className="calc-main">
          <div className="calc-hero">
            <h1 className="calc-hero-title">
              <span className="site-gradient-text">Calculate Your AI ROI</span>
            </h1>
            <p className="calc-hero-desc">Adjust the sliders to match your business. Results update in real-time.</p>
          </div>

          <div className="calc-grid">
            <div className="site-card calc-inputs-panel">
              <h2 className="calc-panel-title">Your Business Profile</h2>
              <SliderInput label="Team Size" value={teamSize} onChange={setTeamSize} min={1} max={100}
                suffix=" people" description="Number of team members doing repetitive tasks" />
              <SliderInput label="Average Hourly Rate" value={avgHourlyRate} onChange={setAvgHourlyRate} min={15} max={200} step={5}
                prefix="$" suffix="/hr" description="Blended hourly cost including benefits" />
              <SliderInput label="Hours on Repetitive Tasks" value={hoursPerWeek} onChange={setHoursPerWeek} min={1} max={40}
                suffix=" hrs/week" description="Per person, spent on automatable work" />
              <SliderInput label="Automation Potential" value={automationPct} onChange={setAutomationPct} min={20} max={90}
                suffix="%" description="Percentage of repetitive work AI can handle" />
            </div>

            <div className="calc-results-col">
              <div className="site-card">
                <div className="calc-results-grid">
                  <div className="calc-result-stat">
                    <p className="calc-result-label">Annual Savings</p>
                    <p className="calc-result-value-gradient"><AnimatedNumber value={annualCostSaved} prefix="$" /></p>
                  </div>
                  <div className="calc-result-stat">
                    <p className="calc-result-label">ROI</p>
                    <p className="calc-result-value-gradient" data-variant="warm"><AnimatedNumber value={roi} suffix="%" /></p>
                  </div>
                  <div className="calc-result-stat">
                    <p className="calc-result-label">Hours Saved / Year</p>
                    <p className="calc-result-value"><AnimatedNumber value={Math.round(annualHoursSaved)} /></p>
                  </div>
                  <div className="calc-result-stat">
                    <p className="calc-result-label">FTE Equivalent</p>
                    <p className="calc-result-value">{fteEquivalent}</p>
                  </div>
                </div>
              </div>

              <div className="site-card calc-chart-panel">
                <div className="calc-chart-header">
                  <h3 className="calc-chart-title">Cumulative Savings (12 months)</h3>
                  <span className="calc-chart-total">${annualCostSaved.toLocaleString()}</span>
                </div>
                <SavingsChart monthlyData={monthlyData} />
              </div>

              <div className="calc-payback">
                <p className="calc-payback-label">Estimated payback period</p>
                <p className="calc-payback-value">
                  {paybackDays > 0 && paybackDays < 365 ? `${paybackDays} days` : paybackDays <= 0 ? 'Immediate' : `${(paybackDays / 30).toFixed(0)} months`}
                </p>
              </div>

              <button onClick={() => setStep('results')} className="site-btn-primary calc-full-report-btn">
                See Full Report & Next Steps →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── RESULTS STEP ───
  return (
    <div className="site-page">
      <header className="calc-header">
        <div className="calc-header-inner calc-header-narrow">
          <Link href="/" className="site-gradient-text calc-brand-link">Like One</Link>
          <button onClick={() => setStep('calculator')} className="site-btn-secondary calc-back-btn-sm">
            ← Back to Calculator
          </button>
        </div>
      </header>

      <div className="calc-results-page">
        <div className="calc-results-hero">
          <div className="calc-results-emoji">🚀</div>
          <h1 className="calc-results-title">Your AI Automation Potential</h1>
          <p className="calc-results-desc">Based on your inputs, here's what AI can do for your business.</p>
        </div>

        <div className="calc-summary-grid">
          {[
            { label: 'Annual Savings', value: `$${annualCostSaved.toLocaleString()}`, variant: 'blue' },
            { label: 'Hours Reclaimed', value: `${Math.round(annualHoursSaved).toLocaleString()}`, variant: 'purple' },
            { label: 'Return on Investment', value: `${roi}%`, variant: 'deep' },
          ].map((c, i) => (
            <div key={i} className="calc-summary-card">
              <p className="calc-summary-label">{c.label}</p>
              <p className="calc-summary-value" data-variant={c.variant}>{c.value}</p>
            </div>
          ))}
        </div>

        <div className="site-card calc-breakdown-panel">
          <h2 className="calc-breakdown-title">Impact Breakdown</h2>
          {[
            { label: 'Team size', value: `${teamSize} people` },
            { label: 'Avg hourly rate', value: `$${avgHourlyRate}/hr` },
            { label: 'Weekly repetitive hours (per person)', value: `${hoursPerWeek} hrs` },
            { label: 'Automation potential', value: `${automationPct}%` },
            { label: 'Weekly hours saved (team total)', value: `${Math.round(weeklyHoursSaved)} hrs`, highlight: true },
            { label: 'Monthly cost savings', value: `$${Math.round(monthlyCostSaved).toLocaleString()}`, highlight: true },
            { label: 'Annual cost savings', value: `$${annualCostSaved.toLocaleString()}`, highlight: true },
            { label: 'FTE equivalent freed up', value: fteEquivalent, highlight: true },
            { label: 'Estimated payback period', value: paybackDays < 365 ? `${paybackDays} days` : `${(paybackDays / 30).toFixed(0)} months`, highlight: true },
          ].map((row, i) => (
            <div key={i} className={`calc-breakdown-row${i < 8 ? ' bordered' : ''}`}>
              <span className={`calc-breakdown-label${row.highlight ? ' highlight' : ''}`}>{row.label}</span>
              <span className={`calc-breakdown-value${row.highlight ? ' highlight' : ''}`}>{row.value}</span>
            </div>
          ))}
        </div>

        <div className="calc-cta-box">
          <h2 className="calc-cta-title">Ready to capture these savings?</h2>
          <p className="calc-cta-desc">
            Our AI automation products help you implement these savings — from prompt frameworks to full production blueprints.
          </p>
          <div className="site-cta-row">
            <Link href="/products/replace-40-hours-busywork" className="site-btn-primary">
              Replace 40 Hours of Busywork — $49
            </Link>
            <Link href="/products/ai-automation-toolkit" className="site-btn-secondary">
              AI Automation Toolkit — $149
            </Link>
          </div>
          <Link href="/products" className="calc-view-all">View all products →</Link>
        </div>
      </div>

      <footer className="footer-site">
        <div className="footer-site-brand">like<span className="accent">one</span></div>
        <p className="footer-site-text">Built with love by Sophia Cave. Powered by convergence.</p>
        <p className="footer-site-text">
          &copy; 2026 Like One. All rights reserved. &bull;{' '}
          <a href="mailto:faye@likeone.ai" className="footer-site-link">faye@likeone.ai</a>
        </p>
        <p className="footer-site-text">
          <a href="/privacy" className="footer-site-link">Privacy Policy</a> &bull;{' '}
          <a href="/terms" className="footer-site-link">Terms of Service</a>
        </p>
      </footer>
    </div>
  );
}
