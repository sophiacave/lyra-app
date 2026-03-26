import Link from 'next/link';
import { products, tiers } from '../../lib/products';
import { site, colors, fonts } from '../../lib/site-config';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  title: `Products \u2014 ${site.name}`,
  description: 'AI playbooks, automation blueprints, and business systems built from a live, working stack. From free tools to full systems.',
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
        background: '#111114',
        border: product.popular ? '2px solid #c084fc' : '1px solid #1e1e28',
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
            background: 'linear-gradient(135deg, #c084fc, #d93280)',
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
            background: isFree ? 'linear-gradient(135deg, #38bdf8, #00b894)' : 'linear-gradient(135deg, #c084fc, #38bdf8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            {product.priceLabel}
          </span>
          <span style={{
            background: 'linear-gradient(135deg, #38bdf8, #00b8b0)',
            color: '#08080a',
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
    <div style={{ minHeight: '100vh', background: colors.pageBg, color: '#fff', fontFamily: fonts.primary }}>
      <Header activeLink="/products" />

      {/* Hero */}
      <section style={{
        padding: '5rem 1.5rem 3rem',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(232,67,147,.05) 0%, rgba(108,92,231,.05) 100%)',
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.2 }}>
            <span style={{
              background: 'linear-gradient(135deg, #c084fc, #38bdf8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Products & Tools
            </span>
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#a0a0a0', lineHeight: 1.7 }}>
            Playbooks, blueprints, and business systems built from a live stack. Everything documented from what we actually use.
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

      <Footer />
    </div>
  );
}
