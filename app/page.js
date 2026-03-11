'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

const QUICK_COMMANDS = [
  { icon: '📊', label: 'Status', cmd: 'status' },
  { icon: '💰', label: 'Revenue', cmd: 'revenue' },
  { icon: '🎯', label: 'Focus', cmd: 'focus' },
  { icon: '🏆', label: 'Log Win', cmd: 'win' },
  { icon: '💡', label: 'Idea', cmd: 'idea' },
  { icon: '🧠', label: 'Mood', cmd: 'mood' },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 6) return "You're up early. Let's make it count.";
  if (h < 12) return "Good morning, Sophia. Here's where we stand.";
  if (h < 17) return "Afternoon check-in. How's the energy?";
  if (h < 21) return "Evening. Let's close out strong or wind down.";
  return "It's late. Quick update, then rest.";
}

function detectMode(msg) {
  const l = msg.toLowerCase();
  if (['tired', 'overwhelmed', 'stressed', 'exhausted', 'failing', 'give up'].some(t => l.includes(t))) return 'guardian';
  if (['do', 'create', 'send', 'check', 'status', 'revenue', 'task', 'log', 'win', 'idea', 'update'].some(t => l.includes(t))) return 'engine';
  return 'mirror';
}

// Voice hook — handles both STT (Web Speech API) and TTS (ElevenLabs)
function useVoice(storedPin) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [sttSupported, setSttSupported] = useState(false);
  const recognitionRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    // Check if Web Speech API is available
    const SpeechRecognition = typeof window !== 'undefined' &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);
    setSttSupported(!!SpeechRecognition);
  }, []);

  const startListening = useCallback((onResult) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (e) => {
      console.error('Speech recognition error:', e.error);
      setIsListening(false);
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (transcript && onResult) onResult(transcript);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  const speak = useCallback(async (text) => {
    if (!voiceEnabled || !text) return;

    // Stop any current audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    setIsSpeaking(true);
    try {
      const response = await fetch('/api/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, pin: storedPin }),
      });

      if (!response.ok) {
        console.error('TTS failed:', response.status);
        setIsSpeaking(false);
        return;
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
      };
      audio.onerror = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
      };

      await audio.play();
    } catch (e) {
      console.error('TTS error:', e);
      setIsSpeaking(false);
    }
  }, [voiceEnabled, storedPin]);

  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsSpeaking(false);
    }
  }, []);

  return {
    isListening, isSpeaking, voiceEnabled, sttSupported,
    setVoiceEnabled, startListening, stopListening, speak, stopSpeaking,
  };
}

