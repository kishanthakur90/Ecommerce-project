import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login';
import RegisterChoice from './components/auth/RegisterChoice';
import RegisterCustomer from './components/auth/RegisterCustomer';
import RegisterVendor from './components/auth/RegisterVendor';
import AdminDashboard from './components/admin/AdminDashboard';
import VendorDashboard from './components/vendor/VendorDashboard';
import Home from './components/customer/Home';
import ProtectedRoute from './components/common/ProtectedRoute';
import ProductDetails from './components/customer/ProductDetails';
import Cart from './components/customer/Cart';
import Payment from './components/customer/Payment';
import MyOrders from './components/customer/MyOrders';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<RegisterChoice />} />
      <Route path="/register/customer" element={<RegisterCustomer />} />
      <Route path="/register/vendor" element={<RegisterVendor />} />

      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>
      } />

      <Route path="/vendor/dashboard" element={
        <ProtectedRoute allowedRoles={['vendor']}><VendorDashboard /></ProtectedRoute>
      } />

      <Route path="/home" element={
        <ProtectedRoute allowedRoles={['customer']}><Home /></ProtectedRoute>
      } />

      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<ProtectedRoute allowedRoles={['customer']}><Cart /></ProtectedRoute>} />
      <Route path="/payment" element={<ProtectedRoute allowedRoles={['customer']}><Payment /></ProtectedRoute>} />
      <Route path="/myorders" element={<ProtectedRoute allowedRoles={['customer']}><MyOrders /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
