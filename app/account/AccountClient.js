'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { colors } from '../../lib/site-config';

const APP_URL = 'https://app.likeone.ai';
const APP_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsa25waHV3d2dhZ3R1ZXF0b2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0MDcxNTgsImV4cCI6MjA4OTk4MzE1OH0.Wm7-plwu9N7sG2SzD_C9mHUwB4Ceh91F7fimraVBG_s';

function StatusBadge({ status }) {
  const styles = {
    active: { background: 'rgba(74,222,128,.12)', color: '#4ade80', border: '1px solid rgba(74,222,128,.3)' },
    free: { background: 'rgba(136,136,160,.1)', color: '#8888a0', border: '1px solid #1e1e28' },
    cancelled: { background: 'rgba(248,113,113,.1)', color: '#f87171', border: '1px solid rgba(248,113,113,.3)' },
    community: { background: 'rgba(192,132,252,.12)', color: colors.purple, border: '1px solid rgba(192,132,252,.3)' },
  };
  const s = styles[status] || styles.free;
  return (
    <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '20px', fontSize: '.75rem', fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase', ...s }}>
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

  const cardStyle = { background: '#111114', border: '1px solid #1e1e28', borderRadius: '12px', padding: '1.75rem', marginBottom: '1.25rem' };
  const cardLabel = { fontSize: '.7rem', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: '#8a8aaa', marginBottom: '.75rem' };
  const btnGhost = { display: 'inline-block', padding: '.7rem 1.5rem', borderRadius: '8px', fontWeight: 700, fontSize: '.85rem', cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'none', background: 'transparent', border: '1px solid #1e1e28', color: '#8888a0' };
  const inputStyle = { flex: 1, padding: '.6rem .85rem', background: '#08080a', border: '1px solid #1e1e28', borderRadius: '8px', color: '#e8e8ec', fontSize: '.9rem', fontFamily: 'inherit', outline: 'none' };

  if (loading) {
    return (
      <div style={{ background: '#08080a', color: '#e8e8ec', fontFamily: "'Inter', -apple-system, system-ui, sans-serif", minHeight: '100vh', WebkitFontSmoothing: 'antialiased' }}>
        <Header variant="site" />
        <div style={{ textAlign: 'center', padding: '6rem 2rem', color: '#8888a0' }}>Loading...</div>
        <Footer variant="site" />
      </div>
    );
  }

  return (
    <div style={{ background: '#08080a', color: '#e8e8ec', fontFamily: "'Inter', -apple-system, system-ui, sans-serif", minHeight: '100vh', WebkitFontSmoothing: 'antialiased' }}>
      <Header variant="site" />

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '0 2rem 4rem' }}>
        {!session ? (
          /* SIGNED OUT */
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '.75rem' }}>Welcome to Like One</h2>
            <p style={{ color: '#8888a0', marginBottom: '1.5rem' }}>
              Sign in to access your courses, manage your subscription, and join the community.
            </p>

            <button
              onClick={signInWithGoogle}
              disabled={signinLoading}
              style={{
                background: '#fff', color: '#333', border: '1px solid #ddd', width: '100%', maxWidth: '400px',
                padding: '.85rem 1.5rem', fontSize: '.95rem', margin: '0 auto 1.5rem', display: 'flex',
                alignItems: 'center', justifyContent: 'center', gap: '.75rem', borderRadius: '10px',
                cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
              Continue with Google
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
              <div style={{ flex: 1, height: '1px', background: '#1e1e28' }} />
              <span style={{ color: '#8a8aaa', fontSize: '.8rem' }}>or sign in with email</span>
              <div style={{ flex: 1, height: '1px', background: '#1e1e28' }} />
            </div>

            {signinSent ? (
              <div style={{ marginTop: '1.5rem' }}>
                <p style={{ color: '#4ade80', fontWeight: 600 }}>Check your email for the magic link.</p>
                <p style={{ color: '#8a8aaa', fontSize: '.85rem', marginTop: '.5rem' }}>
                  Didn&rsquo;t get it? Check spam, or <a href="mailto:hello@likeone.ai" style={{ color: colors.purple }}>email us</a>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSignin} style={{ display: 'flex', gap: '8px', maxWidth: '400px', margin: '0 auto' }}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={signinEmail}
                  onChange={e => setSigninEmail(e.target.value)}
                  required
                  style={{ flex: 1, padding: '.7rem 1rem', background: '#08080a', border: '1px solid #1e1e28', borderRadius: '8px', color: '#e8e8ec', fontSize: '.9rem', fontFamily: 'inherit', outline: 'none' }}
                />
                <button
                  type="submit"
                  disabled={signinLoading}
                  style={{ padding: '.7rem 1.5rem', background: colors.orange, color: '#000', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '.85rem', cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  {signinLoading ? 'Sending...' : 'Send Link'}
                </button>
              </form>
            )}
          </div>
        ) : (
          /* SIGNED IN */
          <>
            <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: 800, letterSpacing: '-1px', marginBottom: '.5rem', paddingTop: '3rem' }}>
              My <span style={{ color: colors.purple }}>Account</span>
            </h1>
            <p style={{ color: '#8888a0', fontSize: '1rem', marginBottom: '2.5rem' }}>Welcome back, friend.</p>

            {successMsg && (
              <div style={{ background: 'rgba(74,222,128,.08)', border: '1px solid rgba(74,222,128,.3)', borderRadius: '8px', padding: '.75rem 1rem', color: '#4ade80', fontSize: '.85rem', fontWeight: 600, marginBottom: '1rem' }}>
                {successMsg}
              </div>
            )}
            {errorMsg && (
              <div style={{ background: 'rgba(248,113,113,.08)', border: '1px solid rgba(248,113,113,.3)', borderRadius: '8px', padding: '.75rem 1rem', color: '#f87171', fontSize: '.85rem', fontWeight: 600, marginBottom: '1rem' }}>
                {errorMsg}
              </div>
            )}

            {/* Profile */}
            <div style={cardStyle}>
              <div style={cardLabel}>Profile</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: colors.purple, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem', color: '#000', overflow: 'hidden' }}>
                  {avatarUrl ? <img src={avatarUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} referrerPolicy="no-referrer" alt="" /> : initial}
                </div>
                <div>
                  <div style={{ fontWeight: 700 }}>{displayName}</div>
                  <div style={{ fontSize: '.8rem', color: '#8a8aaa' }}>{email}</div>
                </div>
              </div>
              <div style={{ marginBottom: '.75rem' }}>
                <label style={{ display: 'block', fontSize: '.75rem', fontWeight: 600, color: '#8a8aaa', marginBottom: '.35rem', textTransform: 'uppercase', letterSpacing: '.5px' }}>Display Name</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    placeholder="How should we call you?"
                    maxLength={50}
                    style={inputStyle}
                  />
                  <button onClick={saveDisplayName} disabled={savingName} style={{ ...btnGhost, padding: '.6rem 1rem', fontSize: '.8rem' }}>
                    {nameMsg || (savingName ? 'Saving...' : 'Save')}
                  </button>
                </div>
                <p style={{ color: '#8a8aaa', fontSize: '.75rem', marginTop: '.35rem' }}>This name appears on your forum posts and profile.</p>
              </div>
            </div>

            {/* Subscription */}
            <div style={cardStyle}>
              <div style={cardLabel}>Subscription</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                  {isPaid ? (tier === 'pro' ? 'Pro — Founding Member' : 'Pro') : isCommunity ? 'Community Access' : 'Free'}
                </h3>
                <StatusBadge status={isPaid ? 'active' : isCommunity ? 'community' : status === 'cancelled' ? 'cancelled' : 'free'} />
              </div>
              <p style={{ color: '#8888a0', fontSize: '.9rem' }}>
                {isPaid
                  ? 'Full access to all 97 lessons across 10 courses. Your founding price is locked in forever.'
                  : isCommunity
                  ? "Full access through our Community Access program. When you're ready, upgrading keeps this program running for others."
                  : "You're on the free tier. Upgrade to unlock all 97 lessons across 10 courses."}
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '1rem' }}>
                {isPaid ? (
                  <>
                    <Link href="/academy/" style={{ display: 'inline-block', padding: '.7rem 1.5rem', borderRadius: '8px', fontWeight: 700, fontSize: '.85rem', textDecoration: 'none', background: colors.orange, color: '#000' }}>Continue Learning</Link>
                    <button onClick={cancelSubscription} disabled={cancelling} style={{ display: 'inline-block', padding: '.7rem 1.5rem', borderRadius: '8px', fontWeight: 700, fontSize: '.85rem', cursor: 'pointer', fontFamily: 'inherit', background: 'transparent', border: '1px solid rgba(248,113,113,.3)', color: '#f87171' }}>
                      {cancelling ? 'Cancelling...' : 'Cancel Subscription'}
                    </button>
                  </>
                ) : isCommunity ? (
                  <>
                    <Link href="/academy/" style={{ display: 'inline-block', padding: '.7rem 1.5rem', borderRadius: '8px', fontWeight: 700, fontSize: '.85rem', textDecoration: 'none', background: colors.orange, color: '#000' }}>Continue Learning</Link>
                    <a href="https://buy.stripe.com/fZufZae1OeO35iH5tw3sI0c" target="_blank" rel="noopener noreferrer" style={btnGhost}>Upgrade to Pro</a>
                  </>
                ) : (
                  <>
                    <a href="https://buy.stripe.com/fZufZae1OeO35iH5tw3sI0c" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '.7rem 1.5rem', borderRadius: '8px', fontWeight: 700, fontSize: '.85rem', textDecoration: 'none', background: colors.orange, color: '#000' }}>Go Pro — $4.90/mo</a>
                    <a href="https://buy.stripe.com/8x2bIUg9WgWb4eD7BE3sI0d" target="_blank" rel="noopener noreferrer" style={btnGhost}>Annual — $39/yr</a>
                  </>
                )}
              </div>
              {isPaid && (
                <p style={{ color: '#8a8aaa', fontSize: '.8rem', marginTop: '.5rem', lineHeight: 1.6 }}>
                  Cancellation stops auto-renewal. You keep access until your current billing period ends. No questions asked.
                </p>
              )}
            </div>

            {/* Quick Links */}
            <div style={cardStyle}>
              <div style={cardLabel}>Quick Links</div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <Link href="/academy/" style={btnGhost}>Browse Courses</Link>
                <Link href="/forum/" style={btnGhost}>Forum</Link>
                <Link href="/community-access/" style={btnGhost}>Community Access</Link>
              </div>
            </div>

            {/* Account */}
            <div style={cardStyle}>
              <div style={cardLabel}>Account</div>
              <p style={{ color: '#8888a0', fontSize: '.9rem' }}>Signed in as <strong style={{ color: '#e8e8ec' }}>{email}</strong></p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '1rem' }}>
                <button onClick={signOut} style={btnGhost}>Sign Out</button>
              </div>
            </div>
          </>
        )}
      </div>

      <Footer variant="site" />
    </div>
  );
}
