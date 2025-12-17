import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import sentenceConstructionApi from "../../apis/sentenceConstructionApi";

/* =======================================================
   THUNKS
   ======================================================= */

// Lấy toàn bộ bài tập (để render grid BÀI 1–N)
export const fetchSentenceExercisesThunk = createAsyncThunk(
  "sentenceConstruction/fetchExercises",
  async (_, { rejectWithValue }) => {
    try {
      const res = await sentenceConstructionApi.getExercises();
      return res.data;
    } catch (error) {
      // giữ format giống các slice khác
      return rejectWithValue(
        error.response?.data || { message: "Không thể tải danh sách bài tập" }
      );
    }
  }
);

// Lấy chi tiết 1 bài tập (màn hình làm bài)
export const fetchSentenceExerciseDetailThunk = createAsyncThunk(
  "sentenceConstruction/fetchExerciseDetail",
  async (exerciseId, { rejectWithValue }) => {
    try {
      const res = await sentenceConstructionApi.getExerciseDetail(exerciseId);
      return res.data;
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
      return res.data; // { correct, correctSentence }
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

  // detail page
  currentExercise: null, // {id, scrambledWords, correctSentence, level}
  loadingExerciseDetail: false,
  exerciseDetailError: null,

  // submit answer
  submitting: false,
  submitError: null,
  lastResult: null, // { correct, correctSentence }

  // optional: để biết bé vừa làm bài nào xong
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
        state.exercises = action.payload;
      })
      .addCase(fetchSentenceExercisesThunk.rejected, (state, action) => {
        state.loadingExercises = false;
        state.exercisesError =
          action.payload?.message || "Không thể tải danh sách bài tập";
      });

    /* ---------- fetch detail ---------- */
    builder
      .addCase(fetchSentenceExerciseDetailThunk.pending, (state) => {
        state.loadingExerciseDetail = true;
        state.exerciseDetailError = null;
        // khi load bài mới, clear kết quả cũ
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
        state.lastResult = action.payload; // { correct, correctSentence }
        if (state.currentExercise) {
          state.lastSubmittedExerciseId = state.currentExercise.id;
        }
      })
      .addCase(submitSentenceAnswerThunk.rejected, (state, action) => {
        state.submitting = false;
        state.submitError = action.payload?.message || "Không thể gửi đáp án";
      });
  },
});

export const { resetSentenceResult } = sentenceConstructionSlice.actions;
export default sentenceConstructionSlice.reducer;
