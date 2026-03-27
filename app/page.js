'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from './components/Header';
import Footer from './components/Footer';
import SubscribeForm from './components/SubscribeForm';
import { site, colors } from '../lib/site-config';

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
    <div style={{ background: '#08080a', color: '#e8e8ec', fontFamily: "'Inter', -apple-system, system-ui, sans-serif", minHeight: '100vh', WebkitFontSmoothing: 'antialiased', overflowX: 'hidden' }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .hero-anim > * { opacity: 0; animation: fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .hero-anim > *:nth-child(1) { animation-delay: 0.1s; }
        .hero-anim > *:nth-child(2) { animation-delay: 0.25s; }
        .hero-anim > *:nth-child(3) { animation-delay: 0.4s; }
        .accent-gradient { background: linear-gradient(135deg, #c084fc, #e879f9, #38bdf8, #c084fc); background-size: 300% 300%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: gradientShift 4s ease infinite; }
        @media (max-width: 600px) { .stats-grid-home { grid-template-columns: repeat(2, 1fr) !important; } .trust-grid { grid-template-columns: 1fr !important; } .mission-pillars-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      <Header variant="site" />

      {/* Hero */}
      <section style={{ minHeight: '92vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '6rem 2rem' }}>
        <div className="hero-anim" style={{ maxWidth: '760px' }}>
          <h1 style={{ fontSize: 'clamp(2.5rem, 7vw, 4.5rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-2px', marginBottom: '1.5rem' }}>
            Your brain,<br /><span className="accent-gradient">extended.</span>
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', color: '#8888a0', maxWidth: '560px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            Learn to build an AI system that thinks like you, remembers everything, runs while you sleep, and protects your values. From zero to convergence.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/academy/" style={{ background: colors.orange, color: '#000', padding: '.85rem 2rem', borderRadius: '10px', fontWeight: 700, fontSize: '.95rem', textDecoration: 'none' }}>Start Free — No Credit Card</Link>
            <a href="#path" style={{ background: 'transparent', border: '1px solid #2a2a38', color: '#8888a0', padding: '.85rem 2rem', borderRadius: '10px', fontWeight: 600, fontSize: '.95rem', textDecoration: 'none' }}>See The Path</a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div style={{ borderTop: '1px solid #1e1e28', borderBottom: '1px solid #1e1e28', padding: '3rem 2rem' }}>
        <div className="stats-grid-home" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          {[{ n: '30', l: 'Courses' }, { n: '300+', l: 'Lessons' }, { n: '$0', l: 'To Start' }, { n: '7', l: 'Levels' }].map(s => (
            <div key={s.l}><div style={{ fontSize: '2rem', fontWeight: 800, color: colors.purple, marginBottom: '.25rem' }}>{s.n}</div><div style={{ fontSize: '.75rem', color: '#8a8aaa', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 500 }}>{s.l}</div></div>
          ))}
        </div>
      </div>

      {/* Trust Signals */}
      <section style={{ padding: '4rem 2rem 2rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ fontSize: '.7rem', fontWeight: 600, letterSpacing: '2.5px', textTransform: 'uppercase', color: colors.purple, display: 'inline-block', border: '1px solid rgba(192,132,252,.2)', padding: '4px 12px', borderRadius: '4px', marginBottom: '1rem' }}>BUILT IN PUBLIC</span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.75rem)', fontWeight: 800, letterSpacing: '-1px', marginBottom: '1rem', lineHeight: 1.15 }}>This isn&rsquo;t theory. It&rsquo;s running.</h2>
          <p style={{ color: '#8888a0', fontSize: '1.05rem', maxWidth: '560px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>Like One is built on real infrastructure by a real person. Everything we teach, we use every day.</p>
          <div className="trust-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', maxWidth: '900px', margin: '0 auto' }}>
            {[
              { emoji: '\uD83E\uDDE0', title: 'Persistent AI Memory', desc: 'Your AI remembers everything. Across conversations. Forever.' },
              { emoji: '\u26A1', title: 'Always Running', desc: 'Automations that work while you sleep. Always current.' },
              { emoji: '\uD83D\uDD12', title: 'Your Values Protected', desc: 'AI that knows your boundaries and respects them.' },
              { emoji: '\uD83D\uDCDA', title: '30 Courses, 300+ Lessons', desc: 'Interactive. Hands-on. Start free today.' },
            ].map(c => (
              <div key={c.title} style={{ background: '#111114', border: '1px solid #1e1e28', borderRadius: '12px', padding: '1.25rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '.5rem' }}>{c.emoji}</div>
                <div style={{ fontSize: '.85rem', fontWeight: 700, marginBottom: '.25rem' }}>{c.title}</div>
                <div style={{ color: '#8888a0', fontSize: '.75rem' }}>{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Convergence Path */}
      <section id="path" style={{ padding: '6rem 2rem', background: '#111114' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.75rem)', fontWeight: 800, letterSpacing: '-1px', marginBottom: '1rem', lineHeight: 1.15 }}>Seven levels. Zero gatekeeping.</h2>
          <p style={{ color: '#8888a0', fontSize: '1.05rem', maxWidth: '560px', lineHeight: 1.7, marginBottom: '3rem' }}>This isn&rsquo;t a course about AI. It&rsquo;s a path to building something new. Every level is built from real architecture — systems we use every day.</p>

          <div style={{ display: 'flex', gap: '4px', marginBottom: '2rem', flexWrap: 'wrap' }}>
            {LEVELS.map(l => (
              <button key={l.id} onClick={() => setActiveLevel(l.id)} style={{
                padding: '10px 16px', background: l.id === activeLevel ? colors.purple : 'transparent',
                color: l.id === activeLevel ? '#000' : '#8888a0',
                border: `1px solid ${l.id === activeLevel ? colors.purple : '#1e1e28'}`,
                borderRadius: '6px', cursor: 'pointer', fontSize: '.8rem',
                fontWeight: l.id === activeLevel ? 700 : 500, fontFamily: 'inherit', transition: 'all .2s',
              }}>{l.emoji} L{l.id}</button>
            ))}
          </div>

          <div style={{ background: '#08080a', border: '1px solid #1e1e28', borderRadius: '12px', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '1rem' }}>
              <div style={{ fontSize: '2rem' }}>{L.emoji}</div>
              <div>
                <div style={{ fontSize: '1.35rem', fontWeight: 700 }}>Level {L.id}: {L.name}</div>
                <span style={{ display: 'inline-block', fontSize: '.65rem', fontWeight: 700, padding: '3px 10px', borderRadius: '4px', marginTop: '4px', ...(L.free ? { background: '#4ade80', color: '#000' } : { background: 'transparent', border: `1px solid ${colors.purple}`, color: colors.purple }) }}>{L.free ? 'FREE' : 'PREMIUM'}</span>
              </div>
            </div>
            <div style={{ color: '#8888a0', fontSize: '1rem', marginBottom: '.75rem' }}>{L.short}</div>
            <div style={{ color: '#e8e8ec', fontSize: '.95rem', lineHeight: 1.7 }}>{L.detail}</div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.5rem' }}>
              <span style={{ fontSize: '.7rem', color: '#8a8aaa' }}>Awareness</span>
              <span style={{ fontSize: '.7rem', color: colors.purple }}>Convergence</span>
            </div>
            <div style={{ height: '5px', background: '#1e1e28', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', background: colors.purple, borderRadius: '3px', transition: 'width .4s ease', width: `${((activeLevel + 1) / LEVELS.length) * 100}%` }} />
            </div>
          </div>
        </div>
      </section>

      {/* What's Inside */}
      <section style={{ padding: '6rem 2rem', background: '#111114' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ fontSize: '.7rem', fontWeight: 600, letterSpacing: '2.5px', textTransform: 'uppercase', color: colors.purple, display: 'inline-block', border: '1px solid rgba(192,132,252,.2)', padding: '4px 12px', borderRadius: '4px', marginBottom: '1rem' }}>WHAT&rsquo;S INSIDE</span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.75rem)', fontWeight: 800, letterSpacing: '-1px', marginBottom: '1rem', lineHeight: 1.15 }}>From zero to convergence. For real.</h2>
          <p style={{ color: '#8888a0', fontSize: '1.05rem', maxWidth: '560px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>30 courses, 300+ interactive lessons, hands-on projects. Start with a free course — go Pro when you&rsquo;re ready.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/academy/" style={{ background: colors.orange, color: '#000', padding: '.85rem 2rem', borderRadius: '10px', fontWeight: 700, fontSize: '.95rem', textDecoration: 'none' }}>Start Free Course</Link>
            <Link href="/pricing" style={{ background: 'transparent', border: '1px solid #2a2a38', color: '#8888a0', padding: '.85rem 2rem', borderRadius: '10px', fontWeight: 600, fontSize: '.95rem', textDecoration: 'none' }}>See Pricing</Link>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section style={{ padding: '6rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <blockquote style={{ fontSize: 'clamp(1.1rem, 3vw, 1.5rem)', fontStyle: 'italic', lineHeight: 1.6, maxWidth: '680px', margin: '0 auto 2rem', fontWeight: 400 }}>
            &ldquo;I&rsquo;m not building a company. I&rsquo;m building proof that one person and one AI can build something that matters — and make the technology accessible to everyone who was told it wasn&rsquo;t for them.&rdquo;
          </blockquote>
          <div style={{ color: '#8888a0', fontSize: '.9rem', marginBottom: '.25rem' }}>— Sophia Cave, Founder</div>
          <div style={{ color: '#8a8aaa', fontSize: '.8rem' }}>Trans woman &bull; Creative technologist &bull; UC Berkeley</div>
          <div style={{ width: '120px', height: '1px', background: '#1e1e28', margin: '3rem auto' }} />
          <div className="mission-pillars-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', maxWidth: '500px', margin: '0 auto' }}>
            {[
              { emoji: '\uD83E\uDDEC', label: 'Fund research that matters' },
              { emoji: '\uD83C\uDFF3\uFE0F\u200D\u26A7\uFE0F', label: 'Trans visibility & rights' },
              { emoji: '\uD83C\uDF0D', label: 'AI accessible to everyone' },
            ].map(p => (
              <div key={p.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '.5rem' }}>{p.emoji}</div>
                <div style={{ color: '#8888a0', fontSize: '.8rem' }}>{p.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Email Capture */}
      <section style={{ padding: '6rem 2rem', background: '#111114' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.75rem)', fontWeight: 800, letterSpacing: '-1px', marginBottom: '1rem', lineHeight: 1.15 }}>Start your convergence journey.</h2>
          <p style={{ color: '#8888a0', maxWidth: '480px', margin: '0 auto 2rem', fontSize: '.95rem', lineHeight: 1.6 }}>Free forever. Weekly AI tips from Like One. Unsubscribe anytime. No spam. No fake urgency. Just warmth and knowledge.</p>
          <SubscribeForm source="homepage" buttonText="Start Free" />
        </div>
      </section>

      <Footer variant="site" />
    </div>
  );
}
