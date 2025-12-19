import axiosClient from "./axiosClient";

const userApi = {
  getById: (id) => axiosClient.get(`/users/${id}`),
  updateById: (id, payload) => axiosClient.patch(`/users/${id}`, payload),
  deleteById: (id) => axiosClient.delete(`/users/${id}`),
};

export default userApi;
