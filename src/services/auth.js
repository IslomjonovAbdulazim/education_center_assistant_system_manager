import { authAPI } from './api';

export const authService = {
  login: async (phone, password, learningCenterId) => {
    try {
      const response = await authAPI.login({
        phone,
        password,
        learning_center_id: learningCenterId
      });
      
      const { token, user_info } = response.data;
      
      // Check if user is manager
      if (user_info.role !== 'manager') {
        throw new Error('Access denied. Manager access required.');
      }
      
      // Store auth data
      localStorage.setItem('manager_token', token);
      localStorage.setItem('manager_user', JSON.stringify(user_info));
      
      return { token, user: user_info };
    } catch (error) {
      throw error.response?.data?.detail || error.message || 'Login failed';
    }
  },

  logout: () => {
    localStorage.removeItem('manager_token');
    localStorage.removeItem('manager_user');
  },

  getCurrentUser: () => {
    const userData = localStorage.getItem('manager_user');
    return userData ? JSON.parse(userData) : null;
  },

  getToken: () => {
    return localStorage.getItem('manager_token');
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('manager_token');
    const user = authService.getCurrentUser();
    return !!(token && user && user.role === 'manager');
  },

  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await authAPI.changePassword({
        current_password: currentPassword,
        new_password: newPassword
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || 'Failed to change password';
    }
  }
};