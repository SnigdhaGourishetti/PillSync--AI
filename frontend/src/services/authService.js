import api from "./api";

export const loginUser = async (username, password) => {
  const response = await api.post("/accounts/login/", {
    username,
    password,
  });

  return response.data;
};

export const registerUser = async ({ username, email, password, role, phone }) => {
  const payload = {
    username,
    email,
    password,
    role,
    phone: phone || "",
  };

  const response = await api.post("/accounts/register/", payload);

  return response.data;
};