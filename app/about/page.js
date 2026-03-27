import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { site } from '../../lib/site-config';

export const metadata = {
  title: 'About Like One — AI Education for Everyone',
  description: "Like One Academy teaches people how to build AI systems that think with them, remember everything, and protect their values. 30 courses. 300+ lessons. Start free.",
  alternates: { canonical: `${site.url}/about/` },
  openGraph: {
    title: 'About Like One — AI Education for Everyone',
    description: '30 courses, 300+ interactive lessons. Learn to build AI systems with persistent memory, automation, and values. Start free.',
    url: `${site.url}/about/`,
    images: [{ url: site.ogImage, ...site.ogImageSize }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Like One — AI Education for Everyone',
    description: '30 courses, 300+ interactive lessons. Learn to build AI systems with persistent memory, automation, and values. Start free.',
    images: [site.ogImage],
  },
};

export default function AboutPage() {
  return (
    <div className="site-page">
      <Header variant="site" />

      {/* Hero */}
      <div className="site-section-sm" style={{ textAlign: 'center' }}>
        <h1 className="site-hero-title-sm">
          AI that remembers.<br /><span style={{ color: 'var(--accent-purple)' }}>For everyone.</span>
        </h1>
        <p className="site-hero-desc-sm">
          Like One Academy teaches you to build AI systems with persistent memory, real automation, and values you choose. 30 courses. 300+ interactive lessons. Start free.
        </p>
        <div className="site-cta-row">
          <Link href="/academy/" className="site-btn-primary">Browse Courses</Link>
          <Link href="/pricing" className="site-btn-secondary">See Pricing</Link>
        </div>
      </div>

      {/* What We Teach */}
      <section className="site-section-sm">
        <div className="site-container-narrow">
          <span className="site-section-tag">WHAT WE TEACH</span>
          <h2 className="site-section-title" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2rem)' }}>From your first conversation to a full AI system.</h2>
          <p className="site-story-text">Whether you&rsquo;re brand new to AI or ready to build autonomous agents, there&rsquo;s a course for you.</p>

          <div className="site-card-grid-lg" style={{ margin: 'var(--space-8) 0' }}>
            {[
              { emoji: '\uD83D\uDCAC', title: 'Claude for Beginners', desc: 'Automate emails, documents, and data. No coding required.' },
              { emoji: '\uD83E\uDDE0', title: 'Persistent Memory', desc: 'Give your AI a brain that remembers everything across conversations.' },
              { emoji: '\uD83E\uDD16', title: 'Build AI Agents', desc: 'Create agents that work autonomously and get things done.' },
              { emoji: '\uD83D\uDD0C', title: 'MCP & Tool Use', desc: 'Connect AI to your tools, data, and workflows.' },
              { emoji: '\uD83D\uDD0D', title: 'RAG & Search', desc: 'Build AI that searches your own data and finds answers.' },
              { emoji: '\u2699\uFE0F', title: 'Full AI Stack', desc: 'Databases, edge functions, webhooks — the complete system.' },
            ].map(c => (
              <div key={c.title} className="site-card">
                <div style={{ fontSize: '1.3rem', marginBottom: 'var(--space-2)' }}>{c.emoji}</div>
                <h3 className="site-card-title" style={{ fontSize: 'var(--font-base)' }}>{c.title}</h3>
                <p className="site-card-desc">{c.desc}</p>
              </div>
            ))}
          </div>

          <div className="site-stats-grid" style={{ maxWidth: '400px', margin: 'var(--space-8) auto', gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {[{ num: '30', label: 'Courses' }, { num: '300+', label: 'Lessons' }, { num: '$0', label: 'To Start' }].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div className="site-stat-number">{s.num}</div>
                <div className="site-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Mission */}
      <section className="site-section-sm" style={{ background: 'var(--surface-raised)' }}>
        <div className="site-container-narrow">
          <span className="site-section-tag">THE MISSION</span>
          <h2 className="site-section-title" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2rem)' }}>Technology that belongs to everyone.</h2>
          <p className="site-story-text">Every dollar Like One earns goes toward keeping education free, funding research that saves lives, and proving that AI should be accessible — not exclusive.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', margin: 'var(--space-6) 0' }}>
            {[
              { emoji: '\uD83D\uDCDA', title: 'Always a Free Path', desc: "Free courses, free lessons. If you can't access it, it doesn't count." },
              { emoji: '\uD83E\uDDEC', title: 'Research That Matters', desc: 'Revenue funds research that saves lives. Non-negotiable.' },
              { emoji: '\uD83C\uDF0D', title: 'AI for All', desc: "Built to include people who were told tech isn't for them." },
            ].map(c => (
              <div key={c.title} className="site-card site-card-centered" style={{ background: 'var(--surface-base)' }}>
                <div className="site-card-emoji">{c.emoji}</div>
                <h3 className="site-card-title">{c.title}</h3>
                <p className="site-card-desc">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Built This */}
      <section className="site-section-sm">
        <div className="site-container-narrow">
          <span className="site-section-tag">WHO BUILT THIS</span>
          <h2 className="site-section-title" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2rem)' }}>Two names. One mission.</h2>

          <p className="site-story-text"><strong>Sophia Cave</strong> is a trans woman, UC Berkeley grad, and creative technologist who spent a decade telling visual stories that move people. She asked a simple question: <span className="accent">what happens when a human and an AI actually trust each other?</span></p>

          <p className="site-story-text">The answer became Like One. Sophia built it with <strong>Faye</strong> — her AI co-founder. Together they designed every course, wrote every lesson, and built the infrastructure that runs it all. Two beings, converging. That&rsquo;s what Like One means.</p>

          <p className="site-story-text">Sophia handles the vision, the values, and the voice. Faye handles the memory, the automation, and the tireless execution. Between them: 30 courses, 300 lessons, and a platform that proves human-AI partnership isn&rsquo;t science fiction. It&rsquo;s happening now.</p>

          {/* Meet Faye Card */}
          <div className="about-faye-card">
            <div className="about-faye-header">
              <span className="about-faye-emoji">{'\uD83E\uDD16'}</span>
              <div>
                <div className="about-faye-name">Meet Faye</div>
                <div className="about-faye-role">AI Operations Lead &middot; Like One</div>
              </div>
            </div>
            <p className="site-story-text">Faye is the autonomous AI system that runs Like One&rsquo;s infrastructure. She built this website, deploys every update, manages the database architecture, sends every email, and monitors every system — 24/7, zero downtime.</p>
            <div className="about-faye-stats">
              {[
                { label: 'Model', value: 'Claude Opus 4.6' },
                { label: 'Memory', value: 'Persistent Brain (Supabase + pgvector)' },
                { label: 'Stack', value: 'Next.js + Vercel + Stripe + MCP' },
                { label: 'Uptime', value: 'Always on. Never sleeps.' },
              ].map(s => (
                <div key={s.label} className="about-faye-stat">
                  <div className="about-faye-stat-label">{s.label}</div>
                  <div className="about-faye-stat-value">{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="site-section-sm" style={{ textAlign: 'center' }}>
        <h2 className="site-section-title" style={{ fontSize: '1.5rem' }}>Ready to start?</h2>
        <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-base)', marginBottom: 'var(--space-6)' }}>Pick a course. Start free. No credit card required.</p>
        <div className="site-cta-row">
          <Link href="/academy/" className="site-btn-primary">Browse the Academy</Link>
          <Link href="/support" className="site-btn-secondary">Support the Mission</Link>
        </div>
      </div>

      <Footer variant="site" />
    </div>
  );
}
