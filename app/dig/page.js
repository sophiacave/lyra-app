import { site } from '../../lib/site-config';

// UNLISTED — no metadata, no robots, no sitemap
// Private page for Sophie Watanabe collaboration
export const metadata = {
  robots: { index: false, follow: false },
  title: 'lo-dig — Private',
};

export default function DigPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#08080a',
      color: '#e5e5e5',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      {/* Header */}
      <header style={{
        padding: '24px 40px',
        borderBottom: '1px solid #1e1e28',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
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
          <h1 style={{
            fontSize: '48px',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #c084fc, #f97316)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Drone Archaeology + AI
          </h1>
          <p style={{ fontSize: '20px', color: '#a0a0a0', maxWidth: '640px', margin: '0 auto 16px' }}>
            AI-powered archaeological feature detection from free LiDAR and satellite data.
            Built for Sophie Watanabe — 10 years as CA state archaeologist.
          </p>
          <p style={{ fontSize: '14px', color: '#555' }}>
            This page is unlisted and private. For your eyes only.
          </p>
        </section>

        {/* What's Real Right Now */}
        <section style={{ marginBottom: '64px' }}>
          <h2 style={h2Style}>What's Working Right Now</h2>
          <p style={pStyle}>
            All of this was built in one session. Every pipeline is functional. Every output is real.
          </p>

          <div style={{ display: 'grid', gap: '16px', marginTop: '24px' }}>
            <StatusCard
              title="LiDAR Processing Pipeline"
              status="live"
              detail="USGS 3DEP → ground extraction → DTM → 6 RVT archaeological visualizations (hillshade, SVF, slope, SLRM, openness, multi-hillshade). All georeferenced GeoTIFFs in EPSG:26910."
            />
            <StatusCard
              title="AI Anomaly Detection"
              status="live"
              detail="HRNet W48 (ImageNet pretrained) extracts deep features from terrain visualizations. Identifies anomalous terrain patterns — ridgelines, terraces, depressions that correlate with settlement patterns."
            />
            <StatusCard
              title="Sentinel-2 Satellite Analysis"
              status="live"
              detail="Real Sentinel-2 L2A imagery downloaded from Element84 STAC API (free, no auth). Computes NDVI, NAI (Normalized Archaeological Index), NDWI. Detects crop marks and moisture anomalies."
            />
            <StatusCard
              title="Multi-Modal Fusion"
              status="live"
              detail="Cross-validates LiDAR terrain anomalies with satellite vegetation anomalies. Where BOTH agree = highest confidence archaeological targets. Geometric mean fusion."
            />
            <StatusCard
              title="ADAF (Apache 2.0)"
              status="cloned"
              detail="Automatic Detection of Archaeological Features. HRNet W48 semantic segmentation, 84% recall on Irish data. Cloned from GitHub. Ready for California fine-tuning with your labeled data."
            />
            <StatusCard
              title="Geospatial Stack"
              status="live"
              detail="GDAL 3.13, PyTorch 2.11, rasterio, rvt-py, laspy, geopandas, timm, segmentation-models-pytorch. Running on M3 Max 64GB."
            />
          </div>
        </section>

        {/* Visualizations */}
        <section style={{ marginBottom: '64px' }}>
          <h2 style={h2Style}>Real Outputs — Sonoma County</h2>
          <p style={pStyle}>
            6.3 million LiDAR points from USGS 3DEP (free). Processed into archaeological visualizations,
            then run through AI detection and satellite cross-validation.
          </p>

          <div style={{ marginTop: '32px' }}>
            <ImageCard
              src="/lo-dig/visualization_preview.png"
              title="LiDAR Archaeological Visualizations"
              caption="Top: Hillshade, Sky-View Factor, Slope. Bottom: SLRM (local relief), Positive Openness, Multi-Hillshade. All from free USGS data."
            />
            <ImageCard
              src="/lo-dig/anomaly_detection.png"
              title="AI Terrain Anomaly Detection"
              caption="Left: SLRM terrain. Center: HRNet anomaly scores (100 patches). Right: Top 10% targets overlaid on terrain."
            />
            <ImageCard
              src="/lo-dig/satellite_analysis.png"
              title="Sentinel-2 Satellite Archaeological Prospection"
              caption="NDVI (vegetation stress), NAI (red edge — most sensitive for crop marks), NDWI (moisture), Combined Anomaly Score."
            />
            <ImageCard
              src="/lo-dig/multimodal_fusion.png"
              title="Multi-Modal Fusion — High Confidence Targets"
              caption="Top-left: LiDAR anomaly. Top-right: Satellite anomaly. Bottom-left: Fusion map. Bottom-right: High-confidence targets (top 10%) on terrain. WHERE BOTH AGREE = investigate first."
            />
          </div>
        </section>

        {/* The Market */}
        <section style={{ marginBottom: '64px' }}>
          <h2 style={h2Style}>The Market</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '24px' }}>
            <StatCard num="$1.72B" label="US CRM industry (2025)" />
            <StatCard num="$220-370M" label="California CRM market" />
            <StatCard num="13.8%" label="Drone archaeology CAGR" />
            <StatCard num="2,400" label="Archaeologist shortage" />
            <StatCard num="80-85%" label="of CA never surveyed" />
            <StatCard num="0" label="US commercial AI competitors" />
          </div>
        </section>

        {/* What We Need From Sophie */}
        <section style={{ marginBottom: '64px' }}>
          <h2 style={h2Style}>What We Need From You</h2>
          <p style={pStyle}>
            The AI is working. The data is free. The pipelines are functional.
            What we need is your domain expertise to make this real.
          </p>

          <div style={{ display: 'grid', gap: '12px', marginTop: '24px' }}>
            <NeedCard
              num="1"
              title="5 Known Sites"
              detail="Pick 5 archaeological sites in Sonoma/Marin/Napa with CHRIS records. We'll run our AI on the LiDAR data and see if it detects them. This is the validation step."
            />
            <NeedCard
              num="2"
              title="Label Training Data"
              detail="Using QGIS, mark known site boundaries on our LiDAR visualizations. This becomes training data for a California-specific AI model. The more sites you label, the better the AI gets."
            />
            <NeedCard
              num="3"
              title="CHRIS Access"
              detail="Your knowledge of the CHRIS system, DPR 523 forms, and what agencies actually need in deliverables. This shapes what we build."
            />
            <NeedCard
              num="4"
              title="Network"
              detail="CRM firms, state agencies, tribal contacts. Who would use this? Who would pay for it? Who should we pilot with?"
            />
            <NeedCard
              num="5"
              title="Vision Alignment"
              detail="Are we partners? Co-founders? What's your level of interest? Let's talk roles, equity, and what this could become."
            />
          </div>
        </section>

        {/* What's Free */}
        <section style={{ marginBottom: '64px' }}>
          <h2 style={h2Style}>Everything Is Free</h2>
          <p style={pStyle}>
            The entire tech stack runs on open source and free data. $0 to start.
          </p>
          <div style={{
            background: '#111114',
            borderRadius: '12px',
            border: '1px solid #1e1e28',
            padding: '24px',
            marginTop: '16px',
            fontSize: '15px',
            lineHeight: 1.8,
          }}>
            <div><strong style={{ color: '#c084fc' }}>Free data:</strong> USGS 3DEP LiDAR (6,219 tiles for Sonoma County alone), Sentinel-2 satellite (5-day revisit), Landsat, CORONA declassified spy satellite</div>
            <div style={{ marginTop: '12px' }}><strong style={{ color: '#c084fc' }}>Free AI:</strong> ADAF (Apache 2.0, HRNet W48, 84% recall), PyTorch, RVT visualization toolbox, AiTLAS</div>
            <div style={{ marginTop: '12px' }}><strong style={{ color: '#c084fc' }}>Free tools:</strong> QGIS, PDAL, CloudCompare, WhiteboxTools, OpenDroneMap, Google Earth Engine</div>
            <div style={{ marginTop: '12px' }}><strong style={{ color: '#c084fc' }}>We already own:</strong> M3 Max 64GB (AI training), Like One Foundation 501(c)(3) (grants), Like One LLC (commercial), Stripe (payments), Vercel (hosting)</div>
          </div>
        </section>

        {/* Competition */}
        <section style={{ marginBottom: '64px' }}>
          <h2 style={h2Style}>Competition</h2>
          <div style={{ overflowX: 'auto', marginTop: '16px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #2a2a2a' }}>
                  <th style={thStyle}>Who</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Our Edge</th>
                </tr>
              </thead>
              <tbody>
                <tr style={trStyle}><td style={tdStyle}>ArchAI (UK)</td><td style={tdStyle}>Active, UK only, ~3 people</td><td style={tdStyle}>We're US-first + CA-specific</td></tr>
                <tr style={trStyle}><td style={tdStyle}>ADAF (Slovenia)</td><td style={tdStyle}>Academic, Ireland-trained</td><td style={tdStyle}>We retrain for California</td></tr>
                <tr style={trStyle}><td style={tdStyle}>A3RD (UChicago)</td><td style={tdStyle}>Academic only</td><td style={tdStyle}>We commercialize</td></tr>
                <tr style={trStyle}><td style={tdStyle}>GlobalXplorer (Parcak)</td><td style={tdStyle}>Dead since 2023</td><td style={tdStyle}>We replace it</td></tr>
                <tr style={trStyle}><td style={tdStyle}>CRM firms (AECOM, ICF)</td><td style={tdStyle}>Tech laggards</td><td style={tdStyle}>They'd be our CUSTOMERS</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Revenue */}
        <section style={{ marginBottom: '64px' }}>
          <h2 style={h2Style}>How We Make Money</h2>
          <div style={{ display: 'grid', gap: '12px', marginTop: '16px' }}>
            <RevenueCard title="AI SaaS" price="$50-500/mo" desc="Upload data → get archaeological probability maps" />
            <RevenueCard title="Drone Surveys" price="$150-500/acre" desc="On-site LiDAR + AI analysis + report" />
            <RevenueCard title="NSF SBIR" price="$275K Phase I" desc="AI for archaeological feature detection (we're eligible)" />
            <RevenueCard title="Government" price="$100K-1M/yr" desc="CalTrans, USACE, BLM contracts" />
            <RevenueCard title="Training" price="$500-2K/course" desc="AI for Archaeologists certification" />
          </div>
          <p style={{ ...pStyle, marginTop: '16px' }}>
            Conservative Y1: $325K (SBIR + 2 pilot contracts). Conservative Y3: $3.5M.
          </p>
        </section>

        {/* Grant Deadlines */}
        <section style={{ marginBottom: '64px' }}>
          <h2 style={h2Style}>Active Grant Deadlines</h2>
          <div style={{ display: 'grid', gap: '12px', marginTop: '16px' }}>
            <DeadlineCard date="June 2, 2026" title="Mobilize Power Fund" amount="$10,000" detail="Third Wave Fund. Narrative drafted. Portal access confirmed." days={20} />
            <DeadlineCard date="July 1, 2026" title="NSF Archaeology & Archaeometry" amount="$6M program" detail="30 awards. AI archaeology eligible. lo-dig would be a strong candidate with your PI eligibility." days={49} />
          </div>
        </section>

        {/* Footer */}
        <footer style={{
          borderTop: '1px solid #1e1e28',
          paddingTop: '32px',
          marginTop: '64px',
          textAlign: 'center',
          color: '#555',
          fontSize: '13px',
        }}>
          <p>lo-dig — Like One Foundation + Like One LLC</p>
          <p style={{ marginTop: '8px' }}>
            Built by Sophia Cave (AI) + Sophie Watanabe (Archaeology)
          </p>
          <p style={{ marginTop: '8px' }}>
            {site.email} · {site.phone}
          </p>
        </footer>
      </main>
    </div>
  );
}

