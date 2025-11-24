import api from "./api";

const quotationService = {
  getQuotations: async () => {
    const token = localStorage.getItem("authToken");

    const response = await api.get("/quotations", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  assignArchitectToQuotation: async (id, architectId) => {
    const token = localStorage.getItem("authToken");

    const response = await api.put(
      `/quotations/${id}/assign`,
      { arquitectoId: architectId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  updateStatus: async (id, nuevoEstado) => {
    const token = localStorage.getItem("authToken");

    const response = await api.put(
      `/quotations/${id}/status`,
      { estado: nuevoEstado },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  // ✅ FUNCIÓN QUE TE FALTABA:
  deleteQuotation: async (id) => {
    const token = localStorage.getItem("authToken");

    const response = await api.delete(`/quotations/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },
};

export default quotationService;

