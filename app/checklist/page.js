'use client';

import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

// ─── Checklist Data ───────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    id: 'communication',
    label: 'Communication',
    icon: '💬',
    color: '#38bdf8',
    items: [
      {
        n: 1,
        title: 'AI-drafted follow-up emails after every sales call',
        detail:
          'Connect your calendar to Claude or Make.com. When a call ends, trigger a workflow that reads the meeting notes and drafts a personalized follow-up email — ready to review and send within 2 hours. No more staring at a blank compose window.',
      },
      {
        n: 2,
        title: 'Inbox triage: AI labels and prioritizes every email at 8 AM',
        detail:
          'Use a Zapier + Claude workflow that scans your inbox each morning, flags anything requiring same-day action, summarizes threads longer than 3 messages, and drafts replies for the top 5 most urgent emails.',
      },
      {
        n: 3,
        title: 'Auto-generated meeting agendas from recurring calendar events',
        detail:
          'Before every standing meeting, trigger an automation that pulls in the previous meeting\'s notes, open action items, and any new context — and generates a focused 5-point agenda delivered to all attendees 30 minutes early.',
      },
      {
        n: 4,
        title: 'AI meeting notes that extract decisions and action items in real time',
        detail:
          'Use Otter.ai or Fireflies with a post-processing Claude prompt. Every meeting produces a structured summary: decisions made, who owns what, and what blocks are open. Auto-posted to your Notion or Slack channel.',
      },
    ],
  },
  {
    id: 'content',
    label: 'Content',
    icon: '✍️',
    color: '#c084fc',
    items: [
      {
        n: 5,
        title: 'Turn every long-form piece into 10 social posts automatically',
        detail:
          'After publishing a blog post or newsletter, trigger a Make.com scenario that sends the full text to Claude with instructions to extract 10 distinct angles — one-liners, questions, stats, contrarian takes — formatted for LinkedIn, X, and Instagram.',
      },
      {
        n: 6,
        title: 'Weekly blog draft generated from your raw voice notes',
        detail:
          'Record a 5-minute brain dump on your phone every Thursday. Upload to a Zapier workflow that transcribes it, structures it into an SEO-ready draft with H2s and a CTA, and drops it in your CMS as a draft.',
      },
      {
        n: 7,
        title: 'AI-written email newsletter from your week\'s content and notes',
        detail:
          'Every Friday, a scheduled Make.com scenario pulls your published posts, Notion notes, and any URLs you tagged that week — and drafts your newsletter in your voice, including subject line variants and preview text options.',
      },
      {
        n: 8,
        title: 'Automatic content repurposing: blog → podcast script → YouTube description',
        detail:
          'One source piece, three formats. A single workflow takes your finished article, rewrites it as a conversational podcast script, extracts key quotes for pull cards, and writes a YouTube description with timestamps — all in one run.',
      },
    ],
  },
  {
    id: 'operations',
    label: 'Operations',
    icon: '⚙️',
    color: '#fb923c',
    items: [
      {
        n: 9,
        title: 'Client onboarding emails sent automatically when a payment clears',
        detail:
          'Connect Stripe to Zapier. The moment a payment succeeds, trigger a sequence: personalized welcome email, onboarding checklist, calendar invite to kickoff call, and a Slack notification to yourself. Zero manual steps.',
      },
      {
        n: 10,
        title: 'Invoice drafted and sent 24 hours before every project deadline',
        detail:
          'Set project end dates in a simple Airtable or Notion database. A scheduled automation reads upcoming deadlines, generates invoices in your template, and sends them via your invoicing tool — with a polite reminder to follow up if unpaid after 7 days.',
      },
      {
        n: 11,
        title: 'Weekly business metrics report delivered to your inbox every Monday',
        detail:
          'Pull revenue, email list growth, website traffic, and social stats from their respective APIs every Sunday night. Claude synthesizes the numbers into a 3-paragraph plain-English summary with one key insight and one recommended action.',
      },
      {
        n: 12,
        title: 'AI-powered FAQ responder for your support inbox',
        detail:
          'Use Claude\'s API with a knowledge base of your docs and past answers. Route incoming support emails through a classifier — if confidence is high, draft a reply instantly. You approve and send. Cuts support time by 60-80% for solopreneurs.',
      },
    ],
  },
  {
    id: 'strategy',
    label: 'Strategy',
    icon: '🧠',
    color: '#4ade80',
    items: [
      {
        n: 13,
        title: 'Competitor monitoring digest: what changed in your space this week',
        detail:
          'Set up a Make.com scenario that checks 5-10 competitor websites, their blog feeds, and social profiles weekly. Claude reads the diff and writes a one-page briefing: new features, pricing changes, content angles they\'re pursuing, and gaps you could own.',
      },
      {
        n: 14,
        title: 'Market research report from Reddit, forums, and review sites on demand',
        detail:
          'When you\'re validating an idea, run a prompt chain that searches Reddit, G2, Trustpilot, and your niche forums for real customer language. Claude synthesizes the top pains, desires, and objections into a voice-of-customer brief — the raw material for better copy and product decisions.',
      },
      {
        n: 15,
        title: 'Weekly "decision inbox": AI surfaces the 3 choices you need to make this week',
        detail:
          'Every Monday morning, a workflow reads your project tracker, upcoming deadlines, open action items, and unresolved threads — then presents you with exactly 3 decisions that are blocking progress, with the context you need to decide fast. You choose. It does the rest.',
      },
    ],
  },
];

