import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authApi from "../../apis/authApi";

// thunk: register
export const registerThunk = createAsyncThunk(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      // axiosClient already returns response.data (because interceptor)
      const data = await authApi.register(payload);
      return data;
    } catch (err) {
      // Nest errors often: err.response.data.message
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Register failed";
      return rejectWithValue(msg);
    }
  }
);

const initialState = {
  registerLoading: false,
  registerError: null,
  registeredUser: null, // user returned by POST /users
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearRegisterState(state) {
      state.registerError = null;
      state.registeredUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerThunk.pending, (state) => {
        state.registerLoading = true;
        state.registerError = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.registerLoading = false;
        state.registeredUser = action.payload;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.registerLoading = false;
        state.registerError = action.payload || "Register failed";
      });
  },
});

export const { clearRegisterState } = authSlice.actions;
export default authSlice.reducer;
