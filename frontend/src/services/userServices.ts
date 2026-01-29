import api from "../api/axios";

export const registerUserAPI = async (
  name: string,
  email: string,
  password: string,
) => {
  const res = await api.post("/users/register", { name, email, password });
  return res.data;
};

export const loginUserAPI = async (email: string, password: string) => {
  const res = await api.post("/users/login", { email, password });
  return res.data;
};
