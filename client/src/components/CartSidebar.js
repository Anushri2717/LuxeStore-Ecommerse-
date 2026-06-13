import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './CartSidebar.css';

const CartSidebar = () => {
  const { items, isOpen, total, count, dispatch } = useCart();

  return (
    <>
      <div
        className={`cart-backdrop ${isOpen ? 'visible' : ''}`}
        onClick={() => dispatch({ type: 'CLOSE_CART' })}
      />
      <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2 className="cart-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            Your Cart
            {count > 0 && <span className="cart-count-badge">{count}</span>}
          </h2>
          <button
            className="btn btn-ghost"
            onClick={() => dispatch({ type: 'CLOSE_CART' })}
            style={{ padding:'6px 8px' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <div className="empty-icon">◈</div>
            <p>Your cart is empty</p>
            <p className="empty-sub">Add something beautiful to your collection</p>
            <button
              className="btn btn-primary"
              onClick={() => dispatch({ type: 'CLOSE_CART' })}
              style={{ marginTop:'16px' }}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item, i) => (
                <div
                  key={item.id}
                  className="cart-item"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="cart-item-img">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="cart-item-info">
                    <p className="cart-item-name">{item.name}</p>
                    <p className="cart-item-price">${item.price.toLocaleString()}</p>
                    <div className="cart-item-qty">
                      <button className="qty-btn" onClick={() =>
                        dispatch({ type:'UPDATE_QTY', payload:{ id:item.id, qty:item.quantity-1 } })
                      }>−</button>
                      <span>{item.quantity}</span>
                      <button className="qty-btn" onClick={() =>
                        dispatch({ type:'UPDATE_QTY', payload:{ id:item.id, qty:item.quantity+1 } })
                      }>+</button>
                    </div>
                  </div>
                  <button
                    className="cart-remove"
                    onClick={() => dispatch({ type:'REMOVE_ITEM', payload:item.id })}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-subtotal">
                <span>Subtotal</span><span>${total.toLocaleString()}</span>
              </div>
              <div className="cart-shipping">
                <span>Shipping</span>
                <span className="free-ship">{total > 200 ? 'Free' : '$15'}</span>
              </div>
              <div className="cart-divider" />
              <div className="cart-total">
                <span>Total</span>
                <span>${(total + (total > 200 ? 0 : 15)).toLocaleString()}</span>
              </div>
              <Link
                to="/checkout"
                className="btn btn-primary checkout-btn"
                onClick={() => dispatch({ type: 'CLOSE_CART' })}
              >
                Proceed to Checkout
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <button
                className="btn btn-outline clear-btn"
                onClick={() => dispatch({ type: 'CLEAR' })}
              >
                Clear Cart
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CartSidebar;