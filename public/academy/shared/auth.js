/**
 * LIKE ONE ACADEMY — Auth Gate v3.0
 * Zero Supabase. Uses sovereign auth (HMAC magic links + Stripe).
 * Session in localStorage, verified server-side.
 *
 * 2026-04-28 — Supabase independence
 */

(function() {
  const MONTHLY_LINK = 'https://buy.stripe.com/bJe28k9LygWb7qP09c3sI0p';
  const ANNUAL_LINK = 'https://buy.stripe.com/28E9AM8HudJZh1p7BE3sI0q';
  const SIGNIN_BASE = '/academy/signin.html';
  const SIGNIN_URL = SIGNIN_BASE + '?return=' + encodeURIComponent(location.pathname);

  const FREE_COURSES = [];
  const FREE_LESSON_COUNT = 3;

  initAuth();

  async function initAuth() {
    var path = location.pathname;
    var parts = path.split('/').filter(Boolean);
    var courseSlug = parts[1] || '';
    var lessonFile = parts[2] || '';

    // Index pages, community, and signin are always public
    if (!lessonFile || lessonFile === 'index.html' || lessonFile === 'community.html' || lessonFile === 'signin.html') return;

    // Check session
    var token = localStorage.getItem('lo_session');
    var email = localStorage.getItem('lo_email');
    var hasSession = false;
    var isPro = false;

    if (token && email) {
      try {
        var res = await fetch('/api/auth/session', {
          headers: { Authorization: 'Bearer ' + token },
        });
        var data = await res.json();
        if (data.authenticated) {
          hasSession = true;
          email = data.email;
          isPro = data.subscription && data.subscription.status === 'active' && data.subscription.tier === 'pro';

          // Also count community access as pro
          if (data.subscription && data.subscription.tier === 'community' && data.subscription.status === 'active') {
            isPro = true;
          }
        }
      } catch(e) {
        // Session check failed — treat as signed out
      }
    }

    // NOT SIGNED IN -> redirect to signin (email gate)
    if (!hasSession) {
      window.location.href = SIGNIN_URL;
      return;
    }

    // Pro/community members get full access
    if (isPro) return;

    // Free courses are accessible to any signed-in user
    if (FREE_COURSES.includes(courseSlug)) return;

    // Free preview lessons (first N) are accessible
    var isFree = await checkFreePreview(courseSlug, lessonFile);
    if (isFree) return;

    // Signed in but not Pro, and not free content -- show upgrade gate
    showGate(true);
  }

  async function checkFreePreview(courseSlug, lessonFile) {
    try {
      var resp = await fetch('/academy/' + courseSlug + '/index.html');
      var html = await resp.text();
      var linkRegex = /href="([^"]+\.html)"/g;
      var lessons = [];
      var match;
      while ((match = linkRegex.exec(html)) !== null) {
        var href = match[1];
        if (href !== 'index.html' && !href.startsWith('http') && !href.startsWith('/')) {
          lessons.push(href);
        }
      }
      var idx = lessons.indexOf(lessonFile);
      return idx >= 0 && idx < FREE_LESSON_COUNT;
    } catch { return false; }
  }

  function showGate(isSignedIn) {
    var content = document.querySelector('.container, .post-body, main') || document.body;
    var gate = document.createElement('div');
    gate.id = 'lo-paywall';

    var signinText = isSignedIn
      ? 'You\'re signed in but on the free tier. Upgrade to unlock everything.'
      : 'Sign in if you\'re already a Pro member.';

    var signinLink = isSignedIn
      ? ''
      : '<a href="' + SIGNIN_URL + '" style="color:#c084fc;font-size:13px;text-decoration:none">Already a member? Sign in &rarr;</a>';

    gate.innerHTML = '\
      <style>\
        #lo-paywall{position:relative;margin-top:-200px;padding-top:200px;background:linear-gradient(to bottom,transparent,#08080a 180px);text-align:center;padding-bottom:60px}\
        #lo-paywall .gate-card{max-width:480px;margin:0 auto;background:#111114;border:1px solid #2a2a38;border-radius:20px;padding:2.5rem 2rem}\
        #lo-paywall h2{font-size:1.5rem;font-weight:800;margin-bottom:.5rem;background:linear-gradient(135deg,#c084fc,#fb923c);-webkit-background-clip:text;-webkit-text-fill-color:transparent}\
        #lo-paywall p{color:#737373;font-size:.9rem;line-height:1.6;margin-bottom:1rem}\
        #lo-paywall .gate-btns{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-bottom:1rem}\
        #lo-paywall .gate-btn{display:inline-block;padding:.75rem 1.5rem;border-radius:10px;font-weight:700;font-size:.9rem;text-decoration:none;transition:all .2s;font-family:Inter,sans-serif}\
        #lo-paywall .gate-primary{background:#fb923c;color:#000}\
        #lo-paywall .gate-primary:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(251,146,60,.3)}\
        #lo-paywall .gate-secondary{background:transparent;color:#e5e5e5;border:1px solid #2a2a38}\
        #lo-paywall .gate-secondary:hover{border-color:#c084fc}\
        #lo-paywall .perks{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;margin:1rem 0;font-size:.75rem;color:#555}\
      </style>\
      <div class="gate-card">\
        <h2>Unlock this lesson</h2>\
        <p>You\'ve previewed the free lessons. Go Pro to access all 355+ interactive lessons across 36 courses.</p>\
        <div class="gate-btns">\
          <a href="' + MONTHLY_LINK + '" target="_blank" class="gate-btn gate-primary">Go Pro — $49/mo</a>\
          <a href="' + ANNUAL_LINK + '" target="_blank" class="gate-btn gate-secondary">Annual — $390/yr (save 33%)</a>\
        </div>\
        <div class="perks">\
          <span>\u2713 97 lessons</span>\
          <span>\u2713 10 courses</span>\
          <span>\u2713 New content regularly</span>\
          <span>\u2713 Cancel anytime</span>\
        </div>\
        <p style="font-size:.8rem;color:#555">' + signinText + '</p>\
        ' + signinLink + '\
      </div>\
    ';

    var children = Array.from(content.children);
    var height = 0;
    var insertAfter = null;
    for (var i = 0; i < children.length; i++) {
      height += children[i].offsetHeight || 0;
      if (height > 350) { insertAfter = children[i]; break; }
    }

    if (insertAfter) {
      var sib = insertAfter.nextElementSibling;
      while (sib) { sib.style.display = 'none'; sib = sib.nextElementSibling; }
      insertAfter.after(gate);
    } else {
      content.appendChild(gate);
    }
  }
})();
