import React, { useEffect, useState } from 'react';
import { getCart, updateCartItem, removeCartItem, clearCart } from '../../services/cartService';
import { placeOrder } from '../../services/orderService';
import { useNavigate } from 'react-router-dom';
import '../../styles/customer.css';
import {ArrowLeft} from 'lucide-react';

export default function Cart(){
  const [cart, setCart] = useState({ items: [] });
  const navigate = useNavigate();

  const load = async () => {
    try {
      const data = await getCart();
      setCart(data || { items: [] });
    } catch (err) { console.error(err); }
  };

  useEffect(()=> { load(); }, []);

  const handleQtyChange = async (productId, q) => {
    await updateCartItem({ productId, quantity: q });
    await load();
  };

  const handleRemove = async (productId) => {
    await removeCartItem(productId);
    await load();
  };

  const handleCheckout = async () => {
    const items = cart.items.map(it => ({ product: it.product._id, quantity: it.quantity }));
    const totalAmount = cart.items.reduce((s, it) => s + it.quantity * it.price, 0);
    // go to payment page with cart summary
    navigate('/payment', { state: { items, totalAmount }});
  };
const handleBack= async () =>{
  await navigate('/home');
}
  return (
  
    <div style={{ padding:20 }}>
      <ArrowLeft size={26}  />
  <button onClick={handleBack}>back</button>
      <h1>Your Cart</h1>
      {cart.items.length === 0 ? <p>Cart is empty</p> : (
        <>
          <table className="cart-table" style={{ width:'100%', background:'#fff', padding:12, borderRadius:8 }}>
            <thead><tr><th>Product</th><th>Price</th><th>Qty</th><th>Subtotal</th><th></th></tr></thead>
            <tbody>
              {cart.items.map(it => (
                <tr key={it.product._id}>
                  <td>{it.product.name}</td>
                  <td>₹{it.price}</td>
                  <td><input type="number" min="1" value={it.quantity} onChange={e=>handleQtyChange(it.product._id, Number(e.target.value))} style={{ width:80 }} /></td>
                  <td>₹{it.price * it.quantity}</td>
                  <td><button onClick={()=>handleRemove(it.product._id)}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop:12 }}>
            <h3>Total: ₹{cart.items.reduce((s, it) => s + it.quantity * it.price, 0)}</h3>
            <button onClick={handleCheckout}>Proceed to Pay</button>
            <button onClick={async ()=>{ await clearCart(); load(); }}>Clear Cart</button>
          </div>
        </>
      )}
    </div>
  );
}
