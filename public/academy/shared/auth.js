/**
 * LIKE ONE ACADEMY — Auth Gate v2.0
 * Uses real Supabase JS client for session management.
 * Magic link auth — no passwords, maximum trust.
 */

(function() {
  const SUPABASE_URL = 'https://vpaynwebgmmnwttqkwmh.supabase.co';
  const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwYXlud2ViZ21tbnd0dHFrd21oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNjc0OTksImV4cCI6MjA4ODg0MzQ5OX0.roRXPjkD1K4EXgaV2slcxGtnhrGfnJnTXz7R2GhQCxo';
  const MONTHLY_LINK = 'https://buy.stripe.com/fZufZae1OeO35iH5tw3sI0c';
  const ANNUAL_LINK = 'https://buy.stripe.com/8x2bIUg9WgWb4eD7BE3sI0d';
  const SIGNIN_BASE = '/academy/signin.html';
  const SIGNIN_URL = SIGNIN_BASE + '?return=' + encodeURIComponent(location.pathname);

  const FREE_COURSES = ['ai-pet-lab'];
  const FREE_LESSON_COUNT = 3;

  // Load Supabase client
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/@supabase/supabase-js@2/dist/umd/supabase.min.js';
  script.onload = () => initAuth();
  document.head.appendChild(script);

  async function initAuth() {
    const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
    
    const path = location.pathname;
    const parts = path.split('/').filter(Boolean);
    const courseSlug = parts[1] || '';
    const lessonFile = parts[2] || '';

    // Index pages always free
    if (!lessonFile || lessonFile === 'index.html' || lessonFile === 'community.html' || lessonFile === 'signin.html') return;

    // Free courses always free
    if (FREE_COURSES.includes(courseSlug)) return;

    // Check if this lesson is in free preview (first N lessons)
    const isFree = await checkFreePreview(courseSlug, lessonFile);
    if (isFree) return;

    // Check auth session
    const { data: { session } } = await sb.auth.getSession();
    
    if (session) {
      // Signed in — check subscription
      const { data: profile } = await sb
        .from('profiles')
        .select('subscription_status')
        .eq('email', session.user.email)
        .single();
      
      if (profile?.subscription_status === 'active') return; // Pro — full access
    }

    // Not signed in or not subscribed — show gate
    showGate(!!session);
  }

  async function checkFreePreview(courseSlug, lessonFile) {
    try {
      const resp = await fetch(`/academy/${courseSlug}/index.html`);
      const html = await resp.text();
      const linkRegex = /href="([^"]+\.html)"/g;
      const lessons = [];
      let match;
      while ((match = linkRegex.exec(html)) !== null) {
        const href = match[1];
        if (href !== 'index.html' && !href.startsWith('http') && !href.startsWith('/')) {
          lessons.push(href);
        }
      }
      const idx = lessons.indexOf(lessonFile);
      return idx >= 0 && idx < FREE_LESSON_COUNT;
    } catch { return false; }
  }

  function showGate(isSignedIn) {
    const content = document.querySelector('.container, .post-body, main') || document.body;
    const gate = document.createElement('div');
    gate.id = 'lo-paywall';
    
    const signinText = isSignedIn 
      ? 'You\'re signed in but on the free tier. Upgrade to unlock everything.'
      : 'Sign in if you\'re already a Pro member.';
    
    const signinLink = isSignedIn
      ? ''
      : `<a href="${SIGNIN_URL}" style="color:#c084fc;font-size:13px;text-decoration:none">Already a member? Sign in →</a>`;

    gate.innerHTML = `
      <style>
        #lo-paywall{position:relative;margin-top:-200px;padding-top:200px;background:linear-gradient(to bottom,transparent,#0a0a0f 180px);text-align:center;padding-bottom:60px}
        #lo-paywall .gate-card{max-width:480px;margin:0 auto;background:#111114;border:1px solid #2a2a38;border-radius:20px;padding:2.5rem 2rem}
        #lo-paywall h2{font-size:1.5rem;font-weight:800;margin-bottom:.5rem;background:linear-gradient(135deg,#c084fc,#fb923c);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
        #lo-paywall p{color:#737373;font-size:.9rem;line-height:1.6;margin-bottom:1rem}
        #lo-paywall .gate-btns{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-bottom:1rem}
        #lo-paywall .gate-btn{display:inline-block;padding:.75rem 1.5rem;border-radius:10px;font-weight:700;font-size:.9rem;text-decoration:none;transition:all .2s;font-family:Inter,sans-serif}
        #lo-paywall .gate-primary{background:#fb923c;color:#000}
        #lo-paywall .gate-primary:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(251,146,60,.3)}
        #lo-paywall .gate-secondary{background:transparent;color:#e5e5e5;border:1px solid #2a2a38}
        #lo-paywall .gate-secondary:hover{border-color:#c084fc}
        #lo-paywall .perks{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;margin:1rem 0;font-size:.75rem;color:#555}
      </style>
      <div class="gate-card">
        <h2>Unlock this lesson</h2>
        <p>You've previewed the free lessons. Go Pro to access all 97 interactive lessons across 10 courses. <strong>Founding Member Sale — 90% off, locked in forever.</strong></p>
        <div class="gate-btns">
          <a href="${MONTHLY_LINK}" target="_blank" class="gate-btn gate-primary">Go Pro — $4.90/mo</a>
          <a href="${ANNUAL_LINK}" target="_blank" class="gate-btn gate-secondary">Annual — $39/yr (90% off forever)</a>
        </div>
        <div class="perks">
          <span>✓ 97 lessons</span>
          <span>✓ 10 courses</span>
          <span>✓ New content regularly</span>
          <span>✓ Cancel anytime</span>
        </div>
        <p style="font-size:.8rem;color:#555">${signinText}</p>
        ${signinLink}
      </div>
    `;

    const children = Array.from(content.children);
    let height = 0;
    let insertAfter = null;
    for (const child of children) {
      height += child.offsetHeight || 0;
      if (height > 350) { insertAfter = child; break; }
    }

    if (insertAfter) {
      let sib = insertAfter.nextElementSibling;
      while (sib) { sib.style.display = 'none'; sib = sib.nextElementSibling; }
      insertAfter.after(gate);
    } else {
      content.appendChild(gate);
    }
  }
})();
