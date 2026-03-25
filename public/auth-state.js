/**
 * LIKE ONE — Auth State Nav Updater
 * Lightweight script that checks Supabase session in localStorage
 * and updates "Sign In" → "My Account" across all pages.
 * No SDK needed — just reads the stored session token.
 *
 * Add to any page: <script src="/auth-state.js"></script>
 */
(function() {
  // Supabase stores session under this key pattern
  const SESSION_KEY = 'sb-blknphuwwgagtueqtoji-auth-token';

  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return;

    const session = JSON.parse(raw);
    if (!session?.access_token || !session?.user?.email) return;

    // Check if token is expired
    if (session.expires_at && session.expires_at * 1000 < Date.now()) return;

    // Store user info for other pages (forum, etc.)
    window.__likeone_user = {
      email: session.user.email,
      name: localStorage.getItem('lo_display_name') || session.user.user_metadata?.full_name || session.user.user_metadata?.name || '',
      avatar: session.user.user_metadata?.avatar_url || '',
      signed_in: true
    };

    // User is signed in — update all "Sign In" links to "My Account"
    document.querySelectorAll('a[href="/account"]').forEach(link => {
      if (link.textContent.trim() === 'Sign In') {
        link.textContent = 'My Account';
      }
    });
  } catch(e) {
    // Silently fail — don't break the page
  }
})();
