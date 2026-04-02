'use client';
import { useState, useRef, useCallback } from 'react';

/**
 * PromptLab — Interactive Prompt Engineering Playground
 *
 * Research: Active Learning / Constructivism (Bonwell & Eison 1991,
 * Piaget 1972) — learners construct deeper understanding by actively
 * manipulating prompt structures and observing how different techniques
 * shape AI output, rather than passively reading about them.
 *
 * Props:
 *   onXP?:  (xp) => void — award 15 XP after 3 template switches or runs
 */

const TEMPLATES = [
  {
    name: 'Zero-Shot',
    tag: 'ZERO-SHOT',
    desc: 'No examples — just a clear instruction. Best for simple, well-defined tasks.',
    tip: 'Be specific about format, length, and tone.',
    prompt: 'Classify the following movie review as POSITIVE or NEGATIVE.\n\nReview: "This film was a masterpiece of storytelling. The performances were breathtaking and the cinematography was stunning."\n\nClassification:',
    output: 'POSITIVE\n\nThe review uses strongly favorable language: "masterpiece," "breathtaking," and "stunning" all indicate a highly positive sentiment.',
  },
  {
    name: 'Few-Shot',
    tag: 'FEW-SHOT',
    desc: 'Give 2-3 examples of input→output pairs before your actual request.',
    tip: 'Make your examples diverse for better generalization.',
    prompt: 'Convert these informal messages to professional emails:\n\nInformal: "hey can u send me that report asap"\nProfessional: "Hi, could you please send me the quarterly report at your earliest convenience? Thank you."\n\nInformal: "the meeting was kinda boring ngl"\nProfessional: "The meeting covered familiar ground. I\'d suggest a more focused agenda for next time."\n\nInformal: "yo this new feature is fire"\nProfessional:',
    output: '"I\'m impressed with the new feature — it\'s a significant improvement that should resonate well with our users. Great work by the development team."',
  },
  {
    name: 'Chain-of-Thought',
    tag: 'CHAIN-OF-THOUGHT',
    desc: 'Force step-by-step reasoning. Dramatically improves accuracy on complex tasks.',
    tip: 'Add "Let\'s think step by step" or show a worked example.',
    prompt: 'Solve this step by step:\n\nA store sells notebooks for $3 each. They offer a "buy 2, get 1 free" deal. If Sarah wants 7 notebooks, how much does she pay?\n\nLet\'s think step by step:',
    output: 'Step 1: With "buy 2, get 1 free," every group of 3 notebooks costs only 2 × $3 = $6.\n\nStep 2: Sarah wants 7 notebooks. 7 ÷ 3 = 2 groups with 1 remaining.\n\nStep 3: Cost for 2 groups: 2 × $6 = $12 (covers 6 notebooks).\n\nStep 4: 1 remaining notebook at full price: $3.\n\nStep 5: Total = $12 + $3 = $15.\n\nSarah pays $15.',
  },
  {
    name: 'Role-Play',
    tag: 'ROLE-PLAY',
    desc: 'Give the AI a persona with specific expertise and communication style.',
    tip: 'Include expertise level, style, focus areas, and what to avoid.',
    prompt: 'You are a senior security engineer. Review this code for vulnerabilities. Flag by severity (CRITICAL/HIGH/MEDIUM/LOW). Always suggest a fix.\n\napp.get("/user", (req, res) => {\n  const userId = req.query.id;\n  const query = `SELECT * FROM users WHERE id = ${userId}`;\n  db.query(query).then(user => res.json(user));\n});',
    output: 'CRITICAL: SQL Injection\n\nThe userId is concatenated directly into the SQL query. An attacker can inject arbitrary SQL.\n\nFix: Use parameterized queries.\nconst query = "SELECT * FROM users WHERE id = $1";\ndb.query(query, [userId]);\n\nMEDIUM: No input validation\nAdd type checking — userId should be a number.\n\nMEDIUM: SELECT * exposes all columns\nList specific columns to avoid leaking sensitive fields.',
  },
];

