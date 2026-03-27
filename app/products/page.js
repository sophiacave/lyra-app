import Link from 'next/link';
import { products, tiers } from '../../lib/products';
import { site } from '../../lib/site-config';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  title: `Products — ${site.name}`,
  description: 'AI playbooks, automation blueprints, and business systems built from a live, working stack. From free tools to full systems.',
  alternates: { canonical: `${site.url}/products/` },
  openGraph: {
    title: `Products & Tools — ${site.name}`,
    description: 'AI playbooks, automation blueprints, and business systems. From free tools to full enterprise systems.',
    url: `${site.url}/products/`,
    images: [{ url: site.ogImage, ...site.ogImageSize }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Products & Tools — ${site.name}`,
    description: 'AI playbooks, automation blueprints, and business systems. From free tools to full enterprise systems.',
    images: [site.ogImage],
  },
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
    <Link href={`/products/${product.slug}`} className="product-link-reset">
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
      <section className="site-section-sm products-hero-section">
        <div className="products-hero-inner">
          <h1 className="site-hero-title-sm">
            <span className="site-gradient-text">Products & Tools</span>
          </h1>
          <p className="products-hero-desc">
            Playbooks, blueprints, and business systems built from a live stack. Everything documented from what we actually use.
          </p>
        </div>
      </section>

      {/* Products by Tier */}
      <section className="products-content">
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
