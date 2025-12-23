import axiosClient from "./axiosClient";

const pronunciationApi = {
  evaluate: (payload) => axiosClient.post("/pronunciation/evaluate", payload),
};

export default pronunciationApi;
