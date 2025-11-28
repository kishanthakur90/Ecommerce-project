import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login as apiLogin } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import '../../styles/auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const res = await apiLogin({ email, password });
      const { token, user } = res.data;
      login({ token, user });
      // redirect based on role
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'vendor') navigate('/vendor/dashboard');
      else navigate('/home');
    } catch (error) {
      setErr(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {err && <p className="error">{err}</p>}
        <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required/>
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required/>
        <button type="submit">Login</button>
        <p>New? <Link to="/register">Register here</Link></p>
      </form>
    </div>
  );
};

export default Login;
