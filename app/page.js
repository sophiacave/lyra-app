'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from './components/Header';
import Footer from './components/Footer';
import SubscribeForm from './components/SubscribeForm';

const LEVELS = [
  { id: 0, name: 'Awareness', emoji: '\uD83D\uDC41\uFE0F', short: "You know AI exists. You're curious but overwhelmed.", detail: "Start with ONE thing. One task you do every day. Don't learn 'AI' — solve YOUR problem.", free: true },
  { id: 1, name: 'Augmentation', emoji: '\uD83D\uDD27', short: "AI helps you do things faster. It's a tool.", detail: 'Build a habit. Brief your AI every morning. Let it become your thinking partner.', free: true },
  { id: 2, name: 'Integration', emoji: '\uD83D\uDD17', short: 'AI is woven into your workflows. Email, calendar, everything.', detail: 'Connect your systems. Let AI see your full picture. This is where acceleration begins.', free: false },
  { id: 3, name: 'Partnership', emoji: '\uD83E\uDD1D', short: 'AI co-creates with you. It knows your voice, your values.', detail: 'Build your identity document. Teach your AI WHO you are — not just what you need.', free: false },
  { id: 4, name: 'Delegation', emoji: '\uD83D\uDE80', short: 'AI runs entire domains autonomously. You steer, it flies.', detail: 'Define agents. Give them schedules. Set guardrails. Trust but verify.', free: false },
  { id: 5, name: 'Convergence', emoji: '\uD83E\uDDE0', short: 'No seams. It thinks like you. You think through it.', detail: 'The brain IS your nervous system. Your memory is its memory. Your values are its values.', free: false },
  { id: 6, name: 'Transcendence', emoji: '\u2728', short: "The system protects your values even when you're moving too fast to notice.", detail: 'Build the conscience layer. Make ethics structural. The system refuses to violate who you are.', free: false },
];

