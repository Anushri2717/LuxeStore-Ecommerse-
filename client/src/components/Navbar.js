import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { count, dispatch } = useCart();
  const { items: wishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/shop?category=watches', label: 'Watches' },
    { to: '/shop?category=fashion', label: 'Fashion' },
    { to: '/shop?category=electronics', label: 'Electronics' },
  ];

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${menuOpen ? 'menu-open' : ''}`}>
        <div className="nav-inner">
          <Link to="/" className="nav-logo">
            <span className="logo-icon">◈</span>
            <span className="logo-text">LUXE<span className="logo-accent">STORE</span></span>
          </Link>

          <ul className="nav-links">
            {navLinks.map(link => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            <button className="nav-btn" onClick={() => setSearchOpen(true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </button>

            <Link to="/wishlist" className="nav-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06
                  a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78
                  1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {wishlist.length > 0 && (
                <span className="nav-badge wishlist-badge">{wishlist.length}</span>
              )}
            </Link>

            <button className="nav-btn" onClick={() => dispatch({ type: 'TOGGLE_CART' })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {count > 0 && <span className="nav-badge">{count}</span>}
            </button>

            <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
              <span/><span/><span/>
            </button>
          </div>
        </div>

        <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} className="mobile-link">{link.label}</Link>
          ))}
        </div>
      </nav>

      {searchOpen && (
        <div className="search-overlay" onClick={() => setSearchOpen(false)}>
          <div className="search-modal animate-scale-in" onClick={e => e.stopPropagation()}>
            <form onSubmit={handleSearch} className="search-form">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                ref={searchRef}
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="btn btn-primary" style={{ padding:'10px 20px' }}>
                Search
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => setSearchOpen(false)}>
                ✕
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;