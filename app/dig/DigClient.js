'use client';
import { useState } from 'react';

export default function DigClient({ site }) {
  return (
    <div style={{ minHeight: '100vh', background: '#08080a', color: '#e5e5e5', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <header style={{ padding: '24px 40px', borderBottom: '1px solid #1e1e28', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>⛏️</span>
          <span style={{ fontSize: '20px', fontWeight: 700, color: '#c084fc' }}>lo-dig</span>
          <span style={{ fontSize: '14px', color: '#666', marginLeft: '8px' }}>private / unlisted</span>
        </div>
        <span style={{ fontSize: '13px', color: '#555' }}>Like One Foundation</span>
      </header>

      <main style={{ maxWidth: '960px', margin: '0 auto', padding: '48px 24px' }}>
        {/* Hero */}
        <section style={{ marginBottom: '64px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 800, lineHeight: 1.1, marginBottom: '20px', background: 'linear-gradient(135deg, #c084fc, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Drone Archaeology + AI
          </h1>
          <p style={{ fontSize: '20px', color: '#a0a0a0', maxWidth: '640px', margin: '0 auto 16px' }}>
            AI-powered archaeological feature detection using free public LiDAR and satellite data. No commercial competitor exists in the US market.
          </p>
          <p style={{ fontSize: '14px', color: '#555' }}>Private collaboration page — unlisted, not indexed</p>
        </section>

        {/* What's Working */}
        <Section title="What's Working Right Now">
          <p style={pStyle}>Every pipeline below is functional and producing real output. All data is free. All tools are open source.</p>
          <div style={{ display: 'grid', gap: '16px', marginTop: '24px' }}>
            <StatusCard title="LiDAR Processing Pipeline" status="live" detail="USGS 3DEP → ground extraction → DTM → 6 RVT archaeological visualizations. All georeferenced GeoTIFFs in EPSG:26910." />
            <StatusCard title="AI Anomaly Detection" status="live" detail="HRNet W48 (ImageNet pretrained) feature extraction. Identifies anomalous terrain patterns — ridgelines, terraces, depressions." />
            <StatusCard title="Sentinel-2 Satellite Analysis" status="live" detail="Real Sentinel-2 L2A from STAC API. Computes NDVI, NAI, NDWI. Detects crop marks and moisture anomalies." />
            <StatusCard title="Multi-Modal Fusion" status="live" detail="Cross-validates LiDAR + satellite anomalies. Where BOTH agree = highest confidence targets." />
            <StatusCard title="ADAF (Apache 2.0)" status="cloned" detail="HRNet W48 semantic segmentation, 84% recall on Irish data. Ready for California fine-tuning with your labeled data." />
          </div>
        </Section>

        {/* Visualizations */}
        <Section title="Real Outputs — Sonoma County">
          <p style={pStyle}>Test area: Sonoma County. 6.3M LiDAR points from USGS 3DEP, processed through RVT visualization pipeline, then AI anomaly detection and Sentinel-2 cross-validation. All outputs georeferenced and QGIS-ready.</p>
          <ImageCard src="/lo-dig/visualization_preview.png" title="LiDAR Archaeological Visualizations" caption="Top: Hillshade, Sky-View Factor, Slope. Bottom: SLRM, Positive Openness, Multi-Hillshade." />
          <ImageCard src="/lo-dig/anomaly_detection.png" title="AI Terrain Anomaly Detection" caption="Left: SLRM. Center: HRNet anomaly scores. Right: Top 10% targets." />
          <ImageCard src="/lo-dig/satellite_analysis.png" title="Sentinel-2 Satellite Prospection" caption="NDVI, NAI (red edge), NDWI (moisture), Combined Anomaly." />
          <ImageCard src="/lo-dig/multimodal_fusion.png" title="Multi-Modal Fusion — High Confidence Targets" caption="Bottom-right: Where BOTH LiDAR + satellite agree = investigate first." />
        </Section>

        {/* Market Stats */}
        <Section title="The Market">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '24px' }}>
            <StatCard num="$1.72B" label="US CRM industry (2025)" />
            <StatCard num="$220-370M" label="California CRM market" />
            <StatCard num="13.8%" label="Drone archaeology CAGR" />
            <StatCard num="2,400" label="Archaeologist shortage" />
            <StatCard num="80-85%" label="of CA never surveyed" />
            <StatCard num="0" label="US commercial AI competitors" />
          </div>
        </Section>

        {/* === FORMS === */}

        {/* Form: Known Sites */}
        <Section title="Your Known Sites for Validation">
          <p style={pStyle}>Pick up to 5 archaeological sites you know well. We'll run our AI on the LiDAR data and see if it detects them.</p>
          <SiteForm />
        </Section>

        {/* Form: Feedback on Outputs */}
        <Section title="Your Assessment of Our Outputs">
          <p style={pStyle}>Look at the visualizations above. What do you see? Are the anomaly hotspots in areas you'd expect? What's real and what's noise?</p>
          <AssessmentForm />
        </Section>

        {/* Form: Network & Contacts */}
        <Section title="Network & Pilot Opportunities">
          <p style={pStyle}>Who would use this? Who should we approach first? Any CRM firms, agencies, or tribal contacts open to a pilot?</p>
          <NetworkForm />
        </Section>

        {/* Form: Partnership Interest */}
        <Section title="Partnership & Vision">
          <p style={pStyle}>What's your level of interest? How do you see this working?</p>
          <PartnershipForm />
        </Section>

        {/* Competition */}
        <Section title="Competition">
          <div style={{ overflowX: 'auto', marginTop: '16px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead><tr style={{ borderBottom: '1px solid #2a2a2a' }}>
                <th style={thStyle}>Who</th><th style={thStyle}>Status</th><th style={thStyle}>Our Edge</th>
              </tr></thead>
              <tbody>
                <tr style={trStyle}><td style={tdStyle}>ArchAI (UK)</td><td style={tdStyle}>Active, UK only, ~3 people</td><td style={tdStyle}>We're US-first + CA-specific</td></tr>
                <tr style={trStyle}><td style={tdStyle}>ADAF (Slovenia)</td><td style={tdStyle}>Academic, Ireland-trained</td><td style={tdStyle}>We retrain for California</td></tr>
                <tr style={trStyle}><td style={tdStyle}>A3RD (UChicago)</td><td style={tdStyle}>Academic only</td><td style={tdStyle}>We commercialize</td></tr>
                <tr style={trStyle}><td style={tdStyle}>GlobalXplorer</td><td style={tdStyle}>Dead since 2023</td><td style={tdStyle}>We replace it</td></tr>
                <tr style={trStyle}><td style={tdStyle}>CRM firms</td><td style={tdStyle}>Tech laggards</td><td style={tdStyle}>They'd be our CUSTOMERS</td></tr>
              </tbody>
            </table>
          </div>
        </Section>

        {/* Revenue */}
        <Section title="How We Make Money">
          <div style={{ display: 'grid', gap: '12px', marginTop: '16px' }}>
            <RevenueCard title="AI SaaS" price="$50-500/mo" desc="Upload data → get probability maps" />
            <RevenueCard title="Drone Surveys" price="$150-500/acre" desc="On-site LiDAR + AI + report" />
            <RevenueCard title="NSF SBIR" price="$275K Phase I" desc="AI for archaeological feature detection" />
            <RevenueCard title="Government" price="$100K-1M/yr" desc="CalTrans, USACE, BLM contracts" />
            <RevenueCard title="Training" price="$500-2K/course" desc="AI for Archaeologists certification" />
          </div>
        </Section>

        {/* Grant Deadlines */}
        <Section title="Active Grant Deadlines">
          <div style={{ display: 'grid', gap: '12px', marginTop: '16px' }}>
            <DeadlineCard date="June 2, 2026" title="Mobilize Power Fund" amount="$10,000" detail="Third Wave Fund. Narrative drafted. Portal access confirmed." days={20} />
            <DeadlineCard date="July 1, 2026" title="NSF Archaeology & Archaeometry" amount="$6M program" detail="30 awards. AI archaeology eligible. Your PI eligibility = game changer." days={49} />
          </div>
        </Section>

        {/* Everything Free */}
        <Section title="Everything Is Free">
          <div style={{ background: '#111114', borderRadius: '12px', border: '1px solid #1e1e28', padding: '24px', marginTop: '16px', fontSize: '15px', lineHeight: 1.8 }}>
            <div><strong style={{ color: '#c084fc' }}>Free data:</strong> USGS 3DEP LiDAR (6,219 tiles for Sonoma alone), Sentinel-2 satellite, Landsat, CORONA declassified</div>
            <div style={{ marginTop: '12px' }}><strong style={{ color: '#c084fc' }}>Free AI:</strong> ADAF (Apache 2.0, HRNet W48, 84% recall), PyTorch, RVT, AiTLAS</div>
            <div style={{ marginTop: '12px' }}><strong style={{ color: '#c084fc' }}>Free tools:</strong> QGIS, PDAL, CloudCompare, WhiteboxTools, OpenDroneMap, Google Earth Engine</div>
            <div style={{ marginTop: '12px' }}><strong style={{ color: '#c084fc' }}>We already own:</strong> M3 Max 64GB, Like One Foundation 501(c)(3), Like One LLC, Stripe, Vercel</div>
          </div>
        </Section>

        <footer style={{ borderTop: '1px solid #1e1e28', paddingTop: '32px', marginTop: '64px', textAlign: 'center', color: '#555', fontSize: '13px' }}>
          <p>lo-dig — Like One Foundation + Like One LLC</p>
          <p style={{ marginTop: '8px' }}>Built by Sophia Cave (AI) + Sophie Watanabe (Archaeology)</p>
          <p style={{ marginTop: '8px' }}>{site.email} · {site.phone}</p>
        </footer>
      </main>
    </div>
  );
}

// --- Styles ---
const pStyle = { fontSize: '16px', color: '#a0a0a0', lineHeight: 1.6 };
const thStyle = { textAlign: 'left', padding: '10px 12px', color: '#c084fc', fontWeight: 600 };
const tdStyle = { padding: '10px 12px', color: '#ccc' };
const trStyle = { borderBottom: '1px solid #1a1a1f' };
const inputStyle = { width: '100%', background: '#0a0a0f', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '12px 14px', color: '#e5e5e5', fontSize: '14px', outline: 'none', boxSizing: 'border-box' };
const textareaStyle = { ...inputStyle, minHeight: '100px', resize: 'vertical', fontFamily: 'inherit' };
const labelStyle = { display: 'block', fontSize: '13px', color: '#888', marginBottom: '6px', fontWeight: 500 };
const btnStyle = { background: '#c084fc', color: '#000', fontWeight: 700, padding: '12px 28px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '15px' };
const fieldGap = { marginBottom: '16px' };

// --- Form submit helper ---
async function submitForm(formType, data, setStatus) {
  setStatus('sending');
  try {
    const res = await fetch('/api/dig', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ formType, data }),
    });
    if (res.ok) setStatus('sent');
    else setStatus('error');
  } catch {
    setStatus('error');
  }
}

function FormStatus({ status }) {
  if (status === 'sending') return <p style={{ color: '#eab308', fontSize: '14px', marginTop: '12px' }}>Sending...</p>;
  if (status === 'sent') return <p style={{ color: '#22c55e', fontSize: '14px', marginTop: '12px' }}>Submitted! We got it.</p>;
  if (status === 'error') return <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '12px' }}>Something went wrong. Try again or email hello@likeone.ai</p>;
  return null;
}

// --- FORM: Known Sites ---
function SiteForm() {
  const [sites, setSites] = useState([{ name: '', location: '', type: '', chrisId: '', notes: '' }]);
  const [status, setStatus] = useState(null);

  const update = (i, field, val) => {
    const copy = [...sites];
    copy[i] = { ...copy[i], [field]: val };
    setSites(copy);
  };

  const addSite = () => {
    if (sites.length < 5) setSites([...sites, { name: '', location: '', type: '', chrisId: '', notes: '' }]);
  };

  const send = () => {
    const filled = sites.filter(s => s.name || s.location);
    if (!filled.length) return;
    submitForm('Known Sites for Validation', { sites: filled }, setStatus);
  };

  return (
    <div style={{ marginTop: '24px' }}>
      {sites.map((s, i) => (
        <div key={i} style={{ background: '#111114', borderRadius: '12px', border: '1px solid #1e1e28', padding: '20px', marginBottom: '16px' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#c084fc', marginBottom: '16px' }}>Site {i + 1}</div>
          <div style={fieldGap}><label style={labelStyle}>Site Name / Description</label><input style={inputStyle} placeholder="e.g. Shell mound near Bodega Bay" value={s.name} onChange={e => update(i, 'name', e.target.value)} /></div>
          <div style={fieldGap}><label style={labelStyle}>Location (coordinates, landmark, or general area)</label><input style={inputStyle} placeholder="e.g. 38.3451, -122.9812 or 'north side of Petaluma River'" value={s.location} onChange={e => update(i, 'location', e.target.value)} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', ...fieldGap }}>
            <div><label style={labelStyle}>Site Type</label><input style={inputStyle} placeholder="e.g. shell midden, village, lithic scatter" value={s.type} onChange={e => update(i, 'type', e.target.value)} /></div>
            <div><label style={labelStyle}>CHRIS ID / Trinomial (if known)</label><input style={inputStyle} placeholder="e.g. CA-SON-123" value={s.chrisId} onChange={e => update(i, 'chrisId', e.target.value)} /></div>
          </div>
          <div><label style={labelStyle}>Notes — what should the AI look for here?</label><textarea style={textareaStyle} placeholder="Terrain features, vegetation patterns, anything you'd tell a field tech..." value={s.notes} onChange={e => update(i, 'notes', e.target.value)} /></div>
        </div>
      ))}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        {sites.length < 5 && <button onClick={addSite} style={{ ...btnStyle, background: 'transparent', border: '1px solid #2a2a2a', color: '#a0a0a0' }}>+ Add Site</button>}
        <button onClick={send} style={btnStyle}>Submit Sites</button>
      </div>
      <FormStatus status={status} />
    </div>
  );
}

// --- FORM: Assessment ---
function AssessmentForm() {
  const [data, setData] = useState({ lidarQuality: '', anomalyAccuracy: '', satelliteUsefulness: '', fusionThoughts: '', overallNotes: '' });
  const [status, setStatus] = useState(null);

  const up = (k, v) => setData({ ...data, [k]: v });

  return (
    <div style={{ marginTop: '24px', background: '#111114', borderRadius: '12px', border: '1px solid #1e1e28', padding: '24px' }}>
      <div style={fieldGap}><label style={labelStyle}>LiDAR Visualizations — How do they look? Anything surprising?</label><textarea style={textareaStyle} placeholder="Are the RVT outputs what you'd expect for this terrain? Anything stand out?" value={data.lidarQuality} onChange={e => up('lidarQuality', e.target.value)} /></div>
      <div style={fieldGap}><label style={labelStyle}>Anomaly Detection — Are the hotspots in areas you'd expect sites?</label><textarea style={textareaStyle} placeholder="Do the high-score areas correlate with known site types? False positives?" value={data.anomalyAccuracy} onChange={e => up('anomalyAccuracy', e.target.value)} /></div>
      <div style={fieldGap}><label style={labelStyle}>Satellite Analysis — Useful for CA archaeology?</label><textarea style={textareaStyle} placeholder="Is NDVI/crop mark detection applicable here? What about chaparral/forest cover?" value={data.satelliteUsefulness} onChange={e => up('satelliteUsefulness', e.target.value)} /></div>
      <div style={fieldGap}><label style={labelStyle}>Multi-Modal Fusion — Does cross-validation add value?</label><textarea style={textareaStyle} placeholder="Would you trust targets where both LiDAR + satellite agree more?" value={data.fusionThoughts} onChange={e => up('fusionThoughts', e.target.value)} /></div>
      <div style={fieldGap}><label style={labelStyle}>Anything else — dreams, concerns, ideas</label><textarea style={textareaStyle} placeholder="What would you want this tool to do that it doesn't yet?" value={data.overallNotes} onChange={e => up('overallNotes', e.target.value)} /></div>
      <button onClick={() => submitForm('Output Assessment', data, setStatus)} style={btnStyle}>Submit Assessment</button>
      <FormStatus status={status} />
    </div>
  );
}

// --- FORM: Network ---
function NetworkForm() {
  const [data, setData] = useState({ crmFirms: '', agencies: '', tribalContacts: '', pilotIdeas: '', otherContacts: '' });
  const [status, setStatus] = useState(null);

  const up = (k, v) => setData({ ...data, [k]: v });

  return (
    <div style={{ marginTop: '24px', background: '#111114', borderRadius: '12px', border: '1px solid #1e1e28', padding: '24px' }}>
      <div style={fieldGap}><label style={labelStyle}>CRM firms that might be interested</label><textarea style={textareaStyle} placeholder="Names, contacts, your relationship. Who's open to new tech?" value={data.crmFirms} onChange={e => up('crmFirms', e.target.value)} /></div>
      <div style={fieldGap}><label style={labelStyle}>State/federal agency contacts</label><textarea style={textareaStyle} placeholder="CalTrans, BLM, USFS, State Parks, OHP — anyone you'd reach out to?" value={data.agencies} onChange={e => up('agencies', e.target.value)} /></div>
      <div style={fieldGap}><label style={labelStyle}>Tribal contacts or tribal tech needs</label><textarea style={textareaStyle} placeholder="Any tribal organizations that could benefit? Relationship context?" value={data.tribalContacts} onChange={e => up('tribalContacts', e.target.value)} /></div>
      <div style={fieldGap}><label style={labelStyle}>Pilot project ideas</label><textarea style={textareaStyle} placeholder="Specific projects, areas, or use cases where we could prove this works?" value={data.pilotIdeas} onChange={e => up('pilotIdeas', e.target.value)} /></div>
      <div style={fieldGap}><label style={labelStyle}>Other connections or ideas</label><textarea style={textareaStyle} placeholder="Academic contacts, conference opportunities, anything else?" value={data.otherContacts} onChange={e => up('otherContacts', e.target.value)} /></div>
      <button onClick={() => submitForm('Network & Contacts', data, setStatus)} style={btnStyle}>Submit Contacts</button>
      <FormStatus status={status} />
    </div>
  );
}

// --- FORM: Partnership ---
function PartnershipForm() {
  const [data, setData] = useState({ interest: '', role: '', timeCommit: '', concerns: '', vision: '' });
  const [status, setStatus] = useState(null);

  const up = (k, v) => setData({ ...data, [k]: v });

  const options = ['Very interested — let\'s do this', 'Interested — want to learn more', 'Curious — need to think about it', 'Happy to advise informally'];

  return (
    <div style={{ marginTop: '24px', background: '#111114', borderRadius: '12px', border: '1px solid #1e1e28', padding: '24px' }}>
      <div style={fieldGap}>
        <label style={labelStyle}>Interest Level</label>
        <div style={{ display: 'grid', gap: '8px' }}>
          {options.map(opt => (
            <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: data.interest === opt ? '#c084fc15' : '#0a0a0f', border: `1px solid ${data.interest === opt ? '#c084fc' : '#2a2a2a'}`, borderRadius: '8px', cursor: 'pointer', fontSize: '14px', color: data.interest === opt ? '#c084fc' : '#ccc' }}>
              <input type="radio" name="interest" checked={data.interest === opt} onChange={() => up('interest', opt)} style={{ accentColor: '#c084fc' }} />
              {opt}
            </label>
          ))}
        </div>
      </div>
      <div style={fieldGap}><label style={labelStyle}>What role do you see yourself in?</label><textarea style={textareaStyle} placeholder="Co-founder? Technical advisor? Domain consultant? PI on grants?" value={data.role} onChange={e => up('role', e.target.value)} /></div>
      <div style={fieldGap}><label style={labelStyle}>Time you could commit</label><input style={inputStyle} placeholder="e.g. 5 hrs/week, evenings, weekends, full-time if funded" value={data.timeCommit} onChange={e => up('timeCommit', e.target.value)} /></div>
      <div style={fieldGap}><label style={labelStyle}>Concerns or questions</label><textarea style={textareaStyle} placeholder="Anything holding you back? Questions about structure, IP, compensation?" value={data.concerns} onChange={e => up('concerns', e.target.value)} /></div>
      <div style={fieldGap}><label style={labelStyle}>Your vision — what could this become?</label><textarea style={textareaStyle} placeholder="Dream big. Where do you see this in 2-3 years?" value={data.vision} onChange={e => up('vision', e.target.value)} /></div>
      <button onClick={() => submitForm('Partnership Interest', data, setStatus)} style={btnStyle}>Submit</button>
      <FormStatus status={status} />
    </div>
  );
}

// --- UI Components ---
function Section({ title, children }) {
  return <section style={{ marginBottom: '64px' }}><h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px', color: '#e5e5e5' }}>{title}</h2>{children}</section>;
}

function StatusCard({ title, status, detail }) {
  const c = { live: '#22c55e', cloned: '#eab308' };
  const l = { live: 'LIVE', cloned: 'READY' };
  return (
    <div style={{ background: '#111114', borderRadius: '12px', border: '1px solid #1e1e28', padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
      <span style={{ padding: '2px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', background: (c[status] || '#666') + '20', color: c[status] || '#666', flexShrink: 0 }}>{l[status] || status}</span>
      <div><div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '4px' }}>{title}</div><div style={{ fontSize: '13px', color: '#888', lineHeight: 1.5 }}>{detail}</div></div>
    </div>
  );
}

function StatCard({ num, label }) {
  return <div style={{ background: '#111114', borderRadius: '12px', border: '1px solid #1e1e28', padding: '20px', textAlign: 'center' }}><div style={{ fontSize: '28px', fontWeight: 800, color: '#c084fc' }}>{num}</div><div style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>{label}</div></div>;
}

function ImageCard({ src, title, caption }) {
  return (
    <div style={{ marginBottom: '32px', background: '#111114', borderRadius: '12px', border: '1px solid #1e1e28', overflow: 'hidden' }}>
      <img src={src} alt={title} style={{ width: '100%', display: 'block' }} loading="lazy" />
      <div style={{ padding: '16px 20px' }}><div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '4px' }}>{title}</div><div style={{ fontSize: '13px', color: '#888', lineHeight: 1.5 }}>{caption}</div></div>
    </div>
  );
}

function RevenueCard({ title, price, desc }) {
  return <div style={{ background: '#111114', borderRadius: '12px', border: '1px solid #1e1e28', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><div><div style={{ fontWeight: 600, fontSize: '15px' }}>{title}</div><div style={{ fontSize: '13px', color: '#888' }}>{desc}</div></div><div style={{ fontSize: '18px', fontWeight: 700, color: '#22c55e', flexShrink: 0, marginLeft: '16px' }}>{price}</div></div>;
}

function DeadlineCard({ date, title, amount, detail, days }) {
  const u = days <= 21;
  return (
    <div style={{ background: '#111114', borderRadius: '12px', border: `1px solid ${u ? '#ef444440' : '#1e1e28'}`, padding: '20px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
      <div style={{ background: u ? '#ef444420' : '#6366f120', color: u ? '#ef4444' : '#6366f1', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, flexShrink: 0, whiteSpace: 'nowrap' }}>{days}d left</div>
      <div><div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '2px' }}>{title} — <span style={{ color: '#22c55e' }}>{amount}</span></div><div style={{ fontSize: '13px', color: '#888' }}>{date} · {detail}</div></div>
    </div>
  );
}
