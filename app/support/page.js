'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import SiteLayout from '../components/SiteLayout';
import { site } from '../../lib/site-config';

const AMOUNTS = [
  { label: '$10', href: 'https://buy.stripe.com/fZu9AM1f28pF5iH4ps3sI0e' },
  { label: '$25', href: 'https://buy.stripe.com/eVq5kw4reeO3dPd2hk3sI0f' },
  { label: '$50', href: 'https://buy.stripe.com/8x26oAf5S35l3az9JM3sI0g', featured: true },
  { label: '$100', href: 'https://buy.stripe.com/dRmbIU5vibBR7qPbRU3sI0h' },
  { label: '$250', href: 'https://buy.stripe.com/eVq4gscXKcFV4eD4ps3sI0i' },
  { label: '$500', href: 'https://buy.stripe.com/dRm14gg9W9tJ26vcVY3sI0j' },
  { label: '$1,000', href: 'https://buy.stripe.com/14A14ge1O49p9yX09c3sI0k' },
  { label: 'Custom', href: `mailto:${site.email}?subject=Donation%20—%20Like%20One` },
];

function SupportContent() {
  const params = useSearchParams();
  const thanks = params.get('thanks');

  return (
    <SiteLayout maxWidth="680px">
      {/* Support / Help Section */}
      <div className="donate-hero">
        <h1 className="donate-hero-title">
          How can we <span className="accent-warm">help?</span>
        </h1>
        <p className="donate-hero-desc">
          We respond to every message personally. Here are the fastest ways to get help.
        </p>
      </div>

      <div className="donate-impact-grid">
        {[
          { emoji: '\u2709\uFE0F', title: 'Email Us', desc: 'hello@likeone.ai — we reply within 24 hours.', link: `mailto:${site.email}` },
          { emoji: '\uD83D\uDCAC', title: 'Community Forum', desc: 'Ask questions and get help from the community.', link: '/forum/' },
          { emoji: '\uD83D\uDCD6', title: 'Browse Courses', desc: 'First 3 lessons of every course are free.', link: '/academy/' },
        ].map(c => (
          <a key={c.title} href={c.link} className="donate-impact-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="donate-impact-emoji">{c.emoji}</div>
            <h3 className="donate-impact-title">{c.title}</h3>
            <p className="donate-impact-desc">{c.desc}</p>
          </a>
        ))}
      </div>

      <div className="donate-disclosure" style={{ marginBottom: '3rem' }}>
        <h3 className="donate-disclosure-title">Common Questions</h3>
        <p className="donate-disclosure-text"><strong>Cancel my subscription?</strong> Log into your <a href="/account/" className="donate-note-link">account</a> and use the Stripe billing portal. Instant, no questions asked.</p>
        <p className="donate-disclosure-text"><strong>Refund?</strong> 7-day full refund on your first payment. Email <a href={`mailto:${site.email}`} className="donate-note-link">{site.email}</a>.</p>
        <p className="donate-disclosure-text"><strong>Bug or broken page?</strong> Use the Report button at the bottom of any page, or post in the <a href="/forum/" className="donate-note-link">forum</a>.</p>
        <p className="donate-disclosure-text"><strong>Community Access?</strong> Can&rsquo;t afford Pro? <a href="/community-access/" className="donate-note-link">Apply here</a> — full access, honor system.</p>
      </div>

      {/* Donation Section */}
      <div className="donate-hero">
        <h2 className="donate-hero-title" style={{ fontSize: '1.8rem' }}>
          Help keep AI<br /><span className="accent-warm">accessible.</span>
        </h2>
        <p className="donate-hero-desc">
          Like One keeps a free path open for everyone. Your support funds free courses, research, and technology built with empathy.
        </p>
      </div>

      <div className="donate-impact-grid">
        {[
          { emoji: '\uD83D\uDCDA', title: 'Free Courses', desc: 'Keep AI education free and accessible to everyone, everywhere.' },
          { emoji: '\uD83E\uDDEC', title: 'Research', desc: "Fund research that saves lives. That's the mission." },
          { emoji: '\uD83C\uDF0D', title: 'AI for All', desc: 'Build convergence technology that belongs to everyone.' },
        ].map(c => (
          <div key={c.title} className="donate-impact-card">
            <div className="donate-impact-emoji">{c.emoji}</div>
            <h3 className="donate-impact-title">{c.title}</h3>
            <p className="donate-impact-desc">{c.desc}</p>
          </div>
        ))}
      </div>

      <div className="donate-box">
        {thanks ? (
          <>
            <div className="donate-thanks-emoji">{'\uD83D\uDC9C'}</div>
            <h2 className="donate-thanks-title">Thank you.</h2>
            <p className="donate-thanks-desc">Your support means everything. Every dollar brings us closer to AI that belongs to everyone.</p>
          </>
        ) : (
          <>
            <h2 className="donate-box-title">Choose an amount</h2>
            <p className="donate-box-desc">One-time contribution. Every dollar helps.</p>
            <div className="donate-amounts-grid">
              {AMOUNTS.slice(0, 4).map(a => (
                <a key={a.label} href={a.href} target="_blank" rel="noopener"
                  className={`donate-amount${a.featured ? ' featured' : ''}`}>
                  {a.label}
                </a>
              ))}
            </div>
            <div className="donate-amounts-grid">
              {AMOUNTS.slice(4).map(a => (
                <a key={a.label} href={a.href}
                  target={a.label === 'Custom' ? undefined : '_blank'}
                  rel="noopener"
                  className={`donate-amount${a.label === 'Custom' ? ' custom' : ''}`}>
                  {a.label}
                </a>
              ))}
            </div>
            <p className="donate-note">
              Secure payment via Stripe. For custom amounts or questions, email <a href={`mailto:${site.email}`} className="donate-note-link">{site.email}</a>.
            </p>
          </>
        )}
      </div>

      <p className="donate-transparency">
        <strong>Full transparency:</strong> Like One is early. As revenue grows, so does the impact. Every dollar goes toward building courses, technology, and a platform designed to prove that AI belongs to everyone.
      </p>

      <div className="donate-disclosure">
        <h3 className="donate-disclosure-title">Important Disclosure</h3>
        <p className="donate-disclosure-text">
          Like One is a sole proprietorship registered under Sophia Cave. It is not a nonprofit. Contributions are personal gifts — not tax-deductible. No equity, returns, or ownership are offered. Funds are used to build Like One and pursue the mission above. All contributions are final. If you contributed in error, email <a href={`mailto:${site.email}`} className="donate-note-link">{site.email}</a> within 7 days.
        </p>
      </div>
    </SiteLayout>
  );
}

export default function SupportPage() {
  return (
    <Suspense>
      <SupportContent />
    </Suspense>
  );
}
