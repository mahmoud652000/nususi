import axios from 'axios';
import type { Book } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'https://backendnnususi-production.up.railway.app/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json', // ✅ JSON default
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------------- Auth API ----------------
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (name: string, email: string, password: string) =>
    api.post('/auth/register', { name, email, password }),
  getMe: () => api.get('/auth/me'),
  updateProfile: (name: string) => api.put('/auth/profile', { name }),
};

// ---------------- Books API ----------------
export const booksAPI = {
  getAll: (params?: { category?: string; search?: string; page?: number; limit?: number }) =>
    api.get('/books', { params }),
  getLatest: () => api.get('/books/latest'),
  getById: (id: string) => api.get(`/books/${id}`),
  getByCategory: (category: string) => api.get(`/books/category/${category}`),
  getMyBooks: () => api.get('/books/user/mybooks'),
  update: (id: string, data: Partial<Book>) => api.put(`/books/${id}`, data),
  delete: (id: string) => api.delete(`/books/${id}`),
  incrementDownload: (id: string) => api.post(`/books/${id}/download`),
};

// ---------------- Upload API (مصححة) ----------------
export const uploadAPI = {
  uploadBook: (formData: FormData) =>
    api.post('/upload/book', formData), // ✅ لا تحدد Content-Type يدويًا
  uploadCover: (formData: FormData) =>
    api.post('/upload/cover', formData), // ✅ Axios يتعامل مع FormData تلقائيًا
};

// ---------------- Dashboard API ----------------
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getUserStats: () => api.get('/dashboard/user-stats'),
  getUsers: () => api.get('/dashboard/users'),
  deleteUser: (id: string) => api.delete(`/dashboard/users/${id}`),
  updateBookStatus: (id: string, status: string) =>
    api.put(`/dashboard/books/${id}/status`, { status }),
};

export default api;