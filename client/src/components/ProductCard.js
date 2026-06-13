import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './ProductCard.css';

const Stars = ({ rating }) => (
  <div className="stars">
    {[1,2,3,4,5].map(s => (
      <span key={s} className={`star ${s <= Math.round(rating) ? '' : 'empty'}`}>★</span>
    ))}
  </div>
);

const ProductCard = ({ product, index = 0 }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [adding, setAdding] = useState(false);
  const { dispatch } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  const addToCart = (e) => {
    e.preventDefault(); e.stopPropagation();
    setAdding(true);
    dispatch({ type: 'ADD_ITEM', payload: product });
    setTimeout(() => setAdding(false), 1200);
  };

  const handleWishlist = (e) => {
    e.preventDefault(); e.stopPropagation();
    toggle(product);
  };

  const discount = product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  return (
    <div className="product-card animate-fade-up" style={{ animationDelay: `${index * 0.08}s` }}>
      <Link to={`/product/${product.id}`} className="card-link">
        <div className="card-image-wrap">
          {!imgLoaded && <div className="skeleton card-img-skeleton" />}
          <img
            src={product.image}
            alt={product.name}
            className={`card-image ${imgLoaded ? 'loaded' : ''}`}
            onLoad={() => setImgLoaded(true)}
          />
          <div className="card-badges">
            {product.badge === 'bestseller' && <span className="badge badge-gold">★ Bestseller</span>}
            {product.badge === 'new' && <span className="badge badge-new">New</span>}
            {product.badge === 'sale' && <span className="badge badge-sale">Sale</span>}
          </div>
          <button
            className={`wishlist-btn ${wishlisted ? 'active' : ''}`}
            onClick={handleWishlist}
          >
            <svg width="16" height="16" viewBox="0 0 24 24"
              fill={wishlisted ? 'currentColor' : 'none'}
              stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06
                a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78
                1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
          <div className="card-overlay">
            <button className={`add-to-cart-btn ${adding ? 'added' : ''}`} onClick={addToCart}>
              {adding ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Added!
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 0 1-8 0"/>
                  </svg>
                  Add to Cart
                </>
              )}
            </button>
          </div>
        </div>
        <div className="card-body">
          <p className="card-category">{product.category}</p>
          <h3 className="card-name">{product.name}</h3>
          <div className="card-rating">
            <Stars rating={product.rating} />
            <span className="rating-count">({product.reviews})</span>
          </div>
          <div className="card-pricing">
            <span className="card-price">${product.price.toLocaleString()}</span>
            {discount > 0 && (
              <>
                <span className="card-original">${product.originalPrice.toLocaleString()}</span>
                <span className="card-discount">-{discount}%</span>
              </>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;