/**
 * LIKE ONE ACADEMY — Auth Gate v1.0
 * 
 * Client-side subscription gating using Supabase Auth.
 * Injected into all academy lesson pages.
 * 
 * Logic:
 * - FREE lessons: always show full content
 * - PAID lessons: check auth → check subscription → show or blur
 * - Unauthenticated: show first 300px of content + blur + signup CTA
 * - Free user: same as unauthenticated but with upgrade CTA
 * - Pro subscriber: full access
 */

const SUPABASE_URL = 'https://vpaynwebgmmnwttqkwmh.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwYXlud2ViZ21tbnd0dHFrd21oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNjc0OTksImV4cCI6MjA4ODg0MzQ5OX0.qcBErOuFgdJqRlHJdfRbDjJkV4mC8yxVIaFBDIiXn5w';

const MONTHLY_LINK = 'https://buy.stripe.com/28E00c6zmbBRdPd5tw3sI0a';
const ANNUAL_LINK = 'https://buy.stripe.com/aFafZag9W7lB6mL9JM3sI0b';

// Courses/lessons that are FREE (no gate)
const FREE_COURSES = ['ai-pet-lab'];
const FREE_LESSON_COUNT = 3; // First N lessons of each paid course are free

const AUTH = {
  session: null,
  profile: null,

  async init() {
    // Determine if this lesson needs gating
    const path = location.pathname;
    const parts = path.split('/').filter(Boolean);
    // /academy/course-slug/lesson.html
    const courseSlug = parts[1] || '';
    const lessonFile = parts[2] || '';
    
    // Index pages are always free
    if (!lessonFile || lessonFile === 'index.html') return;
    
    // Free courses are always free
    if (FREE_COURSES.includes(courseSlug)) return;
    
    // Check lesson number from the course index to determine if it's in the free preview
    const isFreePreview = await this.checkFreePreview(courseSlug, lessonFile);
    if (isFreePreview) return;
    
    // This is a PAID lesson — check auth
    await this.checkAuth();
  },

  async checkFreePreview(courseSlug, lessonFile) {
    // Get the course index to determine lesson order
    try {
      const indexUrl = `/academy/${courseSlug}/index.html`;
      const resp = await fetch(indexUrl);
      const html = await resp.text();
      // Find all lesson links in order
      const linkRegex = /href="([^"]+\.html)"/g;
      const lessons = [];
      let match;
      while ((match = linkRegex.exec(html)) !== null) {
        const href = match[1];
        if (href !== 'index.html' && !href.startsWith('http') && !href.startsWith('/')) {
          lessons.push(href);
        }
      }
      const lessonIndex = lessons.indexOf(lessonFile);
      return lessonIndex >= 0 && lessonIndex < FREE_LESSON_COUNT;
    } catch {
      return false; // If we can't determine, assume paid
    }
  },

  async checkAuth() {
    try {
      // Check for existing session via Supabase Auth
      const tokenResp = await fetch(`${SUPABASE_URL}/auth/v1/session`, {
        headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` },
        credentials: 'include'
      });
      
      // Try localStorage for session token
      const storageKey = Object.keys(localStorage).find(k => k.includes('supabase') && k.includes('auth'));
      if (storageKey) {
        try {
          const stored = JSON.parse(localStorage.getItem(storageKey));
          if (stored?.access_token) {
            const profileResp = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=subscription_status,subscription_tier&id=eq.${stored.user?.id}`, {
              headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${stored.access_token}` }
            });
            const profiles = await profileResp.json();
            if (profiles[0]?.subscription_status === 'active') {
              return; // Pro subscriber — full access
            }
          }
        } catch {}
      }
      
      // Not authenticated or not subscribed — show gate
      this.showGate();
    } catch {
      this.showGate();
    }
  },

  showGate() {
    // Find the main content area
    const content = document.querySelector('.container, .post-body, .lesson-content, main') || document.body;
    
    // Create blur overlay after first 300px
    const gate = document.createElement('div');
    gate.id = 'lo-paywall';
    gate.innerHTML = `
      <style>
        #lo-paywall {
          position: relative;
          margin-top: -200px;
          padding-top: 200px;
          background: linear-gradient(to bottom, transparent, #0a0a0f 180px);
          text-align: center;
          padding-bottom: 60px;
        }
        #lo-paywall .gate-card {
          max-width: 480px;
          margin: 0 auto;
          background: #111114;
          border: 1px solid #2a2a38;
          border-radius: 20px;
          padding: 2.5rem 2rem;
        }
        #lo-paywall h2 {
          font-size: 1.5rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #c084fc, #fb923c);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        #lo-paywall p {
          color: #737373;
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }
        #lo-paywall .gate-btns {
          display: flex;
          gap: 10px;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 1rem;
        }
        #lo-paywall .gate-btn {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.9rem;
          text-decoration: none;
          transition: all 0.2s;
          font-family: Inter, sans-serif;
        }
        #lo-paywall .gate-btn-primary {
          background: #fb923c;
          color: #000;
        }
        #lo-paywall .gate-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(251,146,60,0.3);
        }
        #lo-paywall .gate-btn-secondary {
          background: transparent;
          color: #e5e5e5;
          border: 1px solid #2a2a38;
        }
        #lo-paywall .gate-btn-secondary:hover {
          border-color: #c084fc;
        }
        #lo-paywall .gate-note {
          font-size: 0.75rem;
          color: #555;
        }
        #lo-paywall .gate-note a {
          color: #c084fc;
          text-decoration: none;
        }
      </style>
      <div class="gate-card">
        <h2>This lesson is for Pro members</h2>
        <p>You've seen what Like One Academy offers. Unlock all 108+ interactive lessons, new courses every week, and download products.</p>
        <div class="gate-btns">
          <a href="${MONTHLY_LINK}" target="_blank" class="gate-btn gate-btn-primary">Go Pro — $49/mo</a>
          <a href="${ANNUAL_LINK}" target="_blank" class="gate-btn gate-btn-secondary">Annual — $390/yr (save 33%)</a>
        </div>
        <p class="gate-note">Already a member? <a href="${SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(location.href)}">Sign in</a></p>
      </div>
    `;
    
    // Insert after content shows ~300px
    const children = Array.from(content.children);
    let heightSoFar = 0;
    let insertAfter = null;
    for (const child of children) {
      heightSoFar += child.offsetHeight || 0;
      if (heightSoFar > 350) {
        insertAfter = child;
        break;
      }
    }
    
    if (insertAfter) {
      // Hide everything after the cutoff
      let sibling = insertAfter.nextElementSibling;
      while (sibling) {
        sibling.style.display = 'none';
        sibling = sibling.nextElementSibling;
      }
      insertAfter.after(gate);
    } else {
      content.appendChild(gate);
    }
  }
};

// Init on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => AUTH.init());
} else {
  AUTH.init();
}
