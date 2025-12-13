import axiosClient from "./axiosClient";

const authApi = {
  // Your current backend is UsersController: POST /users
  register: (payload) => axiosClient.post("/users", payload),

  // login: (payload) => axiosClient.post("/auth/login", payload), // later
};

export default authApi;
