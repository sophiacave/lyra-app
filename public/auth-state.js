/**
 * LIKE ONE — Auth State Manager v2.0 (Sovereign)
 * Zero Supabase. Uses HMAC magic link auth + Stripe subscription check.
 *
 * Sets:
 *   window.__likeone_user — { email, name, signed_in, isPro }
 *   body.lo-signed-in — when any user is signed in
 *   body.lo-pro — when user has active subscription
 *
 * CSS hooks:
 *   body.lo-pro .lo-hide-pro { display: none !important }
 *   body:not(.lo-pro) .lo-show-pro { display: none !important }
 */
(function() {
  // Inject CSS hooks
  var style = document.createElement('style');
  style.textContent = [
    'body.lo-pro .lo-hide-pro { display: none !important; }',
    'body:not(.lo-pro) .lo-show-pro { display: none !important; }',
    'body.lo-pro .price-tag { display: none !important; }',
    'body.lo-pro .subscribe-cta { display: none !important; }',
    'body.lo-pro .subscribe-btn { display: none !important; }',
    'body.lo-pro .subscribe-box { display: none !important; }',
    'body.lo-pro .gate-card { display: none !important; }'
  ].join('\n');
  document.head.appendChild(style);

  // Check sovereign auth session
  var token = localStorage.getItem('lo_session');
  var headers = token ? { Authorization: 'Bearer ' + token } : {};

  fetch('/api/auth/session', {
    headers: headers,
    credentials: 'include'
  })
  .then(function(r) { return r.json(); })
  .then(function(data) {
    if (!data.authenticated) return;

    document.body.classList.add('lo-signed-in');

    window.__likeone_user = {
      email: data.email,
      name: localStorage.getItem('lo_display_name') || data.email.split('@')[0],
      signed_in: true,
      isPro: false
    };

    // Update nav: Sign In → My Account
    document.querySelectorAll('a[href="/account"], a[href="/account/"]').forEach(function(link) {
      if (link.textContent.trim() === 'Sign In') link.textContent = 'My Account';
    });

    // Check subscription
    var sub = data.subscription;
    if (sub && sub.status === 'active' && sub.tier !== 'free') {
      document.body.classList.add('lo-pro');
      window.__likeone_user.isPro = true;
    } else if (sub && sub.tier === 'community') {
      document.body.classList.add('lo-pro');
      window.__likeone_user.isPro = true;
    }
  })
  .catch(function() { /* auth check failed silently */ });
})();
