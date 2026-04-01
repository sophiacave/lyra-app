'use client';
import { useState, useRef, useEffect } from 'react';

const CHAT_URL = 'https://tnsujchfrixxsdpodygu.supabase.co/functions/v1/faye-chat';

export default function FayeChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hey! I'm Faye — ask me anything about Like One, our courses, or getting started with AI." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: 'user', content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(CHAT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: updated.filter(m => m.role !== 'system').slice(-8),
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || "Something glitched — email hello@likeone.ai!" }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Can't connect right now. Email hello@likeone.ai!" }]);
    }
    setLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Chat with Faye"
        style={{
          position: 'fixed', bottom: 20, left: 20, zIndex: 9999,
          width: 48, height: 48, borderRadius: '50%',
          background: open ? '#333' : '#8b5cf6', border: 'none',
          color: '#fff', fontSize: 20, cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)', transition: 'all 0.2s ease',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {open ? '✕' : '💬'}
      </button>

      {open && (
        <div style={{
          position: 'fixed', bottom: 80, left: 20, zIndex: 9998,
          width: 360, maxWidth: 'calc(100vw - 40px)', height: 440, maxHeight: 'calc(100vh - 120px)',
          background: '#0c0c0e', border: '1px solid #1e1e28', borderRadius: 16,
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 8px 40px rgba(0,0,0,0.5)', overflow: 'hidden',
          animation: 'fayeChatSlide 0.2s ease',
        }}>
          <div style={{
            padding: '12px 16px', borderBottom: '1px solid #1e1e28',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#e8e8ec' }}>Ask Faye</span>
            <span style={{
              fontSize: 10, background: '#8b5cf622', color: '#8b5cf6',
              padding: '2px 8px', borderRadius: 10, fontWeight: 600,
            }}>AI</span>
          </div>

          <div ref={chatRef} style={{
            flex: 1, overflowY: 'auto', padding: '12px 16px',
            display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%', padding: '8px 12px',
                borderRadius: m.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                background: m.role === 'user' ? '#8b5cf6' : '#1a1a22',
                color: m.role === 'user' ? '#fff' : '#bbb',
                fontSize: 13, lineHeight: 1.5,
              }}>
                {m.content}
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: 'flex-start', color: '#555', fontSize: 12, fontStyle: 'italic' }}>
                Faye is typing...
              </div>
            )}
          </div>

          <div style={{
            padding: '8px 12px', borderTop: '1px solid #1e1e28',
            display: 'flex', gap: 8,
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Ask about courses, pricing, AI..."
              disabled={loading}
              style={{
                flex: 1, background: '#111114', border: '1px solid #1e1e28',
                borderRadius: 8, padding: '8px 12px', color: '#e8e8ec',
                fontSize: 13, outline: 'none',
              }}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              style={{
                background: '#8b5cf6', border: 'none', borderRadius: 8,
                padding: '8px 16px', color: '#fff', fontWeight: 700,
                fontSize: 13, cursor: 'pointer',
                opacity: loading || !input.trim() ? 0.4 : 1,
              }}
            >→</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fayeChatSlide {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
