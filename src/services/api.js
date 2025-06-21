import axios from 'axios';

const API_BASE_URL = 'https://islomjonovabdulazim-learning-center-assistant-system-99fa.twc1.net';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('manager_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('manager_token');
      localStorage.removeItem('manager_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// Manager API
export const managerAPI = {
  // Users Management
  getUsers: (role) => api.get(`/manager/users?role=${role}`),
  getUserDetail: (userId) => api.get(`/manager/users/${userId}`),
  createUser: (data) => api.post('/manager/users', data),
  updateUser: (userId, data) => api.put(`/manager/users/${userId}`, data),
  deleteUser: (userId) => api.delete(`/manager/users/${userId}`),
  changeUserPassword: (userId, data) => api.put(`/manager/users/${userId}/change-password`, data),
  
  // Subjects Management
  getSubjects: () => api.get('/manager/subjects'),
  createSubject: (data) => api.post('/manager/subjects', data),
  updateSubject: (subjectId, data) => api.put(`/manager/subjects/${subjectId}`, data),
  deleteSubject: (subjectId) => api.delete(`/manager/subjects/${subjectId}`),
  
  // Stats
  getStats: () => api.get('/manager/stats'),
};

export default api;