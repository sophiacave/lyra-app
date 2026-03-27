import Link from 'next/link';
import { products, tiers } from '../../lib/products';
import { site } from '../../lib/site-config';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  title: `Products — ${site.name}`,
  description: 'AI playbooks, automation blueprints, and business systems built from a live, working stack. From free tools to full systems.',
};

function TierBadge({ tier }) {
  const t = tiers[tier];
  return (
    <span
      className="product-tier-badge"
      style={{
        background: `${t.color}18`,
        border: `1px solid ${t.color}40`,
        color: t.color,
      }}
    >
      {t.name}
    </span>
  );
}

function ProductCard({ product }) {
  const isFree = product.price === 0;
  return (
    <Link href={`/products/${product.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className={`product-card ${product.popular ? 'popular' : ''}`}>
        {product.popular && (
          <div className="product-popular-badge">Popular</div>
        )}
        <div className="product-card-header">
          <TierBadge tier={product.tier} />
          <span className="product-card-category">{product.category}</span>
        </div>
        <h3 className="product-card-name">{product.name}</h3>
        <p className="product-card-tagline">{product.tagline}</p>
        <div className="product-card-footer">
          <span className={`product-price ${isFree ? 'free' : 'paid'}`}>
            {product.priceLabel}
          </span>
          <span className="product-view-btn">View Details</span>
        </div>
      </div>
    </Link>
  );
}

export default function ProductsPage() {
  const tierOrder = ['free', 'entry', 'core', 'premium', 'subscription'];

  return (
    <div className="site-page">
      <Header activeLink="/products" />

      {/* Hero */}
      <section className="site-section-sm" style={{ textAlign: 'center', background: 'linear-gradient(135deg, rgba(232,67,147,0.05) 0%, rgba(108,92,231,0.05) 100%)' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h1 className="site-hero-title-sm">
            <span className="site-gradient-text">Products & Tools</span>
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Playbooks, blueprints, and business systems built from a live stack. Everything documented from what we actually use.
          </p>
        </div>
      </section>

      {/* Products by Tier */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: 'var(--space-8) var(--space-6) var(--space-20)' }}>
        {tierOrder.map(tierKey => {
          const tierProducts = products.filter(p => p.tier === tierKey);
          const tier = tiers[tierKey];
          if (tierProducts.length === 0) return null;
          return (
            <div key={tierKey} className="product-tier-section">
              <div className="product-tier-header">
                <div className="product-tier-bar" style={{ background: tier.color }} />
                <h2 className="product-tier-name">{tier.name}</h2>
                {tierKey === 'subscription' && (
                  <span className="product-tier-sub">Recurring access</span>
                )}
              </div>
              <div className="product-grid">
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
