import Link from 'next/link';
import { products, tiers } from '../../lib/products';

export const metadata = {
  title: 'Products — Like One AI Automation Studio',
  description: 'AI automation products, toolkits, and blueprints to transform your business. From free tools to premium systems.',
};

function TierBadge({ tier }) {
  const t = tiers[tier];
  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '11px',
      fontWeight: 700,
      letterSpacing: '.5px',
      textTransform: 'uppercase',
      background: `${t.color}18`,
      border: `1px solid ${t.color}40`,
      color: t.color,
    }}>
      {t.name}
    </span>
  );
}

function ProductCard({ product }) {
  const isFree = product.price === 0;
  return (
    <Link href={`/products/${product.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{
        background: '#141414',
        border: product.popular ? '2px solid #e84393' : '1px solid #1f1f1f',
        borderRadius: '12px',
        padding: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'all .3s',
        position: 'relative',
        cursor: 'pointer',
      }}>
        {product.popular && (
          <div style={{
            position: 'absolute',
            top: '-12px',
            right: '16px',
            background: 'linear-gradient(135deg, #e84393, #d93280)',
            color: '#fff',
            padding: '4px 14px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '.5px',
            textTransform: 'uppercase',
          }}>
            Popular
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <TierBadge tier={product.tier} />
          <span style={{ fontSize: '12px', color: '#999', fontWeight: 500 }}>{product.category}</span>
        </div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px', lineHeight: 1.3 }}>{product.name}</h3>
        <p style={{ color: '#a0a0a0', fontSize: '.9rem', lineHeight: 1.6, marginBottom: '1.25rem', flexGrow: 1 }}>{product.tagline}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            fontSize: '1.4rem',
            fontWeight: 700,
            background: isFree ? 'linear-gradient(135deg, #00cec9, #00b894)' : 'linear-gradient(135deg, #e84393, #00cec9)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            {product.priceLabel}
          </span>
          <span style={{
            background: 'linear-gradient(135deg, #00cec9, #00b8b0)',
            color: '#0a0a0a',
            padding: '8px 18px',
            borderRadius: '6px',
            fontSize: '.85rem',
            fontWeight: 600,
          }}>
            View Details
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function ProductsPage() {
  const tierOrder = ['free', 'entry', 'core', 'premium', 'subscription'];

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: 'rgba(10,10,10,.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #1f1f1f',
        padding: '1.25rem 0',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/home.html" style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #e84393, #00cec9)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textDecoration: 'none',
          }}>
            Like One
          </Link>
          <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <Link href="/home.html" style={{ color: '#e0e0e0', textDecoration: 'none', fontSize: '.95rem', fontWeight: 500 }}>Home</Link>
            <Link href="/products" style={{ color: '#e84393', textDecoration: 'none', fontSize: '.95rem', fontWeight: 500 }}>Products</Link>
            <Link href="/blog" style={{ color: '#e0e0e0', textDecoration: 'none', fontSize: '.95rem', fontWeight: 500 }}>Blog</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section style={{
        padding: '5rem 1.5rem 3rem',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(232,67,147,.05) 0%, rgba(108,92,231,.05) 100%)',
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.2 }}>
            <span style={{
              background: 'linear-gradient(135deg, #e84393, #00cec9)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              AI Products & Tools
            </span>
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#a0a0a0', lineHeight: 1.7 }}>
            From free tools to premium blueprints — everything you need to build, automate, and scale with AI.
          </p>
        </div>
      </section>

      {/* Products by Tier */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem 5rem' }}>
        {tierOrder.map(tierKey => {
          const tierProducts = products.filter(p => p.tier === tierKey);
          const tier = tiers[tierKey];
          if (tierProducts.length === 0) return null;
          return (
            <div key={tierKey} style={{ marginBottom: '4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                <div style={{ width: '4px', height: '28px', background: tier.color, borderRadius: '2px' }} />
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{tier.name}</h2>
                {tierKey === 'subscription' && (
                  <span style={{ color: '#999', fontSize: '.9rem', fontWeight: 400 }}>Recurring access</span>
                )}
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1.5rem',
              }}>
                {tierProducts.map(product => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* Footer */}
      <footer style={{
        background: '#141414',
        borderTop: '1px solid #1f1f1f',
        padding: '2rem 1.5rem',
        textAlign: 'center',
        color: '#999',
        fontSize: '.85rem',
      }}>
        <p>&copy; 2026 Like One - AI Automation Studio. All rights reserved.</p>
      </footer>
    </div>
  );
}
