'use client';
import { useState } from 'react';

const INSTALL_CMD = `curl -fsSL https://likeone.ai/install.sh | bash`;

const STEPS = [
  { emoji: '📁', label: 'Creates ~/.fractal_brain/ directory structure' },
  { emoji: '🧠', label: 'Downloads brain tools (orchestrator, health monitor, bootstrap)' },
  { emoji: '⚡', label: 'Installs brain CLI + sets up 15-min cron sync' },
  { emoji: '🔑', label: 'Creates .env template — fill from the keys panel below' },
  { emoji: '🤝', label: 'Connects Computer 02 to the shared Fractal Brain' },
];

export default function TempInstaller() {
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [pin, setPin] = useState('');
  const [keys, setKeys] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);

  async function loadKeys() {
    if (pin.length < 4) return;
    setLoading(true);
    try {
      const r = await fetch(`/api/env-config?pin=${pin}`);
      if (r.ok) { const d = await r.json(); setKeys(d); }
      else setKeys({ error: 'Wrong PIN' });
    } catch { setKeys({ error: 'Could not reach brain' }); }
    setLoading(false);
  }

  function copyEnv() {
    if (!keys?.env) return;
    navigator.clipboard.writeText(keys.env);
    setCopiedEnv(true); setTimeout(() => setCopiedEnv(false), 2000);
  }

  const G = 'linear-gradient(135deg,#e84393,#6c5ce7,#00cec9)';

  return (
    <div style={{minHeight:'100vh',background:'#0a0a0f',color:'#e0e0e0',
      fontFamily:'system-ui,-apple-system,sans-serif',
      display:'flex',flexDirection:'column',alignItems:'center',
      justifyContent:'center',padding:'40px 24px'}}>
      <div style={{maxWidth:'580px',width:'100%'}}>

        <div style={{textAlign:'center',marginBottom:'36px'}}>
          <div style={{background:G,WebkitBackgroundClip:'text',
            WebkitTextFillColor:'transparent',fontSize:'36px',
            fontWeight:'900',letterSpacing:'-1px'}}>◈ FRACTAL BRAIN</div>
          <div style={{color:'#555',fontSize:'13px',marginTop:'6px'}}>
            Computer 02 Setup · Like One Intelligence Layer
          </div>
        </div>

        {/* Step 1 - Install */}
        <div style={{background:'#12121a',border:'1px solid #2a1a3e',borderRadius:'16px',padding:'28px',marginBottom:'16px'}}>
          <div style={{color:'#e84393',fontSize:'11px',fontWeight:'700',letterSpacing:'1px',marginBottom:'14px'}}>① ONE-CLICK INSTALL — run in Terminal</div>
          <div style={{background:'#06060e',border:'1px solid #3a1a5e',borderRadius:'10px',padding:'14px 18px',display:'flex',alignItems:'center',gap:'12px',marginBottom:'20px'}}>
            <code style={{flex:1,fontSize:'13px',color:'#a29bfe',fontFamily:'monospace'}}>{INSTALL_CMD}</code>
            <button onClick={() => { navigator.clipboard.writeText(INSTALL_CMD); setCopiedCmd(true); setTimeout(()=>setCopiedCmd(false),2000); }}
              style={{background:copiedCmd?'#00cec920':'#e8439320',border:`1px solid ${copiedCmd?'#00cec9':'#e84393'}`,color:copiedCmd?'#00cec9':'#e84393',borderRadius:'6px',padding:'8px 14px',cursor:'pointer',fontSize:'11px',fontWeight:'700',flexShrink:0}}>
              {copiedCmd?'✓ COPIED':'COPY'}
            </button>
          </div>
          {STEPS.map((s,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:'12px',padding:'9px 0',borderBottom:i<STEPS.length-1?'1px solid #1a1a2e':'none'}}>
              <span style={{fontSize:'17px'}}>{s.emoji}</span>
              <span style={{fontSize:'13px',color:'#ccc'}}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Step 2 - Keys */}
        <div style={{background:'#0d0d18',border:'1px solid #1a1a2e',borderRadius:'14px',padding:'24px',marginBottom:'16px'}}>
          <div style={{color:'#6c5ce7',fontSize:'11px',fontWeight:'700',letterSpacing:'1px',marginBottom:'14px'}}>② GET YOUR .ENV KEYS — enter PIN to reveal</div>
          <div style={{display:'flex',gap:'10px',marginBottom:'14px'}}>
            <input type="password" placeholder="Enter PIN" maxLength={6} value={pin} onChange={e=>setPin(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&loadKeys()}
              style={{flex:1,background:'#06060e',border:'1px solid #2a2a4e',borderRadius:'8px',padding:'10px 14px',color:'#fff',fontSize:'14px',outline:'none',fontFamily:'monospace',letterSpacing:'4px'}}/>
            <button onClick={loadKeys} disabled={loading}
              style={{background:'#6c5ce720',border:'1px solid #6c5ce7',color:'#6c5ce7',borderRadius:'8px',padding:'10px 20px',cursor:'pointer',fontSize:'12px',fontWeight:'700'}}>
              {loading?'..':'REVEAL'}
            </button>
          </div>
          {keys?.error && <div style={{color:'#e84393',fontSize:'13px',padding:'8px'}}>{keys.error}</div>}
          {keys?.env && (
            <div>
              <pre style={{background:'#06060e',border:'1px solid #1a2a1a',borderRadius:'8px',padding:'14px',fontSize:'11px',color:'#55efc4',fontFamily:'monospace',lineHeight:1.8,overflowX:'auto',marginBottom:'10px'}}>{keys.env}</pre>
              <button onClick={copyEnv}
                style={{background:copiedEnv?'#00cec920':'#55efc420',border:`1px solid ${copiedEnv?'#00cec9':'#55efc4'}`,color:copiedEnv?'#00cec9':'#55efc4',borderRadius:'6px',padding:'8px 16px',cursor:'pointer',fontSize:'11px',fontWeight:'700'}}>
                {copiedEnv?'✓ COPIED':'COPY .ENV'}
              </button>
              <div style={{color:'#444',fontSize:'11px',marginTop:'8px'}}>Paste into: ~/.fractal_brain/.env</div>
            </div>
          )}
        </div>

        {/* Sync note */}
        <div style={{background:'#0d1018',border:'1px solid #1a1a2e',borderRadius:'12px',padding:'18px'}}>
          <div style={{color:'#00cec9',fontSize:'11px',fontWeight:'700',letterSpacing:'1px',marginBottom:'8px'}}>◉ CONTEXT SYNC</div>
          <div style={{fontSize:'13px',color:'#666',lineHeight:1.8}}>
            Both computers share one <strong style={{color:'#ccc'}}>Fractal Brain</strong>. Every session writes its state to Supabase.
            Start a new chat on either computer — full context loads automatically. <strong style={{color:'#a29bfe'}}>Nothing is ever lost.</strong>
          </div>
        </div>

        <div style={{textAlign:'center',marginTop:'24px',color:'#2a2a3a',fontSize:'11px'}}>
          UMX Gestalt · Like One · likeone.ai/_temp
        </div>
      </div>
    </div>
  );
}
