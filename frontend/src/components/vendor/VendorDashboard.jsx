import React, { useEffect, useState } from 'react';
import { getMyProducts, getMyOrders, getMyProfile, updateMyProfile as apiUpdateProfile } from '../../services/vendorService';
import { addProduct as apiAddProduct, updateProduct as apiUpdateProduct, deleteProduct as apiDeleteProduct } from '../../services/productService';
import '../../styles/vendor.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function VendorDashboard(){
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('products'); // products | add | orders | profile | edit
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState(null);

  // forms
  const emptyForm = { name:'', description:'', price:'', category:'', stock:'' };
  const [form, setForm] = useState(emptyForm);
  const [files, setFiles] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(()=> { if (tab === 'products') loadProducts(); if (tab==='orders') loadOrders(); if (tab==='profile') loadProfile(); }, [tab]);

  async function loadProducts(){
    try {
      const data = await getMyProducts();
      setProducts(data);
    } catch(err){ console.error(err); }
  }
  async function loadOrders(){
    try {
      const data = await getMyOrders();
      setOrders(data);
    } catch(err){ console.error(err); }
  }
  async function loadProfile(){
    try {
      const data = await getMyProfile();
      setProfile(data);
    } catch(err){ console.error(err); }
  }

  const handleFiles = e => setFiles(Array.from(e.target.files || []));

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    if(!form.name || !form.price) return alert('Name and price required');
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('description', form.description || '');
      fd.append('price', form.price);
      fd.append('category', form.category || '');
      fd.append('stock', form.stock || 0);
      files.forEach(f => fd.append('images', f));

      if (editingId) {
        await apiUpdateProduct(editingId, fd);
        alert('Product updated');
      } else {
        await apiAddProduct(fd);
        alert('Product added');
      }
      setForm(emptyForm);
      setFiles([]);
      setEditingId(null);
      setTab('products');
      await loadProducts();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({ name: product.name, description: product.description || '', price: product.price, category: product.category || '', stock: product.stock || 0 });
    setFiles([]); // show existing images in product view (can't prefill file input)
    setTab('add'); // reuse add form for edit
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete product?')) return;
    try {
      await apiDeleteProduct(id);
      alert('Deleted');
      await loadProducts();
    } catch (err){ console.error(err); alert('Error deleting'); }
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

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      if (profile.name) fd.append('name', profile.name);
      if (profile.shopName) fd.append('shopName', profile.shopName);
      if (profile.mobile) fd.append('mobile', profile.mobile);
      if (profile.city) fd.append('city', profile.city);
      if (profile.state) fd.append('state', profile.state);
      if (profile.pincode) fd.append('pincode', profile.pincode);
      // add profilePic file input with id 'profilePic' in form
      const fileInput = document.querySelector('#profilePicInput');
      if (fileInput && fileInput.files && fileInput.files[0]) fd.append('profilePic', fileInput.files[0]);
      const updated = await apiUpdateProfile(fd);
      alert('Profile updated');
      setProfile(updated);
    } catch (err) { console.error(err); alert('Error updating'); }
  };

  return (
    <div className="vendor-wrap">
      <aside className="vendor-sidebar">
        <h2>Vendor</h2>
        <p style={{fontSize:12}}>{user?.email}</p>
        <nav>
          <button onClick={()=>setTab('products')}>My Products</button>
          <button onClick={()=>{ setEditingId(null); setForm(emptyForm); setTab('add'); }}>Add Product</button>
          <button onClick={()=>setTab('orders')}>Orders</button>
          <button onClick={()=>setTab('profile')}>Profile</button>
          <button onClick={()=>setTab('logout')}>logout</button>

        </nav>
      </aside>

      <main className="vendor-main">
        {tab === 'products' && (
          <div>
            <h1>My Products</h1>
            <div className="product-grid">
              {products.map(p => (
                <div key={p._id} className="product-card-admin">
                  <div className="img-wrap">
                    {p.images && p.images.length ? (
                      <img src={`http://localhost:5000/uploads/${p.images[0]}`} alt={p.name}/>
                    ) : <div className="no-img">No image</div>}
                  </div>
                  <div className="info">
                    <h3>{p.name}</h3>
                    <p>₹{p.price}</p>
                    <p>Stock: {p.stock}</p>
                    <div className="actions">
                      <button onClick={()=>handleEdit(p)}>Edit</button>
                      <button className="btn-danger" onClick={()=>handleDelete(p._id)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
              {products.length === 0 && <p>No products yet. Click Add Product.</p>}
            </div>
          </div>
        )}

        { (tab === 'logout') && (
          <div>
            <p>Are you sure want to log out</p>
            <div className="cards">
              <button  type='submit' onClick={handleLogout}>LogOut</button>
            </div>
          </div>
        )}
        { (tab === 'add') && (
          <div>
            <h1>{editingId ? 'Edit Product' : 'Add Product'}</h1>
            <form className="add-product-form" onSubmit={handleAddOrUpdate}>
              <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
              <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange}/>
              <input name="price" placeholder="Price" type="number" value={form.price} onChange={handleChange} required />
              <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
              <input name="stock" placeholder="Stock" type="number" value={form.stock} onChange={handleChange} />
              <input type="file" multiple accept="image/*" onChange={handleFiles} />
              <button type="submit" disabled={loading}>{loading ? 'Saving...' : (editingId ? 'Update Product' : 'Add Product')}</button>
            </form>
          </div>
        )}

        { tab === 'orders' && (
          <div>
            <h1>Orders (Your Items)</h1>
            <table className="admin-table">
              <thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Amount</th><th>Payment</th><th>Status</th></tr></thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o._id}>
                    <td>{o._id}</td>
                    <td>{o.customer?.name} ({o.customer?.email})</td>
                    <td>
                      <ul>
                        {o.items.map(it => (
                          <li key={it.product?._id}>
                            {it.product?.name} x {it.quantity} — ₹{it.price}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td>₹{o.totalAmount}</td>
                    <td>{o.paymentMethod} / {o.paymentStatus}</td>
                    <td>{o.status}</td>
                  </tr>
                ))}
                {orders.length===0 && <tr><td colSpan="6">No orders yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        { tab === 'profile' && (
          <div>
            <h1>Profile</h1>
            <form className="profile-form" onSubmit={handleProfileUpdate}>
              <input value={profile?.name || ''} onChange={(e)=>setProfile({...profile, name:e.target.value})} placeholder="Name" />
              <input value={profile?.shopName || ''} onChange={(e)=>setProfile({...profile, shopName:e.target.value})} placeholder="Shop Name" />
              <input value={profile?.mobile || ''} onChange={(e)=>setProfile({...profile, mobile:e.target.value})} placeholder="Mobile" />
              <input value={profile?.city || ''} onChange={(e)=>setProfile({...profile, city:e.target.value})} placeholder="City" />
              <input value={profile?.state || ''} onChange={(e)=>setProfile({...profile, state:e.target.value})} placeholder="State" />
              <input value={profile?.pincode || ''} onChange={(e)=>setProfile({...profile, pincode:e.target.value})} placeholder="Pincode" />
              <div style={{margin:'8px 0'}}>
                <label>Profile picture: </label>
                <input id="profilePicInput" type="file" accept="image/*" />
              </div>
              <button type="submit">Update Profile</button>
            </form>
            <div style={{marginTop:12}}>
              <h3>Preview</h3>
              {profile?.profilePic ? <img style={{width:120}} src={`http://localhost:5000/uploads/${profile.profilePic}`} alt="pf" /> : <p>No picture</p>}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
