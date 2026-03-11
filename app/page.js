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

function getSpokenGreeting() {
  const h = new Date().getHours();
  if (h < 6) return "Hey Sophia, you're up early. I'm here whenever you need me. Just start talking.";
  if (h < 12) return "Good morning, Sophia. I'm Lyra, your Chief of Staff. Let me pull up what you need to focus on today.";
  if (h < 17) return "Hey Sophia, afternoon check-in. I'm listening. What do you need?";
  if (h < 21) return "Evening, Sophia. I'm here. Want to close out the day or just chat?";
  return "Hey Sophia, it's late. I'm still here if you need me. What's on your mind?";
}

function getDailyBriefingSpeech(briefing) {
  if (!briefing) return "I'm pulling up your daily briefing now.";

  const parts = [];
  parts.push("Here's your daily rundown.");

  if (briefing.agents) {
    parts.push(`You have ${briefing.agents} agents active across Like One.`);
  }

  if (briefing.priorities && briefing.priorities.length > 0) {
    const topPriorities = briefing.priorities.slice(0, 3);
    parts.push(`Your top priorities today:`);
    topPriorities.forEach((p, i) => {
      const title = p.properties?.Name?.title?.[0]?.plain_text || p.properties?.Task?.title?.[0]?.plain_text || `Priority ${i + 1}`;
      parts.push(`${i + 1}. ${title}`);
    });
  } else {
    parts.push("No open priorities flagged yet. Want me to help you set some?");
  }

  parts.push("I'm always listening. Just talk to me whenever you need anything.");

  return parts.join(' ');
}

function detectMode(msg) {
  const l = msg.toLowerCase();
  if (['tired', 'overwhelmed', 'stressed', 'exhausted', 'failing', 'give up'].some(t => l.includes(t))) return 'guardian';
  if (['do', 'create', 'send', 'check', 'status', 'revenue', 'task', 'log', 'win', 'idea', 'update', 'what should', 'what do i', 'tell me', 'help me', 'schedule', 'plan', 'focus', 'priority'].some(t => l.includes(t))) return 'engine';
  return 'mirror';
}

