import api from "./api";

export const getMedicationHistory = async (params = {}) => {
  const response = await api.get("/medication-history/", { params });
  return response.data;
};

export const addMedicationHistory = async (history) => {
  const response = await api.post("/medication-history/", history);
  return response.data;
};

export const updateMedicationHistory = async (id, history) => {
  const response = await api.put(`/medication-history/${id}/`, history);
  return response.data;
};

export const deleteMedicationHistory = async (id) => {
  const response = await api.delete(`/medication-history/${id}/`);
  return response.data;
};
