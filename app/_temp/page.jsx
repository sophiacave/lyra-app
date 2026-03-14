'use client';
import { useState } from 'react';

const INSTALL_CMD = `curl -fsSL https://raw.githubusercontent.com/sophiacave/lyra-app/main/public/install.sh | bash`;

const STEPS = [
  { emoji: '📁', label: 'Creates ~/.fractal_brain/ directory structure' },
  { emoji: '🧠', label: 'Downloads brain tools (orchestrator, health monitor, bootstrap)' },
  { emoji: '⚡', label: 'Installs brain CLI command + 15-min cron sync' },
  { emoji: '🔑', label: 'Configures .env with your Supabase brain credentials' },
  { emoji: '🤝', label: 'Connects to shared brain — both computers in sync' },
];

export default function TempInstaller() {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(INSTALL_CMD);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0f', color: '#e0e0e0',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '40px 24px',
    }}>
      <div style={{ maxWidth: '600px', width: '100%' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            fontSize: '48px', marginBottom: '12px',
            background: 'linear-gradient(135deg, #e84393, #6c5ce7, #00cec9)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            fontWeight: '900', letterSpacing: '-2px',
          }}>◈ FRACTAL BRAIN</div>
          <div style={{ color: '#555', fontSize: '14px' }}>
            Computer 02 Setup · Like One Intelligence Layer
          </div>
        </div>

        {/* Main card */}
        <div style={{
          background: '#12121a', border: '1px solid #2a1a3e',
          borderRadius: '16px', padding: '32px', marginBottom: '20px',
        }}>
          <div style={{ color: '#e84393', fontSize: '12px', fontWeight: '700',
            letterSpacing: '1px', marginBottom: '16px' }}>
            ONE-CLICK INSTALL
          </div>
          <div style={{ fontSize: '16px', color: '#fff', marginBottom: '20px', lineHeight: 1.5 }}>
            Install the Fractal Brain on this computer to connect it to the shared intelligence layer.
            Both computers will share full context — no chat ever gets cut off.
          </div>

          {/* Command box */}
          <div style={{
            background: '#06060e', border: '1px solid #3a1a5e',
            borderRadius: '10px', padding: '16px 20px',
            display: 'flex', alignItems: 'center', gap: '12px',
            marginBottom: '16px',
          }}>
            <code style={{ flex: 1, fontSize: '13px', color: '#a29bfe', wordBreak: 'break-all' }}>
              {INSTALL_CMD}
            </code>
            <button onClick={copy} style={{
              background: copied ? '#00cec920' : '#e8439320',
              border: `1px solid ${copied ? '#00cec9' : '#e84393'}`,
              color: copied ? '#00cec9' : '#e84393',
              borderRadius: '6px', padding: '8px 16px',
              cursor: 'pointer', fontSize: '12px', fontWeight: '700',
              flexShrink: 0, transition: 'all 0.2s',
            }}>
              {copied ? '✓ COPIED' : 'COPY'}
            </button>
          </div>

          <div style={{ color: '#444', fontSize: '11px', marginBottom: '24px' }}>
            Run in Terminal on this computer. Takes ~30 seconds.
          </div>

          {/* Steps */}
          <div style={{ color: '#6c5ce7', fontSize: '11px', fontWeight: '700',
            letterSpacing: '1px', marginBottom: '12px' }}>WHAT GETS INSTALLED</div>
          {STEPS.map((s, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '10px 0', borderBottom: i < STEPS.length - 1 ? '1px solid #1a1a2e' : 'none',
            }}>
              <span style={{ fontSize: '20px' }}>{s.emoji}</span>
              <span style={{ fontSize: '13px', color: '#ccc' }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Context sync card */}
        <div style={{
          background: '#0d0d18', border: '1px solid #1a2a1a',
          borderRadius: '12px', padding: '20px',
        }}>
          <div style={{ color: '#00cec9', fontSize: '11px', fontWeight: '700',
            letterSpacing: '1px', marginBottom: '10px' }}>
            ◉ HOW CONTEXT SYNC WORKS
          </div>
          <div style={{ fontSize: '13px', color: '#888', lineHeight: 1.7 }}>
            Every conversation writes its state to the shared <strong style={{ color: '#ccc' }}>Fractal Brain</strong> (Supabase).
            When a chat gets too long, start a fresh one — it auto-loads full context from the brain.
            Computer 01 and Computer 02 share the same brain, so work can move between them instantly.
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px', color: '#333', fontSize: '11px' }}>
          UMX Gestalt · Like One · likeone.ai
        </div>
      </div>
    </div>
  );
}