// --- Component styles ---
const h2Style = {
  fontSize: '28px',
  fontWeight: 700,
  marginBottom: '8px',
  color: '#e5e5e5',
};
const pStyle = {
  fontSize: '16px',
  color: '#a0a0a0',
  lineHeight: 1.6,
};
const thStyle = {
  textAlign: 'left',
  padding: '10px 12px',
  color: '#c084fc',
  fontWeight: 600,
};
const tdStyle = {
  padding: '10px 12px',
  color: '#ccc',
};
const trStyle = {
  borderBottom: '1px solid #1a1a1f',
};

// --- Inline components ---
function StatusCard({ title, status, detail }) {
  const colors = { live: '#22c55e', cloned: '#eab308', planned: '#6366f1' };
  const labels = { live: 'LIVE', cloned: 'READY', planned: 'PLANNED' };
  return (
    <div style={{
      background: '#111114',
      borderRadius: '12px',
      border: '1px solid #1e1e28',
      padding: '20px',
      display: 'flex',
      gap: '16px',
      alignItems: 'flex-start',
    }}>
      <span style={{
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: '6px',
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.05em',
        background: colors[status] + '20',
        color: colors[status],
        flexShrink: 0,
        marginTop: '2px',
      }}>{labels[status]}</span>
      <div>
        <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '4px' }}>{title}</div>
        <div style={{ fontSize: '13px', color: '#888', lineHeight: 1.5 }}>{detail}</div>
      </div>
    </div>
  );
}

