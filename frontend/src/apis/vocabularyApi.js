import axiosClient from "./axiosClient";

const vocabularyApi = {
  getAll: () => axiosClient.get("/vocabulary"),
  getById: (id) => axiosClient.get(`/vocabulary/${id}`),
  create: (payload) => axiosClient.post("/vocabulary", payload),
  update: (id, payload) => axiosClient.patch(`/vocabulary/${id}`, payload),
  delete: (id) => axiosClient.delete(`/vocabulary/${id}`),
  getByTopic: (topic) => axiosClient.get("/vocabulary", { params: { topic } }),
};

export default vocabularyApi;
