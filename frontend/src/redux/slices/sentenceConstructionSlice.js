import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import sentenceConstructionApi from "../../apis/sentenceConstructionApi";

/* =======================================================
   THUNKS
   ======================================================= */

// Lấy toàn bộ bài tập (24 questions)
export const fetchSentenceExercisesThunk = createAsyncThunk(
  "sentenceConstruction/fetchExercises",
  async (_, { rejectWithValue }) => {
    try {
      // axiosClient already returns response.data
      const res = await sentenceConstructionApi.getExercises();
      return res;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Không thể tải danh sách bài tập" }
      );
    }
  }
);

export const fetchSentenceExerciseDetailThunk = createAsyncThunk(
  "sentenceConstruction/fetchExerciseDetail",
  async (lessonId, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const fromList = state.sentenceConstruction.exercises?.find(
        (x) => x.id === Number(lessonId)
      );

      if (fromList && Array.isArray(fromList.questions)) {
        return fromList;
      }

      const res = await sentenceConstructionApi.getExerciseDetail(lessonId);
      return res; // ✅ axiosClient already returns data
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Không thể tải bài tập" }
      );
    }
  }
);

// Gửi đáp án
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
  // list page
  exercises: [],
  loadingExercises: false,
  exercisesError: null,

  // detail page (optional)
  currentExercise: null,
  loadingExerciseDetail: false,
  exerciseDetailError: null,

  // submit answer
  submitting: false,
  submitError: null,
  lastResult: null,

  lastSubmittedExerciseId: null,
};

const sentenceConstructionSlice = createSlice({
  name: "sentenceConstruction",
  initialState,
  reducers: {
    // reset kết quả khi vào bài mới / làm lại
    resetSentenceResult(state) {
      state.lastResult = null;
      state.submitError = null;
      state.lastSubmittedExerciseId = null;
    },
  },
  extraReducers: (builder) => {
    /* ---------- fetch list ---------- */
    builder
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
      });

    /* ---------- fetch detail (optional) ---------- */
    builder
      .addCase(fetchSentenceExerciseDetailThunk.pending, (state) => {
        state.loadingExerciseDetail = true;
        state.exerciseDetailError = null;
        state.lastResult = null;
        state.submitError = null;
        state.lastSubmittedExerciseId = null;
      })
      .addCase(fetchSentenceExerciseDetailThunk.fulfilled, (state, action) => {
        state.loadingExerciseDetail = false;
        state.currentExercise = action.payload;
      })
      .addCase(fetchSentenceExerciseDetailThunk.rejected, (state, action) => {
        state.loadingExerciseDetail = false;
        state.exerciseDetailError =
          action.payload?.message || "Không thể tải bài tập";
      });

    /* ---------- submit answer ---------- */
    builder
      .addCase(submitSentenceAnswerThunk.pending, (state) => {
        state.submitting = true;
        state.submitError = null;
      })
      .addCase(submitSentenceAnswerThunk.fulfilled, (state, action) => {
        state.submitting = false;
        state.lastResult = action.payload;

        // IMPORTANT: store the QUESTION id that was submitted
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