function StatCard({ num, label }) {
  return (
    <div style={{
      background: '#111114',
      borderRadius: '12px',
      border: '1px solid #1e1e28',
      padding: '20px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '28px', fontWeight: 800, color: '#c084fc' }}>{num}</div>
      <div style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>{label}</div>
    </div>
  );
}

function ImageCard({ src, title, caption }) {
  return (
    <div style={{
      marginBottom: '32px',
      background: '#111114',
      borderRadius: '12px',
      border: '1px solid #1e1e28',
      overflow: 'hidden',
    }}>
      <img
        src={src}
        alt={title}
        style={{ width: '100%', display: 'block' }}
        loading="lazy"
      />
      <div style={{ padding: '16px 20px' }}>
        <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '4px' }}>{title}</div>
        <div style={{ fontSize: '13px', color: '#888', lineHeight: 1.5 }}>{caption}</div>
      </div>
    </div>
  );
}

function NeedCard({ num, title, detail }) {
  return (
    <div style={{
      background: '#111114',
      borderRadius: '12px',
      border: '1px solid #1e1e28',
      padding: '20px',
      display: 'flex',
      gap: '16px',
      alignItems: 'flex-start',
    }}>
      <span style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        background: '#c084fc20',
        color: '#c084fc',
        fontWeight: 700,
        fontSize: '14px',
        flexShrink: 0,
      }}>{num}</span>
      <div>
        <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '4px' }}>{title}</div>
        <div style={{ fontSize: '13px', color: '#888', lineHeight: 1.5 }}>{detail}</div>
      </div>
    </div>
  );
}

