import api from './api';

const auditoriaService = {
  logActivity: async (usuarioId, accion, entidad, entidadId, detalles) => {
    try {
      await api.post('/auditorias', { usuarioId, accion, entidad, entidadId, detalles: JSON.stringify(detalles) });
    } catch (error) {
      console.error("Error al registrar auditoría", error);
    }
  },
  getAuditLog: async () => {
    const response = await api.get('/auditorias');
    return response.data;
  }
};

export default auditoriaService;