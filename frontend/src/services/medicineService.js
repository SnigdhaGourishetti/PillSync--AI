import api from "./api";

export const getMedicines = async () => {
  const response = await api.get("/medicines/");
  return response.data;
};

export const addMedicine = async (medicine) => {
  const response = await api.post("/medicines/", medicine);
  return response.data;
};

export const updateMedicine = async (id, medicine) => {
  const response = await api.put(`/medicines/${id}/`, medicine);
  return response.data;
};

export const deleteMedicine = async (id) => {
  const response = await api.delete(`/medicines/${id}/`);
  return response.data;
};