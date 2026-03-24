import axios from 'axios';

// In development Vite proxies /api → localhost:5000
// In production Express serves everything from same origin
const API = axios.create({ baseURL: '/api' });

// Attach JWT token to every request if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('staydost_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Auth ────────────────────────────────────────────────────────────────────
// NOTE: authAPI returns raw axios responses (for AuthContext compatibility)
export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
  me: () => API.get('/auth/me'),
  changePassword: (data) => API.put('/auth/change-password', data).then(r => r.data),
};

// ─── Properties ──────────────────────────────────────────────────────────────
export const propertyAPI = {
  getAll: (params) => API.get('/properties', { params }).then(r => r.data),
  getById: (id) => API.get(`/properties/${id}`).then(r => r.data),
  getOne: (id) => API.get(`/properties/${id}`).then(r => r.data),
  create: (data) => API.post('/properties', data).then(r => r.data),
  update: (id, data) => API.put(`/properties/${id}`, data).then(r => r.data),
  delete: (id) => API.delete(`/properties/${id}`).then(r => r.data),
  remove: (id) => API.delete(`/properties/${id}`).then(r => r.data),
  approve: (id) => API.put(`/properties/${id}/approve`, { status: 'approved' }).then(r => r.data),
  reject: (id) => API.put(`/properties/${id}/approve`, { status: 'rejected' }).then(r => r.data),
  unapprove: (id) => API.put(`/properties/${id}/approve`, { status: 'pending' }).then(r => r.data),
  toggleFeatured: (id) => API.put(`/properties/${id}/feature`).then(r => r.data),
};

// ─── Leads ───────────────────────────────────────────────────────────────────
export const leadAPI = {
  submit: (data) => API.post('/leads', data).then(r => r.data),
  getAll: (params) => API.get('/leads', { params }).then(r => r.data),
  update: (id, data) => API.put(`/leads/${id}`, data).then(r => r.data),
  delete: (id) => API.delete(`/leads/${id}`).then(r => r.data),
  remove: (id) => API.delete(`/leads/${id}`).then(r => r.data),
};

// ─── Users ───────────────────────────────────────────────────────────────────
export const userAPI = {
  getAll: (params) => API.get('/users', { params }).then(r => r.data),
  toggle: (id) => API.put(`/users/${id}/toggle`).then(r => r.data),
  delete: (id) => API.delete(`/users/${id}`).then(r => r.data),
  remove: (id) => API.delete(`/users/${id}`).then(r => r.data),
};

export default API;
