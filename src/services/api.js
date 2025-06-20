import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://islomjonovabdulazim-learning-center-assistant-system-99fa.twc1.net';

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
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
};

// Manager API
export const managerAPI = {
  // Dashboard & Stats
  getStats: () => api.get('/manager/stats'),
  getDashboardData: () => api.get('/manager/dashboard'),
  
  // Subjects Management
  getSubjects: () => api.get('/manager/subjects'),
  createSubject: (data) => api.post('/manager/subjects', data),
  updateSubject: (id, data) => api.put(`/manager/subjects/${id}`, data),
  deleteSubject: (id) => api.delete(`/manager/subjects/${id}`),
  
  // Users Management
  getUsers: (role) => api.get(`/manager/users?role=${role}`),
  createUser: (data) => api.post('/manager/users', data),
  updateUser: (id, data) => api.put(`/manager/users/${id}`, data),
  deleteUser: (id) => api.delete(`/manager/users/${id}`),
  
  // Sessions Management
  getSessions: (params = {}) => api.get('/manager/sessions', { params }),
  getSessionDetails: (id) => api.get(`/manager/sessions/${id}`),
  
  // Reports & Analytics
  getAttendanceReport: (params) => api.get('/manager/reports/attendance', { params }),
  getPerformanceReport: (params) => api.get('/manager/reports/performance', { params }),
  getSubjectAnalytics: () => api.get('/manager/analytics/subjects'),
  getAssistantAnalytics: () => api.get('/manager/analytics/assistants'),
  getStudentAnalytics: () => api.get('/manager/analytics/students'),
  
  // Advanced Analytics
  getMonthlyTrends: () => api.get('/manager/analytics/monthly-trends'),
  getHourlyDistribution: () => api.get('/manager/analytics/hourly-distribution'),
  getRatingAnalytics: () => api.get('/manager/analytics/ratings'),
  getCapacityAnalytics: () => api.get('/manager/analytics/capacity'),
};

export default api;