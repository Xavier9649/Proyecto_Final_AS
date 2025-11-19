import api from './api';

const quotationService = {
  requestQuotation: async (data) => {
    const response = await api.post('/quotations', data);
    return response.data;
  },
  getQuotations: async () => {
    const response = await api.get('/quotations');
    return response.data;
  },
  assignArchitectToQuotation: async (id, architectId) => {
    const response = await api.put(`/quotations/${id}/assign`, { arquitectoId: architectId });
    return response.data;
  },
  updateQuotationStatus: async (id, estado) => {
    const response = await api.put(`/quotations/${id}/status`, { estado });
    return response.data;
  }
};

export default quotationService;