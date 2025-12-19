import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authApi from "../../apis/authApi";

// thunk: register
export const registerThunk = createAsyncThunk(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await authApi.register(payload); // { token, user }
      localStorage.setItem("ck_token", data.token);
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

// thunk: login
export const loginThunk = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await authApi.login(payload); // { token, user }
      localStorage.setItem("ck_token", data.token);
      return data;
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Login failed";
      return rejectWithValue(msg);
    }
  }
);

const initialState = {
  registerLoading: false,
  registerError: null,
  registeredUser: null, // user returned by POST /auth/register
  loginLoading: false,
  loginError: null,
  authUser: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearRegisterState(state) {
      state.registerError = null;
      state.registeredUser = null;
    },
    clearLoginState(state) {
      state.loginError = null;
    },
    logout(state) {
      state.authUser = null;
      localStorage.removeItem("ck_token");
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
        state.registeredUser = action.payload.user;
        state.authUser = action.payload.user;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.registerLoading = false;
        state.registerError = action.payload || "Register failed";
      })
      // login
      .addCase(loginThunk.pending, (state) => {
        state.loginLoading = true;
        state.loginError = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loginLoading = false;
        state.authUser = action.payload.user;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loginLoading = false;
        state.loginError = action.payload || "Login failed";
      });
  },
});

export const { clearRegisterState, clearLoginState, logout } =
  authSlice.actions;
export default authSlice.reducer;
