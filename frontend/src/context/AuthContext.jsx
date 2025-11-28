import React,{createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user)); else localStorage.removeItem('user');
    if (token) localStorage.setItem('token', token); else localStorage.removeItem('token');
  }, [user, token]);

  const login = ({ token, user }) => {
    setToken(token);
    setUser(user);
  };
  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
