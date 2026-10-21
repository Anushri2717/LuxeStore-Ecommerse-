import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { BASE } from '../hooks/useApi';
import './Checkout.css';

const Checkout = () => {
  const { items, total, dispatch } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [form, setForm] = useState({
    firstName:'', lastName:'', email:'', phone:'',
    address:'', city:'', state:'', zip:'', country:'US',
    cardName:'', cardNumber:'', expiry:'', cvv:''
  });
  const [errors, setErrors] = useState({});

  const shipping = total > 200 ? 0 : 15;
  const tax = Math.round(total * 0.08);
  const grandTotal = total + shipping + tax;

  const handle = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(p => ({ ...p, [e.target.name]: '' }));
  };

  const validate = (fields) => {
    const errs = {};
    fields.forEach(f => { if (!form[f]) errs[f] = 'Required'; });
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    return errs;
  };

  const nextStep = () => {
    const fields = step === 1
      ? ['firstName','lastName','email','address','city','state','zip']
      : ['cardName','cardNumber','expiry','cvv'];
    const errs = validate(fields);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setStep(s => s + 1);
  };

  const placeOrder = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${BASE}/checkout`, { items, total: grandTotal });
      setOrderId(res.data.orderId);
      dispatch({ type: 'CLEAR' });
      setStep(4);
    } catch {
      alert('Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ name, label, placeholder, type='text', half }) => (
    <div className={`field ${half ? 'half' : ''}`}>
      <label className="field-label">{label}</label>
      <input
        name={name} type={type}
        value={form[name]} onChange={handle}
        placeholder={placeholder}
        className={`input ${errors[name] ? 'error' : ''}`}
      />
      {errors[name] && <span className="field-error">{errors[name]}</span>}
    </div>
  );

  if (step === 4) return (
    <div className="checkout-page">
      <div className="container success-container animate-scale-in">
        <div className="success-icon">✓</div>
        <h1 className="success-title">Order Confirmed!</h1>
        <p className="success-sub">Your order <strong>{orderId}</strong> has been placed.</p>
        <p className="success-sub">Confirmation sent to <strong>{form.email}</strong></p>
        <div className="success-amount">
          Total Charged: <span className="gold-text">${grandTotal.toLocaleString()}</span>
        </div>
        <Link to="/" className="btn btn-primary" style={{ marginTop:32, padding:'14px 40px' }}>
          Continue Shopping
        </Link>
      </div>
    </div>
  );

  return (
    <div className="checkout-page">
      <div className="container checkout-inner">
        <div className="checkout-main">
          <div className="steps">
            {['Shipping','Payment','Review'].map((s, i) => (
              <React.Fragment key={s}>
                <div className={`step ${step > i+1 ? 'done' : step === i+1 ? 'active' : ''}`}>
                  <div className="step-circle">{step > i+1 ? '✓' : i+1}</div>
                  <span className="step-label">{s}</span>
                </div>
                {i < 2 && <div className={`step-line ${step > i+1 ? 'done' : ''}`} />}
              </React.Fragment>
            ))}
          </div>

          {step === 1 && (
            <div className="form-section animate-fade-up">
              <h2 className="form-title">Shipping Information</h2>
              <div className="form-grid">
                <Field name="firstName" label="First Name" placeholder="John" half />
                <Field name="lastName" label="Last Name" placeholder="Doe" half />
                <Field name="email" label="Email" placeholder="john@example.com" type="email" />
                <Field name="phone" label="Phone" placeholder="+1 (555) 000-0000" />
                <Field name="address" label="Address" placeholder="123 Main Street" />
                <Field name="city" label="City" placeholder="New York" half />
                <Field name="state" label="State" placeholder="NY" half />
                <Field name="zip" label="ZIP Code" placeholder="10001" half />
                <div className="field half">
                  <label className="field-label">Country</label>
                  <select name="country" value={form.country} onChange={handle} className="input">
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="CA">Canada</option>
                    <option value="AU">Australia</option>
                  </select>
                </div>
              </div>
              <button className="btn btn-primary next-btn" onClick={nextStep}>
                Continue to Payment →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="form-section animate-fade-up">
              <h2 className="form-title">Payment Details</h2>
              <div className="card-preview">
                <div className="card-chip">▬</div>
                <div className="card-num">{form.cardNumber || '•••• •••• •••• ••••'}</div>
                <div className="card-bottom">
                  <span>{form.cardName || 'CARDHOLDER NAME'}</span>
                  <span>{form.expiry || 'MM/YY'}</span>
                </div>
              </div>
              <div className="form-grid">
                <Field name="cardName" label="Name on Card" placeholder="John Doe" />
                <Field name="cardNumber" label="Card Number" placeholder="1234 5678 9012 3456" />
                <Field name="expiry" label="Expiry" placeholder="MM/YY" half />
                <Field name="cvv" label="CVV" placeholder="•••" half />
              </div>
              <div className="form-actions">
                <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
                <button className="btn btn-primary next-btn" onClick={nextStep}>Review Order →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="form-section animate-fade-up">
              <h2 className="form-title">Review Your Order</h2>
              <div className="review-items">
                {items.map(item => (
                  <div key={item.id} className="review-item">
                    <img src={item.image} alt={item.name} className="review-img" />
                    <div className="review-info">
                      <p className="review-name">{item.name}</p>
                      <p className="review-qty">Qty: {item.quantity}</p>
                    </div>
                    <span className="review-price">${(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="review-address">
                <p className="review-section-title">Delivering to:</p>
                <p>{form.firstName} {form.lastName}</p>
                <p>{form.address}, {form.city}, {form.state} {form.zip}</p>
              </div>
              <div className="form-actions">
                <button className="btn btn-outline" onClick={() => setStep(2)}>← Back</button>
                <button
                  className="btn btn-primary next-btn"
                  onClick={placeOrder}
                  disabled={loading}
                >
                  {loading ? 'Placing Order...' : `Place Order · $${grandTotal.toLocaleString()}`}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="order-summary">
          <h3 className="summary-title">Order Summary</h3>
          <div className="summary-items">
            {items.map(item => (
              <div key={item.id} className="summary-item">
                <img src={item.image} alt={item.name} className="summary-img" />
                <div className="summary-info">
                  <p>{item.name}</p>
                  <p className="summary-qty">× {item.quantity}</p>
                </div>
                <span className="summary-price">${(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="summary-lines">
            <div className="summary-line"><span>Subtotal</span><span>${total.toLocaleString()}</span></div>
            <div className="summary-line">
              <span>Shipping</span>
              <span className={shipping === 0 ? 'free' : ''}>{shipping === 0 ? 'Free' : `$${shipping}`}</span>
            </div>
            <div className="summary-line"><span>Tax (8%)</span><span>${tax.toLocaleString()}</span></div>
            <div className="summary-total"><span>Total</span><span>${grandTotal.toLocaleString()}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;