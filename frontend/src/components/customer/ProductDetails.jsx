import React, { useEffect, useState } from 'react';
import { getProduct } from '../../services/productService';
import { addToCart } from '../../services/cartService';
import { useNavigate, useParams } from 'react-router-dom';
import { Star } from 'lucide-react'; // ⭐ Lucide icon
import '../../styles/customer.css';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0); // ⭐ rating state
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const data = await getProduct(id);
        setProduct(data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [id]);

  const handleAddToCart = async () => {
    await addToCart({ productId: id, quantity: qty });
    alert('Added to cart');

    const current = Number(localStorage.getItem('cartCount') || 0);
    const updated = current + qty;
    localStorage.setItem('cartCount', updated.toString());
    localStorage.setItem('cartNotification', 'true');
    window.dispatchEvent(new Event('storageChange'));
  };

  const handleBuyNow = async () => {
    navigate('/payment', {
      state: { items: [{ product: id, quantity: qty }], totalAmount: product.price * qty },
    });
  };

  if (!product) return <div>Loading...</div>;

  const img =
    product.images && product.images.length
      ? `http://localhost:5000/uploads/${product.images[0]}`
      : null;

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ width: 360 }}>
          {img ? (
            <img src={img} alt={product.name} style={{ width: '100%', borderRadius: 8 }} />
          ) : (
            <div style={{ height: 360, background: '#f0f0f0' }} />
          )}
        </div>

        <div style={{ flex: 1 }}>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <h3>₹{product.price}</h3>

          {/* ⭐ Rating Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, margin: '10px 0' }}>
            {[1, 2, 3, 4, 5].map((num) => (
              <Star
                key={num}
                size={28}
                onClick={() => setRating(num)}
                color={num <= rating ? 'gold' : 'gray'}
                fill={num <= rating ? 'gold' : 'none'}
                style={{ cursor: 'pointer' }}
              />
            ))}
            <span style={{ marginLeft: 8, color: '#555' }}>{rating}/5</span>
          </div>

          {/* Quantity + Buttons */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 12 }}>
            <label>Qty:</label>
            <input
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              style={{ width: 80, padding: 6 }}
            />
            <button onClick={handleAddToCart}>Add to cart</button>
            <button onClick={handleBuyNow} style={{ background: '#2b6cb0', color: '#fff' }}>
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
