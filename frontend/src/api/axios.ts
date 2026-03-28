import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// api.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     console.error("API Error: ", err.response?.data || err.message);
//     return Promise.reject(err);
//   },
// );


export const setCsrfToken = (token: string) => {
  api.defaults.headers.common["x-csrf-token"] = token;
};

export default api;
