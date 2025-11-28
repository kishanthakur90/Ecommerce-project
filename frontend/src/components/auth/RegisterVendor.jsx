import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerVendor } from '../../services/authService';
import '../../styles/auth.css';

const RegisterVendor = () => {
  const [form, setForm] = useState({ name:'', shopName:'', email:'', password:'', mobile:'', city:'', state:'', pincode:'' });
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      await registerVendor(form);
      alert('Vendor registered. Please login.');
      navigate('/');
    } catch (error) {
      setErr(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Vendor Register</h2>
        {err && <p className="error">{err}</p>}
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required/>
        <input name="shopName" placeholder="Shop Name" value={form.shopName} onChange={handleChange}/>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required/>
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required/>
        <input name="mobile" placeholder="Mobile" value={form.mobile} onChange={handleChange}/>
        <input name="city" placeholder="City" value={form.city} onChange={handleChange}/>
        <input name="state" placeholder="State" value={form.state} onChange={handleChange}/>
        <input name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange}/>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterVendor;
