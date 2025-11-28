import api from './api';

export const getMyProfile = async () => {
  const res = await api.get('/vendors/me');
  return res.data;
};

export const updateMyProfile = async (formData) => {
  const res = await api.put('/vendors/me', formData, { headers: { 'Content-Type': 'multipart/form-data' }});
  return res.data;
};

export const getMyProducts = async () => {
  const res = await api.get('/vendors/me/products');
  return res.data;
};

export const getVendorProducts = async (vendorId) => {
  const res = await api.get(`/vendors/${vendorId}/products`);
  return res.data;
};

export const getMyOrders = async () => {
  const res = await api.get('/vendors/me/orders');
  return res.data;
};
