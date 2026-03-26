import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#08080a',
          padding: '60px 80px',
          fontFamily: 'Inter, system-ui, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Gradient overlays */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            left: '-10%',
            width: '60%',
            height: '60%',
            background: 'radial-gradient(ellipse, rgba(192,132,252,0.12) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-20%',
            right: '-10%',
            width: '60%',
            height: '60%',
            background: 'radial-gradient(ellipse, rgba(56,189,248,0.08) 0%, transparent 70%)',
          }}
        />

        {/* Bottom gradient line */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #c084fc, #38bdf8)',
          }}
        />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '32px', fontWeight: 800, color: '#e8e8ec', letterSpacing: '-0.5px' }}>
            like
          </span>
          <span style={{ fontSize: '32px', fontWeight: 800, color: '#c084fc', letterSpacing: '-0.5px' }}>
            one
          </span>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              color: '#c084fc',
              border: '1px solid rgba(192,132,252,0.3)',
              padding: '2px 10px',
              borderRadius: '4px',
              marginLeft: '12px',
            }}
          >
            AI
          </span>
        </div>

        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              fontSize: '72px',
              fontWeight: 800,
              color: '#e8e8ec',
              lineHeight: 1.05,
              letterSpacing: '-3px',
            }}
          >
            Human + AI,{' '}
            <span style={{ color: '#c084fc' }}>together.</span>
          </div>
          <div
            style={{
              fontSize: '24px',
              color: '#8888a0',
              lineHeight: 1.5,
              maxWidth: '700px',
            }}
          >
            Human creativity meets AI intelligence. This is what collaboration looks like.
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: '18px', color: '#8888a0' }}>likeone.ai</span>
          <span style={{ fontSize: '18px', color: '#8888a0' }}>By Sophia Cave</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
