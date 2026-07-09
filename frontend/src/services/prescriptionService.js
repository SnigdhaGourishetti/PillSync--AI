import api from "./api";

export const getPrescriptions = async () => {
  const response = await api.get("/prescriptions/");
  return response.data;
};

export const uploadPrescription = async (formData) => {
  const response = await api.post("/prescriptions/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deletePrescription = async (id) => {
  const response = await api.delete(`/prescriptions/${id}/`);
  return response.data;
};
