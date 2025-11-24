import api from "./api";

const architectService = {

  getArchitects: async () => {
    const token = localStorage.getItem("authToken");
    const response = await api.get("/users?role=ARCHITECT", {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  createArchitect: async (data) => {
    const token = localStorage.getItem("authToken");
    const response = await api.post("/auth/register", {
      ...data,
      rol: "ARCHITECT"
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  },

  updateArchitect: async (id, data) => {
    const token = localStorage.getItem("authToken");
    const response = await api.put(`/users/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  deleteArchitect: async (id) => {
    const token = localStorage.getItem("authToken");
    const response = await api.delete(`/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }

};

export default architectService;
