'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { site, colors } from '../../lib/site-config';

const SUPABASE_URL = "https://blknphuwwgagtueqtoji.supabase.co";

const PLANS = [
  {
    label: 'Always available', name: 'Free', price: '$0', desc: 'Start learning AI right now. No credit card. No tricks.',
    features: ['First 3 lessons of every course', 'All blog posts', 'Weekly convergence tips email', 'Community forum access'],
    btn: { label: 'Start Free', href: '/academy/', style: 'secondary' },
  },
  {
    label: 'Most popular', name: 'Pro — Founding', price: '$4.90', period: '/mo', was: '$49',
    desc: 'Full access to everything. 90% off — locked in forever.', featured: true,
    features: ['All 97 interactive lessons', '10 courses (RAG, Agents, MCP & more)', 'All download products included', 'Completion certificates', 'New content added regularly', 'Priority email support', { text: 'Founding price — forever', highlight: true }],
    btn: { label: 'Go Pro — $4.90/mo', href: 'https://buy.stripe.com/fZufZae1OeO35iH5tw3sI0c', style: 'primary', external: true },
  },
  {
    label: 'Best value', name: 'Annual — Founding', price: '$39', period: '/yr', was: '$390',
    desc: "Everything in Pro. That's $3.33/mo. 90% off forever.",
    features: ['Everything in Pro', 'Save vs monthly billing', '12 months of new content', 'All future content included', { text: 'Founding price — forever', highlight: true }],
    btn: { label: 'Go Annual — $39/yr', href: 'https://buy.stripe.com/8x2bIUg9WgWb4eD7BE3sI0d', style: 'secondary', external: true },
  },
  {
    label: '1-on-1', name: 'Consulting', price: '$150', period: '/hr',
    desc: 'Work with Sophia directly on strategy, builds, or architecture.',
    features: ['1-on-1 sessions (voice or async)', 'Brain-prepped session notes', 'Done-for-you setup from $1,500', 'Monthly retainer available'],
    btn: { label: 'Email Sophia', href: 'mailto:hello@likeone.ai?subject=Consulting', style: 'secondary' },
  },
];

const FAQS = [
  { q: 'Can I really start for free?', a: 'Yes. Sign up with your email and access the first 3 lessons of every course. No credit card. No tricks. No time limit.' },
  { q: 'What does "founding price forever" mean?', a: "The first 1,000 members lock in 90% off for life. Your price never increases, even when we raise prices to $49/mo for new members. It's our thank-you for believing early." },
  { q: 'Can I cancel anytime?', a: 'Yes. Cancel from your Stripe billing portal anytime. No questions, no guilt. You keep access until the end of your billing period.' },
  { q: 'Is there a refund policy?', a: "7-day full refund on your first payment. Email hello@likeone.ai and it's done. We're human first." },
  { q: "What's Community Access?", a: "If you genuinely can't afford Pro, apply for Community Access. Full access, no cost, honor system. Sophia reviews every application personally." },
  { q: 'Do I need to be technical?', a: 'No. Courses range from absolute beginner to advanced. The beginner courses assume zero coding experience. You just need curiosity.' },
];

const COMPARE = [
  ['First 3 lessons of every course', true, true],
  ['All 97 interactive lessons', false, true],
  ['10 courses (MCP, RAG, Agents & more)', false, true],
  ['Download products (playbooks, templates)', false, true],
  ['Completion certificates', false, true],
  ['New content as it ships', false, true],
  ['Priority email support', false, true],
  ['Blog posts', true, true],
  ['Community forum', true, true],
  ['Weekly email tips', true, true],
];

