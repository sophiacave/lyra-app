'use client';
import { useState, useRef, useEffect } from 'react';

const SUPABASE_URL = 'https://tnsujchfrixxsdpodygu.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuc3VqY2hmcml4eHNkcG9keWd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0MjkyNTQsImV4cCI6MjA5MDAwNTI1NH0.ef9DQbJPZ3m47gdz6zBfVnWKGInrsa-6idV3GmJSc6U';

// Generate a session ID for grouping reports
function getSessionId() {
  if (typeof window === 'undefined') return 'ssr';
  let id = sessionStorage.getItem('beta-session');
  if (!id) {
    id = crypto.randomUUID?.() || Math.random().toString(36).slice(2);
    sessionStorage.setItem('beta-session', id);
  }
  return id;
}

const PROMPTS = [
  "What's happening? Describe what you see.",
  "What did you expect to happen instead?",
  "Thanks! Any other details? (or just hit Send to submit)",
];

export default function BetaReporter() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hey! Found a bug? I'll help you report it. What's happening?" }
  ]);
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const chatRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text && step < 2) return;

    const newMessages = [...messages, { from: 'user', text: text || '(no additional details)' }];
    setMessages(newMessages);
    setInput('');

    if (step < 2) {
      const nextStep = step + 1;
      setStep(nextStep);
      setTimeout(() => {
        setMessages(prev => [...prev, { from: 'bot', text: PROMPTS[nextStep] }]);
      }, 400);
    } else {
      // Submit the report
      setSending(true);
      try {
        const userMessages = newMessages.filter(m => m.from === 'user').map(m => m.text);
        const report = {
          page_url: window.location.href,
          user_agent: navigator.userAgent,
          screen_size: `${window.innerWidth}x${window.innerHeight}`,
          session_id: getSessionId(),
          messages: newMessages,
          status: 'open',
          severity: 'medium',
        };

        const res = await fetch(`${SUPABASE_URL}/rest/v1/beta_reports`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON,
            'Authorization': `Bearer ${SUPABASE_ANON}`,
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify(report),
        });

        if (res.ok) {
          setMessages(prev => [...prev, {
            from: 'bot',
            text: "Bug logged! We'll look into it. Thanks for helping make Like One better. 💜"
          }]);
          setSubmitted(true);
        } else {
          setMessages(prev => [...prev, {
            from: 'bot',
            text: "Hmm, something went wrong saving that. Try again or email hello@likeone.ai."
          }]);
        }
      } catch {
        setMessages(prev => [...prev, {
          from: 'bot',
          text: "Couldn't connect. Try again or email hello@likeone.ai."
        }]);
      }
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const reset = () => {
    setStep(0);
    setMessages([{ from: 'bot', text: "Hey! Found a bug? I'll help you report it. What's happening?" }]);
    setInput('');
    setSubmitted(false);
    setSending(false);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => { setOpen(!open); if (open && submitted) reset(); }}
        aria-label="Report a bug"
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 9999,
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: open ? '#333' : '#c084fc',
          border: 'none',
          color: '#fff',
          fontSize: 20,
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {open ? '✕' : '🐛'}
      </button>

      {/* Chat panel */}
      {open && (
        <div style={{
          position: 'fixed',
          bottom: 80,
          right: 20,
          zIndex: 9998,
          width: 340,
          maxWidth: 'calc(100vw - 40px)',
          maxHeight: 420,
          background: '#0c0c0e',
          border: '1px solid #1e1e28',
          borderRadius: 16,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
          overflow: 'hidden',
          animation: 'betaSlideUp 0.2s ease',
        }}>
          {/* Header */}
          <div style={{
            padding: '12px 16px',
            borderBottom: '1px solid #1e1e28',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#e8e8ec' }}>
              Bug Reporter
            </span>
            <span style={{
              fontSize: 10,
              background: '#c084fc22',
              color: '#c084fc',
              padding: '2px 8px',
              borderRadius: 10,
              fontWeight: 600,
            }}>
              BETA
            </span>
          </div>

          {/* Messages */}
          <div ref={chatRef} style={{
            flex: 1,
            overflowY: 'auto',
            padding: '12px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.from === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                padding: '8px 12px',
                borderRadius: m.from === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                background: m.from === 'user' ? '#c084fc' : '#1a1a22',
                color: m.from === 'user' ? '#000' : '#aaa',
                fontSize: 13,
                lineHeight: 1.5,
                fontWeight: m.from === 'user' ? 500 : 400,
              }}>
                {m.text}
              </div>
            ))}
            {sending && (
              <div style={{
                alignSelf: 'flex-start',
                color: '#555',
                fontSize: 12,
                fontStyle: 'italic',
              }}>
                Logging bug...
              </div>
            )}
          </div>

          {/* Input */}
          {!submitted && (
            <div style={{
              padding: '8px 12px',
              borderTop: '1px solid #1e1e28',
              display: 'flex',
              gap: 8,
            }}>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={step === 2 ? "Optional details..." : "Describe the issue..."}
                disabled={sending}
                style={{
                  flex: 1,
                  background: '#111114',
                  border: '1px solid #1e1e28',
                  borderRadius: 8,
                  padding: '8px 12px',
                  color: '#e8e8ec',
                  fontSize: 13,
                  outline: 'none',
                }}
              />
              <button
                onClick={handleSend}
                disabled={sending || (!input.trim() && step < 2)}
                style={{
                  background: '#c084fc',
                  border: 'none',
                  borderRadius: 8,
                  padding: '8px 16px',
                  color: '#000',
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                  opacity: sending || (!input.trim() && step < 2) ? 0.4 : 1,
                }}
              >
                {step >= 2 ? 'Send' : '→'}
              </button>
            </div>
          )}

          {/* Report again */}
          {submitted && (
            <div style={{
              padding: '8px 12px',
              borderTop: '1px solid #1e1e28',
              textAlign: 'center',
            }}>
              <button onClick={reset} style={{
                background: 'none',
                border: '1px solid #1e1e28',
                borderRadius: 8,
                padding: '8px 16px',
                color: '#888',
                fontSize: 12,
                cursor: 'pointer',
              }}>
                Report Another Bug
              </button>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes betaSlideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
