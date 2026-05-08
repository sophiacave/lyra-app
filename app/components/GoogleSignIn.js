'use client';
import { useEffect, useRef, useCallback } from 'react';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export default function GoogleSignIn({ onSuccess, onError, context = 'signin' }) {
  const buttonRef = useRef(null);
  const initialized = useRef(false);

  const handleCredential = useCallback(async (response) => {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ credential: response.credential }),
      });

      const data = await res.json();

      if (data.success) {
        // Store session info in localStorage (mirrors the cookie)
        localStorage.setItem('lo_session', 'google-auth');
        localStorage.setItem('lo_email', data.email);
        localStorage.setItem('lo_display_name', data.name || '');

        if (onSuccess) onSuccess(data);
        else window.location.reload();
      } else {
        if (onError) onError(data.error);
      }
    } catch (err) {
      if (onError) onError(err.message);
    }
  }, [onSuccess, onError]);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || initialized.current) return;

    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (!window.google?.accounts?.id) return;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredential,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // Render the button
      if (buttonRef.current) {
        window.google.accounts.id.renderButton(buttonRef.current, {
          type: 'standard',
          theme: 'filled_black',
          size: 'large',
          shape: 'pill',
          text: context === 'signup' ? 'signup_with' : 'signin_with',
          width: 300,
        });
      }

      // Show One Tap prompt
      window.google.accounts.id.prompt();

      initialized.current = true;
    };

    document.head.appendChild(script);

    return () => {
      try { script.remove(); } catch {}
    };
  }, [handleCredential, context]);

  if (!GOOGLE_CLIENT_ID) {
    return null; // Don't render if client ID not configured
  }

  return (
    <div className="google-signin-container">
      <div ref={buttonRef} className="google-signin-button" />
    </div>
  );
}
