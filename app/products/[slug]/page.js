import Link from 'next/link';
import { products, tiers, getProductBySlug, getAllProductSlugs } from '../../../lib/products';

export async function generateStaticParams() {
  return getAllProductSlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: 'Product Not Found' };
  return {
    title: `${product.name} — Like One`,
    description: product.tagline,
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif" }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Product not found</h1>
          <Link href="/products" style={{ color: '#e84393' }}>Browse all products</Link>
        </div>
      </div>
    );
  }

  const tier = tiers[product.tier];
  const isFree = product.price === 0;
  const isExternal = product.paymentLink.startsWith('http');

  // Find related products (same tier, exclude current)
  const related = products.filter(p => p.tier === product.tier && p.slug !== product.slug).slice(0, 3);

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

      {/* Breadcrumb */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '1.5rem 1.5rem 0' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '.85rem', color: '#888' }}>
          <Link href="/products" style={{ color: '#888', textDecoration: 'none' }}>Products</Link>
          <span>/</span>
          <span style={{ color: '#e0e0e0' }}>{product.name}</span>
        </div>
      </div>

      {/* Product Detail */}
      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '3rem', alignItems: 'start' }}>
          {/* Left: Product Info */}
          <div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '.5px',
                textTransform: 'uppercase',
                background: `${tier.color}18`,
                border: `1px solid ${tier.color}40`,
                color: tier.color,
              }}>
                {tier.name}
              </span>
              <span style={{ fontSize: '13px', color: '#888' }}>{product.category}</span>
              {product.popular && (
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #e84393, #d93280)',
                  color: '#fff',
                }}>
                  Popular
                </span>
              )}
            </div>

            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: '.75rem', lineHeight: 1.2 }}>
              {product.name}
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#00cec9', fontWeight: 500, marginBottom: '1.5rem' }}>
              {product.tagline}
            </p>
            <p style={{ color: '#c0c0c0', fontSize: '1rem', lineHeight: 1.8, marginBottom: '2rem' }}>
              {product.description}
            </p>

            {/* Features */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>What You Get</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {product.features.map((feature, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <span style={{ color: '#00cec9', fontSize: '1rem', lineHeight: '1.6', flexShrink: 0 }}>&#10003;</span>
                    <span style={{ color: '#c0c0c0', fontSize: '.95rem', lineHeight: 1.6 }}>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* What's Included */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Includes</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {product.includes.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{ color: '#e84393', fontSize: '.85rem' }}>&#9679;</span>
                    <span style={{ color: '#c0c0c0', fontSize: '.95rem' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Best For */}
            <div style={{
              background: '#1a1a2e',
              border: '1px solid #2a2a4a',
              borderRadius: '10px',
              padding: '1.25rem',
            }}>
              <p style={{ fontSize: '.85rem', color: '#6c5ce7', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '.5px' }}>
                Best For
              </p>
              <p style={{ color: '#c0c0c0', fontSize: '.95rem', lineHeight: 1.6 }}>{product.bestFor}</p>
            </div>
          </div>

          {/* Right: Purchase Card */}
          <div style={{
            position: 'sticky',
            top: '100px',
            background: '#141414',
            border: '1px solid #1f1f1f',
            borderRadius: '16px',
            padding: '2rem',
          }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <span style={{
                fontSize: '2.5rem',
                fontWeight: 800,
                background: isFree ? 'linear-gradient(135deg, #00cec9, #00b894)' : 'linear-gradient(135deg, #e84393, #00cec9)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                {product.priceLabel}
              </span>
              {product.isBundle && product.savings && (
                <p style={{ color: '#00cec9', fontSize: '.85rem', marginTop: '4px' }}>
                  Save ${product.savings}
                </p>
              )}
              {product.isSubscription && product.savings && (
                <p style={{ color: '#00cec9', fontSize: '.85rem', marginTop: '4px' }}>
                  Save ${product.savings}/year vs monthly
                </p>
              )}
            </div>

            <a
              href={isExternal ? product.paymentLink : undefined}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              style={{
                display: 'block',
                width: '100%',
                padding: '14px 24px',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #e84393, #d93280)',
                color: '#fff',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer',
                textDecoration: 'none',
                textAlign: 'center',
                transition: 'all .3s',
                marginBottom: '1rem',
              }}
            >
              {product.buttonText}
            </a>

            <div style={{ borderTop: '1px solid #2a2a2a', paddingTop: '1rem' }}>
              {product.format && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#888', fontSize: '.85rem' }}>Format</span>
                  <span style={{ color: '#e0e0e0', fontSize: '.85rem', fontWeight: 500 }}>{product.format}</span>
                </div>
              )}
              {product.pages && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#888', fontSize: '.85rem' }}>Pages</span>
                  <span style={{ color: '#e0e0e0', fontSize: '.85rem', fontWeight: 500 }}>{product.pages}+</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#888', fontSize: '.85rem' }}>Delivery</span>
                <span style={{ color: '#e0e0e0', fontSize: '.85rem', fontWeight: 500 }}>Instant download</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#888', fontSize: '.85rem' }}>Access</span>
                <span style={{ color: '#e0e0e0', fontSize: '.85rem', fontWeight: 500 }}>{product.isSubscription ? 'While subscribed' : 'Lifetime'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div style={{ marginTop: '4rem', borderTop: '1px solid #1f1f1f', paddingTop: '3rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Related Products</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
              {related.map(p => (
                <Link key={p.slug} href={`/products/${p.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{
                    background: '#141414',
                    border: '1px solid #1f1f1f',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    transition: 'all .3s',
                    cursor: 'pointer',
                  }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '6px' }}>{p.name}</h3>
                    <p style={{ color: '#a0a0a0', fontSize: '.85rem', marginBottom: '1rem', lineHeight: 1.5 }}>{p.tagline}</p>
                    <span style={{
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #e84393, #00cec9)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}>
                      {p.priceLabel}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
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

      <style>{`
        @media (max-width: 768px) {
          section > div { grid-template-columns: 1fr !important; }
        }
        a:hover div[style*="border: 1px solid #1f1f1f"] { border-color: #e84393 !important; transform: translateY(-4px); box-shadow: 0 12px 30px rgba(232,67,147,.1); }
      `}</style>
    </div>
  );
}
