import axiosClient from "./axiosClient";

const listeningComprehensionApi = {
  getById: (id) => axiosClient.get(`/listening-comprehension/items/${id}`),
  submit: (payload) => axiosClient.post(`/listening-comprehension/submit`, payload),
};

export default listeningComprehensionApi;
