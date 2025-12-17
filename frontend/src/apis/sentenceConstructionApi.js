import axiosClient from "./axiosClient";

const sentenceConstructionApi = {
  // GET /sentence-construction/exercises
  getExercises() {
    return axiosClient.get("/sentence-construction/exercises");
  },

  // GET /sentence-construction/exercises/:id
  getExerciseDetail(id) {
    return axiosClient.get(`/sentence-construction/exercises/${id}`);
  },

  // POST /sentence-construction/submit
  submitAnswer(exerciseId, submittedWords) {
    return axiosClient.post("/sentence-construction/submit", {
      exerciseId,
      submittedWords,
    });
  },
};

export default sentenceConstructionApi;
