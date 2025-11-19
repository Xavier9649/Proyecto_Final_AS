import api from './api';

const quotationService = {
  // 1. Crear solicitud de cotización (Cliente)
  // POST /api/quotations
  requestQuotation: async (data) => {
    const response = await api.post('/quotations', data);
    return response.data;
  },

  // 2. Obtener cotizaciones (Filtrado por rol en Backend)
  // GET /api/quotations
  getQuotations: async () => {
    const response = await api.get('/quotations');
    return response.data;
  },

  // 3. Asignar arquitecto (Admin)
  // PUT /api/quotations/:id/assign
  assignArchitectToQuotation: async (id, architectId) => {
    const response = await api.put(`/quotations/${id}/assign`, { arquitectoId: architectId });
    return response.data;
  },

  // 4. Actualizar estado (Arquitecto)
  // PUT /api/quotations/:id/status
  updateQuotationStatus: async (id, estado) => {
    const response = await api.put(`/quotations/${id}/status`, { estado });
    return response.data;
  }
};

export default quotationService;