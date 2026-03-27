import Link from 'next/link';
import { products, tiers, getProductBySlug, getAllProductSlugs } from '../../../lib/products';
import { site } from '../../../lib/site-config';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export async function generateStaticParams() {
  return getAllProductSlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: 'Product Not Found' };
  return {
    title: `${product.name} — ${site.name}`,
    description: product.tagline,
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return (
      <div className="site-page product-not-found">
        <div>
          <h1>Product not found</h1>
          <Link href="/products">Browse all products</Link>
        </div>
      </div>
    );
  }

  const tier = tiers[product.tier];
  const isFree = product.price === 0;
  const isExternal = product.paymentLink.startsWith('http');
  const related = products.filter(p => p.tier === product.tier && p.slug !== product.slug).slice(0, 3);

  return (
    <div className="product-page">
      <Header activeLink="/products" />

      <div className="product-breadcrumb">
        <div className="product-breadcrumb-inner">
          <Link href="/products">Products</Link>
          <span>/</span>
          <span className="product-breadcrumb-current">{product.name}</span>
        </div>
      </div>

      <section className="product-detail">
        <div className="product-grid">
          <div>
            <div className="product-badges">
              <span className="product-tier-badge"
                style={{ background: `${tier.color}18`, border: `1px solid ${tier.color}40`, color: tier.color }}>
                {tier.name}
              </span>
              <span className="product-category">{product.category}</span>
              {product.popular && (
                <span className="product-popular-badge">Popular</span>
              )}
            </div>

            <h1 className="product-title">{product.name}</h1>
            <p className="product-tagline">{product.tagline}</p>
            <p className="product-description">{product.description}</p>

            <div className="product-section">
              <h2 className="product-section-title">What You Get</h2>
              <div className="product-features">
                {product.features.map((feature, i) => (
                  <div key={i} className="product-feature">
                    <span className="product-feature-check">&#10003;</span>
                    <span className="product-feature-text">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="product-section">
              <h2 className="product-section-title">Includes</h2>
              <div className="product-includes">
                {product.includes.map((item, i) => (
                  <div key={i} className="product-include">
                    <span className="product-include-dot">&#9679;</span>
                    <span className="product-include-text">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="product-best-for">
              <p className="product-best-for-label">Best For</p>
              <p className="product-best-for-text">{product.bestFor}</p>
            </div>
          </div>

          <div className="product-purchase-card">
            <div className="product-price">
              <span className={`product-price-value ${isFree ? 'free' : 'gradient'}`}>
                {product.priceLabel}
              </span>
              {product.isBundle && product.savings && (
                <p className="product-savings">Save ${product.savings}</p>
              )}
              {product.isSubscription && product.savings && (
                <p className="product-savings">Save ${product.savings}/year vs monthly</p>
              )}
            </div>

            <a href={isExternal ? product.paymentLink : undefined}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              className="product-buy-btn">
              {product.buttonText}
            </a>

            <div className="product-meta">
              {product.format && (
                <div className="product-meta-row">
                  <span className="product-meta-label">Format</span>
                  <span className="product-meta-value">{product.format}</span>
                </div>
              )}
              {product.pages && (
                <div className="product-meta-row">
                  <span className="product-meta-label">Pages</span>
                  <span className="product-meta-value">{product.pages}+</span>
                </div>
              )}
              <div className="product-meta-row">
                <span className="product-meta-label">Delivery</span>
                <span className="product-meta-value">Instant download</span>
              </div>
              <div className="product-meta-row">
                <span className="product-meta-label">Access</span>
                <span className="product-meta-value">{product.isSubscription ? 'While subscribed' : 'Lifetime'}</span>
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="product-related">
            <h2 className="product-related-title">Related Products</h2>
            <div className="product-related-grid">
              {related.map(p => (
                <Link key={p.slug} href={`/products/${p.slug}`} className="product-related-card">
                  <h3 className="product-related-name">{p.name}</h3>
                  <p className="product-related-tagline">{p.tagline}</p>
                  <span className="product-related-price site-gradient-text">{p.priceLabel}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
