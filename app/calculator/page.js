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
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
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
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '200px', padding: '0 4px' }}>
      {monthlyData.map((d, i) => {
        const h = (d.cumulative / max) * 180;
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div style={{
              width: '100%',
              height: `${h}px`,
              background: `linear-gradient(180deg, #c084fc 0%, #6c5ce7 ${50 + i * 4}%, #38bdf8 100%)`,
              borderRadius: '4px 4px 0 0',
              transition: 'height 0.6s cubic-bezier(.4,0,.2,1)',
              transitionDelay: `${i * 60}ms`,
              opacity: h > 0 ? 1 : 0,
              minHeight: h > 0 ? '4px' : '0',
            }} />
            <span style={{ fontSize: '10px', color: '#888' }}>{d.label}</span>
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
    <div style={{ marginBottom: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <label style={{ fontSize: '14px', fontWeight: 600, color: '#e0e0e0' }}>{label}</label>
        <span style={{
          fontSize: '16px', fontWeight: 700,
          background: 'linear-gradient(135deg, #c084fc, #38bdf8)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
        </span>
      </div>
      {description && <p style={{ fontSize: '12px', color: '#666', margin: '0 0 8px' }}>{description}</p>}
      <div style={{ position: 'relative', height: '6px', background: '#1f1f1f', borderRadius: '3px' }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, height: '100%', borderRadius: '3px',
          width: `${pct}%`,
          background: 'linear-gradient(90deg, #6c5ce7, #c084fc, #38bdf8)',
          transition: 'width 0.15s',
        }} />
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))}
        style={{
          width: '100%', marginTop: '-6px', position: 'relative', zIndex: 2,
          WebkitAppearance: 'none', background: 'transparent', cursor: 'pointer', height: '20px',
        }} />
    </div>
  );
}

// ─── Main Page ───
export default function CalculatorPage() {
  const [step, setStep] = useState('calculator'); // skip auth gate — calculator is free
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Calculator inputs
  const [teamSize, setTeamSize] = useState(5);
  const [avgHourlyRate, setAvgHourlyRate] = useState(50);
  const [hoursPerWeek, setHoursPerWeek] = useState(15);
  const [automationPct, setAutomationPct] = useState(60);

  // Calculations
  const weeklyHoursSaved = (hoursPerWeek * teamSize * automationPct) / 100;
  const monthlyHoursSaved = weeklyHoursSaved * 4.33;
  const annualHoursSaved = weeklyHoursSaved * 52;
  const monthlyCostSaved = monthlyHoursSaved * avgHourlyRate;
  const annualCostSaved = annualHoursSaved * avgHourlyRate;
  const implementationCost = 2500; // estimated
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
      if (data.success) {
        setStep('code');
      } else {
        setError('Failed to send code. Please try again.');
      }
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
      if (data.success) {
        setStep('calculator');
      } else {
        setError('Invalid or expired code. Please check and try again.');
      }
    } catch {
      setError('Verification failed. Please try again.');
    }
    setLoading(false);
  }

  // Common styles
  const pageStyle = {
    minHeight: '100vh',
    background: '#0a0a0a',
    color: '#fff',
    fontFamily: "'Inter', sans-serif",
  };

  const cardStyle = {
    background: '#111',
    border: '1px solid #1f1f1f',
    borderRadius: '16px',
    padding: '2.5rem',
    maxWidth: '480px',
    width: '100%',
  };

  // ─── EMAIL STEP ───
  if (step === 'email') {
    return (
      <div style={{ ...pageStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={cardStyle}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Link href="/" style={{
              fontSize: '1.25rem', fontWeight: 800,
              background: 'linear-gradient(135deg, #c084fc, #38bdf8)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textDecoration: 'none',
            }}>Like One</Link>
          </div>

          <div style={{
            width: '64px', height: '64px', margin: '0 auto 20px',
            background: 'linear-gradient(135deg, rgba(108,92,231,.2), rgba(232,67,147,.2))',
            border: '2px solid rgba(108,92,231,.3)',
            borderRadius: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px',
          }}>
            📊
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, textAlign: 'center', marginBottom: '8px', lineHeight: 1.3 }}>
            AI ROI Calculator
          </h1>
          <p style={{ color: '#888', textAlign: 'center', fontSize: '15px', marginBottom: '2rem', lineHeight: 1.6 }}>
            Discover how much time and money AI automation can save your business — in under 2 minutes.
          </p>

          <form onSubmit={handleSendCode}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '.5px' }}>
              Work email
            </label>
            <input
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@company.com"
              style={{
                width: '100%', padding: '14px 16px', borderRadius: '10px',
                border: '1px solid #2a2a2a', background: '#0a0a0a',
                color: '#fff', fontSize: '15px', outline: 'none',
                marginBottom: '16px', transition: 'border-color .2s',
              }}
              onFocus={e => e.target.style.borderColor = '#6c5ce7'}
              onBlur={e => e.target.style.borderColor = '#2a2a2a'}
            />
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
              background: loading ? '#333' : 'linear-gradient(135deg, #6c5ce7, #c084fc)',
              color: '#fff', fontSize: '15px', fontWeight: 700, cursor: loading ? 'wait' : 'pointer',
              transition: 'all .3s',
            }}>
              {loading ? 'Sending code...' : 'Get Access Code →'}
            </button>
          </form>
          {error && <p style={{ color: '#e74c3c', fontSize: '13px', textAlign: 'center', marginTop: '12px' }}>{error}</p>}

          <p style={{ color: '#555', fontSize: '12px', textAlign: 'center', marginTop: '16px' }}>
            We'll send a 6-digit code to verify your email. No spam, ever.
          </p>
        </div>
      </div>
    );
  }

  // ─── CODE VERIFICATION STEP ───
  if (step === 'code') {
    return (
      <div style={{ ...pageStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={cardStyle}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Link href="/" style={{
              fontSize: '1.25rem', fontWeight: 800,
              background: 'linear-gradient(135deg, #c084fc, #38bdf8)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textDecoration: 'none',
            }}>Like One</Link>
          </div>

          <div style={{
            width: '64px', height: '64px', margin: '0 auto 20px',
            background: 'linear-gradient(135deg, rgba(0,206,201,.2), rgba(108,92,231,.2))',
            border: '2px solid rgba(0,206,201,.3)',
            borderRadius: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px',
          }}>
            ✉️
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, textAlign: 'center', marginBottom: '8px' }}>
            Check your email
          </h2>
          <p style={{ color: '#888', textAlign: 'center', fontSize: '14px', marginBottom: '6px' }}>
            We sent a 6-digit code to
          </p>
          <p style={{ color: '#38bdf8', textAlign: 'center', fontSize: '14px', fontWeight: 600, marginBottom: '2rem' }}>
            {email}
          </p>

          <form onSubmit={handleVerifyCode}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <input
                type="text" required maxLength={6} value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                style={{
                  width: '220px', padding: '16px', borderRadius: '12px',
                  border: '2px solid #2a2a2a', background: '#0a0a0a',
                  color: '#fff', fontSize: '28px', fontWeight: 800,
                  textAlign: 'center', letterSpacing: '8px',
                  outline: 'none', fontFamily: 'monospace',
                }}
                onFocus={e => e.target.style.borderColor = '#6c5ce7'}
                onBlur={e => e.target.style.borderColor = '#2a2a2a'}
              />
            </div>
            <button type="submit" disabled={loading || code.length < 6} style={{
              width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
              background: (loading || code.length < 6) ? '#333' : 'linear-gradient(135deg, #38bdf8, #6c5ce7)',
              color: '#fff', fontSize: '15px', fontWeight: 700,
              cursor: (loading || code.length < 6) ? 'default' : 'pointer',
            }}>
              {loading ? 'Verifying...' : 'Verify & Launch Calculator'}
            </button>
          </form>
          {error && <p style={{ color: '#e74c3c', fontSize: '13px', textAlign: 'center', marginTop: '12px' }}>{error}</p>}

          <button onClick={() => { setStep('email'); setCode(''); setError(''); }}
            style={{ background: 'none', border: 'none', color: '#666', fontSize: '13px', cursor: 'pointer', width: '100%', marginTop: '16px', textAlign: 'center' }}>
            ← Use a different email
          </button>
        </div>
      </div>
    );
  }

  // ─── CALCULATOR STEP ───
  if (step === 'calculator') {
    return (
      <div style={pageStyle}>
        {/* Header */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 1000,
          background: 'rgba(10,10,10,.95)', backdropFilter: 'blur(10px)',
          borderBottom: '1px solid #1f1f1f', padding: '1rem 0',
        }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link href="/" style={{
              fontSize: '1.25rem', fontWeight: 800,
              background: 'linear-gradient(135deg, #c084fc, #38bdf8)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textDecoration: 'none',
            }}>Like One</Link>
            <span style={{ fontSize: '13px', color: '#888' }}>AI ROI Calculator</span>
          </div>
        </header>

        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 800, marginBottom: '8px' }}>
              <span style={{
                background: 'linear-gradient(135deg, #c084fc, #38bdf8)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>Calculate Your AI ROI</span>
            </h1>
            <p style={{ color: '#888', fontSize: '15px' }}>Adjust the sliders to match your business. Results update in real-time.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* Left: Inputs */}
            <div style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '16px', padding: '2rem' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '24px', color: '#e0e0e0' }}>
                Your Business Profile
              </h2>
              <SliderInput label="Team Size" value={teamSize} onChange={setTeamSize} min={1} max={100}
                suffix=" people" description="Number of team members doing repetitive tasks" />
              <SliderInput label="Average Hourly Rate" value={avgHourlyRate} onChange={setAvgHourlyRate} min={15} max={200} step={5}
                prefix="$" suffix="/hr" description="Blended hourly cost including benefits" />
              <SliderInput label="Hours on Repetitive Tasks" value={hoursPerWeek} onChange={setHoursPerWeek} min={1} max={40}
                suffix=" hrs/week" description="Per person, spent on automatable work" />
              <SliderInput label="Automation Potential" value={automationPct} onChange={setAutomationPct} min={20} max={90}
                suffix="%" description="Percentage of repetitive work AI can handle" />
            </div>

            {/* Right: Results */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Big numbers */}
              <div style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '16px', padding: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ textAlign: 'center', padding: '12px' }}>
                    <p style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '4px' }}>Annual Savings</p>
                    <p style={{
                      fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800,
                      background: 'linear-gradient(135deg, #38bdf8, #6c5ce7)',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}>
                      <AnimatedNumber value={annualCostSaved} prefix="$" />
                    </p>
                  </div>
                  <div style={{ textAlign: 'center', padding: '12px' }}>
                    <p style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '4px' }}>ROI</p>
                    <p style={{
                      fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800,
                      background: 'linear-gradient(135deg, #c084fc, #fdcb6e)',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}>
                      <AnimatedNumber value={roi} suffix="%" />
                    </p>
                  </div>
                  <div style={{ textAlign: 'center', padding: '12px' }}>
                    <p style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '4px' }}>Hours Saved / Year</p>
                    <p style={{ fontSize: '1.4rem', fontWeight: 700, color: '#e0e0e0' }}>
                      <AnimatedNumber value={Math.round(annualHoursSaved)} />
                    </p>
                  </div>
                  <div style={{ textAlign: 'center', padding: '12px' }}>
                    <p style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '4px' }}>FTE Equivalent</p>
                    <p style={{ fontSize: '1.4rem', fontWeight: 700, color: '#e0e0e0' }}>{fteEquivalent}</p>
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '16px', padding: '1.5rem', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#e0e0e0' }}>Cumulative Savings (12 months)</h3>
                  <span style={{ fontSize: '13px', color: '#38bdf8', fontWeight: 600 }}>
                    ${annualCostSaved.toLocaleString()}
                  </span>
                </div>
                <SavingsChart monthlyData={monthlyData} />
              </div>

              {/* Payback */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(108,92,231,.1), rgba(232,67,147,.1))',
                border: '1px solid rgba(108,92,231,.3)', borderRadius: '16px', padding: '1.25rem',
                textAlign: 'center',
              }}>
                <p style={{ fontSize: '13px', color: '#888', marginBottom: '4px' }}>Estimated payback period</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>
                  {paybackDays > 0 && paybackDays < 365 ? `${paybackDays} days` : paybackDays <= 0 ? 'Immediate' : `${(paybackDays / 30).toFixed(0)} months`}
                </p>
              </div>

              {/* CTA */}
              <button onClick={() => setStep('results')} style={{
                width: '100%', padding: '16px', borderRadius: '12px', border: 'none',
                background: 'linear-gradient(135deg, #c084fc, #6c5ce7)',
                color: '#fff', fontSize: '16px', fontWeight: 700, cursor: 'pointer',
                transition: 'all .3s',
              }}>
                See Full Report & Next Steps →
              </button>
            </div>
          </div>
        </div>

        <style>{`
          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%;
            background: linear-gradient(135deg, #c084fc, #6c5ce7);
            border: 2px solid #fff; cursor: pointer; box-shadow: 0 2px 8px rgba(232,67,147,.4);
          }
          input[type="range"]::-moz-range-thumb {
            width: 18px; height: 18px; border-radius: 50%;
            background: linear-gradient(135deg, #c084fc, #6c5ce7);
            border: 2px solid #fff; cursor: pointer;
          }
          @media (max-width: 768px) {
            div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    );
  }

  // ─── RESULTS STEP ───
  return (
    <div style={pageStyle}>
      <header style={{
        position: 'sticky', top: 0, zIndex: 1000,
        background: 'rgba(10,10,10,.95)', backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #1f1f1f', padding: '1rem 0',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{
            fontSize: '1.25rem', fontWeight: 800,
            background: 'linear-gradient(135deg, #c084fc, #38bdf8)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textDecoration: 'none',
          }}>Like One</Link>
          <button onClick={() => setStep('calculator')} style={{
            background: 'none', border: '1px solid #333', borderRadius: '8px',
            color: '#888', padding: '6px 14px', fontSize: '13px', cursor: 'pointer',
          }}>← Back to Calculator</button>
        </div>
      </header>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2.5rem 1.5rem 4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🚀</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '10px' }}>Your AI Automation Potential</h1>
          <p style={{ color: '#888', fontSize: '15px' }}>Based on your inputs, here's what AI can do for your business.</p>
        </div>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '2.5rem' }}>
          {[
            { label: 'Annual Savings', value: `$${annualCostSaved.toLocaleString()}`, color: '#38bdf8' },
            { label: 'Hours Reclaimed', value: `${Math.round(annualHoursSaved).toLocaleString()}`, color: '#c084fc' },
            { label: 'Return on Investment', value: `${roi}%`, color: '#6c5ce7' },
          ].map((c, i) => (
            <div key={i} style={{
              background: '#111', border: '1px solid #1f1f1f', borderRadius: '14px',
              padding: '1.5rem', textAlign: 'center',
            }}>
              <p style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '8px' }}>{c.label}</p>
              <p style={{ fontSize: '1.8rem', fontWeight: 800, color: c.color }}>{c.value}</p>
            </div>
          ))}
        </div>

        {/* Breakdown */}
        <div style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '16px', padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Impact Breakdown</h2>
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
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 0', borderBottom: i < 8 ? '1px solid #1a1a1a' : 'none',
            }}>
              <span style={{ fontSize: '14px', color: row.highlight ? '#e0e0e0' : '#888' }}>{row.label}</span>
              <span style={{
                fontSize: '14px', fontWeight: row.highlight ? 700 : 500,
                color: row.highlight ? '#38bdf8' : '#e0e0e0',
              }}>{row.value}</span>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(232,67,147,.08), rgba(108,92,231,.08))',
          border: '1px solid rgba(232,67,147,.2)', borderRadius: '16px',
          padding: '2rem', textAlign: 'center',
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Ready to capture these savings?</h2>
          <p style={{ color: '#888', fontSize: '14px', marginBottom: '20px', maxWidth: '500px', margin: '0 auto 20px' }}>
            Our AI automation products help you implement these savings — from prompt frameworks to full production blueprints.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/products/replace-40-hours-busywork" style={{
              padding: '12px 24px', borderRadius: '10px', border: 'none',
              background: 'linear-gradient(135deg, #c084fc, #6c5ce7)',
              color: '#fff', fontSize: '14px', fontWeight: 700, textDecoration: 'none',
            }}>
              Replace 40 Hours of Busywork — $49
            </Link>
            <Link href="/products/ai-automation-toolkit" style={{
              padding: '12px 24px', borderRadius: '10px',
              border: '1px solid #6c5ce7', background: 'transparent',
              color: '#6c5ce7', fontSize: '14px', fontWeight: 600, textDecoration: 'none',
            }}>
              AI Automation Toolkit — $149
            </Link>
          </div>
          <Link href="/products" style={{
            display: 'inline-block', marginTop: '16px', color: '#888', fontSize: '13px', textDecoration: 'none',
          }}>
            View all products →
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: '1px solid #1e1e28', padding: '2rem', textAlign: 'center', marginTop: '4rem',
      }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '.75rem' }}>
          like<span style={{ color: '#c084fc' }}>one</span>
        </div>
        <p style={{ color: '#55556a', fontSize: '.75rem', marginBottom: '.5rem' }}>
          Built with love by Faye Cave. Powered by convergence.
        </p>
        <p style={{ color: '#55556a', fontSize: '.75rem' }}>
          &copy; 2026 Like One. All rights reserved. &bull;{' '}
          <a href="mailto:faye@likeone.ai" style={{ color: '#c084fc', textDecoration: 'none' }}>faye@likeone.ai</a>
        </p>
        <p style={{ color: '#55556a', fontSize: '.75rem', marginTop: '8px' }}>
          <a href="/privacy.html" style={{ color: '#c084fc', textDecoration: 'none' }}>Privacy Policy</a> &bull;{' '}
          <a href="/terms.html" style={{ color: '#c084fc', textDecoration: 'none' }}>Terms of Service</a>
        </p>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="repeat(3, 1fr)"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
