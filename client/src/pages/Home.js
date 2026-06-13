import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useBanners, useProducts, useTestimonials } from '../hooks/useApi';
import './Home.css';

const HeroBanner = ({ banners }) => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!banners.length) return;
    const timer = setInterval(() => setActive(p => (p + 1) % banners.length), 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (!banners.length) return <div className="hero-placeholder skeleton" />;

  const banner = banners[active];

  return (
    <section className="hero">
      <div className="hero-slides">
        {banners.map((b, i) => (
          <div key={b.id} className={`hero-slide ${i === active ? 'active' : ''}`}>
            <img src={b.image} alt={b.title} className="hero-bg" />
            <div className="hero-overlay" />
          </div>
        ))}
      </div>

      <div className="hero-content container">
        <div className="hero-text">
          <div className="hero-eyebrow">
            <span className="eyebrow-line" />
            <span>New Collection 2025</span>
          </div>
          <h1 className="hero-title" key={active}>
            {banner.title.split(' ').map((word, i) => (
              <span key={i} className="word-reveal" style={{ animationDelay:`${i * 0.1}s` }}>
                {word}{' '}
              </span>
            ))}
          </h1>
          <p className="hero-sub">{banner.subtitle}</p>
          <div className="hero-actions">
            <Link to="/shop" className="btn btn-primary hero-cta">
              {banner.cta}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link to="/shop" className="btn btn-outline">View All</Link>
          </div>
        </div>

        <div className="hero-stats">
          {[['10K+','Products'],['50K+','Happy Clients'],['4.9','Avg Rating'],['Free','Shipping $200+']].map(([num, label]) => (
            <div key={label} className="hero-stat">
              <span className="stat-num">{num}</span>
              <span className="stat-label">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="hero-dots">
        {banners.map((_, i) => (
          <button key={i} className={`dot ${i === active ? 'active' : ''}`} onClick={() => setActive(i)} />
        ))}
      </div>
    </section>
  );
};

const PromoBar = () => (
  <div className="promo-bar">
    <div className="promo-track">
      {['Free Shipping on Orders $200+','30-Day Returns','Authentic Products Guaranteed','Secure Checkout',
        'Free Shipping on Orders $200+','30-Day Returns','Authentic Products Guaranteed','Secure Checkout'
      ].map((text, i) => (
        <span key={i} className="promo-item">
          <span className="promo-dot">◈</span> {text}
        </span>
      ))}
    </div>
  </div>
);

const CategoryRow = () => {
  const cats = [
    { name:'Watches', icon:'⌚', href:'/shop?category=watches' },
    { name:'Fashion', icon:'👔', href:'/shop?category=fashion' },
    { name:'Electronics', icon:'📱', href:'/shop?category=electronics' },
    { name:'Home', icon:'🏠', href:'/shop?category=home' },
    { name:'Accessories', icon:'👜', href:'/shop?category=accessories' },
  ];
  return (
    <section className="categories-section">
      <div className="container">
        <div className="categories-row">
          {cats.map((cat, i) => (
            <Link key={cat.name} to={cat.href} className="cat-pill" style={{ animationDelay:`${i*0.1}s` }}>
              <span className="cat-icon">{cat.icon}</span>
              <span>{cat.name}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

const TestimonialSection = ({ testimonials }) => (
  <section className="testimonials-section">
    <div className="container">
      <div className="section-header">
        <p className="section-eyebrow">Testimonials</p>
        <h2 className="section-title">What Our Clients Say</h2>
      </div>
      <div className="testimonials-grid">
        {testimonials.map((t, i) => (
          <div key={t.id} className="testimonial-card animate-fade-up"
            style={{ animationDelay:`${i*0.12}s` }}>
            <div className="testimonial-quote">❝</div>
            <p className="testimonial-text">{t.text}</p>
            <div className="testimonial-footer">
              <img src={t.avatar} alt={t.name} className="testimonial-avatar" />
              <div>
                <p className="testimonial-name">{t.name}</p>
                <p className="testimonial-role">{t.role}</p>
              </div>
              <div className="stars" style={{ marginLeft:'auto' }}>
                {Array.from({ length: t.rating }).map((_, s) => (
                  <span key={s} className="star">★</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Home = () => {
  const banners = useBanners();
  const { products: featured, loading } = useProducts({ limit: 8, sort: 'rating' });
  const { products: newArrivals } = useProducts({ sort: 'newest', limit: 4 });
  const testimonials = useTestimonials();

  return (
    <div className="home-page">
      <HeroBanner banners={banners} />
      <PromoBar />
      <CategoryRow />

      <section className="products-section">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="section-eyebrow">Handpicked For You</p>
              <h2 className="section-title">Featured Products</h2>
            </div>
            <Link to="/shop" className="btn btn-outline">View All →</Link>
          </div>
          {loading ? (
            <div className="products-grid">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="skeleton" style={{ height:'380px', borderRadius:'20px' }} />
              ))}
            </div>
          ) : (
            <div className="products-grid">
              {featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          )}
        </div>
      </section>

      <section className="mid-banner">
        <div className="container">
          <div className="mid-banner-inner">
            <div>
              <h2 className="section-title">
                New Season<br /><span className="gold-text">Arrivals</span>
              </h2>
              <p>Discover the latest additions to our curated collection.</p>
              <Link to="/shop?sort=newest" className="btn btn-primary" style={{ marginTop:'24px' }}>
                Shop New Arrivals →
              </Link>
            </div>
            <div className="mid-banner-grid">
              {newArrivals.map(p => (
                <Link key={p.id} to={`/product/${p.id}`} className="mini-card">
                  <img src={p.image} alt={p.name} />
                  <div className="mini-card-info">
                    <span>{p.name}</span>
                    <span className="mini-price">${p.price}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <TestimonialSection testimonials={testimonials} />
    </div>
  );
};

export default Home;