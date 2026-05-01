'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

function StatusBadge({ status }) {
  return (
    <span className={`status-badge ${status}`}>
      {status === 'active' ? 'Active' : status === 'cancelled' ? 'Cancelling' : status === 'community' ? 'Community' : 'Free'}
    </span>
  );
}

export default function AccountClient() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [savingName, setSavingName] = useState(false);
  const [nameMsg, setNameMsg] = useState('');
  const [signinEmail, setSigninEmail] = useState('');
  const [signinSent, setSigninSent] = useState(false);
  const [signinLoading, setSigninLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [cancelling, setCancelling] = useState(false);

  // Check for auth callback params (from magic link redirect)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authToken = params.get('lo_auth');
    const authEmail = params.get('lo_email');
    const error = params.get('error');

    if (error) {
      setErrorMsg(error === 'invalid_or_expired' ? 'Sign-in link expired. Please try again.' : 'Sign-in failed. Please try again.');
    }

    if (authToken && authEmail) {
      // Store session from magic link callback
      localStorage.setItem('lo_session', authToken);
      localStorage.setItem('lo_email', authEmail);
      // Clean URL
      window.history.replaceState({}, '', '/account');
    }

    checkSession();
  }, []);

  async function checkSession() {
    try {
      // Try server-side session (cookie)
      const res = await fetch('/api/auth/session', { credentials: 'include' });
      const data = await res.json();

      if (data.authenticated) {
        setSession({ email: data.email });
        setSubscription(data.subscription);
        setDisplayName(localStorage.getItem('lo_display_name') || data.email.split('@')[0]);
        setLoading(false);
        return;
      }

      // Try localStorage token as fallback (with cookie too)
      const token = localStorage.getItem('lo_session');
      if (token) {
        const res2 = await fetch('/api/auth/session', {
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include',
        });
        const data2 = await res2.json();
        if (data2.authenticated) {
          setSession({ email: data2.email });
          setSubscription(data2.subscription);
          setDisplayName(localStorage.getItem('lo_display_name') || data2.email.split('@')[0]);
          setLoading(false);
          return;
        }
      }
    } catch {
      // Session check failed, show sign-in
    }
    setLoading(false);
  }

  async function handleSignin(e) {
    e.preventDefault();
    if (!signinEmail) return;
    setSigninLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/auth/send-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signinEmail, returnTo: '/account' }),
      });
      const data = await res.json();
      if (data.success) {
        setSigninSent(true);
      } else {
        setErrorMsg(data.error || 'Failed to send link.');
      }
    } catch {
      setErrorMsg('Something went wrong. Please try again.');
    }
    setSigninLoading(false);
  }

  async function signOut() {
    try {
      await fetch('/api/auth/session', { method: 'DELETE', credentials: 'include' });
    } catch { /* ok */ }
    localStorage.removeItem('lo_session');
    localStorage.removeItem('lo_email');
    setSession(null);
    setSubscription(null);
  }

  function saveDisplayName() {
    if (!displayName.trim()) return;
    setSavingName(true);
    localStorage.setItem('lo_display_name', displayName);
    localStorage.setItem('forum_name', displayName);
    if (session?.email) localStorage.setItem('forum_email', session.email);
    setNameMsg('Saved!');
    setTimeout(() => setNameMsg(''), 2000);
    setSavingName(false);
  }

  async function cancelSubscriptionHandler() {
    setCancelling(true);
    try {
      const token = localStorage.getItem('lo_session');
      const res = await fetch('/api/auth/cancel-subscription', {
        method: 'POST',
        credentials: 'include',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Subscription cancelled. You keep access until your current period ends. Thank you for being a member.');
        setSubscription(s => ({ ...s, status: 'cancelled', tier: 'free' }));
      } else {
        throw new Error(data.error);
      }
    } catch {
      setErrorMsg("Something went wrong. Email hello@likeone.ai and we'll cancel immediately. No questions.");
    }
    setCancelling(false);
  }

  async function openBillingPortal() {
    try {
      const token = localStorage.getItem('lo_session');
      const res = await fetch('/api/auth/billing-portal', {
        method: 'POST',
        credentials: 'include',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.url) {
        window.open(data.url, '_blank');
      } else {
        setErrorMsg("Couldn't open billing portal. Email hello@likeone.ai for help.");
      }
    } catch {
      setErrorMsg("Couldn't open billing portal. Email hello@likeone.ai for help.");
    }
  }

  const status = subscription?.status || 'free';
  const tier = subscription?.tier || 'free';
  const isPaid = status === 'active' && tier === 'pro';
  const isCommunity = tier === 'community';
  const email = session?.email;
  const initial = (displayName || 'U').charAt(0).toUpperCase();

  if (loading) {
    return (
      <div className="site-page">
        <Header variant="site" />
        <div className="app-loading">Loading...</div>
        <Footer variant="site" />
      </div>
    );
  }

  return (
    <div className="site-page">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Header variant="site" />

      <main id="main-content" className="account-main">
        {!session ? (
          /* SIGNED OUT — Liquid Glass Auth Gate */
          <div className="account-signin">
            <div className="account-signin-glass liquid-panel liquid-hero liquid-animate-scale">
              <span className="liquid-edge" aria-hidden="true" />
              <div className="account-signin-glass-inner">
                <div className="account-signin-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" width="32" height="32">
                    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <h1 className="account-signin-title">Welcome to Like One</h1>
                <p className="account-signin-desc">
                  Sign in to access your courses, manage your subscription, and join the community.
                </p>

                {errorMsg && (
                  <div className="app-msg-error" role="alert">{errorMsg}</div>
                )}

                <div className="account-divider">
                  <div className="account-divider-line" />
                  <span className="account-divider-text">sign in with email</span>
                  <div className="account-divider-line" />
                </div>

                {signinSent ? (
                  <div className="account-magic-sent" role="status" aria-live="polite">
                    <div className="account-magic-sent-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
                        <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M2 7l8.8 5.5a2 2 0 002.4 0L22 7" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </div>
                    <p>Check your email for the magic link.</p>
                    <p className="hint">
                      Didn&rsquo;t get it? Check spam, or <a href="mailto:hello@likeone.ai">email us</a>.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSignin} className="account-signin-form">
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={signinEmail}
                      onChange={e => setSigninEmail(e.target.value)}
                      required
                      className="liquid-input"
                      aria-label="Email address"
                      autoComplete="email"
                    />
                    <button
                      type="submit"
                      disabled={signinLoading}
                      className="liquid-btn liquid-btn-accent"
                    >
                      {signinLoading ? 'Sending...' : 'Send Magic Link'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* SIGNED IN */
          <>
            <h1 className="account-title">
              My <span className="text-purple">Account</span>
            </h1>
            <p className="account-subtitle">Welcome back, friend.</p>

            {successMsg && (
              <div className="app-msg-success">{successMsg}</div>
            )}
            {errorMsg && (
              <div className="app-msg-error">{errorMsg}</div>
            )}

            {/* Profile */}
            <div className="app-card liquid-panel liquid-animate-up">
              <span className="liquid-edge" aria-hidden="true" />
              <div className="app-card-label">Profile</div>
              <div className="account-profile-row">
                <div className="account-avatar">
                  {initial}
                </div>
                <div>
                  <div className="account-profile-name">{displayName}</div>
                  <div className="account-profile-email">{email}</div>
                </div>
              </div>
              <div className="app-form-group">
                <label className="account-field-label">Display Name</label>
                <div className="app-form-row">
                  <input
                    type="text"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    placeholder="How should we call you?"
                    maxLength={50}
                    className="app-input flex-1"
                  />
                  <button onClick={saveDisplayName} disabled={savingName} className="app-btn-ghost">
                    {nameMsg || (savingName ? 'Saving...' : 'Save')}
                  </button>
                </div>
                <p className="account-field-hint">This name appears on your forum posts and profile.</p>
              </div>
            </div>

            {/* Subscription */}
            <div className="app-card liquid-panel liquid-animate-up" style={{ animationDelay: '0.1s' }}>
              <span className="liquid-edge" aria-hidden="true" />
              <div className="app-card-label">Subscription</div>
              <div className="account-sub-header">
                <h3 className="account-sub-title">
                  {isPaid ? 'Pro' : isCommunity ? 'Community Access' : 'Free'}
                </h3>
                <StatusBadge status={isPaid ? 'active' : isCommunity ? 'community' : status === 'cancelled' ? 'cancelled' : 'free'} />
              </div>
              <p className="account-sub-desc">
                {isPaid
                  ? 'Full access to all 520+ lessons across 52 courses.'
                  : isCommunity
                  ? "Full access through our Community Access program. When you're ready, upgrading keeps this program running for others."
                  : "You're on the free tier. Upgrade to unlock all 520+ lessons across 52 courses."}
              </p>
              <div className="account-sub-actions">
                {isPaid ? (
                  <>
                    <Link href="/academy/" className="site-btn-primary">Continue Learning</Link>
                    <button onClick={openBillingPortal} className="app-btn-ghost">Manage Subscription</button>
                    <button onClick={cancelSubscriptionHandler} disabled={cancelling} className="app-btn-ghost app-btn-danger">
                      {cancelling ? 'Cancelling...' : 'Cancel Subscription'}
                    </button>
                  </>
                ) : isCommunity ? (
                  <>
                    <Link href="/academy/" className="site-btn-primary">Continue Learning</Link>
                    <a href="https://buy.stripe.com/bJe28k9LygWb7qP09c3sI0p" target="_blank" rel="noopener noreferrer" className="app-btn-ghost">Upgrade to Pro</a>
                  </>
                ) : (
                  <>
                    <a href="https://buy.stripe.com/bJe28k9LygWb7qP09c3sI0p" target="_blank" rel="noopener noreferrer" className="site-btn-primary">Go Pro — $49/mo</a>
                    <a href="https://buy.stripe.com/28E9AM8HudJZh1p7BE3sI0q" target="_blank" rel="noopener noreferrer" className="app-btn-ghost">Annual — $390/yr</a>
                  </>
                )}
              </div>
              {isPaid && (
                <p className="account-cancel-note">
                  Manage your billing, pause, or cancel anytime through your secure Stripe portal.
                </p>
              )}
            </div>

            {/* Quick Links */}
            <div className="app-card liquid-panel liquid-animate-up" style={{ animationDelay: '0.2s' }}>
              <span className="liquid-edge" aria-hidden="true" />
              <div className="app-card-label">Quick Links</div>
              <div className="account-links">
                <Link href="/academy/" className="app-btn-ghost">Browse Courses</Link>
                <Link href="/forum/" className="app-btn-ghost">Forum</Link>
                <Link href="/community-access/" className="app-btn-ghost">Community Access</Link>
              </div>
            </div>

            {/* Account */}
            <div className="app-card liquid-panel liquid-animate-up" style={{ animationDelay: '0.3s' }}>
              <span className="liquid-edge" aria-hidden="true" />
              <div className="app-card-label">Account</div>
              <p className="account-signout-info">Signed in as <strong>{email}</strong></p>
              <div className="account-sub-actions">
                <button onClick={signOut} className="app-btn-ghost">Sign Out</button>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer variant="site" />
    </div>
  );
}
