import API from './api';

export const authService = {
  login: (email, password) =>
    API.post('/auth/login', { email, password }),

  register: (userData) =>
    API.post('/auth/register', userData),

  getCurrentUser: () =>
    API.get('/auth/me'),

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export default authService;