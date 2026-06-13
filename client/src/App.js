import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Navbar from './components/Navbar';
import CartSidebar from './components/CartSidebar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Wishlist from './pages/Wishlist';
import './styles/global.css';

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <WishlistProvider>
          <Navbar />
          <CartSidebar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="*" element={
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center',
                  justifyContent:'center', minHeight:'60vh', gap:16, paddingTop:80 }}>
                  <div style={{ fontSize:64, color:'var(--surface2)' }}>◈</div>
                  <h1 style={{ fontFamily:'var(--font-display)', fontSize:'2.5rem' }}>
                    404 — Page Not Found
                  </h1>
                  <a href="/" className="btn btn-primary">Return Home</a>
                </div>
              } />
            </Routes>
          </main>
          <Footer />
        </WishlistProvider>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;