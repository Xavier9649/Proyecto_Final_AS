// src/services/auditoriaService.js - ¡FUNCIÓN GET LOG AÑADIDA!
import api from './api';

const ENDPOINT = '/auditorias'; // Asumiendo que el endpoint para el log es /api/auditorias

const auditoriaService = {
  /**
   * Registra una actividad en la base de datos (Backend).
   * Consume: POST /api/auditorias
   */
  logActivity: async (usuarioId, accion, entidad, entidadId, detalles) => {
    try {
      await api.post(ENDPOINT, {
        usuarioId,
        accion,
        entidad,
        entidadId,
        // Los detalles deben ser un string/JSON para ser almacenados
        detalles: JSON.stringify(detalles), 
      });
      console.log(`[AUDITORÍA REGISTRADA] Acción: ${accion} en ${entidad} ID: ${entidadId}`);
    } catch (error) {
      console.error("Fallo CRÍTICO al registrar actividad de auditoría:", error);
      // No lanzamos error para no detener el flujo principal de la aplicación
    }
  },

  /**
   * Obtiene el registro completo de auditoría (Solo para Admin).
   * Consume: GET /api/auditorias
   */
  getAuditLog: async () => {
    try {
      // El token de admin debe ser usado para autorizar esta llamada
      const response = await api.get(ENDPOINT);
      return response.data;
    } catch (error) {
      console.error("Error al obtener el log de auditoría:", error);
      throw error.response?.data?.message || 'Fallo al cargar el log de auditoría.';
    }
  }
};

export default auditoriaService;