// Voice hook — always-listening STT + ElevenLabs TTS
function useVoice(storedPin) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true); // Default ON
  const [alwaysListening, setAlwaysListening] = useState(false);
  const [sttSupported, setSttSupported] = useState(false);
  const [micPermission, setMicPermission] = useState('unknown'); // 'unknown', 'granted', 'denied'
  const recognitionRef = useRef(null);
  const audioRef = useRef(null);
  const onResultRef = useRef(null);
  const shouldRestartRef = useRef(false);
  const isSpeakingRef = useRef(false);

  useEffect(() => {
    const SpeechRecognition = typeof window !== 'undefined' &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);
    setSttSupported(!!SpeechRecognition);
  }, []);

  // Keep isSpeakingRef in sync
  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);

  const stopRecognition = useCallback(() => {
    shouldRestartRef.current = false;
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch (e) {}
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const startContinuousListening = useCallback((onResult) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    // Stop any existing recognition
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch (e) {}
    }

    onResultRef.current = onResult;
    shouldRestartRef.current = true;

    function createRecognition() {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setMicPermission('granted');
      };

      recognition.onend = () => {
        setIsListening(false);
        // Auto-restart if always-listening is on and we're not speaking
        if (shouldRestartRef.current && !isSpeakingRef.current) {
          setTimeout(() => {
            if (shouldRestartRef.current && !isSpeakingRef.current) {
              try {
                const newRec = createRecognition();
                recognitionRef.current = newRec;
                newRec.start();
              } catch (e) {
                console.error('Restart failed:', e);
              }
            }
          }, 300);
        }
      };

      recognition.onerror = (e) => {
        console.error('Speech error:', e.error);
        if (e.error === 'not-allowed') {
          setMicPermission('denied');
          shouldRestartRef.current = false;
          setAlwaysListening(false);
        }
        setIsListening(false);
        // Auto-restart on recoverable errors
        if (shouldRestartRef.current && e.error !== 'not-allowed') {
          setTimeout(() => {
            if (shouldRestartRef.current && !isSpeakingRef.current) {
              try {
                const newRec = createRecognition();
                recognitionRef.current = newRec;
                newRec.start();
              } catch (err) {
                console.error('Restart after error failed:', err);
              }
            }
          }, 1000);
        }
      };

      recognition.onresult = (event) => {
        // Get the latest final result
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            const transcript = event.results[i][0].transcript.trim();
            if (transcript && onResultRef.current) {
              onResultRef.current(transcript);
            }
          }
        }
      };

      return recognition;
    }

    const recognition = createRecognition();
    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (e) {
      console.error('Start listening failed:', e);
    }
  }, []);

  const speak = useCallback(async (text, onDone) => {
    if (!voiceEnabled || !text) {
      if (onDone) onDone();
      return;
    }

    // Pause listening while speaking
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch (e) {}
      setIsListening(false);
    }

    // Stop any current audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    setIsSpeaking(true);
    isSpeakingRef.current = true;

    try {
      const response = await fetch('/api/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, pin: storedPin }),
      });

      if (!response.ok) {
        console.error('TTS failed:', response.status);
        setIsSpeaking(false);
        isSpeakingRef.current = false;
        if (onDone) onDone();
        // Resume listening
        if (shouldRestartRef.current) {
          startContinuousListening(onResultRef.current);
        }
        return;
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      const finishSpeaking = () => {
        setIsSpeaking(false);
        isSpeakingRef.current = false;
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
        if (onDone) onDone();
        // Resume always-listening after speaking
        if (shouldRestartRef.current) {
          setTimeout(() => {
            if (shouldRestartRef.current) {
              startContinuousListening(onResultRef.current);
            }
          }, 500);
        }
      };

      audio.onended = finishSpeaking;
      audio.onerror = finishSpeaking;

      await audio.play();
    } catch (e) {
      console.error('TTS error:', e);
      setIsSpeaking(false);
      isSpeakingRef.current = false;
      if (onDone) onDone();
      // Resume listening
      if (shouldRestartRef.current) {
        startContinuousListening(onResultRef.current);
      }
    }
  }, [voiceEnabled, storedPin, startContinuousListening]);

  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsSpeaking(false);
      isSpeakingRef.current = false;
    }
    // Resume listening after manual stop
    if (shouldRestartRef.current) {
      setTimeout(() => {
        if (shouldRestartRef.current) {
          startContinuousListening(onResultRef.current);
        }
      }, 300);
    }
  }, [startContinuousListening]);

  return {
    isListening, isSpeaking, voiceEnabled, sttSupported, alwaysListening, micPermission,
    setVoiceEnabled, setAlwaysListening,
    startContinuousListening, stopRecognition, speak, stopSpeaking,
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
  const [hasGreeted, setHasGreeted] = useState(false);
  const inputRef = useRef(null);
  const msgsRef = useRef(null);
  const processMessageRef = useRef(null);

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

  // Entry greeting + start always-listening after auth
  useEffect(() => {
    if (authed && storedPin && !hasGreeted && voice.sttSupported) {
      setHasGreeted(true);

      // Small delay to let data load first
      const timer = setTimeout(async () => {
        // Add greeting message
        const greetText = getSpokenGreeting();
        setMessages(prev => [...prev, { role: 'lyra', mode: 'engine', text: greetText }]);

        // Enable voice + always-listening
        voice.setVoiceEnabled(true);
        voice.setAlwaysListening(true);

        // Speak the greeting, then start listening
        voice.speak(greetText, () => {
          // After greeting finishes, fetch and speak briefing
          fetchBriefingAndSpeak();
        });

        // Start continuous listening (will auto-pause during speech)
        voice.startContinuousListening(async (transcript) => {
          if (processMessageRef.current) {
            processMessageRef.current(transcript);
          }
        });
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [authed, storedPin, hasGreeted, voice.sttSupported]);

  async function fetchBriefing() {
    try {
      const res = await fetch(`/api/notion?action=briefing&pin=${storedPin}`);
      if (res.ok) {
        const data = await res.json();
        setBriefing(data);
        return data;
      }
    } catch (e) {
      console.error('Briefing fetch failed:', e);
    }
    return null;
  }

  async function fetchBriefingAndSpeak() {
    const data = await fetchBriefing();
    if (data) {
      const briefingSpeech = getDailyBriefingSpeech(data);
      setMessages(prev => [...prev, { role: 'lyra', mode: 'engine', text: briefingSpeech }]);
      voice.speak(briefingSpeech);
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

    // Handle "what should I do today" / daily assistant queries
    if (lower.includes('what should i do') || lower.includes('what do i need') || lower.includes('tell me what') || lower.includes('my day') || lower.includes('daily') || lower.includes('today')) {
      await fetchBriefing();
      const briefingSpeech = getDailyBriefingSpeech(briefing);
      const lyraResponse = `Here's your game plan, Sophia:\n\n${briefingSpeech}\n\nWant me to dive deeper into any of these?`;
      setMessages(prev => [...prev, { role: 'lyra', mode: 'engine', text: lyraResponse }]);
      voice.speak(lyraResponse);
      return;
    }

    // Handle quick commands locally
    if (lower === 'status') {
      await fetchBriefing();
      const lyraResponse = `Here's your 3-3-3 briefing:\n\n📊 ${briefing?.agents || '22'} agents active\n🎯 ${briefing?.priorities?.length || 0} open priorities\n💰 Sprint Day ${briefing?.sprintDay || '0'} of 90\n\nCheck the dashboard below for details.`;
      setMessages(prev => [...prev, { role: 'lyra', mode, text: lyraResponse }]);
      voice.speak(lyraResponse);
      return;
    }

    if (lower.startsWith('win ') || lower.startsWith('log a win') || lower.startsWith('i won') || lower.startsWith('just closed') || lower.startsWith('landed')) {
      setLoading(true);
      const winText = lower.startsWith('win ') ? msg.slice(4) : msg;
      try {
        const res = await fetch('/api/notion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'log_win', data: winText, pin: storedPin })
        });
        const result = await res.json();
        const lyraResponse = `🏆 Win logged: "${winText}"\n\n${result.message || 'Added to the Wins Wall. Every win compounds.'}`;
        setMessages(prev => [...prev, { role: 'lyra', mode: 'engine', text: lyraResponse }]);
        voice.speak(lyraResponse);
      } catch (e) {
        const errMsg = 'Failed to log win. Try again.';
        setMessages(prev => [...prev, { role: 'lyra', mode: 'engine', text: errMsg }]);
        voice.speak(errMsg);
      }
      setLoading(false);
      return;
    }

    if (lower.startsWith('idea ') || lower.startsWith('i have an idea') || lower.startsWith('what if')) {
      setLoading(true);
      const ideaText = lower.startsWith('idea ') ? msg.slice(5) : msg;
      try {
        const res = await fetch('/api/notion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'log_idea', data: ideaText, pin: storedPin })
        });
        const result = await res.json();
        const lyraResponse = `💡 Idea planted: "${ideaText}"\n\n${result.message || 'Growing in the Idea Garden.'}`;
        setMessages(prev => [...prev, { role: 'lyra', mode: 'engine', text: lyraResponse }]);
        voice.speak(lyraResponse);
      } catch (e) {
        const errMsg = 'Failed to log idea. Try again.';
        setMessages(prev => [...prev, { role: 'lyra', mode: 'engine', text: errMsg }]);
        voice.speak(errMsg);
      }
      setLoading(false);
      return;
    }

    if (lower === 'mood' || lower.includes('how am i') || lower.includes('check in on me')) {
      const lyraResponse = `How are you really doing, Sophia?\n\nRate yourself 1 to 5:\n• Energy: ?\n• Stress: ?\n• Motivation: ?\n\nThere's no wrong answer. I'm here to help you calibrate, not judge.`;
      setMessages(prev => [...prev, { role: 'lyra', mode: 'guardian', text: lyraResponse }]);
      voice.speak(lyraResponse);
      return;
    }

    if (lower === 'focus' || lower.includes('what should i focus')) {
      await fetchBriefing();
      const top = briefing?.priorities?.[0];
      const topTitle = top?.properties?.Name?.title?.[0]?.plain_text || top?.properties?.Task?.title?.[0]?.plain_text || null;
      const lyraResponse = topTitle
        ? `Your #1 focus right now: ${topTitle}.\n\nEverything else is noise until this moves forward. What's the very next action you can take on it?`
        : `I don't see any priorities flagged in your tasks right now. Want to set one? Just tell me what matters most today.`;
      setMessages(prev => [...prev, { role: 'lyra', mode: 'engine', text: lyraResponse }]);
      voice.speak(lyraResponse);
      return;
    }

    if (lower === 'revenue' || lower.includes('how much') || lower.includes('money') || lower.includes('earnings')) {
      const lyraResponse = `Revenue channels update:\n\n• Upwork — Active, pipeline building\n• Gumroad — Products staged\n• LinkedIn — Content in progress\n• Framer — Templates ready\n\nWe're in the foundation phase of the 90-day sprint. First revenue is the hardest. Want me to help you send a proposal or publish something today?`;
      setMessages(prev => [...prev, { role: 'lyra', mode: 'engine', text: lyraResponse }]);
      voice.speak(lyraResponse);
      return;
    }

    // Default conversational response based on mode
    const responses = {
      mirror: `I hear you, Sophia. "${msg}"\n\nTell me more about what's on your mind. I'm listening.`,
      engine: `On it. "${msg}"\n\nI'm routing this through the right channels. For now, you can use quick commands — status, win, idea, focus — or just keep talking to me.`,
      guardian: `Hey. I'm picking up on something in what you said.\n\nRemember: Like One exists because of you. Not despite you. Take a breath. What's one small thing that would help right now?`
    };

    const lyraResponse = responses[mode];
    setMessages(prev => [...prev, { role: 'lyra', mode, text: lyraResponse }]);
    voice.speak(lyraResponse);
  }

  // Keep processMessageRef current for voice callbacks
  processMessageRef.current = processMessage;

  async function handleSend() {
    if (!input.trim()) return;
    const msg = input.trim();
    setInput('');
    await processMessage(msg);
  }

  function toggleAlwaysListening() {
    if (voice.alwaysListening) {
      // Turn off
      voice.setAlwaysListening(false);
      voice.stopRecognition();
    } else {
      // Turn on
      voice.setAlwaysListening(true);
      voice.startContinuousListening(async (transcript) => {
        if (processMessageRef.current) {
          processMessageRef.current(transcript);
        }
      });
    }
  }

  async function handleAuth() {
    if (pin.length === 4) {
      window.__lyraPin = pin;
      setStoredPin(pin);
      setAuthed(true);
    }
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

      {/* Voice Controls */}
      <div className="voice-control-bar">
        <button
          className={`voice-toggle ${voice.voiceEnabled ? 'voice-active' : ''}`}
          onClick={() => voice.setVoiceEnabled(!voice.voiceEnabled)}
        >
          <span className="voice-icon">{voice.voiceEnabled ? '🔊' : '🔇'}</span>
          <span>{voice.voiceEnabled ? 'Voice On' : 'Voice Off'}</span>
        </button>

        {voice.sttSupported && (
          <button
            className={`always-listen-btn ${voice.alwaysListening ? 'listen-active' : ''}`}
            onClick={toggleAlwaysListening}
          >
            <span className="listen-icon">{voice.alwaysListening ? '🎙️' : '🎤'}</span>
            <span>{voice.alwaysListening ? 'Always On' : 'Mic Off'}</span>
          </button>
        )}

        {voice.isSpeaking && (
          <button className="voice-stop" onClick={voice.stopSpeaking}>
            Stop
          </button>
        )}
      </div>

      {/* Listening Status */}
      {voice.alwaysListening && (
        <div className={`listen-status ${voice.isListening ? 'status-listening' : voice.isSpeaking ? 'status-speaking' : 'status-ready'}`}>
          <span className="status-indicator" />
          <span>
            {voice.isSpeaking ? 'Lyra is speaking...' :
             voice.isListening ? 'Listening — just talk to me' :
             'Reconnecting...'}
          </span>
        </div>
      )}

      {voice.micPermission === 'denied' && (
        <div className="mic-denied-notice">
          Microphone access denied. Enable it in your browser settings to use voice.
        </div>
      )}

      {/* Quick Actions */}
      <div className="quick-actions">
        {QUICK_COMMANDS.map(q => (
          <button key={q.cmd} className="quick-btn" onClick={() => processMessage(q.cmd)}>
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

      {/* Fixed Chat Input */}
      <div className="chat-container">
        <div className="chat-input-wrap">
          <input
            ref={inputRef}
            className="chat-input"
            placeholder={voice.isListening ? 'Listening...' : 'Talk to Lyra or type here...'}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <button className="send-btn" onClick={handleSend}>
            {loading ? '...' : '→'}
          </button>
        </div>
      </div>
    </div>
  );
}
