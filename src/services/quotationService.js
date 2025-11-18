// src/services/quotationService.js - ¡FUNCIÓN DE ASIGNACIÓN AÑADIDA!
import api from './api';

const quotationService = {
  // 1. Crear una nueva Cotización (Solicitud del Cliente)
  requestQuotation: async (quotationData) => {
    try {
      const response = await api.post('/quotations', quotationData);
      return response.data; 
    } catch (error) {
      console.error("Error al solicitar la cotización:", error);
      throw error.response?.data?.message || 'Fallo al enviar la solicitud de cotización.';
    }
  },

  // 2. Obtener Cotizaciones por Rol (Admin ve todas, Arq ve asignadas, Cliente ve suyas)
  getQuotations: async () => {
    try {
      // El token en el header define el filtro
      const response = await api.get('/quotations'); 
      return response.data;
    } catch (error) {
      console.error("Error al obtener las cotizaciones:", error);
      throw error.response?.data?.message || 'Fallo al obtener las cotizaciones.';
    }
  },

  // 3. ACTUALIZAR ESTADO de una Cotización (Usado por Arquitecto/Admin)
  updateQuotationStatus: async (id, nuevoEstado) => {
    try {
      const response = await api.put(`/quotations/${id}/status`, { estado: nuevoEstado });
      return response.data; 
    } catch (error) {
      console.error("Error al actualizar el estado de la cotización:", error);
      throw error.response?.data?.message || 'Fallo al actualizar el estado.';
    }
  },

  /**
   * 4. ASIGNAR ARQUITECTO a una Cotización (Usado por Admin)
   * Consume: PUT /api/quotations/:id/assign
   */
  assignArchitectToQuotation: async (quotationId, architectId) => {
    try {
      // Body: { arquitectoId: ... }
      const response = await api.put(`/quotations/${quotationId}/assign`, { arquitectoId: architectId });
      return response.data;
    } catch (error) {
      console.error("Error al asignar arquitecto:", error);
      throw error.response?.data?.message || 'Fallo al asignar el arquitecto.';
    }
  }
};

export default quotationService;