/* ── inline style constants ── */
const S = {
  root: {
    background: '#0a0a0a',
    border: '1px solid rgba(255,255,255,.06)',
    borderRadius: 16,
    padding: 24,
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    color: '#e5e5e5',
    maxWidth: 860,
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    color: '#ffffff',
    margin: 0,
    letterSpacing: '-0.02em',
  },
  badge: {
    fontSize: 10,
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: 999,
    background: 'rgba(192,132,252,.15)',
    color: '#c084fc',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  tabRow: {
    display: 'flex',
    gap: 8,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  tab: (active) => ({
    padding: '6px 14px',
    fontSize: 13,
    fontWeight: 600,
    borderRadius: 999,
    border: 'none',
    cursor: 'pointer',
    transition: 'all .15s ease',
    background: active ? '#c084fc' : 'rgba(255,255,255,.06)',
    color: active ? '#0a0a0a' : '#a3a3a3',
  }),
  infoBox: {
    background: 'rgba(255,255,255,.03)',
    border: '1px solid rgba(255,255,255,.06)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  infoTag: {
    display: 'inline-block',
    fontSize: 10,
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: 999,
    background: 'rgba(192,132,252,.12)',
    color: '#c084fc',
    letterSpacing: '0.06em',
    marginBottom: 8,
  },
  infoName: {
    fontSize: 16,
    fontWeight: 700,
    color: '#ffffff',
    margin: '0 0 6px',
  },
  infoDesc: {
    fontSize: 14,
    color: '#a3a3a3',
    lineHeight: 1.5,
    margin: 0,
  },
  tipBox: {
    marginTop: 10,
    padding: '8px 12px',
    background: 'rgba(251,146,60,.08)',
    border: '1px solid rgba(251,146,60,.15)',
    borderRadius: 8,
    fontSize: 13,
    color: '#fb923c',
    lineHeight: 1.5,
  },
  playground: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
    marginBottom: 16,
  },
  playgroundMobile: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: 16,
    marginBottom: 16,
  },
  paneLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: '#737373',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: 6,
  },
  textarea: {
    width: '100%',
    minHeight: 200,
    padding: 14,
    fontSize: 13,
    fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace",
    lineHeight: 1.6,
    color: '#e5e5e5',
    background: 'rgba(255,255,255,.03)',
    border: '1px solid rgba(255,255,255,.08)',
    borderRadius: 10,
    resize: 'vertical',
    outline: 'none',
    boxSizing: 'border-box',
  },
  outputBox: {
    width: '100%',
    minHeight: 200,
    padding: 14,
    fontSize: 13,
    fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace",
    lineHeight: 1.6,
    color: '#c084fc',
    background: 'rgba(255,255,255,.03)',
    border: '1px solid rgba(255,255,255,.08)',
    borderRadius: 10,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    boxSizing: 'border-box',
    overflow: 'auto',
  },
  cursor: {
    display: 'inline-block',
    width: 2,
    height: 14,
    background: '#c084fc',
    marginLeft: 1,
    verticalAlign: 'text-bottom',
    animation: 'promptlab-blink 0.8s step-end infinite',
  },
  runBtn: (disabled) => ({
    padding: '10px 24px',
    fontSize: 14,
    fontWeight: 700,
    color: '#ffffff',
    background: disabled ? '#78501e' : '#fb923c',
    border: 'none',
    borderRadius: 10,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all .15s ease',
    opacity: disabled ? 0.6 : 1,
  }),
  placeholder: {
    color: '#525252',
    fontStyle: 'italic',
  },
};

/* ── keyframe injection (once) ── */
const BLINK_STYLE_ID = 'promptlab-blink-keyframes';
function ensureKeyframes() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(BLINK_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = BLINK_STYLE_ID;
  style.textContent = `@keyframes promptlab-blink{0%,100%{opacity:1}50%{opacity:0}}`;
  document.head.appendChild(style);
}

export default function PromptLab({ onXP }) {
  const [currentTemplate, setCurrentTemplate] = useState(0);
  const [promptText, setPromptText] = useState(TEMPLATES[0].prompt);
  const [outputText, setOutputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const interactionCount = useRef(0);
  const xpAwarded = useRef(false);
  const typingTimer = useRef(null);

  const trackInteraction = useCallback(() => {
    interactionCount.current++;
    if (interactionCount.current >= 3 && !xpAwarded.current && onXP) {
      xpAwarded.current = true;
      onXP(15);
    }
  }, [onXP]);

  const switchTemplate = useCallback((idx) => {
    if (idx === currentTemplate) return;
    /* cancel any in-progress typing */
    if (typingTimer.current) {
      clearTimeout(typingTimer.current);
      typingTimer.current = null;
    }
    setCurrentTemplate(idx);
    setPromptText(TEMPLATES[idx].prompt);
    setOutputText('');
    setIsTyping(false);
    trackInteraction();
  }, [currentTemplate, trackInteraction]);

  const runPrompt = useCallback(() => {
    if (isTyping) return;
    ensureKeyframes();

    const fullOutput = TEMPLATES[currentTemplate].output;
    setOutputText('');
    setIsTyping(true);

    let i = 0;
    const type = () => {
      if (i < fullOutput.length) {
        setOutputText(fullOutput.slice(0, i + 1));
        i++;
        const delay = Math.floor(Math.random() * 21) + 10; /* 10-30ms */
        typingTimer.current = setTimeout(type, delay);
      } else {
        setIsTyping(false);
        typingTimer.current = null;
      }
    };
    type();
    trackInteraction();
  }, [isTyping, currentTemplate, trackInteraction]);

  const tpl = TEMPLATES[currentTemplate];

  return (
    <div style={S.root}>
      {/* header */}
      <div style={S.header}>
        <h3 style={S.title}>Prompt Lab</h3>
        <span style={S.badge}>Interactive</span>
      </div>

      {/* template tabs */}
      <div style={S.tabRow}>
        {TEMPLATES.map((t, i) => (
          <button
            key={t.tag}
            onClick={() => switchTemplate(i)}
            style={S.tab(i === currentTemplate)}
            aria-pressed={i === currentTemplate}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* info section */}
      <div style={S.infoBox}>
        <span style={S.infoTag}>{tpl.tag}</span>
        <h4 style={S.infoName}>{tpl.name}</h4>
        <p style={S.infoDesc}>{tpl.desc}</p>
        <div style={S.tipBox}>
          <strong>Tip:</strong> {tpl.tip}
        </div>
      </div>

      {/* playground: prompt + output */}
      <div style={S.playground}>
        <div>
          <div style={S.paneLabel}>Prompt</div>
          <textarea
            style={S.textarea}
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            spellCheck={false}
          />
        </div>
        <div>
          <div style={S.paneLabel}>Output</div>
          <div style={S.outputBox}>
            {outputText ? (
              <>
                {outputText}
                {isTyping && <span style={S.cursor} />}
              </>
            ) : (
              <span style={S.placeholder}>
                Click &quot;Run Prompt&quot; to see the AI response...
              </span>
            )}
          </div>
        </div>
      </div>

      {/* run button */}
      <button
        onClick={runPrompt}
        disabled={isTyping}
        style={S.runBtn(isTyping)}
      >
        {isTyping ? 'Generating...' : 'Run Prompt'}
      </button>
    </div>
  );
}
