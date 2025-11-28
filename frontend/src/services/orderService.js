import api from './api';

export const placeOrder = async (payload) => {
  // payload: { items? , paymentMethod } or use cart on server
  const res = await api.post('/orders', payload);
  return res.data;
};

export const getMyOrders = async () => {
  const res = await api.get('/orders/me');
  return res.data;
};

export const getAllOrders = async () => {
  const res = await api.get('/orders');
  return res.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const res = await api.put(`/orders/${orderId}/status`, { status });
  return res.data;
};
