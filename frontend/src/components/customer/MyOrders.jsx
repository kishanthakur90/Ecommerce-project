import React, { useEffect, useState } from 'react';
import { getMyOrders } from '../../services/orderService';

export default function MyOrders(){
  const [orders, setOrders] = useState([]);
  useEffect(()=> {
    (async ()=> {
      try {
        const data = await getMyOrders();
        setOrders(data);
      } catch (err) { console.error(err); }
    })();
  }, []);
  return (
    <div style={{ padding:20 }}>
      <h1>My Orders</h1>
      {orders.length===0 ? <p>No orders yet.</p> : (
        <div>
          {orders.map(o => (
            <div key={o._id} style={{ background:'#fff', marginBottom:12, padding:12, borderRadius:8 }}>
              <h3>Order {o._id}</h3>
              <p>Amount: ₹{o.totalAmount} — Payment: {o.paymentMethod} / {o.paymentStatus}</p>
              <p>Status: {o.status}</p>
            <ul>
  {o?.items?.map((it, i) => (
    <li key={it?.product?._id || i}>
      {(it?.product?.name ?? "Unknown Product")} x {(it?.quantity ?? 0)} — ₹{(it?.price ?? 0)}
    </li>
  ))}
</ul>

              <small>Placed: {new Date(o.createdAt).toLocaleString()}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
