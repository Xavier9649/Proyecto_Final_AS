import api from './api';

const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    return response.data;
  },
  register: async (nombre, email, password) => {
    const response = await api.post('/auth/register', { nombre, email, password });
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('authToken');
  },
};

export default authService;