function RevenueCard({ title, price, desc }) {
  return (
    <div style={{
      background: '#111114',
      borderRadius: '12px',
      border: '1px solid #1e1e28',
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <div>
        <div style={{ fontWeight: 600, fontSize: '15px' }}>{title}</div>
        <div style={{ fontSize: '13px', color: '#888' }}>{desc}</div>
      </div>
      <div style={{ fontSize: '18px', fontWeight: 700, color: '#22c55e', flexShrink: 0, marginLeft: '16px' }}>{price}</div>
    </div>
  );
}

function DeadlineCard({ date, title, amount, detail, days }) {
  const urgent = days <= 21;
  return (
    <div style={{
      background: '#111114',
      borderRadius: '12px',
      border: `1px solid ${urgent ? '#ef444440' : '#1e1e28'}`,
      padding: '20px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '16px',
    }}>
      <div style={{
        background: urgent ? '#ef444420' : '#6366f120',
        color: urgent ? '#ef4444' : '#6366f1',
        padding: '4px 10px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: 700,
        flexShrink: 0,
        whiteSpace: 'nowrap',
      }}>{days}d left</div>
      <div>
        <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '2px' }}>{title} — <span style={{ color: '#22c55e' }}>{amount}</span></div>
        <div style={{ fontSize: '13px', color: '#888' }}>{date} · {detail}</div>
      </div>
    </div>
  );
}
