import api from "./api";

export const getReminders = async () => {
  const response = await api.get("/reminders/");
  return response.data;
};

export const addReminder = async (reminder) => {
  const response = await api.post("/reminders/", reminder);
  return response.data;
};

export const updateReminder = async (id, reminder) => {
  const response = await api.put(`/reminders/${id}/`, reminder);
  return response.data;
};

export const deleteReminder = async (id) => {
  const response = await api.delete(`/reminders/${id}/`);
  return response.data;
};
