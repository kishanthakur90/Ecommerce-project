import React from 'react';

export default function ProductCard({ product }) {
  const img = product.images && product.images.length ? `http://localhost:5000/uploads/${product.images[0]}` : null;
  
  return (
    <div className="product-card">
      {img ? <img src={img} alt={product.name} /> : <div className="no-img">No image</div>}
      <div className="product-body">
        <h3>{product.name}</h3>
        <p>₹{product.price}</p>
         
      </div>
    </div>
  );
}
