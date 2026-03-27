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
      await fetch('https://tnsujchfrixxsdpodygu.supabase.co/functions/v1/subscribe', {
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

  if (done) return <p className="subscribe-success">Welcome. Check your inbox.</p>;

  return (
    <form onSubmit={handleSubmit} className="subscribe-form">
      <input name="email" type="email" required placeholder="your@email.com" className="subscribe-input" />
      <button type="submit" disabled={loading} className={`subscribe-btn${loading ? ' loading' : ''}`}>
        {loading ? 'Joining...' : buttonText}
      </button>
    </form>
  );
}
