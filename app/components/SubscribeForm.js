'use client';
import { useState } from 'react';

export default function SubscribeForm({ source = 'website', buttonText = 'Subscribe' }) {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const email = e.target.email.value;
    try {
      await fetch('https://blknphuwwgagtueqtoji.supabase.co/functions/v1/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source })
      });
      setDone(true);
    } catch {
      alert('Something went wrong. Try again or email faye@likeone.ai');
      setLoading(false);
    }
  }

  if (done) return <p style={{ color: '#4ade80', fontWeight: 600 }}>Welcome. Check your inbox.</p>;

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', maxWidth: '400px', margin: '0 auto' }}>
      <input name="email" type="email" required placeholder="your@email.com"
        style={{ flex: 1, padding: '0.65rem 1rem', background: '#0a0a0f', border: '1px solid #1a1a2e', borderRadius: '8px', color: '#e5e5e5', fontSize: '0.9rem', fontFamily: 'inherit' }} />
      <button type="submit" disabled={loading}
        style={{ background: '#fb923c', color: '#000', padding: '0.65rem 1.25rem', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', opacity: loading ? 0.6 : 1 }}>
        {loading ? 'Joining...' : buttonText}
      </button>
    </form>
  );
}
