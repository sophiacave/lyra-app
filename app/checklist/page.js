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
    color: 'blue',
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
    color: 'purple',
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
    color: 'warm',
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
    color: 'green',
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
    <div className="site-page">
      <Header variant="site" />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="checklist-hero">
        <div className="checklist-badge">
          Free Resource — Like One AI
        </div>

        <h1 className="checklist-title">
          The AI Automation Checklist:{' '}
          <span className="accent-gradient">15 Tasks You Should Automate This Week</span>
        </h1>

        <p className="checklist-desc">
          You don&rsquo;t need a dev team. You don&rsquo;t need to learn to code. You need
          15 concrete automations that any solopreneur or small business owner can set up
          this week — and reclaim hours every day.
        </p>

        <div className="checklist-features">
          {[
            { icon: '⚡', text: '15 ready-to-build automations' },
            { icon: '🛠️', text: 'Claude, Make.com & Zapier' },
            { icon: '🎯', text: 'Built for solopreneurs' },
          ].map((badge) => (
            <div key={badge.text} className="checklist-feature">
              <span>{badge.icon}</span>
              <span>{badge.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Preview (3 items, then gate) ──────────────────────────────────── */}
      {!unlocked && (
        <section className="checklist-hero checklist-section-flush">
          <h2 className="checklist-preview-label">
            Preview — 3 of 15 automations
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
              Unlock all 15 automations — free
            </h3>
            <p className="checklist-gate-desc">
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
                You&rsquo;re in. Welcome to Like One.
              </div>
              <div className="checklist-success-desc">
                Check your inbox for a confirmation. Now — start automating.
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
              <p className="checklist-progress-msg">
                ✨ You&rsquo;ve hit full automation. You&rsquo;re running Like One.
              </p>
            )}
          </div>

          {/* Categories + items */}
          {CATEGORIES.map((cat) => (
            <div key={cat.id} className="checklist-category">
              <div className="category-label" data-color={cat.color}>
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
                    <div className="checklist-item-content">
                      <div className={`checklist-item-header${done ? ' done' : ''}`}>
                        <span className={`checklist-item-number${done ? ' done' : ''}`} data-color={cat.color}>
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
          ))}

          {/* Bottom CTA */}
          <div className="checklist-deeper">
            <div className="checklist-deeper-emoji">🧠</div>
            <h3 className="checklist-deeper-title">
              Ready to go deeper?
            </h3>
            <p className="checklist-deeper-desc">
              Like One Academy teaches the full system — from your first AI workflow to a
              fully autonomous business brain. 30 courses, 300+ lessons. Start free.
            </p>
            <a href="https://likeone.ai/academy/" className="cta-btn checklist-deeper-link">
              Explore the Academy →
            </a>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
