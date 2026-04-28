'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

const whoCards = [
  { emoji: '🏳️‍⚧️', label: 'LGBTQ+ community' },
  { emoji: '🌍', label: 'Global South' },
  { emoji: '♿', label: 'Disability community' },
  { emoji: '💜', label: 'Financial hardship' },
];

export default function CommunityAccessClient() {
  const [spotsLeft, setSpotsLeft] = useState(15);
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
      const res = await fetch('/api/community-spots');
      if (!res.ok) { setSpotsLeft(15); return; }
      const data = await res.json();
      setSpotsLeft(typeof data?.remaining === 'number' ? data.remaining : 15);
    } catch {
      setSpotsLeft(15);
    }
  }

  async function handleClaim() {
    if (!email || !honor) return;
    setSubmitting(true);
    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'community_access', goal }),
      });
      setSuccess(true);
    } catch {
      setSubmitting(false);
    }
  }

  const soldOut = spotsLeft !== null && spotsLeft <= 0;

  return (
    <div className="site-page">
      <Header variant="site" />

      {/* Hero */}
      <section className="ca-hero">
        <div className="ca-hero-inner">
          <h1 className="ca-hero-title">
            Access for <span className="text-purple">everyone.</span>
          </h1>
          <p className="ca-hero-desc">
            AI skills shouldn&rsquo;t cost you what you don&rsquo;t have. If you&rsquo;re facing barriers — financial, social, or otherwise — we&rsquo;ve got you.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="ca-content">
        <div className="ca-inner">
          <p className="ca-story">
            Like One Academy believes that the people most likely to be left behind by AI are the ones who need it most. That&rsquo;s not a market gap — it&rsquo;s a moral one.
          </p>
          <p className="ca-story">
            Our <strong>Community Access</strong> program provides full, instant access to every course and lesson — the same experience as a paid member. No waitlist. No application essay. No proving you &ldquo;deserve&rdquo; it.
          </p>

          {/* Who cards */}
          <div className="ca-who-grid">
            {whoCards.map(c => (
              <div key={c.label} className="ca-who-card">
                <div className="ca-who-emoji">{c.emoji}</div>
                {c.label}
              </div>
            ))}
          </div>

          <p className="ca-story">
            We release <strong>15 community spots every week</strong>, resetting Monday at midnight Pacific. When they&rsquo;re gone, they&rsquo;re gone — but they always come back.
          </p>

          {/* Counter */}
          <div className={`ca-counter ${soldOut ? 'sold-out' : 'available'}`}>
            {spotsLeft !== null && (
              <div className={`ca-counter-number ${soldOut ? 'sold-out' : 'available'}`}>
                {spotsLeft}
              </div>
            )}
            <div className="ca-counter-label">
              {soldOut
                ? 'All spots claimed this week — check back Monday'
                : spotsLeft !== null
                  ? 'community spots available this week'
                  : 'Community spots available — refreshing...'}
            </div>
          </div>

          {/* Signup form or success */}
          {success ? (
            <div className="ca-success-card">
              <div className="ca-success-emoji">💜</div>
              <h2 className="ca-success-title">You&rsquo;re in.</h2>
              <p className="ca-success-desc">
                Full access to Like One Academy is yours. No conditions. No time limit. Learn everything.
              </p>
              <p><Link href="/academy/" className="ca-success-link">Start learning now &rarr;</Link></p>
              <p className="ca-upgrade-note">
                When you&rsquo;re ready, upgrading to a paid membership keeps this program running for the next person.
              </p>
            </div>
          ) : (
            <div className="ca-form-card">
              <h2 className="ca-form-title">Claim your spot</h2>
              <p className="ca-form-desc">Full access. Instant. No strings.</p>

              <div className="ca-field">
                <label className="account-field-label">Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="app-input"
                />
              </div>

              <div className="ca-field">
                <label className="account-field-label">What are you hoping to learn? (optional)</label>
                <textarea
                  placeholder="I want to learn how to build AI agents..."
                  maxLength={280}
                  value={goal}
                  onChange={e => setGoal(e.target.value)}
                  className="app-input app-textarea"
                />
              </div>

              <div className="ca-honor-row">
                <input
                  type="checkbox"
                  checked={honor}
                  onChange={e => setHonor(e.target.checked)}
                  className="ca-honor-check"
                />
                <label className="ca-honor-label">
                  I&rsquo;m accessing this program in good faith. I face financial or social barriers to AI education.
                </label>
              </div>

              <button
                onClick={handleClaim}
                disabled={submitting || soldOut || !email || !honor}
                className="ca-claim-btn"
              >
                {submitting ? 'Claiming...' : soldOut ? 'All spots claimed — back Monday' : 'Claim Your Spot'}
              </button>

              <p className="ca-upgrade-note">
                When you&rsquo;re ready, upgrading to a paid membership keeps this program running for the next person.
              </p>
            </div>
          )}

          {/* Share */}
          <div className="ca-share">
            <p className="ca-share-desc">Know someone who needs this? Share it.</p>
            <div className="ca-share-links">
              <a href="https://twitter.com/intent/tweet?text=Free%20AI%20education%20for%20LGBTQ%2B%20and%20marginalized%20communities.%2015%20spots%20per%20week%2C%20honor%20system.%20No%20gatekeeping.&url=https%3A%2F%2Flikeone.ai%2Fcommunity-access" target="_blank" rel="noopener noreferrer" className="ca-share-btn">Share on X</a>
              <a href="https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Flikeone.ai%2Fcommunity-access" target="_blank" rel="noopener noreferrer" className="ca-share-btn">LinkedIn</a>
              <button onClick={() => { navigator.clipboard.writeText('https://likeone.ai/community-access'); }} className="ca-share-btn">Copy Link</button>
            </div>
          </div>

          {/* Legal */}
          <p className="ca-legal">
            Like One Academy&rsquo;s Community Access program operates on an honor system. We do not verify identity or financial status. By claiming a spot, you confirm that you are accessing this program in good faith. Like One Academy reserves the right to modify or revoke access if the program is abused. This program is funded by the generosity of paying members and is subject to availability. Like One LLC is a Nevada limited liability company. Like One Foundation is an IRS-recognized 501(c)(3) tax-exempt nonprofit. Community Access is a discretionary program, not a legal entitlement.
          </p>
        </div>
      </section>

      <Footer variant="site" />
    </div>
  );
}
