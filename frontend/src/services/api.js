import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Inject admin headers if stored in localStorage
api.interceptors.request.use((config) => {
  const adminData = localStorage.getItem('vaultx_admin');
  if (adminData) {
    try {
      const { username, password } = JSON.parse(adminData);
      if (username && password) {
        config.headers['x-admin-username'] = username;
        config.headers['x-admin-password'] = password;
      }
    } catch (e) {
      console.error('Error parsing admin authentication credentials', e);
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const toolsService = {
  getAll: (params) => api.get('/tools', { params }),
  getById: (id) => api.get(`/tools/${id}`),
  create: (data) => api.post('/tools', data),
  update: (id, data) => api.put(`/tools/${id}`, data),
  delete: (id) => api.delete(`/tools/${id}`),
  getLatest: () => api.get('/latest-tools'),
  search: (q) => api.get('/search', { params: { q } }),
  getCategories: () => api.get('/categories'),
};

export const authService = {
  login: (username, password) => api.post('/admin/login', { username, password }),
  changePassword: (currentPassword, newPassword) => api.put('/admin/change-password', { currentPassword, newPassword }),
};

export default api;
