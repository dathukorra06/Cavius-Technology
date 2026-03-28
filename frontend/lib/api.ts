import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

const api = axios.create({ baseURL: BASE_URL });

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ---------- Auth ----------
export const authApi = {
  register: (data: object) => api.post('/auth/register', data),
  login:    (data: object) => api.post('/auth/login', data),
  getMe:    () => api.get('/auth/me'),
  updateProfile: (data: object) => api.put('/auth/profile', data),
  logout:   () => api.post('/auth/logout'),
  changePassword: (data: object) => api.post('/auth/change-password', data),
};

// ---------- Blogs ----------
export const blogApi = {
  getAll: (params?: object) => api.get('/blogs', { params }),
  getFeatured: () => api.get('/blogs/featured'),
  getById: (id: string) => api.get(`/blogs/${id}`),
  getUserBlogs: (userId: string) => api.get(`/blogs/user/${userId}`),
  create: (data: object) => api.post('/blogs', data),
  update: (id: string, data: object) => api.put(`/blogs/${id}`, data),
  delete: (id: string) => api.delete(`/blogs/${id}`),
  toggleLike: (id: string) => api.post(`/blogs/${id}/like`),
};

// ---------- AI ----------
export const aiApi = {
  health: () => api.get('/ai/health'),
  generateContent: (data: { topic: string; tone?: string }) => api.post('/ai/generate-content', data),
  summarize: (data: { text: string; length?: string }) => api.post('/ai/summarize', data),
  suggestTitle: (data: { content: string }) => api.post('/ai/suggest-title', data),
  improveContent: (data: { content: string }) => api.post('/ai/improve-content', data),
};

// ---------- Tasks ----------
export const taskApi = {
  getAll: () => api.get('/tasks'),
  create: (data: object) => api.post('/tasks', data),
  update: (id: string, data: object) => api.put(`/tasks/${id}`, data),
  delete: (id: string) => api.delete(`/tasks/${id}`),
};

export default api;
