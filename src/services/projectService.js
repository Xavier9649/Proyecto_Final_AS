// src/services/projectService.js - CRUD para Proyectos
import api from './api';

const projectService = {
  // 1. OBTENER TODOS los Proyectos (GET /api/proyectos)
  // Nota: La versión pública ya la usamos, esta puede ser la misma llamada.
  getProjects: async () => {
    try {
      const response = await api.get('/proyectos');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Error al cargar la lista de proyectos.';
    }
  },

  // 2. CREAR un nuevo Proyecto (POST /api/proyectos)
  createProject: async (projectData) => {
    try {
      // projectData debe incluir { titulo, descripcionCorta, descripcionLarga, ubicacion, fechaTermino, categoria, clienteId }
      const response = await api.post('/proyectos', projectData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Error al crear el proyecto.';
    }
  },

  // 3. ACTUALIZAR un Proyecto (PUT /api/proyectos/:id)
  updateProject: async (id, projectData) => {
    try {
      const response = await api.put(`/proyectos/${id}`, projectData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Error al actualizar el proyecto.';
    }
  },

  // 4. ELIMINAR un Proyecto (DELETE /api/proyectos/:id)
  deleteProject: async (id) => {
    try {
      await api.delete(`/proyectos/${id}`);
      return { success: true, message: `Proyecto ${id} eliminado.` };
    } catch (error) {
      throw error.response?.data?.message || 'Error al eliminar el proyecto.';
    }
  },

  // 5. SUBIR IMÁGENES a un Proyecto Existente (POST /api/proyectos/:id/images)
  // Este endpoint requiere enviar FormData, tal como lo especifica el manual[cite: 50].
  uploadImages: async (projectId, formData) => {
    try {
      // formData debe contener el campo 'files' con las imágenes.
      const response = await api.post(`/proyectos/${projectId}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Sobrescribir el Content-Type para FormData
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Error al subir las imágenes.';
    }
  }
};

export default projectService;