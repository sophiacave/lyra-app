'use client';
import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { QuizMC, FlashDeck } from '../learn';
import LearnErrorBoundary from '../learn/LearnErrorBoundary';
import { pricing } from '@/lib/pricing';

// Only QuizMC and FlashDeck are supported — Apple design: read + quiz + optional flash cards
const LEARN_COMPONENTS = { QuizMC, FlashDeck };

const LEARN_PLACEHOLDER_RE = /<div\s+data-learn="([^"]+)"(?:\s+data-props='([^']*)')?\s*>\s*<\/div>/g;

function parseContentSegments(html, courseSlug, lessonSlug) {
  if (!html) return [{ type: 'html', html: '' }];
  const segments = [];
  let lastIndex = 0;
  let match;

  LEARN_PLACEHOLDER_RE.lastIndex = 0;
  while ((match = LEARN_PLACEHOLDER_RE.exec(html)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'html', html: html.slice(lastIndex, match.index) });
    }

    const componentName = match[1];
    const Component = LEARN_COMPONENTS[componentName];
    if (Component) {
      let props = {};
      try {
        if (match[2]) {
          const decoded = match[2].replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
          props = JSON.parse(decoded);
        }
      } catch (e) {
        console.warn(`[LearnComponent] Invalid props for ${componentName}:`, e);
      }
      props._courseSlug = courseSlug;
      props._lessonSlug = lessonSlug;
      segments.push({ type: 'component', componentName, Component, props });
    }
    // Unknown components are silently dropped — no broken UI

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < html.length) {
    segments.push({ type: 'html', html: html.slice(lastIndex) });
  }

  return segments.length > 0 ? segments : [{ type: 'html', html }];
}

function useSubscriptionStatus() {
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const cached = sessionStorage.getItem('lo_sub_status');
    const cachedAt = sessionStorage.getItem('lo_sub_cached_at');
    if (cached && cachedAt && Date.now() - Number(cachedAt) < 300000) {
      setStatus(cached);
      return;
    }

    // Sovereign auth — try BOTH localStorage token AND httpOnly cookie
    async function check() {
      const token = localStorage.getItem('lo_session');
      const headers = token ? { Authorization: 'Bearer ' + token } : {};

      try {
        // credentials: 'include' sends the httpOnly cookie even if localStorage is empty
        const res = await fetch('/api/auth/session', {
          headers,
          credentials: 'include',
        });
        const data = await res.json();
        if (!data.authenticated) { cache('free'); return; }

        // Resync localStorage if it was missing but cookie worked
        if (!token && data.email) {
          // Can't read the httpOnly cookie, but session is valid via cookie
          // Mark as authenticated so subsequent checks in this tab work
        }

        const sub = data.subscription;
        if (sub && sub.status === 'active' && sub.tier !== 'free') {
          cache('pro');
        } else if (sub && sub.tier === 'community') {
          cache('pro');
        } else {
          cache('free');
        }
      } catch { cache('free'); }
    }
    check();

    function cache(val) {
      setStatus(val);
      try {
        sessionStorage.setItem('lo_sub_status', val);
        sessionStorage.setItem('lo_sub_cached_at', String(Date.now()));
      } catch { /* sessionStorage might be unavailable in private browsing */ }
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
          Unlock all 518+ lessons across 52 courses with Academy Pro.
        </p>
        <div className="lesson-gate-actions">
          <a
            href={pricing.pro.monthly.checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="site-btn-primary"
          >
            Go Pro — {pricing.pro.monthly.display}
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
  isFree = true,
  courseSlug = '',
  lessonSlug = '',
  prev = null,
  next = null,
  courseTitle = '',
  completionNode = null,
  navNode = null,
  videoNode = null,
}) {
  const scrollRef = useRef(null);
  const subStatus = useSubscriptionStatus();
  const showGate = !isFree && subStatus !== 'pro';

  // Execute inline scripts from lesson HTML
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

  const contentSegments = useMemo(
    () => parseContentSegments(contentHtml, courseSlug, lessonSlug),
    [contentHtml, courseSlug, lessonSlug]
  );

  return (
    <div className="immersive-lesson" ref={scrollRef}>
      {videoNode && !showGate && (
        <div className="immersive-video">{videoNode}</div>
      )}

      <div className={`immersive-content ${showGate ? 'lo-content-gated' : ''}`}>
        <div ref={contentRef} className="lesson-content immersive-lesson-body">
          {contentSegments.map((seg, i) =>
            seg.type === 'html' ? (
              <div key={`html-${i}`} dangerouslySetInnerHTML={{ __html: seg.html }} />
            ) : (
              <LearnErrorBoundary key={`${seg.componentName}-${i}`} name={seg.componentName}>
                <seg.Component {...seg.props} />
              </LearnErrorBoundary>
            )
          )}
        </div>
        {showGate && <LessonGate courseSlug={courseSlug} />}
      </div>

      {!showGate && (
        <div className="immersive-footer">
          {completionNode}
          {navNode}
        </div>
      )}
    </div>
  );
}
