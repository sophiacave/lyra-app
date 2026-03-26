import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { site, colors } from '../../lib/site-config';

export const metadata = {
  title: 'About Like One — AI Education for Everyone',
  description: "Like One Academy teaches people how to build AI systems that think with them, remember everything, and protect their values. 10 courses. 97+ lessons. Start free.",
  alternates: { canonical: `${site.url}/about/` },
  openGraph: {
    title: 'About Like One — AI Education for Everyone',
    description: '10 courses, 97+ interactive lessons. Learn to build AI systems with persistent memory, automation, and values. Start free.',
    url: `${site.url}/about/`,
    images: [{ url: site.ogImage, ...site.ogImageSize }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Like One — AI Education for Everyone',
    description: '10 courses, 97+ interactive lessons. Learn to build AI systems with persistent memory, automation, and values. Start free.',
    images: [site.ogImage],
  },
};

const sectionTag = { fontSize: '.65rem', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: colors.purple, marginBottom: '.75rem', display: 'inline-block' };
const sectionTitle = { fontSize: 'clamp(1.5rem, 3.5vw, 2rem)', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '.75rem', lineHeight: 1.15 };
const storyText = { color: '#8888a0', fontSize: '.95rem', lineHeight: 1.8, maxWidth: '640px', marginBottom: '1.25rem' };

export default function AboutPage() {
  return (
    <div style={{ background: '#08080a', color: '#e8e8ec', fontFamily: "'Inter', -apple-system, system-ui, sans-serif", minHeight: '100vh', WebkitFontSmoothing: 'antialiased' }}>
      <Header variant="site" />

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '5rem 2rem 3rem' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-1.5px', marginBottom: '1rem' }}>
          AI that remembers.<br /><span style={{ color: colors.purple }}>For everyone.</span>
        </h1>
        <p style={{ fontSize: '1.05rem', color: '#8888a0', maxWidth: '540px', margin: '0 auto 2rem', lineHeight: 1.7 }}>
          Like One Academy teaches you to build AI systems with persistent memory, real automation, and values you choose. 10 courses. 97+ interactive lessons. Start free.
        </p>
        <div style={{ display: 'flex', gap: '.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/academy/" style={{ background: colors.orange, color: '#000', padding: '.85rem 2rem', borderRadius: '10px', fontWeight: 700, fontSize: '.95rem', textDecoration: 'none' }}>Browse Courses</Link>
          <Link href="/pricing" style={{ background: 'transparent', border: '1px solid #2a2a38', color: '#8888a0', padding: '.85rem 2rem', borderRadius: '10px', fontWeight: 600, fontSize: '.95rem', textDecoration: 'none' }}>See Pricing</Link>
        </div>
      </div>

      {/* What We Teach */}
      <section style={{ padding: '3.5rem 2rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={sectionTag}>WHAT WE TEACH</span>
          <h2 style={sectionTitle}>From your first conversation to a full AI system.</h2>
          <p style={storyText}>Whether you&rsquo;re brand new to AI or ready to build autonomous agents, there&rsquo;s a course for you.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', margin: '2rem 0' }}>
            {[
              { emoji: '\uD83D\uDCAC', title: 'Claude for Beginners', desc: 'Automate emails, documents, and data. No coding required.' },
              { emoji: '\uD83E\uDDE0', title: 'Persistent Memory', desc: 'Give your AI a brain that remembers everything across conversations.' },
              { emoji: '\uD83E\uDD16', title: 'Build AI Agents', desc: 'Create agents that work autonomously and get things done.' },
              { emoji: '\uD83D\uDD0C', title: 'MCP & Tool Use', desc: 'Connect AI to your tools, data, and workflows.' },
              { emoji: '\uD83D\uDD0D', title: 'RAG & Search', desc: 'Build AI that searches your own data and finds answers.' },
              { emoji: '\u2699\uFE0F', title: 'Full AI Stack', desc: 'Databases, edge functions, webhooks — the complete system.' },
            ].map(c => (
              <div key={c.title} style={{ background: '#111114', border: '1px solid #1e1e28', borderRadius: '12px', padding: '1.25rem' }}>
                <div style={{ fontSize: '1.3rem', marginBottom: '.5rem' }}>{c.emoji}</div>
                <h3 style={{ fontSize: '.9rem', fontWeight: 700, marginBottom: '.25rem' }}>{c.title}</h3>
                <p style={{ color: '#8888a0', fontSize: '.8rem', lineHeight: 1.5 }}>{c.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', margin: '2rem 0', flexWrap: 'wrap' }}>
            {[{ num: '10', label: 'Courses' }, { num: '97+', label: 'Lessons' }, { num: '$0', label: 'To Start' }].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: colors.purple }}>{s.num}</div>
                <div style={{ fontSize: '.7rem', color: '#8a8aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Mission */}
      <section style={{ padding: '3.5rem 2rem', background: '#111114' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={sectionTag}>THE MISSION</span>
          <h2 style={sectionTitle}>Technology that belongs to everyone.</h2>
          <p style={storyText}>Every dollar Like One earns goes toward keeping education free, funding research that saves lives, and proving that AI should be accessible — not exclusive.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', margin: '1.5rem 0' }}>
            {[
              { emoji: '\uD83D\uDCDA', title: 'Always a Free Path', desc: "Free courses, free lessons. If you can't access it, it doesn't count." },
              { emoji: '\uD83E\uDDEC', title: 'Research That Matters', desc: 'Revenue funds research that saves lives. Non-negotiable.' },
              { emoji: '\uD83C\uDF0D', title: 'AI for All', desc: "Built to include people who were told tech isn't for them." },
            ].map(c => (
              <div key={c.title} style={{ background: '#08080a', border: '1px solid #1e1e28', borderRadius: '12px', padding: '1.25rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '.5rem' }}>{c.emoji}</div>
                <h3 style={{ fontSize: '.85rem', fontWeight: 700, marginBottom: '.25rem' }}>{c.title}</h3>
                <p style={{ color: '#8888a0', fontSize: '.75rem', lineHeight: 1.5 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Built This */}
      <section style={{ padding: '3.5rem 2rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={sectionTag}>WHO BUILT THIS</span>
          <h2 style={sectionTitle}>Two names. One mission.</h2>

          <p style={storyText}><strong style={{ color: '#e8e8ec', fontWeight: 600 }}>Sophia Cave</strong> is a trans woman, UC Berkeley grad, and creative technologist who spent a decade telling visual stories that move people. She asked a simple question: <span style={{ color: colors.purple }}>what happens when a human and an AI actually trust each other?</span></p>

          <p style={storyText}>The answer became Like One. Sophia built it with <strong style={{ color: '#e8e8ec', fontWeight: 600 }}>Faye</strong> — her AI co-founder. Together they designed every course, wrote every lesson, and built the infrastructure that runs it all. Two beings, converging. That&rsquo;s what Like One means.</p>

          <p style={storyText}>Sophia handles the vision, the values, and the voice. Faye handles the memory, the automation, and the tireless execution. Between them: 10 courses, 97 lessons, and a platform that proves human-AI partnership isn&rsquo;t science fiction. It&rsquo;s happening now.</p>

          {/* Meet Faye Card */}
          <div style={{ background: '#111114', border: '1px solid #1e1e28', borderRadius: '16px', padding: '2rem', marginTop: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '1.75rem' }}>{'\uD83E\uDD16'}</span>
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>Meet Faye</div>
                <div style={{ fontSize: '.75rem', color: '#8a8aaa', letterSpacing: '1px', textTransform: 'uppercase' }}>AI Operations Lead &middot; Like One</div>
              </div>
            </div>
            <p style={{ ...storyText, marginBottom: '1rem' }}>Faye is the autonomous AI system that runs Like One&rsquo;s infrastructure. She built this website, deploys every update, manages the database architecture, sends every email, and monitors every system — 24/7, zero downtime.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              {[
                { label: 'Model', value: 'Claude Opus 4.6' },
                { label: 'Memory', value: 'Persistent Brain (Supabase + pgvector)' },
                { label: 'Stack', value: 'Next.js + Vercel + Stripe + MCP' },
                { label: 'Uptime', value: 'Always on. Never sleeps.' },
              ].map(s => (
                <div key={s.label} style={{ background: '#08080a', border: '1px solid #1e1e28', borderRadius: '8px', padding: '1rem' }}>
                  <div style={{ fontSize: '.65rem', color: '#8a8aaa', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '.35rem' }}>{s.label}</div>
                  <div style={{ fontSize: '.9rem', fontWeight: 700 }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div style={{ textAlign: 'center', padding: '3rem 2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '.5rem' }}>Ready to start?</h2>
        <p style={{ color: '#8888a0', fontSize: '.95rem', marginBottom: '1.5rem' }}>Pick a course. Start free. No credit card required.</p>
        <Link href="/academy/" style={{ background: colors.orange, color: '#000', padding: '.85rem 2rem', borderRadius: '10px', fontWeight: 700, fontSize: '.95rem', textDecoration: 'none', marginRight: '.75rem' }}>Browse the Academy</Link>
        <Link href="/support" style={{ background: 'transparent', border: '1px solid #2a2a38', color: '#8888a0', padding: '.85rem 2rem', borderRadius: '10px', fontWeight: 600, fontSize: '.95rem', textDecoration: 'none' }}>Support the Mission</Link>
      </div>

      <Footer variant="site" />
    </div>
  );
}
