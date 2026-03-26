'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { colors } from '../../lib/site-config';

const SUPABASE_URL = 'https://blknphuwwgagtueqtoji.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsa25waHV3d2dhZ3R1ZXF0b2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0MDcxNTgsImV4cCI6MjA4OTk4MzE1OH0.Wm7-plwu9N7sG2SzD_C9mHUwB4Ceh91F7fimraVBG_s';

const whoCards = [
  { emoji: '🏳️‍⚧️', label: 'LGBTQ+ community' },
  { emoji: '🌍', label: 'Global South' },
  { emoji: '♿', label: 'Disability community' },
  { emoji: '💜', label: 'Financial hardship' },
];

export default function CommunityAccessClient() {
  const [spotsLeft, setSpotsLeft] = useState(null);
  const [email, setEmail] = useState('');
  const [goal, setGoal] = useState('');
  const [honor, setHonor] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadSpots();
  }, []);

  async function loadSpots() {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/community_spots_remaining`, {
        method: 'POST',
        headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}`, 'Content-Type': 'application/json' },
        body: '{}',
      });
      const remaining = await res.json();
      setSpotsLeft(typeof remaining === 'number' ? remaining : 15);
    } catch {
      setSpotsLeft(15);
    }
  }

  async function handleClaim() {
    if (!email || !honor) return;
    setSubmitting(true);
    try {
      await fetch(`${SUPABASE_URL}/functions/v1/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ANON_KEY}` },
        body: JSON.stringify({ email, source: 'community_access', goal }),
      });
      setSuccess(true);
    } catch {
      setSubmitting(false);
    }
  }

  const soldOut = spotsLeft !== null && spotsLeft <= 0;

  return (
    <div style={{ background: '#08080a', color: '#e8e8ec', fontFamily: "'Inter', -apple-system, system-ui, sans-serif", minHeight: '100vh', WebkitFontSmoothing: 'antialiased' }}>
      <Header variant="site" />

      {/* Hero */}
      <section style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '5rem 2rem 3rem' }}>
        <div style={{ maxWidth: '600px' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-1.5px', marginBottom: '1rem' }}>
            Access for <span style={{ color: colors.purple }}>everyone.</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#8888a0', maxWidth: '500px', margin: '0 auto', lineHeight: 1.8 }}>
            AI skills shouldn&rsquo;t cost you what you don&rsquo;t have. If you&rsquo;re facing barriers — financial, social, or otherwise — we&rsquo;ve got you.
          </p>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: '0 2rem 3rem' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <p style={{ color: '#8888a0', fontSize: '1rem', lineHeight: 1.8, marginBottom: '1.25rem' }}>
            Like One Academy believes that the people most likely to be left behind by AI are the ones who need it most. That&rsquo;s not a market gap — it&rsquo;s a moral one.
          </p>
          <p style={{ color: '#8888a0', fontSize: '1rem', lineHeight: 1.8, marginBottom: '1.25rem' }}>
            Our <strong style={{ color: '#e8e8ec' }}>Community Access</strong> program provides full, instant access to every course and lesson — the same experience as a paid member. No waitlist. No application essay. No proving you &ldquo;deserve&rdquo; it.
          </p>

          {/* Who cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', margin: '1.5rem 0' }}>
            {whoCards.map(c => (
              <div key={c.label} style={{ background: '#111114', border: '1px solid #1e1e28', borderRadius: '10px', padding: '1rem', textAlign: 'center', fontSize: '.85rem', color: '#8888a0' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '.35rem' }}>{c.emoji}</div>
                {c.label}
              </div>
            ))}
          </div>

          <p style={{ color: '#8888a0', fontSize: '1rem', lineHeight: 1.8, marginBottom: '1.25rem' }}>
            We release <strong style={{ color: '#e8e8ec' }}>15 community spots every week</strong>, resetting Monday at midnight Pacific. When they&rsquo;re gone, they&rsquo;re gone — but they always come back.
          </p>

          {/* Counter */}
          <div style={{
            background: '#111114',
            border: `1px solid ${soldOut ? colors.orange : '#4ade80'}`,
            borderRadius: '12px',
            padding: '1.5rem',
            textAlign: 'center',
            margin: '2rem 0',
          }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: soldOut ? colors.orange : '#4ade80' }}>
              {spotsLeft === null ? '...' : spotsLeft}
            </div>
            <div style={{ color: '#8888a0', fontSize: '.9rem', marginTop: '.25rem' }}>
              {soldOut ? 'spots claimed this week — check back Monday' : 'community spots available this week'}
            </div>
          </div>

          {/* Signup form or success */}
          {success ? (
            <div style={{ background: '#111114', border: '1px solid #1e1e28', borderRadius: '16px', padding: '2rem', margin: '2rem 0', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💜</div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '.75rem' }}>You&rsquo;re in.</h2>
              <p style={{ color: '#8888a0', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1rem' }}>
                Full access to Like One Academy is yours. No conditions. No time limit. Learn everything.
              </p>
              <p><Link href="/academy/" style={{ color: colors.purple, textDecoration: 'none', fontWeight: 600 }}>Start learning now &rarr;</Link></p>
              <p style={{ fontSize: '.85rem', color: '#8a8aaa', marginTop: '1.5rem' }}>
                When you&rsquo;re ready, upgrading to a paid membership keeps this program running for the next person.
              </p>
            </div>
          ) : (
            <div style={{ background: '#111114', border: '1px solid #1e1e28', borderRadius: '16px', padding: '2rem', margin: '2rem 0' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '.5rem' }}>Claim your spot</h2>
              <p style={{ color: '#8888a0', fontSize: '.9rem', marginBottom: '1.5rem' }}>Full access. Instant. No strings.</p>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '.8rem', fontWeight: 600, color: '#8888a0', marginBottom: '.35rem', textTransform: 'uppercase', letterSpacing: '.5px' }}>Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '.7rem 1rem', background: '#08080a', border: '1px solid #1e1e28', borderRadius: '8px', color: '#e8e8ec', fontSize: '.95rem', fontFamily: 'inherit', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '.8rem', fontWeight: 600, color: '#8888a0', marginBottom: '.35rem', textTransform: 'uppercase', letterSpacing: '.5px' }}>What are you hoping to learn? (optional)</label>
                <textarea
                  placeholder="I want to learn how to build AI agents..."
                  maxLength={280}
                  value={goal}
                  onChange={e => setGoal(e.target.value)}
                  style={{ width: '100%', padding: '.7rem 1rem', background: '#08080a', border: '1px solid #1e1e28', borderRadius: '8px', color: '#e8e8ec', fontSize: '.95rem', fontFamily: 'inherit', outline: 'none', resize: 'vertical', minHeight: '60px' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', margin: '1.25rem 0' }}>
                <input
                  type="checkbox"
                  checked={honor}
                  onChange={e => setHonor(e.target.checked)}
                  style={{ marginTop: '4px', accentColor: colors.purple }}
                />
                <label style={{ fontSize: '.85rem', color: '#8888a0', lineHeight: 1.5 }}>
                  I&rsquo;m accessing this program in good faith. I face financial or social barriers to AI education.
                </label>
              </div>

              <button
                onClick={handleClaim}
                disabled={submitting || soldOut || !email || !honor}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: '#4ade80',
                  color: '#000',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  cursor: submitting || soldOut ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                  opacity: submitting || soldOut ? 0.5 : 1,
                  transition: 'all .3s',
                }}
              >
                {submitting ? 'Claiming...' : soldOut ? 'All spots claimed — back Monday' : 'Claim Your Spot'}
              </button>

              <p style={{ color: '#8a8aaa', fontSize: '.8rem', marginTop: '.75rem', textAlign: 'center' }}>
                When you&rsquo;re ready, upgrading to a paid membership keeps this program running for the next person.
              </p>
            </div>
          )}

          {/* Share */}
          <div style={{ textAlign: 'center', margin: '2rem 0' }}>
            <p style={{ color: '#8888a0', fontSize: '.9rem', marginBottom: '.75rem' }}>Know someone who needs this? Share it.</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="https://twitter.com/intent/tweet?text=Free%20AI%20education%20for%20LGBTQ%2B%20and%20marginalized%20communities.%2015%20spots%20per%20week%2C%20honor%20system.%20No%20gatekeeping.&url=https%3A%2F%2Flikeone.ai%2Fcommunity-access" target="_blank" rel="noopener noreferrer" style={{ padding: '.5rem 1.25rem', background: '#111114', border: '1px solid #1e1e28', borderRadius: '8px', color: '#8888a0', textDecoration: 'none', fontSize: '.85rem', fontWeight: 600 }}>Share on X</a>
              <a href="https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Flikeone.ai%2Fcommunity-access" target="_blank" rel="noopener noreferrer" style={{ padding: '.5rem 1.25rem', background: '#111114', border: '1px solid #1e1e28', borderRadius: '8px', color: '#8888a0', textDecoration: 'none', fontSize: '.85rem', fontWeight: 600 }}>LinkedIn</a>
              <button onClick={() => { navigator.clipboard.writeText('https://likeone.ai/community-access'); }} style={{ padding: '.5rem 1.25rem', background: '#111114', border: '1px solid #1e1e28', borderRadius: '8px', color: '#8888a0', fontSize: '.85rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Copy Link</button>
            </div>
          </div>

          {/* Legal */}
          <p style={{ color: '#8a8aaa', fontSize: '.75rem', lineHeight: 1.7, marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #1e1e28' }}>
            Like One Academy&rsquo;s Community Access program operates on an honor system. We do not verify identity or financial status. By claiming a spot, you confirm that you are accessing this program in good faith. Like One Academy reserves the right to modify or revoke access if the program is abused. This program is funded by the generosity of paying members and is subject to availability. Like One is a sole proprietorship registered under Sophia Cave. It is not a registered nonprofit. Community Access is a discretionary program, not a legal entitlement.
          </p>
        </div>
      </section>

      <Footer variant="site" />
    </div>
  );
}
