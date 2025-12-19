import axiosClient from "./axiosClient";

const authApi = {
  register: (payload) => axiosClient.post("/auth/register", payload),
  login: (payload) => axiosClient.post("/auth/login", payload),
};

export default authApi;
