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
      <div className="donate-hero">
        <h1 className="donate-hero-title">
          Help keep AI<br /><span className="accent-warm">accessible.</span>
        </h1>
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
