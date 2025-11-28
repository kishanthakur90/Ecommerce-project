import api from './api';

// ✅ Search + category filter supported version
export const getProducts = async (params = {}) => {
  const res = await api.get('/products', { params });
  return res.data;
};

export const getProduct = async (id) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};

export const addProduct = async (formData) => {
  const res = await api.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};

export const updateProduct = async (id, formData) => {
  const res = await api.put(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};
