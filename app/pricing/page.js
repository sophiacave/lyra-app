'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

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
    features: ['All 300+ interactive lessons', '30 courses (RAG, Agents, MCP & more)', 'All download products included', 'Completion certificates', 'New content added regularly', 'Priority email support', { text: 'Founding price — forever', highlight: true }],
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
  ['All 300+ interactive lessons', false, true],
  ['30 courses (MCP, RAG, Agents & more)', false, true],
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
    <div className="site-page">
      <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap" rel="stylesheet" />

      <Header variant="site" />

      {/* Hero */}
      <section className="site-section-sm text-center">
        <span className="site-section-tag pricing-hero-tag">Founding Member Pricing</span>
        <h1 className="dm-serif pricing-hero-title">
          Convergence is not<br />a <em className="text-accent-warm">luxury.</em>
        </h1>
        <p className="pricing-hero-desc">
          There is always a free path. Always. Premium revenue funds research that matters, representation, and keeping AI accessible to everyone.
        </p>
      </section>

      {/* Founding Banner */}
      <div className="site-container">
        <div className="pricing-banner">
          <div className="pricing-banner-bar" />
          <div className="pricing-banner-badge">LIMITED — FIRST 1,000 MEMBERS</div>
          <div className="dm-serif pricing-banner-title">Lock in <span className="accent">90% off</span> — forever.</div>
          <div className="pricing-banner-desc">Founding members pay $4.90/mo or $39/yr for life. This price never increases. When founding spots close, it&rsquo;s full price ($49/mo).</div>
          {foundingData && foundingData.remaining < 500 && (
            <div className="pricing-spots-row">
              <div className="pricing-spots-bar">
                <div className="pricing-spots-fill" style={{ width: `${((foundingData.total || 0) / 1000) * 100}%` }} />
              </div>
              <span className="pricing-spots-text"><strong>{foundingData.remaining?.toLocaleString()}</strong> founding spots left</span>
            </div>
          )}
        </div>
      </div>

      {/* Pricing Grid */}
      <section className="site-section-sm">
        <div className="site-container">
          <div className="pricing-grid">
            {PLANS.map(plan => (
              <div key={plan.name} className={`pricing-card price-card ${plan.featured ? 'featured' : ''}`}>
                <div className="pricing-card-label">{plan.label}</div>
                <div className="dm-serif pricing-card-name">{plan.name}</div>
                <div className={`pricing-card-price ${plan.featured ? 'accent' : ''}`}>
                  {plan.was && <span className="was">{plan.was}</span>}
                  {plan.price}{plan.period && <span className="period">{plan.period}</span>}
                </div>
                <div className="pricing-card-desc">{plan.desc}</div>
                <ul className="pricing-card-features">
                  {plan.features.map((f, i) => {
                    const text = typeof f === 'string' ? f : f.text;
                    const highlight = typeof f === 'object' && f.highlight;
                    return (
                      <li key={i} className={`pricing-card-feature ${highlight ? 'highlight' : ''}`}>
                        <span className="check">✓</span>
                        {text}
                      </li>
                    );
                  })}
                </ul>
                {plan.btn.external ? (
                  <a href={plan.btn.href} target="_blank" rel="noopener" className={`pricing-card-btn ${plan.btn.style}`}>{plan.btn.label}</a>
                ) : (
                  <Link href={plan.btn.href} className={`pricing-card-btn ${plan.btn.style}`}>{plan.btn.label}</Link>
                )}
              </div>
            ))}
          </div>

          <div className="pricing-community-note">
            <p>Can&rsquo;t afford it right now? <Link href="/community-access">Apply for Community Access</Link> — full access, no cost, honor system. Because AI education should reach everyone.</p>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="site-section-sm">
        <div className="site-container">
          <h2 className="dm-serif pricing-compare-title">Free vs Pro — side by side</h2>
          <p className="pricing-compare-desc">See exactly what you get at each level.</p>
          <table className="site-compare-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Free</th>
                <th className="accent">Pro</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.map(([feature, free, pro], i) => (
                <tr key={i}>
                  <td>{feature}</td>
                  <td className={free ? 'site-compare-check' : 'site-compare-dash'}>{free ? '✓' : '—'}</td>
                  <td className="site-compare-check">✓</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section className="site-section-sm">
        <div className="site-container">
          <h2 className="dm-serif pricing-faq-title">Common questions</h2>
          <div className="site-faq-grid">
            {FAQS.map((f, i) => (
              <div key={i} className="site-faq-card">
                <h3 className="site-faq-question">{f.q}</h3>
                <p className="site-faq-answer">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="site-section-sm text-center">
        <h2 className="dm-serif pricing-cta-title">Ready to start?</h2>
        <p className="pricing-cta-desc">Preview any course free. Upgrade when you&rsquo;re ready. No pressure. No countdown timers. Just warmth and knowledge.</p>
        <div className="site-cta-row">
          <Link href="/academy/" className="site-btn-primary">Browse Courses</Link>
          <a href="https://buy.stripe.com/fZufZae1OeO35iH5tw3sI0c" target="_blank" rel="noopener" className="site-btn-secondary">Go Pro — $4.90/mo</a>
        </div>
      </section>

      <Footer variant="site" />
    </div>
  );
}
