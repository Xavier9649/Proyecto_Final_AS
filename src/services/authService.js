// src/services/authService.js
import api from './api';

const authService = {
  // 1. LOGIN
  // Consume: POST /api/auth/login [cite: 26]
  login: async (email, password) => {
    try {
      // Petición al backend [cite: 26]
      const response = await api.post('/auth/login', { email, password });
      
      // Asumiendo que el backend devuelve { token, usuario } [cite: 28]
      const { token, usuario } = response.data; 

      if (token) {
        // Guardar el token para futuras peticiones protegidas [cite: 29]
        localStorage.setItem('authToken', token);
      }
      return usuario; 
    } catch (error) {
      // Manejo de errores de la API
      throw error.response?.data?.message || 'Error al iniciar sesión. Verifica tus credenciales.';
    }
  },

  // 2. REGISTRO
  // Consume: POST /api/auth/register [cite: 24]
  register: async (nombre, email, password) => {
    try {
      // Petición al backend con los datos requeridos (nombre, email, password) [cite: 25]
      const response = await api.post('/auth/register', { nombre, email, password }); 
      
      // Retornar la respuesta (ej. mensaje de éxito)
      return response.data; 
    } catch (error) {
      // Manejo de errores
      throw error.response?.data?.message || 'Error al registrar el usuario. Inténtalo de nuevo.';
    }
  },
  
  // 3. LOGOUT
  logout: () => {
    // Eliminar el token para cerrar la sesión [cite: 43]
    localStorage.removeItem('authToken');
  },

  // 4. Obtener el estado de autenticación
  isAuthenticated: () => {
    // Está autenticado si existe un token en el almacenamiento local
    return !!localStorage.getItem('authToken');
  }
};

export default authService;