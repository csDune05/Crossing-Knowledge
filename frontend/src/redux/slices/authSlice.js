import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authApi from "../../apis/authApi";

// thunk: register
export const registerThunk = createAsyncThunk(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await authApi.register(payload); // { token, user }
      localStorage.setItem("ck_token", data.token);
      localStorage.setItem("ck_user", JSON.stringify(data.user)); // ✅ save user
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
      localStorage.setItem("ck_user", JSON.stringify(data.user)); // ✅ save user
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

  authUser: null, // current logged in user
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

    // ✅ restore authUser from localStorage on refresh
    hydrateAuthFromStorage(state) {
      const token = localStorage.getItem("ck_token");
      const rawUser = localStorage.getItem("ck_user");

      if (token && rawUser) {
        try {
          state.authUser = JSON.parse(rawUser);
        } catch {
          state.authUser = null;
        }
      } else {
        state.authUser = null;
      }
    },

    logout(state) {
      state.authUser = null;
      localStorage.removeItem("ck_token");
      localStorage.removeItem("ck_user"); // ✅ remove user too
    },
  },
  extraReducers: (builder) => {
    builder
      // register
      .addCase(registerThunk.pending, (state) => {
        state.registerLoading = true;
        state.registerError = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.registerLoading = false;
        state.registeredUser = action.payload.user;
        state.authUser = action.payload.user;

        // ✅ keep storage in sync (in case you later remove from thunk)
        localStorage.setItem("ck_user", JSON.stringify(action.payload.user));
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

        // ✅ keep storage in sync
        localStorage.setItem("ck_user", JSON.stringify(action.payload.user));
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loginLoading = false;
        state.loginError = action.payload || "Login failed";
      });
  },
});

export const {
  clearRegisterState,
  clearLoginState,
  hydrateAuthFromStorage, // ✅ export
  logout,
} = authSlice.actions;

export default authSlice.reducer;
