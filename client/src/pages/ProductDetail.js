import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct } from '../hooks/useApi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import './ProductDetail.css';

const Stars = ({ rating }) => (
  <div className="stars">
    {[1,2,3,4,5].map(s => (
      <span key={s} className={`star ${s <= Math.round(rating) ? '' : 'empty'}`}>★</span>
    ))}
  </div>
);

const ProductDetail = () => {
  const { id } = useParams();
  const { product, loading } = useProduct(id);
  const { dispatch } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [adding, setAdding] = useState(false);
  const [tab, setTab] = useState('description');

  if (loading) return (
    <div className="pd-page">
      <div className="container pd-skeleton">
        <div className="skeleton" style={{ height:'500px', borderRadius:'20px', flex:1 }} />
        <div style={{ flex:1, display:'flex', flexDirection:'column', gap:'16px' }}>
          {[200,60,80,100,120].map((h,i) => (
            <div key={i} className="skeleton" style={{ height:h, borderRadius:'12px' }} />
          ))}
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="pd-page" style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'60vh' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:56, color:'var(--surface2)', marginBottom:16 }}>◈</div>
        <h2>Product Not Found</h2>
        <Link to="/shop" className="btn btn-primary" style={{ marginTop:16 }}>Back to Shop</Link>
      </div>
    </div>
  );

  const discount = product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  const addToCart = () => {
    setAdding(true);
    for (let i = 0; i < qty; i++) dispatch({ type: 'ADD_ITEM', payload: product });
    setTimeout(() => setAdding(false), 1500);
  };

  return (
    <div className="pd-page">
      <div className="container">
        <nav className="breadcrumb">
          <Link to="/">Home</Link><span>›</span>
          <Link to="/shop">Shop</Link><span>›</span>
          <Link to={`/shop?category=${product.category}`}>{product.category}</Link><span>›</span>
          <span>{product.name}</span>
        </nav>
      </div>

      <div className="container pd-main">
        <div className="pd-images">
          <div className="pd-main-img">
            <img
              src={product.images[activeImg] || product.image}
              alt={product.name}
              className="animate-fade-in"
              key={activeImg}
            />
            {discount > 0 && <div className="pd-discount-badge">-{discount}%</div>}
            <button
              className={`pd-wishlist-btn ${isWishlisted(product.id) ? 'active' : ''}`}
              onClick={() => toggle(product)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24"
                fill={isWishlisted(product.id) ? 'currentColor' : 'none'}
                stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06
                  a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78
                  1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          </div>
          {product.images.length > 1 && (
            <div className="pd-thumbnails">
              {product.images.map((img, i) => (
                <button key={i} className={`pd-thumb ${i === activeImg ? 'active' : ''}`}
                  onClick={() => setActiveImg(i)}>
                  <img src={img} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pd-info animate-fade-up">
          <div className="pd-badges">
            {product.badge === 'bestseller' && <span className="badge badge-gold">★ Bestseller</span>}
            {product.badge === 'new' && <span className="badge badge-new">New Arrival</span>}
            {product.badge === 'sale' && <span className="badge badge-sale">On Sale</span>}
            <span className={`stock-badge ${product.stock < 10 ? 'low' : ''}`}>
              {product.stock < 5 ? `Only ${product.stock} left!` : product.stock < 15 ? 'Limited Stock' : 'In Stock'}
            </span>
          </div>

          <p className="pd-category">{product.category}</p>
          <h1 className="pd-name">{product.name}</h1>

          <div className="pd-rating">
            <Stars rating={product.rating} />
            <span className="pd-rating-num">{product.rating}</span>
            <span className="pd-reviews">{product.reviews} reviews</span>
          </div>

          <div className="pd-pricing">
            <span className="pd-price">${product.price.toLocaleString()}</span>
            {discount > 0 && (
              <>
                <span className="pd-original">${product.originalPrice.toLocaleString()}</span>
                <span className="pd-save">Save ${(product.originalPrice - product.price).toLocaleString()}</span>
              </>
            )}
          </div>

          <div className="pd-divider" />
          <p className="pd-desc">{product.description}</p>
          <div className="pd-tags">
            {product.tags.map(t => <span key={t} className="pd-tag">#{t}</span>)}
          </div>
          <div className="pd-divider" />

          <div className="pd-qty-row">
            <span className="pd-label">Quantity</span>
            <div className="pd-qty">
              <button className="qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <span>{qty}</span>
              <button className="qty-btn" onClick={() => setQty(Math.min(product.stock, qty + 1))}>+</button>
            </div>
          </div>

          <div className="pd-actions">
            <button
              className={`btn btn-primary pd-add-btn ${adding ? 'added' : ''}`}
              onClick={addToCart}
            >
              {adding ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Added to Cart!
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 0 1-8 0"/>
                  </svg>
                  Add to Cart
                </>
              )}
            </button>
            <button className="btn btn-outline pd-buy-btn">Buy Now</button>
          </div>

          <div className="pd-features">
            {[
              ['🚚','Free shipping on orders $200+'],
              ['🔄','30-day easy returns'],
              ['🔒','Secure checkout'],
              ['✨','Authenticity guaranteed'],
            ].map(([icon, text]) => (
              <div key={text} className="pd-feature"><span>{icon}</span><span>{text}</span></div>
            ))}
          </div>
        </div>
      </div>

      <div className="container">
        <div className="pd-tabs">
          {['description','specifications','shipping'].map(t => (
            <button key={t} className={`pd-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <div className="pd-tab-content">
          {tab === 'description' && <p>{product.description} Crafted with the finest materials and rigorously quality tested.</p>}
          {tab === 'specifications' && (
            <div className="spec-table">
              {[['Category',product.category],['Rating',`${product.rating}/5`],
                ['Reviews',product.reviews],['Stock',`${product.stock} units`],
                ['Tags',product.tags.join(', ')]
              ].map(([k,v]) => (
                <div key={k} className="spec-row">
                  <span className="spec-key">{k}</span>
                  <span className="spec-val">{v}</span>
                </div>
              ))}
            </div>
          )}
          {tab === 'shipping' && (
            <p>Standard shipping 3-5 business days. Express 1-2 business days. Free shipping on orders over $200. Returns accepted within 30 days.</p>
          )}
        </div>
      </div>

      {product.related?.length > 0 && (
        <div className="container pd-related">
          <h2 className="section-title" style={{ marginBottom:32 }}>
            You May Also <span className="gold-text">Like</span>
          </h2>
          <div className="products-grid">
            {product.related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;