import React, { useEffect, useState } from 'react';
import { placeOrder } from '../../services/orderService';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../styles/customer.css';
import api from '../../services/api';

export default function Payment(){
  const loc = useLocation();
  const navigate = useNavigate();
  const { items = [], totalAmount = 0 } = loc.state || {};
  const [method, setMethod] = useState('Card');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      // Simulate payment processing — call payment endpoint to "process"
      await api.post('/payments/process', { items, paymentMethod: method, totalAmount });
      // create order now (server will mark Paid for non-COD or status)
      const order = await placeOrder({ items, paymentMethod: method });
      setSuccess(true);
      // show animated success for 1.8s then redirect to orders
      setTimeout(() => navigate('/cart'), 1800);
    } catch (err) {
      console.error(err);
      alert('Payment failed');
    } finally { setLoading(false); }
  };

  if (success) {
    return (
      <div style={{ padding:20 }}>
        <div className="payment-success">
          <div className="tick">✓</div>
          <h2>Payment Successful</h2>
          <p>Your order has been placed.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding:20 }}>
      <h1>Payment</h1>
      <p>Amount: <strong>₹{totalAmount}</strong></p>
      <div>
        <label>Select payment method:</label>
        <select value={method} onChange={e=>setMethod(e.target.value)}>
          <option value="Card">Card</option>
          <option value="UPI">UPI</option>
          <option value="COD">COD</option>
        </select>
      </div>
      <div style={{ marginTop:12 }}>
        <button onClick={handlePay} disabled={loading}>{loading ? 'Processing...' : 'Pay Now'}</button>
      </div>
    </div>
  );
}