export default function PricingPage() {
  const [foundingData, setFoundingData] = useState(null);

  useEffect(() => {
    fetch(`${SUPABASE_URL}/functions/v1/founding-count`)
      .then(r => r.json())
      .then(setFoundingData)
      .catch(() => {});
  }, []);

  return (
    <div style={{ background: '#08080a', color: '#e8e8ec', fontFamily: "'Inter', -apple-system, system-ui, sans-serif", minHeight: '100vh', WebkitFontSmoothing: 'antialiased' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap');
        .dm-serif { font-family: 'DM Serif Display', serif; font-weight: 400; }
        .price-card { opacity: 0; animation: fadeUp .5s cubic-bezier(.22,1,.36,1) forwards; }
        .price-card:nth-child(1) { animation-delay: .15s; }
        .price-card:nth-child(2) { animation-delay: .25s; }
        .price-card:nth-child(3) { animation-delay: .35s; }
        .price-card:nth-child(4) { animation-delay: .45s; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes borderFlow { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @media (max-width: 900px) { .pricing-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 560px) { .pricing-grid { grid-template-columns: 1fr !important; max-width: 380px; margin: 0 auto !important; } .faq-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      <Header variant="site" />

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '5rem 2rem 3rem' }}>
        <span style={{ display: 'inline-block', fontSize: '.65rem', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: colors.orange, border: '1px solid rgba(251,146,60,.25)', padding: '6px 18px', borderRadius: '100px', marginBottom: '2rem', background: 'rgba(251,146,60,.06)' }}>Founding Member Pricing</span>
        <h1 className="dm-serif" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', lineHeight: 1.1, letterSpacing: '-1px', marginBottom: '1.25rem' }}>
          Convergence is not<br />a <em style={{ color: colors.orange }}>luxury.</em>
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#8888a0', maxWidth: '540px', margin: '0 auto', lineHeight: 1.7 }}>
          There is always a free path. Always. Premium revenue funds research that matters, representation, and keeping AI accessible to everyone.
        </p>
      </section>

      {/* Founding Banner */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(251,146,60,.06), rgba(192,132,252,.06))', borderRadius: '16px', padding: '2.5rem', textAlign: 'center', margin: '2rem 0 3rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${colors.orange}, #e879f9, ${colors.purple}, ${colors.orange})`, backgroundSize: '300% 100%', animation: 'borderFlow 3s linear infinite' }} />
          <div style={{ display: 'inline-block', fontSize: '.6rem', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#000', background: colors.orange, padding: '5px 16px', borderRadius: '4px', marginBottom: '1rem' }}>LIMITED — FIRST 1,000 MEMBERS</div>
          <div className="dm-serif" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', marginBottom: '.5rem' }}>Lock in <span style={{ color: colors.orange }}>90% off</span> — forever.</div>
          <div style={{ color: '#8888a0', fontSize: '.95rem', lineHeight: 1.6, maxWidth: '560px', margin: '0 auto' }}>Founding members pay $4.90/mo or $39/yr for life. This price never increases. When founding spots close, it&rsquo;s full price ($49/mo).</div>
          {foundingData && foundingData.remaining < 500 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '1rem' }}>
              <div style={{ width: '200px', height: '8px', background: '#1e1e28', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: `linear-gradient(90deg, ${colors.orange}, #e879f9)`, borderRadius: '4px', width: `${((foundingData.total || 0) / 1000) * 100}%`, transition: 'width 1s ease' }} />
              </div>
              <span style={{ fontSize: '.8rem', color: '#8888a0', fontWeight: 600 }}><strong style={{ color: colors.orange }}>{foundingData.remaining?.toLocaleString()}</strong> founding spots left</span>
            </div>
          )}
        </div>
      </div>

      {/* Pricing Grid */}
      <section style={{ padding: '0 2rem 4rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {PLANS.map(plan => (
              <div key={plan.name} className="price-card" style={{
                background: plan.featured ? 'linear-gradient(180deg, rgba(251,146,60,.04) 0%, #111114 40%)' : '#111114',
                border: plan.featured ? `2px solid ${colors.orange}` : '1px solid #1e1e28',
                borderRadius: '16px', padding: '2rem 1.75rem', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden',
              }}>
                {plan.featured && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${colors.orange}, #e879f9)` }} />}
                <div style={{ fontSize: '.6rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#8a8aaa', marginBottom: '.75rem' }}>{plan.label}</div>
                <div className="dm-serif" style={{ fontSize: '1.3rem', marginBottom: '.5rem' }}>{plan.name}</div>
                <div style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '.5rem', letterSpacing: '-1px', color: plan.featured ? colors.orange : '#e8e8ec' }}>
                  {plan.was && <span style={{ textDecoration: 'line-through', color: '#8a8aaa', fontSize: '1rem', fontWeight: 400, marginRight: '6px' }}>{plan.was}</span>}
                  {plan.price}{plan.period && <span style={{ fontSize: '.85rem', fontWeight: 400, color: '#8888a0', letterSpacing: 0 }}>{plan.period}</span>}
                </div>
                <div style={{ color: '#8888a0', fontSize: '.8rem', marginBottom: '1.5rem', lineHeight: 1.5, minHeight: '42px' }} dangerouslySetInnerHTML={{ __html: plan.desc.replace(/90% off/, '<strong style="color:#e8e8ec">90% off</strong>') }} />
                <ul style={{ listStyle: 'none', marginBottom: '1.5rem', flex: 1, padding: 0 }}>
                  {plan.features.map((f, i) => {
                    const text = typeof f === 'string' ? f : f.text;
                    const highlight = typeof f === 'object' && f.highlight;
                    return (
                      <li key={i} style={{ fontSize: '.8rem', color: highlight ? colors.orange : '#8888a0', fontWeight: highlight ? 600 : 400, padding: '.45rem 0', borderBottom: i < plan.features.length - 1 ? '1px solid rgba(30,30,40,.7)' : 'none', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                        <span style={{ color: highlight ? colors.orange : '#4ade80', flexShrink: 0, fontWeight: 700, fontSize: '.75rem', marginTop: '1px' }}>{'\u2713'}</span>
                        {text}
                      </li>
                    );
                  })}
                </ul>
                {plan.btn.external ? (
                  <a href={plan.btn.href} target="_blank" rel="noopener" style={{
                    width: '100%', padding: '.8rem', borderRadius: '10px', fontWeight: 700, fontSize: '.85rem', textAlign: 'center', textDecoration: 'none', display: 'block', letterSpacing: '.3px',
                    ...(plan.btn.style === 'primary' ? { background: colors.orange, color: '#000', border: 'none' } : { background: 'transparent', color: '#e8e8ec', border: '1px solid #2a2a38' }),
                  }}>{plan.btn.label}</a>
                ) : (
                  <Link href={plan.btn.href} style={{
                    width: '100%', padding: '.8rem', borderRadius: '10px', fontWeight: 700, fontSize: '.85rem', textAlign: 'center', textDecoration: 'none', display: 'block', letterSpacing: '.3px',
                    background: 'transparent', color: '#e8e8ec', border: '1px solid #2a2a38',
                  }}>{plan.btn.label}</Link>
                )}
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem', padding: '1.25rem', background: 'rgba(192,132,252,.04)', border: '1px solid rgba(192,132,252,.12)', borderRadius: '12px' }}>
            <p style={{ color: '#8888a0', fontSize: '.85rem' }}>Can&rsquo;t afford it right now? <Link href="/community-access" style={{ color: colors.purple, textDecoration: 'underline', fontWeight: 600 }}>Apply for Community Access</Link> — full access, no cost, honor system. Because AI education should reach everyone.</p>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section style={{ padding: '3rem 2rem 4rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 className="dm-serif" style={{ fontSize: '1.75rem', textAlign: 'center', marginBottom: '.75rem' }}>Free vs Pro — side by side</h2>
          <p style={{ textAlign: 'center', color: '#8888a0', fontSize: '.95rem', marginBottom: '2.5rem' }}>See exactly what you get at each level.</p>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.7rem', color: '#8a8aaa', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', width: '50%', borderBottom: '1px solid #1e1e28' }}>Feature</th>
                <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.7rem', color: '#8a8aaa', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', borderBottom: '1px solid #1e1e28' }}>Free</th>
                <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.7rem', color: colors.orange, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', borderBottom: '1px solid #1e1e28' }}>Pro</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.map(([feature, free, pro], i) => (
                <tr key={i}>
                  <td style={{ padding: '.75rem 1rem', fontSize: '.85rem', color: '#e8e8ec', fontWeight: 500, borderBottom: '1px solid #1e1e28' }}>{feature}</td>
                  <td style={{ padding: '.75rem 1rem', fontSize: '.85rem', color: free ? '#4ade80' : '#2a2a38', fontWeight: 700, borderBottom: '1px solid #1e1e28' }}>{free ? '\u2713' : '\u2014'}</td>
                  <td style={{ padding: '.75rem 1rem', fontSize: '.85rem', color: '#4ade80', fontWeight: 700, borderBottom: '1px solid #1e1e28' }}>{pro ? '\u2713' : '\u2014'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '3rem 2rem 5rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 className="dm-serif" style={{ fontSize: '1.75rem', textAlign: 'center', marginBottom: '2.5rem' }}>Common questions</h2>
          <div className="faq-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', maxWidth: '900px', margin: '0 auto' }}>
            {FAQS.map((f, i) => (
              <div key={i} style={{ background: '#111114', border: '1px solid #1e1e28', borderRadius: '12px', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '.9rem', fontWeight: 700, marginBottom: '.5rem' }}>{f.q}</h3>
                <p style={{ color: '#8888a0', fontSize: '.82rem', lineHeight: 1.6 }}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ textAlign: 'center', padding: '3rem 2rem 4rem' }}>
        <h2 className="dm-serif" style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: '.75rem' }}>Ready to start?</h2>
        <p style={{ color: '#8888a0', fontSize: '.95rem', marginBottom: '1.5rem', maxWidth: '480px', margin: '0 auto 1.5rem' }}>Preview any course free. Upgrade when you&rsquo;re ready. No pressure. No countdown timers. Just warmth and knowledge.</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/academy/" style={{ padding: '.85rem 2rem', borderRadius: '10px', fontWeight: 700, fontSize: '.9rem', textDecoration: 'none', background: colors.orange, color: '#000' }}>Browse Courses</Link>
          <a href="https://buy.stripe.com/fZufZae1OeO35iH5tw3sI0c" target="_blank" rel="noopener" style={{ padding: '.85rem 2rem', borderRadius: '10px', fontWeight: 700, fontSize: '.9rem', textDecoration: 'none', background: 'transparent', border: '1px solid #2a2a38', color: '#8888a0' }}>Go Pro — $4.90/mo</a>
        </div>
      </section>

      <Footer variant="site" />
    </div>
  );
}
