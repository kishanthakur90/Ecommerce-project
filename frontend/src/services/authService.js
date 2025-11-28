import api from './api';

export const registerCustomer = (data) => api.post('/auth/register/customer', data);
export const registerVendor = (data) => api.post('/auth/register/vendor', data);
export const login = (data) => api.post('/auth/login', data);
