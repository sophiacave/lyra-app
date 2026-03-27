'use client';
import { useState, useCallback, useEffect } from 'react';
import PromptConsole from '../academy/PromptConsole';
import EnrollCTA from '../academy/EnrollCTA';

const APP_URL = 'https://app.likeone.ai';
const APP_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsa25waHV3d2dhZ3R1ZXF0b2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0MDcxNTgsImV4cCI6MjA4OTk4MzE1OH0.Wm7-plwu9N7sG2SzD_C9mHUwB4Ceh91F7fimraVBG_s';

function useSubscriptionStatus() {
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    // Check cached status first (valid for 5 minutes)
    const cached = sessionStorage.getItem('lo_sub_status');
    const cachedAt = sessionStorage.getItem('lo_sub_cached_at');
    if (cached && cachedAt && Date.now() - Number(cachedAt) < 300000) {
      setStatus(cached);
      return;
    }

    // Load Supabase and check auth
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
    script.onload = async () => {
      try {
        const sb = window.supabase.createClient(APP_URL, APP_ANON);
        const { data: { session } } = await sb.auth.getSession();
        if (!session) {
          cache('free');
          return;
        }
        const email = session.user.email;
        const res = await fetch(
          `${APP_URL}/rest/v1/profiles?email=eq.${encodeURIComponent(email)}&select=subscription_status,subscription_tier`,
          { headers: { apikey: APP_ANON, Authorization: `Bearer ${APP_ANON}` } }
        );
        const profiles = await res.json();
        const p = profiles[0];
        if (p && p.subscription_status === 'active' && p.subscription_tier !== 'free') {
          cache('pro');
        } else if (p && p.subscription_tier === 'community') {
          cache('pro');
        } else {
          cache('free');
        }
      } catch {
        cache('free');
      }
    };
    script.onerror = () => cache('free');
    document.head.appendChild(script);

    function cache(val) {
      setStatus(val);
      sessionStorage.setItem('lo_sub_status', val);
      sessionStorage.setItem('lo_sub_cached_at', String(Date.now()));
    }
  }, []);

  return status;
}

function LessonGate({ courseSlug }) {
  return (
    <div className="lesson-gate">
      <div className="lesson-gate-overlay" />
      <div className="lesson-gate-cta">
        <div className="lesson-gate-icon">🔒</div>
        <h3 className="lesson-gate-title">This lesson is for Pro members</h3>
        <p className="lesson-gate-desc">
          Unlock all 300+ lessons across 30 courses with Academy Pro.
          Founding members get 90% off — forever.
        </p>
        <div className="lesson-gate-actions">
          <a
            href="https://buy.stripe.com/fZufZae1OeO35iH5tw3sI0c"
            target="_blank"
            rel="noopener noreferrer"
            className="site-btn-primary"
          >
            Go Pro — $4.90/mo
          </a>
          <a href={`/academy/${courseSlug}/`} className="site-btn-ghost">
            ← Back to course
          </a>
        </div>
        <p className="lesson-gate-note">
          Already a member? <a href="/account/">Sign in</a> to access your lessons.
        </p>
      </div>
    </div>
  );
}

export default function LessonSplitView({ contentHtml, lessonTitle, exercises = [], showConsole = true, isFree = true, courseSlug = '' }) {
  const [consoleOpen, setConsoleOpen] = useState(showConsole);
  const [consoleState, setConsoleState] = useState('idle');
  const subStatus = useSubscriptionStatus();

  const handleActivity = useCallback((state) => {
    setConsoleState(state);
  }, []);

  const consoleClasses = [
    'lo-split-console',
    consoleState !== 'idle' ? 'lo-console-active' : '',
    consoleState === 'typing' ? 'lo-console-typing' : '',
  ].filter(Boolean).join(' ');

  // Gate: if lesson is not free and user is not pro, show gate
  const isGated = !isFree && subStatus === 'free';
  // While loading, show content (no flash of gate for free lessons, brief flash for paid is acceptable)
  const showGate = !isFree && subStatus !== 'loading' && subStatus !== 'pro';

  return (
    <div className="lo-splitview">
      {/* Instruction pane */}
      <div className={`lo-split-content ${showGate ? 'lo-content-gated' : ''}`}>
        <div
          className="lesson-content glass-animate-up"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
        {showGate && <LessonGate courseSlug={courseSlug} />}
      </div>

      {/* Console toggle (visible when console is closed) */}
      {!showGate && !consoleOpen && (
        <button
          className="lo-console-toggle"
          onClick={() => setConsoleOpen(true)}
          title="Open console"
        >
          <span className="lo-console-toggle-icon">▸</span>
        </button>
      )}

      {/* Console pane */}
      {!showGate && consoleOpen && (
        <div className={consoleClasses}>
          <div className="lo-console-close-row">
            <button
              className="lo-console-close"
              onClick={() => setConsoleOpen(false)}
              title="Close console"
            >
              ✕
            </button>
          </div>
          <PromptConsole
            exercises={exercises}
            lessonTitle={lessonTitle}
            onActivity={handleActivity}
          />
        </div>
      )}
    </div>
  );
}
