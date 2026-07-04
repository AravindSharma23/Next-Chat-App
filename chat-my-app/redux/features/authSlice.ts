import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/types";

type AuthState = {
  user: User | null;
  token: string | null;
};

const initialState: AuthState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;

      if (typeof window !== "undefined") {
        localStorage.setItem("chatverse_user", JSON.stringify(action.payload.user));
        localStorage.setItem("chatverse_token", action.payload.token);
      }
    },

    loadCredentials: (state) => {
      if (typeof window !== "undefined") {
        const user = localStorage.getItem("chatverse_user");
        const token = localStorage.getItem("chatverse_token");

        if (user && token) {
          state.user = JSON.parse(user);
          state.token = token;
        }
      }
    },

    logout: (state) => {
      state.user = null;
      state.token = null;

      if (typeof window !== "undefined") {
        localStorage.removeItem("chatverse_user");
        localStorage.removeItem("chatverse_token");
      }
    },
  },
});

export const { setCredentials, loadCredentials, logout } = authSlice.actions;
export default authSlice.reducer;