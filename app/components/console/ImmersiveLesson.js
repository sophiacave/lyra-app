'use client';
import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import PromptConsole from '../academy/PromptConsole';
import EnrollCTA from '../academy/EnrollCTA';
import { QuizMC, MatchConnect, FlashDeck, SortStack, PixelQuest, Whiteboard, Citation } from '../learn';
import LearnErrorBoundary from '../learn/LearnErrorBoundary';

// Registry of learn components that can be embedded in lesson HTML
const LEARN_COMPONENTS = {
  QuizMC,
  MatchConnect,
  FlashDeck,
  SortStack,
  PixelQuest,
  Whiteboard,
  Citation,
};

// Parse contentHtml string into alternating segments of raw HTML and learn components.
// This replaces the old createPortal approach which can't reliably hydrate into
// dangerouslySetInnerHTML containers.
const LEARN_PLACEHOLDER_RE = /<div\s+data-learn="([^"]+)"(?:\s+data-props='([^']*)')?\s*>\s*<\/div>/g;

function parseContentSegments(html, courseSlug, lessonSlug) {
  if (!html) return [{ type: 'html', html: '' }];
  const segments = [];
  let lastIndex = 0;
  let match;

  LEARN_PLACEHOLDER_RE.lastIndex = 0;
  while ((match = LEARN_PLACEHOLDER_RE.exec(html)) !== null) {
    // Push HTML before this placeholder
    if (match.index > lastIndex) {
      segments.push({ type: 'html', html: html.slice(lastIndex, match.index) });
    }

    const componentName = match[1];
    const Component = LEARN_COMPONENTS[componentName];
    if (Component) {
      let props = {};
      try {
        if (match[2]) props = JSON.parse(match[2]);
      } catch (e) {
        console.warn(`[LearnComponent] Invalid props for ${componentName}:`, e);
      }
      props._courseSlug = courseSlug;
      props._lessonSlug = lessonSlug;
      segments.push({ type: 'component', componentName, Component, props });
    } else {
      // Unknown component — keep the original HTML
      segments.push({ type: 'html', html: match[0] });
    }

    lastIndex = match.index + match[0].length;
  }

  // Push remaining HTML after last placeholder
  if (lastIndex < html.length) {
    segments.push({ type: 'html', html: html.slice(lastIndex) });
  }

  return segments.length > 0 ? segments : [{ type: 'html', html }];
}

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

// XP toast — floats up and fades after award
function XPToast({ xp, show }) {
  if (!show) return null;
  return (
    <div className="lo-xp-toast" key={xp}>
      <span className="lo-xp-toast-icon">⚡</span>
      <span className="lo-xp-toast-text">+{xp} XP</span>
    </div>
  );
}

// Award XP via Supabase RPC — requires user to be authenticated
async function awardXP(courseSlug, lessonSlug, componentType, xp, metadata = {}) {
  try {
    if (!window.supabase) return null;
    const sb = window.supabase.createClient(APP_URL, APP_ANON);
    const { data: { session } } = await sb.auth.getSession();
    if (!session) return null; // not logged in — XP not saved

    const { data, error } = await sb.rpc('award_xp', {
      p_course_slug: courseSlug,
      p_lesson_slug: lessonSlug,
      p_component_type: componentType,
      p_xp: xp,
      p_metadata: metadata,
    });
    if (error) console.warn('[XP] award error:', error);
    return data;
  } catch (e) {
    console.warn('[XP] award failed:', e);
    return null;
  }
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
  const [consoleExpanded, setConsoleExpanded] = useState(exercises.length > 0);
  const scrollRef = useRef(null);
  const consoleRef = useRef(null);
  const subStatus = useSubscriptionStatus();

  const handleActivity = useCallback((state) => {
    setConsoleState(state);
  }, []);

  const showGate = !isFree && subStatus !== 'pro';
  const hasExercises = exercises.length > 0;

  // XP toast state
  const [xpToast, setXpToast] = useState({ xp: 0, show: false });
  const handleXP = useCallback((xp, componentType) => {
    // Show toast immediately (even for non-logged-in users)
    setXpToast({ xp, show: true });
    setTimeout(() => setXpToast((t) => ({ ...t, show: false })), 2500);
    // Persist to DB if authenticated
    awardXP(courseSlug, lessonSlug, componentType, xp, { xp });
  }, [courseSlug, lessonSlug]);

  // Execute inline scripts from lesson HTML.
  // Server marks scripts as type="text/x-lesson" so browser skips them during SSR parse.
  // We wait for subStatus to settle (not 'loading') because the status change triggers
  // a re-render that resets dangerouslySetInnerHTML, wiping any script-generated DOM.
  // Scripts run ONCE after the final render, appended to <head> to stay outside React's tree.
  const contentRef = useRef(null);
  const scriptsRan = useRef(false);
  useEffect(() => {
    if (subStatus === 'loading' || !contentRef.current || scriptsRan.current) return;
    const scripts = contentRef.current.querySelectorAll('script[type="text/x-lesson"]');
    if (scripts.length === 0) return;
    scriptsRan.current = true;
    scripts.forEach((orig) => {
      const fresh = document.createElement('script');
      [...orig.attributes].forEach((attr) => {
        if (attr.name !== 'type') fresh.setAttribute(attr.name, attr.value);
      });
      if (orig.textContent) fresh.textContent = orig.textContent;
      document.head.appendChild(fresh);
      orig.remove();
    });
  }, [subStatus]);

  // Parse contentHtml into segments: alternating raw HTML chunks and React learn components.
  // This replaces the old createPortal approach which broke because React can't reliably
  // hydrate into DOM nodes managed by dangerouslySetInnerHTML.
  const contentSegments = useMemo(
    () => parseContentSegments(contentHtml, courseSlug, lessonSlug),
    [contentHtml, courseSlug, lessonSlug]
  );

  // Scroll to console when manually toggled (not on initial render)
  const initialRender = useRef(true);
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
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
      <XPToast xp={xpToast.xp} show={xpToast.show} />
      {/* Content flows full-width inside the console frame */}
      <div className={`immersive-content ${showGate ? 'lo-content-gated' : ''}`}>
        <div ref={contentRef} className="lesson-content immersive-lesson-body">
          {contentSegments.map((seg, i) =>
            seg.type === 'html' ? (
              <div key={`html-${i}`} dangerouslySetInnerHTML={{ __html: seg.html }} />
            ) : (
              <LearnErrorBoundary key={`${seg.componentName}-${i}`} name={seg.componentName}>
                <seg.Component
                  {...seg.props}
                  onXP={(xp) => handleXP(xp, seg.componentName)}
                />
              </LearnErrorBoundary>
            )
          )}
        </div>
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
