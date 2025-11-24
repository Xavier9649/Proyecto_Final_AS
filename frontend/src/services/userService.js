// src/services/userService.js
import api from "./api";

const userService = {
  // Obtener arquitectos existentes
  getArchitects: async () => {
    const token = localStorage.getItem("authToken");

    const response = await api.get("/auth/architects", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  // Crear arquitecto
  createArchitect: async (data) => {
    const token = localStorage.getItem("authToken");

    const response = await api.post(
      "/auth/register",
      {
        ...data,
        rol: "ARCHITECT", // Rol obligatorio
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  // Editar arquitecto
  updateArchitect: async (id, data) => {
    const token = localStorage.getItem("authToken");

    const response = await api.put(
      `/users/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  // Eliminar arquitecto
  deleteArchitect: async (id) => {
    const token = localStorage.getItem("authToken");

    const response = await api.delete(`/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },
};

export default userService;


