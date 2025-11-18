// src/services/userService.js - NECESARIO PARA LISTAR ARQUITECTOS
import api from './api';

const userService = {
  /**
   * Obtiene la lista de usuarios, filtrados por rol.
   * Asumimos que el Backend tiene un endpoint: GET /api/users?role=architect
   */
  getArchitects: async () => {
    try {
      // El Backend debe manejar el filtro por rol 'architect'
      const response = await api.get('/users', { params: { role: 'architect' } }); 
      return response.data; 
    } catch (error) {
      console.error("Error al obtener la lista de arquitectos:", error);
      // Devolvemos un array vacío o lanzamos error si es crítico
      throw error.response?.data?.message || 'No se pudo cargar la lista de arquitectos.';
    }
  }
};

export default userService;