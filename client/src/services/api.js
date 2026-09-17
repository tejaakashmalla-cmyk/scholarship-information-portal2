import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('uss_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (error) => Promise.reject(error));

// Handle global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('uss_token');
      localStorage.removeItem('uss_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  getMe:    ()     => api.get('/auth/me'),
  logout:   ()     => api.post('/auth/logout'),
};

// ─── User / Profile ──────────────────────────────────────────────────────────
export const userAPI = {
  getProfile:      ()         => api.get('/users/profile'),
  saveProfile:     (data)     => api.put('/users/profile', data),
  getBookmarks:    ()         => api.get('/users/bookmarks'),
  toggleBookmark:  (schemeId) => api.post(`/users/bookmarks/${schemeId}`),
};

// ─── Schemes ─────────────────────────────────────────────────────────────────
export const schemeAPI = {
  getAll:   (params) => api.get('/schemes', { params }),
  getById:  (id)     => api.get(`/schemes/${id}`),
  create:   (data)   => api.post('/schemes', data),
  update:   (id, data) => api.put(`/schemes/${id}`, data),
  delete:   (id)     => api.delete(`/schemes/${id}`),
};

// ─── Eligibility ─────────────────────────────────────────────────────────────
export const eligibilityAPI = {
  check:      () => api.post('/eligibility/check'),
  getResults: () => api.get('/eligibility/results'),
};

export default api;
