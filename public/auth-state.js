/**
 * LIKE ONE — Auth State Manager
 * Checks Supabase session, updates nav, hides pricing for pro members.
 * Lightweight — reads localStorage, one API call for subscription check.
 *
 * Sets:
 *   window.__likeone_user — { email, name, avatar, signed_in }
 *   body.lo-signed-in — when any user is signed in
 *   body.lo-pro — when user has active subscription
 *
 * CSS hooks:
 *   body.lo-pro .lo-hide-pro { display: none !important }
 *   body:not(.lo-pro) .lo-show-pro { display: none !important }
 */
(function() {
  const SESSION_KEY = 'sb-blknphuwwgagtueqtoji-auth-token';
  const ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsa25waHV3d2dhZ3R1ZXF0b2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0MDcxNTgsImV4cCI6MjA4OTk4MzE1OH0.Wm7-plwu9N7sG2SzD_C9mHUwB4Ceh91F7fimraVBG_s';

  // Inject CSS hooks
  const style = document.createElement('style');
  style.textContent = `
    body.lo-pro .lo-hide-pro { display: none !important; }
    body:not(.lo-pro) .lo-show-pro { display: none !important; }
    body.lo-pro .price-tag { display: none !important; }
    body.lo-pro .subscribe-cta { display: none !important; }
    body.lo-pro .subscribe-btn { display: none !important; }
    body.lo-pro .subscribe-box { display: none !important; }
    body.lo-pro .gate-card { display: none !important; }
  `;
  document.head.appendChild(style);

  function applySignedIn(session) {
    document.body.classList.add('lo-signed-in');

    window.__likeone_user = {
      email: session.user.email,
      name: localStorage.getItem('lo_display_name') || session.user.user_metadata?.full_name || session.user.user_metadata?.name || '',
      avatar: session.user.user_metadata?.avatar_url || '',
      signed_in: true
    };

    // Update nav: Sign In → My Account
    document.querySelectorAll('a[href="/account"]').forEach(link => {
      if (link.textContent.trim() === 'Sign In') link.textContent = 'My Account';
    });

    // Check subscription status (async, non-blocking)
    fetch('https://app.likeone.ai/rest/v1/profiles?email=eq.' + encodeURIComponent(session.user.email) + '&select=subscription_status,subscription_tier', {
      headers: { apikey: ANON, Authorization: 'Bearer ' + ANON }
    }).then(r => r.json()).then(profiles => {
      const p = profiles[0];
      if (p && p.subscription_status === 'active' && p.subscription_tier !== 'free') {
        document.body.classList.add('lo-pro');
        window.__likeone_user.isPro = true;
      }
    }).catch(() => {});
  }

  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return;

    const session = JSON.parse(raw);
    if (!session?.access_token || !session?.user?.email) return;

    // If token is expired but we have a refresh token, refresh it
    if (session.expires_at && session.expires_at * 1000 < Date.now()) {
      if (!session.refresh_token) return;
      // Refresh via Supabase GoTrue REST API (no SDK needed)
      fetch('https://app.likeone.ai/auth/v1/token?grant_type=refresh_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: ANON },
        body: JSON.stringify({ refresh_token: session.refresh_token })
      }).then(r => r.ok ? r.json() : Promise.reject()).then(data => {
        if (!data?.access_token || !data?.user?.email) return;
        // Update stored session with refreshed tokens
        localStorage.setItem(SESSION_KEY, JSON.stringify(data));
        applySignedIn(data);
      }).catch(() => {
        // Refresh failed — token is truly expired, clear it
        localStorage.removeItem(SESSION_KEY);
      });
      return;
    }

    applySignedIn(session);

  } catch(e) {}
})();
