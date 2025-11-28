import React, { useEffect, useState } from 'react';
import { getCustomers } from '../../services/adminService';
import { getVendors, deleteVendor as apiDeleteVendor } from '../../services/adminService';
import { getProducts, addProduct as apiAddProduct, deleteProduct as apiDeleteProduct } from '../../services/productService';
import { getAllOrders as getOrders } from '../../services/orderService';
import '../../styles/admin.css';
import { useAuth } from '../../context/AuthContext';
import {useNavigate} from 'react-router-dom';

const Tabs = {
  OVERVIEW: 'overview',
  CUSTOMERS: 'customers',
  VENDORS: 'vendors',
  PRODUCTS: 'products',
  ADD_PRODUCT: 'add_product',
  ORDERS: 'orders',
  LOGOUT:'logout'
};

export default function AdminDashboard() {
  const [tab, setTab] = useState(Tabs.OVERVIEW);
  const [customers, setCustomers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const { user ,logout} = useAuth();
  const navigate =useNavigate();

  useEffect(() => {
    if (tab === Tabs.CUSTOMERS) loadCustomers();
    if (tab === Tabs.VENDORS) loadVendors();
    if (tab === Tabs.PRODUCTS) loadProducts();
    if (tab === Tabs.ORDERS) loadOrders();
  }, [tab]);

  const loadCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (err) { console.error(err); }
  };

  const loadVendors = async () => {
    try {
      const data = await getVendors();
      setVendors(data);
    } catch (err) { console.error(err); }
  };

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) { console.error(err); }
  };

  const loadOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (err) { console.error(err); }
  };

  const handleDeleteVendor = async (id) => {
    if (!window.confirm('Delete vendor and their products?')) return;
    try {
      await apiDeleteVendor(id);
      await loadVendors();
      alert('Vendor deleted');
    } catch (err) { alert('Error deleting vendor'); console.error(err); }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete product?')) return;
    try {
      await apiDeleteProduct(id);
      await loadProducts();
      alert('Product deleted');
    } catch (err) { alert('Error'); console.error(err); }
  };


     const handleLogout = async (e) => {
    
    if (!window.confirm('you want to logout?')) return;
    try {
      await logout();
      alert('logout succesfully');
      navigate('/home');
    } catch (err) {
      console.log(err);
      alert('error to be a logout')
    }
  }
  

  return (
    <div className="admin-wrap">
      <aside className="admin-sidebar">
        <h2>Admin</h2>
        <p style={{fontSize:12}}>{user?.email}</p>
        <nav>
          <button onClick={()=>setTab(Tabs.OVERVIEW)}>Overview</button>
          <button onClick={()=>setTab(Tabs.CUSTOMERS)}>Customers</button>
          <button onClick={()=>setTab(Tabs.VENDORS)}>Vendors</button>
          <button onClick={()=>setTab(Tabs.PRODUCTS)}>Products</button>
          <button onClick={()=>setTab(Tabs.ADD_PRODUCT)}>Add Product</button>
          <button onClick={()=>setTab(Tabs.ORDERS)}>Orders</button>
          <button onClick={()=>setTab(Tabs.LOGOUT)}>LOGOUT</button>
        </nav>
      </aside>

      <main className="admin-main">
         {tab === Tabs.LOGOUT && (
          <div>
            
            <p>Are you sure want to log out</p>
            <div className="cards">
              <button  type='submit' onClick={handleLogout}>LogOut</button>
            </div>
            <p>Use left menu to manage entities.</p>
          </div>
        )}
        {tab === Tabs.OVERVIEW && (
          <div>
            <h1>Overview</h1>
            <p>Quick stats</p>
            <div className="cards">
              <div className="card">Customers: {customers.length}</div>
              <div className="card">Vendors: {vendors.length}</div>
              <div className="card">Products: {products.length}</div>
              <div className="card">Orders: {orders.length}</div>
            </div>
            <p>Use left menu to manage entities.</p>
          </div>
        )}

        {tab === Tabs.CUSTOMERS && (
          <div>
            <h1>Customers</h1>
            <table className="admin-table">
              <thead><tr><th>Name</th><th>Email</th><th>Mobile</th><th>City</th><th>Joined</th></tr></thead>
              <tbody>
                {customers.map(c => (
                  <tr key={c._id}>
                    <td>{c.name}</td>
                    <td>{c.email}</td>
                    <td>{c.mobile || '-'}</td>
                    <td>{c.city || '-'}</td>
                    <td>{new Date(c.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === Tabs.VENDORS && (
          <div>
            <h1>Vendors</h1>
            <table className="admin-table">
              <thead><tr><th>Name</th><th>Shop</th><th>Email</th><th>Mobile</th><th>Actions</th></tr></thead>
              <tbody>
                {vendors.map(v => (
                  <tr key={v._id}>
                    <td>{v.name}</td>
                    <td>{v.shopName || '-'}</td>
                    <td>{v.email}</td>
                    <td>{v.mobile || '-'}</td>
                    <td>
                      <button className="btn-danger" onClick={()=>handleDeleteVendor(v._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === Tabs.PRODUCTS && (
          <div>
            <h1>Products</h1>
            <div className="product-grid">
              {products.map(p => (
                <div key={p._id} className="product-card-admin">
                  <div className="img-wrap">
                    {p.images && p.images.length ? (
                      <img src={`http://localhost:5000/uploads/${p.images[0]}`} alt={p.name} />
                    ) : <div className="no-img">No image</div>}
                  </div>
                  <div className="info">
                    <h3>{p.name}</h3>
                    <p>₹{p.price}</p>
                    <p>{p.category || ''}</p>
                    <div className="actions">
                      <button onClick={()=>handleDeleteProduct(p._id)} className="btn-danger">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === Tabs.ADD_PRODUCT && <AddProductForm onAdded={loadProducts} />}

        {tab === Tabs.ORDERS && (
          <div>
            <h1>Orders</h1>
            <table className="admin-table">
              <thead><tr><th>OrderId</th><th>Customer</th><th>Amount</th><th>Payment</th><th>Status</th><th>Created</th></tr></thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o._id}>
                    <td>{o._id}</td>
                    <td>{o.customer?.name} ({o.customer?.email})</td>
                    <td>₹{o.totalAmount}</td>
                    <td>{o.paymentMethod} / {o.paymentStatus}</td>
                    <td>{o.status}</td>
                    <td>{new Date(o.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

/* AddProductForm component inside same file */
function AddProductForm({ onAdded }) {
  const [form, setForm] = useState({ name:'', description:'', price:'', category:'', stock:'' });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(prev => ({...prev, [e.target.name]: e.target.value}));
  const handleFiles = e => setFiles(Array.from(e.target.files || []));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return alert('Name and price required');
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('description', form.description);
      fd.append('price', form.price);
      fd.append('category', form.category);
      fd.append('stock', form.stock);
      files.forEach(f => fd.append('images', f));
      await apiAddProduct(fd);
      alert('Product added');
      setForm({ name:'', description:'', price:'', category:'', stock:'' });
      setFiles([]);
      if (onAdded) onAdded();
    } catch (err) {
      console.error(err);
      alert('Error adding product');
    } finally { setLoading(false); }
  };

  return (
    <form className="add-product-form" onSubmit={submit}>
      <h2>Add Product</h2>
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
      <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange}/>
      <input name="price" placeholder="Price" type="number" value={form.price} onChange={handleChange} required />
      <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
      <input name="stock" placeholder="Stock" type="number" value={form.stock} onChange={handleChange} />
      <input type="file" multiple accept="image/*" onChange={handleFiles} />
      <button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Product'}</button>
    </form>
  );
}
