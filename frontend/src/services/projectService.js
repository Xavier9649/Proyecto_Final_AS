import api from './api';

const projectService = {
  getProjects: async () => {
    const response = await api.get('/proyectos');
    return response.data;
  },
  createProject: async (projectData) => {
    const response = await api.post('/proyectos', projectData);
    return response.data;
  },
  deleteProject: async (id) => {
    const response = await api.delete(`/proyectos/${id}`);
    return response.data;
  },
  uploadImages: async (id, formData) => {
    const response = await api.post(`/proyectos/${id}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};

export default projectService;