'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

const APP_URL = 'https://app.likeone.ai';
const APP_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsa25waHV3d2dhZ3R1ZXF0b2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0MDcxNTgsImV4cCI6MjA4OTk4MzE1OH0.Wm7-plwu9N7sG2SzD_C9mHUwB4Ceh91F7fimraVBG_s';

function StatusBadge({ status }) {
  return (
    <span className={`status-badge ${status}`}>
      {status === 'active' ? 'Active' : status === 'cancelled' ? 'Cancelling' : status === 'community' ? 'Community' : 'Free'}
    </span>
  );
}

export default function AccountClient() {
  const [sb, setSb] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [savingName, setSavingName] = useState(false);
  const [nameMsg, setNameMsg] = useState('');
  const [signinEmail, setSigninEmail] = useState('');
  const [signinSent, setSigninSent] = useState(false);
  const [signinLoading, setSigninLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
    script.onload = () => {
      const client = window.supabase.createClient(APP_URL, APP_ANON);
      setSb(client);
    };
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!sb) return;
    sb.auth.getSession().then(({ data: { session: s } }) => {
      if (s) {
        setSession(s);
        loadProfile(s);
      }
      setLoading(false);
    });
    const { data: { subscription } } = sb.auth.onAuthStateChange((event, s) => {
      if (event === 'SIGNED_IN' && s) {
        setSession(s);
        loadProfile(s);
      }
    });
    return () => subscription?.unsubscribe();
  }, [sb]);

  async function loadProfile(s) {
    const email = s.user.email;
    try {
      const res = await fetch(
        `${APP_URL}/rest/v1/profiles?email=eq.${encodeURIComponent(email)}&select=*`,
        { headers: { apikey: APP_ANON, Authorization: `Bearer ${APP_ANON}` } }
      );
      const profiles = await res.json();
      const p = profiles[0] || null;
      setProfile(p);
      setDisplayName(p?.full_name || localStorage.getItem('lo_display_name') || email.split('@')[0]);
    } catch {
      setDisplayName(localStorage.getItem('lo_display_name') || email.split('@')[0]);
    }
  }

  async function signInWithGoogle() {
    if (!sb) return;
    setSigninLoading(true);
    const { error } = await sb.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/account' },
    });
    if (error) setSigninLoading(false);
  }

  async function handleSignin(e) {
    e.preventDefault();
    if (!sb || !signinEmail) return;
    setSigninLoading(true);
    const { error } = await sb.auth.signInWithOtp({
      email: signinEmail,
      options: { emailRedirectTo: window.location.origin + '/account' },
    });
    setSigninLoading(false);
    if (!error) setSigninSent(true);
  }

  async function signOut() {
    if (!sb) return;
    await sb.auth.signOut();
    setSession(null);
    setProfile(null);
  }

  async function saveDisplayName() {
    if (!displayName.trim()) return;
    setSavingName(true);
    try {
      localStorage.setItem('lo_display_name', displayName);
      localStorage.setItem('forum_name', displayName);
      localStorage.setItem('forum_email', session.user.email);
      await fetch(`${APP_URL}/rest/v1/profiles?email=eq.${encodeURIComponent(session.user.email)}`, {
        method: 'PATCH',
        headers: { apikey: APP_ANON, Authorization: `Bearer ${APP_ANON}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify({ full_name: displayName, updated_at: new Date().toISOString() }),
      });
      setNameMsg('Saved!');
      setTimeout(() => setNameMsg(''), 2000);
    } catch { /* silent */ }
    setSavingName(false);
  }

  async function cancelSubscription() {
    setCancelling(true);
    try {
      const res = await fetch(`${APP_URL}/functions/v1/cancel-subscription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${APP_ANON}` },
        body: JSON.stringify({ email: session.user.email }),
      });
      if (res.ok) {
        setSuccessMsg('Subscription cancelled. You keep access until your current period ends. Thank you for being a founding member.');
        setProfile(p => ({ ...p, subscription_status: 'cancelled' }));
      } else {
        throw new Error();
      }
    } catch {
      setErrorMsg("Something went wrong. Email hello@likeone.ai and we'll cancel immediately. No questions.");
      setCancelling(false);
    }
  }

  const status = profile?.subscription_status || 'free';
  const tier = profile?.subscription_tier || 'free';
  const isPaid = status === 'active' && tier !== 'free' && tier !== 'community';
  const isCommunity = tier === 'community';
  const email = session?.user?.email;
  const avatarUrl = session?.user?.user_metadata?.avatar_url;
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
      <Header variant="site" />

      <div className="account-main">
        {!session ? (
          /* SIGNED OUT */
          <div className="account-signin">
            <h2 className="account-signin-title">Welcome to Like One</h2>
            <p className="account-signin-desc">
              Sign in to access your courses, manage your subscription, and join the community.
            </p>

            <button
              onClick={signInWithGoogle}
              disabled={signinLoading}
              className="account-google-btn"
            >
              <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
              Continue with Google
            </button>

            <div className="account-divider">
              <div className="account-divider-line" />
              <span className="account-divider-text">or sign in with email</span>
              <div className="account-divider-line" />
            </div>

            {signinSent ? (
              <div className="account-magic-sent">
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
                  className="app-input flex-1"
                />
                <button
                  type="submit"
                  disabled={signinLoading}
                  className="app-btn-submit"
                >
                  {signinLoading ? 'Sending...' : 'Send Link'}
                </button>
              </form>
            )}
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
            <div className="app-card">
              <div className="app-card-label">Profile</div>
              <div className="account-profile-row">
                <div className="account-avatar">
                  {avatarUrl ? <img src={avatarUrl} referrerPolicy="no-referrer" alt="" /> : initial}
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
            <div className="app-card">
              <div className="app-card-label">Subscription</div>
              <div className="account-sub-header">
                <h3 className="account-sub-title">
                  {isPaid ? (tier === 'pro' ? 'Pro — Founding Member' : 'Pro') : isCommunity ? 'Community Access' : 'Free'}
                </h3>
                <StatusBadge status={isPaid ? 'active' : isCommunity ? 'community' : status === 'cancelled' ? 'cancelled' : 'free'} />
              </div>
              <p className="account-sub-desc">
                {isPaid
                  ? 'Full access to all 300+ lessons across 30 courses. Your founding price is locked in forever.'
                  : isCommunity
                  ? "Full access through our Community Access program. When you're ready, upgrading keeps this program running for others."
                  : "You're on the free tier. Upgrade to unlock all 300+ lessons across 30 courses."}
              </p>
              <div className="account-sub-actions">
                {isPaid ? (
                  <>
                    <Link href="/academy/" className="site-btn-primary">Continue Learning</Link>
                    <button onClick={cancelSubscription} disabled={cancelling} className="app-btn-ghost app-btn-danger">
                      {cancelling ? 'Cancelling...' : 'Cancel Subscription'}
                    </button>
                  </>
                ) : isCommunity ? (
                  <>
                    <Link href="/academy/" className="site-btn-primary">Continue Learning</Link>
                    <a href="https://buy.stripe.com/fZufZae1OeO35iH5tw3sI0c" target="_blank" rel="noopener noreferrer" className="app-btn-ghost">Upgrade to Pro</a>
                  </>
                ) : (
                  <>
                    <a href="https://buy.stripe.com/fZufZae1OeO35iH5tw3sI0c" target="_blank" rel="noopener noreferrer" className="site-btn-primary">Go Pro — $4.90/mo</a>
                    <a href="https://buy.stripe.com/8x2bIUg9WgWb4eD7BE3sI0d" target="_blank" rel="noopener noreferrer" className="app-btn-ghost">Annual — $39/yr</a>
                  </>
                )}
              </div>
              {isPaid && (
                <p className="account-cancel-note">
                  Cancellation stops auto-renewal. You keep access until your current billing period ends. No questions asked.
                </p>
              )}
            </div>

            {/* Quick Links */}
            <div className="app-card">
              <div className="app-card-label">Quick Links</div>
              <div className="account-links">
                <Link href="/academy/" className="app-btn-ghost">Browse Courses</Link>
                <Link href="/forum/" className="app-btn-ghost">Forum</Link>
                <Link href="/community-access/" className="app-btn-ghost">Community Access</Link>
              </div>
            </div>

            {/* Account */}
            <div className="app-card">
              <div className="app-card-label">Account</div>
              <p className="account-signout-info">Signed in as <strong>{email}</strong></p>
              <div className="account-sub-actions">
                <button onClick={signOut} className="app-btn-ghost">Sign Out</button>
              </div>
            </div>
          </>
        )}
      </div>

      <Footer variant="site" />
    </div>
  );
}
