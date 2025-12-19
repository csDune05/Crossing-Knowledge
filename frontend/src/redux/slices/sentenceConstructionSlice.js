import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import sentenceConstructionApi from "../../apis/sentenceConstructionApi";

/* =======================================================
   THUNKS
   ======================================================= */

// Fetch all questions (24)
export const fetchSentenceExercisesThunk = createAsyncThunk(
  "sentenceConstruction/fetchExercises",
  async (_, { rejectWithValue }) => {
    try {
      const res = await sentenceConstructionApi.getExercises(); // axiosClient returns data already
      return res;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Không thể tải danh sách bài tập" }
      );
    }
  }
);

// Submit answer (by QUESTION id)
export const submitSentenceAnswerThunk = createAsyncThunk(
  "sentenceConstruction/submitAnswer",
  async ({ exerciseId, submittedWords }, { rejectWithValue }) => {
    try {
      const res = await sentenceConstructionApi.submitAnswer(
        exerciseId,
        submittedWords
      );
      return res; // { correct, correctSentence, correctSentences }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Không thể gửi đáp án" }
      );
    }
  }
);

/* =======================================================
   STATE
   ======================================================= */

const initialState = {
  exercises: [],
  loadingExercises: false,
  exercisesError: null,

  submitting: false,
  submitError: null,
  lastResult: null,

  // IMPORTANT: store the QUESTION id that was submitted
  lastSubmittedExerciseId: null,
};

const sentenceConstructionSlice = createSlice({
  name: "sentenceConstruction",
  initialState,
  reducers: {
    resetSentenceResult(state) {
      state.lastResult = null;
      state.submitError = null;
      state.lastSubmittedExerciseId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch list
      .addCase(fetchSentenceExercisesThunk.pending, (state) => {
        state.loadingExercises = true;
        state.exercisesError = null;
      })
      .addCase(fetchSentenceExercisesThunk.fulfilled, (state, action) => {
        state.loadingExercises = false;
        state.exercises = action.payload || [];
      })
      .addCase(fetchSentenceExercisesThunk.rejected, (state, action) => {
        state.loadingExercises = false;
        state.exercisesError =
          action.payload?.message || "Không thể tải danh sách bài tập";
      })

      // submit answer
      .addCase(submitSentenceAnswerThunk.pending, (state) => {
        state.submitting = true;
        state.submitError = null;
      })
      .addCase(submitSentenceAnswerThunk.fulfilled, (state, action) => {
        state.submitting = false;
        state.lastResult = action.payload;

        // store QUESTION id submitted
        state.lastSubmittedExerciseId = action.meta.arg.exerciseId;
      })
      .addCase(submitSentenceAnswerThunk.rejected, (state, action) => {
        state.submitting = false;
        state.submitError = action.payload?.message || "Không thể gửi đáp án";
      });
  },
});

export const { resetSentenceResult } = sentenceConstructionSlice.actions;
export default sentenceConstructionSlice.reducer;