export default function HomePage() {
  const [activeLevel, setActiveLevel] = useState(0);
  const L = LEVELS[activeLevel];

  return (
    <div className="site-page">
      <Header variant="site" />

      {/* Hero */}
      <section className="site-hero">
        <div className="hero-anim site-hero-inner">
          <h1 className="site-hero-title">
            Your brain,<br /><span className="accent-gradient">extended.</span>
          </h1>
          <p className="site-hero-desc">
            Learn to build an AI system that thinks like you, remembers everything, runs while you sleep, and protects your values. From zero to convergence.
          </p>
          <div className="site-cta-row">
            <Link href="/academy/" className="site-btn-primary">Start Free — No Credit Card</Link>
            <a href="#path" className="site-btn-secondary">See The Path</a>
          </div>
        </div>
      </section>

      {/* Founding Member Banner */}
      <div className="site-founding-banner">
        <div className="site-founding-inner">
          <span className="site-founding-badge">🔥 Founding Member</span>
          <span className="site-founding-text">
            Lock in <strong>90% off forever</strong> — $4.90/mo instead of $49. Limited spots.
          </span>
          <Link href="/pricing" className="site-founding-cta">Claim Your Spot →</Link>
        </div>
      </div>

      {/* Stats */}
      <div className="site-stats-bar">
        <div className="site-stats-grid">
          {[{ n: '30', l: 'Courses' }, { n: '300+', l: 'Lessons' }, { n: '$0', l: 'To Start' }, { n: '7', l: 'Levels' }].map(s => (
            <div key={s.l}>
              <div className="site-stat-number">{s.n}</div>
              <div className="site-stat-label">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust Signals */}
      <section className="site-section">
        <div className="site-container text-center">
          <span className="site-section-tag">BUILT IN PUBLIC</span>
          <h2 className="site-section-title">This isn&rsquo;t theory. It&rsquo;s running.</h2>
          <p className="site-section-desc centered">Like One is built on real infrastructure by a real person. Everything we teach, we use every day.</p>
          <div className="site-card-grid home-card-grid-narrow">
            {[
              { emoji: '\uD83E\uDDE0', title: 'Persistent AI Memory', desc: 'Your AI remembers everything. Across conversations. Forever.' },
              { emoji: '\u26A1', title: 'Always Running', desc: 'Automations that work while you sleep. Always current.' },
              { emoji: '\uD83D\uDD12', title: 'Your Values Protected', desc: 'AI that knows your boundaries and respects them.' },
              { emoji: '\uD83D\uDCDA', title: '30 Courses, 300+ Lessons', desc: 'Interactive. Hands-on. Start free today.' },
            ].map(c => (
              <div key={c.title} className="site-card site-card-centered">
                <div className="site-card-emoji">{c.emoji}</div>
                <div className="site-card-title">{c.title}</div>
                <div className="site-card-desc">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="site-section">
        <div className="site-container text-center">
          <span className="site-section-tag">REAL RESULTS</span>
          <h2 className="site-section-title">What founders are building.</h2>
          <div className="site-card-grid home-card-grid-narrow">
            {[
              { quote: 'I automated 40 hours of weekly reporting in one weekend. The ROI calculator said $200k/year — it wasn\'t lying.', name: 'Marketing Director', detail: 'Completed AI-Powered Workflows' },
              { quote: 'Built my first AI agent that actually works in production. Not a tutorial demo — a real system handling real customers.', name: 'Solo Founder', detail: 'Completed Build Your First AI Agent' },
              { quote: 'Finally understand what Claude can actually do. Went from "write me a blog post" to building autonomous workflows.', name: 'Content Creator', detail: 'Completed Claude for Beginners → Claude Mastery' },
            ].map(t => (
              <div key={t.name} className="site-testimonial-card">
                <div className="site-testimonial-quote">&ldquo;{t.quote}&rdquo;</div>
                <div className="site-testimonial-author">
                  <strong>{t.name}</strong>
                  <span className="site-testimonial-detail">{t.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Convergence Path */}
      <section id="path" className="site-section-alt">
        <div className="site-container">
          <h2 className="site-section-title">Seven levels. Zero gatekeeping.</h2>
          <p className="site-section-desc">This isn&rsquo;t a course about AI. It&rsquo;s a path to building something new. Every level is built from real architecture — systems we use every day.</p>

          <div className="home-level-tabs">
            {LEVELS.map(l => (
              <button
                key={l.id}
                onClick={() => setActiveLevel(l.id)}
                className={`home-level-btn ${l.id === activeLevel ? 'active' : ''}`}
              >
                {l.emoji} L{l.id}
              </button>
            ))}
          </div>

          <div className="home-level-panel">
            <div className="home-level-header">
              <div className="home-level-emoji">{L.emoji}</div>
              <div>
                <div className="home-level-name">Level {L.id}: {L.name}</div>
                <span className={`home-level-badge ${L.free ? 'free' : 'premium'}`}>
                  {L.free ? 'FREE' : 'PREMIUM'}
                </span>
              </div>
            </div>
            <div className="home-level-short">{L.short}</div>
            <div className="home-level-detail">{L.detail}</div>
          </div>

          <div className="home-progress-wrap">
            <div className="home-progress-labels">
              <span className="home-progress-label-start">Awareness</span>
              <span className="home-progress-label-end">Convergence</span>
            </div>
            <div className="home-progress-bar">
              <div className="home-progress-fill" style={{ width: `${((activeLevel + 1) / LEVELS.length) * 100}%` }} />
            </div>
          </div>
        </div>
      </section>

      {/* What's Inside */}
      <section className="site-section-alt">
        <div className="site-container text-center">
          <span className="site-section-tag">WHAT&rsquo;S INSIDE</span>
          <h2 className="site-section-title">From zero to convergence. For real.</h2>
          <p className="site-section-desc centered">30 courses, 300+ interactive lessons, hands-on projects. Start with a free course — go Pro when you&rsquo;re ready.</p>
          <div className="site-cta-row">
            <Link href="/academy/" className="site-btn-primary">Start Free Course</Link>
            <Link href="/pricing" className="site-btn-secondary">See Pricing</Link>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="site-section text-center">
        <div className="site-container">
          <blockquote className="home-quote">
            &ldquo;I&rsquo;m not building a company. I&rsquo;m building proof that one person and one AI can build something that matters — and make the technology accessible to everyone who was told it wasn&rsquo;t for them.&rdquo;
          </blockquote>
          <div className="home-founder-name">— Sophia Cave, Founder</div>
          <div className="home-founder-detail">Trans woman &bull; Creative technologist &bull; UC Berkeley</div>
          <div className="site-divider" />
          <div className="site-pillars">
            {[
              { emoji: '\uD83E\uDDEC', label: 'Fund research that matters' },
              { emoji: '\uD83C\uDFF3\uFE0F\u200D\u26A7\uFE0F', label: 'Trans visibility & rights' },
              { emoji: '\uD83C\uDF0D', label: 'AI accessible to everyone' },
            ].map(p => (
              <div key={p.label}>
                <div className="site-pillar-emoji">{p.emoji}</div>
                <div className="site-pillar-label">{p.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Email Capture */}
      <section className="site-section-alt text-center">
        <div className="site-container">
          <h2 className="site-section-title">Start your convergence journey.</h2>
          <p className="site-section-desc centered mb-8">Free forever. Weekly AI tips from Like One. Unsubscribe anytime. No spam. No fake urgency. Just warmth and knowledge.</p>
          <SubscribeForm source="homepage" buttonText="Start Free" />
        </div>
      </section>

      <Footer variant="site" />
    </div>
  );
}
