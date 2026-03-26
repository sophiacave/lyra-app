'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import SiteLayout from '../components/SiteLayout';
import { site, colors } from '../../lib/site-config';

const AMOUNTS = [
  { label: '$10', href: 'https://buy.stripe.com/fZu9AM1f28pF5iH4ps3sI0e' },
  { label: '$25', href: 'https://buy.stripe.com/eVq5kw4reeO3dPd2hk3sI0f' },
  { label: '$50', href: 'https://buy.stripe.com/8x26oAf5S35l3az9JM3sI0g', featured: true },
  { label: '$100', href: 'https://buy.stripe.com/dRmbIU5vibBR7qPbRU3sI0h' },
  { label: '$250', href: 'https://buy.stripe.com/eVq4gscXKcFV4eD4ps3sI0i' },
  { label: '$500', href: 'https://buy.stripe.com/dRm14gg9W9tJ26vcVY3sI0j' },
  { label: '$1,000', href: 'https://buy.stripe.com/14A14ge1O49p9yX09c3sI0k' },
  { label: 'Custom', href: `mailto:${site.email}?subject=Donation%20—%20Like%20One`, style: { fontSize: '.8rem' } },
];

function SupportContent() {
  const params = useSearchParams();
  const thanks = params.get('thanks');

  return (
    <SiteLayout maxWidth="680px">
      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '3rem 0 1rem' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-1.5px', marginBottom: '1rem' }}>
          Help keep AI<br /><span style={{ color: colors.orange }}>accessible.</span>
        </h1>
        <p style={{ fontSize: '1.05rem', color: '#8888a0', maxWidth: '500px', margin: '0 auto', lineHeight: 1.7 }}>
          Like One keeps a free path open for everyone. Your support funds free courses, research, and technology built with empathy.
        </p>
      </div>

      {/* Where it goes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', margin: '2rem 0' }}>
        {[
          { emoji: '\uD83D\uDCDA', title: 'Free Courses', desc: 'Keep AI education free and accessible to everyone, everywhere.' },
          { emoji: '\uD83E\uDDEC', title: 'Research', desc: "Fund research that saves lives. That's the mission." },
          { emoji: '\uD83C\uDF0D', title: 'AI for All', desc: 'Build convergence technology that belongs to everyone.' },
        ].map(c => (
          <div key={c.title} style={{ background: '#111114', border: '1px solid #1e1e28', borderRadius: '12px', padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '.5rem' }}>{c.emoji}</div>
            <h3 style={{ fontSize: '.85rem', fontWeight: 700, marginBottom: '.25rem' }}>{c.title}</h3>
            <p style={{ color: '#8888a0', fontSize: '.75rem', lineHeight: 1.5 }}>{c.desc}</p>
          </div>
        ))}
      </div>

      {/* Donate */}
      <div style={{ background: '#111114', border: '1px solid #1e1e28', borderRadius: '20px', padding: '2.5rem', margin: '2rem auto', maxWidth: '520px', textAlign: 'center' }}>
        {thanks ? (
          <>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{'\uD83D\uDC9C'}</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '.75rem' }}>Thank you.</h2>
            <p style={{ color: '#8888a0', fontSize: '1rem', lineHeight: 1.7 }}>Your support means everything. Every dollar brings us closer to AI that belongs to everyone.</p>
          </>
        ) : (
          <>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '.35rem' }}>Choose an amount</h2>
            <p style={{ color: '#8888a0', fontSize: '.9rem', marginBottom: '1.5rem' }}>One-time contribution. Every dollar helps.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '12px' }}>
              {AMOUNTS.slice(0, 4).map(a => (
                <a key={a.label} href={a.href} target="_blank" rel="noopener" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: a.featured ? 'rgba(251,146,60,.06)' : '#08080a',
                  border: `2px solid ${a.featured ? colors.orange : '#1e1e28'}`,
                  borderRadius: '10px', padding: '.75rem', fontSize: '1.05rem', fontWeight: 700,
                  color: a.featured ? colors.orange : '#e8e8ec', textDecoration: 'none', transition: 'all .2s',
                  ...(a.style || {}),
                }}>{a.label}</a>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              {AMOUNTS.slice(4).map(a => (
                <a key={a.label} href={a.href} target={a.label === 'Custom' ? undefined : '_blank'} rel="noopener" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: '#08080a', border: '2px solid #1e1e28', borderRadius: '10px',
                  padding: '.75rem', fontSize: a.style?.fontSize || '1.05rem', fontWeight: 700,
                  color: '#e8e8ec', textDecoration: 'none', transition: 'all .2s',
                }}>{a.label}</a>
              ))}
            </div>
            <p style={{ color: '#8a8aaa', fontSize: '.75rem', marginTop: '1rem', lineHeight: 1.6 }}>
              Secure payment via Stripe. For custom amounts or questions, email <a href={`mailto:${site.email}`} style={{ color: colors.purple, textDecoration: 'none' }}>{site.email}</a>.
            </p>
          </>
        )}
      </div>

      {/* Transparency */}
      <p style={{ color: '#8888a0', fontSize: '.85rem', lineHeight: 1.7, maxWidth: '560px', margin: '2rem auto', textAlign: 'center' }}>
        <strong style={{ color: '#e8e8ec' }}>Full transparency:</strong> Like One is early. As revenue grows, so does the impact. Every dollar goes toward building courses, technology, and a platform designed to prove that AI belongs to everyone.
      </p>

      {/* Legal */}
      <div style={{ background: '#111114', border: '1px solid #1e1e28', borderRadius: '12px', padding: '1.25rem', margin: '2rem auto', maxWidth: '560px' }}>
        <h3 style={{ fontSize: '.7rem', fontWeight: 700, color: '#8a8aaa', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '.5rem' }}>Important Disclosure</h3>
        <p style={{ color: '#8a8aaa', fontSize: '.72rem', lineHeight: 1.7 }}>
          Like One is a sole proprietorship registered under Sophia Cave. It is not a nonprofit. Contributions are personal gifts — not tax-deductible. No equity, returns, or ownership are offered. Funds are used to build Like One and pursue the mission above. All contributions are final. If you contributed in error, email <a href={`mailto:${site.email}`} style={{ color: colors.purple, textDecoration: 'none' }}>{site.email}</a> within 7 days.
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
