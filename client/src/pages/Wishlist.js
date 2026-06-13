import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import './Wishlist.css';

const Wishlist = () => {
  const { items, toggle } = useWishlist();

  return (
    <div className="wishlist-page">
      <div className="container">
        <div className="wishlist-header">
          <div>
            <p className="section-eyebrow">Saved Items</p>
            <h1 className="section-title">My Wishlist</h1>
          </div>
          {items.length > 0 && (
            <span className="wishlist-count">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
          )}
        </div>

        {items.length === 0 ? (
          <div className="wishlist-empty animate-fade-up">
            <div className="empty-heart">♡</div>
            <h2>Your wishlist is empty</h2>
            <p>Click the heart icon on any product to save it here.</p>
            <Link to="/shop" className="btn btn-primary" style={{ marginTop:24 }}>
              Start Browsing →
            </Link>
          </div>
        ) : (
          <>
            <div className="products-grid">
              {items.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
            <div className="wishlist-actions">
              <button
                className="btn btn-outline"
                onClick={() => items.forEach(item => toggle(item))}
              >
                Clear Wishlist
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;