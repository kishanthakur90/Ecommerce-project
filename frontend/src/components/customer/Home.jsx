import React, { useEffect, useState } from 'react';
import { getProducts } from '../../services/productService';
import ProductCard from '../common/ProductCard';
import '../../styles/customer.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react'; // 🛒 Lucide icon

export default function Home() {
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [hasNotification, setHasNotification] = useState(false);
  const [cartCount, setCartCount] = useState(0); // 🧠 badge number
  const { logout } = useAuth();
  const navigate = useNavigate();

  const load = async () => {
    try {
      const data = await getProducts({ q: q || undefined, category: category || undefined });
      setProducts(data);
      const cats = Array.from(new Set(data.map(p => p.category).filter(Boolean)));
      setCategories(cats);
      
    } catch (err) { console.error(err); }
  };

  useEffect(() => { load(); }, [q, category]);

  useEffect(() => {
    // 🧠 Load badge count & notification flag
    const stored = localStorage.getItem('cartNotification');
    const count = Number(localStorage.getItem('cartCount') || 0);
    if (stored === 'true' && count > 0) {
      setHasNotification(true);
      setCartCount(count);
    }

    // 🧠 Listen to updates
    const handleChange = () => {
      const value = localStorage.getItem('cartNotification');
      const newCount = Number(localStorage.getItem('cartCount') || 0);
      setHasNotification(value === 'true' && newCount > 0);
      setCartCount(newCount);
    };
    window.addEventListener('storageChange', handleChange);
    return () => window.removeEventListener('storageChange', handleChange);
  }, []);

  const handleLogout = async () => {
    if (!window.confirm('you want to logout?')) return;
    try {
      await logout();
      alert('logout succesfully');
      navigate('/');
    } catch (err) {
      console.log(err);
      alert('error to be a logout');
    }
  };
  const handleorder = () => {
    navigate('/myorders');
  }

  const handleCartClick = () => {
    // 🧹 Reset badge on cart open
    localStorage.setItem('cartNotification', 'false');
    localStorage.setItem('cartCount', '0');
    setHasNotification(false);
    setCartCount(0);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Shop</h1>

      <div className="search-bar">
        <input placeholder="Search product by name..." value={q} onChange={e => setQ(e.target.value)} />
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
         <div>
          <button type='submit' className='system' onClick={handleorder}>orders</button>
        </div>
        <div>
          <button type='submit' className='system' onClick={handleLogout}>logout</button>
        </div>

        {/* 🛒 Cart with Animated Number Badge */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <button type='button' className='system' onClick={handleCartClick}>
            <Link to='/Cart' style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', color: 'inherit' }}>
              <ShoppingCart size={22} />
              <span>Cart</span>
            </Link>
          </button>

          {hasNotification && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'absolute',
                top: -6,
                right: -6,
                minWidth: 18,
                height: 18,
                backgroundColor: 'red',
                color: 'white',
                fontSize: 12,
                fontWeight: 'bold',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 6px rgba(255,0,0,0.8)',
              }}
            >
              {cartCount}
            </motion.div>
          )}
        </div>
      </div>

      <div className="product-grid">
        {products.map(p => (
          <Link to={`/product/${p._id}`} key={p._id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <ProductCard product={p} />
          </Link>
        ))}
        {products.length === 0 && <p>No products found.</p>}
      </div>
    </div>
  );
}
