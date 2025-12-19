import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import sentenceConstructionReducer from "./slices/sentenceConstructionSlice";
import userReducer from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    sentenceConstruction: sentenceConstructionReducer,
    user: userReducer,
  },
});
