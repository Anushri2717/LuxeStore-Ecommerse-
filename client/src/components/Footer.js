import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer-glow" />
    <div className="container">
      <div className="footer-grid">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <span className="logo-icon">◈</span>
            <span>LUXE<span className="logo-accent">STORE</span></span>
          </Link>
          <p className="footer-tagline">
            Curated luxury for the discerning few. Quality, craftsmanship,
            and elegance delivered to your door.
          </p>
          <div className="socials">
            {['I','T','P','Y'].map((s, i) => (
              <a key={i} href="#" className="social-btn">{s}</a>
            ))}
          </div>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Shop</h4>
          <ul className="footer-links">
            {['All Products','Watches','Fashion','Electronics','Home & Living','Accessories'].map(item => (
              <li key={item}><Link to="/shop" className="footer-link">{item}</Link></li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Support</h4>
          <ul className="footer-links">
            {['FAQ','Shipping Policy','Returns & Exchanges','Track Your Order','Size Guide','Contact Us'].map(item => (
              <li key={item}><a href="#" className="footer-link">{item}</a></li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Newsletter</h4>
          <p className="footer-sub">Get exclusive offers and early access to new arrivals.</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Your email address" className="input" />
            <button className="btn btn-primary newsletter-btn">Subscribe</button>
          </div>
          <div className="trust-badges">
            <div className="trust-item">🔒 Secure Payment</div>
            <div className="trust-item">🚚 Free Shipping $200+</div>
            <div className="trust-item">🔄 30-Day Returns</div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} LuxeStore. All rights reserved.</p>
        <div className="footer-legal">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Cookie Policy</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;