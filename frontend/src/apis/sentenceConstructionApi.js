// sentenceConstructionApi.js
import axiosClient from "./axiosClient";

const sentenceConstructionApi = {
  // keep names that your slice is using
  getExercises: () => axiosClient.get("/sentence-construction/exercises"),
  getExerciseDetail: (id) =>
    axiosClient.get(`/sentence-construction/exercises/${id}`),

  submitAnswer: (exerciseId, submittedWords) =>
    axiosClient.post("/sentence-construction/submit", {
      exerciseId,
      submittedWords,
    }),

  // (optional aliases if you want)
  getLessons: () => axiosClient.get("/sentence-construction/exercises"),
  getLessonDetail: (id) =>
    axiosClient.get(`/sentence-construction/exercises/${id}`),
};

export default sentenceConstructionApi;