const PREVIEW_IDS = [1, 5, 9]; // The 3 teaser items shown before gate

// ─── Metadata (exported separately for Next.js, used in layout) ───────────────
// Since this is 'use client', metadata must live in a separate metadata.js
// or be declared in a parent server component. We handle SEO via <head> tags below.

// ─── Component ────────────────────────────────────────────────────────────────

export default function ChecklistPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checked, setChecked] = useState({});

  const allItems = CATEGORIES.flatMap((c) => c.items);
  const previewItems = allItems.filter((item) => PREVIEW_IDS.includes(item.n));

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
          body: JSON.stringify({ email, source: 'checklist_lead_magnet' }),
        }
      );
      if (!res.ok) throw new Error('Subscribe failed');
      setUnlocked(true);
      // Scroll to checklist after unlock
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
    <div
      style={{
        background: '#08080a',
        color: '#e5e5e5',
        fontFamily: "'Inter', -apple-system, system-ui, sans-serif",
        minHeight: '100vh',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .accent-gradient {
          background: linear-gradient(135deg, #c084fc, #e879f9, #38bdf8, #c084fc);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradientShift 4s ease infinite;
        }
        .fade-up { animation: fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .checklist-item {
          background: #111114;
          border: 1px solid #1e1e28;
          border-radius: 12px;
          padding: 1.25rem 1.5rem;
          margin-bottom: 0.75rem;
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
        }
        .checklist-item:hover { border-color: #2a2a38; background: #131318; }
        .checklist-item.done { border-color: #38bdf820; background: #0a1620; }
        .check-box {
          width: 22px;
          height: 22px;
          border-radius: 6px;
          border: 2px solid #2a2a38;
          flex-shrink: 0;
          margin-top: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s, border-color 0.2s;
        }
        .check-box.checked { background: #38bdf8; border-color: #38bdf8; }
        .category-label {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 3px 10px;
          border-radius: 20px;
          margin-bottom: 1.25rem;
        }
        .gate-card {
          background: #111114;
          border: 1px solid #1e1e28;
          border-radius: 16px;
          padding: 2.5rem;
          max-width: 560px;
          margin: 0 auto;
          text-align: center;
        }
        .email-input {
          width: 100%;
          padding: 0.8rem 1rem;
          background: #0a0a0f;
          border: 1px solid #1a1a2e;
          border-radius: 10px;
          color: #e5e5e5;
          font-size: 1rem;
          font-family: inherit;
          margin-bottom: 0.75rem;
          box-sizing: border-box;
          outline: none;
          transition: border-color 0.2s;
        }
        .email-input:focus { border-color: #38bdf8; }
        .cta-btn {
          width: 100%;
          background: #fb923c;
          color: #000;
          border: none;
          border-radius: 10px;
          padding: 0.9rem 1.5rem;
          font-size: 1rem;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.1s;
        }
        .cta-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .cta-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .preview-blur {
          position: relative;
          overflow: hidden;
        }
        .preview-blur::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 120px;
          background: linear-gradient(to bottom, transparent, #08080a);
          pointer-events: none;
        }
        .progress-bar-bg {
          background: #1e1e28;
          border-radius: 999px;
          height: 6px;
          overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #c084fc, #38bdf8);
          transition: width 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        @media (max-width: 600px) {
          .gate-card { padding: 1.75rem 1.25rem; }
          .checklist-item { padding: 1rem 1.1rem; }
        }
      `}</style>

      <Header variant="site" />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        style={{
          maxWidth: '720px',
          margin: '0 auto',
          padding: '6rem 2rem 3rem',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-block',
            background: '#1a1a2e',
            border: '1px solid #2a2a38',
            color: '#38bdf8',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            padding: '4px 14px',
            borderRadius: '20px',
            marginBottom: '1.5rem',
          }}
        >
          Free Resource — Like One AI
        </div>

        <h1
          style={{
            fontSize: 'clamp(2rem, 6vw, 3.4rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-1.5px',
            marginBottom: '1.25rem',
          }}
        >
          The AI Automation Checklist:{' '}
          <span className="accent-gradient">15 Tasks You Should Automate This Week</span>
        </h1>

        <p
          style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
            color: '#a0a0a0',
            lineHeight: 1.75,
            maxWidth: '580px',
            margin: '0 auto 2rem',
          }}
        >
          You don&rsquo;t need a dev team. You don&rsquo;t need to learn to code. You need
          15 concrete automations that any solopreneur or small business owner can set up
          this week — and reclaim hours every day.
        </p>

        <div
          style={{
            display: 'flex',
            gap: '1.5rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '3.5rem',
          }}
        >
          {[
            { icon: '⚡', text: '15 ready-to-build automations' },
            { icon: '🛠️', text: 'Claude, Make.com & Zapier' },
            { icon: '🎯', text: 'Built for solopreneurs' },
          ].map((badge) => (
            <div
              key={badge.text}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.85rem',
                color: '#8888a0',
                background: '#111114',
                border: '1px solid #1e1e28',
                borderRadius: '8px',
                padding: '6px 14px',
              }}
            >
              <span>{badge.icon}</span>
              <span>{badge.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Preview (3 items, then gate) ──────────────────────────────────── */}
      {!unlocked && (
        <section style={{ maxWidth: '720px', margin: '0 auto', padding: '0 2rem 4rem' }}>
          <h2
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#525252',
              marginBottom: '1.25rem',
            }}
          >
            Preview — 3 of 15 automations
          </h2>

          <div className="preview-blur">
            {previewItems.map((item) => (
              <div key={item.n} className="checklist-item">
                <div className="check-box" style={{ borderColor: '#2a2a38' }}>
                  <span style={{ color: '#2a2a38', fontSize: '13px' }}>✓</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      color: '#e5e5e5',
                      marginBottom: '0.4rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span
                      style={{
                        background: '#1a1a2e',
                        color: '#38bdf8',
                        borderRadius: '5px',
                        padding: '1px 7px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      #{item.n}
                    </span>
                    {item.title}
                  </div>
                  <p style={{ color: '#737373', fontSize: '0.85rem', lineHeight: 1.65, margin: 0 }}>
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Gate card */}
          <div className="gate-card fade-up" style={{ marginTop: '2rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🔒</div>
            <h3
              style={{
                fontSize: '1.3rem',
                fontWeight: 700,
                marginBottom: '0.6rem',
                letterSpacing: '-0.5px',
              }}
            >
              Unlock all 15 automations — free
            </h3>
            <p
              style={{
                color: '#737373',
                fontSize: '0.9rem',
                lineHeight: 1.65,
                marginBottom: '1.75rem',
              }}
            >
              Enter your email to get instant access to the full checklist, plus future
              automation guides from Sophia Cave and the Like One team. No spam. Unsubscribe
              anytime.
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
                <p style={{ color: '#f87171', fontSize: '0.83rem', marginBottom: '0.6rem' }}>
                  {error}
                </p>
              )}
              <button className="cta-btn" type="submit" disabled={loading}>
                {loading ? 'Unlocking...' : 'Get the Full Checklist →'}
              </button>
              <p style={{ color: '#525252', fontSize: '0.75rem', marginTop: '0.9rem' }}>
                Built by{' '}
                <a
                  href="https://likeone.ai/about"
                  style={{ color: '#737373', textDecoration: 'underline' }}
                >
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
          style={{ maxWidth: '720px', margin: '0 auto', padding: '0 2rem 6rem' }}
          className="fade-up"
        >
          {/* Confirmation banner */}
          <div
            style={{
              background: '#0a1a10',
              border: '1px solid #166534',
              borderRadius: '12px',
              padding: '1.1rem 1.5rem',
              marginBottom: '2.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <span style={{ fontSize: '1.4rem' }}>✅</span>
            <div>
              <div style={{ fontWeight: 700, color: '#4ade80', fontSize: '0.95rem' }}>
                You&rsquo;re in. Welcome to Like One.
              </div>
              <div style={{ color: '#6b7280', fontSize: '0.82rem', marginTop: '2px' }}>
                Check your inbox for a confirmation. Now — start automating.
              </div>
            </div>
          </div>

          {/* Progress tracker */}
          <div
            style={{
              background: '#111114',
              border: '1px solid #1e1e28',
              borderRadius: '12px',
              padding: '1.25rem 1.5rem',
              marginBottom: '2.5rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.75rem',
              }}
            >
              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#e5e5e5' }}>
                Your progress
              </span>
              <span style={{ color: '#c084fc', fontWeight: 700, fontSize: '0.9rem' }}>
                {totalDone} / 15 automated
              </span>
            </div>
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{ width: `${(totalDone / 15) * 100}%` }}
              />
            </div>
            {totalDone === 15 && (
              <p
                style={{
                  color: '#c084fc',
                  fontSize: '0.83rem',
                  marginTop: '0.75rem',
                  fontWeight: 600,
                }}
              >
                ✨ You&rsquo;ve hit full automation. You&rsquo;re running Like One.
              </p>
            )}
          </div>

          {/* Categories + items */}
          {CATEGORIES.map((cat) => (
            <div key={cat.id} style={{ marginBottom: '2.5rem' }}>
              <div className="category-label" style={{ background: `${cat.color}15`, color: cat.color, border: `1px solid ${cat.color}30` }}>
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </div>

              {cat.items.map((item) => {
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
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: '0.95rem',
                          color: done ? '#525252' : '#e5e5e5',
                          marginBottom: '0.4rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          textDecoration: done ? 'line-through' : 'none',
                          transition: 'color 0.2s',
                        }}
                      >
                        <span
                          style={{
                            background: done ? '#1e1e28' : '#1a1a2e',
                            color: done ? '#525252' : cat.color,
                            borderRadius: '5px',
                            padding: '1px 7px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            flexShrink: 0,
                            transition: 'all 0.2s',
                          }}
                        >
                          #{item.n}
                        </span>
                        {item.title}
                      </div>
                      <p
                        style={{
                          color: done ? '#3a3a4a' : '#737373',
                          fontSize: '0.85rem',
                          lineHeight: 1.65,
                          margin: 0,
                          transition: 'color 0.2s',
                        }}
                      >
                        {item.detail}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          {/* Bottom CTA */}
          <div
            style={{
              background: 'linear-gradient(135deg, #1a0a2e, #0a1020)',
              border: '1px solid #2a1a4e',
              borderRadius: '16px',
              padding: '2.5rem',
              textAlign: 'center',
              marginTop: '2rem',
            }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>🧠</div>
            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                letterSpacing: '-0.5px',
                marginBottom: '0.6rem',
              }}
            >
              Ready to go deeper?
            </h3>
            <p
              style={{
                color: '#737373',
                fontSize: '0.9rem',
                lineHeight: 1.65,
                maxWidth: '420px',
                margin: '0 auto 1.5rem',
              }}
            >
              Like One Academy teaches the full system — from your first AI workflow to a
              fully autonomous business brain. 10 courses, 97 lessons. Start free.
            </p>
            <a
              href="https://likeone.ai/academy/"
              style={{
                display: 'inline-block',
                background: '#fb923c',
                color: '#000',
                fontWeight: 700,
                fontSize: '0.95rem',
                padding: '0.85rem 2rem',
                borderRadius: '10px',
                textDecoration: 'none',
                transition: 'opacity 0.2s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = '0.88')}
              onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
            >
              Explore the Academy →
            </a>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
