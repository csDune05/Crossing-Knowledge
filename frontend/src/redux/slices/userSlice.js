import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userApi from "../../apis/userApi";

/* =======================================================
   THUNKS
   ======================================================= */

export const fetchProfileThunk = createAsyncThunk(
  "user/fetchProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const data = await userApi.getById(userId); // axiosClient already returns data
      return data;
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Không thể tải thông tin người dùng";
      return rejectWithValue(msg);
    }
  }
);

export const updateProfileThunk = createAsyncThunk(
  "user/updateProfile",
  async ({ userId, payload }, { rejectWithValue }) => {
    try {
      const data = await userApi.updateById(userId, payload);

      // keep localStorage user in sync (optional but useful)
      try {
        const raw = localStorage.getItem("ck_user");
        if (raw) {
          const u = JSON.parse(raw);
          if (u?.id === data?.id) {
            localStorage.setItem("ck_user", JSON.stringify(data));
          }
        }
      } catch {}

      return data;
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Không thể cập nhật thông tin";
      return rejectWithValue(msg);
    }
  }
);

export const deleteAccountThunk = createAsyncThunk(
  "user/deleteAccount",
  async (userId, { rejectWithValue }) => {
    try {
      const data = await userApi.deleteById(userId);
      return data; // whatever BE returns
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Không thể xóa tài khoản";
      return rejectWithValue(msg);
    }
  }
);

/* =======================================================
   STATE
   ======================================================= */

const initialState = {
  profile: null,

  loadingProfile: false,
  profileError: null,

  updating: false,
  updateError: null,

  deleting: false,
  deleteError: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserErrors(state) {
      state.profileError = null;
      state.updateError = null;
      state.deleteError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch profile
      .addCase(fetchProfileThunk.pending, (state) => {
        state.loadingProfile = true;
        state.profileError = null;
      })
      .addCase(fetchProfileThunk.fulfilled, (state, action) => {
        state.loadingProfile = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfileThunk.rejected, (state, action) => {
        state.loadingProfile = false;
        state.profileError =
          action.payload || "Không thể tải thông tin người dùng";
      })

      // update profile
      .addCase(updateProfileThunk.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })
      .addCase(updateProfileThunk.fulfilled, (state, action) => {
        state.updating = false;
        state.profile = action.payload;
      })
      .addCase(updateProfileThunk.rejected, (state, action) => {
        state.updating = false;
        state.updateError = action.payload || "Không thể cập nhật thông tin";
      })

      // delete account
      .addCase(deleteAccountThunk.pending, (state) => {
        state.deleting = true;
        state.deleteError = null;
      })
      .addCase(deleteAccountThunk.fulfilled, (state) => {
        state.deleting = false;
      })
      .addCase(deleteAccountThunk.rejected, (state, action) => {
        state.deleting = false;
        state.deleteError = action.payload || "Không thể xóa tài khoản";
      });
  },
});

export const { clearUserErrors } = userSlice.actions;
export default userSlice.reducer;
