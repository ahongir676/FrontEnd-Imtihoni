import axios from "axios";

export const instance = axios.create({
  baseURL: "https://api.admin.bekzodjon.uz/api/v1/",
});

instance.interceptors.request.use((config) => {
  const authData = JSON.parse(localStorage.getItem("auth") || "{}");
  const token = authData.state?.token;
  if (token) {
    config.headers.Authorization = `Barear ${
      JSON.parse(localStorage.getItem("auth") || "").state.token
    }`;
  }
  return config;
});
