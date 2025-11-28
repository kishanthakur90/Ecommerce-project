import api from './api';

export const getCustomers = async () => {
  const res = await api.get('/admin/customers');
  return res.data;
};

export const getVendors = async () => {
  const res = await api.get('/admin/vendors');
  return res.data;
};

export const deleteVendor = async (id) => {
  const res = await api.delete(`/admin/vendors/${id}`);
  return res.data;
};
