/**
 * LIKE ONE ACADEMY — Auth Gate v4.0 (Sovereign)
 * Zero Supabase. Uses HMAC magic links + Stripe via /api/auth/session.
 * Session from localStorage token + httpOnly cookie (credentials: include).
 *
 * 2026-05-01 — Fixed: credentials include, updated counts, Apple HIG colors
 */

(function() {
  // Source of truth: lib/pricing.js — update there first, then sync here
  var MONTHLY_LINK = 'https://buy.stripe.com/bJe28k9LygWb7qP09c3sI0p';
  var ANNUAL_LINK = 'https://buy.stripe.com/28E9AM8HudJZh1p7BE3sI0q';
  var SIGNIN_BASE = '/academy/signin.html';
  var SIGNIN_URL = SIGNIN_BASE + '?return=' + encodeURIComponent(location.pathname);

  var FREE_COURSES = [];
  var FREE_LESSON_COUNT = 3;

  initAuth();

  async function initAuth() {
    var path = location.pathname;
    var parts = path.split('/').filter(Boolean);
    var courseSlug = parts[1] || '';
    var lessonFile = parts[2] || '';

    // Index pages, community, and signin are always public
    if (!lessonFile || lessonFile === 'index.html' || lessonFile === 'community.html' || lessonFile === 'signin.html') return;

    // Check session — try BOTH localStorage token AND httpOnly cookie
    var token = localStorage.getItem('lo_session');
    var headers = token ? { Authorization: 'Bearer ' + token } : {};
    var hasSession = false;
    var isPro = false;

    try {
      var res = await fetch('/api/auth/session', {
        headers: headers,
        credentials: 'include',
      });
      var data = await res.json();
      if (data.authenticated) {
        hasSession = true;
        isPro = data.subscription && data.subscription.status === 'active' && data.subscription.tier === 'pro';
        // Community access counts as pro
        if (data.subscription && data.subscription.tier === 'community') {
          isPro = true;
        }
      }
    } catch(e) {
      // Session check failed
    }

    // NOT SIGNED IN -> redirect to signin
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
        #lo-paywall{position:relative;margin-top:-200px;padding-top:200px;background:linear-gradient(to bottom,transparent,#1a1a1e 180px);text-align:center;padding-bottom:60px}\
        #lo-paywall .gate-card{max-width:480px;margin:0 auto;background:rgba(50,50,64,0.35);backdrop-filter:blur(28px);-webkit-backdrop-filter:blur(28px);border:1px solid rgba(255,255,255,0.09);border-radius:18px;padding:2.5rem 2rem}\
        #lo-paywall h2{font-size:1.5rem;font-weight:800;margin-bottom:.5rem;color:#e8e8ec}\
        #lo-paywall p{color:#8888a0;font-size:.9rem;line-height:1.6;margin-bottom:1rem}\
        #lo-paywall .gate-btns{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-bottom:1rem}\
        #lo-paywall .gate-btn{display:inline-block;padding:.75rem 1.5rem;border-radius:10px;font-weight:700;font-size:.9rem;text-decoration:none;transition:all .2s;font-family:Inter,system-ui,sans-serif}\
        #lo-paywall .gate-primary{background:linear-gradient(135deg,#c084fc,#38bdf8);color:#1a1a1e}\
        #lo-paywall .gate-primary:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(192,132,252,.25)}\
        #lo-paywall .gate-secondary{background:transparent;color:#e8e8ec;border:1px solid rgba(255,255,255,0.09)}\
        #lo-paywall .gate-secondary:hover{border-color:rgba(255,255,255,0.15)}\
        #lo-paywall .perks{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;margin:1rem 0;font-size:.75rem;color:#8888a0}\
      </style>\
      <div class="gate-card">\
        <h2>Unlock this lesson</h2>\
        <p>You\'ve previewed the free lessons. Go Pro to access all 520+ interactive lessons across 52 courses.</p>\
        <div class="gate-btns">\
          <a href="' + MONTHLY_LINK + '" target="_blank" class="gate-btn gate-primary">Go Pro \u2014 $49/mo</a>\
          <a href="' + ANNUAL_LINK + '" target="_blank" class="gate-btn gate-secondary">Annual \u2014 $390/yr (save 33%)</a>\
        </div>\
        <div class="perks">\
          <span>\u2713 520+ lessons</span>\
          <span>\u2713 52 courses</span>\
          <span>\u2713 New content regularly</span>\
          <span>\u2713 Cancel anytime</span>\
        </div>\
        <p style="font-size:.8rem;color:#55556a">' + signinText + '</p>\
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