export default function Home() {
  const [pin, setPin] = useState('');
  const [authed, setAuthed] = useState(false);
  const [storedPin, setStoredPin] = useState('');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [briefing, setBriefing] = useState(null);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const msgsRef = useRef(null);

  const voice = useVoice(storedPin);

  // Check stored auth
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? window.__lyraPin : null;
    if (saved) {
      setStoredPin(saved);
      setAuthed(true);
    }
  }, []);

  // Load briefing on auth
  useEffect(() => {
    if (authed && storedPin) {
      fetchBriefing();
      fetchAgents();
    }
  }, [authed, storedPin]);

  // Auto-scroll to latest message
  useEffect(() => {
    if (msgsRef.current) {
      msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
    }
  }, [messages]);

  async function handleAuth() {
    if (pin.length === 4) {
      window.__lyraPin = pin;
      setStoredPin(pin);
      setAuthed(true);
    }
  }

  async function fetchBriefing() {
    try {
      const res = await fetch(`/api/notion?action=briefing&pin=${storedPin}`);
      if (res.ok) {
        const data = await res.json();
        setBriefing(data);
      }
    } catch (e) {
      console.error('Briefing fetch failed:', e);
    }
  }

  async function fetchAgents() {
    try {
      const res = await fetch(`/api/notion?action=agents&pin=${storedPin}`);
      if (res.ok) {
        const data = await res.json();
        setAgents(data.agents || []);
      }
    } catch (e) {
      console.error('Agent fetch failed:', e);
    }
  }

  async function processMessage(msg) {
    // Add user message
    setMessages(prev => [...prev, { role: 'user', text: msg }]);

    const mode = detectMode(msg);
    const lower = msg.toLowerCase();

    // Handle quick commands locally
    if (lower === 'status') {
      await fetchBriefing();
      const lyraResponse = `Here's your 3-3-3 briefing:\n\n📊 ${briefing?.agents || '22'} agents active\n🎯 ${briefing?.priorities?.length || 0} open priorities\n💰 Sprint Day ${briefing?.sprintDay || '0'} of 90\n\nCheck the dashboard below for details.`;
      setMessages(prev => [...prev, { role: 'lyra', mode, text: lyraResponse }]);
      voice.speak(lyraResponse);
      return;
    }

    if (lower.startsWith('win ')) {
      setLoading(true);
      try {
        const res = await fetch('/api/notion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'log_win', data: msg.slice(4), pin: storedPin })
        });
        const result = await res.json();
        const lyraResponse = `🏆 Win logged: "${msg.slice(4)}"\n\n${result.message || 'Added to the Wins Wall. Every win compounds.'}`;
        setMessages(prev => [...prev, { role: 'lyra', mode: 'engine', text: lyraResponse }]);
        voice.speak(lyraResponse);
      } catch (e) {
        setMessages(prev => [...prev, { role: 'lyra', mode: 'engine', text: 'Failed to log win. Try again.' }]);
      }
      setLoading(false);
      return;
    }

    if (lower.startsWith('idea ')) {
      setLoading(true);
      try {
        const res = await fetch('/api/notion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'log_idea', data: msg.slice(5), pin: storedPin })
        });
        const result = await res.json();
        const lyraResponse = `💡 Idea planted: "${msg.slice(5)}"\n\n${result.message || 'Growing in the Idea Garden.'}`;
        setMessages(prev => [...prev, { role: 'lyra', mode: 'engine', text: lyraResponse }]);
        voice.speak(lyraResponse);
      } catch (e) {
        setMessages(prev => [...prev, { role: 'lyra', mode: 'engine', text: 'Failed to log idea. Try again.' }]);
      }
      setLoading(false);
      return;
    }

    if (lower === 'mood') {
      const lyraResponse = `How are you really doing, Sophia?\n\nRate yourself 1-5:\n• Energy: ?\n• Stress: ?\n• Motivation: ?\n\nThere's no wrong answer. I'm here to help you calibrate, not judge.`;
      setMessages(prev => [...prev, { role: 'lyra', mode: 'guardian', text: lyraResponse }]);
      voice.speak(lyraResponse);
      return;
    }

    // Default conversational response based on mode
    const responses = {
      mirror: `I hear you. "${msg}"\n\nTell me more about what's on your mind. I'm in listening mode.`,
      engine: `Got it. Let me process: "${msg}"\n\nI'll route this to the right agent. For now, you can use quick commands (win, idea, status) or check the dashboard below.`,
      guardian: `Hey. I noticed something in what you said.\n\nRemember: Like One exists because of you. Not despite you. Take a breath. What's one small thing that would help right now?`
    };

    const lyraResponse = responses[mode];
    setMessages(prev => [...prev, { role: 'lyra', mode, text: lyraResponse }]);
    voice.speak(lyraResponse);
  }

  async function handleSend() {
    if (!input.trim()) return;
    const msg = input.trim();
    setInput('');
    await processMessage(msg);
  }

  function handleVoiceInput() {
    if (voice.isListening) {
      voice.stopListening();
      return;
    }
    voice.startListening(async (transcript) => {
      setInput(transcript);
      // Auto-send after voice input
      await processMessage(transcript);
    });
  }

  // PIN Screen
  if (!authed) {
    return (
      <div className="auth-screen">
        <h1 style={{ fontSize: 48, marginBottom: 4 }}>✦</h1>
        <h2 style={{
          fontSize: 28, fontWeight: 700,
          background: 'linear-gradient(135deg, #8b5cf6, #c084fc)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>Lyra</h2>
        <p style={{ color: '#737373', marginTop: 8, fontSize: 14 }}>Like One Command Interface</p>
        <input
          className="pin-input"
          type="password"
          maxLength={4}
          placeholder="····"
          value={pin}
          onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
          onKeyDown={e => e.key === 'Enter' && handleAuth()}
          autoFocus
        />
        <button className="send-btn" style={{ padding: '12px 32px' }} onClick={handleAuth}>
          Enter
        </button>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Header */}
      <div className="header">
        <h1>✦ Lyra</h1>
        <div className="subtitle">Like One Command Interface</div>
        <div className="greeting">{getGreeting()}</div>
      </div>

      {/* Voice Toggle */}
      <div className="voice-toggle-row">
        <button
          className={`voice-toggle ${voice.voiceEnabled ? 'voice-active' : ''}`}
          onClick={() => voice.setVoiceEnabled(!voice.voiceEnabled)}
        >
          <span className="voice-icon">{voice.voiceEnabled ? '🔊' : '🔇'}</span>
          <span>{voice.voiceEnabled ? 'Voice On' : 'Voice Off'}</span>
        </button>
        {voice.isSpeaking && (
          <button className="voice-stop" onClick={voice.stopSpeaking}>
            Stop
          </button>
        )}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        {QUICK_COMMANDS.map(q => (
          <button key={q.cmd} className="quick-btn" onClick={() => { setInput(q.cmd); }}>
            <span className="icon">{q.icon}</span>
            {q.label}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat">
          <div className="stat-value">{agents.length || 22}</div>
          <div className="stat-label">Agents Active</div>
        </div>
        <div className="stat">
          <div className="stat-value">$0</div>
          <div className="stat-label">Revenue (Sprint)</div>
        </div>
        <div className="stat">
          <div className="stat-value">0</div>
          <div className="stat-label">Sprint Day</div>
        </div>
        <div className="stat">
          <div className="stat-value">$500</div>
          <div className="stat-label">Budget Left</div>
        </div>
      </div>

      {/* Revenue */}
      <div className="card">
        <div className="card-title">💰 Revenue Channels</div>
        {[
          { name: 'Upwork', status: '🟡', amount: '$0' },
          { name: 'Gumroad', status: '🟡', amount: '$0' },
          { name: 'LinkedIn', status: '🟡', amount: '$0' },
          { name: 'Framer', status: '🟡', amount: '$0' },
        ].map(ch => (
          <div key={ch.name} className="revenue-row">
            <span className="revenue-channel">{ch.status} {ch.name}</span>
            <span className="revenue-amount">{ch.amount}</span>
          </div>
        ))}
      </div>

      {/* Messages */}
      {messages.length > 0 && (
        <>
          <div className="section-label">Conversation</div>
          <div ref={msgsRef}>
            {messages.map((m, i) => (
              <div key={i} className={`message ${m.role === 'lyra' ? 'message-lyra' : 'message-user'}`}>
                {m.mode && (
                  <span className={`mode-indicator mode-${m.mode}`} style={{ marginBottom: 6, display: 'inline-block' }}>
                    {m.mode} mode
                  </span>
                )}
                <div style={{ whiteSpace: 'pre-wrap' }}>{m.text}</div>
                {/* Replay voice button on Lyra messages */}
                {m.role === 'lyra' && voice.voiceEnabled && (
                  <button
                    className="replay-voice-btn"
                    onClick={() => voice.speak(m.text)}
                    title="Replay voice"
                  >
                    🔊
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Agent Roster */}
      <div className="card" style={{ marginTop: 8 }}>
        <div className="card-title">🤖 Agent Roster</div>
        {(agents.length ? agents : [
          { name: 'Lyra', role: 'Chief of Staff' },
          { name: 'Surge', role: 'Revenue Ops' },
          { name: 'Prism', role: 'Brand Orchestrator' },
          { name: 'Compass', role: 'Ethics' },
          { name: 'Bridge', role: 'MCP Orchestrator' },
          { name: 'Genesis', role: 'Agent Architect' },
          { name: 'Sentinel', role: 'System' },
          { name: 'Vault', role: 'CFO' },
          { name: 'Nova', role: 'Content' },
          { name: 'Atlas', role: 'Strategy' },
        ]).map((a, i) => (
          <div key={i} className="agent-row">
            <div>
              <span className="agent-name">{a.name}</span>
              <span className="agent-role" style={{ marginLeft: 8 }}>{a.role}</span>
            </div>
            <span className="status-dot" />
          </div>
        ))}
      </div>

      {/* Fixed Chat Input with Voice */}
      <div className="chat-container">
        <div className="chat-input-wrap">
          {voice.sttSupported && (
            <button
              className={`mic-btn ${voice.isListening ? 'mic-active' : ''}`}
              onClick={handleVoiceInput}
              title={voice.isListening ? 'Stop listening' : 'Voice input'}
            >
              {voice.isListening ? '⏹' : '🎤'}
            </button>
          )}
          <input
            ref={inputRef}
            className="chat-input"
            placeholder={voice.isListening ? 'Listening...' : 'Talk to Lyra...'}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            disabled={voice.isListening}
          />
          <button className="send-btn" onClick={handleSend} disabled={voice.isListening}>
            {loading ? '...' : '→'}
          </button>
        </div>
        {voice.isListening && (
          <div className="listening-indicator">
            <span className="listening-dot" />
            <span>Listening...</span>
          </div>
        )}
      </div>
    </div>
  );
}
