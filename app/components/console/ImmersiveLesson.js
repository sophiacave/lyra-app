'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import PromptConsole from '../academy/PromptConsole';
import EnrollCTA from '../academy/EnrollCTA';

const APP_URL = 'https://app.likeone.ai';
const APP_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsa25waHV3d2dhZ3R1ZXF0b2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0MDcxNTgsImV4cCI6MjA4OTk4MzE1OH0.Wm7-plwu9N7sG2SzD_C9mHUwB4Ceh91F7fimraVBG_s';

function useSubscriptionStatus() {
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const cached = sessionStorage.getItem('lo_sub_status');
    const cachedAt = sessionStorage.getItem('lo_sub_cached_at');
    if (cached && cachedAt && Date.now() - Number(cachedAt) < 300000) {
      setStatus(cached);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
    script.onload = async () => {
      try {
        const sb = window.supabase.createClient(APP_URL, APP_ANON);
        const { data: { session } } = await sb.auth.getSession();
        if (!session) { cache('free'); return; }
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
      } catch { cache('free'); }
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

export default function ImmersiveLesson({
  contentHtml,
  lessonTitle,
  exercises = [],
  isFree = true,
  courseSlug = '',
  lessonSlug = '',
  prev = null,
  next = null,
  courseTitle = '',
  completionNode = null,
  navNode = null,
}) {
  const [consoleState, setConsoleState] = useState('idle');
  const [consoleExpanded, setConsoleExpanded] = useState(false);
  const scrollRef = useRef(null);
  const consoleRef = useRef(null);
  const subStatus = useSubscriptionStatus();

  const handleActivity = useCallback((state) => {
    setConsoleState(state);
  }, []);

  const showGate = !isFree && subStatus !== 'loading' && subStatus !== 'pro';
  const hasExercises = exercises.length > 0;

  // Scroll to console when expanded
  useEffect(() => {
    if (consoleExpanded && consoleRef.current) {
      consoleRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [consoleExpanded]);

  const consoleClasses = [
    'immersive-console-section',
    consoleExpanded ? 'immersive-console-expanded' : '',
    consoleState !== 'idle' ? 'immersive-console-active' : '',
    consoleState === 'typing' ? 'immersive-console-typing' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className="immersive-lesson" ref={scrollRef}>
      {/* Content flows full-width inside the console frame */}
      <div className={`immersive-content ${showGate ? 'lo-content-gated' : ''}`}>
        <div
          className="lesson-content immersive-lesson-body"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
        {showGate && <LessonGate courseSlug={courseSlug} />}
      </div>

      {/* Exercise console — embedded inline after content */}
      {!showGate && hasExercises && (
        <div className={consoleClasses} ref={consoleRef}>
          <div className="immersive-console-header">
            <button
              className="immersive-console-tab"
              onClick={() => setConsoleExpanded(!consoleExpanded)}
            >
              <span className="immersive-console-tab-icon">▸</span>
              <span className="immersive-console-tab-label">
                Practice Console
              </span>
              <span className="immersive-console-tab-count">
                {exercises.length} exercise{exercises.length !== 1 ? 's' : ''}
              </span>
              <span className={`immersive-console-chevron ${consoleExpanded ? 'expanded' : ''}`}>
                ▾
              </span>
            </button>
          </div>

          {/* Console body — always visible but compact by default */}
          <div className={`immersive-console-body ${consoleExpanded ? 'expanded' : ''}`}>
            <PromptConsole
              exercises={exercises}
              lessonTitle={lessonTitle}
              onActivity={handleActivity}
            />
          </div>
        </div>
      )}

      {/* Completion + navigation — inside the flow */}
      {!showGate && (
        <div className="immersive-footer">
          {completionNode}
          {navNode}
        </div>
      )}
    </div>
  );
}
