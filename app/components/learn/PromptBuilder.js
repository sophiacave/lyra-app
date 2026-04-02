'use client';

import { useState, useCallback } from 'react';

/**
 * PromptBuilder — Interactive prompt construction tool
 *
 * Pedagogical approach: Constructivism + scaffolded learning.
 * Students build prompts by selecting role, adding context, and choosing format,
 * discovering through hands-on assembly how structured prompts produce better AI responses.
 *
 * @param {Object} props
 * @param {Function} props.onXP - Callback to award XP points
 */
export default function PromptBuilder({ onXP }) {
  const [role, setRole] = useState('');
  const [context, setContext] = useState('');
  const [format, setFormat] = useState('');
  const [copied, setCopied] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(false);

  const builtPrompt = [role, context, format].filter(Boolean).join('\n\n');
  const isComplete = role && context.trim() && format;

  const handleChange = useCallback((setter) => (e) => {
    setter(e.target.value);
  }, []);

  const checkXP = useCallback(() => {
    if (!xpAwarded && role && context.trim() && format) {
      setXpAwarded(true);
      if (onXP) onXP(15);
    }
  }, [xpAwarded, role, context, format, onXP]);

  const handleRoleChange = useCallback((e) => {
    setRole(e.target.value);
    setTimeout(() => checkXP(), 0);
  }, [checkXP]);

  const handleContextChange = useCallback((e) => {
    setContext(e.target.value);
    setTimeout(() => checkXP(), 0);
  }, [checkXP]);

  const handleFormatChange = useCallback((e) => {
    setFormat(e.target.value);
    setTimeout(() => checkXP(), 0);
  }, [checkXP]);

  const handleCopy = useCallback(async () => {
    if (!builtPrompt) return;
    try {
      await navigator.clipboard.writeText(builtPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = builtPrompt;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [builtPrompt]);

  const selectStyle = {
    width: '100%',
    padding: '10px 12px',
    backgroundColor: '#0a0a0a',
    color: '#e5e5e5',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '8px',
    fontSize: '0.95rem',
    outline: 'none',
    appearance: 'none',
    WebkitAppearance: 'none',
    cursor: 'pointer',
  };

  const textareaStyle = {
    width: '100%',
    padding: '10px 12px',
    backgroundColor: '#0a0a0a',
    color: '#e5e5e5',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '8px',
    fontSize: '0.95rem',
    outline: 'none',
    resize: 'vertical',
    minHeight: '80px',
    fontFamily: 'inherit',
  };

  const previewStyle = {
    width: '100%',
    padding: '16px',
    backgroundColor: '#111111',
    color: builtPrompt ? '#e5e5e5' : 'rgba(255, 255, 255, 0.35)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    lineHeight: '1.6',
    minHeight: '100px',
    boxSizing: 'border-box',
  };

  const copyButtonStyle = {
    padding: '10px 20px',
    backgroundColor: copied ? '#22c55e' : '#fb923c',
    color: copied ? '#fff' : '#000',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: 700,
    cursor: isComplete ? 'pointer' : 'not-allowed',
    opacity: isComplete ? 1 : 0.5,
    transition: 'background-color 0.2s ease',
    alignSelf: 'flex-start',
  };

  const labelStyle = {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '0.8rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '4px',
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      padding: '20px',
      backgroundColor: '#0a0a0a',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.06)',
    }}>
      <div>
        <div style={labelStyle}>Role</div>
        <select value={role} onChange={handleRoleChange} style={selectStyle}>
          <option value="">Choose a role...</option>
          <option value="You are an experienced marketing strategist.">
            Marketing Strategist
          </option>
          <option value="You are a patient coding tutor who explains concepts simply.">
            Coding Tutor
          </option>
          <option value="You are a professional editor focused on clarity and concision.">
            Professional Editor
          </option>
          <option value="You are a creative brainstorming partner who thinks outside the box.">
            Creative Brainstormer
          </option>
        </select>
      </div>

      <div>
        <div style={labelStyle}>Context</div>
        <textarea
          value={context}
          onChange={handleContextChange}
          placeholder="Add your specific situation... (e.g., 'I run a small bakery with a $200/month marketing budget')"
          style={textareaStyle}
        />
      </div>

      <div>
        <div style={labelStyle}>Format</div>
        <select value={format} onChange={handleFormatChange} style={selectStyle}>
          <option value="">Choose a format...</option>
          <option value="Give me a numbered list of 5 ideas with one-sentence explanations.">
            Numbered List
          </option>
          <option value="Write a 3-paragraph response with an introduction, body, and conclusion.">
            3-Paragraph Response
          </option>
          <option value="Create a table comparing pros and cons.">
            Pros &amp; Cons Table
          </option>
          <option value="Respond in bullet points, keeping each point under 20 words.">
            Concise Bullet Points
          </option>
        </select>
      </div>

      <div>
        <div style={labelStyle}>Built Prompt</div>
        <div style={previewStyle}>
          {builtPrompt || 'Select a role, add context, and choose a format to build your prompt...'}
        </div>
      </div>

      <button
        onClick={handleCopy}
        disabled={!isComplete}
        style={copyButtonStyle}
      >
        {copied ? 'Copied! Now paste it into Claude \u2192' : 'Copy Prompt to Clipboard'}
      </button>
    </div>
  );
}
