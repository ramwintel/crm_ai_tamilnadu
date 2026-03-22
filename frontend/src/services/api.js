import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

// Inject token on every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('crm_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const emailLogin = (email, name) => API.post('/auth/login', { email, name });
export const getMe = () => API.get('/auth/me');

// Payment
export const createPaymentOrder = () => API.post('/payment/create-order');
export const verifyPayment = (order_id) => API.get(`/payment/verify?order_id=${order_id}`);

// Customers
export const getCustomers = (params) => API.get('/customers', { params });
export const getCustomer = (id) => API.get(`/customers/${id}`);
export const createCustomer = (data) => API.post('/customers', data);
export const updateCustomer = (id, data) => API.put(`/customers/${id}`, data);
export const deleteCustomer = (id) => API.delete(`/customers/${id}`);
export const getCustomerStats = () => API.get('/customers/stats');

// Leads
export const getLeads = (params) => API.get('/leads', { params });
export const getLead = (id) => API.get(`/leads/${id}`);
export const createLead = (data) => API.post('/leads', data);
export const updateLead = (id, data) => API.put(`/leads/${id}`, data);
export const deleteLead = (id) => API.delete(`/leads/${id}`);
export const getLeadStats = () => API.get('/leads/stats');
